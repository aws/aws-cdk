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

  async 'load context from both files if available'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { boo: 'far' } });

    // WHEN
    const config = await new Configuration().load();

    // THEN
    test.equal(config.context.get('foo'), 'bar');
    test.equal(config.context.get('boo'), 'far');

    test.done();
  },

  async 'new context always goes to dedicated file, other context stays in source file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { boo: 'far' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.set('baz', 'quux');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), { foo: 'bar', baz: 'quux' });
    test.deepEqual(await fs.readJSON('cdk.json'), { context: { boo: 'far' } });

    test.done();
  },

  async 'overwritten always goes to dedicated file, removed from source file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { foo: 'bar' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.set('foo', 'boom');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), { foo: 'boom' });
    test.deepEqual(await fs.readJSON('cdk.json'), { context: {} });

    test.done();
  },

  async 'deleted context disappears from both files'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { foo: 'bar' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.unset('foo');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), {});
    test.deepEqual(await fs.readJSON('cdk.json'), { context: {} });

    test.done();
  },

  async 'clear deletes from both files'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { boo: 'far' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.clear();
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), {});
    test.deepEqual(await fs.readJSON('cdk.json'), { context: {} });

    test.done();
  },
};