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
  const [_shouldExclude] = shouldExcludePriority(exclude, filePath);
  return _shouldExclude;
}

/**
 * Determines whether a given file should be excluded or not based on given
 * exclusion glob patterns.
 *
 * @param exclude  exclusion patterns
 * @param filePath file apth to be assessed against the pattern
 *
 * @returns `true` if the file should be excluded, followed by the index of the rule applied
 */
export function shouldExcludePriority(exclude: string[], filePath: string): [boolean, number] {
  return exclude.reduce<[boolean, number]>((res, pattern, patternIndex) => {
    const negate = pattern.startsWith('!');
    const match = minimatch(filePath, pattern, { matchBase: true, flipNegate: true });

    if (!negate && match) {
      res = [true, patternIndex];
    }

    if (negate && match) {
      res = [false, patternIndex];
    }

    return res;
  }, [false, -1]);
}

export function shouldExcludeDeep(exclude: string[], relativePath: string): boolean {
  const [_shouldExclude] = relativePath.split(path.sep).reduce<[boolean, number, string]>(
    ([accExclude, accPriority, pathIterator], pathComponent) => {
      pathIterator = path.join(pathIterator, pathComponent);

      const [shouldExcludeIt, priorityIt] = shouldExcludePriority(exclude, pathIterator);
      if (priorityIt > accPriority) {
        return [shouldExcludeIt, priorityIt, pathIterator];
      }

      return [accExclude, accPriority, pathIterator];
    }, [false, -1, '']);

  return _shouldExclude;
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

type AssetFile = {
  absolutePath: string;
  relativePath: string;
  isFile: boolean;
  isDirectory: boolean;
  size: number;
} & ({ isSymbolicLink: false } | { isSymbolicLink: true; symlinkTarget: string });

const generateAssetFile = (rootDir: string, fullFilePath: string, stat: fs.Stats): AssetFile => ({
  absolutePath: fullFilePath,
  relativePath: path.relative(rootDir, fullFilePath),
  isFile: stat.isFile(),
  isDirectory: stat.isDirectory(),
  size: stat.size,
  isSymbolicLink: false,
});

const generateAssetSymlinkFile = (rootDir: string, fullFilePath: string, stat: fs.Stats, symlinkTarget: string): AssetFile => ({
  ...generateAssetFile(rootDir, fullFilePath, stat),
  isSymbolicLink: true,
  symlinkTarget,
});

export function listFilesRecursively(dir: string, options: CopyOptions & Required<Pick<CopyOptions, 'follow'>>, _rootDir?: string): AssetFile[] {
  const files: AssetFile[] = [];
  let exclude = options.exclude || [];
  const rootDir = _rootDir || dir;
  const followStatsFn = options.follow === FollowMode.ALWAYS ? fs.statSync : fs.lstatSync;

  recurse(dir);

  function recurse(currentPath: string, currentStat?: fs.Stats): void {
    {
      const stat = currentStat || fs.statSync(currentPath);
      if (!stat) {
        return;
      }

      if (!stat.isDirectory()) {
        files.push(generateAssetFile(rootDir, currentPath, stat));
        return;
      }
    }

    for (const file of fs.readdirSync(currentPath)) {
      const fullFilePath = path.join(currentPath, file);

      let stat: fs.Stats | undefined = followStatsFn(fullFilePath);
      if (!stat) {
        continue;
      }

      let target = '';
      if (stat.isSymbolicLink()) {
        target = fs.readlinkSync(fullFilePath);

        // determine if this is an external link (i.e. the target's absolute path
        // is outside of the root directory).
        const targetPath = path.normalize(path.resolve(currentPath, target));

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

      if (stat.isFile()) {
        files.push(generateAssetFile(rootDir, fullFilePath, stat));
      } else if (stat.isSymbolicLink()) {
        files.push(generateAssetSymlinkFile(rootDir, fullFilePath, stat, target));
      } else if (stat.isDirectory()) {
        const previousLength = files.length;
        recurse(fullFilePath, stat);

        if (files.length === previousLength && !isExcluded) {
          // helps "copy" create an empty directory
          files.push(generateAssetFile(rootDir, fullFilePath, stat));
        }
      }
    }
  }

  return files;
}
