import { Template } from '@aws-cdk/assertions';
import * as cdk from '@aws-cdk/core';
import * as ssm from '../lib';

test('can reference SSMPS string - specific version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const ref = ssm.StringParameter.fromStringParameterAttributes(stack, 'Ref', {
    parameterName: '/some/key',
    version: 123,
  });

  // THEN
  expect(stack.resolve(ref.stringValue)).toEqual('{{resolve:ssm:/some/key:123}}');
});

test('can reference SSMPS string - latest version', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const ref = ssm.StringParameter.fromStringParameterAttributes(stack, 'Ref', {
    parameterName: '/some/key',
  });

  // THEN
  Template.fromStack(stack).templateMatches({
    Parameters: {
      RefParameter: {
        Type: 'AWS::SSM::Parameter::Value<String>',
        Default: '/some/key',
      },
    },
  });

  expect(stack.resolve(ref.stringValue)).toEqual({ Ref: 'RefParameter' });
});

test('can reference SSMPS secure string', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  const ref = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Ref', {
    parameterName: '/some/key',
    version: 123,
  }).stringValue;

  // THEN
  expect(stack.resolve(ref)).toEqual('{{resolve:ssm-secure:/some/key:123}}');
});

test('empty parameterName will throw', () => {
  // GIVEN
  const stack = new cdk.Stack();

  // WHEN
  expect(() => {
    ssm.StringParameter.fromStringParameterAttributes(stack, 'Ref', {
      parameterName: '',
    });
  }).toThrow(/parameterName cannot be an empty string/);
});
