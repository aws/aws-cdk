import * as fs from 'fs';
import * as path from 'path';
import { IgnoreStrategy } from './ignore';
import { matchIncludePatterns } from './include';
import { CopyOptions, SymlinkFollowMode } from './options';
import { shouldFollow } from './utils';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow ?? SymlinkFollowMode.EXTERNAL;

  rootDir = rootDir || srcDir;

  const ignoreStrategy = IgnoreStrategy.fromCopyOptions(options, rootDir);

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new Error(`${srcDir} is not a directory`);
  }

  const files = fs.readdirSync(srcDir);
  for (const file of files) {
    const sourceFilePath = path.join(srcDir, file);

    if (ignoreStrategy.ignores(sourceFilePath)) {
      continue;
    }

    const destFilePath = path.join(destDir, file);

    let stat: fs.Stats | undefined = follow === SymlinkFollowMode.ALWAYS
      ? fs.statSync(sourceFilePath)
      : fs.lstatSync(sourceFilePath);

    const included = !options.include || matchIncludePatterns(options.include, rootDir, sourceFilePath);

    if (stat && (stat.isSymbolicLink() || stat.isFile())) {
      if (!included) {
        continue;
      }
      const destDirPath = path.dirname(destFilePath);
      if (!fs.existsSync(destDirPath)) {
        fs.mkdirSync(destDirPath, { recursive: true });
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
      if (included) {
        fs.mkdirSync(destFilePath, { recursive: true });
      }
      copyDirectory(sourceFilePath, destFilePath, options, rootDir);
      stat = undefined;
    }

    if (stat && stat.isFile()) {
      fs.copyFileSync(sourceFilePath, destFilePath);
      stat = undefined;
    }
  }
}
