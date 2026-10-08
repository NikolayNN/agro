const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const pageFiles = ['index.html', 'styles.css', 'aurora.css', 'app.js', 'fleet.js'];

function buildPages(tag, outputDirectory) {
  if (!/^mockup-v\d+\.\d+\.\d+$/.test(tag)) {
    throw new Error('Тег макета должен иметь вид mockup-v1.2.3.');
  }

  const changelog = fs.readFileSync(path.join(projectRoot, 'CHANGELOG.md'), 'utf8');
  const heading = `## ${tag}`;
  const section = changelog.split(/\r?\n/);
  const start = section.findIndex(line => line.trim() === heading);
  if (start < 0) throw new Error(`Для ${tag} нет записи в истории изменений.`);
  const end = section.findIndex((line, index) => index > start && line.startsWith('## '));
  const notes = section.slice(start + 1, end < 0 ? undefined : end).join('\n').trim();
  if (!notes) throw new Error(`Для ${tag} нет описания в истории изменений.`);

  fs.mkdirSync(outputDirectory, { recursive: true });
  for (const file of pageFiles) {
    fs.copyFileSync(path.join(projectRoot, file), path.join(outputDirectory, file));
  }
  fs.cpSync(path.join(projectRoot, 'vendor'), path.join(outputDirectory, 'vendor'), { recursive: true });
  fs.writeFileSync(path.join(outputDirectory, '.nojekyll'), '');
  fs.writeFileSync(path.join(outputDirectory, 'version.js'), `window.AURORA_MOCKUP_VERSION = ${JSON.stringify(tag)};\n`);

  return notes;
}

if (require.main === module) {
  const tag = process.argv[2];
  const outputDirectory = path.join(projectRoot, '_site');
  process.stdout.write(`${buildPages(tag, outputDirectory)}\n`);
}

module.exports = { buildPages };
