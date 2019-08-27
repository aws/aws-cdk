import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import sqs = require('@aws-cdk/aws-sqs');

/**
 * Customize the SQS Queue Event Target
 */
export interface SqsQueueProps {

  /**
   * Message Group ID for messages sent to this queue
   *
   * Required for FIFO queues, leave empty for regular queues.
   *
   * @default - no message group ID (regular queue)
   */
  readonly messageGroupId?: string;

  /**
   * The message to send to the queue.
   *
   * Must be a valid JSON text passed to the target queue.
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
    if (typeof props.messageGroupId !== 'undefined' && !queue.fifo) {
      throw new Error('MessageGroupId cannot be specified for non-FIFO queues.');
    }
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SQS queue as a
   * result from a CloudWatch event.
   *
   * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/resource-based-policies-cwe.html#sqs-permissions
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    // deduplicated automatically
    this.queue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com',
      {
        conditions: {
          ArnEquals: { "aws:SourceArn": rule.ruleArn }
        }
      })
    );

    const result: events.RuleTargetConfig = {
      id: '',
      arn: this.queue.queueArn,
      input: this.props.message,
      targetResource: this.queue,
    };
    if (!!this.props.messageGroupId) {
      Object.assign(result, { sqsParameters: { messageGroupId: this.props.messageGroupId } });
    }
    return result;

  }

}
