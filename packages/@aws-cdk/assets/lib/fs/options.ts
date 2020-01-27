import { FollowMode } from './follow-mode';

/**
 * Obtains applied when copying directories into the staging location.
 */
export interface CopyOptions {
  /**
   * A strategy for how to handle symlinks.
   *
   * @default Never
   */
  readonly follow?: FollowMode;

  /**
   * Glob patterns to exclude from the copy.
   *
   * @default nothing is excluded
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
