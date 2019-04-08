import fs = require('fs');
import minimatch = require('minimatch');
import path = require('path');
import { FollowMode } from './follow-mode';

export interface CopyOptions {
  /**
   * @default External only follows symlinks that are external to the source directory
   */
  follow?: FollowMode;

  /**
   * glob patterns to exclude from the copy.
   */
  exclude?: string[];
}

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow !== undefined ? options.follow : FollowMode.External;
  const exclude = options.exclude || [];

  rootDir = rootDir || srcDir;

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new Error(`${srcDir} is not a directory`);
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const sourceFilePath = path.join(srcDir, file);

    if (shouldExclude(path.relative(rootDir, sourceFilePath))) {
      continue;
    }

    const destFilePath = path.join(destDir, file);

    let stat: fs.Stats | undefined = follow === FollowMode.Always
      ? fs.statSync(sourceFilePath)
      : fs.lstatSync(sourceFilePath);

    if (stat && stat.isSymbolicLink()) {
      const target = fs.readlinkSync(sourceFilePath);

      // determine if this is an external link (i.e. the target's absolute path
      // is outside of the root directory).
      const targetPath = path.normalize(path.resolve(srcDir, target));
      const rootPath = path.normalize(rootDir);
      const external = !targetPath.startsWith(rootPath);

      if (follow === FollowMode.External && external) {
        stat = fs.statSync(sourceFilePath);
      } else {
        fs.symlinkSync(target, destFilePath);
        stat = undefined;
      }
    }

    if (stat && stat.isDirectory()) {
      fs.mkdirSync(destFilePath);
      copyDirectory(sourceFilePath, destFilePath, options, rootDir);
      stat = undefined;
    }

    if (stat && stat.isFile()) {
      fs.copyFileSync(sourceFilePath, destFilePath);
      stat = undefined;
    }
  }

  function shouldExclude(filePath: string): boolean {
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
}