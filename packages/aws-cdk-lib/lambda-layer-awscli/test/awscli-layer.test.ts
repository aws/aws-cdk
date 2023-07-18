import { Template } from '../../assertions';
import { Stack } from '../../core';
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
