/**
 * Determines how symlinks are followed.
 */
export enum SymlinkFollowMode {
  /**
   * Never follow symlinks.
   */
  NEVER = 'never',

  /**
   * Materialize all symlinks, whether they are internal or external to the source directory.
   */
  ALWAYS = 'always',

  /**
   * Only follows symlinks that are external to the source directory.
   */
  EXTERNAL = 'external',

  /**
   * Forbids source from having any symlinks pointing outside of the source
   * tree.
   *
   * This is the safest mode of operation as it ensures that copy operations
   * won't materialize files from the user's file system. Internal symlinks are
   * not followed.
   *
   * If the copy operation runs into an external symlink, it will fail.
   */
  BLOCK_EXTERNAL = 'internal-only',
}

/**
 * Obtains applied when copying directories into the staging location.
 */
export interface CopyOptions {
  /**
   * A strategy for how to handle symlinks.
   *
   * @default SymlinkFollowMode.NEVER
   */
  readonly follow?: SymlinkFollowMode;

  /**
   * Glob patterns to exclude from the copy.
   *
   * @default - nothing is excluded
   */
  readonly exclude?: string[];
}

/**
 * Options related to calculating source hash.
 */
export interface FingerprintOptions extends CopyOptions {
  /**
   * Extra information to encode into the fingerprint (e.g. build instructions
   * and other inputs)
   *
   * @default - hash is only based on source content
   */
  readonly extraHash?: string;
}
