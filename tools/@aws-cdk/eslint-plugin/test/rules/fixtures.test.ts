import { ESLint } from 'eslint';
import * as fs from 'fs-extra';
import * as path from 'path';

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
      it(f, async () => {
        const originalFilePath = path.join(fixturesDir, f);
        const expectedFixedFilePath = path.join(fixturesDir, `${path.basename(f, '.ts')}.expected.ts`);
        const expectedErrorFilepath = path.join(fixturesDir, `${path.basename(f, '.ts')}.error.txt`);
        const fix = fs.existsSync(expectedFixedFilePath);
        const checkErrors = fs.existsSync(expectedErrorFilepath);
        if (fix && checkErrors) {
          fail(`Expected only a fixed file or an expected error message file. Both ${expectedFixedFilePath} and ${expectedErrorFilepath} are present.`);
        } else if (fix) {
          const actualFile = await lintAndFix(originalFilePath, outputDir);
          const actual = await fs.readFile(actualFile, { encoding: 'utf8' });
          const expected = await fs.readFile(expectedFixedFilePath, { encoding: 'utf8' });
          if (actual !== expected) {
            fail(`Linted file did not match expectations.\n--------- Expected ----------\n${expected}\n---------- Actual ----------\n${actual}`);
          }
          return;
        } else if (checkErrors) {
          const actualErrorMessages = await lint(originalFilePath)
          // filter out blank messages because editors sometimes save files with newlines at the end
          const expectedErrorMessages = (await fs.readFile(expectedErrorFilepath, { encoding: 'utf8' })).split('\n')
            .filter((msg: string) => msg !== '');
          if (expectedErrorMessages.length !== actualErrorMessages?.length) {
            fail(`Number of messages from linter did not match expectations. Linted file: ${originalFilePath}. Expected number of messages: ${expectedErrorMessages.length}. Actual number of messages: ${actualErrorMessages?.length}.`);
          }
          actualErrorMessages.forEach(actualMessage => {
            if(!expectedErrorMessages.some(expectedMessage => actualMessage.message.includes(expectedMessage))) {
              fail(`Error message not found in .error.txt file. Linted file: ${originalFilePath}. Actual message:\n${actualMessage.message}\nExpected messages:\n${expectedErrorMessages}`);
            }
          });
          return;
        } else {
          fail(`Expected fixed file or expected error file not found.`);
        }
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

async function lint(file: string) {
  const result = await linter.lintFiles(file);
  // If you only lint one file, then result.length will always be one.
  if (result.length === 1) {
    return result[0].messages;
  }
  return [];
}

function fail(x: string) {
  throw new Error(x);
}
