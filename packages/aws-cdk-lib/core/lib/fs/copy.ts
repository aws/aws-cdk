import * as fs from 'fs';
import * as path from 'path';
import { IgnoreStrategy } from './ignore';
import type { CopyOptions } from './options';
import { SymlinkFollowMode } from './options';
import { walkDirectory } from './utils';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow ?? SymlinkFollowMode.EXTERNAL;
  const root = rootDir || srcDir;
  const ignoreStrategy = IgnoreStrategy.fromCopyOptions(options, root);

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new UnscopedValidationError(lit`Directory`, `${srcDir} is not a directory`);
  }

  walkDirectory(srcDir, { follow, ignoreStrategy, root }, {
    onDirectory: (entry) => {
      // An ignored directory is not created. If something below it is re-included, copying
      // that file creates the directory on the way.
      if (!entry.ignored) {
        fs.mkdirSync(destinationOf(entry.path), { recursive: true });
      }
    },

    onFile: (entry) => {
      const destination = destinationOf(entry.path);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(entry.realPath, destination);
    },

    onSymlink: (entry) => {
      if (follow === SymlinkFollowMode.BLOCK_EXTERNAL && !entry.internal) {
        throw new UnscopedValidationError(
          lit`BundlingFileSymlinkForbidden`,
          `The file ${entry.resolvedLinkTarget} is an external symbolic link which is forbidden due to follow mode ${follow}. Set \`follow\` to a mode that will follow symlinks (ALWAYS or EXTERNAL) or emit a regular file`,
        );
      }

      const destination = destinationOf(entry.path);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.symlinkSync(entry.linkTarget, destination);
    },
  });

  /**
   * The place under `destDir` an entry is copied to, mirroring where it sits under `srcDir`
   */
  function destinationOf(sourcePath: string): string {
    return path.join(destDir, path.relative(srcDir, sourcePath));
  }
}
