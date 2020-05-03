import { SymlinkFollowMode } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { FollowMode } from '../lib';
import { toSymlinkFollow } from '../lib/compat';

export = {
  'FollowMode compatibility'(test: Test) {
    test.equal(toSymlinkFollow(undefined), null);
    test.equal(toSymlinkFollow(FollowMode.ALWAYS), SymlinkFollowMode.ALWAYS);
    test.equal(toSymlinkFollow(FollowMode.BLOCK_EXTERNAL), SymlinkFollowMode.BLOCK_EXTERNAL);
    test.equal(toSymlinkFollow(FollowMode.EXTERNAL), SymlinkFollowMode.EXTERNAL);
    test.equal(toSymlinkFollow(FollowMode.NEVER), SymlinkFollowMode.NEVER);
    test.done();
  },
};