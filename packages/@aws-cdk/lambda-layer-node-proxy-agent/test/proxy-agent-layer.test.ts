import { Stack } from '@aws-cdk/core';
import { NodeProxyAgentLayer } from '../lib';
import '@aws-cdk/assert-internal/jest';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new NodeProxyAgentLayer(stack, 'MyLayer');

  // THEN
  expect(stack).toHaveResource('AWS::Lambda::LayerVersion', {
    Description: '/opt/nodejs/node_modules/proxy-agent',
  });
});
