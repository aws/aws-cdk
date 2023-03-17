import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

/**
 * Return a location that will be used as the CDK home directory.
 * Currently the only thing that is placed here is the cache.
 *
 * First try to use the users home directory (i.e. /home/someuser/),
 * but if that directory does not exist for some reason create a tmp directory.
 *
 * Typically it wouldn't make sense to create a one time use tmp directory for
 * the purpose of creating a cache, but since this only applies to users that do
 * not have a home directory (some CI systems?) this should be fine.
 */
export function cdkHomeDir() {
  const tmpDir = fs.realpathSync(os.tmpdir());
  let home;
  try {
    home = path.join((os.userInfo().homedir ?? os.homedir()).trim(), '.cdk');
  } catch {}
  return process.env.CDK_HOME
    ? path.resolve(process.env.CDK_HOME)
    : home || fs.mkdtempSync(path.join(tmpDir, '.cdk')).trim();
}

export function cdkCacheDir() {
  return path.join(cdkHomeDir(), 'cache');
}

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
        throw new Error('Unable to find package manifest');
      }
      return undefined;
    }
    return _rootDir(path.dirname(dirname));
  }

  return _rootDir(__dirname);
}
