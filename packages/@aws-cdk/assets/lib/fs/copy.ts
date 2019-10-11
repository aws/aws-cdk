import fs = require('fs');
import path = require('path');
import { CopyOptions } from './copy-options';
import { FollowMode } from './follow-mode';
import { shouldExclude, shouldFollow } from './utils';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow !== undefined ? options.follow : FollowMode.EXTERNAL;
  let exclude = [...(options.exclude || [])];

  rootDir = rootDir || srcDir;

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new Error(`${srcDir} is not a directory`);
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const sourceFilePath = path.join(srcDir, file);
    const destFilePath = path.join(destDir, file);
    const filePath = path.relative(rootDir, sourceFilePath);

    let stat: fs.Stats | undefined = follow === FollowMode.ALWAYS
      ? fs.statSync(sourceFilePath)
      : fs.lstatSync(sourceFilePath);

    // we've just discovered that we have a directory
    if (stat && stat.isDirectory()) {
      // to help future shouldExclude calls, we're changing the exlusion patterns
      // by expliciting "dir" exclusions to "dir/*" (same with "!dir" -> "!dir/*")
      exclude = exclude.reduce<string[]>((res, pattern) => {
        res.push(pattern);
        if (pattern.trim().replace(/^!/, '') === filePath) {
          // we add the pattern immediately after to preserve the exclusion order
          res.push(`${pattern}/*`);
        }

        return res;
      }, []);
    }

    const isExcluded = shouldExclude(exclude, filePath);
    if (isExcluded) {
      if (!stat || !stat.isDirectory()) {
        continue;
      }
    }

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
      copyDirectory(sourceFilePath, destFilePath, { ...options, exclude }, rootDir);

      // FIXME kind of ugly
      if (isExcluded && !fs.readdirSync(destFilePath).length) {
        fs.rmdirSync(destFilePath);
      }

      stat = undefined;
    }

    if (stat && stat.isFile()) {
      fs.copyFileSync(sourceFilePath, destFilePath);
      stat = undefined;
    }
  }
}
