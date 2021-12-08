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

test('can get input name', () => {
  const stack = new cdk.Stack();
  // GIVEN
  const input = new iotevents.Input(stack, 'MyInput', {
    attributeJsonPaths: ['payload.temperature'],
  });

  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      InputName: input.inputName,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    InputName: { Ref: 'MyInput08947B23' },
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

test('can import a Input by inputName', () => {
  const stack = new cdk.Stack();

  // WHEN
  const inputName = 'test-input-name';
  const topicRule = iotevents.Input.fromInputName(stack, 'InputFromInputName', inputName);

  // THEN
  expect(topicRule).toMatchObject({
    inputName,
  });
});

test('cannot be created with an empty array of attributeJsonPaths', () => {
  const stack = new cdk.Stack();

  expect(() => {
    new iotevents.Input(stack, 'MyInput', {
      attributeJsonPaths: [],
    });
  }).toThrow('attributeJsonPaths property cannot be empty');
});
