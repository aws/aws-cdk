/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Specifies a signaling channel.
 *
 * `CreateSignalingChannel` is an asynchronous operation.
 *
 * @cloudformationResource AWS::KinesisVideo::SignalingChannel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-signalingchannel.html
 */
export class CfnSignalingChannel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KinesisVideo::SignalingChannel";

  /**
   * Build a CfnSignalingChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSignalingChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSignalingChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSignalingChannel(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the signaling channel.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The period of time a signaling channel retains undelivered messages before they are discarded.
   */
  public messageTtlSeconds?: number;

  /**
   * A name for the signaling channel that you are creating.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * A type of the signaling channel that you are creating.
   */
  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSignalingChannelProps = {}) {
    super(scope, id, {
      "type": CfnSignalingChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.messageTtlSeconds = props.messageTtlSeconds;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::KinesisVideo::SignalingChannel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "messageTtlSeconds": this.messageTtlSeconds,
      "name": this.name,
      "tags": this.tags.renderTags(),
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSignalingChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSignalingChannelPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnSignalingChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-signalingchannel.html
 */
export interface CfnSignalingChannelProps {
  /**
   * The period of time a signaling channel retains undelivered messages before they are discarded.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-signalingchannel.html#cfn-kinesisvideo-signalingchannel-messagettlseconds
   */
  readonly messageTtlSeconds?: number;

  /**
   * A name for the signaling channel that you are creating.
   *
   * It must be unique for each AWS account and AWS Region .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-signalingchannel.html#cfn-kinesisvideo-signalingchannel-name
   */
  readonly name?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-signalingchannel.html#cfn-kinesisvideo-signalingchannel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * A type of the signaling channel that you are creating.
   *
   * Currently, `SINGLE_MASTER` is the only supported channel type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-signalingchannel.html#cfn-kinesisvideo-signalingchannel-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `CfnSignalingChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnSignalingChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSignalingChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("messageTtlSeconds", cdk.validateNumber)(properties.messageTtlSeconds));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnSignalingChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnSignalingChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSignalingChannelPropsValidator(properties).assertSuccess();
  return {
    "MessageTtlSeconds": cdk.numberToCloudFormation(properties.messageTtlSeconds),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSignalingChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSignalingChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSignalingChannelProps>();
  ret.addPropertyResult("messageTtlSeconds", "MessageTtlSeconds", (properties.MessageTtlSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MessageTtlSeconds) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a new Kinesis video stream.
 *
 * When you create a new stream, Kinesis Video Streams assigns it a version number. When you change the stream's metadata, Kinesis Video Streams updates the version.
 *
 * `CreateStream` is an asynchronous operation.
 *
 * For information about how the service works, see [How it Works](https://docs.aws.amazon.com/kinesisvideostreams/latest/dg/how-it-works.html) .
 *
 * You must have permissions for the `KinesisVideo:CreateStream` action.
 *
 * @cloudformationResource AWS::KinesisVideo::Stream
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html
 */
export class CfnStream extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::KinesisVideo::Stream";

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
   * The Amazon Resource Name (ARN) of the stream.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * How long the stream retains data, in hours.
   */
  public dataRetentionInHours?: number;

  /**
   * The name of the device that is associated with the stream.
   */
  public deviceName?: string;

  /**
   * The ID of the AWS Key Management Service ( AWS KMS ) key that Kinesis Video Streams uses to encrypt data on the stream.
   */
  public kmsKeyId?: string;

  /**
   * The `MediaType` of the stream.
   */
  public mediaType?: string;

  /**
   * The name of the stream.
   */
  public name?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
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
    this.dataRetentionInHours = props.dataRetentionInHours;
    this.deviceName = props.deviceName;
    this.kmsKeyId = props.kmsKeyId;
    this.mediaType = props.mediaType;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::KinesisVideo::Stream", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dataRetentionInHours": this.dataRetentionInHours,
      "deviceName": this.deviceName,
      "kmsKeyId": this.kmsKeyId,
      "mediaType": this.mediaType,
      "name": this.name,
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

/**
 * Properties for defining a `CfnStream`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html
 */
export interface CfnStreamProps {
  /**
   * How long the stream retains data, in hours.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html#cfn-kinesisvideo-stream-dataretentioninhours
   */
  readonly dataRetentionInHours?: number;

  /**
   * The name of the device that is associated with the stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html#cfn-kinesisvideo-stream-devicename
   */
  readonly deviceName?: string;

  /**
   * The ID of the AWS Key Management Service ( AWS KMS ) key that Kinesis Video Streams uses to encrypt data on the stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html#cfn-kinesisvideo-stream-kmskeyid
   */
  readonly kmsKeyId?: string;

  /**
   * The `MediaType` of the stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html#cfn-kinesisvideo-stream-mediatype
   */
  readonly mediaType?: string;

  /**
   * The name of the stream.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html#cfn-kinesisvideo-stream-name
   */
  readonly name?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-kinesisvideo-stream.html#cfn-kinesisvideo-stream-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
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
  errors.collect(cdk.propertyValidator("dataRetentionInHours", cdk.validateNumber)(properties.dataRetentionInHours));
  errors.collect(cdk.propertyValidator("deviceName", cdk.validateString)(properties.deviceName));
  errors.collect(cdk.propertyValidator("kmsKeyId", cdk.validateString)(properties.kmsKeyId));
  errors.collect(cdk.propertyValidator("mediaType", cdk.validateString)(properties.mediaType));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnStreamProps\"");
}

// @ts-ignore TS6133
function convertCfnStreamPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStreamPropsValidator(properties).assertSuccess();
  return {
    "DataRetentionInHours": cdk.numberToCloudFormation(properties.dataRetentionInHours),
    "DeviceName": cdk.stringToCloudFormation(properties.deviceName),
    "KmsKeyId": cdk.stringToCloudFormation(properties.kmsKeyId),
    "MediaType": cdk.stringToCloudFormation(properties.mediaType),
    "Name": cdk.stringToCloudFormation(properties.name),
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
  ret.addPropertyResult("dataRetentionInHours", "DataRetentionInHours", (properties.DataRetentionInHours != null ? cfn_parse.FromCloudFormation.getNumber(properties.DataRetentionInHours) : undefined));
  ret.addPropertyResult("deviceName", "DeviceName", (properties.DeviceName != null ? cfn_parse.FromCloudFormation.getString(properties.DeviceName) : undefined));
  ret.addPropertyResult("kmsKeyId", "KmsKeyId", (properties.KmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyId) : undefined));
  ret.addPropertyResult("mediaType", "MediaType", (properties.MediaType != null ? cfn_parse.FromCloudFormation.getString(properties.MediaType) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}