import { SymlinkFollowMode } from './options';
/**
 * Determines whether a symlink should be followed or not, based on a FollowMode.
 *
 * @param mode       the FollowMode.
 * @param sourceRoot the root of the source tree.
 * @param realPath   the real path of the target of the symlink.
 *
 * @returns true if the link should be followed.
 */
export declare function shouldFollow(mode: SymlinkFollowMode, sourceRoot: string, realPath: string): boolean;
