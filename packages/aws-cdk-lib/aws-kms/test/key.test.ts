import { describeDeprecated } from '@aws-cdk/cdk-build-tools';
import { Match, Template } from '../../assertions';
import * as iam from '../../aws-iam';
import * as cdk from '../../core';
import * as cxapi from '../../cx-api';
import * as kms from '../lib';
import { KeySpec, KeyUsage } from '../lib';

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

test('default key', () => {
  const stack = new cdk.Stack();
  new kms.Key(stack, 'MyKey');

  Template.fromStack(stack).hasResource('AWS::KMS::Key', {
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
  });
});

test('default with no retention', () => {
  const stack = new cdk.Stack();
  new kms.Key(stack, 'MyKey', { removalPolicy: cdk.RemovalPolicy.DESTROY });

  Template.fromStack(stack).hasResource('AWS::KMS::Key', { DeletionPolicy: 'Delete', UpdateReplacePolicy: 'Delete' });
});

describe('key policies', () => {
  test('can specify a default key policy', () => {
    const stack = new cdk.Stack();
    const policy = new iam.PolicyDocument();
    const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
    statement.addArnPrincipal('arn:aws:iam::111122223333:root');
    policy.addStatements(statement);

    new kms.Key(stack, 'MyKey', { policy });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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

  test('cross region key with iam role grant', () => {
    const app = new cdk.App({ context: { [cxapi.KMS_REDUCE_CROSS_ACCOUNT_REGION_POLICY_SCOPE]: true } });
    const stack = new cdk.Stack(app, 'test-stack', { env: { account: '000000000000', region: 'us-west-2' } });
    const key = kms.Key.fromKeyArn(
      stack,
      'Key',
      'arn:aws:kms:eu-north-1:000000000000:key/e3ab59e5-3dc3-4bc4-9c3f-c790231d2287',
    );

    const roleStack = new cdk.Stack(app, 'RoleStack', {
      env: { account: '000000000000', region: 'eu-north-1' },
    });
    const role = new iam.Role(roleStack, 'Role', {
      assumedBy: new iam.AccountPrincipal('000000000000'),
    });
    key.grantEncryptDecrypt(role);

    Template.fromStack(roleStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Resource: 'arn:aws:kms:eu-north-1:000000000000:key/e3ab59e5-3dc3-4bc4-9c3f-c790231d2287',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('cross region key with iam role grant when feature flag is disabled', () => {
    const app = new cdk.App({ context: { [cxapi.KMS_REDUCE_CROSS_ACCOUNT_REGION_POLICY_SCOPE]: false } });
    const stack = new cdk.Stack(app, 'test-stack', { env: { account: '000000000000', region: 'us-west-2' } });
    const key = kms.Key.fromKeyArn(
      stack,
      'Key',
      'arn:aws:kms:eu-north-1:000000000000:key/e3ab59e5-3dc3-4bc4-9c3f-c790231d2287',
    );

    const roleStack = new cdk.Stack(app, 'RoleStack', {
      env: { account: '000000000000', region: 'eu-north-1' },
    });
    const role = new iam.Role(roleStack, 'Role', {
      assumedBy: new iam.AccountPrincipal('000000000000'),
    });
    key.grantEncryptDecrypt(role);

    Template.fromStack(roleStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('can append to the default key policy', () => {
    const stack = new cdk.Stack();
    const statement = new iam.PolicyStatement({ resources: ['*'], actions: ['kms:Put*'] });
    statement.addArnPrincipal('arn:aws:iam::111122223333:root');

    const key = new kms.Key(stack, 'MyKey');
    key.addToResourcePolicy(statement);

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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

  test('decrypt', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'Key');
    const user = new iam.User(stack, 'User');

    // WHEN
    key.grantDecrypt(user);

    // THEN
    // Key policy should be unmodified by the grant.
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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

  test('encrypt', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'Key');
    const user = new iam.User(stack, 'User');

    // WHEN
    key.grantEncrypt(user);

    // THEN
    // Key policy should be unmodified by the grant.
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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

  test('grant for a principal in a dependent stack works correctly', () => {
    const app = new cdk.App();
    const principalStack = new cdk.Stack(app, 'PrincipalStack');
    const principal = new iam.Role(principalStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
    });

    const keyStack = new cdk.Stack(app, 'KeyStack');
    const key = new kms.Key(keyStack, 'Key');

    principalStack.addDependency(keyStack);

    key.grantEncrypt(principal);

    Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
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

  test('grant for a principal in a different region', () => {
    const app = new cdk.App();
    const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { region: 'testregion1' } });
    const principal = new iam.Role(principalStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
      roleName: 'MyRolePhysicalName',
    });

    const keyStack = new cdk.Stack(app, 'KeyStack', { env: { region: 'testregion2' } });
    const key = new kms.Key(keyStack, 'Key');

    key.grantEncrypt(principal);

    Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([
          {
            Action: [
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::', { Ref: 'AWS::AccountId' }, ':role/MyRolePhysicalName']] } },
            Resource: '*',
          },
        ]),
        Version: '2012-10-17',
      },
    });
    Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grant for a principal in a different account', () => {
    const app = new cdk.App();
    const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { account: '0123456789012' } });
    const principal = new iam.Role(principalStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
      roleName: 'MyRolePhysicalName',
    });

    const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '111111111111' } });
    const key = new kms.Key(keyStack, 'Key');

    key.grantEncrypt(principal);

    Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([{
          Action: [
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Effect: 'Allow',
          Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::0123456789012:role/MyRolePhysicalName']] } },
          Resource: '*',
        }]),
        Version: '2012-10-17',
      },
    });
    Template.fromStack(principalStack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: [
              'kms:Encrypt',
              'kms:ReEncrypt*',
              'kms:GenerateDataKey*',
            ],
            Effect: 'Allow',
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grant for an immutable role', () => {
    const app = new cdk.App();
    const principalStack = new cdk.Stack(app, 'PrincipalStack', { env: { account: '0123456789012' } });
    const principal = new iam.Role(principalStack, 'Role', {
      assumedBy: new iam.AnyPrincipal(),
      roleName: 'MyRolePhysicalName',
    });

    const keyStack = new cdk.Stack(app, 'KeyStack', { env: { account: '111111111111' } });
    const key = new kms.Key(keyStack, 'Key');
    principalStack.addDependency(keyStack);
    key.grantEncrypt(principal.withoutPolicyUpdates());

    Template.fromStack(keyStack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: Match.arrayWith([{
          Action: 'kms:*',
          Effect: 'Allow',
          Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::111111111111:root']] } },
          Resource: '*',
        },
        {
          Action: [
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Effect: 'Allow',
          Principal: { AWS: { 'Fn::Join': ['', ['arn:', { Ref: 'AWS::Partition' }, ':iam::0123456789012:root']] } },
          Resource: '*',
        }]),
        Version: '2012-10-17',
      },
    });
  });

  test('additional key admins can be specified (with imported/immutable principal)', () => {
    const stack = new cdk.Stack();
    const adminRole = iam.Role.fromRoleArn(stack, 'Admin', 'arn:aws:iam::123456789012:role/TrustedAdmin');
    new kms.Key(stack, 'MyKey', { admins: [adminRole] });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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
    const stack = new cdk.Stack();
    const adminRole = new iam.Role(stack, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(),
    });
    new kms.Key(stack, 'MyKey', { admins: [adminRole] });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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
    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
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
  const stack = new cdk.Stack();
  const key = new kms.Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
    pendingWindow: cdk.Duration.days(7),
    rotationPeriod: cdk.Duration.days(180),
  });

  cdk.Tags.of(key).add('tag1', 'value1');
  cdk.Tags.of(key).add('tag2', 'value2');
  cdk.Tags.of(key).add('tag3', '');

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    Enabled: false,
    EnableKeyRotation: true,
    PendingWindowInDays: 7,
    RotationPeriodInDays: 180,
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

test('set rotationPeriod without enabling enableKeyRotation', () => {
  const stack = new cdk.Stack();
  new kms.Key(stack, 'MyKey', {
    rotationPeriod: cdk.Duration.days(180),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    EnableKeyRotation: true,
    RotationPeriodInDays: 180,
  });
});

test('setting pendingWindow value to not in allowed range will throw', () => {
  const stack = new cdk.Stack();
  expect(() => new kms.Key(stack, 'MyKey', { enableKeyRotation: true, pendingWindow: cdk.Duration.days(6) }))
    .toThrow('\'pendingWindow\' value must between 7 and 30 days. Received: 6');
});

test.each([89, 2561])('throw if rotationPeriod is not in allowed range', (period) => {
  const stack = new cdk.Stack();
  expect(() => new kms.Key(stack, 'MyKey', { enableKeyRotation: true, rotationPeriod: cdk.Duration.days(period) }))
    .toThrow(`'rotationPeriod' value must between 90 and 2650 days. Received: ${period}`);
});

describeDeprecated('trustAccountIdentities is deprecated', () => {
  test('setting trustAccountIdentities to false will throw (when the defaultKeyPolicies feature flag is enabled)', () => {
    const stack = new cdk.Stack();
    expect(() => new kms.Key(stack, 'MyKey', { trustAccountIdentities: false }))
      .toThrow('`trustAccountIdentities` cannot be false if the @aws-cdk/aws-kms:defaultKeyPolicies feature flag is set');
  });
});

test('addAlias creates an alias', () => {
  const stack = new cdk.Stack();
  const key = new kms.Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  const alias = key.addAlias('alias/xoo');
  expect(alias.aliasName).toBeDefined();

  Template.fromStack(stack).resourceCountIs('AWS::KMS::Alias', 1);
  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
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
  const stack = new cdk.Stack();
  const key = new kms.Key(stack, 'MyKey', {
    enableKeyRotation: true,
    enabled: false,
  });

  const alias1 = key.addAlias('alias/alias1');
  const alias2 = key.addAlias('alias/alias2');
  expect(alias1.aliasName).toBeDefined();
  expect(alias2.aliasName).toBeDefined();

  Template.fromStack(stack).resourceCountIs('AWS::KMS::Alias', 2);
  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
    AliasName: 'alias/alias1',
    TargetKeyId: {
      'Fn::GetAtt': [
        'MyKey6AB29FA6',
        'Arn',
      ],
    },
  });
  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Alias', {
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
  const stack = new cdk.Stack();
  const key = new kms.Key(stack, 'MyKey');

  new cdk.CfnOutput(stack, 'Out', {
    value: key.keyId,
  });

  Template.fromStack(stack).hasOutput('Out', {
    Value: { Ref: 'MyKey6AB29FA6' },
  });
});

test('fails if key policy has no actions', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  const key = new kms.Key(stack, 'MyKey');

  key.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    principals: [new iam.ArnPrincipal('arn')],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement must specify at least one \'action\' or \'notAction\'/);
});

test('fails if key policy has no IAM principals', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app);
  const key = new kms.Key(stack, 'MyKey');

  key.addToResourcePolicy(new iam.PolicyStatement({
    resources: ['*'],
    actions: ['kms:*'],
  }));

  expect(() => app.synth()).toThrow(/A PolicyStatement used in a resource-based policy must specify at least one IAM principal/);
});

test('multi-region primary key', () => {
  const stack = new cdk.Stack();
  new kms.Key(stack, 'MyKey', {
    multiRegion: true,
  });

  Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
    MultiRegion: true,
  });
});

describe('imported keys', () => {
  test('throw an error when providing something that is not a valid key ARN', () => {
    const stack = new cdk.Stack();
    expect(() => {
      kms.Key.fromKeyArn(stack, 'Imported', 'arn:aws:kms:us-east-1:123456789012:key');
    }).toThrow(/KMS key ARN must be in the format 'arn:<partition>:kms:<region>:<account>:key\/<keyId>', got: 'arn:aws:kms:us-east-1:123456789012:key'/);

  });

  test('can have aliases added to them', () => {
    const app = new cdk.App();
    const stack2 = new cdk.Stack(app, 'Stack2');
    const myKeyImported = kms.Key.fromKeyArn(stack2, 'MyKeyImported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    // addAlias can be called on imported keys.
    myKeyImported.addAlias('alias/hello');

    expect(myKeyImported.keyId).toEqual('12345678-1234-1234-1234-123456789012');

    Template.fromStack(stack2).templateMatches({
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

describe('fromCfnKey()', () => {
  let stack: cdk.Stack;
  let cfnKey: kms.CfnKey;
  let key: kms.IKey;

  beforeEach(() => {
    stack = new cdk.Stack();
    cfnKey = new kms.CfnKey(stack, 'CfnKey', {
      keyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: cdk.Fn.join('', [
                'arn:',
                cdk.Aws.PARTITION,
                ':iam::',
                cdk.Aws.ACCOUNT_ID,
                ':root',
              ]),
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
    key = kms.Key.fromCfnKey(cfnKey);
  });

  test("correctly resolves the 'keyId' property", () => {
    expect(stack.resolve(key.keyId)).toStrictEqual({
      Ref: 'CfnKey',
    });
  });

  test("correctly resolves the 'keyArn' property", () => {
    expect(stack.resolve(key.keyArn)).toStrictEqual({
      'Fn::GetAtt': ['CfnKey', 'Arn'],
    });
  });

  test('preserves the KMS Key resource', () => {
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [
          {
            Action: 'kms:*',
            Effect: 'Allow',
            Principal: {
              AWS: {
                'Fn::Join': ['', [
                  'arn:',
                  { Ref: 'AWS::Partition' },
                  ':iam::',
                  { Ref: 'AWS::AccountId' },
                  ':root',
                ]],
              },
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
    });
    Template.fromStack(stack).resourceCountIs('AWS::KMS::Key', 1);
  });

  describe("calling 'addToResourcePolicy()' on the returned Key", () => {
    let addToResourcePolicyResult: iam.AddToResourcePolicyResult;

    beforeEach(() => {
      addToResourcePolicyResult = key.addToResourcePolicy(new iam.PolicyStatement({
        actions: ['kms:action'],
        resources: ['*'],
        principals: [new iam.AnyPrincipal()],
      }));
    });

    test("the AddToResourcePolicyResult returned has 'statementAdded' set to 'true'", () => {
      expect(addToResourcePolicyResult.statementAdded).toBeTruthy();
    });

    test('preserves the mutating call in the resulting template', () => {
      Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
        KeyPolicy: {
          Statement: [
            {
              Action: 'kms:*',
              Effect: 'Allow',
              Principal: {
                AWS: {
                  'Fn::Join': ['', [
                    'arn:',
                    { Ref: 'AWS::Partition' },
                    ':iam::',
                    { Ref: 'AWS::AccountId' },
                    ':root',
                  ]],
                },
              },
              Resource: '*',
            },
            {
              Action: 'kms:action',
              Effect: 'Allow',
              Principal: { AWS: '*' },
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });
    });
  });

  describe('calling fromCfnKey() again', () => {
    beforeEach(() => {
      key = kms.Key.fromCfnKey(cfnKey);
    });

    describe('and using it for grantDecrypt() on a Role', function () {
      beforeEach(() => {
        const role = new iam.Role(stack, 'Role', {
          assumedBy: new iam.AnyPrincipal(),
        });
        key.grantDecrypt(role);
      });

      test('creates the correct IAM Policy', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
          PolicyDocument: {
            Statement: [
              {
                Action: 'kms:Decrypt',
                Effect: 'Allow',
                Resource: {
                  'Fn::GetAtt': ['CfnKey', 'Arn'],
                },
              },
            ],
          },
        });
      });

      test('correctly mutates the Policy of the underlying CfnKey', () => {
        Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
          KeyPolicy: {
            Statement: [
              {
                Action: 'kms:*',
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    'Fn::Join': ['', [
                      'arn:',
                      { Ref: 'AWS::Partition' },
                      ':iam::',
                      { Ref: 'AWS::AccountId' },
                      ':root',
                    ]],
                  },
                },
                Resource: '*',
              },
              {
                Action: 'kms:Decrypt',
                Effect: 'Allow',
                Principal: {
                  AWS: {
                    'Fn::GetAtt': ['Role1ABCC5F0', 'Arn'],
                  },
                },
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
        });
      });
    });
  });

  describe("called with a CfnKey that has an 'Fn::If' passed as the KeyPolicy", () => {
    beforeEach(() => {
      cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
        keyPolicy: cdk.Fn.conditionIf(
          'AlwaysTrue',
          {
            Statement: [
              {
                Action: 'kms:action1',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
          {
            Statement: [
              {
                Action: 'kms:action2',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
            ],
            Version: '2012-10-17',
          },
        ),
      });
    });

    test('throws a descriptive exception', () => {
      expect(() => {
        kms.Key.fromCfnKey(cfnKey);
      }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
    });
  });

  describe("called with a CfnKey that has an 'Fn::If' passed as the Statement of a KeyPolicy", () => {
    beforeEach(() => {
      cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
        keyPolicy: {
          Statement: cdk.Fn.conditionIf(
            'AlwaysTrue',
            [
              {
                Action: 'kms:action1',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
            ],
            [
              {
                Action: 'kms:action2',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
            ],
          ),
          Version: '2012-10-17',
        },
      });
    });

    test('throws a descriptive exception', () => {
      expect(() => {
        kms.Key.fromCfnKey(cfnKey);
      }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
    });
  });

  describe("called with a CfnKey that has an 'Fn::If' passed as one of the statements of a KeyPolicy", () => {
    beforeEach(() => {
      cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
        keyPolicy: {
          Statement: [
            cdk.Fn.conditionIf(
              'AlwaysTrue',
              {
                Action: 'kms:action1',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
              {
                Action: 'kms:action2',
                Effect: 'Allow',
                Principal: '*',
                Resource: '*',
              },
            ),
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('throws a descriptive exception', () => {
      expect(() => {
        kms.Key.fromCfnKey(cfnKey);
      }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
    });
  });

  describe("called with a CfnKey that has an 'Fn::If' passed for the Action in one of the statements of a KeyPolicy", () => {
    beforeEach(() => {
      cfnKey = new kms.CfnKey(stack, 'CfnKey2', {
        keyPolicy: {
          Statement: [
            {
              Action: cdk.Fn.conditionIf('AlwaysTrue', 'kms:action1', 'kms:action2'),
              Effect: 'Allow',
              Principal: '*',
              Resource: '*',
            },
          ],
          Version: '2012-10-17',
        },
      });
    });

    test('throws a descriptive exception', () => {
      expect(() => {
        key = kms.Key.fromCfnKey(cfnKey);
      }).toThrow(/Could not parse the PolicyDocument of the passed AWS::KMS::Key/);
    });
  });
});

describe('addToResourcePolicy allowNoOp and there is no policy', () => {
  // eslint-disable-next-line jest/expect-expect
  test('succeed if set to true (default)', () => {
    const stack = new cdk.Stack();
    const key = kms.Key.fromKeyArn(stack, 'Imported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }));

  });

  test('fails if set to false', () => {
    const stack = new cdk.Stack();
    const key = kms.Key.fromKeyArn(stack, 'Imported',
      'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012');

    expect(() => {
      key.addToResourcePolicy(new iam.PolicyStatement({ resources: ['*'], actions: ['*'] }), /* allowNoOp */ false);
    }).toThrow('Unable to add statement to IAM resource policy for KMS key: "arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012"');

  });
});

describe('key specs and key usages', () => {
  test('both usage and spec are specified', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'Key', { keySpec: kms.KeySpec.ECC_SECG_P256K1, keyUsage: kms.KeyUsage.SIGN_VERIFY });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeySpec: 'ECC_SECG_P256K1',
      KeyUsage: 'SIGN_VERIFY',
    });
  });

  test('only key usage is specified', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'Key', { keyUsage: kms.KeyUsage.ENCRYPT_DECRYPT });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeyUsage: 'ENCRYPT_DECRYPT',
    });
  });

  test('only key spec is specified', () => {
    const stack = new cdk.Stack();
    new kms.Key(stack, 'Key', { keySpec: kms.KeySpec.RSA_4096 });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeySpec: 'RSA_4096',
    });
  });

  test.each(generateInvalidKeySpecKeyUsageCombinations())('invalid combinations of key specs and key usages (%s)', ({ keySpec, keyUsage }) => {
    const stack = new cdk.Stack();

    expect(() => new kms.Key(stack, 'Key1', { keySpec, keyUsage }))
      .toThrow(`key spec \'${keySpec}\' is not valid with usage \'${keyUsage.toString()}\'`);
  });

  test('invalid combinations of default key spec and key usage SIGN_VERIFY', () => {
    const stack = new cdk.Stack();

    expect(() => new kms.Key(stack, 'Key1', { keyUsage: KeyUsage.SIGN_VERIFY }))
      .toThrow('key spec \'SYMMETRIC_DEFAULT\' is not valid with usage \'SIGN_VERIFY\'');
  });

  test('fails if key rotation enabled on asymmetric key', () => {
    const stack = new cdk.Stack();

    expect(() => new kms.Key(stack, 'Key', { enableKeyRotation: true, keySpec: kms.KeySpec.RSA_3072 }))
      .toThrow('key rotation cannot be enabled on asymmetric keys');
  });
});

describe('Key.fromKeyArn()', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, 'Base', {
      env: { account: '111111111111', region: 'stack-region' },
    });
  });

  describe('for a key in a different account and region', () => {
    let key: kms.IKey;

    beforeEach(() => {
      key = kms.Key.fromKeyArn(
        stack,
        'iKey',
        'arn:aws:kms:key-region:222222222222:key:key-name',
      );
    });

    test("the key's region is taken from the ARN", () => {
      expect(key.env.region).toBe('key-region');
    });

    test("the key's account is taken from the ARN", () => {
      expect(key.env.account).toBe('222222222222');
    });
  });
});

describe('HMAC', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test.each([
    [KeySpec.HMAC_224, 'HMAC_224'],
    [KeySpec.HMAC_256, 'HMAC_256'],
    [KeySpec.HMAC_384, 'HMAC_384'],
    [KeySpec.HMAC_512, 'HMAC_512'],
  ])('%s is not valid for default usage', (keySpec: KeySpec) => {
    expect(() => new kms.Key(stack, 'Key1', { keySpec }))
      .toThrow(`key spec \'${keySpec}\' is not valid with usage \'ENCRYPT_DECRYPT\'`);
  });

  test.each([
    [KeySpec.HMAC_224, 'HMAC_224'],
    [KeySpec.HMAC_256, 'HMAC_256'],
    [KeySpec.HMAC_384, 'HMAC_384'],
    [KeySpec.HMAC_512, 'HMAC_512'],
  ])('%s can not be used with key rotation', (keySpec: KeySpec) => {
    expect(() => new kms.Key(stack, 'Key', {
      keySpec,
      keyUsage: KeyUsage.GENERATE_VERIFY_MAC,
      enableKeyRotation: true,
    })).toThrow('key rotation cannot be enabled on HMAC keys');
  });

  test.each([
    [KeySpec.HMAC_224, 'HMAC_224'],
    [KeySpec.HMAC_256, 'HMAC_256'],
    [KeySpec.HMAC_384, 'HMAC_384'],
    [KeySpec.HMAC_512, 'HMAC_512'],
  ])('%s can be used for KMS key creation', (keySpec: KeySpec, expected: string) => {
    new kms.Key(stack, 'Key', {
      keySpec,
      keyUsage: KeyUsage.GENERATE_VERIFY_MAC,
    });
    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeySpec: expected,
      KeyUsage: 'GENERATE_VERIFY_MAC',
    });
  });

  test('grant generate mac policy', () => {
    const key = new kms.Key(stack, 'Key', {
      keySpec: KeySpec.HMAC_256,
      keyUsage: KeyUsage.GENERATE_VERIFY_MAC,
    });
    const user = new iam.User(stack, 'User');

    key.grantGenerateMac(user);

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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

  test('grant verify mac policy', () => {
    const key = new kms.Key(stack, 'Key', {
      keySpec: KeySpec.HMAC_256,
      keyUsage: KeyUsage.GENERATE_VERIFY_MAC,
    });
    const user = new iam.User(stack, 'User');

    key.grantVerifyMac(user);

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
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

  test('grant generate mac policy for imported key', () => {
    const keyArn = 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012';
    const key = kms.Key.fromKeyArn(
      stack,
      'Key',
      keyArn,
    );
    const user = new iam.User(stack, 'User');

    key.grantGenerateMac(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'kms:GenerateMac',
            Effect: 'Allow',
            Resource: keyArn,
          },
        ],
        Version: '2012-10-17',
      },
    });
  });

  test('grant verify mac policy for imported key', () => {
    const keyArn = 'arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012';
    const key = kms.Key.fromKeyArn(
      stack,
      'Key',
      keyArn,
    );
    const user = new iam.User(stack, 'User');

    key.grantVerifyMac(user);

    Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: 'kms:VerifyMac',
            Effect: 'Allow',
            Resource: keyArn,
          },
        ],
        Version: '2012-10-17',
      },
    });
  });
});

describe('SM2', () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    stack = new cdk.Stack();
  });

  test('can be used for KMS key creation', () => {
    new kms.Key(stack, 'Key1', {
      keySpec: KeySpec.SM2,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::KMS::Key', {
      KeySpec: 'SM2',
    });
  });
});

function generateInvalidKeySpecKeyUsageCombinations() {
  // Copied from Key class
  const denyLists = {
    [KeyUsage.ENCRYPT_DECRYPT]: [
      KeySpec.ECC_NIST_P256,
      KeySpec.ECC_NIST_P384,
      KeySpec.ECC_NIST_P521,
      KeySpec.ECC_SECG_P256K1,
      KeySpec.HMAC_224,
      KeySpec.HMAC_256,
      KeySpec.HMAC_384,
      KeySpec.HMAC_512,
    ],
    [KeyUsage.SIGN_VERIFY]: [
      KeySpec.SYMMETRIC_DEFAULT,
      KeySpec.HMAC_224,
      KeySpec.HMAC_256,
      KeySpec.HMAC_384,
      KeySpec.HMAC_512,
    ],
    [KeyUsage.GENERATE_VERIFY_MAC]: [
      KeySpec.RSA_2048,
      KeySpec.RSA_3072,
      KeySpec.RSA_4096,
      KeySpec.ECC_NIST_P256,
      KeySpec.ECC_NIST_P384,
      KeySpec.ECC_NIST_P521,
      KeySpec.ECC_SECG_P256K1,
      KeySpec.SYMMETRIC_DEFAULT,
      KeySpec.SM2,
    ],
  };
  const testCases: { keySpec: KeySpec; keyUsage: KeyUsage; toString: () => string }[] = [];
  for (const keySpec in KeySpec) {
    for (const keyUsage in KeyUsage) {
      if (denyLists[keyUsage as KeyUsage].includes(keySpec as KeySpec)) {
        testCases.push({
          keySpec: keySpec as KeySpec,
          keyUsage: keyUsage as KeyUsage,
          toString: () => `${keySpec} can not be used for ${keyUsage}`,
        });
      }
    }
  }
  // Sorting for debugging purposes to see if test cases match deny list
  testCases.sort((a, b) => a.keyUsage.localeCompare(b.keyUsage));
  return testCases;
}
