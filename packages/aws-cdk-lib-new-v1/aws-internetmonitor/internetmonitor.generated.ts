/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::InternetMonitor::Monitor` resource is an Internet Monitor resource type that contains information about how you create a monitor in Amazon CloudWatch Internet Monitor.
 *
 * A monitor in Internet Monitor provides visibility into performance and availability between your applications hosted on AWS and your end users, using a traffic profile that it creates based on the application resources that you add: Virtual Private Clouds (VPCs), Amazon CloudFront distributions, or WorkSpaces directories.
 *
 * Internet Monitor also alerts you to internet issues that impact your application in the city-networks (geographies and networks) where your end users use it. With Internet Monitor, you can quickly pinpoint the locations and providers that are affected, so that you can address the issue.
 *
 * For more information, see [Using Amazon CloudWatch Internet Monitor](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-InternetMonitor.html) in the *Amazon CloudWatch User Guide* .
 *
 * @cloudformationResource AWS::InternetMonitor::Monitor
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html
 */
export class CfnMonitor extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::InternetMonitor::Monitor";

  /**
   * Build a CfnMonitor from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnMonitor {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnMonitorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnMonitor(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The time when the monitor was created.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The last time that the monitor was modified.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * The Amazon Resource Name (ARN) of the monitor.
   *
   * @cloudformationAttribute MonitorArn
   */
  public readonly attrMonitorArn: string;

  /**
   * The health of data processing for the monitor. For more information, see `ProcessingStatus` under [MonitorListMember](https://docs.aws.amazon.com/internet-monitor/latest/api/API_MonitorListMember.html) in the *Amazon CloudWatch Internet Monitor API Reference* .
   *
   * @cloudformationAttribute ProcessingStatus
   */
  public readonly attrProcessingStatus: string;

  /**
   * Additional information about the health of the data processing for the monitor.
   *
   * @cloudformationAttribute ProcessingStatusInfo
   */
  public readonly attrProcessingStatusInfo: string;

  /**
   * A complex type with the configuration information that determines the threshold and other conditions for when Internet Monitor creates a health event for an overall performance or availability issue, across an application's geographies.
   */
  public healthEventsConfig?: CfnMonitor.HealthEventsConfigProperty | cdk.IResolvable;

  /**
   * Publish internet measurements for a monitor for all city-networks (up to the 500,000 service limit) to another location, such as an Amazon S3 bucket.
   */
  public internetMeasurementsLogDelivery?: CfnMonitor.InternetMeasurementsLogDeliveryProperty | cdk.IResolvable;

  /**
   * The maximum number of city-networks to monitor for your resources.
   */
  public maxCityNetworksToMonitor?: number;

  /**
   * The name of the monitor.
   */
  public monitorName: string;

  /**
   * The resources that have been added for the monitor, listed by their Amazon Resource Names (ARNs).
   */
  public resources?: Array<string>;

  /**
   * The resources to include in a monitor, which you provide as a set of Amazon Resource Names (ARNs).
   */
  public resourcesToAdd?: Array<string>;

  /**
   * The resources to remove from a monitor, which you provide as a set of Amazon Resource Names (ARNs).
   */
  public resourcesToRemove?: Array<string>;

  /**
   * The status of a monitor.
   */
  public status?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags for a monitor, listed as a set of *key:value* pairs.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The percentage of the internet-facing traffic for your application that you want to monitor.
   */
  public trafficPercentageToMonitor?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnMonitorProps) {
    super(scope, id, {
      "type": CfnMonitor.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "monitorName", this);

    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.attrMonitorArn = cdk.Token.asString(this.getAtt("MonitorArn", cdk.ResolutionTypeHint.STRING));
    this.attrProcessingStatus = cdk.Token.asString(this.getAtt("ProcessingStatus", cdk.ResolutionTypeHint.STRING));
    this.attrProcessingStatusInfo = cdk.Token.asString(this.getAtt("ProcessingStatusInfo", cdk.ResolutionTypeHint.STRING));
    this.healthEventsConfig = props.healthEventsConfig;
    this.internetMeasurementsLogDelivery = props.internetMeasurementsLogDelivery;
    this.maxCityNetworksToMonitor = props.maxCityNetworksToMonitor;
    this.monitorName = props.monitorName;
    this.resources = props.resources;
    this.resourcesToAdd = props.resourcesToAdd;
    this.resourcesToRemove = props.resourcesToRemove;
    this.status = props.status;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::InternetMonitor::Monitor", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.trafficPercentageToMonitor = props.trafficPercentageToMonitor;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "healthEventsConfig": this.healthEventsConfig,
      "internetMeasurementsLogDelivery": this.internetMeasurementsLogDelivery,
      "maxCityNetworksToMonitor": this.maxCityNetworksToMonitor,
      "monitorName": this.monitorName,
      "resources": this.resources,
      "resourcesToAdd": this.resourcesToAdd,
      "resourcesToRemove": this.resourcesToRemove,
      "status": this.status,
      "tags": this.tags.renderTags(),
      "trafficPercentageToMonitor": this.trafficPercentageToMonitor
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnMonitor.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnMonitorPropsToCloudFormation(props);
  }
}

export namespace CfnMonitor {
  /**
   * Define the health event threshold percentages for the performance score and availability score for your application's monitor.
   *
   * Amazon CloudWatch Internet Monitor creates a health event when there's an internet issue that affects your application end users where a health score percentage is at or below a set threshold.
   *
   * If you don't set a health event threshold, the default value is 95%.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-healtheventsconfig.html
   */
  export interface HealthEventsConfigProperty {
    /**
     * The configuration that determines the threshold and other conditions for when Internet Monitor creates a health event for a local availability issue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-healtheventsconfig.html#cfn-internetmonitor-monitor-healtheventsconfig-availabilitylocalhealtheventsconfig
     */
    readonly availabilityLocalHealthEventsConfig?: cdk.IResolvable | CfnMonitor.LocalHealthEventsConfigProperty;

    /**
     * The health event threshold percentage set for availability scores.
     *
     * When the overall availability score is at or below this percentage, Internet Monitor creates a health event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-healtheventsconfig.html#cfn-internetmonitor-monitor-healtheventsconfig-availabilityscorethreshold
     */
    readonly availabilityScoreThreshold?: number;

    /**
     * The configuration that determines the threshold and other conditions for when Internet Monitor creates a health event for a local performance issue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-healtheventsconfig.html#cfn-internetmonitor-monitor-healtheventsconfig-performancelocalhealtheventsconfig
     */
    readonly performanceLocalHealthEventsConfig?: cdk.IResolvable | CfnMonitor.LocalHealthEventsConfigProperty;

    /**
     * The health event threshold percentage set for performance scores.
     *
     * When the overall performance score is at or below this percentage, Internet Monitor creates a health event.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-healtheventsconfig.html#cfn-internetmonitor-monitor-healtheventsconfig-performancescorethreshold
     */
    readonly performanceScoreThreshold?: number;
  }

  /**
   * Configuration information that determines the threshold and other conditions for when Internet Monitor creates a health event for a local performance or availability issue, when scores cross a threshold for one or more city-networks.
   *
   * Defines the percentages, for performance scores or availability scores, that are the local thresholds for when Amazon CloudWatch Internet Monitor creates a health event. Also defines whether a local threshold is enabled or disabled, and the minimum percentage of overall traffic that must be impacted by an issue before Internet Monitor creates an event when a	threshold is crossed for a local health score.
   *
   * If you don't set a local health event threshold, the default value is 60%.
   *
   * For more information, see [Change health event thresholds](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-overview.html#IMUpdateThresholdFromOverview) in the Internet Monitor section of the *Amazon CloudWatch User Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-localhealtheventsconfig.html
   */
  export interface LocalHealthEventsConfigProperty {
    /**
     * The health event threshold percentage set for a local health score.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-localhealtheventsconfig.html#cfn-internetmonitor-monitor-localhealtheventsconfig-healthscorethreshold
     */
    readonly healthScoreThreshold?: number;

    /**
     * The minimum percentage of overall traffic for an application that must be impacted by an issue before Internet Monitor creates an event when a threshold is crossed for a local health score.
     *
     * If you don't set a minimum traffic impact threshold, the default value is 0.01%.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-localhealtheventsconfig.html#cfn-internetmonitor-monitor-localhealtheventsconfig-mintrafficimpact
     */
    readonly minTrafficImpact?: number;

    /**
     * The status of whether Internet Monitor creates a health event based on a threshold percentage set for a local health score.
     *
     * The status can be `ENABLED` or `DISABLED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-localhealtheventsconfig.html#cfn-internetmonitor-monitor-localhealtheventsconfig-status
     */
    readonly status?: string;
  }

  /**
   * Publish internet measurements to an Amazon S3 bucket in addition to CloudWatch Logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-internetmeasurementslogdelivery.html
   */
  export interface InternetMeasurementsLogDeliveryProperty {
    /**
     * The configuration for publishing Amazon CloudWatch Internet Monitor internet measurements to Amazon S3.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-internetmeasurementslogdelivery.html#cfn-internetmonitor-monitor-internetmeasurementslogdelivery-s3config
     */
    readonly s3Config?: cdk.IResolvable | CfnMonitor.S3ConfigProperty;
  }

  /**
   * The configuration for publishing Amazon CloudWatch Internet Monitor internet measurements to Amazon S3.
   *
   * The configuration includes the bucket name and (optionally) bucket prefix for the S3 bucket to store the measurements, and the delivery status. The delivery status is `ENABLED` if you choose to deliver internet measurements to S3 logs, and `DISABLED` otherwise.
   *
   * The measurements are also published to Amazon CloudWatch Logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-s3config.html
   */
  export interface S3ConfigProperty {
    /**
     * The Amazon S3 bucket name for internet measurements publishing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-s3config.html#cfn-internetmonitor-monitor-s3config-bucketname
     */
    readonly bucketName?: string;

    /**
     * An optional Amazon S3 bucket prefix for internet measurements publishing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-s3config.html#cfn-internetmonitor-monitor-s3config-bucketprefix
     */
    readonly bucketPrefix?: string;

    /**
     * The status of publishing Internet Monitor internet measurements to an Amazon S3 bucket.
     *
     * The delivery status is `ENABLED` if you choose to deliver internet measurements to an S3 bucket, and `DISABLED` otherwise.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-internetmonitor-monitor-s3config.html#cfn-internetmonitor-monitor-s3config-logdeliverystatus
     */
    readonly logDeliveryStatus?: string;
  }
}

/**
 * Properties for defining a `CfnMonitor`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html
 */
export interface CfnMonitorProps {
  /**
   * A complex type with the configuration information that determines the threshold and other conditions for when Internet Monitor creates a health event for an overall performance or availability issue, across an application's geographies.
   *
   * Defines the percentages, for overall performance scores and availability scores for an application, that are the thresholds for when Amazon CloudWatch Internet Monitor creates a health event. You can override the defaults to set a custom threshold for overall performance or availability scores, or both.
   *
   * You can also set thresholds for local health scores,, where Internet Monitor creates a health event when scores cross a threshold for one or more city-networks, in addition to creating an event when an overall score crosses a threshold.
   *
   * If you don't set a health event threshold, the default value is 95%.
   *
   * For local thresholds, you also set a minimum percentage of overall traffic that is impacted by an issue before Internet Monitor creates an event. In addition, you can disable local thresholds, for performance scores, availability scores, or both.
   *
   * For more information, see [Change health event thresholds](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-IM-overview.html#IMUpdateThresholdFromOverview) in the Internet Monitor section of the *CloudWatch User Guide* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-healtheventsconfig
   */
  readonly healthEventsConfig?: CfnMonitor.HealthEventsConfigProperty | cdk.IResolvable;

  /**
   * Publish internet measurements for a monitor for all city-networks (up to the 500,000 service limit) to another location, such as an Amazon S3 bucket.
   *
   * Measurements are also published to Amazon CloudWatch Logs for the first 500 (by traffic volume) city-networks (client locations and ASNs, typically internet service providers or ISPs).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-internetmeasurementslogdelivery
   */
  readonly internetMeasurementsLogDelivery?: CfnMonitor.InternetMeasurementsLogDeliveryProperty | cdk.IResolvable;

  /**
   * The maximum number of city-networks to monitor for your resources.
   *
   * A city-network is the location (city) where clients access your application resources from and the network, such as an internet service provider, that clients access the resources through.
   *
   * For more information, see [Choosing a city-network maximum value](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/IMCityNetworksMaximum.html) in *Using Amazon CloudWatch Internet Monitor* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-maxcitynetworkstomonitor
   */
  readonly maxCityNetworksToMonitor?: number;

  /**
   * The name of the monitor.
   *
   * A monitor name can contain only alphanumeric characters, dashes (-), periods (.), and underscores (_).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-monitorname
   */
  readonly monitorName: string;

  /**
   * The resources that have been added for the monitor, listed by their Amazon Resource Names (ARNs).
   *
   * Use this option to add or remove resources when making an update.
   *
   * > Be aware that if you include content in the `Resources` field when you update a monitor, the `ResourcesToAdd` and `ResourcesToRemove` fields must be empty.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-resources
   */
  readonly resources?: Array<string>;

  /**
   * The resources to include in a monitor, which you provide as a set of Amazon Resource Names (ARNs).
   *
   * Resources can be Amazon Virtual Private Cloud VPCs, Network Load Balancers (NLBs), Amazon CloudFront distributions, or Amazon WorkSpaces directories.
   *
   * You can add a combination of VPCs and CloudFront distributions, or you can add WorkSpaces directories, or you can add NLBs. You can't add NLBs or WorkSpaces directories together with any other resources.
   *
   * If you add only VPC resources, at least one VPC must have an Internet Gateway attached to it, to make sure that it has internet connectivity.
   *
   * > You can specify this field for a monitor update only if the `Resources` field is empty.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-resourcestoadd
   */
  readonly resourcesToAdd?: Array<string>;

  /**
   * The resources to remove from a monitor, which you provide as a set of Amazon Resource Names (ARNs).
   *
   * > You can specify this field for a monitor update only if the `Resources` field is empty.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-resourcestoremove
   */
  readonly resourcesToRemove?: Array<string>;

  /**
   * The status of a monitor.
   *
   * The accepted values that you can specify for `Status` are `ACTIVE` and `INACTIVE` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-status
   */
  readonly status?: string;

  /**
   * The tags for a monitor, listed as a set of *key:value* pairs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The percentage of the internet-facing traffic for your application that you want to monitor.
   *
   * You can also, optionally, set a limit for the number of city-networks (client locations and ASNs, typically internet service providers) that Internet Monitor will monitor traffic for. The city-networks maximum limit caps the number of city-networks that Internet Monitor monitors for your application, regardless of the percentage of traffic that you choose to monitor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-internetmonitor-monitor.html#cfn-internetmonitor-monitor-trafficpercentagetomonitor
   */
  readonly trafficPercentageToMonitor?: number;
}

/**
 * Determine whether the given properties match those of a `LocalHealthEventsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `LocalHealthEventsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitorLocalHealthEventsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthScoreThreshold", cdk.validateNumber)(properties.healthScoreThreshold));
  errors.collect(cdk.propertyValidator("minTrafficImpact", cdk.validateNumber)(properties.minTrafficImpact));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"LocalHealthEventsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMonitorLocalHealthEventsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitorLocalHealthEventsConfigPropertyValidator(properties).assertSuccess();
  return {
    "HealthScoreThreshold": cdk.numberToCloudFormation(properties.healthScoreThreshold),
    "MinTrafficImpact": cdk.numberToCloudFormation(properties.minTrafficImpact),
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnMonitorLocalHealthEventsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMonitor.LocalHealthEventsConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitor.LocalHealthEventsConfigProperty>();
  ret.addPropertyResult("healthScoreThreshold", "HealthScoreThreshold", (properties.HealthScoreThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.HealthScoreThreshold) : undefined));
  ret.addPropertyResult("minTrafficImpact", "MinTrafficImpact", (properties.MinTrafficImpact != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinTrafficImpact) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HealthEventsConfigProperty`
 *
 * @param properties - the TypeScript properties of a `HealthEventsConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitorHealthEventsConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("availabilityLocalHealthEventsConfig", CfnMonitorLocalHealthEventsConfigPropertyValidator)(properties.availabilityLocalHealthEventsConfig));
  errors.collect(cdk.propertyValidator("availabilityScoreThreshold", cdk.validateNumber)(properties.availabilityScoreThreshold));
  errors.collect(cdk.propertyValidator("performanceLocalHealthEventsConfig", CfnMonitorLocalHealthEventsConfigPropertyValidator)(properties.performanceLocalHealthEventsConfig));
  errors.collect(cdk.propertyValidator("performanceScoreThreshold", cdk.validateNumber)(properties.performanceScoreThreshold));
  return errors.wrap("supplied properties not correct for \"HealthEventsConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMonitorHealthEventsConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitorHealthEventsConfigPropertyValidator(properties).assertSuccess();
  return {
    "AvailabilityLocalHealthEventsConfig": convertCfnMonitorLocalHealthEventsConfigPropertyToCloudFormation(properties.availabilityLocalHealthEventsConfig),
    "AvailabilityScoreThreshold": cdk.numberToCloudFormation(properties.availabilityScoreThreshold),
    "PerformanceLocalHealthEventsConfig": convertCfnMonitorLocalHealthEventsConfigPropertyToCloudFormation(properties.performanceLocalHealthEventsConfig),
    "PerformanceScoreThreshold": cdk.numberToCloudFormation(properties.performanceScoreThreshold)
  };
}

// @ts-ignore TS6133
function CfnMonitorHealthEventsConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitor.HealthEventsConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitor.HealthEventsConfigProperty>();
  ret.addPropertyResult("availabilityLocalHealthEventsConfig", "AvailabilityLocalHealthEventsConfig", (properties.AvailabilityLocalHealthEventsConfig != null ? CfnMonitorLocalHealthEventsConfigPropertyFromCloudFormation(properties.AvailabilityLocalHealthEventsConfig) : undefined));
  ret.addPropertyResult("availabilityScoreThreshold", "AvailabilityScoreThreshold", (properties.AvailabilityScoreThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.AvailabilityScoreThreshold) : undefined));
  ret.addPropertyResult("performanceLocalHealthEventsConfig", "PerformanceLocalHealthEventsConfig", (properties.PerformanceLocalHealthEventsConfig != null ? CfnMonitorLocalHealthEventsConfigPropertyFromCloudFormation(properties.PerformanceLocalHealthEventsConfig) : undefined));
  ret.addPropertyResult("performanceScoreThreshold", "PerformanceScoreThreshold", (properties.PerformanceScoreThreshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.PerformanceScoreThreshold) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ConfigProperty`
 *
 * @param properties - the TypeScript properties of a `S3ConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitorS3ConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketPrefix", cdk.validateString)(properties.bucketPrefix));
  errors.collect(cdk.propertyValidator("logDeliveryStatus", cdk.validateString)(properties.logDeliveryStatus));
  return errors.wrap("supplied properties not correct for \"S3ConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnMonitorS3ConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitorS3ConfigPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "BucketPrefix": cdk.stringToCloudFormation(properties.bucketPrefix),
    "LogDeliveryStatus": cdk.stringToCloudFormation(properties.logDeliveryStatus)
  };
}

// @ts-ignore TS6133
function CfnMonitorS3ConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnMonitor.S3ConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitor.S3ConfigProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("bucketPrefix", "BucketPrefix", (properties.BucketPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.BucketPrefix) : undefined));
  ret.addPropertyResult("logDeliveryStatus", "LogDeliveryStatus", (properties.LogDeliveryStatus != null ? cfn_parse.FromCloudFormation.getString(properties.LogDeliveryStatus) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InternetMeasurementsLogDeliveryProperty`
 *
 * @param properties - the TypeScript properties of a `InternetMeasurementsLogDeliveryProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitorInternetMeasurementsLogDeliveryPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Config", CfnMonitorS3ConfigPropertyValidator)(properties.s3Config));
  return errors.wrap("supplied properties not correct for \"InternetMeasurementsLogDeliveryProperty\"");
}

// @ts-ignore TS6133
function convertCfnMonitorInternetMeasurementsLogDeliveryPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitorInternetMeasurementsLogDeliveryPropertyValidator(properties).assertSuccess();
  return {
    "S3Config": convertCfnMonitorS3ConfigPropertyToCloudFormation(properties.s3Config)
  };
}

// @ts-ignore TS6133
function CfnMonitorInternetMeasurementsLogDeliveryPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitor.InternetMeasurementsLogDeliveryProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitor.InternetMeasurementsLogDeliveryProperty>();
  ret.addPropertyResult("s3Config", "S3Config", (properties.S3Config != null ? CfnMonitorS3ConfigPropertyFromCloudFormation(properties.S3Config) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnMonitorProps`
 *
 * @param properties - the TypeScript properties of a `CfnMonitorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnMonitorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("healthEventsConfig", CfnMonitorHealthEventsConfigPropertyValidator)(properties.healthEventsConfig));
  errors.collect(cdk.propertyValidator("internetMeasurementsLogDelivery", CfnMonitorInternetMeasurementsLogDeliveryPropertyValidator)(properties.internetMeasurementsLogDelivery));
  errors.collect(cdk.propertyValidator("maxCityNetworksToMonitor", cdk.validateNumber)(properties.maxCityNetworksToMonitor));
  errors.collect(cdk.propertyValidator("monitorName", cdk.requiredValidator)(properties.monitorName));
  errors.collect(cdk.propertyValidator("monitorName", cdk.validateString)(properties.monitorName));
  errors.collect(cdk.propertyValidator("resources", cdk.listValidator(cdk.validateString))(properties.resources));
  errors.collect(cdk.propertyValidator("resourcesToAdd", cdk.listValidator(cdk.validateString))(properties.resourcesToAdd));
  errors.collect(cdk.propertyValidator("resourcesToRemove", cdk.listValidator(cdk.validateString))(properties.resourcesToRemove));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("trafficPercentageToMonitor", cdk.validateNumber)(properties.trafficPercentageToMonitor));
  return errors.wrap("supplied properties not correct for \"CfnMonitorProps\"");
}

// @ts-ignore TS6133
function convertCfnMonitorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnMonitorPropsValidator(properties).assertSuccess();
  return {
    "HealthEventsConfig": convertCfnMonitorHealthEventsConfigPropertyToCloudFormation(properties.healthEventsConfig),
    "InternetMeasurementsLogDelivery": convertCfnMonitorInternetMeasurementsLogDeliveryPropertyToCloudFormation(properties.internetMeasurementsLogDelivery),
    "MaxCityNetworksToMonitor": cdk.numberToCloudFormation(properties.maxCityNetworksToMonitor),
    "MonitorName": cdk.stringToCloudFormation(properties.monitorName),
    "Resources": cdk.listMapper(cdk.stringToCloudFormation)(properties.resources),
    "ResourcesToAdd": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourcesToAdd),
    "ResourcesToRemove": cdk.listMapper(cdk.stringToCloudFormation)(properties.resourcesToRemove),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TrafficPercentageToMonitor": cdk.numberToCloudFormation(properties.trafficPercentageToMonitor)
  };
}

// @ts-ignore TS6133
function CfnMonitorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnMonitorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnMonitorProps>();
  ret.addPropertyResult("healthEventsConfig", "HealthEventsConfig", (properties.HealthEventsConfig != null ? CfnMonitorHealthEventsConfigPropertyFromCloudFormation(properties.HealthEventsConfig) : undefined));
  ret.addPropertyResult("internetMeasurementsLogDelivery", "InternetMeasurementsLogDelivery", (properties.InternetMeasurementsLogDelivery != null ? CfnMonitorInternetMeasurementsLogDeliveryPropertyFromCloudFormation(properties.InternetMeasurementsLogDelivery) : undefined));
  ret.addPropertyResult("maxCityNetworksToMonitor", "MaxCityNetworksToMonitor", (properties.MaxCityNetworksToMonitor != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxCityNetworksToMonitor) : undefined));
  ret.addPropertyResult("monitorName", "MonitorName", (properties.MonitorName != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorName) : undefined));
  ret.addPropertyResult("resources", "Resources", (properties.Resources != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Resources) : undefined));
  ret.addPropertyResult("resourcesToAdd", "ResourcesToAdd", (properties.ResourcesToAdd != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourcesToAdd) : undefined));
  ret.addPropertyResult("resourcesToRemove", "ResourcesToRemove", (properties.ResourcesToRemove != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ResourcesToRemove) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("trafficPercentageToMonitor", "TrafficPercentageToMonitor", (properties.TrafficPercentageToMonitor != null ? cfn_parse.FromCloudFormation.getNumber(properties.TrafficPercentageToMonitor) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}