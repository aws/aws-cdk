import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as iotevents from '../lib';

let stack: cdk.Stack;
beforeEach(() => {
  stack = new cdk.Stack();
});

test('Default property', () => {
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

test('can get input ARN', () => {
  // GIVEN
  const input = new iotevents.Input(stack, 'MyInput', {
    attributeJsonPaths: ['payload.temperature'],
  });

  // WHEN
  new cdk.CfnResource(stack, 'Res', {
    type: 'Test::Resource',
    properties: {
      InputArn: input.inputArn,
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('Test::Resource', {
    InputArn: {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':iotevents:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':input/',
        { Ref: 'MyInput08947B23' },
      ]],
    },
  });
});

test('can set physical name', () => {
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
  // WHEN
  const inputName = 'test-input-name';
  const topicRule = iotevents.Input.fromInputName(stack, 'InputFromInputName', inputName);

  // THEN
  expect(topicRule).toMatchObject({
    inputName,
  });
});

test('cannot be created with an empty array of attributeJsonPaths', () => {
  expect(() => {
    new iotevents.Input(stack, 'MyInput', {
      attributeJsonPaths: [],
    });
  }).toThrow('attributeJsonPaths property cannot be empty');
});

test('can grant the permission to put message', () => {
  const role = iam.Role.fromRoleArn(stack, 'MyRole', 'arn:aws:iam::account-id:role/role-name');
  const input = new iotevents.Input(stack, 'MyInput', {
    attributeJsonPaths: ['payload.temperature'],
  });

  // WHEN
  input.grantWrite(role);

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'iotevents:BatchPutMessage',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':iotevents:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':input/',
              { Ref: 'MyInput08947B23' },
            ]],
          },
        },
      ],
    },
    PolicyName: 'MyRolePolicy64AB00A5',
    Roles: ['role-name'],
  });
});
