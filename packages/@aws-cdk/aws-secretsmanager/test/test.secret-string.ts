import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import secretsmanager = require('../lib');

export = {
  'can reference Secrets Manager Value'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = new secretsmanager.SecretString(stack, 'Ref', {
      secretId: 'SomeSecret',
    });

    // THEN
    test.equal(ref.node.resolve(ref.stringValue), '{{resolve:secretsmanager:SomeSecret:SecretString:::}}');

    test.done();
  },

  'can reference jsonkey in Secrets Manager Value'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const ref = new secretsmanager.SecretString(stack, 'Ref', {
      secretId: 'SomeSecret',
    });

    // THEN
    test.equal(ref.node.resolve(ref.jsonFieldValue('subkey')), '{{resolve:secretsmanager:SomeSecret:SecretString:subkey::}}');

    test.done();
  },
};
