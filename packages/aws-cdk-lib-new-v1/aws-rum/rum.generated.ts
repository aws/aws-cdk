/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a CloudWatch RUM app monitor, which you can use to collect telemetry data from your application and send it to CloudWatch RUM.
 *
 * The data includes performance and reliability information such as page load time, client-side errors, and user behavior.
 *
 * After you create an app monitor, sign in to the CloudWatch RUM console to get the JavaScript code snippet to add to your web application. For more information, see [How do I find a code snippet that I've already generated?](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-find-code-snippet.html)
 *
 * @cloudformationResource AWS::RUM::AppMonitor
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html
 */
export class CfnAppMonitor extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::RUM::AppMonitor";

  /**
   * Build a CfnAppMonitor from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAppMonitor {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAppMonitorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAppMonitor(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ID of the app monitor, such as `123456ab-1234-4ca9-9d2f-a1b2c3456789` .
   *
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * A structure that contains much of the configuration data for the app monitor.
   */
  public appMonitorConfiguration?: CfnAppMonitor.AppMonitorConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies whether this app monitor allows the web client to define and send custom events.
   */
  public customEvents?: CfnAppMonitor.CustomEventsProperty | cdk.IResolvable;

  /**
   * Data collected by CloudWatch RUM is kept by RUM for 30 days and then deleted.
   */
  public cwLogEnabled?: boolean | cdk.IResolvable;

  /**
   * The top-level internet domain name for which your application has administrative authority.
   */
  public domain: string;

  /**
   * A name for the app monitor.
   */
  public name: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * Assigns one or more tags (key-value pairs) to the app monitor.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAppMonitorProps) {
    super(scope, id, {
      "type": CfnAppMonitor.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "domain", this);
    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.appMonitorConfiguration = props.appMonitorConfiguration;
    this.customEvents = props.customEvents;
    this.cwLogEnabled = props.cwLogEnabled;
    this.domain = props.domain;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::RUM::AppMonitor", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "appMonitorConfiguration": this.appMonitorConfiguration,
      "customEvents": this.customEvents,
      "cwLogEnabled": this.cwLogEnabled,
      "domain": this.domain,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAppMonitor.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAppMonitorPropsToCloudFormation(props);
  }
}

export namespace CfnAppMonitor {
  /**
   * This structure specifies whether this app monitor allows the web client to define and send custom events.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-customevents.html
   */
  export interface CustomEventsProperty {
    /**
     * Set this to `ENABLED` to allow the web client to send custom events for this app monitor.
     *
     * Valid values are `ENABLED` and `DISABLED` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-customevents.html#cfn-rum-appmonitor-customevents-status
     */
    readonly status?: string;
  }

  /**
   * This structure contains much of the configuration data for the app monitor.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html
   */
  export interface AppMonitorConfigurationProperty {
    /**
     * If you set this to `true` , the CloudWatch RUM web client sets two cookies, a session cookie and a user cookie.
     *
     * The cookies allow the CloudWatch RUM web client to collect data relating to the number of users an application has and the behavior of the application across a sequence of events. Cookies are stored in the top-level domain of the current page.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-allowcookies
     */
    readonly allowCookies?: boolean | cdk.IResolvable;

    /**
     * If you set this to `true` , CloudWatch RUM sends client-side traces to X-Ray for each sampled session.
     *
     * You can then see traces and segments from these user sessions in the RUM dashboard and the CloudWatch ServiceLens console. For more information, see [What is AWS X-Ray ?](https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html)
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-enablexray
     */
    readonly enableXRay?: boolean | cdk.IResolvable;

    /**
     * A list of URLs in your website or application to exclude from RUM data collection.
     *
     * You can't include both `ExcludedPages` and `IncludedPages` in the same app monitor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-excludedpages
     */
    readonly excludedPages?: Array<string>;

    /**
     * A list of pages in your application that are to be displayed with a "favorite" icon in the CloudWatch RUM console.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-favoritepages
     */
    readonly favoritePages?: Array<string>;

    /**
     * The ARN of the guest IAM role that is attached to the Amazon Cognito identity pool that is used to authorize the sending of data to CloudWatch RUM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-guestrolearn
     */
    readonly guestRoleArn?: string;

    /**
     * The ID of the Amazon Cognito identity pool that is used to authorize the sending of data to CloudWatch RUM.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-identitypoolid
     */
    readonly identityPoolId?: string;

    /**
     * If this app monitor is to collect data from only certain pages in your application, this structure lists those pages.
     *
     * You can't include both `ExcludedPages` and `IncludedPages` in the same app monitor.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-includedpages
     */
    readonly includedPages?: Array<string>;

    /**
     * An array of structures that each define a destination that this app monitor will send extended metrics to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-metricdestinations
     */
    readonly metricDestinations?: Array<cdk.IResolvable | CfnAppMonitor.MetricDestinationProperty> | cdk.IResolvable;

    /**
     * Specifies the portion of user sessions to use for CloudWatch RUM data collection.
     *
     * Choosing a higher portion gives you more data but also incurs more costs.
     *
     * The range for this value is 0 to 1 inclusive. Setting this to 1 means that 100% of user sessions are sampled, and setting it to 0.1 means that 10% of user sessions are sampled.
     *
     * If you omit this parameter, the default of 0.1 is used, and 10% of sessions will be sampled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-sessionsamplerate
     */
    readonly sessionSampleRate?: number;

    /**
     * An array that lists the types of telemetry data that this app monitor is to collect.
     *
     * - `errors` indicates that RUM collects data about unhandled JavaScript errors raised by your application.
     * - `performance` indicates that RUM collects performance data about how your application and its resources are loaded and rendered. This includes Core Web Vitals.
     * - `http` indicates that RUM collects data about HTTP errors thrown by your application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-appmonitorconfiguration.html#cfn-rum-appmonitor-appmonitorconfiguration-telemetries
     */
    readonly telemetries?: Array<string>;
  }

  /**
   * Creates or updates a destination to receive extended metrics from CloudWatch RUM.
   *
   * You can send extended metrics to CloudWatch or to a CloudWatch Evidently experiment.
   *
   * For more information about extended metrics, see [Extended metrics that you can send to CloudWatch and CloudWatch Evidently](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-vended-metrics.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html
   */
  export interface MetricDestinationProperty {
    /**
     * Defines the destination to send the metrics to.
     *
     * Valid values are `CloudWatch` and `Evidently` . If you specify `Evidently` , you must also specify the ARN of the CloudWatch Evidently experiment that is to be the destination and an IAM role that has permission to write to the experiment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-destination
     */
    readonly destination: string;

    /**
     * Use this parameter only if `Destination` is `Evidently` .
     *
     * This parameter specifies the ARN of the Evidently experiment that will receive the extended metrics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * This parameter is required if `Destination` is `Evidently` . If `Destination` is `CloudWatch` , do not use this parameter.
     *
     * This parameter specifies the ARN of an IAM role that RUM will assume to write to the Evidently experiment that you are sending metrics to. This role must have permission to write to that experiment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-iamrolearn
     */
    readonly iamRoleArn?: string;

    /**
     * An array of structures which define the metrics that you want to send.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdestination.html#cfn-rum-appmonitor-metricdestination-metricdefinitions
     */
    readonly metricDefinitions?: Array<cdk.IResolvable | CfnAppMonitor.MetricDefinitionProperty> | cdk.IResolvable;
  }

  /**
   * Specifies one custom metric or extended metric that you want the CloudWatch RUM app monitor to send to a destination.
   *
   * Valid destinations include CloudWatch and Evidently.
   *
   * By default, RUM app monitors send some metrics to CloudWatch . These default metrics are listed in [CloudWatch metrics that you can collect.](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-metrics.html)
   *
   * In addition to these default metrics, you can choose to send extended metrics or custom metrics or both.
   *
   * - Extended metrics enable you to send metrics with additional dimensions not included in the default metrics. You can also send extended metrics to Evidently as well as CloudWatch . The valid dimension names for the additional dimensions for extended metrics are `BrowserName` , `CountryCode` , `DeviceType` , `FileType` , `OSName` , and `PageId` . For more information, see [Extended metrics](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-vended-metrics.html) .
   * - Custom metrics are metrics that you define. You can send custom metrics to CloudWatch or to CloudWatch Evidently or to both. With custom metrics, you can use any metric name and namespace, and to derive the metrics you can use any custom events, built-in events, custom attributes, or default attributes.
   *
   * You can't send custom metrics to the `AWS/RUM` namespace. You must send custom metrics to a custom namespace that you define. The namespace that you use can't start with `AWS/` . CloudWatch RUM prepends `RUM/CustomMetrics/` to the custom namespace that you define, so the final namespace for your metrics in CloudWatch is `RUM/CustomMetrics/ *your-custom-namespace*` .
   *
   * For information about syntax rules for specifying custom metrics and extended metrics, see [MetridDefinitionRequest](https://docs.aws.amazon.com/cloudwatchrum/latest/APIReference/API_MetricDefinitionRequest.html) in the *CloudWatch RUM API Reference* .
   *
   * The maximum number of metric definitions that one destination can contain is 2000.
   *
   * Extended metrics sent to CloudWatch and RUM custom metrics are charged as CloudWatch custom metrics. Each combination of additional dimension name and dimension value counts as a custom metric.
   *
   * If some metric definitions that you specify are not valid, then the operation will not modify any metric definitions even if other metric definitions specified are valid.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html
   */
  export interface MetricDefinitionProperty {
    /**
     * This field is a map of field paths to dimension names.
     *
     * It defines the dimensions to associate with this metric in CloudWatch . The value of this field is used only if the metric destination is `CloudWatch` . If the metric destination is `Evidently` , the value of `DimensionKeys` is ignored.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-dimensionkeys
     */
    readonly dimensionKeys?: cdk.IResolvable | Record<string, string>;

    /**
     * The pattern that defines the metric.
     *
     * RUM checks events that happen in a user's session against the pattern, and events that match the pattern are sent to the metric destination.
     *
     * If the metrics destination is `CloudWatch` and the event also matches a value in `DimensionKeys` , then the metric is published with the specified dimensions.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-eventpattern
     */
    readonly eventPattern?: string;

    /**
     * The name of the metric that is defined in this structure.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-name
     */
    readonly name: string;

    /**
     * If you are creating a custom metric instead of an extended metrics, use this parameter to define the metric namespace for that custom metric.
     *
     * Do not specify this parameter if you are creating an extended metric.
     *
     * You can't use any string that starts with `AWS/` for your namespace.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-namespace
     */
    readonly namespace?: string;

    /**
     * Use this field only if you are sending this metric to CloudWatch .
     *
     * It defines the CloudWatch metric unit that this metric is measured in.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-unitlabel
     */
    readonly unitLabel?: string;

    /**
     * The field within the event object that the metric value is sourced from.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rum-appmonitor-metricdefinition.html#cfn-rum-appmonitor-metricdefinition-valuekey
     */
    readonly valueKey?: string;
  }
}

/**
 * Properties for defining a `CfnAppMonitor`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html
 */
export interface CfnAppMonitorProps {
  /**
   * A structure that contains much of the configuration data for the app monitor.
   *
   * If you are using Amazon Cognito for authorization, you must include this structure in your request, and it must include the ID of the Amazon Cognito identity pool to use for authorization. If you don't include `AppMonitorConfiguration` , you must set up your own authorization method. For more information, see [Authorize your application to send data to AWS](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-RUM-get-started-authorization.html) .
   *
   * If you omit this argument, the sample rate used for CloudWatch RUM is set to 10% of the user sessions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-appmonitorconfiguration
   */
  readonly appMonitorConfiguration?: CfnAppMonitor.AppMonitorConfigurationProperty | cdk.IResolvable;

  /**
   * Specifies whether this app monitor allows the web client to define and send custom events.
   *
   * If you omit this parameter, custom events are `DISABLED` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-customevents
   */
  readonly customEvents?: CfnAppMonitor.CustomEventsProperty | cdk.IResolvable;

  /**
   * Data collected by CloudWatch RUM is kept by RUM for 30 days and then deleted.
   *
   * This parameter specifies whether CloudWatch RUM sends a copy of this telemetry data to Amazon CloudWatch Logs in your account. This enables you to keep the telemetry data for more than 30 days, but it does incur Amazon CloudWatch Logs charges.
   *
   * If you omit this parameter, the default is `false` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-cwlogenabled
   */
  readonly cwLogEnabled?: boolean | cdk.IResolvable;

  /**
   * The top-level internet domain name for which your application has administrative authority.
   *
   * This parameter is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-domain
   */
  readonly domain: string;

  /**
   * A name for the app monitor.
   *
   * This parameter is required.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-name
   */
  readonly name: string;

  /**
   * Assigns one or more tags (key-value pairs) to the app monitor.
   *
   * Tags can help you organize and categorize your resources. You can also use them to scope user permissions by granting a user permission to access or change only resources with certain tag values.
   *
   * Tags don't have any semantic meaning to AWS and are interpreted strictly as strings of characters.
   *
   * You can associate as many as 50 tags with an app monitor.
   *
   * For more information, see [Tagging AWS resources](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-rum-appmonitor.html#cfn-rum-appmonitor-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CustomEventsProperty`
 *
 * @param properties - the TypeScript properties of a `CustomEventsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppMonitorCustomEventsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  return errors.wrap("supplied properties not correct for \"CustomEventsProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppMonitorCustomEventsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppMonitorCustomEventsPropertyValidator(properties).assertSuccess();
  return {
    "Status": cdk.stringToCloudFormation(properties.status)
  };
}

// @ts-ignore TS6133
function CfnAppMonitorCustomEventsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitor.CustomEventsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.CustomEventsProperty>();
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDefinitionProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDefinitionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppMonitorMetricDefinitionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionKeys", cdk.hashValidator(cdk.validateString))(properties.dimensionKeys));
  errors.collect(cdk.propertyValidator("eventPattern", cdk.validateString)(properties.eventPattern));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("namespace", cdk.validateString)(properties.namespace));
  errors.collect(cdk.propertyValidator("unitLabel", cdk.validateString)(properties.unitLabel));
  errors.collect(cdk.propertyValidator("valueKey", cdk.validateString)(properties.valueKey));
  return errors.wrap("supplied properties not correct for \"MetricDefinitionProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppMonitorMetricDefinitionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppMonitorMetricDefinitionPropertyValidator(properties).assertSuccess();
  return {
    "DimensionKeys": cdk.hashMapper(cdk.stringToCloudFormation)(properties.dimensionKeys),
    "EventPattern": cdk.stringToCloudFormation(properties.eventPattern),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Namespace": cdk.stringToCloudFormation(properties.namespace),
    "UnitLabel": cdk.stringToCloudFormation(properties.unitLabel),
    "ValueKey": cdk.stringToCloudFormation(properties.valueKey)
  };
}

// @ts-ignore TS6133
function CfnAppMonitorMetricDefinitionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAppMonitor.MetricDefinitionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.MetricDefinitionProperty>();
  ret.addPropertyResult("dimensionKeys", "DimensionKeys", (properties.DimensionKeys != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DimensionKeys) : undefined));
  ret.addPropertyResult("eventPattern", "EventPattern", (properties.EventPattern != null ? cfn_parse.FromCloudFormation.getString(properties.EventPattern) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("namespace", "Namespace", (properties.Namespace != null ? cfn_parse.FromCloudFormation.getString(properties.Namespace) : undefined));
  ret.addPropertyResult("unitLabel", "UnitLabel", (properties.UnitLabel != null ? cfn_parse.FromCloudFormation.getString(properties.UnitLabel) : undefined));
  ret.addPropertyResult("valueKey", "ValueKey", (properties.ValueKey != null ? cfn_parse.FromCloudFormation.getString(properties.ValueKey) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MetricDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `MetricDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppMonitorMetricDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("metricDefinitions", cdk.listValidator(CfnAppMonitorMetricDefinitionPropertyValidator))(properties.metricDefinitions));
  return errors.wrap("supplied properties not correct for \"MetricDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppMonitorMetricDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppMonitorMetricDestinationPropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn),
    "MetricDefinitions": cdk.listMapper(convertCfnAppMonitorMetricDefinitionPropertyToCloudFormation)(properties.metricDefinitions)
  };
}

// @ts-ignore TS6133
function CfnAppMonitorMetricDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAppMonitor.MetricDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.MetricDestinationProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
  ret.addPropertyResult("metricDefinitions", "MetricDefinitions", (properties.MetricDefinitions != null ? cfn_parse.FromCloudFormation.getArray(CfnAppMonitorMetricDefinitionPropertyFromCloudFormation)(properties.MetricDefinitions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AppMonitorConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AppMonitorConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppMonitorAppMonitorConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCookies", cdk.validateBoolean)(properties.allowCookies));
  errors.collect(cdk.propertyValidator("enableXRay", cdk.validateBoolean)(properties.enableXRay));
  errors.collect(cdk.propertyValidator("excludedPages", cdk.listValidator(cdk.validateString))(properties.excludedPages));
  errors.collect(cdk.propertyValidator("favoritePages", cdk.listValidator(cdk.validateString))(properties.favoritePages));
  errors.collect(cdk.propertyValidator("guestRoleArn", cdk.validateString)(properties.guestRoleArn));
  errors.collect(cdk.propertyValidator("identityPoolId", cdk.validateString)(properties.identityPoolId));
  errors.collect(cdk.propertyValidator("includedPages", cdk.listValidator(cdk.validateString))(properties.includedPages));
  errors.collect(cdk.propertyValidator("metricDestinations", cdk.listValidator(CfnAppMonitorMetricDestinationPropertyValidator))(properties.metricDestinations));
  errors.collect(cdk.propertyValidator("sessionSampleRate", cdk.validateNumber)(properties.sessionSampleRate));
  errors.collect(cdk.propertyValidator("telemetries", cdk.listValidator(cdk.validateString))(properties.telemetries));
  return errors.wrap("supplied properties not correct for \"AppMonitorConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnAppMonitorAppMonitorConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppMonitorAppMonitorConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowCookies": cdk.booleanToCloudFormation(properties.allowCookies),
    "EnableXRay": cdk.booleanToCloudFormation(properties.enableXRay),
    "ExcludedPages": cdk.listMapper(cdk.stringToCloudFormation)(properties.excludedPages),
    "FavoritePages": cdk.listMapper(cdk.stringToCloudFormation)(properties.favoritePages),
    "GuestRoleArn": cdk.stringToCloudFormation(properties.guestRoleArn),
    "IdentityPoolId": cdk.stringToCloudFormation(properties.identityPoolId),
    "IncludedPages": cdk.listMapper(cdk.stringToCloudFormation)(properties.includedPages),
    "MetricDestinations": cdk.listMapper(convertCfnAppMonitorMetricDestinationPropertyToCloudFormation)(properties.metricDestinations),
    "SessionSampleRate": cdk.numberToCloudFormation(properties.sessionSampleRate),
    "Telemetries": cdk.listMapper(cdk.stringToCloudFormation)(properties.telemetries)
  };
}

// @ts-ignore TS6133
function CfnAppMonitorAppMonitorConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitor.AppMonitorConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitor.AppMonitorConfigurationProperty>();
  ret.addPropertyResult("allowCookies", "AllowCookies", (properties.AllowCookies != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCookies) : undefined));
  ret.addPropertyResult("enableXRay", "EnableXRay", (properties.EnableXRay != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableXRay) : undefined));
  ret.addPropertyResult("excludedPages", "ExcludedPages", (properties.ExcludedPages != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExcludedPages) : undefined));
  ret.addPropertyResult("favoritePages", "FavoritePages", (properties.FavoritePages != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FavoritePages) : undefined));
  ret.addPropertyResult("guestRoleArn", "GuestRoleArn", (properties.GuestRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.GuestRoleArn) : undefined));
  ret.addPropertyResult("identityPoolId", "IdentityPoolId", (properties.IdentityPoolId != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityPoolId) : undefined));
  ret.addPropertyResult("includedPages", "IncludedPages", (properties.IncludedPages != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IncludedPages) : undefined));
  ret.addPropertyResult("metricDestinations", "MetricDestinations", (properties.MetricDestinations != null ? cfn_parse.FromCloudFormation.getArray(CfnAppMonitorMetricDestinationPropertyFromCloudFormation)(properties.MetricDestinations) : undefined));
  ret.addPropertyResult("sessionSampleRate", "SessionSampleRate", (properties.SessionSampleRate != null ? cfn_parse.FromCloudFormation.getNumber(properties.SessionSampleRate) : undefined));
  ret.addPropertyResult("telemetries", "Telemetries", (properties.Telemetries != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Telemetries) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAppMonitorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAppMonitorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAppMonitorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("appMonitorConfiguration", CfnAppMonitorAppMonitorConfigurationPropertyValidator)(properties.appMonitorConfiguration));
  errors.collect(cdk.propertyValidator("customEvents", CfnAppMonitorCustomEventsPropertyValidator)(properties.customEvents));
  errors.collect(cdk.propertyValidator("cwLogEnabled", cdk.validateBoolean)(properties.cwLogEnabled));
  errors.collect(cdk.propertyValidator("domain", cdk.requiredValidator)(properties.domain));
  errors.collect(cdk.propertyValidator("domain", cdk.validateString)(properties.domain));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAppMonitorProps\"");
}

// @ts-ignore TS6133
function convertCfnAppMonitorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAppMonitorPropsValidator(properties).assertSuccess();
  return {
    "AppMonitorConfiguration": convertCfnAppMonitorAppMonitorConfigurationPropertyToCloudFormation(properties.appMonitorConfiguration),
    "CustomEvents": convertCfnAppMonitorCustomEventsPropertyToCloudFormation(properties.customEvents),
    "CwLogEnabled": cdk.booleanToCloudFormation(properties.cwLogEnabled),
    "Domain": cdk.stringToCloudFormation(properties.domain),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAppMonitorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAppMonitorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAppMonitorProps>();
  ret.addPropertyResult("appMonitorConfiguration", "AppMonitorConfiguration", (properties.AppMonitorConfiguration != null ? CfnAppMonitorAppMonitorConfigurationPropertyFromCloudFormation(properties.AppMonitorConfiguration) : undefined));
  ret.addPropertyResult("customEvents", "CustomEvents", (properties.CustomEvents != null ? CfnAppMonitorCustomEventsPropertyFromCloudFormation(properties.CustomEvents) : undefined));
  ret.addPropertyResult("cwLogEnabled", "CwLogEnabled", (properties.CwLogEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CwLogEnabled) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? cfn_parse.FromCloudFormation.getString(properties.Domain) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}