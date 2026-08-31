import * as fs from 'fs';
import * as path from 'path';
import { IgnoreStrategy } from './ignore';
import type { CopyOptions } from './options';
import { SymlinkFollowMode } from './options';
import { resolveLinkTarget, shouldFollow } from './utils';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow ?? SymlinkFollowMode.EXTERNAL;
  const root = rootDir || srcDir;
  const ignoreStrategy = IgnoreStrategy.fromCopyOptions(options, root);

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new UnscopedValidationError(lit`Directory`, `${srcDir} is not a directory`);
  }

  copyInto(srcDir, destDir);

  function copyInto(sourceDir: string, targetDir: string) {
    for (const file of fs.readdirSync(sourceDir)) {
      const sourceFilePath = path.join(sourceDir, file);

      if (ignoreStrategy.completelyIgnores(sourceFilePath)) {
        continue;
      }

      const destFilePath = path.join(targetDir, file);

      // ALWAYS resolves every entry up front, so symlinks never show up as links below.
      let stat: fs.Stats | undefined = follow === SymlinkFollowMode.ALWAYS
        ? fs.statSync(sourceFilePath)
        : fs.lstatSync(sourceFilePath);

      if (stat.isSymbolicLink()) {
        // Target's stats if we follow the link, undefined if we copied the link itself.
        stat = copyOrFollowSymlink(sourceFilePath, destFilePath);
      }

      if (!stat) {
        continue;
      }

      if (stat.isDirectory()) {
        if (!ignoreStrategy.ignores(sourceFilePath)) {
          fs.mkdirSync(destFilePath, { recursive: true });
        }
        copyInto(sourceFilePath, destFilePath);
      } else if (stat.isFile()) {
        if (!ignoreStrategy.ignores(sourceFilePath)) {
          fs.mkdirSync(targetDir, { recursive: true });
          fs.copyFileSync(sourceFilePath, destFilePath);
        }
      }
    }
  }

  /**
   * Returns the target's stats if the link should be followed, otherwise copies the link
   * itself and returns undefined.
   */
  function copyOrFollowSymlink(sourceFilePath: string, destFilePath: string): fs.Stats | undefined {
    const target = fs.readlinkSync(sourceFilePath);

    if (shouldFollow(follow, root, resolveLinkTarget(sourceFilePath, target))) {
      return fs.statSync(sourceFilePath);
    }

    if (!ignoreStrategy.ignores(sourceFilePath)) {
      fs.mkdirSync(path.dirname(destFilePath), { recursive: true });
      fs.symlinkSync(target, destFilePath);
    }
    return undefined;
  }
}
