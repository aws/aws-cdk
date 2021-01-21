import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs-extra';
import { Configuration, TRANSIENT_CONTEXT_KEY } from '../lib/settings';

const state: {
  previousWorkingDir?: string;
  tempDir?: string;
} = {};

beforeAll(async done => {
  state.previousWorkingDir = process.cwd();
  state.tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'aws-cdk-test'));
  // eslint-disable-next-line no-console
  console.log('Temporary working directory:', state.tempDir);
  process.chdir(state.tempDir);
  done();
});

afterAll(async done => {
  // eslint-disable-next-line no-console
  console.log('Switching back to', state.previousWorkingDir, 'cleaning up', state.tempDir);
  process.chdir(state.previousWorkingDir!);
  await fs.remove(state.tempDir!);

  done();
});

test('load context from both files if available', async () => {
  // GIVEN
  await fs.writeJSON('cdk.context.json', { foo: 'bar' });
  await fs.writeJSON('cdk.json', { context: { boo: 'far' } });

  // WHEN
  const config = await new Configuration({ readUserContext: false }).load();

  // THEN
  expect(config.context.get('foo')).toBe('bar');
  expect(config.context.get('boo')).toBe('far');
});

test('deleted context disappears from new file', async () => {
  // GIVEN
  await fs.writeJSON('cdk.context.json', { foo: 'bar' });
  await fs.writeJSON('cdk.json', { context: { foo: 'bar' } });
  const config = await new Configuration({ readUserContext: false }).load();

  // WHEN
  config.context.unset('foo');
  await config.saveContext();

  // THEN
  expect(await fs.readJSON('cdk.context.json')).toEqual({});
  expect(await fs.readJSON('cdk.json')).toEqual({ context: { foo: 'bar' } });
});

test('clear deletes from new file', async () => {
  // GIVEN
  await fs.writeJSON('cdk.context.json', { foo: 'bar' });
  await fs.writeJSON('cdk.json', { context: { boo: 'far' } });
  const config = await new Configuration({ readUserContext: false }).load();

  // WHEN
  config.context.clear();
  await config.saveContext();

  // THEN
  expect(await fs.readJSON('cdk.context.json')).toEqual({});
  expect(await fs.readJSON('cdk.json')).toEqual({ context: { boo: 'far' } });
});

test('context is preserved in the location from which it is read', async () => {
  // GIVEN
  await fs.writeJSON('cdk.json', { context: { 'boo:boo': 'far' } });
  const config = await new Configuration({ readUserContext: false }).load();

  // WHEN
  expect(config.context.all).toEqual({ 'boo:boo': 'far' });
  await config.saveContext();

  // THEN
  expect(await fs.readJSON('cdk.context.json')).toEqual({});
  expect(await fs.readJSON('cdk.json')).toEqual({ context: { 'boo:boo': 'far' } });
});

test('surive no context in old file', async () => {
  // GIVEN
  await fs.writeJSON('cdk.json', { });
  await fs.writeJSON('cdk.context.json', { boo: 'far' });
  const config = await new Configuration({ readUserContext: false }).load();

  // WHEN
  expect(config.context.all).toEqual({ boo: 'far' });
  await config.saveContext();

  // THEN
  expect(await fs.readJSON('cdk.context.json')).toEqual({ boo: 'far' });
});

test('command line context is merged with stored context', async () => {
  // GIVEN
  await fs.writeJSON('cdk.context.json', { boo: 'far' });
  const config = await new Configuration({
    readUserContext: false,
    commandLineArguments: {
      context: ['foo=bar'],
      _: ['command'],
    } as any,
  }).load();

  // WHEN
  expect(config.context.all).toEqual({ foo: 'bar', boo: 'far' });
});

test('can save and load', async () => {
  // GIVEN
  const config1 = await new Configuration({ readUserContext: false }).load();
  config1.context.set('some_key', 'some_value');
  await config1.saveContext();
  expect(config1.context.get('some_key')).toEqual('some_value');

  // WHEN
  const config2 = await new Configuration({ readUserContext: false }).load();

  // THEN
  expect(config2.context.get('some_key')).toEqual('some_value');
});

test('transient values arent saved to disk', async () => {
  // GIVEN
  const config1 = await new Configuration({ readUserContext: false }).load();
  config1.context.set('some_key', { [TRANSIENT_CONTEXT_KEY]: true, value: 'some_value' });
  await config1.saveContext();
  expect(config1.context.get('some_key').value).toEqual('some_value');

  // WHEN
  const config2 = await new Configuration({ readUserContext: false }).load();

  // THEN
  expect(config2.context.get('some_key')).toEqual(undefined);
});
