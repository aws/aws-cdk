import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { VdmAttributes } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a VDM attributes resource', () => {
  new VdmAttributes(stack, 'Vdm');

  Template.fromStack(stack).hasResourceProperties('AWS::SES::VdmAttributes', {
    DashboardAttributes: {
      EngagementMetrics: 'ENABLED',
    },
    GuardianAttributes: {
      OptimizedSharedDelivery: 'ENABLED',
    },
  });
});
