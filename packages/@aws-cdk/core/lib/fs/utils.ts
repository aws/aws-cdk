import * as fs from 'fs';
import * as path from 'path';
import * as minimatch from 'minimatch';
import { SymlinkFollowMode } from './options';

/**
 * Determines whether a given file should be excluded or not based on given
 * exclusion glob patterns.
 *
 * @param exclude  exclusion patterns
 * @param filePath file path to be assessed against the pattern
 *
 * @returns `true` if the file should be excluded
 */
export function shouldExclude(exclude: string[], filePath: string): boolean {
  let excludeOutput = false;

  for (const pattern of exclude) {
    const negate = pattern.startsWith('!');
    const match = minimatch(filePath, pattern, { matchBase: true, flipNegate: true });

    if (!negate && match) {
      excludeOutput = true;
    }

    if (negate && match) {
      excludeOutput = false;
    }
  }

  return excludeOutput;
}

/**
 * Determines whether a symlink should be followed or not, based on a FollowMode.
 *
 * @param mode       the FollowMode.
 * @param sourceRoot the root of the source tree.
 * @param realPath   the real path of the target of the symlink.
 *
 * @returns true if the link should be followed.
 */
export function shouldFollow(mode: SymlinkFollowMode, sourceRoot: string, realPath: string): boolean {
  switch (mode) {
    case SymlinkFollowMode.ALWAYS:
      return fs.existsSync(realPath);
    case SymlinkFollowMode.EXTERNAL:
      return !_isInternal() && fs.existsSync(realPath);
    case SymlinkFollowMode.BLOCK_EXTERNAL:
      return _isInternal() && fs.existsSync(realPath);
    case SymlinkFollowMode.NEVER:
      return false;
    default:
      throw new Error(`Unsupported FollowMode: ${mode}`);
  }

  function _isInternal(): boolean {
    return path.resolve(realPath).startsWith(path.resolve(sourceRoot));
  }
}
