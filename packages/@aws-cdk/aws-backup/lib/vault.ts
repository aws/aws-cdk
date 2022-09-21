import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as sns from '@aws-cdk/aws-sns';
import { ArnFormat, Duration, IResource, Lazy, Names, RemovalPolicy, Resource, Stack, Token } from '@aws-cdk/core';
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

  /**
   * The ARN of the backup vault.
   *
   * @attribute
   */
  readonly backupVaultArn: string;

  /**
   * Grant the actions defined in actions to the given grantee
   * on this backup vault.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;
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

  /**
   * Whether to add statements to the vault access policy that prevents anyone
   * from deleting a recovery point.
   *
   * @default false
   */
  readonly blockRecoveryPointDeletion?: boolean;

  /**
   * Configuration for AWS Backup Vault Lock
   *
   * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html
   *
   * @default - AWS Backup Vault Lock is disabled
   */
  readonly lockConfiguration?: LockConfiguration;
}

/**
 * Backup vault events. Some events are no longer supported and will not return
 * statuses or notifications.
 *
 * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/API_PutBackupVaultNotifications.html#API_PutBackupVaultNotifications_RequestBody
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
 * Configuration for AWS Backup Vault Lock
 *
 * @see https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html
 */
export interface LockConfiguration {
  /**
   * The minimum retention period that the vault retains its recovery points.
   *
   * If this parameter is specified, any backup or copy job to the vault must
   * have a lifecycle policy with a retention period equal to or longer than
   * the minimum retention period. If the job's retention period is shorter than
   * that minimum retention period, then the vault fails that backup or copy job,
   * and you should either modify your lifecycle settings or use a different
   * vault. Recovery points already saved in the vault prior to Vault Lock are
   * not affected.
   */
  readonly minRetention: Duration;

  /**
   * The maximum retention period that the vault retains its recovery points.
   *
   * If this parameter is specified, any backup or copy job to the vault must
   * have a lifecycle policy with a retention period equal to or shorter than
   * the maximum retention period. If the job's retention period is longer than
   * that maximum retention period, then the vault fails the backup or copy job,
   * and you should either modify your lifecycle settings or use a different
   * vault. Recovery points already saved in the vault prior to Vault Lock are
   * not affected.
   *
   * @default - Vault Lock does not enforce a maximum retention period
   */
  readonly maxRetention?: Duration;

  /**
   * The duration before the lock date.
   *
   * AWS Backup enforces a 72-hour cooling-off period before Vault Lock takes
   * effect and becomes immutable.
   *
   * Before the lock date, you can delete Vault Lock from the vault or change
   * the Vault Lock configuration. On and after the lock date, the Vault Lock
   * becomes immutable and cannot be changed or deleted.
   *
   * @default - Vault Lock can be deleted or changed at any time
   */
  readonly changeableFor?: Duration;
}

abstract class BackupVaultBase extends Resource implements IBackupVault {
  public abstract readonly backupVaultName: string;
  public abstract readonly backupVaultArn: string;

  /**
   * Grant the actions defined in actions to the given grantee
   * on this Backup Vault resource.
   *
   * @param grantee Principal to grant right to
   * @param actions The actions to grant
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    for (const action of actions) {
      if (action.indexOf('*') >= 0) {
        throw new Error("AWS Backup access policies don't support a wildcard in the Action key.");
      }
    }

    return iam.Grant.addToPrincipal({
      grantee: grantee,
      actions: actions,
      resourceArns: [this.backupVaultArn],
    });
  }
}


/**
 * A backup vault
 */
export class BackupVault extends BackupVaultBase {
  /**
   * Import an existing backup vault by name
   */
  public static fromBackupVaultName(scope: Construct, id: string, backupVaultName: string): IBackupVault {
    const backupVaultArn = Stack.of(scope).formatArn({
      service: 'backup',
      resource: 'backup-vault',
      resourceName: backupVaultName,
      arnFormat: ArnFormat.COLON_RESOURCE_NAME,
    });

    return BackupVault.fromBackupVaultArn(scope, id, backupVaultArn);
  }

  /**
   * Import an existing backup vault by arn
   */
  public static fromBackupVaultArn(scope: Construct, id: string, backupVaultArn: string): IBackupVault {
    const parsedArn = Stack.of(scope).splitArn(backupVaultArn, ArnFormat.SLASH_RESOURCE_NAME);

    if (!parsedArn.resourceName) {
      throw new Error(`Backup Vault Arn ${backupVaultArn} does not have a resource name.`);
    }

    class Import extends BackupVaultBase {
      public readonly backupVaultName = parsedArn.resourceName!;
      public readonly backupVaultArn = backupVaultArn;
    }

    return new Import(scope, id, {
      account: parsedArn.account,
      region: parsedArn.region,
    });
  }

  public readonly backupVaultName: string;
  public readonly backupVaultArn: string;

  private readonly accessPolicy: iam.PolicyDocument;

  constructor(scope: Construct, id: string, props: BackupVaultProps = {}) {
    super(scope, id);

    if (props.backupVaultName && !Token.isUnresolved(props.backupVaultName) && !/^[a-zA-Z0-9\-_]{2,50}$/.test(props.backupVaultName)) {
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

    this.accessPolicy = props.accessPolicy ?? new iam.PolicyDocument();
    if (props.blockRecoveryPointDeletion) {
      this.blockRecoveryPointDeletion();
    }

    const vault = new CfnBackupVault(this, 'Resource', {
      backupVaultName: props.backupVaultName || this.uniqueVaultName(),
      accessPolicy: Lazy.any({ produce: () => this.accessPolicy.toJSON() }),
      encryptionKeyArn: props.encryptionKey && props.encryptionKey.keyArn,
      notifications,
      lockConfiguration: renderLockConfiguration(props.lockConfiguration),
    });
    vault.applyRemovalPolicy(props.removalPolicy);

    this.backupVaultName = vault.attrBackupVaultName;
    this.backupVaultArn = vault.attrBackupVaultArn;
  }

  /**
   * Adds a statement to the vault access policy
   */
  public addToAccessPolicy(statement: iam.PolicyStatement) {
    this.accessPolicy.addStatements(statement);
  }

  /**
   * Adds a statement to the vault access policy that prevents anyone
   * from deleting a recovery point.
   */
  public blockRecoveryPointDeletion() {
    this.addToAccessPolicy(new iam.PolicyStatement({
      effect: iam.Effect.DENY,
      actions: [
        'backup:DeleteRecoveryPoint',
        'backup:UpdateRecoveryPointLifecycle',
      ],
      principals: [new iam.AnyPrincipal()],
      resources: ['*'],
    }));
  }

  private uniqueVaultName() {
    // Max length of 50 chars, get the last 50 chars
    const id = Names.uniqueId(this);
    return id.substring(Math.max(id.length - 50, 0), id.length);
  }
}

function renderLockConfiguration(config?: LockConfiguration): CfnBackupVault.LockConfigurationTypeProperty | undefined {
  if (!config) {
    return undefined;
  }

  if (config.changeableFor && config.changeableFor.toHours() < 72) {
    throw new Error(`AWS Backup enforces a 72-hour cooling-off period before Vault Lock takes effect and becomes immutable, got ${config.changeableFor.toHours()} hours`);
  }

  if (config.maxRetention) {
    if (config.maxRetention.toDays() > 36500) {
      throw new Error(`The longest maximum retention period you can specify is 36500 days, got ${config.maxRetention.toDays()} days`);
    }
    if (config.maxRetention.toDays() <= config.minRetention.toDays()) {
      throw new Error(`The maximum retention period (${config.maxRetention.toDays()} days) must be greater than the minimum retention period (${config.minRetention.toDays()} days)`);
    }
  }

  if (config.minRetention.toHours() < 24) {
    throw new Error(`The shortest minimum retention period you can specify is 1 day, got ${config.minRetention.toHours()} hours`);
  }

  return {
    minRetentionDays: config.minRetention.toDays(),
    maxRetentionDays: config.maxRetention?.toDays(),
    changeableForDays: config.changeableFor?.toDays(),
  };
}
