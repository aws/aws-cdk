import * as events from '@aws-cdk/aws-events';
import * as kinesis from '@aws-cdk/aws-kinesis';
/**
 * Customize the Kinesis Stream Event Target
 */
export interface KinesisStreamProps {
    /**
     * Partition Key Path for records sent to this stream
     *
     * @default - eventId as the partition key
     */
    readonly partitionKeyPath?: string;
    /**
     * The message to send to the stream.
     *
     * Must be a valid JSON text passed to the target stream.
     *
     * @default - the entire CloudWatch event
     */
    readonly message?: events.RuleTargetInput;
}
/**
 * Use a Kinesis Stream as a target for AWS CloudWatch event rules.
 *
 * @example
 *   /// fixture=withRepoAndKinesisStream
 *   // put to a Kinesis stream every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.KinesisStream(stream) });
 *
 */
export declare class KinesisStream implements events.IRuleTarget {
    private readonly stream;
    private readonly props;
    constructor(stream: kinesis.IStream, props?: KinesisStreamProps);
    /**
     * Returns a RuleTarget that can be used to trigger this Kinesis Stream as a
     * result from a CloudWatch event.
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
