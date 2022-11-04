import * as events from '@aws-cdk/aws-events';
import * as iam from '@aws-cdk/aws-iam';
import * as sqs from '@aws-cdk/aws-sqs';
import { FeatureFlags } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { addToDeadLetterQueueResourcePolicy, TargetBaseProps, bindBaseTargetConfig } from './util';

/**
 * Customize the SQS Queue Event Target
 */
export interface SqsQueueProps extends TargetBaseProps {

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
   * @default the entire EventBridge event
   */
  readonly message?: events.RuleTargetInput;
}

/**
 * Use an SQS Queue as a target for Amazon EventBridge rules.
 *
 * @example
 *   /// fixture=withRepoAndSqsQueue
 *   // publish to an SQS queue every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.SqsQueue(queue) });
 *
 */
export class SqsQueue implements events.IRuleTarget {

  constructor(public readonly queue: sqs.IQueue, private readonly props: SqsQueueProps = {}) {
    if (props.messageGroupId !== undefined && !queue.fifo) {
      throw new Error('messageGroupId cannot be specified for non-FIFO queues');
    }
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SQS queue as a
   * result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
   */
  public bind(rule: events.IRule, _id?: string): events.RuleTargetConfig {
    const restrictToSameAccount = FeatureFlags.of(rule).isEnabled(cxapi.EVENTS_TARGET_QUEUE_SAME_ACCOUNT);

    let conditions: any = {};
    if (!this.queue.encryptionMasterKey) {
      conditions = {
        ArnEquals: { 'aws:SourceArn': rule.ruleArn },
      };
    } else if (restrictToSameAccount) {
      // Add only the account id as a condition, to avoid circular dependency. See issue #11158.
      conditions = {
        StringEquals: { 'aws:SourceAccount': rule.env.account },
      };
    }

    // deduplicated automatically
    this.queue.grantSendMessages(new iam.ServicePrincipal('events.amazonaws.com', { conditions }));

    if (this.props.deadLetterQueue) {
      addToDeadLetterQueueResourcePolicy(rule, this.props.deadLetterQueue);
    }

    return {
      ...bindBaseTargetConfig(this.props),
      arn: this.queue.queueArn,
      input: this.props.message,
      targetResource: this.queue,
      sqsParameters: this.props.messageGroupId ? { messageGroupId: this.props.messageGroupId } : undefined,
    };
  }

}
