import { Test } from 'nodeunit';
import cdk = require('../lib');

export = {
  'throws on literal value'(test: Test) {
    test.throws(() => {
      cdk.Secret.assertSafeSecret('bla');
    }, /should be a secret/);
    test.done();
  },

  'can bypass'(test: Test) {
    cdk.Secret.assertSafeSecret(cdk.Secret.unsafeSecret('bla'));
    test.done();
  },
};