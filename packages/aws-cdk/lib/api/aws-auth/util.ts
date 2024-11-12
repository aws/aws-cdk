import * as fs from 'fs-extra';
import { debug } from '../../logging';

/**
 * Read a file if it exists, or return undefined
 *
 * Not async because it is used in the constructor
 */
export function readIfPossible(filename: string): string | undefined {
  try {
    if (!fs.pathExistsSync(filename)) {
      return undefined;
    }
    return fs.readFileSync(filename, { encoding: 'utf-8' });
  } catch (e: any) {
    debug(e);
    return undefined;
  }
}
