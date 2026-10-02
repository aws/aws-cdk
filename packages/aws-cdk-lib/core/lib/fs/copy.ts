import * as fs from 'fs';
import * as path from 'path';
import { IgnoreStrategy } from './ignore';
import type { CopyOptions } from './options';
import { SymlinkFollowMode } from './options';
import type { WalkSymlinkEntry } from './utils';
import { isInternalPath, walkDirectory } from './utils';
import { UnscopedValidationError } from '../errors';
import { lit } from '../private/literal-string';

export function copyDirectory(srcDir: string, destDir: string, options: CopyOptions = { }, rootDir?: string) {
  const follow = options.follow ?? SymlinkFollowMode.EXTERNAL;

  const root = rootDir || srcDir;
  const ignoreStrategy = IgnoreStrategy.fromCopyOptions(options, root);

  if (!fs.statSync(srcDir).isDirectory()) {
    throw new UnscopedValidationError(lit`Directory`, `${srcDir} is not a directory`);
  }

  // Link targets compared against the real location of the tree we are copying
  const canonicalSrcDir = fs.realpathSync(srcDir);

  walkDirectory(srcDir, { follow, ignoreStrategy, root }, {
    onDirectory: (entry) => {
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
      fs.symlinkSync(linkTextFor(entry, destination), destination);
    },
  });

  function destinationOf(sourcePath: string): string {
    return path.join(destDir, path.relative(srcDir, sourcePath));
  }

  /**
   * A link pointing inside the tree is repointed at the copy of its target, so the copied tree
   * stands on its own once it is archived and unpacked elsewhere. A target outside the tree has
   * no copy to point at, so it keeps the text it had.
   */
  function linkTextFor(entry: WalkSymlinkEntry, destination: string): string {
    if (!isInternalPath(canonicalSrcDir, entry.resolvedLinkTarget)) {
      return entry.linkTarget;
    }

    const copiedTarget = path.join(destDir, path.relative(canonicalSrcDir, entry.resolvedLinkTarget));

    // Empty when the link points at the root of the tree, which `.` expresses as a link.
    return path.relative(path.dirname(destination), copiedTarget) || '.';
  }
}
