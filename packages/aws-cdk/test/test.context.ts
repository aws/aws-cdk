import fs = require('fs-extra');
import { Test } from 'nodeunit';
import os = require('os');
import path = require('path');
import { Configuration, TRANSIENT_CONTEXT_KEY } from '../lib/settings';

const state: {
  previousWorkingDir?: string;
  tempDir?: string;
} = {};

export = {
  async "setUp"(callback: () => void) {
    state.previousWorkingDir = process.cwd();
    state.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
    // eslint-disable-next-line no-console
    console.log('Temporary working directory:', state.tempDir);
    process.chdir(state.tempDir);
    callback();
  },

  async "tearDown"(callback: () => void) {
    // eslint-disable-next-line no-console
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

  async 'context with colons gets migrated to new file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { 'boo': 'far', 'boo:boo': 'far:far' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.set('baz', 'quux');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), { 'foo': 'bar', 'boo:boo': 'far:far', 'baz': 'quux' });
    test.deepEqual(await fs.readJSON('cdk.json'), { context: { boo: 'far'} });

    test.done();
  },

  async 'deleted context disappears from new file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { foo: 'bar' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.unset('foo');
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), {});
    test.deepEqual(await fs.readJSON('cdk.json'), { context: { foo: 'bar' }});

    test.done();
  },

  async 'clear deletes from new file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { foo: 'bar' });
    await fs.writeJSON('cdk.json', { context: { boo: 'far' } });
    const config = await new Configuration().load();

    // WHEN
    config.context.clear();
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), {});
    test.deepEqual(await fs.readJSON('cdk.json'), { context: { boo: 'far' } });

    test.done();
  },

  async 'surive missing new file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.json', { context: { 'boo:boo' : 'far' } });
    const config = await new Configuration().load();

    // WHEN
    test.deepEqual(config.context.all, { 'boo:boo' : 'far' });
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), { 'boo:boo' : 'far' });
    test.deepEqual(await fs.readJSON('cdk.json'), {});

    test.done();
  },

  async 'surive no context in old file'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.json', { });
    await fs.writeJSON('cdk.context.json', { boo: 'far' });
    const config = await new Configuration().load();

    // WHEN
    test.deepEqual(config.context.all, { boo: 'far' });
    await config.saveContext();

    // THEN
    test.deepEqual(await fs.readJSON('cdk.context.json'), { boo: 'far' });

    test.done();
  },

  async 'command line context is merged with stored context'(test: Test) {
    // GIVEN
    await fs.writeJSON('cdk.context.json', { boo: 'far' });
    const config = await new Configuration({ context: ['foo=bar'] } as any).load();

    // WHEN
    test.deepEqual(config.context.all, { foo: 'bar', boo: 'far' });

    test.done();
  },

  async 'can save and load'(test: Test) {
    // GIVEN
    const config1 = await new Configuration().load();
    config1.context.set('some_key', 'some_value');
    await config1.saveContext();
    test.equal(config1.context.get('some_key'), 'some_value');

    // WHEN
    const config2 = await new Configuration().load();

    // THEN
    test.equal(config2.context.get('some_key'), 'some_value');

    test.done();
  },

  async 'transient values arent saved to disk'(test: Test) {
    // GIVEN
    const config1 = await new Configuration().load();
    config1.context.set('some_key', { [TRANSIENT_CONTEXT_KEY]: true, value: 'some_value' });
    await config1.saveContext();
    test.equal(config1.context.get('some_key').value, 'some_value');

    // WHEN
    const config2 = await new Configuration().load();

    // THEN
    test.equal(config2.context.get('some_key'), undefined);

    test.done();
  },
};