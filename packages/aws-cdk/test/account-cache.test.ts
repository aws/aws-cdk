import * as fs from 'fs-extra';
import * as path from 'path';
import { AccountAccessKeyCache } from '../lib/api/aws-auth/account-cache';

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

test('default account cache uses CDK_HOME', () => {
  process.env.CDK_HOME = '/banana';
  const cache = new AccountAccessKeyCache();
  expect((cache as any).cacheFile).toContain('/banana/');
});

test('account cache does not fail when given a nonwritable directory', async () => {
  const accessError = new Error('Oh no');
  (accessError as any).code = 'EACCES';

  return withMocked(fs, 'mkdirs', async (mkdirs) => {
    // Have to do this because mkdirs has 2 overloads and it confuses TypeScript
    (mkdirs as unknown as jest.Mock<Promise<void>, [any]>).mockRejectedValue(accessError);

    const cache = new AccountAccessKeyCache('/abc/xyz');
    await cache.fetch('xyz', () => Promise.resolve({ accountId: 'asdf', partition: 'swa' }));

    // No exception
  });
});

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
    await cache.put('key', { accountId: 'value', partition: 'aws' });
    await cache.put('boo', { accountId: 'bar', partition: 'aws' });
    expect(await cache.get('key')).toEqual({ accountId: 'value', partition: 'aws' });

    // create another cache instance on the same file, should still work
    const cache2 = new AccountAccessKeyCache(cacheFile);
    expect(await cache2.get('boo')).toEqual({ accountId: 'bar', partition: 'aws' });

    // whitebox: read the file
    expect(await fs.readJson(cacheFile)).toEqual({
      key: { accountId: 'value', partition: 'aws' },
      boo: { accountId: 'bar', partition: 'aws' },
    });
  } finally {
    await nukeCache(cacheDir);
  }
});

test('fetch(k, resolver) can be used to "atomically" get + resolve + put', async () => {
  const { cacheDir, cache } = await makeCache();

  try {
    expect(await cache.get('foo')).toBeUndefined();
    expect(await cache.fetch('foo', async () => ({ accountId: 'bar', partition: 'aws' }))).toEqual({ accountId: 'bar', partition: 'aws' });
    expect(await cache.get('foo')).toEqual({ accountId: 'bar', partition: 'aws' });
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
      await cache.put(`key${i}`, { accountId: `value${i}`, partition: 'aws' });
    }

    // verify all values are on disk
    const otherCache = new AccountAccessKeyCache(cacheFile);
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      expect(await otherCache.get(`key${i}`)).toEqual({ accountId: `value${i}`, partition: 'aws' });
    }

    // add another value
    await cache.put('nuke-me', { accountId: 'genesis', partition: 'aws' });

    // now, we expect only `nuke-me` to exist on disk
    expect(await otherCache.get('nuke-me')).toEqual({ accountId: 'genesis', partition: 'aws' });
    for (let i = 0; i < AccountAccessKeyCache.MAX_ENTRIES; ++i) {
      expect(await otherCache.get(`key${i}`)).toBeUndefined();
    }
  } finally {
    await nukeCache(cacheDir);
  }
});

function withMocked<A extends object, K extends keyof A, B>(obj: A, key: K, block: (fn: jest.Mocked<A>[K]) => B): B {
  const original = obj[key];
  const mockFn = jest.fn();
  (obj as any)[key] = mockFn;

  let ret;
  try {
    ret = block(mockFn as any);
  } catch (e) {
    obj[key] = original;
    throw e;
  }

  if (!isPromise(ret)) {
    obj[key] = original;
    return ret;
  }

  return ret.finally(() => { obj[key] = original; }) as any;
}

function isPromise<A>(object: any): object is Promise<A> {
  return Promise.resolve(object) === object;
}