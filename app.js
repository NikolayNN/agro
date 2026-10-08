/* Автономный прототип: все треки и показатели расчёта демонстрационные. */
'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fmt = (value, digits = 2) => Number(value).toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const iconNames = {fields:'map',rotation:'autorenew',operations:'event_available',reports:'description',directory:'grid_view',help:'help',search:'search',sync:'sync',check:'check_circle',tractor:'agriculture',clock:'schedule',download:'download',plus:'add',arrow:'arrow_forward',layers:'layers',leaf:'eco',edit:'edit',play:'play_arrow'};
const icon = name => `<span class="icon ds-symbol" aria-hidden="true">${iconNames[name] || 'map'}</span>`;
$$('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
const crops = ['', 'Пшеница озимая', 'Рапс озимый', 'Кукуруза', 'Ячмень яровой', 'Пар'];
// Системный перечень: не редактируется в справочниках хозяйства.
const systemOperations = Object.freeze([
  'Лущение',
  'Вспашка',
  'Безотвальная обработка почвы',
  'Глубокорыхление',
  'Культивация',
  'Дискование',
  'Прикатывание',
  'Боронование',
  'Сев',
  'Внесение удобрений(К)',
  'Внесение удобрений (P)',
  'Внесение удобрений (NPK)',
  'Внесение удобрений (N-основное)',
  'Внесение удобрений (N-1ая подкормка)',
  'Внесение удобрений (N-2ая подкормка)',
  'Внесение удобрений (N-3ая подкормка)',
  'Внесение удобрений (N-4ая подкормка)',
  'Внесение органики (жидкая)',
  'Внесение органики (твердая)',
  'Химобработка (глифосаты)',
  'Химобработка (гербициды)',
  'Химобработка (росторегуляторы)',
  'Химобработка (инсектициды)',
  'Химобработка (фунгициды)',
  'Химобработка (десикация)',
  'Нарезка борозд',
  'Окучивание',
  'Кошение (1 укос)',
  'Кошение (2 укос)',
  'Кошение (3 укос)',
  'Кошение (4 укос)',
  'Ворушение',
  'Сгребание',
  'Прессование сена',
  'Прессование сенажа',
  'Прессование соломы',
  'Уборка',
  'Заготовка сенажа',
  'Заготовка силоса',
  'Измельчение соломы',
  'Подкашивание',
  'Подсев трав',
].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true })));
const cropInks = { 'Пшеница озимая': 'var(--ds-series-2)', 'Рапс озимый': 'var(--ds-series-4)', 'Кукуруза': 'var(--ds-series-1)', 'Ячмень яровой': 'var(--ds-series-5)', 'Пар': 'var(--ds-series-6)' };
const cropColors = Object.fromEntries(crops.map(c => [c, c ? `color-mix(in srgb, ${cropInks[c]} 14%, var(--ds-surface))` : 'var(--ds-surface)']));
const fields = [
  { id: 12, name: 'Северное', area: 64.8, rotation: { 2024: 'Рапс озимый', 2025: 'Ячмень яровой', 2026: 'Пшеница озимая' } },
  { id: 8, name: 'За лесом', area: 42.6, rotation: { 2024: 'Пшеница озимая', 2025: 'Кукуруза', 2026: 'Рапс озимый' } },
  { id: 3, name: 'Берёзовая роща', area: 78.4, rotation: { 2024: 'Пар', 2025: 'Пшеница озимая', 2026: 'Кукуруза' } },
  { id: 15, name: 'У озера', area: 36.2, rotation: { 2024: 'Кукуруза', 2025: 'Рапс озимый', 2026: 'Ячмень яровой' } },
  { id: 6, name: 'Восточное', area: 91.5, rotation: { 2024: 'Ячмень яровой', 2025: 'Пшеница озимая', 2026: 'Рапс озимый' } },
  { id: 21, name: 'Дальний клин', area: 53.7, rotation: { 2025: 'Кукуруза', 2026: 'Пшеница озимая' } },
];
const initialWorks = [
  { id: 1, field: 12, date: '2026-10-01', machine: 'МТЗ-3022', plate: 'АВ 4821', driver: 'Ковалёв Александр', time: '08:15–12:40', duration: '4 ч 25 мин', operation: 'Сев', implement: 'Horsch Pronto 6 DC', width: 6, net: 61.42, overlap: 2.16, status: 'pending', season: '2026' },
  { id: 2, field: 8, date: '2026-10-01', machine: 'John Deere 8430', plate: 'АВ 1934', driver: 'Иванов Сергей', time: '07:30–11:15', duration: '3 ч 45 мин', operation: 'Культивация', implement: 'КПС-8', width: 8, net: 40.15, overlap: 1.12, status: 'pending', season: '2026' },
  { id: 3, field: 3, date: '2026-10-01', machine: 'МТЗ-1523', plate: 'АВ 7102', driver: 'Петров Николай', time: '09:10–13:20', duration: '4 ч 10 мин', operation: 'Химобработка (гербициды)', implement: 'Amazone UX 4200', width: 24, net: 73.61, overlap: 3.4, status: 'pending', season: '2026' },
  { id: 4, field: 15, date: '2026-10-01', machine: 'Кировец К-742', plate: 'АВ 3396', driver: 'Смирнов Андрей', time: '08:00–11:45', duration: '3 ч 45 мин', operation: 'Вспашка', implement: 'ППО-8-40', width: 3.2, net: 34.22, overlap: 1.08, status: 'pending', season: '2026' },
  { id: 5, field: 6, date: '2026-10-01', machine: 'John Deere 8430', plate: 'АВ 1934', driver: 'Иванов Сергей', time: '13:00–17:40', duration: '4 ч 40 мин', operation: 'Культивация', implement: 'КПС-8', width: 8, net: 87.34, overlap: 2.01, status: 'confirmed', finalArea: 87.34, season: '2026', material: '', rate: 0 },
  { id: 6, field: 21, date: '2026-10-01', machine: 'МТЗ-3022', plate: 'АВ 4821', driver: 'Ковалёв Александр', time: '13:30–18:10', duration: '4 ч 40 мин', operation: 'Сев', implement: 'Horsch Pronto 6 DC', width: 6, net: 51.2, overlap: 1.3, status: 'confirmed', finalArea: 51.2, season: '2026', material: 'Пшеница · Элегия', rate: 220, unit: 'кг' },
  { id: 7, field: 8, date: '2026-09-30', machine: 'МТЗ-1523', plate: 'АВ 7102', driver: 'Петров Николай', time: '08:00–11:20', duration: '3 ч 20 мин', operation: 'Химобработка (гербициды)', implement: 'Amazone UX 4200', width: 24, net: 41.1, overlap: .8, status: 'confirmed', finalArea: 41.1, season: '2026', material: 'СЗР · демо-препарат', rate: 1.2, unit: 'л' },
];
let works = structuredClone(initialWorks);
let projectMachines = structuredClone(AuroraFleet.initialProjectMachines);
try {
  const saved = JSON.parse(localStorage.getItem('aurora-agro-demo-v1') || 'null');
  if (saved?.works && Array.isArray(saved.works) && saved.works.length === initialWorks.length) works = saved.works;
  if (saved?.rotation) fields.forEach(f => { if (saved.rotation[f.id]) f.rotation = saved.rotation[f.id]; });
  if (Array.isArray(saved?.projectMachines) && saved.projectMachines.length >= AuroraFleet.initialProjectMachines.length) projectMachines = AuroraFleet.normalizeProjectMachines(saved.projectMachines);
} catch { /* В приватном режиме макет продолжает работать без сохранения. */ }
// Однозначные переименования старого демо. Обобщённые виды требуют уточнения.
works.forEach(w => { w.operation = ({ 'Посев': 'Сев', 'Пахота': 'Вспашка' })[w.operation] || w.operation; });
let page = 'operations', season = '2026', date = '2026-10-01', status = 'pending', selected = 1, step = 'settings';
let draft = null, result = null, areaMode = 'calculated', manualArea = '', fieldSelected = 12, zoom = 1;
let workQuery = '', fieldQuery = '', reportKind = 'director', reportDateFrom = '2026-10-01', reportDateTo = '2026-10-01';
let reportGroup = 'field', reportMaterial = true, reportOverlap = false, visibleSeasons = [2024, 2025, 2026];
let drawing = false, drawPoints = [];
const main = $('#main');
const mockupVersion = window.AURORA_MOCKUP_VERSION || 'локально';
$('#prototype-version').textContent = `MVP · ${mockupVersion}`;
if (mockupVersion !== 'локально') {
  $('#prototype-version').href = `https://github.com/NikolayNN/agro/releases/tag/${encodeURIComponent(mockupVersion)}`;
}
// Скоупы Aurora DS: оформление и плотность независимы от хозяйственных данных.
function applyAppearance(appearance, density) {
  document.body.dataset.dsAppearance = appearance;
  document.body.dataset.dsDensity = density;
  const dark = appearance === 'dark', compact = density === 'compact';
  $('#appearance').setAttribute('aria-label', dark ? 'Включить светлое оформление' : 'Включить тёмное оформление');
  $('#appearance').setAttribute('aria-pressed', String(dark));
  $('#appearance').title = dark ? 'Светлое оформление' : 'Тёмное оформление';
  $('#appearance .ds-symbol').textContent = dark ? 'light_mode' : 'dark_mode';
  $('#density').setAttribute('aria-label', compact ? 'Включить комфортную плотность' : 'Включить компактную плотность');
  $('#density').setAttribute('aria-pressed', String(compact));
  $('#density').title = compact ? 'Комфортная плотность' : 'Компактная плотность';
  $('#density .ds-symbol').textContent = compact ? 'density_medium' : 'density_small';
  document.querySelector('meta[name="theme-color"]').content = getComputedStyle(document.body).getPropertyValue('--ds-header-bg').trim();
}
try {
  const prefs = JSON.parse(localStorage.getItem('aurora-agro-appearance') || '{}');
  applyAppearance(prefs.appearance === 'dark' ? 'dark' : 'light', prefs.density === 'compact' ? 'compact' : 'cozy');
} catch { applyAppearance('light','cozy'); }
function saveAppearance() { try { localStorage.setItem('aurora-agro-appearance', JSON.stringify({appearance:document.body.dataset.dsAppearance,density:document.body.dataset.dsDensity})); } catch {} }
$('#appearance').onclick = () => { applyAppearance(document.body.dataset.dsAppearance === 'dark' ? 'light' : 'dark', document.body.dataset.dsDensity); saveAppearance(); };
$('#density').onclick = () => { applyAppearance(document.body.dataset.dsAppearance, document.body.dataset.dsDensity === 'compact' ? 'cozy' : 'compact'); saveAppearance(); };
function decorateFields() { $$('input:not([type=checkbox]):not([type=radio]):not([type=range]),select').forEach(el => el.dataset.dsField = 'default'); }
new MutationObserver(decorateFields).observe(document.body, {childList:true,subtree:true});
decorateFields();
const getField = id => fields.find(f => f.id === Number(id));
const currentWork = () => works.find(w => w.id === selected);
const currentCrop = (f, year = season) => f.rotation[year] || '';
const cropTag = crop => crop ? `<span class="crop"><i style="background:${cropInks[crop]}"></i>${esc(crop)}</span>` : '<span class="hint">Не назначена</span>';
const options = (values, selectedValue) => values.map(v => `<option value="${esc(v)}" ${String(v) === String(selectedValue) ? 'selected' : ''}>${esc(v || 'Не назначена')}</option>`).join('');
function persist() {
  try { localStorage.setItem('aurora-agro-demo-v1', JSON.stringify({ works, rotation: Object.fromEntries(fields.map(f => [f.id, f.rotation])), projectMachines })); }
  catch { toast('Изменения действуют в текущей вкладке: сохранение браузером недоступно.'); }
}
let toastTimer;
function toast(text) { $('#toast').textContent = text; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4300); }
function modal(title, content, setup) {
  $('#dialog-content').innerHTML = `<div class="modal-head"><h2>${esc(title)}</h2><button class="close" aria-label="Закрыть"><span class="ds-symbol" aria-hidden="true">close</span></button></div>${content}`;
  $('#dialog .close').onclick = () => $('#dialog').close();
  $('#dialog').showModal();
  if (setup) setup();
}
function heading(title, subtitle, action = '') { return `<div class="page-heading"><div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`; }
function button(text, id, primary = false, iconName = '') { return `<button class="btn ${primary ? 'primary' : ''}" id="${id}">${iconName ? icon(iconName) : ''}${text}</button>`; }
function searchBox(id, placeholder, value = '') { return `<div class="search">${icon('search')}<input type="search" id="${id}" placeholder="${placeholder}" aria-label="${placeholder}" value="${esc(value)}"></div>`; }
function initDraft() {
  const w = currentWork();
  draft = w ? { ...w } : null;
  result = null; step = 'settings'; areaMode = 'calculated'; manualArea = ''; zoom = 1;
}
function filteredWorks() { return works.filter(w => w.date === date && String(w.season) === season && (status === 'all' || w.status === status) && `${getField(w.field).name} ${w.machine} ${w.driver}`.toLowerCase().includes(workQuery.toLowerCase())); }
function statusBadge(w) { return `<span class="badge ${w.status === 'confirmed' ? 'green' : w.status === 'rejected' ? 'gray' : ''}">${w.status === 'confirmed' ? '✓ Подтверждена' : w.status === 'rejected' ? 'Отклонена' : 'Ждёт расчёта'}</span>`; }
function updateNav() {
  const titles = { operations: 'Операции', fields: 'Поля', rotation: 'Севооборот', reports: 'Отчёты', directory: 'Справочники' };
  const directory = directoryCards.find(card => page === `directory/${card.id}`);
  const editingMachine = machineFromEditRoute();
  $('#breadcrumb').innerHTML = editingMachine ? `<a href="#directory">Справочники</a><span>/</span><a href="#directory/machines">Техника</a><span>/</span>${esc(editingMachine.name)}` : directory ? `<a href="#directory">Справочники</a><span>/</span>${directory.title}` : titles[page];
  document.title = `${editingMachine ? editingMachine.name : directory?.title || titles[page]} — Аврора Агро`;
  $$('nav a').forEach(a => { const active = a.dataset.page === page || (a.dataset.page === 'directory' && (!!directory || !!editingMachine)); a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#pending-count').textContent = works.filter(w => w.status === 'pending' && String(w.season) === season).length;
}
function render() {
  updateNav();
  if (machineFromEditRoute()) renderMachineEditorPage();
  else if (page.startsWith('directory/')) renderDirectoryPage();
  else ({ operations: renderOperations, fields: renderFields, rotation: renderRotation, reports: renderReports, directory: renderDirectory })[page]();
}
function mapMarkup(field, calculated = false, tracks = true) {
  const trackLines = Array.from({ length: 21 }, (_, i) => { const x = 180 + i * 15; return `<path d="M${x} 145V422"/>`; }).join('');
  const turns = Array.from({ length: 20 }, (_, i) => { const x = 180 + i * 15, y = i % 2 ? 145 : 422; return `<path d="M${x} ${y}Q${x + 7.5} ${y + (i % 2 ? -17 : 17)} ${x + 15} ${y}"/>`; }).join('');
  return `<div class="map-panel ${drawing ? 'drawing' : ''}">
    <svg class="map-art ${calculated ? 'calculated' : ''}" id="field-map" viewBox="0 0 700 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Демонстрационная схема поля ${esc(field.name)}${tracks ? ' и GPS-трека' : ''}">
      <defs><pattern id="rows" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(15)"><rect width="7" height="7" fill="#b4c095"/><path d="M0 0V7" stroke="#859a6e" stroke-width="2" opacity=".28"/></pattern><pattern id="rows2" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(-22)"><rect width="9" height="9" fill="#c6bd8b"/><path d="M0 0V9" stroke="#9e9663" stroke-width="2" opacity=".27"/></pattern><pattern id="trees" patternUnits="userSpaceOnUse" width="22" height="25"><rect width="22" height="25" fill="#789273"/><circle cx="5" cy="7" r="9" fill="#627e60"/><circle cx="19" cy="22" r="8" fill="#869e78"/><circle cx="17" cy="8" r="5" fill="#547452" opacity=".65"/></pattern><clipPath id="field-clip"><path d="M161 125 503 102 541 347 439 451 195 461 142 333Z"/></clipPath><filter id="texture"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
      <g id="map-world" transform="translate(350 280) scale(${zoom}) translate(-350 -280)">
        <rect width="700" height="560" fill="#c7d0ac"/><g filter="url(#texture)"><path d="M0 0H328L305 76 120 91 90 262 0 240Z" fill="url(#rows2)"/><path d="M353 0H700V176L559 162 535 65 330 76Z" fill="url(#rows)"/><path d="M0 273 90 286 117 451 79 560H0Z" fill="url(#trees)"/><path d="m548 191 152 6v291l-118-67-44-66Z" fill="url(#rows2)"/><path d="m166 486 288-8 92-85 41 71 113 54v42H118Z" fill="url(#rows)"/><path d="M161 125 503 102 541 347 439 451 195 461 142 333Z" fill="url(#rows)"/><path d="M115-10 132 48 103 162 117 293 142 463 101 570" fill="none" stroke="#81956c" stroke-width="28"/><path d="M115-10 132 48 103 162 117 293 142 463 101 570" fill="none" stroke="#e6dfbb" stroke-width="13"/><path d="M105 91 331 86 521 82 559 177 715 185" fill="none" stroke="#e1ddba" stroke-width="10"/><path d="m144 477 308-8 106-105 155 55" fill="none" stroke="#e4ddbc" stroke-width="11"/><path d="M536 0 546 50 594 73 627 131 670 143 710 113" fill="none" stroke="#96b5aa" stroke-width="19"/><path d="M0 71 68 93 80 161 55 207 0 196Z" fill="url(#trees)"/><path d="m562 464 70 12 68 42v42H533Z" fill="url(#trees)"/></g>
        <path d="M161 125 503 102 541 347 439 451 195 461 142 333Z" fill="#6d984920" stroke="#f1f9d6" stroke-width="5"/><path d="M161 125 503 102 541 347 439 451 195 461 142 333Z" fill="none" stroke="#3c713b" stroke-width="2"/>
        ${tracks ? `<g clip-path="url(#field-clip)"><g class="coverage-layer"><path d="M173 139H499V430H173Z" fill="#86b957" opacity=".5"/><path d="M197 150V418M377 147V426" stroke="#e7b354" stroke-width="13" opacity=".85"/><path d="m496 109 31 144-24 128-17-249Z" fill="#d58d63" opacity=".8"/></g><g class="track-layer" stroke="#f5f8ce" fill="none" stroke-width="2.3">${trackLines}${turns}</g><path d="M180 148v104" fill="none" stroke="#285c3e" stroke-width="4"/><circle cx="180" cy="251" r="8" fill="#fff"/><circle cx="180" cy="251" r="4" fill="#285c3e"/></g>` : ''}
        <text class="map-label" x="595" y="310">№ 08</text><text class="map-label" x="341" y="530">№ 21</text>
      </g><g id="draw-layer"></g>
    </svg>
    <div class="map-title"><span class="field-symbol">${icon('fields')}</span><div><strong>№ ${field.id} · ${esc(field.name)}</strong><small>${fmt(field.area)} га · ${esc(currentCrop(field) || 'Культура не назначена')}</small></div></div>
    <div class="map-tools"><button data-zoom="in" aria-label="Увеличить карту">+</button><button data-zoom="out" aria-label="Уменьшить карту">−</button><button data-zoom="reset" aria-label="Вернуть масштаб">⌖</button></div>
    <div class="map-field-chip">${esc(field.name)}<small>${fmt(field.area)} га</small></div><div class="map-caption">Схема поля · демонстрационные данные</div>
    <div class="map-bottom"><div class="map-legend"><span class="legend-item"><i></i>Контур поля</span>${tracks ? '<span class="legend-item"><i style="background:#9dbb79"></i>GPS-трек</span><span class="legend-item"><i class="yellow"></i>Перекрытия</span><span class="legend-item"><i class="red"></i>Пропуски</span>' : '<span class="legend-item">Условное расположение</span>'}</div><span class="map-scale">Схема</span></div>
    ${drawing ? '<div class="drawing-toolbar"><p id="draw-hint">Отметьте углы на схеме (не менее трёх). Контур не является географическими данными.</p><div class="row"><button class="btn primary" id="finish-draw">Замкнуть контур</button><button class="btn" id="cancel-draw">Отмена</button></div></div>' : ''}
  </div>`;
}
function bindMap() {
  $$('[data-zoom]').forEach(b => b.onclick = () => {
    zoom = b.dataset.zoom === 'reset' ? 1 : Math.min(2, Math.max(.7, zoom + (b.dataset.zoom === 'in' ? .15 : -.15)));
    $('#map-world').setAttribute('transform', `translate(350 280) scale(${zoom}) translate(-350 -280)`);
  });
}
function renderOperations() {
  const dayWorks = works.filter(w => w.date === date && String(w.season) === season), pending = dayWorks.filter(w => w.status === 'pending'), confirmed = dayWorks.filter(w => w.status === 'confirmed');
  const list = filteredWorks();
  if (!list.some(w => w.id === selected)) { selected = list[0]?.id ?? null; initDraft(); }
  if (!draft && currentWork()) initDraft();
  const total = confirmed.reduce((sum, w) => sum + w.finalArea, 0);
  main.innerHTML = `${heading('Полевые операции', 'От GPS-трека до подтверждённых гектаров — в одном окне.', button('Обновить треки', 'sync', false, 'sync'))}
    <div class="stats"><div class="stat"><div class="stat-head">Обнаружено работ${icon('operations')}</div><div class="stat-value">${dayWorks.length}<span>за день</span></div><div class="stat-foot">${new Set(dayWorks.map(w => w.machine)).size} единицы техники</div></div><div class="stat"><div class="stat-head">Ожидают проверки${icon('clock')}</div><div class="stat-value">${pending.length}<span>работы</span></div><div class="stat-foot">Готовы к расчёту площади</div></div><div class="stat"><div class="stat-head">Подтверждено${icon('check')}</div><div class="stat-value">${confirmed.length}<span>работы</span></div><div class="stat-foot accent">Включены в отчёты</div></div><div class="stat"><div class="stat-head">Учтённая площадь${icon('fields')}</div><div class="stat-value">${fmt(total)}<span>га</span></div><div class="stat-foot">По подтверждённым работам</div></div></div>
    <div class="tabs" aria-label="Статусы работ">${[['pending','К проверке'],['confirmed','Подтверждённые'],['all','Все операции']].map(([key, title]) => `<button data-status="${key}" class="${status === key ? 'active' : ''}" aria-pressed="${status === key}">${title}<b>${key === 'all' ? dayWorks.length : dayWorks.filter(w => w.status === key).length}</b></button>`).join('')}</div>
    <div class="toolbar"><div class="row"><input id="work-date" type="date" aria-label="Дата работ" value="${date}">${searchBox('work-search','Поле, техника или механизатор',workQuery)}</div><span class="hint">${icon('sync').replace('class="icon"','class="icon" style="display:inline;width:12px;height:12px;vertical-align:middle;margin-right:5px"')}Демо-треки за 30 сентября и 1 октября</span></div>
    ${currentWork() ? `<div class="workspace">${mapMarkup(getField(currentWork().field), !!result || currentWork().status === 'confirmed')}<section class="editor" aria-label="Подтверждение работы">${editorMarkup()}</section></div>` : '<div class="empty table-panel">За выбранную дату и сезон подходящих работ нет.<br>Демо-данные доступны за 30 сентября и 1 октября 2026 года.</div>'}
    <section class="table-panel"><div class="panel-title"><h2>Работы за день <span class="hint">&nbsp; ${list.length}</span></h2><span class="hint">Выберите работу для просмотра</span></div><div class="table-scroll"><table><thead><tr><th>Поле / культура</th><th>Техника</th><th>Время работы</th><th>Площадь поля</th><th>Статус</th><th></th></tr></thead><tbody>${list.map(w => `<tr class="clickable ${w.id === selected ? 'selected' : ''}" data-work="${w.id}"><td><span class="field-no">${String(w.field).padStart(2,'0')}</span><strong>${esc(getField(w.field).name)}</strong><small>${esc(currentCrop(getField(w.field), w.season) || 'Культура не назначена')}</small></td><td>${esc(w.machine)}<small>${esc(w.driver)}</small></td><td>${w.time}<small>${w.duration}</small></td><td>${fmt(getField(w.field).area)} га</td><td>${statusBadge(w)}</td><td><button class="table-button" aria-label="Открыть работу ${esc(getField(w.field).name)}">${icon('arrow')}</button></td></tr>`).join('') || '<tr><td colspan="6" class="empty">Работы не найдены</td></tr>'}</tbody></table></div></section>`;
  $('#sync').onclick = () => toast('Демо-треки актуальны. Подключение к Авроре GPS появится в рабочей версии.');
  $$('[data-status]').forEach(b => b.onclick = () => { status = b.dataset.status; renderOperations(); });
  $('#work-date').onchange = e => { date = e.target.value; renderOperations(); };
  $('#work-search').oninput = e => { workQuery = e.target.value; const pos = e.target.selectionStart; renderOperations(); $('#work-search').focus(); $('#work-search').setSelectionRange(pos,pos); };
  $$('[data-work]').forEach(row => row.onclick = () => { selected = Number(row.dataset.work); initDraft(); renderOperations(); });
  if (currentWork()) { bindMap(); bindEditor(); }
}
function editorMarkup() {
  const w = currentWork(), f = getField(w.field);
  const header = `<div class="editor-title"><span class="eyebrow">Работа № ${String(w.id).padStart(3,'0')}</span>${statusBadge(w)}</div><h2>${esc(w.machine)} <span class="hint">${w.plate}</span></h2><div class="machine-line">${icon('clock')}<span>${w.time}</span><span>${w.duration}</span></div>`;
  if (w.status !== 'pending') return `${header}<div class="saved-message">${icon(w.status === 'confirmed' ? 'check' : 'help')}<h2>${w.status === 'confirmed' ? 'Работа подтверждена' : 'Работа отклонена'}</h2><p>${w.status === 'confirmed' ? `${esc(w.operation)} · ${fmt(w.finalArea)} га<br>${esc(w.material || 'Материалы не использовались')}${w.material ? ` · ${fmt(w.finalArea*w.rate)} ${esc(w.unit)}` : ''}<br>Сезон ${esc(w.season)} · ${esc(currentCrop(f,w.season) || 'Культура не назначена')}` : 'Эта работа не включена в отчёты.'}</p></div><div class="actions">${button('Вернуть к проверке','reopen')}${w.status === 'confirmed' ? button('Открыть отчёт','open-report',true) : ''}</div><p class="calculate-note">Данные сохранены в этом браузере.</p>`;
  return `${header}<div class="step-line"><span class="${step === 'settings' ? 'current' : ''}">1. Параметры</span><i></i><span class="${step === 'area' ? 'current' : ''}">2. Площадь</span><i></i><span class="${step === 'materials' ? 'current' : ''}">3. Материалы</span></div>
    ${step === 'settings' ? `<div class="form-grid"><div class="full operation-picker"><label for="operation">Технологическая операция</label><div class="operation-control"><input id="operation" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="operation-options" autocomplete="off" required placeholder="Выберите или найдите операцию" value="${esc(draft.operation)}"><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span></div><div id="operation-options" class="operation-options" role="listbox" aria-label="Технологические операции" hidden></div><span id="operation-search-status" class="visually-hidden" role="status" aria-live="polite"></span></div><label class="full">Прицепное орудие<select id="implement">${options(['Horsch Pronto 6 DC','КПС-8','Amazone UX 4200','ППО-8-40'],draft.implement)}</select><span class="width-note">Ширина захвата: <strong id="width-text">${fmt(draft.width,1)} м</strong></span></label><label>Механизатор<input id="driver" value="${esc(draft.driver)}" required></label><label>Сезон<select id="work-season">${options(['2025','2026','2027'],draft.season)}</select></label><div class="full width-note">${icon('leaf')}<span id="draft-crop">${esc(currentCrop(f,draft.season) || 'Культура не назначена')} · из севооборота</span></div></div><p class="calculate-note">Расчёт покажет чистую площадь, пропуски и перекрытия. В макете используются демонстрационные показатели.</p><div class="actions">${button('Запустить расчёт','calculate',true,'play')}</div>` : ''}
    ${step === 'area' ? `<div class="calculation"><span class="eyebrow">Чистая обработанная площадь · демо</span><div class="big-number">${fmt(result.net)} <small>га</small></div><div class="calculation-details"><div>Площадь поля<strong>${fmt(f.area)} га</strong></div><div>Перекрытия<strong>${fmt(result.overlap)} га</strong></div><div>Пропуски<strong>${fmt(result.gaps)} га</strong></div></div></div><h3>Какую площадь учесть?</h3><div class="area-choices">${[['calculated',`Расчётную · ${fmt(result.net)} га`],['field',`До площади поля · ${fmt(f.area)} га`],['manual','Ввести вручную']].map(([value,title]) => `<label class="choice"><input type="radio" name="area-mode" value="${value}" ${areaMode === value ? 'checked' : ''}>${title}</label>`).join('')}</div><label id="manual-area-label" ${areaMode !== 'manual' ? 'hidden' : ''}>Площадь, га<input id="manual-area" type="number" min="0.01" max="100000" step="0.01" value="${esc(manualArea)}"></label><p class="calculate-note">Перекрытия показаны отдельно. При повторном проходе или смещении трекера проверьте результат перед учётом.</p><div class="actions">${button('Назад','back-settings')}${button('Подтвердить площадь','accept-area',true)}</div>` : ''}
    ${step === 'materials' ? `<div class="calculation"><span class="eyebrow">Площадь к учёту</span><div class="big-number">${fmt(draft.finalArea)} <small>га</small></div><span class="hint">${esc(draft.operation)} · сезон ${esc(draft.season)}</span></div><div class="materials-box"><h3>Использованные материалы</h3><div class="form-grid"><label class="full">Материал<select id="material">${options(['','Пшеница · Элегия','Удобрение · NPK 16:16:16','СЗР · демо-препарат'],draft.material || '')}</select></label><label>Норма на гектар<input id="rate" type="number" min="0.001" max="100000" step="any" value="${draft.rate || ''}" placeholder="Например, 220" ${!draft.material ? 'disabled' : ''}></label><label>Единица измерения<select id="unit" ${!draft.material ? 'disabled' : ''}>${options(['кг','л','т'],draft.unit || 'кг')}</select></label></div><div class="amount"><span>Всего материала</span><strong id="material-total">${draft.material ? `${fmt(draft.finalArea*(draft.rate || 0))} ${esc(draft.unit || 'кг')}` : 'Без материалов'}</strong></div></div><div class="actions">${button('Назад','back-area')}${button('Подтвердить работу','confirm-work',true,'check')}</div>` : ''}
    <div class="actions">${button('Отклонить работу','reject',false)}</div>`;
}
function redrawEditor() { $('.editor').innerHTML = editorMarkup(); bindEditor(); $('#field-map').classList.toggle('calculated',!!result); }
function bindOperationPicker() {
  const input = $('#operation');
  if (!input) return;
  const list = $('#operation-options');
  let matches = [], active = -1;
  const validate = () => input.setCustomValidity(systemOperations.includes(draft.operation) ? '' : 'Выберите операцию из списка.');
  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    input.value = draft.operation;
    validate();
  };
  const highlight = () => {
    [...list.querySelectorAll('[role="option"]')].forEach((item, i) => item.classList.toggle('active', i === active));
    if (active < 0) { input.removeAttribute('aria-activedescendant'); return; }
    input.setAttribute('aria-activedescendant', `operation-option-${active}`);
    list.children[active].scrollIntoView({ block: 'nearest' });
  };
  const open = (query = '') => {
    matches = systemOperations.filter(name => name.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
    active = -1;
    list.innerHTML = matches.length ? matches.map((name, i) => `<div id="operation-option-${i}" role="option" aria-selected="${name === draft.operation}" data-index="${i}">${esc(name)}</div>`).join('') : '<div class="operation-empty">Ничего не найдено</div>';
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.removeAttribute('aria-activedescendant');
    $('#operation-search-status').textContent = matches.length ? `Найдено операций: ${matches.length}` : 'Ничего не найдено';
  };
  const choose = index => {
    if (!matches[index]) return;
    draft.operation = matches[index];
    close();
  };
  input.onfocus = () => { open(); input.select(); };
  input.onclick = () => { if (list.hidden) { open(); input.select(); } };
  input.oninput = () => open(input.value);
  input.onblur = close;
  input.onkeydown = event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (list.hidden) open();
      if (!matches.length) return;
      active = event.key === 'ArrowDown' ? (active + 1) % matches.length : (active <= 0 ? matches.length - 1 : active - 1);
      highlight();
    } else if (event.key === 'Enter' && !list.hidden) {
      event.preventDefault();
      if (active >= 0) choose(active);
      else if (matches.length === 1) choose(0);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };
  list.onpointerdown = event => event.preventDefault();
  list.onclick = event => {
    const option = event.target.closest('[data-index]');
    if (option) choose(Number(option.dataset.index));
  };
  validate();
}
function bindEditor() {
  if ($('#reopen')) $('#reopen').onclick = () => { currentWork().status = 'pending'; persist(); status = 'pending'; initDraft(); render(); toast('Работа возвращена к проверке'); };
  if ($('#open-report')) $('#open-report').onclick = () => { reportDateFrom = date; reportDateTo = date; location.hash = 'reports'; };
  bindOperationPicker();
  if ($('#implement')) $('#implement').onchange = e => { draft.implement = e.target.value; draft.width = { 'Horsch Pronto 6 DC':6,'КПС-8':8,'Amazone UX 4200':24,'ППО-8-40':3.2 }[draft.implement]; $('#width-text').textContent = `${fmt(draft.width,1)} м`; };
  if ($('#driver')) $('#driver').oninput = e => draft.driver = e.target.value;
  if ($('#work-season')) $('#work-season').onchange = e => { draft.season = e.target.value; $('#draft-crop').textContent = `${currentCrop(getField(draft.field),draft.season) || 'Культура не назначена'} · из севооборота`; };
  if ($('#calculate')) $('#calculate').onclick = () => {
    if (!systemOperations.includes(draft.operation)) { $('#operation').reportValidity(); return; }
    if (!draft.driver.trim()) { $('#driver').reportValidity(); return; }
    const original = initialWorks.find(w => w.id === draft.id), f = getField(draft.field), ratio = draft.width/original.width;
    const net = Math.min(f.area, +(original.net * ratio).toFixed(2));
    result = { net, overlap: +(original.overlap * ratio).toFixed(2), gaps: +(f.area-net).toFixed(2) }; step = 'area'; redrawEditor();
  };
  $$('[name="area-mode"]').forEach(input => input.onchange = e => { areaMode = e.target.value; $('#manual-area-label').hidden = areaMode !== 'manual'; });
  if ($('#manual-area')) $('#manual-area').oninput = e => manualArea = e.target.value;
  if ($('#back-settings')) $('#back-settings').onclick = () => { step = 'settings'; result = null; redrawEditor(); };
  if ($('#accept-area')) $('#accept-area').onclick = () => {
    const area = areaMode === 'calculated' ? result.net : areaMode === 'field' ? getField(draft.field).area : Number(manualArea);
    if (!Number.isFinite(area) || area <= 0 || area > 100000) { toast('Введите площадь больше 0 и не более 100 000 га.'); $('#manual-area').focus(); return; }
    draft.finalArea = area; draft.material = draft.material || ''; step = 'materials'; redrawEditor();
  };
  if ($('#back-area')) $('#back-area').onclick = () => { step = 'area'; redrawEditor(); };
  const updateMaterial = () => {
    draft.material = $('#material').value; draft.rate = Number($('#rate').value); draft.unit = $('#unit').value;
    $('#rate').disabled = !draft.material; $('#unit').disabled = !draft.material;
    $('#material-total').textContent = draft.material ? `${fmt(draft.finalArea * (draft.rate || 0))} ${draft.unit}` : 'Без материалов';
  };
  if ($('#material')) $('#material').onchange = updateMaterial;
  if ($('#rate')) $('#rate').oninput = updateMaterial;
  if ($('#unit')) $('#unit').onchange = updateMaterial;
  if ($('#confirm-work')) $('#confirm-work').onclick = () => {
    updateMaterial();
    if (draft.material && (!Number.isFinite(draft.rate) || draft.rate <= 0 || draft.rate > 100000)) { toast('Укажите положительную норму внесения до 100 000.'); $('#rate').focus(); return; }
    const name = getField(draft.field).name;
    Object.assign(currentWork(), draft, result, { status: 'confirmed' }); persist(); updateNav(); renderOperations(); toast(`«${name}»: работа подтверждена и включена в отчёт`);
  };
  if ($('#reject')) $('#reject').onclick = () => { currentWork().status = 'rejected'; persist(); updateNav(); renderOperations(); toast('Работа отклонена. Вернуть её можно во вкладке «Все операции».'); };
}
function renderFields() {
  const filtered = fields.filter(f => `${f.name} ${f.id}`.toLowerCase().includes(fieldQuery.toLowerCase()));
  const f = getField(fieldSelected);
  main.innerHTML = `${heading('Поля хозяйства', `${fields.length} полей · ${fmt(fields.reduce((sum,f) => sum + f.area,0))} га учётной площади`, `<div class="row">${button('Импорт полей','import-fields',false,'download')}${button('Нарисовать поле','draw-field',true,'plus')}</div>`)}<div class="fields-layout"><div class="field-list">${searchBox('field-search','Название или номер поля',fieldQuery)}${filtered.map(field => `<button class="field-card ${field.id === fieldSelected ? 'active' : ''}" data-field="${field.id}"><strong><span class="field-no">${String(field.id).padStart(2,'0')}</span>${esc(field.name)}</strong><small>Учётная площадь ${fmt(field.area)} га</small><div class="row">${cropTag(currentCrop(field))}<span>↗</span></div></button>`).join('') || '<p class="empty">Поля не найдены</p>'}</div>${mapMarkup(f,false,false)}</div><div class="culture-legend">Культуры сезона ${season}: ${crops.filter(Boolean).map(c => `<button data-crop-filter="${esc(c)}"><i style="background:${cropColors[c]}"></i>${c}</button>`).join('')}</div><p class="section-note">Схема показывает сценарий работы с контурами. Географическая подложка и импорт KML, KMZ, SHP будут подключены в рабочей версии.</p>`;
  bindMap();
  $$('[data-field]').forEach(b => b.onclick = () => { fieldSelected = Number(b.dataset.field); drawing = false; drawPoints = []; renderFields(); });
  $('#field-search').oninput = e => { fieldQuery = e.target.value; renderFields(); $('#field-search').focus(); };
  $$('[data-crop-filter]').forEach(b => {
    b.onmouseenter = () => $$('[data-field]').forEach(card => card.style.opacity = currentCrop(getField(card.dataset.field)) === b.dataset.cropFilter ? '1' : '.35');
    b.onmouseleave = () => $$('[data-field]').forEach(card => card.style.opacity = '1');
    b.onclick = () => { const match = fields.find(f => currentCrop(f) === b.dataset.cropFilter); if (match) { fieldSelected = match.id; renderFields(); } else toast('В этом сезоне полей с такой культурой нет'); };
  });
  $('#import-fields').onclick = () => modal('Импорт полей', '<p>В рабочей версии контуры загружаются из KML, KMZ или SHP. В этом макете можно проверить выбор файла; обработка геометрии не выполняется.</p><label>Файл с контурами<input type="file" id="contour-file" accept=".kml,.kmz,.shp"></label><p id="file-state" class="section-note">Файл останется на вашем компьютере.</p>', () => $('#contour-file').onchange = e => { $('#file-state').textContent = e.target.files[0] ? `Выбран файл: ${e.target.files[0].name}. Для импорта потребуется рабочая версия сервиса.` : 'Файл не выбран'; });
  $('#draw-field').onclick = () => { drawing = true; drawPoints = []; zoom = 1; renderFields(); };
  if (drawing) {
    $('#field-map').onclick = e => {
      const svg = $('#field-map'), p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
      const point = p.matrixTransform(svg.getScreenCTM().inverse()); drawPoints.push([Math.round(point.x),Math.round(point.y)]);
      $('#draw-layer').innerHTML = `<polyline points="${drawPoints.map(p=>p.join(',')).join(' ')}" fill="#21684822" stroke="#216848" stroke-width="3"/>${drawPoints.map(([x,y])=>`<circle class="draw-point" cx="${x}" cy="${y}" r="5"/>`).join('')}`;
      $('#draw-hint').textContent = `Отмечено точек: ${drawPoints.length}. ${drawPoints.length >= 3 ? 'Можно замкнуть контур.' : 'Добавьте ещё точки.'}`;
    };
    $('#cancel-draw').onclick = () => { drawing = false; renderFields(); };
    $('#finish-draw').onclick = () => {
      if (drawPoints.length < 3) return toast('Для контура нужны хотя бы три точки');
      $('#draw-layer').innerHTML = `<polygon points="${drawPoints.map(p=>p.join(',')).join(' ')}" fill="#21684844" stroke="#216848" stroke-width="3"/>`;
      $('#draw-hint').textContent = 'Демо-контур замкнут. Географическая площадь не рассчитывается; поле не добавлено в справочник.';
      $('#field-map').onclick = null; $('#finish-draw').disabled = true;
    };
  }
}
function renderRotation() {
  main.innerHTML = `${heading('Севооборот', 'История культур и план посевов — каждое поле в одной строке.', `<div class="row">${button('Сезоны','seasons',false,'layers')}${button('Выгрузить CSV','export-rotation',false,'download')}</div>`)}<div class="table-panel"><div class="panel-title"><h2>Культуры по сезонам</h2><span class="hint">Изменения сохраняются автоматически</span></div><div class="table-scroll"><table class="rotation-table"><thead><tr><th>Поле</th><th>Площадь, га</th>${visibleSeasons.map(y=>`<th>Сезон ${y}${String(y)===season ? ' · текущий' : ''}</th>`).join('')}</tr></thead><tbody>${fields.map(f=>`<tr><td><button class="table-button" data-rotation-field="${f.id}"><span class="field-no">${String(f.id).padStart(2,'0')}</span>${esc(f.name)}</button></td><td>${fmt(f.area)}</td>${visibleSeasons.map(y=>`<td><select data-rotation="${f.id}:${y}" aria-label="${esc(f.name)}, культура ${y}" style="background:${cropColors[f.rotation[y] || '']}">${options(crops,f.rotation[y] || '')}</select></td>`).join('')}</tr>`).join('')}</tbody></table></div></div><p class="section-note">Культура автоматически подставляется в операции и отчёты выбранного сезона. Пустая ячейка означает, что культура не назначена.</p><div class="culture-legend">${crops.filter(Boolean).map(c=>`<span class="legend-item"><i style="background:${cropColors[c]}"></i>${c}</span>`).join('')}</div>`;
  $$('[data-rotation]').forEach(select => select.onchange = e => { const [id,year] = select.dataset.rotation.split(':'); getField(id).rotation[year] = e.target.value; select.style.background = cropColors[e.target.value]; persist(); toast('Культура сохранена и обновлена в операциях'); });
  $$('[data-rotation-field]').forEach(b=>b.onclick=()=>{fieldSelected=Number(b.dataset.rotationField);location.hash='fields';});
  $('#seasons').onclick = () => modal('Отображаемые сезоны', `<p>Выберите годы для таблицы и выгрузки.</p>${[2024,2025,2026,2027].map(y=>`<label class="choice"><input type="checkbox" name="visible-season" value="${y}" ${visibleSeasons.includes(y)?'checked':''}>${y}</label>`).join('')}<div class="actions">${button('Применить','apply-seasons',true)}</div>`,()=>$('#apply-seasons').onclick=()=>{const years=$$('[name="visible-season"]:checked').map(i=>Number(i.value));if(!years.length)return toast('Выберите хотя бы один сезон');visibleSeasons=years;$('#dialog').close();renderRotation();});
  $('#export-rotation').onclick=()=>downloadCsv('Севооборот.csv', [['Поле','Площадь, га',...visibleSeasons],...fields.map(f=>[f.name,fmt(f.area),...visibleSeasons.map(y=>f.rotation[y]||'')])]);
}
function reportRows() { return works.filter(w => w.status === 'confirmed' && String(w.season) === season && w.date >= reportDateFrom && w.date <= reportDateTo); }
function reportColumns() {
  const cols = [{title:'Дата',value:w=>w.date},{title:'Поле',value:w=>getField(w.field).name},{title:'Операция',value:w=>w.operation},{title:'Площадь, га',value:w=>fmt(w.finalArea)}];
  if (reportKind !== 'director') cols.splice(2,0,{title:'Культура',value:w=>currentCrop(getField(w.field),w.season)},{title:'Техника',value:w=>w.machine},{title:'Механизатор',value:w=>w.driver});
  if (reportKind === 'agronomist' || (reportKind === 'custom' && reportMaterial)) cols.push({title:'Материал',value:w=>w.material || ''},{title:'Норма',value:w=>w.material ? `${fmt(w.rate)} ${w.unit}/га` : ''},{title:'Количество',value:w=>w.material ? `${fmt(w.finalArea*w.rate)} ${w.unit}` : ''});
  if (reportKind === 'custom' && reportOverlap) cols.push({title:'Перекрытия, га',value:w=>fmt(w.overlap)});
  return cols;
}
function reportGroups(rows) {
  if (reportKind !== 'custom') return [['',rows]];
  const groups = new Map();
  rows.forEach(w=>{const key=reportGroup==='field'?getField(w.field).name:reportGroup==='machine'?w.machine:w.operation;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(w);});
  return [...groups];
}
function renderReports() {
  const rows=reportRows(), cols=reportColumns(), groups=reportGroups(rows), total=rows.reduce((sum,w)=>sum+w.finalArea,0);
  main.innerHTML=`${heading('Отчёты по полевым работам','Только подтверждённые работы. Данные обновляются автоматически.',`<div class="row">${button('Печать / PDF','print-report',false,'reports')}${button('Выгрузить CSV','export-report',true,'download')}</div>`)}<div class="tabs">${[['director','Сводка руководителя'],['agronomist','Контроль агронома'],['custom','Свой отчёт']].map(([key,title])=>`<button data-report="${key}" class="${key===reportKind?'active':''}">${title}</button>`).join('')}</div><div class="toolbar"><div class="row"><label>С<input type="date" id="report-from" value="${reportDateFrom}"></label><label>По<input type="date" id="report-to" value="${reportDateTo}"></label><button class="btn" id="report-day">Демо-день</button><button class="btn" id="report-week">Демо-неделя</button></div><span class="hint">Сезон ${season}</span></div><div class="report-summary"><div><h2>Работа хозяйства в цифрах</h2><p>${rows.length} подтверждённых работ · ${new Set(rows.map(w=>w.field)).size} полей · ${new Set(rows.map(w=>w.machine)).size} единицы техники</p></div><div><strong>${fmt(total)} га</strong><small>Общая учтённая площадь работ</small></div></div><div class="table-panel">${reportKind==='custom'?`<div class="report-options row spread"><label class="row">Группировка <select id="report-group"><option value="field" ${reportGroup==='field'?'selected':''}>По полям</option><option value="machine" ${reportGroup==='machine'?'selected':''}>По технике</option><option value="operation" ${reportGroup==='operation'?'selected':''}>По операциям</option></select></label><div class="filter-group"><label><input type="checkbox" id="show-material" ${reportMaterial?'checked':''}>Материалы</label><label><input type="checkbox" id="show-overlap" ${reportOverlap?'checked':''}>Перекрытия</label></div></div>`:''}<div class="table-scroll"><table><thead><tr>${cols.map(c=>`<th>${c.title}</th>`).join('')}</tr></thead><tbody>${groups.map(([key,items])=>`${key?`<tr class="group-heading"><td colspan="${cols.length}">${esc(key)} · ${fmt(items.reduce((s,w)=>s+w.finalArea,0))} га</td></tr>`:''}${items.map(w=>`<tr>${cols.map(c=>`<td>${esc(c.value(w))}</td>`).join('')}</tr>`).join('')}`).join('') || `<tr><td colspan="${cols.length}" class="empty">Нет подтверждённых работ за этот период.<br>Подтвердите работу в разделе «Операции» или измените даты.</td></tr>`}</tbody><tfoot><tr class="report-total">${cols.map((c,i)=>`<td>${i===0?'Итого':c.title==='Площадь, га'?`${fmt(total)} га`:''}</td>`).join('')}</tr></tfoot></table></div></div><p class="section-note">CSV открывается в Excel. Выгрузка повторяет видимые столбцы и группировку; PDF доступен через диалог печати браузера.</p>`;
  $$('[data-report]').forEach(b=>b.onclick=()=>{reportKind=b.dataset.report;renderReports();});
  const changeDate = (which,value) => { if(!value)return; if(which==='from')reportDateFrom=value;else reportDateTo=value;if(reportDateFrom>reportDateTo){if(which==='from')reportDateTo=reportDateFrom;else reportDateFrom=reportDateTo;}renderReports(); };
  $('#report-from').onchange=e=>changeDate('from',e.target.value);$('#report-to').onchange=e=>changeDate('to',e.target.value);
  $('#report-day').onclick=()=>{reportDateFrom=reportDateTo='2026-10-01';renderReports();};$('#report-week').onclick=()=>{reportDateFrom='2026-09-28';reportDateTo='2026-10-04';renderReports();};
  if($('#report-group'))$('#report-group').onchange=e=>{reportGroup=e.target.value;renderReports();};
  if($('#show-material'))$('#show-material').onchange=e=>{reportMaterial=e.target.checked;renderReports();};
  if($('#show-overlap'))$('#show-overlap').onchange=e=>{reportOverlap=e.target.checked;renderReports();};
  $('#print-report').onclick=()=>window.print();
  $('#export-report').onclick=()=>{
    const data=[cols.map(c=>c.title)];groups.forEach(([key,items])=>{if(key)data.push(cols.map((_,i)=>i===0?`${key} · ${fmt(items.reduce((s,w)=>s+w.finalArea,0))} га`:''));items.forEach(w=>data.push(cols.map(c=>c.value(w))));});data.push(cols.map((c,i)=>i===0?'Итого':c.title==='Площадь, га'?fmt(total):''));downloadCsv('Полевые работы.csv',data);
  };
}
function downloadCsv(name, rows) {
  const safeCell = value => { let text=String(value??'');if(/^[=+\-@\t\r]/.test(text))text="'"+text;return '"'+text.replace(/"/g,'""')+'"'; };
  const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(safeCell).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Выгрузка CSV подготовлена');
}
const directoryCards = [
  {id:'machines',title:'Техника',icon:'tractor',description:'Машины, подключённые к этому хозяйству из корневого проекта.',detailTitle:'Госномер',get items(){return projectMachines.map(machine=>[machine.name,machine.plate,machine.type,machine.id]);}},
  {id:'implements',title:'Прицепные орудия',icon:'layers',description:'Ширина захвата используется при расчёте работ.',detailTitle:'Ширина захвата',items:[['Horsch Pronto 6 DC','6,0 м'],['КПС-8','8,0 м'],['Amazone UX 4200','24,0 м'],['ППО-8-40','3,2 м']]},
  {id:'crops',title:'Культуры',icon:'leaf',description:'Общий справочник для полей, севооборота и отчётов.',items:crops.filter(Boolean).map(c=>[c,''])},
  {id:'materials',title:'Материалы',icon:'directory',description:'Фиксируется применение. Складские остатки не ведутся.',detailTitle:'Тип · единица',items:[['Пшеница · Элегия','Семена · кг'],['Удобрение · NPK 16:16:16','Удобрения · кг'],['СЗР · демо-препарат','СЗР · л']]},
  {id:'operators',title:'Механизаторы',icon:'help',description:'Подставляются из GPS-данных; доступны для корректировки в работе.',items:[['Ковалёв Александр',''],['Иванов Сергей',''],['Петров Николай',''],['Смирнов Андрей','']]},
];
const recordCount = count => `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'запись' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'записи' : 'записей'}`;
const formatTrackerOffset = value => value === 0 ? 'По центру' : `${Math.abs(value).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} м ${value < 0 ? 'влево' : 'вправо'}`;
function machineFromEditRoute() {
  return projectMachines.find(machine => page === `directory/machines/${encodeURIComponent(machine.id)}/edit`);
}
function renderDirectory() {
  main.innerHTML=`${heading('Справочники','Общие данные хозяйства для всех разделов.')}<div class="directory-grid">${directoryCards.map(card=>`<a class="directory-card directory-link" href="#directory/${card.id}">${icon(card.icon)}<span class="directory-card-count">${recordCount(card.items.length)}</span><h2>${card.title}</h2><p>${card.description}</p><span class="directory-open">Открыть справочник ${icon('arrow')}</span></a>`).join('')}</div><p class="section-note">Технику можно добавить из корневого проекта. Остальные справочники доступны для просмотра. Технологические операции задаются на уровне системы.</p>`;
}
function renderDirectoryPage() {
  const card = directoryCards.find(item => page === `directory/${item.id}`);
  if (!card) return;
  const hasDetail = !!card.detailTitle;
  const isMachines = card.id === 'machines';
  const items = [...card.items].sort(([first], [second]) => first.localeCompare(second, 'ru', {numeric:true}));
  const columns = 1 + Number(hasDetail) + (isMachines ? 2 : 0);
  main.innerHTML=`${heading(card.title,card.description,isMachines?button('Добавить технику','add-machine',true,'plus'):'')}<div class="directory-toolbar"><a class="btn" href="#directory">← Все справочники</a>${searchBox('directory-search',`Поиск: ${card.title.toLowerCase()}`)}<span class="hint" id="directory-result-count">${recordCount(items.length)}</span></div><section class="table-panel"><div class="table-scroll"><table class="directory-table"><thead><tr><th>Наименование</th>${hasDetail?`<th>${card.detailTitle}</th>`:''}${isMachines?'<th>Тип техники</th><th>Смещение трекера</th>':''}</tr></thead><tbody>${items.map(([name,detail,type,id])=>`<tr data-search="${esc(`${name} ${detail} ${type || ''}`.toLocaleLowerCase('ru'))}" ${isMachines?`data-machine-href="#directory/machines/${encodeURIComponent(id)}/edit"`:''}><td>${isMachines?`<a class="directory-machine-link" href="#directory/machines/${encodeURIComponent(id)}/edit" aria-label="Открыть технику ${esc(name)}"><strong>${esc(name)}</strong></a>`:`<strong>${esc(name)}</strong>`}</td>${hasDetail?`<td>${esc(detail)}</td>`:''}${isMachines?`<td>${esc(type || 'Не указан')}</td><td>${formatTrackerOffset(projectMachines.find(machine => machine.id === id)?.trackerOffset ?? 0)}</td>`:''}</tr>`).join('')}<tr id="directory-empty" hidden><td colspan="${columns}" class="empty">Ничего не найдено. Попробуйте другой запрос.</td></tr></tbody></table></div></section><p class="section-note">${isMachines?'Технику можно добавить из корневого проекта, изменить её тип и положение трекера для этого хозяйства. Изменения сохраняются только в браузере.':'В MVP-макете записи доступны только для просмотра.'}</p>`;
  $('#directory-search').addEventListener('input', e => {
    const query = e.target.value.trim().toLocaleLowerCase('ru');
    let visible = 0;
    $$('.directory-table tr[data-search]').forEach(row => { row.hidden = !row.dataset.search.includes(query); if (!row.hidden) visible++; });
    $('#directory-result-count').textContent = `${visible} из ${card.items.length}`;
    $('#directory-empty').hidden = visible > 0;
  });
  if (isMachines) {
    $('#add-machine').onclick = openMachinePicker;
    $$('[data-machine-href]').forEach(row => row.onclick = event => {
      if (!event.target.closest('a')) location.hash = row.dataset.machineHref;
    });
  }
}
function machineTypePickerMarkup(selectedType = '') {
  return `<div class="root-machine-type operation-picker"><label for="machine-type">Тип техники</label><div class="operation-control"><input id="machine-type" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="machine-type-options" autocomplete="off" placeholder="Не указан" value="${esc(selectedType)}"><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span></div><div id="machine-type-options" class="operation-options" role="listbox" aria-label="Типы техники" hidden></div><span id="machine-type-search-status" class="visually-hidden" role="status" aria-live="polite"></span></div><p id="fleet-error" class="fleet-error" role="alert"></p>`;
}
function bindMachineTypePicker(initialType = '') {
  const types = [{name:'',label:'Не указан'}, ...[...AuroraFleet.machineTypes].sort((first,second)=>first.name.localeCompare(second.name,'ru'))];
  let selectedType = initialType, matches = [], active = -1;
  const input = $('#machine-type'), list = $('#machine-type-options');
  const close = () => {list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');input.value=selectedType;};
  const open = (query = '') => {
    matches=types.filter(type=>(type.label || type.name).toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
    active=-1;
    list.innerHTML=matches.length?matches.map((type,index)=>`<div id="machine-type-option-${index}" role="option" aria-selected="${type.name===selectedType}" data-index="${index}">${esc(type.label || type.name)}</div>`).join(''):'<div class="operation-empty">Ничего не найдено</div>';
    list.hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
    $('#machine-type-search-status').textContent=matches.length?`Найдено типов: ${matches.length}`:'Ничего не найдено';
  };
  const choose = index => {
    const type=matches[index];if(!type)return;
    selectedType=type.name;$('#fleet-error').textContent='';close();
  };
  input.onfocus=()=>{open();input.select();};
  input.onclick=()=>{if(list.hidden){open();input.select();}};
  input.oninput=()=>{selectedType='';$('#fleet-error').textContent='';open(input.value);};
  input.onblur=close;
  input.onkeydown=event=>{
    if(event.key==='ArrowDown'||event.key==='ArrowUp'){
      event.preventDefault();if(list.hidden)open();if(!matches.length)return;
      active=event.key==='ArrowDown'?(active+1)%matches.length:(active<=0?matches.length-1:active-1);
      [...list.querySelectorAll('[role="option"]')].forEach((option,index)=>option.classList.toggle('active',index===active));
      input.setAttribute('aria-activedescendant',`machine-type-option-${active}`);list.children[active].scrollIntoView({block:'nearest'});
    }else if(event.key==='Enter'&&!list.hidden){event.preventDefault();if(active>=0)choose(active);else if(matches.length===1)choose(0);}
    else if(event.key==='Escape'){event.preventDefault();close();}
  };
  list.onpointerdown=event=>event.preventDefault();
  list.onclick=event=>{const option=event.target.closest('[data-index]');if(option)choose(Number(option.dataset.index));};
  return () => selectedType;
}
function refreshMachineDirectory() {
  const query = $('#directory-search')?.value || '';
  renderDirectoryPage();
  if (query) { $('#directory-search').value = query; $('#directory-search').dispatchEvent(new Event('input')); }
}
function renderMachineEditorPage() {
  const machine = machineFromEditRoute();
  if (!machine) return;
  const offset = machine.trackerOffset ?? 0;
  main.innerHTML = `<div class="machine-edit-layout"><div class="page-heading machine-edit-heading"><h1>${esc(machine.name)}</h1><a class="btn machine-edit-back" href="#directory/machines">← К списку техники</a></div><section class="machine-edit-panel"><div class="fleet-machine-summary"><strong>${esc(machine.name)}</strong><small>Госномер: ${esc(machine.plate)}</small></div><p>Название и госномер приходят из корневого проекта. Настройки ниже относятся к этому хозяйству.</p>${machineTypePickerMarkup(machine.type)}<div class="tracker-settings"><div class="tracker-settings-head"><h2>Положение трекера</h2><div class="tracker-unit-switch" role="group" aria-label="Единица смещения"><button type="button" data-tracker-unit="m" aria-pressed="true">Метры</button><button type="button" data-tracker-unit="cm" aria-pressed="false">Сантиметры</button></div></div><p id="tracker-hint">Поперечное смещение от центра машины: отрицательное значение — влево, положительное — вправо. Схема условная.</p><div class="tracker-visual"><span>Лево</span><div class="tracker-vehicle"><span class="tracker-center-line" aria-hidden="true"></span><input id="tracker-offset-range" type="range" min="-5" max="5" step="0.01" value="${offset}" aria-label="Положение трекера на схеме" aria-describedby="tracker-hint"></div><span>Право</span></div><div class="tracker-scale"><span id="tracker-scale-left">−5 м</span><span id="tracker-scale-center">Центр · 0 м</span><span id="tracker-scale-right">+5 м</span></div><div class="tracker-numeric"><label id="tracker-offset-label" for="tracker-offset">Смещение</label><div><div class="tracker-input-wrap"><input id="tracker-offset" type="number" min="-5" max="5" step="0.01" value="${offset.toFixed(2)}" inputmode="decimal" aria-describedby="tracker-hint tracker-offset-unit tracker-error"><span id="tracker-offset-unit">м</span></div><button type="button" class="btn" id="tracker-center">По центру</button></div></div><p id="tracker-error" class="fleet-error" role="alert"></p></div><div class="actions"><a class="btn" href="#directory/machines">Отмена</a>${button('Сохранить','save-machine',true)}</div></section></div>`;
  const selectedType = bindMachineTypePicker(machine.type);
  const numberInput = $('#tracker-offset'), rangeInput = $('#tracker-offset-range');
  let offsetUnit = 'm';
  const unitFactor = () => offsetUnit === 'cm' ? 100 : 1;
  const unitDigits = () => offsetUnit === 'cm' ? 0 : 2;
  const validOffset = value => Number.isFinite(value) && Math.abs(value) <= 5 * unitFactor() && Math.round(value * (offsetUnit === 'cm' ? 1 : 100)) / (offsetUnit === 'cm' ? 1 : 100) === value;
  const clearTrackerError = () => { $('#tracker-error').textContent = ''; };
  $$('[data-tracker-unit]').forEach(button => button.onclick = () => {
    if (button.dataset.trackerUnit === offsetUnit) return;
    const offsetMeters = Number(rangeInput.value) / unitFactor();
    offsetUnit = button.dataset.trackerUnit;
    const limit = 5 * unitFactor(), converted = offsetUnit === 'cm' ? Math.round(offsetMeters * 100) : offsetMeters;
    rangeInput.min = numberInput.min = String(-limit);
    rangeInput.max = numberInput.max = String(limit);
    rangeInput.step = numberInput.step = offsetUnit === 'cm' ? '1' : '0.01';
    rangeInput.value = numberInput.value = converted.toFixed(unitDigits());
    numberInput.inputMode = offsetUnit === 'cm' ? 'numeric' : 'decimal';
    $('#tracker-scale-left').textContent = `−${limit} ${offsetUnit === 'cm' ? 'см' : 'м'}`;
    $('#tracker-scale-center').textContent = `Центр · 0 ${offsetUnit === 'cm' ? 'см' : 'м'}`;
    $('#tracker-scale-right').textContent = `+${limit} ${offsetUnit === 'cm' ? 'см' : 'м'}`;
    $('#tracker-offset-unit').textContent = offsetUnit === 'cm' ? 'см' : 'м';
    $$('[data-tracker-unit]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    clearTrackerError();
  });
  rangeInput.oninput = () => { const value = Number(rangeInput.value); numberInput.value = value.toFixed(unitDigits()); clearTrackerError(); };
  numberInput.oninput = () => {
    const value = Number(numberInput.value);
    if (!numberInput.value || !validOffset(value)) { $('#tracker-error').textContent = offsetUnit === 'cm' ? 'Укажите целое значение от −500 до +500 см.' : 'Укажите значение от −5 до +5 м с шагом 0,01 м.'; return; }
    rangeInput.value = String(value); clearTrackerError();
  };
  $('#tracker-center').onclick = () => { numberInput.value = (0).toFixed(unitDigits()); rangeInput.value = '0'; clearTrackerError(); };
  $('#save-machine').onclick = () => {
    try {
      if (!numberInput.value) throw new Error('Укажите смещение трекера.');
      if (!validOffset(Number(numberInput.value))) throw new Error(offsetUnit === 'cm' ? 'Смещение трекера должно быть от −500 до +500 см с шагом 1 см.' : 'Смещение трекера должно быть от −5 до +5 м с шагом 0,01 м.');
      projectMachines = AuroraFleet.updateMachineSettings(projectMachines, machine.id, selectedType(), Number(numberInput.value) / unitFactor());
    } catch (error) { $(error.message.includes('Смещение') || error.message.includes('смещение') ? '#tracker-error' : '#fleet-error').textContent = error.message; return; }
    persist();
    location.hash = 'directory/machines';
    toast(`Настройки ${machine.name} обновлены`);
  };
}
function openMachinePicker() {
  const available = AuroraFleet.availableRootMachines(AuroraFleet.rootMachines, projectMachines);
  const content = `<p>Выберите технику из корневого проекта. Тип можно указать сейчас или позже. Данные демонстрационные.</p>${available.length ? `${searchBox('root-machine-search','Поиск по названию или госномеру')}<div class="root-machine-list" role="radiogroup" aria-label="Техника корневого проекта">${available.map(machine=>`<label class="root-machine-choice" data-search="${esc(`${machine.name} ${machine.plate}`.toLocaleLowerCase('ru'))}"><input type="radio" name="root-machine" value="${esc(machine.id)}"><span><strong>${esc(machine.name)}</strong><small>${esc(machine.plate)}</small></span></label>`).join('')}</div><p class="root-machine-empty" id="root-machine-empty" hidden>Техника не найдена</p>${machineTypePickerMarkup()}<div class="actions">${button('Отмена','cancel-transfer')}${button('Перенести в проект','transfer-machine',true)}</div>` : '<p>Вся техника корневого проекта уже добавлена в это хозяйство.</p>'}`;
  $('#dialog').classList.add('fleet-dialog');
  $('#dialog').addEventListener('close',()=>$('#dialog').classList.remove('fleet-dialog'),{once:true});
  modal('Добавить технику',content,()=>{
    if (!available.length) return;
    const selectedType=bindMachineTypePicker();
    $('#cancel-transfer').onclick=()=>$('#dialog').close();
    $('#root-machine-search').oninput=e=>{
      const query=e.target.value.trim().toLocaleLowerCase('ru');
      let count=0;
      $$('.root-machine-choice').forEach(row=>{row.hidden=!row.dataset.search.includes(query);if(row.hidden)$('input',row).checked=false;else count++;});
      $('#root-machine-empty').hidden=count>0;
    };
    $('#transfer-machine').onclick=()=>{
      const id=$('input[name="root-machine"]:checked')?.value;
      const machine=available.find(item=>item.id===id);
      if(!machine){$('#fleet-error').textContent='Выберите технику из списка.';return;}
      try { projectMachines=AuroraFleet.transferMachine(projectMachines,machine,selectedType()); }
      catch(error){$('#fleet-error').textContent=error.message;return;}
      persist();$('#dialog').close();refreshMachineDirectory();toast(`${machine.name} добавлена в проект`);
    };
  });
}
$('#global-season').onchange=e=>{season=e.target.value;initDraft();render();};
$('#help').onclick=()=>modal('О макете Аврора Агро','<p>Кликабельный MVP по описанию «Аналог Гектеры». Основной путь: выберите работу → запустите расчёт → подтвердите площадь → добавьте материал → подтвердите работу.</p><p>Данные, схема полей и расчёты демонстрационные. Подключения к GPS, географического расчёта и серверного хранения нет. Изменения сохраняются только в этом браузере.</p><p>Демо-работы доступны за 30 сентября и 1 октября 2026 года. Технику можно переносить из демонстрационного корневого проекта и менять её тип, севооборот — редактировать.</p><div class="actions">'+button('Сбросить демо-данные','reset-demo')+'</div>',()=>$('#reset-demo').onclick=()=>{works=structuredClone(initialWorks);try{localStorage.removeItem('aurora-agro-demo-v1');}catch{}$('#dialog').close();location.reload();});
function pageFromHash() {
  const target = location.hash.slice(1);
  return ['operations','fields','rotation','reports','directory'].includes(target) || directoryCards.some(card => target === `directory/${card.id}`) || projectMachines.some(machine => target === `directory/machines/${encodeURIComponent(machine.id)}/edit`) ? target : 'operations';
}
window.addEventListener('hashchange',()=>{page=pageFromHash();drawing=false;drawPoints=[];render();window.scrollTo({top:0,behavior:'instant'});});
page=pageFromHash();
initDraft();render();
