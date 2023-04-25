import * as path from 'path';

/**
 * We don't care about project test files (in a /test/ directory, excluding our fixtures)
 */
export function isProdFile(filename: string) {
  const isInTestFolder = new RegExp(/\/test\//).test(filename);
  const isTestingPackage = new RegExp(/@aws-cdk-testing/).test(filename);

  const isInOurTestFolder = path.resolve(filename).startsWith(path.resolve(__dirname, '..', '..', 'test'));

  return (!isInTestFolder && !isTestingPackage) || isInOurTestFolder;
}
