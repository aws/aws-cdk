import { Construct } from "@aws-cdk/cdk";
import { IAlarm } from "./alarm";

/**
 * Interface for objects that can be the targets of CloudWatch alarm actions
 */
export interface IAlarmAction {
  bind(scope: Construct, alarm: IAlarm): AlarmActionProperties;
}

/**
 * Properties for an alarm action
 */
export interface AlarmActionProperties {
  /**
   * Return the ARN that should be used for a CloudWatch Alarm action
   */
  readonly alarmActionArn: string;
}
