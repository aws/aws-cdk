import type { TargetBaseProps } from './util';
import { addToDeadLetterQueueResourcePolicy, bindBaseTargetConfig } from './util';
import * as events from '../../aws-events';
import * as iam from '../../aws-iam';
import type * as sqs from '../../aws-sqs';
import { FeatureFlags } from '../../core';
import * as cxapi from '../../cx-api';

/**
 * Customize the SQS Queue Event Target
 */
export interface SqsQueueProps extends TargetBaseProps {

  /**
   * Message Group ID for messages sent to this queue
   *
   * Required for FIFO queues. For standard queues, this parameter is optional
   * and can be used for SQS fair queue feature and deduplication.
   *
   * @default - no message group ID
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
    // messageGroupId is now supported for both FIFO and standard SQS queues
  }

  /**
   * Returns a RuleTarget that can be used to trigger this SQS queue as a
   * result from an EventBridge event.
   *
   * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
   */
  public bind(rule: events.IRuleRef, _id?: string): events.RuleTargetConfig {
    const restrictToSameAccount = FeatureFlags.of(rule).isEnabled(cxapi.EVENTS_TARGET_QUEUE_SAME_ACCOUNT);

    let conditions: any = {};
    if (!this.queue.encryptionMasterKey) {
      conditions = {
        ArnEquals: { 'aws:SourceArn': events.CfnRule.arnForRule(rule) },
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
