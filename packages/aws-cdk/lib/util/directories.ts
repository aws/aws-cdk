import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

export function cdkHomeDir() {
  return process.env.CDK_HOME
    ? path.resolve(process.env.CDK_HOME)
    : path.join(fs.realpathSync(os.tmpdir()).trim(), '.cdk');
}

export function cdkCacheDir() {
  return path.join(cdkHomeDir(), 'cache');
}

export function rootDir() {

  function _rootDir(dirname: string): string {
    const manifestPath = path.join(dirname, 'package.json');
    if (fs.existsSync(manifestPath)) {
      return dirname;
    }
    if (path.dirname(dirname) === dirname) {
      throw new Error('Unable to find package manifest');
    }
    return _rootDir(path.dirname(dirname));
  }

  return _rootDir(__dirname);
}
