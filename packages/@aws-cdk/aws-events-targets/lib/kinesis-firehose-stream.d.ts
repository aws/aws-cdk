import * as events from '@aws-cdk/aws-events';
import * as firehose from '@aws-cdk/aws-kinesisfirehose';
/**
 * Customize the Firehose Stream Event Target
 */
export interface KinesisFirehoseStreamProps {
    /**
     * The message to send to the stream.
     *
     * Must be a valid JSON text passed to the target stream.
     *
     * @default - the entire Event Bridge event
     */
    readonly message?: events.RuleTargetInput;
}
/**
 * Customize the Firehose Stream Event Target
 */
export declare class KinesisFirehoseStream implements events.IRuleTarget {
    private readonly stream;
    private readonly props;
    constructor(stream: firehose.CfnDeliveryStream, props?: KinesisFirehoseStreamProps);
    /**
     * Returns a RuleTarget that can be used to trigger this Firehose Stream as a
     * result from a Event Bridge event.
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
