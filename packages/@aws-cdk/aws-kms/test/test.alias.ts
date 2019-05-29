import { expect, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Key } from '../lib';
import { EncryptionKeyAlias } from '../lib/alias';

export = {
  'default alias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');
    const key = new Key(stack, 'Key');

    new EncryptionKeyAlias(stack, 'Alias', { key, alias: 'alias/foo' });

    expect(stack).to(haveResource('AWS::KMS::Alias', {
      AliasName: 'alias/foo',
      TargetKeyId: { 'Fn::GetAtt': [ 'Key961B73FD', 'Arn' ] }
    }));

    test.done();
  },

  'fails if alias name does\'t start with "alias/"'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
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

    const key = new Key(stack, 'MyKey', {
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

    const key = new Key(stack, 'MyKey', {
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
