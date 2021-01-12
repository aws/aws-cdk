import { arrayWith, ResourcePart } from '@aws-cdk/assert';
import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import * as kms from '../lib';

const ADMIN_ACTIONS: string[] = [
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
  'kms:TagResource',
  'kms:UntagResource',
  'kms:ScheduleKeyDeletion',
  'kms:CancelKeyDeletion',
];

const LEGACY_ADMIN_ACTIONS: string[] = [
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

let app: cdk.App;
let stack: cdk.Stack;
beforeEach(() => {
  app = new cdk.App({
    context: {
      // By default, enable the correct key policy behavior. Specific tests will test the disabled behavior.
      '@aws-cdk/aws-kms:defaultKeyPolicies': true,
    },
  });
  stack = new cdk.Stack(app);
});

test('default key', () => {
  new kms.Key(stack, 'MyKey');

  expect(stack).toHaveResource('AWS::KMS::Key', {
    Properties: {
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
        Version: '2012-10-17',
      },
    },
    DeletionPolicy: 'Retain',
    UpdateReplacePolicy: 'Retain',
  }, ResourcePart.CompleteDefinition);
});

test('default with no retention', () => {
  new kms.Key(stack, 'MyKey', { removalPolicy: cdk.RemovalPolicy.DESTROY });

  expect(stack).toHaveResource('AWS::KMS::Key', { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' }, ResourcePart.CompleteDefinition);
});

describe('key policies', () => {
  test('can specify a default key policy', () => {
    const policy = new iam.PolicyDocument();
    const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
    statement.addArnPrincipal('arn:aws:iam::111122223333:root');
    policy.addStatements(statement);

    new kms.Key(stack, 'MyKey', { policy });

    expect(stack).toHaveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:Put*',
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::111122223333:root',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('can append to the default key policy', () => {
    const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
    statement.addArnPrincipal('arn:aws:iam::111122223333:root');

    const key = new kms.Key(stack, 'MyKey');
    key.addToResourcePolicy(statement);

    expect(stack).toHaveResource('AWS::KMS::Key', {
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
          {
            Action: 'kms:Put*',
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::111122223333:root',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test.each([
    ['decrypt', (key: kms.Key, user: iam.IGrantable) => key.grantDecrypt(user), 'kms:Decrypt'],
    ['encrypt', (key: kms.Key, user: iam.IGrantable) => key.grantEncrypt(user), ['kms:Encrypt', 'kms:ReEncrypt*', 'kms:GenerateDataKey*']],
  ])('grant %s', (_, grantFn, actions) => {
    // GIVEN
    const key = new kms.Key(stack, 'Key');
    const user = new iam.User(stack, 'User');

    // WHEN
    grantFn(key, user);

    // THEN
    // Key policy should be unmodified by the grant.
    expect(stack).toHaveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] } },
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
            Action: actions,
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['Key961B73FD', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grant for a principal in a dependent stack works correctly', () => {
    const principalStack = new cdk.Stack(app, 'PrincipalStack');
    const principal = new iam.Role(principalStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });

    const keyStack = new cdk.Stack(app, 'KeyStack');
    const key = new kms.Key(keyStack, 'Key');

    principalStack.addDependency(keyStack);

    key.grantEncrypt(principal);

    expect(principalStack).toHaveResourceLike('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: {
              'Fn::ImportValue': 'KeyStack:ExportsOutputFnGetAttKey961B73FDArn5A860C43',
            },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('additional key admins can be specified (with imported/immutable principal)', () => {
    const adminRole = iam.Role.fromRoleArn(stack, 'Admin', 'arn:aws:iam::123456789012:role/TrustedAdmin');
    new kms.Key(stack, 'MyKey', { admins: [adminRole] });

    expect(stack).toHaveResource('AWS::KMS::Key', {
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
          {
            Action: ADMIN_ACTIONS,
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::123456789012:role/TrustedAdmin',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('additional key admins can be specified (with owned/mutable principal)', () => {
    const adminRole = new iam.Role(stack, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });
    new kms.Key(stack, 'MyKey', { admins: [adminRole] });

    expect(stack).toHaveResource('AWS::KMS::Key', {
      KeyPolicy: {
        // Unmodified - default key policy
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
        Version: '2012-10-17',
      },
    });
    expect(stack).toHaveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ADMIN_ACTIONS,
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});

test('key with some options', () => {
  const key = new kms.Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
    pendingWindow: cdk.Duration.days(7),
  });

  cdk.Tags.of(key).add('tag1', 'value1');
  cdk.Tags.of(key).add('tag2', 'value2');
  cdk.Tags.of(key).add('tag3', '');

  expect(stack).toHaveResourceLike('AWS::KMS::Key', {
    Enabled: false,
    EnableKeyRotation: true,
    PendingWindowInDays: 7,
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
  });
});

test('setting pendingWindow value to not in allowed range will throw', () => {
  expect(() => new kms.Key(stack, 'MyKey', { enableKeyRotation: true, pendingWindow: cdk.Duration.days(6) }))
    .toThrow('\'pendingWindow\' value must between 7 and 30 days. Received: 6');
});

test('setting trustAccountIdentities to false will throw (when the defaultKeyPolicies feature flag is enabled)', () => {
  expect(() => new kms.Key(stack, 'MyKey', { trustAccountIdentities: false }))
    .toThrow('`trustAccountIdentities` cannot be false if the @aws-cdk/aws-kms:defaultKeyPolicies feature flag is set');
});

test('addAlias creates an alias', () => {
  const key = new kms.Key(stack, 'MyKey', {
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
  const key = new kms.Key(stack, 'MyKey', {
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

test('keyId resolves to a Ref', () => {
  const key = new kms.Key(stack, 'MyKey');

  new cdk.CfnOutput(stack, 'Out', {
    value: key.keyId,
  });

  expect(stack).toHaveOutput({
    outputName: 'Out',
    outputValue: { Ref: 'MyKey6AB29FA6' },
  });
});

test('fails if key policy has no actions', () => {
  const key = new kms.Key(stack, 'MyKey');

  key.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    principals: [new iam.ArnPrincipal('arn')],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});

test('fails if key policy has no IAM principals', () => {
  const key = new kms.Key(stack, 'MyKey');

  key.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    actions: ['kms:*'],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});

describe('imported keys', () => {
  test('throw an error when providing something that is not a valid key ARN', () => {
    expect(() => {
      kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key');
    }).toThrow(/KMS key ARN must be in the format 'arn:aws:kms:<region>:<account>:key\/<keyId>', got: 'arn:aws:kms:us-east-1:123456789012:key'/);

  });

  test('can have aliases added to them', () => {
    const stack2 = new cdk.Stack(app, 'Stack2');
    const myKeyImported = kms.Key.fromKeyArn(stack2, 'MyKeyImported',
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
  // eslint-disable-next-line jest/expect-expect
  test('succeed if set to true (default)', () => {
    const key = kms.Key.fromKeyArn(stack, 'Imported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));

  });

  test('fails if set to false', () => {
    const key = kms.Key.fromKeyArn(stack, 'Imported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    expect(() => {
      key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false);
    }).toThrow('Unable to add statement to IAM resource policy for KMS key: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"');

  });
});

describe('when the defaultKeyPolicies feature flag is disabled', () => {
  beforeEach(() => {
    app = new cdk.App({
      context: {
        '@aws-cdk/aws-kms:defaultKeyPolicies': false,
      },
    });
    stack = new cdk.Stack(app);
  });

  test('default key policy', () => {
    new kms.Key(stack, 'MyKey');

    expect(stack).toHaveResource('AWS::KMS::Key', {
      Properties: {
        KeyPolicy: {
          Statement: [
            {
              Action: LEGACY_ADMIN_ACTIONS,
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
    }, ResourcePart.CompleteDefinition);
  });

  test('policy if specified appends to the default key policy', () => {
    const key = new kms.Key(stack, 'MyKey');
    const p = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Encrypt'] });
    p.addArnPrincipal('arn:aws:iam::111122223333:root');
    key.addToResourcePolicy(p);

    expect(stack).toMatchTemplate({
      Resources: {
        MyKey6AB29FA6: {
          Type: 'AWS::KMS::Key',
          Properties: {
            KeyPolicy: {
              Statement: [
                {
                  Action: LEGACY_ADMIN_ACTIONS,
                  Effect: 'Allow',
                  Principal: {
                    AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
                  },
                  Resource: '*',
                },
                {
                  Action: 'kms:Encrypt',
                  Effect: 'Allow',
                  Principal: {
                    AWS: 'arn:aws:iam::111122223333:root',
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

  test('trustAccountIdentities changes key policy to allow IAM control', () => {
    new kms.Key(stack, 'MyKey', { trustAccountIdentities: true });
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

  test('additional key admins can be specified (with imported/immutable principal)', () => {
    const adminRole = iam.Role.fromRoleArn(stack, 'Admin', 'arn:aws:iam::123456789012:role/TrustedAdmin');
    new kms.Key(stack, 'MyKey', { admins: [adminRole] });

    expect(stack).toHaveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: LEGACY_ADMIN_ACTIONS,
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
            },
            Resource: '*',
          },
          {
            Action: ADMIN_ACTIONS,
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::123456789012:role/TrustedAdmin',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('additional key admins can be specified (with owned/mutable principal)', () => {
    const adminRole = new iam.Role(stack, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });
    new kms.Key(stack, 'MyKey', { admins: [adminRole] });

    expect(stack).toHaveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: LEGACY_ADMIN_ACTIONS,
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':root']] },
            },
            Resource: '*',
          },
          {
            Action: ADMIN_ACTIONS,
            Effect: 'Allow',
            Principal: {
              AWS: { 'Fn::GetAtt': ['AdminRole38563C57', 'Arn'] },
            },
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
            Action: ADMIN_ACTIONS,
            Effect: 'Allow',
            Resource: { 'Fn::GetAtt': ['MyKey6AB29FA6', 'Arn'] },
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  describe('grants', () => {
    test('grant decrypt on a key', () => {
      // GIVEN
      const key = new kms.Key(stack, 'Key');
      const user = new iam.User(stack, 'User');

      // WHEN
      key.grantDecrypt(user);

      // THEN
      expect(stack).toHaveResource('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            // This one is there by default
            {
              Action: LEGACY_ADMIN_ACTIONS,
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
      const principalStack = new cdk.Stack(app, 'PrincipalStack');
      const principal = new iam.Role(principalStack, 'Role', {
        assumedBy: new iam.AnyPrincipal(),
      });

      const keyStack = new cdk.Stack(app, 'KeyStack');
      const key = new kms.Key(keyStack, 'Key');

      principalStack.addDependency(keyStack);

      key.grantEncrypt(principal);

      expect(keyStack).toHaveResourceLike('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: arrayWith({
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
          }),
        },
      });
    });
  });
});
