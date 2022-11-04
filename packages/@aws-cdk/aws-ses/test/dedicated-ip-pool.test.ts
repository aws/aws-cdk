import { Template, Match } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { DedicatedIpPool } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('default dedicated IP pool', () => {
  // GIVEN
  new DedicatedIpPool(stack, 'Pool');

  Template.fromStack(stack).hasResourceProperties('AWS::SES::DedicatedIpPool', {
    PoolName: Match.absent(),
  });
});
