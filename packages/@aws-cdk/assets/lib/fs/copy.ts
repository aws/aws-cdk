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

  for (const assetFile of listFilesRecursively(srcDir, {...options, follow}, rootDir)) {
    const filePath = assetFile.relativePath;
    const destFilePath = path.join(destDir, filePath);

    if (follow !== FollowMode.ALWAYS) {
      if (assetFile.isSymbolicLink) {
        const targetPath = path.normalize(path.resolve(srcDir, assetFile.symlinkTarget));
        if (!shouldFollow(follow, rootDir, targetPath)) {
          fs.symlinkSync(assetFile.symlinkTarget, destFilePath);

          continue;
        }
      }
    }

    if (!assetFile.isDirectory) {
      mkdirpSync(path.dirname(destFilePath));
      fs.copyFileSync(assetFile.absolutePath, destFilePath);
    } else {
      mkdirpSync(destFilePath);
    }
  }
}
