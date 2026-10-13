const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
function setup(){
  const source=fs.readFileSync('app.js','utf8'),start=source.indexOf('function compatibleImplements('),end=source.indexOf('function bindOperationPicker(',start);
  const context={implementsCatalog:[{name:'Сеялка',width:6,operations:['Сев','Внесение удобрений']},{name:'Культиватор',width:8,operations:['Культивация']}],draft:{operation:'Сев',implement:'Сеялка',width:5},$:()=>null,fmt:String};
  vm.createContext(context);vm.runInContext(source.slice(start,end),context);return context;
}
test('implement options follow operation links and current catalog updates',()=>{
  const c=setup();assert.equal(c.compatibleImplements('Сев')[0].name,'Сеялка');assert.equal(c.compatibleImplements('Внесение удобрений').length,1);assert.equal(c.compatibleImplements('Вспашка').length,0);
  c.implementsCatalog[1].operations.push('Сев');assert.equal(c.compatibleImplements('Сев').length,2);
});
test('operation change clears incompatible equipment and updates compatible width',()=>{
  const c=setup();c.syncDraftImplement();assert.equal(c.draft.width,6);
  c.draft.operation='Культивация';c.syncDraftImplement();assert.equal(c.draft.implement,'');assert.equal(c.draft.width,0);
});
