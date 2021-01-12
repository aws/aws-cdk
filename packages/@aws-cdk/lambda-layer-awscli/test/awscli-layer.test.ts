import { Stack } from '@aws-cdk/core';
import { AwsCliLayer } from '../lib';
import '@aws-cdk/assert/jest';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer');

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::LayerVersion', {
    Description: '/opt/awscli/aws',
  });
});
