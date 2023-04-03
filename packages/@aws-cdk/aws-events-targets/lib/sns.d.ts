import * as events from '@aws-cdk/aws-events';
import * as sns from '@aws-cdk/aws-sns';
import { TargetBaseProps } from './util';
/**
 * Customize the SNS Topic Event Target
 */
export interface SnsTopicProps extends TargetBaseProps {
    /**
     * The message to send to the topic
     *
     * @default the entire EventBridge event
     */
    readonly message?: events.RuleTargetInput;
}
/**
 * Use an SNS topic as a target for Amazon EventBridge rules.
 *
 * @example
 *   /// fixture=withRepoAndTopic
 *   // publish to an SNS topic every time code is committed
 *   // to a CodeCommit repository
 *   repository.onCommit('onCommit', { target: new targets.SnsTopic(topic) });
 *
 */
export declare class SnsTopic implements events.IRuleTarget {
    readonly topic: sns.ITopic;
    private readonly props;
    constructor(topic: sns.ITopic, props?: SnsTopicProps);
    /**
     * Returns a RuleTarget that can be used to trigger this SNS topic as a
     * result from an EventBridge event.
     *
     * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/resource-based-policies-eventbridge.html#sns-permissions
     */
    bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
