import * as events from '@aws-cdk/aws-events';
import * as sqs from '@aws-cdk/aws-sqs';
import { TargetBaseProps } from './util';
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
export declare class SqsQueue implements events.IRuleTarget {
    readonly queue: sqs.IQueue;
    private readonly props;
    constructor(queue: sqs.IQueue, props?: SqsQueueProps);
    /**
     * Returns a RuleTarget that can be used to trigger this SQS queue as a
     * result from an EventBridge event.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sqs-permissions
     */
    bind(rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
