import { IQueue } from '@aws-cdk/aws-sqs';
import { Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { SubscriptionFilter } from './subscription-filter';
import { ITopic } from './topic-base';
/**
 * Options for creating a new subscription
 */
export interface SubscriptionOptions {
    /**
     * What type of subscription to add.
     */
    readonly protocol: SubscriptionProtocol;
    /**
     * The subscription endpoint.
     *
     * The meaning of this value depends on the value for 'protocol'.
     */
    readonly endpoint: string;
    /**
     * true if raw message delivery is enabled for the subscription. Raw messages are free of JSON formatting and can be
     * sent to HTTP/S and Amazon SQS endpoints. For more information, see GetSubscriptionAttributes in the Amazon Simple
     * Notification Service API Reference.
     *
     * @default false
     */
    readonly rawMessageDelivery?: boolean;
    /**
     * The filter policy.
     *
     * @default - all messages are delivered
     */
    readonly filterPolicy?: {
        [attribute: string]: SubscriptionFilter;
    };
    /**
     * The filter policy that is applied on the message body.
     * To apply a filter policy to the message attributes, use `filterPolicy`. A maximum of one of `filterPolicyWithMessageBody` and `filterPolicy` may be used.
     *
     * @default - all messages are delivered
     */
    readonly filterPolicyWithMessageBody?: {
        [attribute: string]: FilterOrPolicy;
    };
    /**
     * The region where the topic resides, in the case of cross-region subscriptions
     * @link https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-region
     * @default - the region where the CloudFormation stack is being deployed.
     */
    readonly region?: string;
    /**
     * Queue to be used as dead letter queue.
     * If not passed no dead letter queue is enabled.
     *
     * @default - No dead letter queue enabled.
     */
    readonly deadLetterQueue?: IQueue;
    /**
     * Arn of role allowing access to firehose delivery stream.
     * Required for a firehose subscription protocol.
     * @default - No subscription role is provided
     */
    readonly subscriptionRoleArn?: string;
}
/**
 * Properties for creating a new subscription
 */
export interface SubscriptionProps extends SubscriptionOptions {
    /**
     * The topic to subscribe to.
     */
    readonly topic: ITopic;
}
/**
 * A new subscription.
 *
 * Prefer to use the `ITopic.addSubscription()` methods to create instances of
 * this class.
 */
export declare class Subscription extends Resource {
    /**
     * The DLQ associated with this subscription if present.
     */
    readonly deadLetterQueue?: IQueue;
    private readonly filterPolicy?;
    private readonly filterPolicyWithMessageBody?;
    constructor(scope: Construct, id: string, props: SubscriptionProps);
    private buildDeadLetterQueue;
    private buildDeadLetterConfig;
}
/**
 * The type of subscription, controlling the type of the endpoint parameter.
 */
export declare enum SubscriptionProtocol {
    /**
     * JSON-encoded message is POSTED to an HTTP url.
     */
    HTTP = "http",
    /**
     * JSON-encoded message is POSTed to an HTTPS url.
     */
    HTTPS = "https",
    /**
     * Notifications are sent via email.
     */
    EMAIL = "email",
    /**
     * Notifications are JSON-encoded and sent via mail.
     */
    EMAIL_JSON = "email-json",
    /**
     * Notification is delivered by SMS
     */
    SMS = "sms",
    /**
     * Notifications are enqueued into an SQS queue.
     */
    SQS = "sqs",
    /**
     * JSON-encoded notifications are sent to a mobile app endpoint.
     */
    APPLICATION = "application",
    /**
     * Notifications trigger a Lambda function.
     */
    LAMBDA = "lambda",
    /**
     * Notifications put records into a firehose delivery stream.
     */
    FIREHOSE = "firehose"
}
/**
 * The type of the MessageBody at a given key value pair
 */
export declare enum FilterOrPolicyType {
    /**
     * The filter of the MessageBody
     */
    FILTER = 0,
    /**
     * A nested key of the MessageBody
     */
    POLICY = 1
}
/**
 * Class for building the FilterPolicy by avoiding union types
 */
export declare abstract class FilterOrPolicy {
    /**
     * Filter of MessageBody
     * @param filter
     * @returns
     */
    static filter(filter: SubscriptionFilter): Filter;
    /**
     * Policy of MessageBody
     * @param policy
     * @returns
     */
    static policy(policy: {
        [attribute: string]: FilterOrPolicy;
    }): Policy;
    /**
     * Type switch for disambiguating between subclasses
     */
    abstract readonly type: FilterOrPolicyType;
    /**
     * Check if instance is `Policy` type
     */
    isPolicy(): this is Policy;
    /**
     * Check if instance is `Filter` type
     */
    isFilter(): this is Filter;
}
/**
 * Filter implementation of FilterOrPolicy
 */
export declare class Filter extends FilterOrPolicy {
    readonly filterDoc: SubscriptionFilter;
    /**
     * Type used in DFS buildFilterPolicyWithMessageBody to determine json value type
     */
    readonly type = FilterOrPolicyType.FILTER;
    /**
     * Policy constructor
     * @param filterDoc filter argument to construct
     */
    constructor(filterDoc: SubscriptionFilter);
}
/**
 * Policy Implementation of FilterOrPolicy
 */
export declare class Policy extends FilterOrPolicy {
    readonly policyDoc: {
        [attribute: string]: FilterOrPolicy;
    };
    /**
     * Type used in DFS buildFilterPolicyWithMessageBody to determine json value type
     */
    readonly type = FilterOrPolicyType.POLICY;
    /**
     * Policy constructor
     * @param policyDoc policy argument to construct
     */
    constructor(policyDoc: {
        [attribute: string]: FilterOrPolicy;
    });
}
