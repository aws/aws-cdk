/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::Lightsail::Alarm` resource specifies an alarm that can be used to monitor a single metric for one of your Lightsail resources.
 *
 * @cloudformationResource AWS::Lightsail::Alarm
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html
 */
export class CfnAlarm extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Alarm";

  /**
   * Build a CfnAlarm from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAlarm {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAlarmPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAlarm(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the alarm.
   *
   * @cloudformationAttribute AlarmArn
   */
  public readonly attrAlarmArn: string;

  /**
   * The current state of the alarm.
   *
   * An alarm has the following possible states:
   *
   * - `ALARM` - The metric is outside of the defined threshold.
   * - `INSUFFICIENT_DATA` - The alarm has recently started, the metric is not available, or not enough data is available for the metric to determine the alarm state.
   * - `OK` - The metric is within the defined threshold.
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The name of the alarm.
   */
  public alarmName: string;

  /**
   * The arithmetic operation to use when comparing the specified statistic and threshold.
   */
  public comparisonOperator: string;

  /**
   * The contact protocols for the alarm, such as `Email` , `SMS` (text messaging), or both.
   */
  public contactProtocols?: Array<string>;

  /**
   * The number of data points within the evaluation periods that must be breaching to cause the alarm to go to the `ALARM` state.
   */
  public datapointsToAlarm?: number;

  /**
   * The number of periods over which data is compared to the specified threshold.
   */
  public evaluationPeriods: number;

  /**
   * The name of the metric associated with the alarm.
   */
  public metricName: string;

  /**
   * The name of the Lightsail resource that the alarm monitors.
   */
  public monitoredResourceName: string;

  /**
   * A Boolean value indicating whether the alarm is enabled.
   */
  public notificationEnabled?: boolean | cdk.IResolvable;

  /**
   * The alarm states that trigger a notification.
   */
  public notificationTriggers?: Array<string>;

  /**
   * The value against which the specified statistic is compared.
   */
  public threshold: number;

  /**
   * Specifies how the alarm handles missing data points.
   */
  public treatMissingData?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAlarmProps) {
    super(scope, id, {
      "type": CfnAlarm.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "alarmName", this);
    cdk.requireProperty(props, "comparisonOperator", this);
    cdk.requireProperty(props, "evaluationPeriods", this);
    cdk.requireProperty(props, "metricName", this);
    cdk.requireProperty(props, "monitoredResourceName", this);
    cdk.requireProperty(props, "threshold", this);

    this.attrAlarmArn = cdk.Token.asString(this.getAtt("AlarmArn", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.alarmName = props.alarmName;
    this.comparisonOperator = props.comparisonOperator;
    this.contactProtocols = props.contactProtocols;
    this.datapointsToAlarm = props.datapointsToAlarm;
    this.evaluationPeriods = props.evaluationPeriods;
    this.metricName = props.metricName;
    this.monitoredResourceName = props.monitoredResourceName;
    this.notificationEnabled = props.notificationEnabled;
    this.notificationTriggers = props.notificationTriggers;
    this.threshold = props.threshold;
    this.treatMissingData = props.treatMissingData;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "alarmName": this.alarmName,
      "comparisonOperator": this.comparisonOperator,
      "contactProtocols": this.contactProtocols,
      "datapointsToAlarm": this.datapointsToAlarm,
      "evaluationPeriods": this.evaluationPeriods,
      "metricName": this.metricName,
      "monitoredResourceName": this.monitoredResourceName,
      "notificationEnabled": this.notificationEnabled,
      "notificationTriggers": this.notificationTriggers,
      "threshold": this.threshold,
      "treatMissingData": this.treatMissingData
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAlarm.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAlarmPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnAlarm`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html
 */
export interface CfnAlarmProps {
  /**
   * The name of the alarm.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-alarmname
   */
  readonly alarmName: string;

  /**
   * The arithmetic operation to use when comparing the specified statistic and threshold.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-comparisonoperator
   */
  readonly comparisonOperator: string;

  /**
   * The contact protocols for the alarm, such as `Email` , `SMS` (text messaging), or both.
   *
   * *Allowed Values* : `Email` | `SMS`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-contactprotocols
   */
  readonly contactProtocols?: Array<string>;

  /**
   * The number of data points within the evaluation periods that must be breaching to cause the alarm to go to the `ALARM` state.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-datapointstoalarm
   */
  readonly datapointsToAlarm?: number;

  /**
   * The number of periods over which data is compared to the specified threshold.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-evaluationperiods
   */
  readonly evaluationPeriods: number;

  /**
   * The name of the metric associated with the alarm.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-metricname
   */
  readonly metricName: string;

  /**
   * The name of the Lightsail resource that the alarm monitors.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-monitoredresourcename
   */
  readonly monitoredResourceName: string;

  /**
   * A Boolean value indicating whether the alarm is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-notificationenabled
   */
  readonly notificationEnabled?: boolean | cdk.IResolvable;

  /**
   * The alarm states that trigger a notification.
   *
   * > To specify the `OK` and `INSUFFICIENT_DATA` values, you must also specify `ContactProtocols` values. Otherwise, the `OK` and `INSUFFICIENT_DATA` values will not take effect and the stack will drift.
   *
   * *Allowed Values* : `OK` | `ALARM` | `INSUFFICIENT_DATA`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-notificationtriggers
   */
  readonly notificationTriggers?: Array<string>;

  /**
   * The value against which the specified statistic is compared.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-threshold
   */
  readonly threshold: number;

  /**
   * Specifies how the alarm handles missing data points.
   *
   * An alarm can treat missing data in the following ways:
   *
   * - `breaching` - Assumes the missing data is not within the threshold. Missing data counts towards the number of times that the metric is not within the threshold.
   * - `notBreaching` - Assumes the missing data is within the threshold. Missing data does not count towards the number of times that the metric is not within the threshold.
   * - `ignore` - Ignores the missing data. Maintains the current alarm state.
   * - `missing` - Missing data is treated as missing.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-alarm.html#cfn-lightsail-alarm-treatmissingdata
   */
  readonly treatMissingData?: string;
}

/**
 * Determine whether the given properties match those of a `CfnAlarmProps`
 *
 * @param properties - the TypeScript properties of a `CfnAlarmProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAlarmPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarmName", cdk.requiredValidator)(properties.alarmName));
  errors.collect(cdk.propertyValidator("alarmName", cdk.validateString)(properties.alarmName));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.requiredValidator)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("comparisonOperator", cdk.validateString)(properties.comparisonOperator));
  errors.collect(cdk.propertyValidator("contactProtocols", cdk.listValidator(cdk.validateString))(properties.contactProtocols));
  errors.collect(cdk.propertyValidator("datapointsToAlarm", cdk.validateNumber)(properties.datapointsToAlarm));
  errors.collect(cdk.propertyValidator("evaluationPeriods", cdk.requiredValidator)(properties.evaluationPeriods));
  errors.collect(cdk.propertyValidator("evaluationPeriods", cdk.validateNumber)(properties.evaluationPeriods));
  errors.collect(cdk.propertyValidator("metricName", cdk.requiredValidator)(properties.metricName));
  errors.collect(cdk.propertyValidator("metricName", cdk.validateString)(properties.metricName));
  errors.collect(cdk.propertyValidator("monitoredResourceName", cdk.requiredValidator)(properties.monitoredResourceName));
  errors.collect(cdk.propertyValidator("monitoredResourceName", cdk.validateString)(properties.monitoredResourceName));
  errors.collect(cdk.propertyValidator("notificationEnabled", cdk.validateBoolean)(properties.notificationEnabled));
  errors.collect(cdk.propertyValidator("notificationTriggers", cdk.listValidator(cdk.validateString))(properties.notificationTriggers));
  errors.collect(cdk.propertyValidator("threshold", cdk.requiredValidator)(properties.threshold));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("treatMissingData", cdk.validateString)(properties.treatMissingData));
  return errors.wrap("supplied properties not correct for \"CfnAlarmProps\"");
}

// @ts-ignore TS6133
function convertCfnAlarmPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAlarmPropsValidator(properties).assertSuccess();
  return {
    "AlarmName": cdk.stringToCloudFormation(properties.alarmName),
    "ComparisonOperator": cdk.stringToCloudFormation(properties.comparisonOperator),
    "ContactProtocols": cdk.listMapper(cdk.stringToCloudFormation)(properties.contactProtocols),
    "DatapointsToAlarm": cdk.numberToCloudFormation(properties.datapointsToAlarm),
    "EvaluationPeriods": cdk.numberToCloudFormation(properties.evaluationPeriods),
    "MetricName": cdk.stringToCloudFormation(properties.metricName),
    "MonitoredResourceName": cdk.stringToCloudFormation(properties.monitoredResourceName),
    "NotificationEnabled": cdk.booleanToCloudFormation(properties.notificationEnabled),
    "NotificationTriggers": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationTriggers),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "TreatMissingData": cdk.stringToCloudFormation(properties.treatMissingData)
  };
}

// @ts-ignore TS6133
function CfnAlarmPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAlarmProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAlarmProps>();
  ret.addPropertyResult("alarmName", "AlarmName", (properties.AlarmName != null ? cfn_parse.FromCloudFormation.getString(properties.AlarmName) : undefined));
  ret.addPropertyResult("comparisonOperator", "ComparisonOperator", (properties.ComparisonOperator != null ? cfn_parse.FromCloudFormation.getString(properties.ComparisonOperator) : undefined));
  ret.addPropertyResult("contactProtocols", "ContactProtocols", (properties.ContactProtocols != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ContactProtocols) : undefined));
  ret.addPropertyResult("datapointsToAlarm", "DatapointsToAlarm", (properties.DatapointsToAlarm != null ? cfn_parse.FromCloudFormation.getNumber(properties.DatapointsToAlarm) : undefined));
  ret.addPropertyResult("evaluationPeriods", "EvaluationPeriods", (properties.EvaluationPeriods != null ? cfn_parse.FromCloudFormation.getNumber(properties.EvaluationPeriods) : undefined));
  ret.addPropertyResult("metricName", "MetricName", (properties.MetricName != null ? cfn_parse.FromCloudFormation.getString(properties.MetricName) : undefined));
  ret.addPropertyResult("monitoredResourceName", "MonitoredResourceName", (properties.MonitoredResourceName != null ? cfn_parse.FromCloudFormation.getString(properties.MonitoredResourceName) : undefined));
  ret.addPropertyResult("notificationEnabled", "NotificationEnabled", (properties.NotificationEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.NotificationEnabled) : undefined));
  ret.addPropertyResult("notificationTriggers", "NotificationTriggers", (properties.NotificationTriggers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationTriggers) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("treatMissingData", "TreatMissingData", (properties.TreatMissingData != null ? cfn_parse.FromCloudFormation.getString(properties.TreatMissingData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Bucket` resource specifies a bucket.
 *
 * @cloudformationResource AWS::Lightsail::Bucket
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html
 */
export class CfnBucket extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Bucket";

  /**
   * Build a CfnBucket from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnBucket {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnBucketPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnBucket(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A Boolean value indicating whether the bundle that is currently applied to your distribution can be changed to another bundle.
   *
   * @cloudformationAttribute AbleToUpdateBundle
   */
  public readonly attrAbleToUpdateBundle: cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the bucket.
   *
   * @cloudformationAttribute BucketArn
   */
  public readonly attrBucketArn: string;

  /**
   * The URL of the bucket.
   *
   * @cloudformationAttribute Url
   */
  public readonly attrUrl: string;

  /**
   * An object that describes the access rules for the bucket.
   */
  public accessRules?: CfnBucket.AccessRulesProperty | cdk.IResolvable;

  /**
   * The name of the bucket.
   */
  public bucketName: string;

  /**
   * The bundle ID for the bucket (for example, `small_1_0` ).
   */
  public bundleId: string;

  /**
   * Indicates whether object versioning is enabled for the bucket.
   */
  public objectVersioning?: boolean | cdk.IResolvable;

  /**
   * An array of AWS account IDs that have read-only access to the bucket.
   */
  public readOnlyAccessAccounts?: Array<string>;

  /**
   * An array of Lightsail instances that have access to the bucket.
   */
  public resourcesReceivingAccess?: Array<string>;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnBucketProps) {
    super(scope, id, {
      "type": CfnBucket.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bucketName", this);
    cdk.requireProperty(props, "bundleId", this);

    this.attrAbleToUpdateBundle = this.getAtt("AbleToUpdateBundle");
    this.attrBucketArn = cdk.Token.asString(this.getAtt("BucketArn", cdk.ResolutionTypeHint.STRING));
    this.attrUrl = cdk.Token.asString(this.getAtt("Url", cdk.ResolutionTypeHint.STRING));
    this.accessRules = props.accessRules;
    this.bucketName = props.bucketName;
    this.bundleId = props.bundleId;
    this.objectVersioning = props.objectVersioning;
    this.readOnlyAccessAccounts = props.readOnlyAccessAccounts;
    this.resourcesReceivingAccess = props.resourcesReceivingAccess;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Bucket", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessRules": this.accessRules,
      "bucketName": this.bucketName,
      "bundleId": this.bundleId,
      "objectVersioning": this.objectVersioning,
      "readOnlyAccessAccounts": this.readOnlyAccessAccounts,
      "resourcesReceivingAccess": this.resourcesReceivingAccess,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnBucket.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnBucketPropsToCloudFormation(props);
  }
}

export namespace CfnBucket {
  /**
   * `AccessRules` is a property of the [AWS::Lightsail::Bucket](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html) resource. It describes access rules for a bucket.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-bucket-accessrules.html
   */
  export interface AccessRulesProperty {
    /**
     * A Boolean value indicating whether the access control list (ACL) permissions that are applied to individual objects override the `GetObject` option that is currently specified.
     *
     * When this is true, you can use the [PutObjectAcl](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObjectAcl.html) Amazon S3 API operation to set individual objects to public (read-only) or private, using either the `public-read` ACL or the `private` ACL.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-bucket-accessrules.html#cfn-lightsail-bucket-accessrules-allowpublicoverrides
     */
    readonly allowPublicOverrides?: boolean | cdk.IResolvable;

    /**
     * Specifies the anonymous access to all objects in a bucket.
     *
     * The following options can be specified:
     *
     * - `public` - Sets all objects in the bucket to public (read-only), making them readable by everyone on the internet.
     *
     * If the `GetObject` value is set to `public` , then all objects in the bucket default to public regardless of the `allowPublicOverrides` value.
     * - `private` - Sets all objects in the bucket to private, making them readable only by you and anyone that you grant access to.
     *
     * If the `GetObject` value is set to `private` , and the `allowPublicOverrides` value is set to `true` , then all objects in the bucket default to private unless they are configured with a `public-read` ACL. Individual objects with a `public-read` ACL are readable by everyone on the internet.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-bucket-accessrules.html#cfn-lightsail-bucket-accessrules-getobject
     */
    readonly objectAccess?: string;
  }
}

/**
 * Properties for defining a `CfnBucket`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html
 */
export interface CfnBucketProps {
  /**
   * An object that describes the access rules for the bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-accessrules
   */
  readonly accessRules?: CfnBucket.AccessRulesProperty | cdk.IResolvable;

  /**
   * The name of the bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-bucketname
   */
  readonly bucketName: string;

  /**
   * The bundle ID for the bucket (for example, `small_1_0` ).
   *
   * A bucket bundle specifies the monthly cost, storage space, and data transfer quota for a bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-bundleid
   */
  readonly bundleId: string;

  /**
   * Indicates whether object versioning is enabled for the bucket.
   *
   * The following options can be configured:
   *
   * - `Enabled` - Object versioning is enabled.
   * - `Suspended` - Object versioning was previously enabled but is currently suspended. Existing object versions are retained.
   * - `NeverEnabled` - Object versioning has never been enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-objectversioning
   */
  readonly objectVersioning?: boolean | cdk.IResolvable;

  /**
   * An array of AWS account IDs that have read-only access to the bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-readonlyaccessaccounts
   */
  readonly readOnlyAccessAccounts?: Array<string>;

  /**
   * An array of Lightsail instances that have access to the bucket.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-resourcesreceivingaccess
   */
  readonly resourcesReceivingAccess?: Array<string>;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-bucket.html#cfn-lightsail-bucket-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AccessRulesProperty`
 *
 * @param properties - the TypeScript properties of a `AccessRulesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketAccessRulesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowPublicOverrides", cdk.validateBoolean)(properties.allowPublicOverrides));
  errors.collect(cdk.propertyValidator("objectAccess", cdk.validateString)(properties.objectAccess));
  return errors.wrap("supplied properties not correct for \"AccessRulesProperty\"");
}

// @ts-ignore TS6133
function convertCfnBucketAccessRulesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketAccessRulesPropertyValidator(properties).assertSuccess();
  return {
    "AllowPublicOverrides": cdk.booleanToCloudFormation(properties.allowPublicOverrides),
    "GetObject": cdk.stringToCloudFormation(properties.objectAccess)
  };
}

// @ts-ignore TS6133
function CfnBucketAccessRulesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucket.AccessRulesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucket.AccessRulesProperty>();
  ret.addPropertyResult("allowPublicOverrides", "AllowPublicOverrides", (properties.AllowPublicOverrides != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowPublicOverrides) : undefined));
  ret.addPropertyResult("objectAccess", "GetObject", (properties.GetObject != null ? cfn_parse.FromCloudFormation.getString(properties.GetObject) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnBucketProps`
 *
 * @param properties - the TypeScript properties of a `CfnBucketProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnBucketPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessRules", CfnBucketAccessRulesPropertyValidator)(properties.accessRules));
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bundleId", cdk.requiredValidator)(properties.bundleId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("objectVersioning", cdk.validateBoolean)(properties.objectVersioning));
  errors.collect(cdk.propertyValidator("readOnlyAccessAccounts", cdk.listValidator(cdk.validateString))(properties.readOnlyAccessAccounts));
  errors.collect(cdk.propertyValidator("resourcesReceivingAccess", cdk.listValidator(cdk.validateString))(properties.resourcesReceivingAccess));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnBucketProps\"");
}

// @ts-ignore TS6133
function convertCfnBucketPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnBucketPropsValidator(properties).assertSuccess();
  return {
    "AccessRules": convertCfnBucketAccessRulesPropertyToCloudFormation(properties.accessRules),
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "ObjectVersioning": cdk.booleanToCloudFormation(properties.objectVersioning),
    "ReadOnlyAccessAccounts": cdk.listMapper(cdk.stringToCloudFormation)(properties.readOnlyAccessAccounts),
    "ResourcesReceivingAccess": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourcesReceivingAccess),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnBucketPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnBucketProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnBucketProps>();
  ret.addPropertyResult("accessRules", "AccessRules", (properties.AccessRules != null ? CfnBucketAccessRulesPropertyFromCloudFormation(properties.AccessRules) : undefined));
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("objectVersioning", "ObjectVersioning", (properties.ObjectVersioning != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ObjectVersioning) : undefined));
  ret.addPropertyResult("readOnlyAccessAccounts", "ReadOnlyAccessAccounts", (properties.ReadOnlyAccessAccounts != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ReadOnlyAccessAccounts) : undefined));
  ret.addPropertyResult("resourcesReceivingAccess", "ResourcesReceivingAccess", (properties.ResourcesReceivingAccess != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourcesReceivingAccess) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Certificate` resource specifies an SSL/TLS certificate that you can use with a content delivery network (CDN) distribution and a container service.
 *
 * > For information about certificates that you can use with a load balancer, see [AWS::Lightsail::LoadBalancerTlsCertificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html) .
 *
 * @cloudformationResource AWS::Lightsail::Certificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html
 */
export class CfnCertificate extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Certificate";

  /**
   * Build a CfnCertificate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCertificate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCertificatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the certificate.
   *
   * @cloudformationAttribute CertificateArn
   */
  public readonly attrCertificateArn: string;

  /**
   * The validation status of the certificate.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The name of the certificate.
   */
  public certificateName: string;

  /**
   * The domain name of the certificate.
   */
  public domainName: string;

  /**
   * An array of strings that specify the alternate domains (such as `example.org` ) and subdomains (such as `blog.example.com` ) of the certificate.
   */
  public subjectAlternativeNames?: Array<string>;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnCertificateProps) {
    super(scope, id, {
      "type": CfnCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificateName", this);
    cdk.requireProperty(props, "domainName", this);

    this.attrCertificateArn = cdk.Token.asString(this.getAtt("CertificateArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.certificateName = props.certificateName;
    this.domainName = props.domainName;
    this.subjectAlternativeNames = props.subjectAlternativeNames;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Certificate", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateName": this.certificateName,
      "domainName": this.domainName,
      "subjectAlternativeNames": this.subjectAlternativeNames,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCertificatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html
 */
export interface CfnCertificateProps {
  /**
   * The name of the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-certificatename
   */
  readonly certificateName: string;

  /**
   * The domain name of the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-domainname
   */
  readonly domainName: string;

  /**
   * An array of strings that specify the alternate domains (such as `example.org` ) and subdomains (such as `blog.example.com` ) of the certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-subjectalternativenames
   */
  readonly subjectAlternativeNames?: Array<string>;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html#cfn-lightsail-certificate-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateName", cdk.requiredValidator)(properties.certificateName));
  errors.collect(cdk.propertyValidator("certificateName", cdk.validateString)(properties.certificateName));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("subjectAlternativeNames", cdk.listValidator(cdk.validateString))(properties.subjectAlternativeNames));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCertificatePropsValidator(properties).assertSuccess();
  return {
    "CertificateName": cdk.stringToCloudFormation(properties.certificateName),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "SubjectAlternativeNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.subjectAlternativeNames),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCertificateProps>();
  ret.addPropertyResult("certificateName", "CertificateName", (properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("subjectAlternativeNames", "SubjectAlternativeNames", (properties.SubjectAlternativeNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubjectAlternativeNames) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Container` resource specifies a container service.
 *
 * A Lightsail container service is a compute resource to which you can deploy containers.
 *
 * @cloudformationResource AWS::Lightsail::Container
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html
 */
export class CfnContainer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Container";

  /**
   * Build a CfnContainer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContainer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContainerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContainer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the container.
   *
   * @cloudformationAttribute ContainerArn
   */
  public readonly attrContainerArn: string;

  /**
   * The principle Amazon Resource Name (ARN) of the role.
   *
   * @cloudformationAttribute PrincipalArn
   */
  public readonly attrPrincipalArn: string;

  /**
   * The Amazon Resource Name (ARN) of the role, if it is activated.
   *
   * @cloudformationAttribute PrivateRegistryAccess.EcrImagePullerRole.PrincipalArn
   */
  public readonly attrPrivateRegistryAccessEcrImagePullerRolePrincipalArn: string;

  /**
   * The publicly accessible URL of the container service.
   *
   * If no public endpoint is specified in the current deployment, this URL returns a 404 response.
   *
   * @cloudformationAttribute Url
   */
  public readonly attrUrl: string;

  /**
   * An object that describes the current container deployment of the container service.
   */
  public containerServiceDeployment?: CfnContainer.ContainerServiceDeploymentProperty | cdk.IResolvable;

  /**
   * A Boolean value indicating whether the container service is disabled.
   */
  public isDisabled?: boolean | cdk.IResolvable;

  /**
   * The power specification of the container service.
   */
  public power: string;

  /**
   * An object that describes the configuration for the container service to access private container image repositories, such as Amazon Elastic Container Registry ( Amazon ECR ) private repositories.
   */
  public privateRegistryAccess?: cdk.IResolvable | CfnContainer.PrivateRegistryAccessProperty;

  /**
   * The public domain name of the container service, such as `example.com` and `www.example.com` .
   */
  public publicDomainNames?: Array<cdk.IResolvable | CfnContainer.PublicDomainNameProperty> | cdk.IResolvable;

  /**
   * The scale specification of the container service.
   */
  public scale: number;

  /**
   * The name of the container service.
   */
  public serviceName: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnContainerProps) {
    super(scope, id, {
      "type": CfnContainer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "power", this);
    cdk.requireProperty(props, "scale", this);
    cdk.requireProperty(props, "serviceName", this);

    this.attrContainerArn = cdk.Token.asString(this.getAtt("ContainerArn", cdk.ResolutionTypeHint.STRING));
    this.attrPrincipalArn = cdk.Token.asString(this.getAtt("PrincipalArn", cdk.ResolutionTypeHint.STRING));
    this.attrPrivateRegistryAccessEcrImagePullerRolePrincipalArn = cdk.Token.asString(this.getAtt("PrivateRegistryAccess.EcrImagePullerRole.PrincipalArn", cdk.ResolutionTypeHint.STRING));
    this.attrUrl = cdk.Token.asString(this.getAtt("Url", cdk.ResolutionTypeHint.STRING));
    this.containerServiceDeployment = props.containerServiceDeployment;
    this.isDisabled = props.isDisabled;
    this.power = props.power;
    this.privateRegistryAccess = props.privateRegistryAccess;
    this.publicDomainNames = props.publicDomainNames;
    this.scale = props.scale;
    this.serviceName = props.serviceName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Container", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "containerServiceDeployment": this.containerServiceDeployment,
      "isDisabled": this.isDisabled,
      "power": this.power,
      "privateRegistryAccess": this.privateRegistryAccess,
      "publicDomainNames": this.publicDomainNames,
      "scale": this.scale,
      "serviceName": this.serviceName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContainer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContainerPropsToCloudFormation(props);
  }
}

export namespace CfnContainer {
  /**
   * `PublicDomainName` is a property of the [AWS::Lightsail::Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html) resource. It describes the public domain names to use with a container service, such as `example.com` and `www.example.com` . It also describes the certificates to use with a container service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicdomainname.html
   */
  export interface PublicDomainNameProperty {
    /**
     * The name of the certificate for the public domains.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicdomainname.html#cfn-lightsail-container-publicdomainname-certificatename
     */
    readonly certificateName?: string;

    /**
     * The public domain names to use with the container service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicdomainname.html#cfn-lightsail-container-publicdomainname-domainnames
     */
    readonly domainNames?: Array<string>;
  }

  /**
   * Describes the configuration for an Amazon Lightsail container service to access private container image repositories, such as Amazon Elastic Container Registry ( Amazon ECR ) private repositories.
   *
   * For more information, see [Configuring access to an Amazon ECR private repository for an Amazon Lightsail container service](https://docs.aws.amazon.com/latest/userguide/amazon-lightsail-container-service-ecr-private-repo-access) in the *Amazon Lightsail Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-privateregistryaccess.html
   */
  export interface PrivateRegistryAccessProperty {
    /**
     * An object that describes the activation status of the role that you can use to grant a Lightsail container service access to Amazon ECR private repositories.
     *
     * If the role is activated, the Amazon Resource Name (ARN) of the role is also listed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-privateregistryaccess.html#cfn-lightsail-container-privateregistryaccess-ecrimagepullerrole
     */
    readonly ecrImagePullerRole?: CfnContainer.EcrImagePullerRoleProperty | cdk.IResolvable;
  }

  /**
   * Describes the IAM role that you can use to grant a Lightsail container service access to Amazon ECR private repositories.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-ecrimagepullerrole.html
   */
  export interface EcrImagePullerRoleProperty {
    /**
     * A boolean value that indicates whether the `ECRImagePullerRole` is active.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-ecrimagepullerrole.html#cfn-lightsail-container-ecrimagepullerrole-isactive
     */
    readonly isActive?: boolean | cdk.IResolvable;

    /**
     * The principle Amazon Resource Name (ARN) of the role.
     *
     * This property is read-only.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-ecrimagepullerrole.html#cfn-lightsail-container-ecrimagepullerrole-principalarn
     */
    readonly principalArn?: string;
  }

  /**
   * `ContainerServiceDeployment` is a property of the [AWS::Lightsail::Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html) resource. It describes a container deployment configuration of a container service.
   *
   * A deployment specifies the settings, such as the ports and launch command, of containers that are deployed to your container service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html
   */
  export interface ContainerServiceDeploymentProperty {
    /**
     * An object that describes the configuration for the containers of the deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html#cfn-lightsail-container-containerservicedeployment-containers
     */
    readonly containers?: Array<CfnContainer.ContainerProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * An object that describes the endpoint of the deployment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html#cfn-lightsail-container-containerservicedeployment-publicendpoint
     */
    readonly publicEndpoint?: cdk.IResolvable | CfnContainer.PublicEndpointProperty;
  }

  /**
   * `Container` is a property of the [ContainerServiceDeployment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html) property. It describes the settings of a container that will be launched, or that is launched, to an Amazon Lightsail container service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html
   */
  export interface ContainerProperty {
    /**
     * The launch command for the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-command
     */
    readonly command?: Array<string>;

    /**
     * The name of the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-containername
     */
    readonly containerName?: string;

    /**
     * The environment variables of the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-environment
     */
    readonly environment?: Array<CfnContainer.EnvironmentVariableProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The name of the image used for the container.
     *
     * Container images that are sourced from (registered and stored on) your container service start with a colon ( `:` ). For example, if your container service name is `container-service-1` , the container image label is `mystaticsite` , and you want to use the third version ( `3` ) of the registered container image, then you should specify `:container-service-1.mystaticsite.3` . To use the latest version of a container image, specify `latest` instead of a version number (for example, `:container-service-1.mystaticsite.latest` ). Your container service will automatically use the highest numbered version of the registered container image.
     *
     * Container images that are sourced from a public registry like Docker Hub don’t start with a colon. For example, `nginx:latest` or `nginx` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-image
     */
    readonly image?: string;

    /**
     * An object that describes the open firewall ports and protocols of the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html#cfn-lightsail-container-container-ports
     */
    readonly ports?: Array<cdk.IResolvable | CfnContainer.PortInfoProperty> | cdk.IResolvable;
  }

  /**
   * `EnvironmentVariable` is a property of the [Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html) property. It describes the environment variables of a container on a container service which are key-value parameters that provide dynamic configuration of the application or script run by the container.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-environmentvariable.html
   */
  export interface EnvironmentVariableProperty {
    /**
     * The environment variable value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-environmentvariable.html#cfn-lightsail-container-environmentvariable-value
     */
    readonly value?: string;

    /**
     * The environment variable key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-environmentvariable.html#cfn-lightsail-container-environmentvariable-variable
     */
    readonly variable?: string;
  }

  /**
   * `PortInfo` is a property of the [Container](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-container.html) property. It describes the ports to open and the protocols to use for a container on a Amazon Lightsail container service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-portinfo.html
   */
  export interface PortInfoProperty {
    /**
     * The open firewall ports of the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-portinfo.html#cfn-lightsail-container-portinfo-port
     */
    readonly port?: string;

    /**
     * The protocol name for the open ports.
     *
     * *Allowed values* : `HTTP` | `HTTPS` | `TCP` | `UDP`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-portinfo.html#cfn-lightsail-container-portinfo-protocol
     */
    readonly protocol?: string;
  }

  /**
   * `PublicEndpoint` is a property of the [ContainerServiceDeployment](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-containerservicedeployment.html) property. It describes describes the settings of the public endpoint of a container on a container service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html
   */
  export interface PublicEndpointProperty {
    /**
     * The name of the container entry of the deployment that the endpoint configuration applies to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html#cfn-lightsail-container-publicendpoint-containername
     */
    readonly containerName?: string;

    /**
     * The port of the specified container to which traffic is forwarded to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html#cfn-lightsail-container-publicendpoint-containerport
     */
    readonly containerPort?: number;

    /**
     * An object that describes the health check configuration of the container.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html#cfn-lightsail-container-publicendpoint-healthcheckconfig
     */
    readonly healthCheckConfig?: CfnContainer.HealthCheckConfigProperty | cdk.IResolvable;
  }

  /**
   * `HealthCheckConfig` is a property of the [PublicEndpoint](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-publicendpoint.html) property. It describes the healthcheck configuration of a container deployment on a container service.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html
   */
  export interface HealthCheckConfigProperty {
    /**
     * The number of consecutive health check successes required before moving the container to the `Healthy` state.
     *
     * The default value is `2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-healthythreshold
     */
    readonly healthyThreshold?: number;

    /**
     * The approximate interval, in seconds, between health checks of an individual container.
     *
     * You can specify between `5` and `300` seconds. The default value is `5` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-intervalseconds
     */
    readonly intervalSeconds?: number;

    /**
     * The path on the container on which to perform the health check.
     *
     * The default value is `/` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-path
     */
    readonly path?: string;

    /**
     * The HTTP codes to use when checking for a successful response from a container.
     *
     * You can specify values between `200` and `499` . You can specify multiple values (for example, `200,202` ) or a range of values (for example, `200-299` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-successcodes
     */
    readonly successCodes?: string;

    /**
     * The amount of time, in seconds, during which no response means a failed health check.
     *
     * You can specify between `2` and `60` seconds. The default value is `2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-timeoutseconds
     */
    readonly timeoutSeconds?: number;

    /**
     * The number of consecutive health check failures required before moving the container to the `Unhealthy` state.
     *
     * The default value is `2` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-container-healthcheckconfig.html#cfn-lightsail-container-healthcheckconfig-unhealthythreshold
     */
    readonly unhealthyThreshold?: number;
  }
}

/**
 * Properties for defining a `CfnContainer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html
 */
export interface CfnContainerProps {
  /**
   * An object that describes the current container deployment of the container service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-containerservicedeployment
   */
  readonly containerServiceDeployment?: CfnContainer.ContainerServiceDeploymentProperty | cdk.IResolvable;

  /**
   * A Boolean value indicating whether the container service is disabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-isdisabled
   */
  readonly isDisabled?: boolean | cdk.IResolvable;

  /**
   * The power specification of the container service.
   *
   * The power specifies the amount of RAM, the number of vCPUs, and the base price of the container service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-power
   */
  readonly power: string;

  /**
   * An object that describes the configuration for the container service to access private container image repositories, such as Amazon Elastic Container Registry ( Amazon ECR ) private repositories.
   *
   * For more information, see [Configuring access to an Amazon ECR private repository for an Amazon Lightsail container service](https://docs.aws.amazon.com/latest/userguide/amazon-lightsail-container-service-ecr-private-repo-access) in the *Amazon Lightsail Developer Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-privateregistryaccess
   */
  readonly privateRegistryAccess?: cdk.IResolvable | CfnContainer.PrivateRegistryAccessProperty;

  /**
   * The public domain name of the container service, such as `example.com` and `www.example.com` .
   *
   * You can specify up to four public domain names for a container service. The domain names that you specify are used when you create a deployment with a container that is configured as the public endpoint of your container service.
   *
   * If you don't specify public domain names, then you can use the default domain of the container service.
   *
   * > You must create and validate an SSL/TLS certificate before you can use public domain names with your container service. Use the [AWS::Lightsail::Certificate](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-certificate.html) resource to create a certificate for the public domain names that you want to use with your container service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-publicdomainnames
   */
  readonly publicDomainNames?: Array<cdk.IResolvable | CfnContainer.PublicDomainNameProperty> | cdk.IResolvable;

  /**
   * The scale specification of the container service.
   *
   * The scale specifies the allocated compute nodes of the container service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-scale
   */
  readonly scale: number;

  /**
   * The name of the container service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-servicename
   */
  readonly serviceName: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-container.html#cfn-lightsail-container-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `PublicDomainNameProperty`
 *
 * @param properties - the TypeScript properties of a `PublicDomainNameProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerPublicDomainNamePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateName", cdk.validateString)(properties.certificateName));
  errors.collect(cdk.propertyValidator("domainNames", cdk.listValidator(cdk.validateString))(properties.domainNames));
  return errors.wrap("supplied properties not correct for \"PublicDomainNameProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerPublicDomainNamePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerPublicDomainNamePropertyValidator(properties).assertSuccess();
  return {
    "CertificateName": cdk.stringToCloudFormation(properties.certificateName),
    "DomainNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.domainNames)
  };
}

// @ts-ignore TS6133
function CfnContainerPublicDomainNamePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainer.PublicDomainNameProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PublicDomainNameProperty>();
  ret.addPropertyResult("certificateName", "CertificateName", (properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined));
  ret.addPropertyResult("domainNames", "DomainNames", (properties.DomainNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DomainNames) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EcrImagePullerRoleProperty`
 *
 * @param properties - the TypeScript properties of a `EcrImagePullerRoleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerEcrImagePullerRolePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("isActive", cdk.validateBoolean)(properties.isActive));
  errors.collect(cdk.propertyValidator("principalArn", cdk.validateString)(properties.principalArn));
  return errors.wrap("supplied properties not correct for \"EcrImagePullerRoleProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerEcrImagePullerRolePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerEcrImagePullerRolePropertyValidator(properties).assertSuccess();
  return {
    "IsActive": cdk.booleanToCloudFormation(properties.isActive),
    "PrincipalArn": cdk.stringToCloudFormation(properties.principalArn)
  };
}

// @ts-ignore TS6133
function CfnContainerEcrImagePullerRolePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.EcrImagePullerRoleProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.EcrImagePullerRoleProperty>();
  ret.addPropertyResult("isActive", "IsActive", (properties.IsActive != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsActive) : undefined));
  ret.addPropertyResult("principalArn", "PrincipalArn", (properties.PrincipalArn != null ? cfn_parse.FromCloudFormation.getString(properties.PrincipalArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PrivateRegistryAccessProperty`
 *
 * @param properties - the TypeScript properties of a `PrivateRegistryAccessProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerPrivateRegistryAccessPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ecrImagePullerRole", CfnContainerEcrImagePullerRolePropertyValidator)(properties.ecrImagePullerRole));
  return errors.wrap("supplied properties not correct for \"PrivateRegistryAccessProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerPrivateRegistryAccessPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerPrivateRegistryAccessPropertyValidator(properties).assertSuccess();
  return {
    "EcrImagePullerRole": convertCfnContainerEcrImagePullerRolePropertyToCloudFormation(properties.ecrImagePullerRole)
  };
}

// @ts-ignore TS6133
function CfnContainerPrivateRegistryAccessPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainer.PrivateRegistryAccessProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PrivateRegistryAccessProperty>();
  ret.addPropertyResult("ecrImagePullerRole", "EcrImagePullerRole", (properties.EcrImagePullerRole != null ? CfnContainerEcrImagePullerRolePropertyFromCloudFormation(properties.EcrImagePullerRole) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EnvironmentVariableProperty`
 *
 * @param properties - the TypeScript properties of a `EnvironmentVariableProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerEnvironmentVariablePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  errors.collect(cdk.propertyValidator("variable", cdk.validateString)(properties.variable));
  return errors.wrap("supplied properties not correct for \"EnvironmentVariableProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerEnvironmentVariablePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerEnvironmentVariablePropertyValidator(properties).assertSuccess();
  return {
    "Value": cdk.stringToCloudFormation(properties.value),
    "Variable": cdk.stringToCloudFormation(properties.variable)
  };
}

// @ts-ignore TS6133
function CfnContainerEnvironmentVariablePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.EnvironmentVariableProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.EnvironmentVariableProperty>();
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addPropertyResult("variable", "Variable", (properties.Variable != null ? cfn_parse.FromCloudFormation.getString(properties.Variable) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PortInfoProperty`
 *
 * @param properties - the TypeScript properties of a `PortInfoProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerPortInfoPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("port", cdk.validateString)(properties.port));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  return errors.wrap("supplied properties not correct for \"PortInfoProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerPortInfoPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerPortInfoPropertyValidator(properties).assertSuccess();
  return {
    "Port": cdk.stringToCloudFormation(properties.port),
    "Protocol": cdk.stringToCloudFormation(properties.protocol)
  };
}

// @ts-ignore TS6133
function CfnContainerPortInfoPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainer.PortInfoProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PortInfoProperty>();
  ret.addPropertyResult("port", "Port", (properties.Port != null ? cfn_parse.FromCloudFormation.getString(properties.Port) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerContainerPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("environment", cdk.listValidator(CfnContainerEnvironmentVariablePropertyValidator))(properties.environment));
  errors.collect(cdk.propertyValidator("image", cdk.validateString)(properties.image));
  errors.collect(cdk.propertyValidator("ports", cdk.listValidator(CfnContainerPortInfoPropertyValidator))(properties.ports));
  return errors.wrap("supplied properties not correct for \"ContainerProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerContainerPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerContainerPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "Environment": cdk.listMapper(convertCfnContainerEnvironmentVariablePropertyToCloudFormation)(properties.environment),
    "Image": cdk.stringToCloudFormation(properties.image),
    "Ports": cdk.listMapper(convertCfnContainerPortInfoPropertyToCloudFormation)(properties.ports)
  };
}

// @ts-ignore TS6133
function CfnContainerContainerPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.ContainerProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.ContainerProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerEnvironmentVariablePropertyFromCloudFormation)(properties.Environment) : undefined));
  ret.addPropertyResult("image", "Image", (properties.Image != null ? cfn_parse.FromCloudFormation.getString(properties.Image) : undefined));
  ret.addPropertyResult("ports", "Ports", (properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerPortInfoPropertyFromCloudFormation)(properties.Ports) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HealthCheckConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HealthCheckConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerHealthCheckConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthyThreshold", cdk.validateNumber)(properties.healthyThreshold));
  errors.collect(cdk.propertyValidator("intervalSeconds", cdk.validateNumber)(properties.intervalSeconds));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("successCodes", cdk.validateString)(properties.successCodes));
  errors.collect(cdk.propertyValidator("timeoutSeconds", cdk.validateNumber)(properties.timeoutSeconds));
  errors.collect(cdk.propertyValidator("unhealthyThreshold", cdk.validateNumber)(properties.unhealthyThreshold));
  return errors.wrap("supplied properties not correct for \"HealthCheckConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerHealthCheckConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerHealthCheckConfigPropertyValidator(properties).assertSuccess();
  return {
    "HealthyThreshold": cdk.numberToCloudFormation(properties.healthyThreshold),
    "IntervalSeconds": cdk.numberToCloudFormation(properties.intervalSeconds),
    "Path": cdk.stringToCloudFormation(properties.path),
    "SuccessCodes": cdk.stringToCloudFormation(properties.successCodes),
    "TimeoutSeconds": cdk.numberToCloudFormation(properties.timeoutSeconds),
    "UnhealthyThreshold": cdk.numberToCloudFormation(properties.unhealthyThreshold)
  };
}

// @ts-ignore TS6133
function CfnContainerHealthCheckConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.HealthCheckConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.HealthCheckConfigProperty>();
  ret.addPropertyResult("healthyThreshold", "HealthyThreshold", (properties.HealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthyThreshold) : undefined));
  ret.addPropertyResult("intervalSeconds", "IntervalSeconds", (properties.IntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.IntervalSeconds) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("successCodes", "SuccessCodes", (properties.SuccessCodes != null ? cfn_parse.FromCloudFormation.getString(properties.SuccessCodes) : undefined));
  ret.addPropertyResult("timeoutSeconds", "TimeoutSeconds", (properties.TimeoutSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutSeconds) : undefined));
  ret.addPropertyResult("unhealthyThreshold", "UnhealthyThreshold", (properties.UnhealthyThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.UnhealthyThreshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PublicEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `PublicEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerPublicEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerName", cdk.validateString)(properties.containerName));
  errors.collect(cdk.propertyValidator("containerPort", cdk.validateNumber)(properties.containerPort));
  errors.collect(cdk.propertyValidator("healthCheckConfig", CfnContainerHealthCheckConfigPropertyValidator)(properties.healthCheckConfig));
  return errors.wrap("supplied properties not correct for \"PublicEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerPublicEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerPublicEndpointPropertyValidator(properties).assertSuccess();
  return {
    "ContainerName": cdk.stringToCloudFormation(properties.containerName),
    "ContainerPort": cdk.numberToCloudFormation(properties.containerPort),
    "HealthCheckConfig": convertCfnContainerHealthCheckConfigPropertyToCloudFormation(properties.healthCheckConfig)
  };
}

// @ts-ignore TS6133
function CfnContainerPublicEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContainer.PublicEndpointProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.PublicEndpointProperty>();
  ret.addPropertyResult("containerName", "ContainerName", (properties.ContainerName != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerName) : undefined));
  ret.addPropertyResult("containerPort", "ContainerPort", (properties.ContainerPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ContainerPort) : undefined));
  ret.addPropertyResult("healthCheckConfig", "HealthCheckConfig", (properties.HealthCheckConfig != null ? CfnContainerHealthCheckConfigPropertyFromCloudFormation(properties.HealthCheckConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ContainerServiceDeploymentProperty`
 *
 * @param properties - the TypeScript properties of a `ContainerServiceDeploymentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerContainerServiceDeploymentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containers", cdk.listValidator(CfnContainerContainerPropertyValidator))(properties.containers));
  errors.collect(cdk.propertyValidator("publicEndpoint", CfnContainerPublicEndpointPropertyValidator)(properties.publicEndpoint));
  return errors.wrap("supplied properties not correct for \"ContainerServiceDeploymentProperty\"");
}

// @ts-ignore TS6133
function convertCfnContainerContainerServiceDeploymentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerContainerServiceDeploymentPropertyValidator(properties).assertSuccess();
  return {
    "Containers": cdk.listMapper(convertCfnContainerContainerPropertyToCloudFormation)(properties.containers),
    "PublicEndpoint": convertCfnContainerPublicEndpointPropertyToCloudFormation(properties.publicEndpoint)
  };
}

// @ts-ignore TS6133
function CfnContainerContainerServiceDeploymentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainer.ContainerServiceDeploymentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainer.ContainerServiceDeploymentProperty>();
  ret.addPropertyResult("containers", "Containers", (properties.Containers != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerContainerPropertyFromCloudFormation)(properties.Containers) : undefined));
  ret.addPropertyResult("publicEndpoint", "PublicEndpoint", (properties.PublicEndpoint != null ? CfnContainerPublicEndpointPropertyFromCloudFormation(properties.PublicEndpoint) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnContainerProps`
 *
 * @param properties - the TypeScript properties of a `CfnContainerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContainerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("containerServiceDeployment", CfnContainerContainerServiceDeploymentPropertyValidator)(properties.containerServiceDeployment));
  errors.collect(cdk.propertyValidator("isDisabled", cdk.validateBoolean)(properties.isDisabled));
  errors.collect(cdk.propertyValidator("power", cdk.requiredValidator)(properties.power));
  errors.collect(cdk.propertyValidator("power", cdk.validateString)(properties.power));
  errors.collect(cdk.propertyValidator("privateRegistryAccess", CfnContainerPrivateRegistryAccessPropertyValidator)(properties.privateRegistryAccess));
  errors.collect(cdk.propertyValidator("publicDomainNames", cdk.listValidator(CfnContainerPublicDomainNamePropertyValidator))(properties.publicDomainNames));
  errors.collect(cdk.propertyValidator("scale", cdk.requiredValidator)(properties.scale));
  errors.collect(cdk.propertyValidator("scale", cdk.validateNumber)(properties.scale));
  errors.collect(cdk.propertyValidator("serviceName", cdk.requiredValidator)(properties.serviceName));
  errors.collect(cdk.propertyValidator("serviceName", cdk.validateString)(properties.serviceName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnContainerProps\"");
}

// @ts-ignore TS6133
function convertCfnContainerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContainerPropsValidator(properties).assertSuccess();
  return {
    "ContainerServiceDeployment": convertCfnContainerContainerServiceDeploymentPropertyToCloudFormation(properties.containerServiceDeployment),
    "IsDisabled": cdk.booleanToCloudFormation(properties.isDisabled),
    "Power": cdk.stringToCloudFormation(properties.power),
    "PrivateRegistryAccess": convertCfnContainerPrivateRegistryAccessPropertyToCloudFormation(properties.privateRegistryAccess),
    "PublicDomainNames": cdk.listMapper(convertCfnContainerPublicDomainNamePropertyToCloudFormation)(properties.publicDomainNames),
    "Scale": cdk.numberToCloudFormation(properties.scale),
    "ServiceName": cdk.stringToCloudFormation(properties.serviceName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnContainerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContainerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContainerProps>();
  ret.addPropertyResult("containerServiceDeployment", "ContainerServiceDeployment", (properties.ContainerServiceDeployment != null ? CfnContainerContainerServiceDeploymentPropertyFromCloudFormation(properties.ContainerServiceDeployment) : undefined));
  ret.addPropertyResult("isDisabled", "IsDisabled", (properties.IsDisabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsDisabled) : undefined));
  ret.addPropertyResult("power", "Power", (properties.Power != null ? cfn_parse.FromCloudFormation.getString(properties.Power) : undefined));
  ret.addPropertyResult("privateRegistryAccess", "PrivateRegistryAccess", (properties.PrivateRegistryAccess != null ? CfnContainerPrivateRegistryAccessPropertyFromCloudFormation(properties.PrivateRegistryAccess) : undefined));
  ret.addPropertyResult("publicDomainNames", "PublicDomainNames", (properties.PublicDomainNames != null ? cfn_parse.FromCloudFormation.getArray(CfnContainerPublicDomainNamePropertyFromCloudFormation)(properties.PublicDomainNames) : undefined));
  ret.addPropertyResult("scale", "Scale", (properties.Scale != null ? cfn_parse.FromCloudFormation.getNumber(properties.Scale) : undefined));
  ret.addPropertyResult("serviceName", "ServiceName", (properties.ServiceName != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Database` resource specifies an Amazon Lightsail database.
 *
 * @cloudformationResource AWS::Lightsail::Database
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html
 */
export class CfnDatabase extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Database";

  /**
   * Build a CfnDatabase from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDatabase {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDatabasePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDatabase(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the database (for example, `arn:aws:lightsail:us-east-2:123456789101:RelationalDatabase/244ad76f-8aad-4741-809f-12345EXAMPLE` ).
   *
   * @cloudformationAttribute DatabaseArn
   */
  public readonly attrDatabaseArn: string;

  /**
   * The Availability Zone for the database.
   */
  public availabilityZone?: string;

  /**
   * A Boolean value indicating whether automated backup retention is enabled for the database.
   */
  public backupRetention?: boolean | cdk.IResolvable;

  /**
   * The certificate associated with the database.
   */
  public caCertificateIdentifier?: string;

  /**
   * The meaning of this parameter differs according to the database engine you use.
   */
  public masterDatabaseName: string;

  /**
   * The name for the primary user.
   */
  public masterUsername: string;

  /**
   * The password for the primary user of the database.
   */
  public masterUserPassword?: string;

  /**
   * The daily time range during which automated backups are created for the database (for example, `16:00-16:30` ).
   */
  public preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur for the database, formatted as follows: `ddd:hh24:mi-ddd:hh24:mi` .
   */
  public preferredMaintenanceWindow?: string;

  /**
   * A Boolean value indicating whether the database is accessible to anyone on the internet.
   */
  public publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The blueprint ID for the database (for example, `mysql_8_0` ).
   */
  public relationalDatabaseBlueprintId: string;

  /**
   * The bundle ID for the database (for example, `medium_1_0` ).
   */
  public relationalDatabaseBundleId: string;

  /**
   * The name of the instance.
   */
  public relationalDatabaseName: string;

  /**
   * An array of parameters for the database.
   */
  public relationalDatabaseParameters?: Array<cdk.IResolvable | CfnDatabase.RelationalDatabaseParameterProperty> | cdk.IResolvable;

  /**
   * A Boolean value indicating whether to change the primary user password to a new, strong password generated by Lightsail .
   */
  public rotateMasterUserPassword?: boolean | cdk.IResolvable;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnDatabaseProps) {
    super(scope, id, {
      "type": CfnDatabase.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "masterDatabaseName", this);
    cdk.requireProperty(props, "masterUsername", this);
    cdk.requireProperty(props, "relationalDatabaseBlueprintId", this);
    cdk.requireProperty(props, "relationalDatabaseBundleId", this);
    cdk.requireProperty(props, "relationalDatabaseName", this);

    this.attrDatabaseArn = cdk.Token.asString(this.getAtt("DatabaseArn", cdk.ResolutionTypeHint.STRING));
    this.availabilityZone = props.availabilityZone;
    this.backupRetention = props.backupRetention;
    this.caCertificateIdentifier = props.caCertificateIdentifier;
    this.masterDatabaseName = props.masterDatabaseName;
    this.masterUsername = props.masterUsername;
    this.masterUserPassword = props.masterUserPassword;
    this.preferredBackupWindow = props.preferredBackupWindow;
    this.preferredMaintenanceWindow = props.preferredMaintenanceWindow;
    this.publiclyAccessible = props.publiclyAccessible;
    this.relationalDatabaseBlueprintId = props.relationalDatabaseBlueprintId;
    this.relationalDatabaseBundleId = props.relationalDatabaseBundleId;
    this.relationalDatabaseName = props.relationalDatabaseName;
    this.relationalDatabaseParameters = props.relationalDatabaseParameters;
    this.rotateMasterUserPassword = props.rotateMasterUserPassword;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Database", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "availabilityZone": this.availabilityZone,
      "backupRetention": this.backupRetention,
      "caCertificateIdentifier": this.caCertificateIdentifier,
      "masterDatabaseName": this.masterDatabaseName,
      "masterUsername": this.masterUsername,
      "masterUserPassword": this.masterUserPassword,
      "preferredBackupWindow": this.preferredBackupWindow,
      "preferredMaintenanceWindow": this.preferredMaintenanceWindow,
      "publiclyAccessible": this.publiclyAccessible,
      "relationalDatabaseBlueprintId": this.relationalDatabaseBlueprintId,
      "relationalDatabaseBundleId": this.relationalDatabaseBundleId,
      "relationalDatabaseName": this.relationalDatabaseName,
      "relationalDatabaseParameters": this.relationalDatabaseParameters,
      "rotateMasterUserPassword": this.rotateMasterUserPassword,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDatabase.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDatabasePropsToCloudFormation(props);
  }
}

export namespace CfnDatabase {
  /**
   * `RelationalDatabaseParameter` is a property of the [AWS::Lightsail::Database](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html) resource. It describes parameters for the database.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html
   */
  export interface RelationalDatabaseParameterProperty {
    /**
     * The valid range of values for the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-allowedvalues
     */
    readonly allowedValues?: string;

    /**
     * Indicates when parameter updates are applied.
     *
     * Can be `immediate` or `pending-reboot` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-applymethod
     */
    readonly applyMethod?: string;

    /**
     * Specifies the engine-specific parameter type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-applytype
     */
    readonly applyType?: string;

    /**
     * The valid data type of the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-datatype
     */
    readonly dataType?: string;

    /**
     * A description of the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-description
     */
    readonly description?: string;

    /**
     * A Boolean value indicating whether the parameter can be modified.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-ismodifiable
     */
    readonly isModifiable?: boolean | cdk.IResolvable;

    /**
     * The name of the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-parametername
     */
    readonly parameterName?: string;

    /**
     * The value for the parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-database-relationaldatabaseparameter.html#cfn-lightsail-database-relationaldatabaseparameter-parametervalue
     */
    readonly parameterValue?: string;
  }
}

/**
 * Properties for defining a `CfnDatabase`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html
 */
export interface CfnDatabaseProps {
  /**
   * The Availability Zone for the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * A Boolean value indicating whether automated backup retention is enabled for the database.
   *
   * Data Import Mode is enabled when `BackupRetention` is set to `false` , and is disabled when `BackupRetention` is set to `true` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-backupretention
   */
  readonly backupRetention?: boolean | cdk.IResolvable;

  /**
   * The certificate associated with the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-cacertificateidentifier
   */
  readonly caCertificateIdentifier?: string;

  /**
   * The meaning of this parameter differs according to the database engine you use.
   *
   * *MySQL*
   *
   * The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, no database is created in the database resource.
   *
   * Constraints:
   *
   * - Must contain 1-64 letters or numbers.
   * - Must begin with a letter. Subsequent characters can be letters, underscores, or numbers (0-9).
   * - Can't be a word reserved by the specified database engine.
   *
   * For more information about reserved words in MySQL, see the Keywords and Reserved Words articles for [MySQL 5.6](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.6/en/keywords.html) , [MySQL 5.7](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.7/en/keywords.html) , and [MySQL 8.0](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/8.0/en/keywords.html) .
   *
   * *PostgreSQL*
   *
   * The name of the database to create when the Lightsail database resource is created. If this parameter isn't specified, a database named `postgres` is created in the database resource.
   *
   * Constraints:
   *
   * - Must contain 1-63 letters or numbers.
   * - Must begin with a letter. Subsequent characters can be letters, underscores, or numbers (0-9).
   * - Can't be a word reserved by the specified database engine.
   *
   * For more information about reserved words in PostgreSQL, see the SQL Key Words articles for [PostgreSQL 9.6](https://docs.aws.amazon.com/https://www.postgresql.org/docs/9.6/sql-keywords-appendix.html) , [PostgreSQL 10](https://docs.aws.amazon.com/https://www.postgresql.org/docs/10/sql-keywords-appendix.html) , [PostgreSQL 11](https://docs.aws.amazon.com/https://www.postgresql.org/docs/11/sql-keywords-appendix.html) , and [PostgreSQL 12](https://docs.aws.amazon.com/https://www.postgresql.org/docs/12/sql-keywords-appendix.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masterdatabasename
   */
  readonly masterDatabaseName: string;

  /**
   * The name for the primary user.
   *
   * *MySQL*
   *
   * Constraints:
   *
   * - Required for MySQL.
   * - Must be 1-16 letters or numbers. Can contain underscores.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for [MySQL 5.6](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.6/en/keywords.html) , [MySQL 5.7](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/5.7/en/keywords.html) , or [MySQL 8.0](https://docs.aws.amazon.com/https://dev.mysql.com/doc/refman/8.0/en/keywords.html) .
   *
   * *PostgreSQL*
   *
   * Constraints:
   *
   * - Required for PostgreSQL.
   * - Must be 1-63 letters or numbers. Can contain underscores.
   * - First character must be a letter.
   * - Can't be a reserved word for the chosen database engine.
   *
   * For more information about reserved words in MySQL 5.6 or 5.7, see the Keywords and Reserved Words articles for [PostgreSQL 9.6](https://docs.aws.amazon.com/https://www.postgresql.org/docs/9.6/sql-keywords-appendix.html) , [PostgreSQL 10](https://docs.aws.amazon.com/https://www.postgresql.org/docs/10/sql-keywords-appendix.html) , [PostgreSQL 11](https://docs.aws.amazon.com/https://www.postgresql.org/docs/11/sql-keywords-appendix.html) , and [PostgreSQL 12](https://docs.aws.amazon.com/https://www.postgresql.org/docs/12/sql-keywords-appendix.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masterusername
   */
  readonly masterUsername: string;

  /**
   * The password for the primary user of the database.
   *
   * The password can include any printable ASCII character except the following: /, ", or @. It cannot contain spaces.
   *
   * > The `MasterUserPassword` and `RotateMasterUserPassword` parameters cannot be used together in the same template.
   *
   * *MySQL*
   *
   * Constraints: Must contain 8-41 characters.
   *
   * *PostgreSQL*
   *
   * Constraints: Must contain 8-128 characters.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-masteruserpassword
   */
  readonly masterUserPassword?: string;

  /**
   * The daily time range during which automated backups are created for the database (for example, `16:00-16:30` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-preferredbackupwindow
   */
  readonly preferredBackupWindow?: string;

  /**
   * The weekly time range during which system maintenance can occur for the database, formatted as follows: `ddd:hh24:mi-ddd:hh24:mi` .
   *
   * For example, `Tue:17:00-Tue:17:30` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-preferredmaintenancewindow
   */
  readonly preferredMaintenanceWindow?: string;

  /**
   * A Boolean value indicating whether the database is accessible to anyone on the internet.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-publiclyaccessible
   */
  readonly publiclyAccessible?: boolean | cdk.IResolvable;

  /**
   * The blueprint ID for the database (for example, `mysql_8_0` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabaseblueprintid
   */
  readonly relationalDatabaseBlueprintId: string;

  /**
   * The bundle ID for the database (for example, `medium_1_0` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabasebundleid
   */
  readonly relationalDatabaseBundleId: string;

  /**
   * The name of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabasename
   */
  readonly relationalDatabaseName: string;

  /**
   * An array of parameters for the database.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-relationaldatabaseparameters
   */
  readonly relationalDatabaseParameters?: Array<cdk.IResolvable | CfnDatabase.RelationalDatabaseParameterProperty> | cdk.IResolvable;

  /**
   * A Boolean value indicating whether to change the primary user password to a new, strong password generated by Lightsail .
   *
   * > The `RotateMasterUserPassword` and `MasterUserPassword` parameters cannot be used together in the same template.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-rotatemasteruserpassword
   */
  readonly rotateMasterUserPassword?: boolean | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-database.html#cfn-lightsail-database-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RelationalDatabaseParameterProperty`
 *
 * @param properties - the TypeScript properties of a `RelationalDatabaseParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabaseRelationalDatabaseParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedValues", cdk.validateString)(properties.allowedValues));
  errors.collect(cdk.propertyValidator("applyMethod", cdk.validateString)(properties.applyMethod));
  errors.collect(cdk.propertyValidator("applyType", cdk.validateString)(properties.applyType));
  errors.collect(cdk.propertyValidator("dataType", cdk.validateString)(properties.dataType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("isModifiable", cdk.validateBoolean)(properties.isModifiable));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterValue", cdk.validateString)(properties.parameterValue));
  return errors.wrap("supplied properties not correct for \"RelationalDatabaseParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnDatabaseRelationalDatabaseParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabaseRelationalDatabaseParameterPropertyValidator(properties).assertSuccess();
  return {
    "AllowedValues": cdk.stringToCloudFormation(properties.allowedValues),
    "ApplyMethod": cdk.stringToCloudFormation(properties.applyMethod),
    "ApplyType": cdk.stringToCloudFormation(properties.applyType),
    "DataType": cdk.stringToCloudFormation(properties.dataType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "IsModifiable": cdk.booleanToCloudFormation(properties.isModifiable),
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName),
    "ParameterValue": cdk.stringToCloudFormation(properties.parameterValue)
  };
}

// @ts-ignore TS6133
function CfnDatabaseRelationalDatabaseParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDatabase.RelationalDatabaseParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabase.RelationalDatabaseParameterProperty>();
  ret.addPropertyResult("allowedValues", "AllowedValues", (properties.AllowedValues != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedValues) : undefined));
  ret.addPropertyResult("applyMethod", "ApplyMethod", (properties.ApplyMethod != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyMethod) : undefined));
  ret.addPropertyResult("applyType", "ApplyType", (properties.ApplyType != null ? cfn_parse.FromCloudFormation.getString(properties.ApplyType) : undefined));
  ret.addPropertyResult("dataType", "DataType", (properties.DataType != null ? cfn_parse.FromCloudFormation.getString(properties.DataType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("isModifiable", "IsModifiable", (properties.IsModifiable != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsModifiable) : undefined));
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addPropertyResult("parameterValue", "ParameterValue", (properties.ParameterValue != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDatabaseProps`
 *
 * @param properties - the TypeScript properties of a `CfnDatabaseProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDatabasePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("backupRetention", cdk.validateBoolean)(properties.backupRetention));
  errors.collect(cdk.propertyValidator("caCertificateIdentifier", cdk.validateString)(properties.caCertificateIdentifier));
  errors.collect(cdk.propertyValidator("masterDatabaseName", cdk.requiredValidator)(properties.masterDatabaseName));
  errors.collect(cdk.propertyValidator("masterDatabaseName", cdk.validateString)(properties.masterDatabaseName));
  errors.collect(cdk.propertyValidator("masterUserPassword", cdk.validateString)(properties.masterUserPassword));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.requiredValidator)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("masterUsername", cdk.validateString)(properties.masterUsername));
  errors.collect(cdk.propertyValidator("preferredBackupWindow", cdk.validateString)(properties.preferredBackupWindow));
  errors.collect(cdk.propertyValidator("preferredMaintenanceWindow", cdk.validateString)(properties.preferredMaintenanceWindow));
  errors.collect(cdk.propertyValidator("publiclyAccessible", cdk.validateBoolean)(properties.publiclyAccessible));
  errors.collect(cdk.propertyValidator("relationalDatabaseBlueprintId", cdk.requiredValidator)(properties.relationalDatabaseBlueprintId));
  errors.collect(cdk.propertyValidator("relationalDatabaseBlueprintId", cdk.validateString)(properties.relationalDatabaseBlueprintId));
  errors.collect(cdk.propertyValidator("relationalDatabaseBundleId", cdk.requiredValidator)(properties.relationalDatabaseBundleId));
  errors.collect(cdk.propertyValidator("relationalDatabaseBundleId", cdk.validateString)(properties.relationalDatabaseBundleId));
  errors.collect(cdk.propertyValidator("relationalDatabaseName", cdk.requiredValidator)(properties.relationalDatabaseName));
  errors.collect(cdk.propertyValidator("relationalDatabaseName", cdk.validateString)(properties.relationalDatabaseName));
  errors.collect(cdk.propertyValidator("relationalDatabaseParameters", cdk.listValidator(CfnDatabaseRelationalDatabaseParameterPropertyValidator))(properties.relationalDatabaseParameters));
  errors.collect(cdk.propertyValidator("rotateMasterUserPassword", cdk.validateBoolean)(properties.rotateMasterUserPassword));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDatabaseProps\"");
}

// @ts-ignore TS6133
function convertCfnDatabasePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDatabasePropsValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "BackupRetention": cdk.booleanToCloudFormation(properties.backupRetention),
    "CaCertificateIdentifier": cdk.stringToCloudFormation(properties.caCertificateIdentifier),
    "MasterDatabaseName": cdk.stringToCloudFormation(properties.masterDatabaseName),
    "MasterUserPassword": cdk.stringToCloudFormation(properties.masterUserPassword),
    "MasterUsername": cdk.stringToCloudFormation(properties.masterUsername),
    "PreferredBackupWindow": cdk.stringToCloudFormation(properties.preferredBackupWindow),
    "PreferredMaintenanceWindow": cdk.stringToCloudFormation(properties.preferredMaintenanceWindow),
    "PubliclyAccessible": cdk.booleanToCloudFormation(properties.publiclyAccessible),
    "RelationalDatabaseBlueprintId": cdk.stringToCloudFormation(properties.relationalDatabaseBlueprintId),
    "RelationalDatabaseBundleId": cdk.stringToCloudFormation(properties.relationalDatabaseBundleId),
    "RelationalDatabaseName": cdk.stringToCloudFormation(properties.relationalDatabaseName),
    "RelationalDatabaseParameters": cdk.listMapper(convertCfnDatabaseRelationalDatabaseParameterPropertyToCloudFormation)(properties.relationalDatabaseParameters),
    "RotateMasterUserPassword": cdk.booleanToCloudFormation(properties.rotateMasterUserPassword),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDatabasePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDatabaseProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDatabaseProps>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("backupRetention", "BackupRetention", (properties.BackupRetention != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BackupRetention) : undefined));
  ret.addPropertyResult("caCertificateIdentifier", "CaCertificateIdentifier", (properties.CaCertificateIdentifier != null ? cfn_parse.FromCloudFormation.getString(properties.CaCertificateIdentifier) : undefined));
  ret.addPropertyResult("masterDatabaseName", "MasterDatabaseName", (properties.MasterDatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.MasterDatabaseName) : undefined));
  ret.addPropertyResult("masterUsername", "MasterUsername", (properties.MasterUsername != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUsername) : undefined));
  ret.addPropertyResult("masterUserPassword", "MasterUserPassword", (properties.MasterUserPassword != null ? cfn_parse.FromCloudFormation.getString(properties.MasterUserPassword) : undefined));
  ret.addPropertyResult("preferredBackupWindow", "PreferredBackupWindow", (properties.PreferredBackupWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredBackupWindow) : undefined));
  ret.addPropertyResult("preferredMaintenanceWindow", "PreferredMaintenanceWindow", (properties.PreferredMaintenanceWindow != null ? cfn_parse.FromCloudFormation.getString(properties.PreferredMaintenanceWindow) : undefined));
  ret.addPropertyResult("publiclyAccessible", "PubliclyAccessible", (properties.PubliclyAccessible != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PubliclyAccessible) : undefined));
  ret.addPropertyResult("relationalDatabaseBlueprintId", "RelationalDatabaseBlueprintId", (properties.RelationalDatabaseBlueprintId != null ? cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseBlueprintId) : undefined));
  ret.addPropertyResult("relationalDatabaseBundleId", "RelationalDatabaseBundleId", (properties.RelationalDatabaseBundleId != null ? cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseBundleId) : undefined));
  ret.addPropertyResult("relationalDatabaseName", "RelationalDatabaseName", (properties.RelationalDatabaseName != null ? cfn_parse.FromCloudFormation.getString(properties.RelationalDatabaseName) : undefined));
  ret.addPropertyResult("relationalDatabaseParameters", "RelationalDatabaseParameters", (properties.RelationalDatabaseParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnDatabaseRelationalDatabaseParameterPropertyFromCloudFormation)(properties.RelationalDatabaseParameters) : undefined));
  ret.addPropertyResult("rotateMasterUserPassword", "RotateMasterUserPassword", (properties.RotateMasterUserPassword != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RotateMasterUserPassword) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Disk` resource specifies a disk that can be attached to an Amazon Lightsail instance that is in the same AWS Region and Availability Zone.
 *
 * @cloudformationResource AWS::Lightsail::Disk
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html
 */
export class CfnDisk extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Disk";

  /**
   * Build a CfnDisk from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDisk {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDiskPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDisk(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The resources to which the disk is attached.
   *
   * @cloudformationAttribute AttachedTo
   */
  public readonly attrAttachedTo: string;

  /**
   * (Deprecated) The attachment state of the disk.
   *
   * > In releases prior to November 14, 2017, this parameter returned `attached` for system disks in the API response. It is now deprecated, but still included in the response. Use `isAttached` instead.
   *
   * @cloudformationAttribute AttachmentState
   */
  public readonly attrAttachmentState: string;

  /**
   * The Amazon Resource Name (ARN) of the disk.
   *
   * @cloudformationAttribute DiskArn
   */
  public readonly attrDiskArn: string;

  /**
   * The input/output operations per second (IOPS) of the disk.
   *
   * @cloudformationAttribute Iops
   */
  public readonly attrIops: number;

  /**
   * A Boolean value indicating whether the disk is attached.
   *
   * @cloudformationAttribute IsAttached
   */
  public readonly attrIsAttached: cdk.IResolvable;

  /**
   * The Availability Zone in which to create your disk. Use the following format: us-east-2a (case sensitive). Be sure to add the include Availability Zones parameter to your request.
   *
   * @cloudformationAttribute Location.AvailabilityZone
   */
  public readonly attrLocationAvailabilityZone: string;

  /**
   * The Region Name in which to create your disk.
   *
   * @cloudformationAttribute Location.RegionName
   */
  public readonly attrLocationRegionName: string;

  /**
   * The disk path.
   *
   * @cloudformationAttribute Path
   */
  public readonly attrPath: string;

  /**
   * The resource type of the disk (for example, `Disk` ).
   *
   * @cloudformationAttribute ResourceType
   */
  public readonly attrResourceType: string;

  /**
   * The state of the disk (for example, `in-use` ).
   *
   * @cloudformationAttribute State
   */
  public readonly attrState: string;

  /**
   * The support code of the disk.
   *
   * Include this code in your email to support when you have questions about a disk or another resource in Lightsail . This code helps our support team to look up your Lightsail information.
   *
   * @cloudformationAttribute SupportCode
   */
  public readonly attrSupportCode: string;

  /**
   * An array of add-ons for the disk.
   */
  public addOns?: Array<CfnDisk.AddOnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Region and Availability Zone location for the disk (for example, `us-east-1a` ).
   */
  public availabilityZone?: string;

  /**
   * The name of the disk.
   */
  public diskName: string;

  /**
   * The AWS Region and Availability Zone where the disk is located.
   */
  public location?: cdk.IResolvable | CfnDisk.LocationProperty;

  /**
   * The size of the disk in GB.
   */
  public sizeInGb: number;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnDiskProps) {
    super(scope, id, {
      "type": CfnDisk.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "diskName", this);
    cdk.requireProperty(props, "sizeInGb", this);

    this.attrAttachedTo = cdk.Token.asString(this.getAtt("AttachedTo", cdk.ResolutionTypeHint.STRING));
    this.attrAttachmentState = cdk.Token.asString(this.getAtt("AttachmentState", cdk.ResolutionTypeHint.STRING));
    this.attrDiskArn = cdk.Token.asString(this.getAtt("DiskArn", cdk.ResolutionTypeHint.STRING));
    this.attrIops = cdk.Token.asNumber(this.getAtt("Iops", cdk.ResolutionTypeHint.NUMBER));
    this.attrIsAttached = this.getAtt("IsAttached");
    this.attrLocationAvailabilityZone = cdk.Token.asString(this.getAtt("Location.AvailabilityZone", cdk.ResolutionTypeHint.STRING));
    this.attrLocationRegionName = cdk.Token.asString(this.getAtt("Location.RegionName", cdk.ResolutionTypeHint.STRING));
    this.attrPath = cdk.Token.asString(this.getAtt("Path", cdk.ResolutionTypeHint.STRING));
    this.attrResourceType = cdk.Token.asString(this.getAtt("ResourceType", cdk.ResolutionTypeHint.STRING));
    this.attrState = cdk.Token.asString(this.getAtt("State", cdk.ResolutionTypeHint.STRING));
    this.attrSupportCode = cdk.Token.asString(this.getAtt("SupportCode", cdk.ResolutionTypeHint.STRING));
    this.addOns = props.addOns;
    this.availabilityZone = props.availabilityZone;
    this.diskName = props.diskName;
    this.location = props.location;
    this.sizeInGb = props.sizeInGb;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Disk", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "addOns": this.addOns,
      "availabilityZone": this.availabilityZone,
      "diskName": this.diskName,
      "location": this.location,
      "sizeInGb": this.sizeInGb,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDisk.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDiskPropsToCloudFormation(props);
  }
}

export namespace CfnDisk {
  /**
   * `AddOn` is a property of the [AWS::Lightsail::Disk](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html) resource. It describes the add-ons for a disk.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html
   */
  export interface AddOnProperty {
    /**
     * The add-on type (for example, `AutoSnapshot` ).
     *
     * > `AutoSnapshot` is the only add-on that can be enabled for a disk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html#cfn-lightsail-disk-addon-addontype
     */
    readonly addOnType: string;

    /**
     * The parameters for the automatic snapshot add-on, such as the daily time when an automatic snapshot will be created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html#cfn-lightsail-disk-addon-autosnapshotaddonrequest
     */
    readonly autoSnapshotAddOnRequest?: CfnDisk.AutoSnapshotAddOnProperty | cdk.IResolvable;

    /**
     * The status of the add-on.
     *
     * Valid Values: `Enabled` | `Disabled`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html#cfn-lightsail-disk-addon-status
     */
    readonly status?: string;
  }

  /**
   * `AutoSnapshotAddOn` is a property of the [AddOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-addon.html) property. It describes the automatic snapshot add-on for a disk.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-autosnapshotaddon.html
   */
  export interface AutoSnapshotAddOnProperty {
    /**
     * The daily time when an automatic snapshot will be created.
     *
     * Constraints:
     *
     * - Must be in `HH:00` format, and in an hourly increment.
     * - Specified in Coordinated Universal Time (UTC).
     * - The snapshot will be automatically created between the time specified and up to 45 minutes after.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-autosnapshotaddon.html#cfn-lightsail-disk-autosnapshotaddon-snapshottimeofday
     */
    readonly snapshotTimeOfDay?: string;
  }

  /**
   * The AWS Region and Availability Zone where the disk is located.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-location.html
   */
  export interface LocationProperty {
    /**
     * The Availability Zone where the disk is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-location.html#cfn-lightsail-disk-location-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The AWS Region where the disk is located.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-disk-location.html#cfn-lightsail-disk-location-regionname
     */
    readonly regionName?: string;
  }
}

/**
 * Properties for defining a `CfnDisk`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html
 */
export interface CfnDiskProps {
  /**
   * An array of add-ons for the disk.
   *
   * > If the disk has an add-on enabled when performing a delete disk request, the add-on is automatically disabled before the disk is deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-addons
   */
  readonly addOns?: Array<CfnDisk.AddOnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Region and Availability Zone location for the disk (for example, `us-east-1a` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * The name of the disk.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-diskname
   */
  readonly diskName: string;

  /**
   * The AWS Region and Availability Zone where the disk is located.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-location
   */
  readonly location?: cdk.IResolvable | CfnDisk.LocationProperty;

  /**
   * The size of the disk in GB.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-sizeingb
   */
  readonly sizeInGb: number;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-disk.html#cfn-lightsail-disk-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AutoSnapshotAddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AutoSnapshotAddOnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDiskAutoSnapshotAddOnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("snapshotTimeOfDay", cdk.validateString)(properties.snapshotTimeOfDay));
  return errors.wrap("supplied properties not correct for \"AutoSnapshotAddOnProperty\"");
}

// @ts-ignore TS6133
function convertCfnDiskAutoSnapshotAddOnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDiskAutoSnapshotAddOnPropertyValidator(properties).assertSuccess();
  return {
    "SnapshotTimeOfDay": cdk.stringToCloudFormation(properties.snapshotTimeOfDay)
  };
}

// @ts-ignore TS6133
function CfnDiskAutoSnapshotAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDisk.AutoSnapshotAddOnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDisk.AutoSnapshotAddOnProperty>();
  ret.addPropertyResult("snapshotTimeOfDay", "SnapshotTimeOfDay", (properties.SnapshotTimeOfDay != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotTimeOfDay) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AddOnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDiskAddOnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addOnType", cdk.requiredValidator)(properties.addOnType));
  errors.collect(cdk.propertyValidator("addOnType", cdk.validateString)(properties.addOnType));
  errors.collect(cdk.propertyValidator("autoSnapshotAddOnRequest", CfnDiskAutoSnapshotAddOnPropertyValidator)(properties.autoSnapshotAddOnRequest));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"AddOnProperty\"");
}

// @ts-ignore TS6133
function convertCfnDiskAddOnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDiskAddOnPropertyValidator(properties).assertSuccess();
  return {
    "AddOnType": cdk.stringToCloudFormation(properties.addOnType),
    "AutoSnapshotAddOnRequest": convertCfnDiskAutoSnapshotAddOnPropertyToCloudFormation(properties.autoSnapshotAddOnRequest),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnDiskAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDisk.AddOnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDisk.AddOnProperty>();
  ret.addPropertyResult("addOnType", "AddOnType", (properties.AddOnType != null ? cfn_parse.FromCloudFormation.getString(properties.AddOnType) : undefined));
  ret.addPropertyResult("autoSnapshotAddOnRequest", "AutoSnapshotAddOnRequest", (properties.AutoSnapshotAddOnRequest != null ? CfnDiskAutoSnapshotAddOnPropertyFromCloudFormation(properties.AutoSnapshotAddOnRequest) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDiskLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("regionName", cdk.validateString)(properties.regionName));
  return errors.wrap("supplied properties not correct for \"LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnDiskLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDiskLocationPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "RegionName": cdk.stringToCloudFormation(properties.regionName)
  };
}

// @ts-ignore TS6133
function CfnDiskLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDisk.LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDisk.LocationProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("regionName", "RegionName", (properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDiskProps`
 *
 * @param properties - the TypeScript properties of a `CfnDiskProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDiskPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addOns", cdk.listValidator(CfnDiskAddOnPropertyValidator))(properties.addOns));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("diskName", cdk.requiredValidator)(properties.diskName));
  errors.collect(cdk.propertyValidator("diskName", cdk.validateString)(properties.diskName));
  errors.collect(cdk.propertyValidator("location", CfnDiskLocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.requiredValidator)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.validateNumber)(properties.sizeInGb));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDiskProps\"");
}

// @ts-ignore TS6133
function convertCfnDiskPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDiskPropsValidator(properties).assertSuccess();
  return {
    "AddOns": cdk.listMapper(convertCfnDiskAddOnPropertyToCloudFormation)(properties.addOns),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "DiskName": cdk.stringToCloudFormation(properties.diskName),
    "Location": convertCfnDiskLocationPropertyToCloudFormation(properties.location),
    "SizeInGb": cdk.numberToCloudFormation(properties.sizeInGb),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDiskPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDiskProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDiskProps>();
  ret.addPropertyResult("addOns", "AddOns", (properties.AddOns != null ? cfn_parse.FromCloudFormation.getArray(CfnDiskAddOnPropertyFromCloudFormation)(properties.AddOns) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("diskName", "DiskName", (properties.DiskName != null ? cfn_parse.FromCloudFormation.getString(properties.DiskName) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnDiskLocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("sizeInGb", "SizeInGb", (properties.SizeInGb != null ? cfn_parse.FromCloudFormation.getNumber(properties.SizeInGb) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Distribution` resource specifies a content delivery network (CDN) distribution.
 *
 * You can create distributions only in the `us-east-1` AWS Region.
 *
 * A distribution is a globally distributed network of caching servers that improve the performance of your website or web application hosted on a Lightsail instance, static content hosted on a Lightsail bucket, or through a Lightsail load balancer.
 *
 * @cloudformationResource AWS::Lightsail::Distribution
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html
 */
export class CfnDistribution extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Distribution";

  /**
   * Build a CfnDistribution from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDistribution {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDistributionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDistribution(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Indicates whether you can update the distribution’s current bundle to another bundle.
   *
   * @cloudformationAttribute AbleToUpdateBundle
   */
  public readonly attrAbleToUpdateBundle: cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the distribution.
   *
   * @cloudformationAttribute DistributionArn
   */
  public readonly attrDistributionArn: string;

  /**
   * The status of the distribution.
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * The ID of the bundle applied to the distribution.
   */
  public bundleId: string;

  /**
   * An array of objects that describe the per-path cache behavior of the distribution.
   */
  public cacheBehaviors?: Array<CfnDistribution.CacheBehaviorPerPathProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An object that describes the cache behavior settings of the distribution.
   */
  public cacheBehaviorSettings?: CfnDistribution.CacheSettingsProperty | cdk.IResolvable;

  /**
   * The name of the SSL/TLS certificate attached to the distribution.
   */
  public certificateName?: string;

  /**
   * An object that describes the default cache behavior of the distribution.
   */
  public defaultCacheBehavior: CfnDistribution.CacheBehaviorProperty | cdk.IResolvable;

  /**
   * The name of the distribution.
   */
  public distributionName: string;

  /**
   * The IP address type of the distribution.
   */
  public ipAddressType?: string;

  /**
   * A Boolean value indicating whether the distribution is enabled.
   */
  public isEnabled?: boolean | cdk.IResolvable;

  /**
   * An object that describes the origin resource of the distribution, such as a Lightsail instance, bucket, or load balancer.
   */
  public origin: CfnDistribution.InputOriginProperty | cdk.IResolvable;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnDistributionProps) {
    super(scope, id, {
      "type": CfnDistribution.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "bundleId", this);
    cdk.requireProperty(props, "defaultCacheBehavior", this);
    cdk.requireProperty(props, "distributionName", this);
    cdk.requireProperty(props, "origin", this);

    this.attrAbleToUpdateBundle = this.getAtt("AbleToUpdateBundle");
    this.attrDistributionArn = cdk.Token.asString(this.getAtt("DistributionArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.bundleId = props.bundleId;
    this.cacheBehaviors = props.cacheBehaviors;
    this.cacheBehaviorSettings = props.cacheBehaviorSettings;
    this.certificateName = props.certificateName;
    this.defaultCacheBehavior = props.defaultCacheBehavior;
    this.distributionName = props.distributionName;
    this.ipAddressType = props.ipAddressType;
    this.isEnabled = props.isEnabled;
    this.origin = props.origin;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Distribution", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bundleId": this.bundleId,
      "cacheBehaviors": this.cacheBehaviors,
      "cacheBehaviorSettings": this.cacheBehaviorSettings,
      "certificateName": this.certificateName,
      "defaultCacheBehavior": this.defaultCacheBehavior,
      "distributionName": this.distributionName,
      "ipAddressType": this.ipAddressType,
      "isEnabled": this.isEnabled,
      "origin": this.origin,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDistribution.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDistributionPropsToCloudFormation(props);
  }
}

export namespace CfnDistribution {
  /**
   * `InputOrigin` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the origin resource of an Amazon Lightsail content delivery network (CDN) distribution.
   *
   * An origin can be a instance, bucket, or load balancer. A distribution pulls content from an origin, caches it, and serves it to viewers through a worldwide network of edge servers.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html
   */
  export interface InputOriginProperty {
    /**
     * The name of the origin resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html#cfn-lightsail-distribution-inputorigin-name
     */
    readonly name?: string;

    /**
     * The protocol that your Amazon Lightsail distribution uses when establishing a connection with your origin to pull content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html#cfn-lightsail-distribution-inputorigin-protocolpolicy
     */
    readonly protocolPolicy?: string;

    /**
     * The AWS Region name of the origin resource.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-inputorigin.html#cfn-lightsail-distribution-inputorigin-regionname
     */
    readonly regionName?: string;
  }

  /**
   * `CacheBehavior` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the default cache behavior of an Amazon Lightsail content delivery network (CDN) distribution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehavior.html
   */
  export interface CacheBehaviorProperty {
    /**
     * The cache behavior of the distribution.
     *
     * The following cache behaviors can be specified:
     *
     * - *`cache`* - This option is best for static sites. When specified, your distribution caches and serves your entire website as static content. This behavior is ideal for websites with static content that doesn't change depending on who views it, or for websites that don't use cookies, headers, or query strings to personalize content.
     * - *`dont-cache`* - This option is best for sites that serve a mix of static and dynamic content. When specified, your distribution caches and serves only the content that is specified in the distribution’s `CacheBehaviorPerPath` parameter. This behavior is ideal for websites or web applications that use cookies, headers, and query strings to personalize content for individual users.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehavior.html#cfn-lightsail-distribution-cachebehavior-behavior
     */
    readonly behavior?: string;
  }

  /**
   * `CacheSettings` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the cache settings of an Amazon Lightsail content delivery network (CDN) distribution.
   *
   * These settings apply only to your distribution’s `CacheBehaviors` that have a `Behavior` of `cache` . This includes the `DefaultCacheBehavior` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html
   */
  export interface CacheSettingsProperty {
    /**
     * The HTTP methods that are processed and forwarded to the distribution's origin.
     *
     * You can specify the following options:
     *
     * - `GET,HEAD` - The distribution forwards the `GET` and `HEAD` methods.
     * - `GET,HEAD,OPTIONS` - The distribution forwards the `GET` , `HEAD` , and `OPTIONS` methods.
     * - `GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE` - The distribution forwards the `GET` , `HEAD` , `OPTIONS` , `PUT` , `PATCH` , `POST` , and `DELETE` methods.
     *
     * If you specify `GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE` , you might need to restrict access to your distribution's origin so users can't perform operations that you don't want them to. For example, you might not want users to have permission to delete objects from your origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-allowedhttpmethods
     */
    readonly allowedHttpMethods?: string;

    /**
     * The HTTP method responses that are cached by your distribution.
     *
     * You can specify the following options:
     *
     * - `GET,HEAD` - The distribution caches responses to the `GET` and `HEAD` methods.
     * - `GET,HEAD,OPTIONS` - The distribution caches responses to the `GET` , `HEAD` , and `OPTIONS` methods.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-cachedhttpmethods
     */
    readonly cachedHttpMethods?: string;

    /**
     * The default amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the content has been updated.
     *
     * > The value specified applies only when the origin does not add HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-defaultttl
     */
    readonly defaultTtl?: number;

    /**
     * An object that describes the cookies that are forwarded to the origin.
     *
     * Your content is cached based on the cookies that are forwarded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-forwardedcookies
     */
    readonly forwardedCookies?: CfnDistribution.CookieObjectProperty | cdk.IResolvable;

    /**
     * An object that describes the headers that are forwarded to the origin.
     *
     * Your content is cached based on the headers that are forwarded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-forwardedheaders
     */
    readonly forwardedHeaders?: CfnDistribution.HeaderObjectProperty | cdk.IResolvable;

    /**
     * An object that describes the query strings that are forwarded to the origin.
     *
     * Your content is cached based on the query strings that are forwarded.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-forwardedquerystrings
     */
    readonly forwardedQueryStrings?: cdk.IResolvable | CfnDistribution.QueryStringObjectProperty;

    /**
     * The maximum amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the object has been updated.
     *
     * The value specified applies only when the origin adds HTTP headers such as `Cache-Control max-age` , `Cache-Control s-maxage` , and `Expires` to objects.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-maximumttl
     */
    readonly maximumTtl?: number;

    /**
     * The minimum amount of time that objects stay in the distribution's cache before the distribution forwards another request to the origin to determine whether the object has been updated.
     *
     * A value of `0` must be specified for `minimumTTL` if the distribution is configured to forward all headers to the origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html#cfn-lightsail-distribution-cachesettings-minimumttl
     */
    readonly minimumTtl?: number;
  }

  /**
   * `CookieObject` is a property of the [CacheSettings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html) property. It describes whether an Amazon Lightsail content delivery network (CDN) distribution forwards cookies to the origin and, if so, which ones.
   *
   * For the cookies that you specify, your distribution caches separate versions of the specified content based on the cookie values in viewer requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cookieobject.html
   */
  export interface CookieObjectProperty {
    /**
     * The specific cookies to forward to your distribution's origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cookieobject.html#cfn-lightsail-distribution-cookieobject-cookiesallowlist
     */
    readonly cookiesAllowList?: Array<string>;

    /**
     * Specifies which cookies to forward to the distribution's origin for a cache behavior.
     *
     * Use one of the following configurations for your distribution:
     *
     * - *`all`* - Forwards all cookies to your origin.
     * - *`none`* - Doesn’t forward cookies to your origin.
     * - *`allow-list`* - Forwards only the cookies that you specify using the `CookiesAllowList` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cookieobject.html#cfn-lightsail-distribution-cookieobject-option
     */
    readonly option?: string;
  }

  /**
   * `HeaderObject` is a property of the [CacheSettings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html) property. It describes the request headers used by your distribution, which caches your content based on the request headers.
   *
   * For the headers that you specify, your distribution caches separate versions of the specified content based on the header values in viewer requests. For example, suppose that viewer requests for logo.jpg contain a custom product header that has a value of either acme or apex. Also, suppose that you configure your distribution to cache your content based on values in the product header. Your distribution forwards the product header to the origin and caches the response from the origin once for each header value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-headerobject.html
   */
  export interface HeaderObjectProperty {
    /**
     * The specific headers to forward to your distribution's origin.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-headerobject.html#cfn-lightsail-distribution-headerobject-headersallowlist
     */
    readonly headersAllowList?: Array<string>;

    /**
     * The headers that you want your distribution to forward to your origin.
     *
     * Your distribution caches your content based on these headers.
     *
     * Use one of the following configurations for your distribution:
     *
     * - *`all`* - Forwards all headers to your origin..
     * - *`none`* - Forwards only the default headers.
     * - *`allow-list`* - Forwards only the headers that you specify using the `HeadersAllowList` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-headerobject.html#cfn-lightsail-distribution-headerobject-option
     */
    readonly option?: string;
  }

  /**
   * `QueryStringObject` is a property of the [CacheSettings](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachesettings.html) property. It describes the query string parameters that an Amazon Lightsail content delivery network (CDN) distribution to bases caching on.
   *
   * For the query strings that you specify, your distribution caches separate versions of the specified content based on the query string values in viewer requests.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-querystringobject.html
   */
  export interface QueryStringObjectProperty {
    /**
     * Indicates whether the distribution forwards and caches based on query strings.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-querystringobject.html#cfn-lightsail-distribution-querystringobject-option
     */
    readonly option?: boolean | cdk.IResolvable;

    /**
     * The specific query strings that the distribution forwards to the origin.
     *
     * Your distribution caches content based on the specified query strings.
     *
     * If the `option` parameter is true, then your distribution forwards all query strings, regardless of what you specify using the `QueryStringsAllowList` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-querystringobject.html#cfn-lightsail-distribution-querystringobject-querystringsallowlist
     */
    readonly queryStringsAllowList?: Array<string>;
  }

  /**
   * `CacheBehaviorPerPath` is a property of the [AWS::Lightsail::Distribution](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html) resource. It describes the per-path cache behavior of an Amazon Lightsail content delivery network (CDN) distribution.
   *
   * Use a per-path cache behavior to override the default cache behavior of a distribution, or to add an exception to it. For example, if you set the `CacheBehavior` to `cache` , you can use a per-path cache behavior to specify a directory, file, or file type that your distribution will cache. If you don’t want your distribution to cache a specified directory, file, or file type, set the per-path cache behavior to `dont-cache` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehaviorperpath.html
   */
  export interface CacheBehaviorPerPathProperty {
    /**
     * The cache behavior for the specified path.
     *
     * You can specify one of the following per-path cache behaviors:
     *
     * - *`cache`* - This behavior caches the specified path.
     * - *`dont-cache`* - This behavior doesn't cache the specified path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehaviorperpath.html#cfn-lightsail-distribution-cachebehaviorperpath-behavior
     */
    readonly behavior?: string;

    /**
     * The path to a directory or file to cache, or not cache.
     *
     * Use an asterisk symbol to specify wildcard directories ( `path/to/assets/*` ), and file types ( `*.html` , `*jpg` , `*js` ). Directories and file paths are case-sensitive.
     *
     * Examples:
     *
     * - Specify the following to cache all files in the document root of an Apache web server running on a instance.
     *
     * `var/www/html/`
     * - Specify the following file to cache only the index page in the document root of an Apache web server.
     *
     * `var/www/html/index.html`
     * - Specify the following to cache only the .html files in the document root of an Apache web server.
     *
     * `var/www/html/*.html`
     * - Specify the following to cache only the .jpg, .png, and .gif files in the images sub-directory of the document root of an Apache web server.
     *
     * `var/www/html/images/*.jpg`
     *
     * `var/www/html/images/*.png`
     *
     * `var/www/html/images/*.gif`
     *
     * Specify the following to cache all files in the images subdirectory of the document root of an Apache web server.
     *
     * `var/www/html/images/`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-distribution-cachebehaviorperpath.html#cfn-lightsail-distribution-cachebehaviorperpath-path
     */
    readonly path?: string;
  }
}

/**
 * Properties for defining a `CfnDistribution`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html
 */
export interface CfnDistributionProps {
  /**
   * The ID of the bundle applied to the distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-bundleid
   */
  readonly bundleId: string;

  /**
   * An array of objects that describe the per-path cache behavior of the distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-cachebehaviors
   */
  readonly cacheBehaviors?: Array<CfnDistribution.CacheBehaviorPerPathProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * An object that describes the cache behavior settings of the distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-cachebehaviorsettings
   */
  readonly cacheBehaviorSettings?: CfnDistribution.CacheSettingsProperty | cdk.IResolvable;

  /**
   * The name of the SSL/TLS certificate attached to the distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-certificatename
   */
  readonly certificateName?: string;

  /**
   * An object that describes the default cache behavior of the distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-defaultcachebehavior
   */
  readonly defaultCacheBehavior: CfnDistribution.CacheBehaviorProperty | cdk.IResolvable;

  /**
   * The name of the distribution.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-distributionname
   */
  readonly distributionName: string;

  /**
   * The IP address type of the distribution.
   *
   * The possible values are `ipv4` for IPv4 only, and `dualstack` for IPv4 and IPv6.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-ipaddresstype
   */
  readonly ipAddressType?: string;

  /**
   * A Boolean value indicating whether the distribution is enabled.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-isenabled
   */
  readonly isEnabled?: boolean | cdk.IResolvable;

  /**
   * An object that describes the origin resource of the distribution, such as a Lightsail instance, bucket, or load balancer.
   *
   * The distribution pulls, caches, and serves content from the origin.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-origin
   */
  readonly origin: CfnDistribution.InputOriginProperty | cdk.IResolvable;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-distribution.html#cfn-lightsail-distribution-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `InputOriginProperty`
 *
 * @param properties - the TypeScript properties of a `InputOriginProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionInputOriginPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("protocolPolicy", cdk.validateString)(properties.protocolPolicy));
  errors.collect(cdk.propertyValidator("regionName", cdk.validateString)(properties.regionName));
  return errors.wrap("supplied properties not correct for \"InputOriginProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionInputOriginPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionInputOriginPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "ProtocolPolicy": cdk.stringToCloudFormation(properties.protocolPolicy),
    "RegionName": cdk.stringToCloudFormation(properties.regionName)
  };
}

// @ts-ignore TS6133
function CfnDistributionInputOriginPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.InputOriginProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.InputOriginProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("protocolPolicy", "ProtocolPolicy", (properties.ProtocolPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.ProtocolPolicy) : undefined));
  ret.addPropertyResult("regionName", "RegionName", (properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CacheBehaviorProperty`
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("behavior", cdk.validateString)(properties.behavior));
  return errors.wrap("supplied properties not correct for \"CacheBehaviorProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCacheBehaviorPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCacheBehaviorPropertyValidator(properties).assertSuccess();
  return {
    "Behavior": cdk.stringToCloudFormation(properties.behavior)
  };
}

// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheBehaviorProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheBehaviorProperty>();
  ret.addPropertyResult("behavior", "Behavior", (properties.Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.Behavior) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CookieObjectProperty`
 *
 * @param properties - the TypeScript properties of a `CookieObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCookieObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cookiesAllowList", cdk.listValidator(cdk.validateString))(properties.cookiesAllowList));
  errors.collect(cdk.propertyValidator("option", cdk.validateString)(properties.option));
  return errors.wrap("supplied properties not correct for \"CookieObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCookieObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCookieObjectPropertyValidator(properties).assertSuccess();
  return {
    "CookiesAllowList": cdk.listMapper(cdk.stringToCloudFormation)(properties.cookiesAllowList),
    "Option": cdk.stringToCloudFormation(properties.option)
  };
}

// @ts-ignore TS6133
function CfnDistributionCookieObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CookieObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CookieObjectProperty>();
  ret.addPropertyResult("cookiesAllowList", "CookiesAllowList", (properties.CookiesAllowList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CookiesAllowList) : undefined));
  ret.addPropertyResult("option", "Option", (properties.Option != null ? cfn_parse.FromCloudFormation.getString(properties.Option) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HeaderObjectProperty`
 *
 * @param properties - the TypeScript properties of a `HeaderObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionHeaderObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headersAllowList", cdk.listValidator(cdk.validateString))(properties.headersAllowList));
  errors.collect(cdk.propertyValidator("option", cdk.validateString)(properties.option));
  return errors.wrap("supplied properties not correct for \"HeaderObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionHeaderObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionHeaderObjectPropertyValidator(properties).assertSuccess();
  return {
    "HeadersAllowList": cdk.listMapper(cdk.stringToCloudFormation)(properties.headersAllowList),
    "Option": cdk.stringToCloudFormation(properties.option)
  };
}

// @ts-ignore TS6133
function CfnDistributionHeaderObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.HeaderObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.HeaderObjectProperty>();
  ret.addPropertyResult("headersAllowList", "HeadersAllowList", (properties.HeadersAllowList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.HeadersAllowList) : undefined));
  ret.addPropertyResult("option", "Option", (properties.Option != null ? cfn_parse.FromCloudFormation.getString(properties.Option) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueryStringObjectProperty`
 *
 * @param properties - the TypeScript properties of a `QueryStringObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionQueryStringObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("option", cdk.validateBoolean)(properties.option));
  errors.collect(cdk.propertyValidator("queryStringsAllowList", cdk.listValidator(cdk.validateString))(properties.queryStringsAllowList));
  return errors.wrap("supplied properties not correct for \"QueryStringObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionQueryStringObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionQueryStringObjectPropertyValidator(properties).assertSuccess();
  return {
    "Option": cdk.booleanToCloudFormation(properties.option),
    "QueryStringsAllowList": cdk.listMapper(cdk.stringToCloudFormation)(properties.queryStringsAllowList)
  };
}

// @ts-ignore TS6133
function CfnDistributionQueryStringObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDistribution.QueryStringObjectProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.QueryStringObjectProperty>();
  ret.addPropertyResult("option", "Option", (properties.Option != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Option) : undefined));
  ret.addPropertyResult("queryStringsAllowList", "QueryStringsAllowList", (properties.QueryStringsAllowList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.QueryStringsAllowList) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CacheSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `CacheSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCacheSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowedHttpMethods", cdk.validateString)(properties.allowedHttpMethods));
  errors.collect(cdk.propertyValidator("cachedHttpMethods", cdk.validateString)(properties.cachedHttpMethods));
  errors.collect(cdk.propertyValidator("defaultTtl", cdk.validateNumber)(properties.defaultTtl));
  errors.collect(cdk.propertyValidator("forwardedCookies", CfnDistributionCookieObjectPropertyValidator)(properties.forwardedCookies));
  errors.collect(cdk.propertyValidator("forwardedHeaders", CfnDistributionHeaderObjectPropertyValidator)(properties.forwardedHeaders));
  errors.collect(cdk.propertyValidator("forwardedQueryStrings", CfnDistributionQueryStringObjectPropertyValidator)(properties.forwardedQueryStrings));
  errors.collect(cdk.propertyValidator("maximumTtl", cdk.validateNumber)(properties.maximumTtl));
  errors.collect(cdk.propertyValidator("minimumTtl", cdk.validateNumber)(properties.minimumTtl));
  return errors.wrap("supplied properties not correct for \"CacheSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCacheSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCacheSettingsPropertyValidator(properties).assertSuccess();
  return {
    "AllowedHTTPMethods": cdk.stringToCloudFormation(properties.allowedHttpMethods),
    "CachedHTTPMethods": cdk.stringToCloudFormation(properties.cachedHttpMethods),
    "DefaultTTL": cdk.numberToCloudFormation(properties.defaultTtl),
    "ForwardedCookies": convertCfnDistributionCookieObjectPropertyToCloudFormation(properties.forwardedCookies),
    "ForwardedHeaders": convertCfnDistributionHeaderObjectPropertyToCloudFormation(properties.forwardedHeaders),
    "ForwardedQueryStrings": convertCfnDistributionQueryStringObjectPropertyToCloudFormation(properties.forwardedQueryStrings),
    "MaximumTTL": cdk.numberToCloudFormation(properties.maximumTtl),
    "MinimumTTL": cdk.numberToCloudFormation(properties.minimumTtl)
  };
}

// @ts-ignore TS6133
function CfnDistributionCacheSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheSettingsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheSettingsProperty>();
  ret.addPropertyResult("allowedHttpMethods", "AllowedHTTPMethods", (properties.AllowedHTTPMethods != null ? cfn_parse.FromCloudFormation.getString(properties.AllowedHTTPMethods) : undefined));
  ret.addPropertyResult("cachedHttpMethods", "CachedHTTPMethods", (properties.CachedHTTPMethods != null ? cfn_parse.FromCloudFormation.getString(properties.CachedHTTPMethods) : undefined));
  ret.addPropertyResult("defaultTtl", "DefaultTTL", (properties.DefaultTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.DefaultTTL) : undefined));
  ret.addPropertyResult("forwardedCookies", "ForwardedCookies", (properties.ForwardedCookies != null ? CfnDistributionCookieObjectPropertyFromCloudFormation(properties.ForwardedCookies) : undefined));
  ret.addPropertyResult("forwardedHeaders", "ForwardedHeaders", (properties.ForwardedHeaders != null ? CfnDistributionHeaderObjectPropertyFromCloudFormation(properties.ForwardedHeaders) : undefined));
  ret.addPropertyResult("forwardedQueryStrings", "ForwardedQueryStrings", (properties.ForwardedQueryStrings != null ? CfnDistributionQueryStringObjectPropertyFromCloudFormation(properties.ForwardedQueryStrings) : undefined));
  ret.addPropertyResult("maximumTtl", "MaximumTTL", (properties.MaximumTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumTTL) : undefined));
  ret.addPropertyResult("minimumTtl", "MinimumTTL", (properties.MinimumTTL != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumTTL) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CacheBehaviorPerPathProperty`
 *
 * @param properties - the TypeScript properties of a `CacheBehaviorPerPathProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPerPathPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("behavior", cdk.validateString)(properties.behavior));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  return errors.wrap("supplied properties not correct for \"CacheBehaviorPerPathProperty\"");
}

// @ts-ignore TS6133
function convertCfnDistributionCacheBehaviorPerPathPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionCacheBehaviorPerPathPropertyValidator(properties).assertSuccess();
  return {
    "Behavior": cdk.stringToCloudFormation(properties.behavior),
    "Path": cdk.stringToCloudFormation(properties.path)
  };
}

// @ts-ignore TS6133
function CfnDistributionCacheBehaviorPerPathPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistribution.CacheBehaviorPerPathProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistribution.CacheBehaviorPerPathProperty>();
  ret.addPropertyResult("behavior", "Behavior", (properties.Behavior != null ? cfn_parse.FromCloudFormation.getString(properties.Behavior) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnDistributionProps`
 *
 * @param properties - the TypeScript properties of a `CfnDistributionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDistributionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bundleId", cdk.requiredValidator)(properties.bundleId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("cacheBehaviorSettings", CfnDistributionCacheSettingsPropertyValidator)(properties.cacheBehaviorSettings));
  errors.collect(cdk.propertyValidator("cacheBehaviors", cdk.listValidator(CfnDistributionCacheBehaviorPerPathPropertyValidator))(properties.cacheBehaviors));
  errors.collect(cdk.propertyValidator("certificateName", cdk.validateString)(properties.certificateName));
  errors.collect(cdk.propertyValidator("defaultCacheBehavior", cdk.requiredValidator)(properties.defaultCacheBehavior));
  errors.collect(cdk.propertyValidator("defaultCacheBehavior", CfnDistributionCacheBehaviorPropertyValidator)(properties.defaultCacheBehavior));
  errors.collect(cdk.propertyValidator("distributionName", cdk.requiredValidator)(properties.distributionName));
  errors.collect(cdk.propertyValidator("distributionName", cdk.validateString)(properties.distributionName));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("isEnabled", cdk.validateBoolean)(properties.isEnabled));
  errors.collect(cdk.propertyValidator("origin", cdk.requiredValidator)(properties.origin));
  errors.collect(cdk.propertyValidator("origin", CfnDistributionInputOriginPropertyValidator)(properties.origin));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDistributionProps\"");
}

// @ts-ignore TS6133
function convertCfnDistributionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDistributionPropsValidator(properties).assertSuccess();
  return {
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "CacheBehaviorSettings": convertCfnDistributionCacheSettingsPropertyToCloudFormation(properties.cacheBehaviorSettings),
    "CacheBehaviors": cdk.listMapper(convertCfnDistributionCacheBehaviorPerPathPropertyToCloudFormation)(properties.cacheBehaviors),
    "CertificateName": cdk.stringToCloudFormation(properties.certificateName),
    "DefaultCacheBehavior": convertCfnDistributionCacheBehaviorPropertyToCloudFormation(properties.defaultCacheBehavior),
    "DistributionName": cdk.stringToCloudFormation(properties.distributionName),
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "IsEnabled": cdk.booleanToCloudFormation(properties.isEnabled),
    "Origin": convertCfnDistributionInputOriginPropertyToCloudFormation(properties.origin),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnDistributionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDistributionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDistributionProps>();
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("cacheBehaviors", "CacheBehaviors", (properties.CacheBehaviors != null ? cfn_parse.FromCloudFormation.getArray(CfnDistributionCacheBehaviorPerPathPropertyFromCloudFormation)(properties.CacheBehaviors) : undefined));
  ret.addPropertyResult("cacheBehaviorSettings", "CacheBehaviorSettings", (properties.CacheBehaviorSettings != null ? CfnDistributionCacheSettingsPropertyFromCloudFormation(properties.CacheBehaviorSettings) : undefined));
  ret.addPropertyResult("certificateName", "CertificateName", (properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined));
  ret.addPropertyResult("defaultCacheBehavior", "DefaultCacheBehavior", (properties.DefaultCacheBehavior != null ? CfnDistributionCacheBehaviorPropertyFromCloudFormation(properties.DefaultCacheBehavior) : undefined));
  ret.addPropertyResult("distributionName", "DistributionName", (properties.DistributionName != null ? cfn_parse.FromCloudFormation.getString(properties.DistributionName) : undefined));
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addPropertyResult("isEnabled", "IsEnabled", (properties.IsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsEnabled) : undefined));
  ret.addPropertyResult("origin", "Origin", (properties.Origin != null ? CfnDistributionInputOriginPropertyFromCloudFormation(properties.Origin) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::Instance` resource specifies an Amazon Lightsail instance.
 *
 * @cloudformationResource AWS::Lightsail::Instance
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html
 */
export class CfnInstance extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::Instance";

  /**
   * Build a CfnInstance from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnInstance {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnInstancePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnInstance(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * CPU count of the Instance.
   *
   * @cloudformationAttribute Hardware.CpuCount
   */
  public readonly attrHardwareCpuCount: number;

  /**
   * RAM Size of the Instance.
   *
   * @cloudformationAttribute Hardware.RamSizeInGb
   */
  public readonly attrHardwareRamSizeInGb: number;

  /**
   * The Amazon Resource Name (ARN) of the instance (for example, `arn:aws:lightsail:us-east-2:123456789101:Instance/244ad76f-8aad-4741-809f-12345EXAMPLE` ).
   *
   * @cloudformationAttribute InstanceArn
   */
  public readonly attrInstanceArn: string;

  /**
   * A Boolean value indicating whether the instance has a static IP assigned to it.
   *
   * @cloudformationAttribute IsStaticIp
   */
  public readonly attrIsStaticIp: cdk.IResolvable;

  /**
   * The Availability Zone in which to create your instance. Use the following format: us-east-2a (case sensitive). Be sure to add the include Availability Zones parameter to your request.
   *
   * @cloudformationAttribute Location.AvailabilityZone
   */
  public readonly attrLocationAvailabilityZone: string;

  /**
   * The Region Name in which to create your instance.
   *
   * @cloudformationAttribute Location.RegionName
   */
  public readonly attrLocationRegionName: string;

  /**
   * GbPerMonthAllocated of the Instance.
   *
   * @cloudformationAttribute Networking.MonthlyTransfer.GbPerMonthAllocated
   */
  public readonly attrNetworkingMonthlyTransferGbPerMonthAllocated: string;

  /**
   * The private IP address of the instance.
   *
   * @cloudformationAttribute PrivateIpAddress
   */
  public readonly attrPrivateIpAddress: string;

  /**
   * The public IP address of the instance.
   *
   * @cloudformationAttribute PublicIpAddress
   */
  public readonly attrPublicIpAddress: string;

  /**
   * The resource type of the instance (for example, `Instance` ).
   *
   * @cloudformationAttribute ResourceType
   */
  public readonly attrResourceType: string;

  /**
   * The name of the SSH key pair used by the instance.
   *
   * @cloudformationAttribute SshKeyName
   */
  public readonly attrSshKeyName: string;

  /**
   * Status code of the Instance.
   *
   * @cloudformationAttribute State.Code
   */
  public readonly attrStateCode: number;

  /**
   * Status code of the Instance.
   *
   * @cloudformationAttribute State.Name
   */
  public readonly attrStateName: string;

  /**
   * The support code of the instance.
   *
   * Include this code in your email to support when you have questions about an instance or another resource in Lightsail . This code helps our support team to look up your Lightsail information.
   *
   * @cloudformationAttribute SupportCode
   */
  public readonly attrSupportCode: string;

  /**
   * The user name for connecting to the instance (for example, `ec2-user` ).
   *
   * @cloudformationAttribute UserName
   */
  public readonly attrUserName: string;

  /**
   * An array of add-ons for the instance.
   */
  public addOns?: Array<CfnInstance.AddOnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Availability Zone for the instance.
   */
  public availabilityZone?: string;

  /**
   * The blueprint ID for the instance (for example, `os_amlinux_2016_03` ).
   */
  public blueprintId: string;

  /**
   * The bundle ID for the instance (for example, `micro_1_0` ).
   */
  public bundleId: string;

  /**
   * The hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
   */
  public hardware?: CfnInstance.HardwareProperty | cdk.IResolvable;

  /**
   * The name of the instance.
   */
  public instanceName: string;

  /**
   * The name of the key pair to use for the instance.
   */
  public keyPairName?: string;

  /**
   * The location for the instance, such as the AWS Region and Availability Zone.
   */
  public location?: cdk.IResolvable | CfnInstance.LocationProperty;

  /**
   * The public ports and the monthly amount of data transfer allocated for the instance.
   */
  public networking?: cdk.IResolvable | CfnInstance.NetworkingProperty;

  /**
   * The status code and the state (for example, `running` ) of the instance.
   */
  public state?: cdk.IResolvable | CfnInstance.StateProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The optional launch script for the instance.
   */
  public userData?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnInstanceProps) {
    super(scope, id, {
      "type": CfnInstance.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "blueprintId", this);
    cdk.requireProperty(props, "bundleId", this);
    cdk.requireProperty(props, "instanceName", this);

    this.attrHardwareCpuCount = cdk.Token.asNumber(this.getAtt("Hardware.CpuCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrHardwareRamSizeInGb = cdk.Token.asNumber(this.getAtt("Hardware.RamSizeInGb", cdk.ResolutionTypeHint.NUMBER));
    this.attrInstanceArn = cdk.Token.asString(this.getAtt("InstanceArn", cdk.ResolutionTypeHint.STRING));
    this.attrIsStaticIp = this.getAtt("IsStaticIp");
    this.attrLocationAvailabilityZone = cdk.Token.asString(this.getAtt("Location.AvailabilityZone", cdk.ResolutionTypeHint.STRING));
    this.attrLocationRegionName = cdk.Token.asString(this.getAtt("Location.RegionName", cdk.ResolutionTypeHint.STRING));
    this.attrNetworkingMonthlyTransferGbPerMonthAllocated = cdk.Token.asString(this.getAtt("Networking.MonthlyTransfer.GbPerMonthAllocated", cdk.ResolutionTypeHint.STRING));
    this.attrPrivateIpAddress = cdk.Token.asString(this.getAtt("PrivateIpAddress", cdk.ResolutionTypeHint.STRING));
    this.attrPublicIpAddress = cdk.Token.asString(this.getAtt("PublicIpAddress", cdk.ResolutionTypeHint.STRING));
    this.attrResourceType = cdk.Token.asString(this.getAtt("ResourceType", cdk.ResolutionTypeHint.STRING));
    this.attrSshKeyName = cdk.Token.asString(this.getAtt("SshKeyName", cdk.ResolutionTypeHint.STRING));
    this.attrStateCode = cdk.Token.asNumber(this.getAtt("State.Code", cdk.ResolutionTypeHint.NUMBER));
    this.attrStateName = cdk.Token.asString(this.getAtt("State.Name", cdk.ResolutionTypeHint.STRING));
    this.attrSupportCode = cdk.Token.asString(this.getAtt("SupportCode", cdk.ResolutionTypeHint.STRING));
    this.attrUserName = cdk.Token.asString(this.getAtt("UserName", cdk.ResolutionTypeHint.STRING));
    this.addOns = props.addOns;
    this.availabilityZone = props.availabilityZone;
    this.blueprintId = props.blueprintId;
    this.bundleId = props.bundleId;
    this.hardware = props.hardware;
    this.instanceName = props.instanceName;
    this.keyPairName = props.keyPairName;
    this.location = props.location;
    this.networking = props.networking;
    this.state = props.state;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::Instance", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.userData = props.userData;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "addOns": this.addOns,
      "availabilityZone": this.availabilityZone,
      "blueprintId": this.blueprintId,
      "bundleId": this.bundleId,
      "hardware": this.hardware,
      "instanceName": this.instanceName,
      "keyPairName": this.keyPairName,
      "location": this.location,
      "networking": this.networking,
      "state": this.state,
      "tags": this.tags.renderTags(),
      "userData": this.userData
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnInstance.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnInstancePropsToCloudFormation(props);
  }
}

export namespace CfnInstance {
  /**
   * `Networking` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the public ports and the monthly amount of data transfer allocated for the instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html
   */
  export interface NetworkingProperty {
    /**
     * The monthly amount of data transfer, in GB, allocated for the instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html#cfn-lightsail-instance-networking-monthlytransfer
     */
    readonly monthlyTransfer?: cdk.IResolvable | CfnInstance.MonthlyTransferProperty;

    /**
     * An array of ports to open on the instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html#cfn-lightsail-instance-networking-ports
     */
    readonly ports: Array<cdk.IResolvable | CfnInstance.PortProperty> | cdk.IResolvable;
  }

  /**
   * `Port` is a property of the [Networking](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html) property. It describes information about ports for an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html
   */
  export interface PortProperty {
    /**
     * The access direction ( `inbound` or `outbound` ).
     *
     * > Lightsail currently supports only `inbound` access direction.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-accessdirection
     */
    readonly accessDirection?: string;

    /**
     * The location from which access is allowed.
     *
     * For example, `Anywhere (0.0.0.0/0)` , or `Custom` if a specific IP address or range of IP addresses is allowed.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-accessfrom
     */
    readonly accessFrom?: string;

    /**
     * The type of access ( `Public` or `Private` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-accesstype
     */
    readonly accessType?: string;

    /**
     * An alias that defines access for a preconfigured range of IP addresses.
     *
     * The only alias currently supported is `lightsail-connect` , which allows IP addresses of the browser-based RDP/SSH client in the Lightsail console to connect to your instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-cidrlistaliases
     */
    readonly cidrListAliases?: Array<string>;

    /**
     * The IPv4 address, or range of IPv4 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
     *
     * > The `ipv6Cidrs` parameter lists the IPv6 addresses that are allowed to connect to an instance.
     *
     * Examples:
     *
     * - To allow the IP address `192.0.2.44` , specify `192.0.2.44` or `192.0.2.44/32` .
     * - To allow the IP addresses `192.0.2.0` to `192.0.2.255` , specify `192.0.2.0/24` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-cidrs
     */
    readonly cidrs?: Array<string>;

    /**
     * The common name of the port information.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-commonname
     */
    readonly commonName?: string;

    /**
     * The first port in a range of open ports on an instance.
     *
     * Allowed ports:
     *
     * - TCP and UDP - `0` to `65535`
     * - ICMP - The ICMP type for IPv4 addresses. For example, specify `8` as the `fromPort` (ICMP type), and `-1` as the `toPort` (ICMP code), to enable ICMP Ping.
     * - ICMPv6 - The ICMP type for IPv6 addresses. For example, specify `128` as the `fromPort` (ICMPv6 type), and `0` as `toPort` (ICMPv6 code).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-fromport
     */
    readonly fromPort?: number;

    /**
     * The IPv6 address, or range of IPv6 addresses (in CIDR notation) that are allowed to connect to an instance through the ports, and the protocol.
     *
     * Only devices with an IPv6 address can connect to an instance through IPv6; otherwise, IPv4 should be used.
     *
     * > The `cidrs` parameter lists the IPv4 addresses that are allowed to connect to an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-ipv6cidrs
     */
    readonly ipv6Cidrs?: Array<string>;

    /**
     * The IP protocol name.
     *
     * The name can be one of the following:
     *
     * - `tcp` - Transmission Control Protocol (TCP) provides reliable, ordered, and error-checked delivery of streamed data between applications running on hosts communicating by an IP network. If you have an application that doesn't require reliable data stream service, use UDP instead.
     * - `all` - All transport layer protocol types.
     * - `udp` - With User Datagram Protocol (UDP), computer applications can send messages (or datagrams) to other hosts on an Internet Protocol (IP) network. Prior communications are not required to set up transmission channels or data paths. Applications that don't require reliable data stream service can use UDP, which provides a connectionless datagram service that emphasizes reduced latency over reliability. If you do require reliable data stream service, use TCP instead.
     * - `icmp` - Internet Control Message Protocol (ICMP) is used to send error messages and operational information indicating success or failure when communicating with an instance. For example, an error is indicated when an instance could not be reached. When you specify `icmp` as the `protocol` , you must specify the ICMP type using the `fromPort` parameter, and ICMP code using the `toPort` parameter.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-protocol
     */
    readonly protocol?: string;

    /**
     * The last port in a range of open ports on an instance.
     *
     * Allowed ports:
     *
     * - TCP and UDP - `0` to `65535`
     * - ICMP - The ICMP code for IPv4 addresses. For example, specify `8` as the `fromPort` (ICMP type), and `-1` as the `toPort` (ICMP code), to enable ICMP Ping.
     * - ICMPv6 - The ICMP code for IPv6 addresses. For example, specify `128` as the `fromPort` (ICMPv6 type), and `0` as `toPort` (ICMPv6 code).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-port.html#cfn-lightsail-instance-port-toport
     */
    readonly toPort?: number;
  }

  /**
   * `MonthlyTransfer` is a property of the [Networking](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-networking.html) property. It describes the amount of allocated monthly data transfer (in GB) for an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-monthlytransfer.html
   */
  export interface MonthlyTransferProperty {
    /**
     * The amount of allocated monthly data transfer (in GB) for an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-monthlytransfer.html#cfn-lightsail-instance-monthlytransfer-gbpermonthallocated
     */
    readonly gbPerMonthAllocated?: string;
  }

  /**
   * `State` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the status code and the state (for example, `running` ) of an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-state.html
   */
  export interface StateProperty {
    /**
     * The status code of the instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-state.html#cfn-lightsail-instance-state-code
     */
    readonly code?: number;

    /**
     * The state of the instance (for example, `running` or `pending` ).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-state.html#cfn-lightsail-instance-state-name
     */
    readonly name?: string;
  }

  /**
   * `AddOn` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the add-ons for an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html
   */
  export interface AddOnProperty {
    /**
     * The add-on type (for example, `AutoSnapshot` ).
     *
     * > `AutoSnapshot` is the only add-on that can be enabled for an instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html#cfn-lightsail-instance-addon-addontype
     */
    readonly addOnType: string;

    /**
     * The parameters for the automatic snapshot add-on, such as the daily time when an automatic snapshot will be created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html#cfn-lightsail-instance-addon-autosnapshotaddonrequest
     */
    readonly autoSnapshotAddOnRequest?: CfnInstance.AutoSnapshotAddOnProperty | cdk.IResolvable;

    /**
     * The status of the add-on.
     *
     * Valid Values: `Enabled` | `Disabled`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html#cfn-lightsail-instance-addon-status
     */
    readonly status?: string;
  }

  /**
   * `AutoSnapshotAddOn` is a property of the [AddOn](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-addon.html) property. It describes the automatic snapshot add-on for an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-autosnapshotaddon.html
   */
  export interface AutoSnapshotAddOnProperty {
    /**
     * The daily time when an automatic snapshot will be created.
     *
     * Constraints:
     *
     * - Must be in `HH:00` format, and in an hourly increment.
     * - Specified in Coordinated Universal Time (UTC).
     * - The snapshot will be automatically created between the time specified and up to 45 minutes after.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-autosnapshotaddon.html#cfn-lightsail-instance-autosnapshotaddon-snapshottimeofday
     */
    readonly snapshotTimeOfDay?: string;
  }

  /**
   * `Hardware` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html
   */
  export interface HardwareProperty {
    /**
     * The number of vCPUs the instance has.
     *
     * > The `CpuCount` property is read-only and should not be specified in a create instance or update instance request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html#cfn-lightsail-instance-hardware-cpucount
     */
    readonly cpuCount?: number;

    /**
     * The disks attached to the instance.
     *
     * The instance restarts when performing an attach disk or detach disk request. This resets the public IP address of your instance if a static IP isn't attached to it.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html#cfn-lightsail-instance-hardware-disks
     */
    readonly disks?: Array<CfnInstance.DiskProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The amount of RAM in GB on the instance (for example, `1.0` ).
     *
     * > The `RamSizeInGb` property is read-only and should not be specified in a create instance or update instance request.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html#cfn-lightsail-instance-hardware-ramsizeingb
     */
    readonly ramSizeInGb?: number;
  }

  /**
   * `Disk` is a property of the [Hardware](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-hardware.html) property. It describes a disk attached to an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html
   */
  export interface DiskProperty {
    /**
     * The resources to which the disk is attached.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-attachedto
     */
    readonly attachedTo?: string;

    /**
     * (Deprecated) The attachment state of the disk.
     *
     * > In releases prior to November 14, 2017, this parameter returned `attached` for system disks in the API response. It is now deprecated, but still included in the response. Use `isAttached` instead.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-attachmentstate
     */
    readonly attachmentState?: string;

    /**
     * The unique name of the disk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-diskname
     */
    readonly diskName: string;

    /**
     * The input/output operations per second (IOPS) of the disk.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-iops
     */
    readonly iops?: number;

    /**
     * A Boolean value indicating whether this disk is a system disk (has an operating system loaded on it).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-issystemdisk
     */
    readonly isSystemDisk?: boolean | cdk.IResolvable;

    /**
     * The disk path.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-path
     */
    readonly path: string;

    /**
     * The size of the disk in GB.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-disk.html#cfn-lightsail-instance-disk-sizeingb
     */
    readonly sizeInGb?: string;
  }

  /**
   * `Location` is a property of the [AWS::Lightsail::Instance](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html) resource. It describes the location for an instance.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-location.html
   */
  export interface LocationProperty {
    /**
     * The Availability Zone for the instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-location.html#cfn-lightsail-instance-location-availabilityzone
     */
    readonly availabilityZone?: string;

    /**
     * The name of the AWS Region for the instance.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-lightsail-instance-location.html#cfn-lightsail-instance-location-regionname
     */
    readonly regionName?: string;
  }
}

/**
 * Properties for defining a `CfnInstance`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html
 */
export interface CfnInstanceProps {
  /**
   * An array of add-ons for the instance.
   *
   * > If the instance has an add-on enabled when performing a delete instance request, the add-on is automatically disabled before the instance is deleted.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-addons
   */
  readonly addOns?: Array<CfnInstance.AddOnProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The Availability Zone for the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-availabilityzone
   */
  readonly availabilityZone?: string;

  /**
   * The blueprint ID for the instance (for example, `os_amlinux_2016_03` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-blueprintid
   */
  readonly blueprintId: string;

  /**
   * The bundle ID for the instance (for example, `micro_1_0` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-bundleid
   */
  readonly bundleId: string;

  /**
   * The hardware properties for the instance, such as the vCPU count, attached disks, and amount of RAM.
   *
   * > The instance restarts when performing an attach disk or detach disk request. This resets the public IP address of your instance if a static IP isn't attached to it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-hardware
   */
  readonly hardware?: CfnInstance.HardwareProperty | cdk.IResolvable;

  /**
   * The name of the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-instancename
   */
  readonly instanceName: string;

  /**
   * The name of the key pair to use for the instance.
   *
   * If no key pair name is specified, the Regional Lightsail default key pair is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-keypairname
   */
  readonly keyPairName?: string;

  /**
   * The location for the instance, such as the AWS Region and Availability Zone.
   *
   * > The `Location` property is read-only and should not be specified in a create instance or update instance request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-location
   */
  readonly location?: cdk.IResolvable | CfnInstance.LocationProperty;

  /**
   * The public ports and the monthly amount of data transfer allocated for the instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-networking
   */
  readonly networking?: cdk.IResolvable | CfnInstance.NetworkingProperty;

  /**
   * The status code and the state (for example, `running` ) of the instance.
   *
   * > The `State` property is read-only and should not be specified in a create instance or update instance request.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-state
   */
  readonly state?: cdk.IResolvable | CfnInstance.StateProperty;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The optional launch script for the instance.
   *
   * Specify a launch script to configure an instance with additional user data. For example, you might want to specify `apt-get -y update` as a launch script.
   *
   * > Depending on the blueprint of your instance, the command to get software on your instance varies. Amazon Linux and CentOS use `yum` , Debian and Ubuntu use `apt-get` , and FreeBSD uses `pkg` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-instance.html#cfn-lightsail-instance-userdata
   */
  readonly userData?: string;
}

/**
 * Determine whether the given properties match those of a `PortProperty`
 *
 * @param properties - the TypeScript properties of a `PortProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstancePortPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessDirection", cdk.validateString)(properties.accessDirection));
  errors.collect(cdk.propertyValidator("accessFrom", cdk.validateString)(properties.accessFrom));
  errors.collect(cdk.propertyValidator("accessType", cdk.validateString)(properties.accessType));
  errors.collect(cdk.propertyValidator("cidrListAliases", cdk.listValidator(cdk.validateString))(properties.cidrListAliases));
  errors.collect(cdk.propertyValidator("cidrs", cdk.listValidator(cdk.validateString))(properties.cidrs));
  errors.collect(cdk.propertyValidator("commonName", cdk.validateString)(properties.commonName));
  errors.collect(cdk.propertyValidator("fromPort", cdk.validateNumber)(properties.fromPort));
  errors.collect(cdk.propertyValidator("ipv6Cidrs", cdk.listValidator(cdk.validateString))(properties.ipv6Cidrs));
  errors.collect(cdk.propertyValidator("protocol", cdk.validateString)(properties.protocol));
  errors.collect(cdk.propertyValidator("toPort", cdk.validateNumber)(properties.toPort));
  return errors.wrap("supplied properties not correct for \"PortProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstancePortPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstancePortPropertyValidator(properties).assertSuccess();
  return {
    "AccessDirection": cdk.stringToCloudFormation(properties.accessDirection),
    "AccessFrom": cdk.stringToCloudFormation(properties.accessFrom),
    "AccessType": cdk.stringToCloudFormation(properties.accessType),
    "CidrListAliases": cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrListAliases),
    "Cidrs": cdk.listMapper(cdk.stringToCloudFormation)(properties.cidrs),
    "CommonName": cdk.stringToCloudFormation(properties.commonName),
    "FromPort": cdk.numberToCloudFormation(properties.fromPort),
    "Ipv6Cidrs": cdk.listMapper(cdk.stringToCloudFormation)(properties.ipv6Cidrs),
    "Protocol": cdk.stringToCloudFormation(properties.protocol),
    "ToPort": cdk.numberToCloudFormation(properties.toPort)
  };
}

// @ts-ignore TS6133
function CfnInstancePortPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstance.PortProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.PortProperty>();
  ret.addPropertyResult("accessDirection", "AccessDirection", (properties.AccessDirection != null ? cfn_parse.FromCloudFormation.getString(properties.AccessDirection) : undefined));
  ret.addPropertyResult("accessFrom", "AccessFrom", (properties.AccessFrom != null ? cfn_parse.FromCloudFormation.getString(properties.AccessFrom) : undefined));
  ret.addPropertyResult("accessType", "AccessType", (properties.AccessType != null ? cfn_parse.FromCloudFormation.getString(properties.AccessType) : undefined));
  ret.addPropertyResult("cidrListAliases", "CidrListAliases", (properties.CidrListAliases != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CidrListAliases) : undefined));
  ret.addPropertyResult("cidrs", "Cidrs", (properties.Cidrs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Cidrs) : undefined));
  ret.addPropertyResult("commonName", "CommonName", (properties.CommonName != null ? cfn_parse.FromCloudFormation.getString(properties.CommonName) : undefined));
  ret.addPropertyResult("fromPort", "FromPort", (properties.FromPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.FromPort) : undefined));
  ret.addPropertyResult("ipv6Cidrs", "Ipv6Cidrs", (properties.Ipv6Cidrs != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Ipv6Cidrs) : undefined));
  ret.addPropertyResult("protocol", "Protocol", (properties.Protocol != null ? cfn_parse.FromCloudFormation.getString(properties.Protocol) : undefined));
  ret.addPropertyResult("toPort", "ToPort", (properties.ToPort != null ? cfn_parse.FromCloudFormation.getNumber(properties.ToPort) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MonthlyTransferProperty`
 *
 * @param properties - the TypeScript properties of a `MonthlyTransferProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceMonthlyTransferPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("gbPerMonthAllocated", cdk.validateString)(properties.gbPerMonthAllocated));
  return errors.wrap("supplied properties not correct for \"MonthlyTransferProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceMonthlyTransferPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceMonthlyTransferPropertyValidator(properties).assertSuccess();
  return {
    "GbPerMonthAllocated": cdk.stringToCloudFormation(properties.gbPerMonthAllocated)
  };
}

// @ts-ignore TS6133
function CfnInstanceMonthlyTransferPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstance.MonthlyTransferProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.MonthlyTransferProperty>();
  ret.addPropertyResult("gbPerMonthAllocated", "GbPerMonthAllocated", (properties.GbPerMonthAllocated != null ? cfn_parse.FromCloudFormation.getString(properties.GbPerMonthAllocated) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkingProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceNetworkingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("monthlyTransfer", CfnInstanceMonthlyTransferPropertyValidator)(properties.monthlyTransfer));
  errors.collect(cdk.propertyValidator("ports", cdk.requiredValidator)(properties.ports));
  errors.collect(cdk.propertyValidator("ports", cdk.listValidator(CfnInstancePortPropertyValidator))(properties.ports));
  return errors.wrap("supplied properties not correct for \"NetworkingProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceNetworkingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceNetworkingPropertyValidator(properties).assertSuccess();
  return {
    "MonthlyTransfer": convertCfnInstanceMonthlyTransferPropertyToCloudFormation(properties.monthlyTransfer),
    "Ports": cdk.listMapper(convertCfnInstancePortPropertyToCloudFormation)(properties.ports)
  };
}

// @ts-ignore TS6133
function CfnInstanceNetworkingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstance.NetworkingProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.NetworkingProperty>();
  ret.addPropertyResult("monthlyTransfer", "MonthlyTransfer", (properties.MonthlyTransfer != null ? CfnInstanceMonthlyTransferPropertyFromCloudFormation(properties.MonthlyTransfer) : undefined));
  ret.addPropertyResult("ports", "Ports", (properties.Ports != null ? cfn_parse.FromCloudFormation.getArray(CfnInstancePortPropertyFromCloudFormation)(properties.Ports) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StateProperty`
 *
 * @param properties - the TypeScript properties of a `StateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceStatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("code", cdk.validateNumber)(properties.code));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"StateProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceStatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceStatePropertyValidator(properties).assertSuccess();
  return {
    "Code": cdk.numberToCloudFormation(properties.code),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnInstanceStatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstance.StateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.StateProperty>();
  ret.addPropertyResult("code", "Code", (properties.Code != null ? cfn_parse.FromCloudFormation.getNumber(properties.Code) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoSnapshotAddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AutoSnapshotAddOnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAutoSnapshotAddOnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("snapshotTimeOfDay", cdk.validateString)(properties.snapshotTimeOfDay));
  return errors.wrap("supplied properties not correct for \"AutoSnapshotAddOnProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAutoSnapshotAddOnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAutoSnapshotAddOnPropertyValidator(properties).assertSuccess();
  return {
    "SnapshotTimeOfDay": cdk.stringToCloudFormation(properties.snapshotTimeOfDay)
  };
}

// @ts-ignore TS6133
function CfnInstanceAutoSnapshotAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.AutoSnapshotAddOnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.AutoSnapshotAddOnProperty>();
  ret.addPropertyResult("snapshotTimeOfDay", "SnapshotTimeOfDay", (properties.SnapshotTimeOfDay != null ? cfn_parse.FromCloudFormation.getString(properties.SnapshotTimeOfDay) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddOnProperty`
 *
 * @param properties - the TypeScript properties of a `AddOnProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceAddOnPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addOnType", cdk.requiredValidator)(properties.addOnType));
  errors.collect(cdk.propertyValidator("addOnType", cdk.validateString)(properties.addOnType));
  errors.collect(cdk.propertyValidator("autoSnapshotAddOnRequest", CfnInstanceAutoSnapshotAddOnPropertyValidator)(properties.autoSnapshotAddOnRequest));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"AddOnProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceAddOnPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceAddOnPropertyValidator(properties).assertSuccess();
  return {
    "AddOnType": cdk.stringToCloudFormation(properties.addOnType),
    "AutoSnapshotAddOnRequest": convertCfnInstanceAutoSnapshotAddOnPropertyToCloudFormation(properties.autoSnapshotAddOnRequest),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnInstanceAddOnPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.AddOnProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.AddOnProperty>();
  ret.addPropertyResult("addOnType", "AddOnType", (properties.AddOnType != null ? cfn_parse.FromCloudFormation.getString(properties.AddOnType) : undefined));
  ret.addPropertyResult("autoSnapshotAddOnRequest", "AutoSnapshotAddOnRequest", (properties.AutoSnapshotAddOnRequest != null ? CfnInstanceAutoSnapshotAddOnPropertyFromCloudFormation(properties.AutoSnapshotAddOnRequest) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DiskProperty`
 *
 * @param properties - the TypeScript properties of a `DiskProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceDiskPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachedTo", cdk.validateString)(properties.attachedTo));
  errors.collect(cdk.propertyValidator("attachmentState", cdk.validateString)(properties.attachmentState));
  errors.collect(cdk.propertyValidator("diskName", cdk.requiredValidator)(properties.diskName));
  errors.collect(cdk.propertyValidator("diskName", cdk.validateString)(properties.diskName));
  errors.collect(cdk.propertyValidator("iops", cdk.validateNumber)(properties.iops));
  errors.collect(cdk.propertyValidator("isSystemDisk", cdk.validateBoolean)(properties.isSystemDisk));
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("sizeInGb", cdk.validateString)(properties.sizeInGb));
  return errors.wrap("supplied properties not correct for \"DiskProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceDiskPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceDiskPropertyValidator(properties).assertSuccess();
  return {
    "AttachedTo": cdk.stringToCloudFormation(properties.attachedTo),
    "AttachmentState": cdk.stringToCloudFormation(properties.attachmentState),
    "DiskName": cdk.stringToCloudFormation(properties.diskName),
    "IOPS": cdk.numberToCloudFormation(properties.iops),
    "IsSystemDisk": cdk.booleanToCloudFormation(properties.isSystemDisk),
    "Path": cdk.stringToCloudFormation(properties.path),
    "SizeInGb": cdk.stringToCloudFormation(properties.sizeInGb)
  };
}

// @ts-ignore TS6133
function CfnInstanceDiskPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.DiskProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.DiskProperty>();
  ret.addPropertyResult("attachedTo", "AttachedTo", (properties.AttachedTo != null ? cfn_parse.FromCloudFormation.getString(properties.AttachedTo) : undefined));
  ret.addPropertyResult("attachmentState", "AttachmentState", (properties.AttachmentState != null ? cfn_parse.FromCloudFormation.getString(properties.AttachmentState) : undefined));
  ret.addPropertyResult("diskName", "DiskName", (properties.DiskName != null ? cfn_parse.FromCloudFormation.getString(properties.DiskName) : undefined));
  ret.addPropertyResult("iops", "IOPS", (properties.IOPS != null ? cfn_parse.FromCloudFormation.getNumber(properties.IOPS) : undefined));
  ret.addPropertyResult("isSystemDisk", "IsSystemDisk", (properties.IsSystemDisk != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsSystemDisk) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("sizeInGb", "SizeInGb", (properties.SizeInGb != null ? cfn_parse.FromCloudFormation.getString(properties.SizeInGb) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HardwareProperty`
 *
 * @param properties - the TypeScript properties of a `HardwareProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceHardwarePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpuCount", cdk.validateNumber)(properties.cpuCount));
  errors.collect(cdk.propertyValidator("disks", cdk.listValidator(CfnInstanceDiskPropertyValidator))(properties.disks));
  errors.collect(cdk.propertyValidator("ramSizeInGb", cdk.validateNumber)(properties.ramSizeInGb));
  return errors.wrap("supplied properties not correct for \"HardwareProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceHardwarePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceHardwarePropertyValidator(properties).assertSuccess();
  return {
    "CpuCount": cdk.numberToCloudFormation(properties.cpuCount),
    "Disks": cdk.listMapper(convertCfnInstanceDiskPropertyToCloudFormation)(properties.disks),
    "RamSizeInGb": cdk.numberToCloudFormation(properties.ramSizeInGb)
  };
}

// @ts-ignore TS6133
function CfnInstanceHardwarePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstance.HardwareProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.HardwareProperty>();
  ret.addPropertyResult("cpuCount", "CpuCount", (properties.CpuCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.CpuCount) : undefined));
  ret.addPropertyResult("disks", "Disks", (properties.Disks != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceDiskPropertyFromCloudFormation)(properties.Disks) : undefined));
  ret.addPropertyResult("ramSizeInGb", "RamSizeInGb", (properties.RamSizeInGb != null ? cfn_parse.FromCloudFormation.getNumber(properties.RamSizeInGb) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LocationProperty`
 *
 * @param properties - the TypeScript properties of a `LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstanceLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("regionName", cdk.validateString)(properties.regionName));
  return errors.wrap("supplied properties not correct for \"LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnInstanceLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstanceLocationPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "RegionName": cdk.stringToCloudFormation(properties.regionName)
  };
}

// @ts-ignore TS6133
function CfnInstanceLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnInstance.LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstance.LocationProperty>();
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("regionName", "RegionName", (properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnInstanceProps`
 *
 * @param properties - the TypeScript properties of a `CfnInstanceProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnInstancePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addOns", cdk.listValidator(CfnInstanceAddOnPropertyValidator))(properties.addOns));
  errors.collect(cdk.propertyValidator("availabilityZone", cdk.validateString)(properties.availabilityZone));
  errors.collect(cdk.propertyValidator("blueprintId", cdk.requiredValidator)(properties.blueprintId));
  errors.collect(cdk.propertyValidator("blueprintId", cdk.validateString)(properties.blueprintId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.requiredValidator)(properties.bundleId));
  errors.collect(cdk.propertyValidator("bundleId", cdk.validateString)(properties.bundleId));
  errors.collect(cdk.propertyValidator("hardware", CfnInstanceHardwarePropertyValidator)(properties.hardware));
  errors.collect(cdk.propertyValidator("instanceName", cdk.requiredValidator)(properties.instanceName));
  errors.collect(cdk.propertyValidator("instanceName", cdk.validateString)(properties.instanceName));
  errors.collect(cdk.propertyValidator("keyPairName", cdk.validateString)(properties.keyPairName));
  errors.collect(cdk.propertyValidator("location", CfnInstanceLocationPropertyValidator)(properties.location));
  errors.collect(cdk.propertyValidator("networking", CfnInstanceNetworkingPropertyValidator)(properties.networking));
  errors.collect(cdk.propertyValidator("state", CfnInstanceStatePropertyValidator)(properties.state));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("userData", cdk.validateString)(properties.userData));
  return errors.wrap("supplied properties not correct for \"CfnInstanceProps\"");
}

// @ts-ignore TS6133
function convertCfnInstancePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnInstancePropsValidator(properties).assertSuccess();
  return {
    "AddOns": cdk.listMapper(convertCfnInstanceAddOnPropertyToCloudFormation)(properties.addOns),
    "AvailabilityZone": cdk.stringToCloudFormation(properties.availabilityZone),
    "BlueprintId": cdk.stringToCloudFormation(properties.blueprintId),
    "BundleId": cdk.stringToCloudFormation(properties.bundleId),
    "Hardware": convertCfnInstanceHardwarePropertyToCloudFormation(properties.hardware),
    "InstanceName": cdk.stringToCloudFormation(properties.instanceName),
    "KeyPairName": cdk.stringToCloudFormation(properties.keyPairName),
    "Location": convertCfnInstanceLocationPropertyToCloudFormation(properties.location),
    "Networking": convertCfnInstanceNetworkingPropertyToCloudFormation(properties.networking),
    "State": convertCfnInstanceStatePropertyToCloudFormation(properties.state),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "UserData": cdk.stringToCloudFormation(properties.userData)
  };
}

// @ts-ignore TS6133
function CfnInstancePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnInstanceProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnInstanceProps>();
  ret.addPropertyResult("addOns", "AddOns", (properties.AddOns != null ? cfn_parse.FromCloudFormation.getArray(CfnInstanceAddOnPropertyFromCloudFormation)(properties.AddOns) : undefined));
  ret.addPropertyResult("availabilityZone", "AvailabilityZone", (properties.AvailabilityZone != null ? cfn_parse.FromCloudFormation.getString(properties.AvailabilityZone) : undefined));
  ret.addPropertyResult("blueprintId", "BlueprintId", (properties.BlueprintId != null ? cfn_parse.FromCloudFormation.getString(properties.BlueprintId) : undefined));
  ret.addPropertyResult("bundleId", "BundleId", (properties.BundleId != null ? cfn_parse.FromCloudFormation.getString(properties.BundleId) : undefined));
  ret.addPropertyResult("hardware", "Hardware", (properties.Hardware != null ? CfnInstanceHardwarePropertyFromCloudFormation(properties.Hardware) : undefined));
  ret.addPropertyResult("instanceName", "InstanceName", (properties.InstanceName != null ? cfn_parse.FromCloudFormation.getString(properties.InstanceName) : undefined));
  ret.addPropertyResult("keyPairName", "KeyPairName", (properties.KeyPairName != null ? cfn_parse.FromCloudFormation.getString(properties.KeyPairName) : undefined));
  ret.addPropertyResult("location", "Location", (properties.Location != null ? CfnInstanceLocationPropertyFromCloudFormation(properties.Location) : undefined));
  ret.addPropertyResult("networking", "Networking", (properties.Networking != null ? CfnInstanceNetworkingPropertyFromCloudFormation(properties.Networking) : undefined));
  ret.addPropertyResult("state", "State", (properties.State != null ? CfnInstanceStatePropertyFromCloudFormation(properties.State) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("userData", "UserData", (properties.UserData != null ? cfn_parse.FromCloudFormation.getString(properties.UserData) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::LoadBalancer` resource specifies a load balancer that can be used with Lightsail instances.
 *
 * > You cannot attach a TLS certificate to a load balancer using the `AWS::Lightsail::LoadBalancer` resource type. Instead, use the `AWS::Lightsail::LoadBalancerTlsCertificate` resource type to create a certificate and attach it to a load balancer.
 *
 * @cloudformationResource AWS::Lightsail::LoadBalancer
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html
 */
export class CfnLoadBalancer extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::LoadBalancer";

  /**
   * Build a CfnLoadBalancer from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancer {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoadBalancerPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoadBalancer(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the load balancer.
   *
   * @cloudformationAttribute LoadBalancerArn
   */
  public readonly attrLoadBalancerArn: string;

  /**
   * The Lightsail instances to attach to the load balancer.
   */
  public attachedInstances?: Array<string>;

  /**
   * The path on the attached instance where the health check will be performed.
   */
  public healthCheckPath?: string;

  /**
   * The port that the load balancer uses to direct traffic to your Lightsail instances.
   */
  public instancePort: number;

  /**
   * The IP address type of the load balancer.
   */
  public ipAddressType?: string;

  /**
   * The name of the load balancer.
   */
  public loadBalancerName: string;

  /**
   * A Boolean value indicating whether session stickiness is enabled.
   */
  public sessionStickinessEnabled?: boolean | cdk.IResolvable;

  /**
   * The time period, in seconds, after which the load balancer session stickiness cookie should be considered stale.
   */
  public sessionStickinessLbCookieDurationSeconds?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * An array of key-value pairs to apply to this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The name of the TLS security policy for the load balancer.
   */
  public tlsPolicyName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerProps) {
    super(scope, id, {
      "type": CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "instancePort", this);
    cdk.requireProperty(props, "loadBalancerName", this);

    this.attrLoadBalancerArn = cdk.Token.asString(this.getAtt("LoadBalancerArn", cdk.ResolutionTypeHint.STRING));
    this.attachedInstances = props.attachedInstances;
    this.healthCheckPath = props.healthCheckPath;
    this.instancePort = props.instancePort;
    this.ipAddressType = props.ipAddressType;
    this.loadBalancerName = props.loadBalancerName;
    this.sessionStickinessEnabled = props.sessionStickinessEnabled;
    this.sessionStickinessLbCookieDurationSeconds = props.sessionStickinessLbCookieDurationSeconds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::Lightsail::LoadBalancer", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tlsPolicyName = props.tlsPolicyName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attachedInstances": this.attachedInstances,
      "healthCheckPath": this.healthCheckPath,
      "instancePort": this.instancePort,
      "ipAddressType": this.ipAddressType,
      "loadBalancerName": this.loadBalancerName,
      "sessionStickinessEnabled": this.sessionStickinessEnabled,
      "sessionStickinessLbCookieDurationSeconds": this.sessionStickinessLbCookieDurationSeconds,
      "tags": this.tags.renderTags(),
      "tlsPolicyName": this.tlsPolicyName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancer.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoadBalancerPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLoadBalancer`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html
 */
export interface CfnLoadBalancerProps {
  /**
   * The Lightsail instances to attach to the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-attachedinstances
   */
  readonly attachedInstances?: Array<string>;

  /**
   * The path on the attached instance where the health check will be performed.
   *
   * If no path is specified, the load balancer tries to make a request to the default (root) page ( `/index.html` ).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-healthcheckpath
   */
  readonly healthCheckPath?: string;

  /**
   * The port that the load balancer uses to direct traffic to your Lightsail instances.
   *
   * For HTTP traffic, specify port `80` . For HTTPS traffic, specify port `443` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-instanceport
   */
  readonly instancePort: number;

  /**
   * The IP address type of the load balancer.
   *
   * The possible values are `ipv4` for IPv4 only, and `dualstack` for both IPv4 and IPv6.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-ipaddresstype
   */
  readonly ipAddressType?: string;

  /**
   * The name of the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-loadbalancername
   */
  readonly loadBalancerName: string;

  /**
   * A Boolean value indicating whether session stickiness is enabled.
   *
   * Enable session stickiness (also known as *session affinity* ) to bind a user's session to a specific instance. This ensures that all requests from the user during the session are sent to the same instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-sessionstickinessenabled
   */
  readonly sessionStickinessEnabled?: boolean | cdk.IResolvable;

  /**
   * The time period, in seconds, after which the load balancer session stickiness cookie should be considered stale.
   *
   * If you do not specify this parameter, the default value is 0, which indicates that the sticky session should last for the duration of the browser session.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-sessionstickinesslbcookiedurationseconds
   */
  readonly sessionStickinessLbCookieDurationSeconds?: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) in the *AWS CloudFormation User Guide* .
   *
   * > The `Value` of `Tags` is optional for Lightsail resources.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The name of the TLS security policy for the load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancer.html#cfn-lightsail-loadbalancer-tlspolicyname
   */
  readonly tlsPolicyName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnLoadBalancerProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachedInstances", cdk.listValidator(cdk.validateString))(properties.attachedInstances));
  errors.collect(cdk.propertyValidator("healthCheckPath", cdk.validateString)(properties.healthCheckPath));
  errors.collect(cdk.propertyValidator("instancePort", cdk.requiredValidator)(properties.instancePort));
  errors.collect(cdk.propertyValidator("instancePort", cdk.validateNumber)(properties.instancePort));
  errors.collect(cdk.propertyValidator("ipAddressType", cdk.validateString)(properties.ipAddressType));
  errors.collect(cdk.propertyValidator("loadBalancerName", cdk.requiredValidator)(properties.loadBalancerName));
  errors.collect(cdk.propertyValidator("loadBalancerName", cdk.validateString)(properties.loadBalancerName));
  errors.collect(cdk.propertyValidator("sessionStickinessEnabled", cdk.validateBoolean)(properties.sessionStickinessEnabled));
  errors.collect(cdk.propertyValidator("sessionStickinessLbCookieDurationSeconds", cdk.validateString)(properties.sessionStickinessLbCookieDurationSeconds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("tlsPolicyName", cdk.validateString)(properties.tlsPolicyName));
  return errors.wrap("supplied properties not correct for \"CfnLoadBalancerProps\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerPropsValidator(properties).assertSuccess();
  return {
    "AttachedInstances": cdk.listMapper(cdk.stringToCloudFormation)(properties.attachedInstances),
    "HealthCheckPath": cdk.stringToCloudFormation(properties.healthCheckPath),
    "InstancePort": cdk.numberToCloudFormation(properties.instancePort),
    "IpAddressType": cdk.stringToCloudFormation(properties.ipAddressType),
    "LoadBalancerName": cdk.stringToCloudFormation(properties.loadBalancerName),
    "SessionStickinessEnabled": cdk.booleanToCloudFormation(properties.sessionStickinessEnabled),
    "SessionStickinessLBCookieDurationSeconds": cdk.stringToCloudFormation(properties.sessionStickinessLbCookieDurationSeconds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TlsPolicyName": cdk.stringToCloudFormation(properties.tlsPolicyName)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerProps>();
  ret.addPropertyResult("attachedInstances", "AttachedInstances", (properties.AttachedInstances != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AttachedInstances) : undefined));
  ret.addPropertyResult("healthCheckPath", "HealthCheckPath", (properties.HealthCheckPath != null ? cfn_parse.FromCloudFormation.getString(properties.HealthCheckPath) : undefined));
  ret.addPropertyResult("instancePort", "InstancePort", (properties.InstancePort != null ? cfn_parse.FromCloudFormation.getNumber(properties.InstancePort) : undefined));
  ret.addPropertyResult("ipAddressType", "IpAddressType", (properties.IpAddressType != null ? cfn_parse.FromCloudFormation.getString(properties.IpAddressType) : undefined));
  ret.addPropertyResult("loadBalancerName", "LoadBalancerName", (properties.LoadBalancerName != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName) : undefined));
  ret.addPropertyResult("sessionStickinessEnabled", "SessionStickinessEnabled", (properties.SessionStickinessEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SessionStickinessEnabled) : undefined));
  ret.addPropertyResult("sessionStickinessLbCookieDurationSeconds", "SessionStickinessLBCookieDurationSeconds", (properties.SessionStickinessLBCookieDurationSeconds != null ? cfn_parse.FromCloudFormation.getString(properties.SessionStickinessLBCookieDurationSeconds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("tlsPolicyName", "TlsPolicyName", (properties.TlsPolicyName != null ? cfn_parse.FromCloudFormation.getString(properties.TlsPolicyName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::LoadBalancerTlsCertificate` resource specifies a TLS certificate that can be used with a Lightsail load balancer.
 *
 * @cloudformationResource AWS::Lightsail::LoadBalancerTlsCertificate
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html
 */
export class CfnLoadBalancerTlsCertificate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::LoadBalancerTlsCertificate";

  /**
   * Build a CfnLoadBalancerTlsCertificate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLoadBalancerTlsCertificate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLoadBalancerTlsCertificatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLoadBalancerTlsCertificate(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the SSL/TLS certificate.
   *
   * @cloudformationAttribute LoadBalancerTlsCertificateArn
   */
  public readonly attrLoadBalancerTlsCertificateArn: string;

  /**
   * The validation status of the SSL/TLS certificate.
   *
   * Valid Values: `PENDING_VALIDATION` | `ISSUED` | `INACTIVE` | `EXPIRED` | `VALIDATION_TIMED_OUT` | `REVOKED` | `FAILED` | `UNKNOWN`
   *
   * @cloudformationAttribute Status
   */
  public readonly attrStatus: string;

  /**
   * An array of alternative domain names and subdomain names for your SSL/TLS certificate.
   */
  public certificateAlternativeNames?: Array<string>;

  /**
   * The domain name for the SSL/TLS certificate.
   */
  public certificateDomainName: string;

  /**
   * The name of the SSL/TLS certificate.
   */
  public certificateName: string;

  /**
   * A Boolean value indicating whether HTTPS redirection is enabled for the load balancer that the TLS certificate is attached to.
   */
  public httpsRedirectionEnabled?: boolean | cdk.IResolvable;

  /**
   * A Boolean value indicating whether the SSL/TLS certificate is attached to a Lightsail load balancer.
   */
  public isAttached?: boolean | cdk.IResolvable;

  /**
   * The name of the load balancer that the SSL/TLS certificate is attached to.
   */
  public loadBalancerName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLoadBalancerTlsCertificateProps) {
    super(scope, id, {
      "type": CfnLoadBalancerTlsCertificate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "certificateDomainName", this);
    cdk.requireProperty(props, "certificateName", this);
    cdk.requireProperty(props, "loadBalancerName", this);

    this.attrLoadBalancerTlsCertificateArn = cdk.Token.asString(this.getAtt("LoadBalancerTlsCertificateArn", cdk.ResolutionTypeHint.STRING));
    this.attrStatus = cdk.Token.asString(this.getAtt("Status", cdk.ResolutionTypeHint.STRING));
    this.certificateAlternativeNames = props.certificateAlternativeNames;
    this.certificateDomainName = props.certificateDomainName;
    this.certificateName = props.certificateName;
    this.httpsRedirectionEnabled = props.httpsRedirectionEnabled;
    this.isAttached = props.isAttached;
    this.loadBalancerName = props.loadBalancerName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "certificateAlternativeNames": this.certificateAlternativeNames,
      "certificateDomainName": this.certificateDomainName,
      "certificateName": this.certificateName,
      "httpsRedirectionEnabled": this.httpsRedirectionEnabled,
      "isAttached": this.isAttached,
      "loadBalancerName": this.loadBalancerName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLoadBalancerTlsCertificate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLoadBalancerTlsCertificatePropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnLoadBalancerTlsCertificate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html
 */
export interface CfnLoadBalancerTlsCertificateProps {
  /**
   * An array of alternative domain names and subdomain names for your SSL/TLS certificate.
   *
   * In addition to the primary domain name, you can have up to nine alternative domain names. Wildcards (such as `*.example.com` ) are not supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatealternativenames
   */
  readonly certificateAlternativeNames?: Array<string>;

  /**
   * The domain name for the SSL/TLS certificate.
   *
   * For example, `example.com` or `www.example.com` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatedomainname
   */
  readonly certificateDomainName: string;

  /**
   * The name of the SSL/TLS certificate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-certificatename
   */
  readonly certificateName: string;

  /**
   * A Boolean value indicating whether HTTPS redirection is enabled for the load balancer that the TLS certificate is attached to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-httpsredirectionenabled
   */
  readonly httpsRedirectionEnabled?: boolean | cdk.IResolvable;

  /**
   * A Boolean value indicating whether the SSL/TLS certificate is attached to a Lightsail load balancer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-isattached
   */
  readonly isAttached?: boolean | cdk.IResolvable;

  /**
   * The name of the load balancer that the SSL/TLS certificate is attached to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-loadbalancertlscertificate.html#cfn-lightsail-loadbalancertlscertificate-loadbalancername
   */
  readonly loadBalancerName: string;
}

/**
 * Determine whether the given properties match those of a `CfnLoadBalancerTlsCertificateProps`
 *
 * @param properties - the TypeScript properties of a `CfnLoadBalancerTlsCertificateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLoadBalancerTlsCertificatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("certificateAlternativeNames", cdk.listValidator(cdk.validateString))(properties.certificateAlternativeNames));
  errors.collect(cdk.propertyValidator("certificateDomainName", cdk.requiredValidator)(properties.certificateDomainName));
  errors.collect(cdk.propertyValidator("certificateDomainName", cdk.validateString)(properties.certificateDomainName));
  errors.collect(cdk.propertyValidator("certificateName", cdk.requiredValidator)(properties.certificateName));
  errors.collect(cdk.propertyValidator("certificateName", cdk.validateString)(properties.certificateName));
  errors.collect(cdk.propertyValidator("httpsRedirectionEnabled", cdk.validateBoolean)(properties.httpsRedirectionEnabled));
  errors.collect(cdk.propertyValidator("isAttached", cdk.validateBoolean)(properties.isAttached));
  errors.collect(cdk.propertyValidator("loadBalancerName", cdk.requiredValidator)(properties.loadBalancerName));
  errors.collect(cdk.propertyValidator("loadBalancerName", cdk.validateString)(properties.loadBalancerName));
  return errors.wrap("supplied properties not correct for \"CfnLoadBalancerTlsCertificateProps\"");
}

// @ts-ignore TS6133
function convertCfnLoadBalancerTlsCertificatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLoadBalancerTlsCertificatePropsValidator(properties).assertSuccess();
  return {
    "CertificateAlternativeNames": cdk.listMapper(cdk.stringToCloudFormation)(properties.certificateAlternativeNames),
    "CertificateDomainName": cdk.stringToCloudFormation(properties.certificateDomainName),
    "CertificateName": cdk.stringToCloudFormation(properties.certificateName),
    "HttpsRedirectionEnabled": cdk.booleanToCloudFormation(properties.httpsRedirectionEnabled),
    "IsAttached": cdk.booleanToCloudFormation(properties.isAttached),
    "LoadBalancerName": cdk.stringToCloudFormation(properties.loadBalancerName)
  };
}

// @ts-ignore TS6133
function CfnLoadBalancerTlsCertificatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLoadBalancerTlsCertificateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLoadBalancerTlsCertificateProps>();
  ret.addPropertyResult("certificateAlternativeNames", "CertificateAlternativeNames", (properties.CertificateAlternativeNames != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CertificateAlternativeNames) : undefined));
  ret.addPropertyResult("certificateDomainName", "CertificateDomainName", (properties.CertificateDomainName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateDomainName) : undefined));
  ret.addPropertyResult("certificateName", "CertificateName", (properties.CertificateName != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateName) : undefined));
  ret.addPropertyResult("httpsRedirectionEnabled", "HttpsRedirectionEnabled", (properties.HttpsRedirectionEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.HttpsRedirectionEnabled) : undefined));
  ret.addPropertyResult("isAttached", "IsAttached", (properties.IsAttached != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsAttached) : undefined));
  ret.addPropertyResult("loadBalancerName", "LoadBalancerName", (properties.LoadBalancerName != null ? cfn_parse.FromCloudFormation.getString(properties.LoadBalancerName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::Lightsail::StaticIp` resource specifies a static IP that can be attached to an Amazon Lightsail instance that is in the same AWS Region and Availability Zone.
 *
 * @cloudformationResource AWS::Lightsail::StaticIp
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html
 */
export class CfnStaticIp extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Lightsail::StaticIp";

  /**
   * Build a CfnStaticIp from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStaticIp {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStaticIpPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStaticIp(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The IP address of the static IP.
   *
   * @cloudformationAttribute IpAddress
   */
  public readonly attrIpAddress: string;

  /**
   * A Boolean value indicating whether the static IP is attached to an instance.
   *
   * @cloudformationAttribute IsAttached
   */
  public readonly attrIsAttached: cdk.IResolvable;

  /**
   * The Amazon Resource Name (ARN) of the static IP (for example, `arn:aws:lightsail:us-east-2:123456789101:StaticIp/244ad76f-8aad-4741-809f-12345EXAMPLE` ).
   *
   * @cloudformationAttribute StaticIpArn
   */
  public readonly attrStaticIpArn: string;

  /**
   * The instance that the static IP is attached to.
   */
  public attachedTo?: string;

  /**
   * The name of the static IP.
   */
  public staticIpName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStaticIpProps) {
    super(scope, id, {
      "type": CfnStaticIp.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "staticIpName", this);

    this.attrIpAddress = cdk.Token.asString(this.getAtt("IpAddress", cdk.ResolutionTypeHint.STRING));
    this.attrIsAttached = this.getAtt("IsAttached");
    this.attrStaticIpArn = cdk.Token.asString(this.getAtt("StaticIpArn", cdk.ResolutionTypeHint.STRING));
    this.attachedTo = props.attachedTo;
    this.staticIpName = props.staticIpName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "attachedTo": this.attachedTo,
      "staticIpName": this.staticIpName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStaticIp.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStaticIpPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnStaticIp`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html
 */
export interface CfnStaticIpProps {
  /**
   * The instance that the static IP is attached to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html#cfn-lightsail-staticip-attachedto
   */
  readonly attachedTo?: string;

  /**
   * The name of the static IP.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lightsail-staticip.html#cfn-lightsail-staticip-staticipname
   */
  readonly staticIpName: string;
}

/**
 * Determine whether the given properties match those of a `CfnStaticIpProps`
 *
 * @param properties - the TypeScript properties of a `CfnStaticIpProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStaticIpPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("attachedTo", cdk.validateString)(properties.attachedTo));
  errors.collect(cdk.propertyValidator("staticIpName", cdk.requiredValidator)(properties.staticIpName));
  errors.collect(cdk.propertyValidator("staticIpName", cdk.validateString)(properties.staticIpName));
  return errors.wrap("supplied properties not correct for \"CfnStaticIpProps\"");
}

// @ts-ignore TS6133
function convertCfnStaticIpPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStaticIpPropsValidator(properties).assertSuccess();
  return {
    "AttachedTo": cdk.stringToCloudFormation(properties.attachedTo),
    "StaticIpName": cdk.stringToCloudFormation(properties.staticIpName)
  };
}

// @ts-ignore TS6133
function CfnStaticIpPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStaticIpProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStaticIpProps>();
  ret.addPropertyResult("attachedTo", "AttachedTo", (properties.AttachedTo != null ? cfn_parse.FromCloudFormation.getString(properties.AttachedTo) : undefined));
  ret.addPropertyResult("staticIpName", "StaticIpName", (properties.StaticIpName != null ? cfn_parse.FromCloudFormation.getString(properties.StaticIpName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}