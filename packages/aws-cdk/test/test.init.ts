import fs = require('fs-extra');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { cliInit } from '../lib/init';

const state: {
  previousWorkingDir?: string;
  tempDir?: string;
} = {};

export = {
  async "setUp"(callback: () => void) {
    state.previousWorkingDir = process.cwd();
    state.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
    // tslint:disable-next-line:no-console
    console.log('Temporary working directory:', state.tempDir);
    process.chdir(state.tempDir);
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
  }
};
