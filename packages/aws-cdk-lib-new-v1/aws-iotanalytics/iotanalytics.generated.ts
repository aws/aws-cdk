/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::IoTAnalytics::Channel resource collects data from an MQTT topic and archives the raw, unprocessed messages before publishing the data to a pipeline.
 *
 * For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Channel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTAnalytics::Channel";

  /**
   * Build a CfnChannel from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannel {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnChannelPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnChannel(scope, id, propsResult.value);
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
   * The name of the channel.
   */
  public channelName?: string;

  /**
   * Where channel data is stored.
   */
  public channelStorage?: CfnChannel.ChannelStorageProperty | cdk.IResolvable;

  /**
   * How long, in days, message data is kept for the channel.
   */
  public retentionPeriod?: cdk.IResolvable | CfnChannel.RetentionPeriodProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the channel.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelProps = {}) {
    super(scope, id, {
      "type": CfnChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.channelName = props.channelName;
    this.channelStorage = props.channelStorage;
    this.retentionPeriod = props.retentionPeriod;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Channel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelName": this.channelName,
      "channelStorage": this.channelStorage,
      "retentionPeriod": this.retentionPeriod,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannel.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnChannelPropsToCloudFormation(props);
  }
}

export namespace CfnChannel {
  /**
   * Where channel data is stored.
   *
   * You may choose one of `serviceManagedS3` , `customerManagedS3` storage. If not specified, the default is `serviceManagedS3` . This can't be changed after creation of the channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html
   */
  export interface ChannelStorageProperty {
    /**
     * Used to store channel data in an S3 bucket that you manage.
     *
     * If customer managed storage is selected, the `retentionPeriod` parameter is ignored. You can't change the choice of S3 storage after the data store is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html#cfn-iotanalytics-channel-channelstorage-customermanageds3
     */
    readonly customerManagedS3?: CfnChannel.CustomerManagedS3Property | cdk.IResolvable;

    /**
     * Used to store channel data in an S3 bucket managed by AWS IoT Analytics .
     *
     * You can't change the choice of S3 storage after the data store is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-channelstorage.html#cfn-iotanalytics-channel-channelstorage-servicemanageds3
     */
    readonly serviceManagedS3?: any | cdk.IResolvable;
  }

  /**
   * Used to store channel data in an S3 bucket that you manage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html
   */
  export interface CustomerManagedS3Property {
    /**
     * The name of the S3 bucket in which channel data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html#cfn-iotanalytics-channel-customermanageds3-bucket
     */
    readonly bucket: string;

    /**
     * (Optional) The prefix used to create the keys of the channel data objects.
     *
     * Each object in an S3 bucket has a key that is its unique identifier within the bucket (each object in a bucket has exactly one key). The prefix must end with a forward slash (/).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html#cfn-iotanalytics-channel-customermanageds3-keyprefix
     */
    readonly keyPrefix?: string;

    /**
     * The ARN of the role that grants AWS IoT Analytics permission to interact with your Amazon S3 resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-customermanageds3.html#cfn-iotanalytics-channel-customermanageds3-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * How long, in days, message data is kept.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html
   */
  export interface RetentionPeriodProperty {
    /**
     * The number of days that message data is kept.
     *
     * The `unlimited` parameter must be false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html#cfn-iotanalytics-channel-retentionperiod-numberofdays
     */
    readonly numberOfDays?: number;

    /**
     * If true, message data is kept indefinitely.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-channel-retentionperiod.html#cfn-iotanalytics-channel-retentionperiod-unlimited
     */
    readonly unlimited?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html
 */
export interface CfnChannelProps {
  /**
   * The name of the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelname
   */
  readonly channelName?: string;

  /**
   * Where channel data is stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-channelstorage
   */
  readonly channelStorage?: CfnChannel.ChannelStorageProperty | cdk.IResolvable;

  /**
   * How long, in days, message data is kept for the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-retentionperiod
   */
  readonly retentionPeriod?: cdk.IResolvable | CfnChannel.RetentionPeriodProperty;

  /**
   * Metadata which can be used to manage the channel.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-channel.html#cfn-iotanalytics-channel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CustomerManagedS3Property`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelCustomerManagedS3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("keyPrefix", cdk.validateString)(properties.keyPrefix));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CustomerManagedS3Property\"");
}

// @ts-ignore TS6133
function convertCfnChannelCustomerManagedS3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelCustomerManagedS3PropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "KeyPrefix": cdk.stringToCloudFormation(properties.keyPrefix),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnChannelCustomerManagedS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.CustomerManagedS3Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.CustomerManagedS3Property>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("keyPrefix", "KeyPrefix", (properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ChannelStorageProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelChannelStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerManagedS3", CfnChannelCustomerManagedS3PropertyValidator)(properties.customerManagedS3));
  errors.collect(cdk.propertyValidator("serviceManagedS3", cdk.validateObject)(properties.serviceManagedS3));
  return errors.wrap("supplied properties not correct for \"ChannelStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelChannelStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelChannelStoragePropertyValidator(properties).assertSuccess();
  return {
    "CustomerManagedS3": convertCfnChannelCustomerManagedS3PropertyToCloudFormation(properties.customerManagedS3),
    "ServiceManagedS3": cdk.objectToCloudFormation(properties.serviceManagedS3)
  };
}

// @ts-ignore TS6133
function CfnChannelChannelStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.ChannelStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.ChannelStorageProperty>();
  ret.addPropertyResult("customerManagedS3", "CustomerManagedS3", (properties.CustomerManagedS3 != null ? CfnChannelCustomerManagedS3PropertyFromCloudFormation(properties.CustomerManagedS3) : undefined));
  ret.addPropertyResult("serviceManagedS3", "ServiceManagedS3", (properties.ServiceManagedS3 != null ? cfn_parse.FromCloudFormation.getAny(properties.ServiceManagedS3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetentionPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelRetentionPeriodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numberOfDays", cdk.validateNumber)(properties.numberOfDays));
  errors.collect(cdk.propertyValidator("unlimited", cdk.validateBoolean)(properties.unlimited));
  return errors.wrap("supplied properties not correct for \"RetentionPeriodProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelRetentionPeriodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelRetentionPeriodPropertyValidator(properties).assertSuccess();
  return {
    "NumberOfDays": cdk.numberToCloudFormation(properties.numberOfDays),
    "Unlimited": cdk.booleanToCloudFormation(properties.unlimited)
  };
}

// @ts-ignore TS6133
function CfnChannelRetentionPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnChannel.RetentionPeriodProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.RetentionPeriodProperty>();
  ret.addPropertyResult("numberOfDays", "NumberOfDays", (properties.NumberOfDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDays) : undefined));
  ret.addPropertyResult("unlimited", "Unlimited", (properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnChannelProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelStorage", CfnChannelChannelStoragePropertyValidator)(properties.channelStorage));
  errors.collect(cdk.propertyValidator("retentionPeriod", CfnChannelRetentionPeriodPropertyValidator)(properties.retentionPeriod));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPropsValidator(properties).assertSuccess();
  return {
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "ChannelStorage": convertCfnChannelChannelStoragePropertyToCloudFormation(properties.channelStorage),
    "RetentionPeriod": convertCfnChannelRetentionPeriodPropertyToCloudFormation(properties.retentionPeriod),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnChannelPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelProps>();
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("channelStorage", "ChannelStorage", (properties.ChannelStorage != null ? CfnChannelChannelStoragePropertyFromCloudFormation(properties.ChannelStorage) : undefined));
  ret.addPropertyResult("retentionPeriod", "RetentionPeriod", (properties.RetentionPeriod != null ? CfnChannelRetentionPeriodPropertyFromCloudFormation(properties.RetentionPeriod) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::IoTAnalytics::Dataset resource stores data retrieved from a data store by applying a `queryAction` (an SQL query) or a `containerAction` (executing a containerized application).
 *
 * The data set can be populated manually by calling `CreateDatasetContent` or automatically according to a `trigger` you specify. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Dataset
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html
 */
export class CfnDataset extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTAnalytics::Dataset";

  /**
   * Build a CfnDataset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDataset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatasetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDataset(scope, id, propsResult.value);
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
   * The `DatasetAction` objects that automatically create the dataset contents.
   */
  public actions: Array<CfnDataset.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * When dataset contents are created they are delivered to destinations specified here.
   */
  public contentDeliveryRules?: Array<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the dataset.
   */
  public datasetName?: string;

  /**
   * A list of data rules that send notifications to CloudWatch, when data arrives late.
   */
  public lateDataRules?: Array<cdk.IResolvable | CfnDataset.LateDataRuleProperty> | cdk.IResolvable;

  /**
   * Optional.
   */
  public retentionPeriod?: cdk.IResolvable | CfnDataset.RetentionPeriodProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the data set.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The `DatasetTrigger` objects that specify when the dataset is automatically updated.
   */
  public triggers?: Array<cdk.IResolvable | CfnDataset.TriggerProperty> | cdk.IResolvable;

  /**
   * Optional.
   */
  public versioningConfiguration?: cdk.IResolvable | CfnDataset.VersioningConfigurationProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatasetProps) {
    super(scope, id, {
      "type": CfnDataset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "actions", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.contentDeliveryRules = props.contentDeliveryRules;
    this.datasetName = props.datasetName;
    this.lateDataRules = props.lateDataRules;
    this.retentionPeriod = props.retentionPeriod;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Dataset", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.triggers = props.triggers;
    this.versioningConfiguration = props.versioningConfiguration;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "contentDeliveryRules": this.contentDeliveryRules,
      "datasetName": this.datasetName,
      "lateDataRules": this.lateDataRules,
      "retentionPeriod": this.retentionPeriod,
      "tags": this.tags.renderTags(),
      "triggers": this.triggers,
      "versioningConfiguration": this.versioningConfiguration
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDataset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatasetPropsToCloudFormation(props);
  }
}

export namespace CfnDataset {
  /**
   * Information needed to run the "containerAction" to produce data set contents.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html
   */
  export interface ActionProperty {
    /**
     * The name of the data set action by which data set contents are automatically created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html#cfn-iotanalytics-dataset-action-actionname
     */
    readonly actionName: string;

    /**
     * Information which allows the system to run a containerized application in order to create the data set contents.
     *
     * The application must be in a Docker container along with any needed support libraries.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html#cfn-iotanalytics-dataset-action-containeraction
     */
    readonly containerAction?: CfnDataset.ContainerActionProperty | cdk.IResolvable;

    /**
     * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-action.html#cfn-iotanalytics-dataset-action-queryaction
     */
    readonly queryAction?: cdk.IResolvable | CfnDataset.QueryActionProperty;
  }

  /**
   * Information needed to run the "containerAction" to produce data set contents.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html
   */
  export interface ContainerActionProperty {
    /**
     * The ARN of the role which gives permission to the system to access needed resources in order to run the "containerAction".
     *
     * This includes, at minimum, permission to retrieve the data set contents which are the input to the containerized application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-executionrolearn
     */
    readonly executionRoleArn: string;

    /**
     * The ARN of the Docker container stored in your account.
     *
     * The Docker container contains an application and needed support libraries and is used to generate data set contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-image
     */
    readonly image: string;

    /**
     * Configuration of the resource which executes the "containerAction".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-resourceconfiguration
     */
    readonly resourceConfiguration: cdk.IResolvable | CfnDataset.ResourceConfigurationProperty;

    /**
     * The values of variables used within the context of the execution of the containerized application (basically, parameters passed to the application).
     *
     * Each variable must have a name and a value given by one of "stringValue", "datasetContentVersionValue", or "outputFileUriValue".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-containeraction.html#cfn-iotanalytics-dataset-containeraction-variables
     */
    readonly variables?: Array<cdk.IResolvable | CfnDataset.VariableProperty> | cdk.IResolvable;
  }

  /**
   * An instance of a variable to be passed to the `containerAction` execution.
   *
   * Each variable must have a name and a value given by one of `stringValue` , `datasetContentVersionValue` , or `outputFileUriValue` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html
   */
  export interface VariableProperty {
    /**
     * The value of the variable as a structure that specifies a dataset content version.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-datasetcontentversionvalue
     */
    readonly datasetContentVersionValue?: CfnDataset.DatasetContentVersionValueProperty | cdk.IResolvable;

    /**
     * The value of the variable as a double (numeric).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-doublevalue
     */
    readonly doubleValue?: number;

    /**
     * The value of the variable as a structure that specifies an output file URI.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-outputfileurivalue
     */
    readonly outputFileUriValue?: cdk.IResolvable | CfnDataset.OutputFileUriValueProperty;

    /**
     * The value of the variable as a string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-stringvalue
     */
    readonly stringValue?: string;

    /**
     * The name of the variable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-variable.html#cfn-iotanalytics-dataset-variable-variablename
     */
    readonly variableName: string;
  }

  /**
   * The dataset whose latest contents are used as input to the notebook or application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentversionvalue.html
   */
  export interface DatasetContentVersionValueProperty {
    /**
     * The name of the dataset whose latest contents are used as input to the notebook or application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentversionvalue.html#cfn-iotanalytics-dataset-datasetcontentversionvalue-datasetname
     */
    readonly datasetName: string;
  }

  /**
   * The value of the variable as a structure that specifies an output file URI.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-outputfileurivalue.html
   */
  export interface OutputFileUriValueProperty {
    /**
     * The URI of the location where dataset contents are stored, usually the URI of a file in an S3 bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-outputfileurivalue.html#cfn-iotanalytics-dataset-outputfileurivalue-filename
     */
    readonly fileName: string;
  }

  /**
   * The configuration of the resource used to execute the `containerAction` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html
   */
  export interface ResourceConfigurationProperty {
    /**
     * The type of the compute resource used to execute the `containerAction` .
     *
     * Possible values are: `ACU_1` (vCPU=4, memory=16 GiB) or `ACU_2` (vCPU=8, memory=32 GiB).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html#cfn-iotanalytics-dataset-resourceconfiguration-computetype
     */
    readonly computeType: string;

    /**
     * The size, in GB, of the persistent storage available to the resource instance used to execute the `containerAction` (min: 1, max: 50).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-resourceconfiguration.html#cfn-iotanalytics-dataset-resourceconfiguration-volumesizeingb
     */
    readonly volumeSizeInGb: number;
  }

  /**
   * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html
   */
  export interface QueryActionProperty {
    /**
     * Pre-filters applied to message data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html#cfn-iotanalytics-dataset-queryaction-filters
     */
    readonly filters?: Array<CfnDataset.FilterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An "SqlQueryDatasetAction" object that uses an SQL query to automatically create data set contents.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-queryaction.html#cfn-iotanalytics-dataset-queryaction-sqlquery
     */
    readonly sqlQuery: string;
  }

  /**
   * Information which is used to filter message data, to segregate it according to the time frame in which it arrives.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-filter.html
   */
  export interface FilterProperty {
    /**
     * Used to limit data to that which has arrived since the last execution of the action.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-filter.html#cfn-iotanalytics-dataset-filter-deltatime
     */
    readonly deltaTime?: CfnDataset.DeltaTimeProperty | cdk.IResolvable;
  }

  /**
   * Used to limit data to that which has arrived since the last execution of the action.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html
   */
  export interface DeltaTimeProperty {
    /**
     * The number of seconds of estimated in-flight lag time of message data.
     *
     * When you create dataset contents using message data from a specified timeframe, some message data might still be in flight when processing begins, and so do not arrive in time to be processed. Use this field to make allowances for the in flight time of your message data, so that data not processed from a previous timeframe is included with the next timeframe. Otherwise, missed message data would be excluded from processing during the next timeframe too, because its timestamp places it within the previous timeframe.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html#cfn-iotanalytics-dataset-deltatime-offsetseconds
     */
    readonly offsetSeconds: number;

    /**
     * An expression by which the time of the message data might be determined.
     *
     * This can be the name of a timestamp field or a SQL expression that is used to derive the time the message data was generated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatime.html#cfn-iotanalytics-dataset-deltatime-timeexpression
     */
    readonly timeExpression: string;
  }

  /**
   * A structure that contains the name and configuration information of a late data rule.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html
   */
  export interface LateDataRuleProperty {
    /**
     * The information needed to configure the late data rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html#cfn-iotanalytics-dataset-latedatarule-ruleconfiguration
     */
    readonly ruleConfiguration: cdk.IResolvable | CfnDataset.LateDataRuleConfigurationProperty;

    /**
     * The name of the late data rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedatarule.html#cfn-iotanalytics-dataset-latedatarule-rulename
     */
    readonly ruleName?: string;
  }

  /**
   * The information needed to configure a delta time session window.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedataruleconfiguration.html
   */
  export interface LateDataRuleConfigurationProperty {
    /**
     * The information needed to configure a delta time session window.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-latedataruleconfiguration.html#cfn-iotanalytics-dataset-latedataruleconfiguration-deltatimesessionwindowconfiguration
     */
    readonly deltaTimeSessionWindowConfiguration?: CfnDataset.DeltaTimeSessionWindowConfigurationProperty | cdk.IResolvable;
  }

  /**
   * A structure that contains the configuration information of a delta time session window.
   *
   * [`DeltaTime`](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_DeltaTime.html) specifies a time interval. You can use `DeltaTime` to create dataset contents with data that has arrived in the data store since the last execution. For an example of `DeltaTime` , see [Creating a SQL dataset with a delta window (CLI)](https://docs.aws.amazon.com/iotanalytics/latest/userguide/automate-create-dataset.html#automate-example6) in the *AWS IoT Analytics User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatimesessionwindowconfiguration.html
   */
  export interface DeltaTimeSessionWindowConfigurationProperty {
    /**
     * A time interval.
     *
     * You can use `timeoutInMinutes` so that AWS IoT Analytics can batch up late data notifications that have been generated since the last execution. AWS IoT Analytics sends one batch of notifications to Amazon CloudWatch Events at one time.
     *
     * For more information about how to write a timestamp expression, see [Date and Time Functions and Operators](https://docs.aws.amazon.com/https://prestodb.io/docs/current/functions/datetime.html) , in the *Presto 0.172 Documentation* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-deltatimesessionwindowconfiguration.html#cfn-iotanalytics-dataset-deltatimesessionwindowconfiguration-timeoutinminutes
     */
    readonly timeoutInMinutes: number;
  }

  /**
   * When dataset contents are created, they are delivered to destination specified here.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html
   */
  export interface DatasetContentDeliveryRuleProperty {
    /**
     * The destination to which dataset contents are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html#cfn-iotanalytics-dataset-datasetcontentdeliveryrule-destination
     */
    readonly destination: CfnDataset.DatasetContentDeliveryRuleDestinationProperty | cdk.IResolvable;

    /**
     * The name of the dataset content delivery rules entry.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryrule.html#cfn-iotanalytics-dataset-datasetcontentdeliveryrule-entryname
     */
    readonly entryName?: string;
  }

  /**
   * The destination to which dataset contents are delivered.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html
   */
  export interface DatasetContentDeliveryRuleDestinationProperty {
    /**
     * Configuration information for delivery of dataset contents to AWS IoT Events .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html#cfn-iotanalytics-dataset-datasetcontentdeliveryruledestination-ioteventsdestinationconfiguration
     */
    readonly iotEventsDestinationConfiguration?: CfnDataset.IotEventsDestinationConfigurationProperty | cdk.IResolvable;

    /**
     * Configuration information for delivery of dataset contents to Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-datasetcontentdeliveryruledestination.html#cfn-iotanalytics-dataset-datasetcontentdeliveryruledestination-s3destinationconfiguration
     */
    readonly s3DestinationConfiguration?: cdk.IResolvable | CfnDataset.S3DestinationConfigurationProperty;
  }

  /**
   * Configuration information for delivery of dataset contents to AWS IoT Events .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html
   */
  export interface IotEventsDestinationConfigurationProperty {
    /**
     * The name of the AWS IoT Events input to which dataset contents are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html#cfn-iotanalytics-dataset-ioteventsdestinationconfiguration-inputname
     */
    readonly inputName: string;

    /**
     * The ARN of the role that grants AWS IoT Analytics permission to deliver dataset contents to an AWS IoT Events input.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-ioteventsdestinationconfiguration.html#cfn-iotanalytics-dataset-ioteventsdestinationconfiguration-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Configuration information for delivery of dataset contents to Amazon Simple Storage Service (Amazon S3).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html
   */
  export interface S3DestinationConfigurationProperty {
    /**
     * The name of the S3 bucket to which dataset contents are delivered.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-bucket
     */
    readonly bucket: string;

    /**
     * Configuration information for coordination with AWS Glue , a fully managed extract, transform and load (ETL) service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-glueconfiguration
     */
    readonly glueConfiguration?: CfnDataset.GlueConfigurationProperty | cdk.IResolvable;

    /**
     * The key of the dataset contents object in an S3 bucket.
     *
     * Each object has a key that is a unique identifier. Each object has exactly one key.
     *
     * You can create a unique key with the following options:
     *
     * - Use `!{iotanalytics:scheduleTime}` to insert the time of a scheduled SQL query run.
     * - Use `!{iotanalytics:versionId}` to insert a unique hash that identifies a dataset content.
     * - Use `!{iotanalytics:creationTime}` to insert the creation time of a dataset content.
     *
     * The following example creates a unique key for a CSV file: `dataset/mydataset/!{iotanalytics:scheduleTime}/!{iotanalytics:versionId}.csv`
     *
     * > If you don't use `!{iotanalytics:versionId}` to specify the key, you might get duplicate keys. For example, you might have two dataset contents with the same `scheduleTime` but different `versionId` s. This means that one dataset content overwrites the other.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-key
     */
    readonly key: string;

    /**
     * The ARN of the role that grants AWS IoT Analytics permission to interact with your Amazon S3 and AWS Glue resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-s3destinationconfiguration.html#cfn-iotanalytics-dataset-s3destinationconfiguration-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Configuration information for coordination with AWS Glue , a fully managed extract, transform and load (ETL) service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html
   */
  export interface GlueConfigurationProperty {
    /**
     * The name of the database in your AWS Glue Data Catalog in which the table is located.
     *
     * An AWS Glue Data Catalog database contains metadata tables.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html#cfn-iotanalytics-dataset-glueconfiguration-databasename
     */
    readonly databaseName: string;

    /**
     * The name of the table in your AWS Glue Data Catalog that is used to perform the ETL operations.
     *
     * An AWS Glue Data Catalog table contains partitioned data and descriptions of data sources and targets.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-glueconfiguration.html#cfn-iotanalytics-dataset-glueconfiguration-tablename
     */
    readonly tableName: string;
  }

  /**
   * The "DatasetTrigger" that specifies when the data set is automatically updated.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html
   */
  export interface TriggerProperty {
    /**
     * The "Schedule" when the trigger is initiated.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html#cfn-iotanalytics-dataset-trigger-schedule
     */
    readonly schedule?: cdk.IResolvable | CfnDataset.ScheduleProperty;

    /**
     * Information about the data set whose content generation triggers the new data set content generation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-trigger.html#cfn-iotanalytics-dataset-trigger-triggeringdataset
     */
    readonly triggeringDataset?: cdk.IResolvable | CfnDataset.TriggeringDatasetProperty;
  }

  /**
   * The schedule for when to trigger an update.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-schedule.html
   */
  export interface ScheduleProperty {
    /**
     * The expression that defines when to trigger an update.
     *
     * For more information, see [Schedule Expressions for Rules](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) in the Amazon CloudWatch documentation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-schedule.html#cfn-iotanalytics-dataset-schedule-scheduleexpression
     */
    readonly scheduleExpression: string;
  }

  /**
   * Information about the dataset whose content generation triggers the new dataset content generation.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-triggeringdataset.html
   */
  export interface TriggeringDatasetProperty {
    /**
     * The name of the data set whose content generation triggers the new data set content generation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-triggeringdataset.html#cfn-iotanalytics-dataset-triggeringdataset-datasetname
     */
    readonly datasetName: string;
  }

  /**
   * Information about the versioning of dataset contents.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html
   */
  export interface VersioningConfigurationProperty {
    /**
     * How many versions of dataset contents are kept.
     *
     * The `unlimited` parameter must be `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html#cfn-iotanalytics-dataset-versioningconfiguration-maxversions
     */
    readonly maxVersions?: number;

    /**
     * If true, unlimited versions of dataset contents are kept.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-versioningconfiguration.html#cfn-iotanalytics-dataset-versioningconfiguration-unlimited
     */
    readonly unlimited?: boolean | cdk.IResolvable;
  }

  /**
   * How long, in days, message data is kept.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html
   */
  export interface RetentionPeriodProperty {
    /**
     * The number of days that message data is kept.
     *
     * The `unlimited` parameter must be false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html#cfn-iotanalytics-dataset-retentionperiod-numberofdays
     */
    readonly numberOfDays?: number;

    /**
     * If true, message data is kept indefinitely.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-dataset-retentionperiod.html#cfn-iotanalytics-dataset-retentionperiod-unlimited
     */
    readonly unlimited?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnDataset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html
 */
export interface CfnDatasetProps {
  /**
   * The `DatasetAction` objects that automatically create the dataset contents.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-actions
   */
  readonly actions: Array<CfnDataset.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * When dataset contents are created they are delivered to destinations specified here.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-contentdeliveryrules
   */
  readonly contentDeliveryRules?: Array<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-datasetname
   */
  readonly datasetName?: string;

  /**
   * A list of data rules that send notifications to CloudWatch, when data arrives late.
   *
   * To specify `lateDataRules` , the dataset must use a [DeltaTimer](https://docs.aws.amazon.com/iotanalytics/latest/APIReference/API_DeltaTime.html) filter.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-latedatarules
   */
  readonly lateDataRules?: Array<cdk.IResolvable | CfnDataset.LateDataRuleProperty> | cdk.IResolvable;

  /**
   * Optional.
   *
   * How long, in days, message data is kept for the dataset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-retentionperiod
   */
  readonly retentionPeriod?: cdk.IResolvable | CfnDataset.RetentionPeriodProperty;

  /**
   * Metadata which can be used to manage the data set.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The `DatasetTrigger` objects that specify when the dataset is automatically updated.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-triggers
   */
  readonly triggers?: Array<cdk.IResolvable | CfnDataset.TriggerProperty> | cdk.IResolvable;

  /**
   * Optional.
   *
   * How many versions of dataset contents are kept. If not specified or set to null, only the latest version plus the latest succeeded version (if they are different) are kept for the time period specified by the `retentionPeriod` parameter. For more information, see [Keeping Multiple Versions of AWS IoT Analytics datasets](https://docs.aws.amazon.com/iotanalytics/latest/userguide/getting-started.html#aws-iot-analytics-dataset-versions) in the *AWS IoT Analytics User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-dataset.html#cfn-iotanalytics-dataset-versioningconfiguration
   */
  readonly versioningConfiguration?: cdk.IResolvable | CfnDataset.VersioningConfigurationProperty;
}

/**
 * Determine whether the given properties match those of a `DatasetContentVersionValueProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetContentVersionValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatasetContentVersionValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetName", cdk.requiredValidator)(properties.datasetName));
  errors.collect(cdk.propertyValidator("datasetName", cdk.validateString)(properties.datasetName));
  return errors.wrap("supplied properties not correct for \"DatasetContentVersionValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatasetContentVersionValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatasetContentVersionValuePropertyValidator(properties).assertSuccess();
  return {
    "DatasetName": cdk.stringToCloudFormation(properties.datasetName)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatasetContentVersionValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetContentVersionValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetContentVersionValueProperty>();
  ret.addPropertyResult("datasetName", "DatasetName", (properties.DatasetName != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutputFileUriValueProperty`
 *
 * @param properties - the TypeScript properties of a `OutputFileUriValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetOutputFileUriValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("fileName", cdk.requiredValidator)(properties.fileName));
  errors.collect(cdk.propertyValidator("fileName", cdk.validateString)(properties.fileName));
  return errors.wrap("supplied properties not correct for \"OutputFileUriValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetOutputFileUriValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetOutputFileUriValuePropertyValidator(properties).assertSuccess();
  return {
    "FileName": cdk.stringToCloudFormation(properties.fileName)
  };
}

// @ts-ignore TS6133
function CfnDatasetOutputFileUriValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.OutputFileUriValueProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.OutputFileUriValueProperty>();
  ret.addPropertyResult("fileName", "FileName", (properties.FileName != null ? cfn_parse.FromCloudFormation.getString(properties.FileName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VariableProperty`
 *
 * @param properties - the TypeScript properties of a `VariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetContentVersionValue", CfnDatasetDatasetContentVersionValuePropertyValidator)(properties.datasetContentVersionValue));
  errors.collect(cdk.propertyValidator("doubleValue", cdk.validateNumber)(properties.doubleValue));
  errors.collect(cdk.propertyValidator("outputFileUriValue", CfnDatasetOutputFileUriValuePropertyValidator)(properties.outputFileUriValue));
  errors.collect(cdk.propertyValidator("stringValue", cdk.validateString)(properties.stringValue));
  errors.collect(cdk.propertyValidator("variableName", cdk.requiredValidator)(properties.variableName));
  errors.collect(cdk.propertyValidator("variableName", cdk.validateString)(properties.variableName));
  return errors.wrap("supplied properties not correct for \"VariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetVariablePropertyValidator(properties).assertSuccess();
  return {
    "DatasetContentVersionValue": convertCfnDatasetDatasetContentVersionValuePropertyToCloudFormation(properties.datasetContentVersionValue),
    "DoubleValue": cdk.numberToCloudFormation(properties.doubleValue),
    "OutputFileUriValue": convertCfnDatasetOutputFileUriValuePropertyToCloudFormation(properties.outputFileUriValue),
    "StringValue": cdk.stringToCloudFormation(properties.stringValue),
    "VariableName": cdk.stringToCloudFormation(properties.variableName)
  };
}

// @ts-ignore TS6133
function CfnDatasetVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.VariableProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.VariableProperty>();
  ret.addPropertyResult("datasetContentVersionValue", "DatasetContentVersionValue", (properties.DatasetContentVersionValue != null ? CfnDatasetDatasetContentVersionValuePropertyFromCloudFormation(properties.DatasetContentVersionValue) : undefined));
  ret.addPropertyResult("doubleValue", "DoubleValue", (properties.DoubleValue != null ? cfn_parse.FromCloudFormation.getNumber(properties.DoubleValue) : undefined));
  ret.addPropertyResult("outputFileUriValue", "OutputFileUriValue", (properties.OutputFileUriValue != null ? CfnDatasetOutputFileUriValuePropertyFromCloudFormation(properties.OutputFileUriValue) : undefined));
  ret.addPropertyResult("stringValue", "StringValue", (properties.StringValue != null ? cfn_parse.FromCloudFormation.getString(properties.StringValue) : undefined));
  ret.addPropertyResult("variableName", "VariableName", (properties.VariableName != null ? cfn_parse.FromCloudFormation.getString(properties.VariableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ResourceConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetResourceConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("computeType", cdk.requiredValidator)(properties.computeType));
  errors.collect(cdk.propertyValidator("computeType", cdk.validateString)(properties.computeType));
  errors.collect(cdk.propertyValidator("volumeSizeInGb", cdk.requiredValidator)(properties.volumeSizeInGb));
  errors.collect(cdk.propertyValidator("volumeSizeInGb", cdk.validateNumber)(properties.volumeSizeInGb));
  return errors.wrap("supplied properties not correct for \"ResourceConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetResourceConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetResourceConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ComputeType": cdk.stringToCloudFormation(properties.computeType),
    "VolumeSizeInGB": cdk.numberToCloudFormation(properties.volumeSizeInGb)
  };
}

// @ts-ignore TS6133
function CfnDatasetResourceConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.ResourceConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ResourceConfigurationProperty>();
  ret.addPropertyResult("computeType", "ComputeType", (properties.ComputeType != null ? cfn_parse.FromCloudFormation.getString(properties.ComputeType) : undefined));
  ret.addPropertyResult("volumeSizeInGb", "VolumeSizeInGB", (properties.VolumeSizeInGB != null ? cfn_parse.FromCloudFormation.getNumber(properties.VolumeSizeInGB) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerActionProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetContainerActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.requiredValidator)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("image", cdk.requiredValidator)(properties.image));
  errors.collect(cdk.propertyValidator("image", cdk.validateString)(properties.image));
  errors.collect(cdk.propertyValidator("resourceConfiguration", cdk.requiredValidator)(properties.resourceConfiguration));
  errors.collect(cdk.propertyValidator("resourceConfiguration", CfnDatasetResourceConfigurationPropertyValidator)(properties.resourceConfiguration));
  errors.collect(cdk.propertyValidator("variables", cdk.listValidator(CfnDatasetVariablePropertyValidator))(properties.variables));
  return errors.wrap("supplied properties not correct for \"ContainerActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetContainerActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetContainerActionPropertyValidator(properties).assertSuccess();
  return {
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "Image": cdk.stringToCloudFormation(properties.image),
    "ResourceConfiguration": convertCfnDatasetResourceConfigurationPropertyToCloudFormation(properties.resourceConfiguration),
    "Variables": cdk.listMapper(convertCfnDatasetVariablePropertyToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnDatasetContainerActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ContainerActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ContainerActionProperty>();
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("image", "Image", (properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined));
  ret.addPropertyResult("resourceConfiguration", "ResourceConfiguration", (properties.ResourceConfiguration != null ? CfnDatasetResourceConfigurationPropertyFromCloudFormation(properties.ResourceConfiguration) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetVariablePropertyFromCloudFormation)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeltaTimeProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaTimeProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDeltaTimePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("offsetSeconds", cdk.requiredValidator)(properties.offsetSeconds));
  errors.collect(cdk.propertyValidator("offsetSeconds", cdk.validateNumber)(properties.offsetSeconds));
  errors.collect(cdk.propertyValidator("timeExpression", cdk.requiredValidator)(properties.timeExpression));
  errors.collect(cdk.propertyValidator("timeExpression", cdk.validateString)(properties.timeExpression));
  return errors.wrap("supplied properties not correct for \"DeltaTimeProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDeltaTimePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDeltaTimePropertyValidator(properties).assertSuccess();
  return {
    "OffsetSeconds": cdk.numberToCloudFormation(properties.offsetSeconds),
    "TimeExpression": cdk.stringToCloudFormation(properties.timeExpression)
  };
}

// @ts-ignore TS6133
function CfnDatasetDeltaTimePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DeltaTimeProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DeltaTimeProperty>();
  ret.addPropertyResult("offsetSeconds", "OffsetSeconds", (properties.OffsetSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.OffsetSeconds) : undefined));
  ret.addPropertyResult("timeExpression", "TimeExpression", (properties.TimeExpression != null ? cfn_parse.FromCloudFormation.getString(properties.TimeExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deltaTime", CfnDatasetDeltaTimePropertyValidator)(properties.deltaTime));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetFilterPropertyValidator(properties).assertSuccess();
  return {
    "DeltaTime": convertCfnDatasetDeltaTimePropertyToCloudFormation(properties.deltaTime)
  };
}

// @ts-ignore TS6133
function CfnDatasetFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.FilterProperty>();
  ret.addPropertyResult("deltaTime", "DeltaTime", (properties.DeltaTime != null ? CfnDatasetDeltaTimePropertyFromCloudFormation(properties.DeltaTime) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryActionProperty`
 *
 * @param properties - the TypeScript properties of a `QueryActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetQueryActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filters", cdk.listValidator(CfnDatasetFilterPropertyValidator))(properties.filters));
  errors.collect(cdk.propertyValidator("sqlQuery", cdk.requiredValidator)(properties.sqlQuery));
  errors.collect(cdk.propertyValidator("sqlQuery", cdk.validateString)(properties.sqlQuery));
  return errors.wrap("supplied properties not correct for \"QueryActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetQueryActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetQueryActionPropertyValidator(properties).assertSuccess();
  return {
    "Filters": cdk.listMapper(convertCfnDatasetFilterPropertyToCloudFormation)(properties.filters),
    "SqlQuery": cdk.stringToCloudFormation(properties.sqlQuery)
  };
}

// @ts-ignore TS6133
function CfnDatasetQueryActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.QueryActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.QueryActionProperty>();
  ret.addPropertyResult("filters", "Filters", (properties.Filters != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetFilterPropertyFromCloudFormation)(properties.Filters) : undefined));
  ret.addPropertyResult("sqlQuery", "SqlQuery", (properties.SqlQuery != null ? cfn_parse.FromCloudFormation.getString(properties.SqlQuery) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActionProperty`
 *
 * @param properties - the TypeScript properties of a `ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actionName", cdk.requiredValidator)(properties.actionName));
  errors.collect(cdk.propertyValidator("actionName", cdk.validateString)(properties.actionName));
  errors.collect(cdk.propertyValidator("containerAction", CfnDatasetContainerActionPropertyValidator)(properties.containerAction));
  errors.collect(cdk.propertyValidator("queryAction", CfnDatasetQueryActionPropertyValidator)(properties.queryAction));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetActionPropertyValidator(properties).assertSuccess();
  return {
    "ActionName": cdk.stringToCloudFormation(properties.actionName),
    "ContainerAction": convertCfnDatasetContainerActionPropertyToCloudFormation(properties.containerAction),
    "QueryAction": convertCfnDatasetQueryActionPropertyToCloudFormation(properties.queryAction)
  };
}

// @ts-ignore TS6133
function CfnDatasetActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ActionProperty>();
  ret.addPropertyResult("actionName", "ActionName", (properties.ActionName != null ? cfn_parse.FromCloudFormation.getString(properties.ActionName) : undefined));
  ret.addPropertyResult("containerAction", "ContainerAction", (properties.ContainerAction != null ? CfnDatasetContainerActionPropertyFromCloudFormation(properties.ContainerAction) : undefined));
  ret.addPropertyResult("queryAction", "QueryAction", (properties.QueryAction != null ? CfnDatasetQueryActionPropertyFromCloudFormation(properties.QueryAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeltaTimeSessionWindowConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DeltaTimeSessionWindowConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDeltaTimeSessionWindowConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("timeoutInMinutes", cdk.requiredValidator)(properties.timeoutInMinutes));
  errors.collect(cdk.propertyValidator("timeoutInMinutes", cdk.validateNumber)(properties.timeoutInMinutes));
  return errors.wrap("supplied properties not correct for \"DeltaTimeSessionWindowConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDeltaTimeSessionWindowConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDeltaTimeSessionWindowConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "TimeoutInMinutes": cdk.numberToCloudFormation(properties.timeoutInMinutes)
  };
}

// @ts-ignore TS6133
function CfnDatasetDeltaTimeSessionWindowConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DeltaTimeSessionWindowConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DeltaTimeSessionWindowConfigurationProperty>();
  ret.addPropertyResult("timeoutInMinutes", "TimeoutInMinutes", (properties.TimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LateDataRuleConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LateDataRuleConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetLateDataRuleConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deltaTimeSessionWindowConfiguration", CfnDatasetDeltaTimeSessionWindowConfigurationPropertyValidator)(properties.deltaTimeSessionWindowConfiguration));
  return errors.wrap("supplied properties not correct for \"LateDataRuleConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetLateDataRuleConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetLateDataRuleConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DeltaTimeSessionWindowConfiguration": convertCfnDatasetDeltaTimeSessionWindowConfigurationPropertyToCloudFormation(properties.deltaTimeSessionWindowConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDatasetLateDataRuleConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.LateDataRuleConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.LateDataRuleConfigurationProperty>();
  ret.addPropertyResult("deltaTimeSessionWindowConfiguration", "DeltaTimeSessionWindowConfiguration", (properties.DeltaTimeSessionWindowConfiguration != null ? CfnDatasetDeltaTimeSessionWindowConfigurationPropertyFromCloudFormation(properties.DeltaTimeSessionWindowConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LateDataRuleProperty`
 *
 * @param properties - the TypeScript properties of a `LateDataRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetLateDataRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleConfiguration", cdk.requiredValidator)(properties.ruleConfiguration));
  errors.collect(cdk.propertyValidator("ruleConfiguration", CfnDatasetLateDataRuleConfigurationPropertyValidator)(properties.ruleConfiguration));
  errors.collect(cdk.propertyValidator("ruleName", cdk.validateString)(properties.ruleName));
  return errors.wrap("supplied properties not correct for \"LateDataRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetLateDataRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetLateDataRulePropertyValidator(properties).assertSuccess();
  return {
    "RuleConfiguration": convertCfnDatasetLateDataRuleConfigurationPropertyToCloudFormation(properties.ruleConfiguration),
    "RuleName": cdk.stringToCloudFormation(properties.ruleName)
  };
}

// @ts-ignore TS6133
function CfnDatasetLateDataRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.LateDataRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.LateDataRuleProperty>();
  ret.addPropertyResult("ruleConfiguration", "RuleConfiguration", (properties.RuleConfiguration != null ? CfnDatasetLateDataRuleConfigurationPropertyFromCloudFormation(properties.RuleConfiguration) : undefined));
  ret.addPropertyResult("ruleName", "RuleName", (properties.RuleName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotEventsDestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `IotEventsDestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetIotEventsDestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("inputName", cdk.requiredValidator)(properties.inputName));
  errors.collect(cdk.propertyValidator("inputName", cdk.validateString)(properties.inputName));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"IotEventsDestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetIotEventsDestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetIotEventsDestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "InputName": cdk.stringToCloudFormation(properties.inputName),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDatasetIotEventsDestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.IotEventsDestinationConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.IotEventsDestinationConfigurationProperty>();
  ret.addPropertyResult("inputName", "InputName", (properties.InputName != null ? cfn_parse.FromCloudFormation.getString(properties.InputName) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GlueConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `GlueConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetGlueConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("databaseName", cdk.requiredValidator)(properties.databaseName));
  errors.collect(cdk.propertyValidator("databaseName", cdk.validateString)(properties.databaseName));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"GlueConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetGlueConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetGlueConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DatabaseName": cdk.stringToCloudFormation(properties.databaseName),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnDatasetGlueConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.GlueConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.GlueConfigurationProperty>();
  ret.addPropertyResult("databaseName", "DatabaseName", (properties.DatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.DatabaseName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3DestinationConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3DestinationConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetS3DestinationConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("glueConfiguration", CfnDatasetGlueConfigurationPropertyValidator)(properties.glueConfiguration));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"S3DestinationConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetS3DestinationConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetS3DestinationConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "GlueConfiguration": convertCfnDatasetGlueConfigurationPropertyToCloudFormation(properties.glueConfiguration),
    "Key": cdk.stringToCloudFormation(properties.key),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDatasetS3DestinationConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.S3DestinationConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.S3DestinationConfigurationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("glueConfiguration", "GlueConfiguration", (properties.GlueConfiguration != null ? CfnDatasetGlueConfigurationPropertyFromCloudFormation(properties.GlueConfiguration) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatasetContentDeliveryRuleDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetContentDeliveryRuleDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatasetContentDeliveryRuleDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("iotEventsDestinationConfiguration", CfnDatasetIotEventsDestinationConfigurationPropertyValidator)(properties.iotEventsDestinationConfiguration));
  errors.collect(cdk.propertyValidator("s3DestinationConfiguration", CfnDatasetS3DestinationConfigurationPropertyValidator)(properties.s3DestinationConfiguration));
  return errors.wrap("supplied properties not correct for \"DatasetContentDeliveryRuleDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatasetContentDeliveryRuleDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatasetContentDeliveryRuleDestinationPropertyValidator(properties).assertSuccess();
  return {
    "IotEventsDestinationConfiguration": convertCfnDatasetIotEventsDestinationConfigurationPropertyToCloudFormation(properties.iotEventsDestinationConfiguration),
    "S3DestinationConfiguration": convertCfnDatasetS3DestinationConfigurationPropertyToCloudFormation(properties.s3DestinationConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatasetContentDeliveryRuleDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetContentDeliveryRuleDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetContentDeliveryRuleDestinationProperty>();
  ret.addPropertyResult("iotEventsDestinationConfiguration", "IotEventsDestinationConfiguration", (properties.IotEventsDestinationConfiguration != null ? CfnDatasetIotEventsDestinationConfigurationPropertyFromCloudFormation(properties.IotEventsDestinationConfiguration) : undefined));
  ret.addPropertyResult("s3DestinationConfiguration", "S3DestinationConfiguration", (properties.S3DestinationConfiguration != null ? CfnDatasetS3DestinationConfigurationPropertyFromCloudFormation(properties.S3DestinationConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatasetContentDeliveryRuleProperty`
 *
 * @param properties - the TypeScript properties of a `DatasetContentDeliveryRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetDatasetContentDeliveryRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", CfnDatasetDatasetContentDeliveryRuleDestinationPropertyValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("entryName", cdk.validateString)(properties.entryName));
  return errors.wrap("supplied properties not correct for \"DatasetContentDeliveryRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetDatasetContentDeliveryRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetDatasetContentDeliveryRulePropertyValidator(properties).assertSuccess();
  return {
    "Destination": convertCfnDatasetDatasetContentDeliveryRuleDestinationPropertyToCloudFormation(properties.destination),
    "EntryName": cdk.stringToCloudFormation(properties.entryName)
  };
}

// @ts-ignore TS6133
function CfnDatasetDatasetContentDeliveryRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDataset.DatasetContentDeliveryRuleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.DatasetContentDeliveryRuleProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? CfnDatasetDatasetContentDeliveryRuleDestinationPropertyFromCloudFormation(properties.Destination) : undefined));
  ret.addPropertyResult("entryName", "EntryName", (properties.EntryName != null ? cfn_parse.FromCloudFormation.getString(properties.EntryName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetSchedulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.requiredValidator)(properties.scheduleExpression));
  errors.collect(cdk.propertyValidator("scheduleExpression", cdk.validateString)(properties.scheduleExpression));
  return errors.wrap("supplied properties not correct for \"ScheduleProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetSchedulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetSchedulePropertyValidator(properties).assertSuccess();
  return {
    "ScheduleExpression": cdk.stringToCloudFormation(properties.scheduleExpression)
  };
}

// @ts-ignore TS6133
function CfnDatasetSchedulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.ScheduleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.ScheduleProperty>();
  ret.addPropertyResult("scheduleExpression", "ScheduleExpression", (properties.ScheduleExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ScheduleExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TriggeringDatasetProperty`
 *
 * @param properties - the TypeScript properties of a `TriggeringDatasetProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetTriggeringDatasetPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datasetName", cdk.requiredValidator)(properties.datasetName));
  errors.collect(cdk.propertyValidator("datasetName", cdk.validateString)(properties.datasetName));
  return errors.wrap("supplied properties not correct for \"TriggeringDatasetProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetTriggeringDatasetPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetTriggeringDatasetPropertyValidator(properties).assertSuccess();
  return {
    "DatasetName": cdk.stringToCloudFormation(properties.datasetName)
  };
}

// @ts-ignore TS6133
function CfnDatasetTriggeringDatasetPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.TriggeringDatasetProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.TriggeringDatasetProperty>();
  ret.addPropertyResult("datasetName", "DatasetName", (properties.DatasetName != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TriggerProperty`
 *
 * @param properties - the TypeScript properties of a `TriggerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetTriggerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("schedule", CfnDatasetSchedulePropertyValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("triggeringDataset", CfnDatasetTriggeringDatasetPropertyValidator)(properties.triggeringDataset));
  return errors.wrap("supplied properties not correct for \"TriggerProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetTriggerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetTriggerPropertyValidator(properties).assertSuccess();
  return {
    "Schedule": convertCfnDatasetSchedulePropertyToCloudFormation(properties.schedule),
    "TriggeringDataset": convertCfnDatasetTriggeringDatasetPropertyToCloudFormation(properties.triggeringDataset)
  };
}

// @ts-ignore TS6133
function CfnDatasetTriggerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.TriggerProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.TriggerProperty>();
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? CfnDatasetSchedulePropertyFromCloudFormation(properties.Schedule) : undefined));
  ret.addPropertyResult("triggeringDataset", "TriggeringDataset", (properties.TriggeringDataset != null ? CfnDatasetTriggeringDatasetPropertyFromCloudFormation(properties.TriggeringDataset) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VersioningConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `VersioningConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetVersioningConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxVersions", cdk.validateNumber)(properties.maxVersions));
  errors.collect(cdk.propertyValidator("unlimited", cdk.validateBoolean)(properties.unlimited));
  return errors.wrap("supplied properties not correct for \"VersioningConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetVersioningConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetVersioningConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "MaxVersions": cdk.numberToCloudFormation(properties.maxVersions),
    "Unlimited": cdk.booleanToCloudFormation(properties.unlimited)
  };
}

// @ts-ignore TS6133
function CfnDatasetVersioningConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.VersioningConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.VersioningConfigurationProperty>();
  ret.addPropertyResult("maxVersions", "MaxVersions", (properties.MaxVersions != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxVersions) : undefined));
  ret.addPropertyResult("unlimited", "Unlimited", (properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetentionPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetRetentionPeriodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numberOfDays", cdk.validateNumber)(properties.numberOfDays));
  errors.collect(cdk.propertyValidator("unlimited", cdk.validateBoolean)(properties.unlimited));
  return errors.wrap("supplied properties not correct for \"RetentionPeriodProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatasetRetentionPeriodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetRetentionPeriodPropertyValidator(properties).assertSuccess();
  return {
    "NumberOfDays": cdk.numberToCloudFormation(properties.numberOfDays),
    "Unlimited": cdk.booleanToCloudFormation(properties.unlimited)
  };
}

// @ts-ignore TS6133
function CfnDatasetRetentionPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDataset.RetentionPeriodProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDataset.RetentionPeriodProperty>();
  ret.addPropertyResult("numberOfDays", "NumberOfDays", (properties.NumberOfDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDays) : undefined));
  ret.addPropertyResult("unlimited", "Unlimited", (properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDatasetProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatasetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatasetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.requiredValidator)(properties.actions));
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnDatasetActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("contentDeliveryRules", cdk.listValidator(CfnDatasetDatasetContentDeliveryRulePropertyValidator))(properties.contentDeliveryRules));
  errors.collect(cdk.propertyValidator("datasetName", cdk.validateString)(properties.datasetName));
  errors.collect(cdk.propertyValidator("lateDataRules", cdk.listValidator(CfnDatasetLateDataRulePropertyValidator))(properties.lateDataRules));
  errors.collect(cdk.propertyValidator("retentionPeriod", CfnDatasetRetentionPeriodPropertyValidator)(properties.retentionPeriod));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("triggers", cdk.listValidator(CfnDatasetTriggerPropertyValidator))(properties.triggers));
  errors.collect(cdk.propertyValidator("versioningConfiguration", CfnDatasetVersioningConfigurationPropertyValidator)(properties.versioningConfiguration));
  return errors.wrap("supplied properties not correct for \"CfnDatasetProps\"");
}

// @ts-ignore TS6133
function convertCfnDatasetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatasetPropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnDatasetActionPropertyToCloudFormation)(properties.actions),
    "ContentDeliveryRules": cdk.listMapper(convertCfnDatasetDatasetContentDeliveryRulePropertyToCloudFormation)(properties.contentDeliveryRules),
    "DatasetName": cdk.stringToCloudFormation(properties.datasetName),
    "LateDataRules": cdk.listMapper(convertCfnDatasetLateDataRulePropertyToCloudFormation)(properties.lateDataRules),
    "RetentionPeriod": convertCfnDatasetRetentionPeriodPropertyToCloudFormation(properties.retentionPeriod),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Triggers": cdk.listMapper(convertCfnDatasetTriggerPropertyToCloudFormation)(properties.triggers),
    "VersioningConfiguration": convertCfnDatasetVersioningConfigurationPropertyToCloudFormation(properties.versioningConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDatasetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatasetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatasetProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("contentDeliveryRules", "ContentDeliveryRules", (properties.ContentDeliveryRules != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetDatasetContentDeliveryRulePropertyFromCloudFormation)(properties.ContentDeliveryRules) : undefined));
  ret.addPropertyResult("datasetName", "DatasetName", (properties.DatasetName != null ? cfn_parse.FromCloudFormation.getString(properties.DatasetName) : undefined));
  ret.addPropertyResult("lateDataRules", "LateDataRules", (properties.LateDataRules != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetLateDataRulePropertyFromCloudFormation)(properties.LateDataRules) : undefined));
  ret.addPropertyResult("retentionPeriod", "RetentionPeriod", (properties.RetentionPeriod != null ? CfnDatasetRetentionPeriodPropertyFromCloudFormation(properties.RetentionPeriod) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("triggers", "Triggers", (properties.Triggers != null ? cfn_parse.FromCloudFormation.getArray(CfnDatasetTriggerPropertyFromCloudFormation)(properties.Triggers) : undefined));
  ret.addPropertyResult("versioningConfiguration", "VersioningConfiguration", (properties.VersioningConfiguration != null ? CfnDatasetVersioningConfigurationPropertyFromCloudFormation(properties.VersioningConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * AWS::IoTAnalytics::Datastore resource is a repository for messages.
 *
 * For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Datastore
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html
 */
export class CfnDatastore extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTAnalytics::Datastore";

  /**
   * Build a CfnDatastore from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatastore {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatastorePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDatastore(scope, id, propsResult.value);
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
   * The name of the data store.
   */
  public datastoreName?: string;

  /**
   * Information about the partition dimensions in a data store.
   */
  public datastorePartitions?: CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable;

  /**
   * Where data store data is stored.
   */
  public datastoreStorage?: CfnDatastore.DatastoreStorageProperty | cdk.IResolvable;

  /**
   * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
   */
  public fileFormatConfiguration?: CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable;

  /**
   * How long, in days, message data is kept for the data store.
   */
  public retentionPeriod?: cdk.IResolvable | CfnDatastore.RetentionPeriodProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the data store.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDatastoreProps = {}) {
    super(scope, id, {
      "type": CfnDatastore.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.datastoreName = props.datastoreName;
    this.datastorePartitions = props.datastorePartitions;
    this.datastoreStorage = props.datastoreStorage;
    this.fileFormatConfiguration = props.fileFormatConfiguration;
    this.retentionPeriod = props.retentionPeriod;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Datastore", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "datastoreName": this.datastoreName,
      "datastorePartitions": this.datastorePartitions,
      "datastoreStorage": this.datastoreStorage,
      "fileFormatConfiguration": this.fileFormatConfiguration,
      "retentionPeriod": this.retentionPeriod,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatastore.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatastorePropsToCloudFormation(props);
  }
}

export namespace CfnDatastore {
  /**
   * Where data store data is stored.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html
   */
  export interface DatastoreStorageProperty {
    /**
     * Use this to store data store data in an S3 bucket that you manage.
     *
     * The choice of service-managed or customer-managed S3 storage cannot be changed after creation of the data store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html#cfn-iotanalytics-datastore-datastorestorage-customermanageds3
     */
    readonly customerManagedS3?: CfnDatastore.CustomerManagedS3Property | cdk.IResolvable;

    /**
     * Use this to store data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage.
     *
     * You can't change the choice of Amazon S3 storage after your data store is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html#cfn-iotanalytics-datastore-datastorestorage-iotsitewisemultilayerstorage
     */
    readonly iotSiteWiseMultiLayerStorage?: CfnDatastore.IotSiteWiseMultiLayerStorageProperty | cdk.IResolvable;

    /**
     * Use this to store data store data in an S3 bucket managed by the AWS IoT Analytics service.
     *
     * The choice of service-managed or customer-managed S3 storage cannot be changed after creation of the data store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorestorage.html#cfn-iotanalytics-datastore-datastorestorage-servicemanageds3
     */
    readonly serviceManagedS3?: any | cdk.IResolvable;
  }

  /**
   * S3-customer-managed;
   *
   * When you choose customer-managed storage, the `retentionPeriod` parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html
   */
  export interface CustomerManagedS3Property {
    /**
     * The name of the Amazon S3 bucket where your data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html#cfn-iotanalytics-datastore-customermanageds3-bucket
     */
    readonly bucket: string;

    /**
     * (Optional) The prefix used to create the keys of the data store data objects.
     *
     * Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html#cfn-iotanalytics-datastore-customermanageds3-keyprefix
     */
    readonly keyPrefix?: string;

    /**
     * The ARN of the role that grants AWS IoT Analytics permission to interact with your Amazon S3 resources.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3.html#cfn-iotanalytics-datastore-customermanageds3-rolearn
     */
    readonly roleArn: string;
  }

  /**
   * Stores data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage.
   *
   * You can't change the choice of Amazon S3 storage after your data store is created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-iotsitewisemultilayerstorage.html
   */
  export interface IotSiteWiseMultiLayerStorageProperty {
    /**
     * Stores data used by AWS IoT SiteWise in an Amazon S3 bucket that you manage.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-iotsitewisemultilayerstorage.html#cfn-iotanalytics-datastore-iotsitewisemultilayerstorage-customermanageds3storage
     */
    readonly customerManagedS3Storage?: CfnDatastore.CustomerManagedS3StorageProperty | cdk.IResolvable;
  }

  /**
   * Amazon S3 -customer-managed;
   *
   * When you choose customer-managed storage, the `retentionPeriod` parameter is ignored. You can't change the choice of Amazon S3 storage after your data store is created.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html
   */
  export interface CustomerManagedS3StorageProperty {
    /**
     * The name of the Amazon S3 bucket where your data is stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html#cfn-iotanalytics-datastore-customermanageds3storage-bucket
     */
    readonly bucket: string;

    /**
     * (Optional) The prefix used to create the keys of the data store data objects.
     *
     * Each object in an Amazon S3 bucket has a key that is its unique identifier in the bucket. Each object in a bucket has exactly one key. The prefix must end with a forward slash (/).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-customermanageds3storage.html#cfn-iotanalytics-datastore-customermanageds3storage-keyprefix
     */
    readonly keyPrefix?: string;
  }

  /**
   * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
   *
   * The default file format is JSON. You can specify only one format.
   *
   * You can't change the file format after you create the data store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-fileformatconfiguration.html
   */
  export interface FileFormatConfigurationProperty {
    /**
     * Contains the configuration information of the JSON format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-fileformatconfiguration.html#cfn-iotanalytics-datastore-fileformatconfiguration-jsonconfiguration
     */
    readonly jsonConfiguration?: any | cdk.IResolvable;

    /**
     * Contains the configuration information of the Parquet format.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-fileformatconfiguration.html#cfn-iotanalytics-datastore-fileformatconfiguration-parquetconfiguration
     */
    readonly parquetConfiguration?: cdk.IResolvable | CfnDatastore.ParquetConfigurationProperty;
  }

  /**
   * Contains the configuration information of the Parquet format.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-parquetconfiguration.html
   */
  export interface ParquetConfigurationProperty {
    /**
     * Information needed to define a schema.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-parquetconfiguration.html#cfn-iotanalytics-datastore-parquetconfiguration-schemadefinition
     */
    readonly schemaDefinition?: cdk.IResolvable | CfnDatastore.SchemaDefinitionProperty;
  }

  /**
   * Information needed to define a schema.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-schemadefinition.html
   */
  export interface SchemaDefinitionProperty {
    /**
     * Specifies one or more columns that store your data.
     *
     * Each schema can have up to 100 columns. Each column can have up to 100 nested types.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-schemadefinition.html#cfn-iotanalytics-datastore-schemadefinition-columns
     */
    readonly columns?: Array<CfnDatastore.ColumnProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Contains information about a column that stores your data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html
   */
  export interface ColumnProperty {
    /**
     * The name of the column.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html#cfn-iotanalytics-datastore-column-name
     */
    readonly name: string;

    /**
     * The type of data.
     *
     * For more information about the supported data types, see [Common data types](https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-common.html) in the *AWS Glue Developer Guide* .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-column.html#cfn-iotanalytics-datastore-column-type
     */
    readonly type: string;
  }

  /**
   * Information about the partition dimensions in a data store.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartitions.html
   */
  export interface DatastorePartitionsProperty {
    /**
     * A list of partition dimensions in a data store.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartitions.html#cfn-iotanalytics-datastore-datastorepartitions-partitions
     */
    readonly partitions?: Array<CfnDatastore.DatastorePartitionProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * A single dimension to partition a data store.
   *
   * The dimension must be an `AttributePartition` or a `TimestampPartition` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html
   */
  export interface DatastorePartitionProperty {
    /**
     * A partition dimension defined by an attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html#cfn-iotanalytics-datastore-datastorepartition-partition
     */
    readonly partition?: cdk.IResolvable | CfnDatastore.PartitionProperty;

    /**
     * A partition dimension defined by a timestamp attribute.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-datastorepartition.html#cfn-iotanalytics-datastore-datastorepartition-timestamppartition
     */
    readonly timestampPartition?: cdk.IResolvable | CfnDatastore.TimestampPartitionProperty;
  }

  /**
   * A single dimension to partition a data store.
   *
   * The dimension must be an `AttributePartition` or a `TimestampPartition` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-partition.html
   */
  export interface PartitionProperty {
    /**
     * The name of the attribute that defines a partition dimension.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-partition.html#cfn-iotanalytics-datastore-partition-attributename
     */
    readonly attributeName: string;
  }

  /**
   * A partition dimension defined by a timestamp attribute.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html
   */
  export interface TimestampPartitionProperty {
    /**
     * The attribute name of the partition defined by a timestamp.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html#cfn-iotanalytics-datastore-timestamppartition-attributename
     */
    readonly attributeName: string;

    /**
     * The timestamp format of a partition defined by a timestamp.
     *
     * The default format is seconds since epoch (January 1, 1970 at midnight UTC time).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-timestamppartition.html#cfn-iotanalytics-datastore-timestamppartition-timestampformat
     */
    readonly timestampFormat?: string;
  }

  /**
   * How long, in days, message data is kept.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html
   */
  export interface RetentionPeriodProperty {
    /**
     * The number of days that message data is kept.
     *
     * The `unlimited` parameter must be false.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html#cfn-iotanalytics-datastore-retentionperiod-numberofdays
     */
    readonly numberOfDays?: number;

    /**
     * If true, message data is kept indefinitely.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-datastore-retentionperiod.html#cfn-iotanalytics-datastore-retentionperiod-unlimited
     */
    readonly unlimited?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnDatastore`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html
 */
export interface CfnDatastoreProps {
  /**
   * The name of the data store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorename
   */
  readonly datastoreName?: string;

  /**
   * Information about the partition dimensions in a data store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorepartitions
   */
  readonly datastorePartitions?: CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable;

  /**
   * Where data store data is stored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-datastorestorage
   */
  readonly datastoreStorage?: CfnDatastore.DatastoreStorageProperty | cdk.IResolvable;

  /**
   * Contains the configuration information of file formats. AWS IoT Analytics data stores support JSON and [Parquet](https://docs.aws.amazon.com/https://parquet.apache.org/) .
   *
   * The default file format is JSON. You can specify only one format.
   *
   * You can't change the file format after you create the data store.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-fileformatconfiguration
   */
  readonly fileFormatConfiguration?: CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable;

  /**
   * How long, in days, message data is kept for the data store.
   *
   * When `customerManagedS3` storage is selected, this parameter is ignored.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-retentionperiod
   */
  readonly retentionPeriod?: cdk.IResolvable | CfnDatastore.RetentionPeriodProperty;

  /**
   * Metadata which can be used to manage the data store.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-datastore.html#cfn-iotanalytics-datastore-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CustomerManagedS3Property`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3Property`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreCustomerManagedS3PropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("keyPrefix", cdk.validateString)(properties.keyPrefix));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  return errors.wrap("supplied properties not correct for \"CustomerManagedS3Property\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreCustomerManagedS3PropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreCustomerManagedS3PropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "KeyPrefix": cdk.stringToCloudFormation(properties.keyPrefix),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn)
  };
}

// @ts-ignore TS6133
function CfnDatastoreCustomerManagedS3PropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.CustomerManagedS3Property | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.CustomerManagedS3Property>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("keyPrefix", "KeyPrefix", (properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CustomerManagedS3StorageProperty`
 *
 * @param properties - the TypeScript properties of a `CustomerManagedS3StorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreCustomerManagedS3StoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("keyPrefix", cdk.validateString)(properties.keyPrefix));
  return errors.wrap("supplied properties not correct for \"CustomerManagedS3StorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreCustomerManagedS3StoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreCustomerManagedS3StoragePropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "KeyPrefix": cdk.stringToCloudFormation(properties.keyPrefix)
  };
}

// @ts-ignore TS6133
function CfnDatastoreCustomerManagedS3StoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.CustomerManagedS3StorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.CustomerManagedS3StorageProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("keyPrefix", "KeyPrefix", (properties.KeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPrefix) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IotSiteWiseMultiLayerStorageProperty`
 *
 * @param properties - the TypeScript properties of a `IotSiteWiseMultiLayerStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreIotSiteWiseMultiLayerStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerManagedS3Storage", CfnDatastoreCustomerManagedS3StoragePropertyValidator)(properties.customerManagedS3Storage));
  return errors.wrap("supplied properties not correct for \"IotSiteWiseMultiLayerStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreIotSiteWiseMultiLayerStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreIotSiteWiseMultiLayerStoragePropertyValidator(properties).assertSuccess();
  return {
    "CustomerManagedS3Storage": convertCfnDatastoreCustomerManagedS3StoragePropertyToCloudFormation(properties.customerManagedS3Storage)
  };
}

// @ts-ignore TS6133
function CfnDatastoreIotSiteWiseMultiLayerStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.IotSiteWiseMultiLayerStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.IotSiteWiseMultiLayerStorageProperty>();
  ret.addPropertyResult("customerManagedS3Storage", "CustomerManagedS3Storage", (properties.CustomerManagedS3Storage != null ? CfnDatastoreCustomerManagedS3StoragePropertyFromCloudFormation(properties.CustomerManagedS3Storage) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatastoreStorageProperty`
 *
 * @param properties - the TypeScript properties of a `DatastoreStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreDatastoreStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customerManagedS3", CfnDatastoreCustomerManagedS3PropertyValidator)(properties.customerManagedS3));
  errors.collect(cdk.propertyValidator("iotSiteWiseMultiLayerStorage", CfnDatastoreIotSiteWiseMultiLayerStoragePropertyValidator)(properties.iotSiteWiseMultiLayerStorage));
  errors.collect(cdk.propertyValidator("serviceManagedS3", cdk.validateObject)(properties.serviceManagedS3));
  return errors.wrap("supplied properties not correct for \"DatastoreStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreDatastoreStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreDatastoreStoragePropertyValidator(properties).assertSuccess();
  return {
    "CustomerManagedS3": convertCfnDatastoreCustomerManagedS3PropertyToCloudFormation(properties.customerManagedS3),
    "IotSiteWiseMultiLayerStorage": convertCfnDatastoreIotSiteWiseMultiLayerStoragePropertyToCloudFormation(properties.iotSiteWiseMultiLayerStorage),
    "ServiceManagedS3": cdk.objectToCloudFormation(properties.serviceManagedS3)
  };
}

// @ts-ignore TS6133
function CfnDatastoreDatastoreStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.DatastoreStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.DatastoreStorageProperty>();
  ret.addPropertyResult("customerManagedS3", "CustomerManagedS3", (properties.CustomerManagedS3 != null ? CfnDatastoreCustomerManagedS3PropertyFromCloudFormation(properties.CustomerManagedS3) : undefined));
  ret.addPropertyResult("iotSiteWiseMultiLayerStorage", "IotSiteWiseMultiLayerStorage", (properties.IotSiteWiseMultiLayerStorage != null ? CfnDatastoreIotSiteWiseMultiLayerStoragePropertyFromCloudFormation(properties.IotSiteWiseMultiLayerStorage) : undefined));
  ret.addPropertyResult("serviceManagedS3", "ServiceManagedS3", (properties.ServiceManagedS3 != null ? cfn_parse.FromCloudFormation.getAny(properties.ServiceManagedS3) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ColumnProperty`
 *
 * @param properties - the TypeScript properties of a `ColumnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreColumnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"ColumnProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreColumnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreColumnPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnDatastoreColumnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.ColumnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.ColumnProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SchemaDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `SchemaDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreSchemaDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("columns", cdk.listValidator(CfnDatastoreColumnPropertyValidator))(properties.columns));
  return errors.wrap("supplied properties not correct for \"SchemaDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreSchemaDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreSchemaDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "Columns": cdk.listMapper(convertCfnDatastoreColumnPropertyToCloudFormation)(properties.columns)
  };
}

// @ts-ignore TS6133
function CfnDatastoreSchemaDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatastore.SchemaDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.SchemaDefinitionProperty>();
  ret.addPropertyResult("columns", "Columns", (properties.Columns != null ? cfn_parse.FromCloudFormation.getArray(CfnDatastoreColumnPropertyFromCloudFormation)(properties.Columns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ParquetConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ParquetConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreParquetConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("schemaDefinition", CfnDatastoreSchemaDefinitionPropertyValidator)(properties.schemaDefinition));
  return errors.wrap("supplied properties not correct for \"ParquetConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreParquetConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreParquetConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SchemaDefinition": convertCfnDatastoreSchemaDefinitionPropertyToCloudFormation(properties.schemaDefinition)
  };
}

// @ts-ignore TS6133
function CfnDatastoreParquetConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatastore.ParquetConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.ParquetConfigurationProperty>();
  ret.addPropertyResult("schemaDefinition", "SchemaDefinition", (properties.SchemaDefinition != null ? CfnDatastoreSchemaDefinitionPropertyFromCloudFormation(properties.SchemaDefinition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileFormatConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FileFormatConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreFileFormatConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("jsonConfiguration", cdk.validateObject)(properties.jsonConfiguration));
  errors.collect(cdk.propertyValidator("parquetConfiguration", CfnDatastoreParquetConfigurationPropertyValidator)(properties.parquetConfiguration));
  return errors.wrap("supplied properties not correct for \"FileFormatConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreFileFormatConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreFileFormatConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "JsonConfiguration": cdk.objectToCloudFormation(properties.jsonConfiguration),
    "ParquetConfiguration": convertCfnDatastoreParquetConfigurationPropertyToCloudFormation(properties.parquetConfiguration)
  };
}

// @ts-ignore TS6133
function CfnDatastoreFileFormatConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.FileFormatConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.FileFormatConfigurationProperty>();
  ret.addPropertyResult("jsonConfiguration", "JsonConfiguration", (properties.JsonConfiguration != null ? cfn_parse.FromCloudFormation.getAny(properties.JsonConfiguration) : undefined));
  ret.addPropertyResult("parquetConfiguration", "ParquetConfiguration", (properties.ParquetConfiguration != null ? CfnDatastoreParquetConfigurationPropertyFromCloudFormation(properties.ParquetConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PartitionProperty`
 *
 * @param properties - the TypeScript properties of a `PartitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastorePartitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeName", cdk.requiredValidator)(properties.attributeName));
  errors.collect(cdk.propertyValidator("attributeName", cdk.validateString)(properties.attributeName));
  return errors.wrap("supplied properties not correct for \"PartitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastorePartitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastorePartitionPropertyValidator(properties).assertSuccess();
  return {
    "AttributeName": cdk.stringToCloudFormation(properties.attributeName)
  };
}

// @ts-ignore TS6133
function CfnDatastorePartitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatastore.PartitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.PartitionProperty>();
  ret.addPropertyResult("attributeName", "AttributeName", (properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TimestampPartitionProperty`
 *
 * @param properties - the TypeScript properties of a `TimestampPartitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreTimestampPartitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributeName", cdk.requiredValidator)(properties.attributeName));
  errors.collect(cdk.propertyValidator("attributeName", cdk.validateString)(properties.attributeName));
  errors.collect(cdk.propertyValidator("timestampFormat", cdk.validateString)(properties.timestampFormat));
  return errors.wrap("supplied properties not correct for \"TimestampPartitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreTimestampPartitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreTimestampPartitionPropertyValidator(properties).assertSuccess();
  return {
    "AttributeName": cdk.stringToCloudFormation(properties.attributeName),
    "TimestampFormat": cdk.stringToCloudFormation(properties.timestampFormat)
  };
}

// @ts-ignore TS6133
function CfnDatastoreTimestampPartitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatastore.TimestampPartitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.TimestampPartitionProperty>();
  ret.addPropertyResult("attributeName", "AttributeName", (properties.AttributeName != null ? cfn_parse.FromCloudFormation.getString(properties.AttributeName) : undefined));
  ret.addPropertyResult("timestampFormat", "TimestampFormat", (properties.TimestampFormat != null ? cfn_parse.FromCloudFormation.getString(properties.TimestampFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatastorePartitionProperty`
 *
 * @param properties - the TypeScript properties of a `DatastorePartitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreDatastorePartitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partition", CfnDatastorePartitionPropertyValidator)(properties.partition));
  errors.collect(cdk.propertyValidator("timestampPartition", CfnDatastoreTimestampPartitionPropertyValidator)(properties.timestampPartition));
  return errors.wrap("supplied properties not correct for \"DatastorePartitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreDatastorePartitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreDatastorePartitionPropertyValidator(properties).assertSuccess();
  return {
    "Partition": convertCfnDatastorePartitionPropertyToCloudFormation(properties.partition),
    "TimestampPartition": convertCfnDatastoreTimestampPartitionPropertyToCloudFormation(properties.timestampPartition)
  };
}

// @ts-ignore TS6133
function CfnDatastoreDatastorePartitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.DatastorePartitionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.DatastorePartitionProperty>();
  ret.addPropertyResult("partition", "Partition", (properties.Partition != null ? CfnDatastorePartitionPropertyFromCloudFormation(properties.Partition) : undefined));
  ret.addPropertyResult("timestampPartition", "TimestampPartition", (properties.TimestampPartition != null ? CfnDatastoreTimestampPartitionPropertyFromCloudFormation(properties.TimestampPartition) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatastorePartitionsProperty`
 *
 * @param properties - the TypeScript properties of a `DatastorePartitionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreDatastorePartitionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("partitions", cdk.listValidator(CfnDatastoreDatastorePartitionPropertyValidator))(properties.partitions));
  return errors.wrap("supplied properties not correct for \"DatastorePartitionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreDatastorePartitionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreDatastorePartitionsPropertyValidator(properties).assertSuccess();
  return {
    "Partitions": cdk.listMapper(convertCfnDatastoreDatastorePartitionPropertyToCloudFormation)(properties.partitions)
  };
}

// @ts-ignore TS6133
function CfnDatastoreDatastorePartitionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastore.DatastorePartitionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.DatastorePartitionsProperty>();
  ret.addPropertyResult("partitions", "Partitions", (properties.Partitions != null ? cfn_parse.FromCloudFormation.getArray(CfnDatastoreDatastorePartitionPropertyFromCloudFormation)(properties.Partitions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RetentionPeriodProperty`
 *
 * @param properties - the TypeScript properties of a `RetentionPeriodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastoreRetentionPeriodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("numberOfDays", cdk.validateNumber)(properties.numberOfDays));
  errors.collect(cdk.propertyValidator("unlimited", cdk.validateBoolean)(properties.unlimited));
  return errors.wrap("supplied properties not correct for \"RetentionPeriodProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatastoreRetentionPeriodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastoreRetentionPeriodPropertyValidator(properties).assertSuccess();
  return {
    "NumberOfDays": cdk.numberToCloudFormation(properties.numberOfDays),
    "Unlimited": cdk.booleanToCloudFormation(properties.unlimited)
  };
}

// @ts-ignore TS6133
function CfnDatastoreRetentionPeriodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatastore.RetentionPeriodProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastore.RetentionPeriodProperty>();
  ret.addPropertyResult("numberOfDays", "NumberOfDays", (properties.NumberOfDays != null ? cfn_parse.FromCloudFormation.getNumber(properties.NumberOfDays) : undefined));
  ret.addPropertyResult("unlimited", "Unlimited", (properties.Unlimited != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Unlimited) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDatastoreProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatastoreProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatastorePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datastoreName", cdk.validateString)(properties.datastoreName));
  errors.collect(cdk.propertyValidator("datastorePartitions", CfnDatastoreDatastorePartitionsPropertyValidator)(properties.datastorePartitions));
  errors.collect(cdk.propertyValidator("datastoreStorage", CfnDatastoreDatastoreStoragePropertyValidator)(properties.datastoreStorage));
  errors.collect(cdk.propertyValidator("fileFormatConfiguration", CfnDatastoreFileFormatConfigurationPropertyValidator)(properties.fileFormatConfiguration));
  errors.collect(cdk.propertyValidator("retentionPeriod", CfnDatastoreRetentionPeriodPropertyValidator)(properties.retentionPeriod));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDatastoreProps\"");
}

// @ts-ignore TS6133
function convertCfnDatastorePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatastorePropsValidator(properties).assertSuccess();
  return {
    "DatastoreName": cdk.stringToCloudFormation(properties.datastoreName),
    "DatastorePartitions": convertCfnDatastoreDatastorePartitionsPropertyToCloudFormation(properties.datastorePartitions),
    "DatastoreStorage": convertCfnDatastoreDatastoreStoragePropertyToCloudFormation(properties.datastoreStorage),
    "FileFormatConfiguration": convertCfnDatastoreFileFormatConfigurationPropertyToCloudFormation(properties.fileFormatConfiguration),
    "RetentionPeriod": convertCfnDatastoreRetentionPeriodPropertyToCloudFormation(properties.retentionPeriod),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDatastorePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatastoreProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatastoreProps>();
  ret.addPropertyResult("datastoreName", "DatastoreName", (properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined));
  ret.addPropertyResult("datastorePartitions", "DatastorePartitions", (properties.DatastorePartitions != null ? CfnDatastoreDatastorePartitionsPropertyFromCloudFormation(properties.DatastorePartitions) : undefined));
  ret.addPropertyResult("datastoreStorage", "DatastoreStorage", (properties.DatastoreStorage != null ? CfnDatastoreDatastoreStoragePropertyFromCloudFormation(properties.DatastoreStorage) : undefined));
  ret.addPropertyResult("fileFormatConfiguration", "FileFormatConfiguration", (properties.FileFormatConfiguration != null ? CfnDatastoreFileFormatConfigurationPropertyFromCloudFormation(properties.FileFormatConfiguration) : undefined));
  ret.addPropertyResult("retentionPeriod", "RetentionPeriod", (properties.RetentionPeriod != null ? CfnDatastoreRetentionPeriodPropertyFromCloudFormation(properties.RetentionPeriod) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The AWS::IoTAnalytics::Pipeline resource consumes messages from one or more channels and allows you to process the messages before storing them in a data store.
 *
 * You must specify both a `channel` and a `datastore` activity and, optionally, as many as 23 additional activities in the `pipelineActivities` array. For more information, see [How to Use AWS IoT Analytics](https://docs.aws.amazon.com/iotanalytics/latest/userguide/welcome.html#aws-iot-analytics-how) in the *AWS IoT Analytics User Guide* .
 *
 * @cloudformationResource AWS::IoTAnalytics::Pipeline
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html
 */
export class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::IoTAnalytics::Pipeline";

  /**
   * Build a CfnPipeline from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPipelinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPipeline(scope, id, propsResult.value);
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
   * A list of "PipelineActivity" objects.
   */
  public pipelineActivities: Array<CfnPipeline.ActivityProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the pipeline.
   */
  public pipelineName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Metadata which can be used to manage the pipeline.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps) {
    super(scope, id, {
      "type": CfnPipeline.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "pipelineActivities", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.pipelineActivities = props.pipelineActivities;
    this.pipelineName = props.pipelineName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::IoTAnalytics::Pipeline", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "pipelineActivities": this.pipelineActivities,
      "pipelineName": this.pipelineName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipeline.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPipelinePropsToCloudFormation(props);
  }
}

export namespace CfnPipeline {
  /**
   * An activity that performs a transformation on a message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html
   */
  export interface ActivityProperty {
    /**
     * Adds other attributes based on existing attributes in the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-addattributes
     */
    readonly addAttributes?: CfnPipeline.AddAttributesProperty | cdk.IResolvable;

    /**
     * Determines the source of the messages to be processed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-channel
     */
    readonly channel?: CfnPipeline.ChannelProperty | cdk.IResolvable;

    /**
     * Specifies where to store the processed message data.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-datastore
     */
    readonly datastore?: CfnPipeline.DatastoreProperty | cdk.IResolvable;

    /**
     * Adds data from the AWS IoT device registry to your message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-deviceregistryenrich
     */
    readonly deviceRegistryEnrich?: CfnPipeline.DeviceRegistryEnrichProperty | cdk.IResolvable;

    /**
     * Adds information from the AWS IoT Device Shadows service to a message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-deviceshadowenrich
     */
    readonly deviceShadowEnrich?: CfnPipeline.DeviceShadowEnrichProperty | cdk.IResolvable;

    /**
     * Filters a message based on its attributes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-filter
     */
    readonly filter?: CfnPipeline.FilterProperty | cdk.IResolvable;

    /**
     * Runs a Lambda function to modify the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-lambda
     */
    readonly lambda?: cdk.IResolvable | CfnPipeline.LambdaProperty;

    /**
     * Computes an arithmetic expression using the message's attributes and adds it to the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-math
     */
    readonly math?: cdk.IResolvable | CfnPipeline.MathProperty;

    /**
     * Removes attributes from a message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-removeattributes
     */
    readonly removeAttributes?: cdk.IResolvable | CfnPipeline.RemoveAttributesProperty;

    /**
     * Creates a new message using only the specified attributes from the original message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-activity.html#cfn-iotanalytics-pipeline-activity-selectattributes
     */
    readonly selectAttributes?: cdk.IResolvable | CfnPipeline.SelectAttributesProperty;
  }

  /**
   * Creates a new message using only the specified attributes from the original message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html
   */
  export interface SelectAttributesProperty {
    /**
     * A list of the attributes to select from the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html#cfn-iotanalytics-pipeline-selectattributes-attributes
     */
    readonly attributes: Array<string>;

    /**
     * The name of the 'selectAttributes' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html#cfn-iotanalytics-pipeline-selectattributes-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-selectattributes.html#cfn-iotanalytics-pipeline-selectattributes-next
     */
    readonly next?: string;
  }

  /**
   * The datastore activity that specifies where to store the processed data.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html
   */
  export interface DatastoreProperty {
    /**
     * The name of the data store where processed messages are stored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html#cfn-iotanalytics-pipeline-datastore-datastorename
     */
    readonly datastoreName: string;

    /**
     * The name of the datastore activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-datastore.html#cfn-iotanalytics-pipeline-datastore-name
     */
    readonly name: string;
  }

  /**
   * An activity that filters a message based on its attributes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html
   */
  export interface FilterProperty {
    /**
     * An expression that looks like an SQL WHERE clause that must return a Boolean value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html#cfn-iotanalytics-pipeline-filter-filter
     */
    readonly filter: string;

    /**
     * The name of the 'filter' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html#cfn-iotanalytics-pipeline-filter-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-filter.html#cfn-iotanalytics-pipeline-filter-next
     */
    readonly next?: string;
  }

  /**
   * An activity that adds other attributes based on existing attributes in the message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html
   */
  export interface AddAttributesProperty {
    /**
     * A list of 1-50 "AttributeNameMapping" objects that map an existing attribute to a new attribute.
     *
     * > The existing attributes remain in the message, so if you want to remove the originals, use "RemoveAttributeActivity".
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-attributes
     */
    readonly attributes: cdk.IResolvable | Record<string, string>;

    /**
     * The name of the 'addAttributes' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-addattributes.html#cfn-iotanalytics-pipeline-addattributes-next
     */
    readonly next?: string;
  }

  /**
   * Determines the source of the messages to be processed.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html
   */
  export interface ChannelProperty {
    /**
     * The name of the channel from which the messages are processed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html#cfn-iotanalytics-pipeline-channel-channelname
     */
    readonly channelName: string;

    /**
     * The name of the 'channel' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html#cfn-iotanalytics-pipeline-channel-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-channel.html#cfn-iotanalytics-pipeline-channel-next
     */
    readonly next?: string;
  }

  /**
   * An activity that adds information from the AWS IoT Device Shadows service to a message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html
   */
  export interface DeviceShadowEnrichProperty {
    /**
     * The name of the attribute that is added to the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-attribute
     */
    readonly attribute: string;

    /**
     * The name of the 'deviceShadowEnrich' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-next
     */
    readonly next?: string;

    /**
     * The ARN of the role that allows access to the device's shadow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of the IoT device whose shadow information is added to the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceshadowenrich.html#cfn-iotanalytics-pipeline-deviceshadowenrich-thingname
     */
    readonly thingName: string;
  }

  /**
   * An activity that computes an arithmetic expression using the message's attributes.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html
   */
  export interface MathProperty {
    /**
     * The name of the attribute that contains the result of the math operation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-attribute
     */
    readonly attribute: string;

    /**
     * An expression that uses one or more existing attributes and must return an integer value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-math
     */
    readonly math: string;

    /**
     * The name of the 'math' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-math.html#cfn-iotanalytics-pipeline-math-next
     */
    readonly next?: string;
  }

  /**
   * An activity that runs a Lambda function to modify the message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html
   */
  export interface LambdaProperty {
    /**
     * The number of messages passed to the Lambda function for processing.
     *
     * The AWS Lambda function must be able to process all of these messages within five minutes, which is the maximum timeout duration for Lambda functions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-batchsize
     */
    readonly batchSize: number;

    /**
     * The name of the Lambda function that is run on the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-lambdaname
     */
    readonly lambdaName: string;

    /**
     * The name of the 'lambda' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-lambda.html#cfn-iotanalytics-pipeline-lambda-next
     */
    readonly next?: string;
  }

  /**
   * An activity that adds data from the AWS IoT device registry to your message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html
   */
  export interface DeviceRegistryEnrichProperty {
    /**
     * The name of the attribute that is added to the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-attribute
     */
    readonly attribute: string;

    /**
     * The name of the 'deviceRegistryEnrich' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-next
     */
    readonly next?: string;

    /**
     * The ARN of the role that allows access to the device's registry information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-rolearn
     */
    readonly roleArn: string;

    /**
     * The name of the IoT device whose registry information is added to the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-deviceregistryenrich.html#cfn-iotanalytics-pipeline-deviceregistryenrich-thingname
     */
    readonly thingName: string;
  }

  /**
   * An activity that removes attributes from a message.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html
   */
  export interface RemoveAttributesProperty {
    /**
     * A list of 1-50 attributes to remove from the message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html#cfn-iotanalytics-pipeline-removeattributes-attributes
     */
    readonly attributes: Array<string>;

    /**
     * The name of the 'removeAttributes' activity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html#cfn-iotanalytics-pipeline-removeattributes-name
     */
    readonly name: string;

    /**
     * The next activity in the pipeline.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-iotanalytics-pipeline-removeattributes.html#cfn-iotanalytics-pipeline-removeattributes-next
     */
    readonly next?: string;
  }
}

/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html
 */
export interface CfnPipelineProps {
  /**
   * A list of "PipelineActivity" objects.
   *
   * Activities perform transformations on your messages, such as removing, renaming or adding message attributes; filtering messages based on attribute values; invoking your Lambda functions on messages for advanced processing; or performing mathematical transformations to normalize device data.
   *
   * The list can be 2-25 *PipelineActivity* objects and must contain both a `channel` and a `datastore` activity. Each entry in the list must contain only one activity, for example:
   *
   * `pipelineActivities = [ { "channel": { ... } }, { "lambda": { ... } }, ... ]`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelineactivities
   */
  readonly pipelineActivities: Array<CfnPipeline.ActivityProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-pipelinename
   */
  readonly pipelineName?: string;

  /**
   * Metadata which can be used to manage the pipeline.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-iotanalytics-pipeline.html#cfn-iotanalytics-pipeline-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `SelectAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `SelectAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineSelectAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"SelectAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineSelectAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineSelectAttributesPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.attributes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineSelectAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.SelectAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.SelectAttributesProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DatastoreProperty`
 *
 * @param properties - the TypeScript properties of a `DatastoreProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineDatastorePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("datastoreName", cdk.requiredValidator)(properties.datastoreName));
  errors.collect(cdk.propertyValidator("datastoreName", cdk.validateString)(properties.datastoreName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"DatastoreProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineDatastorePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineDatastorePropertyValidator(properties).assertSuccess();
  return {
    "DatastoreName": cdk.stringToCloudFormation(properties.datastoreName),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnPipelineDatastorePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.DatastoreProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.DatastoreProperty>();
  ret.addPropertyResult("datastoreName", "DatastoreName", (properties.DatastoreName != null ? cfn_parse.FromCloudFormation.getString(properties.DatastoreName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterProperty`
 *
 * @param properties - the TypeScript properties of a `FilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filter", cdk.requiredValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("filter", cdk.validateString)(properties.filter));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineFilterPropertyValidator(properties).assertSuccess();
  return {
    "Filter": cdk.stringToCloudFormation(properties.filter),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.FilterProperty>();
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? cfn_parse.FromCloudFormation.getString(properties.Filter) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `AddAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineAddAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.hashValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"AddAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineAddAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineAddAttributesPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.hashMapper(cdk.stringToCloudFormation)(properties.attributes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineAddAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.AddAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.AddAttributesProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ChannelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineChannelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelName", cdk.requiredValidator)(properties.channelName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"ChannelProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineChannelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineChannelPropertyValidator(properties).assertSuccess();
  return {
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ChannelProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ChannelProperty>();
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeviceShadowEnrichProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceShadowEnrichProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineDeviceShadowEnrichPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attribute", cdk.requiredValidator)(properties.attribute));
  errors.collect(cdk.propertyValidator("attribute", cdk.validateString)(properties.attribute));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("thingName", cdk.requiredValidator)(properties.thingName));
  errors.collect(cdk.propertyValidator("thingName", cdk.validateString)(properties.thingName));
  return errors.wrap("supplied properties not correct for \"DeviceShadowEnrichProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineDeviceShadowEnrichPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineDeviceShadowEnrichPropertyValidator(properties).assertSuccess();
  return {
    "Attribute": cdk.stringToCloudFormation(properties.attribute),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "ThingName": cdk.stringToCloudFormation(properties.thingName)
  };
}

// @ts-ignore TS6133
function CfnPipelineDeviceShadowEnrichPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.DeviceShadowEnrichProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.DeviceShadowEnrichProperty>();
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? cfn_parse.FromCloudFormation.getString(properties.Attribute) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("thingName", "ThingName", (properties.ThingName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MathProperty`
 *
 * @param properties - the TypeScript properties of a `MathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineMathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attribute", cdk.requiredValidator)(properties.attribute));
  errors.collect(cdk.propertyValidator("attribute", cdk.validateString)(properties.attribute));
  errors.collect(cdk.propertyValidator("math", cdk.requiredValidator)(properties.math));
  errors.collect(cdk.propertyValidator("math", cdk.validateString)(properties.math));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"MathProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineMathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineMathPropertyValidator(properties).assertSuccess();
  return {
    "Attribute": cdk.stringToCloudFormation(properties.attribute),
    "Math": cdk.stringToCloudFormation(properties.math),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineMathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.MathProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.MathProperty>();
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? cfn_parse.FromCloudFormation.getString(properties.Attribute) : undefined));
  ret.addPropertyResult("math", "Math", (properties.Math != null ? cfn_parse.FromCloudFormation.getString(properties.Math) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineLambdaPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.requiredValidator)(properties.batchSize));
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("lambdaName", cdk.requiredValidator)(properties.lambdaName));
  errors.collect(cdk.propertyValidator("lambdaName", cdk.validateString)(properties.lambdaName));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"LambdaProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineLambdaPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineLambdaPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "LambdaName": cdk.stringToCloudFormation(properties.lambdaName),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineLambdaPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.LambdaProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.LambdaProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("lambdaName", "LambdaName", (properties.LambdaName != null ? cfn_parse.FromCloudFormation.getString(properties.LambdaName) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeviceRegistryEnrichProperty`
 *
 * @param properties - the TypeScript properties of a `DeviceRegistryEnrichProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineDeviceRegistryEnrichPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attribute", cdk.requiredValidator)(properties.attribute));
  errors.collect(cdk.propertyValidator("attribute", cdk.validateString)(properties.attribute));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("thingName", cdk.requiredValidator)(properties.thingName));
  errors.collect(cdk.propertyValidator("thingName", cdk.validateString)(properties.thingName));
  return errors.wrap("supplied properties not correct for \"DeviceRegistryEnrichProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineDeviceRegistryEnrichPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineDeviceRegistryEnrichPropertyValidator(properties).assertSuccess();
  return {
    "Attribute": cdk.stringToCloudFormation(properties.attribute),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "ThingName": cdk.stringToCloudFormation(properties.thingName)
  };
}

// @ts-ignore TS6133
function CfnPipelineDeviceRegistryEnrichPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.DeviceRegistryEnrichProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.DeviceRegistryEnrichProperty>();
  ret.addPropertyResult("attribute", "Attribute", (properties.Attribute != null ? cfn_parse.FromCloudFormation.getString(properties.Attribute) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("thingName", "ThingName", (properties.ThingName != null ? cfn_parse.FromCloudFormation.getString(properties.ThingName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RemoveAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `RemoveAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineRemoveAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attributes", cdk.requiredValidator)(properties.attributes));
  errors.collect(cdk.propertyValidator("attributes", cdk.listValidator(cdk.validateString))(properties.attributes));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("next", cdk.validateString)(properties.next));
  return errors.wrap("supplied properties not correct for \"RemoveAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineRemoveAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineRemoveAttributesPropertyValidator(properties).assertSuccess();
  return {
    "Attributes": cdk.listMapper(cdk.stringToCloudFormation)(properties.attributes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Next": cdk.stringToCloudFormation(properties.next)
  };
}

// @ts-ignore TS6133
function CfnPipelineRemoveAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.RemoveAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.RemoveAttributesProperty>();
  ret.addPropertyResult("attributes", "Attributes", (properties.Attributes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Attributes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("next", "Next", (properties.Next != null ? cfn_parse.FromCloudFormation.getString(properties.Next) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ActivityProperty`
 *
 * @param properties - the TypeScript properties of a `ActivityProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineActivityPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addAttributes", CfnPipelineAddAttributesPropertyValidator)(properties.addAttributes));
  errors.collect(cdk.propertyValidator("channel", CfnPipelineChannelPropertyValidator)(properties.channel));
  errors.collect(cdk.propertyValidator("datastore", CfnPipelineDatastorePropertyValidator)(properties.datastore));
  errors.collect(cdk.propertyValidator("deviceRegistryEnrich", CfnPipelineDeviceRegistryEnrichPropertyValidator)(properties.deviceRegistryEnrich));
  errors.collect(cdk.propertyValidator("deviceShadowEnrich", CfnPipelineDeviceShadowEnrichPropertyValidator)(properties.deviceShadowEnrich));
  errors.collect(cdk.propertyValidator("filter", CfnPipelineFilterPropertyValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("lambda", CfnPipelineLambdaPropertyValidator)(properties.lambda));
  errors.collect(cdk.propertyValidator("math", CfnPipelineMathPropertyValidator)(properties.math));
  errors.collect(cdk.propertyValidator("removeAttributes", CfnPipelineRemoveAttributesPropertyValidator)(properties.removeAttributes));
  errors.collect(cdk.propertyValidator("selectAttributes", CfnPipelineSelectAttributesPropertyValidator)(properties.selectAttributes));
  return errors.wrap("supplied properties not correct for \"ActivityProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineActivityPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineActivityPropertyValidator(properties).assertSuccess();
  return {
    "AddAttributes": convertCfnPipelineAddAttributesPropertyToCloudFormation(properties.addAttributes),
    "Channel": convertCfnPipelineChannelPropertyToCloudFormation(properties.channel),
    "Datastore": convertCfnPipelineDatastorePropertyToCloudFormation(properties.datastore),
    "DeviceRegistryEnrich": convertCfnPipelineDeviceRegistryEnrichPropertyToCloudFormation(properties.deviceRegistryEnrich),
    "DeviceShadowEnrich": convertCfnPipelineDeviceShadowEnrichPropertyToCloudFormation(properties.deviceShadowEnrich),
    "Filter": convertCfnPipelineFilterPropertyToCloudFormation(properties.filter),
    "Lambda": convertCfnPipelineLambdaPropertyToCloudFormation(properties.lambda),
    "Math": convertCfnPipelineMathPropertyToCloudFormation(properties.math),
    "RemoveAttributes": convertCfnPipelineRemoveAttributesPropertyToCloudFormation(properties.removeAttributes),
    "SelectAttributes": convertCfnPipelineSelectAttributesPropertyToCloudFormation(properties.selectAttributes)
  };
}

// @ts-ignore TS6133
function CfnPipelineActivityPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.ActivityProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.ActivityProperty>();
  ret.addPropertyResult("addAttributes", "AddAttributes", (properties.AddAttributes != null ? CfnPipelineAddAttributesPropertyFromCloudFormation(properties.AddAttributes) : undefined));
  ret.addPropertyResult("channel", "Channel", (properties.Channel != null ? CfnPipelineChannelPropertyFromCloudFormation(properties.Channel) : undefined));
  ret.addPropertyResult("datastore", "Datastore", (properties.Datastore != null ? CfnPipelineDatastorePropertyFromCloudFormation(properties.Datastore) : undefined));
  ret.addPropertyResult("deviceRegistryEnrich", "DeviceRegistryEnrich", (properties.DeviceRegistryEnrich != null ? CfnPipelineDeviceRegistryEnrichPropertyFromCloudFormation(properties.DeviceRegistryEnrich) : undefined));
  ret.addPropertyResult("deviceShadowEnrich", "DeviceShadowEnrich", (properties.DeviceShadowEnrich != null ? CfnPipelineDeviceShadowEnrichPropertyFromCloudFormation(properties.DeviceShadowEnrich) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnPipelineFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addPropertyResult("lambda", "Lambda", (properties.Lambda != null ? CfnPipelineLambdaPropertyFromCloudFormation(properties.Lambda) : undefined));
  ret.addPropertyResult("math", "Math", (properties.Math != null ? CfnPipelineMathPropertyFromCloudFormation(properties.Math) : undefined));
  ret.addPropertyResult("removeAttributes", "RemoveAttributes", (properties.RemoveAttributes != null ? CfnPipelineRemoveAttributesPropertyFromCloudFormation(properties.RemoveAttributes) : undefined));
  ret.addPropertyResult("selectAttributes", "SelectAttributes", (properties.SelectAttributes != null ? CfnPipelineSelectAttributesPropertyFromCloudFormation(properties.SelectAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pipelineActivities", cdk.requiredValidator)(properties.pipelineActivities));
  errors.collect(cdk.propertyValidator("pipelineActivities", cdk.listValidator(CfnPipelineActivityPropertyValidator))(properties.pipelineActivities));
  errors.collect(cdk.propertyValidator("pipelineName", cdk.validateString)(properties.pipelineName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPipelineProps\"");
}

// @ts-ignore TS6133
function convertCfnPipelinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelinePropsValidator(properties).assertSuccess();
  return {
    "PipelineActivities": cdk.listMapper(convertCfnPipelineActivityPropertyToCloudFormation)(properties.pipelineActivities),
    "PipelineName": cdk.stringToCloudFormation(properties.pipelineName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipelineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipelineProps>();
  ret.addPropertyResult("pipelineActivities", "PipelineActivities", (properties.PipelineActivities != null ? cfn_parse.FromCloudFormation.getArray(CfnPipelineActivityPropertyFromCloudFormation)(properties.PipelineActivities) : undefined));
  ret.addPropertyResult("pipelineName", "PipelineName", (properties.PipelineName != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}