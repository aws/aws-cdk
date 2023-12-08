import { Construct } from 'constructs';
import * as cloudwatch from '../../aws-cloudwatch';
import * as sns from '../../aws-sns';

/**
 * Use an SNS topic as an alarm action
 */
export class SnsAction implements cloudwatch.IAlarmAction {
  private readonly _topic: sns.ITopic;

  constructor(topic: sns.ICfnTopic) {
    this._topic = sns.Topic.fromCfnTopic(topic);
  }

  /**
   * Returns an alarm action configuration to use an SNS topic as an alarm action
   */
  public bind(_scope: Construct, _alarm: cloudwatch.IAlarm): cloudwatch.AlarmActionConfig {
    return { alarmActionArn: this._topic.attrTopicArn };
  }
}
