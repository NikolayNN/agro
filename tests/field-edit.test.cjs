const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
function setup() {
  const field={id:12,name:'Северное',area:64.8,rotation:{2026:'Пшеница'},contour:[[0,0],[200,0],[200,200],[0,200]],exclusions:[[[20,20],[60,20],[60,60]]],exclusionNames:['Овраг']};
  const elements={};
  const $=id=>elements[id]??={value:'',validity:{valid:true},classList:{toggle(){},remove(){}},setAttribute(){},focus(){},innerHTML:'',textContent:''};
  const ctx={season:'2026',crops:['','Пшеница','Кукуруза'],options:(values,selected)=>values.map(v=>'<option'+(v===selected?' selected':'')+'>'+v+'</option>').join(''),fields:[field,{id:8,name:'Другое'}],works:[{field:12}],draft:{field:12},location:{hash:''},main:{},page:'fields/12/edit',fieldSelected:12,drawing:false,drawPoints:[],fieldQuery:'',zoom:1,$,bindMap(){},mapMarkup(){return ''},getField(){return field},fmt:n=>n.toFixed(2),esc:s=>String(s).replaceAll('"','&quot;'),persist(){ctx.saved=structuredClone(ctx.fields)},renderFields(){},toast(){},structuredClone};
  vm.createContext(ctx);
  vm.runInContext(source.slice(source.indexOf('function fieldFromEditRoute()'),source.indexOf('function updateNav()')),ctx);
  vm.runInContext(source.slice(source.indexOf('function polygonArea('),source.indexOf('function renderRotation()')),ctx);
  ctx.renderFieldDrawing(field);
  $('#new-field-number').value='12';$('#new-field-name').value='Северное';$('#field-current-crop').value='Пшеница';
  return {ctx,field,$};
}
test('field editor route and initial values include saved contours and names',()=>{
  const {ctx,field,$}=setup();assert.equal(ctx.fieldFromEditRoute(),field);
  assert.match(ctx.main.innerHTML,/Редактировать поле/);assert.match(ctx.main.innerHTML,/value="12"/);assert.match(ctx.main.innerHTML,/value="Северное"/);
  assert.match($('#exclusion-list').innerHTML,/Овраг/);assert.equal($('#draw-excluded-area').textContent,'0.80 га');
  ctx.page='fields/999/edit';assert.equal(ctx.fieldFromEditRoute(),undefined);
});
test('cancelling field edits leaves original data unchanged',()=>{
  const {ctx,field,$}=setup(),original=structuredClone(field);
  ctx.drawPoints[0][0]=5;$('#new-field-name').value='Изменено';$('#cancel-draw').onclick();
  assert.deepEqual(field,original);assert.equal(ctx.location.hash,'fields');assert.equal(ctx.saved,undefined);
});
test('saving updates field and related works without adding a duplicate',()=>{
  const {ctx,field,$}=setup();$('#new-field-number').value='36';$('#new-field-name').value='Новое имя';
  $('#new-field-form').onsubmit({preventDefault(){}});
  assert.equal(ctx.fields.length,2);assert.equal(field.id,36);assert.equal(field.name,'Новое имя');assert.equal(field.area,64.8);assert.equal(field.rotation[2026],'Пшеница');assert.equal(field.exclusionNames[0],'Овраг');
  assert.equal(ctx.works[0].field,36);assert.equal(ctx.draft.field,36);assert.equal(ctx.location.hash,'fields');assert.equal(ctx.saved[0].name,'Новое имя');
});
test('editing rejects a number belonging to another field',()=>{
  const {ctx,field,$}=setup();$('#new-field-number').value='8';$('#new-field-form').onsubmit({preventDefault(){}});
  assert.match($('#draw-error').textContent,/уже существует/);assert.equal(field.id,12);assert.equal(ctx.saved,undefined);
});

test('field editor changes only the current season crop',()=>{
  const {ctx,field,$}=setup();field.rotation[2025]='Рапс';
  assert.match(ctx.main.innerHTML,/Культура · сезон 2026/);
  $('#field-current-crop').value='Кукуруза';$('#new-field-form').onsubmit({preventDefault(){}});
  assert.equal(field.rotation[2026],'Кукуруза');assert.equal(field.rotation[2025],'Рапс');
});
