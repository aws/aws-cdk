import { Construct } from 'constructs';
import { IAlarmRef } from '../../interfaces/generated/aws-cloudwatch-interfaces.generated';

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
  bind(scope: Construct, alarm: IAlarmRef): AlarmActionConfig;
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
