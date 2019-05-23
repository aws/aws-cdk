import { FollowMode } from './follow-mode';

export interface CopyOptions {
  /**
   * @default External only follows symlinks that are external to the source directory
   */
  readonly follow?: FollowMode;

  /**
   * glob patterns to exclude from the copy.
   */
  readonly exclude?: string[];
}
