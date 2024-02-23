/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::SNS::Subscription` resource subscribes an endpoint to an Amazon SNS topic.
 *
 * For a subscription to be created, the owner of the endpoint must confirm the subscription.
 *
 * @cloudformationResource AWS::SNS::Subscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html
 */
export class CfnSubscription extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SNS::Subscription";

  /**
   * Build a CfnSubscription from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSubscription(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The delivery policy JSON assigned to the subscription.
   */
  public deliveryPolicy?: any | cdk.IResolvable;

  /**
   * The subscription's endpoint.
   */
  public endpoint?: string;

  /**
   * The filter policy JSON assigned to the subscription.
   */
  public filterPolicy?: any | cdk.IResolvable;

  /**
   * This attribute lets you choose the filtering scope by using one of the following string value types:.
   */
  public filterPolicyScope?: string;

  /**
   * The subscription's protocol.
   */
  public protocol: string;

  /**
   * When set to `true` , enables raw message delivery.
   */
  public rawMessageDelivery?: boolean | cdk.IResolvable;

  /**
   * When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue.
   */
  public redrivePolicy?: any | cdk.IResolvable;

  /**
   * For cross-region subscriptions, the region in which the topic resides.
   */
  public region?: string;

  public replayPolicy?: any | cdk.IResolvable;

  /**
   * This property applies only to Amazon Kinesis Data Firehose delivery stream subscriptions.
   */
  public subscriptionRoleArn?: string;

  /**
   * The ARN of the topic to subscribe to.
   */
  public topicArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSubscriptionProps) {
    super(scope, id, {
      "type": CfnSubscription.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "protocol", this);
    cdk.requireProperty(props, "topicArn", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.deliveryPolicy = props.deliveryPolicy;
    this.endpoint = props.endpoint;
    this.filterPolicy = props.filterPolicy;
    this.filterPolicyScope = props.filterPolicyScope;
    this.protocol = props.protocol;
    this.rawMessageDelivery = props.rawMessageDelivery;
    this.redrivePolicy = props.redrivePolicy;
    this.region = props.region;
    this.replayPolicy = props.replayPolicy;
    this.subscriptionRoleArn = props.subscriptionRoleArn;
    this.topicArn = props.topicArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deliveryPolicy": this.deliveryPolicy,
      "endpoint": this.endpoint,
      "filterPolicy": this.filterPolicy,
      "filterPolicyScope": this.filterPolicyScope,
      "protocol": this.protocol,
      "rawMessageDelivery": this.rawMessageDelivery,
      "redrivePolicy": this.redrivePolicy,
      "region": this.region,
      "replayPolicy": this.replayPolicy,
      "subscriptionRoleArn": this.subscriptionRoleArn,
      "topicArn": this.topicArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSubscription.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSubscriptionPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSubscription`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html
 */
export interface CfnSubscriptionProps {
  /**
   * The delivery policy JSON assigned to the subscription.
   *
   * Enables the subscriber to define the message delivery retry strategy in the case of an HTTP/S endpoint subscribed to the topic. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* and [Message delivery retries](https://docs.aws.amazon.com/sns/latest/dg/sns-message-delivery-retries.html) in the *Amazon SNS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-deliverypolicy
   */
  readonly deliveryPolicy?: any | cdk.IResolvable;

  /**
   * The subscription's endpoint.
   *
   * The endpoint value depends on the protocol that you specify. For more information, see the `Endpoint` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-endpoint
   */
  readonly endpoint?: string;

  /**
   * The filter policy JSON assigned to the subscription.
   *
   * Enables the subscriber to filter out unwanted messages. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* and [Message filtering](https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html) in the *Amazon SNS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-filterpolicy
   */
  readonly filterPolicy?: any | cdk.IResolvable;

  /**
   * This attribute lets you choose the filtering scope by using one of the following string value types:.
   *
   * - `MessageAttributes` (default) - The filter is applied on the message attributes.
   * - `MessageBody` - The filter is applied on the message body.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-filterpolicyscope
   */
  readonly filterPolicyScope?: string;

  /**
   * The subscription's protocol.
   *
   * For more information, see the `Protocol` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-protocol
   */
  readonly protocol: string;

  /**
   * When set to `true` , enables raw message delivery.
   *
   * Raw messages don't contain any JSON formatting and can be sent to Amazon SQS and HTTP/S endpoints. For more information, see `[GetSubscriptionAttributes](https://docs.aws.amazon.com/sns/latest/api/API_GetSubscriptionAttributes.html)` in the *Amazon SNS API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-rawmessagedelivery
   */
  readonly rawMessageDelivery?: boolean | cdk.IResolvable;

  /**
   * When specified, sends undeliverable messages to the specified Amazon SQS dead-letter queue.
   *
   * Messages that can't be delivered due to client errors (for example, when the subscribed endpoint is unreachable) or server errors (for example, when the service that powers the subscribed endpoint becomes unavailable) are held in the dead-letter queue for further analysis or reprocessing.
   *
   * For more information about the redrive policy and dead-letter queues, see [Amazon SQS dead-letter queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-redrivepolicy
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-region
   */
  readonly region?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-replaypolicy
   */
  readonly replayPolicy?: any | cdk.IResolvable;

  /**
   * This property applies only to Amazon Kinesis Data Firehose delivery stream subscriptions.
   *
   * Specify the ARN of the IAM role that has the following:
   *
   * - Permission to write to the Amazon Kinesis Data Firehose delivery stream
   * - Amazon SNS listed as a trusted entity
   *
   * Specifying a valid ARN for this attribute is required for Kinesis Data Firehose delivery stream subscriptions. For more information, see [Fanout to Amazon Kinesis Data Firehose delivery streams](https://docs.aws.amazon.com/sns/latest/dg/sns-firehose-as-subscriber.html) in the *Amazon SNS Developer Guide.*
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-subscriptionrolearn
   */
  readonly subscriptionRoleArn?: string;

  /**
   * The ARN of the topic to subscribe to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-subscription.html#cfn-sns-subscription-topicarn
   */
  readonly topicArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnSubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnSubscriptionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSubscriptionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryPolicy", cdk.validateObject)(properties.deliveryPolicy));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  errors.collect(cdk.propertyValidator("filterPolicy", cdk.validateObject)(properties.filterPolicy));
  errors.collect(cdk.propertyValidator("filterPolicyScope", cdk.validateString)(properties.filterPolicyScope));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("rawMessageDelivery", cdk.validateBoolean)(properties.rawMessageDelivery));
  errors.collect(cdk.propertyValidator("redrivePolicy", cdk.validateObject)(properties.redrivePolicy));
  errors.collect(cdk.propertyValidator("region", cdk.validateString)(properties.region));
  errors.collect(cdk.propertyValidator("replayPolicy", cdk.validateObject)(properties.replayPolicy));
  errors.collect(cdk.propertyValidator("subscriptionRoleArn", cdk.validateString)(properties.subscriptionRoleArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.requiredValidator)(properties.topicArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"CfnSubscriptionProps\"");
}

// @ts-ignore TS6133
function convertCfnSubscriptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSubscriptionPropsValidator(properties).assertSuccess();
  return {
    "DeliveryPolicy": cdk.objectToCloudFormation(properties.deliveryPolicy),
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint),
    "FilterPolicy": cdk.objectToCloudFormation(properties.filterPolicy),
    "FilterPolicyScope": cdk.stringToCloudFormation(properties.filterPolicyScope),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "RawMessageDelivery": cdk.booleanToCloudFormation(properties.rawMessageDelivery),
    "RedrivePolicy": cdk.objectToCloudFormation(properties.redrivePolicy),
    "Region": cdk.stringToCloudFormation(properties.region),
    "ReplayPolicy": cdk.objectToCloudFormation(properties.replayPolicy),
    "SubscriptionRoleArn": cdk.stringToCloudFormation(properties.subscriptionRoleArn),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnSubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSubscriptionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSubscriptionProps>();
  ret.addPropertyResult("deliveryPolicy", "DeliveryPolicy", (properties.DeliveryPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DeliveryPolicy) : undefined));
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addPropertyResult("filterPolicy", "FilterPolicy", (properties.FilterPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.FilterPolicy) : undefined));
  ret.addPropertyResult("filterPolicyScope", "FilterPolicyScope", (properties.FilterPolicyScope != null ? cfn_parse.FromCloudFormation.getString(properties.FilterPolicyScope) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("rawMessageDelivery", "RawMessageDelivery", (properties.RawMessageDelivery != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RawMessageDelivery) : undefined));
  ret.addPropertyResult("redrivePolicy", "RedrivePolicy", (properties.RedrivePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.RedrivePolicy) : undefined));
  ret.addPropertyResult("region", "Region", (properties.Region != null ? cfn_parse.FromCloudFormation.getString(properties.Region) : undefined));
  ret.addPropertyResult("replayPolicy", "ReplayPolicy", (properties.ReplayPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.ReplayPolicy) : undefined));
  ret.addPropertyResult("subscriptionRoleArn", "SubscriptionRoleArn", (properties.SubscriptionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionRoleArn) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SNS::Topic` resource creates a topic to which notifications can be published.
 *
 * > One account can create a maximum of 100,000 standard topics and 1,000 FIFO topics. For more information, see [Amazon SNS endpoints and quotas](https://docs.aws.amazon.com/general/latest/gr/sns.html) in the *AWS General Reference* .
 *
 * @cloudformationResource AWS::SNS::Topic
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
 */
export class CfnTopic extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SNS::Topic";

  /**
   * Build a CfnTopic from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTopic(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the ARN of an Amazon SNS topic.
   *
   * @cloudformationAttribute TopicArn
   */
  public readonly attrTopicArn: string;

  /**
   * Returns the name of an Amazon SNS topic.
   *
   * @cloudformationAttribute TopicName
   */
  public readonly attrTopicName: string;

  /**
   * The archive policy determines the number of days Amazon SNS retains messages.
   */
  public archivePolicy?: any | cdk.IResolvable;

  /**
   * Enables content-based deduplication for FIFO topics.
   */
  public contentBasedDeduplication?: boolean | cdk.IResolvable;

  /**
   * The body of the policy document you want to use for this topic.
   */
  public dataProtectionPolicy?: any | cdk.IResolvable;

  /**
   * The `DeliveryStatusLogging` configuration enables you to log the delivery status of messages sent from your Amazon SNS topic to subscribed endpoints with the following supported delivery protocols:.
   */
  public deliveryStatusLogging?: Array<cdk.IResolvable | CfnTopic.LoggingConfigProperty> | cdk.IResolvable;

  /**
   * The display name to use for an Amazon SNS topic with SMS subscriptions.
   */
  public displayName?: string;

  /**
   * Set to true to create a FIFO topic.
   */
  public fifoTopic?: boolean | cdk.IResolvable;

  /**
   * The ID of an AWS managed customer master key (CMK) for Amazon SNS or a custom CMK.
   */
  public kmsMasterKeyId?: string;

  /**
   * The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS.
   */
  public signatureVersion?: string;

  /**
   * The Amazon SNS subscriptions (endpoints) for this topic.
   */
  public subscription?: Array<cdk.IResolvable | CfnTopic.SubscriptionProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The list of tags to add to a new topic.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the topic you want to create.
   */
  public topicName?: string;

  /**
   * Tracing mode of an Amazon SNS topic.
   */
  public tracingConfig?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTopicProps = {}) {
    super(scope, id, {
      "type": CfnTopic.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrTopicArn = cdk.Token.asString(this.getAtt("TopicArn", cdk.ResolutionTypeHint.STRING));
    this.attrTopicName = cdk.Token.asString(this.getAtt("TopicName", cdk.ResolutionTypeHint.STRING));
    this.archivePolicy = props.archivePolicy;
    this.contentBasedDeduplication = props.contentBasedDeduplication;
    this.dataProtectionPolicy = props.dataProtectionPolicy;
    this.deliveryStatusLogging = props.deliveryStatusLogging;
    this.displayName = props.displayName;
    this.fifoTopic = props.fifoTopic;
    this.kmsMasterKeyId = props.kmsMasterKeyId;
    this.signatureVersion = props.signatureVersion;
    this.subscription = props.subscription;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SNS::Topic", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.topicName = props.topicName;
    this.tracingConfig = props.tracingConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "archivePolicy": this.archivePolicy,
      "contentBasedDeduplication": this.contentBasedDeduplication,
      "dataProtectionPolicy": this.dataProtectionPolicy,
      "deliveryStatusLogging": this.deliveryStatusLogging,
      "displayName": this.displayName,
      "fifoTopic": this.fifoTopic,
      "kmsMasterKeyId": this.kmsMasterKeyId,
      "signatureVersion": this.signatureVersion,
      "subscription": this.subscription,
      "tags": this.tags.renderTags(),
      "topicName": this.topicName,
      "tracingConfig": this.tracingConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopic.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTopicPropsToCloudFormation(props);
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html
   */
  export interface SubscriptionProperty {
    /**
     * The endpoint that receives notifications from the Amazon SNS topic.
     *
     * The endpoint value depends on the protocol that you specify. For more information, see the `Endpoint` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html#cfn-sns-topic-subscription-endpoint
     */
    readonly endpoint: string;

    /**
     * The subscription's protocol.
     *
     * For more information, see the `Protocol` parameter of the `[Subscribe](https://docs.aws.amazon.com/sns/latest/api/API_Subscribe.html)` action in the *Amazon SNS API Reference* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-subscription.html#cfn-sns-topic-subscription-protocol
     */
    readonly protocol: string;
  }

  /**
   * The `LoggingConfig` property type specifies the `Delivery` status logging configuration for an [`AWS::SNS::Topic`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-loggingconfig.html
   */
  export interface LoggingConfigProperty {
    /**
     * The IAM role ARN to be used when logging failed message deliveries in Amazon CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-loggingconfig.html#cfn-sns-topic-loggingconfig-failurefeedbackrolearn
     */
    readonly failureFeedbackRoleArn?: string;

    /**
     * Indicates one of the supported protocols for the Amazon SNS topic.
     *
     * > At least one of the other three `LoggingConfig` properties is recommend along with `Protocol` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-loggingconfig.html#cfn-sns-topic-loggingconfig-protocol
     */
    readonly protocol: string;

    /**
     * The IAM role ARN to be used when logging successful message deliveries in Amazon CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-loggingconfig.html#cfn-sns-topic-loggingconfig-successfeedbackrolearn
     */
    readonly successFeedbackRoleArn?: string;

    /**
     * The percentage of successful message deliveries to be logged in Amazon CloudWatch.
     *
     * Valid percentage values range from 0 to 100.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sns-topic-loggingconfig.html#cfn-sns-topic-loggingconfig-successfeedbacksamplerate
     */
    readonly successFeedbackSampleRate?: string;
  }
}

/**
 * Properties for defining a `CfnTopic`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html
 */
export interface CfnTopicProps {
  /**
   * The archive policy determines the number of days Amazon SNS retains messages.
   *
   * You can set a retention period from 1 to 365 days.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-archivepolicy
   */
  readonly archivePolicy?: any | cdk.IResolvable;

  /**
   * Enables content-based deduplication for FIFO topics.
   *
   * - By default, `ContentBasedDeduplication` is set to `false` . If you create a FIFO topic and this attribute is `false` , you must specify a value for the `MessageDeduplicationId` parameter for the [Publish](https://docs.aws.amazon.com/sns/latest/api/API_Publish.html) action.
   * - When you set `ContentBasedDeduplication` to `true` , Amazon SNS uses a SHA-256 hash to generate the `MessageDeduplicationId` using the body of the message (but not the attributes of the message).
   *
   * (Optional) To override the generated value, you can specify a value for the the `MessageDeduplicationId` parameter for the `Publish` action.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-contentbaseddeduplication
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-dataprotectionpolicy
   */
  readonly dataProtectionPolicy?: any | cdk.IResolvable;

  /**
   * The `DeliveryStatusLogging` configuration enables you to log the delivery status of messages sent from your Amazon SNS topic to subscribed endpoints with the following supported delivery protocols:.
   *
   * - HTTP
   * - Amazon Kinesis Data Firehose
   * - AWS Lambda
   * - Platform application endpoint
   * - Amazon Simple Queue Service
   *
   * Once configured, log entries are sent to Amazon CloudWatch Logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-deliverystatuslogging
   */
  readonly deliveryStatusLogging?: Array<cdk.IResolvable | CfnTopic.LoggingConfigProperty> | cdk.IResolvable;

  /**
   * The display name to use for an Amazon SNS topic with SMS subscriptions.
   *
   * The display name must be maximum 100 characters long, including hyphens (-), underscores (_), spaces, and tabs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-displayname
   */
  readonly displayName?: string;

  /**
   * Set to true to create a FIFO topic.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-fifotopic
   */
  readonly fifoTopic?: boolean | cdk.IResolvable;

  /**
   * The ID of an AWS managed customer master key (CMK) for Amazon SNS or a custom CMK.
   *
   * For more information, see [Key terms](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html#sse-key-terms) . For more examples, see `[KeyId](https://docs.aws.amazon.com/kms/latest/APIReference/API_DescribeKey.html#API_DescribeKey_RequestParameters)` in the *AWS Key Management Service API Reference* .
   *
   * This property applies only to [server-side-encryption](https://docs.aws.amazon.com/sns/latest/dg/sns-server-side-encryption.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-kmsmasterkeyid
   */
  readonly kmsMasterKeyId?: string;

  /**
   * The signature version corresponds to the hashing algorithm used while creating the signature of the notifications, subscription confirmations, or unsubscribe confirmation messages sent by Amazon SNS.
   *
   * By default, `SignatureVersion` is set to `1` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-signatureversion
   */
  readonly signatureVersion?: string;

  /**
   * The Amazon SNS subscriptions (endpoints) for this topic.
   *
   * > If you specify the `Subscription` property in the `AWS::SNS::Topic` resource and it creates an associated subscription resource, the associated subscription is not deleted when the `AWS::SNS::Topic` resource is deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-subscription
   */
  readonly subscription?: Array<cdk.IResolvable | CfnTopic.SubscriptionProperty> | cdk.IResolvable;

  /**
   * The list of tags to add to a new topic.
   *
   * > To be able to tag a topic on creation, you must have the `sns:CreateTopic` and `sns:TagResource` permissions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the topic you want to create.
   *
   * Topic names must include only uppercase and lowercase ASCII letters, numbers, underscores, and hyphens, and must be between 1 and 256 characters long. FIFO topic names must end with `.fifo` .
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the topic name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-topicname
   */
  readonly topicName?: string;

  /**
   * Tracing mode of an Amazon SNS topic.
   *
   * By default `TracingConfig` is set to `PassThrough` , and the topic passes through the tracing header it receives from an Amazon SNS publisher to its subscriptions. If set to `Active` , Amazon SNS will vend X-Ray segment data to topic owner account if the sampled flag in the tracing header is true.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html#cfn-sns-topic-tracingconfig
   */
  readonly tracingConfig?: string;
}

/**
 * Determine whether the given properties match those of a `SubscriptionProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicSubscriptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("endpoint", cdk.requiredValidator)(properties.endpoint));
  errors.collect(cdk.propertyValidator("endpoint", cdk.validateString)(properties.endpoint));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"SubscriptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicSubscriptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicSubscriptionPropertyValidator(properties).assertSuccess();
  return {
    "Endpoint": cdk.stringToCloudFormation(properties.endpoint),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnTopicSubscriptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopic.SubscriptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopic.SubscriptionProperty>();
  ret.addPropertyResult("endpoint", "Endpoint", (properties.Endpoint != null ? cfn_parse.FromCloudFormation.getString(properties.Endpoint) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicLoggingConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("failureFeedbackRoleArn", cdk.validateString)(properties.failureFeedbackRoleArn));
  errors.collect(cdk.propertyValidator("protocol", cdk.requiredValidator)(properties.protocol));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("successFeedbackRoleArn", cdk.validateString)(properties.successFeedbackRoleArn));
  errors.collect(cdk.propertyValidator("successFeedbackSampleRate", cdk.validateString)(properties.successFeedbackSampleRate));
  return errors.wrap("supplied properties not correct for \"LoggingConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnTopicLoggingConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicLoggingConfigPropertyValidator(properties).assertSuccess();
  return {
    "FailureFeedbackRoleArn": cdk.stringToCloudFormation(properties.failureFeedbackRoleArn),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "SuccessFeedbackRoleArn": cdk.stringToCloudFormation(properties.successFeedbackRoleArn),
    "SuccessFeedbackSampleRate": cdk.stringToCloudFormation(properties.successFeedbackSampleRate)
  };
}

// @ts-ignore TS6133
function CfnTopicLoggingConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTopic.LoggingConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopic.LoggingConfigProperty>();
  ret.addPropertyResult("failureFeedbackRoleArn", "FailureFeedbackRoleArn", (properties.FailureFeedbackRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.FailureFeedbackRoleArn) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("successFeedbackRoleArn", "SuccessFeedbackRoleArn", (properties.SuccessFeedbackRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SuccessFeedbackRoleArn) : undefined));
  ret.addPropertyResult("successFeedbackSampleRate", "SuccessFeedbackSampleRate", (properties.SuccessFeedbackSampleRate != null ? cfn_parse.FromCloudFormation.getString(properties.SuccessFeedbackSampleRate) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTopicProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("archivePolicy", cdk.validateObject)(properties.archivePolicy));
  errors.collect(cdk.propertyValidator("contentBasedDeduplication", cdk.validateBoolean)(properties.contentBasedDeduplication));
  errors.collect(cdk.propertyValidator("dataProtectionPolicy", cdk.validateObject)(properties.dataProtectionPolicy));
  errors.collect(cdk.propertyValidator("deliveryStatusLogging", cdk.listValidator(CfnTopicLoggingConfigPropertyValidator))(properties.deliveryStatusLogging));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("fifoTopic", cdk.validateBoolean)(properties.fifoTopic));
  errors.collect(cdk.propertyValidator("kmsMasterKeyId", cdk.validateString)(properties.kmsMasterKeyId));
  errors.collect(cdk.propertyValidator("signatureVersion", cdk.validateString)(properties.signatureVersion));
  errors.collect(cdk.propertyValidator("subscription", cdk.listValidator(CfnTopicSubscriptionPropertyValidator))(properties.subscription));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("topicName", cdk.validateString)(properties.topicName));
  errors.collect(cdk.propertyValidator("tracingConfig", cdk.validateString)(properties.tracingConfig));
  return errors.wrap("supplied properties not correct for \"CfnTopicProps\"");
}

// @ts-ignore TS6133
function convertCfnTopicPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicPropsValidator(properties).assertSuccess();
  return {
    "ArchivePolicy": cdk.objectToCloudFormation(properties.archivePolicy),
    "ContentBasedDeduplication": cdk.booleanToCloudFormation(properties.contentBasedDeduplication),
    "DataProtectionPolicy": cdk.objectToCloudFormation(properties.dataProtectionPolicy),
    "DeliveryStatusLogging": cdk.listMapper(convertCfnTopicLoggingConfigPropertyToCloudFormation)(properties.deliveryStatusLogging),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "FifoTopic": cdk.booleanToCloudFormation(properties.fifoTopic),
    "KmsMasterKeyId": cdk.stringToCloudFormation(properties.kmsMasterKeyId),
    "SignatureVersion": cdk.stringToCloudFormation(properties.signatureVersion),
    "Subscription": cdk.listMapper(convertCfnTopicSubscriptionPropertyToCloudFormation)(properties.subscription),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TopicName": cdk.stringToCloudFormation(properties.topicName),
    "TracingConfig": cdk.stringToCloudFormation(properties.tracingConfig)
  };
}

// @ts-ignore TS6133
function CfnTopicPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicProps>();
  ret.addPropertyResult("archivePolicy", "ArchivePolicy", (properties.ArchivePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.ArchivePolicy) : undefined));
  ret.addPropertyResult("contentBasedDeduplication", "ContentBasedDeduplication", (properties.ContentBasedDeduplication != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContentBasedDeduplication) : undefined));
  ret.addPropertyResult("dataProtectionPolicy", "DataProtectionPolicy", (properties.DataProtectionPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.DataProtectionPolicy) : undefined));
  ret.addPropertyResult("deliveryStatusLogging", "DeliveryStatusLogging", (properties.DeliveryStatusLogging != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicLoggingConfigPropertyFromCloudFormation)(properties.DeliveryStatusLogging) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("fifoTopic", "FifoTopic", (properties.FifoTopic != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FifoTopic) : undefined));
  ret.addPropertyResult("kmsMasterKeyId", "KmsMasterKeyId", (properties.KmsMasterKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsMasterKeyId) : undefined));
  ret.addPropertyResult("signatureVersion", "SignatureVersion", (properties.SignatureVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SignatureVersion) : undefined));
  ret.addPropertyResult("subscription", "Subscription", (properties.Subscription != null ? cfn_parse.FromCloudFormation.getArray(CfnTopicSubscriptionPropertyFromCloudFormation)(properties.Subscription) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("topicName", "TopicName", (properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined));
  ret.addPropertyResult("tracingConfig", "TracingConfig", (properties.TracingConfig != null ? cfn_parse.FromCloudFormation.getString(properties.TracingConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SNS::TopicInlinePolicy` resource associates one Amazon SNS topic with one policy.
 *
 * @cloudformationResource AWS::SNS::TopicInlinePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicinlinepolicy.html
 */
export class CfnTopicInlinePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SNS::TopicInlinePolicy";

  /**
   * Build a CfnTopicInlinePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTopicInlinePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTopicInlinePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTopicInlinePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A policy document that contains permissions to add to the specified Amazon SNS topic.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the topic to which you want to add the policy.
   */
  public topicArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTopicInlinePolicyProps) {
    super(scope, id, {
      "type": CfnTopicInlinePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "topicArn", this);

    this.policyDocument = props.policyDocument;
    this.topicArn = props.topicArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "topicArn": this.topicArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopicInlinePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTopicInlinePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTopicInlinePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicinlinepolicy.html
 */
export interface CfnTopicInlinePolicyProps {
  /**
   * A policy document that contains permissions to add to the specified Amazon SNS topic.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicinlinepolicy.html#cfn-sns-topicinlinepolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the topic to which you want to add the policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicinlinepolicy.html#cfn-sns-topicinlinepolicy-topicarn
   */
  readonly topicArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnTopicInlinePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicInlinePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicInlinePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("topicArn", cdk.requiredValidator)(properties.topicArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"CfnTopicInlinePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnTopicInlinePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicInlinePolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnTopicInlinePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicInlinePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicInlinePolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SNS::TopicPolicy` resource associates Amazon SNS topics with a policy.
 *
 * For an example snippet, see [Declaring an Amazon SNS policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-iam.html#scenario-sns-policy) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::SNS::TopicPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicpolicy.html
 */
export class CfnTopicPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SNS::TopicPolicy";

  /**
   * Build a CfnTopicPolicy from CloudFormation properties
   *
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
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTopicPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The provider-assigned unique ID for this managed resource.
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A policy document that contains permissions to add to the specified SNS topics.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The Amazon Resource Names (ARN) of the topics to which you want to add the policy.
   */
  public topics: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTopicPolicyProps) {
    super(scope, id, {
      "type": CfnTopicPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "topics", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.policyDocument = props.policyDocument;
    this.topics = props.topics;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "topics": this.topics
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTopicPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTopicPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnTopicPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicpolicy.html
 */
export interface CfnTopicPolicyProps {
  /**
   * A policy document that contains permissions to add to the specified SNS topics.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicpolicy.html#cfn-sns-topicpolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The Amazon Resource Names (ARN) of the topics to which you want to add the policy.
   *
   * You can use the `[Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)` function to specify an `[AWS::SNS::Topic](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topic.html)` resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sns-topicpolicy.html#cfn-sns-topicpolicy-topics
   */
  readonly topics: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnTopicPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnTopicPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTopicPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("topics", cdk.requiredValidator)(properties.topics));
  errors.collect(cdk.propertyValidator("topics", cdk.listValidator(cdk.validateString))(properties.topics));
  return errors.wrap("supplied properties not correct for \"CfnTopicPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnTopicPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTopicPolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "Topics": cdk.listMapper(cdk.stringToCloudFormation)(properties.topics)
  };
}

// @ts-ignore TS6133
function CfnTopicPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTopicPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTopicPolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("topics", "Topics", (properties.Topics != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Topics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}