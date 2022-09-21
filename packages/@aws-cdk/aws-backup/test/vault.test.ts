import { Template } from '@aws-cdk/assertions';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sns from '@aws-cdk/aws-sns';
import { ArnFormat, Duration, Stack } from '@aws-cdk/core';
import { BackupVault, BackupVaultEvents } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a vault', () => {
  // WHEN
  new BackupVault(stack, 'Vault');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    BackupVaultName: 'Vault',
  });
});

test('with access policy', () => {
  // GIVEN
  const accessPolicy = new iam.PolicyDocument({
    statements: [
      new iam.PolicyStatement({
        effect: iam.Effect.DENY,
        principals: [new iam.AnyPrincipal()],
        actions: ['backup:DeleteRecoveryPoint'],
        resources: ['*'],
        conditions: {
          StringNotLike: {
            'aws:userId': [
              'user-arn',
            ],
          },
        },
      }),
    ],
  });

  // WHEN
  new BackupVault(stack, 'Vault', {
    accessPolicy,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    AccessPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Deny',
          Principal: { AWS: '*' },
          Action: 'backup:DeleteRecoveryPoint',
          Resource: '*',
          Condition: {
            StringNotLike: {
              'aws:userId': [
                'user-arn',
              ],
            },
          },
        },
      ],
    },
  });
});

test('with blockRecoveryPointDeletion', () => {
  // WHEN
  new BackupVault(stack, 'Vault', {
    blockRecoveryPointDeletion: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    AccessPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Deny',
          Principal: {
            AWS: '*',
          },
          Action: [
            'backup:DeleteRecoveryPoint',
            'backup:UpdateRecoveryPointLifecycle',
          ],
          Resource: '*',
        },
      ],
    },
  });
});

test('merges statements from accessPolicy and blockRecoveryPointDeletion', () => {
  // WHEN
  new BackupVault(stack, 'Vault', {
    accessPolicy: new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.DENY,
          principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:role/MyRole')],
          actions: ['backup:StartRestoreJob'],
        }),
      ],
    }),
    blockRecoveryPointDeletion: true,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    AccessPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'backup:StartRestoreJob',
          Effect: 'Deny',
          Principal: {
            AWS: 'arn:aws:iam::123456789012:role/MyRole',
          },
        },
        {
          Effect: 'Deny',
          Principal: {
            AWS: '*',
          },
          Action: [
            'backup:DeleteRecoveryPoint',
            'backup:UpdateRecoveryPointLifecycle',
          ],
          Resource: '*',
        },
      ],
    },
  });
});

test('addToAccessPolicy()', () => {
  // GIVEN
  const vault = new BackupVault(stack, 'Vault');

  // WHEN
  vault.addToAccessPolicy(new iam.PolicyStatement({
    effect: iam.Effect.DENY,
    principals: [new iam.ArnPrincipal('arn:aws:iam::123456789012:role/MyRole')],
    actions: ['backup:StartRestoreJob'],
  }));

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    AccessPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'backup:StartRestoreJob',
          Effect: 'Deny',
          Principal: {
            AWS: 'arn:aws:iam::123456789012:role/MyRole',
          },
        },
      ],
    },
  });
});

test('blockRecoveryPointDeletion()', () => {
  // GIVEN
  const vault = new BackupVault(stack, 'Vault');

  // WHEN
  vault.blockRecoveryPointDeletion();

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    AccessPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Deny',
          Principal: {
            AWS: '*',
          },
          Action: [
            'backup:DeleteRecoveryPoint',
            'backup:UpdateRecoveryPointLifecycle',
          ],
          Resource: '*',
        },
      ],
    },
  });
});

test('with encryption key', () => {
  // GIVEN
  const encryptionKey = new kms.Key(stack, 'Key');

  // WHEN
  new BackupVault(stack, 'Vault', {
    encryptionKey,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    EncryptionKeyArn: {
      'Fn::GetAtt': [
        'Key961B73FD',
        'Arn',
      ],
    },
  });
});

test('with notifications', () => {
  // GIVEN
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  new BackupVault(stack, 'Vault', {
    notificationTopic: topic,
    notificationEvents: [
      BackupVaultEvents.BACKUP_JOB_COMPLETED,
      BackupVaultEvents.COPY_JOB_FAILED,
    ],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    Notifications: {
      BackupVaultEvents: [
        'BACKUP_JOB_COMPLETED',
        'COPY_JOB_FAILED',
      ],
      SNSTopicArn: {
        Ref: 'TopicBFC7AF6E',
      },
    },
  });
});

test('defaults to all notifications', () => {
  // GIVEN
  const topic = new sns.Topic(stack, 'Topic');

  // WHEN
  new BackupVault(stack, 'Vault', {
    notificationTopic: topic,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    Notifications: {
      BackupVaultEvents: Object.values(BackupVaultEvents),
      SNSTopicArn: {
        Ref: 'TopicBFC7AF6E',
      },
    },
  });
});

test('import from arn', () => {
  // WHEN
  const vaultArn = stack.formatArn({
    service: 'backup',
    resource: 'backup-vault',
    resourceName: 'myVaultName',
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
  });
  const vault = BackupVault.fromBackupVaultArn(stack, 'Vault', vaultArn);

  // THEN
  expect(vault.backupVaultName).toEqual('myVaultName');
  expect(vault.backupVaultArn).toEqual(vaultArn);
});

test('import from name', () => {
  // WHEN
  const vaultName = 'myVaultName';
  const vault = BackupVault.fromBackupVaultName(stack, 'Vault', vaultName);

  // THEN
  expect(vault.backupVaultName).toEqual(vaultName);
  expect(vault.backupVaultArn).toEqual(stack.formatArn({
    service: 'backup',
    resource: 'backup-vault',
    resourceName: 'myVaultName',
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
  }));
});

test('import from parameter', () => {
  // WHEN
  const vaultName = '${myVaultName}';
  const vault = BackupVault.fromBackupVaultName(stack, 'Vault', vaultName);

  // THEN
  expect(vault.backupVaultName).toEqual(vaultName);
  expect(vault.backupVaultArn).toEqual(stack.formatArn({
    service: 'backup',
    resource: 'backup-vault',
    resourceName: '${myVaultName}',
    arnFormat: ArnFormat.COLON_RESOURCE_NAME,
  }));
});

test('grant action', () => {
  // GIVEN
  const vaultName = 'myVaultName';
  const vault = BackupVault.fromBackupVaultName(stack, 'Vault', vaultName);
  const role = new iam.Role(stack, 'role', { assumedBy: new iam.ServicePrincipal('lambda') });

  // WHEN
  vault.grant(role, 'backup:StartBackupJob');

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
    PolicyDocument: {
      Statement: [
        {
          Action: 'backup:StartBackupJob',
          Effect: 'Allow',
          Resource: {
            'Fn::Join': [
              '',
              [
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':backup:',
                {
                  Ref: 'AWS::Region',
                },
                ':',
                {
                  Ref: 'AWS::AccountId',
                },
                ':backup-vault:myVaultName',
              ],
            ],
          },
        },
      ],
      Version: '2012-10-17',
    },
    PolicyName: 'roleDefaultPolicy7C980EBA',
    Roles: [
      {
        Ref: 'roleC7B7E775',
      },
    ],
  });
});

test('throw when grant action includes wildcard', () => {
  // GIVEN
  const vaultName = 'myVaultName';
  const vault = BackupVault.fromBackupVaultName(stack, 'Vault', vaultName);
  const role = new iam.Role(stack, 'role', { assumedBy: new iam.ServicePrincipal('lambda') });

  // WHEN
  expect(() => vault.grant(role, 'backup:*')).toThrow(/AWS Backup access policies don't support a wildcard in the Action key\./);
});

test('throws with invalid name', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    backupVaultName: 'Hello!Inv@lid',
  })).toThrow(/Expected vault name to match pattern/);
});

test('throws with whitespace in name', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    backupVaultName: 'Hello Invalid',
  })).toThrow(/Expected vault name to match pattern/);
});

test('throws with too short name', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    backupVaultName: 'x',
  })).toThrow(/Expected vault name to match pattern/);
});

test('with lock configuration', () => {
  // WHEN
  new BackupVault(stack, 'Vault', {
    lockConfiguration: {
      minRetention: Duration.days(30),
      maxRetention: Duration.days(365),
      changeableFor: Duration.days(7),
    },
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::Backup::BackupVault', {
    LockConfiguration: {
      ChangeableForDays: 7,
      MaxRetentionDays: 365,
      MinRetentionDays: 30,
    },
  });
});

test('throws with incorrect lock configuration - min retention', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    lockConfiguration: {
      minRetention: Duration.hours(12),
    },
  })).toThrow(/The shortest minimum retention period you can specify is 1 day/);
});

test('throws with incorrect lock configuration - max retention', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    lockConfiguration: {
      minRetention: Duration.days(7),
      maxRetention: Duration.days(40000),
    },
  })).toThrow(/The longest maximum retention period you can specify is 36500 days/);
});

test('throws with incorrect lock configuration - max and min retention', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    lockConfiguration: {
      minRetention: Duration.days(7),
      maxRetention: Duration.days(4),
    },
  })).toThrow(/The maximum retention period \(4 days\) must be greater than the minimum retention period \(7 days\)/);
});

test('throws with incorrect lock configuration - changeable for', () => {
  expect(() => new BackupVault(stack, 'Vault', {
    lockConfiguration: {
      minRetention: Duration.days(7),
      changeableFor: Duration.days(1),
    },
  })).toThrow(/AWS Backup enforces a 72-hour cooling-off period before Vault Lock takes effect and becomes immutable/);
});
