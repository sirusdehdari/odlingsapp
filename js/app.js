const STORAGE_KEY = 'odling_box_state_v1';
const MONTH_LABELS = ['Apr–Maj', 'Jun', 'Jul', 'Aug', 'Sep–Okt', 'Nov–Mar'];
const MAINT_LABEL = { latt: 'Lättskött', medel: 'Medel', krav: 'Kräver omsorg' };
const ZONE_LABEL = { sol: '☀️ Bäst i full sol', skugga: '🌓 Klarar skugga bra', valfri: '➖ Spelar mindre roll' };
const MAINT_ICON = { latt: '🟢', medel: '🟡', krav: '🔴' };
const ZONE_ICON = { sol: '☀️', skugga: '🌓', valfri: '➖' };

let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.boxDefs) return parsed;
    }
  } catch (e) { /* fall through to defaults */ }
  return { boxDefs: JSON.parse(JSON.stringify(BOX_CONFIG)), boxes: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
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

const MAX_NEIGHBORS = 8;
const MAX_CROPS_PER_BOX = 4;

function getBoxCrops(boxId) {
  return state.boxes[boxId] || [];
}

function getBoxNeighbors(boxId) {
  const box = state.boxDefs.find(b => b.id === boxId);
  return (box && box.neighbors) || [];
}

// Keeps neighbor relationships symmetric: if A gets B added/removed as a
// neighbor, B's own list is updated to match automatically.
function setBoxNeighbors(boxId, newNeighborIds) {
  const box = state.boxDefs.find(b => b.id === boxId);
  if (!box) return;
  const oldNeighborIds = box.neighbors || [];
  const added = newNeighborIds.filter(id => !oldNeighborIds.includes(id));
  const removed = oldNeighborIds.filter(id => !newNeighborIds.includes(id));
  box.neighbors = newNeighborIds;
  added.forEach(otherId => {
    const other = state.boxDefs.find(b => b.id === otherId);
    if (!other) return;
    other.neighbors = other.neighbors || [];
    if (!other.neighbors.includes(boxId)) other.neighbors.push(boxId);
  });
  removed.forEach(otherId => {
    const other = state.boxDefs.find(b => b.id === otherId);
    if (!other) return;
    other.neighbors = (other.neighbors || []).filter(id => id !== boxId);
  });
}

// Builds and wires up the dynamic "add neighbor" row list inside a modal.
// excludeId may be undefined (used when adding a brand new box that has no id yet).
function wireNeighborPicker(rowsContainerId, addBtnId, excludeId, initialIds, onChange) {
  const rowsContainer = document.getElementById(rowsContainerId);
  const addBtn = document.getElementById(addBtnId);
  let rowIdCounter = 0;

  function otherBoxes() {
    return state.boxDefs.filter(b => b.id !== excludeId);
  }

  function currentSelectedIds() {
    return Array.from(rowsContainer.querySelectorAll('select.neighbor-select'))
      .map(s => s.value)
      .filter(Boolean);
  }

  function refreshOptions() {
    const selected = currentSelectedIds();
    rowsContainer.querySelectorAll('select.neighbor-select').forEach(sel => {
      const own = sel.value;
      const optionsHtml = otherBoxes()
        .filter(b => b.id === own || !selected.includes(b.id))
        .map(b => `<option value="${b.id}" ${b.id === own ? 'selected' : ''}>${b.name}</option>`)
        .join('');
      sel.innerHTML = `<option value="">— Välj låda —</option>${optionsHtml}`;
      sel.value = own;
    });
    addBtn.style.display = rowsContainer.children.length >= MAX_NEIGHBORS ? 'none' : '';
    if (onChange) onChange();
  }

  function addRow(selectedId) {
    const row = document.createElement('div');
    row.className = 'neighbor-row';
    row.innerHTML = `
      <select class="crop-picker neighbor-select"></select>
      <button type="button" class="neighbor-remove-btn">✕</button>
    `;
    rowsContainer.appendChild(row);
    const select = row.querySelector('select');
    // A freshly created <select> has no <option> elements yet, so setting
    // .value before populating options is silently ignored by the browser.
    // Build this row's own option list first so the initial selection actually sticks.
    const initialOptionsHtml = otherBoxes()
      .map(b => `<option value="${b.id}" ${b.id === selectedId ? 'selected' : ''}>${b.name}</option>`)
      .join('');
    select.innerHTML = `<option value="">— Välj låda —</option>${initialOptionsHtml}`;
    select.value = selectedId || '';
    select.addEventListener('change', refreshOptions);
    row.querySelector('.neighbor-remove-btn').addEventListener('click', () => {
      row.remove();
      refreshOptions();
    });
    refreshOptions();
  }

  initialIds.forEach(id => addRow(id));
  addBtn.addEventListener('click', () => {
    if (rowsContainer.children.length < MAX_NEIGHBORS) addRow('');
  });
  refreshOptions();

  return { getSelectedIds: currentSelectedIds };
}

// Builds and wires up the "vad odlas här" picker: saved crops show as a
// compact, clickable name + edit/remove icons; only a freshly-added or
// edited row shows the actual <select>. Up to MAX_CROPS_PER_BOX crops.
function wireCropPicker(rowsContainerId, addBtnId, initialCropIds, onChange) {
  const rowsContainer = document.getElementById(rowsContainerId);
  const addBtn = document.getElementById(addBtnId);

  function currentSelectedIds() {
    return Array.from(rowsContainer.children).map(row => row.dataset.cropId).filter(Boolean);
  }

  function refreshAll() {
    addBtn.style.display = rowsContainer.children.length >= MAX_CROPS_PER_BOX ? 'none' : '';
    if (onChange) onChange();
  }

  function renderRowDisplay(row, cropId) {
    const crop = CROPS[cropId];
    row.dataset.cropId = cropId;
    row.innerHTML = `
      <button type="button" class="crop-row-name">${crop.name}</button>
      <button type="button" class="crop-row-edit" title="Byt gröda">✎</button>
      <button type="button" class="crop-row-remove" title="Ta bort">✕</button>
    `;
    row.querySelector('.crop-row-name').addEventListener('click', () => openCropModal(cropId));
    row.querySelector('.crop-row-edit').addEventListener('click', () => renderRowEdit(row, cropId));
    row.querySelector('.crop-row-remove').addEventListener('click', () => {
      row.remove();
      refreshAll();
    });
  }

  function renderRowEdit(row, currentCropId) {
    row.dataset.cropId = '';
    const selected = currentSelectedIds();
    const options = Object.entries(CROPS)
      .filter(([id]) => id === currentCropId || !selected.includes(id))
      .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'))
      .map(([id, c]) => `<option value="${id}" ${id === currentCropId ? 'selected' : ''}>${c.name}</option>`)
      .join('');
    row.innerHTML = `<select class="crop-picker crop-row-select"><option value="">— Välj gröda —</option>${options}</select>`;
    const select = row.querySelector('select');
    select.addEventListener('change', () => {
      if (select.value) {
        renderRowDisplay(row, select.value);
        refreshAll();
      }
    });
  }

  function addRow(cropId) {
    const row = document.createElement('div');
    row.className = 'crop-picker-row';
    rowsContainer.appendChild(row);
    if (cropId) renderRowDisplay(row, cropId);
    else renderRowEdit(row, '');
    refreshAll();
  }

  initialCropIds.forEach(id => addRow(id));
  addBtn.addEventListener('click', () => {
    if (rowsContainer.children.length < MAX_CROPS_PER_BOX) addRow('');
  });
  refreshAll();

  return { getSelectedIds: currentSelectedIds };
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
      if (!parsed.boxDefs || !parsed.boxes) throw new Error('Ogiltigt format');
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

const VIEWS = ['hem', 'lador', 'grodor', 'barbuskar', 'dagbok', 'vader'];
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
  else if (currentView === 'lador') el.innerHTML = renderLador();
  else if (currentView === 'grodor') el.innerHTML = renderGrodor();
  else if (currentView === 'barbuskar') el.innerHTML = renderBarbuskar();
  else if (currentView === 'dagbok') el.innerHTML = renderComingSoon('Dagbok', 'Snabb loggning av vattning, gödsling och skörd kommer i nästa version.');
  else if (currentView === 'vader') el.innerHTML = renderComingSoon('Väder', 'Väderprognos och odlingsråd baserat på din plats kommer i nästa version.');
  attachViewHandlers();
}

function renderComingSoon(title, text) {
  return `<h2>${title}</h2><div class="empty-state">🚧 ${text}</div>`;
}

// ---------- HEM ----------

function renderHem() {
  const assigned = Object.values(state.boxes).filter(cropIds => Array.isArray(cropIds) && cropIds.length > 0);
  const totalBoxes = state.boxDefs.length;
  return `
    <h2>Hem</h2>
    <div class="card">
      <div class="section-title" style="margin-top:0">Just nu</div>
      <p style="font-size:0.9rem;line-height:1.6">
        ${assigned.length} av ${totalBoxes} lådor har en gröda tilldelad.
        ${assigned.length === 0 ? 'Gå till <b>Lådor</b> för att komma igång.' : 'Se detaljer under <b>Lådor</b>.'}
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

// ---------- LÅDOR ----------

function renderLador() {
  const zones = [
    { id: 'skugga', label: 'Häcken (skugga till förmiddag)' },
    { id: 'sol', label: 'Soliga läget (sol hela dagen)' }
  ];
  return `
    <h2>Lådor</h2>
    <button class="chip active" id="add-box-btn" style="margin-bottom:16px">+ Lägg till låda</button>
    ${zones.map(z => `
      <div class="section-title">${z.label}</div>
      <div class="box-grid">
        ${state.boxDefs.filter(b => b.zone === z.id).map(renderBoxTile).join('') || '<div class="empty-state" style="grid-column:1/-1;padding:16px">Inga lådor här ännu.</div>'}
      </div>
    `).join('')}
  `;
}

function renderBoxTile(box) {
  const cropIds = getBoxCrops(box.id);
  const firstCrop = cropIds[0] ? CROPS[cropIds[0]] : null;
  const status = firstCrop ? firstCrop.perioder[currentPeriodIndex()] : null;
  const extra = cropIds.length > 1 ? ` +${cropIds.length - 1} till` : '';
  return `
    <button class="box-tile zone-${box.zone}" data-box="${box.id}">
      <div class="box-name">${box.name}</div>
      <div class="box-crop ${firstCrop ? '' : 'empty'}">${firstCrop ? firstCrop.name + extra : 'Tom'}</div>
      ${status ? `<div class="status-pill ${status.cls}">${status.label}</div>` : ''}
    </button>
  `;
}

function openAddBoxModal() {
  const html = `
    <p class="modal-title">Lägg till låda</p>
    <div class="modal-section">
      <p class="modal-section-title">Namn (valfritt)</p>
      <input type="text" id="new-box-name" placeholder="Lämna tomt för automatiskt namn"
        style="width:100%;padding:10px 12px;border-radius:8px;border:1px solid var(--border);font-family:'Inter',sans-serif;font-size:0.9rem">
    </div>
    <div class="modal-section">
      <p class="modal-section-title">Var ligger den?</p>
      <select class="crop-picker" id="new-box-zone">
        <option value="skugga">🌓 Vid häcken (skugga till förmiddag)</option>
        <option value="sol">☀️ Soliga läget (sol hela dagen)</option>
      </select>
    </div>
    <div class="modal-section">
      <p class="modal-section-title">Vilka lådor ligger den nära? (valfritt)</p>
      <div id="neighbor-rows"></div>
      <button type="button" class="chip" id="neighbor-add-btn">+ Lägg till granne</button>
    </div>
    <div class="modal-section">
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem" id="new-box-save-btn">Lägg till</button>
    </div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  const neighborPicker = wireNeighborPicker('neighbor-rows', 'neighbor-add-btn', undefined, []);

  document.getElementById('new-box-save-btn').addEventListener('click', () => {
    const zone = document.getElementById('new-box-zone').value;
    const name = document.getElementById('new-box-name').value.trim();
    const neighborIds = neighborPicker.getSelectedIds();
    const newId = addBox(zone, name);
    if (neighborIds.length) setBoxNeighbors(newId, neighborIds);
    saveState();
    render();
    closeModal();
  });
}

function addBox(zone, name) {
  const existingCount = state.boxDefs.filter(b => b.zone === zone).length;
  const id = `${zone}-${Date.now()}`;
  const autoName = zone === 'sol' ? `Soliga ${existingCount + 1}` : `Häcken ${existingCount + 1}`;
  state.boxDefs.push({ id, zone, name: name || autoName, neighbors: [] });
  saveState();
  render();
  return id;
}

function removeBox(boxId) {
  if (!confirm('Ta bort den här lådan? Det här går inte att ångra.')) return;
  state.boxDefs.forEach(b => {
    if (b.neighbors) b.neighbors = b.neighbors.filter(id => id !== boxId);
  });
  state.boxDefs = state.boxDefs.filter(b => b.id !== boxId);
  delete state.boxes[boxId];
  saveState();
  closeModal();
  render();
}

function openBoxEditor(boxId) {
  const box = state.boxDefs.find(b => b.id === boxId);

  const html = `
    <p class="modal-title">${box.name}</p>
    <p class="modal-sub">${box.zone === 'sol' ? '☀️ Sol hela dagen' : '🌓 Skugga till förmiddag'}</p>
    <div class="modal-section">
      <p class="modal-section-title">Vad odlas här?</p>
      <div id="crop-rows"></div>
      <button type="button" class="chip" id="crop-add-btn">+ Lägg till gröda</button>
    </div>
    <div id="box-warning-slot"></div>
    <div class="modal-section">
      <p class="modal-section-title">Vilka lådor ligger den nära?</p>
      <div id="neighbor-rows"></div>
      <button type="button" class="chip" id="neighbor-add-btn">+ Lägg till granne</button>
    </div>
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
  // declared first so the shared updateWarning callback can safely no-op while both pickers are still being built
  let cropPicker, neighborPicker;

  function updateWarning() {
    if (!cropPicker || !neighborPicker) return;
    const ownCropIds = cropPicker.getSelectedIds();
    const neighborCropIds = neighborPicker.getSelectedIds().flatMap(getBoxCrops);
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

    ownCropIds.forEach(ownId => {
      const crop = CROPS[ownId];
      (crop.companionBad || []).filter(id => neighborCropIds.includes(id))
        .forEach(badId => warnings.push(`${crop.name} trivs inte bra bredvid ${CROP_LABELS[badId]}, som odlas i en angränsande låda.`));
      (crop.companionGood || []).filter(id => neighborCropIds.includes(id))
        .forEach(goodId => tips.push(`${crop.name} trivs bra tillsammans med ${CROP_LABELS[goodId]}, som odlas i en angränsande låda.`));
    });

    warningSlot.innerHTML =
      warnings.map(w => `<div class="modal-warning">⚠️ ${w}</div>`).join('') +
      tips.map(t => `<div class="modal-tip">✓ ${t}</div>`).join('');
  }

  cropPicker = wireCropPicker('crop-rows', 'crop-add-btn', getBoxCrops(boxId), updateWarning);
  neighborPicker = wireNeighborPicker('neighbor-rows', 'neighbor-add-btn', boxId, getBoxNeighbors(boxId), updateWarning);
  updateWarning();

  document.getElementById('box-save-btn').addEventListener('click', () => {
    state.boxes[boxId] = cropPicker.getSelectedIds();
    setBoxNeighbors(boxId, neighborPicker.getSelectedIds());
    saveState();
    closeModal();
    render();
  });

  document.getElementById('box-delete-btn').addEventListener('click', () => removeBox(boxId));
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
    .filter(([, c]) => !cropFilter.aktuellNu || c.perioder[periodIdx].cls !== 'vila')
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'));

  return `
    <h2>Grödor</h2>
    <div class="schema-toggle">
      <button class="chip active" id="mode-lista-btn">Lista</button>
      <button class="chip" id="mode-schema-btn">📅 Visa som schema</button>
    </div>
    <div class="filter-bar">
      <button class="chip ${cropFilter.aktuellNu ? 'active' : ''}" id="aktuell-nu-btn">📍 Aktuellt nu</button>
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
  document.querySelectorAll('.crop-row[data-crop]').forEach(el => {
    el.addEventListener('click', () => openCropModal(el.dataset.crop));
  });
  document.querySelectorAll('.crop-row[data-berry]').forEach(el => {
    el.addEventListener('click', () => openBerryModal(el.dataset.berry));
  });
  document.querySelectorAll('.box-tile[data-box]').forEach(el => {
    el.addEventListener('click', () => openBoxEditor(el.dataset.box));
  });
  const addBoxBtn = document.getElementById('add-box-btn');
  if (addBoxBtn) addBoxBtn.addEventListener('click', openAddBoxModal);
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
