import * as path from 'path';
import { findUp } from '../lib/util';

test('findUp', () => {
  // Starting at process.cwd()
  expect(findUp('README.md')).toMatch(/aws-lambda-nodejs$/);

  // Non existing file
  expect(findUp('non-existing-file.unknown')).toBe(undefined);

  // Starting at a specific path
  expect(findUp('util.test.ts', path.join(__dirname, 'integ-handlers'))).toMatch(/aws-lambda-nodejs\/test$/);
});
