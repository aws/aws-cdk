import * as path from 'path';

// tslint:disable:no-var-requires
// eslint-disable @typescript-eslint/no-require-imports

/**
 * Get my package JSON.
 *
 * In principle it's just '__dirname/../../package.json', but in the monocdk
 * it will live at a different location. So search upwards.
 */
export function loadMyPackageJson(): any {
  let dir = path.resolve(__dirname, '..', '..');
  while (true) {
    try {
      return require(path.join(dir, 'package.json'));
    } catch (e) {
      if (e.code !== 'MODULE_NOT_FOUND') { throw e; }

      const newdir = path.dirname(dir);
      if (newdir === dir) { throw new Error(`No package.json found upward of ${__dirname}`); }
      dir = newdir;
    }
  }
}