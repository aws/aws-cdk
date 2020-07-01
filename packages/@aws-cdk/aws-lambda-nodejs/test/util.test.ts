import { findUp } from '../lib/util';

test('findUp', () => {
  expect(findUp('README.md')).toBe(process.cwd());
});
