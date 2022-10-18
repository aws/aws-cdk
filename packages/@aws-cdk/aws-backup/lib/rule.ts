import * as events from '@aws-cdk/aws-events';
import { Duration, Token } from '@aws-cdk/core';
import { IBackupVault } from './vault';

/**
 * Properties for a BackupPlanRule
 */
export interface BackupPlanRuleProps {
  /**
   * The duration after a backup job is successfully started before it must be
   * completed or it is canceled by AWS Backup.
   *
   * @default - 8 hours
   */
  readonly completionWindow?: Duration;

  /**
   * Specifies the duration after creation that a recovery point is deleted.
   * Must be greater than `moveToColdStorageAfter`.
   *
   * @default - recovery point is never deleted
   */
  readonly deleteAfter?: Duration;

  /**
   * Specifies the duration after creation that a recovery point is moved to cold
   * storage.
   *
   * @default - recovery point is never moved to cold storage
   */
  readonly moveToColdStorageAfter?: Duration;

  /**
   * A display name for the backup rule.
   *
   * @default - a CDK generated name
   */
  readonly ruleName?: string;

  /**
   * A CRON expression specifying when AWS Backup initiates a backup job.
   *
   * @default - no schedule
   */
  readonly scheduleExpression?: events.Schedule;

  /**
   * The duration after a backup is scheduled before a job is canceled if it doesn't start successfully.
   *
   * @default - 8 hours
   */
  readonly startWindow?: Duration;

  /**
   * The backup vault where backups are
   *
   * @default - use the vault defined at the plan level. If not defined a new
   * common vault for the plan will be created
   */
  readonly backupVault?: IBackupVault;

  /**
   * Enables continuous backup and point-in-time restores (PITR).
   *
   * Property `deleteAfter` defines the retention period for the backup. It is mandatory if PITR is enabled.
   * If no value is specified, the retention period is set to 35 days which is the maximum retention period supported by PITR.
   *
   * Property `moveToColdStorageAfter` must not be specified because PITR does not support this option.
   *
   * @default false
   */
  readonly enableContinuousBackup?: boolean;

  /**
   * Copy operations to perform on recovery points created by this rule
   *
   * @default - no copy actions
   */
  readonly copyActions?: BackupPlanCopyActionProps[];
}

/**
 * Properties for a BackupPlanCopyAction
 */
export interface BackupPlanCopyActionProps {
  /**
   * Destination Vault for recovery points to be copied into
   */
  readonly destinationBackupVault: IBackupVault;

  /**
   * Specifies the duration after creation that a copied recovery point is deleted from the destination vault.
   * Must be at least 90 days greater than `moveToColdStorageAfter`, if specified.
   *
   * @default - recovery point is never deleted
   */
  readonly deleteAfter?: Duration;

  /**
   * Specifies the duration after creation that a copied recovery point is moved to cold storage.
   *
   * @default - recovery point is never moved to cold storage
   */
  readonly moveToColdStorageAfter?: Duration;
}

/**
 * A backup plan rule
 */
export class BackupPlanRule {
  /**
   * Daily with 35 days retention
   */
  public static daily(backupVault?: IBackupVault) {
    return new BackupPlanRule({
      backupVault,
      ruleName: 'Daily',
      scheduleExpression: events.Schedule.cron({
        hour: '5',
        minute: '0',
      }),
      deleteAfter: Duration.days(35),
    });
  }

  /**
   * Weekly with 3 months retention
   */
  public static weekly(backupVault?: IBackupVault) {
    return new BackupPlanRule({
      backupVault,
      ruleName: 'Weekly',
      scheduleExpression: events.Schedule.cron({
        hour: '5',
        minute: '0',
        weekDay: 'SAT',
      }),
      deleteAfter: Duration.days(30 * 3),
    });
  }

  /**
   * Monthly 1 year retention, move to cold storage after 1 month
   */
  public static monthly1Year(backupVault?: IBackupVault) {
    return new BackupPlanRule({
      backupVault,
      ruleName: 'Monthly1Year',
      scheduleExpression: events.Schedule.cron({
        day: '1',
        hour: '5',
        minute: '0',
      }),
      moveToColdStorageAfter: Duration.days(30),
      deleteAfter: Duration.days(365),
    });
  }

  /**
   * Monthly 5 year retention, move to cold storage after 3 months
   */
  public static monthly5Year(backupVault?: IBackupVault) {
    return new BackupPlanRule({
      backupVault,
      ruleName: 'Monthly5Year',
      scheduleExpression: events.Schedule.cron({
        day: '1',
        hour: '5',
        minute: '0',
      }),
      moveToColdStorageAfter: Duration.days(30 * 3),
      deleteAfter: Duration.days(365 * 5),
    });
  }

  /**
   * Monthly 7 year retention, move to cold storage after 3 months
   */
  public static monthly7Year(backupVault?: IBackupVault) {
    return new BackupPlanRule({
      backupVault,
      ruleName: 'Monthly7Year',
      scheduleExpression: events.Schedule.cron({
        day: '1',
        hour: '5',
        minute: '0',
      }),
      moveToColdStorageAfter: Duration.days(30 * 3),
      deleteAfter: Duration.days(365 * 7),
    });
  }

  /**
   * Properties of BackupPlanRule
   */
  public readonly props: BackupPlanRuleProps

  /** @param props Rule properties */
  constructor(props: BackupPlanRuleProps) {
    if (props.deleteAfter && props.moveToColdStorageAfter &&
      props.deleteAfter.toDays() < props.moveToColdStorageAfter.toDays()) {
      throw new Error('`deleteAfter` must be greater than `moveToColdStorageAfter`');
    }

    if (props.scheduleExpression && !/^cron/.test(props.scheduleExpression.expressionString)) {
      throw new Error('`scheduleExpression` must be of type `cron`');
    }

    const deleteAfter = (props.enableContinuousBackup && !props.deleteAfter) ? Duration.days(35) : props.deleteAfter;

    if (props.enableContinuousBackup && props.moveToColdStorageAfter) {
      throw new Error('`moveToColdStorageAfter` must not be specified if `enableContinuousBackup` is enabled');
    }

    if (props.enableContinuousBackup && props.deleteAfter &&
      (props.deleteAfter?.toDays() < 1 || props.deleteAfter?.toDays() > 35)) {
      throw new Error(`'deleteAfter' must be between 1 and 35 days if 'enableContinuousBackup' is enabled, but got ${props.deleteAfter.toHumanString()}`);
    }

    if (props.copyActions && props.copyActions.length > 0) {
      props.copyActions.forEach(copyAction => {
        if (copyAction.deleteAfter && !Token.isUnresolved(copyAction.deleteAfter) &&
          copyAction.moveToColdStorageAfter && !Token.isUnresolved(copyAction.moveToColdStorageAfter) &&
          copyAction.deleteAfter.toDays() < copyAction.moveToColdStorageAfter.toDays() + 90) {
          throw new Error([
            '\'deleteAfter\' must at least 90 days later than corresponding \'moveToColdStorageAfter\'',
            `received 'deleteAfter: ${copyAction.deleteAfter.toDays()}' and 'moveToColdStorageAfter: ${copyAction.moveToColdStorageAfter.toDays()}'`,
          ].join('\n'));
        }
      });
    }

    this.props = {
      ...props,
      deleteAfter,
    };

  }
}
