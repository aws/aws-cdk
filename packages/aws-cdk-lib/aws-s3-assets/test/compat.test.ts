import { FollowMode } from '../../assets';
import { SymlinkFollowMode } from '../../core';
import { toSymlinkFollow } from '../lib/compat';

test('FollowMode compatibility', () => {
  expect(toSymlinkFollow(undefined)).toBeUndefined();
  expect(toSymlinkFollow(FollowMode.ALWAYS)).toBe(SymlinkFollowMode.ALWAYS);
  expect(toSymlinkFollow(FollowMode.BLOCK_EXTERNAL)).toBe(SymlinkFollowMode.BLOCK_EXTERNAL);
  expect(toSymlinkFollow(FollowMode.EXTERNAL)).toBe(SymlinkFollowMode.EXTERNAL);
  expect(toSymlinkFollow(FollowMode.NEVER)).toBe(SymlinkFollowMode.NEVER);
});
