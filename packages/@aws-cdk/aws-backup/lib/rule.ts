import * as events from '@aws-cdk/aws-events';
import { Duration } from '@aws-cdk/core';
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

  /** @param props Rule properties */
  constructor(public readonly props: BackupPlanRuleProps) {
    if (props.deleteAfter && props.moveToColdStorageAfter &&
        props.deleteAfter.toSeconds() < props.moveToColdStorageAfter.toSeconds()) {
      throw new Error('`deleteAfter` must be greater than `moveToColdStorageAfter`');
    }

    if (props.scheduleExpression && !/^cron/.test(props.scheduleExpression.expressionString)) {
      throw new Error('`scheduleExpression` must be of type `cron`');
    }
  }
}
