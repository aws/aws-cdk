import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { NodeProxyAgentLayer } from '../lib';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new NodeProxyAgentLayer(stack, 'MyLayer');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
    Description: '/opt/nodejs/node_modules/proxy-agent',
  });
});
