import * as fs from 'fs-extra';
import { Test } from 'nodeunit';
import * as os from 'os';
import * as path from 'path';
import * as sinon from 'sinon';
import { setTimeout as _setTimeout } from 'timers';
import { promisify } from 'util';
import { latestVersionIfHigher, VersionCheckTTL } from '../lib/version';

const setTimeout = promisify(_setTimeout);

function tmpfile(): string {
  return `/tmp/version-${Math.floor(Math.random() * 10000)}`;
}

export = {
  'tearDown'(callback: () => void) {
    sinon.restore();
    callback();
  },

  'initialization fails on unwritable directory'(test: Test) {
    test.expect(1);
    const cacheFile = tmpfile();
    sinon.stub(fs, 'mkdirsSync').withArgs(path.dirname(cacheFile)).throws('Cannot make directory');
    test.throws(() => new VersionCheckTTL(cacheFile), /not writable/);
    test.done();
  },

  async 'cache file responds correctly when file is not present'(test: Test) {
    test.expect(1);
    const cache = new VersionCheckTTL(tmpfile(), 1);
    test.strictEqual(await cache.hasExpired(), true);
    test.done();
  },

  async 'cache file honours the specified TTL'(test: Test) {
    test.expect(2);
    const cache = new VersionCheckTTL(tmpfile(), 1);
    await cache.update();
    test.strictEqual(await cache.hasExpired(), false);
    await setTimeout(1001); // Just above 1 sec in ms
    test.strictEqual(await cache.hasExpired(), true);
    test.done();
  },

  async 'Skip version check if cache has not expired'(test: Test) {
    test.expect(1);
    const cache = new VersionCheckTTL(tmpfile(), 100);
    await cache.update();
    test.equal(await latestVersionIfHigher('0.0.0', cache), null);
    test.done();
  },

  async 'Return later version when exists & skip recent re-check'(test: Test) {
    test.expect(3);
    const cache = new VersionCheckTTL(tmpfile(), 100);
    const result = await latestVersionIfHigher('0.0.0', cache);
    test.notEqual(result, null);
    test.ok((result as string).length > 0);

    const result2 = await latestVersionIfHigher('0.0.0', cache);
    test.equal(result2, null);
    test.done();
  },

  async 'Return null if version is higher than npm'(test: Test) {
    test.expect(1);
    const cache = new VersionCheckTTL(tmpfile(), 100);
    const result = await latestVersionIfHigher('100.100.100', cache);
    test.equal(result, null);
    test.done();
  },

  'No homedir for the given user'(test: Test) {
    test.expect(1);
    sinon.stub(os, 'homedir').returns('');
    sinon.stub(os, 'userInfo').returns({ username: '', uid: 10, gid: 11, shell: null, homedir: ''});
    test.throws(() => new VersionCheckTTL(), /Cannot determine home directory/);
    test.done();
  },

  async 'Version specified is stored in the TTL file'(test: Test) {
    test.expect(1);
    const cacheFile = tmpfile();
    const cache = new VersionCheckTTL(cacheFile, 1);
    await cache.update('1.1.1');
    const storedVersion = fs.readFileSync(cacheFile, 'utf8');
    test.equal(storedVersion, '1.1.1');
    test.done();
  },

  async 'No Version specified for storage in the TTL file'(test: Test) {
    test.expect(1);
    const cacheFile = tmpfile();
    const cache = new VersionCheckTTL(cacheFile, 1);
    await cache.update();
    const storedVersion = fs.readFileSync(cacheFile, 'utf8');
    test.equal(storedVersion, '');
    test.done();
  },
};
