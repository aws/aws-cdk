import fs = require('fs');
import minimatch = require('minimatch');
import path = require('path');
import { CopyOptions } from './copy-options';
import { FollowMode } from './follow-mode';

/**
 * Determines whether a given file should be excluded or not based on given
 * exclusion glob patterns.
 *
 * @param exclude  exclusion patterns
 * @param filePath file apth to be assessed against the pattern
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
export function shouldFollow(mode: FollowMode, sourceRoot: string, realPath: string): boolean {
  switch (mode) {
    case FollowMode.ALWAYS:
      return fs.existsSync(realPath);
    case FollowMode.EXTERNAL:
      return !_isInternal() && fs.existsSync(realPath);
    case FollowMode.BLOCK_EXTERNAL:
      return _isInternal() && fs.existsSync(realPath);
    case FollowMode.NEVER:
      return false;
    default:
      throw new Error(`Unsupported FollowMode: ${mode}`);
  }

  function _isInternal(): boolean {
    return path.resolve(realPath).startsWith(path.resolve(sourceRoot));
  }
}

export function listFilesRecursively(dir: string, options: CopyOptions & Required<Pick<CopyOptions, 'follow'>>, rootDir?: string): string[] {
  const files = [];

  let exclude = [...(options.exclude || [])];
  rootDir = rootDir || dir;
  {
    const stat = fs.statSync(dir);
    if (!stat) {
      return [];
    }

    if (!stat.isDirectory()) {
      return [dir];
    }
  }

  for (const file of fs.readdirSync(dir)) {
    let fullFilePath = path.join(dir, file);

    let stat: fs.Stats | undefined = options.follow === FollowMode.ALWAYS
      ? fs.statSync(fullFilePath)
      : fs.lstatSync(fullFilePath);

    if (!stat) {
      continue;
    }

    if (stat.isSymbolicLink()) {
      const target = fs.readlinkSync(fullFilePath);

      // determine if this is an external link (i.e. the target's absolute path
      // is outside of the root directory).
      const targetPath = path.normalize(path.resolve(dir, target));

      if (shouldFollow(options.follow, rootDir, targetPath)) {
        stat = fs.statSync(fullFilePath);
        if (!stat) {
          continue;
        }
      }
    }

    const relativeFilePath = path.relative(rootDir, fullFilePath);

    // we've just discovered that we have a directory
    if (stat.isDirectory()) {
      // to help future shouldExclude calls, we're changing the exlusion patterns
      // by expliciting "dir" exclusions to "dir/*" (same with "!dir" -> "!dir/*")
      exclude = exclude.reduce<string[]>((res, pattern) => {
        res.push(pattern);
        if (pattern.trim().replace(/^!/, '') === relativeFilePath) {
          // we add the pattern immediately after to preserve the exclusion order
          res.push(`${pattern}/*`);
        }

        return res;
      }, []);
    }

    const isExcluded = shouldExclude(exclude, relativeFilePath);
    if (isExcluded && !stat.isDirectory()) {
      continue;
    }

    if (stat.isFile() || stat.isSymbolicLink()) {
      files.push(fullFilePath);
    } else if (stat.isDirectory()) {
      files.push(...listFilesRecursively(fullFilePath, { ...options, exclude }, rootDir));
    }
  }

  return files;
}