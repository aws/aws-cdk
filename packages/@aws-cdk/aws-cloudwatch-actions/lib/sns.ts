import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import sns = require('@aws-cdk/aws-sns');
import { Construct } from '@aws-cdk/core';

/**
 * Use an SNS topic as an alarm action
 */
export class SnsAction implements cloudwatch.IAlarmAction {
  constructor(private readonly topic: sns.ITopic) {
  }

  public bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this.topic.topicArn };
  }
}
