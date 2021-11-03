import { sortBy } from '../lib/utils';

test('sortBy sorts successfully', () => {
  const alist = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  sortBy(alist, (i) => [i*-1]);
  expect(alist).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
});