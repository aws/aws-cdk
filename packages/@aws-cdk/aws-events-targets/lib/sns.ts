import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sns = require('@aws-cdk/aws-sns');

/**
 * Customize the SNS Topic Event Target
 */
export interface SnsTopicProps {
  /**
   * The message to send to the topic
   *
   * @default the entire CloudWatch event
   */
  readonly message?: events.RuleTargetInput;
}

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
export class SnsTopic implements events.IRuleTarget {
  constructor(public readonly topic: sns.ITopic, private readonly props: SnsTopicProps = {}) {
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SNS topic as a
   * result from a CloudWatch event.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/resource-based-policies-cwe.html#sns-permissions
   */
  public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
    // deduplicated automatically
    this.topic.grantPublish(new iam.ServicePrincipal('events.amazonaws.com'));

    return {
      id: '',
      arn: this.topic.topicArn,
      input: this.props.message,
      targetResource: this.topic,
    };
  }
}
