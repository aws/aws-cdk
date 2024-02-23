/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Configuration sets let you create groups of rules that you can apply to the emails you send using Amazon SES.
 *
 * For more information about using configuration sets, see [Using Amazon SES Configuration Sets](https://docs.aws.amazon.com/ses/latest/dg/using-configuration-sets.html) in the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/) .
 *
 * > *Required permissions:*
 * >
 * > To apply any of the resource options, you will need to have the corresponding AWS Identity and Access Management (IAM) SES API v2 permissions:
 * >
 * > - `ses:GetConfigurationSet`
 * >
 * > - (This permission is replacing the v1 *ses:DescribeConfigurationSet* permission which will not work with these v2 resource options.)
 * > - `ses:PutConfigurationSetDeliveryOptions`
 * > - `ses:PutConfigurationSetReputationOptions`
 * > - `ses:PutConfigurationSetSendingOptions`
 * > - `ses:PutConfigurationSetSuppressionOptions`
 * > - `ses:PutConfigurationSetTrackingOptions`
 *
 * @cloudformationResource AWS::SES::ConfigurationSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html
 */
export class CfnConfigurationSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::ConfigurationSet";

  /**
   * Build a CfnConfigurationSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS).
   */
  public deliveryOptions?: CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable;

  /**
   * The name of the configuration set. The name must meet the following requirements:.
   */
  public name?: string;

  /**
   * An object that represents the reputation settings for the configuration set.
   */
  public reputationOptions?: cdk.IResolvable | CfnConfigurationSet.ReputationOptionsProperty;

  /**
   * An object that defines whether or not Amazon SES can send email that you send using the configuration set.
   */
  public sendingOptions?: cdk.IResolvable | CfnConfigurationSet.SendingOptionsProperty;

  /**
   * An object that contains information about the suppression list preferences for your account.
   */
  public suppressionOptions?: cdk.IResolvable | CfnConfigurationSet.SuppressionOptionsProperty;

  /**
   * The name of the custom open and click tracking domain associated with the configuration set.
   */
  public trackingOptions?: cdk.IResolvable | CfnConfigurationSet.TrackingOptionsProperty;

  /**
   * The Virtual Deliverability Manager (VDM) options that apply to the configuration set.
   */
  public vdmOptions?: cdk.IResolvable | CfnConfigurationSet.VdmOptionsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationSetProps = {}) {
    super(scope, id, {
      "type": CfnConfigurationSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.deliveryOptions = props.deliveryOptions;
    this.name = props.name;
    this.reputationOptions = props.reputationOptions;
    this.sendingOptions = props.sendingOptions;
    this.suppressionOptions = props.suppressionOptions;
    this.trackingOptions = props.trackingOptions;
    this.vdmOptions = props.vdmOptions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deliveryOptions": this.deliveryOptions,
      "name": this.name,
      "reputationOptions": this.reputationOptions,
      "sendingOptions": this.sendingOptions,
      "suppressionOptions": this.suppressionOptions,
      "trackingOptions": this.trackingOptions,
      "vdmOptions": this.vdmOptions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationSetPropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationSet {
  /**
   * Used to enable or disable email sending for messages that use this configuration set in the current AWS Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-sendingoptions.html
   */
  export interface SendingOptionsProperty {
    /**
     * If `true` , email sending is enabled for the configuration set.
     *
     * If `false` , email sending is disabled for the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-sendingoptions.html#cfn-ses-configurationset-sendingoptions-sendingenabled
     */
    readonly sendingEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * An object that contains information about the suppression list preferences for your account.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-suppressionoptions.html
   */
  export interface SuppressionOptionsProperty {
    /**
     * A list that contains the reasons that email addresses are automatically added to the suppression list for your account.
     *
     * This list can contain any or all of the following:
     *
     * - `COMPLAINT` – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a complaint.
     * - `BOUNCE` – Amazon SES adds an email address to the suppression list for your account when a message sent to that address results in a hard bounce.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-suppressionoptions.html#cfn-ses-configurationset-suppressionoptions-suppressedreasons
     */
    readonly suppressedReasons?: Array<string>;
  }

  /**
   * A domain that is used to redirect email recipients to an Amazon SES-operated domain.
   *
   * This domain captures open and click events generated by Amazon SES emails.
   *
   * For more information, see [Configuring Custom Domains to Handle Open and Click Tracking](https://docs.aws.amazon.com/ses/latest/dg/configure-custom-open-click-domains.html) in the *Amazon SES Developer Guide* .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-trackingoptions.html
   */
  export interface TrackingOptionsProperty {
    /**
     * The custom subdomain that is used to redirect email recipients to the Amazon SES event tracking domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-trackingoptions.html#cfn-ses-configurationset-trackingoptions-customredirectdomain
     */
    readonly customRedirectDomain?: string;
  }

  /**
   * Contains information about the reputation settings for a configuration set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-reputationoptions.html
   */
  export interface ReputationOptionsProperty {
    /**
     * Describes whether or not Amazon SES publishes reputation metrics for the configuration set, such as bounce and complaint rates, to Amazon CloudWatch.
     *
     * If the value is `true` , reputation metrics are published. If the value is `false` , reputation metrics are not published. The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-reputationoptions.html#cfn-ses-configurationset-reputationoptions-reputationmetricsenabled
     */
    readonly reputationMetricsEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * The Virtual Deliverability Manager (VDM) options that apply to a configuration set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-vdmoptions.html
   */
  export interface VdmOptionsProperty {
    /**
     * Settings for your VDM configuration as applicable to the Dashboard.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-vdmoptions.html#cfn-ses-configurationset-vdmoptions-dashboardoptions
     */
    readonly dashboardOptions?: CfnConfigurationSet.DashboardOptionsProperty | cdk.IResolvable;

    /**
     * Settings for your VDM configuration as applicable to the Guardian.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-vdmoptions.html#cfn-ses-configurationset-vdmoptions-guardianoptions
     */
    readonly guardianOptions?: CfnConfigurationSet.GuardianOptionsProperty | cdk.IResolvable;
  }

  /**
   * Settings for your VDM configuration as applicable to the Dashboard.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-dashboardoptions.html
   */
  export interface DashboardOptionsProperty {
    /**
     * Specifies the status of your VDM engagement metrics collection. Can be one of the following:.
     *
     * - `ENABLED` – Amazon SES enables engagement metrics for the configuration set.
     * - `DISABLED` – Amazon SES disables engagement metrics for the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-dashboardoptions.html#cfn-ses-configurationset-dashboardoptions-engagementmetrics
     */
    readonly engagementMetrics: string;
  }

  /**
   * Settings for your VDM configuration as applicable to the Guardian.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-guardianoptions.html
   */
  export interface GuardianOptionsProperty {
    /**
     * Specifies the status of your VDM optimized shared delivery. Can be one of the following:.
     *
     * - `ENABLED` – Amazon SES enables optimized shared delivery for the configuration set.
     * - `DISABLED` – Amazon SES disables optimized shared delivery for the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-guardianoptions.html#cfn-ses-configurationset-guardianoptions-optimizedshareddelivery
     */
    readonly optimizedSharedDelivery: string;
  }

  /**
   * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-deliveryoptions.html
   */
  export interface DeliveryOptionsProperty {
    /**
     * The name of the dedicated IP pool to associate with the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-deliveryoptions.html#cfn-ses-configurationset-deliveryoptions-sendingpoolname
     */
    readonly sendingPoolName?: string;

    /**
     * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS).
     *
     * If the value is `REQUIRE` , messages are only delivered if a TLS connection can be established. If the value is `OPTIONAL` , messages can be delivered in plain text if a TLS connection can't be established.
     *
     * Valid Values: `REQUIRE | OPTIONAL`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationset-deliveryoptions.html#cfn-ses-configurationset-deliveryoptions-tlspolicy
     */
    readonly tlsPolicy?: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html
 */
export interface CfnConfigurationSetProps {
  /**
   * Specifies whether messages that use the configuration set are required to use Transport Layer Security (TLS).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-deliveryoptions
   */
  readonly deliveryOptions?: CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable;

  /**
   * The name of the configuration set. The name must meet the following requirements:.
   *
   * - Contain only letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-).
   * - Contain 64 characters or fewer.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-name
   */
  readonly name?: string;

  /**
   * An object that represents the reputation settings for the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-reputationoptions
   */
  readonly reputationOptions?: cdk.IResolvable | CfnConfigurationSet.ReputationOptionsProperty;

  /**
   * An object that defines whether or not Amazon SES can send email that you send using the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-sendingoptions
   */
  readonly sendingOptions?: cdk.IResolvable | CfnConfigurationSet.SendingOptionsProperty;

  /**
   * An object that contains information about the suppression list preferences for your account.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-suppressionoptions
   */
  readonly suppressionOptions?: cdk.IResolvable | CfnConfigurationSet.SuppressionOptionsProperty;

  /**
   * The name of the custom open and click tracking domain associated with the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-trackingoptions
   */
  readonly trackingOptions?: cdk.IResolvable | CfnConfigurationSet.TrackingOptionsProperty;

  /**
   * The Virtual Deliverability Manager (VDM) options that apply to the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationset.html#cfn-ses-configurationset-vdmoptions
   */
  readonly vdmOptions?: cdk.IResolvable | CfnConfigurationSet.VdmOptionsProperty;
}

/**
 * Determine whether the given properties match those of a `SendingOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SendingOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetSendingOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sendingEnabled", cdk.validateBoolean)(properties.sendingEnabled));
  return errors.wrap("supplied properties not correct for \"SendingOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetSendingOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetSendingOptionsPropertyValidator(properties).assertSuccess();
  return {
    "SendingEnabled": cdk.booleanToCloudFormation(properties.sendingEnabled)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetSendingOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSet.SendingOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.SendingOptionsProperty>();
  ret.addPropertyResult("sendingEnabled", "SendingEnabled", (properties.SendingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SendingEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SuppressionOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `SuppressionOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetSuppressionOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("suppressedReasons", cdk.listValidator(cdk.validateString))(properties.suppressedReasons));
  return errors.wrap("supplied properties not correct for \"SuppressionOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetSuppressionOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetSuppressionOptionsPropertyValidator(properties).assertSuccess();
  return {
    "SuppressedReasons": cdk.listMapper(cdk.stringToCloudFormation)(properties.suppressedReasons)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetSuppressionOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSet.SuppressionOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.SuppressionOptionsProperty>();
  ret.addPropertyResult("suppressedReasons", "SuppressedReasons", (properties.SuppressedReasons != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SuppressedReasons) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TrackingOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `TrackingOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetTrackingOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("customRedirectDomain", cdk.validateString)(properties.customRedirectDomain));
  return errors.wrap("supplied properties not correct for \"TrackingOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetTrackingOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetTrackingOptionsPropertyValidator(properties).assertSuccess();
  return {
    "CustomRedirectDomain": cdk.stringToCloudFormation(properties.customRedirectDomain)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetTrackingOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSet.TrackingOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.TrackingOptionsProperty>();
  ret.addPropertyResult("customRedirectDomain", "CustomRedirectDomain", (properties.CustomRedirectDomain != null ? cfn_parse.FromCloudFormation.getString(properties.CustomRedirectDomain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReputationOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `ReputationOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetReputationOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("reputationMetricsEnabled", cdk.validateBoolean)(properties.reputationMetricsEnabled));
  return errors.wrap("supplied properties not correct for \"ReputationOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetReputationOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetReputationOptionsPropertyValidator(properties).assertSuccess();
  return {
    "ReputationMetricsEnabled": cdk.booleanToCloudFormation(properties.reputationMetricsEnabled)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetReputationOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSet.ReputationOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.ReputationOptionsProperty>();
  ret.addPropertyResult("reputationMetricsEnabled", "ReputationMetricsEnabled", (properties.ReputationMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ReputationMetricsEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashboardOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetDashboardOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("engagementMetrics", cdk.requiredValidator)(properties.engagementMetrics));
  errors.collect(cdk.propertyValidator("engagementMetrics", cdk.validateString)(properties.engagementMetrics));
  return errors.wrap("supplied properties not correct for \"DashboardOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetDashboardOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetDashboardOptionsPropertyValidator(properties).assertSuccess();
  return {
    "EngagementMetrics": cdk.stringToCloudFormation(properties.engagementMetrics)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetDashboardOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.DashboardOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.DashboardOptionsProperty>();
  ret.addPropertyResult("engagementMetrics", "EngagementMetrics", (properties.EngagementMetrics != null ? cfn_parse.FromCloudFormation.getString(properties.EngagementMetrics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GuardianOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `GuardianOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetGuardianOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("optimizedSharedDelivery", cdk.requiredValidator)(properties.optimizedSharedDelivery));
  errors.collect(cdk.propertyValidator("optimizedSharedDelivery", cdk.validateString)(properties.optimizedSharedDelivery));
  return errors.wrap("supplied properties not correct for \"GuardianOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetGuardianOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetGuardianOptionsPropertyValidator(properties).assertSuccess();
  return {
    "OptimizedSharedDelivery": cdk.stringToCloudFormation(properties.optimizedSharedDelivery)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetGuardianOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.GuardianOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.GuardianOptionsProperty>();
  ret.addPropertyResult("optimizedSharedDelivery", "OptimizedSharedDelivery", (properties.OptimizedSharedDelivery != null ? cfn_parse.FromCloudFormation.getString(properties.OptimizedSharedDelivery) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VdmOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `VdmOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetVdmOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dashboardOptions", CfnConfigurationSetDashboardOptionsPropertyValidator)(properties.dashboardOptions));
  errors.collect(cdk.propertyValidator("guardianOptions", CfnConfigurationSetGuardianOptionsPropertyValidator)(properties.guardianOptions));
  return errors.wrap("supplied properties not correct for \"VdmOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetVdmOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetVdmOptionsPropertyValidator(properties).assertSuccess();
  return {
    "DashboardOptions": convertCfnConfigurationSetDashboardOptionsPropertyToCloudFormation(properties.dashboardOptions),
    "GuardianOptions": convertCfnConfigurationSetGuardianOptionsPropertyToCloudFormation(properties.guardianOptions)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetVdmOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSet.VdmOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.VdmOptionsProperty>();
  ret.addPropertyResult("dashboardOptions", "DashboardOptions", (properties.DashboardOptions != null ? CfnConfigurationSetDashboardOptionsPropertyFromCloudFormation(properties.DashboardOptions) : undefined));
  ret.addPropertyResult("guardianOptions", "GuardianOptions", (properties.GuardianOptions != null ? CfnConfigurationSetGuardianOptionsPropertyFromCloudFormation(properties.GuardianOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeliveryOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `DeliveryOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetDeliveryOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sendingPoolName", cdk.validateString)(properties.sendingPoolName));
  errors.collect(cdk.propertyValidator("tlsPolicy", cdk.validateString)(properties.tlsPolicy));
  return errors.wrap("supplied properties not correct for \"DeliveryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetDeliveryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetDeliveryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "SendingPoolName": cdk.stringToCloudFormation(properties.sendingPoolName),
    "TlsPolicy": cdk.stringToCloudFormation(properties.tlsPolicy)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetDeliveryOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.DeliveryOptionsProperty>();
  ret.addPropertyResult("sendingPoolName", "SendingPoolName", (properties.SendingPoolName != null ? cfn_parse.FromCloudFormation.getString(properties.SendingPoolName) : undefined));
  ret.addPropertyResult("tlsPolicy", "TlsPolicy", (properties.TlsPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.TlsPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryOptions", CfnConfigurationSetDeliveryOptionsPropertyValidator)(properties.deliveryOptions));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("reputationOptions", CfnConfigurationSetReputationOptionsPropertyValidator)(properties.reputationOptions));
  errors.collect(cdk.propertyValidator("sendingOptions", CfnConfigurationSetSendingOptionsPropertyValidator)(properties.sendingOptions));
  errors.collect(cdk.propertyValidator("suppressionOptions", CfnConfigurationSetSuppressionOptionsPropertyValidator)(properties.suppressionOptions));
  errors.collect(cdk.propertyValidator("trackingOptions", CfnConfigurationSetTrackingOptionsPropertyValidator)(properties.trackingOptions));
  errors.collect(cdk.propertyValidator("vdmOptions", CfnConfigurationSetVdmOptionsPropertyValidator)(properties.vdmOptions));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationSetProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetPropsValidator(properties).assertSuccess();
  return {
    "DeliveryOptions": convertCfnConfigurationSetDeliveryOptionsPropertyToCloudFormation(properties.deliveryOptions),
    "Name": cdk.stringToCloudFormation(properties.name),
    "ReputationOptions": convertCfnConfigurationSetReputationOptionsPropertyToCloudFormation(properties.reputationOptions),
    "SendingOptions": convertCfnConfigurationSetSendingOptionsPropertyToCloudFormation(properties.sendingOptions),
    "SuppressionOptions": convertCfnConfigurationSetSuppressionOptionsPropertyToCloudFormation(properties.suppressionOptions),
    "TrackingOptions": convertCfnConfigurationSetTrackingOptionsPropertyToCloudFormation(properties.trackingOptions),
    "VdmOptions": convertCfnConfigurationSetVdmOptionsPropertyToCloudFormation(properties.vdmOptions)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetProps>();
  ret.addPropertyResult("deliveryOptions", "DeliveryOptions", (properties.DeliveryOptions != null ? CfnConfigurationSetDeliveryOptionsPropertyFromCloudFormation(properties.DeliveryOptions) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("reputationOptions", "ReputationOptions", (properties.ReputationOptions != null ? CfnConfigurationSetReputationOptionsPropertyFromCloudFormation(properties.ReputationOptions) : undefined));
  ret.addPropertyResult("sendingOptions", "SendingOptions", (properties.SendingOptions != null ? CfnConfigurationSetSendingOptionsPropertyFromCloudFormation(properties.SendingOptions) : undefined));
  ret.addPropertyResult("suppressionOptions", "SuppressionOptions", (properties.SuppressionOptions != null ? CfnConfigurationSetSuppressionOptionsPropertyFromCloudFormation(properties.SuppressionOptions) : undefined));
  ret.addPropertyResult("trackingOptions", "TrackingOptions", (properties.TrackingOptions != null ? CfnConfigurationSetTrackingOptionsPropertyFromCloudFormation(properties.TrackingOptions) : undefined));
  ret.addPropertyResult("vdmOptions", "VdmOptions", (properties.VdmOptions != null ? CfnConfigurationSetVdmOptionsPropertyFromCloudFormation(properties.VdmOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a configuration set event destination.
 *
 * An event destination is an AWS service that Amazon SES publishes email sending events to. When you specify an event destination, you provide one, and only one, destination. You can send event data to Amazon CloudWatch, Amazon Kinesis Data Firehose, or Amazon Simple Notification Service (Amazon SNS).
 *
 * @cloudformationResource AWS::SES::ConfigurationSetEventDestination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html
 */
export class CfnConfigurationSetEventDestination extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::ConfigurationSetEventDestination";

  /**
   * Build a CfnConfigurationSetEventDestination from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnConfigurationSetEventDestination {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnConfigurationSetEventDestinationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnConfigurationSetEventDestination(scope, id, propsResult.value);
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
   * The name of the configuration set that contains the event destination.
   */
  public configurationSetName: string;

  /**
   * The event destination object.
   */
  public eventDestination: CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationSetEventDestinationProps) {
    super(scope, id, {
      "type": CfnConfigurationSetEventDestination.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "configurationSetName", this);
    cdk.requireProperty(props, "eventDestination", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.configurationSetName = props.configurationSetName;
    this.eventDestination = props.eventDestination;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configurationSetName": this.configurationSetName,
      "eventDestination": this.eventDestination
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnConfigurationSetEventDestination.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnConfigurationSetEventDestinationPropsToCloudFormation(props);
  }
}

export namespace CfnConfigurationSetEventDestination {
  /**
   * Contains information about an event destination.
   *
   * > When you create or update an event destination, you must provide one, and only one, destination. The destination can be Amazon CloudWatch, Amazon Kinesis Firehose or Amazon Simple Notification Service (Amazon SNS).
   *
   * Event destinations are associated with configuration sets, which enable you to publish email sending events to Amazon CloudWatch, Amazon Kinesis Firehose, or Amazon Simple Notification Service (Amazon SNS). For information about using configuration sets, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html
   */
  export interface EventDestinationProperty {
    /**
     * An object that contains the names, default values, and sources of the dimensions associated with an Amazon CloudWatch event destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html#cfn-ses-configurationseteventdestination-eventdestination-cloudwatchdestination
     */
    readonly cloudWatchDestination?: CfnConfigurationSetEventDestination.CloudWatchDestinationProperty | cdk.IResolvable;

    /**
     * Sets whether Amazon SES publishes events to this destination when you send an email with the associated configuration set.
     *
     * Set to `true` to enable publishing to this destination; set to `false` to prevent publishing to this destination. The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html#cfn-ses-configurationseteventdestination-eventdestination-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * An object that contains the delivery stream ARN and the IAM role ARN associated with an Amazon Kinesis Firehose event destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html#cfn-ses-configurationseteventdestination-eventdestination-kinesisfirehosedestination
     */
    readonly kinesisFirehoseDestination?: cdk.IResolvable | CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty;

    /**
     * The type of email sending events to publish to the event destination.
     *
     * - `send` - The send request was successful and SES will attempt to deliver the message to the recipient’s mail server. (If account-level or global suppression is being used, SES will still count it as a send, but delivery is suppressed.)
     * - `reject` - SES accepted the email, but determined that it contained a virus and didn’t attempt to deliver it to the recipient’s mail server.
     * - `bounce` - ( *Hard bounce* ) The recipient's mail server permanently rejected the email. ( *Soft bounces* are only included when SES fails to deliver the email after retrying for a period of time.)
     * - `complaint` - The email was successfully delivered to the recipient’s mail server, but the recipient marked it as spam.
     * - `delivery` - SES successfully delivered the email to the recipient's mail server.
     * - `open` - The recipient received the message and opened it in their email client.
     * - `click` - The recipient clicked one or more links in the email.
     * - `renderingFailure` - The email wasn't sent because of a template rendering issue. This event type can occur when template data is missing, or when there is a mismatch between template parameters and data. (This event type only occurs when you send email using the [`SendTemplatedEmail`](https://docs.aws.amazon.com/ses/latest/APIReference/API_SendTemplatedEmail.html) or [`SendBulkTemplatedEmail`](https://docs.aws.amazon.com/ses/latest/APIReference/API_SendBulkTemplatedEmail.html) API operations.)
     * - `deliveryDelay` - The email couldn't be delivered to the recipient’s mail server because a temporary issue occurred. Delivery delays can occur, for example, when the recipient's inbox is full, or when the receiving email server experiences a transient issue.
     * - `subscription` - The email was successfully delivered, but the recipient updated their subscription preferences by clicking on an *unsubscribe* link as part of your [subscription management](https://docs.aws.amazon.com/ses/latest/dg/sending-email-subscription-management.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html#cfn-ses-configurationseteventdestination-eventdestination-matchingeventtypes
     */
    readonly matchingEventTypes: Array<string>;

    /**
     * The name of the event destination. The name must meet the following requirements:.
     *
     * - Contain only ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-).
     * - Contain 64 characters or fewer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html#cfn-ses-configurationseteventdestination-eventdestination-name
     */
    readonly name?: string;

    /**
     * An object that contains the topic ARN associated with an Amazon Simple Notification Service (Amazon SNS) event destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-eventdestination.html#cfn-ses-configurationseteventdestination-eventdestination-snsdestination
     */
    readonly snsDestination?: cdk.IResolvable | CfnConfigurationSetEventDestination.SnsDestinationProperty;
  }

  /**
   * Contains the topic ARN associated with an Amazon Simple Notification Service (Amazon SNS) event destination.
   *
   * Event destinations, such as Amazon SNS, are associated with configuration sets, which enable you to publish email sending events. For information about using configuration sets, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-snsdestination.html
   */
  export interface SnsDestinationProperty {
    /**
     * The ARN of the Amazon SNS topic for email sending events.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) Amazon SNS operation.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-snsdestination.html#cfn-ses-configurationseteventdestination-snsdestination-topicarn
     */
    readonly topicArn: string;
  }

  /**
   * Contains information associated with an Amazon CloudWatch event destination to which email sending events are published.
   *
   * Event destinations, such as Amazon CloudWatch, are associated with configuration sets, which enable you to publish email sending events. For information about using configuration sets, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-cloudwatchdestination.html
   */
  export interface CloudWatchDestinationProperty {
    /**
     * A list of dimensions upon which to categorize your emails when you publish email sending events to Amazon CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-cloudwatchdestination.html#cfn-ses-configurationseteventdestination-cloudwatchdestination-dimensionconfigurations
     */
    readonly dimensionConfigurations?: Array<CfnConfigurationSetEventDestination.DimensionConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * Contains the dimension configuration to use when you publish email sending events to Amazon CloudWatch.
   *
   * For information about publishing email sending events to Amazon CloudWatch, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html
   */
  export interface DimensionConfigurationProperty {
    /**
     * The default value of the dimension that is published to Amazon CloudWatch if you do not provide the value of the dimension when you send an email.
     *
     * The default value must meet the following requirements:
     *
     * - Contain only ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), dashes (-), at signs (@), or periods (.).
     * - Contain 256 characters or fewer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-defaultdimensionvalue
     */
    readonly defaultDimensionValue: string;

    /**
     * The name of an Amazon CloudWatch dimension associated with an email sending metric.
     *
     * The name must meet the following requirements:
     *
     * - Contain only ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), dashes (-), or colons (:).
     * - Contain 256 characters or fewer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-dimensionname
     */
    readonly dimensionName: string;

    /**
     * The place where Amazon SES finds the value of a dimension to publish to Amazon CloudWatch.
     *
     * To use the message tags that you specify using an `X-SES-MESSAGE-TAGS` header or a parameter to the `SendEmail` / `SendRawEmail` API, specify `messageTag` . To use your own email headers, specify `emailHeader` . To put a custom tag on any link included in your email, specify `linkTag` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-dimensionconfiguration.html#cfn-ses-configurationseteventdestination-dimensionconfiguration-dimensionvaluesource
     */
    readonly dimensionValueSource: string;
  }

  /**
   * Contains the delivery stream ARN and the IAM role ARN associated with an Amazon Kinesis Firehose event destination.
   *
   * Event destinations, such as Amazon Kinesis Firehose, are associated with configuration sets, which enable you to publish email sending events. For information about using configuration sets, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/monitor-sending-activity.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-kinesisfirehosedestination.html
   */
  export interface KinesisFirehoseDestinationProperty {
    /**
     * The ARN of the Amazon Kinesis Firehose stream that email sending events should be published to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-kinesisfirehosedestination.html#cfn-ses-configurationseteventdestination-kinesisfirehosedestination-deliverystreamarn
     */
    readonly deliveryStreamArn: string;

    /**
     * The ARN of the IAM role under which Amazon SES publishes email sending events to the Amazon Kinesis Firehose stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-configurationseteventdestination-kinesisfirehosedestination.html#cfn-ses-configurationseteventdestination-kinesisfirehosedestination-iamrolearn
     */
    readonly iamRoleArn: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationSetEventDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html
 */
export interface CfnConfigurationSetEventDestinationProps {
  /**
   * The name of the configuration set that contains the event destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html#cfn-ses-configurationseteventdestination-configurationsetname
   */
  readonly configurationSetName: string;

  /**
   * The event destination object.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-configurationseteventdestination.html#cfn-ses-configurationseteventdestination-eventdestination
   */
  readonly eventDestination: CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `SnsDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `SnsDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationSnsDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("topicArn", cdk.requiredValidator)(properties.topicArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"SnsDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationSnsDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationSnsDestinationPropertyValidator(properties).assertSuccess();
  return {
    "TopicARN": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationSnsDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSetEventDestination.SnsDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.SnsDestinationProperty>();
  ret.addPropertyResult("topicArn", "TopicARN", (properties.TopicARN != null ? cfn_parse.FromCloudFormation.getString(properties.TopicARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DimensionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DimensionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationDimensionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultDimensionValue", cdk.requiredValidator)(properties.defaultDimensionValue));
  errors.collect(cdk.propertyValidator("defaultDimensionValue", cdk.validateString)(properties.defaultDimensionValue));
  errors.collect(cdk.propertyValidator("dimensionName", cdk.requiredValidator)(properties.dimensionName));
  errors.collect(cdk.propertyValidator("dimensionName", cdk.validateString)(properties.dimensionName));
  errors.collect(cdk.propertyValidator("dimensionValueSource", cdk.requiredValidator)(properties.dimensionValueSource));
  errors.collect(cdk.propertyValidator("dimensionValueSource", cdk.validateString)(properties.dimensionValueSource));
  return errors.wrap("supplied properties not correct for \"DimensionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationDimensionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationDimensionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DefaultDimensionValue": cdk.stringToCloudFormation(properties.defaultDimensionValue),
    "DimensionName": cdk.stringToCloudFormation(properties.dimensionName),
    "DimensionValueSource": cdk.stringToCloudFormation(properties.dimensionValueSource)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationDimensionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.DimensionConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.DimensionConfigurationProperty>();
  ret.addPropertyResult("defaultDimensionValue", "DefaultDimensionValue", (properties.DefaultDimensionValue != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultDimensionValue) : undefined));
  ret.addPropertyResult("dimensionName", "DimensionName", (properties.DimensionName != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionName) : undefined));
  ret.addPropertyResult("dimensionValueSource", "DimensionValueSource", (properties.DimensionValueSource != null ? cfn_parse.FromCloudFormation.getString(properties.DimensionValueSource) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dimensionConfigurations", cdk.listValidator(CfnConfigurationSetEventDestinationDimensionConfigurationPropertyValidator))(properties.dimensionConfigurations));
  return errors.wrap("supplied properties not correct for \"CloudWatchDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationCloudWatchDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyValidator(properties).assertSuccess();
  return {
    "DimensionConfigurations": cdk.listMapper(convertCfnConfigurationSetEventDestinationDimensionConfigurationPropertyToCloudFormation)(properties.dimensionConfigurations)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.CloudWatchDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.CloudWatchDestinationProperty>();
  ret.addPropertyResult("dimensionConfigurations", "DimensionConfigurations", (properties.DimensionConfigurations != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationSetEventDestinationDimensionConfigurationPropertyFromCloudFormation)(properties.DimensionConfigurations) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisFirehoseDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisFirehoseDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deliveryStreamArn", cdk.requiredValidator)(properties.deliveryStreamArn));
  errors.collect(cdk.propertyValidator("deliveryStreamArn", cdk.validateString)(properties.deliveryStreamArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.requiredValidator)(properties.iamRoleArn));
  errors.collect(cdk.propertyValidator("iamRoleArn", cdk.validateString)(properties.iamRoleArn));
  return errors.wrap("supplied properties not correct for \"KinesisFirehoseDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyValidator(properties).assertSuccess();
  return {
    "DeliveryStreamARN": cdk.stringToCloudFormation(properties.deliveryStreamArn),
    "IAMRoleARN": cdk.stringToCloudFormation(properties.iamRoleArn)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty>();
  ret.addPropertyResult("deliveryStreamArn", "DeliveryStreamARN", (properties.DeliveryStreamARN != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamARN) : undefined));
  ret.addPropertyResult("iamRoleArn", "IAMRoleARN", (properties.IAMRoleARN != null ? cfn_parse.FromCloudFormation.getString(properties.IAMRoleARN) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `EventDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationEventDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchDestination", CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyValidator)(properties.cloudWatchDestination));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("kinesisFirehoseDestination", CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyValidator)(properties.kinesisFirehoseDestination));
  errors.collect(cdk.propertyValidator("matchingEventTypes", cdk.requiredValidator)(properties.matchingEventTypes));
  errors.collect(cdk.propertyValidator("matchingEventTypes", cdk.listValidator(cdk.validateString))(properties.matchingEventTypes));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("snsDestination", CfnConfigurationSetEventDestinationSnsDestinationPropertyValidator)(properties.snsDestination));
  return errors.wrap("supplied properties not correct for \"EventDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationEventDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationEventDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchDestination": convertCfnConfigurationSetEventDestinationCloudWatchDestinationPropertyToCloudFormation(properties.cloudWatchDestination),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "KinesisFirehoseDestination": convertCfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyToCloudFormation(properties.kinesisFirehoseDestination),
    "MatchingEventTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.matchingEventTypes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "SnsDestination": convertCfnConfigurationSetEventDestinationSnsDestinationPropertyToCloudFormation(properties.snsDestination)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationEventDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.EventDestinationProperty>();
  ret.addPropertyResult("cloudWatchDestination", "CloudWatchDestination", (properties.CloudWatchDestination != null ? CfnConfigurationSetEventDestinationCloudWatchDestinationPropertyFromCloudFormation(properties.CloudWatchDestination) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("kinesisFirehoseDestination", "KinesisFirehoseDestination", (properties.KinesisFirehoseDestination != null ? CfnConfigurationSetEventDestinationKinesisFirehoseDestinationPropertyFromCloudFormation(properties.KinesisFirehoseDestination) : undefined));
  ret.addPropertyResult("matchingEventTypes", "MatchingEventTypes", (properties.MatchingEventTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.MatchingEventTypes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("snsDestination", "SnsDestination", (properties.SnsDestination != null ? CfnConfigurationSetEventDestinationSnsDestinationPropertyFromCloudFormation(properties.SnsDestination) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnConfigurationSetEventDestinationProps`
 *
 * @param properties - the TypeScript properties of a `CfnConfigurationSetEventDestinationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurationSetName", cdk.requiredValidator)(properties.configurationSetName));
  errors.collect(cdk.propertyValidator("configurationSetName", cdk.validateString)(properties.configurationSetName));
  errors.collect(cdk.propertyValidator("eventDestination", cdk.requiredValidator)(properties.eventDestination));
  errors.collect(cdk.propertyValidator("eventDestination", CfnConfigurationSetEventDestinationEventDestinationPropertyValidator)(properties.eventDestination));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationSetEventDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationPropsValidator(properties).assertSuccess();
  return {
    "ConfigurationSetName": cdk.stringToCloudFormation(properties.configurationSetName),
    "EventDestination": convertCfnConfigurationSetEventDestinationEventDestinationPropertyToCloudFormation(properties.eventDestination)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnConfigurationSetEventDestinationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestinationProps>();
  ret.addPropertyResult("configurationSetName", "ConfigurationSetName", (properties.ConfigurationSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationSetName) : undefined));
  ret.addPropertyResult("eventDestination", "EventDestination", (properties.EventDestination != null ? CfnConfigurationSetEventDestinationEventDestinationPropertyFromCloudFormation(properties.EventDestination) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A list that contains contacts that have subscribed to a particular topic or topics.
 *
 * @cloudformationResource AWS::SES::ContactList
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-contactlist.html
 */
export class CfnContactList extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::ContactList";

  /**
   * Build a CfnContactList from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnContactList {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnContactListPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnContactList(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the contact list.
   */
  public contactListName?: string;

  /**
   * A description of what the contact list is about.
   */
  public description?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags associated with a contact list.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * An interest group, theme, or label within a list.
   */
  public topics?: Array<cdk.IResolvable | CfnContactList.TopicProperty> | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnContactListProps = {}) {
    super(scope, id, {
      "type": CfnContactList.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.contactListName = props.contactListName;
    this.description = props.description;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SES::ContactList", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.topics = props.topics;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "contactListName": this.contactListName,
      "description": this.description,
      "tags": this.tags.renderTags(),
      "topics": this.topics
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnContactList.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnContactListPropsToCloudFormation(props);
  }
}

export namespace CfnContactList {
  /**
   * An interest group, theme, or label within a list.
   *
   * Lists can have multiple topics.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-contactlist-topic.html
   */
  export interface TopicProperty {
    /**
     * The default subscription status to be applied to a contact if the contact has not noted their preference for subscribing to a topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-contactlist-topic.html#cfn-ses-contactlist-topic-defaultsubscriptionstatus
     */
    readonly defaultSubscriptionStatus: string;

    /**
     * A description of what the topic is about, which the contact will see.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-contactlist-topic.html#cfn-ses-contactlist-topic-description
     */
    readonly description?: string;

    /**
     * The name of the topic the contact will see.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-contactlist-topic.html#cfn-ses-contactlist-topic-displayname
     */
    readonly displayName: string;

    /**
     * The name of the topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-contactlist-topic.html#cfn-ses-contactlist-topic-topicname
     */
    readonly topicName: string;
  }
}

/**
 * Properties for defining a `CfnContactList`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-contactlist.html
 */
export interface CfnContactListProps {
  /**
   * The name of the contact list.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-contactlist.html#cfn-ses-contactlist-contactlistname
   */
  readonly contactListName?: string;

  /**
   * A description of what the contact list is about.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-contactlist.html#cfn-ses-contactlist-description
   */
  readonly description?: string;

  /**
   * The tags associated with a contact list.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-contactlist.html#cfn-ses-contactlist-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * An interest group, theme, or label within a list.
   *
   * A contact list can have multiple topics.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-contactlist.html#cfn-ses-contactlist-topics
   */
  readonly topics?: Array<cdk.IResolvable | CfnContactList.TopicProperty> | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `TopicProperty`
 *
 * @param properties - the TypeScript properties of a `TopicProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactListTopicPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("defaultSubscriptionStatus", cdk.requiredValidator)(properties.defaultSubscriptionStatus));
  errors.collect(cdk.propertyValidator("defaultSubscriptionStatus", cdk.validateString)(properties.defaultSubscriptionStatus));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("displayName", cdk.requiredValidator)(properties.displayName));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("topicName", cdk.requiredValidator)(properties.topicName));
  errors.collect(cdk.propertyValidator("topicName", cdk.validateString)(properties.topicName));
  return errors.wrap("supplied properties not correct for \"TopicProperty\"");
}

// @ts-ignore TS6133
function convertCfnContactListTopicPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactListTopicPropertyValidator(properties).assertSuccess();
  return {
    "DefaultSubscriptionStatus": cdk.stringToCloudFormation(properties.defaultSubscriptionStatus),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "TopicName": cdk.stringToCloudFormation(properties.topicName)
  };
}

// @ts-ignore TS6133
function CfnContactListTopicPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnContactList.TopicProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactList.TopicProperty>();
  ret.addPropertyResult("defaultSubscriptionStatus", "DefaultSubscriptionStatus", (properties.DefaultSubscriptionStatus != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultSubscriptionStatus) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("topicName", "TopicName", (properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnContactListProps`
 *
 * @param properties - the TypeScript properties of a `CfnContactListProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnContactListPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("contactListName", cdk.validateString)(properties.contactListName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("topics", cdk.listValidator(CfnContactListTopicPropertyValidator))(properties.topics));
  return errors.wrap("supplied properties not correct for \"CfnContactListProps\"");
}

// @ts-ignore TS6133
function convertCfnContactListPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnContactListPropsValidator(properties).assertSuccess();
  return {
    "ContactListName": cdk.stringToCloudFormation(properties.contactListName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Topics": cdk.listMapper(convertCfnContactListTopicPropertyToCloudFormation)(properties.topics)
  };
}

// @ts-ignore TS6133
function CfnContactListPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnContactListProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnContactListProps>();
  ret.addPropertyResult("contactListName", "ContactListName", (properties.ContactListName != null ? cfn_parse.FromCloudFormation.getString(properties.ContactListName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("topics", "Topics", (properties.Topics != null ? cfn_parse.FromCloudFormation.getArray(CfnContactListTopicPropertyFromCloudFormation)(properties.Topics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create a new pool of dedicated IP addresses.
 *
 * A pool can include one or more dedicated IP addresses that are associated with your AWS account . You can associate a pool with a configuration set. When you send an email that uses that configuration set, the message is sent from one of the addresses in the associated pool.
 *
 * > You can't delete dedicated IP pools that have a `STANDARD` scaling mode with one or more dedicated IP addresses. This constraint doesn't apply to dedicated IP pools that have a `MANAGED` scaling mode.
 *
 * @cloudformationResource AWS::SES::DedicatedIpPool
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-dedicatedippool.html
 */
export class CfnDedicatedIpPool extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::DedicatedIpPool";

  /**
   * Build a CfnDedicatedIpPool from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnDedicatedIpPool {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnDedicatedIpPoolPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnDedicatedIpPool(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the dedicated IP pool that the IP address is associated with.
   */
  public poolName?: string;

  /**
   * The type of scaling mode.
   */
  public scalingMode?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnDedicatedIpPoolProps = {}) {
    super(scope, id, {
      "type": CfnDedicatedIpPool.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.poolName = props.poolName;
    this.scalingMode = props.scalingMode;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "poolName": this.poolName,
      "scalingMode": this.scalingMode
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnDedicatedIpPool.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnDedicatedIpPoolPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnDedicatedIpPool`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-dedicatedippool.html
 */
export interface CfnDedicatedIpPoolProps {
  /**
   * The name of the dedicated IP pool that the IP address is associated with.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-dedicatedippool.html#cfn-ses-dedicatedippool-poolname
   */
  readonly poolName?: string;

  /**
   * The type of scaling mode.
   *
   * The following options are available:
   *
   * - `STANDARD` - The customer controls which IPs are part of the dedicated IP pool.
   * - `MANAGED` - The reputation and number of IPs are automatically managed by Amazon SES .
   *
   * The `STANDARD` option is selected by default if no value is specified.
   *
   * > Updating *ScalingMode* doesn't require a replacement if you're updating its value from `STANDARD` to `MANAGED` . However, updating *ScalingMode* from `MANAGED` to `STANDARD` is not supported.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-dedicatedippool.html#cfn-ses-dedicatedippool-scalingmode
   */
  readonly scalingMode?: string;
}

/**
 * Determine whether the given properties match those of a `CfnDedicatedIpPoolProps`
 *
 * @param properties - the TypeScript properties of a `CfnDedicatedIpPoolProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDedicatedIpPoolPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("poolName", cdk.validateString)(properties.poolName));
  errors.collect(cdk.propertyValidator("scalingMode", cdk.validateString)(properties.scalingMode));
  return errors.wrap("supplied properties not correct for \"CfnDedicatedIpPoolProps\"");
}

// @ts-ignore TS6133
function convertCfnDedicatedIpPoolPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDedicatedIpPoolPropsValidator(properties).assertSuccess();
  return {
    "PoolName": cdk.stringToCloudFormation(properties.poolName),
    "ScalingMode": cdk.stringToCloudFormation(properties.scalingMode)
  };
}

// @ts-ignore TS6133
function CfnDedicatedIpPoolPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnDedicatedIpPoolProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDedicatedIpPoolProps>();
  ret.addPropertyResult("poolName", "PoolName", (properties.PoolName != null ? cfn_parse.FromCloudFormation.getString(properties.PoolName) : undefined));
  ret.addPropertyResult("scalingMode", "ScalingMode", (properties.ScalingMode != null ? cfn_parse.FromCloudFormation.getString(properties.ScalingMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an identity for using within SES.
 *
 * An identity is an email address or domain that you use when you send email. Before you can use an identity to send email, you first have to verify it. By verifying an identity, you demonstrate that you're the owner of the identity, and that you've given Amazon SES API v2 permission to send email from the identity.
 *
 * When you verify an email address, SES sends an email to the address. Your email address is verified as soon as you follow the link in the verification email. When you verify a domain without specifying the DkimSigningAttributes properties, OR only the NextSigningKeyLength property of DkimSigningAttributes, this resource provides a set of CNAME token names and values (DkimDNSTokenName1, DkimDNSTokenValue1, DkimDNSTokenName2, DkimDNSTokenValue2, DkimDNSTokenName3, DkimDNSTokenValue3) as outputs. You can then add these to the DNS configuration for your domain. Your domain is verified when Amazon SES detects these records in the DNS configuration for your domain. This verification method is known as Easy DKIM.
 *
 * Alternatively, you can perform the verification process by providing your own public-private key pair. This verification method is known as Bring Your Own DKIM (BYODKIM). To use BYODKIM, your resource must include DkimSigningAttributes properties DomainSigningSelector and DomainSigningPrivateKey. When you specify this object, you provide a selector (DomainSigningSelector) (a component of the DNS record name that identifies the public key to use for DKIM authentication) and a private key (DomainSigningPrivateKey).
 *
 * Additionally, you can associate an existing configuration set with the email identity that you're verifying.
 *
 * @cloudformationResource AWS::SES::EmailIdentity
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html
 */
export class CfnEmailIdentity extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::EmailIdentity";

  /**
   * Build a CfnEmailIdentity from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEmailIdentity {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEmailIdentityPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEmailIdentity(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The host name for the first token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute DkimDNSTokenName1
   */
  public readonly attrDkimDnsTokenName1: string;

  /**
   * The host name for the second token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute DkimDNSTokenName2
   */
  public readonly attrDkimDnsTokenName2: string;

  /**
   * The host name for the third token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute DkimDNSTokenName3
   */
  public readonly attrDkimDnsTokenName3: string;

  /**
   * The record value for the first token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute DkimDNSTokenValue1
   */
  public readonly attrDkimDnsTokenValue1: string;

  /**
   * The record value for the second token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute DkimDNSTokenValue2
   */
  public readonly attrDkimDnsTokenValue2: string;

  /**
   * The record value for the third token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute DkimDNSTokenValue3
   */
  public readonly attrDkimDnsTokenValue3: string;

  /**
   * Used to associate a configuration set with an email identity.
   */
  public configurationSetAttributes?: CfnEmailIdentity.ConfigurationSetAttributesProperty | cdk.IResolvable;

  /**
   * An object that contains information about the DKIM attributes for the identity.
   */
  public dkimAttributes?: CfnEmailIdentity.DkimAttributesProperty | cdk.IResolvable;

  /**
   * If your request includes this object, Amazon SES configures the identity to use Bring Your Own DKIM (BYODKIM) for DKIM authentication purposes, or, configures the key length to be used for [Easy DKIM](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-easy.html) .
   */
  public dkimSigningAttributes?: CfnEmailIdentity.DkimSigningAttributesProperty | cdk.IResolvable;

  /**
   * The email address or domain to verify.
   */
  public emailIdentity: string;

  /**
   * Used to enable or disable feedback forwarding for an identity.
   */
  public feedbackAttributes?: CfnEmailIdentity.FeedbackAttributesProperty | cdk.IResolvable;

  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   */
  public mailFromAttributes?: cdk.IResolvable | CfnEmailIdentity.MailFromAttributesProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEmailIdentityProps) {
    super(scope, id, {
      "type": CfnEmailIdentity.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "emailIdentity", this);

    this.attrDkimDnsTokenName1 = cdk.Token.asString(this.getAtt("DkimDNSTokenName1", cdk.ResolutionTypeHint.STRING));
    this.attrDkimDnsTokenName2 = cdk.Token.asString(this.getAtt("DkimDNSTokenName2", cdk.ResolutionTypeHint.STRING));
    this.attrDkimDnsTokenName3 = cdk.Token.asString(this.getAtt("DkimDNSTokenName3", cdk.ResolutionTypeHint.STRING));
    this.attrDkimDnsTokenValue1 = cdk.Token.asString(this.getAtt("DkimDNSTokenValue1", cdk.ResolutionTypeHint.STRING));
    this.attrDkimDnsTokenValue2 = cdk.Token.asString(this.getAtt("DkimDNSTokenValue2", cdk.ResolutionTypeHint.STRING));
    this.attrDkimDnsTokenValue3 = cdk.Token.asString(this.getAtt("DkimDNSTokenValue3", cdk.ResolutionTypeHint.STRING));
    this.configurationSetAttributes = props.configurationSetAttributes;
    this.dkimAttributes = props.dkimAttributes;
    this.dkimSigningAttributes = props.dkimSigningAttributes;
    this.emailIdentity = props.emailIdentity;
    this.feedbackAttributes = props.feedbackAttributes;
    this.mailFromAttributes = props.mailFromAttributes;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configurationSetAttributes": this.configurationSetAttributes,
      "dkimAttributes": this.dkimAttributes,
      "dkimSigningAttributes": this.dkimSigningAttributes,
      "emailIdentity": this.emailIdentity,
      "feedbackAttributes": this.feedbackAttributes,
      "mailFromAttributes": this.mailFromAttributes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEmailIdentity.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEmailIdentityPropsToCloudFormation(props);
  }
}

export namespace CfnEmailIdentity {
  /**
   * Used to associate a configuration set with an email identity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-configurationsetattributes.html
   */
  export interface ConfigurationSetAttributesProperty {
    /**
     * The configuration set to associate with an email identity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-configurationsetattributes.html#cfn-ses-emailidentity-configurationsetattributes-configurationsetname
     */
    readonly configurationSetName?: string;
  }

  /**
   * Used to configure or change the DKIM authentication settings for an email domain identity.
   *
   * You can use this operation to do any of the following:
   *
   * - Update the signing attributes for an identity that uses Bring Your Own DKIM (BYODKIM).
   * - Update the key length that should be used for Easy DKIM.
   * - Change from using no DKIM authentication to using Easy DKIM.
   * - Change from using no DKIM authentication to using BYODKIM.
   * - Change from using Easy DKIM to using BYODKIM.
   * - Change from using BYODKIM to using Easy DKIM.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-dkimsigningattributes.html
   */
  export interface DkimSigningAttributesProperty {
    /**
     * [Bring Your Own DKIM] A private key that's used to generate a DKIM signature.
     *
     * The private key must use 1024 or 2048-bit RSA encryption, and must be encoded using base64 encoding.
     *
     * > Rather than embedding sensitive information directly in your CFN templates, we recommend you use dynamic parameters in the stack template to reference sensitive information that is stored and managed outside of CFN, such as in the AWS Systems Manager Parameter Store or AWS Secrets Manager.
     * >
     * > For more information, see the [Do not embed credentials in your templates](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html#creds) best practice.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-dkimsigningattributes.html#cfn-ses-emailidentity-dkimsigningattributes-domainsigningprivatekey
     */
    readonly domainSigningPrivateKey?: string;

    /**
     * [Bring Your Own DKIM] A string that's used to identify a public key in the DNS configuration for a domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-dkimsigningattributes.html#cfn-ses-emailidentity-dkimsigningattributes-domainsigningselector
     */
    readonly domainSigningSelector?: string;

    /**
     * [Easy DKIM] The key length of the future DKIM key pair to be generated.
     *
     * This can be changed at most once per day.
     *
     * Valid Values: `RSA_1024_BIT | RSA_2048_BIT`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-dkimsigningattributes.html#cfn-ses-emailidentity-dkimsigningattributes-nextsigningkeylength
     */
    readonly nextSigningKeyLength?: string;
  }

  /**
   * Used to enable or disable DKIM authentication for an email identity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-dkimattributes.html
   */
  export interface DkimAttributesProperty {
    /**
     * Sets the DKIM signing configuration for the identity.
     *
     * When you set this value `true` , then the messages that are sent from the identity are signed using DKIM. If you set this value to `false` , your messages are sent without DKIM signing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-dkimattributes.html#cfn-ses-emailidentity-dkimattributes-signingenabled
     */
    readonly signingEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Used to enable or disable feedback forwarding for an identity.
   *
   * This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-feedbackattributes.html
   */
  export interface FeedbackAttributesProperty {
    /**
     * Sets the feedback forwarding configuration for the identity.
     *
     * If the value is `true` , you receive email notifications when bounce or complaint events occur. These notifications are sent to the address that you specified in the `Return-Path` header of the original email.
     *
     * You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications (for example, by setting up an event destination), you receive an email notification when these events occur (even if this setting is disabled).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-feedbackattributes.html#cfn-ses-emailidentity-feedbackattributes-emailforwardingenabled
     */
    readonly emailForwardingEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-mailfromattributes.html
   */
  export interface MailFromAttributesProperty {
    /**
     * The action to take if the required MX record isn't found when you send an email.
     *
     * When you set this value to `USE_DEFAULT_VALUE` , the mail is sent using *amazonses.com* as the MAIL FROM domain. When you set this value to `REJECT_MESSAGE` , the Amazon SES API v2 returns a `MailFromDomainNotVerified` error, and doesn't attempt to deliver the email.
     *
     * These behaviors are taken when the custom MAIL FROM domain configuration is in the `Pending` , `Failed` , and `TemporaryFailure` states.
     *
     * Valid Values: `USE_DEFAULT_VALUE | REJECT_MESSAGE`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-mailfromattributes.html#cfn-ses-emailidentity-mailfromattributes-behavioronmxfailure
     */
    readonly behaviorOnMxFailure?: string;

    /**
     * The custom MAIL FROM domain that you want the verified identity to use.
     *
     * The MAIL FROM domain must meet the following criteria:
     *
     * - It has to be a subdomain of the verified identity.
     * - It can't be used to receive email.
     * - It can't be used in a "From" address if the MAIL FROM domain is a destination for feedback forwarding emails.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-emailidentity-mailfromattributes.html#cfn-ses-emailidentity-mailfromattributes-mailfromdomain
     */
    readonly mailFromDomain?: string;
  }
}

/**
 * Properties for defining a `CfnEmailIdentity`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html
 */
export interface CfnEmailIdentityProps {
  /**
   * Used to associate a configuration set with an email identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html#cfn-ses-emailidentity-configurationsetattributes
   */
  readonly configurationSetAttributes?: CfnEmailIdentity.ConfigurationSetAttributesProperty | cdk.IResolvable;

  /**
   * An object that contains information about the DKIM attributes for the identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html#cfn-ses-emailidentity-dkimattributes
   */
  readonly dkimAttributes?: CfnEmailIdentity.DkimAttributesProperty | cdk.IResolvable;

  /**
   * If your request includes this object, Amazon SES configures the identity to use Bring Your Own DKIM (BYODKIM) for DKIM authentication purposes, or, configures the key length to be used for [Easy DKIM](https://docs.aws.amazon.com/ses/latest/dg/send-email-authentication-dkim-easy.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html#cfn-ses-emailidentity-dkimsigningattributes
   */
  readonly dkimSigningAttributes?: CfnEmailIdentity.DkimSigningAttributesProperty | cdk.IResolvable;

  /**
   * The email address or domain to verify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html#cfn-ses-emailidentity-emailidentity
   */
  readonly emailIdentity: string;

  /**
   * Used to enable or disable feedback forwarding for an identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html#cfn-ses-emailidentity-feedbackattributes
   */
  readonly feedbackAttributes?: CfnEmailIdentity.FeedbackAttributesProperty | cdk.IResolvable;

  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-emailidentity.html#cfn-ses-emailidentity-mailfromattributes
   */
  readonly mailFromAttributes?: cdk.IResolvable | CfnEmailIdentity.MailFromAttributesProperty;
}

/**
 * Determine whether the given properties match those of a `ConfigurationSetAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationSetAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailIdentityConfigurationSetAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurationSetName", cdk.validateString)(properties.configurationSetName));
  return errors.wrap("supplied properties not correct for \"ConfigurationSetAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEmailIdentityConfigurationSetAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailIdentityConfigurationSetAttributesPropertyValidator(properties).assertSuccess();
  return {
    "ConfigurationSetName": cdk.stringToCloudFormation(properties.configurationSetName)
  };
}

// @ts-ignore TS6133
function CfnEmailIdentityConfigurationSetAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailIdentity.ConfigurationSetAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailIdentity.ConfigurationSetAttributesProperty>();
  ret.addPropertyResult("configurationSetName", "ConfigurationSetName", (properties.ConfigurationSetName != null ? cfn_parse.FromCloudFormation.getString(properties.ConfigurationSetName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DkimSigningAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `DkimSigningAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailIdentityDkimSigningAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainSigningPrivateKey", cdk.validateString)(properties.domainSigningPrivateKey));
  errors.collect(cdk.propertyValidator("domainSigningSelector", cdk.validateString)(properties.domainSigningSelector));
  errors.collect(cdk.propertyValidator("nextSigningKeyLength", cdk.validateString)(properties.nextSigningKeyLength));
  return errors.wrap("supplied properties not correct for \"DkimSigningAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEmailIdentityDkimSigningAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailIdentityDkimSigningAttributesPropertyValidator(properties).assertSuccess();
  return {
    "DomainSigningPrivateKey": cdk.stringToCloudFormation(properties.domainSigningPrivateKey),
    "DomainSigningSelector": cdk.stringToCloudFormation(properties.domainSigningSelector),
    "NextSigningKeyLength": cdk.stringToCloudFormation(properties.nextSigningKeyLength)
  };
}

// @ts-ignore TS6133
function CfnEmailIdentityDkimSigningAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailIdentity.DkimSigningAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailIdentity.DkimSigningAttributesProperty>();
  ret.addPropertyResult("domainSigningPrivateKey", "DomainSigningPrivateKey", (properties.DomainSigningPrivateKey != null ? cfn_parse.FromCloudFormation.getString(properties.DomainSigningPrivateKey) : undefined));
  ret.addPropertyResult("domainSigningSelector", "DomainSigningSelector", (properties.DomainSigningSelector != null ? cfn_parse.FromCloudFormation.getString(properties.DomainSigningSelector) : undefined));
  ret.addPropertyResult("nextSigningKeyLength", "NextSigningKeyLength", (properties.NextSigningKeyLength != null ? cfn_parse.FromCloudFormation.getString(properties.NextSigningKeyLength) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DkimAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `DkimAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailIdentityDkimAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("signingEnabled", cdk.validateBoolean)(properties.signingEnabled));
  return errors.wrap("supplied properties not correct for \"DkimAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEmailIdentityDkimAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailIdentityDkimAttributesPropertyValidator(properties).assertSuccess();
  return {
    "SigningEnabled": cdk.booleanToCloudFormation(properties.signingEnabled)
  };
}

// @ts-ignore TS6133
function CfnEmailIdentityDkimAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailIdentity.DkimAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailIdentity.DkimAttributesProperty>();
  ret.addPropertyResult("signingEnabled", "SigningEnabled", (properties.SigningEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SigningEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FeedbackAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `FeedbackAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailIdentityFeedbackAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("emailForwardingEnabled", cdk.validateBoolean)(properties.emailForwardingEnabled));
  return errors.wrap("supplied properties not correct for \"FeedbackAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEmailIdentityFeedbackAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailIdentityFeedbackAttributesPropertyValidator(properties).assertSuccess();
  return {
    "EmailForwardingEnabled": cdk.booleanToCloudFormation(properties.emailForwardingEnabled)
  };
}

// @ts-ignore TS6133
function CfnEmailIdentityFeedbackAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailIdentity.FeedbackAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailIdentity.FeedbackAttributesProperty>();
  ret.addPropertyResult("emailForwardingEnabled", "EmailForwardingEnabled", (properties.EmailForwardingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EmailForwardingEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MailFromAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `MailFromAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailIdentityMailFromAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("behaviorOnMxFailure", cdk.validateString)(properties.behaviorOnMxFailure));
  errors.collect(cdk.propertyValidator("mailFromDomain", cdk.validateString)(properties.mailFromDomain));
  return errors.wrap("supplied properties not correct for \"MailFromAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnEmailIdentityMailFromAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailIdentityMailFromAttributesPropertyValidator(properties).assertSuccess();
  return {
    "BehaviorOnMxFailure": cdk.stringToCloudFormation(properties.behaviorOnMxFailure),
    "MailFromDomain": cdk.stringToCloudFormation(properties.mailFromDomain)
  };
}

// @ts-ignore TS6133
function CfnEmailIdentityMailFromAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEmailIdentity.MailFromAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailIdentity.MailFromAttributesProperty>();
  ret.addPropertyResult("behaviorOnMxFailure", "BehaviorOnMxFailure", (properties.BehaviorOnMxFailure != null ? cfn_parse.FromCloudFormation.getString(properties.BehaviorOnMxFailure) : undefined));
  ret.addPropertyResult("mailFromDomain", "MailFromDomain", (properties.MailFromDomain != null ? cfn_parse.FromCloudFormation.getString(properties.MailFromDomain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEmailIdentityProps`
 *
 * @param properties - the TypeScript properties of a `CfnEmailIdentityProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEmailIdentityPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("configurationSetAttributes", CfnEmailIdentityConfigurationSetAttributesPropertyValidator)(properties.configurationSetAttributes));
  errors.collect(cdk.propertyValidator("dkimAttributes", CfnEmailIdentityDkimAttributesPropertyValidator)(properties.dkimAttributes));
  errors.collect(cdk.propertyValidator("dkimSigningAttributes", CfnEmailIdentityDkimSigningAttributesPropertyValidator)(properties.dkimSigningAttributes));
  errors.collect(cdk.propertyValidator("emailIdentity", cdk.requiredValidator)(properties.emailIdentity));
  errors.collect(cdk.propertyValidator("emailIdentity", cdk.validateString)(properties.emailIdentity));
  errors.collect(cdk.propertyValidator("feedbackAttributes", CfnEmailIdentityFeedbackAttributesPropertyValidator)(properties.feedbackAttributes));
  errors.collect(cdk.propertyValidator("mailFromAttributes", CfnEmailIdentityMailFromAttributesPropertyValidator)(properties.mailFromAttributes));
  return errors.wrap("supplied properties not correct for \"CfnEmailIdentityProps\"");
}

// @ts-ignore TS6133
function convertCfnEmailIdentityPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEmailIdentityPropsValidator(properties).assertSuccess();
  return {
    "ConfigurationSetAttributes": convertCfnEmailIdentityConfigurationSetAttributesPropertyToCloudFormation(properties.configurationSetAttributes),
    "DkimAttributes": convertCfnEmailIdentityDkimAttributesPropertyToCloudFormation(properties.dkimAttributes),
    "DkimSigningAttributes": convertCfnEmailIdentityDkimSigningAttributesPropertyToCloudFormation(properties.dkimSigningAttributes),
    "EmailIdentity": cdk.stringToCloudFormation(properties.emailIdentity),
    "FeedbackAttributes": convertCfnEmailIdentityFeedbackAttributesPropertyToCloudFormation(properties.feedbackAttributes),
    "MailFromAttributes": convertCfnEmailIdentityMailFromAttributesPropertyToCloudFormation(properties.mailFromAttributes)
  };
}

// @ts-ignore TS6133
function CfnEmailIdentityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEmailIdentityProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEmailIdentityProps>();
  ret.addPropertyResult("configurationSetAttributes", "ConfigurationSetAttributes", (properties.ConfigurationSetAttributes != null ? CfnEmailIdentityConfigurationSetAttributesPropertyFromCloudFormation(properties.ConfigurationSetAttributes) : undefined));
  ret.addPropertyResult("dkimAttributes", "DkimAttributes", (properties.DkimAttributes != null ? CfnEmailIdentityDkimAttributesPropertyFromCloudFormation(properties.DkimAttributes) : undefined));
  ret.addPropertyResult("dkimSigningAttributes", "DkimSigningAttributes", (properties.DkimSigningAttributes != null ? CfnEmailIdentityDkimSigningAttributesPropertyFromCloudFormation(properties.DkimSigningAttributes) : undefined));
  ret.addPropertyResult("emailIdentity", "EmailIdentity", (properties.EmailIdentity != null ? cfn_parse.FromCloudFormation.getString(properties.EmailIdentity) : undefined));
  ret.addPropertyResult("feedbackAttributes", "FeedbackAttributes", (properties.FeedbackAttributes != null ? CfnEmailIdentityFeedbackAttributesPropertyFromCloudFormation(properties.FeedbackAttributes) : undefined));
  ret.addPropertyResult("mailFromAttributes", "MailFromAttributes", (properties.MailFromAttributes != null ? CfnEmailIdentityMailFromAttributesPropertyFromCloudFormation(properties.MailFromAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specify a new IP address filter.
 *
 * You use IP address filters when you receive email with Amazon SES.
 *
 * @cloudformationResource AWS::SES::ReceiptFilter
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptfilter.html
 */
export class CfnReceiptFilter extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::ReceiptFilter";

  /**
   * Build a CfnReceiptFilter from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReceiptFilter {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReceiptFilterPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReceiptFilter(scope, id, propsResult.value);
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
   * A data structure that describes the IP address filter to create, which consists of a name, an IP address range, and whether to allow or block mail from it.
   */
  public filter: CfnReceiptFilter.FilterProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReceiptFilterProps) {
    super(scope, id, {
      "type": CfnReceiptFilter.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "filter", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.filter = props.filter;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "filter": this.filter
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReceiptFilter.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReceiptFilterPropsToCloudFormation(props);
  }
}

export namespace CfnReceiptFilter {
  /**
   * Specifies an IP address filter.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-filter.html
   */
  export interface FilterProperty {
    /**
     * A structure that provides the IP addresses to block or allow, and whether to block or allow incoming mail from them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-filter.html#cfn-ses-receiptfilter-filter-ipfilter
     */
    readonly ipFilter: CfnReceiptFilter.IpFilterProperty | cdk.IResolvable;

    /**
     * The name of the IP address filter. The name must meet the following requirements:.
     *
     * - Contain only ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), or dashes (-).
     * - Start and end with a letter or number.
     * - Contain 64 characters or fewer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-filter.html#cfn-ses-receiptfilter-filter-name
     */
    readonly name?: string;
  }

  /**
   * A receipt IP address filter enables you to specify whether to accept or reject mail originating from an IP address or range of IP addresses.
   *
   * For information about setting up IP address filters, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-ip-filtering-console-walkthrough.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html
   */
  export interface IpFilterProperty {
    /**
     * A single IP address or a range of IP addresses to block or allow, specified in Classless Inter-Domain Routing (CIDR) notation.
     *
     * An example of a single email address is 10.0.0.1. An example of a range of IP addresses is 10.0.0.1/24. For more information about CIDR notation, see [RFC 2317](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc2317) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html#cfn-ses-receiptfilter-ipfilter-cidr
     */
    readonly cidr: string;

    /**
     * Indicates whether to block or allow incoming mail from the specified IP addresses.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptfilter-ipfilter.html#cfn-ses-receiptfilter-ipfilter-policy
     */
    readonly policy: string;
  }
}

/**
 * Properties for defining a `CfnReceiptFilter`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptfilter.html
 */
export interface CfnReceiptFilterProps {
  /**
   * A data structure that describes the IP address filter to create, which consists of a name, an IP address range, and whether to allow or block mail from it.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptfilter.html#cfn-ses-receiptfilter-filter
   */
  readonly filter: CfnReceiptFilter.FilterProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `IpFilterProperty`
 *
 * @param properties - the TypeScript properties of a `IpFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptFilterIpFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cidr", cdk.requiredValidator)(properties.cidr));
  errors.collect(cdk.propertyValidator("cidr", cdk.validateString)(properties.cidr));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateString)(properties.policy));
  return errors.wrap("supplied properties not correct for \"IpFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptFilterIpFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptFilterIpFilterPropertyValidator(properties).assertSuccess();
  return {
    "Cidr": cdk.stringToCloudFormation(properties.cidr),
    "Policy": cdk.stringToCloudFormation(properties.policy)
  };
}

// @ts-ignore TS6133
function CfnReceiptFilterIpFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptFilter.IpFilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptFilter.IpFilterProperty>();
  ret.addPropertyResult("cidr", "Cidr", (properties.Cidr != null ? cfn_parse.FromCloudFormation.getString(properties.Cidr) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getString(properties.Policy) : undefined));
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
function CfnReceiptFilterFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ipFilter", cdk.requiredValidator)(properties.ipFilter));
  errors.collect(cdk.propertyValidator("ipFilter", CfnReceiptFilterIpFilterPropertyValidator)(properties.ipFilter));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  return errors.wrap("supplied properties not correct for \"FilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptFilterFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptFilterFilterPropertyValidator(properties).assertSuccess();
  return {
    "IpFilter": convertCfnReceiptFilterIpFilterPropertyToCloudFormation(properties.ipFilter),
    "Name": cdk.stringToCloudFormation(properties.name)
  };
}

// @ts-ignore TS6133
function CfnReceiptFilterFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptFilter.FilterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptFilter.FilterProperty>();
  ret.addPropertyResult("ipFilter", "IpFilter", (properties.IpFilter != null ? CfnReceiptFilterIpFilterPropertyFromCloudFormation(properties.IpFilter) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReceiptFilterProps`
 *
 * @param properties - the TypeScript properties of a `CfnReceiptFilterProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptFilterPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filter", cdk.requiredValidator)(properties.filter));
  errors.collect(cdk.propertyValidator("filter", CfnReceiptFilterFilterPropertyValidator)(properties.filter));
  return errors.wrap("supplied properties not correct for \"CfnReceiptFilterProps\"");
}

// @ts-ignore TS6133
function convertCfnReceiptFilterPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptFilterPropsValidator(properties).assertSuccess();
  return {
    "Filter": convertCfnReceiptFilterFilterPropertyToCloudFormation(properties.filter)
  };
}

// @ts-ignore TS6133
function CfnReceiptFilterPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptFilterProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptFilterProps>();
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnReceiptFilterFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies a receipt rule.
 *
 * @cloudformationResource AWS::SES::ReceiptRule
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptrule.html
 */
export class CfnReceiptRule extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::ReceiptRule";

  /**
   * Build a CfnReceiptRule from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReceiptRule {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReceiptRulePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReceiptRule(scope, id, propsResult.value);
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
   * The name of an existing rule after which the new rule is placed.
   */
  public after?: string;

  /**
   * A data structure that contains the specified rule's name, actions, recipients, domains, enabled status, scan status, and TLS policy.
   */
  public rule: cdk.IResolvable | CfnReceiptRule.RuleProperty;

  /**
   * The name of the rule set where the receipt rule is added.
   */
  public ruleSetName: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReceiptRuleProps) {
    super(scope, id, {
      "type": CfnReceiptRule.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "rule", this);
    cdk.requireProperty(props, "ruleSetName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.after = props.after;
    this.rule = props.rule;
    this.ruleSetName = props.ruleSetName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "after": this.after,
      "rule": this.rule,
      "ruleSetName": this.ruleSetName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReceiptRule.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReceiptRulePropsToCloudFormation(props);
  }
}

export namespace CfnReceiptRule {
  /**
   * Receipt rules enable you to specify which actions Amazon SES should take when it receives mail on behalf of one or more email addresses or domains that you own.
   *
   * Each receipt rule defines a set of email addresses or domains that it applies to. If the email addresses or domains match at least one recipient address of the message, Amazon SES executes all of the receipt rule's actions on the message.
   *
   * For information about setting up receipt rules, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-receipt-rules-console-walkthrough.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html
   */
  export interface RuleProperty {
    /**
     * An ordered list of actions to perform on messages that match at least one of the recipient email addresses or domains specified in the receipt rule.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html#cfn-ses-receiptrule-rule-actions
     */
    readonly actions?: Array<CfnReceiptRule.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * If `true` , the receipt rule is active.
     *
     * The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html#cfn-ses-receiptrule-rule-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The name of the receipt rule. The name must meet the following requirements:.
     *
     * - Contain only ASCII letters (a-z, A-Z), numbers (0-9), underscores (_), dashes (-), or periods (.).
     * - Start and end with a letter or number.
     * - Contain 64 characters or fewer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html#cfn-ses-receiptrule-rule-name
     */
    readonly name?: string;

    /**
     * The recipient domains and email addresses that the receipt rule applies to.
     *
     * If this field is not specified, this rule matches all recipients on all verified domains.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html#cfn-ses-receiptrule-rule-recipients
     */
    readonly recipients?: Array<string>;

    /**
     * If `true` , then messages that this receipt rule applies to are scanned for spam and viruses.
     *
     * The default value is `false` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html#cfn-ses-receiptrule-rule-scanenabled
     */
    readonly scanEnabled?: boolean | cdk.IResolvable;

    /**
     * Specifies whether Amazon SES should require that incoming email is delivered over a connection encrypted with Transport Layer Security (TLS).
     *
     * If this parameter is set to `Require` , Amazon SES bounces emails that are not received over TLS. The default is `Optional` .
     *
     * Valid Values: `Require | Optional`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-rule.html#cfn-ses-receiptrule-rule-tlspolicy
     */
    readonly tlsPolicy?: string;
  }

  /**
   * An action that Amazon SES can take when it receives an email on behalf of one or more email addresses or domains that you own.
   *
   * An instance of this data type can represent only one action.
   *
   * For information about setting up receipt rules, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-receipt-rules-console-walkthrough.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html
   */
  export interface ActionProperty {
    /**
     * Adds a header to the received email.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-addheaderaction
     */
    readonly addHeaderAction?: CfnReceiptRule.AddHeaderActionProperty | cdk.IResolvable;

    /**
     * Rejects the received email by returning a bounce response to the sender and, optionally, publishes a notification to Amazon Simple Notification Service (Amazon SNS).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-bounceaction
     */
    readonly bounceAction?: CfnReceiptRule.BounceActionProperty | cdk.IResolvable;

    /**
     * Calls an AWS Lambda function, and optionally, publishes a notification to Amazon SNS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-lambdaaction
     */
    readonly lambdaAction?: cdk.IResolvable | CfnReceiptRule.LambdaActionProperty;

    /**
     * Saves the received message to an Amazon Simple Storage Service (Amazon S3) bucket and, optionally, publishes a notification to Amazon SNS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-s3action
     */
    readonly s3Action?: cdk.IResolvable | CfnReceiptRule.S3ActionProperty;

    /**
     * Publishes the email content within a notification to Amazon SNS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-snsaction
     */
    readonly snsAction?: cdk.IResolvable | CfnReceiptRule.SNSActionProperty;

    /**
     * Terminates the evaluation of the receipt rule set and optionally publishes a notification to Amazon SNS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-stopaction
     */
    readonly stopAction?: cdk.IResolvable | CfnReceiptRule.StopActionProperty;

    /**
     * Calls Amazon WorkMail and, optionally, publishes a notification to Amazon Amazon SNS.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-action.html#cfn-ses-receiptrule-action-workmailaction
     */
    readonly workmailAction?: cdk.IResolvable | CfnReceiptRule.WorkmailActionProperty;
  }

  /**
   * When included in a receipt rule, this action rejects the received email by returning a bounce response to the sender and, optionally, publishes a notification to Amazon Simple Notification Service (Amazon SNS).
   *
   * For information about sending a bounce message in response to a received email, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-bounce.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-bounceaction.html
   */
  export interface BounceActionProperty {
    /**
     * Human-readable text to include in the bounce message.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-bounceaction.html#cfn-ses-receiptrule-bounceaction-message
     */
    readonly message: string;

    /**
     * The email address of the sender of the bounced email.
     *
     * This is the address from which the bounce message is sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-bounceaction.html#cfn-ses-receiptrule-bounceaction-sender
     */
    readonly sender: string;

    /**
     * The SMTP reply code, as defined by [RFC 5321](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc5321) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-bounceaction.html#cfn-ses-receiptrule-bounceaction-smtpreplycode
     */
    readonly smtpReplyCode: string;

    /**
     * The SMTP enhanced status code, as defined by [RFC 3463](https://docs.aws.amazon.com/https://tools.ietf.org/html/rfc3463) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-bounceaction.html#cfn-ses-receiptrule-bounceaction-statuscode
     */
    readonly statusCode?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to notify when the bounce action is taken.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) operation in Amazon SNS.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-bounceaction.html#cfn-ses-receiptrule-bounceaction-topicarn
     */
    readonly topicArn?: string;
  }

  /**
   * When included in a receipt rule, this action saves the received message to an Amazon Simple Storage Service (Amazon S3) bucket and, optionally, publishes a notification to Amazon Simple Notification Service (Amazon SNS).
   *
   * To enable Amazon SES to write emails to your Amazon S3 bucket, use an AWS KMS key to encrypt your emails, or publish to an Amazon SNS topic of another account, Amazon SES must have permission to access those resources. For information about granting permissions, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-permissions.html) .
   *
   * > When you save your emails to an Amazon S3 bucket, the maximum email size (including headers) is 40 MB. Emails larger than that bounces.
   *
   * For information about specifying Amazon S3 actions in receipt rules, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-s3.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html
   */
  export interface S3ActionProperty {
    /**
     * The name of the Amazon S3 bucket for incoming email.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-bucketname
     */
    readonly bucketName: string;

    /**
     * The customer master key that Amazon SES should use to encrypt your emails before saving them to the Amazon S3 bucket.
     *
     * You can use the default master key or a custom master key that you created in AWS KMS as follows:
     *
     * - To use the default master key, provide an ARN in the form of `arn:aws:kms:REGION:ACCOUNT-ID-WITHOUT-HYPHENS:alias/aws/ses` . For example, if your AWS account ID is 123456789012 and you want to use the default master key in the US West (Oregon) Region, the ARN of the default master key would be `arn:aws:kms:us-west-2:123456789012:alias/aws/ses` . If you use the default master key, you don't need to perform any extra steps to give Amazon SES permission to use the key.
     * - To use a custom master key that you created in AWS KMS, provide the ARN of the master key and ensure that you add a statement to your key's policy to give Amazon SES permission to use it. For more information about giving permissions, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-permissions.html) .
     *
     * For more information about key policies, see the [AWS KMS Developer Guide](https://docs.aws.amazon.com/kms/latest/developerguide/concepts.html) . If you do not specify a master key, Amazon SES does not encrypt your emails.
     *
     * > Your mail is encrypted by Amazon SES using the Amazon S3 encryption client before the mail is submitted to Amazon S3 for storage. It is not encrypted using Amazon S3 server-side encryption. This means that you must use the Amazon S3 encryption client to decrypt the email after retrieving it from Amazon S3, as the service has no access to use your AWS KMS keys for decryption. This encryption client is currently available with the [AWS SDK for Java](https://docs.aws.amazon.com/sdk-for-java/) and [AWS SDK for Ruby](https://docs.aws.amazon.com/sdk-for-ruby/) only. For more information about client-side encryption using AWS KMS master keys, see the [Amazon S3 Developer Guide](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingClientSideEncryption.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-kmskeyarn
     */
    readonly kmsKeyArn?: string;

    /**
     * The key prefix of the Amazon S3 bucket.
     *
     * The key prefix is similar to a directory name that enables you to store similar data under the same directory in a bucket.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-objectkeyprefix
     */
    readonly objectKeyPrefix?: string;

    /**
     * The ARN of the Amazon SNS topic to notify when the message is saved to the Amazon S3 bucket.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) operation in Amazon SNS.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-s3action.html#cfn-ses-receiptrule-s3action-topicarn
     */
    readonly topicArn?: string;
  }

  /**
   * When included in a receipt rule, this action terminates the evaluation of the receipt rule set and, optionally, publishes a notification to Amazon Simple Notification Service (Amazon SNS).
   *
   * For information about setting a stop action in a receipt rule, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-stop.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-stopaction.html
   */
  export interface StopActionProperty {
    /**
     * The scope of the StopAction.
     *
     * The only acceptable value is `RuleSet` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-stopaction.html#cfn-ses-receiptrule-stopaction-scope
     */
    readonly scope: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to notify when the stop action is taken.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) Amazon SNS operation.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-stopaction.html#cfn-ses-receiptrule-stopaction-topicarn
     */
    readonly topicArn?: string;
  }

  /**
   * When included in a receipt rule, this action publishes a notification to Amazon Simple Notification Service (Amazon SNS).
   *
   * This action includes a complete copy of the email content in the Amazon SNS notifications. Amazon SNS notifications for all other actions simply provide information about the email. They do not include the email content itself.
   *
   * If you own the Amazon SNS topic, you don't need to do anything to give Amazon SES permission to publish emails to it. However, if you don't own the Amazon SNS topic, you need to attach a policy to the topic to give Amazon SES permissions to access it. For information about giving permissions, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-permissions.html) .
   *
   * > You can only publish emails that are 150 KB or less (including the header) to Amazon SNS. Larger emails bounce. If you anticipate emails larger than 150 KB, use the S3 action instead.
   *
   * For information about using a receipt rule to publish an Amazon SNS notification, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-sns.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html
   */
  export interface SNSActionProperty {
    /**
     * The encoding to use for the email within the Amazon SNS notification.
     *
     * UTF-8 is easier to use, but may not preserve all special characters when a message was encoded with a different encoding format. Base64 preserves all special characters. The default value is UTF-8.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html#cfn-ses-receiptrule-snsaction-encoding
     */
    readonly encoding?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to notify.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) operation in Amazon SNS.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-snsaction.html#cfn-ses-receiptrule-snsaction-topicarn
     */
    readonly topicArn?: string;
  }

  /**
   * When included in a receipt rule, this action calls Amazon WorkMail and, optionally, publishes a notification to Amazon Simple Notification Service (Amazon SNS).
   *
   * It usually isn't necessary to set this up manually, because Amazon WorkMail adds the rule automatically during its setup procedure.
   *
   * For information using a receipt rule to call Amazon WorkMail, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-workmail.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-workmailaction.html
   */
  export interface WorkmailActionProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon WorkMail organization. Amazon WorkMail ARNs use the following format:.
     *
     * `arn:aws:workmail:<region>:<awsAccountId>:organization/<workmailOrganizationId>`
     *
     * You can find the ID of your organization by using the [ListOrganizations](https://docs.aws.amazon.com/workmail/latest/APIReference/API_ListOrganizations.html) operation in Amazon WorkMail. Amazon WorkMail organization IDs begin with " `m-` ", followed by a string of alphanumeric characters.
     *
     * For information about Amazon WorkMail organizations, see the [Amazon WorkMail Administrator Guide](https://docs.aws.amazon.com/workmail/latest/adminguide/organizations_overview.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-workmailaction.html#cfn-ses-receiptrule-workmailaction-organizationarn
     */
    readonly organizationArn: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to notify when the WorkMail action is called.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) operation in Amazon SNS.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-workmailaction.html#cfn-ses-receiptrule-workmailaction-topicarn
     */
    readonly topicArn?: string;
  }

  /**
   * When included in a receipt rule, this action adds a header to the received email.
   *
   * For information about adding a header using a receipt rule, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-add-header.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-addheaderaction.html
   */
  export interface AddHeaderActionProperty {
    /**
     * The name of the header to add to the incoming message.
     *
     * The name must contain at least one character, and can contain up to 50 characters. It consists of alphanumeric (a–z, A–Z, 0–9) characters and dashes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-addheaderaction.html#cfn-ses-receiptrule-addheaderaction-headername
     */
    readonly headerName: string;

    /**
     * The content to include in the header.
     *
     * This value can contain up to 2048 characters. It can't contain newline ( `\n` ) or carriage return ( `\r` ) characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-addheaderaction.html#cfn-ses-receiptrule-addheaderaction-headervalue
     */
    readonly headerValue: string;
  }

  /**
   * When included in a receipt rule, this action calls an AWS Lambda function and, optionally, publishes a notification to Amazon Simple Notification Service (Amazon SNS).
   *
   * To enable Amazon SES to call your AWS Lambda function or to publish to an Amazon SNS topic of another account, Amazon SES must have permission to access those resources. For information about giving permissions, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-permissions.html) .
   *
   * For information about using AWS Lambda actions in receipt rules, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-action-lambda.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-lambdaaction.html
   */
  export interface LambdaActionProperty {
    /**
     * The Amazon Resource Name (ARN) of the AWS Lambda function.
     *
     * An example of an AWS Lambda function ARN is `arn:aws:lambda:us-west-2:account-id:function:MyFunction` . For more information about AWS Lambda, see the [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-lambdaaction.html#cfn-ses-receiptrule-lambdaaction-functionarn
     */
    readonly functionArn: string;

    /**
     * The invocation type of the AWS Lambda function.
     *
     * An invocation type of `RequestResponse` means that the execution of the function immediately results in a response, and a value of `Event` means that the function is invoked asynchronously. The default value is `Event` . For information about AWS Lambda invocation types, see the [AWS Lambda Developer Guide](https://docs.aws.amazon.com/lambda/latest/dg/API_Invoke.html) .
     *
     * > There is a 30-second timeout on `RequestResponse` invocations. You should use `Event` invocation in most cases. Use `RequestResponse` only to make a mail flow decision, such as whether to stop the receipt rule or the receipt rule set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-lambdaaction.html#cfn-ses-receiptrule-lambdaaction-invocationtype
     */
    readonly invocationType?: string;

    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic to notify when the Lambda action is executed.
     *
     * You can find the ARN of a topic by using the [ListTopics](https://docs.aws.amazon.com/sns/latest/api/API_ListTopics.html) operation in Amazon SNS.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-receiptrule-lambdaaction.html#cfn-ses-receiptrule-lambdaaction-topicarn
     */
    readonly topicArn?: string;
  }
}

/**
 * Properties for defining a `CfnReceiptRule`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptrule.html
 */
export interface CfnReceiptRuleProps {
  /**
   * The name of an existing rule after which the new rule is placed.
   *
   * If this parameter is null, the new rule is inserted at the beginning of the rule list.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptrule.html#cfn-ses-receiptrule-after
   */
  readonly after?: string;

  /**
   * A data structure that contains the specified rule's name, actions, recipients, domains, enabled status, scan status, and TLS policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptrule.html#cfn-ses-receiptrule-rule
   */
  readonly rule: cdk.IResolvable | CfnReceiptRule.RuleProperty;

  /**
   * The name of the rule set where the receipt rule is added.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptrule.html#cfn-ses-receiptrule-rulesetname
   */
  readonly ruleSetName: string;
}

/**
 * Determine whether the given properties match those of a `BounceActionProperty`
 *
 * @param properties - the TypeScript properties of a `BounceActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleBounceActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("message", cdk.requiredValidator)(properties.message));
  errors.collect(cdk.propertyValidator("message", cdk.validateString)(properties.message));
  errors.collect(cdk.propertyValidator("sender", cdk.requiredValidator)(properties.sender));
  errors.collect(cdk.propertyValidator("sender", cdk.validateString)(properties.sender));
  errors.collect(cdk.propertyValidator("smtpReplyCode", cdk.requiredValidator)(properties.smtpReplyCode));
  errors.collect(cdk.propertyValidator("smtpReplyCode", cdk.validateString)(properties.smtpReplyCode));
  errors.collect(cdk.propertyValidator("statusCode", cdk.validateString)(properties.statusCode));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"BounceActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleBounceActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleBounceActionPropertyValidator(properties).assertSuccess();
  return {
    "Message": cdk.stringToCloudFormation(properties.message),
    "Sender": cdk.stringToCloudFormation(properties.sender),
    "SmtpReplyCode": cdk.stringToCloudFormation(properties.smtpReplyCode),
    "StatusCode": cdk.stringToCloudFormation(properties.statusCode),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleBounceActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptRule.BounceActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.BounceActionProperty>();
  ret.addPropertyResult("message", "Message", (properties.Message != null ? cfn_parse.FromCloudFormation.getString(properties.Message) : undefined));
  ret.addPropertyResult("sender", "Sender", (properties.Sender != null ? cfn_parse.FromCloudFormation.getString(properties.Sender) : undefined));
  ret.addPropertyResult("smtpReplyCode", "SmtpReplyCode", (properties.SmtpReplyCode != null ? cfn_parse.FromCloudFormation.getString(properties.SmtpReplyCode) : undefined));
  ret.addPropertyResult("statusCode", "StatusCode", (properties.StatusCode != null ? cfn_parse.FromCloudFormation.getString(properties.StatusCode) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3ActionProperty`
 *
 * @param properties - the TypeScript properties of a `S3ActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleS3ActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("objectKeyPrefix", cdk.validateString)(properties.objectKeyPrefix));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"S3ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleS3ActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleS3ActionPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "ObjectKeyPrefix": cdk.stringToCloudFormation(properties.objectKeyPrefix),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleS3ActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReceiptRule.S3ActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.S3ActionProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("objectKeyPrefix", "ObjectKeyPrefix", (properties.ObjectKeyPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.ObjectKeyPrefix) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StopActionProperty`
 *
 * @param properties - the TypeScript properties of a `StopActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleStopActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scope", cdk.requiredValidator)(properties.scope));
  errors.collect(cdk.propertyValidator("scope", cdk.validateString)(properties.scope));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"StopActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleStopActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleStopActionPropertyValidator(properties).assertSuccess();
  return {
    "Scope": cdk.stringToCloudFormation(properties.scope),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleStopActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReceiptRule.StopActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.StopActionProperty>();
  ret.addPropertyResult("scope", "Scope", (properties.Scope != null ? cfn_parse.FromCloudFormation.getString(properties.Scope) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SNSActionProperty`
 *
 * @param properties - the TypeScript properties of a `SNSActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleSNSActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encoding", cdk.validateString)(properties.encoding));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"SNSActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleSNSActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleSNSActionPropertyValidator(properties).assertSuccess();
  return {
    "Encoding": cdk.stringToCloudFormation(properties.encoding),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleSNSActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReceiptRule.SNSActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.SNSActionProperty>();
  ret.addPropertyResult("encoding", "Encoding", (properties.Encoding != null ? cfn_parse.FromCloudFormation.getString(properties.Encoding) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkmailActionProperty`
 *
 * @param properties - the TypeScript properties of a `WorkmailActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleWorkmailActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("organizationArn", cdk.requiredValidator)(properties.organizationArn));
  errors.collect(cdk.propertyValidator("organizationArn", cdk.validateString)(properties.organizationArn));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"WorkmailActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleWorkmailActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleWorkmailActionPropertyValidator(properties).assertSuccess();
  return {
    "OrganizationArn": cdk.stringToCloudFormation(properties.organizationArn),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleWorkmailActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReceiptRule.WorkmailActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.WorkmailActionProperty>();
  ret.addPropertyResult("organizationArn", "OrganizationArn", (properties.OrganizationArn != null ? cfn_parse.FromCloudFormation.getString(properties.OrganizationArn) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AddHeaderActionProperty`
 *
 * @param properties - the TypeScript properties of a `AddHeaderActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleAddHeaderActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("headerName", cdk.requiredValidator)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerName", cdk.validateString)(properties.headerName));
  errors.collect(cdk.propertyValidator("headerValue", cdk.requiredValidator)(properties.headerValue));
  errors.collect(cdk.propertyValidator("headerValue", cdk.validateString)(properties.headerValue));
  return errors.wrap("supplied properties not correct for \"AddHeaderActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleAddHeaderActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleAddHeaderActionPropertyValidator(properties).assertSuccess();
  return {
    "HeaderName": cdk.stringToCloudFormation(properties.headerName),
    "HeaderValue": cdk.stringToCloudFormation(properties.headerValue)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleAddHeaderActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptRule.AddHeaderActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.AddHeaderActionProperty>();
  ret.addPropertyResult("headerName", "HeaderName", (properties.HeaderName != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderName) : undefined));
  ret.addPropertyResult("headerValue", "HeaderValue", (properties.HeaderValue != null ? cfn_parse.FromCloudFormation.getString(properties.HeaderValue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LambdaActionProperty`
 *
 * @param properties - the TypeScript properties of a `LambdaActionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleLambdaActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionArn", cdk.requiredValidator)(properties.functionArn));
  errors.collect(cdk.propertyValidator("functionArn", cdk.validateString)(properties.functionArn));
  errors.collect(cdk.propertyValidator("invocationType", cdk.validateString)(properties.invocationType));
  errors.collect(cdk.propertyValidator("topicArn", cdk.validateString)(properties.topicArn));
  return errors.wrap("supplied properties not correct for \"LambdaActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleLambdaActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleLambdaActionPropertyValidator(properties).assertSuccess();
  return {
    "FunctionArn": cdk.stringToCloudFormation(properties.functionArn),
    "InvocationType": cdk.stringToCloudFormation(properties.invocationType),
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleLambdaActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReceiptRule.LambdaActionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.LambdaActionProperty>();
  ret.addPropertyResult("functionArn", "FunctionArn", (properties.FunctionArn != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionArn) : undefined));
  ret.addPropertyResult("invocationType", "InvocationType", (properties.InvocationType != null ? cfn_parse.FromCloudFormation.getString(properties.InvocationType) : undefined));
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
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
function CfnReceiptRuleActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addHeaderAction", CfnReceiptRuleAddHeaderActionPropertyValidator)(properties.addHeaderAction));
  errors.collect(cdk.propertyValidator("bounceAction", CfnReceiptRuleBounceActionPropertyValidator)(properties.bounceAction));
  errors.collect(cdk.propertyValidator("lambdaAction", CfnReceiptRuleLambdaActionPropertyValidator)(properties.lambdaAction));
  errors.collect(cdk.propertyValidator("s3Action", CfnReceiptRuleS3ActionPropertyValidator)(properties.s3Action));
  errors.collect(cdk.propertyValidator("snsAction", CfnReceiptRuleSNSActionPropertyValidator)(properties.snsAction));
  errors.collect(cdk.propertyValidator("stopAction", CfnReceiptRuleStopActionPropertyValidator)(properties.stopAction));
  errors.collect(cdk.propertyValidator("workmailAction", CfnReceiptRuleWorkmailActionPropertyValidator)(properties.workmailAction));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleActionPropertyValidator(properties).assertSuccess();
  return {
    "AddHeaderAction": convertCfnReceiptRuleAddHeaderActionPropertyToCloudFormation(properties.addHeaderAction),
    "BounceAction": convertCfnReceiptRuleBounceActionPropertyToCloudFormation(properties.bounceAction),
    "LambdaAction": convertCfnReceiptRuleLambdaActionPropertyToCloudFormation(properties.lambdaAction),
    "S3Action": convertCfnReceiptRuleS3ActionPropertyToCloudFormation(properties.s3Action),
    "SNSAction": convertCfnReceiptRuleSNSActionPropertyToCloudFormation(properties.snsAction),
    "StopAction": convertCfnReceiptRuleStopActionPropertyToCloudFormation(properties.stopAction),
    "WorkmailAction": convertCfnReceiptRuleWorkmailActionPropertyToCloudFormation(properties.workmailAction)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptRule.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.ActionProperty>();
  ret.addPropertyResult("addHeaderAction", "AddHeaderAction", (properties.AddHeaderAction != null ? CfnReceiptRuleAddHeaderActionPropertyFromCloudFormation(properties.AddHeaderAction) : undefined));
  ret.addPropertyResult("bounceAction", "BounceAction", (properties.BounceAction != null ? CfnReceiptRuleBounceActionPropertyFromCloudFormation(properties.BounceAction) : undefined));
  ret.addPropertyResult("lambdaAction", "LambdaAction", (properties.LambdaAction != null ? CfnReceiptRuleLambdaActionPropertyFromCloudFormation(properties.LambdaAction) : undefined));
  ret.addPropertyResult("s3Action", "S3Action", (properties.S3Action != null ? CfnReceiptRuleS3ActionPropertyFromCloudFormation(properties.S3Action) : undefined));
  ret.addPropertyResult("snsAction", "SNSAction", (properties.SNSAction != null ? CfnReceiptRuleSNSActionPropertyFromCloudFormation(properties.SNSAction) : undefined));
  ret.addPropertyResult("stopAction", "StopAction", (properties.StopAction != null ? CfnReceiptRuleStopActionPropertyFromCloudFormation(properties.StopAction) : undefined));
  ret.addPropertyResult("workmailAction", "WorkmailAction", (properties.WorkmailAction != null ? CfnReceiptRuleWorkmailActionPropertyFromCloudFormation(properties.WorkmailAction) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RuleProperty`
 *
 * @param properties - the TypeScript properties of a `RuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnReceiptRuleActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("recipients", cdk.listValidator(cdk.validateString))(properties.recipients));
  errors.collect(cdk.propertyValidator("scanEnabled", cdk.validateBoolean)(properties.scanEnabled));
  errors.collect(cdk.propertyValidator("tlsPolicy", cdk.validateString)(properties.tlsPolicy));
  return errors.wrap("supplied properties not correct for \"RuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleRulePropertyValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnReceiptRuleActionPropertyToCloudFormation)(properties.actions),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Recipients": cdk.listMapper(cdk.stringToCloudFormation)(properties.recipients),
    "ScanEnabled": cdk.booleanToCloudFormation(properties.scanEnabled),
    "TlsPolicy": cdk.stringToCloudFormation(properties.tlsPolicy)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReceiptRule.RuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRule.RuleProperty>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnReceiptRuleActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("recipients", "Recipients", (properties.Recipients != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Recipients) : undefined));
  ret.addPropertyResult("scanEnabled", "ScanEnabled", (properties.ScanEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ScanEnabled) : undefined));
  ret.addPropertyResult("tlsPolicy", "TlsPolicy", (properties.TlsPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.TlsPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReceiptRuleProps`
 *
 * @param properties - the TypeScript properties of a `CfnReceiptRuleProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRulePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("after", cdk.validateString)(properties.after));
  errors.collect(cdk.propertyValidator("rule", cdk.requiredValidator)(properties.rule));
  errors.collect(cdk.propertyValidator("rule", CfnReceiptRuleRulePropertyValidator)(properties.rule));
  errors.collect(cdk.propertyValidator("ruleSetName", cdk.requiredValidator)(properties.ruleSetName));
  errors.collect(cdk.propertyValidator("ruleSetName", cdk.validateString)(properties.ruleSetName));
  return errors.wrap("supplied properties not correct for \"CfnReceiptRuleProps\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRulePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRulePropsValidator(properties).assertSuccess();
  return {
    "After": cdk.stringToCloudFormation(properties.after),
    "Rule": convertCfnReceiptRuleRulePropertyToCloudFormation(properties.rule),
    "RuleSetName": cdk.stringToCloudFormation(properties.ruleSetName)
  };
}

// @ts-ignore TS6133
function CfnReceiptRulePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptRuleProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRuleProps>();
  ret.addPropertyResult("after", "After", (properties.After != null ? cfn_parse.FromCloudFormation.getString(properties.After) : undefined));
  ret.addPropertyResult("rule", "Rule", (properties.Rule != null ? CfnReceiptRuleRulePropertyFromCloudFormation(properties.Rule) : undefined));
  ret.addPropertyResult("ruleSetName", "RuleSetName", (properties.RuleSetName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleSetName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates an empty receipt rule set.
 *
 * For information about setting up receipt rule sets, see the [Amazon SES Developer Guide](https://docs.aws.amazon.com/ses/latest/dg/receiving-email-concepts.html#receiving-email-concepts-rules) .
 *
 * You can execute this operation no more than once per second.
 *
 * @cloudformationResource AWS::SES::ReceiptRuleSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptruleset.html
 */
export class CfnReceiptRuleSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::ReceiptRuleSet";

  /**
   * Build a CfnReceiptRuleSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReceiptRuleSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReceiptRuleSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReceiptRuleSet(scope, id, propsResult.value);
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
   * The name of the receipt rule set to reorder.
   */
  public ruleSetName?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReceiptRuleSetProps = {}) {
    super(scope, id, {
      "type": CfnReceiptRuleSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.ruleSetName = props.ruleSetName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "ruleSetName": this.ruleSetName
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReceiptRuleSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReceiptRuleSetPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnReceiptRuleSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptruleset.html
 */
export interface CfnReceiptRuleSetProps {
  /**
   * The name of the receipt rule set to reorder.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-receiptruleset.html#cfn-ses-receiptruleset-rulesetname
   */
  readonly ruleSetName?: string;
}

/**
 * Determine whether the given properties match those of a `CfnReceiptRuleSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnReceiptRuleSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReceiptRuleSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ruleSetName", cdk.validateString)(properties.ruleSetName));
  return errors.wrap("supplied properties not correct for \"CfnReceiptRuleSetProps\"");
}

// @ts-ignore TS6133
function convertCfnReceiptRuleSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReceiptRuleSetPropsValidator(properties).assertSuccess();
  return {
    "RuleSetName": cdk.stringToCloudFormation(properties.ruleSetName)
  };
}

// @ts-ignore TS6133
function CfnReceiptRuleSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReceiptRuleSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReceiptRuleSetProps>();
  ret.addPropertyResult("ruleSetName", "RuleSetName", (properties.RuleSetName != null ? cfn_parse.FromCloudFormation.getString(properties.RuleSetName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an email template.
 *
 * Email templates enable you to send personalized email to one or more destinations in a single API operation.
 *
 * @cloudformationResource AWS::SES::Template
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-template.html
 */
export class CfnTemplate extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::Template";

  /**
   * Build a CfnTemplate from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnTemplate {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnTemplatePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnTemplate(scope, id, propsResult.value);
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
   * The content of the email, composed of a subject line and either an HTML part or a text-only part.
   */
  public template?: cdk.IResolvable | CfnTemplate.TemplateProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnTemplateProps = {}) {
    super(scope, id, {
      "type": CfnTemplate.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.template = props.template;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "template": this.template
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnTemplate.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnTemplatePropsToCloudFormation(props);
  }
}

export namespace CfnTemplate {
  /**
   * The content of the email, composed of a subject line and either an HTML part or a text-only part.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html
   */
  export interface TemplateProperty {
    /**
     * The HTML body of the email.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-htmlpart
     */
    readonly htmlPart?: string;

    /**
     * The subject line of the email.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-subjectpart
     */
    readonly subjectPart: string;

    /**
     * The name of the template.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-templatename
     */
    readonly templateName?: string;

    /**
     * The email body that is visible to recipients whose email clients do not display HTML content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-template-template.html#cfn-ses-template-template-textpart
     */
    readonly textPart?: string;
  }
}

/**
 * Properties for defining a `CfnTemplate`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-template.html
 */
export interface CfnTemplateProps {
  /**
   * The content of the email, composed of a subject line and either an HTML part or a text-only part.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-template.html#cfn-ses-template-template
   */
  readonly template?: cdk.IResolvable | CfnTemplate.TemplateProperty;
}

/**
 * Determine whether the given properties match those of a `TemplateProperty`
 *
 * @param properties - the TypeScript properties of a `TemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplateTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("htmlPart", cdk.validateString)(properties.htmlPart));
  errors.collect(cdk.propertyValidator("subjectPart", cdk.requiredValidator)(properties.subjectPart));
  errors.collect(cdk.propertyValidator("subjectPart", cdk.validateString)(properties.subjectPart));
  errors.collect(cdk.propertyValidator("templateName", cdk.validateString)(properties.templateName));
  errors.collect(cdk.propertyValidator("textPart", cdk.validateString)(properties.textPart));
  return errors.wrap("supplied properties not correct for \"TemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnTemplateTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplateTemplatePropertyValidator(properties).assertSuccess();
  return {
    "HtmlPart": cdk.stringToCloudFormation(properties.htmlPart),
    "SubjectPart": cdk.stringToCloudFormation(properties.subjectPart),
    "TemplateName": cdk.stringToCloudFormation(properties.templateName),
    "TextPart": cdk.stringToCloudFormation(properties.textPart)
  };
}

// @ts-ignore TS6133
function CfnTemplateTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnTemplate.TemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplate.TemplateProperty>();
  ret.addPropertyResult("htmlPart", "HtmlPart", (properties.HtmlPart != null ? cfn_parse.FromCloudFormation.getString(properties.HtmlPart) : undefined));
  ret.addPropertyResult("subjectPart", "SubjectPart", (properties.SubjectPart != null ? cfn_parse.FromCloudFormation.getString(properties.SubjectPart) : undefined));
  ret.addPropertyResult("templateName", "TemplateName", (properties.TemplateName != null ? cfn_parse.FromCloudFormation.getString(properties.TemplateName) : undefined));
  ret.addPropertyResult("textPart", "TextPart", (properties.TextPart != null ? cfn_parse.FromCloudFormation.getString(properties.TextPart) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnTemplateProps`
 *
 * @param properties - the TypeScript properties of a `CfnTemplateProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnTemplatePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("template", CfnTemplateTemplatePropertyValidator)(properties.template));
  return errors.wrap("supplied properties not correct for \"CfnTemplateProps\"");
}

// @ts-ignore TS6133
function convertCfnTemplatePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnTemplatePropsValidator(properties).assertSuccess();
  return {
    "Template": convertCfnTemplateTemplatePropertyToCloudFormation(properties.template)
  };
}

// @ts-ignore TS6133
function CfnTemplatePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnTemplateProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnTemplateProps>();
  ret.addPropertyResult("template", "Template", (properties.Template != null ? CfnTemplateTemplatePropertyFromCloudFormation(properties.Template) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The Virtual Deliverability Manager (VDM) attributes that apply to your Amazon SES account.
 *
 * @cloudformationResource AWS::SES::VdmAttributes
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-vdmattributes.html
 */
export class CfnVdmAttributes extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SES::VdmAttributes";

  /**
   * Build a CfnVdmAttributes from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnVdmAttributes {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnVdmAttributesPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnVdmAttributes(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * Unique identifier for this resource
   *
   * @cloudformationAttribute VdmAttributesResourceId
   */
  public readonly attrVdmAttributesResourceId: string;

  /**
   * Specifies additional settings for your VDM configuration as applicable to the Dashboard.
   */
  public dashboardAttributes?: CfnVdmAttributes.DashboardAttributesProperty | cdk.IResolvable;

  /**
   * Specifies additional settings for your VDM configuration as applicable to the Guardian.
   */
  public guardianAttributes?: CfnVdmAttributes.GuardianAttributesProperty | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnVdmAttributesProps = {}) {
    super(scope, id, {
      "type": CfnVdmAttributes.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrVdmAttributesResourceId = cdk.Token.asString(this.getAtt("VdmAttributesResourceId", cdk.ResolutionTypeHint.STRING));
    this.dashboardAttributes = props.dashboardAttributes;
    this.guardianAttributes = props.guardianAttributes;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dashboardAttributes": this.dashboardAttributes,
      "guardianAttributes": this.guardianAttributes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnVdmAttributes.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnVdmAttributesPropsToCloudFormation(props);
  }
}

export namespace CfnVdmAttributes {
  /**
   * Settings for your VDM configuration as applicable to the Dashboard.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-vdmattributes-dashboardattributes.html
   */
  export interface DashboardAttributesProperty {
    /**
     * Specifies the status of your VDM engagement metrics collection. Can be one of the following:.
     *
     * - `ENABLED` – Amazon SES enables engagement metrics for your account.
     * - `DISABLED` – Amazon SES disables engagement metrics for your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-vdmattributes-dashboardattributes.html#cfn-ses-vdmattributes-dashboardattributes-engagementmetrics
     */
    readonly engagementMetrics?: string;
  }

  /**
   * Settings for your VDM configuration as applicable to the Guardian.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-vdmattributes-guardianattributes.html
   */
  export interface GuardianAttributesProperty {
    /**
     * Specifies the status of your VDM optimized shared delivery. Can be one of the following:.
     *
     * - `ENABLED` – Amazon SES enables optimized shared delivery for your account.
     * - `DISABLED` – Amazon SES disables optimized shared delivery for your account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ses-vdmattributes-guardianattributes.html#cfn-ses-vdmattributes-guardianattributes-optimizedshareddelivery
     */
    readonly optimizedSharedDelivery?: string;
  }
}

/**
 * Properties for defining a `CfnVdmAttributes`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-vdmattributes.html
 */
export interface CfnVdmAttributesProps {
  /**
   * Specifies additional settings for your VDM configuration as applicable to the Dashboard.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-vdmattributes.html#cfn-ses-vdmattributes-dashboardattributes
   */
  readonly dashboardAttributes?: CfnVdmAttributes.DashboardAttributesProperty | cdk.IResolvable;

  /**
   * Specifies additional settings for your VDM configuration as applicable to the Guardian.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ses-vdmattributes.html#cfn-ses-vdmattributes-guardianattributes
   */
  readonly guardianAttributes?: CfnVdmAttributes.GuardianAttributesProperty | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `DashboardAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `DashboardAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVdmAttributesDashboardAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("engagementMetrics", cdk.validateString)(properties.engagementMetrics));
  return errors.wrap("supplied properties not correct for \"DashboardAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnVdmAttributesDashboardAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVdmAttributesDashboardAttributesPropertyValidator(properties).assertSuccess();
  return {
    "EngagementMetrics": cdk.stringToCloudFormation(properties.engagementMetrics)
  };
}

// @ts-ignore TS6133
function CfnVdmAttributesDashboardAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVdmAttributes.DashboardAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVdmAttributes.DashboardAttributesProperty>();
  ret.addPropertyResult("engagementMetrics", "EngagementMetrics", (properties.EngagementMetrics != null ? cfn_parse.FromCloudFormation.getString(properties.EngagementMetrics) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `GuardianAttributesProperty`
 *
 * @param properties - the TypeScript properties of a `GuardianAttributesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVdmAttributesGuardianAttributesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("optimizedSharedDelivery", cdk.validateString)(properties.optimizedSharedDelivery));
  return errors.wrap("supplied properties not correct for \"GuardianAttributesProperty\"");
}

// @ts-ignore TS6133
function convertCfnVdmAttributesGuardianAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVdmAttributesGuardianAttributesPropertyValidator(properties).assertSuccess();
  return {
    "OptimizedSharedDelivery": cdk.stringToCloudFormation(properties.optimizedSharedDelivery)
  };
}

// @ts-ignore TS6133
function CfnVdmAttributesGuardianAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVdmAttributes.GuardianAttributesProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVdmAttributes.GuardianAttributesProperty>();
  ret.addPropertyResult("optimizedSharedDelivery", "OptimizedSharedDelivery", (properties.OptimizedSharedDelivery != null ? cfn_parse.FromCloudFormation.getString(properties.OptimizedSharedDelivery) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnVdmAttributesProps`
 *
 * @param properties - the TypeScript properties of a `CfnVdmAttributesProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnVdmAttributesPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dashboardAttributes", CfnVdmAttributesDashboardAttributesPropertyValidator)(properties.dashboardAttributes));
  errors.collect(cdk.propertyValidator("guardianAttributes", CfnVdmAttributesGuardianAttributesPropertyValidator)(properties.guardianAttributes));
  return errors.wrap("supplied properties not correct for \"CfnVdmAttributesProps\"");
}

// @ts-ignore TS6133
function convertCfnVdmAttributesPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnVdmAttributesPropsValidator(properties).assertSuccess();
  return {
    "DashboardAttributes": convertCfnVdmAttributesDashboardAttributesPropertyToCloudFormation(properties.dashboardAttributes),
    "GuardianAttributes": convertCfnVdmAttributesGuardianAttributesPropertyToCloudFormation(properties.guardianAttributes)
  };
}

// @ts-ignore TS6133
function CfnVdmAttributesPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnVdmAttributesProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnVdmAttributesProps>();
  ret.addPropertyResult("dashboardAttributes", "DashboardAttributes", (properties.DashboardAttributes != null ? CfnVdmAttributesDashboardAttributesPropertyFromCloudFormation(properties.DashboardAttributes) : undefined));
  ret.addPropertyResult("guardianAttributes", "GuardianAttributes", (properties.GuardianAttributes != null ? CfnVdmAttributesGuardianAttributesPropertyFromCloudFormation(properties.GuardianAttributes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}