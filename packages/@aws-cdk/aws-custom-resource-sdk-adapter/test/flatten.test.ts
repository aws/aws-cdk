import { flatten } from '../lib/api-call';

test('flatten correctly flattens a nested object', () => {
  expect(flatten({
    a: { b: 'c' },
    d: [
      { e: 'f' },
      { g: 'h', i: 1, j: null, k: { l: false } },
    ],
  })).toEqual({
    'a.b': 'c',
    'd.0.e': 'f',
    'd.1.g': 'h',
    'd.1.i': 1,
    'd.1.j': null,
    'd.1.k.l': false,
  });
});
