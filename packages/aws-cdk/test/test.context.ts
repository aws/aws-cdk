import fs = require('fs-extra');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { Configuration } from '../lib/settings';

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

  async 'load context from separate file if available and write changes back there'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', {
      foo: 'bar',
    });

    // WHEN
    const config = await new Configuration().load();

    // THEN
    test.equal(config.context.get(['foo']), 'bar');

    // WHEN
    config.context.set(['baz'], 'quux');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), {
      foo: 'bar',
      baz: 'quux'
    });

    test.done();
  },

  async 'context goes to dedicated file by default'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.json', {
      app: ['do', 'things'],
    });
    const config = await new Configuration().load();

    // WHEN
    config.context.set(['baz'], 'quux');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), {
      baz: 'quux'
    });

    test.done();
  },

  async 'context from legacy file goes back to legacy file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.json', {
      app: ['do', 'things'],
      context: {
        foo: 'bar'
      }
    });
    const config = await new Configuration().load();

    // WHEN
    config.context.set(['baz'], 'quux');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.json'), {
      app: ['do', 'things'],
      context: {
        foo: 'bar',
        baz: 'quux'
      }
    });

    test.done();
  },
};