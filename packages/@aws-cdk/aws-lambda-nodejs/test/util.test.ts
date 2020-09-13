import * as path from 'path';
import { findUp, getCallerDir } from '../lib/util';

test('findUp', () => {
  // Starting at process.cwd()
  expect(findUp('README.md')).toMatch(/aws-lambda-nodejs$/);

  // Non existing file
  expect(findUp('non-existing-file.unknown')).toBe(undefined);

  // Starting at a specific path
  expect(findUp('util.test.ts', path.join(__dirname, 'integ-handlers'))).toMatch(/aws-lambda-nodejs\/test$/);

  // Non existing file starting at a non existing relative path
  expect(findUp('not-to-be-found.txt', 'non-existing/relative/path')).toBe(undefined);

  // Starting at a relative path
  expect(findUp('util.test.ts', 'test/integ-handlers')).toMatch(/aws-lambda-nodejs\/test$/);
});

const functionUsingGetCallerDir = (depth: number | undefined = undefined) : string | undefined => {
  return getCallerDir(depth);
}

test('getCallerDir', () => {

  it('should return current directory name', () => {
    expect(functionUsingGetCallerDir()).toEqual(__dirname);
  });

  it('should return undefined when depth is too big', () => {
    expect(functionUsingGetCallerDir(100000)).toEqual(undefined);
  });
})
