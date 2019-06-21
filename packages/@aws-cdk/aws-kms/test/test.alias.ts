import { expect, haveResource } from '@aws-cdk/assert';
import { App, Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { Key } from '../lib';
import { Alias } from '../lib/alias';

export = {
  'default alias'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');
    const key = new Key(stack, 'Key');

    new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

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

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'foo',
      targetKey: key
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

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/',
      targetKey: key
    }));

    test.done();
  },

  'fails if alias contains illegal characters'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/@Nope',
      targetKey: key
    }), 'a-zA-Z0-9:/_-');

    test.done();
  },

  'fails if alias starts with "alias/aws/"'(test: Test) {
    const app = new App();
    const stack = new Stack(app, 'Test');

    const key = new Key(stack, 'MyKey', {
      enableKeyRotation: true,
      enabled: false
    });

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/aws/',
      targetKey: key
    }));

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/aws/Awesome',
      targetKey: key
    }));

    test.throws(() => new Alias(stack, 'Alias', {
      aliasName: 'alias/AWS/awesome',
      targetKey: key
    }));

    test.done();
  }
};
