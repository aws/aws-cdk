import * as fs from 'fs-extra';
import * as path from 'path';
import { AccountAccessKeyCache } from '../lib/api/util/account-cache';

async function makeCache() {
  const dir = await fs.mkdtemp('/tmp/account-cache-test');
  const file = path.join(dir, 'cache.json');
  return {
    cacheDir: dir,
    cacheFile: file,
    cache: new AccountAccessKeyCache(file),
  };
}

async function nukeCache(cacheDir: string) {
  await fs.remove(cacheDir);
}

test('get(k) when cache is empty', async () => {
  const { cacheDir, cacheFile, cache } = await makeCache();
  try {
    expect(await cache.get('foo')).toBeUndefined();
    expect(await fs.pathExists(cacheFile)).toBeFalsy();
  } finally {
    await nukeCache(cacheDir);
  }
});

test('put(k,v) and then get(k)', async () => {
  const { cacheDir, cacheFile, cache } = await makeCache();

  try {
    await cache.put('key', 'value');
    await cache.put('boo', 'bar');
    expect(await cache.get('key')).toBe('value');

    // create another cache instance on the same file, should still work
    const cache2 = new AccountAccessKeyCache(cacheFile);
    expect(await cache2.get('boo')).toBe('bar');

    // whitebox: read the file
    expect(await fs.readJson(cacheFile)).toEqual({
      key: 'value',
      boo: 'bar'
    });
  } finally {
    await nukeCache(cacheDir);
  }
});

test('fetch(k, resolver) can be used to "atomically" get + resolve + put', async () => {
  const { cacheDir, cache } = await makeCache();

  try {
    expect(await cache.get('foo')).toBeUndefined();
    expect(await cache.fetch('foo', async () => 'bar')).toBe('bar');
    expect(await cache.get('foo')).toBe('bar');
  } finally {
    await nukeCache(cacheDir);
  }
});

test(`cache is nuked if it exceeds ${AccountAccessKeyCache.MAX_ENTRIES} entries`, async () => {
  // This makes a lot of promises, so it can queue for a while...
  jest.setTimeout(30_000);

  const { cacheDir, cacheFile, cache } = await makeCache();

  try {
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      await cache.put(`key${i}`, `value${i}`);
    }

    // verify all values are on disk
    const otherCache = new AccountAccessKeyCache(cacheFile);
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      expect(await otherCache.get(`key${i}`)).toBe(`value${i}`);
    }

    // add another value
    await cache.put('nuke-me', 'genesis');

    // now, we expect only `nuke-me` to exist on disk
    expect(await otherCache.get('nuke-me')).toBe('genesis');
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      expect(await otherCache.get(`key${i}`)).toBeUndefined();
    }
  } finally {
    await nukeCache(cacheDir);
  }
});
