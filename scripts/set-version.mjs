import { readFileSync, writeFileSync } from 'node:fs';

const version = process.argv[2];
if (!version) throw new Error('Usage: set-version.mjs <version>');

for (const file of ['package.json', 'src/manifest.json']) {
  const data = JSON.parse(readFileSync(file, 'utf8'));
  data.version = version;
  writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}
