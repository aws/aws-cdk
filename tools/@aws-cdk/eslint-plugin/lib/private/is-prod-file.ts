import * as path from 'path';

/**
 * We don't care about project test files (in a /test/ directory, excluding our fixtures)
 */
export function isProdFile(filename: string) {
  const isInTestFolder = new RegExp(/\/test\//).test(filename);

  const isOnOurTestFolder = path.resolve(filename).startsWith(path.resolve(__dirname, '..', '..', 'test'));

  return !isInTestFolder || isOnOurTestFolder;
}
