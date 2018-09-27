import fs = require('fs-extra');
import { ICallbackFunction, Test } from 'nodeunit';
import path = require('path');
import { AccountAccessKeyCache } from '../lib/api/util/account-cache';

export = {
  async 'setUp'(cb: ICallbackFunction) {
    const self = this as any;
    const dir = await fs.mkdtemp('/tmp/account-cache-test');
    self.file = path.join(dir, 'cache.json');
    self.cache = new AccountAccessKeyCache(self.file);
    return cb();
  },

  async 'tearDown'(cb: ICallbackFunction) {
    const self = this as any;
    await fs.remove(path.dirname(self.file));
    cb();
  },

  async 'get(k) when cache is empty'(test: Test) {
    const self = this as any;
    const cache: AccountAccessKeyCache = self.cache;
    test.equal(await cache.get('foo'), undefined, 'get returns undefined');
    test.equal(await fs.pathExists(self.file), false, 'cache file is not created');
    test.done();
  },

  async 'put(k,v) and then get(k)'(test: Test) {
    const self = this as any;
    const cache: AccountAccessKeyCache = self.cache;

    await cache.put('key', 'value');
    await cache.put('boo', 'bar');
    test.deepEqual(await cache.get('key'), 'value', '"key" is mapped to "value"');

    // create another cache instance on the same file, should still work
    const cache2 = new AccountAccessKeyCache(self.file);
    test.deepEqual(await cache2.get('boo'), 'bar', '"boo" is mapped to "bar"');

    // whitebox: read the file
    test.deepEqual(await fs.readJson(self.file), {
      key: 'value',
      boo: 'bar'
    });

    test.done();
  },

  async 'fetch(k, resolver) can be used to "atomically" get + resolve + put'(test: Test) {
    const self = this as any;
    const cache: AccountAccessKeyCache = self.cache;

    test.deepEqual(await cache.get('foo'), undefined, 'no value for "foo" yet');
    test.deepEqual(await cache.fetch('foo', async () => 'bar'), 'bar', 'resolved by fetch and returned');
    test.deepEqual(await cache.get('foo'), 'bar', 'stored in cache by fetch()');
    test.done();
  },

  async 'cache is nuked if it exceeds 1000 entries'(test: Test) {
    const self = this as any;
    const cache: AccountAccessKeyCache = self.cache;

    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      await cache.put(`key${i}`, `value${i}`);
    }

    // verify all 1000 values are on disk
    const otherCache = new AccountAccessKeyCache(self.file);
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      test.equal(await otherCache.get(`key${i}`), `value${i}`);
    }

    // add another value
    await cache.put('nuke-me', 'genesis');

    // now, we expect only `nuke-me` to exist on disk
    test.equal(await otherCache.get('nuke-me'), 'genesis');
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      test.equal(await otherCache.get(`key${i}`), undefined);
    }

    test.done();
  }
};
