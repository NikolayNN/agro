const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
function setup(){const start=source.indexOf('function shiftDemoDate('),end=source.indexOf('const demoDates =',start);assert.ok(start>=0&&end>start);const c={};vm.createContext(c);vm.runInContext(source.slice(start,end),c);return c;}
test('demo dates follow Minsk day even near UTC midnight',()=>{const c=setup(),d=c.getDemoDates(new Date('2026-10-12T22:30:00Z'));assert.equal(d.today,'2026-10-13');assert.equal(d.yesterday,'2026-10-12')});
test('yesterday handles year and leap boundaries',()=>{const c=setup();assert.equal(c.getDemoDates(new Date('2027-01-01T09:00:00Z')).yesterday,'2026-12-31');assert.equal(c.shiftDemoDate('2024-03-01',-1),'2024-02-29')});
