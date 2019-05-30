import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sqs = require('@aws-cdk/aws-sqs');

/**
 * Customize the SQS Queue Event Target
 */
export interface SqsQueueProps {
  /**
   * The message to send to the queue
   *
   * @default the entire CloudWatch event
   */
  readonly message?: events.RuleTargetInput;
}

/**
 * Use an SQS Queue as a target for AWS CloudWatch event rules.
 *
 * @example
 *
 *    // publish to an SQS queue every time code is committed
 *    // to a CodeCommit repository
 *    repository.onCommit(new targets.SqsQueue(queue));
 *
 */
export class SqsQueue implements events.IRuleTarget {
  constructor(public readonly queue: sqs.IQueue, private readonly props: SqsQueueProps = {}) {
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SQS queue as a
   * result from a CloudWatch event.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/resource-based-policies-cwe.html#sqs-permissions
   */
  public bind(_rule: events.IRule): events.RuleTargetProperties {
    // deduplicated automatically
    this.queue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com'));

    return {
      id: this.queue.node.id,
      arn: this.queue.queueArn,
      input: this.props.message,
    };
  }
}
