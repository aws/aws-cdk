import { Template } from '../../assertions';
import { Stack } from '../../core';
import { KubectlLayer } from '../lib';

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
