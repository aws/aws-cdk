import * as path from 'path';
import { findUp } from '../lib/util';

test('findUp', () => {
  // Starting at process.cwd()
  expect(findUp('README.md')).toEqual(path.resolve(__dirname, '..'));

  // Non existing file
  expect(findUp('non-existing-file.unknown')).toBe(undefined);

  // Starting at a specific path
  expect(findUp('util.test.ts', path.join(__dirname, 'integ-handlers'))).toEqual(__dirname);

  // Non existing file starting at a non existing relative path
  expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);

  // Starting at a relative path
  expect(findUp('util.test.ts', 'test/integ-handlers')).toEqual(__dirname);
});
