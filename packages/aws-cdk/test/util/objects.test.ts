import * as fc from 'fast-check';
import { deepClone, deepGet, deepMerge, deepSet, splitBySize } from '../../lib/util';

test('deepSet can set deeply', () => {
  const obj = {};
  deepSet(obj, ['a', 'b'], 3);
  expect(obj).toEqual({ a: { b: 3 } });
});

test('deepGet can get deeply', () => {
  const obj = { a: { b: 3 } };
  expect(deepGet(obj, ['a', 'b'])).toBe(3);
});

test('deepGet can return an array', () => {
  const obj = { a: [1, 2, 3] };
  expect(deepGet(obj, ['a'])).toEqual([1, 2, 3]);
});

test('changing deepClones copy leaves the original intact', () => {
  const original = { a: [{ b: 3 }] };
  const copy = deepClone(original);
  copy.a[0].c = 5;

  expect(original).toEqual({ a: [{ b: 3 }] });
});

test('deepMerge merges objects', () => {
  const original = { a: { b: 3 } };
  deepMerge(original, { a: { c: 4 } });

  expect(original).toEqual({ a: { b: 3, c: 4 } });
});

test('deepMerge overwrites non-objects', () => {
  const original = { a: [] };
  deepMerge(original, { a: { b: 3 } });

  expect(original).toEqual({ a: { b: 3 } });
});

test('deepMerge does not overwrite if rightmost is "undefined"', () => {
  const original = { a: 1 };
  deepMerge(original, { a: undefined });

  expect(original).toEqual({ a: 1 });
});

describe('splitBySize', () => {
  test('objects are split at the right place', () => {
    fc.assert(
      fc.property(fc.object(), fc.integer({ min: 2 }), (data, size) => {
        const [first, second] = splitBySize(data, size);

        expect(Buffer.from(JSON.stringify(first)).length).toBeLessThanOrEqual(size);
        expect({ ...first, ...second }).toEqual(data);
      }),
    );
  });

  test('smallest allowed limit is 2', () => {
    fc.assert(
      fc.property(fc.object(), fc.integer({ max: 1 }), (data, size) => {
        expect(() => splitBySize(data, size)).toThrow();
      }),
    );
  });
});