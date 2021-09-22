import { ESLint } from 'eslint';
import * as fs from 'fs-extra';
import * as path from 'path';

const rulesDirPlugin = require('eslint-plugin-rulesdir');
rulesDirPlugin.RULES_DIR = path.join(__dirname, '../../lib/rules');

let linter: ESLint;

const outputRoot = path.join(process.cwd(), '.test-output');
fs.mkdirpSync(outputRoot);

const fixturesRoot = path.join(__dirname, 'fixtures');

const d = 'invalid-cfn-imports';
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

  const fixtureFiles = fs.readdirSync(fixturesDir).filter(f => f.endsWith('.ts'));
  fixtureFiles.forEach(f => {
    test(f, async (done) => {
      const originalFilepath = path.join(fixturesDir, f);
      const expectedErrorFilepath = path.join(fixturesDir, `${path.basename(f, '.ts')}.error.txt`);
      const result = await lintAndGetErrorCountAndMessage(originalFilepath)

      if (!fs.existsSync(expectedErrorFilepath)) {
        if (result.errorCount !== 0) {
          done.fail(`Linter found errors in file: ${originalFilepath}, when none were expected because there is no corresponding ${expectedErrorFilepath} file.`);
          return;
        } else {
          done();
          return;
        }
      }
      const expectedErrorMessage = await fs.readFile(expectedErrorFilepath, { encoding: 'utf8' });
      if (result.errorMessage !== expectedErrorMessage) {
        done.fail(`Error mesage from linter did not match expectations. Linted file: ${originalFilepath}. \nExpected error message: ${expectedErrorMessage} \nActual error message: ${result.errorMessage}`);
      }
      done();
    });
  });
});

async function lintAndGetErrorCountAndMessage(file: string) {
  const result = await linter.lintFiles(file);
  let errorCount = 0;
  let errorMessage: string | undefined = undefined;
  if (result.length === 1) {
    errorCount = result[0].errorCount;
    if (result[0].messages.length === 1) {
      errorMessage = result[0].messages[0].message;
    }
  };
  return {
    errorCount,
    errorMessage,
  };
}