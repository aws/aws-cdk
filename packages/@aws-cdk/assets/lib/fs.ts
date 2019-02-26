import crypto = require('crypto');
import fs = require('fs');
import minimatch = require('minimatch');
import path = require('path');

const BUFFER_SIZE = 8 * 1024;

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

export enum FollowMode {
  /**
   * Never follow symlinks.
   */
  Never = 'never',

  /**
   * Materialize all symlinks, whether they are internal or external to the source directory.
   */
  Always = 'always',

  /**
   * Only follows symlinks that are external to the source directory.
   */
  External = 'external',

  // ----------------- TODO::::::::::::::::::::::::::::::::::::::::::::
  /**
   * Forbids source from having any symlinks pointing outside of the source
   * tree.
   *
   * This is the safest mode of operation as it ensures that copy operations
   * won't materialize files from the user's file system. Internal symlinks are
   * not followed.
   *
   * If the copy operation runs into an external symlink, it will fail.
   */
  BlockExternal = 'internal-only',
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

export function fingerprint(fileOrDirectory: string) {
  const hash = crypto.createHash('md5');
  addToHash(fileOrDirectory);
  return hash.digest('hex');

  function addToHash(pathToAdd: string) {
    hash.update('==\n');
    const relativePath = path.relative(fileOrDirectory, pathToAdd);
    hash.update(relativePath + '\n');
    hash.update('~~~~~~~~~~~~~~~~~~\n');
    const stat = fs.statSync(pathToAdd);

    if (stat.isSymbolicLink()) {
      const target = fs.readlinkSync(pathToAdd);
      hash.update(target);
    } else if (stat.isDirectory()) {
      for (const file of fs.readdirSync(pathToAdd)) {
        addToHash(path.join(pathToAdd, file));
      }
    } else {
      const file = fs.openSync(pathToAdd, 'r');
      const buffer = Buffer.alloc(BUFFER_SIZE);

      try {
        let bytesRead;
        do {
          bytesRead = fs.readSync(file, buffer, 0, BUFFER_SIZE, null);
          hash.update(buffer.slice(0, bytesRead));
        } while (bytesRead === BUFFER_SIZE);
      } finally {
        fs.closeSync(file);
      }
    }
  }
}