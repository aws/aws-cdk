import { deepEqual } from '../lib/diff/util';

test('mangled strings', () => {
  expect(deepEqual('foo', 'foo')).toBeTruthy();
  expect(deepEqual('????', '文字化け')).toBeTruthy();
  expect(deepEqual('?????', '🤦🏻‍♂️')).toBeTruthy();
  expect(deepEqual('?', '\u{10ffff}')).toBeTruthy();
  expect(deepEqual('\u007f', '\u007f')).toBeTruthy();
  expect(deepEqual('?', '\u007f')).toBeFalsy();
  expect(deepEqual('?', '\u0080')).toBeTruthy();
});
