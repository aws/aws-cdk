/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a Kinesis stream that captures and transports data records that are emitted from data sources.
 *
 * For information about creating streams, see [CreateStream](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_CreateStream.html) in the Amazon Kinesis API Reference.
 *
 * @cloudformationResource AWS::Kinesis::Stream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html
 */
export class CfnStream extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Kinesis::Stream";

  /**
   * Build a CfnStream from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStream {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStreamPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStream(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon resource name (ARN) of the Kinesis stream, such as `arn:aws:kinesis:us-east-2:123456789012:stream/mystream` .
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The name of the Kinesis stream.
   */
  public name?: string;

  /**
   * The number of hours for the data records that are stored in shards to remain accessible.
   */
  public retentionPeriodHours?: number;

  /**
   * The number of shards that the stream uses.
   */
  public shardCount?: number;

  /**
   * When specified, enables or updates server-side encryption using an AWS KMS key for a specified stream.
   */
  public streamEncryption?: cdk.IResolvable | CfnStream.StreamEncryptionProperty;

  /**
   * Specifies the capacity mode to which you want to set your data stream.
   */
  public streamModeDetails?: cdk.IResolvable | CfnStream.StreamModeDetailsProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the Kinesis stream.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStreamProps = {}) {
    super(scope, id, {
      "type": CfnStream.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.name = props.name;
    this.retentionPeriodHours = props.retentionPeriodHours;
    this.shardCount = props.shardCount;
    this.streamEncryption = props.streamEncryption;
    this.streamModeDetails = props.streamModeDetails;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Kinesis::Stream", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "name": this.name,
      "retentionPeriodHours": this.retentionPeriodHours,
      "shardCount": this.shardCount,
      "streamEncryption": this.streamEncryption,
      "streamModeDetails": this.streamModeDetails,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStream.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStreamPropsToCloudFormation(props);
  }
}

export namespace CfnStream {
  /**
   * Specifies the capacity mode to which you want to set your data stream.
   *
   * Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streammodedetails.html
   */
  export interface StreamModeDetailsProperty {
    /**
     * Specifies the capacity mode to which you want to set your data stream.
     *
     * Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streammodedetails.html#cfn-kinesis-stream-streammodedetails-streammode
     */
    readonly streamMode: string;
  }

  /**
   * Enables or updates server-side encryption using an AWS KMS key for a specified stream.
   *
   * > When invoking this API, you must use either the `StreamARN` or the `StreamName` parameter, or both. It is recommended that you use the `StreamARN` input parameter when you invoke this API.
   *
   * Starting encryption is an asynchronous operation. Upon receiving the request, Kinesis Data Streams returns immediately and sets the status of the stream to `UPDATING` . After the update is complete, Kinesis Data Streams sets the status of the stream back to `ACTIVE` . Updating or applying encryption normally takes a few seconds to complete, but it can take minutes. You can continue to read and write data to your stream while its status is `UPDATING` . Once the status of the stream is `ACTIVE` , encryption begins for records written to the stream.
   *
   * API Limits: You can successfully apply a new AWS KMS key for server-side encryption 25 times in a rolling 24-hour period.
   *
   * Note: It can take up to 5 seconds after the stream is in an `ACTIVE` status before all records written to the stream are encrypted. After you enable encryption, you can verify that encryption is applied by inspecting the API response from `PutRecord` or `PutRecords` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html
   */
  export interface StreamEncryptionProperty {
    /**
     * The encryption type to use.
     *
     * The only valid value is `KMS` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-encryptiontype
     */
    readonly encryptionType: string;

    /**
     * The GUID for the customer-managed AWS KMS key to use for encryption.
     *
     * This value can be a globally unique identifier, a fully specified Amazon Resource Name (ARN) to either an alias or a key, or an alias name prefixed by "alias/".You can also use a master key owned by Kinesis Data Streams by specifying the alias `aws/kinesis` .
     *
     * - Key ARN example: `arn:aws:kms:us-east-1:123456789012:key/12345678-1234-1234-1234-123456789012`
     * - Alias ARN example: `arn:aws:kms:us-east-1:123456789012:alias/MyAliasName`
     * - Globally unique key ID example: `12345678-1234-1234-1234-123456789012`
     * - Alias name example: `alias/MyAliasName`
     * - Master key owned by Kinesis Data Streams: `alias/aws/kinesis`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-kinesis-stream-streamencryption.html#cfn-kinesis-stream-streamencryption-keyid
     */
    readonly keyId: string;
  }
}

/**
 * Properties for defining a `CfnStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html
 */
export interface CfnStreamProps {
  /**
   * The name of the Kinesis stream.
   *
   * If you don't specify a name, AWS CloudFormation generates a unique physical ID and uses that ID for the stream name. For more information, see [Name Type](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-name.html) .
   *
   * If you specify a name, you cannot perform updates that require replacement of this resource. You can perform updates that require no or some interruption. If you must replace the resource, specify a new name.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-name
   */
  readonly name?: string;

  /**
   * The number of hours for the data records that are stored in shards to remain accessible.
   *
   * The default value is 24. For more information about the stream retention period, see [Changing the Data Retention Period](https://docs.aws.amazon.com/streams/latest/dev/kinesis-extended-retention.html) in the Amazon Kinesis Developer Guide.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-retentionperiodhours
   */
  readonly retentionPeriodHours?: number;

  /**
   * The number of shards that the stream uses.
   *
   * For greater provisioned throughput, increase the number of shards.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-shardcount
   */
  readonly shardCount?: number;

  /**
   * When specified, enables or updates server-side encryption using an AWS KMS key for a specified stream.
   *
   * Removing this property from your stack template and updating your stack disables encryption.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streamencryption
   */
  readonly streamEncryption?: cdk.IResolvable | CfnStream.StreamEncryptionProperty;

  /**
   * Specifies the capacity mode to which you want to set your data stream.
   *
   * Currently, in Kinesis Data Streams, you can choose between an *on-demand* capacity mode and a *provisioned* capacity mode for your data streams.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-streammodedetails
   */
  readonly streamModeDetails?: cdk.IResolvable | CfnStream.StreamModeDetailsProperty;

  /**
   * An arbitrary set of tags (key–value pairs) to associate with the Kinesis stream.
   *
   * For information about constraints for this property, see [Tag Restrictions](https://docs.aws.amazon.com/streams/latest/dev/tagging.html#tagging-restrictions) in the *Amazon Kinesis Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-stream.html#cfn-kinesis-stream-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `StreamModeDetailsProperty`
 *
 * @param properties - the TypeScript properties of a `StreamModeDetailsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamStreamModeDetailsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("streamMode", cdk.requiredValidator)(properties.streamMode));
  errors.collect(cdk.propertyValidator("streamMode", cdk.validateString)(properties.streamMode));
  return errors.wrap("supplied properties not correct for \"StreamModeDetailsProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamStreamModeDetailsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamStreamModeDetailsPropertyValidator(properties).assertSuccess();
  return {
    "StreamMode": cdk.stringToCloudFormation(properties.streamMode)
  };
}

// @ts-ignore TS6133
function CfnStreamStreamModeDetailsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStream.StreamModeDetailsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStream.StreamModeDetailsProperty>();
  ret.addPropertyResult("streamMode", "StreamMode", (properties.StreamMode != null ? cfn_parse.FromCloudFormation.getString(properties.StreamMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `StreamEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamStreamEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionType", cdk.requiredValidator)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("encryptionType", cdk.validateString)(properties.encryptionType));
  errors.collect(cdk.propertyValidator("keyId", cdk.requiredValidator)(properties.keyId));
  errors.collect(cdk.propertyValidator("keyId", cdk.validateString)(properties.keyId));
  return errors.wrap("supplied properties not correct for \"StreamEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnStreamStreamEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamStreamEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionType": cdk.stringToCloudFormation(properties.encryptionType),
    "KeyId": cdk.stringToCloudFormation(properties.keyId)
  };
}

// @ts-ignore TS6133
function CfnStreamStreamEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStream.StreamEncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStream.StreamEncryptionProperty>();
  ret.addPropertyResult("encryptionType", "EncryptionType", (properties.EncryptionType != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionType) : undefined));
  ret.addPropertyResult("keyId", "KeyId", (properties.KeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStreamProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("retentionPeriodHours", cdk.validateNumber)(properties.retentionPeriodHours));
  errors.collect(cdk.propertyValidator("shardCount", cdk.validateNumber)(properties.shardCount));
  errors.collect(cdk.propertyValidator("streamEncryption", CfnStreamStreamEncryptionPropertyValidator)(properties.streamEncryption));
  errors.collect(cdk.propertyValidator("streamModeDetails", CfnStreamStreamModeDetailsPropertyValidator)(properties.streamModeDetails));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamPropsValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "RetentionPeriodHours": cdk.numberToCloudFormation(properties.retentionPeriodHours),
    "ShardCount": cdk.numberToCloudFormation(properties.shardCount),
    "StreamEncryption": convertCfnStreamStreamEncryptionPropertyToCloudFormation(properties.streamEncryption),
    "StreamModeDetails": convertCfnStreamStreamModeDetailsPropertyToCloudFormation(properties.streamModeDetails),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnStreamPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamProps>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("retentionPeriodHours", "RetentionPeriodHours", (properties.RetentionPeriodHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.RetentionPeriodHours) : undefined));
  ret.addPropertyResult("shardCount", "ShardCount", (properties.ShardCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.ShardCount) : undefined));
  ret.addPropertyResult("streamEncryption", "StreamEncryption", (properties.StreamEncryption != null ? CfnStreamStreamEncryptionPropertyFromCloudFormation(properties.StreamEncryption) : undefined));
  ret.addPropertyResult("streamModeDetails", "StreamModeDetails", (properties.StreamModeDetails != null ? CfnStreamStreamModeDetailsPropertyFromCloudFormation(properties.StreamModeDetails) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Use the AWS CloudFormation `AWS::Kinesis::StreamConsumer` resource to register a consumer with a Kinesis data stream.
 *
 * The consumer you register can then call [SubscribeToShard](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_SubscribeToShard.html) to receive data from the stream using enhanced fan-out, at a rate of up to 2 MiB per second for every shard you subscribe to. This rate is unaffected by the total number of consumers that read from the same stream.
 *
 * You can register up to five consumers per stream. However, you can request a limit increase using the [Kinesis Data Streams limits form](https://docs.aws.amazon.com/support/v1?#/) . A given consumer can only be registered with one stream at a time.
 *
 * For more information, see [Using Consumers with Enhanced Fan-Out](https://docs.aws.amazon.com/streams/latest/dev/introduction-to-enhanced-consumers.html) .
 *
 * @cloudformationResource AWS::Kinesis::StreamConsumer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html
 */
export class CfnStreamConsumer extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Kinesis::StreamConsumer";

  /**
   * Build a CfnStreamConsumer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStreamConsumer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStreamConsumerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStreamConsumer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * When you register a consumer, Kinesis Data Streams generates an ARN for it. You need this ARN to be able to call [SubscribeToShard](https://docs.aws.amazon.com/kinesis/latest/APIReference/API_SubscribeToShard.html) .
   *
   * If you delete a consumer and then create a new one with the same name, it won't have the same ARN. That's because consumer ARNs contain the creation timestamp. This is important to keep in mind if you have IAM policies that reference consumer ARNs.
   *
   * @cloudformationAttribute ConsumerARN
   */
  public readonly attrConsumerArn: string;

  /**
   * The time at which the consumer was created.
   *
   * @cloudformationAttribute ConsumerCreationTimestamp
   */
  public readonly attrConsumerCreationTimestamp: string;

  /**
   * The name you gave the consumer when you registered it.
   *
   * @cloudformationAttribute ConsumerName
   */
  public readonly attrConsumerName: string;

  /**
   * A consumer can't read data while in the `CREATING` or `DELETING` states.
   *
   * @cloudformationAttribute ConsumerStatus
   */
  public readonly attrConsumerStatus: string;

  /**
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The ARN of the data stream with which the consumer is registered.
   *
   * @cloudformationAttribute StreamARN
   */
  public readonly attrStreamArn: string;

  /**
   * The name of the consumer is something you choose when you register the consumer.
   */
  public consumerName: string;

  /**
   * The ARN of the stream with which you registered the consumer.
   */
  public streamArn: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStreamConsumerProps) {
    super(scope, id, {
      "type": CfnStreamConsumer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "consumerName", this);
    cdk.requireProperty(props, "streamArn", this);

    this.attrConsumerArn = cdk.Token.asString(this.getAtt("ConsumerARN", cdk.ResolutionTypeHint.STRING));
    this.attrConsumerCreationTimestamp = cdk.Token.asString(this.getAtt("ConsumerCreationTimestamp", cdk.ResolutionTypeHint.STRING));
    this.attrConsumerName = cdk.Token.asString(this.getAtt("ConsumerName", cdk.ResolutionTypeHint.STRING));
    this.attrConsumerStatus = cdk.Token.asString(this.getAtt("ConsumerStatus", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrStreamArn = cdk.Token.asString(this.getAtt("StreamARN", cdk.ResolutionTypeHint.STRING));
    this.consumerName = props.consumerName;
    this.streamArn = props.streamArn;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "consumerName": this.consumerName,
      "streamArn": this.streamArn
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStreamConsumer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStreamConsumerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStreamConsumer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html
 */
export interface CfnStreamConsumerProps {
  /**
   * The name of the consumer is something you choose when you register the consumer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html#cfn-kinesis-streamconsumer-consumername
   */
  readonly consumerName: string;

  /**
   * The ARN of the stream with which you registered the consumer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesis-streamconsumer.html#cfn-kinesis-streamconsumer-streamarn
   */
  readonly streamArn: string;
}

/**
 * Determine whether the given properties match those of a `CfnStreamConsumerProps`
 *
 * @param properties - the TypeScript properties of a `CfnStreamConsumerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStreamConsumerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("consumerName", cdk.requiredValidator)(properties.consumerName));
  errors.collect(cdk.propertyValidator("consumerName", cdk.validateString)(properties.consumerName));
  errors.collect(cdk.propertyValidator("streamArn", cdk.requiredValidator)(properties.streamArn));
  errors.collect(cdk.propertyValidator("streamArn", cdk.validateString)(properties.streamArn));
  return errors.wrap("supplied properties not correct for \"CfnStreamConsumerProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamConsumerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamConsumerPropsValidator(properties).assertSuccess();
  return {
    "ConsumerName": cdk.stringToCloudFormation(properties.consumerName),
    "StreamARN": cdk.stringToCloudFormation(properties.streamArn)
  };
}

// @ts-ignore TS6133
function CfnStreamConsumerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStreamConsumerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStreamConsumerProps>();
  ret.addPropertyResult("consumerName", "ConsumerName", (properties.ConsumerName != null ? cfn_parse.FromCloudFormation.getString(properties.ConsumerName) : undefined));
  ret.addPropertyResult("streamArn", "StreamARN", (properties.StreamARN != null ? cfn_parse.FromCloudFormation.getString(properties.StreamARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}