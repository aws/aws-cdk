import { SymlinkFollowMode } from '@aws-cdk/core';
import { FollowMode } from './fs/follow-mode';
export declare function toSymlinkFollow(follow?: FollowMode): SymlinkFollowMode | undefined;
