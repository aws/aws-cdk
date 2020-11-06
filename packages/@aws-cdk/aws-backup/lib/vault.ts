import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sns from '@aws-cdk/aws-sns';
import { IResource, Names, RemovalPolicy, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnBackupVault } from './backup.generated';

/**
 * A backup vault
 */
export interface IBackupVault extends IResource {
  /**
   * The name of a logical container where backups are stored.
   *
   * @attribute
   */
  readonly backupVaultName: string;
}

/**
 * Properties for a BackupVault
 */
export interface BackupVaultProps {
  /**
   * The name of a logical container where backups are stored. Backup vaults
   * are identified by names that are unique to the account used to create
   * them and the AWS Region where they are created.
   *
   * @default - A CDK generated name
   */
  readonly backupVaultName?: string;

  /**
   * A resource-based policy that is used to manage access permissions on the
   * backup vault.
   *
   * @default - access is not restricted
   */
  readonly accessPolicy?: iam.PolicyDocument;

  /**
   * The server-side encryption key to use to protect your backups.
   *
   * @default - an Amazon managed KMS key
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * A SNS topic to send vault events to.
   *
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/sns-notifications.html
   *
   * @default - no notifications
   */
  readonly notificationTopic?: sns.ITopic

  /**
   * The vault events to send.
   *
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/sns-notifications.html
   *
   * @default - all vault events if `notificationTopic` is defined
   */
  readonly notificationEvents?: BackupVaultEvents[];

  /**
   * The removal policy to apply to the vault. Note that removing a vault
   * that contains recovery points will fail.
   *
   * @default RemovalPolicy.RETAIN
   */
  readonly removalPolicy?: RemovalPolicy;
}

/**
 * Backup vault events
 */
export enum BackupVaultEvents {
  /** BACKUP_JOB_STARTED */
  BACKUP_JOB_STARTED = 'BACKUP_JOB_STARTED',
  /** BACKUP_JOB_COMPLETED */
  BACKUP_JOB_COMPLETED = 'BACKUP_JOB_COMPLETED',
  /** BACKUP_JOB_SUCCESSFUL */
  BACKUP_JOB_SUCCESSFUL = 'BACKUP_JOB_SUCCESSFUL',
  /** BACKUP_JOB_FAILED */
  BACKUP_JOB_FAILED = 'BACKUP_JOB_FAILED',
  /** BACKUP_JOB_EXPIRED */
  BACKUP_JOB_EXPIRED = 'BACKUP_JOB_EXPIRED',
  /** RESTORE_JOB_STARTED */
  RESTORE_JOB_STARTED = 'RESTORE_JOB_STARTED',
  /** RESTORE_JOB_COMPLETED */
  RESTORE_JOB_COMPLETED = 'RESTORE_JOB_COMPLETED',
  /** RESTORE_JOB_SUCCESSFUL */
  RESTORE_JOB_SUCCESSFUL = 'RESTORE_JOB_SUCCESSFUL',
  /** RESTORE_JOB_FAILED */
  RESTORE_JOB_FAILED = 'RESTORE_JOB_FAILED',
  /** COPY_JOB_STARTED */
  COPY_JOB_STARTED = 'COPY_JOB_STARTED',
  /** COPY_JOB_SUCCESSFUL */
  COPY_JOB_SUCCESSFUL = 'COPY_JOB_SUCCESSFUL',
  /** COPY_JOB_FAILED */
  COPY_JOB_FAILED = 'COPY_JOB_FAILED',
  /** RECOVERY_POINT_MODIFIED */
  RECOVERY_POINT_MODIFIED = 'RECOVERY_POINT_MODIFIED',
  /** BACKUP_PLAN_CREATED */
  BACKUP_PLAN_CREATED = 'BACKUP_PLAN_CREATED',
  /** BACKUP_PLAN_MODIFIED */
  BACKUP_PLAN_MODIFIED = 'BACKUP_PLAN_MODIFIED',
}

/**
 * A backup vault
 */
export class BackupVault extends Resource implements IBackupVault {
  /**
   * Import an existing backup vault
   */
  public static fromBackupVaultName(scope: Construct, id: string, backupVaultName: string): IBackupVault {
    class Import extends Resource implements IBackupVault {
      public readonly backupVaultName = backupVaultName;
    }
    return new Import(scope, id);
  }

  public readonly backupVaultName: string;

  /**
   * The ARN of the backup vault
   *
   * @attribute
   */
  public readonly backupVaultArn: string;

  constructor(scope: Construct, id: string, props: BackupVaultProps = {}) {
    super(scope, id);

    if (props.backupVaultName && !/^[a-zA-Z0-9\-_]{2,50}$/.test(props.backupVaultName)) {
      throw new Error('Expected vault name to match pattern `^[a-zA-Z0-9\-_]{2,50}$`');
    }

    let notifications: CfnBackupVault.NotificationObjectTypeProperty | undefined;
    if (props.notificationTopic) {
      notifications = {
        backupVaultEvents: props.notificationEvents || Object.values(BackupVaultEvents),
        snsTopicArn: props.notificationTopic.topicArn,
      };
      props.notificationTopic.grantPublish(new iam.ServicePrincipal('backup.amazonaws.com'));
    }

    const vault = new CfnBackupVault(this, 'Resource', {
      backupVaultName: props.backupVaultName || this.uniqueVaultName(),
      accessPolicy: props.accessPolicy && props.accessPolicy.toJSON(),
      encryptionKeyArn: props.encryptionKey && props.encryptionKey.keyArn,
      notifications,
    });
    vault.applyRemovalPolicy(props.removalPolicy);

    this.backupVaultName = vault.attrBackupVaultName;
    this.backupVaultArn = vault.attrBackupVaultArn;
  }

  private uniqueVaultName() {
    // Max length of 50 chars, get the last 50 chars
    const id = Names.uniqueId(this);
    return id.substring(Math.max(id.length - 50, 0), id.length);
  }
}
