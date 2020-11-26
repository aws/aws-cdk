import { sortedStringify } from '../../lib/private/sort';

describe('sort', () => {
  test('keys are sorted', () => {
    const obj = {
      a: 50,
      d: { i: [1, 2] },
      f: 'x',
      b: { q: 'y', p: 'z' },
      e: false,
    };

    expect(sortedStringify(obj, 2)).toEqual(`{
  "a": 50,
  "b": {
    "p": "z",
    "q": "y"
  },
  "d": {
    "i": [
      1,
      2
    ]
  },
  "e": false,
  "f": "x"
}`,
    );
  });
});