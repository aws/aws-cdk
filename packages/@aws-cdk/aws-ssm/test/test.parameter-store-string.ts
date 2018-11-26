import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import ssm = require('../lib');

export = {
  'can reference SSMPS string'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = new ssm.ParameterStoreString(stack, 'Ref', {
      parameterName: '/some/key',
      version: 123
    });

    // THEN
    test.equal(cdk.resolve(ref.value), '{{resolve:ssm:/some/key:123}}');

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
    test.equal(cdk.resolve(ref.value), '{{resolve:ssm-secure:/some/key:123}}');

    test.done();
  },
};