'use strict';
// Pure, deterministic in-memory simulation. No Supabase project, credential or database touched.
const assert = require('node:assert/strict');
const test = require('node:test');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');

function compile(file) {
  return ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
}
function loadShared() {
  const module = { exports: {} };
  vm.runInNewContext(compile('supabase/functions/_shared/recurrenceDate.ts'),
    { module, exports: module.exports, Date, Number, String, RangeError });
  return module.exports;
}

function startWorker(date, initialRows) {
  const shared = loadShared();
  const rows = initialRows.map(x => ({ ...x }));
  let calls = 0;
  let handler;
  const FakeDate = class extends Date {
    constructor(...args) { super(...(args.length ? args : [Date.parse(date + 'T00:00:00Z')])); }
    static now() { return Date.parse(date + 'T00:00:00Z'); }
  };
  function makeQuery() {
    const filters = [];
    const sorting = [];
    let count = Infinity;
    const current = () => rows.filter(row => filters.every(f => f(row)))
      .sort((a, b) => {
        for (const [key, asc] of sorting) {
          const d = String(a[key] ?? '').localeCompare(String(b[key] ?? ''));
          if (d) return asc ? d : -d;
        }
        return 0;
      });
    const q = {
      select() { return q; },
      eq(key, val) { filters.push(row => row[key] === val); return q; },
      lte(key, val) { filters.push(row => row[key] <= val); return q; },
      gte(key, val) { filters.push(row => row[key] >= val); return q; },
      lt(key, val) { filters.push(row => row[key] < val); return q; },
      order(key, opts) { sorting.push([key, opts.ascending]); return q; },
      range(start, end) { return Promise.resolve({ data: current().slice(start, end + 1), error: null }); },
      limit(n) { count = n; return q; },
      maybeSingle() { return Promise.resolve({ data: current().slice(0, count)[0] ?? null, error: null }); },
      insert(row) {
        const already = rows.some(x => x.user_id === row.user_id
          && x.recurrence_id === row.recurrence_id
          && x.date.slice(0, 7) === row.date.slice(0, 7));
        if (already) return Promise.resolve({ error: { code: '23505', message: 'duplicate' } });
        rows.push({ id: 'created-' + rows.length, ...row });
        return Promise.resolve({ error: null });
      },
    };
    return q;
  }
  const module = { exports: {} };
  vm.runInNewContext(compile('supabase/functions/process-recurring/index.ts'), {
    module, exports: module.exports, Date: FakeDate, Number, String, Response, Set,
    console: { error() {} },
    require(spec) {
      if (spec === '../_shared/recurrenceDate.ts') return shared;
      if (spec.includes('supabase-js')) return { createClient: () => ({
        from(table) {
          assert.equal(table, 'expenses');
          calls++;
          return makeQuery();
        },
      }) };
      throw new Error('Unexpected import ' + spec);
    },
    Deno: {
      env: { get: name => ({
        SUPABASE_SERVICE_ROLE_KEY: 'test-only-service-key',
        SUPABASE_URL: 'https://example.invalid',
      })[name] },
      serve(fn) { handler = fn; },
    },
  });
  const invoke = async (authorization, method = 'POST') => {
    const request = new Request('https://example.invalid/functions/v1/process-recurring', {
      method, headers: authorization ? { authorization } : {},
    });
    const response = await handler(request);
    return { status: response.status, body: await response.json() };
  };
  return { invoke, rows, getCalls: () => calls };
}
function expense(id, recurrenceId, date, day, active = true, label = 'Crèche') {
  return {
    id, user_id: 'family-a', recurrence_id: recurrenceId,
    child_name: 'Louise', category: 'Garde', label,
    date, amount: 120, is_recurring: active, recurring_day: active ? day : null,
  };
}

test('rejects user JWT before any privileged database query', async () => {
  const w = startWorker('2027-02-28', [expense('1', 'r1', '2027-01-31', 31)]);
  const r = await w.invoke('Bearer ordinary-user-jwt');
  assert.equal(r.status, 401);
  assert.equal(w.getCalls(), 0);
});
test('requires POST and a bearer credential', async () => {
  const w = startWorker('2027-02-28', []);
  assert.equal((await w.invoke(null)).status, 401);
  assert.equal((await w.invoke('Bearer test-only-service-key', 'GET')).status, 405);
  assert.equal(w.getCalls(), 0);
});
test('two same-name recurring rules stay separate, are created once and keep nominal day', async () => {
  const w = startWorker('2027-02-28', [
    expense('1', 'r1', '2027-01-31', 31),
    expense('2', 'r2', '2027-01-31', 31),
  ]);
  const first = await w.invoke('Bearer test-only-service-key');
  assert.equal(first.status, 200);
  assert.equal(first.body.created, 2);
  assert.equal(w.rows.filter(x => x.date === '2027-02-28').length, 2);
  assert.deepEqual(w.rows.filter(x => x.date === '2027-02-28').map(x => x.recurring_day), [31,31]);
  const second = await w.invoke('Bearer test-only-service-key');
  assert.equal(second.body.created, 0);
  assert.equal(w.rows.length, 4);
});
test('stopped recurrence is not restarted', async () => {
  const w = startWorker('2027-02-28', [
    expense('1', 'stopped', '2027-01-31', 31),
    expense('2', 'stopped', '2027-02-15', 31, false),
  ]);
  const response = await w.invoke('Bearer test-only-service-key');
  assert.equal(response.status, 200);
  assert.equal(response.body.created, 0);
  assert.equal(w.rows.length, 2);
});
test('April 30 catches day 31 and February 29 stays on leap day', async () => {
  const april = startWorker('2027-04-30', [expense('1', 'april', '2027-03-31', 31)]);
  assert.equal((await april.invoke('Bearer test-only-service-key')).body.created, 1);
  const february = startWorker('2028-02-29', [expense('1', 'feb', '2028-01-31', 31)]);
  assert.equal((await february.invoke('Bearer test-only-service-key')).body.created, 1);
});
