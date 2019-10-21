import fs = require('fs');
import path = require('path');
import { CopyOptions } from './copy-options';
import { FollowMode } from './follow-mode';
import { mkdirpSync } from './mkdirpSync';
import { listFilesRecursively, shouldFollow } from './utils';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow !== undefined ? options.follow : FollowMode.EXTERNAL;

  rootDir = rootDir || srcDir;

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new Error(`${srcDir} is not a directory`);
  }

  for (const sourceFilePath of listFilesRecursively(srcDir, {...options, follow}, rootDir)) {
    const filePath = path.relative(rootDir, sourceFilePath);
    const destFilePath = path.join(destDir, filePath);

    if (follow !== FollowMode.ALWAYS) {
      const stat = fs.lstatSync(sourceFilePath);

      if (stat && stat.isSymbolicLink()) {
        const target = fs.readlinkSync(sourceFilePath);
        const targetPath = path.normalize(path.resolve(srcDir, target));
        if (!shouldFollow(follow, rootDir, targetPath)) {
          fs.symlinkSync(target, destFilePath);

          continue;
        }
      }
    }

    {
      const destFileDir = path.dirname(destFilePath);

      if (!fs.existsSync(destFileDir)) {
        mkdirpSync(destFileDir);
      }
    }

    fs.copyFileSync(sourceFilePath, destFilePath);
  }
}
