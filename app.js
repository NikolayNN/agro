/* Автономный прототип: все треки и показатели расчёта демонстрационные. */
'use strict';
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fmt = (value, digits = 2) => Number(value).toLocaleString('ru-RU', { minimumFractionDigits: digits, maximumFractionDigits: digits });
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const iconNames = {fields:'map',rotation:'autorenew',operations:'event_available',reports:'description',directory:'grid_view',help:'help',search:'search',sync:'sync',check:'check_circle',tractor:'agriculture',clock:'schedule',download:'download',plus:'add',arrow:'arrow_forward',layers:'layers',leaf:'eco',edit:'edit',play:'play_arrow',person:'person',close:'close'};
const icon = name => `<span class="icon ds-symbol" aria-hidden="true">${iconNames[name] || 'map'}</span>`;
$$('[data-icon]').forEach(el => el.innerHTML = icon(el.dataset.icon));
// Системный справочник культур: доступен только для чтения.
const cropCatalog = Object.freeze([
  Object.freeze({name:'Рожь озимая',color:'#3F8532'}),
  Object.freeze({name:'Пшеница озимая',color:'#7DD552'}),
  Object.freeze({name:'Пшеница яровая',color:'#A9E196'}),
  Object.freeze({name:'Тритикале озимая',color:'#5BCD70'}),
  Object.freeze({name:'Тритикале яровая',color:'#B9ECA8'}),
  Object.freeze({name:'Ячмень яровой',color:'#EBFDDB'}),
  Object.freeze({name:'Овёс',color:'#DBEA83'}),
  Object.freeze({name:'Просо',color:'#F6E548'}),
  Object.freeze({name:'Гречиха',color:'#F8F1D5'}),
  Object.freeze({name:'Горох',color:'#00EA33'}),
  Object.freeze({name:'Вика яровая',color:'#E29945'}),
  Object.freeze({name:'Вика озимая',color:'#CA724A'}),
  Object.freeze({name:'Люпин узколистый',color:'#5FB3E1'}),
  Object.freeze({name:'Люпин белый',color:'#98D9F2'}),
  Object.freeze({name:'Люпин жёлтый',color:'#B5E359'}),
  Object.freeze({name:'Соя',color:'#EFAFF7'}),
  Object.freeze({name:'Кукуруза на зерно',color:'#F189AA'}),
  Object.freeze({name:'Кукуруза на зелёную массу',color:'#EFC6D9'}),
  Object.freeze({name:'Однолетние травы',color:'#9DE7F5'}),
  Object.freeze({name:'Многолетние злаковые травы',color:'#C6DFEE'}),
  Object.freeze({name:'Многолетние бобовые травы',color:'#8AB7E4'}),
  Object.freeze({name:'Многолетние бобово-злаковые травы',color:'#B4C5F0'}),
  Object.freeze({name:'Люцерна',color:'#9E90EC'}),
  Object.freeze({name:'Свекла сахарная',color:'#E5BBA1'}),
  Object.freeze({name:'Лен-долгунец',color:'#1CE5E8'}),
  Object.freeze({name:'Лен масличный',color:'#4AC7C9'}),
  Object.freeze({name:'Рапс озимый',color:'#F6CE07'}),
  Object.freeze({name:'Рапс яровой',color:'#F2832D'}),
  Object.freeze({name:'Сурепица озимая',color:'#D95632'}),
  Object.freeze({name:'Подсолнечник',color:'#A8B492'}),
  Object.freeze({name:'Картофель',color:'#83E1AC'}),
]);
const crops = ['', ...cropCatalog.map(c => c.name), 'Пар'];
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
const cropInks = Object.freeze({...Object.fromEntries(cropCatalog.map(c => [c.name, c.color])), 'Пар':'var(--ds-series-6)'});
const cropColors = Object.fromEntries(crops.map(c => [c, c ? `color-mix(in srgb, ${cropInks[c]} 14%, var(--ds-surface))` : 'var(--ds-surface)']));
const fields = [
  { id: 12, name: 'Северное', area: 64.8, rotation: { 2024: 'Рапс озимый', 2025: 'Ячмень яровой', 2026: 'Пшеница озимая' } },
  { id: 8, name: 'За лесом', area: 42.6, rotation: { 2024: 'Пшеница озимая', 2025: 'Кукуруза на зерно', 2026: 'Рапс озимый' } },
  { id: 3, name: 'Берёзовая роща', area: 78.4, rotation: { 2024: 'Пар', 2025: 'Пшеница озимая', 2026: 'Кукуруза на зерно' } },
  { id: 15, name: 'У озера', area: 36.2, rotation: { 2024: 'Кукуруза на зерно', 2025: 'Рапс озимый', 2026: 'Ячмень яровой' } },
  { id: 6, name: 'Восточное', area: 91.5, rotation: { 2024: 'Ячмень яровой', 2025: 'Пшеница озимая', 2026: 'Рапс озимый' } },
  { id: 21, name: 'Дальний клин', area: 53.7, rotation: { 2025: 'Кукуруза на зерно', 2026: 'Пшеница озимая' } },
  { id: 22, name: 'Южное', area: 47.3, rotation: { 2024: 'Кукуруза на зерно', 2025: 'Рапс озимый', 2026: 'Пшеница озимая' } },
  { id: 23, name: 'За деревней', area: 62.1, rotation: { 2024: 'Рапс озимый', 2025: 'Пшеница озимая', 2026: 'Ячмень яровой' } },
  { id: 24, name: 'Луговое', area: 28.9, rotation: { 2024: 'Ячмень яровой', 2025: 'Пар', 2026: 'Кукуруза на зерно' } },
  { id: 25, name: 'У речки', area: 39.6, rotation: { 2024: 'Пар', 2025: 'Кукуруза на зерно', 2026: 'Рапс озимый' } },
  { id: 26, name: 'Западное', area: 84.2, rotation: { 2024: 'Пшеница озимая', 2025: 'Ячмень яровой', 2026: 'Пар' } },
  { id: 27, name: 'Сосновый бор', area: 51.8, rotation: { 2024: 'Рапс озимый', 2025: 'Кукуруза на зерно', 2026: 'Пшеница озимая' } },
  { id: 28, name: 'Верхний клин', area: 33.5, rotation: { 2024: 'Пшеница озимая', 2025: 'Рапс озимый', 2026: 'Ячмень яровой' } },
  { id: 29, name: 'Нижнее', area: 56.4, rotation: { 2024: 'Кукуруза на зерно', 2025: 'Пшеница озимая', 2026: 'Рапс озимый' } },
  { id: 30, name: 'У дороги', area: 44.7, rotation: { 2024: 'Пар', 2025: 'Ячмень яровой', 2026: 'Кукуруза на зерно' } },
  { id: 31, name: 'Большое', area: 112.6, rotation: { 2024: 'Ячмень яровой', 2025: 'Рапс озимый', 2026: 'Пшеница озимая' } },
  { id: 32, name: 'Малый участок', area: 18.3, rotation: { 2024: 'Рапс озимый', 2025: 'Пшеница озимая', 2026: 'Пар' } },
  { id: 33, name: 'За садом', area: 37.9, rotation: { 2024: 'Кукуруза на зерно', 2025: 'Пар', 2026: 'Ячмень яровой' } },
  { id: 34, name: 'Дубрава', area: 69.1, rotation: { 2024: 'Пшеница озимая', 2025: 'Кукуруза на зерно', 2026: 'Рапс озимый' } },
  { id: 35, name: 'Дальнее южное', area: 73.4, rotation: { 2024: 'Пар', 2025: 'Рапс озимый', 2026: 'Пшеница озимая' } },
];
function shiftDemoDate(value,days) {
  const day=new Date(value+'T12:00:00Z');day.setUTCDate(day.getUTCDate()+days);return day.toISOString().slice(0,10);
}
function getDemoDates(now=new Date()) {
  const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Minsk',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now).map(part=>[part.type,part.value]));
  const today=parts.year+'-'+parts.month+'-'+parts.day;
  return {today,yesterday:shiftDemoDate(today,-1)};
}
const demoDates = getDemoDates();
const initialWorks = [
  { id: 1, field: 12, date: demoDates.today, machine: 'МТЗ-3022', plate: 'АВ 4821', driver: 'Ковалёв Александр', time: '08:15–12:40', duration: '4 ч 25 мин', operation: 'Сев', implement: 'Horsch Pronto 6 DC', width: 6, net: 61.42, overlap: 2.16, status: 'pending', season: '2026' },
  { id: 2, field: 8, date: demoDates.today, machine: 'John Deere 8430', plate: 'АВ 1934', driver: 'Иванов Сергей', time: '07:30–11:15', duration: '3 ч 45 мин', operation: 'Культивация', implement: 'КПС-8', width: 8, net: 40.15, overlap: 1.12, status: 'pending', season: '2026' },
  { id: 3, field: 3, date: demoDates.today, machine: 'МТЗ-1523', plate: 'АВ 7102', driver: 'Петров Николай', time: '09:10–13:20', duration: '4 ч 10 мин', operation: 'Химобработка (гербициды)', implement: 'Amazone UX 4200', width: 24, net: 73.61, overlap: 3.4, status: 'pending', season: '2026' },
  { id: 4, field: 15, date: demoDates.today, machine: 'Кировец К-742', plate: 'АВ 3396', driver: 'Смирнов Андрей', time: '08:00–11:45', duration: '3 ч 45 мин', operation: 'Вспашка', implement: 'ППО-8-40', width: 3.2, net: 34.22, overlap: 1.08, status: 'pending', season: '2026' },
  { id: 5, field: 6, date: demoDates.today, machine: 'John Deere 8430', plate: 'АВ 1934', driver: 'Иванов Сергей', time: '13:00–17:40', duration: '4 ч 40 мин', operation: 'Культивация', implement: 'КПС-8', width: 8, net: 87.34, overlap: 2.01, status: 'confirmed', finalArea: 87.34, season: '2026', material: '', rate: 0 },
  { id: 6, field: 21, date: demoDates.today, machine: 'МТЗ-3022', plate: 'АВ 4821', driver: 'Ковалёв Александр', time: '13:30–18:10', duration: '4 ч 40 мин', operation: 'Сев', implement: 'Horsch Pronto 6 DC', width: 6, net: 51.2, overlap: 1.3, status: 'confirmed', finalArea: 51.2, season: '2026', material: 'Пшеница · Элегия', rate: 220, unit: 'кг' },
  { id: 7, field: 8, date: demoDates.yesterday, machine: 'МТЗ-1523', plate: 'АВ 7102', driver: 'Петров Николай', time: '08:00–11:20', duration: '3 ч 20 мин', operation: 'Химобработка (гербициды)', implement: 'Amazone UX 4200', width: 24, net: 41.1, overlap: .8, status: 'confirmed', finalArea: 41.1, season: '2026', material: 'СЗР · демо-препарат', rate: 1.2, unit: 'л' },
  { id: 8, field: 12, date: demoDates.yesterday, machine: 'МТЗ-3022', plate: 'АВ 4821', driver: 'Ковалёв Александр', time: '09:00–13:10', duration: '4 ч 10 мин', operation: 'Сев', implement: 'Horsch Pronto 6 DC', width: 6, net: 60.75, overlap: 1.85, status: 'pending', season: '2026' },
  { id: 9, field: 15, date: demoDates.yesterday, machine: 'Кировец К-742', plate: 'АВ 3396', driver: 'Смирнов Андрей', time: '14:00–17:30', duration: '3 ч 30 мин', operation: 'Вспашка', implement: 'ППО-8-40', width: 3.2, net: 33.9, overlap: 1.2, status: 'pending', season: '2026' },
];
const materialTypes = ['Семена','Удобрения','СЗР'];
const materialUnits = ['кг','л','т'];
let materialsCatalog = [
  {id:1,name:'Пшеница · Элегия',type:'Семена',unit:'кг'},
  {id:2,name:'Удобрение · NPK 16:16:16',type:'Удобрения',unit:'кг'},
  {id:3,name:'СЗР · демо-препарат',type:'СЗР',unit:'л'},
];
let implementsCatalog = [
  {id:1,name:'Horsch Pronto 6 DC',width:6,operations:['Сев']},
  {id:2,name:'КПС-8',width:8,operations:['Культивация']},
  {id:3,name:'Amazone UX 4200',width:24,operations:['Химобработка (гербициды)','Химобработка (фунгициды)','Химобработка (инсектициды)']},
  {id:4,name:'ППО-8-40',width:3.2,operations:['Вспашка']},
];
let works = structuredClone(initialWorks);
let projectMachines = structuredClone(AuroraFleet.initialProjectMachines);
try {
  const saved = JSON.parse(localStorage.getItem('aurora-agro-demo-v1') || 'null');
  if (Array.isArray(saved?.fields) && saved.fields.length && saved.fields.every(f=>Number.isSafeInteger(f.id) && f.id>0 && typeof f.name==='string' && Number.isFinite(f.area) && f.rotation && typeof f.rotation==='object' && (!f.contour || (Array.isArray(f.contour) && f.contour.length>=3 && f.contour.every(p=>Array.isArray(p) && p.length===2 && p.every(Number.isFinite))))) && new Set(saved.fields.map(f=>f.id)).size===saved.fields.length) fields.splice(0,fields.length,...saved.fields);
  if (Array.isArray(saved?.materialsCatalog) && saved.materialsCatalog.every(item=>Number.isSafeInteger(item.id) && item.id>0 && typeof item.name==='string' && item.name.trim() && materialTypes.includes(item.type) && materialUnits.includes(item.unit)) && new Set(saved.materialsCatalog.map(item=>item.id)).size===saved.materialsCatalog.length && new Set(saved.materialsCatalog.map(item=>item.name.trim().toLocaleLowerCase('ru'))).size===saved.materialsCatalog.length) materialsCatalog=saved.materialsCatalog;
  if (Array.isArray(saved?.implementsCatalog) && saved.implementsCatalog.length && saved.implementsCatalog.every(item=>Number.isSafeInteger(item.id) && item.id>0 && typeof item.name==='string' && item.name.trim() && Number.isFinite(item.width) && item.width>0 && Array.isArray(item.operations) && item.operations.length && item.operations.every(op=>systemOperations.includes(op))) && new Set(saved.implementsCatalog.map(item=>item.id)).size===saved.implementsCatalog.length && new Set(saved.implementsCatalog.map(item=>item.name.trim().toLocaleLowerCase('ru'))).size===saved.implementsCatalog.length) implementsCatalog=saved.implementsCatalog;
  if (Array.isArray(saved?.works) && saved.works.every(w=>w && initialWorks.some(initial=>initial.id===w.id)) && new Set(saved.works.map(w=>w.id)).size===saved.works.length) works = initialWorks.map(initial=>saved.works.find(w=>w.id===initial.id) || structuredClone(initial));
  if (Array.isArray(saved?.addedFields)) saved.addedFields.forEach(f => {
    if (Number.isSafeInteger(f.id) && f.id > 0 && !fields.some(existing=>existing.id===f.id) && typeof f.name==='string' && Array.isArray(f.contour) && f.contour.length>=3 && f.contour.every(p=>Array.isArray(p) && p.length===2 && p.every(Number.isFinite))) fields.push({id:f.id,name:f.name,area:0,rotation:{},contour:f.contour,exclusions:Array.isArray(f.exclusions) ? f.exclusions.filter(points=>Array.isArray(points) && points.length>=3 && points.every(p=>Array.isArray(p) && p.length===2 && p.every(Number.isFinite))) : [],exclusionNames:Array.isArray(f.exclusionNames) ? f.exclusionNames.map((name,i)=>typeof name==='string' && name.trim() ? name.trim() : 'Участок '+(i+1)) : []});
  });
  if (saved?.rotation) fields.forEach(f => { if (saved.rotation[f.id]) f.rotation = saved.rotation[f.id]; });
  if (Array.isArray(saved?.projectMachines) && saved.projectMachines.length >= AuroraFleet.initialProjectMachines.length) projectMachines = AuroraFleet.normalizeProjectMachines(saved.projectMachines);
} catch { /* В приватном режиме макет продолжает работать без сохранения. */ }
works.forEach(work=>{const initial=initialWorks.find(item=>item.id===work.id);if(initial)work.date=initial.date;});
// Однозначные переименования старого демо. Обобщённые виды требуют уточнения.
works.forEach(w => { w.operation = ({ 'Посев': 'Сев', 'Пахота': 'Вспашка' })[w.operation] || w.operation; });
fields.forEach(field => Object.keys(field.rotation).forEach(year => {
  if (field.rotation[year] === 'Кукуруза') field.rotation[year] = 'Кукуруза на зерно';
}));
let page = 'operations', season = '2026', date = demoDates.today, status = ['pending'], selected = 1, step = 'settings';
let draft = null, result = null, areaMode = 'calculated', manualArea = '', fieldSelected = 12, zoom = 1;
let workField = [], workCrop = [], workMachine = [], workDriver = [];
let fieldQuery = '', reportKind = 'director', reportDateFrom = demoDates.today, reportDateTo = demoDates.today;
let reportGroup = 'field', reportMaterial = true, reportOverlap = false, visibleSeasons = [2024, 2025, 2026];
let drawing = false, drawPoints = [], mapBasemap = 'scheme';
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
  try { localStorage.setItem('aurora-agro-demo-v1', JSON.stringify({ fields, works, implementsCatalog, materialsCatalog, rotation: Object.fromEntries(fields.map(f => [f.id, f.rotation])), projectMachines, addedFields: fields.filter(f=>f.contour) })); }
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
  if (draft?.status === 'pending') Object.assign(draft, {operation:'', implement:'', width:0});
  result = null; step = 'settings'; areaMode = 'calculated'; manualArea = ''; zoom = 1;
}
function filteredWorks() { return works.filter(w => w.date === date && String(w.season) === season && (!status.length || status.includes(w.status)) && (!workField.length || workField.includes(String(w.field))) && (!workCrop.length || workCrop.includes(currentCrop(getField(w.field), w.season) || 'Культура не назначена')) && (!workMachine.length || workMachine.includes(w.machine)) && (!workDriver.length || workDriver.includes(w.driver))); }
function statusBadge(w) { return `<span class="badge ${w.status === 'confirmed' ? 'green' : w.status === 'rejected' ? 'gray' : ''}">${w.status === 'confirmed' ? '✓ Подтверждена' : w.status === 'rejected' ? 'Отклонена' : 'Ждёт расчёта'}</span>`; }
function fieldFromEditRoute() {
  const match = /^fields\/(\d+)\/edit$/.exec(page);
  return match ? fields.find(f=>f.id===Number(match[1])) : null;
}
function updateNav() {
  const titles = { operations: 'Операции', fields: 'Поля', rotation: 'Севооборот', reports: 'Отчёты', directory: 'Справочники' };
  const directory = directoryCards.find(card => page === `directory/${card.id}`);
  const editingMachine = machineFromEditRoute();
  const editingField = fieldFromEditRoute();
  const operation = operationFromRoute();
  const dayRoute = /^operations\/day\/(\d{4}-\d{2}-\d{2})$/.exec(page);
  const dayBreadcrumb = `<a href="#operations">Операции</a><span>/</span><a href="#operations/day/${operation?.date || date}">${(operation?.date || date).split('-').reverse().join('.')}</a>`;
  $('#breadcrumb').innerHTML = operation ? `${dayBreadcrumb}<span>/</span>Работа № ${String(operation.id).padStart(3,'0')}` : dayRoute ? dayBreadcrumb : editingField ? `<a href="#fields">Поля</a><span>/</span>${esc(editingField.name)}<span>/</span>Редактирование` : editingMachine ? `<a href="#directory">Справочники</a><span>/</span><a href="#directory/machines">Техника</a><span>/</span>${esc(editingMachine.name)}` : directory ? `<a href="#directory">Справочники</a><span>/</span>${directory.title}` : titles[page];
  document.title = `${operation ? `Работа № ${String(operation.id).padStart(3,'0')}` : editingField ? `Редактирование: ${editingField.name}` : editingMachine ? editingMachine.name : directory?.title || (dayRoute ? 'Полевые операции' : titles[page])} — Аврора Агро`;
  $$('nav a').forEach(a => { const active = a.dataset.page === page || (a.dataset.page === 'operations' && (!!operation || !!dayRoute)) || (a.dataset.page === 'fields' && !!editingField) || (a.dataset.page === 'directory' && (!!directory || !!editingMachine)); a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
  $('#pending-count').textContent = works.filter(w => w.status === 'pending' && String(w.season) === season).length;
}
function operationFromRoute() {
  const match = /^operations\/(\d+)$/.exec(page);
  return match ? works.find(work => work.id === Number(match[1])) : null;
}
function render() {
  const dayRoute = /^operations\/day\/(\d{4}-\d{2}-\d{2})$/.exec(page);
  if (dayRoute) date = dayRoute[1];
  const operation = operationFromRoute();
  main.classList.toggle('operation-page', !!operation);
  main.classList.toggle('fields-page', page === 'fields' || !!fieldFromEditRoute());
  updateNav();
  if (dayRoute) renderOperations();
  else if (operation) renderOperation(operation);
  else if (fieldFromEditRoute()) renderFieldDrawing(fieldFromEditRoute());
  else if (machineFromEditRoute()) renderMachineEditorPage();
  else if (page.startsWith('directory/')) renderDirectoryPage();
  else ({ operations: renderOperationsCalendar, fields: renderFields, rotation: renderRotation, reports: renderReports, directory: renderDirectory })[page]();
}
function mapMarkup(field, calculated = false, tracks = true, showTitle = true) {
  const trackLines = Array.from({ length: 21 }, (_, i) => { const x = 180 + i * 15; return `<path d="M${x} 145V422"/>`; }).join('');
  const turns = Array.from({ length: 20 }, (_, i) => { const x = 180 + i * 15, y = i % 2 ? 145 : 422; return `<path d="M${x} ${y}Q${x + 7.5} ${y + (i % 2 ? -17 : 17)} ${x + 15} ${y}"/>`; }).join('');
  return `<div class="map-panel basemap-${mapBasemap} ${drawing ? 'drawing' : ''}">
    <svg class="map-art ${calculated ? 'calculated' : ''}" id="field-map" viewBox="0 0 700 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Демонстрационная схема поля ${esc(field.name)}${tracks ? ' и GPS-трека' : ''}">
      <defs><pattern id="rows" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(15)"><rect width="7" height="7" fill="#b4c095"/><path d="M0 0V7" stroke="#859a6e" stroke-width="2" opacity=".28"/></pattern><pattern id="rows2" patternUnits="userSpaceOnUse" width="9" height="9" patternTransform="rotate(-22)"><rect width="9" height="9" fill="#c6bd8b"/><path d="M0 0V9" stroke="#9e9663" stroke-width="2" opacity=".27"/></pattern><pattern id="trees" patternUnits="userSpaceOnUse" width="22" height="25"><rect width="22" height="25" fill="#789273"/><circle cx="5" cy="7" r="9" fill="#627e60"/><circle cx="19" cy="22" r="8" fill="#869e78"/><circle cx="17" cy="8" r="5" fill="#547452" opacity=".65"/></pattern><clipPath id="field-clip"><path d="M161 125 503 102 541 347 439 451 195 461 142 333Z"/></clipPath><filter id="texture"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter><filter id="satellite-texture" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .08" numOctaves="4" seed="9" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncR type="linear" slope=".65" intercept=".1"/><feFuncG type="linear" slope=".7" intercept=".13"/><feFuncB type="linear" slope=".5" intercept=".06"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter></defs>
      <g id="map-world" transform="translate(350 280) scale(${zoom}) translate(-350 -280)">
        <rect width="700" height="560" fill="#c7d0ac"/><g class="map-landscape" filter="url(#texture)"><path d="M0 0H328L305 76 120 91 90 262 0 240Z" fill="url(#rows2)"/><path d="M353 0H700V176L559 162 535 65 330 76Z" fill="url(#rows)"/><path d="M0 273 90 286 117 451 79 560H0Z" fill="url(#trees)"/><path d="m548 191 152 6v291l-118-67-44-66Z" fill="url(#rows2)"/><path d="m166 486 288-8 92-85 41 71 113 54v42H118Z" fill="url(#rows)"/><path d="M161 125 503 102 541 347 439 451 195 461 142 333Z" fill="url(#rows)"/><path d="M115-10 132 48 103 162 117 293 142 463 101 570" fill="none" stroke="#81956c" stroke-width="28"/><path d="M115-10 132 48 103 162 117 293 142 463 101 570" fill="none" stroke="#e6dfbb" stroke-width="13"/><path d="M105 91 331 86 521 82 559 177 715 185" fill="none" stroke="#e1ddba" stroke-width="10"/><path d="m144 477 308-8 106-105 155 55" fill="none" stroke="#e4ddbc" stroke-width="11"/><path d="M536 0 546 50 594 73 627 131 670 143 710 113" fill="none" stroke="#96b5aa" stroke-width="19"/><path d="M0 71 68 93 80 161 55 207 0 196Z" fill="url(#trees)"/><path d="m562 464 70 12 68 42v42H533Z" fill="url(#trees)"/></g>
        <path d="M161 125 503 102 541 347 439 451 195 461 142 333Z" fill="#6d984920" stroke="#f1f9d6" stroke-width="5"/><path d="M161 125 503 102 541 347 439 451 195 461 142 333Z" fill="none" stroke="#3c713b" stroke-width="2"/>
        ${tracks ? `<g clip-path="url(#field-clip)"><g class="coverage-layer"><path d="M173 139H499V430H173Z" fill="#86b957" opacity=".5"/><path d="M197 150V418M377 147V426" stroke="#e7b354" stroke-width="13" opacity=".85"/><path d="m496 109 31 144-24 128-17-249Z" fill="#d58d63" opacity=".8"/></g><g id="coverage-preview" style="display:none" fill="none" stroke="#3a9b59" stroke-linecap="round" stroke-linejoin="round" opacity=".72">${trackLines}${turns}</g><g class="track-layer" stroke="#f5f8ce" fill="none" stroke-width="2.3">${trackLines}${turns}</g></g>` : ''}
        <text class="map-label" x="595" y="310">№ 08</text><text class="map-label" x="341" y="530">№ 21</text>
      <g id="draw-layer">${!drawing && field.contour ? `<polygon points="${field.contour.map(p=>p.join(',')).join(' ')}" fill="#21684844" stroke="#216848" stroke-width="3"/>${(field.exclusions || []).map(points=>`<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="#d58d6355" stroke="#ae5d22" stroke-width="3"/>`).join('')}` : ''}</g></g>
    </svg>
    ${showTitle ? `<div class="map-title"><span class="field-symbol">${icon('fields')}</span><div><strong>№ ${field.id} · ${esc(field.name)}</strong><small>${fmt(field.area)} га · ${esc(currentCrop(field) || 'Культура не назначена')}</small></div></div>` : ''}
    ${drawing ? '<div class="map-history"><button class="btn" type="button" id="undo-draw" aria-label="Отменить последнее действие" disabled>↶ Назад</button><button class="btn" type="button" id="redo-draw" aria-label="Повторить действие" disabled>Вперёд ↷</button></div>' : ''}
    <label class="map-basemap">${icon('layers')}<select id="map-basemap" aria-label="Подложка карты"><option value="scheme" ${mapBasemap==='scheme'?'selected':''}>Схема</option><option value="hybrid" ${mapBasemap==='hybrid'?'selected':''}>Гибрид</option><option value="satellite" ${mapBasemap==='satellite'?'selected':''}>Спутник</option></select></label>
    <div class="map-tools"><button data-zoom="in" aria-label="Увеличить карту">+</button><button data-zoom="out" aria-label="Уменьшить карту">−</button><button data-zoom="reset" aria-label="Вернуть масштаб">⌖</button><button type="button" class="map-fullscreen-toggle" aria-label="Развернуть карту на весь экран" title="Развернуть карту на весь экран" aria-pressed="false"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5"/></svg></button></div>
    <div class="map-field-chip" ${drawing || !!operationFromRoute() ? 'hidden' : ''}>${esc(field.name)}<small>${field.contour ? 'Площадь не рассчитана' : `${fmt(field.area)} га`}</small></div>
    <div class="map-bottom">${tracks ? `<div class="map-legend"><span class="legend-item"><i></i>Контур поля</span>${tracks ? '<span class="legend-item"><i style="background:#9dbb79"></i>GPS-трек</span><span class="legend-item"><i class="yellow"></i>Перекрытия</span><span class="legend-item"><i class="red"></i>Пропуски</span>' : '<span class="legend-item">Условное расположение</span>'}</div>` : ''}<span class="map-scale">Схема</span></div>

  </div>`;
}
function bindMap() {
  const fullscreenButton = $('.map-fullscreen-toggle');
  const mapPanel = fullscreenButton.closest('.map-panel');
  const syncFullscreen = () => {
    const expanded = document.fullscreenElement === mapPanel || mapPanel.classList.contains('map-fullscreen-fallback');
    fullscreenButton.setAttribute('aria-pressed',String(expanded));
    fullscreenButton.setAttribute('aria-label',expanded ? 'Выйти из полноэкранного режима' : 'Развернуть карту на весь экран');
    fullscreenButton.title = expanded ? 'Выйти из полноэкранного режима' : 'Развернуть карту на весь экран';
  };
  fullscreenButton.onclick = async () => {
    if (document.fullscreenElement === mapPanel) await document.exitFullscreen();
    else if (mapPanel.classList.contains('map-fullscreen-fallback')) mapPanel.classList.remove('map-fullscreen-fallback');
    else {
      try { await mapPanel.requestFullscreen(); }
      catch { mapPanel.classList.add('map-fullscreen-fallback'); }
    }
    syncFullscreen();
  };
  document.onfullscreenchange = syncFullscreen;
  document.addEventListener('keydown', function exitMapFullscreen(e) {
    if (!mapPanel.isConnected) { document.removeEventListener('keydown',exitMapFullscreen); return; }
    if(e.key === 'Escape') { mapPanel.classList.remove('map-fullscreen-fallback'); syncFullscreen(); }
  });
  syncFullscreen();
  $('#map-basemap').onchange = e => {
    const panel = e.target.closest('.map-panel');
    panel.classList.remove(`basemap-${mapBasemap}`);
    mapBasemap = e.target.value;
    panel.classList.add(`basemap-${mapBasemap}`);
  };
  $$('[data-zoom]').forEach(b => b.onclick = () => {
    zoom = b.dataset.zoom === 'reset' ? 1 : Math.min(2, Math.max(.7, zoom + (b.dataset.zoom === 'in' ? .15 : -.15)));
    $('#map-world').setAttribute('transform', `translate(350 280) scale(${zoom}) translate(-350 -280)`);
  });
}
function pendingWorkDates(year) {
  return works.filter(w=>w.status==='pending' && String(w.season)===String(year)).reduce((counts,w)=>{counts[w.date]=(counts[w.date] || 0)+1;return counts;},{});
}
function workCalendarDays(year,month) {
  const offset=(new Date(year,month,1).getDay()+6)%7;
  return [...Array(offset).fill(null),...Array.from({length:new Date(year,month+1,0).getDate()},(_,i)=>year+'-'+String(month+1).padStart(2,'0')+'-'+String(i+1).padStart(2,'0'))];
}
function workCalendarMarkup(year,month) {
  const counts = works.filter(w => String(w.season) === String(season)).reduce((days,w) => {
    days[w.date] ||= {pending:0,confirmed:0,rejected:0};
    if (w.status in days[w.date]) days[w.date][w.status]++;
    return days;
  }, {});
  const label = new Date(year,month,1).toLocaleDateString('ru-RU',{month:'long',year:'numeric'});
  return '<div class="work-calendar-heading"><button type="button" class="ds-icon-button" data-calendar-month="-1" aria-label="Предыдущий месяц">‹</button><strong>'+esc(label)+'</strong><button type="button" class="ds-icon-button" data-calendar-month="1" aria-label="Следующий месяц">›</button></div><div class="work-calendar-grid">'+['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(day=>'<span class="work-calendar-weekday">'+day+'</span>').join('')+workCalendarDays(year,month).map(day=>{
    if (!day) return '<span></span>';
    const c = counts[day], description = c ? ': ждёт расчёта '+c.pending+', подтверждено '+c.confirmed+', отклонено '+c.rejected : ': нет работ';
    return '<button type="button" class="work-calendar-day '+(day===date?'selected ':'')+(c?.pending?'has-pending':'')+'" data-calendar-date="'+day+'" aria-label="'+day.split('-').reverse().join('.')+description+'" '+(day===date?'aria-current="date"':'')+'><span>'+Number(day.slice(-2))+'</span>'+(c?'<small class="work-calendar-counts" aria-hidden="true">'+['pending','confirmed','rejected'].filter(key=>c[key]>0).map(key=>'<span class="'+key+'">'+c[key]+'</span>').join('')+'</small>':'')+'</button>';
  }).join('')+'</div><div class="work-calendar-key"><span class="work-calendar-counts"><span class="pending">Ждёт</span><span class="confirmed">Подтверждено</span><span class="rejected">Отклонено</span></span></div>';
}
function renderOperationsCalendar() {
  main.innerHTML = '<div class="page-heading"><div><h1>Операции</h1><p>Выберите день для просмотра полевых операций.</p></div></div><section id="work-calendar" class="work-calendar calendar-page" aria-label="Календарь работ"></section>';
  const calendar = $('#work-calendar');
  let [year,month] = date.split('-').map(Number); month--;
  const redraw = () => { calendar.innerHTML = workCalendarMarkup(year,month); };
  redraw();
  calendar.onclick = event => {
    const day = event.target.closest('[data-calendar-date]');
    if (day) { location.hash = 'operations/day/'+day.dataset.calendarDate; return; }
    const nav = event.target.closest('[data-calendar-month]');
    if (nav) { const target = new Date(year,month+Number(nav.dataset.calendarMonth),1); year=target.getFullYear(); month=target.getMonth(); redraw(); }
  };
}
function workFilterMarkup(id, label, entries, selectedValue) {
  const active = selectedValue.length > 0, labels = selectedValue.map(value => entries.find(([key]) => String(key) === value)?.[1] || value), valueLabel = labels[0] + (labels.length > 1 ? ' +' + (labels.length-1) : '');
  return `<span class="agro-filter" data-ds-filter-menu data-active="${active}"><button type="button" id="${id}" class="agro-filter-trigger" popovertarget="${id}-menu" aria-label="${esc(label + (active ? ': ' + labels.join(', ') : ''))}" aria-haspopup="dialog" aria-expanded="false"><span>${esc(label)}${active ? ': '+esc(valueLabel) : ''}</span><span class="ds-symbol" aria-hidden="true">expand_more</span></button>${active ? `<button class="agro-filter-clear" type="button" data-filter-clear="${id}" aria-label="Очистить: ${esc(label)}"><span class="ds-symbol" aria-hidden="true">close</span></button>` : ''}<div id="${id}-menu" class="agro-filter-popup" popover role="dialog" aria-label="${esc(label)}"><div class="agro-filter-heading">${esc(label)}</div><input type="search" class="agro-filter-search" aria-label="Поиск: ${esc(label)}" placeholder="Поиск"><div class="agro-filter-options">${entries.map(([value,title]) => `<label data-ds-filter-option data-selected="${selectedValue.includes(String(value))}" data-disabled="false"><input type="checkbox" name="${id}-value" value="${esc(value)}" ${selectedValue.includes(String(value)) ? 'checked' : ''}><span>${esc(title)}</span></label>`).join('')}<p class="hint" data-filter-empty hidden>Ничего не найдено</p></div><div class="agro-filter-actions"><button type="button" class="btn subtle" data-filter-clear="${id}">Очистить</button><button type="button" class="btn primary" data-filter-apply="${id}">Применить</button></div></div></span>`;
}
function bindWorkFilters() {
  const bindings = {
    'work-field': [workField, value => workField = value], 'work-crop': [workCrop, value => workCrop = value],
    'work-machine': [workMachine, value => workMachine = value], 'work-driver': [workDriver, value => workDriver = value],
    'work-status': [status, value => status = value]
  };
  for (const [id, [value, save]] of Object.entries(bindings)) {
    const trigger = $('#'+id), menu = $('#'+id+'-menu'), search = menu.querySelector('input[type=search]'), radios = [...menu.querySelectorAll('input[type=checkbox]')];
    const close = () => { menu.hidePopover(); trigger.focus(); };
    const commit = value => { if(id==='work-status' && activeWorkView==='system-pending') return; save(value); close(); renderOperations(); $('#'+id).focus(); };
    menu.addEventListener('beforetoggle', event => {
      if (event.newState !== 'open') return;
      search.value = ''; radios.forEach(radio => { radio.checked = value.includes(radio.value); radio.closest('label').hidden = false; radio.closest('label').dataset.selected = String(radio.checked); });
      menu.querySelector('[data-filter-empty]').hidden = true;
      const rect = trigger.getBoundingClientRect(), height = Math.min(400, window.innerHeight-16);
      menu.style.left = Math.max(8,Math.min(rect.left,window.innerWidth-316))+'px';
      menu.style.top = (rect.bottom+height+8 <= window.innerHeight ? rect.bottom+8 : Math.max(8,rect.top-height-8))+'px';
      menu.style.maxHeight = height+'px';
    });
    menu.addEventListener('toggle', event => { trigger.setAttribute('aria-expanded', String(event.newState === 'open')); if (event.newState === 'open') search.focus(); });
    search.oninput = () => { radios.forEach(radio => radio.closest('label').hidden = !radio.closest('label').textContent.toLocaleLowerCase('ru').includes(search.value.toLocaleLowerCase('ru'))); menu.querySelector('[data-filter-empty]').hidden = radios.some(radio => !radio.closest('label').hidden); };
    menu.onchange = () => radios.forEach(radio => radio.closest('label').dataset.selected = String(radio.checked));
    menu.onkeydown = event => { if (event.key === 'Escape') { event.preventDefault(); close(); } };
    menu.querySelector('[data-filter-apply]').onclick = () => commit(radios.filter(radio => radio.checked).map(radio => radio.value));
    trigger.parentElement.querySelectorAll('[data-filter-clear]').forEach(button => button.onclick = () => commit([]));
  }
}
const workExtraColumns = [
  ['operation','Операция'], ['net','Обработано, га'], ['finalArea','Учтено, га'], ['implement','Орудие'],
  ['overlap','Перекрытия, га'], ['gaps','Пропуски, га'], ['material','Материал'], ['rate','Норма на га'], ['consumption','Расход']
];
const workColumns = [['field','Поле'],['crop','Культура'],['machine','Техника'],['driver','Механизатор'],['time','Время работы'],['fieldArea','Площадь поля'],...workExtraColumns,['status','Статус']];
const defaultWorkColumns = ['field','crop','machine','driver','time','fieldArea','operation','net','finalArea','status'];
let workColumnOrder = workColumns.map(([key]) => key), workVisibleColumns = [...defaultWorkColumns];
try {
  const saved = JSON.parse(localStorage.getItem('aurora-agro-work-columns'));
  if (saved && Array.isArray(saved.order) && Array.isArray(saved.visible)) {
    const keys = workColumns.map(([key]) => key);
    workColumnOrder = [...new Set([...saved.order.filter(key => keys.includes(key)),...keys])];
    workVisibleColumns = [...new Set(saved.visible.filter(key => keys.includes(key)))];
    if (!workVisibleColumns.length) workVisibleColumns = [...defaultWorkColumns];
  }
} catch {}
function saveWorkColumns() {
  if (activeWorkView) return;
  allWorkView.order = [...workColumnOrder]; allWorkView.visible = [...workVisibleColumns];
  try { localStorage.setItem('aurora-agro-work-columns',JSON.stringify({order:workColumnOrder,visible:workVisibleColumns})); } catch {}
}
let workViews = [], activeWorkView = '', workViewDraftName = null;
status = [];
const allWorkView = captureWorkView();
try {
  const saved = JSON.parse(localStorage.getItem('aurora-agro-work-views') || '[]');
  const keys = workColumns.map(([key]) => key);
  if (Array.isArray(saved)) workViews = saved.filter(view => view && typeof view.id === 'string' && typeof view.name === 'string' && view.config && ['field','crop','machine','driver','status'].every(key => Array.isArray(view.config.filters?.[key]) && view.config.filters[key].every(value => typeof value === 'string')) && Array.isArray(view.config.order) && Array.isArray(view.config.visible)).map(view => ({...view,config:{...view.config,order:[...new Set([...view.config.order.filter(key => keys.includes(key)),...keys])],visible:[...new Set(view.config.visible.filter(key => keys.includes(key)))]}})).filter(view => view.config.visible.length);
} catch {}
const pendingView = workViews.find(view => view.id === 'system-pending') || workViews.find(view => view.name.toLocaleLowerCase('ru').replaceAll('ё','е') === 'ожидают расчета');
if (pendingView) {
  pendingView.id='system-pending'; pendingView.name='Ожидают расчёта'; pendingView.config.filters.status=['pending'];
} else {
  const config=captureWorkView(); config.filters.status=['pending'];
  workViews.unshift({id:'system-pending',name:'Ожидают расчёта',config});
}
function captureWorkView() {
  return {filters:{field:[...workField],crop:[...workCrop],machine:[...workMachine],driver:[...workDriver],status:[...status]},order:[...workColumnOrder],visible:[...workVisibleColumns]};
}
function applyWorkView(config) {
  workField=[...config.filters.field]; workCrop=[...config.filters.crop]; workMachine=[...config.filters.machine]; workDriver=[...config.filters.driver]; status=[...config.filters.status];
  workColumnOrder=[...config.order]; workVisibleColumns=[...config.visible];
}
function workViewsMarkup() {
  const active = workViews.find(view => view.id === activeWorkView);
  const dirty = active && ((workViewDraftName !== null && workViewDraftName !== active.name) || JSON.stringify(active.config) !== JSON.stringify(captureWorkView()));
  return `<div class="work-views"><div class="tabs" role="group" aria-label="Представления работ"><button type="button" data-work-view="" class="${!active?'active':''}" aria-pressed="${!active}">Все</button>${workViews.map(view => `<span class="work-view-tab ${view.id===activeWorkView?'active':''}"><button type="button" data-work-view="${esc(view.id)}" class="${view.id===activeWorkView?'active':''}" aria-pressed="${view.id===activeWorkView}">${esc(view.id===activeWorkView?(workViewDraftName ?? view.name):view.name)}</button>${view.id!=='system-pending'?`<button type="button" class="work-view-more" popovertarget="view-menu-${esc(view.id)}" aria-label="Действия с представлением: ${esc(view.name)}"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor"><circle cx="8" cy="3" r="1"/><circle cx="8" cy="8" r="1"/><circle cx="8" cy="13" r="1"/></svg></button><div popover id="view-menu-${esc(view.id)}" class="work-view-popup"><button class="btn subtle" data-view-action="rename" data-view-id="${esc(view.id)}">Переименовать</button><button class="btn subtle" data-view-action="delete" data-view-id="${esc(view.id)}">Удалить</button></div>`:''}</span>`).join('')}<button type="button" id="add-work-view" aria-label="Создать представление из текущего состояния" title="Создать представление из текущего состояния">+</button></div><div class="row">${dirty?'<button type="button" class="btn subtle" id="reset-work-view">Сбросить изменения</button><button type="button" class="btn primary" popovertarget="work-save-menu" aria-label="Сохранить">Сохранить</button><div popover id="work-save-menu" class="work-view-popup work-save-popup"><button class="btn subtle" id="update-work-view">Сохранить в текущем представлении</button><button class="btn subtle" id="save-new-work-view">Сохранить как новое представление</button></div>':''}</div></div>`;
}
function persistWorkViews() {
  try { localStorage.setItem('aurora-agro-work-views',JSON.stringify(workViews)); }
  catch { toast('Представление доступно в текущей вкладке. Браузер не смог сохранить его после закрытия.'); }
}
function editWorkViewName(rename = false, sourceId = null) {
  const active = workViews.find(view => view.id === sourceId);
  if (rename && sourceId==='system-pending') return;
  modal(rename?'Переименовать представление':active?'Создать копию представления':'Новое представление',`<form id="work-view-form"><label>Название представления<input id="work-view-name" required maxlength="60" value="${esc(rename?(sourceId===activeWorkView?(workViewDraftName ?? active.name):active.name):'')}" placeholder="Например, Ожидают расчёта"></label><p id="work-view-error" class="fleet-error" role="alert"></p><div class="actions"><button type="button" class="btn" id="cancel-work-view">Отмена</button><button type="submit" class="btn primary">${rename?'Применить':'Создать представление'}</button></div></form>`,()=>{
    $('#cancel-work-view').onclick=()=>$('#dialog').close();
    $('#work-view-name').focus();
    $('#work-view-form').onsubmit=event=>{
      event.preventDefault(); const name=$('#work-view-name').value.trim();
      if (!name || name.toLocaleLowerCase('ru')==='все' || workViews.some(view => (!rename || view.id!==sourceId) && view.name.toLocaleLowerCase('ru')===name.toLocaleLowerCase('ru'))) { $('#work-view-error').textContent='Укажите уникальное название представления.'; return; }
      if(rename) { if(sourceId===activeWorkView) workViewDraftName=name; else active.name=name; }
      else { const view={id:crypto.randomUUID(),name,config:captureWorkView()}; workViews.push(view); activeWorkView=view.id; workViewDraftName=null; applyWorkView(view.config); }
      persistWorkViews(); $('#dialog').close(); renderOperations();
    };
  });
}
function bindWorkViews() {
  document.querySelectorAll('[data-work-view]').forEach(button=>button.onclick=()=>{
    if (!activeWorkView) { allWorkView.order=[...workColumnOrder]; allWorkView.visible=[...workVisibleColumns]; }
    if (button.dataset.workView===activeWorkView && activeWorkView) return;
    activeWorkView=button.dataset.workView; workViewDraftName=null;
    applyWorkView(workViews.find(view=>view.id===activeWorkView)?.config || allWorkView); renderOperations();
  });
  $('#add-work-view').onclick=()=>editWorkViewName();
  const active=workViews.find(view=>view.id===activeWorkView);
  if ($('#update-work-view')) $('#update-work-view').onclick=()=>{active.config=captureWorkView();active.name=workViewDraftName ?? active.name;workViewDraftName=null;persistWorkViews();renderOperations();};
  if ($('#reset-work-view')) $('#reset-work-view').onclick=()=>{workViewDraftName=null;applyWorkView(active.config);renderOperations();};
  if ($('#save-new-work-view')) $('#save-new-work-view').onclick=()=>{$('#work-save-menu').hidePopover();editWorkViewName();};
  document.querySelectorAll('.work-views [popovertarget]').forEach(trigger=>{
    const menu=document.getElementById(trigger.getAttribute('popovertarget'));
    trigger.setAttribute('aria-haspopup','menu');
    trigger.setAttribute('aria-expanded','false');
    menu.setAttribute('role','menu');
    menu.setAttribute('aria-label',trigger.getAttribute('aria-label'));
    const items=[...menu.querySelectorAll('button')];
    items.forEach(item=>{
      item.className='work-menu-item'; item.setAttribute('role','menuitem'); item.tabIndex=-1;
      const label=item.textContent, danger=item.dataset.viewAction==='delete';
      const symbol=danger?'delete':item.dataset.viewAction==='rename'?'edit':item.id==='update-work-view'?'save':item.id==='reset-work-view'?'undo':'add';
      item.dataset.tone=danger?'danger':'default'; item.dataset.menuLabel=label;
      item.innerHTML='<span class="ds-symbol" aria-hidden="true">'+symbol+'</span><span>'+esc(label)+'</span>';
    });
    let focusLast=false;
    trigger.onkeydown=event=>{if(['ArrowDown','ArrowUp'].includes(event.key)){event.preventDefault();focusLast=event.key==='ArrowUp';menu.showPopover();}};
    menu.addEventListener('toggle',event=>{
      trigger.setAttribute('aria-expanded',String(event.newState==='open'));
      if(event.newState==='open'){(focusLast?items.at(-1):items[0])?.focus();focusLast=false;}
    });
    let search='',searchAt=0;
    menu.onkeydown=event=>{
      const i=items.indexOf(document.activeElement);
      if(event.key==='Escape'){event.preventDefault();menu.hidePopover();trigger.focus();}
      else if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault(); const next=event.key==='Home'?0:event.key==='End'?items.length-1:(i+(event.key==='ArrowDown'?1:-1)+items.length)%items.length;items[next]?.focus();
      } else if(event.key==='Tab'){menu.hidePopover();trigger.focus();}
      else if(event.key.length===1 && event.key!==' ' && !event.ctrlKey && !event.metaKey){
        search=Date.now()-searchAt>700?event.key:search+event.key;searchAt=Date.now();
        items.find(item=>item.dataset.menuLabel.toLocaleLowerCase().startsWith(search.toLocaleLowerCase()))?.focus();
      }
    };

    menu.addEventListener('beforetoggle',event=>{
      if(event.newState!=='open') return;
      const rect=trigger.getBoundingClientRect();
      menu.style.left=Math.max(8,Math.min(rect.right-(menu.id==='work-save-menu'?300:240),window.innerWidth-(menu.id==='work-save-menu'?308:248)))+'px';
      menu.style.top=Math.min(rect.bottom+8,window.innerHeight-150)+'px';
    });
  });
  document.querySelectorAll('[data-view-action]').forEach(button=>button.onclick=()=>{
    const target=workViews.find(view=>view.id===button.dataset.viewId);
    if(target.id==='system-pending') return;
    button.closest('[popover]').hidePopover();
    if (button.dataset.viewAction==='rename') return editWorkViewName(true,target.id);
    modal('Удалить представление','<p>Удалить представление «'+esc(target.name)+'»?</p><div class="actions"><button class="btn" id="cancel-delete-view">Отмена</button><button class="btn primary" id="confirm-delete-view">Удалить</button></div>',()=>{
      $('#cancel-delete-view').onclick=()=>$('#dialog').close();
      $('#confirm-delete-view').onclick=()=>{
        workViews=workViews.filter(view=>view.id!==target.id);
        if(activeWorkView===target.id){activeWorkView='';workViewDraftName=null;applyWorkView(allWorkView);}
        persistWorkViews();$('#dialog').close();renderOperations();
      };
    });
  });
}

function workTableCell(work,key) {
  if (key === 'field') return '<span class="field-no">'+String(work.field).padStart(2,'0')+'</span><strong>'+esc(getField(work.field).name)+'</strong>';
  if (key === 'crop') return esc(currentCrop(getField(work.field),work.season) || 'Культура не назначена');
  if (key === 'machine' || key === 'driver') return esc(work[key]);
  if (key === 'time') return esc(work.time)+'<small>'+esc(work.duration)+'</small>';
  if (key === 'fieldArea') return fmt(getField(work.field).area)+' га';
  if (key === 'status') return statusBadge(work);
  return workExtraCell(work,key);
}
function workExtraCell(work,key) {
  if (key === 'operation' || key === 'implement') return esc(work[key] || '—');
  if (work.status !== 'confirmed') return '—';
  if (key === 'material') return esc(work.material || 'Без материалов');
  if (key === 'rate' || key === 'consumption') return work.material && Number.isFinite(work.rate) ? fmt(key === 'rate' ? work.rate : work.finalArea * work.rate)+' '+esc(work.unit || 'кг')+(key === 'rate' ? '/га' : '') : '—';
  const value = key === 'gaps' ? (work.gaps ?? getField(work.field).area-work.net) : work[key];
  return Number.isFinite(value) ? fmt(value) : '—';
}
function renderOperations() {
  const seasonWorks = works.filter(w => String(w.season) === season);
  const filterFields = [...new Set(seasonWorks.map(w => w.field))].map(id => [String(id), '№ ' + String(id).padStart(2,'0') + ' · ' + getField(id).name]);
  const filterCrops = [...new Set(seasonWorks.map(w => currentCrop(getField(w.field), w.season) || 'Культура не назначена'))].map(name => [name,name]);
  const filterMachines = [...new Set(seasonWorks.map(w => w.machine))].map(name => [name,name]);
  const filterDrivers = [...new Set(seasonWorks.map(w => w.driver))].map(name => [name,name]);
  const list = filteredWorks();
  const orderedColumns = workColumnOrder.map(key => workColumns.find(([id]) => id === key));
  const visibleColumns = orderedColumns.filter(([key]) => workVisibleColumns.includes(key));
  main.innerHTML = `${heading('Полевые операции', 'Выберите работу для просмотра трека и расчёта площади.', button('Обновить треки', 'sync', false, 'sync'))}
    ${workViewsMarkup()}
    <div class="toolbar"><div class="row">${workFilterMarkup('work-field','Поле',filterFields,workField)}${workFilterMarkup('work-crop','Культура',filterCrops,workCrop)}${workFilterMarkup('work-machine','Техника',filterMachines,workMachine)}${workFilterMarkup('work-driver','Механизатор',filterDrivers,workDriver)}${workFilterMarkup('work-status','Статус',[['pending','Ждёт расчёта'],['confirmed','Подтверждена'],['rejected','Отклонена']],status)}</div><button type="button" class="btn" id="configure-work-columns"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/></svg>Колонки</button></div>
    <section class="table-panel"><div class="table-scroll"><table><thead><tr>${visibleColumns.map(([,title]) => `<th>${title}</th>`).join('')}<th></th></tr></thead><tbody>${list.map(w => `<tr class="clickable" data-work="${w.id}">${visibleColumns.map(([key]) => `<td>${workTableCell(w,key)}</td>`).join('')}<td><button class="table-button" aria-label="Открыть работу ${esc(getField(w.field).name)}">${icon('arrow')}</button></td></tr>`).join('') || `<tr><td colspan="${visibleColumns.length+1}" class="empty">Работы не найдены</td></tr>`}</tbody></table></div></section>`;
  $('#sync').onclick = () => toast('Демо-треки актуальны. Подключение к Авроре GPS появится в рабочей версии.');
  bindWorkFilters();
  if(activeWorkView==='system-pending') {
    const trigger=$('#work-status');
    trigger.disabled=true; trigger.title='Статус закреплён для этого представления';
    trigger.parentElement.querySelectorAll('[data-filter-clear]').forEach(button=>button.hidden=true);
  }
  bindWorkViews();
  $('#configure-work-columns').onclick = openWorkColumns;
  $$('[data-work]').forEach(row => row.onclick = () => { location.hash = `operations/${row.dataset.work}`; });

}
function openWorkColumns() {
  let visible=workColumnOrder.filter(key=>workVisibleColumns.includes(key));
  let hidden=workColumnOrder.filter(key=>!workVisibleColumns.includes(key));
  let draggedColumn=null;
  const label=key=>workColumns.find(([id])=>id===key)[1];
  modal('Настройка колонок', '<p>Перетащите колонки, чтобы изменить порядок или видимость.</p><div class="column-lists" id="column-lists"></div><p class="hint" id="column-status" role="status">С клавиатуры: Alt + ↑/↓ — порядок, Alt + ←/→ — перенос.</p><div class="column-dialog-actions"><button class="btn subtle" id="columns-default">По умолчанию</button><div class="row"><button class="btn" id="columns-cancel">Отмена</button><button class="btn primary" id="columns-apply">Применить</button></div></div>',()=>{
    const dialog=$('#dialog');dialog.classList.add('columns-dialog');
    dialog.addEventListener('close',()=>dialog.classList.remove('columns-dialog'),{once:true});
    const renderLists=()=>{
      $('#column-lists').innerHTML=[['visible','Видимые',visible],['hidden','Скрытые',hidden]].map(([group,title,items])=>'<section><h3>'+title+' <span class="hint">'+items.length+'</span></h3><div class="column-dropzone" data-column-group="'+group+'" aria-label="'+title+' колонки">'+items.map(key=>'<div class="column-card" draggable="true" data-column-key="'+key+'"><button class="column-drag" type="button" aria-label="Переместить: '+esc(label(key))+'"><span class="ds-symbol" aria-hidden="true">drag_indicator</span></button><span>'+esc(label(key))+'</span><button type="button" class="column-transfer" data-transfer="'+key+'" aria-label="'+(group==='visible'?'Скрыть: ':'Показать: ')+esc(label(key))+'">'+(group==='visible'?'→':'←')+'</button></div>').join('')+'</div></section>').join('');
      document.querySelectorAll('.column-card').forEach(card=>{
        card.ondragstart=event=>{draggedColumn=card.dataset.columnKey;event.dataTransfer.setData('text/plain',draggedColumn);event.dataTransfer.effectAllowed='move';};
        card.ondragend=()=>{draggedColumn=null;};
      });
      document.querySelectorAll('[data-column-group]').forEach(zone=>{
        zone.ondragover=event=>{event.preventDefault();event.dataTransfer.dropEffect='move';};
        zone.ondrop=event=>{event.preventDefault();if(!draggedColumn)return;const row=event.target.closest('[data-column-key]');const before=row?(event.clientY<row.getBoundingClientRect().top+row.offsetHeight/2?row.dataset.columnKey:row.nextElementSibling?.dataset.columnKey):null;move(draggedColumn,zone.dataset.columnGroup,before);draggedColumn=null;};
      });
      document.querySelectorAll('[data-transfer]').forEach(button=>button.onclick=()=>move(button.dataset.transfer,visible.includes(button.dataset.transfer)?'hidden':'visible'));
      document.querySelectorAll('.column-drag').forEach(handle=>{
        handle.onkeydown=event=>{
          if(!event.altKey || !['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key))return;
          event.preventDefault();const key=handle.closest('[data-column-key]').dataset.columnKey,group=visible.includes(key)?'visible':'hidden',items=group==='visible'?visible:hidden;
          if(event.key==='ArrowLeft'||event.key==='ArrowRight')move(key,event.key==='ArrowLeft'?'visible':'hidden');
          else {const index=items.indexOf(key),target=index+(event.key==='ArrowUp'?-1:1);if(target<0||target>=items.length)return;[items[index],items[target]]=[items[target],items[index]];renderLists();}
          document.querySelector('[data-column-key="'+key+'"] .column-drag')?.focus();
        };
        handle.draggable=true;
      });
    };
    const move=(key,group,before=null)=>{
      if(group==='hidden'&&visible.includes(key)&&visible.length===1){$('#column-status').textContent='Оставьте хотя бы одну видимую колонку.';return;}
      if(before===key)return;
      visible=visible.filter(id=>id!==key);hidden=hidden.filter(id=>id!==key);
      const items=group==='visible'?visible:hidden,index=items.indexOf(before);items.splice(index<0?items.length:index,0,key);
      renderLists();$('#column-status').textContent='Колонка «'+label(key)+'» перемещена.';
    };
    renderLists();
    $('#columns-default').onclick=()=>{visible=[...defaultWorkColumns];hidden=workColumns.map(([key])=>key).filter(key=>!visible.includes(key));renderLists();};
    $('#columns-cancel').onclick=()=>dialog.close();
    $('#columns-apply').onclick=()=>{workVisibleColumns=[...visible];workColumnOrder=[...visible,...hidden];saveWorkColumns();dialog.close();renderOperations();$('#configure-work-columns').focus();};
  });
}
function renderOperation(work) {
  if (selected !== work.id || !draft) { selected = work.id; initDraft(); }
  main.innerHTML = `<div class="operation-layout"><aside class="operation-sidebar" aria-label="Расчёт операции"><div class="operation-back"><a class="btn subtle" href="#operations/day/${work.date}">← К списку работ</a>${statusBadge(work)}</div><section class="editor" aria-label="Подтверждение работы">${editorMarkup()}</section></aside>${mapMarkup(getField(work.field), !!result || work.status === 'confirmed', true, false)}</div>`;
  bindMap();
  bindEditor();
}
function operationStepperMarkup() {
  const steps=[['settings','Параметры'],['area','Площадь'],['materials','Использованные материалы']];
  const active=steps.findIndex(([id])=>id===step);
  return '<ol class="operation-stepper" aria-label="Расчёт полевой операции">'+steps.map(([id,label],index)=>{
    const state=index===active?'current':index<active?'completed':'upcoming';
    const summary=id==='settings'?`${esc(draft.operation)} · ${esc(draft.implement)} · ${fmt(draft.width,1)} м`:`Площадь к учёту · ${fmt(draft.finalArea)} га`;
    return `<li data-step-state="${state}"><div class="operation-step" ${index===active?'aria-current="step"':''}><span class="operation-step-number" aria-hidden="true">${index<active?'<span class="ds-symbol">check</span>':index+1}</span><span class="operation-step-label" id="step-${id}-title">${label}</span><span class="visually-hidden">, шаг ${index+1} из 3, ${index===active?'текущий':index<active?'завершён':'предстоящий'}</span></div>${index<active?`<p class="operation-step-summary">${summary}</p>`:''}${index===active?`<div class="operation-step-content" role="region" aria-labelledby="step-${id}-title">${operationStepContentMarkup()}</div>`:''}</li>`;
  }).join('')+'</ol>';
}
function operationSummaryMarkup(w, f) {
  const row = (label, value) => `<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`;
  const area = value => Number.isFinite(value) ? `${fmt(value)} га` : '—';
  const gaps = Number.isFinite(w.gaps) ? w.gaps : Number.isFinite(w.net) ? Math.max(0, f.area - w.net) : null;
  return `<div class="operation-summary">
    <div class="operation-result"><span class="operation-result-label">Площадь к учёту</span><div class="operation-result-value">${fmt(w.finalArea)} <span>га</span></div><span class="operation-result-note">${icon('check')}Работа включена в отчёт</span></div>
    <section class="operation-summary-section" aria-labelledby="summary-parameters"><h3 id="summary-parameters">Параметры работы</h3><dl>${row('Операция',w.operation || '—')}${row('Прицепное орудие',w.implement || '—')}${row('Ширина захвата',Number.isFinite(w.width)?`${fmt(w.width,1)} м`:'—')}${row('Механизатор',w.driver || 'Не назначен')}${row('Сезон',w.season || '—')}${row('Культура',currentCrop(f,w.season) || 'Не назначена')}</dl></section>
    <section class="operation-summary-section" aria-labelledby="summary-area"><h3 id="summary-area">Результаты расчёта</h3><dl>${row('Чистая площадь',area(w.net))}${row('Перекрытия',area(w.overlap))}${row('Пропуски',area(gaps))}</dl></section>
    <section class="operation-summary-section" aria-labelledby="summary-materials"><h3 id="summary-materials">Использованные материалы</h3>${w.material?`<p class="operation-summary-material">${esc(w.material)}</p><dl>${row('Норма на гектар',`${fmt(w.rate,3)} ${w.unit || 'кг'}/га`)}${row('Общий расход',`${fmt(w.finalArea*w.rate,3)} ${w.unit || 'кг'}`)}</dl>`:'<p class="operation-summary-empty">Материалы не использовались</p>'}</section>
    <div class="operation-summary-actions">${button('Открыть отчёт','open-report',true,'reports')}${button('Вернуть к проверке','reopen')}</div>
  </div>`;
}
function editorMarkup() {
  const w = currentWork(), f = getField(w.field);
  const header = `<h2>${esc(w.machine)} ${esc(w.plate)}</h2><div class="machine-line">${icon('clock')}<span>${w.time}</span><span>${w.duration}</span></div><div class="work-crop work-field"><span class="work-crop-label">Поле:</span><strong>№ ${f.id} · ${esc(f.name)}</strong><span class="work-crop-label">${fmt(f.area)} га</span></div>`;
  if (w.status === 'confirmed') return `${header}${operationSummaryMarkup(w,f)}`;
  if (w.status === 'rejected') return `${header}<div class="saved-message">${icon('help')}<h2>Работа отклонена</h2><p>Эта работа не включена в отчёты.</p></div><div class="actions">${button('Вернуть к проверке','reopen')}</div>`;
  return `${header}<label class="operation-season">Сезон<div class="operation-control"><select id="work-season">${options(['2025','2026','2027'],draft.season)}</select><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span></div></label><div class="work-crop" id="draft-crop-card" style="background:${esc(cropColors[currentCrop(f,draft.season)] || 'var(--ds-bg-sunken)')}">${icon('leaf')}<span class="work-crop-label">Культура</span><strong id="draft-crop">${esc(currentCrop(f,draft.season) || 'Культура не назначена')}</strong></div><div class="operation-picker operation-driver"><label for="driver">Механизатор</label><div class="operation-control"><input id="driver" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="driver-options" autocomplete="off" required placeholder="Выберите механизатора" value="${esc(draft.driver)}"><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span><div id="driver-options" class="operation-options" role="listbox" aria-label="Механизаторы" hidden></div></div><span id="driver-search-status" class="visually-hidden" role="status" aria-live="polite"></span></div>${operationStepperMarkup()}<div class="operation-work-actions">${button('Отклонить работу','reject',false,'close')}</div>`;
}
function operationStepContentMarkup() {
  const f = getField(currentWork().field);
  return `
    ${step === 'settings' ? `<div class="form-grid"><div class="full operation-picker"><label for="operation">Технологическая операция</label><div class="operation-control"><input id="operation" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="operation-options" autocomplete="off" required placeholder="Выберите или найдите операцию" value="${esc(draft.operation)}"><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span></div><div id="operation-options" class="operation-options" role="listbox" aria-label="Технологические операции" hidden></div><span id="operation-search-status" class="visually-hidden" role="status" aria-live="polite"></span></div><div class="full operation-picker"><label for="implement">Прицепное орудие</label><div class="operation-control"><input id="implement" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="implement-options" autocomplete="off" required placeholder="Выберите или найдите орудие" value="${esc(draft.implement)}"><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span><div id="implement-options" class="operation-options" role="listbox" aria-label="Прицепные орудия" hidden></div></div><span id="implement-search-status" class="visually-hidden" role="status" aria-live="polite"></span><span class="width-note">Ширина захвата: <strong id="width-text">${fmt(draft.width,1)} м</strong></span></div></div><div class="actions operation-calculate-actions"><p class="calculate-note">Расчёт покажет чистую площадь, пропуски и перекрытия.</p>${button('Запустить расчёт','calculate',true,'play')}</div>` : ''}
    ${step === 'area' ? `<div class="calculation"><span class="eyebrow">Чистая обработанная площадь</span><div class="big-number">${fmt(result.net)} <small>га</small></div><div class="calculation-details"><div>Площадь поля<strong>${fmt(f.area)} га</strong></div><div>Перекрытия<strong>${fmt(result.overlap)} га</strong></div><div>Пропуски<strong>${fmt(result.gaps)} га</strong></div></div></div><h3>Какую площадь учесть?</h3><div class="area-choices">${[['calculated',`Расчётную · ${fmt(result.net)} га`],['field',`До площади поля · ${fmt(f.area)} га`],['manual','Ввести вручную']].map(([value,title]) => `<label class="choice"><input type="radio" name="area-mode" value="${value}" ${areaMode === value ? 'checked' : ''}>${title}</label>`).join('')}</div><label id="manual-area-label" ${areaMode !== 'manual' ? 'hidden' : ''}>Площадь, га<input id="manual-area" type="number" min="0.01" max="100000" step="0.01" value="${esc(manualArea)}"></label><p class="calculate-note">Перекрытия показаны отдельно. При повторном проходе или смещении трекера проверьте результат перед учётом.</p><div class="actions operation-step-actions">${button('Назад','back-settings')}${button('Подтвердить площадь','accept-area',true)}</div>` : ''}
    ${step === 'materials' ? `<div class="materials-box"><div class="form-grid"><label class="full">Материал<select id="material">${options(['',...new Set([...materialsCatalog.map(item=>item.name),...(draft.material?[draft.material]:[])])],draft.material || '')}</select></label><label>Норма на гектар<input id="rate" type="number" min="0.001" max="100000" step="any" value="${draft.rate || ''}" placeholder="Например, 220" ${!draft.material ? 'disabled' : ''}></label><label>Единица измерения<select id="unit" ${!draft.material ? 'disabled' : ''}>${options(['кг','л','т'],draft.unit || 'кг')}</select></label></div><div class="amount"><span>Всего материала</span><strong id="material-total">${draft.material ? `${fmt(draft.finalArea*(draft.rate || 0))} ${esc(draft.unit || 'кг')}` : 'Без материалов'}</strong></div></div><div class="actions operation-step-actions">${button('Назад','back-area')}${button('Подтвердить работу','confirm-work',true,'check')}</div>` : ''}
    `;
}
function redrawEditor() { $('.editor').innerHTML = editorMarkup(); bindEditor(); $('#field-map').classList.toggle('calculated',!!result); }
function compatibleImplements(operation) {
  return implementsCatalog.filter(item=>item.operations.includes(operation));
}
function previewCoverageWidth(width, area) {
  if (!Number.isFinite(width) || !Number.isFinite(area) || width <= 0 || area <= 0) return 0;
  const contour = [[161,125],[503,102],[541,347],[439,451],[195,461],[142,333]];
  const schematicArea = Math.abs(contour.reduce((sum,[x,y],i)=>{const [nx,ny]=contour[(i+1)%contour.length];return sum+x*ny-nx*y;},0))/2;
  // На условной схеме увеличиваем полосу для читаемости; соотношение ширин сохраняется.
  return 3 * width * Math.sqrt(schematicArea / (area * 10000));
}
function updateCoveragePreview() {
  const layer = $('#coverage-preview');
  if (!layer) return;
  const visible = !!operationFromRoute() && currentWork().status==='pending' && !result && compatibleImplements(draft.operation).some(item=>item.name===draft.implement);
  layer.style.display = visible ? '' : 'none';
  $('#field-map').classList.toggle('has-coverage-preview', visible);
  layer.setAttribute('stroke-width', String(previewCoverageWidth(draft.width, getField(draft.field).area)));
}
function canCalculateOperation() {
  return systemOperations.includes(draft?.operation) && compatibleImplements(draft.operation).some(item=>item.name===draft.implement) && getDriverNames().includes(draft.driver);
}
function updateCalculateButton() {
  if ($('#calculate')) $('#calculate').disabled = !canCalculateOperation();
}
function syncDraftImplement() {
  const item=compatibleImplements(draft.operation).find(item=>item.name===draft.implement);
  if(!item){draft.implement='';draft.width=0;}
  else draft.width=item.width;
  if($('#implement'))$('#implement').value=draft.implement;
  if($('#width-text'))$('#width-text').textContent=item?fmt(item.width,1)+' м':'—';
}
function bindOperationPicker(id = 'operation', names = systemOperations) {
  const input = $('#'+id);
  if (!input) return;
  const list = $('#'+id+'-options');
  let matches = [], active = -1;
  const selectable = name => id!=='operation' || compatibleImplements(name).length>0;
  const available = () => id==='implement'?compatibleImplements(draft.operation).map(item=>item.name):names;
  const validate = () => input.setCustomValidity(available().includes(draft[id]) && selectable(draft[id]) ? '' : 'Выберите значение из списка.');
  const close = () => {
    list.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    input.value = draft[id];
    validate();
  };
  const highlight = () => {
    [...list.querySelectorAll('[role="option"]')].forEach((item, i) => item.classList.toggle('active', i === active));
    if (active < 0) { input.removeAttribute('aria-activedescendant'); return; }
    input.setAttribute('aria-activedescendant', `${id}-option-${active}`);
    list.children[active].scrollIntoView({ block: 'nearest' });
  };
  const open = (query = '') => {
    matches = available().filter(name => name.toLocaleLowerCase('ru').includes(query.trim().toLocaleLowerCase('ru')));
    if(id==='operation') matches.sort((a,b)=>Number(compatibleImplements(b).length>0)-Number(compatibleImplements(a).length>0) || a.localeCompare(b,'ru'));
    active = -1;
    list.innerHTML = matches.length ? matches.map((name, i) => `<div id="${id}-option-${i}" role="option" data-has-implement="${id==='operation' && compatibleImplements(name).length>0}" aria-selected="${name === draft[id]}" aria-disabled="${!selectable(name)}" ${!selectable(name)?'title="Добавьте прицепное оборудование для этой операции"':''} data-index="${i}">${esc(name)}</div>`).join('') : '<div class="operation-empty">'+(id==='implement' && !available().length?'В справочнике нет орудий для этой операции':'Ничего не найдено')+'</div>';
    list.hidden = false;
    input.setAttribute('aria-expanded', 'true');
    input.removeAttribute('aria-activedescendant');
    $('#'+id+'-search-status').textContent = matches.length ? `Найдено: ${matches.length}` : 'Ничего не найдено';
  };
  const choose = index => {
    if (!matches[index] || !selectable(matches[index])) return;
    draft[id] = matches[index];
    if(id==='implement'){draft.width=implementsCatalog.find(item=>item.name===draft.implement)?.width ?? draft.width;$('#width-text').textContent=fmt(draft.width,1)+' м';}
    close();
    if(id==='operation'){syncDraftImplement();bindOperationPicker('implement');}
    updateCalculateButton();
    updateCoveragePreview();
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
      const enabled=matches.map((name,index)=>selectable(name)?index:-1).filter(index=>index>=0);
      if(!enabled.length)return;
      const current=enabled.indexOf(active);
      active=enabled[event.key==='ArrowDown'?(current+1)%enabled.length:(current<=0?enabled.length-1:current-1)];
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
function syncOperationSelects() {
  $$('.operation-layout select').forEach(select=>select.refreshCustomSelect?.());
}
function enhanceOperationSelects() {
  $$('.operation-layout select').forEach(select=>{
    if (select.refreshCustomSelect) { select.refreshCustomSelect(); return; }
    const label = select.getAttribute('aria-label') || [...(select.labels?.[0]?.childNodes || [])].filter(node=>node.nodeType===3).map(node=>node.textContent).join('').trim();
    const wrapper=document.createElement('div');wrapper.className='operation-picker operation-select-adapter';
    const trigger=document.createElement('button');trigger.type='button';trigger.className='operation-select-trigger';
    trigger.setAttribute('role','combobox');trigger.setAttribute('aria-label',label);trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls',select.id+'-custom-options');
    const list=document.createElement('div');list.id=select.id+'-custom-options';list.className='operation-options';list.setAttribute('role','listbox');list.setAttribute('aria-label',label);list.hidden=true;
    select.after(wrapper);wrapper.append(trigger,list);select.hidden=true;
    select.parentElement.querySelector(':scope > .operation-chevron')?.remove();
    let active=0;
    const close=()=>{list.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.removeAttribute('aria-activedescendant');};
    const highlight=()=>{
      [...list.children].forEach((item,i)=>item.classList.toggle('active',i===active));
      if(list.children[active]){trigger.setAttribute('aria-activedescendant',list.children[active].id);list.children[active].scrollIntoView({block:'nearest'});}
    };
    const refresh=()=>{
      trigger.disabled=select.disabled;
      trigger.innerHTML=`<span>${esc(select.selectedOptions[0]?.textContent || 'Выберите значение')}</span><span class="ds-symbol" aria-hidden="true">expand_more</span>`;
      list.innerHTML=[...select.options].map((option,i)=>`<div role="option" id="${select.id}-custom-option-${i}" data-index="${i}" aria-selected="${option.selected}" aria-disabled="${option.disabled}">${esc(option.textContent)}</div>`).join('');
      if(select.disabled)close();
    };
    const open=()=>{syncOperationSelects();active=select.selectedIndex;list.hidden=false;trigger.setAttribute('aria-expanded','true');highlight();};
    const choose=index=>{
      const option=select.options[index];if(!option || option.disabled)return;
      select.value=option.value;close();select.dispatchEvent(new Event('change',{bubbles:true}));syncOperationSelects();trigger.focus();
    };
    trigger.onclick=()=>list.hidden?open():close();
    trigger.onblur=close;
    trigger.onkeydown=event=>{
      if(['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
        event.preventDefault();if(list.hidden)open();
        const enabled=[...select.options].map((option,i)=>option.disabled?-1:i).filter(i=>i>=0);if(!enabled.length)return;
        const current=enabled.indexOf(active);
        active=event.key==='Home'?enabled[0]:event.key==='End'?enabled.at(-1):enabled[event.key==='ArrowDown'?(current+1)%enabled.length:(current<=0?enabled.length-1:current-1)];highlight();
      } else if(event.key==='Enter' || event.key===' '){event.preventDefault();list.hidden?open():choose(active);}
      else if(event.key==='Escape'){event.preventDefault();close();}
      else if(event.key.length===1){const index=[...select.options].findIndex(option=>!option.disabled && option.textContent.toLocaleLowerCase('ru').startsWith(event.key.toLocaleLowerCase('ru')));if(index>=0){if(list.hidden)open();active=index;highlight();}}
    };
    list.onpointerdown=event=>event.preventDefault();
    list.onclick=event=>{const option=event.target.closest('[data-index]');if(option)choose(Number(option.dataset.index));};
    select.refreshCustomSelect=refresh;select.addEventListener('change',refresh);refresh();
  });
}
function bindEditor() {
  if ($('#reopen')) $('#reopen').onclick = () => { currentWork().status = 'pending'; persist(); status = ['pending']; initDraft(); render(); toast('Работа возвращена к проверке'); };
  if ($('#open-report')) $('#open-report').onclick = () => { reportDateFrom = currentWork().date; reportDateTo = currentWork().date; location.hash = 'reports'; };
  bindOperationPicker();
  if($('#implement'))syncDraftImplement();
  bindOperationPicker('implement');
  bindOperationPicker('driver', getDriverNames());
  updateCalculateButton();
  updateCoveragePreview();
  if ($('#work-season')) $('#work-season').onchange = e => {
    draft.season = e.target.value;
    const crop = currentCrop(getField(draft.field), draft.season);
    $('#draft-crop').textContent = crop || 'Культура не назначена';
    $('#draft-crop-card').style.background = cropColors[crop] || 'var(--ds-bg-sunken)';
  };
  if ($('#calculate')) $('#calculate').onclick = () => {
    if (!systemOperations.includes(draft.operation)) { $('#operation').reportValidity(); return; }
    if (!compatibleImplements(draft.operation).some(item=>item.name===draft.implement)) { $('#implement').reportValidity(); return; }
    if (!getDriverNames().includes(draft.driver)) { $('#driver').reportValidity(); return; }
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
    syncOperationSelects();
  };
  if ($('#material')) $('#material').onchange = () => {const item=materialsCatalog.find(item=>item.name===$('#material').value);if(item)$('#unit').value=item.unit;updateMaterial();};
  if ($('#rate')) $('#rate').oninput = updateMaterial;
  if ($('#unit')) $('#unit').onchange = updateMaterial;
  if ($('#confirm-work')) $('#confirm-work').onclick = () => {
    updateMaterial();
    if (draft.material && (!Number.isFinite(draft.rate) || draft.rate <= 0 || draft.rate > 100000)) { toast('Укажите положительную норму внесения до 100 000.'); $('#rate').focus(); return; }
    const name = getField(draft.field).name;
    Object.assign(currentWork(), draft, result, { status: 'confirmed' }); persist(); render(); toast(`«${name}»: работа подтверждена и включена в отчёт`);
  };
  if ($('#reject')) $('#reject').onclick = () => { currentWork().status = 'rejected'; persist(); render(); toast('Работа отклонена. Вернуть её можно через фильтр «Отклонена».'); };
  enhanceOperationSelects();
}
function renderFields() {
  if (drawing) { renderFieldDrawing(); return; }
  const filtered = fields.filter(f => `${f.name} ${f.id}`.toLowerCase().includes(fieldQuery.toLowerCase()));
  const f = getField(fieldSelected);
  main.innerHTML = `<div class="fields-layout"><aside class="field-sidebar" aria-label="Поля хозяйства"><div class="field-sidebar-heading"><h1>Поля хозяйства</h1><p>${fields.length} полей · ${fmt(fields.reduce((sum,f) => sum + f.area,0))} га</p><div class="field-sidebar-actions">${button('Импорт','import-fields')}${button('Экспорт','export-fields')}${button('Добавить','draw-field',true)}</div><div class="field-sidebar-search">${searchBox('field-search','Название или номер поля',fieldQuery)}</div></div><div class="field-list">${filtered.map(field => `<div class="field-card ${field.id === fieldSelected ? 'active' : ''}"><button class="field-card-select" data-field="${field.id}"><strong><span class="field-no">${String(field.id).padStart(2,'0')}</span>${esc(field.name)}</strong><small>${field.contour ? 'Площадь не рассчитана' : `Учётная площадь ${fmt(field.area)} га`}</small><div class="row">${cropTag(currentCrop(field))}</div></button><a class="field-card-edit" href="#fields/${field.id}/edit" aria-label="Редактировать поле ${esc(field.name)}" title="Редактировать поле">${icon('edit')}</a></div>`).join('') || '<p class="empty">Поля не найдены</p>'}</div></aside>${mapMarkup(f,false,false,false)}</div>`;
  bindMap();
  $$('[data-field]').forEach(b => b.onclick = () => { fieldSelected = Number(b.dataset.field); drawing = false; drawPoints = []; renderFields(); });
  $('#field-search').oninput = e => { fieldQuery = e.target.value; renderFields(); $('#field-search').focus(); };
  $('#import-fields').onclick = () => modal('Импорт полей', '<p>В рабочей версии контуры загружаются из KML, KMZ или SHP. В этом макете можно проверить выбор файла; обработка геометрии не выполняется.</p><label>Файл с контурами<input type="file" id="contour-file" accept=".kml,.kmz,.shp"></label><p id="file-state" class="section-note">Файл останется на вашем компьютере.</p>', () => $('#contour-file').onchange = e => { $('#file-state').textContent = e.target.files[0] ? `Выбран файл: ${e.target.files[0].name}. Для импорта потребуется рабочая версия сервиса.` : 'Файл не выбран'; });
  $('#export-fields').onclick = () => {
    const years = [...new Set(fields.flatMap(field => Object.keys(field.rotation)))].sort((a,b) => Number(a) - Number(b));
    downloadCsv('Поля.csv', [['Номер поля','Название','Площадь, га',...years.map(year => `Культура ${year}`)], ...fields.map(field => [field.id,field.name,fmt(field.area),...years.map(year => field.rotation[year] || '')])]);
  };
  $('#draw-field').onclick = () => { drawing = true; drawPoints = []; zoom = 1; renderFields(); };
}


function polygonArea(points) {
  return points.length < 3 ? 0 : Math.abs(points.reduce((sum,p,i)=>{const next=points[(i+1)%points.length];return sum+p[0]*next[1]-next[0]*p[1];},0))/2000;
}
function pointInPolygon([x,y], points) {
  let inside=false;
  for(let i=0,j=points.length-1;i<points.length;j=i++) {
    const [xi,yi]=points[i], [xj,yj]=points[j];
    if((yi>y)!==(yj>y) && x<(xj-xi)*(y-yi)/(yj-yi)+xi) inside=!inside;
  }
  return inside;
}
function polygonEdgesIntersect(a,b, self=false) {
  const cross=(p,q,r)=>(q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0]);
  const on=(p,q,r)=>cross(p,q,r)===0 && r[0]>=Math.min(p[0],q[0]) && r[0]<=Math.max(p[0],q[0]) && r[1]>=Math.min(p[1],q[1]) && r[1]<=Math.max(p[1],q[1]);
  for(let i=0;i<a.length;i++) for(let j=0;j<b.length;j++) {
    if(self && (i===j || (i+1)%a.length===j || (j+1)%a.length===i)) continue;
    const p=a[i],q=a[(i+1)%a.length],r=b[j],t=b[(j+1)%b.length];
    if((cross(p,q,r)*cross(p,q,t)<0 && cross(r,t,p)*cross(r,t,q)<0) || on(p,q,r) || on(p,q,t) || on(r,t,p) || on(r,t,q)) return true;
  }
  return false;
}
function exclusionError(contour, exclusions) {
  for(let i=0;i<exclusions.length;i++) {
    const points=exclusions[i], label='Участок '+(i+1)+': ';
    if(points.length<3 || !polygonArea(points)) return label+'отметьте не менее трёх точек вокруг площади.';
    if(polygonEdgesIntersect(points,points,true)) return label+'границы не должны пересекаться.';
    if(!points.every(p=>pointInPolygon(p,contour)) || polygonEdgesIntersect(points,contour)) return label+'разместите участок внутри поля.';
    for(let j=0;j<i;j++) if(polygonEdgesIntersect(points,exclusions[j]) || pointInPolygon(points[0],exclusions[j]) || pointInPolygon(exclusions[j][0],points)) return label+'необрабатываемые участки не должны пересекаться.';
  }
  return '';
}
function renderFieldDrawing(editingField = null) {
  if (editingField) {
    drawing=true; fieldSelected=editingField.id; zoom=1;
    drawPoints=structuredClone(editingField.contour || [[161,125],[503,102],[541,347],[439,451],[195,461],[142,333]]);
  }
  main.innerHTML = `<div class="fields-layout"><aside class="field-sidebar field-drawing" aria-label="${editingField ? 'Редактирование поля' : 'Добавление поля'}"><div class="field-sidebar-heading"><h1>${editingField ? 'Редактировать поле' : 'Добавить поле'}</h1><p>Нарисуйте контур и укажите данные поля.</p></div><form id="new-field-form" class="field-drawing-form"><label>Номер поля<input id="new-field-number" type="number" min="1" step="1" required value="${editingField ? editingField.id : ''}" placeholder="Например, 36"></label><label>Название поля<input id="new-field-name" required maxlength="100" value="${editingField ? esc(editingField.name) : ''}" placeholder="Например, Южное"></label><label>Культура · сезон ${season}<select id="field-current-crop">${options(crops,editingField?.rotation[season] || '')}</select></label><div class="field-drawing-guide"><h2>Контуры</h2><p>Нажимайте на карте, чтобы отметить углы поля. Перетаскивайте точки для изменения контура. Нужно не менее трёх точек.</p><button class="field-drawing-area field-contour-pick" type="button" id="edit-field-contour" aria-pressed="true"><span>Обрабатываемая площадь</span><strong id="draw-area" aria-live="polite">0,00 га</strong><span class="area-detail"><span>Общая</span><span id="draw-total-area">0,00 га</span></span><span class="area-detail"><span>Необрабатываемая</span><span id="draw-excluded-area">0,00 га</span></span></button><div class="field-exclusions"><h2>Необрабатываемые участки</h2><div id="exclusion-list"></div><div class="exclusion-actions"><button class="btn" type="button" id="add-exclusion">Добавить участок</button></div></div></div><p id="draw-error" class="field-drawing-error" role="alert"></p><div class="field-drawing-actions"><button class="btn" type="button" id="cancel-draw">Отмена</button><button class="btn primary" type="submit" id="finish-draw" disabled>Сохранить</button></div></form></aside>${mapMarkup(getField(fieldSelected),false,false,false)}</div>`;

  const updateSaveButton = () => {
    const numberInput = $('#new-field-number');
    $('#finish-draw').disabled = !numberInput.value.trim() || !numberInput.validity.valid || !$('#new-field-name').value.trim();
  };
  $('#new-field-number').oninput = updateSaveButton;
  $('#new-field-name').oninput = updateSaveButton;
  updateSaveButton();
  bindMap();
  const drawHistory = [], redoHistory = [];
  const recordHistory = state => { drawHistory.push(state); redoHistory.length=0; };
  let exclusions = structuredClone(editingField?.exclusions || []), exclusionNames = exclusions.map((p,i)=>editingField?.exclusionNames?.[i] || 'Участок '+(i+1)), activeContour = -1;
  let nextExclusionNumber = Math.max(exclusions.length,...exclusionNames.map(name=>Number(/^Участок (\d+)$/.exec(name)?.[1] || 0)))+1;
  const activePoints = () => activeContour < 0 ? drawPoints : exclusions[activeContour];
  const snapshot = () => structuredClone({ contour: drawPoints, exclusions, exclusionNames, nextExclusionNumber, activeContour });
  const restore = state => { drawPoints=state.contour; exclusions=state.exclusions; exclusionNames=state.exclusionNames; nextExclusionNumber=state.nextExclusionNumber; activeContour=state.activeContour; };
  const updateContour = () => {
    const shape=(points,index)=>'<'+(points.length>=3?'polygon':'polyline')+' points="'+points.map(p=>p.join(',')).join(' ')+'" fill="'+(index<0?'#21684822':'#d58d6355')+'" stroke="'+(index<0?'#216848':'#ae5d22')+'" stroke-width="3"/>';
    $('#draw-layer').innerHTML = shape(drawPoints,-1)+exclusions.map(shape).join('')+activePoints().map(([x,y],index)=>'<circle class="draw-point" data-vertex="'+index+'" cx="'+x+'" cy="'+y+'" r="5"/>').join('');
    const total=polygonArea(drawPoints), excluded=exclusions.reduce((sum,p)=>sum+polygonArea(p),0);
    $('#draw-area').textContent = fmt(Math.max(0,total-excluded))+' га';
    $('#draw-total-area').textContent = fmt(total)+' га';
    $('#draw-excluded-area').textContent = fmt(excluded)+' га';
    $('#edit-field-contour').setAttribute('aria-pressed', String(activeContour<0));
    $('#exclusion-list').innerHTML = exclusions.map((points,i)=>'<div class="exclusion-item '+(activeContour===i?'active':'')+'"><input class="exclusion-name-input" data-exclusion-name="'+i+'" maxlength="100" aria-label="Название участка '+(i+1)+'" value="'+esc(exclusionNames[i])+'"><button type="button" class="exclusion-remove" data-remove-exclusion="'+i+'" aria-label="Удалить участок '+(i+1)+'">×</button><button type="button" class="exclusion-pick" data-exclusion="'+i+'" aria-pressed="'+(activeContour===i)+'"><strong>'+fmt(polygonArea(points))+' га</strong></button></div>').join('');
    $('#add-exclusion').disabled = drawPoints.length<3 || !polygonArea(drawPoints) || exclusions.some(p=>p.length<3);
    $('#undo-draw').disabled = !drawHistory.length;
    $('#redo-draw').disabled = !redoHistory.length;
    $('#draw-error').textContent = '';
  };
  const svg = $('#field-map');
  let pointer = null;
  const mapPoint = e => {
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
    return p.matrixTransform($('#map-world').getScreenCTM().inverse());
  };
  svg.onpointerdown = e => {
    if (pointer || !e.isPrimary || e.button !== 0) return;
    const vertex = e.target.closest('[data-vertex]');
    const index = vertex ? Number(vertex.dataset.vertex) : null;
    const start = mapPoint(e);
    pointer = { id: e.pointerId, index, start, original: index === null ? null : [...activePoints()[index]], x: e.clientX, y: e.clientY, moved: false, snapshot: snapshot() };
    svg.setPointerCapture(e.pointerId);
    svg.classList.toggle('dragging-vertex', index !== null);
    e.preventDefault();
  };
  svg.onpointermove = e => {
    if (!pointer || e.pointerId !== pointer.id) return;
    if (Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y) > 4) pointer.moved = true;
    if (pointer.index === null) return;
    const p = mapPoint(e);
    activePoints()[pointer.index] = [Math.round(pointer.original[0]+p.x-pointer.start.x),Math.round(pointer.original[1]+p.y-pointer.start.y)];
    updateContour();
  };
  const finishPointer = (e, cancelled = false) => {
    if (!pointer || e.pointerId !== pointer.id) return;
    if (cancelled && pointer.index !== null) drawPoints[pointer.index] = pointer.original;
    if (!cancelled && pointer.index === null && !pointer.moved) {
      const p = mapPoint(e), next = [Math.round(p.x),Math.round(p.y)];
      if (!activePoints().some(p=>p[0]===next[0] && p[1]===next[1])) activePoints().push(next);
    }
    if (!cancelled && JSON.stringify(snapshot()) !== JSON.stringify(pointer.snapshot)) recordHistory(pointer.snapshot);
    const id = pointer.id; pointer = null;
    svg.classList.remove('dragging-vertex');
    if (svg.hasPointerCapture(id)) svg.releasePointerCapture(id);
    updateContour();
  };
  svg.onpointerup = e => finishPointer(e);
  svg.onpointercancel = e => finishPointer(e,true);
  svg.onlostpointercapture = e => finishPointer(e,true);
  $('#undo-draw').onclick = () => {
    if (!drawHistory.length || pointer) return;
    redoHistory.push(snapshot());
    restore(drawHistory.pop());
    updateContour();
  };
  $('#redo-draw').onclick = () => {
    if (!redoHistory.length || pointer) return;
    drawHistory.push(snapshot());
    restore(redoHistory.pop());
    updateContour();
  };
  $('#edit-field-contour').onclick = () => { if(pointer) return; activeContour=-1; updateContour(); };
  $('#exclusion-list').onclick = e => {
    if(pointer) return;
    const remove=e.target.closest('[data-remove-exclusion]'), select=e.target.closest('[data-exclusion]');
    if(remove) {
      const index=Number(remove.dataset.removeExclusion);
      recordHistory(snapshot()); exclusions.splice(index,1); exclusionNames.splice(index,1);
      if(activeContour===index) activeContour=-1; else if(activeContour>index) activeContour--;
    } else if(select) activeContour=Number(select.dataset.exclusion); else return;
    updateContour();
  };
  $('#exclusion-list').onchange = e => {
    const input=e.target.closest('[data-exclusion-name]');
    if(!input || pointer) return;
    const index=Number(input.dataset.exclusionName), previous=exclusionNames[index];
    const name=input.value.trim() || previous;
    if(name!==previous) { recordHistory(snapshot()); exclusionNames[index]=name; }
    input.value=name;
    $('#undo-draw').disabled=!drawHistory.length;
    $('#redo-draw').disabled=!redoHistory.length;
  };
  $('#add-exclusion').onclick = () => {
    if(pointer || $('#add-exclusion').disabled) return;
    recordHistory(snapshot()); exclusions.push([]); exclusionNames.push('Участок '+nextExclusionNumber++); activeContour=exclusions.length-1; updateContour();
  };
  $('#cancel-draw').onclick = () => { drawing = false; drawPoints = []; if(editingField) location.hash='fields'; else renderFields(); };
  $('#new-field-form').onsubmit = e => {
    e.preventDefault();
    const id = Number($('#new-field-number').value), name = $('#new-field-name').value.trim();
    const fail = (message,input) => { $('#draw-error').textContent = message; if(input) $(input).focus(); };
    if(!Number.isSafeInteger(id) || id<1) return fail('Введите положительный целый номер поля.','#new-field-number');
    if(fields.some(f=>f.id===id && f!==editingField)) return fail('Поле с таким номером уже существует.','#new-field-number');
    if(!name) return fail('Введите название поля.','#new-field-name');
    if(drawPoints.length<3) return fail('Отметьте хотя бы три точки на карте.');
    const area=Math.abs(drawPoints.reduce((sum,p,i)=>{const n=drawPoints[(i+1)%drawPoints.length];return sum+p[0]*n[1]-n[0]*p[1];},0));
    if(area<1) return fail('Контур должен охватывать площадь.');
    if(polygonEdgesIntersect(drawPoints,drawPoints,true)) return fail('Границы поля не должны пересекаться.');
    const invalid = exclusionError(drawPoints,exclusions);
    if(invalid) return fail(invalid);
    const changes={id,name,rotation:{...(editingField?.rotation || {}),[season]:$('#field-current-crop').value},contour:drawPoints.map(p=>[...p]),exclusions:structuredClone(exclusions),exclusionNames:[...exclusionNames]};
    if(editingField) {
      const previousId=editingField.id;
      Object.assign(editingField,changes);
      works.forEach(w=>{if(Number(w.field)===previousId)w.field=id;});
      if(draft && Number(draft.field)===previousId)draft.field=id;
    } else fields.push({...changes,area:0});
    fieldSelected=id; fieldQuery=''; drawing=false; drawPoints=[]; persist();
    if(editingField) location.hash='fields'; else renderFields();
    toast('Поле «'+name+'» '+(editingField ? 'сохранено' : 'добавлено'));
  };
  updateContour(); $('#new-field-number').focus();
}

function renderRotation() {
  main.innerHTML = `${heading('Севооборот', 'История культур и план посевов — каждое поле в одной строке.', `<div class="row">${button('Сезоны','seasons',false,'layers')}${button('Скачать','export-rotation',false,'download')}</div>`)}<div class="table-panel"><div class="panel-title"><h2>Культуры по сезонам</h2><span class="hint">Изменения сохраняются автоматически</span></div><div class="table-scroll"><table class="rotation-table"><thead><tr><th>Поле</th><th>Площадь, га</th>${visibleSeasons.map(y=>`<th>Сезон ${y}${String(y)===season ? ' · текущий' : ''}</th>`).join('')}</tr></thead><tbody>${fields.map(f=>`<tr><td><button class="table-button" data-rotation-field="${f.id}"><span class="field-no">${String(f.id).padStart(2,'0')}</span>${esc(f.name)}</button></td><td>${fmt(f.area)}</td>${visibleSeasons.map(y=>`<td><select data-rotation="${f.id}:${y}" aria-label="${esc(f.name)}, культура ${y}" style="background:${cropColors[f.rotation[y] || '']}">${options(crops,f.rotation[y] || '')}</select></td>`).join('')}</tr>`).join('')}</tbody></table></div></div><p class="section-note">Культура автоматически подставляется в операции и отчёты выбранного сезона. Пустая ячейка означает, что культура не назначена.</p><div class="culture-legend">${crops.filter(Boolean).map(c=>`<span class="legend-item"><i style="background:${cropColors[c]}"></i>${c}</span>`).join('')}</div>`;
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
  $('#report-day').onclick=()=>{reportDateFrom=reportDateTo=demoDates.today;renderReports();};$('#report-week').onclick=()=>{const weekday=(new Date(demoDates.today+'T12:00:00Z').getUTCDay()+6)%7;reportDateFrom=shiftDemoDate(demoDates.today,-weekday);reportDateTo=shiftDemoDate(reportDateFrom,6);renderReports();};
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
function getDriverNames() {
  return [...new Set(works.map(work=>work.driver?.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'ru'));
}
const directoryCards = [
  {id:'machines',title:'Техника',icon:'tractor',description:'Машины, подключённые к этому хозяйству из корневого проекта.',detailTitle:'Госномер',get items(){return projectMachines.map(machine=>[machine.name,machine.plate,machine.type,machine.id]);}},
  {id:'drivers',title:'Механизаторы',icon:'person',description:'Механизаторы хозяйства. Только для чтения.',get items(){return getDriverNames().map(name=>[name,'']);}},
  {id:'implements',title:'Прицепные орудия',icon:'layers',description:'Ширина захвата используется при расчёте работ.',detailTitle:'Ширина захвата',get items(){return implementsCatalog.map(item=>[item.name,`${fmt(item.width,1)} м`,item.operations.join(', '),item.id]);}},
  {id:'crops',title:'Культуры',icon:'leaf',description:'Системный список культур и их цветов. Только для чтения.',detailTitle:'Цвет',items:cropCatalog.map(c=>[c.name,c.color])},
  {id:'operations',title:'Технологические операции',icon:'operations',description:'Системный список операций для полевых работ. Только для чтения.',items:systemOperations.map(name=>[name,''])},
  {id:'materials',title:'Материалы',icon:'directory',description:'Фиксируется применение. Складские остатки не ведутся.',detailTitle:'Тип · единица',get items(){return materialsCatalog.map(item=>[item.name,item.type+' · '+item.unit,'',item.id]);}},
];
const recordCount = count => `${count} ${count % 10 === 1 && count % 100 !== 11 ? 'запись' : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14) ? 'записи' : 'записей'}`;
const formatTrackerOffset = value => value === 0 ? 'По центру' : `${Math.abs(value).toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} м ${value < 0 ? 'влево' : 'вправо'}`;
function machineFromEditRoute() {
  return projectMachines.find(machine => page === `directory/machines/${encodeURIComponent(machine.id)}/edit`);
}
function renderDirectory() {
  main.innerHTML=`${heading('Справочники','Общие данные хозяйства для всех разделов.')}<div class="directory-grid">${directoryCards.map(card=>`<a class="directory-card directory-link" href="#directory/${card.id}">${icon(card.icon)}<span class="directory-card-count">${recordCount(card.items.length)}</span><h2>${card.title}</h2><p>${card.description}</p><span class="directory-open">Открыть справочник ${icon('arrow')}</span></a>`).join('')}</div><section class="external-directories" aria-labelledby="external-directories-title"><h2 id="external-directories-title">Дополнительные справочники</h2><div class="directory-grid">${[
    ['Отраслевые и технологические регламенты','https://mshp.gov.by/ru/oreglament-ru/'],
    ['Каталог СЗР','https://pesticidy.by/'],
    ['Описание сортов','https://sorttest.by/descriptionVarieties.php'],
  ].map(([title,url])=>`<article class="directory-card directory-link">${icon('directory')}<h2>${esc(title)}</h2><p>${esc(new URL(url).hostname)}</p><a class="directory-open" href="${url}" target="_blank" rel="noopener noreferrer">Открыть справочник ${icon('arrow')}</a></article>`).join('')}</div></section>`;

}
function renderDirectoryPage() {
  const card = directoryCards.find(item => page === `directory/${item.id}`);
  if (!card) return;
  const hasDetail = !!card.detailTitle;
  const isMachines = card.id === 'machines';
  const isImplements = card.id === 'implements';
  const isMaterials = card.id === 'materials';
  const isCrops = card.id === 'crops';
  const isOperations = card.id === 'operations';
  const items = [...card.items].sort(([first], [second]) => first.localeCompare(second, 'ru', {numeric:true}));
  const columns = 1 + Number(hasDetail) + (isMachines ? 2 : 0) + (isImplements ? 2 : 0) + Number(isMaterials);
  main.innerHTML=`${heading(card.title,card.description,isMachines?button('Добавить','add-machine',true,'plus'):isImplements?button('Добавить','add-implement',true,'plus'):isMaterials?button('Добавить','add-material',true,'plus'):'')}<div class="directory-toolbar"><a class="btn" href="#directory">← Все справочники</a>${searchBox('directory-search',`Поиск: ${card.title.toLowerCase()}`)}<span class="hint" id="directory-result-count">${recordCount(items.length)}</span></div><section class="table-panel"><div class="table-scroll"><table class="directory-table"><thead><tr><th>Наименование</th>${hasDetail?`<th>${card.detailTitle}</th>`:''}${isMachines?'<th>Тип техники</th><th>Смещение трекера</th>':''}${isImplements?'<th>Технологические операции</th><th></th>':isMaterials?'<th></th>':''}</tr></thead><tbody>${items.map(([name,detail,type,id])=>`<tr data-search="${esc(`${name} ${detail} ${type || ''}`.toLocaleLowerCase('ru'))}" ${isMachines?`data-machine-href="#directory/machines/${encodeURIComponent(id)}/edit"`:''}><td>${isMachines?`<a class="directory-machine-link" href="#directory/machines/${encodeURIComponent(id)}/edit" aria-label="Открыть технику ${esc(name)}"><strong>${esc(name)}</strong></a>`:`<strong>${esc(name)}</strong>`}</td>${hasDetail?`<td>${isCrops?`<span class="row"><i aria-hidden="true" style="display:inline-block;width:20px;height:20px;flex-shrink:0;border-radius:4px;border:1px solid var(--ds-border);background:${esc(detail)}"></i></span>`:esc(detail)}</td>`:''}${isMachines?`<td>${esc(type || 'Не указан')}</td><td>${formatTrackerOffset(projectMachines.find(machine => machine.id === id)?.trackerOffset ?? 0)}</td>`:''}${isMaterials?`<td><button type="button" class="ds-icon-button" data-edit-material="${id}" aria-label="Редактировать ${esc(name)}" title="Редактировать ${esc(name)}">${icon('edit')}</button></td>`:''}${isImplements?`<td>${esc(type)}</td><td><button type="button" class="ds-icon-button" data-edit-implement="${id}" aria-label="Редактировать ${esc(name)}" title="Редактировать ${esc(name)}">${icon('edit')}</button></td>`:''}</tr>`).join('')}<tr id="directory-empty" hidden><td colspan="${columns}" class="empty">Ничего не найдено. Попробуйте другой запрос.</td></tr></tbody></table></div></section>${isCrops || isOperations || isImplements || isMaterials?'':`<p class="section-note">${isMachines?'Технику можно добавить из корневого проекта, изменить её тип и положение трекера для этого хозяйства. Изменения сохраняются только в браузере.':'В MVP-макете записи доступны только для просмотра.'}</p>`}`;
  $('#directory-search').addEventListener('input', e => {
    const query = e.target.value.trim().toLocaleLowerCase('ru');
    let visible = 0;
    $$('.directory-table tr[data-search]').forEach(row => { row.hidden = !row.dataset.search.includes(query); if (!row.hidden) visible++; });
    $('#directory-result-count').textContent = `${visible} из ${card.items.length}`;
    $('#directory-empty').hidden = visible > 0;
  });
  if (isMaterials) {
    $('#add-material').onclick=()=>openMaterialEditor();
    $$('[data-edit-material]').forEach(button=>button.onclick=()=>openMaterialEditor(Number(button.dataset.editMaterial)));
  }
  if (isImplements) {
    $('#add-implement').onclick=()=>openImplementEditor();
    $$('[data-edit-implement]').forEach(button=>button.onclick=()=>openImplementEditor(Number(button.dataset.editImplement)));
  }
  if (isMachines) {
    $('#add-machine').onclick = openMachinePicker;
    $$('[data-machine-href]').forEach(row => row.onclick = event => {
      if (!event.target.closest('a')) location.hash = row.dataset.machineHref;
    });
  }
}
function materialError(id, values) {
  if (!values.name.trim()) return 'Введите название материала';
  if (!materialTypes.includes(values.type)) return 'Выберите тип материала';
  if (!materialUnits.includes(values.unit)) return 'Выберите единицу измерения';
  if (materialsCatalog.some(item=>item.id!==id && item.name.trim().toLocaleLowerCase('ru')===values.name.trim().toLocaleLowerCase('ru'))) return 'Материал с таким названием уже есть';
  if (id!==null && !materialsCatalog.some(item=>item.id===id)) return 'Материал не найден';
  return '';
}
function saveMaterial(id, values) {
  const error=materialError(id,values);if(error)throw new Error(error);
  const item=materialsCatalog.find(item=>item.id===id);
  const changes={name:values.name.trim(),type:values.type,unit:values.unit};
  if(item){const oldName=item.name;Object.assign(item,changes);works.forEach(work=>{if(work.material===oldName)work.material=item.name;});if(draft?.material===oldName)draft.material=item.name;}
  else materialsCatalog.push({id:Math.max(0,...materialsCatalog.map(item=>item.id))+1,...changes});
  persist();
}
function openMaterialEditor(id=null) {
  const item=materialsCatalog.find(item=>item.id===id);
  modal(item?'Редактировать материал':'Добавить материал',`<form id="material-form"><label>Название<input id="material-name" required maxlength="100" value="${esc(item?.name || '')}" placeholder="Название материала"></label><label>Тип<select id="material-type">${options(materialTypes,item?.type || 'Семена')}</select></label><label>Единица измерения<select id="material-unit">${options(materialUnits,item?.unit || 'кг')}</select></label><p id="material-error" class="fleet-error" role="alert"></p><div class="actions"><button type="button" class="btn" id="cancel-material">Отмена</button><button type="submit" class="btn primary" id="save-material" disabled>Сохранить</button></div></form>`,()=>{
    const values=()=>({name:$('#material-name').value,type:$('#material-type').value,unit:$('#material-unit').value});
    const validate=()=>{const error=materialError(id,values());$('#save-material').disabled=!!error;$('#material-error').textContent=$('#material-name').value.trim()?error:'';};
    $('#material-form').oninput=validate;$('#material-form').onchange=validate;
    $('#cancel-material').onclick=()=>$('#dialog').close();
    $('#material-form').onsubmit=event=>{event.preventDefault();try{saveMaterial(id,values());}catch(error){$('#material-error').textContent=error.message;return;}$('#dialog').close();renderDirectoryPage();toast('Материал сохранён');};
    validate();$('#material-name').focus();
  });
}
function implementError(id, values) {
  if (!values.name.trim()) return 'Введите название оборудования';
  if (!Number.isFinite(values.width) || values.width<=0) return 'Укажите ширину захвата больше нуля';
  if (!values.operations.length || values.operations.some(op=>!systemOperations.includes(op))) return 'Выберите хотя бы одну технологическую операцию';
  if (implementsCatalog.some(item=>item.id!==id && item.name.trim().toLocaleLowerCase('ru')===values.name.trim().toLocaleLowerCase('ru'))) return 'Оборудование с таким названием уже есть';
  if (id!==null && !implementsCatalog.some(item=>item.id===id)) return 'Оборудование не найдено';
  return '';
}
function saveImplement(id, values) {
  const error=implementError(id,values);
  if (error) throw new Error(error);
  const item=implementsCatalog.find(item=>item.id===id);
  const changes={name:values.name.trim(),width:values.width,operations:[...new Set(values.operations)]};
  if (item) {
    const previousName=item.name;
    Object.assign(item,changes);
    works.forEach(work=>{if(work.implement===previousName) work.implement=item.name;});
    if (draft?.implement===previousName) {draft.implement=item.name;draft.width=item.width;}
  } else implementsCatalog.push({id:Math.max(0,...implementsCatalog.map(item=>item.id))+1,...changes});
  persist();
}
function openImplementEditor(id=null) {
  const item=implementsCatalog.find(item=>item.id===id);
  modal(item?'Редактировать оборудование':'Добавить оборудование',`<form id="implement-form"><label>Название<input id="implement-name" required maxlength="100" value="${esc(item?.name || '')}" placeholder="Например, КПС-8"></label><label>Ширина захвата, м<input id="implement-width" required type="number" min="0.01" step="any" value="${item?.width ?? ''}" placeholder="Например, 8"></label><fieldset class="implement-operation-picker"><legend>Технологические операции</legend>${searchBox('implement-operation-search','Найти операцию')}<div class="implement-operation-list">${systemOperations.map(op=>`<label class="implement-operation-choice" data-operation-name="${esc(op.toLocaleLowerCase('ru'))}"><input type="checkbox" name="implement-operation" value="${esc(op)}" ${item?.operations.includes(op)?'checked':''}><span>${esc(op)}</span></label>`).join('')}<span id="implement-operation-empty" class="hint" hidden>Ничего не найдено</span></div></fieldset><p id="implement-error" class="fleet-error" role="alert"></p><div class="actions"><button type="button" class="btn" id="cancel-implement">Отмена</button><button type="submit" class="btn primary" id="save-implement" disabled>Сохранить</button></div></form>`,()=>{
    const values=()=>({name:$('#implement-name').value,width:Number($('#implement-width').value),operations:$$('[name="implement-operation"]:checked').map(input=>input.value)});
    const validate=()=>{$('#save-implement').disabled=!!implementError(id,values());$('#implement-error').textContent='';};
    $('#implement-form').oninput=validate;
    $('#implement-form').onchange=validate;
    $('#implement-operation-search').addEventListener('input',event=>{
      const query=event.target.value.trim().toLocaleLowerCase('ru');let visible=0;
      $$('[data-operation-name]').forEach(label=>{label.hidden=!label.dataset.operationName.includes(query);if(!label.hidden)visible++;});
      $('#implement-operation-empty').hidden=visible>0;
    });
    $('#cancel-implement').onclick=()=>$('#dialog').close();
    $('#implement-form').onsubmit=event=>{
      event.preventDefault();
      try {saveImplement(id,values());} catch(error) {$('#implement-error').textContent=error.message;return;}
      $('#dialog').close();renderDirectoryPage();toast('Оборудование сохранено');
    };
    validate();$('#implement-name').focus();
  });
}
function machineTypePickerMarkup(selectedType = null) {
  return `<div class="root-machine-type operation-picker"><label for="machine-type">Тип техники</label><div class="operation-control"><input id="machine-type" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="machine-type-options" autocomplete="off" placeholder="Не указан" value="${esc(selectedType ?? '')}"><button type="button" class="machine-type-clear" id="machine-type-clear" aria-label="Сбросить тип техники" title="Сбросить тип техники" ${selectedType == null ? 'hidden' : ''}><span class="ds-symbol" aria-hidden="true">close</span></button><span class="operation-chevron ds-symbol" aria-hidden="true">expand_more</span></div><div id="machine-type-options" class="operation-options" role="listbox" aria-label="Типы техники" hidden></div><span id="machine-type-search-status" class="visually-hidden" role="status" aria-live="polite"></span></div><p id="fleet-error" class="fleet-error" role="alert"></p>`;
}
function bindMachineTypePicker(initialType = null) {
  const types = [{name:null,label:'Не указан'}, ...[...AuroraFleet.machineTypes].sort((first,second)=>first.name.localeCompare(second.name,'ru'))];
  let selectedType = initialType ?? null, matches = [], active = -1;
  const input = $('#machine-type'), list = $('#machine-type-options'), clearButton = $('#machine-type-clear');
  const close = () => {list.hidden=true;input.setAttribute('aria-expanded','false');input.removeAttribute('aria-activedescendant');input.value=selectedType ?? '';clearButton.hidden=selectedType===null;};
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
  clearButton.onclick=()=>{selectedType=null;$('#fleet-error').textContent='';close();};
  input.onfocus=()=>{open();input.select();};
  input.onclick=()=>{if(list.hidden){open();input.select();}};
  input.oninput=()=>{selectedType=null;clearButton.hidden=true;$('#fleet-error').textContent='';open(input.value);};
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
$('#help').onclick=()=>modal('О макете Аврора Агро','<p>Кликабельный MVP по описанию «Аналог Гектеры». Основной путь: выберите работу → запустите расчёт → подтвердите площадь → добавьте материал → подтвердите работу.</p><p>Данные, схема полей и расчёты демонстрационные. Подключения к GPS, географического расчёта и серверного хранения нет. Изменения сохраняются только в этом браузере.</p><p>Демо-работы доступны за сегодня и вчера. Технику можно переносить из демонстрационного корневого проекта и менять её тип, севооборот — редактировать.</p><div class="actions">'+button('Сбросить демо-данные','reset-demo')+'</div>',()=>$('#reset-demo').onclick=()=>{works=structuredClone(initialWorks);try{localStorage.removeItem('aurora-agro-demo-v1');}catch{}$('#dialog').close();location.reload();});
function pageFromHash() {
  const target = location.hash.slice(1);
  return /^operations\/day\/\d{4}-\d{2}-\d{2}$/.test(target) || /^operations\/\d+$/.test(target) && works.some(work => target === `operations/${work.id}`) || ['operations','fields','rotation','reports','directory'].includes(target) || directoryCards.some(card => target === `directory/${card.id}`) || fields.some(field=>target===`fields/${field.id}/edit`) || projectMachines.some(machine => target === `directory/machines/${encodeURIComponent(machine.id)}/edit`) ? target : 'operations';
}
window.addEventListener('hashchange',()=>{page=pageFromHash();if(operationFromRoute()) { selected=operationFromRoute().id;initDraft(); }drawing=false;drawPoints=[];render();window.scrollTo({top:0,behavior:'instant'});});
page=pageFromHash();
initDraft();render();
