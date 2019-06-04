import { Construct } from "@aws-cdk/cdk";
import { IAlarm } from "./alarm";

/**
 * Interface for objects that can be the targets of CloudWatch alarm actions
 */
export interface IAlarmAction {
  bind(scope: Construct, alarm: IAlarm): AlarmActionProps;
}

/**
 * Properties for an alarm action
 */
export interface AlarmActionProps {
  /**
   * Return the ARN that should be used for a CloudWatch Alarm action
   */
  readonly alarmActionArn: string;
}
