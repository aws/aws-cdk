import '@aws-cdk/assert-internal/jest';
import { ArnPrincipal, PolicyStatement } from '@aws-cdk/aws-iam';
import { App, CfnOutput, Stack } from '@aws-cdk/core';
import { Alias } from '../lib/alias';
import { IKey, Key } from '../lib/key';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

test('default alias', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');
  const key = new Key(stack, 'Key');

  new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

  expect(stack).toHaveResource('AWS::KMS::Alias', {
    AliasName: 'alias/foo',
    TargetKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
  });
});

test('add "alias/" prefix if not given.', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'Key', {
    enableKeyRotation: true,
    enabled: false,
  });

  new Alias(stack, 'Alias', {
    aliasName: 'foo',
    targetKey: key,
  });

  expect(stack).toHaveResource('AWS::KMS::Alias', {
    AliasName: 'alias/foo',
    TargetKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
  });
});

test('can create alias directly while creating the key', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  new Key(stack, 'Key', {
    enableKeyRotation: true,
    enabled: false,
    alias: 'foo',
  });

  expect(stack).toHaveResource('AWS::KMS::Alias', {
    AliasName: 'alias/foo',
    TargetKeyId: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
  });
});

test('fails if alias is "alias/" (and nothing more)', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  expect(() => new Alias(stack, 'Alias', {
    aliasName: 'alias/',
    targetKey: key,
  })).toThrow(/Alias must include a value after/);
});

test('fails if alias contains illegal characters', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  expect(() => new Alias(stack, 'Alias', {
    aliasName: 'alias/@Nope',
    targetKey: key,
  })).toThrow('a-zA-Z0-9:/_-');
});

test('fails if alias starts with "alias/aws/"', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  expect(() => new Alias(stack, 'Alias1', {
    aliasName: 'alias/aws/',
    targetKey: key,
  })).toThrow(/Alias cannot start with alias\/aws\/: alias\/aws\//);

  expect(() => new Alias(stack, 'Alias2', {
    aliasName: 'alias/aws/Awesome',
    targetKey: key,
  })).toThrow(/Alias cannot start with alias\/aws\/: alias\/aws\/Awesome/);

  expect(() => new Alias(stack, 'Alias3', {
    aliasName: 'alias/AWS/awesome',
    targetKey: key,
  })).toThrow(/Alias cannot start with alias\/aws\/: alias\/AWS\/awesome/);
});

test('can be used wherever a key is expected', () => {
  const stack = new Stack();

  const myKey = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });
  const myAlias = new Alias(stack, 'MyAlias', {
    targetKey: myKey,
    aliasName: 'alias/myAlias',
  });

  /* eslint-disable cdk/no-core-construct */
  class MyConstruct extends Construct {
    constructor(scope: Construct, id: string, key: IKey) {
      super(scope, id);

      new CfnOutput(stack, 'OutId', {
        value: key.keyId,
      });
      new CfnOutput(stack, 'OutArn', {
        value: key.keyArn,
      });
    }
  }
  new MyConstruct(stack, 'MyConstruct', myAlias);
  /* eslint-enable cdk/no-core-construct */

  expect(stack).toHaveOutput({
    outputName: 'OutId',
    outputValue: 'alias/myAlias',
  });
  expect(stack).toHaveOutput({
    outputName: 'OutArn',
    outputValue: {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':kms:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':alias/myAlias',
      ]],
    },
  });
});

test('imported alias by name - can be used where a key is expected', () => {
  const stack = new Stack();

  const myAlias = Alias.fromAliasName(stack, 'MyAlias', 'alias/myAlias');

  /* eslint-disable cdk/no-core-construct */
  class MyConstruct extends Construct {
    constructor(scope: Construct, id: string, key: IKey) {
      super(scope, id);

      new CfnOutput(stack, 'OutId', {
        value: key.keyId,
      });
      new CfnOutput(stack, 'OutArn', {
        value: key.keyArn,
      });
    }
  }
  new MyConstruct(stack, 'MyConstruct', myAlias);
  /* eslint-enable cdk/no-core-construct */

  expect(stack).toHaveOutput({
    outputName: 'OutId',
    outputValue: 'alias/myAlias',
  });
  expect(stack).toHaveOutput({
    outputName: 'OutArn',
    outputValue: {
      'Fn::Join': ['', [
        'arn:',
        { Ref: 'AWS::Partition' },
        ':kms:',
        { Ref: 'AWS::Region' },
        ':',
        { Ref: 'AWS::AccountId' },
        ':alias/myAlias',
      ]],
    },
  });
});

test('imported alias by name - will throw an error when accessing the key', () => {
  const stack = new Stack();

  const myAlias = Alias.fromAliasName(stack, 'MyAlias', 'alias/myAlias');

  expect(() => myAlias.aliasTargetKey).toThrow('Cannot access aliasTargetKey on an Alias imported by Alias.fromAliasName().');
});

test('fails if alias policy is invalid', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'MyKey');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

  alias.addToResourcePolicy(new PolicyStatement({
    resources: ['*'],
    principals: [new ArnPrincipal('arn')],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});
