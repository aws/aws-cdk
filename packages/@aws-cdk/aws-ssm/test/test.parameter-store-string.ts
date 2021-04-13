import { expect } from '@aws-cdk/assert-internal';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as ssm from '../lib';

export = {
  'can reference SSMPS string - specific version'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = ssm.StringParameter.fromStringParameterAttributes(stack, 'Ref', {
      parameterName: '/some/key',
      version: 123,
    });

    // THEN
    test.equal(stack.resolve(ref.stringValue), '{{resolve:ssm:/some/key:123}}');

    test.done();
  },

  'can reference SSMPS string - latest version'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = ssm.StringParameter.fromStringParameterAttributes(stack, 'Ref', {
      parameterName: '/some/key',
    });

    // THEN
    expect(stack).toMatch({
      Parameters: {
        RefParameter: {
          Type: 'AWS::SSM::Parameter::Value<String>',
          Default: '/some/key',
        },
      },
    });

    test.deepEqual(stack.resolve(ref.stringValue), { Ref: 'RefParameter' });

    test.done();
  },

  'can reference SSMPS secure string'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = ssm.StringParameter.fromSecureStringParameterAttributes(stack, 'Ref', {
      parameterName: '/some/key',
      version: 123,
    }).stringValue;

    // THEN
    test.equal(stack.resolve(ref), '{{resolve:ssm-secure:/some/key:123}}');

    test.done();
  },

  'empty parameterName will throw'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    test.throws(() => {
      ssm.StringParameter.fromStringParameterAttributes(stack, 'Ref', {
        parameterName: '',
      });
    }, /parameterName cannot be an empty string/);

    test.done();
  },
};
