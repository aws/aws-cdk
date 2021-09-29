import { Stack } from '@aws-cdk/core';
import { KubectlLayer } from '../lib';
import { Template } from '@aws-cdk/assertions';

test('synthesized to a layer version', () => {
  //GIVEN
  const stack = new Stack();

  // WHEN
  new KubectlLayer(stack, 'MyLayer');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
    Description: '/opt/kubectl/kubectl and /opt/helm/helm',
  });
});
