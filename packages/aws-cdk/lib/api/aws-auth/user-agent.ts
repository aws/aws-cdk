import * as path from 'path';
import { readIfPossible } from './util';
import { rootDir } from '../../util/directories';

/**
 * Find the package.json from the main toolkit.
 *
 * If we can't read it for some reason, try to do something reasonable anyway.
 * Fall back to argv[1], or a standard string if that is undefined for some reason.
 */
export function defaultCliUserAgent() {
  const root = rootDir(false);
  const pkg = JSON.parse((root ? readIfPossible(path.join(root, 'package.json')) : undefined) ?? '{}');
  const name = pkg.name ?? path.basename(process.argv[1] ?? 'cdk-cli');
  const version = pkg.version ?? '<unknown>';
  return `${name}/${version}`;
}
