'use strict';
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
function load(path) {
 const js = ts.transpileModule(fs.readFileSync(path,'utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}
 }).outputText;
 const module={exports:{}};
 vm.runInNewContext(js,{module,exports:module.exports,Date,Number,String,RangeError},{filename:path});
 return module.exports;
}
const x=load('supabase/functions/_shared/recurrenceDate.ts');
test('end of month: February leap and non-leap, April, December',()=>{
 assert.equal(x.dueDateForMonth('2027-02',31),'2027-02-28');
 assert.equal(x.dueDateForMonth('2028-02',31),'2028-02-29');
 assert.equal(x.dueDateForMonth('2027-04',31),'2027-04-30');
 assert.equal(x.dueDateForMonth('2027-12',31),'2027-12-31');
});
test('due only on the scheduled date',()=>{
 assert.equal(x.isDueOnDate(31,'2027-02-27'),false);
 assert.equal(x.isDueOnDate(31,'2027-02-28'),true);
 assert.equal(x.isDueOnDate(29,'2028-02-29'),true);
 assert.equal(x.isDueOnDate(15,'2027-02-28'),false);
});
test('day normalization keeps 29–31',()=>{
 assert.equal(x.normalizeRecurringDay(31,'2027-01-01'),31);
 assert.equal(x.normalizeRecurringDay(null,'2027-01-30'),30);
});
test('worker rejects ordinary users and relies on database uniqueness',()=>{
 const content=fs.readFileSync('supabase/functions/process-recurring/index.ts','utf8');
 assert.ok(content.includes("authorization !== 'Bearer ' + serviceKey"));
 assert.ok(content.includes("inserted.error?.code === '23505'"));
});

test('CSV values are formula-safe and semicolon/newline quoted',()=>{
 const csv=load('lib/csv.ts');
 const output=csv.formatExpenseCSV([{
   date:'2026-11-20',child_name:'=1+1',category:'@SUM(A1)',
   label:'  +HYPERLINK("https://invalid")',amount:12.5,is_recurring:true,
 }]);
 assert.ok(output.includes('"\'=1+1"'));
 assert.ok(output.includes('"\'@SUM(A1)"'));
 assert.ok(output.includes('"\'  +HYPERLINK(""https://invalid"")"'));
 assert.ok(output.includes('"12,50"'));
 assert.equal(output.split('\r\n').length,2);
});
