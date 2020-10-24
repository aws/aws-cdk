import { ESLint } from 'eslint';
import * as fs from 'fs-extra';
import * as path from 'path';

const linter = new ESLint({
  overrideConfigFile: path.join(__dirname, 'eslintrc.js'),
  rulePaths: [
    path.join(__dirname, '../../lib/rules'),
  ],
  fix: true,
});

const outputDir = path.join(process.cwd(), '.test-output');
fs.mkdirpSync(outputDir);
const fixturesDir = path.join(__dirname, 'fixtures', 'no-core-construct');

describe('no-core-construct', () => {
  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.ts') && !f.endsWith('.expected.ts'));
  fixtureFiles.forEach(f => {
    test(f, async (done) => {
      const actualFile = await lintAndFix(path.join(fixturesDir, f));
      const expectedFile = path.join(fixturesDir, `${path.basename(f, '.ts')}.expected.ts`);
      if (!fs.existsSync(expectedFile)) {
        done.fail(`Expected file not found. Generated output at ${actualFile}`);
      }
      const actual = await fs.readFile(actualFile, { encoding: 'utf8' });
      const expected = await fs.readFile(expectedFile, { encoding: 'utf8' });
      if (actual !== expected) {
        done.fail(`Linted file did not match expectations. Expected: ${expectedFile}. Actual: ${actualFile}`);
      }
      done();
    });
  });
});

async function lintAndFix(file: string) {
  const newPath = path.join(outputDir, path.basename(file))
  let result = await linter.lintFiles(file);
  await ESLint.outputFixes(result.map(r => {
    r.filePath = newPath;
    return r;
  }));
  return newPath;
}
