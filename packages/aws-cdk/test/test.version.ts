import { Test } from 'nodeunit';
import { setTimeout as _setTimeout } from 'timers';
import { promisify } from 'util';
import { latestVersionIfHigher, TimestampFile } from '../lib/version';

const setTimeout = promisify(_setTimeout);

function tmpfile(): string {
  return `/tmp/version-${Math.floor(Math.random() * 10000)}`;
}

export = {
  async 'cache file responds correctly when file is not present'(test: Test) {
    const cache = new TimestampFile(tmpfile(), 1);
    test.strictEqual(await cache.hasExpired(), true);
    test.done();
  },

  async 'cache file honours the specified TTL'(test: Test) {
    const cache = new TimestampFile(tmpfile(), 1);
    await cache.update();
    test.strictEqual(await cache.hasExpired(), false);
    await setTimeout(1001); // Just above 1 sec in ms
    test.strictEqual(await cache.hasExpired(), true);
    test.done();
  },

  async 'Skip version check if cache has not expired'(test: Test) {
    const cache = new TimestampFile(tmpfile(), 100);
    await cache.update();
    test.equal(await latestVersionIfHigher('0.0.0', cache), null);
    test.done();
  },

  async 'Return later version when exists & skip recent re-check'(test: Test) {
    const cache = new TimestampFile(tmpfile(), 100);
    const result = await latestVersionIfHigher('0.0.0', cache);
    test.notEqual(result, null);
    test.ok((result as string).length > 0);

    const result2 = await latestVersionIfHigher('0.0.0', cache);
    test.equal(result2, null);
    test.done();
  },

  async 'Return null if version is higher than npm'(test: Test) {
    const cache = new TimestampFile(tmpfile(), 100);
    const result = await latestVersionIfHigher('100.100.100', cache);
    test.equal(result, null);
    test.done();
  },
};
