const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

let buildPages;
try { ({ buildPages } = require('../scripts/build-pages.cjs')); } catch {}

test('сборка Pages включает только файлы макета и записывает версию релиза', t => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'agro-pages-'));
  t.after(() => fs.rmSync(output, { recursive: true, force: true }));

  const notes = buildPages('mockup-v0.1.0', output);

  assert.match(fs.readFileSync(path.join(output, 'version.js'), 'utf8'), /mockup-v0\.1\.0/);
  assert.ok(fs.existsSync(path.join(output, 'index.html')));
  assert.ok(fs.existsSync(path.join(output, 'vendor/aurora/logo.png')));
  assert.ok(fs.existsSync(path.join(output, '.nojekyll')));
  assert.ok(!fs.existsSync(path.join(output, 'agro mockup.zip')));
  assert.match(notes, /Первый публичный выпуск/);
});

test('сборка отклоняет неверный тег и тег без записи в истории', t => {
  const output = fs.mkdtempSync(path.join(os.tmpdir(), 'agro-pages-'));
  t.after(() => fs.rmSync(output, { recursive: true, force: true }));

  assert.throws(() => buildPages('v1.0.0', output), /тег/i);
  assert.throws(() => buildPages('mockup-v9.9.9', output), /истории изменений/i);
});
