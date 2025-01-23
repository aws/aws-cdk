import * as fs from 'fs';
import * as path from 'path';
import { ToolkitError } from '../toolkit/error';

/**
 * From the current file, find the directory that contains the CLI's package.json
 *
 * Can't use `__dirname` in production code, as the CLI will get bundled as it's
 * released and `__dirname` will refer to a different location in the `.ts` form
 * as it will in the final executing form.
 */
export function rootDir(): string;
export function rootDir(fail: true): string;
export function rootDir(fail: false): string | undefined;
export function rootDir(fail?: boolean) {
  function _rootDir(dirname: string): string | undefined {
    const manifestPath = path.join(dirname, 'package.json');
    if (fs.existsSync(manifestPath)) {
      return dirname;
    }
    if (path.dirname(dirname) === dirname) {
      if (fail ?? true) {
        throw new ToolkitError('Unable to find package manifest');
      }
      return undefined;
    }
    return _rootDir(path.dirname(dirname));
  }

  return _rootDir(__dirname);
}
