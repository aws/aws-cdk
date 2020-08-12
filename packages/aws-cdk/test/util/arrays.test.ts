import { flatMap, flatten, partition } from '../../lib/util';

test('flatten combines arrays', () => {
  const output = flatten([
    ['a', 'b'],
    [],
    ['c'],
  ]);

  expect(output).toEqual(['a', 'b', 'c']);
});

test('flatMap maps and combines', () => {
  const input = ['A', 'B', 'C'];
  const output = flatMap(input, x => [x.toLowerCase()]);

  expect(output).toEqual(['a', 'b', 'c']);
});

test('partition splits the collection in twain', () => {
  const xs = [1, 2, 3, 4, 5];
  const evens = partition(xs, x => x % 2 === 0);

  expect(evens).toEqual([2, 4]);
  expect(xs).toEqual([1, 3, 5]);
});
