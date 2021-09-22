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
      const errorCount = await lintAndGetErrorCount(originalFilepath)
      if (errorCount > 0) {
        done();
      } else {
        done.fail(`Linter did not find any errors in the test file: ${path.join(fixturesDir, f)}`);
      }
    });
  });
});

async function lintAndGetErrorCount(file: string) {
  const result = await linter.lintFiles(file);
  if (result.length === 1) {
    return (result[0].errorCount);
  };
  return 0;
}