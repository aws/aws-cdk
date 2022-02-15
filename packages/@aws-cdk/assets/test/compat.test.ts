import { SymlinkFollowMode } from '@aws-cdk/core';
import { FollowMode } from '../lib';
import { toSymlinkFollow } from '../lib/compat';

test('FollowMode compatibility', () => {
  expect(toSymlinkFollow(undefined)).toEqual(undefined);
  expect(toSymlinkFollow(FollowMode.ALWAYS)).toEqual(SymlinkFollowMode.ALWAYS);
  expect(toSymlinkFollow(FollowMode.BLOCK_EXTERNAL)).toEqual(SymlinkFollowMode.BLOCK_EXTERNAL);
  expect(toSymlinkFollow(FollowMode.EXTERNAL)).toEqual(SymlinkFollowMode.EXTERNAL);
  expect(toSymlinkFollow(FollowMode.NEVER)).toEqual(SymlinkFollowMode.NEVER);
});
