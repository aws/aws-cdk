import { FollowMode } from './fs/follow-mode';
import { SymlinkFollowMode, UnscopedValidationError } from '../../core';

export function toSymlinkFollow(follow?: FollowMode): SymlinkFollowMode | undefined {
  if (!follow) {
    return undefined;
  }

  switch (follow) {
    case FollowMode.NEVER: return SymlinkFollowMode.NEVER;
    case FollowMode.ALWAYS: return SymlinkFollowMode.ALWAYS;
    case FollowMode.BLOCK_EXTERNAL: return SymlinkFollowMode.BLOCK_EXTERNAL;
    case FollowMode.EXTERNAL: return SymlinkFollowMode.EXTERNAL;
    default:
      throw new UnscopedValidationError(`unknown follow mode: ${follow}`);
  }
}
