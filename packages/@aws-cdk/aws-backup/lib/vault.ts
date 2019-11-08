import iam = require('@aws-cdk/aws-iam');
import kms = require('@aws-cdk/aws-kms');
import sns = require('@aws-cdk/aws-sns');
import { Construct, IResource, Resource } from '@aws-cdk/core';
import { CfnBackupVault } from './backup.generated';

/**
 * Represents a Backup vault.
 */
export interface IBackupVault extends IResource {
  /**
   * The name of the vault.
   * @attribute
   */
  readonly backupVaultName: string;

  /**
   * The ARN of the vault.
   * @attribute
   */
  readonly backupVaultArn: string;

  /**
   * Optional KMS encryption key to associate to the Vault.
   * @attribute
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Optional access policy document.
   * @attribute
   */
  readonly accessPolicy?: iam.PolicyDocument;
}

/**
 * Represents a Backup Vault.
 * Backups are stored within this vault.
 *  new Vault(this, 'MyVault', { props });
 */
abstract class BackupVaultBase extends Resource implements IBackupVault {
  public abstract readonly backupVaultName: string;
  public abstract readonly backupVaultArn: string;
  public abstract readonly encryptionKey?: kms.IKey;
  public abstract readonly accessPolicy?: iam.PolicyDocument;
}

/**
 * AWS Backup service can integrate with an SNS Topic and subscribers can
 * subscribe to such.
 * The available event types that are made available are as follow.
 * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/sns-notifications.html
 */
export enum EventType {
  /**
   * Event for when a backup job has started.
   */
  BACKUP_JOB_STARTED = 'BACKUP_JOB_STARTED',
  /**
   * Event for when a backup job has been completed.
   * This event contains successful and failed backup jobs.
   */
  BACKUP_JOB_COMPLETED = 'BACKUP_JOB_COMPLETED',
  /**
   * Event for when a backup plan has been created.
   */
  BACKUP_PLAN_CREATED = 'BACKUP_PLAN_CREATED',
  /**
   * Event for when a backup plan has been modified.
   */
  BACKUP_PLAN_MODIFIED = 'BACKUP_PLAN_MODIFIED',
  /**
   * Event for when a restore job has been started.
   */
  RESTORE_JOB_STARTED = 'RESTORE_JOB_STARTED',
  /**
   * Event for when the restore job has completed.
   * This event contains successful and failed restore jobs.
   */
  RESTORE_JOB_COMPLETED = 'RESTORE_JOB_COMPLETED',
  /**
   * Event for when the recovery point has been modified.
   */
  RECOVERY_POINT_MODIFIED = 'RECOVERY_POINT_MODIFIED',
}

/**
 * Represents the configuration of a vault's notification.
 */
export interface VaultNotifications {
  /**
   * An SNS topic in which AWS Backup service will publish all the events.
   */
  readonly topic: sns.ITopic;
  /**
   * All the event that will get published into the topic.
   */
  readonly events: EventType[];
}

/**
 * Represents the backup vault's properties.
 */
export interface BackupVaultProps {
  /**
   * The name to assign the vault.
   * The name is case-sensitive and must be between 2 and 50 characters or hyphens.
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-vault.html
   */
  readonly backupVaultName: string;
  /**
   * Optional KMS Key to encrypt the backups.
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-vault.html
   * @default Backup Service will create one with the alias `aws/backup`.
   */
  readonly encryptionKey?: kms.IKey;
  /**
   * Notification configuration based on SNS Topics.
   * @default configures no notifications
   */
  readonly notifications?: VaultNotifications;
  /**
   * Optional access policy for the vault.
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-vault-access-policy.html
   * @default Has not access policy.
   */
  readonly accessPolicy?: iam.PolicyDocument;
}

/**
 * Represents the attributes from a backup vault.
 */
export interface BackupVaultAttributes {
  /**
   * An ARN string representations.
   */
  readonly backupVaultArn: string;
  /**
   * A string representation of the backup vault's name.
   */
  readonly backupVaultName: string;
}

/**
 * Backup Vault where all backups will be stored.
 */
export class BackupVault extends BackupVaultBase {

  /**
   * Import a backup Vault.
   */
  public static fromBackupVaultAttributes(scope: Construct, id: string, attrs: BackupVaultAttributes): IBackupVault {
    class Import extends BackupVaultBase {
      public readonly backupVaultArn = attrs.backupVaultArn;
      public readonly backupVaultName = attrs.backupVaultName;
      public readonly accessPolicy?: iam.PolicyDocument; // dropped
      public readonly encryptionKey?: kms.IKey; // dropped
    }

    return new Import(scope, id);
  }

  public readonly backupVaultName: string;
  public readonly backupVaultArn: string;
  public readonly encryptionKey?: kms.IKey;
  public readonly accessPolicy?: iam.PolicyDocument;

  constructor(scope: Construct, id: string, props: BackupVaultProps) {
    super(scope, id, {
      physicalName: props.backupVaultName
    });

    const accessPolicy = props.accessPolicy;
    const encryptionKeyArn = props.encryptionKey ? props.encryptionKey.keyArn : undefined;
    const notifications = this.renderNotifications(props.notifications);

    const resource = new CfnBackupVault(this, 'Resource', {
      backupVaultName: this.physicalName,
      encryptionKeyArn,
      accessPolicy,
      notifications,
    });

    this.backupVaultName = this.getResourceNameAttribute(resource.ref);
    this.backupVaultArn = this.getResourceArnAttribute(resource.attrBackupVaultArn, {
      service: 'backup',
      resource: 'backup-vault',
      resourceName: this.backupVaultName,
    });
  }

  private renderNotifications(notifications?: VaultNotifications): CfnBackupVault.NotificationObjectTypeProperty | undefined {
    if (!notifications) {
      return undefined;
    }

    return {
      backupVaultEvents: notifications.events,
      snsTopicArn: notifications.topic.topicArn,
    };
  }
}
