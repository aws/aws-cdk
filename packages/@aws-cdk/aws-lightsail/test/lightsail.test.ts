import { Template } from '@aws-cdk/assertions';
import { Instance, Bundle, Blueprint } from '../lib';
import * as cdk from '@aws-cdk/core';


test('create an instance with minimal setup', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new Instance(stack, 'DemoInstance', {
    bundle: Bundle.SMALL_2_0,
  })
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
    "BlueprintId": "amazon_linux_2",
    "BundleId": "small_2_0",
    "InstanceName": "DemoInstance",
  })
})

test('custom blueprint', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  new Instance(stack, 'DemoInstance', {
    bundle: Bundle.SMALL_2_0,
    blueprint: Blueprint.AMAZON_LINUX,
  })
  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Lightsail::Instance', {
    "BlueprintId": "amazon_linux",
    "BundleId": "small_2_0",
    "InstanceName": "DemoInstance",
  })
})

test('import instance by instanceName', () => {
  // GIVEN
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'demo-stack');
  // WHEN
  const instance = Instance.fromInstanceName(stack, 'ImportedInstance', 'mock')
  // THEN
  expect(instance).toHaveProperty('instanceName');
  expect(instance).toHaveProperty('instanceArn');
})