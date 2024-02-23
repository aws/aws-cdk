/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::CE::AnomalyMonitor` resource is a Cost Explorer resource type that continuously inspects your account's cost data for anomalies, based on `MonitorType` and `MonitorSpecification` .
 *
 * The content consists of detailed metadata and the current status of the monitor object.
 *
 * @cloudformationResource AWS::CE::AnomalyMonitor
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html
 */
export class CfnAnomalyMonitor extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CE::AnomalyMonitor";

  /**
   * Build a CfnAnomalyMonitor from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalyMonitor {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAnomalyMonitorPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAnomalyMonitor(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The date when the monitor was created.
   *
   * @cloudformationAttribute CreationDate
   */
  public readonly attrCreationDate: string;

  /**
   * The value for evaluated dimensions.
   *
   * @cloudformationAttribute DimensionalValueCount
   */
  public readonly attrDimensionalValueCount: number;

  /**
   * The date when the monitor last evaluated for anomalies.
   *
   * @cloudformationAttribute LastEvaluatedDate
   */
  public readonly attrLastEvaluatedDate: string;

  /**
   * The date when the monitor was last updated.
   *
   * @cloudformationAttribute LastUpdatedDate
   */
  public readonly attrLastUpdatedDate: string;

  /**
   * The Amazon Resource Name (ARN) value for the monitor.
   *
   * @cloudformationAttribute MonitorArn
   */
  public readonly attrMonitorArn: string;

  /**
   * The dimensions to evaluate.
   */
  public monitorDimension?: string;

  /**
   * The name of the monitor.
   */
  public monitorName: string;

  /**
   * The array of `MonitorSpecification` in JSON array format.
   */
  public monitorSpecification?: string;

  /**
   * The possible type values.
   */
  public monitorType: string;

  /**
   * Tags to assign to monitor.
   */
  public resourceTags?: Array<cdk.IResolvable | CfnAnomalyMonitor.ResourceTagProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAnomalyMonitorProps) {
    super(scope, id, {
      "type": CfnAnomalyMonitor.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "monitorName", this);
    cdk.requireProperty(props, "monitorType", this);

    this.attrCreationDate = cdk.Token.asString(this.getAtt("CreationDate", cdk.ResolutionTypeHint.STRING));
    this.attrDimensionalValueCount = cdk.Token.asNumber(this.getAtt("DimensionalValueCount", cdk.ResolutionTypeHint.NUMBER));
    this.attrLastEvaluatedDate = cdk.Token.asString(this.getAtt("LastEvaluatedDate", cdk.ResolutionTypeHint.STRING));
    this.attrLastUpdatedDate = cdk.Token.asString(this.getAtt("LastUpdatedDate", cdk.ResolutionTypeHint.STRING));
    this.attrMonitorArn = cdk.Token.asString(this.getAtt("MonitorArn", cdk.ResolutionTypeHint.STRING));
    this.monitorDimension = props.monitorDimension;
    this.monitorName = props.monitorName;
    this.monitorSpecification = props.monitorSpecification;
    this.monitorType = props.monitorType;
    this.resourceTags = props.resourceTags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "monitorDimension": this.monitorDimension,
      "monitorName": this.monitorName,
      "monitorSpecification": this.monitorSpecification,
      "monitorType": this.monitorType,
      "resourceTags": this.resourceTags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnomalyMonitor.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAnomalyMonitorPropsToCloudFormation(props);
  }
}

export namespace CfnAnomalyMonitor {
  /**
   * The tag structure that contains a tag key and value.
   *
   * > Tagging is supported only for the following Cost Explorer resource types: [`AnomalyMonitor`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalyMonitor.html) , [`AnomalySubscription`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalySubscription.html) , [`CostCategory`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_CostCategory.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalymonitor-resourcetag.html
   */
  export interface ResourceTagProperty {
    /**
     * The key that's associated with the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalymonitor-resourcetag.html#cfn-ce-anomalymonitor-resourcetag-key
     */
    readonly key: string;

    /**
     * The value that's associated with the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalymonitor-resourcetag.html#cfn-ce-anomalymonitor-resourcetag-value
     */
    readonly value: string;
  }
}

/**
 * Properties for defining a `CfnAnomalyMonitor`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html
 */
export interface CfnAnomalyMonitorProps {
  /**
   * The dimensions to evaluate.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitordimension
   */
  readonly monitorDimension?: string;

  /**
   * The name of the monitor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitorname
   */
  readonly monitorName: string;

  /**
   * The array of `MonitorSpecification` in JSON array format.
   *
   * For instance, you can use `MonitorSpecification` to specify a tag, Cost Category, or linked account for your custom anomaly monitor. For further information, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#aws-resource-ce-anomalymonitor--examples) section of this page.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitorspecification
   */
  readonly monitorSpecification?: string;

  /**
   * The possible type values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-monitortype
   */
  readonly monitorType: string;

  /**
   * Tags to assign to monitor.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html#cfn-ce-anomalymonitor-resourcetags
   */
  readonly resourceTags?: Array<cdk.IResolvable | CfnAnomalyMonitor.ResourceTagProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `ResourceTagProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyMonitorResourceTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ResourceTagProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyMonitorResourceTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyMonitorResourceTagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAnomalyMonitorResourceTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalyMonitor.ResourceTagProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyMonitor.ResourceTagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAnomalyMonitorProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnomalyMonitorProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalyMonitorPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("monitorDimension", cdk.validateString)(properties.monitorDimension));
  errors.collect(cdk.propertyValidator("monitorName", cdk.requiredValidator)(properties.monitorName));
  errors.collect(cdk.propertyValidator("monitorName", cdk.validateString)(properties.monitorName));
  errors.collect(cdk.propertyValidator("monitorSpecification", cdk.validateString)(properties.monitorSpecification));
  errors.collect(cdk.propertyValidator("monitorType", cdk.requiredValidator)(properties.monitorType));
  errors.collect(cdk.propertyValidator("monitorType", cdk.validateString)(properties.monitorType));
  errors.collect(cdk.propertyValidator("resourceTags", cdk.listValidator(CfnAnomalyMonitorResourceTagPropertyValidator))(properties.resourceTags));
  return errors.wrap("supplied properties not correct for \"CfnAnomalyMonitorProps\"");
}

// @ts-ignore TS6133
function convertCfnAnomalyMonitorPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalyMonitorPropsValidator(properties).assertSuccess();
  return {
    "MonitorDimension": cdk.stringToCloudFormation(properties.monitorDimension),
    "MonitorName": cdk.stringToCloudFormation(properties.monitorName),
    "MonitorSpecification": cdk.stringToCloudFormation(properties.monitorSpecification),
    "MonitorType": cdk.stringToCloudFormation(properties.monitorType),
    "ResourceTags": cdk.listMapper(convertCfnAnomalyMonitorResourceTagPropertyToCloudFormation)(properties.resourceTags)
  };
}

// @ts-ignore TS6133
function CfnAnomalyMonitorPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalyMonitorProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalyMonitorProps>();
  ret.addPropertyResult("monitorDimension", "MonitorDimension", (properties.MonitorDimension != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorDimension) : undefined));
  ret.addPropertyResult("monitorName", "MonitorName", (properties.MonitorName != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorName) : undefined));
  ret.addPropertyResult("monitorSpecification", "MonitorSpecification", (properties.MonitorSpecification != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorSpecification) : undefined));
  ret.addPropertyResult("monitorType", "MonitorType", (properties.MonitorType != null ? cfn_parse.FromCloudFormation.getString(properties.MonitorType) : undefined));
  ret.addPropertyResult("resourceTags", "ResourceTags", (properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalyMonitorResourceTagPropertyFromCloudFormation)(properties.ResourceTags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CE::AnomalySubscription` resource (also referred to as an alert subscription) is a Cost Explorer resource type that sends notifications about specific anomalies that meet an alerting criteria defined by you.
 *
 * You can specify the frequency of the alerts and the subscribers to notify.
 *
 * Anomaly subscriptions can be associated with one or more [`AWS::CE::AnomalyMonitor`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalymonitor.html) resources, and they only send notifications about anomalies detected by those associated monitors. You can also configure a threshold to further control which anomalies are included in the notifications.
 *
 * Anomalies that don’t exceed the chosen threshold and therefore don’t trigger notifications from an anomaly subscription will still be available on the console and from the [`GetAnomalies`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetAnomalies.html) API.
 *
 * @cloudformationResource AWS::CE::AnomalySubscription
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html
 */
export class CfnAnomalySubscription extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CE::AnomalySubscription";

  /**
   * Build a CfnAnomalySubscription from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAnomalySubscription {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAnomalySubscriptionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAnomalySubscription(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Your unique account identifier.
   *
   * @cloudformationAttribute AccountId
   */
  public readonly attrAccountId: string;

  /**
   * The `AnomalySubscription` Amazon Resource Name (ARN).
   *
   * @cloudformationAttribute SubscriptionArn
   */
  public readonly attrSubscriptionArn: string;

  /**
   * The frequency that anomaly notifications are sent.
   */
  public frequency: string;

  /**
   * A list of cost anomaly monitors.
   */
  public monitorArnList: Array<string>;

  /**
   * Tags to assign to subscription.
   */
  public resourceTags?: Array<cdk.IResolvable | CfnAnomalySubscription.ResourceTagProperty> | cdk.IResolvable;

  /**
   * A list of subscribers to notify.
   */
  public subscribers: Array<cdk.IResolvable | CfnAnomalySubscription.SubscriberProperty> | cdk.IResolvable;

  /**
   * The name for the subscription.
   */
  public subscriptionName: string;

  /**
   * (deprecated).
   */
  public threshold?: number;

  /**
   * An [Expression](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_Expression.html) object in JSON string format used to specify the anomalies that you want to generate alerts for. This supports dimensions and nested expressions. The supported dimensions are `ANOMALY_TOTAL_IMPACT_ABSOLUTE` and `ANOMALY_TOTAL_IMPACT_PERCENTAGE` , corresponding to an anomaly’s TotalImpact and TotalImpactPercentage, respectively (see [Impact](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_Impact.html) for more details). The supported nested expression types are `AND` and `OR` . The match option `GREATER_THAN_OR_EQUAL` is required. Values must be numbers between 0 and 10,000,000,000 in string format.
   */
  public thresholdExpression?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAnomalySubscriptionProps) {
    super(scope, id, {
      "type": CfnAnomalySubscription.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "frequency", this);
    cdk.requireProperty(props, "monitorArnList", this);
    cdk.requireProperty(props, "subscribers", this);
    cdk.requireProperty(props, "subscriptionName", this);

    this.attrAccountId = cdk.Token.asString(this.getAtt("AccountId", cdk.ResolutionTypeHint.STRING));
    this.attrSubscriptionArn = cdk.Token.asString(this.getAtt("SubscriptionArn", cdk.ResolutionTypeHint.STRING));
    this.frequency = props.frequency;
    this.monitorArnList = props.monitorArnList;
    this.resourceTags = props.resourceTags;
    this.subscribers = props.subscribers;
    this.subscriptionName = props.subscriptionName;
    this.threshold = props.threshold;
    this.thresholdExpression = props.thresholdExpression;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "frequency": this.frequency,
      "monitorArnList": this.monitorArnList,
      "resourceTags": this.resourceTags,
      "subscribers": this.subscribers,
      "subscriptionName": this.subscriptionName,
      "threshold": this.threshold,
      "thresholdExpression": this.thresholdExpression
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAnomalySubscription.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAnomalySubscriptionPropsToCloudFormation(props);
  }
}

export namespace CfnAnomalySubscription {
  /**
   * The tag structure that contains a tag key and value.
   *
   * > Tagging is supported only for the following Cost Explorer resource types: [`AnomalyMonitor`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalyMonitor.html) , [`AnomalySubscription`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_AnomalySubscription.html) , [`CostCategory`](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_CostCategory.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-resourcetag.html
   */
  export interface ResourceTagProperty {
    /**
     * The key that's associated with the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-resourcetag.html#cfn-ce-anomalysubscription-resourcetag-key
     */
    readonly key: string;

    /**
     * The value that's associated with the tag.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-resourcetag.html#cfn-ce-anomalysubscription-resourcetag-value
     */
    readonly value: string;
  }

  /**
   * The recipient of `AnomalySubscription` notifications.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html
   */
  export interface SubscriberProperty {
    /**
     * The email address or SNS Topic Amazon Resource Name (ARN), depending on the `Type` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html#cfn-ce-anomalysubscription-subscriber-address
     */
    readonly address: string;

    /**
     * Indicates if the subscriber accepts the notifications.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html#cfn-ce-anomalysubscription-subscriber-status
     */
    readonly status?: string;

    /**
     * The notification delivery channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ce-anomalysubscription-subscriber.html#cfn-ce-anomalysubscription-subscriber-type
     */
    readonly type: string;
  }
}

/**
 * Properties for defining a `CfnAnomalySubscription`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html
 */
export interface CfnAnomalySubscriptionProps {
  /**
   * The frequency that anomaly notifications are sent.
   *
   * Notifications are sent either over email (for DAILY and WEEKLY frequencies) or SNS (for IMMEDIATE frequency). For more information, see [Creating an Amazon SNS topic for anomaly notifications](https://docs.aws.amazon.com/cost-management/latest/userguide/ad-SNS.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-frequency
   */
  readonly frequency: string;

  /**
   * A list of cost anomaly monitors.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-monitorarnlist
   */
  readonly monitorArnList: Array<string>;

  /**
   * Tags to assign to subscription.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-resourcetags
   */
  readonly resourceTags?: Array<cdk.IResolvable | CfnAnomalySubscription.ResourceTagProperty> | cdk.IResolvable;

  /**
   * A list of subscribers to notify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-subscribers
   */
  readonly subscribers: Array<cdk.IResolvable | CfnAnomalySubscription.SubscriberProperty> | cdk.IResolvable;

  /**
   * The name for the subscription.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-subscriptionname
   */
  readonly subscriptionName: string;

  /**
   * (deprecated).
   *
   * An absolute dollar value that must be exceeded by the anomaly's total impact (see [Impact](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_Impact.html) for more details) for an anomaly notification to be generated.
   *
   * This field has been deprecated. To specify a threshold, use ThresholdExpression. Continued use of Threshold will be treated as shorthand syntax for a ThresholdExpression.
   *
   * One of Threshold or ThresholdExpression is required for `AWS::CE::AnomalySubscription` . You cannot specify both.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-threshold
   */
  readonly threshold?: number;

  /**
   * An [Expression](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_Expression.html) object in JSON string format used to specify the anomalies that you want to generate alerts for. This supports dimensions and nested expressions. The supported dimensions are `ANOMALY_TOTAL_IMPACT_ABSOLUTE` and `ANOMALY_TOTAL_IMPACT_PERCENTAGE` , corresponding to an anomaly’s TotalImpact and TotalImpactPercentage, respectively (see [Impact](https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_Impact.html) for more details). The supported nested expression types are `AND` and `OR` . The match option `GREATER_THAN_OR_EQUAL` is required. Values must be numbers between 0 and 10,000,000,000 in string format.
   *
   * One of Threshold or ThresholdExpression is required for `AWS::CE::AnomalySubscription` . You cannot specify both.
   *
   * For further information, see the [Examples](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#aws-resource-ce-anomalysubscription--examples) section of this page.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-anomalysubscription.html#cfn-ce-anomalysubscription-thresholdexpression
   */
  readonly thresholdExpression?: string;
}

/**
 * Determine whether the given properties match those of a `ResourceTagProperty`
 *
 * @param properties - the TypeScript properties of a `ResourceTagProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalySubscriptionResourceTagPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"ResourceTagProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalySubscriptionResourceTagPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalySubscriptionResourceTagPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnAnomalySubscriptionResourceTagPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalySubscription.ResourceTagProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalySubscription.ResourceTagProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SubscriberProperty`
 *
 * @param properties - the TypeScript properties of a `SubscriberProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalySubscriptionSubscriberPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("address", cdk.requiredValidator)(properties.address));
  errors.collect(cdk.propertyValidator("address", cdk.validateString)(properties.address));
  errors.collect(cdk.propertyValidator("status", cdk.validateString)(properties.status));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"SubscriberProperty\"");
}

// @ts-ignore TS6133
function convertCfnAnomalySubscriptionSubscriberPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalySubscriptionSubscriberPropertyValidator(properties).assertSuccess();
  return {
    "Address": cdk.stringToCloudFormation(properties.address),
    "Status": cdk.stringToCloudFormation(properties.status),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnAnomalySubscriptionSubscriberPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnAnomalySubscription.SubscriberProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalySubscription.SubscriberProperty>();
  ret.addPropertyResult("address", "Address", (properties.Address != null ? cfn_parse.FromCloudFormation.getString(properties.Address) : undefined));
  ret.addPropertyResult("status", "Status", (properties.Status != null ? cfn_parse.FromCloudFormation.getString(properties.Status) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAnomalySubscriptionProps`
 *
 * @param properties - the TypeScript properties of a `CfnAnomalySubscriptionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAnomalySubscriptionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("frequency", cdk.requiredValidator)(properties.frequency));
  errors.collect(cdk.propertyValidator("frequency", cdk.validateString)(properties.frequency));
  errors.collect(cdk.propertyValidator("monitorArnList", cdk.requiredValidator)(properties.monitorArnList));
  errors.collect(cdk.propertyValidator("monitorArnList", cdk.listValidator(cdk.validateString))(properties.monitorArnList));
  errors.collect(cdk.propertyValidator("resourceTags", cdk.listValidator(CfnAnomalySubscriptionResourceTagPropertyValidator))(properties.resourceTags));
  errors.collect(cdk.propertyValidator("subscribers", cdk.requiredValidator)(properties.subscribers));
  errors.collect(cdk.propertyValidator("subscribers", cdk.listValidator(CfnAnomalySubscriptionSubscriberPropertyValidator))(properties.subscribers));
  errors.collect(cdk.propertyValidator("subscriptionName", cdk.requiredValidator)(properties.subscriptionName));
  errors.collect(cdk.propertyValidator("subscriptionName", cdk.validateString)(properties.subscriptionName));
  errors.collect(cdk.propertyValidator("threshold", cdk.validateNumber)(properties.threshold));
  errors.collect(cdk.propertyValidator("thresholdExpression", cdk.validateString)(properties.thresholdExpression));
  return errors.wrap("supplied properties not correct for \"CfnAnomalySubscriptionProps\"");
}

// @ts-ignore TS6133
function convertCfnAnomalySubscriptionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAnomalySubscriptionPropsValidator(properties).assertSuccess();
  return {
    "Frequency": cdk.stringToCloudFormation(properties.frequency),
    "MonitorArnList": cdk.listMapper(cdk.stringToCloudFormation)(properties.monitorArnList),
    "ResourceTags": cdk.listMapper(convertCfnAnomalySubscriptionResourceTagPropertyToCloudFormation)(properties.resourceTags),
    "Subscribers": cdk.listMapper(convertCfnAnomalySubscriptionSubscriberPropertyToCloudFormation)(properties.subscribers),
    "SubscriptionName": cdk.stringToCloudFormation(properties.subscriptionName),
    "Threshold": cdk.numberToCloudFormation(properties.threshold),
    "ThresholdExpression": cdk.stringToCloudFormation(properties.thresholdExpression)
  };
}

// @ts-ignore TS6133
function CfnAnomalySubscriptionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAnomalySubscriptionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAnomalySubscriptionProps>();
  ret.addPropertyResult("frequency", "Frequency", (properties.Frequency != null ? cfn_parse.FromCloudFormation.getString(properties.Frequency) : undefined));
  ret.addPropertyResult("monitorArnList", "MonitorArnList", (properties.MonitorArnList != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MonitorArnList) : undefined));
  ret.addPropertyResult("resourceTags", "ResourceTags", (properties.ResourceTags != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalySubscriptionResourceTagPropertyFromCloudFormation)(properties.ResourceTags) : undefined));
  ret.addPropertyResult("subscribers", "Subscribers", (properties.Subscribers != null ? cfn_parse.FromCloudFormation.getArray(CfnAnomalySubscriptionSubscriberPropertyFromCloudFormation)(properties.Subscribers) : undefined));
  ret.addPropertyResult("subscriptionName", "SubscriptionName", (properties.SubscriptionName != null ? cfn_parse.FromCloudFormation.getString(properties.SubscriptionName) : undefined));
  ret.addPropertyResult("threshold", "Threshold", (properties.Threshold != null ? cfn_parse.FromCloudFormation.getNumber(properties.Threshold) : undefined));
  ret.addPropertyResult("thresholdExpression", "ThresholdExpression", (properties.ThresholdExpression != null ? cfn_parse.FromCloudFormation.getString(properties.ThresholdExpression) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::CE::CostCategory` resource creates groupings of cost that you can use across products in the AWS Billing and Cost Management console, such as Cost Explorer and AWS Budgets.
 *
 * For more information, see [Managing Your Costs with Cost Categories](https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/manage-cost-categories.html) in the *AWS Billing and Cost Management User Guide* .
 *
 * @cloudformationResource AWS::CE::CostCategory
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html
 */
export class CfnCostCategory extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::CE::CostCategory";

  /**
   * Build a CfnCostCategory from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCostCategory {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCostCategoryPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCostCategory(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The unique identifier for your Cost Category.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Cost Category's effective start date.
   *
   * @cloudformationAttribute EffectiveStart
   */
  public readonly attrEffectiveStart: string;

  /**
   * The default value for the cost category.
   */
  public defaultValue?: string;

  /**
   * The unique name of the Cost Category.
   */
  public name: string;

  /**
   * The array of CostCategoryRule in JSON array format.
   */
  public rules: string;

  /**
   * The rule schema version in this particular Cost Category.
   */
  public ruleVersion: string;

  /**
   * The split charge rules that are used to allocate your charges between your Cost Category values.
   */
  public splitChargeRules?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCostCategoryProps) {
    super(scope, id, {
      "type": CfnCostCategory.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "rules", this);
    cdk.requireProperty(props, "ruleVersion", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrEffectiveStart = cdk.Token.asString(this.getAtt("EffectiveStart", cdk.ResolutionTypeHint.STRING));
    this.defaultValue = props.defaultValue;
    this.name = props.name;
    this.rules = props.rules;
    this.ruleVersion = props.ruleVersion;
    this.splitChargeRules = props.splitChargeRules;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "defaultValue": this.defaultValue,
      "name": this.name,
      "rules": this.rules,
      "ruleVersion": this.ruleVersion,
      "splitChargeRules": this.splitChargeRules
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCostCategory.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCostCategoryPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnCostCategory`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html
 */
export interface CfnCostCategoryProps {
  /**
   * The default value for the cost category.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-defaultvalue
   */
  readonly defaultValue?: string;

  /**
   * The unique name of the Cost Category.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-name
   */
  readonly name: string;

  /**
   * The array of CostCategoryRule in JSON array format.
   *
   * > Rules are processed in order. If there are multiple rules that match the line item, then the first rule to match is used to determine that Cost Category value.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-rules
   */
  readonly rules: string;

  /**
   * The rule schema version in this particular Cost Category.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-ruleversion
   */
  readonly ruleVersion: string;

  /**
   * The split charge rules that are used to allocate your charges between your Cost Category values.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ce-costcategory.html#cfn-ce-costcategory-splitchargerules
   */
  readonly splitChargeRules?: string;
}

/**
 * Determine whether the given properties match those of a `CfnCostCategoryProps`
 *
 * @param properties - the TypeScript properties of a `CfnCostCategoryProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCostCategoryPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultValue", cdk.validateString)(properties.defaultValue));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("ruleVersion", cdk.requiredValidator)(properties.ruleVersion));
  errors.collect(cdk.propertyValidator("ruleVersion", cdk.validateString)(properties.ruleVersion));
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.validateString)(properties.rules));
  errors.collect(cdk.propertyValidator("splitChargeRules", cdk.validateString)(properties.splitChargeRules));
  return errors.wrap("supplied properties not correct for \"CfnCostCategoryProps\"");
}

// @ts-ignore TS6133
function convertCfnCostCategoryPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCostCategoryPropsValidator(properties).assertSuccess();
  return {
    "DefaultValue": cdk.stringToCloudFormation(properties.defaultValue),
    "Name": cdk.stringToCloudFormation(properties.name),
    "RuleVersion": cdk.stringToCloudFormation(properties.ruleVersion),
    "Rules": cdk.stringToCloudFormation(properties.rules),
    "SplitChargeRules": cdk.stringToCloudFormation(properties.splitChargeRules)
  };
}

// @ts-ignore TS6133
function CfnCostCategoryPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCostCategoryProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCostCategoryProps>();
  ret.addPropertyResult("defaultValue", "DefaultValue", (properties.DefaultValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultValue) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getString(properties.Rules) : undefined));
  ret.addPropertyResult("ruleVersion", "RuleVersion", (properties.RuleVersion != null ? cfn_parse.FromCloudFormation.getString(properties.RuleVersion) : undefined));
  ret.addPropertyResult("splitChargeRules", "SplitChargeRules", (properties.SplitChargeRules != null ? cfn_parse.FromCloudFormation.getString(properties.SplitChargeRules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}