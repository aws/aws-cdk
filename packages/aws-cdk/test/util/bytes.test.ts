import { formatBytes } from '../../lib/util/bytes';

test.each([
  [0, '0 Bytes'],
  [10, '10 Bytes'],
  [1024, '1 KiB'],
  [10.5 * 1024 * 1024, '10.5 MiB'],
])('converts %s bytes to %s', (bytes: number, expected: string) => {
  expect(formatBytes(bytes)).toEqual(expected);
});

test('can format many decimals', () => {
  expect(formatBytes(10.51234 * 1024 * 1024, 5)).toEqual('10.51234 MiB');
});

test('can deal with negative decimals', () => {
  expect(formatBytes(10.5 * 1024 * 1024, -1)).toEqual('11 MiB');
});
