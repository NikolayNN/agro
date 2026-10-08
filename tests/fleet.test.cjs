const { test } = require('node:test');
const assert = require('node:assert/strict');

let fleet;
try { fleet = require('../fleet.js'); } catch { fleet = {}; }

test('доступны только новые типы техники', () => {
  assert.deepEqual(fleet.machineTypes.map(type => type.name).sort((a, b) => a.localeCompare(b, 'ru')), [
    'Комбайн зерноуборочный', 'Комбайн кормоуборочный', 'Опрыскиватель самоходный',
    'Косилка самоходная', 'Трактор', 'Погрузочная техника', 'Специализированная техника',
  ].sort((a, b) => a.localeCompare(b, 'ru')));
});

test('перенос добавляет выбранную машину с типом и убирает её из доступных', () => {
  const root = [
    { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624' },
    { id: 'loader-1', name: 'JCB 531-70', plate: 'АВ 4839' },
  ];
  const project = [{ id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор' }];
  const next = fleet.transferMachine(project, root[0], 'Комбайн зерноуборочный');

  assert.deepEqual(next, [
    project[0],
    { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624', type: 'Комбайн зерноуборочный', trackerOffset: 0 },
  ]);
  assert.deepEqual(fleet.availableRootMachines(root, next), [root[1]]);
  assert.equal(project.length, 1);
});

test('перенос сохраняет отсутствующий тип как null и отклоняет другие пустые значения', () => {
  const machine = { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624' };
  assert.equal(fleet.transferMachine([], machine, null)[0].type, null);
  assert.throws(() => fleet.transferMachine([], machine, ''), /тип/i);
  assert.throws(() => fleet.transferMachine([], machine, 'Неизвестный тип'), /тип/i);
});

test('одну и ту же машину нельзя перенести повторно', () => {
  const machine = { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624' };
  const project = [{ ...machine, type: 'Комбайн зерноуборочный' }];
  assert.throws(() => fleet.transferMachine(project, machine, 'Комбайн зерноуборочный'), /уже/i);
});

test('сохранённый старый тип трактора отображается под новым названием', () => {
  const saved = [
    { id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Тракторы и тяга' },
    { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624', type: 'Уборочная техника' },
    { id: 'other-1', name: 'Без типа', plate: 'АВ 0000', type: '' },
  ];
  assert.deepEqual(fleet.normalizeProjectMachines(saved), [
    { id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор', trackerOffset: 0 },
    { ...saved[1], type: null, trackerOffset: 0 },
    { ...saved[2], type: null, trackerOffset: 0 },
  ]);
});

test('редактирование меняет только тип выбранной техники', () => {
  const project = [
    { id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор' },
    { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624', type: 'Комбайн зерноуборочный' },
  ];
  assert.deepEqual(fleet.updateMachineType(project, 'tractor-1', 'Погрузочная техника'), [
    { id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Погрузочная техника' },
    project[1],
  ]);
  assert.equal(project[0].type, 'Трактор');
});

test('редактирование позволяет снять тип и сохраняет null', () => {
  const project = [{ id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор' }];
  assert.throws(() => fleet.updateMachineType(project, 'missing', 'Трактор'), /не найден/i);
  assert.equal(fleet.updateMachineType(project, 'tractor-1', null)[0].type, null);
  assert.throws(() => fleet.updateMachineType(project, 'tractor-1', ''), /тип/i);
});

test('положение трекера сохраняется у выбранной машины вместе с типом', () => {
  const project = [
    { id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор', trackerOffset: 0 },
    { id: 'combine-1', name: 'CLAAS LEXION 760', plate: 'АВ 7624', type: 'Уборочная техника', trackerOffset: -1 },
  ];
  const next = fleet.updateMachineSettings(project, 'tractor-1', 'Трактор', 1.23);
  assert.deepEqual(next[0], { ...project[0], trackerOffset: 1.23 });
  assert.deepEqual(next[1], project[1]);
  assert.equal(project[0].trackerOffset, 0);
  assert.equal(fleet.updateMachineSettings(project, 'tractor-1', null, 0)[0].type, null);
});

test('смещение трекера допускает сотые метра в обе стороны в пределах пяти метров', () => {
  const project = [{ id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор', trackerOffset: 0 }];
  assert.equal(fleet.updateMachineSettings(project, 'tractor-1', 'Трактор', -5)[0].trackerOffset, -5);
  assert.equal(fleet.updateMachineSettings(project, 'tractor-1', 'Трактор', 0)[0].trackerOffset, 0);
  assert.equal(fleet.updateMachineSettings(project, 'tractor-1', 'Трактор', 5)[0].trackerOffset, 5);
  assert.equal(fleet.updateMachineSettings(project, 'tractor-1', 'Трактор', -2.37)[0].trackerOffset, -2.37);
  for (const value of [-5.01, 5.01, NaN, 'abc', 0.001]) {
    assert.throws(() => fleet.updateMachineSettings(project, 'tractor-1', 'Трактор', value), /смещение/i);
  }
});

test('старые записи без смещения получают положение по центру', () => {
  const project = [{ id: 'tractor-1', name: 'МТЗ-3022', plate: 'АВ 4821', type: 'Трактор' }];
  assert.deepEqual(fleet.normalizeProjectMachines(project), [{ ...project[0], trackerOffset: 0 }]);
});
