
import { IAlarm } from './alarm-base';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import { Construct } from '@aws-cdk/core';

/**
 * Interface for objects that can be the targets of CloudWatch alarm actions
 */
export interface IAlarmAction {
  /**
   * Return the properties required to send alarm actions to this CloudWatch alarm.
   *
   * @param scope root Construct that allows creating new Constructs
   * @param alarm CloudWatch alarm that the action will target
   */
  bind(scope: Construct, alarm: IAlarm): AlarmActionConfig;
}

/**
 * Properties for an alarm action
 */
export interface AlarmActionConfig {
  /**
   * Return the ARN that should be used for a CloudWatch Alarm action
   */
  readonly alarmActionArn: string;
}
