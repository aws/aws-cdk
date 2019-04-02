import { Test } from 'nodeunit';
import { SecretValue, Stack } from '../lib';

export = {
  'SecretValue.plainText'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.plainText('this just resolves to a string');

    // THEN
    test.deepEqual(stack.node.resolve(v), 'this just resolves to a string');
    test.done();
  },

  'SecretValue.secretsManager'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.secretsManager('secret-id', {
      jsonField: 'json-key',
      versionId: 'version-id',
      versionStage: 'version-stage'
    });

    // THEN
    test.deepEqual(stack.node.resolve(v), '{{resolve:secretsmanager:secret-id:SecretString:json-key:version-stage:version-id}}');
    test.done();
  },

  'SecretValue.secretsManager with defaults'(test: Test) {
    // GIVEN
    const stack = new Stack();

    // WHEN
    const v = SecretValue.secretsManager('secret-id');

    // THEN
    test.deepEqual(stack.node.resolve(v), '{{resolve:secretsmanager:secret-id:SecretString:::}}');
    test.done();
  },

  'SecretValue.secretsManager with an empty ID'(test: Test) {
    test.throws(() => SecretValue.secretsManager(''), /secretId cannot be empty/);
    test.done();
  }
};