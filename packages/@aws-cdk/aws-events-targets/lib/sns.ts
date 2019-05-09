import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');

/**
 * Use an SNS topic as a target for AWS CloudWatch event rules.
 *
 * @example
 *
 *    // publish to an SNS topic every time code is committed
 *    // to a CodeCommit repository
 *    repository.onCommit(new targets.SnsTopic(topic));
 *
 */
export class SnsTopic implements events.IEventRuleTarget {
  constructor(public readonly topic: sns.ITopic) {

  }

  /**
   * Returns a RuleTarget that can be used to trigger this SNS topic as a
   * result from a CloudWatch event.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/resource-based-policies-cwe.html#sns-permissions
   */
  public bind(_rule: events.IEventRule): events.EventRuleTargetProperties {
    // deduplicated automatically
    this.topic.grantPublish(new iam.ServicePrincipal('events.amazonaws.com'));

    return {
      id: this.topic.node.id,
      arn: this.topic.topicArn,
    };
  }
}
