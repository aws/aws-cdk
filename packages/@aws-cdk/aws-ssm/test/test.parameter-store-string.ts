import { expect } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ssm = require('../lib');

export = {
  'can reference SSMPS string - specific version'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = new ssm.ParameterStoreString(stack, 'Ref', {
      parameterName: '/some/key',
      version: 123
    });

    // THEN
    test.equal(ref.node.resolve(ref.stringValue), '{{resolve:ssm:/some/key:123}}');

    test.done();
  },

  'can reference SSMPS string - latest version'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = new ssm.ParameterStoreString(stack, 'Ref', {
      parameterName: '/some/key',
    });

    // THEN
    expect(stack).toMatch({
      Parameters: {
        RefParameter407AF5C8: {
          Type: "AWS::SSM::Parameter::Value<String>",
          Default: "/some/key"
        }
      }
    });

    test.deepEqual(ref.node.resolve(ref.stringValue), { Ref: 'RefParameter407AF5C8' });

    test.done();
  },

  'can reference SSMPS secure string'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = new ssm.ParameterStoreSecureString(stack, 'Ref', {
      parameterName: '/some/key',
      version: 123
    });

    // THEN
    test.equal(ref.node.resolve(ref.stringValue), '{{resolve:ssm-secure:/some/key:123}}');

    test.done();
  },
};