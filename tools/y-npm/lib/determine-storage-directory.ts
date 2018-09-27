import fs = require('fs-extra');
import path = require('path');
import { debug } from './logging';

/** The parent directory of this module's location */
const installRoot = path.resolve(path.join(__dirname, '..', '..'));
/** The standard name of y-npm overlay directories */
const overlayName = path.join('y', 'npm');

/**
 * Determines the directory where the overlay is located, using the following workflow:
 *   1. ${Y_NPM_REPOSITORY}
 *   2. Walk up the tree from ${cwd} until:
 *   * A y/npm directory is found
 *   * The root of the filesystem is reached
 *   3. Walk up the tree from the module's install location until:
 *   * A y/npm directory is found
 *   * The root of the filesystem is reached
 *   4. Bail out in error.
 * @returns the directory where the overlay directory is located.
 */
export async function determineStorageDirectory() {
  let result: string | undefined = process.env.Y_NPM_REPOSITORY;
  if (!result) { result = await findOverlayDirectory(process.cwd()); }
  if (!result) { result = await findOverlayDirectory(installRoot); }
  if (!result) {
    throw new Error(`Unable to locate the ${overlayName} overlay directory, maybe you should set the Y_NPM_REPOSITORY environment variable?`);
  }
  debug(`Storage directory: ${result} (override by setting the Y_NPM_REPOSITORY environment variable)`);
  if (!await fs.pathExists(result)) {
    throw new Error(`Storage directory does not exist: ${result}`);
  }
  return result;
}

/**
 * Search for an overlay directory in a tree structure, walking up from the provided directory.
 * @param dir the directory where the search starts
 * @returns the full path to the overlay directory, or ``undefined`` if the root
 *      of the filesystem is reached without finding one.
 */
async function findOverlayDirectory(dir: string): Promise<string | undefined> {
  const candidate = path.join(dir, overlayName);
  if (await fs.pathExists(candidate)) {
    return path.normalize(candidate);
  }
  const parent = path.normalize(path.resolve(path.join(dir, '..')));
  if (parent !== dir) {
    return await findOverlayDirectory(parent);
  }
  return undefined;
}
