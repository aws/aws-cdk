import { Template, Match } from '../../assertions';
import { Stack } from '../../core';
import { DedicatedIpPool, ScalingMode } from '../lib';

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

test('dedicated IP pool with scailingMode', () => {
  // GIVEN
  new DedicatedIpPool(stack, 'Pool', {
    scalingMode: ScalingMode.MANAGED,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::SES::DedicatedIpPool', {
    PoolName: Match.absent(),
    ScalingMode: 'MANAGED',
  });
});

test('dedicated IP pool with invalid name', () => {
  // THEN
  expect(() => new DedicatedIpPool(stack, 'Pool', {
    dedicatedIpPoolName: 'invalidName',
  })).toThrow('Invalid dedicatedIpPoolName. The name must only include lowercase letters, numbers, underscores, hyphens, and must not exceed 64 characters.');
});
