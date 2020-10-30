import * as path from 'path';
import { setTimeout as _setTimeout } from 'timers';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as sinon from 'sinon';
import * as logging from '../lib/logging';
import { latestVersionIfHigher, VersionCheckTTL, displayVersionMessage } from '../lib/version';

const setTimeout = promisify(_setTimeout);

function tmpfile(): string {
  return `/tmp/version-${Math.floor(Math.random() * 10000)}`;
}

afterEach(done => {
  sinon.restore();
  done();
});

test('initialization fails on unwritable directory', () => {
  const cacheFile = tmpfile();
  sinon.stub(fs, 'mkdirsSync').withArgs(path.dirname(cacheFile)).throws('Cannot make directory');
  expect(() => new VersionCheckTTL(cacheFile)).toThrow(/not writable/);
});

test('cache file responds correctly when file is not present', async () => {
  const cache = new VersionCheckTTL(tmpfile(), 1);
  expect(await cache.hasExpired()).toBeTruthy();
});

test('cache file honours the specified TTL', async () => {
  const cache = new VersionCheckTTL(tmpfile(), 1);
  await cache.update();
  expect(await cache.hasExpired()).toBeFalsy();
  await setTimeout(1001); // Just above 1 sec in ms
  expect(await cache.hasExpired()).toBeTruthy();
});

test('Skip version check if cache has not expired', async () => {
  const cache = new VersionCheckTTL(tmpfile(), 100);
  await cache.update();
  expect(await latestVersionIfHigher('0.0.0', cache)).toBeNull();
});

test('Return later version when exists & skip recent re-check', async () => {
  const cache = new VersionCheckTTL(tmpfile(), 100);
  const result = await latestVersionIfHigher('0.0.0', cache);
  expect(result).not.toBeNull();
  expect((result as string).length).toBeGreaterThan(0);

  const result2 = await latestVersionIfHigher('0.0.0', cache);
  expect(result2).toBeNull();
});

test('Return null if version is higher than npm', async () => {
  const cache = new VersionCheckTTL(tmpfile(), 100);
  const result = await latestVersionIfHigher('100.100.100', cache);
  expect(result).toBeNull();
});

test('Version specified is stored in the TTL file', async () => {
  const cacheFile = tmpfile();
  const cache = new VersionCheckTTL(cacheFile, 1);
  await cache.update('1.1.1');
  const storedVersion = fs.readFileSync(cacheFile, 'utf8');
  expect(storedVersion).toBe('1.1.1');
});

test('No Version specified for storage in the TTL file', async () => {
  const cacheFile = tmpfile();
  const cache = new VersionCheckTTL(cacheFile, 1);
  await cache.update();
  const storedVersion = fs.readFileSync(cacheFile, 'utf8');
  expect(storedVersion).toBe('');
});

test('Skip version check if environment variable is set', async () => {
  process.stdout.isTTY = true;
  process.env.CDK_DISABLE_VERSION_CHECK = '1';
  const printStub = sinon.stub(logging, 'print');
  await displayVersionMessage();
  expect(printStub.called).toEqual(false);
});
