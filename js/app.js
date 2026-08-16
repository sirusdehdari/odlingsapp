const STORAGE_KEY = 'odling_state_v2';
const MONTH_LABELS = ['Apr–Maj', 'Jun', 'Jul', 'Aug', 'Sep–Okt', 'Nov–Mar'];
const MAINT_LABEL = { latt: 'Lättskött', medel: 'Medel', krav: 'Kräver omsorg' };
const ZONE_LABEL = { sol: '☀️ Bäst i full sol', skugga: '🌓 Klarar skugga bra', valfri: '➖ Spelar mindre roll' };
const MAINT_ICON = { latt: '🟢', medel: '🟡', krav: '🔴' };
const ZONE_ICON = { sol: '☀️', skugga: '🌓', valfri: '➖' };
const MAX_PLOT_DIM = 60;
const MAX_CROPS_PER_BOX = 4;

let state = loadState();
let plotZoom = 26; // px per grid cell, adjustable via +/- controls
let sunFilterOn = false; // toggles the sol/skugga map overlay
let expandingObjectId = null; // set while the next selection should be merged into an existing object instead of creating a new one

// v2: state = { plot: {width,height,latitude} | null, objects: [...], boxes: {...} }.
// No migration from the old box-list model - the user explicitly asked to
// start fresh, so an old save under the v1 key is simply never read again.
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.plot !== undefined) return parsed;
    }
  } catch (e) { /* fall through to defaults */ }
  return { plot: null, objects: [], boxes: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function ensureBoxEntry(boxId) {
  if (!state.boxes[boxId]) state.boxes[boxId] = { active: [], history: [] };
  return state.boxes[boxId];
}

function getBoxCrops(boxId) {
  return (state.boxes[boxId] && state.boxes[boxId].active) || [];
}

function getBoxHistory(boxId) {
  return (state.boxes[boxId] && state.boxes[boxId].history) || [];
}

// ---------- PLOT / GRID OBJECTS ----------

function findObjectAt(x, y) {
  return state.objects.find(o => o.cells.some(([cx, cy]) => cx === x && cy === y));
}

// Shortest distance (in meters, since 1 cell = 1m) between any cell of one
// object and any cell of another - the real-geometry replacement for the
// old manually-curated neighbor list.
function minDistanceBetweenObjects(objA, objB) {
  let min = Infinity;
  objA.cells.forEach(([ax, ay]) => {
    objB.cells.forEach(([bx, by]) => {
      const d = Math.hypot(ax - bx, ay - by);
      if (d < min) min = d;
    });
  });
  return min;
}

// ---------- SOL/SKUGGA (approximate) ----------
// Deliberately approximate, same philosophy as the growth-stage estimates:
// a handful of representative sun positions across the growing season
// rather than a continuous simulation, and no longitude/timezone handling
// at all (we only ever collect latitude) - "solar hour" below just means
// hours from solar noon, not real clock time. This is a seed-packet-level
// estimate, not a precise shading tool, and is presented to the user as such.

const SUN_SAMPLE_DATES = [
  { label: 'apr', doy: 105 },  // ~15 apr
  { label: 'maj', doy: 135 },  // ~15 maj
  { label: 'jun', doy: 166 },  // ~15 jun, nära midsommar
  { label: 'jul', doy: 196 },  // ~15 jul
  { label: 'aug', doy: 227 },  // ~15 aug
  { label: 'sep', doy: 258 },  // ~15 sep
];
const SUN_SAMPLE_HOURS = [8, 10, 12, 14, 16, 18]; // solar hours sampled per representative date
const BUSH_DEFAULT_HEIGHT_M = 1.2; // bushes don't collect a height from the user, unlike träd/byggnad/hack
const MIN_USEFUL_SUN_ELEVATION_DEG = 5; // below this the light is too grazing to matter for plants; sample is dropped, not counted as "shaded"
const SHADOW_RAY_HALFWIDTH_M = 0.75; // how close to an obstruction cell's shadow centerline still counts as "in shadow"

// Standard low-precision solar position formulas (declination via a single
// sine term, hour angle from solar time). Good enough at the "which corner
// of the garden gets more sun" level this feature targets.
function solarPosition(latDeg, doy, solarHour) {
  const lat = latDeg * Math.PI / 180;
  const decl = 23.45 * Math.PI / 180 * Math.sin(2 * Math.PI * (284 + doy) / 365);
  const hourAngle = (solarHour - 12) * 15 * Math.PI / 180;
  const sinElev = Math.sin(lat) * Math.sin(decl) + Math.cos(lat) * Math.cos(decl) * Math.cos(hourAngle);
  const elevation = Math.asin(Math.max(-1, Math.min(1, sinElev)));
  const cosElev = Math.cos(elevation);
  let azimuth = 0;
  if (cosElev > 0.0001) {
    let cosAz = (Math.sin(decl) - Math.sin(elevation) * Math.sin(lat)) / (cosElev * Math.cos(lat));
    cosAz = Math.max(-1, Math.min(1, cosAz));
    azimuth = Math.acos(cosAz); // 0..180, measured from north
    if (hourAngle > 0) azimuth = 2 * Math.PI - azimuth; // afternoon: mirror to the west side
  }
  return { elevationDeg: elevation * 180 / Math.PI, azimuthDeg: azimuth * 180 / Math.PI };
}

function daylightHoursEstimate(latDeg, doy) {
  const lat = latDeg * Math.PI / 180;
  const decl = 23.45 * Math.PI / 180 * Math.sin(2 * Math.PI * (284 + doy) / 365);
  const cosH0 = Math.max(-1, Math.min(1, -Math.tan(lat) * Math.tan(decl)));
  return 2 * Math.acos(cosH0) * 180 / Math.PI / 15;
}

// Approximates each obstruction cell as a point casting a straight shadow
// ray (length = height / tan(elevation)) away from the sun; a target cell
// counts as shaded if it falls within a narrow band around that ray. Crude,
// but avoids full canopy/polygon modeling for a feature that's already an estimate.
function isCellShadowedByPoint(tx, ty, ox, oy, heightM, elevationDeg, azimuthDeg) {
  const shadowLen = heightM / Math.tan(elevationDeg * Math.PI / 180);
  const shadowAz = (azimuthDeg + 180) % 360;
  const rad = shadowAz * Math.PI / 180;
  const dirY = Math.cos(rad); // north component
  const dirX = Math.sin(rad); // east component
  const vx = tx - ox, vy = ty - oy;
  const along = vx * dirX + vy * dirY;
  if (along <= 0 || along > shadowLen) return false;
  const perpX = vx - along * dirX, perpY = vy - along * dirY;
  return Math.hypot(perpX, perpY) <= SHADOW_RAY_HALFWIDTH_M;
}

function shadowCastingObjects() {
  return state.objects
    .filter(o => o.type === 'trad' || o.type === 'byggnad' || o.type === 'hack' || o.type === 'buske')
    .map(o => ({ cells: o.cells, height: o.type === 'buske' ? BUSH_DEFAULT_HEIGHT_M : (o.height ?? 3) }));
}

function usefulSunSamples(latitude) {
  const samples = [];
  SUN_SAMPLE_DATES.forEach(d => {
    SUN_SAMPLE_HOURS.forEach(h => {
      const pos = solarPosition(latitude, d.doy, h);
      if (pos.elevationDeg > MIN_USEFUL_SUN_ELEVATION_DEG) samples.push(pos);
    });
  });
  return samples;
}

function averageSeasonDaylightHours(latitude) {
  return SUN_SAMPLE_DATES.reduce((sum, d) => sum + daylightHoursEstimate(latitude, d.doy), 0) / SUN_SAMPLE_DATES.length;
}

function sunBucketFor(litFraction) {
  if (litFraction >= 0.7) return 'sol';
  if (litFraction >= 0.3) return 'halvskugga';
  return 'skugga';
}

// Per-cell sun estimate for a specific set of cells (e.g. one box's footprint) -
// much cheaper than computing the whole grid when only one object's info is needed.
function sunInfoForCells(cells) {
  if (!state.plot || !cells.length) return null;
  const samples = usefulSunSamples(state.plot.latitude);
  const obstructions = shadowCastingObjects();
  if (!samples.length) return { litFraction: 0, approxHours: 0, bucket: 'skugga' };
  let litCount = 0;
  cells.forEach(([x, y]) => {
    samples.forEach(s => {
      const shaded = obstructions.some(obj => obj.cells.some(([ox, oy]) =>
        !(ox === x && oy === y) && isCellShadowedByPoint(x, y, ox, oy, obj.height, s.elevationDeg, s.azimuthDeg)
      ));
      if (!shaded) litCount++;
    });
  });
  const litFraction = litCount / (samples.length * cells.length);
  const avgDayLength = averageSeasonDaylightHours(state.plot.latitude);
  return {
    litFraction,
    approxHours: Math.round(litFraction * avgDayLength * 2) / 2,
    bucket: sunBucketFor(litFraction)
  };
}

const SUN_BUCKET_LABEL = { sol: 'Full sol', halvskugga: 'Halvskugga', skugga: 'Skugga' };

function sunBadgeText(cells) {
  const info = sunInfoForCells(cells);
  if (!info) return '';
  return `☀️ ~${info.approxHours}h sol/dag · ${SUN_BUCKET_LABEL[info.bucket]} (uppskattning)`;
}

// Whole-grid version for the map filter - computed lazily (only when the
// filter is toggled on), not on every render, since it's O(cells x samples x obstructions).
function computeSunMap() {
  const { width, height, latitude } = state.plot;
  const samples = usefulSunSamples(latitude);
  const obstructions = shadowCastingObjects();
  const avgDayLength = averageSeasonDaylightHours(latitude);
  const map = {};
  for (let y = 1; y <= height; y++) {
    for (let x = 1; x <= width; x++) {
      let litCount = 0;
      if (samples.length) {
        samples.forEach(s => {
          const shaded = obstructions.some(obj => obj.cells.some(([ox, oy]) =>
            !(ox === x && oy === y) && isCellShadowedByPoint(x, y, ox, oy, obj.height, s.elevationDeg, s.azimuthDeg)
          ));
          if (!shaded) litCount++;
        });
      }
      const litFraction = samples.length ? litCount / samples.length : 0;
      map[`${x},${y}`] = {
        litFraction,
        approxHours: Math.round(litFraction * avgDayLength * 2) / 2,
        bucket: sunBucketFor(litFraction)
      };
    }
  }
  return map;
}

function addObject(type, cells, props) {
  const id = `obj-${Date.now()}`;
  state.objects.push({ id, type, cells, ...props });
  if (type === 'box') ensureBoxEntry(id);
  saveState();
  return id;
}

function updateObjectInPlace(objectId, type, props) {
  const obj = state.objects.find(o => o.id === objectId);
  if (!obj) return;
  obj.type = type;
  Object.keys(obj).forEach(k => { if (!['id', 'type', 'cells'].includes(k)) delete obj[k]; });
  Object.assign(obj, props);
  if (type === 'box') ensureBoxEntry(objectId);
  saveState();
}

// Detaches a single cell from a multi-cell object, leaving the rest of its
// footprint (and, for boxes, all crop/history data) untouched. Only asks
// for confirmation when this would delete a box's last cell, since that
// destroys real crop history - every other object type is low-stakes.
function removeCellFromObject(objectId, x, y) {
  const obj = state.objects.find(o => o.id === objectId);
  if (!obj) return;
  if (obj.cells.length <= 1 && obj.type === 'box' && !confirm('Ta bort den här lådan? Det här går inte att ångra.')) return;
  obj.cells = obj.cells.filter(([cx, cy]) => !(cx === x && cy === y));
  if (obj.cells.length === 0) {
    state.objects = state.objects.filter(o => o.id !== objectId);
    if (obj.type === 'box') delete state.boxes[objectId];
  }
  saveState();
  closeModal();
  render();
}

function removeWholeObject(objectId) {
  const obj = state.objects.find(o => o.id === objectId);
  if (!obj) return;
  if (obj.type === 'box' && !confirm('Ta bort den här lådan? Det här går inte att ångra.')) return;
  state.objects = state.objects.filter(o => o.id !== objectId);
  if (obj.type === 'box') delete state.boxes[objectId];
  saveState();
  closeModal();
  render();
}

// Returns which perioder-index (0-5, matching MONTH_LABELS) today falls into.
// Written as explicit month checks (not modulo math) so the Nov–Mar
// year-boundary case can't accidentally be miscalculated.
function currentPeriodIndex(date = new Date()) {
  const m = date.getMonth(); // 0 = jan … 11 = dec
  if (m === 3 || m === 4) return 0;  // apr, maj
  if (m === 5) return 1;             // jun
  if (m === 6) return 2;             // jul
  if (m === 7) return 3;             // aug
  if (m === 8 || m === 9) return 4;  // sep, okt
  return 5;                          // nov, dec, jan, feb, mar
}

const FAMILY_LABEL = {
  kal: 'Kålväxter', lok: 'Lökväxter', baljvaxt: 'Baljväxter',
  nattskatta: 'Potatis-/nattskatteväxter', gurkvaxt: 'Gurkväxter',
  flockblommig: 'Flockblommiga växter', korgblommig: 'Korgblommiga växter',
  spenatvaxt: 'Spenatväxter', kransblommig: 'Kransblommiga växter (mynta-familjen)'
};
const FEEDER_LABEL = {
  heavy: '🔴 Tär mycket på jorden – behöver återhämtning innan samma familj planteras igen på samma ställe.',
  light: '🟡 Tär måttligt på jorden.',
  builder: '🟢 Bygger upp jorden (kvävefixerande) – bra föregångare till näringskrävande grödor.'
};

// How good a candidate crop is as a follow-up to whatever a box's soil just
// grew, based on plant family (avoid repeating) and feeder type (heavy
// feeders want to be followed by something gentler or soil-building).
// Companion-planting data is deliberately not reused here - that's about
// what grows well *alongside* something, not what should follow it later.
const FEEDER_FOLLOWUP_SCORE = {
  builder: { heavy: 2, light: 1, builder: 0 },
  heavy: { builder: 2, light: 1, heavy: -1 },
  light: { builder: 1, heavy: 0, light: 0 }
};
const ROTATION_RECOMMEND_THRESHOLD = 2;
const MAX_ROTATION_RECOMMENDATIONS = 3;

function rotationScore(prevCrop, candidate) {
  if (candidate.family && prevCrop.family && candidate.family === prevCrop.family) return -99;
  const table = FEEDER_FOLLOWUP_SCORE[prevCrop.feederType] || {};
  return table[candidate.feederType] ?? 0;
}

// Only returns crops that are meaningfully better than "grow whatever" -
// if nothing clears the bar, returns an empty list rather than padding it
// out with lukewarm options. No zone filter for now: boxes don't carry a
// sun-exposure estimate yet (that lands once the sun/shadow calculation
// phase ships), so every crop is a candidate regardless of zone.
function computeRecommendations(boxId) {
  const history = getBoxHistory(boxId);
  if (!history.length) return [];
  const lastCropId = history[history.length - 1].cropId;
  const prevCrop = CROPS[lastCropId];
  if (!prevCrop) return [];

  const scored = Object.entries(CROPS)
    .filter(([id]) => id !== lastCropId)
    .map(([id, c]) => ({ id, crop: c, score: rotationScore(prevCrop, c) }))
    .filter(s => s.score >= ROTATION_RECOMMEND_THRESHOLD)
    .sort((a, b) => b.score - a.score || a.crop.name.localeCompare(b.crop.name, 'sv'));

  if (!scored.length) return [];
  const topScore = scored[0].score;
  return scored.filter(s => s.score === topScore).slice(0, MAX_ROTATION_RECOMMENDATIONS);
}

const MONTH_SHORT_SV = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'];
function formatDateSv(date) {
  return `${date.getDate()} ${MONTH_SHORT_SV[date.getMonth()]}`;
}

function parseDate(dateStr) {
  return new Date(dateStr + 'T00:00:00');
}

function daysBetween(d1, d2) {
  const utc1 = Date.UTC(d1.getFullYear(), d1.getMonth(), d1.getDate());
  const utc2 = Date.UTC(d2.getFullYear(), d2.getMonth(), d2.getDate());
  return Math.round((utc2 - utc1) / 86400000);
}

// [month(0-indexed), day] of the last day of each perioder slot (matches MONTH_LABELS).
const PERIOD_END_MONTH_DAY = [[4, 31], [5, 30], [6, 31], [7, 31], [9, 31], [2, 31]];

// End date of the perioder slot that `referenceDate` falls into. The Nov–Mar
// slot (index 5) ends the following calendar year when referenceDate is in
// Nov/Dec, and the same year when referenceDate is already in Jan/Feb/Mar.
function periodEndDate(periodIdx, referenceDate) {
  const [month, day] = PERIOD_END_MONTH_DAY[periodIdx];
  let year = referenceDate.getFullYear();
  if (periodIdx === 5 && referenceDate.getMonth() >= 10) year += 1;
  return new Date(year, month, day);
}

const SOW_LATE_WARNING_DAYS = 10;

// Warns when a crop was sown close to the end of its recommended sowing
// window - only fires for periods actually labeled as a sowing action.
function checkSowingLateness(crop, plantedDateStr) {
  if (!plantedDateStr) return null;
  const plantedDate = parseDate(plantedDateStr);
  const idx = currentPeriodIndex(plantedDate);
  const status = crop.perioder[idx];
  if (!['så', 'så-skörda'].includes(status.cls)) return null;
  const daysLeft = daysBetween(plantedDate, periodEndDate(idx, plantedDate));
  if (daysLeft >= 0 && daysLeft < SOW_LATE_WARNING_DAYS) {
    return `${crop.name} såddes ${formatDateSv(plantedDate)}, bara ${daysLeft} dagar innan såperioden tar slut – kan vara i senaste laget.`;
  }
  return null;
}

// Where a planting stands relative to its approximate germinate/harvest
// windows. Ranges, not exact predictions - real growth time varies a lot.
// boxZone is currently always null (no automated sun-exposure estimate
// yet), so no shade buffer is applied - that returns once the sun/shadow
// calculation phase ships and can tell us how sunny a box's cells actually are.
function computeStage(crop, plantedDateStr, boxZone) {
  if (!plantedDateStr || !crop.growth) return null;
  const daysSince = daysBetween(parseDate(plantedDateStr), new Date());
  const buffer = boxZone === 'skugga' ? 1.15 : 1;
  const g = crop.growth;
  if (g.germinateDays && daysSince < g.germinateDays[0] * buffer) {
    return { label: 'Gror', cls: 'så' };
  }
  const harvestMin = g.harvestDays[0] * buffer;
  const harvestMax = g.harvestDays[1] * buffer;
  if (daysSince < harvestMin) return { label: 'Växer', cls: 'vårda' };
  if (daysSince <= harvestMax) return { label: 'Redo att skörda', cls: 'skörda' };
  return { label: 'Försenad – kolla den', cls: 'overdue' };
}

// Builds and wires up the "vad odlas här" picker. Saved crops show as a
// compact line (name + planting date + growth stage) with harvest/edit/
// remove icons; only a freshly-added or edited row shows the crop <select> +
// date input pair, confirmed with a ✓ button (two fields need to be set
// together, so there's no single "change" event to auto-commit on).
// Up to MAX_CROPS_PER_BOX crops. boxZone feeds the stage estimate.
// Marking something harvested is deferred to the outer Spara button, same
// as every other change here - clicking the basket icon just flags the row
// (with an Ångra/undo option) rather than writing to state immediately.
function wireCropPicker(rowsContainerId, addBtnId, initialEntries, boxZone, onChange) {
  const rowsContainer = document.getElementById(rowsContainerId);
  const addBtn = document.getElementById(addBtnId);

  function currentEntries() {
    return Array.from(rowsContainer.children)
      .filter(row => row.dataset.cropId)
      .map(row => ({ cropId: row.dataset.cropId, plantedDate: row.dataset.plantedDate || null }));
  }

  function pendingHarvests() {
    return Array.from(rowsContainer.children)
      .filter(row => row.dataset.harvestCropId)
      .map(row => ({
        cropId: row.dataset.harvestCropId,
        plantedDate: row.dataset.harvestPlantedDate || null,
        note: row.querySelector('.crop-row-harvest-note')?.value.trim() || ''
      }));
  }

  function refreshAll() {
    addBtn.style.display = rowsContainer.children.length >= MAX_CROPS_PER_BOX ? 'none' : '';
    if (onChange) onChange();
  }

  function renderRowDisplay(row, cropId, plantedDate) {
    const crop = CROPS[cropId];
    row.dataset.cropId = cropId;
    row.dataset.plantedDate = plantedDate || '';
    row.dataset.harvestCropId = '';
    row.dataset.harvestPlantedDate = '';
    const stage = computeStage(crop, plantedDate, boxZone);
    const dateLabel = plantedDate ? `Planterad ${formatDateSv(parseDate(plantedDate))}` : 'Inget datum registrerat';
    row.innerHTML = `
      <div class="crop-row-main">
        <button type="button" class="crop-row-name">${crop.name}</button>
        <div class="crop-row-meta">${dateLabel}${stage ? ` · <span class="status-pill ${stage.cls}">${stage.label}</span>` : ''}</div>
      </div>
      <button type="button" class="crop-row-harvest" title="Markera som skördad">🧺</button>
      <button type="button" class="crop-row-edit" title="Ändra">✎</button>
      <button type="button" class="crop-row-remove" title="Ta bort">✕</button>
    `;
    row.querySelector('.crop-row-name').addEventListener('click', () => openCropModal(cropId));
    row.querySelector('.crop-row-edit').addEventListener('click', () => renderRowEdit(row, cropId, plantedDate));
    row.querySelector('.crop-row-remove').addEventListener('click', () => {
      row.remove();
      refreshAll();
    });
    row.querySelector('.crop-row-harvest').addEventListener('click', () => renderRowPendingHarvest(row, cropId, plantedDate));
  }

  function renderRowPendingHarvest(row, cropId, plantedDate) {
    const crop = CROPS[cropId];
    row.dataset.cropId = '';
    row.dataset.harvestCropId = cropId;
    row.dataset.harvestPlantedDate = plantedDate || '';
    row.className = 'crop-picker-row crop-picker-row-pending';
    row.innerHTML = `
      <div class="crop-row-main">
        <div class="crop-row-pending-label">${crop.name} – markeras som skördad när du sparar</div>
        <input type="text" class="crop-row-harvest-note" placeholder="Kommentar, t.ex. hur skörden gick (valfritt)">
      </div>
      <button type="button" class="crop-row-undo-harvest">↩ Ångra</button>
    `;
    row.querySelector('.crop-row-undo-harvest').addEventListener('click', () => {
      row.className = 'crop-picker-row';
      renderRowDisplay(row, cropId, plantedDate);
      refreshAll();
    });
  }

  function renderRowEdit(row, currentCropId, currentPlantedDate) {
    row.dataset.cropId = '';
    const selected = currentEntries().map(e => e.cropId);
    const options = Object.entries(CROPS)
      .filter(([id]) => id === currentCropId || !selected.includes(id))
      .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'))
      .map(([id, c]) => `<option value="${id}" ${id === currentCropId ? 'selected' : ''}>${c.name}</option>`)
      .join('');
    const dateVal = currentPlantedDate || todayStr();
    row.innerHTML = `
      <select class="crop-picker crop-row-select"><option value="">— Välj gröda —</option>${options}</select>
      <input type="date" class="crop-row-date" value="${dateVal}">
      <button type="button" class="crop-row-confirm" title="Klar">✓</button>
    `;
    row.querySelector('.crop-row-confirm').addEventListener('click', () => {
      const cropId = row.querySelector('.crop-row-select').value;
      const dateVal2 = row.querySelector('.crop-row-date').value;
      if (!cropId) { row.remove(); refreshAll(); return; }
      renderRowDisplay(row, cropId, dateVal2 || todayStr());
      refreshAll();
    });
  }

  function addRow(entry) {
    const row = document.createElement('div');
    row.className = 'crop-picker-row';
    rowsContainer.appendChild(row);
    if (entry && entry.cropId) renderRowDisplay(row, entry.cropId, entry.plantedDate);
    else renderRowEdit(row, '', '');
    refreshAll();
  }

  initialEntries.forEach(addRow);
  addBtn.addEventListener('click', () => {
    if (rowsContainer.children.length < MAX_CROPS_PER_BOX) addRow(null);
  });
  refreshAll();

  // Used by the rotation-recommendation ✓ buttons: adds a crop already in
  // display mode (planted today) without the user going through the
  // select + confirm steps themselves.
  function addCropDirectly(cropId) {
    if (rowsContainer.children.length >= MAX_CROPS_PER_BOX) return;
    if (currentEntries().some(e => e.cropId === cropId)) return;
    addRow({ cropId, plantedDate: todayStr() });
  }

  return { getSelectedIds: currentEntries, addCropDirectly, getPendingHarvests: pendingHarvests };
}

function isModalOpen() {
  return document.getElementById('modal-overlay').classList.contains('open');
}

function refreshFromExternalChange() {
  state = loadState();
  if (isModalOpen()) closeModal();
  render();
}

// ---------- BACKUP / ÅTERSTÄLLNING ----------

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

async function exportData() {
  const dataStr = JSON.stringify(state, null, 2);
  const filename = `odlingsapp-backup-${todayStr()}.json`;
  const blob = new Blob([dataStr], { type: 'application/json' });

  if (navigator.canShare) {
    try {
      const file = new File([blob], filename, { type: 'application/json' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Odlingsapp – backup' });
        return;
      }
    } catch (e) { /* user cancelled or share failed – fall back to download */ }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importDataFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (parsed.plot === undefined || !parsed.objects || !parsed.boxes) throw new Error('Ogiltigt format');
      state = parsed;
      saveState();
      render();
      alert('Data återställd!');
    } catch (e) {
      alert('Kunde inte läsa filen – är det en giltig backup-fil från appen?');
    }
  };
  reader.readAsText(file);
}

// ---------- NAVIGATION ----------

const VIEWS = ['hem', 'tomt', 'grodor', 'barbuskar', 'dagbok', 'vader'];
let currentView = 'hem';

function goTo(view) {
  currentView = view;
  render();
  window.scrollTo(0, 0);
}

function render() {
  document.querySelectorAll('.tabbar button').forEach(b => {
    b.classList.toggle('active', b.dataset.view === currentView);
  });
  const el = document.getElementById('view');
  if (currentView === 'hem') el.innerHTML = renderHem();
  else if (currentView === 'tomt') el.innerHTML = renderTomt();
  else if (currentView === 'grodor') el.innerHTML = renderGrodor();
  else if (currentView === 'barbuskar') el.innerHTML = renderBarbuskar();
  else if (currentView === 'dagbok') el.innerHTML = renderDagbok();
  else if (currentView === 'vader') el.innerHTML = renderComingSoon('Väder', 'Väderprognos och odlingsråd baserat på din plats kommer i nästa version.');
  attachViewHandlers();
  wirePlotGrid();
}

function renderComingSoon(title, text) {
  return `<h2>${title}</h2><div class="empty-state">🚧 ${text}</div>`;
}

// ---------- DAGBOK / HISTORIK ----------
// Shared by the Dagbok tab (whole-garden feed) and a single box's "Historik"
// button (same underlying per-box history, just filtered) - one source of
// data, two views onto it.

function historyEntriesForDisplay(filterBoxId) {
  const boxObjects = state.objects.filter(o => o.type === 'box' && (!filterBoxId || o.id === filterBoxId));
  const entries = boxObjects.flatMap(box =>
    getBoxHistory(box.id).map((h, idx) => ({ ...h, boxId: box.id, boxName: box.name, historyIdx: idx }))
  );
  entries.sort((a, b) => (b.harvestedDate || '').localeCompare(a.harvestedDate || ''));
  return entries;
}

function renderHistoryRows(entries, showBoxName) {
  if (!entries.length) return '<div class="empty-state">Inget skördat än.</div>';
  return entries.map(e => {
    const crop = CROPS[e.cropId];
    const plantedLabel = e.plantedDate ? formatDateSv(parseDate(e.plantedDate)) : 'okänt datum';
    const harvestedLabel = e.harvestedDate ? formatDateSv(parseDate(e.harvestedDate)) : 'okänt datum';
    return `
      <div class="history-row">
        <div class="history-row-top">
          <button type="button" class="history-crop-name" data-crop="${e.cropId}">${crop ? crop.name : e.cropId}</button>
          ${showBoxName ? `<span class="history-box-name">${e.boxName}</span>` : ''}
        </div>
        <div class="history-dates">${plantedLabel} → ${harvestedLabel}</div>
        <textarea class="history-note" data-box-id="${e.boxId}" data-history-idx="${e.historyIdx}" placeholder="Kommentar (valfritt)">${e.note || ''}</textarea>
      </div>
    `;
  }).join('');
}

function wireHistoryRowHandlers(container) {
  container.querySelectorAll('.history-crop-name[data-crop]').forEach(el => {
    el.addEventListener('click', () => openCropModal(el.dataset.crop));
  });
  container.querySelectorAll('.history-note').forEach(el => {
    el.addEventListener('blur', () => {
      const boxEntry = ensureBoxEntry(el.dataset.boxId);
      const idx = Number(el.dataset.historyIdx);
      if (boxEntry.history[idx]) {
        boxEntry.history[idx].note = el.value.trim();
        saveState();
      }
    });
  });
}

function renderDagbok() {
  const entries = historyEntriesForDisplay(null);
  return `
    <h2>Dagbok</h2>
    <p style="font-size:0.85rem;color:var(--muted);margin-bottom:16px">Allt du skördat, över hela trädgården.</p>
    ${renderHistoryRows(entries, true)}
  `;
}

function openBoxHistory(boxId) {
  const box = state.objects.find(o => o.id === boxId);
  if (!box) return;
  const entries = historyEntriesForDisplay(boxId);
  const html = `
    <p class="modal-title">Historik – ${box.name}</p>
    <button type="button" class="chip" id="history-back-btn" style="margin-bottom:14px">← Tillbaka</button>
    ${renderHistoryRows(entries, false)}
  `;
  document.getElementById('modal-content').innerHTML = html;
  wireHistoryRowHandlers(document.getElementById('modal-content'));
  document.getElementById('history-back-btn').addEventListener('click', () => openBoxEditor(boxId));
}

// ---------- HEM ----------

function renderHem() {
  const assigned = Object.values(state.boxes).filter(entry => entry.active && entry.active.length > 0);
  const totalBoxes = state.objects.filter(o => o.type === 'box').length;
  return `
    <h2>Hem</h2>
    <div class="card">
      <div class="section-title" style="margin-top:0">Just nu</div>
      <p style="font-size:0.9rem;line-height:1.6">
        ${assigned.length} av ${totalBoxes} lådor har en gröda tilldelad.
        ${assigned.length === 0 ? 'Gå till <b>Tomt</b> för att komma igång.' : 'Se detaljer under <b>Tomt</b>.'}
      </p>
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Säkerhetskopiera</div>
      <p style="font-size:0.85rem;color:var(--muted);line-height:1.6;margin-bottom:12px">
        All data sparas lokalt på den här telefonen. Exportera en backup-fil då och då som extra trygghet.
      </p>
      <div style="display:flex;gap:8px">
        <button class="chip active" id="export-btn" style="flex:1;padding:10px;font-size:0.85rem">Exportera</button>
        <button class="chip" id="import-btn" style="flex:1;padding:10px;font-size:0.85rem">Importera</button>
      </div>
      <input type="file" id="import-file-input" accept="application/json" style="display:none">
    </div>
    <div class="card">
      <div class="section-title" style="margin-top:0">Kommer snart</div>
      <p style="font-size:0.85rem;color:var(--muted);line-height:1.6">
        Den här vyn kommer visa veckans att-göra (vattna, gödsla, skörda) baserat på vad du loggat och dagens datum, plus väderprognos.
      </p>
    </div>
  `;
}

// ---------- TOMT (plot map) ----------

function renderTomt() {
  if (!state.plot || !state.plot.width) return renderPlotSetup();
  return renderPlotGrid();
}

// Shared between the initial plot setup and the later "Ändra mått" modal -
// both just need a button that fills in whichever latitude <input> is given.
function geoLocationButtonHtml(btnId, statusId) {
  return `
    <button type="button" class="chip" id="${btnId}" style="width:100%;padding:8px;font-size:0.8rem">📍 Använd min plats</button>
    <p id="${statusId}" style="font-size:0.72rem;color:var(--muted);margin:4px 0 0"></p>
  `;
}

// Geolocation only gives us latitude (we never collect/use longitude - see
// the sol/skugga section for why). Falls back to whatever the user types
// manually if permission is denied, the API is missing, or it times out.
function wireGeoLocationButton(btnId, latInputId, statusId) {
  const btn = document.getElementById(btnId);
  if (!btn) return;
  const status = document.getElementById(statusId);
  if (!navigator.geolocation) {
    btn.disabled = true;
    btn.textContent = '📍 Platsåtkomst stöds inte i denna webbläsare';
    return;
  }
  btn.addEventListener('click', () => {
    btn.disabled = true;
    btn.textContent = '📍 Hämtar plats...';
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        document.getElementById(latInputId).value = pos.coords.latitude.toFixed(1);
        if (status) status.textContent = '✓ Plats hittad och ifylld.';
        btn.disabled = false;
        btn.textContent = '📍 Använd min plats igen';
      },
      () => {
        if (status) status.textContent = 'Kunde inte hämta plats - skriv in latitud manuellt ovan istället.';
        btn.disabled = false;
        btn.textContent = '📍 Försök igen';
      },
      { timeout: 10000 }
    );
  });
}

function renderPlotSetup() {
  return `
    <h2>Sätt upp din tomt</h2>
    <div class="card">
      <p style="font-size:0.85rem;color:var(--muted);line-height:1.6;margin-bottom:14px">
        Ange tomtens ungefärliga mått i meter. X är bredd (väster → öster), Y är djup (söder → norr). Varje ruta blir 1×1 meter.
      </p>
      <p class="modal-section-title">Bredd, X-led (m)</p>
      <input type="number" id="plot-width-input" min="1" max="${MAX_PLOT_DIM}" value="20" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem;margin-bottom:12px">
      <p class="modal-section-title">Djup, Y-led (m)</p>
      <input type="number" id="plot-height-input" min="1" max="${MAX_PLOT_DIM}" value="20" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem;margin-bottom:12px">
      <p class="modal-section-title">Ungefärlig latitud (grader nord)</p>
      <p style="font-size:0.78rem;color:var(--muted);margin-bottom:6px">Används längre fram för att räkna ut sol/skugga. Standardvärdet är Stockholm - ändra det om du bor någon annanstans, eller använd knappen nedan.</p>
      <input type="number" id="plot-lat-input" step="0.1" value="59.3" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem;margin-bottom:8px">
      ${geoLocationButtonHtml('plot-lat-geo-btn', 'plot-lat-geo-status')}
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem;margin-top:16px" id="plot-setup-btn">Skapa karta</button>
    </div>
  `;
}

// Lets an already-set-up plot's dimensions/latitude be corrected later (e.g.
// a typo on first setup) without forcing a full "rensa tomten" first. Cells
// that fall outside the new, smaller bounds are clipped from each object
// (or the whole object dropped if nothing is left) - mirrors the same
// partial-removal philosophy as removeCellFromObject, applied in bulk.
function openPlotResizeModal() {
  const { width, height, latitude } = state.plot;
  const html = `
    <p class="modal-title">Ändra tomtens mått</p>
    <p class="modal-sub" style="font-size:0.85rem;color:var(--muted);line-height:1.6">
      Om du gör tomten mindre kan objekt som hamnar utanför de nya måtten krympa eller försvinna helt.
    </p>
    <div class="modal-section">
      <p class="modal-section-title">Bredd, X-led (m)</p>
      <input type="number" id="plot-resize-width-input" min="1" max="${MAX_PLOT_DIM}" value="${width}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem;margin-bottom:12px">
      <p class="modal-section-title">Djup, Y-led (m)</p>
      <input type="number" id="plot-resize-height-input" min="1" max="${MAX_PLOT_DIM}" value="${height}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem;margin-bottom:12px">
      <p class="modal-section-title">Ungefärlig latitud (grader nord)</p>
      <input type="number" id="plot-resize-lat-input" step="0.1" value="${latitude}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem;margin-bottom:8px">
      ${geoLocationButtonHtml('plot-resize-lat-geo-btn', 'plot-resize-lat-geo-status')}
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem;margin-top:16px" id="plot-resize-confirm-btn">Spara nya mått</button>
    </div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  wireGeoLocationButton('plot-resize-lat-geo-btn', 'plot-resize-lat-input', 'plot-resize-lat-geo-status');

  document.getElementById('plot-resize-confirm-btn').addEventListener('click', () => {
    const w = Math.max(1, Math.min(MAX_PLOT_DIM, Math.round(Number(document.getElementById('plot-resize-width-input').value)) || 0));
    const h = Math.max(1, Math.min(MAX_PLOT_DIM, Math.round(Number(document.getElementById('plot-resize-height-input').value)) || 0));
    const lat = Number(document.getElementById('plot-resize-lat-input').value) || 59.3;
    if (!w || !h) { alert('Ange giltiga mått.'); return; }

    const impacted = state.objects
      .map(obj => ({ obj, newCells: obj.cells.filter(([x, y]) => x <= w && y <= h) }))
      .filter(({ obj, newCells }) => newCells.length < obj.cells.length);

    if (impacted.length) {
      const removedBoxes = impacted.filter(({ obj, newCells }) => newCells.length === 0 && obj.type === 'box').length;
      const removedOthers = impacted.filter(({ obj, newCells }) => newCells.length === 0 && obj.type !== 'box').length;
      const shrunk = impacted.filter(({ newCells }) => newCells.length > 0).length;
      const parts = [];
      if (removedBoxes) parts.push(`${removedBoxes} låda/lådor tas bort helt (inklusive skörd-historik)`);
      if (removedOthers) parts.push(`${removedOthers} annat objekt tas bort helt`);
      if (shrunk) parts.push(`${shrunk} objekt krymper`);
      if (!confirm(`De nya måtten är mindre på ett sätt som påverkar det du redan placerat: ${parts.join(', ')}. Fortsätta?`)) return;
    }

    impacted.forEach(({ obj, newCells }) => {
      if (newCells.length === 0) {
        state.objects = state.objects.filter(o => o.id !== obj.id);
        if (obj.type === 'box') delete state.boxes[obj.id];
      } else {
        obj.cells = newCells;
      }
    });

    state.plot = { width: w, height: h, latitude: lat };
    saveState();
    closeModal();
    render();
  });
}

const TREE_ICON = {
  appel: '🍎', paron: '🍐', plommon: '🍑', korsbar: '🍒', krikon: '🍇',
  bjork: '🌳', gran: '🌲', tall: '🌲', lonn: '🍁', ek: '🌳', valnot: '🌰', ovrigt: '🌳'
};

function objectIcon(obj) {
  if (obj.type === 'trad') return TREE_ICON[obj.species] || '🌳';
  return (OBJECT_TYPE_LABELS[obj.type] || '').split(' ')[0];
}

// The cell of an object's own footprint closest to its centroid, so the
// single icon lands on real ground rather than an empty gap in an L-shape.
function objectIconCellKey(obj) {
  const avgX = obj.cells.reduce((s, [x]) => s + x, 0) / obj.cells.length;
  const avgY = obj.cells.reduce((s, [, y]) => s + y, 0) / obj.cells.length;
  let best = obj.cells[0], bestDist = Infinity;
  obj.cells.forEach(([x, y]) => {
    const d = (x - avgX) ** 2 + (y - avgY) ** 2;
    if (d < bestDist) { bestDist = d; best = [x, y]; }
  });
  return `${best[0]},${best[1]}`;
}

// Borders only on edges where the neighboring cell belongs to a *different*
// object (or nothing) - this is what makes a multi-cell object read as one
// contiguous shape with an outline, instead of a checkerboard of same-color tiles.
function edgeClasses(x, y, obj) {
  if (!obj || obj.type === 'gras') return '';
  const sameObjAt = (nx, ny) => obj.cells.some(([cx, cy]) => cx === nx && cy === ny);
  const classes = [];
  if (!sameObjAt(x, y + 1)) classes.push('plot-edge-n');
  if (!sameObjAt(x, y - 1)) classes.push('plot-edge-s');
  if (!sameObjAt(x - 1, y)) classes.push('plot-edge-w');
  if (!sameObjAt(x + 1, y)) classes.push('plot-edge-e');
  return classes.join(' ');
}

// Icon placement differs by type: träd/buske are organic ground cover, so
// every one of their cells repeats the icon (reads as "this whole area is
// canopy/foliage"). Byggnad gets no icon at all - the walls/roof styling
// carry it instead. Everything else (box, sten, grusgang, hack) gets a
// single icon on the cell nearest the footprint's centroid.
function iconModeFor(type) {
  if (type === 'trad' || type === 'buske') return 'every';
  if (type === 'byggnad') return 'none';
  return 'center';
}

function expandLabelForObject(objectId) {
  const obj = state.objects.find(o => o.id === objectId);
  if (!obj) return '';
  return obj.type === 'box' ? obj.name : (OBJECT_TYPE_LABELS[obj.type] || obj.type);
}

function renderPlotGrid() {
  const { width, height } = state.plot;
  const iconCellByObjId = {};
  state.objects.forEach(o => {
    if (iconModeFor(o.type) === 'center') iconCellByObjId[o.id] = objectIconCellKey(o);
  });
  const sunMap = sunFilterOn ? computeSunMap() : null;

  let cellsHtml = '';
  for (let y = height; y >= 1; y--) {
    for (let x = 1; x <= width; x++) {
      const obj = findObjectAt(x, y);
      const typeClass = `plot-cell-${obj ? obj.type : 'gras'}`;
      const edges = edgeClasses(x, y, obj);
      let icon = '';
      if (obj) {
        const mode = iconModeFor(obj.type);
        if (mode === 'every') icon = objectIcon(obj);
        else if (mode === 'center' && iconCellByObjId[obj.id] === `${x},${y}`) icon = objectIcon(obj);
      }
      const roofClass = (obj && obj.type === 'byggnad' && edges) ? 'plot-cell-roof-edge' : '';
      const sunAttr = sunMap ? ` data-sun="${sunMap[`${x},${y}`].bucket}"` : '';
      cellsHtml += `<div class="plot-cell ${typeClass} ${edges} ${roofClass}" data-x="${x}" data-y="${y}"${sunAttr}>${icon}</div>`;
    }
  }
  return `
    <div class="plot-toolbar">
      <h2 style="margin:0">Tomt</h2>
      <div class="plot-zoom-controls">
        <button type="button" class="chip" id="plot-zoom-out">−</button>
        <button type="button" class="chip" id="plot-zoom-in">+</button>
        <button type="button" class="chip ${sunFilterOn ? 'active' : ''}" id="plot-sun-toggle-btn">☀️ Sol/skugga</button>
        <button type="button" class="chip" id="plot-resize-btn">⚙️ Ändra mått</button>
        <button type="button" class="chip" id="plot-clear-btn">🗑️ Rensa tomten</button>
      </div>
    </div>
    <p class="plot-compass-line">🧭 N (upp) · S (ner) · V (vänster) · Ö (höger)</p>
    <p style="font-size:0.78rem;color:var(--muted);margin-bottom:10px">Dra över flera rutor för att markera ett område, tryck på en ruta för att redigera den.</p>
    ${expandingObjectId ? `
    <div class="plot-expand-banner">
      <span>➕ Expanderar <b>${expandLabelForObject(expandingObjectId)}</b> - markera tomma rutor att lägga till.</span>
      <button type="button" class="chip" id="plot-expand-cancel-btn">Avbryt</button>
    </div>
    ` : ''}
    ${sunFilterOn ? `
    <div class="plot-sun-legend">
      <span><i class="sun-swatch sun-swatch-sol"></i>Full sol</span>
      <span><i class="sun-swatch sun-swatch-halvskugga"></i>Halvskugga</span>
      <span><i class="sun-swatch sun-swatch-skugga"></i>Skugga</span>
    </div>
    <p style="font-size:0.72rem;color:var(--muted);margin-bottom:10px">Grov uppskattning baserad på solvinkel över säsongen och höjden på det du placerat - inte en exakt mätning.</p>
    ` : ''}
    <div class="plot-grid-scroll">
      <div class="plot-grid ${sunFilterOn ? 'sun-filter-on' : ''}" id="plot-grid" style="grid-template-columns:repeat(${width}, ${plotZoom}px);grid-template-rows:repeat(${height}, ${plotZoom}px)">
        ${cellsHtml}
      </div>
    </div>
  `;
}

// The grid element is fully recreated (fresh innerHTML) on every render, so
// listeners are attached to it directly (not `window`) - each render's old
// element and its listeners are simply discarded together, nothing leaks.
// Pointer capture keeps move/up events routed to the grid even if the
// finger/cursor drifts outside it mid-drag; because capture makes e.target
// always report the grid itself, the actual cell under the pointer is
// looked up via elementFromPoint(clientX, clientY) instead.
function wirePlotGrid() {
  const grid = document.getElementById('plot-grid');
  if (!grid) return;

  let dragging = false;
  let startCell = null;

  function cellFromEvent(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const target = el && el.closest('.plot-cell');
    if (!target) return null;
    return { x: Number(target.dataset.x), y: Number(target.dataset.y) };
  }

  function selectionBounds(a, b) {
    return {
      x1: Math.min(a.x, b.x), x2: Math.max(a.x, b.x),
      y1: Math.min(a.y, b.y), y2: Math.max(a.y, b.y)
    };
  }

  function paintSelection(bounds) {
    grid.querySelectorAll('.plot-cell').forEach(cell => {
      const x = Number(cell.dataset.x), y = Number(cell.dataset.y);
      const inSel = bounds && x >= bounds.x1 && x <= bounds.x2 && y >= bounds.y1 && y <= bounds.y2;
      cell.classList.toggle('plot-cell-selected', !!inSel);
    });
  }

  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    try { grid.releasePointerCapture(e.pointerId); } catch (err) { /* already released */ }
    const cell = cellFromEvent(e) || startCell;
    const bounds = selectionBounds(startCell, cell);
    paintSelection(null);
    handlePlotSelection(bounds);
  }

  grid.addEventListener('pointerdown', (e) => {
    const cell = cellFromEvent(e);
    if (!cell) return;
    dragging = true;
    startCell = cell;
    try { grid.setPointerCapture(e.pointerId); } catch (err) { /* e.g. synthetic/non-active pointer id */ }
    paintSelection(selectionBounds(cell, cell));
    e.preventDefault();
  });

  grid.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const cell = cellFromEvent(e);
    if (!cell) return;
    paintSelection(selectionBounds(startCell, cell));
  });

  grid.addEventListener('pointerup', endDrag);
  grid.addEventListener('pointercancel', endDrag);
}

function handlePlotSelection(bounds) {
  const cells = [];
  for (let y = bounds.y1; y <= bounds.y2; y++) {
    for (let x = bounds.x1; x <= bounds.x2; x++) cells.push([x, y]);
  }

  if (expandingObjectId) {
    expandSelectionIntoObject(cells);
    return;
  }

  if (cells.length === 1) {
    const [x, y] = cells[0];
    const existing = findObjectAt(x, y);
    if (existing) {
      if (existing.type === 'box') { openBoxEditor(existing.id); return; }
      openObjectCellEditor(existing, x, y);
      return;
    }
    openTypePicker(cells, null);
    return;
  }
  // A multi-cell drag that overlaps something already placed would otherwise
  // create a second object silently claiming the same cell(s) - two objects
  // "owning" one square, which corrupts state in ways the UI can't undo.
  // Block it with a clear reason instead of a confusing no-op or silent bug.
  const occupied = cells.filter(([x, y]) => findObjectAt(x, y));
  if (occupied.length) {
    alert(`${occupied.length} av de ${cells.length} markerade rutorna har redan något placerat. Rensa dem en och en (tryck på varje ruta) innan du markerar ett nytt område här.`);
    return;
  }
  openTypePicker(cells, null);
}

// Merges newly-selected cells into an existing object's footprint (same type
// and properties, just bigger) instead of creating a separate touching
// object. Cells already owned by the target object are silently skipped
// (so dragging a box that overlaps the object's own corner still works);
// cells owned by a *different* object still block, same as a normal drag.
function expandSelectionIntoObject(cells) {
  const obj = state.objects.find(o => o.id === expandingObjectId);
  expandingObjectId = null; // always leave expand mode, even on failure, so the UI never gets stuck
  if (!obj) { render(); return; }

  const newCells = cells.filter(([x, y]) => !obj.cells.some(([ox, oy]) => ox === x && oy === y));
  const blockedBy = newCells.filter(([x, y]) => findObjectAt(x, y));
  if (blockedBy.length) {
    alert(`${blockedBy.length} av de nya rutorna har redan något annat placerat. Markera bara tomma rutor att lägga till.`);
    render();
    return;
  }
  if (!newCells.length) { render(); return; }

  obj.cells.push(...newCells);
  saveState();
  render();
}

function openObjectCellEditor(obj, x, y) {
  const label = OBJECT_TYPE_LABELS[obj.type] || obj.type;
  let detail = '';
  if (obj.type === 'trad') detail = `${(TREE_SPECIES[obj.kind] || []).find(s => s.id === obj.species)?.name || ''} · ${obj.height ?? '?'} m hög`;
  else if (obj.type === 'buske') detail = `${BUSH_SPECIES.find(s => s.id === obj.species)?.name || ''}`;
  else if (obj.type === 'byggnad' || obj.type === 'hack') detail = `${obj.height ?? '?'} m hög`;

  const html = `
    <p class="modal-title">${label}</p>
    <p class="modal-sub">${detail}${detail ? ' · ' : ''}Ruta (${x},${y}) av ${obj.cells.length} totalt</p>
    <div class="modal-section">
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem" id="obj-edit-whole-btn">Redigera hela objektet</button>
    </div>
    <div class="modal-section">
      <button class="chip" style="width:100%;padding:10px;font-size:0.9rem" id="obj-expand-btn">➕ Expandera det här objektet</button>
    </div>
    <div class="modal-section">
      <button class="chip" style="width:100%;padding:10px;font-size:0.9rem" id="obj-remove-cell-btn">Ta bort bara denna ruta</button>
    </div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('obj-edit-whole-btn').addEventListener('click', () => openTypePicker(obj.cells, obj));
  document.getElementById('obj-expand-btn').addEventListener('click', () => {
    expandingObjectId = obj.id;
    closeModal();
    render();
  });
  document.getElementById('obj-remove-cell-btn').addEventListener('click', () => removeCellFromObject(obj.id, x, y));
}

function openTypePicker(cells, existingObject) {
  const currentType = existingObject ? existingObject.type : '';
  const cellsLabel = cells.length === 1 ? `Ruta (${cells[0][0]},${cells[0][1]})` : `${cells.length} rutor valda`;

  const html = `
    <p class="modal-title">${existingObject ? 'Redigera objekt' : 'Lägg till'}</p>
    <p class="modal-sub">${cellsLabel}</p>
    <div class="modal-section">
      <p class="modal-section-title">Vad finns här?</p>
      <div class="type-grid" id="type-grid">
        ${Object.entries(OBJECT_TYPE_LABELS).map(([key, label]) => `
          <button type="button" class="type-btn ${key === currentType ? 'active' : ''}" data-type="${key}">${label}</button>
        `).join('')}
      </div>
    </div>
    <div id="type-extra-fields"></div>
    <div class="modal-section">
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem" id="type-confirm-btn">Spara</button>
    </div>
    ${existingObject ? `<div class="modal-section"><button style="width:100%;padding:10px;font-size:0.85rem;background:none;border:none;color:#922B21;font-family:'Inter',sans-serif" id="type-delete-btn">Ta bort hela objektet</button></div>` : ''}
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  let selectedType = currentType;

  function renderExtraFields() {
    const slot = document.getElementById('type-extra-fields');
    if (selectedType === 'trad') {
      const kind = existingObject?.kind || 'frukt';
      slot.innerHTML = `
        <div class="modal-section">
          <p class="modal-section-title">Typ av träd</p>
          <select class="crop-picker" id="tree-kind-select">
            <option value="frukt" ${kind === 'frukt' ? 'selected' : ''}>Fruktträd</option>
            <option value="ickefrukt" ${kind === 'ickefrukt' ? 'selected' : ''}>Icke-fruktträd</option>
          </select>
          <p class="modal-section-title" style="margin-top:12px">Art</p>
          <select class="crop-picker" id="tree-species-select"></select>
          <p class="modal-section-title" style="margin-top:12px">Höjd (m)</p>
          <input type="number" id="tree-height-input" min="0" step="0.5" value="${existingObject?.height ?? 3}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem">
        </div>
      `;
      const kindSelect = document.getElementById('tree-kind-select');
      const speciesSelect = document.getElementById('tree-species-select');
      function refreshSpeciesOptions() {
        const list = TREE_SPECIES[kindSelect.value] || [];
        const currentSpecies = existingObject?.species;
        speciesSelect.innerHTML = list.map(s => `<option value="${s.id}" ${s.id === currentSpecies ? 'selected' : ''}>${s.name}</option>`).join('');
      }
      kindSelect.addEventListener('change', refreshSpeciesOptions);
      refreshSpeciesOptions();
    } else if (selectedType === 'buske') {
      const currentSpecies = existingObject?.species;
      slot.innerHTML = `
        <div class="modal-section">
          <p class="modal-section-title">Art</p>
          <select class="crop-picker" id="bush-species-select">
            ${BUSH_SPECIES.map(s => `<option value="${s.id}" ${s.id === currentSpecies ? 'selected' : ''}>${s.name}</option>`).join('')}
          </select>
        </div>
      `;
    } else if (selectedType === 'byggnad' || selectedType === 'hack') {
      slot.innerHTML = `
        <div class="modal-section">
          <p class="modal-section-title">Höjd (m)</p>
          <input type="number" id="obj-height-input" min="0" step="0.5" value="${existingObject?.height ?? (selectedType === 'hack' ? 1.5 : 6)}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem">
        </div>
      `;
    } else if (selectedType === 'box') {
      slot.innerHTML = `
        <div class="modal-section">
          <p class="modal-section-title">Namn (valfritt)</p>
          <input type="text" id="box-name-input" placeholder="Lämna tomt för automatiskt namn" value="${existingObject?.name || ''}" style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem">
        </div>
      `;
    } else {
      slot.innerHTML = '';
    }
  }
  renderExtraFields();

  document.querySelectorAll('#type-grid .type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedType = btn.dataset.type;
      document.querySelectorAll('#type-grid .type-btn').forEach(b => b.classList.toggle('active', b === btn));
      renderExtraFields();
    });
  });

  document.getElementById('type-confirm-btn').addEventListener('click', () => {
    if (!selectedType) { alert('Välj vad som finns här.'); return; }
    const props = {};
    if (selectedType === 'trad') {
      props.kind = document.getElementById('tree-kind-select').value;
      props.species = document.getElementById('tree-species-select').value;
      props.height = Number(document.getElementById('tree-height-input').value) || 0;
    } else if (selectedType === 'buske') {
      props.species = document.getElementById('bush-species-select').value;
    } else if (selectedType === 'byggnad' || selectedType === 'hack') {
      props.height = Number(document.getElementById('obj-height-input').value) || 0;
    } else if (selectedType === 'box') {
      const name = document.getElementById('box-name-input').value.trim();
      props.name = name || `Låda ${state.objects.filter(o => o.type === 'box').length + 1}`;
    }

    if (existingObject) updateObjectInPlace(existingObject.id, selectedType, props);
    else addObject(selectedType, cells, props);
    closeModal();
    render();
  });

  const deleteBtn = document.getElementById('type-delete-btn');
  if (deleteBtn) deleteBtn.addEventListener('click', () => removeWholeObject(existingObject.id));
}

function openBoxEditor(boxId) {
  const box = state.objects.find(o => o.id === boxId);
  if (!box) return;

  const html = `
    <p class="modal-title">${box.name}</p>
    <p class="modal-sub">${box.cells.length} ruta${box.cells.length > 1 ? 'or' : ''} · (${box.cells.map(c => c.join(',')).join('), (')})</p>
    <p class="modal-sub sun-badge sun-badge-${sunInfoForCells(box.cells)?.bucket || ''}">${sunBadgeText(box.cells)}</p>
    <button type="button" class="chip" id="history-btn" style="margin-bottom:14px">📜 Historik</button>
    <div id="rotation-recs-slot"></div>
    <div class="modal-section">
      <p class="modal-section-title">Vad odlas här?</p>
      <div id="crop-rows"></div>
      <button type="button" class="chip" id="crop-add-btn">+ Lägg till gröda</button>
    </div>
    <div id="box-warning-slot"></div>
    <div class="modal-section">
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem" id="box-save-btn">Spara</button>
    </div>
    <div class="modal-section">
      <button style="width:100%;padding:10px;font-size:0.85rem;background:none;border:none;color:#922B21;font-family:'Inter',sans-serif" id="box-delete-btn">Ta bort låda</button>
    </div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  const warningSlot = document.getElementById('box-warning-slot');
  const recsSlot = document.getElementById('rotation-recs-slot');
  let cropPicker; // declared first so callbacks can safely no-op while it's still being built

  function updateRecommendations() {
    if (!cropPicker) return;
    if (cropPicker.getSelectedIds().length > 0) { recsSlot.innerHTML = ''; return; }
    const recs = computeRecommendations(boxId);
    if (!recs.length) { recsSlot.innerHTML = ''; return; }
    const history = getBoxHistory(boxId);
    const prevName = CROP_LABELS[history[history.length - 1].cropId];
    recsSlot.innerHTML = `
      <div class="modal-section">
        <p class="modal-section-title">🔁 Rekommenderat efter ${prevName}</p>
        ${recs.map(r => `
          <div class="rec-row">
            <span class="rec-name">${r.crop.name}</span>
            <button type="button" class="rec-add-btn" data-rec-id="${r.id}">✓ Lägg till</button>
          </div>
        `).join('')}
      </div>
    `;
    recsSlot.querySelectorAll('.rec-add-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        cropPicker.addCropDirectly(btn.dataset.recId);
        onCropChange();
      });
    });
  }

  function onCropChange() {
    updateWarning();
    updateRecommendations();
  }

  // Cross-box companion warnings (based on real grid distance) return once
  // Phase B ships; for now this only checks conflicts within the box itself.
  function updateWarning() {
    if (!cropPicker) return;
    const ownEntries = cropPicker.getSelectedIds();
    const ownCropIds = ownEntries.map(e => e.cropId);
    const warnings = [];
    const tips = [];

    const fillers = ownCropIds.filter(id => CROPS[id].fillsBox);
    if (fillers.length && ownCropIds.length > fillers.length) {
      warnings.push(`${fillers.map(id => CROP_LABELS[id]).join(' och ')} tar upp en hel låda på egen hand – de andra grödorna du valt får troligen inte plats.`);
    } else if (fillers.length > 1) {
      warnings.push(`${fillers.map(id => CROP_LABELS[id]).join(' och ')} tar båda upp en hel låda var för sig – de får inte plats tillsammans.`);
    }

    for (let i = 0; i < ownCropIds.length; i++) {
      for (let j = i + 1; j < ownCropIds.length; j++) {
        const cropI = CROPS[ownCropIds[i]], cropJ = CROPS[ownCropIds[j]];
        if ((cropI.companionBad || []).includes(ownCropIds[j]) || (cropJ.companionBad || []).includes(ownCropIds[i])) {
          warnings.push(`${cropI.name} och ${cropJ.name} trivs inte bra ihop i samma låda.`);
        }
      }
    }

    // Cross-box: real grid distance against whichever crop's effectRadius
    // reaches furthest, instead of a manually-picked neighbor list.
    const otherBoxes = state.objects.filter(o => o.type === 'box' && o.id !== boxId);
    otherBoxes.forEach(otherBox => {
      const otherCropIds = getBoxCrops(otherBox.id).map(e => e.cropId);
      if (!otherCropIds.length) return;
      const dist = minDistanceBetweenObjects(box, otherBox);
      ownCropIds.forEach(myId => {
        const myCrop = CROPS[myId];
        otherCropIds.forEach(otherId => {
          const otherCrop = CROPS[otherId];
          const radius = Math.max(myCrop.effectRadius ?? 1, otherCrop.effectRadius ?? 1);
          if (dist > radius) return;
          const distLabel = dist < 0.1 ? 'i angränsande låda' : `~${dist.toFixed(1)} m bort`;
          if ((myCrop.companionBad || []).includes(otherId)) {
            warnings.push(`${myCrop.name} trivs inte bra nära ${otherCrop.name} (${otherBox.name}, ${distLabel}).`);
          } else if ((myCrop.companionGood || []).includes(otherId)) {
            tips.push(`${myCrop.name} trivs bra nära ${otherCrop.name} (${otherBox.name}, ${distLabel}).`);
          }
        });
      });
    });

    ownEntries.forEach(entry => {
      const lateWarning = checkSowingLateness(CROPS[entry.cropId], entry.plantedDate);
      if (lateWarning) warnings.push(lateWarning);
    });

    warningSlot.innerHTML =
      warnings.map(w => `<div class="modal-warning">⚠️ ${w}</div>`).join('') +
      tips.map(t => `<div class="modal-tip">✓ ${t}</div>`).join('');
  }

  cropPicker = wireCropPicker('crop-rows', 'crop-add-btn', getBoxCrops(boxId), null, onCropChange);
  onCropChange();

  document.getElementById('box-save-btn').addEventListener('click', () => {
    const boxEntry = ensureBoxEntry(boxId);
    boxEntry.active = cropPicker.getSelectedIds();
    const harvestedDate = todayStr();
    cropPicker.getPendingHarvests().forEach(entry => {
      boxEntry.history.push({ cropId: entry.cropId, plantedDate: entry.plantedDate, harvestedDate, note: entry.note });
    });
    saveState();
    closeModal();
    render();
  });

  document.getElementById('history-btn').addEventListener('click', () => openBoxHistory(boxId));
  document.getElementById('box-delete-btn').addEventListener('click', () => removeWholeObject(boxId));
}

// ---------- GRÖDOR ----------

let cropFilter = { zone: 'alla', maintenance: 'alla', aktuellNu: false };
let grodorMode = { view: 'lista', schemaZone: 'skugga' };

function renderGrodor() {
  if (grodorMode.view === 'schema') return renderGrodorSchema();

  const periodIdx = currentPeriodIndex();
  const entries = Object.entries(CROPS)
    .filter(([, c]) => cropFilter.zone === 'alla' || c.zone === cropFilter.zone)
    .filter(([, c]) => cropFilter.maintenance === 'alla' || c.maintenance === cropFilter.maintenance)
    .filter(([, c]) => !cropFilter.aktuellNu || ['så', 'så-skörda', 'plantera'].includes(c.perioder[periodIdx].cls))
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'));

  return `
    <h2>Grödor</h2>
    <div class="schema-toggle">
      <button class="chip active" id="mode-lista-btn">Lista</button>
      <button class="chip" id="mode-schema-btn">📅 Visa som schema</button>
    </div>
    <div class="filter-bar">
      <button class="chip ${cropFilter.aktuellNu ? 'active' : ''}" id="aktuell-nu-btn">🌱 Så/plantera nu</button>
    </div>
    <div class="filter-bar">
      ${chip('zone', 'alla', 'Alla zoner')}
      ${chip('zone', 'sol', '☀️ Sol')}
      ${chip('zone', 'skugga', '🌓 Skugga')}
    </div>
    <div class="filter-bar">
      ${chip('maintenance', 'alla', 'Alla nivåer')}
      ${chip('maintenance', 'latt', '🟢 Lättskött')}
      ${chip('maintenance', 'medel', '🟡 Medel')}
      ${chip('maintenance', 'krav', '🔴 Kräver omsorg')}
    </div>
    ${entries.map(([id, c]) => {
      const status = c.perioder[periodIdx];
      return `
      <button class="crop-row" data-crop="${id}">
        <div class="crop-main">
          <div class="crop-name">${c.name}</div>
          <div class="crop-sub">${c.sub}</div>
          <div class="status-pill ${status.cls}" style="margin-top:5px">${status.label}</div>
        </div>
        <div class="badges">
          <span class="badge" title="${MAINT_LABEL[c.maintenance]}">${MAINT_ICON[c.maintenance]}</span>
          <span class="badge" title="${ZONE_LABEL[c.zone]}">${ZONE_ICON[c.zone]}</span>
        </div>
      </button>
    `;
    }).join('') || '<div class="empty-state">Inga grödor matchar filtret.</div>'}
  `;
}

function renderGrodorSchema() {
  const entries = Object.entries(CROPS)
    .filter(([, c]) => c.zone === grodorMode.schemaZone || c.zone === 'valfri')
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'));

  const rows = entries.map(([id, c]) => `
    <tr>
      <td><button class="crop-name-cell" data-crop="${id}">${c.name}</button></td>
      ${c.perioder.map(p => `<td><div class="cell ${p.cls}">${p.label}</div></td>`).join('')}
    </tr>
  `).join('');

  return `
    <h2>Grödor</h2>
    <div class="schema-toggle">
      <button class="chip" id="mode-lista-btn">Lista</button>
      <button class="chip active" id="mode-schema-btn">📅 Visa som schema</button>
    </div>
    <div class="schema-toggle">
      <button class="chip ${grodorMode.schemaZone === 'skugga' ? 'active' : ''}" id="schema-skugga-btn">🌓 Häcken (skugga)</button>
      <button class="chip ${grodorMode.schemaZone === 'sol' ? 'active' : ''}" id="schema-sol-btn">☀️ Soliga läget</button>
    </div>
    <div class="table-wrap">
      <table class="schedule">
        <thead>
          <tr>
            <th>Gröda</th>
            ${MONTH_LABELS.map(m => `<th>${m}</th>`).join('')}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <p style="font-size:0.78rem;color:var(--muted)">Örter som passar i båda zonerna visas i båda scheman.</p>
  `;
}

function chip(key, value, label) {
  const active = cropFilter[key] === value;
  return `<button class="chip ${active ? 'active' : ''}" data-filter-key="${key}" data-filter-value="${value}">${label}</button>`;
}

function openCropModal(id) {
  const c = CROPS[id];
  if (!c) return;
  const months = c.perioder.map(p => `<div class="cell ${p.cls}">${p.label}</div>`).join('');
  const monthLabels = MONTH_LABELS.map(m => `<div>${m}</div>`).join('');

  const html = `
    <p class="modal-title">${c.name}</p>
    <p class="modal-sub">${c.sub}</p>
    <div class="pill-row">
      <span class="pill ${c.maintenance}">${MAINT_ICON[c.maintenance]} ${MAINT_LABEL[c.maintenance]}</span>
      <span class="pill zone">${ZONE_LABEL[c.zone]}</span>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">📅 Säsong</p>
      <div class="month-strip">${months}</div>
      <div class="month-labels">${monthLabels}</div>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">🌱 ${c.plantering.titel}</p>
      <p>${c.plantering.text}</p>
    </div>

    ${c.sorter ? `
    <div class="modal-section">
      <p class="modal-section-title">🌾 Rekommenderade sorter</p>
      <ul>${c.sorter.map(s => `<li><strong>${s.namn}</strong> – ${s.beskrivning}</li>`).join('')}</ul>
    </div>` : ''}

    <div class="modal-section">
      <p class="modal-section-title">💧 Skötsel</p>
      <ul>${c.skotsel.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>

    <div class="modal-section">
      <p class="modal-section-title">🧺 Skörd</p>
      <p>${c.skörd}</p>
    </div>

    ${(c.companionGood?.length || c.companionBad?.length) ? `
    <div class="modal-section">
      <p class="modal-section-title">🤝 Kompanjonodling</p>
      ${c.companionGood?.length ? `<p>Trivs bra med: ${c.companionGood.map(id => CROP_LABELS[id] || id).join(', ')}</p>` : ''}
      ${c.companionBad?.length ? `<p>Undvik nära: ${c.companionBad.map(id => CROP_LABELS[id] || id).join(', ')}</p>` : ''}
    </div>` : ''}

    ${c.family ? `
    <div class="modal-section">
      <p class="modal-section-title">🌍 Växtfamilj & jordpåverkan</p>
      <p>${FAMILY_LABEL[c.family] || c.family}</p>
      <p>${FEEDER_LABEL[c.feederType] || ''}</p>
    </div>` : ''}

    ${c.skadedjur ? `
    <div class="modal-section">
      <p class="modal-section-title">🐦🦌 Skadedjur & skydd</p>
      <p>${c.skadedjur}</p>
    </div>` : ''}

    <div class="modal-tip">💡 ${c.tips}</div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ---------- BÄRBUSKAR ----------

function renderBarbuskar() {
  const entries = Object.entries(BERRIES);
  return `
    <h2>Bärbuskar</h2>
    <p style="font-size:0.85rem;color:var(--muted);margin-bottom:16px">Fristående guide – dessa kopplas inte till någon odlingslåda.</p>
    <div class="modal-tip" style="margin-bottom:16px">🦌 ${DEER_GENERAL_TIP}</div>
    ${entries.map(([id, b]) => `
      <button class="crop-row" data-berry="${id}">
        <div class="crop-main">
          <div class="crop-name">${b.name}</div>
          <div class="crop-sub">${b.sub}</div>
        </div>
        <div class="badges"><span class="badge" title="${MAINT_LABEL[b.maintenance]}">${MAINT_ICON[b.maintenance]}</span></div>
      </button>
    `).join('')}
  `;
}

function openBerryModal(id) {
  const b = BERRIES[id];
  if (!b) return;
  const html = `
    <p class="modal-title">${b.name}</p>
    <p class="modal-sub">${b.sub}</p>
    <div class="pill-row"><span class="pill ${b.maintenance}">${MAINT_ICON[b.maintenance]} ${MAINT_LABEL[b.maintenance]}</span></div>
    <div class="modal-section">
      <p class="modal-section-title">🌱 Plantering</p>
      <p>${b.plantering}</p>
    </div>
    <div class="modal-section">
      <p class="modal-section-title">💧 Skötsel</p>
      <ul>${b.skotsel.map(s => `<li>${s}</li>`).join('')}</ul>
    </div>
    <div class="modal-section">
      <p class="modal-section-title">🧺 Skörd</p>
      <p>${b.skörd}</p>
    </div>
    ${b.skadedjur ? `
    <div class="modal-section">
      <p class="modal-section-title">🐦🦌 Skadedjur & skydd</p>
      <p>${b.skadedjur}</p>
    </div>` : ''}
    <div class="modal-tip">💡 ${b.tips}</div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ---------- MODAL (delad) ----------

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

// ---------- EVENT WIRING ----------

function attachViewHandlers() {
  wireHistoryRowHandlers(document.getElementById('view'));
  document.querySelectorAll('.crop-row[data-crop]').forEach(el => {
    el.addEventListener('click', () => openCropModal(el.dataset.crop));
  });
  document.querySelectorAll('.crop-row[data-berry]').forEach(el => {
    el.addEventListener('click', () => openBerryModal(el.dataset.berry));
  });
  document.querySelectorAll('.chip[data-filter-key]').forEach(el => {
    el.addEventListener('click', () => {
      cropFilter[el.dataset.filterKey] = el.dataset.filterValue;
      render();
    });
  });

  const aktuellNuBtn = document.getElementById('aktuell-nu-btn');
  if (aktuellNuBtn) aktuellNuBtn.addEventListener('click', () => { cropFilter.aktuellNu = !cropFilter.aktuellNu; render(); });

  const modeListaBtn = document.getElementById('mode-lista-btn');
  const modeSchemaBtn = document.getElementById('mode-schema-btn');
  if (modeListaBtn) modeListaBtn.addEventListener('click', () => { grodorMode.view = 'lista'; render(); });
  if (modeSchemaBtn) modeSchemaBtn.addEventListener('click', () => { grodorMode.view = 'schema'; render(); });
  const schemaSkuggaBtn = document.getElementById('schema-skugga-btn');
  const schemaSolBtn = document.getElementById('schema-sol-btn');
  if (schemaSkuggaBtn) schemaSkuggaBtn.addEventListener('click', () => { grodorMode.schemaZone = 'skugga'; render(); });
  if (schemaSolBtn) schemaSolBtn.addEventListener('click', () => { grodorMode.schemaZone = 'sol'; render(); });
  document.querySelectorAll('.crop-name-cell[data-crop]').forEach(el => {
    el.addEventListener('click', () => openCropModal(el.dataset.crop));
  });

  const exportBtn = document.getElementById('export-btn');
  const importBtn = document.getElementById('import-btn');
  const importFileInput = document.getElementById('import-file-input');
  if (exportBtn) exportBtn.addEventListener('click', exportData);
  if (importBtn) importBtn.addEventListener('click', () => importFileInput.click());
  if (importFileInput) importFileInput.addEventListener('change', () => {
    if (importFileInput.files[0]) importDataFile(importFileInput.files[0]);
    importFileInput.value = '';
  });

  wireGeoLocationButton('plot-lat-geo-btn', 'plot-lat-input', 'plot-lat-geo-status');

  const plotSetupBtn = document.getElementById('plot-setup-btn');
  if (plotSetupBtn) plotSetupBtn.addEventListener('click', () => {
    const w = Math.max(1, Math.min(MAX_PLOT_DIM, Math.round(Number(document.getElementById('plot-width-input').value)) || 0));
    const h = Math.max(1, Math.min(MAX_PLOT_DIM, Math.round(Number(document.getElementById('plot-height-input').value)) || 0));
    const lat = Number(document.getElementById('plot-lat-input').value) || 59.3; // Stockholm, if the field is somehow left empty/invalid
    if (!w || !h) { alert('Ange giltiga mått.'); return; }
    state.plot = { width: w, height: h, latitude: lat };
    state.objects = [];
    saveState();
    render();
  });

  const zoomInBtn = document.getElementById('plot-zoom-in');
  const zoomOutBtn = document.getElementById('plot-zoom-out');
  if (zoomInBtn) zoomInBtn.addEventListener('click', () => { plotZoom = Math.min(48, plotZoom + 6); render(); });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { plotZoom = Math.max(14, plotZoom - 6); render(); });

  const plotResizeBtn = document.getElementById('plot-resize-btn');
  if (plotResizeBtn) plotResizeBtn.addEventListener('click', openPlotResizeModal);

  const plotSunToggleBtn = document.getElementById('plot-sun-toggle-btn');
  if (plotSunToggleBtn) plotSunToggleBtn.addEventListener('click', () => { sunFilterOn = !sunFilterOn; render(); });

  const plotExpandCancelBtn = document.getElementById('plot-expand-cancel-btn');
  if (plotExpandCancelBtn) plotExpandCancelBtn.addEventListener('click', () => { expandingObjectId = null; render(); });

  const plotClearBtn = document.getElementById('plot-clear-btn');
  if (plotClearBtn) plotClearBtn.addEventListener('click', () => {
    if (!state.objects.length) return;
    if (!confirm('Rensa hela tomten? Alla placerade objekt (träd, buskar, lådor, hus m.m.) tas bort och allt blir gräs igen. Det här går inte att ångra.')) return;
    state.objects = [];
    saveState();
    render();
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tabbar button').forEach(b => {
    b.addEventListener('click', () => goTo(b.dataset.view));
  });
  document.getElementById('modal-close').addEventListener('click', closeModal);
  document.getElementById('modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') closeModal();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) refreshFromExternalChange();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') refreshFromExternalChange();
  });

  render();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
  if (navigator.storage && navigator.storage.persist) {
    navigator.storage.persist().catch(() => {});
  }
});
