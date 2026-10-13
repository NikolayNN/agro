const test=require('node:test');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const fs=require('node:fs');
function setup(){
 const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
 const start=source.indexOf('function implementError('),end=source.indexOf('function openImplementEditor(',start);
 assert.ok(start>=0 && end>start,'implement validation and save functions exist');
 const ctx={implementsCatalog:[{id:1,name:'Сеялка',width:6,operations:['Сев']}],systemOperations:['Сев','Культивация'],works:[{implement:'Сеялка',width:6}],draft:{implement:'Сеялка',width:6},persist(){ctx.saved=true}};
 vm.createContext(ctx);vm.runInContext(source.slice(start,end),ctx);return ctx;
}
test('adding equipment stores multiple linked operations',()=>{const c=setup();c.saveImplement(null,{name:'Комбинированное',width:4.5,operations:['Сев','Культивация']});assert.equal(c.implementsCatalog.length,2);assert.deepEqual(Array.from(c.implementsCatalog[1].operations),['Сев','Культивация']);assert.equal(c.saved,true)});
test('editing keeps identity and historical width while updating names',()=>{const c=setup();c.saveImplement(1,{name:'Сеялка новая',width:8,operations:['Сев']});assert.equal(c.implementsCatalog.length,1);assert.equal(c.implementsCatalog[0].id,1);assert.equal(c.works[0].implement,'Сеялка новая');assert.equal(c.works[0].width,6);assert.equal(c.draft.width,8)});
test('invalid widths, blank names and missing or unknown operations are rejected',()=>{const c=setup();for(const value of [{name:' ',width:4,operations:['Сев']},{name:'Новое',width:0,operations:['Сев']},{name:'Новое',width:NaN,operations:['Сев']},{name:'Новое',width:4,operations:[]},{name:'Новое',width:4,operations:['Другое']}])assert.throws(()=>c.saveImplement(null,value));assert.equal(c.implementsCatalog.length,1)});
test('duplicate equipment names are rejected without changing stored data',()=>{const c=setup();assert.throws(()=>c.saveImplement(null,{name:' сеялка ',width:4,operations:['Сев']}));assert.equal(c.implementsCatalog.length,1);assert.equal(c.saved,undefined)});

test('equipment form validates input, keeps hidden selections and submits linked operations',()=>{
 const c=setup(),elements=new Map(),checked=[{value:'Сев'},{value:'Культивация'}];
 c.$=selector=>{if(!elements.has(selector))elements.set(selector,{value:'',addEventListener(type,fn){this[type]=fn},focus(){},close(){}});return elements.get(selector)};
 c.$$=selector=>selector.includes(':checked')?checked:[];
 c.esc=String;c.searchBox=()=>'';c.renderDirectoryPage=()=>{c.rendered=true};c.toast=()=>{};
 c.modal=(title,html,bind)=>{c.html=html;bind()};
 const source=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
 vm.runInContext(source.slice(source.indexOf('function openImplementEditor('),source.indexOf('function machineTypePickerMarkup(')),c);
 c.openImplementEditor();assert.equal(c.$('#save-implement').disabled,true);
 c.$('#implement-name').value='Новое';c.$('#implement-width').value='4';c.$('#implement-form').oninput();
 assert.equal(c.$('#save-implement').disabled,false);
 c.$('#implement-operation-search').input({target:{value:'Сев'}});
 c.$('#implement-form').onsubmit({preventDefault(){}});
 assert.equal(c.implementsCatalog.length,2);assert.equal(c.implementsCatalog[1].operations.length,2);assert.equal(c.rendered,true);
});
