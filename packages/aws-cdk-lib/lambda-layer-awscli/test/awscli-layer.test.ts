import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { App, Stack } from '../../core';
import { LAMBDA_AWS_CLI_LAYER_SHARE } from '../../cx-api';
import { AwsCliLayer } from '../lib';

test('synthesized to a layer version', () => {
  // GIVEN
  const stack = new Stack();

  // WHEN
  new AwsCliLayer(stack, 'MyLayer');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::LayerVersion', {
    Description: '/opt/awscli/aws',
  });
});

test('shared if requested to be shared', () => {
  // GIVEN
  const app = new App({
    context: { [LAMBDA_AWS_CLI_LAYER_SHARE]: true },
  });
  const stack = new Stack(app);

  // WHEN
  const scope1 = new Construct(stack, 's1');
  const layer1 = AwsCliLayer.getOrCreate(scope1);

  const scope2 = new Construct(stack, 's2');
  const layer2 = AwsCliLayer.getOrCreate(scope2);

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::LayerVersion', 1);
  expect(layer1).toBe(layer2);
  expect(scope1.node.children).toHaveLength(0);
  expect(scope2.node.children).toHaveLength(0);
});

test('distinct if requested to not be shared', () => {
  // GIVEN
  const app = new App({
    context: { [LAMBDA_AWS_CLI_LAYER_SHARE]: false },
  });
  const stack = new Stack(app);

  // WHEN
  const scope1 = new Construct(stack, 's1');
  const layer1 = AwsCliLayer.getOrCreate(scope1);

  const scope2 = new Construct(stack, 's2');
  const layer2 = AwsCliLayer.getOrCreate(scope2);

  // THEN
  Template.fromStack(stack).resourceCountIs('AWS::Lambda::LayerVersion', 2);
  expect(layer1).not.toBe(layer2);
  expect(scope1.node.children).toHaveLength(1);
  expect(scope2.node.children).toHaveLength(1);
});
