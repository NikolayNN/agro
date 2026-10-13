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
test('pending work opens with empty calculation parameters without changing saved work',()=>{
  const source=fs.readFileSync('app.js','utf8');
  const work={status:'pending',operation:'Сев',implement:'Сеялка',width:6};
  const c={currentWork:()=>work,implementsCatalog:[],draft:null};vm.createContext(c);
  vm.runInContext(source.slice(source.indexOf('function initDraft()'),source.indexOf('function filteredWorks()')),c);
  c.initDraft();assert.equal(c.draft.operation,'');assert.equal(c.draft.implement,'');assert.equal(c.draft.width,0);assert.equal(work.operation,'Сев');
});
test('calculation requires a catalog operation and compatible equipment',()=>{
  const c=setup();c.systemOperations=['Сев','Культивация'];c.getDriverNames=()=>['Иванов'];c.draft.driver='Иванов';
  assert.equal(c.canCalculateOperation(),true);
  c.draft.implement='Культиватор';assert.equal(c.canCalculateOperation(),false);
  c.draft.operation='';c.draft.implement='';assert.equal(c.canCalculateOperation(),false);
});
test('preview scales equipment width to schematic field area and rejects invalid dimensions',()=>{
  const c=setup();
  assert.equal(c.previewCoverageWidth(12,64.8),2*c.previewCoverageWidth(6,64.8));
  assert.equal(c.previewCoverageWidth(6,259.2),c.previewCoverageWidth(6,64.8)/2);
  assert.equal(c.previewCoverageWidth(0,64.8),0);assert.equal(c.previewCoverageWidth(6,0),0);
});
