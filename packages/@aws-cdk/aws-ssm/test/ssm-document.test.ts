import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as ssm from '../lib';

test('association name is rendered properly in L1 construct', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  new ssm.CfnAssociation(stack, 'Assoc', {
    name: 'document',
    parameters: {
      a: ['a'],
      B: [],
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::SSM::Association', {
    Name: 'document',
    Parameters: {
      a: ['a'],
      B: [],
    },
  });
});
