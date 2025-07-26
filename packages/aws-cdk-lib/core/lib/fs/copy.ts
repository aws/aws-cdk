import * as fs from 'fs';
import * as path from 'path';
import { IgnoreStrategy } from './ignore';
import { CopyOptions, SymlinkFollowMode } from './options';
import { shouldFollow } from './utils';
import { UnscopedValidationError } from '../errors';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow ?? SymlinkFollowMode.EXTERNAL;

  rootDir = rootDir || srcDir;

  const ignoreStrategy = IgnoreStrategy.fromCopyOptions(options, rootDir);

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new UnscopedValidationError(`${srcDir} is not a directory`);
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const sourceFilePath = path.join(srcDir, file);

    if (ignoreStrategy.completelyIgnores(sourceFilePath)) {
      continue;
    }

    const destFilePath = path.join(destDir, file);

    let stat: fs.Stats | undefined = follow === SymlinkFollowMode.ALWAYS
      ? fs.statSync(sourceFilePath)
      : fs.lstatSync(sourceFilePath);

    if (stat && stat.isSymbolicLink()) {
      const target = fs.readlinkSync(sourceFilePath);

      // determine if this is an external link (i.e. the target's absolute path
      // is outside of the root directory).
      const targetPath = path.normalize(path.resolve(srcDir, target));

      if (shouldFollow(follow, rootDir, targetPath)) {
        stat = fs.statSync(sourceFilePath);
      } else {
        if (!ignoreStrategy.ignores(sourceFilePath)) {
          fs.mkdirSync(destDir, { recursive: true });
          fs.symlinkSync(target, destFilePath);
        }
        stat = undefined;
      }
    }

    if (stat && stat.isDirectory()) {
      if (!ignoreStrategy.ignores(sourceFilePath)) fs.mkdirSync(destFilePath, { recursive: true });
      copyDirectory(sourceFilePath, destFilePath, options, rootDir);
      stat = undefined;
    }

    if (stat && stat.isFile()) {
      if (!ignoreStrategy.ignores(sourceFilePath)) {
        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(sourceFilePath, destFilePath);
      }
      stat = undefined;
    }
  }
}
