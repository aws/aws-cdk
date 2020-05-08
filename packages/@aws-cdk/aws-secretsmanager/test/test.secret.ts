import { expect, haveResource } from '@aws-cdk/assert';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as secretsmanager from '../lib';

export = {
  'default secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new secretsmanager.Secret(stack, 'Secret');

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {},
    }));

    test.done();
  },

  'secret with generate secret string options'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
      generateSecretString: {
        excludeUppercase: true,
        passwordLength: 20,
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        ExcludeUppercase: true,
        PasswordLength: 20,
      },
    }));

    test.done();
  },

  'templated secret string'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    new secretsmanager.Secret(stack, 'Secret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'username' }),
        generateStringKey: 'password',
      },
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::Secret', {
      GenerateSecretString: {
        SecretStringTemplate: '{"username":"username"}',
        GenerateStringKey: 'password',
      },
    }));

    test.done();
  },

  'grantRead'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    // WHEN
    secret.grantRead(role);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'secretsmanager:GetSecretValue',
          Effect: 'Allow',
          Resource: { Ref: 'SecretA720EF05' },
        }],
      },
    }));
    expect(stack).to(haveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [{
          Action: [
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
          ],
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        }, {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'kms:Decrypt',
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
        }, {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'kms:CreateGrant',
            'kms:DescribeKey',
          ],
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
        }, {
          Action: 'kms:Decrypt',
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::GetAtt': [
                'Role1ABCC5F0',
                'Arn',
              ],
            },
          },
          Resource: '*',
        },
        ],
        Version: '2012-10-17',
      },
    }));
    test.done();
  },

  'grantRead with version label constraint'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
    const role = new iam.Role(stack, 'Role', { assumedBy: new iam.AccountRootPrincipal() });

    // WHEN
    secret.grantRead(role, ['FOO', 'bar']);

    // THEN
    expect(stack).to(haveResource('AWS::IAM::Policy', {
      PolicyDocument: {
        Version: '2012-10-17',
        Statement: [{
          Action: 'secretsmanager:GetSecretValue',
          Effect: 'Allow',
          Resource: { Ref: 'SecretA720EF05' },
          Condition: {
            'ForAnyValue:StringEquals': {
              'secretsmanager:VersionStage': ['FOO', 'bar'],
            },
          },
        }],
      },
    }));
    expect(stack).to(haveResource('AWS::KMS::Key', {
      KeyPolicy: {
        Statement: [{
          Action: [
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
          ],
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Resource: '*',
        }, {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'kms:Decrypt',
            'kms:Encrypt',
            'kms:ReEncrypt*',
            'kms:GenerateDataKey*',
          ],
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
        }, {
          Effect: 'Allow',
          Resource: '*',
          Action: [
            'kms:CreateGrant',
            'kms:DescribeKey',
          ],
          Principal: {
            AWS: {
              'Fn::Join': [
                '',
                [
                  'arn:',
                  {
                    Ref: 'AWS::Partition',
                  },
                  ':iam::',
                  {
                    Ref: 'AWS::AccountId',
                  },
                  ':root',
                ],
              ],
            },
          },
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
        }, {
          Action: 'kms:Decrypt',
          Condition: {
            StringEquals: {
              'kms:ViaService': {
                'Fn::Join': [
                  '',
                  [
                    'secretsmanager.',
                    {
                      Ref: 'AWS::Region',
                    },
                    '.amazonaws.com',
                  ],
                ],
              },
            },
          },
          Effect: 'Allow',
          Principal: {
            AWS: {
              'Fn::GetAtt': [
                'Role1ABCC5F0',
                'Arn',
              ],
            },
          },
          Resource: '*',
        },
        ],
        Version: '2012-10-17',
      },
    }));
    test.done();
  },

  'secretValue'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const key = new kms.Key(stack, 'KMS');
    const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });

    // WHEN
    new cdk.CfnResource(stack, 'FakeResource', {
      type: 'CDK::Phony::Resource',
      properties: {
        value: secret.secretValue,
      },
    });

    // THEN
    expect(stack).to(haveResource('CDK::Phony::Resource', {
      value: {
        'Fn::Join': ['', [
          '{{resolve:secretsmanager:',
          { Ref: 'SecretA720EF05' },
          ':SecretString:::}}',
        ]],
      },
    }));
    test.done();
  },

  'import'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const encryptionKey = new kms.Key(stack, 'KMS');
    const secretArn = 'arn::of::a::secret';

    // WHEN
    const secret = secretsmanager.Secret.fromSecretAttributes(stack, 'Secret', {
      secretArn, encryptionKey,
    });

    // THEN
    test.equals(secret.secretArn, secretArn);
    test.same(secret.encryptionKey, encryptionKey);
    test.deepEqual(stack.resolve(secret.secretValue), '{{resolve:secretsmanager:arn::of::a::secret:SecretString:::}}');
    test.deepEqual(stack.resolve(secret.secretValueFromJson('password')), '{{resolve:secretsmanager:arn::of::a::secret:SecretString:password::}}');
    test.done();
  },

  'can attach a secret with attach()'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    secret.attach({
      asSecretAttachmentTarget: () => ({
        targetId: 'target-id',
        targetType: 'target-type' as secretsmanager.AttachmentTargetType,
      }),
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::SecretTargetAttachment', {
      SecretId: {
        Ref: 'SecretA720EF05',
      },
      TargetId: 'target-id',
      TargetType: 'target-type',
    }));

    test.done();
  },

  'throws when trying to attach a target multiple times to a secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const target = {
      asSecretAttachmentTarget: () => ({
        targetId: 'target-id',
        targetType: 'target-type' as secretsmanager.AttachmentTargetType,
      }),
    };
    secret.attach(target);

    // THEN
    test.throws(() => secret.attach(target), /Secret is already attached to a target/);

    test.done();
  },

  'add a rotation schedule to an attached secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');
    const attachedSecret = secret.attach({
      asSecretAttachmentTarget: () => ({
        targetId: 'target-id',
        targetType: 'target-type' as secretsmanager.AttachmentTargetType,
      }),
    });
    const rotationLambda = new lambda.Function(stack, 'Lambda', {
      runtime: lambda.Runtime.NODEJS_10_X,
      code: lambda.Code.fromInline('export.handler = event => event;'),
      handler: 'index.handler',
    });

    // WHEN
    attachedSecret.addRotationSchedule('RotationSchedule', {
      rotationLambda,
    });

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::RotationSchedule', {
      SecretId: {
        Ref: 'SecretAttachment2E1B7C3B', // The secret returned by the attachment, not the secret itself.
      },
    }));

    test.done();
  },

  'throws when specifying secretStringTemplate but not generateStringKey'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new secretsmanager.Secret(stack, 'Secret', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'username' }),
      },
    }), /`secretStringTemplate`.+`generateStringKey`/);

    test.done();
  },

  'throws when specifying generateStringKey but not secretStringTemplate'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // THEN
    test.throws(() => new secretsmanager.Secret(stack, 'Secret', {
      generateSecretString: {
        generateStringKey: 'password',
      },
    }), /`secretStringTemplate`.+`generateStringKey`/);

    test.done();
  },

  'equivalence of SecretValue and Secret.fromSecretAttributes'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const imported = secretsmanager.Secret.fromSecretAttributes(stack, 'Imported', { secretArn: 'my-secret-arn' }).secretValueFromJson('password');
    const value = cdk.SecretValue.secretsManager('my-secret-arn', { jsonField: 'password' });

    // THEN
    test.deepEqual(stack.resolve(imported), stack.resolve(value));
    test.done();
  },

  'can add to the resource policy of a secret'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const secret = new secretsmanager.Secret(stack, 'Secret');

    // WHEN
    secret.addToResourcePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue'],
      resources: ['*'],
      principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:user/cool-user')],
    }));

    // THEN
    expect(stack).to(haveResource('AWS::SecretsManager::ResourcePolicy', {
      ResourcePolicy: {
        Statement: [
          {
            Action: 'secretsmanager:GetSecretValue',
            Effect: 'Allow',
            Principal: {
              AWS: 'arn:aws:iam::123456789012:user/cool-user',
            },
            Resource: '*',
          },
        ],
        Version: '2012-10-17',
      },
      SecretId: {
        Ref: 'SecretA720EF05',
      },
    }));

    test.done();
  },
};
