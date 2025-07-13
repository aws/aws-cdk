import { Construct } from 'constructs';
import { Template } from '../../assertions';
import * as iam from '../../aws-iam';
import { ArnPrincipal, PolicyStatement } from '../../aws-iam';
import { App, Arn, Aws, CfnOutput, Stack } from '../../core';
import { KMS_ALIAS_NAME_REF, KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL } from '../../cx-api';
import { Alias } from '../lib/alias';
import { IKey, Key } from '../lib/key';

test('default alias', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');
  const key = new Key(stack, 'Key');

  new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
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

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
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

test('fails if alias starts with "aws/"', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  expect(() => {
    new Key(stack, 'Key', {
      alias: `alias/aws/${Aws.ACCOUNT_ID}`,
    });
  }).toThrow('Alias cannot start with alias/aws/: alias/aws/');
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

test('keyId includes reference to alias under feature flag', () => {
  // GIVEN
  const stack = new Stack();
  stack.node.setContext(KMS_ALIAS_NAME_REF, true);

  const myKey = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: true,
  });
  const myAlias = new Alias(stack, 'MyAlias', {
    targetKey: myKey,
    aliasName: 'alias/myAlias',
  });

  // WHEN
  new AliasOutputsConstruct(stack, 'AliasOutputsConstruct', myAlias);

  // THEN - keyId includes reference to the alias itself
  Template.fromStack(stack).hasOutput('OutId', {
    Value: {
      Ref: 'MyAlias9A08CB8C',
    },
  });
});

test('can be used wherever a key is expected', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_ALIAS_NAME_REF, false);

  const myKey = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });
  const myAlias = new Alias(stack, 'MyAlias', {
    targetKey: myKey,
    aliasName: 'alias/myAlias',
  });

  new AliasOutputsConstruct(stack, 'AliasOutputsConstruct', myAlias);

  Template.fromStack(stack).hasOutput('OutId', {
    Value: 'alias/myAlias',
  });
  Template.fromStack(stack).hasOutput('OutArn', {
    Value: {
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

  new AliasOutputsConstruct(stack, 'AliasOutputsConstruct', myAlias);

  Template.fromStack(stack).hasOutput('OutId', {
    Value: 'alias/myAlias',
  });
  Template.fromStack(stack).hasOutput('OutArn', {
    Value: {
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

test('imported alias by name - grantDecrypt applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantDecrypt(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Decrypt',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantEncrypt applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantEncrypt(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantEncryptDecrypt applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantEncryptDecrypt(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantSign applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantSign(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Sign',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantVerify applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantVerify(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Verify',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantSignVerify applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantSignVerify(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:Sign', 'kms:Verify'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantGenerateMac applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantGenerateMac(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:GenerateMac',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grantVerifyMac applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantVerifyMac(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:VerifyMac',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grant method applies kms:ResourceAliases condition', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, true);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grant(user, 'kms:CreateGrant', 'kms:DescribeKey');

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:CreateGrant', 'kms:DescribeKey'],
          Effect: 'Allow',
          Resource: {
            'Fn::Join': ['', [
              'arn:',
              { Ref: 'AWS::Partition' },
              ':kms:',
              { Ref: 'AWS::Region' },
              ':',
              { Ref: 'AWS::AccountId' },
              ':key/*',
            ]],
          },
          Condition: {
            'ForAnyValue:StringEquals': {
              'kms:ResourceAliases': aliasName,
            },
          },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('imported alias by name - grant methods are no-op when feature flag disabled', () => {
  const stack = new Stack();
  stack.node.setContext(KMS_APPLY_IMPORTED_ALIAS_PERMISSIONS_TO_PRINCIPAL, false);
  const aliasName = 'alias/myAlias';
  const myAlias = Alias.fromAliasName(stack, 'MyAlias', aliasName);
  const user = new iam.User(stack, 'User');

  myAlias.grantDecrypt(user);
  myAlias.grantEncrypt(user);
  myAlias.grantSign(user);
  myAlias.grant(user, 'kms:CreateGrant');

  // should not create any IAM policy statements
  Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
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

test('grants generate mac to the alias target key', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantGenerateMac(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:GenerateMac',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants generate mac to the alias target key', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantVerifyMac(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:VerifyMac',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('adds alias prefix if its token with valid string prefix', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  new Key(stack, 'Key', {
    alias: `MyKey${Aws.ACCOUNT_ID}`,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
    AliasName: {
      'Fn::Join': [
        '',
        [
          'alias/MyKey',
          {
            Ref: 'AWS::AccountId',
          },
        ],
      ],
    },
    TargetKeyId: {
      'Fn::GetAtt': [
        'Key961B73FD',
        'Arn',
      ],
    },
  });
});

test('grants correct permissions for grant method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grant(user, 'kms:CreateAlias');

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:CreateAlias',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants correct permissions for grantDecrypt method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantDecrypt(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Decrypt',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants correct permissions for grantEncrypt method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantEncrypt(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants correct permissions for grantEncryptDecrypt method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantEncryptDecrypt(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:Decrypt', 'kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*'],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants correct permissions for grantSign method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantSign(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Sign',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants correct permissions for grantVerify method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantVerify(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'kms:Verify',
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('grants correct permissions for grantSignVerify method', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'Key');
  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });
  const user = new iam.User(stack, 'User');

  alias.grantSignVerify(user);

  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: ['kms:Sign', 'kms:Verify'],
          Effect: 'Allow',
          Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
        },
      ],
      Version: '2012-10-17',
    },
  });
});

test('does not add alias again if already set', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  new Key(stack, 'Key', {
    alias: `alias/MyKey${Aws.ACCOUNT_ID}`,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
    AliasName: {
      'Fn::Join': [
        '',
        [
          'alias/MyKey',
          {
            Ref: 'AWS::AccountId',
          },
        ],
      ],
    },
    TargetKeyId: {
      'Fn::GetAtt': [
        'Key961B73FD',
        'Arn',
      ],
    },
  });
});

test('throws error when alias contains illegal characters', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');

  expect(() => {
    new Key(stack, 'Key', {
      alias: `MyK*y${Aws.ACCOUNT_ID}`,
    });
  }).toThrow();
});

test('does not add alias if starts with token', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  new Key(stack, 'Key', {
    alias: `${Aws.ACCOUNT_ID}MyKey`,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
    AliasName: {
      'Fn::Join': [
        '',
        [
          {
            Ref: 'AWS::AccountId',
          },
          'MyKey',
        ],
      ],
    },
    TargetKeyId: {
      'Fn::GetAtt': [
        'Key961B73FD',
        'Arn',
      ],
    },
  });
});

test('aliasArn and keyArn from alias should match', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');
  const key = new Key(stack, 'Key');

  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

  expect(alias.aliasArn).toEqual(alias.keyArn);
});

test('aliasArn should be a valid ARN', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');
  const key = new Key(stack, 'Key');

  const alias = new Alias(stack, 'Alias', { targetKey: key, aliasName: 'alias/foo' });

  expect(alias.aliasArn).toEqual(Arn.format({
    service: 'kms',
    // aliasName already contains the '/'
    resource: alias.aliasName,
  }, stack));
});

class AliasOutputsConstruct extends Construct {
  constructor(scope: Construct, id: string, key: IKey) {
    super(scope, id);

    new CfnOutput(scope, 'OutId', {
      value: key.keyId,
    });
    new CfnOutput(scope, 'OutArn', {
      value: key.keyArn,
    });
  }
}
