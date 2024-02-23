/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::SQS::Queue` resource creates an Amazon SQS standard or FIFO queue.
 *
 * Keep the following caveats in mind:
 *
 * - If you don't specify the `FifoQueue` property, Amazon SQS creates a standard queue.
 *
 * > You can't change the queue type after you create it and you can't convert an existing standard queue into a FIFO queue. You must either create a new FIFO queue for your application or delete your existing standard queue and recreate it as a FIFO queue. For more information, see [Moving from a standard queue to a FIFO queue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-moving.html) in the *Amazon SQS Developer Guide* .
 * - If you don't provide a value for a property, the queue is created with the default value for the property.
 * - If you delete a queue, you must wait at least 60 seconds before creating a queue with the same name.
 * - To successfully create a new queue, you must provide a queue name that adheres to the [limits related to queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/limits-queues.html) and is unique within the scope of your queues.
 *
 * For more information about creating FIFO (first-in-first-out) queues, see [Creating an Amazon SQS queue ( AWS CloudFormation )](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/screate-queue-cloudformation.html) in the *Amazon SQS Developer Guide* .
 *
 * @cloudformationResource AWS::SQS::Queue
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html
 */
export class CfnQueue extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SQS::Queue";

  /**
   * Build a CfnQueue from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueue {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnQueuePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnQueue(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Returns the Amazon Resource Name (ARN) of the queue. For example: `arn:aws:sqs:us-east-2:123456789012:mystack-myqueue-15PG5C2FC1CW8` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Returns the queue name. For example: `mystack-myqueue-1VF9BKQH5BJVI` .
   *
   * @cloudformationAttribute QueueName
   */
  public readonly attrQueueName: string;

  /**
   * Returns the URLs of the queues from the policy.
   *
   * @cloudformationAttribute QueueUrl
   */
  public readonly attrQueueUrl: string;

  /**
   * For first-in-first-out (FIFO) queues, specifies whether to enable content-based deduplication.
   */
  public contentBasedDeduplication?: boolean | cdk.IResolvable;

  /**
   * For high throughput for FIFO queues, specifies whether message deduplication occurs at the message group or queue level.
   */
  public deduplicationScope?: string;

  /**
   * The time in seconds for which the delivery of all messages in the queue is delayed.
   */
  public delaySeconds?: number;

  /**
   * If set to true, creates a FIFO queue.
   */
  public fifoQueue?: boolean | cdk.IResolvable;

  /**
   * For high throughput for FIFO queues, specifies whether the FIFO queue throughput quota applies to the entire queue or per message group.
   */
  public fifoThroughputLimit?: string;

  /**
   * The length of time in seconds for which Amazon SQS can reuse a data key to encrypt or decrypt messages before calling AWS KMS again.
   */
  public kmsDataKeyReusePeriodSeconds?: number;

  /**
   * The ID of an AWS Key Management Service (KMS) for Amazon SQS , or a custom KMS.
   */
  public kmsMasterKeyId?: string;

  /**
   * The limit of how many bytes that a message can contain before Amazon SQS rejects it.
   */
  public maximumMessageSize?: number;

  /**
   * The number of seconds that Amazon SQS retains a message.
   */
  public messageRetentionPeriod?: number;

  /**
   * A name for the queue.
   */
  public queueName?: string;

  /**
   * Specifies the duration, in seconds, that the ReceiveMessage action call waits until a message is in the queue in order to include it in the response, rather than returning an empty response if a message isn't yet available.
   */
  public receiveMessageWaitTimeSeconds?: number;

  /**
   * The string that includes the parameters for the permissions for the dead-letter queue redrive permission and which source queues can specify dead-letter queues as a JSON object.
   */
  public redriveAllowPolicy?: any | cdk.IResolvable;

  /**
   * The string that includes the parameters for the dead-letter queue functionality of the source queue as a JSON object.
   */
  public redrivePolicy?: any | cdk.IResolvable;

  /**
   * Enables server-side queue encryption using SQS owned encryption keys.
   */
  public sqsManagedSseEnabled?: boolean | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags that you attach to this queue.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The length of time during which a message will be unavailable after a message is delivered from the queue.
   */
  public visibilityTimeout?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnQueueProps = {}) {
    super(scope, id, {
      "type": CfnQueue.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrQueueName = cdk.Token.asString(this.getAtt("QueueName", cdk.ResolutionTypeHint.STRING));
    this.attrQueueUrl = cdk.Token.asString(this.getAtt("QueueUrl", cdk.ResolutionTypeHint.STRING));
    this.contentBasedDeduplication = props.contentBasedDeduplication;
    this.deduplicationScope = props.deduplicationScope;
    this.delaySeconds = props.delaySeconds;
    this.fifoQueue = props.fifoQueue;
    this.fifoThroughputLimit = props.fifoThroughputLimit;
    this.kmsDataKeyReusePeriodSeconds = props.kmsDataKeyReusePeriodSeconds;
    this.kmsMasterKeyId = props.kmsMasterKeyId;
    this.maximumMessageSize = props.maximumMessageSize;
    this.messageRetentionPeriod = props.messageRetentionPeriod;
    this.queueName = props.queueName;
    this.receiveMessageWaitTimeSeconds = props.receiveMessageWaitTimeSeconds;
    this.redriveAllowPolicy = props.redriveAllowPolicy;
    this.redrivePolicy = props.redrivePolicy;
    this.sqsManagedSseEnabled = props.sqsManagedSseEnabled;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SQS::Queue", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.visibilityTimeout = props.visibilityTimeout;
    if ((this.node.scope != null && cdk.Resource.isResource(this.node.scope))) {
      this.node.addValidation({
        "validate": () => ((this.cfnOptions.deletionPolicy === undefined) ? ["'AWS::SQS::Queue' is a stateful resource type, and you must specify a Removal Policy for it. Call 'resource.applyRemovalPolicy()'."] : [])
      });
    }
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contentBasedDeduplication": this.contentBasedDeduplication,
      "deduplicationScope": this.deduplicationScope,
      "delaySeconds": this.delaySeconds,
      "fifoQueue": this.fifoQueue,
      "fifoThroughputLimit": this.fifoThroughputLimit,
      "kmsDataKeyReusePeriodSeconds": this.kmsDataKeyReusePeriodSeconds,
      "kmsMasterKeyId": this.kmsMasterKeyId,
      "maximumMessageSize": this.maximumMessageSize,
      "messageRetentionPeriod": this.messageRetentionPeriod,
      "queueName": this.queueName,
      "receiveMessageWaitTimeSeconds": this.receiveMessageWaitTimeSeconds,
      "redriveAllowPolicy": this.redriveAllowPolicy,
      "redrivePolicy": this.redrivePolicy,
      "sqsManagedSseEnabled": this.sqsManagedSseEnabled,
      "tags": this.tags.renderTags(),
      "visibilityTimeout": this.visibilityTimeout
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueue.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnQueuePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnQueue`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html
 */
export interface CfnQueueProps {
  /**
   * For first-in-first-out (FIFO) queues, specifies whether to enable content-based deduplication.
   *
   * During the deduplication interval, Amazon SQS treats messages that are sent with identical content as duplicates and delivers only one copy of the message. For more information, see the `ContentBasedDeduplication` attribute for the `[CreateQueue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html)` action in the *Amazon SQS API Reference* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-contentbaseddeduplication
   */
  readonly contentBasedDeduplication?: boolean | cdk.IResolvable;

  /**
   * For high throughput for FIFO queues, specifies whether message deduplication occurs at the message group or queue level.
   *
   * Valid values are `messageGroup` and `queue` .
   *
   * To enable high throughput for a FIFO queue, set this attribute to `messageGroup` *and* set the `FifoThroughputLimit` attribute to `perMessageGroupId` . If you set these attributes to anything other than these values, normal throughput is in effect and deduplication occurs as specified. For more information, see [High throughput for FIFO queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/high-throughput-fifo.html) and [Quotas related to messages](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-deduplicationscope
   */
  readonly deduplicationScope?: string;

  /**
   * The time in seconds for which the delivery of all messages in the queue is delayed.
   *
   * You can specify an integer value of `0` to `900` (15 minutes). The default value is `0` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-delayseconds
   */
  readonly delaySeconds?: number;

  /**
   * If set to true, creates a FIFO queue.
   *
   * If you don't specify this property, Amazon SQS creates a standard queue. For more information, see [FIFO queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-fifoqueue
   */
  readonly fifoQueue?: boolean | cdk.IResolvable;

  /**
   * For high throughput for FIFO queues, specifies whether the FIFO queue throughput quota applies to the entire queue or per message group.
   *
   * Valid values are `perQueue` and `perMessageGroupId` .
   *
   * To enable high throughput for a FIFO queue, set this attribute to `perMessageGroupId` *and* set the `DeduplicationScope` attribute to `messageGroup` . If you set these attributes to anything other than these values, normal throughput is in effect and deduplication occurs as specified. For more information, see [High throughput for FIFO queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/high-throughput-fifo.html) and [Quotas related to messages](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/quotas-messages.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-fifothroughputlimit
   */
  readonly fifoThroughputLimit?: string;

  /**
   * The length of time in seconds for which Amazon SQS can reuse a data key to encrypt or decrypt messages before calling AWS KMS again.
   *
   * The value must be an integer between 60 (1 minute) and 86,400 (24 hours). The default is 300 (5 minutes).
   *
   * > A shorter time period provides better security, but results in more calls to AWS KMS , which might incur charges after Free Tier. For more information, see [Encryption at rest](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html#sqs-how-does-the-data-key-reuse-period-work) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-kmsdatakeyreuseperiodseconds
   */
  readonly kmsDataKeyReusePeriodSeconds?: number;

  /**
   * The ID of an AWS Key Management Service (KMS) for Amazon SQS , or a custom KMS.
   *
   * To use the AWS managed KMS for Amazon SQS , specify a (default) alias ARN, alias name (e.g. `alias/aws/sqs` ), key ARN, or key ID. For more information, see the following:
   *
   * - [Encryption at rest](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-server-side-encryption.html) in the *Amazon SQS Developer Guide*
   * - [CreateQueue](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html) in the *Amazon SQS API Reference*
   * - [Request Parameters](https://docs.aws.amazon.com/kms/latest/APIReference/API_DescribeKey.html#API_DescribeKey_RequestParameters) in the *AWS Key Management Service API Reference*
   * - The Key Management Service (KMS) section of the [AWS Key Management Service Best Practices](https://docs.aws.amazon.com/https://d0.awsstatic.com/whitepapers/aws-kms-best-practices.pdf) whitepaper
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-kmsmasterkeyid
   */
  readonly kmsMasterKeyId?: string;

  /**
   * The limit of how many bytes that a message can contain before Amazon SQS rejects it.
   *
   * You can specify an integer value from `1,024` bytes (1 KiB) to `262,144` bytes (256 KiB). The default value is `262,144` (256 KiB).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-maximummessagesize
   */
  readonly maximumMessageSize?: number;

  /**
   * The number of seconds that Amazon SQS retains a message.
   *
   * You can specify an integer value from `60` seconds (1 minute) to `1,209,600` seconds (14 days). The default value is `345,600` seconds (4 days).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-messageretentionperiod
   */
  readonly messageRetentionPeriod?: number;

  /**
   * A name for the queue.
   *
   * To create a FIFO queue, the name of your FIFO queue must end with the `.fifo` suffix. For more information, see [FIFO queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues.html) in the *Amazon SQS Developer Guide* .
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the queue name. For more information, see [Name type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) in the *AWS CloudFormation User Guide* .
   *
   * > If you specify a name, you can't perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-queuename
   */
  readonly queueName?: string;

  /**
   * Specifies the duration, in seconds, that the ReceiveMessage action call waits until a message is in the queue in order to include it in the response, rather than returning an empty response if a message isn't yet available.
   *
   * You can specify an integer from 1 to 20. Short polling is used as the default or when you specify 0 for this property. For more information, see [Consuming messages using long polling](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html#sqs-long-polling) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-receivemessagewaittimeseconds
   */
  readonly receiveMessageWaitTimeSeconds?: number;

  /**
   * The string that includes the parameters for the permissions for the dead-letter queue redrive permission and which source queues can specify dead-letter queues as a JSON object.
   *
   * The parameters are as follows:
   *
   * - `redrivePermission` : The permission type that defines which source queues can specify the current queue as the dead-letter queue. Valid values are:
   *
   * - `allowAll` : (Default) Any source queues in this AWS account in the same Region can specify this queue as the dead-letter queue.
   * - `denyAll` : No source queues can specify this queue as the dead-letter queue.
   * - `byQueue` : Only queues specified by the `sourceQueueArns` parameter can specify this queue as the dead-letter queue.
   * - `sourceQueueArns` : The Amazon Resource Names (ARN)s of the source queues that can specify this queue as the dead-letter queue and redrive messages. You can specify this parameter only when the `redrivePermission` parameter is set to `byQueue` . You can specify up to 10 source queue ARNs. To allow more than 10 source queues to specify dead-letter queues, set the `redrivePermission` parameter to `allowAll` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-redriveallowpolicy
   */
  readonly redriveAllowPolicy?: any | cdk.IResolvable;

  /**
   * The string that includes the parameters for the dead-letter queue functionality of the source queue as a JSON object.
   *
   * The parameters are as follows:
   *
   * - `deadLetterTargetArn` : The Amazon Resource Name (ARN) of the dead-letter queue to which Amazon SQS moves messages after the value of `maxReceiveCount` is exceeded.
   * - `maxReceiveCount` : The number of times a message is delivered to the source queue before being moved to the dead-letter queue. When the `ReceiveCount` for a message exceeds the `maxReceiveCount` for a queue, Amazon SQS moves the message to the dead-letter-queue.
   *
   * > The dead-letter queue of a FIFO queue must also be a FIFO queue. Similarly, the dead-letter queue of a standard queue must also be a standard queue.
   *
   * *JSON*
   *
   * `{ "deadLetterTargetArn" : *String* , "maxReceiveCount" : *Integer* }`
   *
   * *YAML*
   *
   * `deadLetterTargetArn : *String*`
   *
   * `maxReceiveCount : *Integer*`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-redrivepolicy
   */
  readonly redrivePolicy?: any | cdk.IResolvable;

  /**
   * Enables server-side queue encryption using SQS owned encryption keys.
   *
   * Only one server-side encryption option is supported per queue (for example, [SSE-KMS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-sse-existing-queue.html) or [SSE-SQS](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-configure-sqs-sse-queue.html) ). When `SqsManagedSseEnabled` is not defined, `SSE-SQS` encryption is enabled by default.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-sqsmanagedsseenabled
   */
  readonly sqsManagedSseEnabled?: boolean | cdk.IResolvable;

  /**
   * The tags that you attach to this queue.
   *
   * For more information, see [Resource tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The length of time during which a message will be unavailable after a message is delivered from the queue.
   *
   * This blocks other components from receiving the same message and gives the initial component time to process and delete the message from the queue.
   *
   * Values must be from 0 to 43,200 seconds (12 hours). If you don't specify a value, AWS CloudFormation uses the default value of 30 seconds.
   *
   * For more information about Amazon SQS queue visibility timeouts, see [Visibility timeout](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queue.html#cfn-sqs-queue-visibilitytimeout
   */
  readonly visibilityTimeout?: number;
}

/**
 * Determine whether the given properties match those of a `CfnQueueProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueueProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQueuePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contentBasedDeduplication", cdk.validateBoolean)(properties.contentBasedDeduplication));
  errors.collect(cdk.propertyValidator("deduplicationScope", cdk.validateString)(properties.deduplicationScope));
  errors.collect(cdk.propertyValidator("delaySeconds", cdk.validateNumber)(properties.delaySeconds));
  errors.collect(cdk.propertyValidator("fifoQueue", cdk.validateBoolean)(properties.fifoQueue));
  errors.collect(cdk.propertyValidator("fifoThroughputLimit", cdk.validateString)(properties.fifoThroughputLimit));
  errors.collect(cdk.propertyValidator("kmsDataKeyReusePeriodSeconds", cdk.validateNumber)(properties.kmsDataKeyReusePeriodSeconds));
  errors.collect(cdk.propertyValidator("kmsMasterKeyId", cdk.validateString)(properties.kmsMasterKeyId));
  errors.collect(cdk.propertyValidator("maximumMessageSize", cdk.validateNumber)(properties.maximumMessageSize));
  errors.collect(cdk.propertyValidator("messageRetentionPeriod", cdk.validateNumber)(properties.messageRetentionPeriod));
  errors.collect(cdk.propertyValidator("queueName", cdk.validateString)(properties.queueName));
  errors.collect(cdk.propertyValidator("receiveMessageWaitTimeSeconds", cdk.validateNumber)(properties.receiveMessageWaitTimeSeconds));
  errors.collect(cdk.propertyValidator("redriveAllowPolicy", cdk.validateObject)(properties.redriveAllowPolicy));
  errors.collect(cdk.propertyValidator("redrivePolicy", cdk.validateObject)(properties.redrivePolicy));
  errors.collect(cdk.propertyValidator("sqsManagedSseEnabled", cdk.validateBoolean)(properties.sqsManagedSseEnabled));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("visibilityTimeout", cdk.validateNumber)(properties.visibilityTimeout));
  return errors.wrap("supplied properties not correct for \"CfnQueueProps\"");
}

// @ts-ignore TS6133
function convertCfnQueuePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQueuePropsValidator(properties).assertSuccess();
  return {
    "ContentBasedDeduplication": cdk.booleanToCloudFormation(properties.contentBasedDeduplication),
    "DeduplicationScope": cdk.stringToCloudFormation(properties.deduplicationScope),
    "DelaySeconds": cdk.numberToCloudFormation(properties.delaySeconds),
    "FifoQueue": cdk.booleanToCloudFormation(properties.fifoQueue),
    "FifoThroughputLimit": cdk.stringToCloudFormation(properties.fifoThroughputLimit),
    "KmsDataKeyReusePeriodSeconds": cdk.numberToCloudFormation(properties.kmsDataKeyReusePeriodSeconds),
    "KmsMasterKeyId": cdk.stringToCloudFormation(properties.kmsMasterKeyId),
    "MaximumMessageSize": cdk.numberToCloudFormation(properties.maximumMessageSize),
    "MessageRetentionPeriod": cdk.numberToCloudFormation(properties.messageRetentionPeriod),
    "QueueName": cdk.stringToCloudFormation(properties.queueName),
    "ReceiveMessageWaitTimeSeconds": cdk.numberToCloudFormation(properties.receiveMessageWaitTimeSeconds),
    "RedriveAllowPolicy": cdk.objectToCloudFormation(properties.redriveAllowPolicy),
    "RedrivePolicy": cdk.objectToCloudFormation(properties.redrivePolicy),
    "SqsManagedSseEnabled": cdk.booleanToCloudFormation(properties.sqsManagedSseEnabled),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VisibilityTimeout": cdk.numberToCloudFormation(properties.visibilityTimeout)
  };
}

// @ts-ignore TS6133
function CfnQueuePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQueueProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueueProps>();
  ret.addPropertyResult("contentBasedDeduplication", "ContentBasedDeduplication", (properties.ContentBasedDeduplication != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ContentBasedDeduplication) : undefined));
  ret.addPropertyResult("deduplicationScope", "DeduplicationScope", (properties.DeduplicationScope != null ? cfn_parse.FromCloudFormation.getString(properties.DeduplicationScope) : undefined));
  ret.addPropertyResult("delaySeconds", "DelaySeconds", (properties.DelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.DelaySeconds) : undefined));
  ret.addPropertyResult("fifoQueue", "FifoQueue", (properties.FifoQueue != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FifoQueue) : undefined));
  ret.addPropertyResult("fifoThroughputLimit", "FifoThroughputLimit", (properties.FifoThroughputLimit != null ? cfn_parse.FromCloudFormation.getString(properties.FifoThroughputLimit) : undefined));
  ret.addPropertyResult("kmsDataKeyReusePeriodSeconds", "KmsDataKeyReusePeriodSeconds", (properties.KmsDataKeyReusePeriodSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KmsDataKeyReusePeriodSeconds) : undefined));
  ret.addPropertyResult("kmsMasterKeyId", "KmsMasterKeyId", (properties.KmsMasterKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsMasterKeyId) : undefined));
  ret.addPropertyResult("maximumMessageSize", "MaximumMessageSize", (properties.MaximumMessageSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumMessageSize) : undefined));
  ret.addPropertyResult("messageRetentionPeriod", "MessageRetentionPeriod", (properties.MessageRetentionPeriod != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessageRetentionPeriod) : undefined));
  ret.addPropertyResult("queueName", "QueueName", (properties.QueueName != null ? cfn_parse.FromCloudFormation.getString(properties.QueueName) : undefined));
  ret.addPropertyResult("receiveMessageWaitTimeSeconds", "ReceiveMessageWaitTimeSeconds", (properties.ReceiveMessageWaitTimeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReceiveMessageWaitTimeSeconds) : undefined));
  ret.addPropertyResult("redriveAllowPolicy", "RedriveAllowPolicy", (properties.RedriveAllowPolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.RedriveAllowPolicy) : undefined));
  ret.addPropertyResult("redrivePolicy", "RedrivePolicy", (properties.RedrivePolicy != null ? cfn_parse.FromCloudFormation.getAny(properties.RedrivePolicy) : undefined));
  ret.addPropertyResult("sqsManagedSseEnabled", "SqsManagedSseEnabled", (properties.SqsManagedSseEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SqsManagedSseEnabled) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("visibilityTimeout", "VisibilityTimeout", (properties.VisibilityTimeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.VisibilityTimeout) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SQS::QueueInlinePolicy` resource associates one Amazon SQS queue with one policy.
 *
 * @cloudformationResource AWS::SQS::QueueInlinePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queueinlinepolicy.html
 */
export class CfnQueueInlinePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SQS::QueueInlinePolicy";

  /**
   * Build a CfnQueueInlinePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueueInlinePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnQueueInlinePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnQueueInlinePolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A policy document that contains the permissions for the specified Amazon SQS queues.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The URLs of the queues to which you want to add the policy.
   */
  public queue: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnQueueInlinePolicyProps) {
    super(scope, id, {
      "type": CfnQueueInlinePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "queue", this);

    this.policyDocument = props.policyDocument;
    this.queue = props.queue;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "queue": this.queue
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueueInlinePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnQueueInlinePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnQueueInlinePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queueinlinepolicy.html
 */
export interface CfnQueueInlinePolicyProps {
  /**
   * A policy document that contains the permissions for the specified Amazon SQS queues.
   *
   * For more information about Amazon SQS policies, see [Using custom policies with the Amazon SQS access policy language](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-creating-custom-policies.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queueinlinepolicy.html#cfn-sqs-queueinlinepolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The URLs of the queues to which you want to add the policy.
   *
   * You can use the `[Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)` function to specify an `[AWS::SQS::Queue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html)` resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queueinlinepolicy.html#cfn-sqs-queueinlinepolicy-queue
   */
  readonly queue: string;
}

/**
 * Determine whether the given properties match those of a `CfnQueueInlinePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueueInlinePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQueueInlinePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("queue", cdk.requiredValidator)(properties.queue));
  errors.collect(cdk.propertyValidator("queue", cdk.validateString)(properties.queue));
  return errors.wrap("supplied properties not correct for \"CfnQueueInlinePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnQueueInlinePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQueueInlinePolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "Queue": cdk.stringToCloudFormation(properties.queue)
  };
}

// @ts-ignore TS6133
function CfnQueueInlinePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQueueInlinePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueueInlinePolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("queue", "Queue", (properties.Queue != null ? cfn_parse.FromCloudFormation.getString(properties.Queue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SQS::QueuePolicy` type applies a policy to Amazon SQS queues.
 *
 * For an example snippet, see [Declaring an Amazon SQS policy](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-iam.html#scenario-sqs-policy) in the *AWS CloudFormation User Guide* .
 *
 * @cloudformationResource AWS::SQS::QueuePolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queuepolicy.html
 */
export class CfnQueuePolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SQS::QueuePolicy";

  /**
   * Build a CfnQueuePolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnQueuePolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnQueuePolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnQueuePolicy(scope, id, propsResult.value);
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
   * A policy document that contains the permissions for the specified Amazon SQS queues.
   */
  public policyDocument: any | cdk.IResolvable;

  /**
   * The URLs of the queues to which you want to add the policy.
   */
  public queues: Array<string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnQueuePolicyProps) {
    super(scope, id, {
      "type": CfnQueuePolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policyDocument", this);
    cdk.requireProperty(props, "queues", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.policyDocument = props.policyDocument;
    this.queues = props.queues;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "policyDocument": this.policyDocument,
      "queues": this.queues
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnQueuePolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnQueuePolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnQueuePolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queuepolicy.html
 */
export interface CfnQueuePolicyProps {
  /**
   * A policy document that contains the permissions for the specified Amazon SQS queues.
   *
   * For more information about Amazon SQS policies, see [Using custom policies with the Amazon SQS access policy language](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-creating-custom-policies.html) in the *Amazon SQS Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queuepolicy.html#cfn-sqs-queuepolicy-policydocument
   */
  readonly policyDocument: any | cdk.IResolvable;

  /**
   * The URLs of the queues to which you want to add the policy.
   *
   * You can use the `[Ref](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html)` function to specify an `[AWS::SQS::Queue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-sqs-queues.html)` resource.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-sqs-queuepolicy.html#cfn-sqs-queuepolicy-queues
   */
  readonly queues: Array<string>;
}

/**
 * Determine whether the given properties match those of a `CfnQueuePolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnQueuePolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnQueuePolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("policyDocument", cdk.requiredValidator)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("policyDocument", cdk.validateObject)(properties.policyDocument));
  errors.collect(cdk.propertyValidator("queues", cdk.requiredValidator)(properties.queues));
  errors.collect(cdk.propertyValidator("queues", cdk.listValidator(cdk.validateString))(properties.queues));
  return errors.wrap("supplied properties not correct for \"CfnQueuePolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnQueuePolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnQueuePolicyPropsValidator(properties).assertSuccess();
  return {
    "PolicyDocument": cdk.objectToCloudFormation(properties.policyDocument),
    "Queues": cdk.listMapper(cdk.stringToCloudFormation)(properties.queues)
  };
}

// @ts-ignore TS6133
function CfnQueuePolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnQueuePolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnQueuePolicyProps>();
  ret.addPropertyResult("policyDocument", "PolicyDocument", (properties.PolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.PolicyDocument) : undefined));
  ret.addPropertyResult("queues", "Queues", (properties.Queues != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Queues) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}