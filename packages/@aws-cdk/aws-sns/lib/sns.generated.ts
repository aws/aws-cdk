// Copyright 2012-2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// Generated from the AWS CloudFormation Resource Specification
// See: docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html
// @cfn2ts:meta@ {"generated":"2023-03-12T15:20:48.162Z","fingerprint":"hAuchepd+fKa8L3LT3yxSJxv4BkNbvqBPwMkGpF9mNo="}

/* eslint-disable max-len */ // This is generated code - line lengths are difficult to control

import * as constructs from 'constructs';
import * as cdk from '@aws-cdk/core';
import * as cfn_parse from '@aws-cdk/core/lib/helpers-internal';

/**
 * Properties for defining a `CfnSubscription`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html
 */
export interface CfnSubscriptionProps {

    /**
     * The subscription's protocol. For more information, see the `Protocol` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-protocol
     */
    readonly protocol: string;

    /**
     * The ARN of the topic to subscribe to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#topicarn
     */
    readonly topicArn: string;

    /**
     * The delivery policy JSON assigned to the subscription. Enables the subscriber to define the message delivery retry strategy in the case of an HTTP/S endpoint subscribed to the topic. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* and [Message delivery retries](https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html) in the *Amazon SNS Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-deliverypolicy
     */
    readonly deliveryPolicy?: any | cdk.IResolvable;

    /**
     * The subscription's endpoint. The endpoint value depends on the protocol that you specify. For more information, see the `Endpoint` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-endpoint
     */
    readonly endpoint?: string;

    /**
     * The filter policy JSON assigned to the subscription. Enables the subscriber to filter out unwanted messages. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* and [Message filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html) in the *Amazon SNS Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-filterpolicy
     */
    readonly filterPolicy?: any | cdk.IResolvable;

    /**
     * This attribute lets you choose the filtering scope by using one of the following string value types:
     *
     * - `MessageAttributes` (default) - The filter is applied on the message attributes.
     * - `MessageBody` - The filter is applied on the message body.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-filterpolicyscope
     */
    readonly filterPolicyScope?: string;

    /**
     * When set to `true` , enables raw message delivery. Raw messages don't contain any JSON formatting and can be sent to Amazon SQS and HTTP/S endpoints. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-rawmessagedelivery
     */
    readonly rawMessageDelivery?: boolean | cdk.IResolvable;

    /**
     * When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue. Messages that can't be delivered due to client errors (for example, when the subscribed endpoint is unreachable) or server errors (for example, when the service that powers the subscribed endpoint becomes unavailable) are held in the dead-letter queue for further analysis or reprocessing.
     *
     * For more information about the redrive policy and dead-letter queues, see [Amazon SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) in the *Amazon SQS Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-redrivepolicy
     */
    readonly redrivePolicy?: any | cdk.IResolvable;

    /**
     * For cross-region subscriptions, the region in which the topic resides.
     *
     * If no region is specified, AWS CloudFormation uses the region of the caller as the default.
     *
     * If you perform an update operation that only updates the `Region` property of a `AWS::SNS::Subscription` resource, that operation will fail unless you are either:
     *
     * - Updating the `Region` from `NULL` to the caller region.
     * - Updating the `Region` from the caller region to `NULL` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-region
     */
    readonly region?: string;

    /**
     * This property applies only to Amazon Kinesis Data Firehose delivery stream subscriptions. Specify the ARN of the IAM role that has the following:
     *
     * - Permission to write to the Amazon Kinesis Data Firehose delivery stream
     * - Amazon SNS listed as a trusted entity
     *
     * Specifying a valid ARN for this attribute is required for Kinesis Data Firehose delivery stream subscriptions. For more information, see [Fanout to Amazon Kinesis Data Firehose delivery streams](https://docs.aws.amazon.com/sns/latest/dg/sns-firehose-as-subscriber.html) in the *Amazon SNS Developer Guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-subscriptionrolearn
     */
    readonly subscriptionRoleArn?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionProps`
 *
 * @returns the result of the validation.
 */
function CfnSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('deliveryPolicy', cdk.validateObject)(properties.deliveryPolicy));
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    errors.collect(cdk.propertyValidator('filterPolicy', cdk.validateObject)(properties.filterPolicy));
    errors.collect(cdk.propertyValidator('filterPolicyScope', cdk.validateString)(properties.filterPolicyScope));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    errors.collect(cdk.propertyValidator('rawMessageDelivery', cdk.validateBoolean)(properties.rawMessageDelivery));
    errors.collect(cdk.propertyValidator('redrivePolicy', cdk.validateObject)(properties.redrivePolicy));
    errors.collect(cdk.propertyValidator('region', cdk.validateString)(properties.region));
    errors.collect(cdk.propertyValidator('subscriptionRoleArn', cdk.validateString)(properties.subscriptionRoleArn));
    errors.collect(cdk.propertyValidator('topicArn', cdk.requiredValidator)(properties.topicArn));
    errors.collect(cdk.propertyValidator('topicArn', cdk.validateString)(properties.topicArn));
    return errors.wrap('supplied properties not correct for "CfnSubscriptionProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SNS::Subscription` resource
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SNS::Subscription` resource.
 */
// @ts-ignore TS6133
function cfnSubscriptionPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnSubscriptionPropsValidator(properties).assertSuccess();
    return {
        Protocol: cdk.stringToCloudFormation(properties.protocol),
        TopicArn: cdk.stringToCloudFormation(properties.topicArn),
        DeliveryPolicy: cdk.objectToCloudFormation(properties.deliveryPolicy),
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
        FilterPolicy: cdk.objectToCloudFormation(properties.filterPolicy),
        FilterPolicyScope: cdk.stringToCloudFormation(properties.filterPolicyScope),
        RawMessageDelivery: cdk.booleanToCloudFormation(properties.rawMessageDelivery),
        RedrivePolicy: cdk.objectToCloudFormation(properties.redrivePolicy),
        Region: cdk.stringToCloudFormation(properties.region),
        SubscriptionRoleArn: cdk.stringToCloudFormation(properties.subscriptionRoleArn),
    };
}

// @ts-ignore TS6133
function CfnSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubscriptionProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionProps>();
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addPropertyResult('topicArn', 'TopicArn', cfn_parse.FromCloudFormation.getString(properties.TopicArn));
    ret.addPropertyResult('deliveryPolicy', 'DeliveryPolicy', properties.DeliveryPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DeliveryPolicy) : undefined);
    ret.addPropertyResult('endpoint', 'Endpoint', properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined);
    ret.addPropertyResult('filterPolicy', 'FilterPolicy', properties.FilterPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.FilterPolicy) : undefined);
    ret.addPropertyResult('filterPolicyScope', 'FilterPolicyScope', properties.FilterPolicyScope != null ? cfn_parse.FromCloudFormation.getString(properties.FilterPolicyScope) : undefined);
    ret.addPropertyResult('rawMessageDelivery', 'RawMessageDelivery', properties.RawMessageDelivery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RawMessageDelivery) : undefined);
    ret.addPropertyResult('redrivePolicy', 'RedrivePolicy', properties.RedrivePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.RedrivePolicy) : undefined);
    ret.addPropertyResult('region', 'Region', properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined);
    ret.addPropertyResult('subscriptionRoleArn', 'SubscriptionRoleArn', properties.SubscriptionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionRoleArn) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SNS::Subscription`
 *
 * The `AWS::SNS::Subscription` resource subscribes an endpoint to an Amazon SNS topic. For a subscription to be created, the owner of the endpoint must confirm the subscription.
 *
 * @cloudformationResource AWS::SNS::Subscription
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html
 */
export class CfnSubscription extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SNS::Subscription";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSubscription {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnSubscriptionPropsFromCloudFormation(resourceProperties);
        const ret = new CfnSubscription(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * The subscription's protocol. For more information, see the `Protocol` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-protocol
     */
    public protocol: string;

    /**
     * The ARN of the topic to subscribe to.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#topicarn
     */
    public topicArn: string;

    /**
     * The delivery policy JSON assigned to the subscription. Enables the subscriber to define the message delivery retry strategy in the case of an HTTP/S endpoint subscribed to the topic. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* and [Message delivery retries](https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html) in the *Amazon SNS Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-deliverypolicy
     */
    public deliveryPolicy: any | cdk.IResolvable | undefined;

    /**
     * The subscription's endpoint. The endpoint value depends on the protocol that you specify. For more information, see the `Endpoint` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-endpoint
     */
    public endpoint: string | undefined;

    /**
     * The filter policy JSON assigned to the subscription. Enables the subscriber to filter out unwanted messages. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* and [Message filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html) in the *Amazon SNS Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-filterpolicy
     */
    public filterPolicy: any | cdk.IResolvable | undefined;

    /**
     * This attribute lets you choose the filtering scope by using one of the following string value types:
     *
     * - `MessageAttributes` (default) - The filter is applied on the message attributes.
     * - `MessageBody` - The filter is applied on the message body.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-filterpolicyscope
     */
    public filterPolicyScope: string | undefined;

    /**
     * When set to `true` , enables raw message delivery. Raw messages don't contain any JSON formatting and can be sent to Amazon SQS and HTTP/S endpoints. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-rawmessagedelivery
     */
    public rawMessageDelivery: boolean | cdk.IResolvable | undefined;

    /**
     * When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue. Messages that can't be delivered due to client errors (for example, when the subscribed endpoint is unreachable) or server errors (for example, when the service that powers the subscribed endpoint becomes unavailable) are held in the dead-letter queue for further analysis or reprocessing.
     *
     * For more information about the redrive policy and dead-letter queues, see [Amazon SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) in the *Amazon SQS Developer Guide* .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-redrivepolicy
     */
    public redrivePolicy: any | cdk.IResolvable | undefined;

    /**
     * For cross-region subscriptions, the region in which the topic resides.
     *
     * If no region is specified, AWS CloudFormation uses the region of the caller as the default.
     *
     * If you perform an update operation that only updates the `Region` property of a `AWS::SNS::Subscription` resource, that operation will fail unless you are either:
     *
     * - Updating the `Region` from `NULL` to the caller region.
     * - Updating the `Region` from the caller region to `NULL` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-region
     */
    public region: string | undefined;

    /**
     * This property applies only to Amazon Kinesis Data Firehose delivery stream subscriptions. Specify the ARN of the IAM role that has the following:
     *
     * - Permission to write to the Amazon Kinesis Data Firehose delivery stream
     * - Amazon SNS listed as a trusted entity
     *
     * Specifying a valid ARN for this attribute is required for Kinesis Data Firehose delivery stream subscriptions. For more information, see [Fanout to Amazon Kinesis Data Firehose delivery streams](https://docs.aws.amazon.com/sns/latest/dg/sns-firehose-as-subscriber.html) in the *Amazon SNS Developer Guide.*
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-subscriptionrolearn
     */
    public subscriptionRoleArn: string | undefined;

    /**
     * Create a new `AWS::SNS::Subscription`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnSubscriptionProps) {
        super(scope, id, { type: CfnSubscription.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'protocol', this);
        cdk.requireProperty(props, 'topicArn', this);

        this.protocol = props.protocol;
        this.topicArn = props.topicArn;
        this.deliveryPolicy = props.deliveryPolicy;
        this.endpoint = props.endpoint;
        this.filterPolicy = props.filterPolicy;
        this.filterPolicyScope = props.filterPolicyScope;
        this.rawMessageDelivery = props.rawMessageDelivery;
        this.redrivePolicy = props.redrivePolicy;
        this.region = props.region;
        this.subscriptionRoleArn = props.subscriptionRoleArn;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscription.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            protocol: this.protocol,
            topicArn: this.topicArn,
            deliveryPolicy: this.deliveryPolicy,
            endpoint: this.endpoint,
            filterPolicy: this.filterPolicy,
            filterPolicyScope: this.filterPolicyScope,
            rawMessageDelivery: this.rawMessageDelivery,
            redrivePolicy: this.redrivePolicy,
            region: this.region,
            subscriptionRoleArn: this.subscriptionRoleArn,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnSubscriptionPropsToCloudFormation(props);
    }
}

/**
 * Properties for defining a `CfnTopic`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
 */
export interface CfnTopicProps {

    /**
     * Enables content-based deduplication for FIFO topics.
     *
     * - By default, `ContentBasedDeduplication` is set to `false` . If you create a FIFO topic and this attribute is `false` , you must specify a value for the `MessageDeduplicationId` parameter for the [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) action.
     * - When you set `ContentBasedDeduplication` to `true` , Amazon SNS uses a SHA-256 hash to generate the `MessageDeduplicationId` using the body of the message (but not the attributes of the message).
     *
     * (Optional) To override the generated value, you can specify a value for the the `MessageDeduplicationId` parameter for the `Publish` action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-contentbaseddeduplication
     */
    readonly contentBasedDeduplication?: boolean | cdk.IResolvable;

    /**
     * The body of the policy document you want to use for this topic.
     *
     * You can only add one policy per topic.
     *
     * The policy must be in JSON string format.
     *
     * Length Constraints: Maximum length of 30,720.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-dataprotectionpolicy
     */
    readonly dataProtectionPolicy?: any | cdk.IResolvable;

    /**
     * The display name to use for an Amazon SNS topic with SMS subscriptions. The display name must be maximum 100 characters long, including hyphens (-), underscores (_), spaces, and tabs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-displayname
     */
    readonly displayName?: string;

    /**
     * Set to true to create a FIFO topic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-fifotopic
     */
    readonly fifoTopic?: boolean | cdk.IResolvable;

    /**
     * The ID of an AWS managed customer master key (CMK) for Amazon SNS or a custom CMK. For more information, see [Key terms](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html#sse-key-terms) . For more examples, see `[KeyId](https://docs.aws.amazon.com/kms/latest/APIReference/API_DescribeKey.html#API_DescribeKey_RequestParameters)` in the *AWS Key Management Service API Reference* .
     *
     * This property applies only to [server-side-encryption](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-kmsmasterkeyid
     */
    readonly kmsMasterKeyId?: string;

    /**
     * The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS. By default, `SignatureVersion` is set to `1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-signatureversion
     */
    readonly signatureVersion?: string;

    /**
     * The Amazon SNS subscriptions (endpoints) for this topic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-subscription
     */
    readonly subscription?: Array<CfnTopic.SubscriptionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The list of tags to add to a new topic.
     *
     * > To be able to tag a topic on creation, you must have the `sns:CreateTopic` and `sns:TagResource` permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tags
     */
    readonly tags?: cdk.CfnTag[];

    /**
     * The name of the topic you want to create. Topic names must include only uppercase and lowercase ASCII letters, numbers, underscores, and hyphens, and must be between 1 and 256 characters long. FIFO topic names must end with `.fifo` .
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the topic name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-topicname
     */
    readonly topicName?: string;

    /**
     * Tracing mode of an Amazon SNS topic. By default `TracingConfig` is set to `PassThrough` , and the topic passes through the tracing header it receives from an SNS publisher to its subscriptions. If set to `Active` , SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true. Only supported on standard topics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tracingconfig
     */
    readonly tracingConfig?: string;
}

/**
 * Determine whether the given properties match those of a `CfnTopicProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicProps`
 *
 * @returns the result of the validation.
 */
function CfnTopicPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('contentBasedDeduplication', cdk.validateBoolean)(properties.contentBasedDeduplication));
    errors.collect(cdk.propertyValidator('dataProtectionPolicy', cdk.validateObject)(properties.dataProtectionPolicy));
    errors.collect(cdk.propertyValidator('displayName', cdk.validateString)(properties.displayName));
    errors.collect(cdk.propertyValidator('fifoTopic', cdk.validateBoolean)(properties.fifoTopic));
    errors.collect(cdk.propertyValidator('kmsMasterKeyId', cdk.validateString)(properties.kmsMasterKeyId));
    errors.collect(cdk.propertyValidator('signatureVersion', cdk.validateString)(properties.signatureVersion));
    errors.collect(cdk.propertyValidator('subscription', cdk.listValidator(CfnTopic_SubscriptionPropertyValidator))(properties.subscription));
    errors.collect(cdk.propertyValidator('tags', cdk.listValidator(cdk.validateCfnTag))(properties.tags));
    errors.collect(cdk.propertyValidator('topicName', cdk.validateString)(properties.topicName));
    errors.collect(cdk.propertyValidator('tracingConfig', cdk.validateString)(properties.tracingConfig));
    return errors.wrap('supplied properties not correct for "CfnTopicProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SNS::Topic` resource
 *
 * @param properties - the TypeScript properties of a `CfnTopicProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SNS::Topic` resource.
 */
// @ts-ignore TS6133
function cfnTopicPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTopicPropsValidator(properties).assertSuccess();
    return {
        ContentBasedDeduplication: cdk.booleanToCloudFormation(properties.contentBasedDeduplication),
        DataProtectionPolicy: cdk.objectToCloudFormation(properties.dataProtectionPolicy),
        DisplayName: cdk.stringToCloudFormation(properties.displayName),
        FifoTopic: cdk.booleanToCloudFormation(properties.fifoTopic),
        KmsMasterKeyId: cdk.stringToCloudFormation(properties.kmsMasterKeyId),
        SignatureVersion: cdk.stringToCloudFormation(properties.signatureVersion),
        Subscription: cdk.listMapper(cfnTopicSubscriptionPropertyToCloudFormation)(properties.subscription),
        Tags: cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
        TopicName: cdk.stringToCloudFormation(properties.topicName),
        TracingConfig: cdk.stringToCloudFormation(properties.tracingConfig),
    };
}

// @ts-ignore TS6133
function CfnTopicPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicProps>();
    ret.addPropertyResult('contentBasedDeduplication', 'ContentBasedDeduplication', properties.ContentBasedDeduplication != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContentBasedDeduplication) : undefined);
    ret.addPropertyResult('dataProtectionPolicy', 'DataProtectionPolicy', properties.DataProtectionPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DataProtectionPolicy) : undefined);
    ret.addPropertyResult('displayName', 'DisplayName', properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined);
    ret.addPropertyResult('fifoTopic', 'FifoTopic', properties.FifoTopic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FifoTopic) : undefined);
    ret.addPropertyResult('kmsMasterKeyId', 'KmsMasterKeyId', properties.KmsMasterKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsMasterKeyId) : undefined);
    ret.addPropertyResult('signatureVersion', 'SignatureVersion', properties.SignatureVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SignatureVersion) : undefined);
    ret.addPropertyResult('subscription', 'Subscription', properties.Subscription != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicSubscriptionPropertyFromCloudFormation)(properties.Subscription) : undefined);
    ret.addPropertyResult('tags', 'Tags', properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined as any);
    ret.addPropertyResult('topicName', 'TopicName', properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined);
    ret.addPropertyResult('tracingConfig', 'TracingConfig', properties.TracingConfig != null ? cfn_parse.FromCloudFormation.getString(properties.TracingConfig) : undefined);
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SNS::Topic`
 *
 * The `AWS::SNS::Topic` resource creates a topic to which notifications can be published.
 *
 * > One account can create a maximum of 100,000 standard topics and 1,000 FIFO topics. For more information, see [Amazon SNS endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/sns.html) in the *AWS General Reference* .
 *
 * @cloudformationResource AWS::SNS::Topic
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
 */
export class CfnTopic extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SNS::Topic";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTopic {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTopicPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTopic(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * Returns the ARN of an Amazon SNS topic.
     * @cloudformationAttribute TopicArn
     */
    public readonly attrTopicArn: string;

    /**
     * Returns the name of an Amazon SNS topic.
     * @cloudformationAttribute TopicName
     */
    public readonly attrTopicName: string;

    /**
     * Enables content-based deduplication for FIFO topics.
     *
     * - By default, `ContentBasedDeduplication` is set to `false` . If you create a FIFO topic and this attribute is `false` , you must specify a value for the `MessageDeduplicationId` parameter for the [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) action.
     * - When you set `ContentBasedDeduplication` to `true` , Amazon SNS uses a SHA-256 hash to generate the `MessageDeduplicationId` using the body of the message (but not the attributes of the message).
     *
     * (Optional) To override the generated value, you can specify a value for the the `MessageDeduplicationId` parameter for the `Publish` action.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-contentbaseddeduplication
     */
    public contentBasedDeduplication: boolean | cdk.IResolvable | undefined;

    /**
     * The body of the policy document you want to use for this topic.
     *
     * You can only add one policy per topic.
     *
     * The policy must be in JSON string format.
     *
     * Length Constraints: Maximum length of 30,720.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-dataprotectionpolicy
     */
    public dataProtectionPolicy: any | cdk.IResolvable | undefined;

    /**
     * The display name to use for an Amazon SNS topic with SMS subscriptions. The display name must be maximum 100 characters long, including hyphens (-), underscores (_), spaces, and tabs.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-displayname
     */
    public displayName: string | undefined;

    /**
     * Set to true to create a FIFO topic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-fifotopic
     */
    public fifoTopic: boolean | cdk.IResolvable | undefined;

    /**
     * The ID of an AWS managed customer master key (CMK) for Amazon SNS or a custom CMK. For more information, see [Key terms](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html#sse-key-terms) . For more examples, see `[KeyId](https://docs.aws.amazon.com/kms/latest/APIReference/API_DescribeKey.html#API_DescribeKey_RequestParameters)` in the *AWS Key Management Service API Reference* .
     *
     * This property applies only to [server-side-encryption](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html) .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-kmsmasterkeyid
     */
    public kmsMasterKeyId: string | undefined;

    /**
     * The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS. By default, `SignatureVersion` is set to `1` .
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-signatureversion
     */
    public signatureVersion: string | undefined;

    /**
     * The Amazon SNS subscriptions (endpoints) for this topic.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-subscription
     */
    public subscription: Array<CfnTopic.SubscriptionProperty | cdk.IResolvable> | cdk.IResolvable | undefined;

    /**
     * The list of tags to add to a new topic.
     *
     * > To be able to tag a topic on creation, you must have the `sns:CreateTopic` and `sns:TagResource` permissions.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tags
     */
    public readonly tags: cdk.TagManager;

    /**
     * The name of the topic you want to create. Topic names must include only uppercase and lowercase ASCII letters, numbers, underscores, and hyphens, and must be between 1 and 256 characters long. FIFO topic names must end with `.fifo` .
     *
     * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the topic name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
     *
     * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-topicname
     */
    public topicName: string | undefined;

    /**
     * Tracing mode of an Amazon SNS topic. By default `TracingConfig` is set to `PassThrough` , and the topic passes through the tracing header it receives from an SNS publisher to its subscriptions. If set to `Active` , SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true. Only supported on standard topics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tracingconfig
     */
    public tracingConfig: string | undefined;

    /**
     * Create a new `AWS::SNS::Topic`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTopicProps = {}) {
        super(scope, id, { type: CfnTopic.CFN_RESOURCE_TYPE_NAME, properties: props });
        this.attrTopicArn = cdk.Token.asString(this.getAtt('TopicArn', cdk.ResolutionTypeHint.STRING));
        this.attrTopicName = cdk.Token.asString(this.getAtt('TopicName', cdk.ResolutionTypeHint.STRING));

        this.contentBasedDeduplication = props.contentBasedDeduplication;
        this.dataProtectionPolicy = props.dataProtectionPolicy;
        this.displayName = props.displayName;
        this.fifoTopic = props.fifoTopic;
        this.kmsMasterKeyId = props.kmsMasterKeyId;
        this.signatureVersion = props.signatureVersion;
        this.subscription = props.subscription;
        this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SNS::Topic", props.tags, { tagPropertyName: 'tags' });
        this.topicName = props.topicName;
        this.tracingConfig = props.tracingConfig;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopic.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            contentBasedDeduplication: this.contentBasedDeduplication,
            dataProtectionPolicy: this.dataProtectionPolicy,
            displayName: this.displayName,
            fifoTopic: this.fifoTopic,
            kmsMasterKeyId: this.kmsMasterKeyId,
            signatureVersion: this.signatureVersion,
            subscription: this.subscription,
            tags: this.tags.renderTags(),
            topicName: this.topicName,
            tracingConfig: this.tracingConfig,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTopicPropsToCloudFormation(props);
    }
}

export namespace CfnTopic {
    /**
     * `Subscription` is an embedded property that describes the subscription endpoints of an Amazon SNS topic.
     *
     * > For full control over subscription behavior (for example, delivery policy, filtering, raw message delivery, and cross-region subscriptions), use the [AWS::SNS::Subscription](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html) resource.
     *
     * @struct
     * @stability external
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html
     */
    export interface SubscriptionProperty {
        /**
         * The endpoint that receives notifications from the Amazon SNS topic. The endpoint value depends on the protocol that you specify. For more information, see the `Endpoint` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html#cfn-sns-topic-subscription-endpoint
         */
        readonly endpoint: string;
        /**
         * The subscription's protocol. For more information, see the `Protocol` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
         *
         * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html#cfn-sns-topic-subscription-protocol
         */
        readonly protocol: string;
    }
}

/**
 * Determine whether the given properties match those of a `SubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriptionProperty`
 *
 * @returns the result of the validation.
 */
function CfnTopic_SubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('endpoint', cdk.requiredValidator)(properties.endpoint));
    errors.collect(cdk.propertyValidator('endpoint', cdk.validateString)(properties.endpoint));
    errors.collect(cdk.propertyValidator('protocol', cdk.requiredValidator)(properties.protocol));
    errors.collect(cdk.propertyValidator('protocol', cdk.validateString)(properties.protocol));
    return errors.wrap('supplied properties not correct for "SubscriptionProperty"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SNS::Topic.Subscription` resource
 *
 * @param properties - the TypeScript properties of a `SubscriptionProperty`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SNS::Topic.Subscription` resource.
 */
// @ts-ignore TS6133
function cfnTopicSubscriptionPropertyToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTopic_SubscriptionPropertyValidator(properties).assertSuccess();
    return {
        Endpoint: cdk.stringToCloudFormation(properties.endpoint),
        Protocol: cdk.stringToCloudFormation(properties.protocol),
    };
}

// @ts-ignore TS6133
function CfnTopicSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopic.SubscriptionProperty | cdk.IResolvable> {
    if (cdk.isResolvableObject(properties)) {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopic.SubscriptionProperty>();
    ret.addPropertyResult('endpoint', 'Endpoint', cfn_parse.FromCloudFormation.getString(properties.Endpoint));
    ret.addPropertyResult('protocol', 'Protocol', cfn_parse.FromCloudFormation.getString(properties.Protocol));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * Properties for defining a `CfnTopicPolicy`
 *
 * @struct
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html
 */
export interface CfnTopicPolicyProps {

    /**
     * A policy document that contains permissions to add to the specified SNS topics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html#cfn-sns-topicpolicy-policydocument
     */
    readonly policyDocument: any | cdk.IResolvable;

    /**
     * The Amazon Resource Names (ARN) of the topics to which you want to add the policy. You can use the `[Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)` function to specify an `[AWS::SNS::Topic](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html)` resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html#cfn-sns-topicpolicy-topics
     */
    readonly topics: string[];
}

/**
 * Determine whether the given properties match those of a `CfnTopicPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicPolicyProps`
 *
 * @returns the result of the validation.
 */
function CfnTopicPolicyPropsValidator(properties: any): cdk.ValidationResult {
    if (!cdk.canInspect(properties)) { return cdk.VALIDATION_SUCCESS; }
    const errors = new cdk.ValidationResults();
    if (typeof properties !== 'object') {
        errors.collect(new cdk.ValidationResult('Expected an object, but received: ' + JSON.stringify(properties)));
    }
    errors.collect(cdk.propertyValidator('policyDocument', cdk.requiredValidator)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('policyDocument', cdk.validateObject)(properties.policyDocument));
    errors.collect(cdk.propertyValidator('topics', cdk.requiredValidator)(properties.topics));
    errors.collect(cdk.propertyValidator('topics', cdk.listValidator(cdk.validateString))(properties.topics));
    return errors.wrap('supplied properties not correct for "CfnTopicPolicyProps"');
}

/**
 * Renders the AWS CloudFormation properties of an `AWS::SNS::TopicPolicy` resource
 *
 * @param properties - the TypeScript properties of a `CfnTopicPolicyProps`
 *
 * @returns the AWS CloudFormation properties of an `AWS::SNS::TopicPolicy` resource.
 */
// @ts-ignore TS6133
function cfnTopicPolicyPropsToCloudFormation(properties: any): any {
    if (!cdk.canInspect(properties)) { return properties; }
    CfnTopicPolicyPropsValidator(properties).assertSuccess();
    return {
        PolicyDocument: cdk.objectToCloudFormation(properties.policyDocument),
        Topics: cdk.listMapper(cdk.stringToCloudFormation)(properties.topics),
    };
}

// @ts-ignore TS6133
function CfnTopicPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicPolicyProps> {
    properties = properties == null ? {} : properties;
    if (typeof properties !== 'object') {
        return new cfn_parse.FromCloudFormationResult(properties);
    }
    const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicPolicyProps>();
    ret.addPropertyResult('policyDocument', 'PolicyDocument', cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument));
    ret.addPropertyResult('topics', 'Topics', cfn_parse.FromCloudFormation.getStringArray(properties.Topics));
    ret.addUnrecognizedPropertiesAsExtra(properties);
    return ret;
}

/**
 * A CloudFormation `AWS::SNS::TopicPolicy`
 *
 * The `AWS::SNS::TopicPolicy` resource associates Amazon SNS topics with a policy. For an example snippet, see [Declaring an Amazon SNS policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-iam.html#scenario-sns-policy) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::SNS::TopicPolicy
 * @stability external
 *
 * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html
 */
export class CfnTopicPolicy extends cdk.CfnResource implements cdk.IInspectable {
    /**
     * The CloudFormation resource type name for this resource class.
     */
    public static readonly CFN_RESOURCE_TYPE_NAME = "AWS::SNS::TopicPolicy";

    /**
     * A factory method that creates a new instance of this class from an object
     * containing the CloudFormation properties of this resource.
     * Used in the @aws-cdk/cloudformation-include module.
     *
     * @internal
     */
    public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTopicPolicy {
        resourceAttributes = resourceAttributes || {};
        const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
        const propsResult = CfnTopicPolicyPropsFromCloudFormation(resourceProperties);
        const ret = new CfnTopicPolicy(scope, id, propsResult.value);
        for (const [propKey, propVal] of Object.entries(propsResult.extraProperties))  {
            ret.addPropertyOverride(propKey, propVal);
        }
        options.parser.handleAttributes(ret, resourceAttributes, id);
        return ret;
    }

    /**
     * A policy document that contains permissions to add to the specified SNS topics.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html#cfn-sns-topicpolicy-policydocument
     */
    public policyDocument: any | cdk.IResolvable;

    /**
     * The Amazon Resource Names (ARN) of the topics to which you want to add the policy. You can use the `[Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)` function to specify an `[AWS::SNS::Topic](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic.html)` resource.
     *
     * @link http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-policy.html#cfn-sns-topicpolicy-topics
     */
    public topics: string[];

    /**
     * Create a new `AWS::SNS::TopicPolicy`.
     *
     * @param scope - scope in which this resource is defined
     * @param id    - scoped id of the resource
     * @param props - resource properties
     */
    constructor(scope: constructs.Construct, id: string, props: CfnTopicPolicyProps) {
        super(scope, id, { type: CfnTopicPolicy.CFN_RESOURCE_TYPE_NAME, properties: props });
        cdk.requireProperty(props, 'policyDocument', this);
        cdk.requireProperty(props, 'topics', this);

        this.policyDocument = props.policyDocument;
        this.topics = props.topics;
    }

    /**
     * Examines the CloudFormation resource and discloses attributes.
     *
     * @param inspector - tree inspector to collect and process attributes
     *
     */
    public inspect(inspector: cdk.TreeInspector) {
        inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopicPolicy.CFN_RESOURCE_TYPE_NAME);
        inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
    }

    protected get cfnProperties(): { [key: string]: any }  {
        return {
            policyDocument: this.policyDocument,
            topics: this.topics,
        };
    }

    protected renderProperties(props: {[key: string]: any}): { [key: string]: any }  {
        return cfnTopicPolicyPropsToCloudFormation(props);
    }
}
