import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

test('Default property', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.Input(stack, 'MyInput', {
    attributeJsonPaths: ['payload.temperature'],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::Input', {
    InputDefinition: {
      Attributes: [{ JsonPath: 'payload.temperature' }],
    },
  });
});

test('can set physical name', () => {
  const stack = new cdk.Stack();

  // WHEN
  new iotevents.Input(stack, 'MyInput', {
    inputName: 'test_input',
    attributeJsonPaths: ['payload.temperature'],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IoTEvents::Input', {
    InputName: 'test_input',
  });
});
