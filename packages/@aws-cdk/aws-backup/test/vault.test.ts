import '@aws-cdk/assert/jest';
import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sns from '@aws-cdk/aws-sns';
import { Stack } from '@aws-cdk/core';
import { BackupVault, BackupVaultEvents } from '../lib';

let stack: Stack;
beforeEach(() => {
  stack = new Stack();
});

test('create a vault', () => {
  // WHEN
  new BackupVault(stack, 'Vault');

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupVault', {
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
  expect(stack).toHaveResource('AWS::Backup::BackupVault', {
    AccessPolicy: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Deny',
          Principal: '*',
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

test('with encryption key', () => {
  // GIVEN
  const encryptionKey = new kms.Key(stack, 'Key');

  // WHEN
  new BackupVault(stack, 'Vault', {
    encryptionKey,
  });

  // THEN
  expect(stack).toHaveResource('AWS::Backup::BackupVault', {
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
  expect(stack).toHaveResource('AWS::Backup::BackupVault', {
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
  expect(stack).toHaveResource('AWS::Backup::BackupVault', {
    Notifications: {
      BackupVaultEvents: Object.values(BackupVaultEvents),
      SNSTopicArn: {
        Ref: 'TopicBFC7AF6E',
      },
    },
  });
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
