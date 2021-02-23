import { ESLint } from 'eslint';
import * as fs from 'fs-extra';
import * as path from 'path';

const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, '../../lib/rules');

let linter: ESLint;

const outputRoot = path.join(process.cwd(), '.test-output');
fs.mkdirpSync(outputRoot);

const fixturesRoot = path.join(__dirname, 'fixtures');

fs.readdirSync(fixturesRoot).filter(f => fs.lstatSync(path.join(fixturesRoot, f)).isDirectory()).forEach(d => {
  describe(d, () => {
    const fixturesDir = path.join(fixturesRoot, d);

    beforeAll(() => {
      linter = new ESLint({
        baseConfig: {
          parser: '@typescript-eslint/parser',
        },
        overrideConfigFile: path.join(fixturesDir, 'eslintrc.js'),
        rulePaths: [
          path.join(__dirname, '../../lib/rules'),
        ],
        fix: true,
      });
    });

    const outputDir = path.join(outputRoot, d);
    fs.mkdirpSync(outputDir);

    const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.ts') && !f.endsWith('.expected.ts'));

    fixtureFiles.forEach(f => {
      test(f, async (done) => {
        const actualFile = await lintAndFix(path.join(fixturesDir, f), outputDir);
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
});

async function lintAndFix(file: string, outputDir: string) {
  const newPath = path.join(outputDir, path.basename(file))
  let result = await linter.lintFiles(file);
  const hasFixes = result.find(r => typeof(r.output) === 'string') !== undefined;
  if (hasFixes) {
    await ESLint.outputFixes(result.map(r => {
      r.filePath = newPath;
      return r;
    }));
  } else {
    // If there are no fixes, copy the input file as output
    await fs.copyFile(file, newPath);
  }
  return newPath;
}
