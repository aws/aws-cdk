import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { EncryptionKey } from '../lib';
import { EncryptionKeyAlias } from '../lib/alias';

export = {
  'default alias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');
    const key = new EncryptionKey(stack, 'Key');

    new EncryptionKeyAlias(stack, 'Alias', { key, alias: 'alias/foo' });

    test.deepEqual(app.synthesizeStack(stack.name).template.Resources.Alias325C5727, {
      Type: 'AWS::KMS::Alias',
      Properties: {
        AliasName: 'alias/foo',
        TargetKeyId: { 'Fn::GetAtt': [ 'Key961B73FD', 'Arn' ] }
      }
    });

    test.done();
  },

  'fails if alias name does\'t start with "alias/"'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new EncryptionKey(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new EncryptionKeyAlias(stack, 'Alias', {
      alias: 'foo',
      key
    }));

    test.done();
  },

  'fails if alias is "alias/" (and nothing more)'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new EncryptionKey(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new EncryptionKeyAlias(stack, 'Alias', {
      alias: 'alias/',
      key
    }));

    test.done();
  },

  'fails if alias starts with "alias/AWS"'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new EncryptionKey(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new EncryptionKeyAlias(stack, 'Alias', {
      alias: 'alias/AWS',
      key
    }));

    test.throws(() => new EncryptionKeyAlias(stack, 'Alias', {
      alias: 'alias/AWSAwesome',
      key
    }));

    test.throws(() => new EncryptionKeyAlias(stack, 'Alias', {
      alias: 'alias/AWS/awesome',
      key
    }));

    test.done();
  }
};
