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
  const assigned = Object.entries(state.boxes).filter(([, cropId]) => cropId);
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
  const cropId = state.boxes[box.id];
  const crop = cropId ? CROPS[cropId] : null;
  return `
    <button class="box-tile zone-${box.zone}" data-box="${box.id}">
      <div class="box-name">${box.name}</div>
      <div class="box-crop ${crop ? '' : 'empty'}">${crop ? crop.name : 'Tom'}</div>
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
      <button class="chip active" style="width:100%;padding:10px;font-size:0.9rem" id="new-box-save-btn">Lägg till</button>
    </div>
  `;
  document.getElementById('modal-content').innerHTML = html;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';

  document.getElementById('new-box-save-btn').addEventListener('click', () => {
    const zone = document.getElementById('new-box-zone').value;
    const name = document.getElementById('new-box-name').value.trim();
    addBox(zone, name);
    closeModal();
  });
}

function addBox(zone, name) {
  const existingCount = state.boxDefs.filter(b => b.zone === zone).length;
  const id = `${zone}-${Date.now()}`;
  const autoName = zone === 'sol' ? `Soliga ${existingCount + 1}` : `Häcken ${existingCount + 1}`;
  state.boxDefs.push({ id, zone, name: name || autoName });
  saveState();
  render();
}

function removeBox(boxId) {
  if (!confirm('Ta bort den här lådan? Det här går inte att ångra.')) return;
  state.boxDefs = state.boxDefs.filter(b => b.id !== boxId);
  delete state.boxes[boxId];
  saveState();
  closeModal();
  render();
}

function openBoxEditor(boxId) {
  const box = state.boxDefs.find(b => b.id === boxId);
  const currentCropId = state.boxes[boxId] || '';
  const neighborIds = state.boxDefs.filter(b => b.zone === box.zone && b.id !== boxId)
    .map(b => state.boxes[b.id]).filter(Boolean);

  const options = Object.entries(CROPS)
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'))
    .map(([id, c]) => `<option value="${id}" ${id === currentCropId ? 'selected' : ''}>${c.name}</option>`)
    .join('');

  const html = `
    <p class="modal-title">${box.name}</p>
    <p class="modal-sub">${box.zone === 'sol' ? '☀️ Sol hela dagen' : '🌓 Skugga till förmiddag'}</p>
    <div class="modal-section">
      <p class="modal-section-title">Vad odlas här?</p>
      <select class="crop-picker" id="box-crop-select">
        <option value="">— Tom / inget vald —</option>
        ${options}
      </select>
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

  const select = document.getElementById('box-crop-select');
  const warningSlot = document.getElementById('box-warning-slot');

  function updateWarning() {
    const chosen = select.value;
    warningSlot.innerHTML = '';
    if (!chosen) return;
    const crop = CROPS[chosen];
    const badNeighbors = (crop.companionBad || []).filter(id => neighborIds.includes(id));
    if (badNeighbors.length > 0) {
      warningSlot.innerHTML = `<div class="modal-warning">⚠️ ${crop.name} trivs inte bra bredvid ${badNeighbors.map(id => CROP_LABELS[id]).join(', ')}, som redan odlas i en annan låda i samma zon.</div>`;
    } else {
      const goodNeighbors = (crop.companionGood || []).filter(id => neighborIds.includes(id));
      if (goodNeighbors.length > 0) {
        warningSlot.innerHTML = `<div class="modal-tip">✓ ${crop.name} trivs bra tillsammans med ${goodNeighbors.map(id => CROP_LABELS[id]).join(', ')}, som redan odlas i zonen.</div>`;
      }
    }
  }
  select.addEventListener('change', updateWarning);
  updateWarning();

  document.getElementById('box-save-btn').addEventListener('click', () => {
    state.boxes[boxId] = select.value || null;
    saveState();
    closeModal();
    render();
  });

  document.getElementById('box-delete-btn').addEventListener('click', () => removeBox(boxId));
}

// ---------- GRÖDOR ----------

let cropFilter = { zone: 'alla', maintenance: 'alla' };

function renderGrodor() {
  const entries = Object.entries(CROPS)
    .filter(([, c]) => cropFilter.zone === 'alla' || c.zone === cropFilter.zone)
    .filter(([, c]) => cropFilter.maintenance === 'alla' || c.maintenance === cropFilter.maintenance)
    .sort((a, b) => a[1].name.localeCompare(b[1].name, 'sv'));

  return `
    <h2>Grödor</h2>
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
    ${entries.map(([id, c]) => `
      <button class="crop-row" data-crop="${id}">
        <div class="crop-main">
          <div class="crop-name">${c.name}</div>
          <div class="crop-sub">${c.sub}</div>
        </div>
        <div class="badges">
          <span class="badge" title="${MAINT_LABEL[c.maintenance]}">${MAINT_ICON[c.maintenance]}</span>
          <span class="badge" title="${ZONE_LABEL[c.zone]}">${ZONE_ICON[c.zone]}</span>
        </div>
      </button>
    `).join('') || '<div class="empty-state">Inga grödor matchar filtret.</div>'}
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

  render();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  }
});
