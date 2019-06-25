import { Construct } from "@aws-cdk/core";
import { IAlarm } from "./alarm";

/**
 * Interface for objects that can be the targets of CloudWatch alarm actions
 */
export interface IAlarmAction {
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
