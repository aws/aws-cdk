import { ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import { App, CfnOutput, RemovalPolicy, Stack, Tags } from '@aws-cdk/core';
import { Key } from '../lib';

const ACTIONS: string[] = [
  'kms:Create*',
  'kms:Describe*',
  'kms:Enable*',
  'kms:List*',
  'kms:Put*',
  'kms:Update*',
  'kms:Revoke*',
  'kms:Disable*',
  'kms:Get*',
  'kms:Delete*',
  'kms:ScheduleKeyDeletion',
  'kms:CancelKeyDeletion',
  'kms:GenerateDataKey',
  'kms:TagResource',
  'kms:UntagResource',
];

test('default key', () => {
  const stack = new Stack();

  new Key(stack, 'MyKey');

  expect(stack).toMatchTemplate({
    Resources: {
      MyKey6AB29FA6: {
        Type: 'AWS::KMS::Key',
        Properties: {
          KeyPolicy: {
            Statement: [
              {
                Action: ACTIONS,
                Effect: 'Allow',
                Principal: {
                  AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                },
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
        },
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
    },
  });
});

test('default with no retention', () => {
  const app = new App();
  const stack = new Stack(app, 'TestStack');

  new Key(stack, 'MyKey', { removalPolicy: RemovalPolicy.DESTROY });

  expect(stack).toHaveResource('AWS::KMS::Key', { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' }, ResourcePart.CompleteDefinition);
});

test('default with some permission', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'MyKey');
  const p = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:encrypt'] });
  p.addArnPrincipal('arn');
  key.addToResourcePolicy(p);

  expect(stack).toMatchTemplate({
    Resources: {
      MyKey6AB29FA6: {
        Type: 'AWS::KMS::Key',
        Properties: {
          KeyPolicy: {
            Statement: [
              {
                Action: ACTIONS,
                Effect: 'Allow',
                Principal: {
                  AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                },
                Resource: '*',
              },
              {
                Action: 'kms:encrypt',
                Effect: 'Allow',
                Principal: {
                  AWS: 'arn',
                },
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
        },
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
    },
  });

});

test('key with some options', () => {
  const stack = new Stack();

  const key = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });
  const p = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:encrypt'] });
  p.addArnPrincipal('arn');
  key.addToResourcePolicy(p);

  Tags.of(key).add('tag1', 'value1');
  Tags.of(key).add('tag2', 'value2');
  Tags.of(key).add('tag3', '');

  expect(stack).toMatchTemplate({
    Resources: {
      MyKey6AB29FA6: {
        Type: 'AWS::KMS::Key',
        Properties: {
          KeyPolicy: {
            Statement: [
              {
                Action: ACTIONS,
                Effect: 'Allow',
                Principal: {
                  AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                },
                Resource: '*',
              },
              {
                Action: 'kms:encrypt',
                Effect: 'Allow',
                Principal: {
                  AWS: 'arn',
                },
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
          Enabled: false,
          EnableKeyRotation: true,
          Tags: [
            {
              Key: 'tag1',
              Value: 'value1',
            },
            {
              Key: 'tag2',
              Value: 'value2',
            },
            {
              Key: 'tag3',
              Value: '',
            },
          ],
        },
        DeletionPolicy: 'Retain',
        UpdateReplacePolicy: 'Retain',
      },
    },
  });
});

test('addAlias creates an alias', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  const alias = key.addAlias('alias/xoo');
  expect(alias.aliasName).toBeDefined();

  expect(stack).toCountResources('AWS::KMS::Alias', 1);
  expect(stack).toHaveResource('AWS::KMS::Alias', {
    AliasName: 'alias/xoo',
    TargetKeyId: {
      'Fn::GetAtt': [
        'MyKey6AB29FA6',
        'Arn',
      ],
    },
  });
});

test('can run multiple addAlias', () => {
  const app = new App();
  const stack = new Stack(app, 'Test');

  const key = new Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  const alias1 = key.addAlias('alias/alias1');
  const alias2 = key.addAlias('alias/alias2');
  expect(alias1.aliasName).toBeDefined();
  expect(alias2.aliasName).toBeDefined();

  expect(stack).toCountResources('AWS::KMS::Alias', 2);
  expect(stack).toHaveResource('AWS::KMS::Alias', {
    AliasName: 'alias/alias1',
    TargetKeyId: {
      'Fn::GetAtt': [
        'MyKey6AB29FA6',
        'Arn',
      ],
    },
  });
  expect(stack).toHaveResource('AWS::KMS::Alias', {
    AliasName: 'alias/alias2',
    TargetKeyId: {
      'Fn::GetAtt': [
        'MyKey6AB29FA6',
        'Arn',
      ],
    },
  });
});

test('grant decrypt on a key', () => {
  // GIVEN
  const stack = new Stack();
  const key = new Key(stack, 'Key');
  const user = new iam.User(stack, 'User');

  // WHEN
  key.grantDecrypt(user);

  // THEN
  expect(stack).toHaveResource('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: [
        // This one is there by default
        {
          Action: ACTIONS,
          Effect: 'Allow',
          Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
          Resource: '*',
        },
        // This is the interesting one
        {
          Action: 'kms:Decrypt',
          Effect: 'Allow',
          Principal: { AWS: { 'Fn::GetAtt': ['User00B015A1', 'Arn'] } },
          Resource: '*',
        },
      ],
      Version: '2012-10-17',
    },
  });

  expect(stack).toHaveResource('AWS::IAM::Policy', {
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

test('grant for a principal in a dependent stack works correctly', () => {
  const app = new App();

  const principalStack = new Stack(app, 'PrincipalStack');
  const principal = new iam.Role(principalStack, 'Role', {
    assumedBy: new iam.AnyPrincipal(),
  });

  const keyStack = new Stack(app, 'KeyStack');
  const key = new Key(keyStack, 'Key');

  principalStack.addDependency(keyStack);

  key.grantEncrypt(principal);

  expect(keyStack).toHaveResourceLike('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: [
        {
          // owning account management permissions - we don't care about them in this test
        },
        {
          Action: [
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Effect: 'Allow',
          Principal: {
            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
          },
          Resource: '*',
        },
      ],
    },
  });

});

test('keyId resolves to a Ref', () => {
  const stack = new Stack();
  const key = new Key(stack, 'MyKey');

  new CfnOutput(stack, 'Out', {
    value: key.keyId,
  });

  expect(stack).toHaveOutput({
    outputName: 'Out',
    outputValue: { Ref: 'MyKey6AB29FA6' },
  });
});

test('enablePolicyControl changes key policy to allow IAM control', () => {
  const stack = new Stack();
  new Key(stack, 'MyKey', { trustAccountIdentities: true });
  expect(stack).toHaveResourceLike('AWS::KMS::Key', {
    KeyPolicy: {
      Statement: [
        {
          Action: 'kms:*',
          Effect: 'Allow',
          Principal: {
            AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
          },
          Resource: '*',
        },
      ],
    },
  });
});

test('fails if key policy has no actions', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'MyKey');

  key.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    principals: [new iam.ArnPrincipal('arn')],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});

test('fails if key policy has no IAM principals', () => {
  const app = new App();
  const stack = new Stack(app, 'my-stack');
  const key = new Key(stack, 'MyKey');

  key.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    actions: ['kms:*'],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});

describe('imported keys', () => {
  test('throw an error when providing something that is not a valid key ARN', () => {
    const stack = new Stack();

    expect(() => {
      Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key');
    }).toThrow(/KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key\/<keyId>', got: 'arn:aws:kms:us-east-1:123456789012:key'/);

  });

  test('can have aliases added to them', () => {
    const stack2 = new Stack();
    const myKeyImported = Key.fromKeyArn(stack2, 'MyKeyImported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    // addAlias can be called on imported keys.
    myKeyImported.addAlias('alias/hello');

    expect(myKeyImported.keyId).toEqual('12345678-1234-1234-1234-123456789012');

    expect(stack2).toMatchTemplate({
      Resources: {
        MyKeyImportedAliasB1C5269F: {
          Type: 'AWS::KMS::Alias',
          Properties: {
            AliasName: 'alias/hello',
            TargetKeyId: 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012',
          },
        },
      },
    });
  });

});

describe('addToResourcePolicy allowNoOp and there is no policy', () => {
  test('succeed if set to true (default)', () => {
    const stack = new Stack();

    const key = Key.fromKeyArn(stack, 'Imported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));

  });

  test('fails if set to false', () => {
    const stack = new Stack();

    const key = Key.fromKeyArn(stack, 'Imported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    expect(() => {
      key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false);
    }).toThrow('Unable to add statement to IAM resource policy for KMS key: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"');

  });
});
