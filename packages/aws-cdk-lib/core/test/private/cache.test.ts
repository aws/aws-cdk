import { Cache } from '../../lib/private/cache';

let invocations = 0;
let cache: Cache<string>;

function returnFoo() {
  invocations++;
  return 'foo';
}

beforeEach(() => {
  cache = new Cache<string>();
  invocations = 0;
});

test('invoke retrieval function only once per key', () => {
  // First call
  const value = cache.obtain('key', returnFoo);
  expect(value).toEqual('foo');
  expect(invocations).toEqual(1);

  // Second call
  const value2 = cache.obtain('key', returnFoo);
  expect(value2).toEqual('foo');
  expect(invocations).toEqual(1);

  // Different key
  const value3 = cache.obtain('key2', returnFoo);
  expect(value3).toEqual('foo');
  expect(invocations).toEqual(2);
});

test('cache can be cleared', () => {
  // First call
  expect(cache.obtain('key', returnFoo)).toEqual('foo');

  cache.clear();

  expect(cache.obtain('key', returnFoo)).toEqual('foo');

  expect(invocations).toEqual(2);
});
