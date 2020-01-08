import * as fs from 'fs';
import * as path from 'path';
import { CopyOptions } from './options';
import { FollowMode } from './follow-mode';
import { shouldExclude, shouldFollow } from './utils';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow !== undefined ? options.follow : FollowMode.EXTERNAL;
  const exclude = options.exclude || [];

  rootDir = rootDir || srcDir;

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new Error(`${srcDir} is not a directory`);
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const sourceFilePath = path.join(srcDir, file);

    if (shouldExclude(exclude, path.relative(rootDir, sourceFilePath))) {
      continue;
    }

    const destFilePath = path.join(destDir, file);

    let stat: fs.Stats | undefined = follow === FollowMode.ALWAYS
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
}
