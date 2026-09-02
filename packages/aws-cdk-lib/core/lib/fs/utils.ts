import * as fs from 'fs';
import * as path from 'path';
import type { IgnoreStrategy } from './ignore';
import { SymlinkFollowMode } from './options';

export function isInternalPath(rootPath: string, targetPath: string): boolean {
  return rootPath === targetPath || targetPath.startsWith(rootPath + path.sep);
}

export function resolveLinkTarget(realPath: string, linkTarget: string): string {
  return path.isAbsolute(linkTarget)
    ? path.resolve(linkTarget)
    : path.resolve(path.dirname(realPath), linkTarget);
}

/**
 * An entry encountered while walking a directory tree
 */
export interface WalkEntry {
  /**
   * Where the entry sits in the tree
   *
   * If a symlink was followed to get here, this path goes through the symlink rather
   * than through the target it points at.
   */
  readonly path: string;

  /**
   * The path to read this entry's content from
   *
   * Same as `path`, unless a symlink was followed, in which case it is the link's target.
   */
  readonly realPath: string;
}

/**
 * A directory whose contents are about to be walked
 */
export interface WalkDirectoryEntry extends WalkEntry {
  /**
   * Whether the directory itself is excluded by the ignore strategy
   *
   * The walk still descends into it, because a pattern that excludes a directory can
   * re-include files underneath it. A directory that is excluded along with everything
   * inside it is skipped and never reported at all.
   */
  readonly ignored: boolean;
}

/**
 * A file, or a symlink that was followed to one
 */
export interface WalkFileEntry extends WalkEntry {
  /**
   * Stats of a followed symlink's target
   *
   * Only set when the walk already had to stat the target, so callers that need stats can
   * use these instead of calling `stat` again.
   */
  readonly stats?: fs.BigIntStats;
}

/**
 * A symlink that is being kept as a link rather than followed
 */
export interface WalkSymlinkEntry extends WalkEntry {
  /**
   * The link target exactly as written, which is what gets copied or hashed
   */
  readonly linkTarget: string;

  /**
   * `linkTarget` resolved against the link's own directory
   */
  readonly resolvedLinkTarget: string;

  /**
   * Whether the target is inside the walk root
   */
  readonly internal: boolean;
}

/**
 * Receives the entries that a walk includes in its result
 *
 * Every callback is optional, so a visitor only implements the entry kinds it cares
 * about. Entries excluded by the ignore strategy are never reported.
 */
export interface WalkVisitor {
  /**
   * A file, or a symlink that was followed to a file
   */
  onFile?(entry: WalkFileEntry): void;

  /**
   * A directory, or a symlink that was followed to a directory
   */
  onDirectory?(entry: WalkDirectoryEntry): void;

  /**
   * A symlink that is not being followed
   */
  onSymlink?(entry: WalkSymlinkEntry): void;

  /**
   * A followed symlink whose target is neither a file nor a directory
   *
   * For example a socket, a named pipe or a device node.
   */
  onUnsupported?(entry: WalkEntry): void;
}

/**
 * Options for `walkDirectory`
 */
export interface WalkOptions {
  /**
   * What to do with the symlinks encountered along the way
   */
  readonly follow: SymlinkFollowMode;

  /**
   * Which entries to leave out of the walk
   */
  readonly ignoreStrategy: IgnoreStrategy;

  /**
   * The tree a symlink has to point inside of to count as internal
   *
   * @default - the directory being walked
   */
  readonly root?: string;
}

/**
 * Walk a directory tree, reporting the entries that belong in its result
 *
 * Fingerprinting, copying and symlink validation all share this traversal, so all three
 * agree on what an asset contains: how the ignore strategy is applied, which symlinks are
 * followed, and how a link target is resolved. Those decisions are made here; callers only
 * decide what to do with an entry.
 *
 * Entries are visited in sorted order, so a caller that hashes the entries it is given
 * gets the same hash every time.
 */
export function walkDirectory(directory: string, options: WalkOptions, visitor: WalkVisitor) {
  const { follow, ignoreStrategy } = options;

  // Resolve symlinks in the root itself so that inside/outside comparisons are made against
  // the real location. `path.resolve` cleans up `..` but does not resolve symlinks, so
  // without this a symlinked directory *above* the root makes paths inside the tree look
  // like they are outside it.
  const canonicalRoot = realPathOrSelf(options.root ?? directory);

  // Real paths of the directories we are currently inside. Used to stop a symlink that
  // points back at one of its own parent directories from recursing forever.
  const ancestors = new Set<string>();

  walk(directory, directory, realPathOrSelf(directory));

  /**
   * @param symbolicPath where this directory sits in the tree
   * @param realPath the path to read it from
   * @param canonicalPath `realPath` with symlinks resolved, used to detect cycles
   */
  function walk(symbolicPath: string, realPath: string, canonicalPath: string) {
    // We are already inside this directory, so going in again would never finish. Two
    // separate links to the same directory are not inside each other, so both of those are
    // still walked in full.
    if (ancestors.has(canonicalPath)) {
      return;
    }
    ancestors.add(canonicalPath);

    const entries = fs.readdirSync(realPath, { withFileTypes: true });
    entries.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);

    for (const entry of entries) {
      const childPath = path.join(symbolicPath, entry.name);
      const childRealPath = path.join(realPath, entry.name);

      if (entry.isSymbolicLink()) {
        visitSymlink(childPath, childRealPath);
      } else if (entry.isDirectory()) {
        visitDirectory(childPath, childRealPath, path.join(canonicalPath, entry.name));
      } else if (entry.isFile()) {
        visitFile({ path: childPath, realPath: childRealPath });
      }
    }

    ancestors.delete(canonicalPath);
  }

  function visitDirectory(symbolicPath: string, realPath: string, canonicalPath: string) {
    if (ignoreStrategy.completelyIgnores(symbolicPath)) {
      return;
    }

    // Ignored directories are still reported, so the visitor can decide what to do with
    // them, and are still walked into because files below them may be re-included.
    if (visitor.onDirectory) {
      visitor.onDirectory({ path: symbolicPath, realPath, ignored: ignoreStrategy.ignores(symbolicPath) });
    }

    walk(symbolicPath, realPath, canonicalPath);
  }

  function visitFile(entry: WalkFileEntry) {
    if (!ignoreStrategy.ignores(entry.path)) {
      visitor.onFile?.(entry);
    }
  }

  function visitSymlink(symbolicPath: string, realPath: string) {
    const linkTarget = fs.readlinkSync(realPath);
    const resolvedLinkTarget = canonicalLinkTarget(resolveLinkTarget(realPath, linkTarget));
    const internal = isInternalPath(canonicalRoot, resolvedLinkTarget);

    // If the target cannot be reached we treat the link as one we are not following, so a
    // broken link is reported as a link instead of failing the walk.
    const targetStats = shouldFollow(internal) ? tryStat(resolvedLinkTarget) : undefined;

    if (!targetStats) {
      if (!ignoreStrategy.ignores(symbolicPath)) {
        visitor.onSymlink?.({ path: symbolicPath, realPath, linkTarget, resolvedLinkTarget, internal });
      }
      return;
    }

    // We are following the link, so the entry is reported at the link's own path but read
    // from the target.
    if (targetStats.isDirectory()) {
      visitDirectory(symbolicPath, resolvedLinkTarget, realPathOrSelf(resolvedLinkTarget));
    } else if (targetStats.isFile()) {
      visitFile({ path: symbolicPath, realPath: resolvedLinkTarget, stats: targetStats });
    } else if (!ignoreStrategy.ignores(symbolicPath)) {
      visitor.onUnsupported?.({ path: symbolicPath, realPath: resolvedLinkTarget });
    }
  }

  /**
   * Whether to follow a link, which every mode decides based only on where the target is
   */
  function shouldFollow(internal: boolean): boolean {
    switch (follow) {
      case SymlinkFollowMode.ALWAYS:
        return true;
      case SymlinkFollowMode.EXTERNAL:
        return !internal;
      case SymlinkFollowMode.BLOCK_EXTERNAL:
        return internal;
      case SymlinkFollowMode.NEVER:
      default:
        return false;
    }
  }
}

/**
 * Resolves symlinks in the directories that lead up to a link target, but not in the target
 * itself
 *
 * If the target is itself a symlink we want to know where it is, not where it points, since
 * that is the location we compare against the walk root.
 */
function canonicalLinkTarget(target: string): string {
  return path.join(realPathOrSelf(path.dirname(target)), path.basename(target));
}

/**
 * Resolves the symlinks in a path, returning it unchanged if that is not possible
 */
function realPathOrSelf(target: string): string {
  try {
    return fs.realpathSync(target);
  } catch {
    return target;
  }
}

/**
 * Stats a path, or returns undefined if it cannot be reached
 */
function tryStat(target: string): fs.BigIntStats | undefined {
  try {
    return fs.statSync(target, { bigint: true });
  } catch {
    return undefined;
  }
}
