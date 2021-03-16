import { Stack } from '@aws-cdk/core';
import { KubectlLayer } from '../lib';
import '@aws-cdk/assert/jest';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new KubectlLayer(stack, 'MyLayer');

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::LayerVersion', {
    Description: '/opt/kubectl/kubectl and /opt/helm/helm',
  });
});
