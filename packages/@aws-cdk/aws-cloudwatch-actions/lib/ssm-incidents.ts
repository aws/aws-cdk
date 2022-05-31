import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SSM Incident as an alarm action
 */
export class SsmIncidentAction implements cloudwatch.IAlarmAction {
  constructor(private readonly responsePlanArn: string) {
  }

  /**
   * Returns an alarm action configuration to use an SSM Incident as an alarm action
   * based on an Incident Manager Response Plan
   */
  bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return {
      alarmActionArn: this.responsePlanArn,
    };
  }
}
