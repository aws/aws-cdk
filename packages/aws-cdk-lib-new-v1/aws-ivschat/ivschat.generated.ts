/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::IVSChat::LoggingConfiguration` resource specifies an  logging configuration that allows clients to store and record sent messages.
 *
 * For more information, see [CreateLoggingConfiguration](https://docs.aws.amazon.com/ivs/latest/ChatAPIReference/API_CreateLoggingConfiguration.html) in the *Amazon Interactive Video Service Chat API Reference* .
 *
 * @cloudformationResource AWS::IVSChat::LoggingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-loggingconfiguration.html
 */
export class CfnLoggingConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IVSChat::LoggingConfiguration";

  /**
   * Build a CfnLoggingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoggingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoggingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoggingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The logging-configuration ARN. For example: `arn:aws:ivschat:us-west-2:123456789012:logging-configuration/abcdABCDefgh`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The logging-configuration ID. For example: `abcdABCDefgh`
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * Indicates the current state of the logging configuration. When the state is `ACTIVE` , the configuration is ready to log a chat session. Valid values: `CREATING` | `CREATE_FAILED` | `DELETING` | `DELETE_FAILED` | `UPDATING` | `UPDATE_FAILED` | `ACTIVE` .
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The DestinationConfiguration is a complex type that contains information about where chat content will be logged.
   */
  public destinationConfiguration: CfnLoggingConfiguration.DestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Logging-configuration name.
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
  public constructor(scope: constructs.Construct, id: string, props: CfnLoggingConfigurationProps) {
    super(scope, id, {
      "type": CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "destinationConfiguration", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.destinationConfiguration = props.destinationConfiguration;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IVSChat::LoggingConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "destinationConfiguration": this.destinationConfiguration,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoggingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoggingConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnLoggingConfiguration {
  /**
   * The DestinationConfiguration property type describes a location where chat logs will be stored.
   *
   * Each member represents the configuration of one log destination. For logging, you define only one type of destination.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-destinationconfiguration.html
   */
  export interface DestinationConfigurationProperty {
    /**
     * An Amazon CloudWatch Logs destination configuration where chat activity will be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-destinationconfiguration.html#cfn-ivschat-loggingconfiguration-destinationconfiguration-cloudwatchlogs
     */
    readonly cloudWatchLogs?: CfnLoggingConfiguration.CloudWatchLogsDestinationConfigurationProperty | cdk.IResolvable;

    /**
     * An Amazon Kinesis Data Firehose destination configuration where chat activity will be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-destinationconfiguration.html#cfn-ivschat-loggingconfiguration-destinationconfiguration-firehose
     */
    readonly firehose?: CfnLoggingConfiguration.FirehoseDestinationConfigurationProperty | cdk.IResolvable;

    /**
     * An Amazon S3 destination configuration where chat activity will be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-destinationconfiguration.html#cfn-ivschat-loggingconfiguration-destinationconfiguration-s3
     */
    readonly s3?: cdk.IResolvable | CfnLoggingConfiguration.S3DestinationConfigurationProperty;
  }

  /**
   * The S3DestinationConfiguration property type specifies an S3 location where chat logs will be stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-s3destinationconfiguration.html
   */
  export interface S3DestinationConfigurationProperty {
    /**
     * Name of the Amazon S3 bucket where chat activity will be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-s3destinationconfiguration.html#cfn-ivschat-loggingconfiguration-s3destinationconfiguration-bucketname
     */
    readonly bucketName: string;
  }

  /**
   * The FirehoseDestinationConfiguration property type specifies a Kinesis Firehose location where chat logs will be stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-firehosedestinationconfiguration.html
   */
  export interface FirehoseDestinationConfigurationProperty {
    /**
     * Name of the Amazon Kinesis Firehose delivery stream where chat activity will be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-firehosedestinationconfiguration.html#cfn-ivschat-loggingconfiguration-firehosedestinationconfiguration-deliverystreamname
     */
    readonly deliveryStreamName: string;
  }

  /**
   * The CloudWatchLogsDestinationConfiguration property type specifies a CloudWatch Logs location where chat logs will be stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-cloudwatchlogsdestinationconfiguration.html
   */
  export interface CloudWatchLogsDestinationConfigurationProperty {
    /**
     * Name of the Amazon Cloudwatch Logs destination where chat activity will be logged.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-cloudwatchlogsdestinationconfiguration.html#cfn-ivschat-loggingconfiguration-cloudwatchlogsdestinationconfiguration-loggroupname
     */
    readonly logGroupName: string;
  }
}

/**
 * Properties for defining a `CfnLoggingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-loggingconfiguration.html
 */
export interface CfnLoggingConfigurationProps {
  /**
   * The DestinationConfiguration is a complex type that contains information about where chat content will be logged.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-loggingconfiguration.html#cfn-ivschat-loggingconfiguration-destinationconfiguration
   */
  readonly destinationConfiguration: CfnLoggingConfiguration.DestinationConfigurationProperty | cdk.IResolvable;

  /**
   * Logging-configuration name.
   *
   * The value does not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-loggingconfiguration.html#cfn-ivschat-loggingconfiguration-name
   */
  readonly name?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-loggingconfiguration-tag.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-loggingconfiguration.html#cfn-ivschat-loggingconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `S3DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationS3DestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  return errors.wrap("supplied properties not correct for \"S3DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationS3DestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationS3DestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationS3DestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLoggingConfiguration.S3DestinationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.S3DestinationConfigurationProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FirehoseDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FirehoseDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationFirehoseDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.requiredValidator)(properties.deliveryStreamName));
  errors.collect(cdk.propertyValidator("deliveryStreamName", cdk.validateString)(properties.deliveryStreamName));
  return errors.wrap("supplied properties not correct for \"FirehoseDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationFirehoseDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationFirehoseDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStreamName": cdk.stringToCloudFormation(properties.deliveryStreamName)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationFirehoseDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.FirehoseDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.FirehoseDestinationConfigurationProperty>();
  ret.addPropertyResult("deliveryStreamName", "DeliveryStreamName", (properties.DeliveryStreamName != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.CloudWatchLogsDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.CloudWatchLogsDestinationConfigurationProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogs", CfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyValidator)(properties.cloudWatchLogs));
  errors.collect(cdk.propertyValidator("firehose", CfnLoggingConfigurationFirehoseDestinationConfigurationPropertyValidator)(properties.firehose));
  errors.collect(cdk.propertyValidator("s3", CfnLoggingConfigurationS3DestinationConfigurationPropertyValidator)(properties.s3));
  return errors.wrap("supplied properties not correct for \"DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogs": convertCfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyToCloudFormation(properties.cloudWatchLogs),
    "Firehose": convertCfnLoggingConfigurationFirehoseDestinationConfigurationPropertyToCloudFormation(properties.firehose),
    "S3": convertCfnLoggingConfigurationS3DestinationConfigurationPropertyToCloudFormation(properties.s3)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfiguration.DestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfiguration.DestinationConfigurationProperty>();
  ret.addPropertyResult("cloudWatchLogs", "CloudWatchLogs", (properties.CloudWatchLogs != null ? CfnLoggingConfigurationCloudWatchLogsDestinationConfigurationPropertyFromCloudFormation(properties.CloudWatchLogs) : undefined));
  ret.addPropertyResult("firehose", "Firehose", (properties.Firehose != null ? CfnLoggingConfigurationFirehoseDestinationConfigurationPropertyFromCloudFormation(properties.Firehose) : undefined));
  ret.addPropertyResult("s3", "S3", (properties.S3 != null ? CfnLoggingConfigurationS3DestinationConfigurationPropertyFromCloudFormation(properties.S3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLoggingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoggingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoggingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationConfiguration", cdk.requiredValidator)(properties.destinationConfiguration));
  errors.collect(cdk.propertyValidator("destinationConfiguration", CfnLoggingConfigurationDestinationConfigurationPropertyValidator)(properties.destinationConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnLoggingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnLoggingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoggingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "DestinationConfiguration": convertCfnLoggingConfigurationDestinationConfigurationPropertyToCloudFormation(properties.destinationConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnLoggingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoggingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoggingConfigurationProps>();
  ret.addPropertyResult("destinationConfiguration", "DestinationConfiguration", (properties.DestinationConfiguration != null ? CfnLoggingConfigurationDestinationConfigurationPropertyFromCloudFormation(properties.DestinationConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::IVSChat::Room` resource specifies an  room that allows clients to connect and pass messages.
 *
 * For more information, see [CreateRoom](https://docs.aws.amazon.com/ivs/latest/ChatAPIReference/API_CreateRoom.html) in the *Amazon Interactive Video Service Chat API Reference* .
 *
 * @cloudformationResource AWS::IVSChat::Room
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html
 */
export class CfnRoom extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IVSChat::Room";

  /**
   * Build a CfnRoom from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnRoom {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnRoomPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnRoom(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The room ARN. For example: `arn:aws:ivschat:us-west-2:123456789012:room/abcdABCDefgh`
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The room ID. For example: `abcdABCDefgh`
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * List of logging-configuration identifiers attached to the room.
   */
  public loggingConfigurationIdentifiers?: Array<string>;

  /**
   * Maximum number of characters in a single message.
   */
  public maximumMessageLength?: number;

  /**
   * Maximum number of messages per second that can be sent to the room (by all clients).
   */
  public maximumMessageRatePerSecond?: number;

  /**
   * Configuration information for optional review of messages.
   */
  public messageReviewHandler?: cdk.IResolvable | CfnRoom.MessageReviewHandlerProperty;

  /**
   * Room name.
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
  public constructor(scope: constructs.Construct, id: string, props: CfnRoomProps = {}) {
    super(scope, id, {
      "type": CfnRoom.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.loggingConfigurationIdentifiers = props.loggingConfigurationIdentifiers;
    this.maximumMessageLength = props.maximumMessageLength;
    this.maximumMessageRatePerSecond = props.maximumMessageRatePerSecond;
    this.messageReviewHandler = props.messageReviewHandler;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IVSChat::Room", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "loggingConfigurationIdentifiers": this.loggingConfigurationIdentifiers,
      "maximumMessageLength": this.maximumMessageLength,
      "maximumMessageRatePerSecond": this.maximumMessageRatePerSecond,
      "messageReviewHandler": this.messageReviewHandler,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnRoom.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnRoomPropsToCloudFormation(props);
  }
}

export namespace CfnRoom {
  /**
   * The MessageReviewHandler property type specifies configuration information for optional message review.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-room-messagereviewhandler.html
   */
  export interface MessageReviewHandlerProperty {
    /**
     * Specifies the fallback behavior (whether the message is allowed or denied) if the handler does not return a valid response, encounters an error, or times out.
     *
     * (For the timeout period, see [Service Quotas](https://docs.aws.amazon.com/ivs/latest/userguide/service-quotas.html) .) If allowed, the message is delivered with returned content to all users connected to the room. If denied, the message is not delivered to any user.
     *
     * *Default* : `ALLOW`
     *
     * @default - "ALLOW"
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-room-messagereviewhandler.html#cfn-ivschat-room-messagereviewhandler-fallbackresult
     */
    readonly fallbackResult?: string;

    /**
     * Identifier of the message review handler.
     *
     * Currently this must be an ARN of a lambda function.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-room-messagereviewhandler.html#cfn-ivschat-room-messagereviewhandler-uri
     */
    readonly uri?: string;
  }
}

/**
 * Properties for defining a `CfnRoom`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html
 */
export interface CfnRoomProps {
  /**
   * List of logging-configuration identifiers attached to the room.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html#cfn-ivschat-room-loggingconfigurationidentifiers
   */
  readonly loggingConfigurationIdentifiers?: Array<string>;

  /**
   * Maximum number of characters in a single message.
   *
   * Messages are expected to be UTF-8 encoded and this limit applies specifically to rune/code-point count, not number of bytes.
   *
   * @default - 500
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html#cfn-ivschat-room-maximummessagelength
   */
  readonly maximumMessageLength?: number;

  /**
   * Maximum number of messages per second that can be sent to the room (by all clients).
   *
   * @default - 10
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html#cfn-ivschat-room-maximummessageratepersecond
   */
  readonly maximumMessageRatePerSecond?: number;

  /**
   * Configuration information for optional review of messages.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html#cfn-ivschat-room-messagereviewhandler
   */
  readonly messageReviewHandler?: cdk.IResolvable | CfnRoom.MessageReviewHandlerProperty;

  /**
   * Room name.
   *
   * The value does not need to be unique.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html#cfn-ivschat-room-name
   */
  readonly name?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ivschat-room-tag.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ivschat-room.html#cfn-ivschat-room-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `MessageReviewHandlerProperty`
 *
 * @param properties - the TypeScript properties of a `MessageReviewHandlerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoomMessageReviewHandlerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fallbackResult", cdk.validateString)(properties.fallbackResult));
  errors.collect(cdk.propertyValidator("uri", cdk.validateString)(properties.uri));
  return errors.wrap("supplied properties not correct for \"MessageReviewHandlerProperty\"");
}

// @ts-ignore TS6133
function convertCfnRoomMessageReviewHandlerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoomMessageReviewHandlerPropertyValidator(properties).assertSuccess();
  return {
    "FallbackResult": cdk.stringToCloudFormation(properties.fallbackResult),
    "Uri": cdk.stringToCloudFormation(properties.uri)
  };
}

// @ts-ignore TS6133
function CfnRoomMessageReviewHandlerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnRoom.MessageReviewHandlerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoom.MessageReviewHandlerProperty>();
  ret.addPropertyResult("fallbackResult", "FallbackResult", (properties.FallbackResult != null ? cfn_parse.FromCloudFormation.getString(properties.FallbackResult) : undefined));
  ret.addPropertyResult("uri", "Uri", (properties.Uri != null ? cfn_parse.FromCloudFormation.getString(properties.Uri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnRoomProps`
 *
 * @param properties - the TypeScript properties of a `CfnRoomProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnRoomPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("loggingConfigurationIdentifiers", cdk.listValidator(cdk.validateString))(properties.loggingConfigurationIdentifiers));
  errors.collect(cdk.propertyValidator("maximumMessageLength", cdk.validateNumber)(properties.maximumMessageLength));
  errors.collect(cdk.propertyValidator("maximumMessageRatePerSecond", cdk.validateNumber)(properties.maximumMessageRatePerSecond));
  errors.collect(cdk.propertyValidator("messageReviewHandler", CfnRoomMessageReviewHandlerPropertyValidator)(properties.messageReviewHandler));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnRoomProps\"");
}

// @ts-ignore TS6133
function convertCfnRoomPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnRoomPropsValidator(properties).assertSuccess();
  return {
    "LoggingConfigurationIdentifiers": cdk.listMapper(cdk.stringToCloudFormation)(properties.loggingConfigurationIdentifiers),
    "MaximumMessageLength": cdk.numberToCloudFormation(properties.maximumMessageLength),
    "MaximumMessageRatePerSecond": cdk.numberToCloudFormation(properties.maximumMessageRatePerSecond),
    "MessageReviewHandler": convertCfnRoomMessageReviewHandlerPropertyToCloudFormation(properties.messageReviewHandler),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnRoomPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnRoomProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnRoomProps>();
  ret.addPropertyResult("loggingConfigurationIdentifiers", "LoggingConfigurationIdentifiers", (properties.LoggingConfigurationIdentifiers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.LoggingConfigurationIdentifiers) : undefined));
  ret.addPropertyResult("maximumMessageLength", "MaximumMessageLength", (properties.MaximumMessageLength != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumMessageLength) : undefined));
  ret.addPropertyResult("maximumMessageRatePerSecond", "MaximumMessageRatePerSecond", (properties.MaximumMessageRatePerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumMessageRatePerSecond) : undefined));
  ret.addPropertyResult("messageReviewHandler", "MessageReviewHandler", (properties.MessageReviewHandler != null ? CfnRoomMessageReviewHandlerPropertyFromCloudFormation(properties.MessageReviewHandler) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}