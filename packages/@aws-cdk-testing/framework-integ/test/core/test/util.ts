import * as fs from 'fs';
import * as path from 'path';

let _cdkVersion: string | undefined = undefined;

/**
 * The exact values we expect from testing against version numbers in this suite depend on whether we're running
 * on a development or release branch. Returns the local package.json version, which will be '0.0.0' unless we're
 * on a release branch, in which case it should be the real version numbers (e.g., 1.91.0).
 */
export function localCdkVersion(): string {
  if (!_cdkVersion) {
    const pkgJson = findParentPkgJson(require.resolve('aws-cdk-lib'));
    _cdkVersion = pkgJson.version;
    if (!_cdkVersion) {
      throw new Error('Unable to determine CDK version');
    }
  }
  return _cdkVersion;
}

function findParentPkgJson(dir: string, depth: number = 1, limit: number = 5): { version: string } {
  const target = path.join(dir, 'package.json');
  if (fs.existsSync(target)) {
    return JSON.parse(fs.readFileSync(target, 'utf8'));
  } else if (depth < limit) {
    return findParentPkgJson(path.join(dir, '..'), depth + 1, limit);
  }

  throw new Error(`No \`package.json\` file found within ${depth} parent directories`);
}
