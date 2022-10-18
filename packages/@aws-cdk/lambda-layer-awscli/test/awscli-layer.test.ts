import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { AwsCliLayer } from '../lib';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
    Description: '/opt/awscli/aws',
  });
});

test('accepts custom aws cli asset', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer', {
    awsCliVersion: {
      path: './test/lambda-handler',
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {});
});
