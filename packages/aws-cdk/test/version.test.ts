import * as path from 'path';
import { setTimeout as _setTimeout } from 'timers';
import { promisify } from 'util';
import * as fs from 'fs-extra';
import * as sinon from 'sinon';
import * as logging from '../lib/logging';
import * as npm from '../lib/util/npm';
import { latestVersionIfHigher, VersionCheckTTL, displayVersionMessage } from '../lib/version';

jest.setTimeout(10_000);

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
  sinon.stub(process, 'stdout').value({ ...process.stdout, isTTY: true });
  sinon.stub(process, 'env').value({ ...process.env, CDK_DISABLE_VERSION_CHECK: '1' });
  const printStub = sinon.stub(logging, 'print');
  await displayVersionMessage();
  expect(printStub.called).toEqual(false);
});

describe('version message', () => {
  const previousIsTty = process.stdout.isTTY;
  beforeAll(() => {
    process.stdout.isTTY = true;
  });

  afterAll(() => {
    process.stdout.isTTY = previousIsTty;
  });

  test('Prints a message when a new version is available', async () => {
    // Given the current version is 1.0.0 and the latest version is 1.1.0
    const currentVersion = '1.0.0';
    jest.spyOn(npm, 'getLatestVersionFromNpm').mockResolvedValue('1.1.0');
    const printSpy = jest.spyOn(logging, 'print');

    // When displayVersionMessage is called
    await displayVersionMessage(currentVersion, new VersionCheckTTL(tmpfile(), 0));

    // Then the new version message is printed to stdout
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('1.1.0'));
  });

  test('Includes major upgrade documentation when available', async() => {
    // Given the current version is 1.0.0 and the latest version is 2.0.0
    const currentVersion = '1.0.0';
    jest.spyOn(npm, 'getLatestVersionFromNpm').mockResolvedValue('2.0.0');
    const printSpy = jest.spyOn(logging, 'print');

    // When displayVersionMessage is called
    await displayVersionMessage(currentVersion, new VersionCheckTTL(tmpfile(), 0));

    // Then the V1 -> V2 documentation is printed
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('Information about upgrading from version 1.x to version 2.x is available here: https://docs.aws.amazon.com/cdk/v2/guide/migrating-v2.html'));
  });

  test('Does not include major upgrade documentation when unavailable', async() => {
    // Given current version is 99.0.0 and the latest version is 100.0.0
    const currentVersion = '99.0.0';
    jest.spyOn(npm, 'getLatestVersionFromNpm').mockResolvedValue('100.0.0');
    const printSpy = jest.spyOn(logging, 'print');

    // When displayVersionMessage is called
    await displayVersionMessage(currentVersion, new VersionCheckTTL(tmpfile(), 0));

    // Then no upgrade documentation is printed
    expect(printSpy).toHaveBeenCalledWith(expect.stringContaining('100.0.0'));
    expect(printSpy).not.toHaveBeenCalledWith(expect.stringContaining('Information about upgrading from 99.x to 100.x'));
  });
});
