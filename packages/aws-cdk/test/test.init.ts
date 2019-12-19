import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs-extra';
import { Test } from 'nodeunit';
import * as os from 'os';
import * as path from 'path';
import { availableInitTemplates, cliInit } from '../lib/init';

const state: {
  previousWorkingDir?: string;
  tempDir?: string;
} = {};

export = {
  async "setUp"(callback: () => void) {
    state.previousWorkingDir = process.cwd();
    state.tempDir = await newTempWorkDir();
    // tslint:disable-next-line:no-console
    console.log('Temporary working directory:', state.tempDir);
    callback();
  },

  async "tearDown"(callback: () => void) {
    // tslint:disable-next-line:no-console
    console.log('Switching back to', state.previousWorkingDir, 'cleaning up', state.tempDir);
    process.chdir(state.previousWorkingDir!);
    await fs.remove(state.tempDir!);

    callback();
  },

  async 'create a TypeScript library project'(test: Test) {
    await cliInit('lib', 'typescript', false);

    // Check that package.json and lib/ got created in the current directory
    test.equal(true, await fs.pathExists('package.json'));
    test.equal(true, await fs.pathExists('lib'));

    test.done();
  },

  async 'create a TypeScript app project'(test: Test) {
    await cliInit('app', 'typescript', false);

    // Check that package.json and bin/ got created in the current directory
    test.equal(true, await fs.pathExists('package.json'));
    test.equal(true, await fs.pathExists('bin'));

    test.done();
  },

  async 'create a JavaScript app project'(test: Test) {
    await cliInit('app', 'javascript', false);

    // Check that package.json and bin/ got created in the current directory
    test.equal(true, await fs.pathExists('package.json'));
    test.equal(true, await fs.pathExists('bin'));
    test.equal(true, await fs.pathExists('.git'));

    test.done();
  },

  async '--generate-only should skip git init'(test: Test) {
    await cliInit('app', 'javascript', false, true);

    // Check that package.json and bin/ got created in the current directory
    test.equal(true, await fs.pathExists('package.json'));
    test.equal(true, await fs.pathExists('bin'));
    test.equal(false, await fs.pathExists('.git'));

    test.done();
  },

  async 'git directory does not throw off the initer!'(test: Test) {
    fs.mkdirSync('.git');

    await cliInit('app', 'typescript', false);

    // Check that package.json and bin/ got created in the current directory
    test.equal(true, await fs.pathExists('package.json'));
    test.equal(true, await fs.pathExists('bin'));

    test.done();
  },

  async 'verify "future flags" are added to cdk.json'(test: Test) {
    for (const templ of await availableInitTemplates) {
      for (const lang of templ.languages) {
        const prevdir = process.cwd();
        try {
          await newTempWorkDir();

          await cliInit(templ.name, lang,
            /* canUseNetwork */ false,
            /* generateOnly */ true);

          // ok if template doesn't have a cdk.json file (e.g. the "lib" template)
          if (!await fs.pathExists('cdk.json')) {
            continue;
          }

          const config = await fs.readJson('cdk.json');
          const context = config.context || {};
          for (const [ key, expected ] of Object.entries(cxapi.FUTURE_FLAGS)) {
            const actual = context[key];
            test.equal(actual, expected,
              `expected future flag "${key}=${expected}" in generated cdk.json for ${templ.name}/${lang} but got "${actual}"`);
          }

        } finally {
          process.chdir(prevdir);
        }
      }
    }

    test.done();
  }
};

async function newTempWorkDir() {
  const newDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
  process.chdir(newDir);
  return newDir;
}
