/**
 * Verify that all entries in the "exports" map of package.json point to files that exist on disk.
 */
import * as fs from 'fs';
import * as path from 'path';

const pkgPath = path.resolve(__dirname, '..', 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const exportMap: Record<string, string> = pkg.exports;
const baseDir = path.dirname(pkgPath);

const missing: Array<{ key: string; target: string }> = [];

for (const [key, target] of Object.entries(exportMap)) {
  if (!fs.existsSync(path.resolve(baseDir, target))) {
    missing.push({ key, target });
  }
}

if (missing.length > 0) {
  console.error(`Found ${missing.length} export(s) pointing to missing files:\n`);
  for (const m of missing) {
    console.error(`  ${m.key} -> ${m.target}`);
  }
  process.exitCode = 1;
} else {
  console.log('All export targets exist.');
}
