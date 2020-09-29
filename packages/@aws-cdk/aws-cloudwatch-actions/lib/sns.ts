import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as sns from '@aws-cdk/aws-sns';
import { Construct } from '@aws-cdk/core';

/**
 * Use an SNS topic as an alarm action
 */
export class SnsAction implements cloudwatch.IAlarmAction {
  constructor(private readonly topic: sns.ITopic) {
  }

  /**
   * Returns an alarm action configuration to use an SNS topic as an alarm action
   */
  public bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this.topic.topicArn };
  }
}
