import { Test } from 'nodeunit';
import { flatMap, flatten, partition } from '../../lib/util';

export = {
  'flatten combines arrays'(test: Test) {
    const output = flatten([
      ['a', 'b'],
      [],
      ['c']
    ]);

    test.deepEqual(output, ['a', 'b', 'c']);
    test.done();
  },
  'flatMap maps and combines'(test: Test) {
    const input = ['A', 'B', 'C'];
    const output = flatMap(input, x => [x.toLowerCase()]);

    test.deepEqual(output, ['a', 'b', 'c']);
    test.done();
  },
  'partition splits the collection in twain'(test: Test) {
    const xs = [1, 2, 3, 4, 5];
    const evens = partition(xs, x => x % 2 === 0);

    test.deepEqual(evens, [2, 4]);
    test.deepEqual(xs, [1, 3, 5]);
    test.done();
  },
};
