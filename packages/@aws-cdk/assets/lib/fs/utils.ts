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
 * @param filePath file path to be assessed against the pattern
 *
 * @returns `true` if the file should be excluded
 *
 * @deprecated see {@link ExcludeRules.excludeFile}
 */
export function shouldExclude(exclude: string[], filePath: string): boolean {
  const [_shouldExclude] = ExcludeRules.evaluateFile(exclude, filePath);
  return _shouldExclude;
}

/**
 * Set of exclusion evaluation methods
 */
export class ExcludeRules {
  /**
   * Determines whether a given file should be excluded or not based on given
   * exclusion glob patterns.
   *
   * @param patterns  exclusion patterns
   * @param filePath file path to be assessed against the pattern
   *
   * @returns `true` if the file should be excluded, followed by the index of the rule applied
   */
  public static evaluateFile(patterns: string[], filePath: string): [boolean, number] {
    let _shouldExclude = false;
    let exclusionIndex = -1;

    patterns.map((pattern, patternIndex) => {
      if (minimatch(filePath, pattern, { matchBase: true, flipNegate: true })) {
        [_shouldExclude, exclusionIndex] = [!pattern.startsWith('!'), patternIndex];
      }
    });

    return [_shouldExclude, exclusionIndex];
  }

  private static getComponents = (value: string): string[] =>  value.split(path.sep);

  private readonly patternComponents: string[][] = this.patterns.map(ExcludeRules.getComponents);
  public constructor(private readonly patterns: string[]) {
  }

  /**
   * Determines whether a given file should be excluded,taking into account deep file structures
   *
   * @param filePath file path to be assessed against the pattern
   */
  public excludeFile(relativePath: string): boolean {
    const [_shouldExclude] = ExcludeRules.getComponents(relativePath).reduce<[boolean, number, string]>(
      ([accExclude, accPriority, pathIterator], pathComponent) => {
        pathIterator = path.join(pathIterator, pathComponent);

        const [shouldExcludeIt, priorityIt] = ExcludeRules.evaluateFile(this.patterns, pathIterator);
        if (priorityIt > accPriority) {
          return [shouldExcludeIt, priorityIt, pathIterator];
        }

        return [accExclude, accPriority, pathIterator];
      }, [false, -1, '']);

    return _shouldExclude;
  }

  /**
   * Determines whether a given directory should be excluded and not explored further
   * This might be `true` even if the directory is explicitly excluded,
   * but one of its children might be inclunded
   *
   * @param directoryPath directory path to be assessed against the pattern
   */
  public excludeDirectory(directoryPath: string): boolean {
    const patternLength = this.patternComponents.map(({ length }) => length);
    const maxPatternLength = Math.max(...patternLength);

    const [_shouldExclude] = directoryPath.split(path.sep).reduce<[boolean | null, string]>(
      ([accExclude, pathIterator], pathComponent) => {
        pathIterator = path.join(pathIterator, pathComponent);

        for (let pattenItLength = 1; pattenItLength <= maxPatternLength; ++pattenItLength) {
          const excludeSliced = this.patternComponents.map((pattern) => pattern.slice(0, pattenItLength).join(path.sep));
          const [shouldExcludeIt, patternIndex] = ExcludeRules.evaluateFile(excludeSliced, pathIterator);
          if (patternIndex < 0) {
            continue;
          }

          if (shouldExcludeIt) {
            if (accExclude == null) {
              accExclude = true;
            }
            continue;
          }

          if (pattenItLength < patternLength[patternIndex]) {
            accExclude = shouldExcludeIt;
          } else if (!excludeSliced[patternIndex].includes('**')) {
            accExclude = true;
          }
        }

        return [accExclude, pathIterator];
      }, [null, '']);

    return _shouldExclude || false;
  }

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
  relativePath: path.relative(rootDir, fullFilePath) || path.relative(path.dirname(rootDir), fullFilePath),
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

export function listFilesRecursively(
  dirOrFile: string,
  options: CopyOptions & Required<Pick<CopyOptions, 'follow'>>, _rootDir?: string
): AssetFile[] {
  const files: AssetFile[] = [];
  const exclude = options.exclude || [];
  const rootDir = _rootDir || dirOrFile;
  const followStatsFn = options.follow === FollowMode.ALWAYS ? fs.statSync : fs.lstatSync;

  const excludeRules = new ExcludeRules(exclude);

  recurse(dirOrFile);

  function recurse(currentPath: string, _currentStat?: fs.Stats): void {
    const currentStat = _currentStat || fs.statSync(currentPath);
    if (!currentStat) {
      return;
    }

    for (const file of currentStat.isDirectory() ? fs.readdirSync(currentPath) : ['']) {
      const fullFilePath = path.join(currentPath, file);
      const relativeFilePath = path.relative(rootDir, fullFilePath);

      let stat: fs.Stats | undefined = followStatsFn(fullFilePath);
      if (!stat) {
        continue;
      }

      const isExcluded = excludeRules.excludeFile(relativeFilePath);
      if (!isExcluded) {
        let target = '';
        if (stat.isSymbolicLink()) {
          target = fs.readlinkSync(fullFilePath);

          // determine if this is an external link (i.e. the target's absolute path  is outside of the root directory).
          const targetPath = path.normalize(path.resolve(currentPath, target));
          if (shouldFollow(options.follow, rootDir, targetPath)) {
            stat = fs.statSync(fullFilePath);
            if (!stat) {
              continue;
            }
          }
        }

        if (stat.isFile()) {
          files.push(generateAssetFile(rootDir, fullFilePath, stat));
        } else if (stat.isSymbolicLink()) {
          files.push(generateAssetSymlinkFile(rootDir, fullFilePath, stat, target));
        }
      }

      if (stat.isDirectory() && (!isExcluded || !excludeRules.excludeDirectory(relativeFilePath))) {
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
