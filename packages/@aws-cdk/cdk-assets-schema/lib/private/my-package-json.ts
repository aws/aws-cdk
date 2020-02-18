import * as path from 'path';

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

      const parent = path.dirname(dir);
      if (parent === dir) { throw new Error(`No package.json found upward of ${__dirname}`); }
      dir = parent;
    }
  }
}

// tslint:disable:no-var-requires
// eslint-disable-next-line @typescript-eslint/no-require-imports
// tslint:enable:no-var-requires