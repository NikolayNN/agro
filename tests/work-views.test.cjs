const test = require('node:test'), assert = require('node:assert/strict'), vm = require('node:vm'), fs = require('node:fs');
function setup() {
  const source = fs.readFileSync('app.js','utf8');
  const start = source.indexOf('function captureWorkView('), end = source.indexOf('function workViewsMarkup(',start);
  assert.ok(start >= 0 && end > start);
  const context = {workField:['12'],workCrop:[],workMachine:[],workDriver:[],status:['pending'],workColumnOrder:['field','status'],workVisibleColumns:['field'],date:'2026-10-13'};
  vm.createContext(context); vm.runInContext(source.slice(start,end),context); return context;
}
test('saved view is an independent snapshot and does not capture date',()=>{
  const c=setup(), snapshot=c.captureWorkView(); c.workField.push('8');
  assert.equal(snapshot.filters.field.length,1); assert.equal(snapshot.date,undefined);
});
test('restoring a view restores filters and column order without changing day',()=>{
  const c=setup(), snapshot=c.captureWorkView(); c.status=[]; c.workVisibleColumns=['status']; c.date='2026-10-12';
  c.applyWorkView(snapshot); assert.equal(c.status[0],'pending'); assert.equal(c.workVisibleColumns[0],'field'); assert.equal(c.date,'2026-10-12');
  c.workColumnOrder.reverse(); assert.equal(snapshot.order[0],'field');
});
