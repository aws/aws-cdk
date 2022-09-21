import * as fs from 'fs';
import * as path from 'path';
import * as cxapi from '@aws-cdk/cx-api';

export function cdkCacheDir() {
  return path.join(cxapi.cdkHomeDir(), 'cache');
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
