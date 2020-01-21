import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import { availableInitTemplates, cliInit } from '../lib/init';

cliTest('create a TypeScript library project', async (workDir) => {
  await cliInit('lib', 'typescript', false, undefined /* canUseNetwork */, workDir);

  // Check that package.json and lib/ got created in the current directory
  expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, 'lib'))).toBeTruthy();
});

cliTest('create a TypeScript app project', async (workDir) => {
  await cliInit('app', 'typescript', false, undefined /* canUseNetwork */, workDir);

  // Check that package.json and bin/ got created in the current directory
  expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
});

cliTest('create a JavaScript app project', async (workDir) => {
  await cliInit('app', 'javascript', false, undefined /* canUseNetwork */, workDir);

  // Check that package.json and bin/ got created in the current directory
  expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, '.git'))).toBeTruthy();
});

cliTest('--generate-only should skip git init', async (workDir) => {
  await cliInit('app', 'javascript', false, true, workDir);

  // Check that package.json and bin/ got created in the current directory
  expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, '.git'))).toBeFalsy();
});

cliTest('git directory does not throw off the initer!', async (workDir) => {
  fs.mkdirSync(path.join(workDir, '.git'));

  await cliInit('app', 'typescript', false, undefined /* canUseNetwork */, workDir);

  // Check that package.json and bin/ got created in the current directory
  expect(await fs.pathExists(path.join(workDir, 'package.json'))).toBeTruthy();
  expect(await fs.pathExists(path.join(workDir, 'bin'))).toBeTruthy();
});

test('verify "future flags" are added to cdk.json', async () => {
  // This is a lot to test, and it can be slow-ish, especially when ran with other tests.
  jest.setTimeout(30_000);

  for (const templ of await availableInitTemplates) {
    for (const lang of templ.languages) {
      await withTempDir(async tmpDir => {
        await cliInit(templ.name, lang,
          /* canUseNetwork */ false,
          /* generateOnly */ true,
          tmpDir);

        // ok if template doesn't have a cdk.json file (e.g. the "lib" template)
        if (!await fs.pathExists(path.join(tmpDir, 'cdk.json'))) {
          return;
        }

        const config = await fs.readJson(path.join(tmpDir, 'cdk.json'));
        const context = config.context || {};
        for (const [key, expected] of Object.entries(cxapi.FUTURE_FLAGS)) {
          const actual = context[key];
          expect(actual).toEqual(expected);
        }
      });
    }
  }
});

function cliTest(name: string, handler: (dir: string) => void | Promise<any>): void {
  test(name, () => withTempDir(handler));
}

async function withTempDir(cb: (dir: string) => void | Promise<any>) {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
  try {
    await cb(tmpDir);
  } finally {
    await fs.remove(tmpDir);
  }
}
