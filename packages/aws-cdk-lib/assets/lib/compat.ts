import { FollowMode } from './fs/follow-mode';
import { SymlinkFollowMode, UnscopedValidationError } from '../../core';
import { lit } from '../../core/lib/private/literal-string';

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
      throw new UnscopedValidationError(lit`UnknownFollowMode`, `unknown follow mode: ${follow}`);
  }
}
