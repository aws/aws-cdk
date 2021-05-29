import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';

/**
 * A SNS topic notification target
 */
export class SnsTopicNotificationTarget implements notifications.IRuleTarget {

  /**
   * @param topic The SNS topic
   */
  constructor(readonly topic: sns.ITopic) {}

  public bind(
    _notificationRule: notifications.IRule,
  ): notifications.TargetConfig {
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));

    return {
      targetType: notifications.TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}