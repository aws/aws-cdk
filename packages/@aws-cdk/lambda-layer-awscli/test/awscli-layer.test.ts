import { Stack } from '@aws-cdk/core';
import { AwsCliLayer, AwsCliV2Layer } from '../lib';
import '@aws-cdk/assert-internal/jest';

test('synthesized to a v1 layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer');

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::LayerVersion', {
    Description: '/opt/awscli/aws',
  });
});

test('synthesized to a v2 layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliV2Layer(stack, 'MyLayer');

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::LayerVersion', {
    Description: '/opt/awscli/aws',
  });
});
