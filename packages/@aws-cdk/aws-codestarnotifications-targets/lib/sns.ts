import * as notifications from '@aws-cdk/aws-codestarnotifications';
import * as iam from '@aws-cdk/aws-iam';
import * as sns from '@aws-cdk/aws-sns';

/**
 * A SNS topic notification target
 */
export class SnsTopic implements notifications.IRuleTarget {
  /**
   * @param topic The SNS topic
   */
  constructor(readonly topic: sns.ITopic) {}

  public bind(_rule: notifications.IRule): notifications.RuleTargetConfig {
    // SNS topic need to grant codestar-notifications service to publish
    // @see https://docs.aws.amazon.com/dtconsole/latest/userguide/set-up-sns.html
    this.topic.grantPublish(new iam.ServicePrincipal('codestar-notifications.amazonaws.com'));

    return {
      targetType: notifications.TargetType.SNS,
      targetAddress: this.topic.topicArn,
    };
  }
}