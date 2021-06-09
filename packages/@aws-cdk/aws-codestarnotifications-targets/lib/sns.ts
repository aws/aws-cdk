import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';

/**
 * A SNS topic notification target
 */
export class SnsTopic implements notifications.INotificationRuleTarget {
  /**
   * @param topic The SNS topic
   */
  constructor(readonly topic: sns.ITopic) {}

  public bind(_rule: notifications.INotificationRule): notifications.NotificationRuleTargetConfig {
    // SNS topic need to grant codestar-notifications service to publish
    // @see https://docs.aws.amazon.com/dtconsole/latest/userguide/set-up-sns.html
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));
    return {
      targetType: 'SNS',
      targetAddress: this.topic.topicArn,
    };
  }
}