/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Create a configuration set.
 *
 * *Configuration sets* are groups of rules that you can apply to the emails you send using Amazon Pinpoint. You apply a configuration set to an email by including a reference to the configuration set in the headers of the email. When you apply a configuration set to an email, all of the rules in that configuration set are applied to the email.
 *
 * @cloudformationResource AWS::PinpointEmail::ConfigurationSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html
 */
export class CfnConfigurationSet extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PinpointEmail::ConfigurationSet";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * An object that defines the dedicated IP pool that is used to send emails that you send using the configuration set.
   */
  public deliveryOptions?: CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable;

  /**
   * The name of the configuration set.
   */
  public name: string;

  /**
   * An object that defines whether or not Amazon Pinpoint collects reputation metrics for the emails that you send that use the configuration set.
   */
  public reputationOptions?: cdk.IResolvable | CfnConfigurationSet.ReputationOptionsProperty;

  /**
   * An object that defines whether or not Amazon Pinpoint can send email that you send using the configuration set.
   */
  public sendingOptions?: cdk.IResolvable | CfnConfigurationSet.SendingOptionsProperty;

  /**
   * An object that defines the tags (keys and values) that you want to associate with the configuration set.
   */
  public tags?: Array<CfnConfigurationSet.TagsProperty>;

  /**
   * An object that defines the open and click tracking options for emails that you send using the configuration set.
   */
  public trackingOptions?: cdk.IResolvable | CfnConfigurationSet.TrackingOptionsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnConfigurationSetProps) {
    super(scope, id, {
      "type": CfnConfigurationSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.deliveryOptions = props.deliveryOptions;
    this.name = props.name;
    this.reputationOptions = props.reputationOptions;
    this.sendingOptions = props.sendingOptions;
    this.tags = props.tags;
    this.trackingOptions = props.trackingOptions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deliveryOptions": this.deliveryOptions,
      "name": this.name,
      "reputationOptions": this.reputationOptions,
      "sendingOptions": this.sendingOptions,
      "tags": this.tags,
      "trackingOptions": this.trackingOptions
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
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-sendingoptions.html
   */
  export interface SendingOptionsProperty {
    /**
     * If `true` , email sending is enabled for the configuration set.
     *
     * If `false` , email sending is disabled for the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-sendingoptions.html#cfn-pinpointemail-configurationset-sendingoptions-sendingenabled
     */
    readonly sendingEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * An object that defines the tracking options for a configuration set.
   *
   * When you use Amazon Pinpoint to send an email, it contains an invisible image that's used to track when recipients open your email. If your email contains links, those links are changed slightly in order to track when recipients click them.
   *
   * These images and links include references to a domain operated by AWS . You can optionally configure Amazon Pinpoint to use a domain that you operate for these images and links.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-trackingoptions.html
   */
  export interface TrackingOptionsProperty {
    /**
     * The domain that you want to use for tracking open and click events.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-trackingoptions.html#cfn-pinpointemail-configurationset-trackingoptions-customredirectdomain
     */
    readonly customRedirectDomain?: string;
  }

  /**
   * Enable or disable collection of reputation metrics for emails that you send using this configuration set in the current AWS Region.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-reputationoptions.html
   */
  export interface ReputationOptionsProperty {
    /**
     * If `true` , tracking of reputation metrics is enabled for the configuration set.
     *
     * If `false` , tracking of reputation metrics is disabled for the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-reputationoptions.html#cfn-pinpointemail-configurationset-reputationoptions-reputationmetricsenabled
     */
    readonly reputationMetricsEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * Used to associate a configuration set with a dedicated IP pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-deliveryoptions.html
   */
  export interface DeliveryOptionsProperty {
    /**
     * The name of the dedicated IP pool that you want to associate with the configuration set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-deliveryoptions.html#cfn-pinpointemail-configurationset-deliveryoptions-sendingpoolname
     */
    readonly sendingPoolName?: string;
  }

  /**
   * An object that defines the tags (keys and values) that you want to associate with the configuration set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-tags.html
   */
  export interface TagsProperty {
    /**
     * One part of a key-value pair that defines a tag.
     *
     * The maximum length of a tag key is 128 characters. The minimum length is 1 character.
     *
     * If you specify tags for the configuration set, then this value is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-tags.html#cfn-pinpointemail-configurationset-tags-key
     */
    readonly key?: string;

    /**
     * The optional part of a key-value pair that defines a tag.
     *
     * The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationset-tags.html#cfn-pinpointemail-configurationset-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html
 */
export interface CfnConfigurationSetProps {
  /**
   * An object that defines the dedicated IP pool that is used to send emails that you send using the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-deliveryoptions
   */
  readonly deliveryOptions?: CfnConfigurationSet.DeliveryOptionsProperty | cdk.IResolvable;

  /**
   * The name of the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-name
   */
  readonly name: string;

  /**
   * An object that defines whether or not Amazon Pinpoint collects reputation metrics for the emails that you send that use the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-reputationoptions
   */
  readonly reputationOptions?: cdk.IResolvable | CfnConfigurationSet.ReputationOptionsProperty;

  /**
   * An object that defines whether or not Amazon Pinpoint can send email that you send using the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-sendingoptions
   */
  readonly sendingOptions?: cdk.IResolvable | CfnConfigurationSet.SendingOptionsProperty;

  /**
   * An object that defines the tags (keys and values) that you want to associate with the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-tags
   */
  readonly tags?: Array<CfnConfigurationSet.TagsProperty>;

  /**
   * An object that defines the open and click tracking options for emails that you send using the configuration set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationset.html#cfn-pinpointemail-configurationset-trackingoptions
   */
  readonly trackingOptions?: cdk.IResolvable | CfnConfigurationSet.TrackingOptionsProperty;
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
  return errors.wrap("supplied properties not correct for \"DeliveryOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetDeliveryOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetDeliveryOptionsPropertyValidator(properties).assertSuccess();
  return {
    "SendingPoolName": cdk.stringToCloudFormation(properties.sendingPoolName)
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
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSet.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSet.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
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
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("reputationOptions", CfnConfigurationSetReputationOptionsPropertyValidator)(properties.reputationOptions));
  errors.collect(cdk.propertyValidator("sendingOptions", CfnConfigurationSetSendingOptionsPropertyValidator)(properties.sendingOptions));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnConfigurationSetTagsPropertyValidator))(properties.tags));
  errors.collect(cdk.propertyValidator("trackingOptions", CfnConfigurationSetTrackingOptionsPropertyValidator)(properties.trackingOptions));
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
    "Tags": cdk.listMapper(convertCfnConfigurationSetTagsPropertyToCloudFormation)(properties.tags),
    "TrackingOptions": convertCfnConfigurationSetTrackingOptionsPropertyToCloudFormation(properties.trackingOptions)
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
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnConfigurationSetTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addPropertyResult("trackingOptions", "TrackingOptions", (properties.TrackingOptions != null ? CfnConfigurationSetTrackingOptionsPropertyFromCloudFormation(properties.TrackingOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create an event destination.
 *
 * In Amazon Pinpoint, *events* include message sends, deliveries, opens, clicks, bounces, and complaints. *Event destinations* are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
 *
 * A single configuration set can include more than one event destination.
 *
 * @cloudformationResource AWS::PinpointEmail::ConfigurationSetEventDestination
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html
 */
export class CfnConfigurationSetEventDestination extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PinpointEmail::ConfigurationSetEventDestination";

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
   * The name of the configuration set that contains the event destination that you want to modify.
   */
  public configurationSetName: string;

  /**
   * An object that defines the event destination.
   */
  public eventDestination?: CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable;

  /**
   * The name of the event destination that you want to modify.
   */
  public eventDestinationName: string;

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
    cdk.requireProperty(props, "eventDestinationName", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.configurationSetName = props.configurationSetName;
    this.eventDestination = props.eventDestination;
    this.eventDestinationName = props.eventDestinationName;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "configurationSetName": this.configurationSetName,
      "eventDestination": this.eventDestination,
      "eventDestinationName": this.eventDestinationName
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
   * In Amazon Pinpoint, *events* include message sends, deliveries, opens, clicks, bounces, and complaints.
   *
   * *Event destinations* are places that you can send information about these events to. For example, you can send event data to Amazon SNS to receive notifications when you receive bounces or complaints, or you can use Amazon Kinesis Data Firehose to stream data to Amazon S3 for long-term storage.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html
   */
  export interface EventDestinationProperty {
    /**
     * An object that defines an Amazon CloudWatch destination for email events.
     *
     * You can use Amazon CloudWatch to monitor and gain insights on your email sending metrics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-cloudwatchdestination
     */
    readonly cloudWatchDestination?: CfnConfigurationSetEventDestination.CloudWatchDestinationProperty | cdk.IResolvable;

    /**
     * If `true` , the event destination is enabled.
     *
     * When the event destination is enabled, the specified event types are sent to the destinations in this `EventDestinationDefinition` .
     *
     * If `false` , the event destination is disabled. When the event destination is disabled, events aren't sent to the specified destinations.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * An object that defines an Amazon Kinesis Data Firehose destination for email events.
     *
     * You can use Amazon Kinesis Data Firehose to stream data to other services, such as Amazon S3 and Amazon Redshift.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-kinesisfirehosedestination
     */
    readonly kinesisFirehoseDestination?: cdk.IResolvable | CfnConfigurationSetEventDestination.KinesisFirehoseDestinationProperty;

    /**
     * The types of events that Amazon Pinpoint sends to the specified event destinations.
     *
     * Acceptable values: `SEND` , `REJECT` , `BOUNCE` , `COMPLAINT` , `DELIVERY` , `OPEN` , `CLICK` , and `RENDERING_FAILURE` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-matchingeventtypes
     */
    readonly matchingEventTypes: Array<string>;

    /**
     * An object that defines a Amazon Pinpoint destination for email events.
     *
     * You can use Amazon Pinpoint events to create attributes in Amazon Pinpoint projects. You can use these attributes to create segments for your campaigns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-pinpointdestination
     */
    readonly pinpointDestination?: cdk.IResolvable | CfnConfigurationSetEventDestination.PinpointDestinationProperty;

    /**
     * An object that defines an Amazon SNS destination for email events.
     *
     * You can use Amazon SNS to send notification when certain email events occur.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-eventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination-snsdestination
     */
    readonly snsDestination?: cdk.IResolvable | CfnConfigurationSetEventDestination.SnsDestinationProperty;
  }

  /**
   * An object that defines an Amazon SNS destination for email events.
   *
   * You can use Amazon SNS to send notification when certain email events occur.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-snsdestination.html
   */
  export interface SnsDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon SNS topic that you want to publish email events to.
     *
     * For more information about Amazon SNS topics, see the [Amazon SNS Developer Guide](https://docs.aws.amazon.com/sns/latest/dg/CreateTopic.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-snsdestination.html#cfn-pinpointemail-configurationseteventdestination-snsdestination-topicarn
     */
    readonly topicArn: string;
  }

  /**
   * An object that defines an Amazon CloudWatch destination for email events.
   *
   * You can use Amazon CloudWatch to monitor and gain insights on your email sending metrics.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-cloudwatchdestination.html
   */
  export interface CloudWatchDestinationProperty {
    /**
     * An array of objects that define the dimensions to use when you send email events to Amazon CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-cloudwatchdestination.html#cfn-pinpointemail-configurationseteventdestination-cloudwatchdestination-dimensionconfigurations
     */
    readonly dimensionConfigurations?: Array<CfnConfigurationSetEventDestination.DimensionConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * An array of objects that define the dimensions to use when you send email events to Amazon CloudWatch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html
   */
  export interface DimensionConfigurationProperty {
    /**
     * The default value of the dimension that is published to Amazon CloudWatch if you don't provide the value of the dimension when you send an email.
     *
     * This value has to meet the following criteria:
     *
     * - It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).
     * - It can contain no more than 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html#cfn-pinpointemail-configurationseteventdestination-dimensionconfiguration-defaultdimensionvalue
     */
    readonly defaultDimensionValue: string;

    /**
     * The name of an Amazon CloudWatch dimension associated with an email sending metric.
     *
     * The name has to meet the following criteria:
     *
     * - It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-).
     * - It can contain no more than 256 characters.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html#cfn-pinpointemail-configurationseteventdestination-dimensionconfiguration-dimensionname
     */
    readonly dimensionName: string;

    /**
     * The location where Amazon Pinpoint finds the value of a dimension to publish to Amazon CloudWatch.
     *
     * Acceptable values: `MESSAGE_TAG` , `EMAIL_HEADER` , and `LINK_TAG` .
     *
     * If you want Amazon Pinpoint to use the message tags that you specify using an `X-SES-MESSAGE-TAGS` header or a parameter to the `SendEmail` API, choose `MESSAGE_TAG` . If you want Amazon Pinpoint to use your own email headers, choose `EMAIL_HEADER` . If you want Amazon Pinpoint to use tags that are specified in your links, choose `LINK_TAG` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-dimensionconfiguration.html#cfn-pinpointemail-configurationseteventdestination-dimensionconfiguration-dimensionvaluesource
     */
    readonly dimensionValueSource: string;
  }

  /**
   * An object that defines a Amazon Pinpoint destination for email events.
   *
   * You can use Amazon Pinpoint events to create attributes in Amazon Pinpoint projects. You can use these attributes to create segments for your campaigns.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-pinpointdestination.html
   */
  export interface PinpointDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Pinpoint project that you want to send email events to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-pinpointdestination.html#cfn-pinpointemail-configurationseteventdestination-pinpointdestination-applicationarn
     */
    readonly applicationArn?: string;
  }

  /**
   * An object that defines an Amazon Kinesis Data Firehose destination for email events.
   *
   * You can use Amazon Kinesis Data Firehose to stream data to other services, such as Amazon S3 and Amazon Redshift.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-kinesisfirehosedestination.html
   */
  export interface KinesisFirehoseDestinationProperty {
    /**
     * The Amazon Resource Name (ARN) of the Amazon Kinesis Data Firehose stream that Amazon Pinpoint sends email events to.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-kinesisfirehosedestination.html#cfn-pinpointemail-configurationseteventdestination-kinesisfirehosedestination-deliverystreamarn
     */
    readonly deliveryStreamArn: string;

    /**
     * The Amazon Resource Name (ARN) of the IAM role that Amazon Pinpoint uses when sending email events to the Amazon Kinesis Data Firehose stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-configurationseteventdestination-kinesisfirehosedestination.html#cfn-pinpointemail-configurationseteventdestination-kinesisfirehosedestination-iamrolearn
     */
    readonly iamRoleArn: string;
  }
}

/**
 * Properties for defining a `CfnConfigurationSetEventDestination`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html
 */
export interface CfnConfigurationSetEventDestinationProps {
  /**
   * The name of the configuration set that contains the event destination that you want to modify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-configurationsetname
   */
  readonly configurationSetName: string;

  /**
   * An object that defines the event destination.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestination
   */
  readonly eventDestination?: CfnConfigurationSetEventDestination.EventDestinationProperty | cdk.IResolvable;

  /**
   * The name of the event destination that you want to modify.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-configurationseteventdestination.html#cfn-pinpointemail-configurationseteventdestination-eventdestinationname
   */
  readonly eventDestinationName: string;
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
    "TopicArn": cdk.stringToCloudFormation(properties.topicArn)
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
  ret.addPropertyResult("topicArn", "TopicArn", (properties.TopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.TopicArn) : undefined));
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
 * Determine whether the given properties match those of a `PinpointDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `PinpointDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationPinpointDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationArn", cdk.validateString)(properties.applicationArn));
  return errors.wrap("supplied properties not correct for \"PinpointDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationPinpointDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationPinpointDestinationPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationArn": cdk.stringToCloudFormation(properties.applicationArn)
  };
}

// @ts-ignore TS6133
function CfnConfigurationSetEventDestinationPinpointDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnConfigurationSetEventDestination.PinpointDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnConfigurationSetEventDestination.PinpointDestinationProperty>();
  ret.addPropertyResult("applicationArn", "ApplicationArn", (properties.ApplicationArn != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationArn) : undefined));
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
    "DeliveryStreamArn": cdk.stringToCloudFormation(properties.deliveryStreamArn),
    "IamRoleArn": cdk.stringToCloudFormation(properties.iamRoleArn)
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
  ret.addPropertyResult("deliveryStreamArn", "DeliveryStreamArn", (properties.DeliveryStreamArn != null ? cfn_parse.FromCloudFormation.getString(properties.DeliveryStreamArn) : undefined));
  ret.addPropertyResult("iamRoleArn", "IamRoleArn", (properties.IamRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.IamRoleArn) : undefined));
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
  errors.collect(cdk.propertyValidator("pinpointDestination", CfnConfigurationSetEventDestinationPinpointDestinationPropertyValidator)(properties.pinpointDestination));
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
    "PinpointDestination": convertCfnConfigurationSetEventDestinationPinpointDestinationPropertyToCloudFormation(properties.pinpointDestination),
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
  ret.addPropertyResult("pinpointDestination", "PinpointDestination", (properties.PinpointDestination != null ? CfnConfigurationSetEventDestinationPinpointDestinationPropertyFromCloudFormation(properties.PinpointDestination) : undefined));
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
  errors.collect(cdk.propertyValidator("eventDestination", CfnConfigurationSetEventDestinationEventDestinationPropertyValidator)(properties.eventDestination));
  errors.collect(cdk.propertyValidator("eventDestinationName", cdk.requiredValidator)(properties.eventDestinationName));
  errors.collect(cdk.propertyValidator("eventDestinationName", cdk.validateString)(properties.eventDestinationName));
  return errors.wrap("supplied properties not correct for \"CfnConfigurationSetEventDestinationProps\"");
}

// @ts-ignore TS6133
function convertCfnConfigurationSetEventDestinationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnConfigurationSetEventDestinationPropsValidator(properties).assertSuccess();
  return {
    "ConfigurationSetName": cdk.stringToCloudFormation(properties.configurationSetName),
    "EventDestination": convertCfnConfigurationSetEventDestinationEventDestinationPropertyToCloudFormation(properties.eventDestination),
    "EventDestinationName": cdk.stringToCloudFormation(properties.eventDestinationName)
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
  ret.addPropertyResult("eventDestinationName", "EventDestinationName", (properties.EventDestinationName != null ? cfn_parse.FromCloudFormation.getString(properties.EventDestinationName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * A request to create a new dedicated IP pool.
 *
 * @cloudformationResource AWS::PinpointEmail::DedicatedIpPool
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html
 */
export class CfnDedicatedIpPool extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PinpointEmail::DedicatedIpPool";

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
   * @cloudformationAttribute Id
   */
  public readonly attrId: string;

  /**
   * The name of the dedicated IP pool.
   */
  public poolName?: string;

  /**
   * An object that defines the tags (keys and values) that you want to associate with the dedicated IP pool.
   */
  public tags?: Array<CfnDedicatedIpPool.TagsProperty>;

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

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.poolName = props.poolName;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "poolName": this.poolName,
      "tags": this.tags
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

export namespace CfnDedicatedIpPool {
  /**
   * An object that defines the tags (keys and values) that you want to associate with the dedicated IP pool.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-dedicatedippool-tags.html
   */
  export interface TagsProperty {
    /**
     * One part of a key-value pair that defines a tag.
     *
     * The maximum length of a tag key is 128 characters. The minimum length is 1 character.
     *
     * If you specify tags for the dedicated IP pool, then this value is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-dedicatedippool-tags.html#cfn-pinpointemail-dedicatedippool-tags-key
     */
    readonly key?: string;

    /**
     * The optional part of a key-value pair that defines a tag.
     *
     * The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-dedicatedippool-tags.html#cfn-pinpointemail-dedicatedippool-tags-value
     */
    readonly value?: string;
  }
}

/**
 * Properties for defining a `CfnDedicatedIpPool`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html
 */
export interface CfnDedicatedIpPoolProps {
  /**
   * The name of the dedicated IP pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html#cfn-pinpointemail-dedicatedippool-poolname
   */
  readonly poolName?: string;

  /**
   * An object that defines the tags (keys and values) that you want to associate with the dedicated IP pool.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-dedicatedippool.html#cfn-pinpointemail-dedicatedippool-tags
   */
  readonly tags?: Array<CfnDedicatedIpPool.TagsProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnDedicatedIpPoolTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnDedicatedIpPoolTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDedicatedIpPoolTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnDedicatedIpPoolTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnDedicatedIpPool.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnDedicatedIpPool.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
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
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnDedicatedIpPoolTagsPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnDedicatedIpPoolProps\"");
}

// @ts-ignore TS6133
function convertCfnDedicatedIpPoolPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnDedicatedIpPoolPropsValidator(properties).assertSuccess();
  return {
    "PoolName": cdk.stringToCloudFormation(properties.poolName),
    "Tags": cdk.listMapper(convertCfnDedicatedIpPoolTagsPropertyToCloudFormation)(properties.tags)
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
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnDedicatedIpPoolTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies an identity to use for sending email through Amazon Pinpoint.
 *
 * In Amazon Pinpoint, an *identity* is an email address or domain that you use when you send email. Before you can use Amazon Pinpoint to send an email from an identity, you first have to verify it. By verifying an identity, you demonstrate that you're the owner of the address or domain, and that you've given Amazon Pinpoint permission to send email from that identity.
 *
 * When you verify an email address, Amazon Pinpoint sends an email to the address. Your email address is verified as soon as you follow the link in the verification email.
 *
 * When you verify a domain, this operation provides a set of DKIM tokens, which you can convert into CNAME tokens. You add these CNAME tokens to the DNS configuration for your domain. Your domain is verified when Amazon Pinpoint detects these records in the DNS configuration for your domain. It usually takes around 72 hours to complete the domain verification process.
 *
 * > When you use CloudFormation to specify an identity, CloudFormation might indicate that the identity was created successfully. However, you have to verify the identity before you can use it to send email.
 *
 * @cloudformationResource AWS::PinpointEmail::Identity
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html
 */
export class CfnIdentity extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::PinpointEmail::Identity";

  /**
   * Build a CfnIdentity from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnIdentity {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnIdentityPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnIdentity(scope, id, propsResult.value);
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
   * The host name for the first token that you have to add to the DNS configuration for your domain.
   *
   * For more information, see [Verifying a Domain](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-email-manage-verify.html#channels-email-manage-verify-domain) in the Amazon Pinpoint User Guide.
   *
   * @cloudformationAttribute IdentityDNSRecordName1
   */
  public readonly attrIdentityDnsRecordName1: string;

  /**
   * The host name for the second token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute IdentityDNSRecordName2
   */
  public readonly attrIdentityDnsRecordName2: string;

  /**
   * The host name for the third token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute IdentityDNSRecordName3
   */
  public readonly attrIdentityDnsRecordName3: string;

  /**
   * The record value for the first token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute IdentityDNSRecordValue1
   */
  public readonly attrIdentityDnsRecordValue1: string;

  /**
   * The record value for the second token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute IdentityDNSRecordValue2
   */
  public readonly attrIdentityDnsRecordValue2: string;

  /**
   * The record value for the third token that you have to add to the DNS configuration for your domain.
   *
   * @cloudformationAttribute IdentityDNSRecordValue3
   */
  public readonly attrIdentityDnsRecordValue3: string;

  /**
   * For domain identities, this attribute is used to enable or disable DomainKeys Identified Mail (DKIM) signing for the domain.
   */
  public dkimSigningEnabled?: boolean | cdk.IResolvable;

  /**
   * Used to enable or disable feedback forwarding for an identity.
   */
  public feedbackForwardingEnabled?: boolean | cdk.IResolvable;

  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   */
  public mailFromAttributes?: cdk.IResolvable | CfnIdentity.MailFromAttributesProperty;

  /**
   * The address or domain of the identity, such as *sender@example.com* or *example.co.uk* .
   */
  public name: string;

  /**
   * An object that defines the tags (keys and values) that you want to associate with the email identity.
   */
  public tags?: Array<CfnIdentity.TagsProperty>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnIdentityProps) {
    super(scope, id, {
      "type": CfnIdentity.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrId = cdk.Token.asString(this.getAtt("Id", cdk.ResolutionTypeHint.STRING));
    this.attrIdentityDnsRecordName1 = cdk.Token.asString(this.getAtt("IdentityDNSRecordName1", cdk.ResolutionTypeHint.STRING));
    this.attrIdentityDnsRecordName2 = cdk.Token.asString(this.getAtt("IdentityDNSRecordName2", cdk.ResolutionTypeHint.STRING));
    this.attrIdentityDnsRecordName3 = cdk.Token.asString(this.getAtt("IdentityDNSRecordName3", cdk.ResolutionTypeHint.STRING));
    this.attrIdentityDnsRecordValue1 = cdk.Token.asString(this.getAtt("IdentityDNSRecordValue1", cdk.ResolutionTypeHint.STRING));
    this.attrIdentityDnsRecordValue2 = cdk.Token.asString(this.getAtt("IdentityDNSRecordValue2", cdk.ResolutionTypeHint.STRING));
    this.attrIdentityDnsRecordValue3 = cdk.Token.asString(this.getAtt("IdentityDNSRecordValue3", cdk.ResolutionTypeHint.STRING));
    this.dkimSigningEnabled = props.dkimSigningEnabled;
    this.feedbackForwardingEnabled = props.feedbackForwardingEnabled;
    this.mailFromAttributes = props.mailFromAttributes;
    this.name = props.name;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "dkimSigningEnabled": this.dkimSigningEnabled,
      "feedbackForwardingEnabled": this.feedbackForwardingEnabled,
      "mailFromAttributes": this.mailFromAttributes,
      "name": this.name,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnIdentity.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnIdentityPropsToCloudFormation(props);
  }
}

export namespace CfnIdentity {
  /**
   * An object that defines the tags (keys and values) that you want to associate with the identity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-tags.html
   */
  export interface TagsProperty {
    /**
     * One part of a key-value pair that defines a tag.
     *
     * The maximum length of a tag key is 128 characters. The minimum length is 1 character.
     *
     * If you specify tags for the identity, then this value is required.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-tags.html#cfn-pinpointemail-identity-tags-key
     */
    readonly key?: string;

    /**
     * The optional part of a key-value pair that defines a tag.
     *
     * The maximum length of a tag value is 256 characters. The minimum length is 0 characters. If you don’t want a resource to have a specific tag value, don’t specify a value for this parameter. Amazon Pinpoint will set the value to an empty string.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-tags.html#cfn-pinpointemail-identity-tags-value
     */
    readonly value?: string;
  }

  /**
   * A list of attributes that are associated with a MAIL FROM domain.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-mailfromattributes.html
   */
  export interface MailFromAttributesProperty {
    /**
     * The action that Amazon Pinpoint to takes if it can't read the required MX record for a custom MAIL FROM domain.
     *
     * When you set this value to `UseDefaultValue` , Amazon Pinpoint uses *amazonses.com* as the MAIL FROM domain. When you set this value to `RejectMessage` , Amazon Pinpoint returns a `MailFromDomainNotVerified` error, and doesn't attempt to deliver the email.
     *
     * These behaviors are taken when the custom MAIL FROM domain configuration is in the `Pending` , `Failed` , and `TemporaryFailure` states.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-mailfromattributes.html#cfn-pinpointemail-identity-mailfromattributes-behavioronmxfailure
     */
    readonly behaviorOnMxFailure?: string;

    /**
     * The name of a domain that an email identity uses as a custom MAIL FROM domain.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pinpointemail-identity-mailfromattributes.html#cfn-pinpointemail-identity-mailfromattributes-mailfromdomain
     */
    readonly mailFromDomain?: string;
  }
}

/**
 * Properties for defining a `CfnIdentity`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html
 */
export interface CfnIdentityProps {
  /**
   * For domain identities, this attribute is used to enable or disable DomainKeys Identified Mail (DKIM) signing for the domain.
   *
   * If the value is `true` , then the messages that you send from the domain are signed using both the DKIM keys for your domain, as well as the keys for the `amazonses.com` domain. If the value is `false` , then the messages that you send are only signed using the DKIM keys for the `amazonses.com` domain.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-dkimsigningenabled
   */
  readonly dkimSigningEnabled?: boolean | cdk.IResolvable;

  /**
   * Used to enable or disable feedback forwarding for an identity.
   *
   * This setting determines what happens when an identity is used to send an email that results in a bounce or complaint event.
   *
   * When you enable feedback forwarding, Amazon Pinpoint sends you email notifications when bounce or complaint events occur. Amazon Pinpoint sends this notification to the address that you specified in the Return-Path header of the original email.
   *
   * When you disable feedback forwarding, Amazon Pinpoint sends notifications through other mechanisms, such as by notifying an Amazon SNS topic. You're required to have a method of tracking bounces and complaints. If you haven't set up another mechanism for receiving bounce or complaint notifications, Amazon Pinpoint sends an email notification when these events occur (even if this setting is disabled).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-feedbackforwardingenabled
   */
  readonly feedbackForwardingEnabled?: boolean | cdk.IResolvable;

  /**
   * Used to enable or disable the custom Mail-From domain configuration for an email identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-mailfromattributes
   */
  readonly mailFromAttributes?: cdk.IResolvable | CfnIdentity.MailFromAttributesProperty;

  /**
   * The address or domain of the identity, such as *sender@example.com* or *example.co.uk* .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-name
   */
  readonly name: string;

  /**
   * An object that defines the tags (keys and values) that you want to associate with the email identity.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-pinpointemail-identity.html#cfn-pinpointemail-identity-tags
   */
  readonly tags?: Array<CfnIdentity.TagsProperty>;
}

/**
 * Determine whether the given properties match those of a `TagsProperty`
 *
 * @param properties - the TypeScript properties of a `TagsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityTagsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"TagsProperty\"");
}

// @ts-ignore TS6133
function convertCfnIdentityTagsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityTagsPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnIdentityTagsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentity.TagsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentity.TagsProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
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
function CfnIdentityMailFromAttributesPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnIdentityMailFromAttributesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityMailFromAttributesPropertyValidator(properties).assertSuccess();
  return {
    "BehaviorOnMxFailure": cdk.stringToCloudFormation(properties.behaviorOnMxFailure),
    "MailFromDomain": cdk.stringToCloudFormation(properties.mailFromDomain)
  };
}

// @ts-ignore TS6133
function CfnIdentityMailFromAttributesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnIdentity.MailFromAttributesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentity.MailFromAttributesProperty>();
  ret.addPropertyResult("behaviorOnMxFailure", "BehaviorOnMxFailure", (properties.BehaviorOnMxFailure != null ? cfn_parse.FromCloudFormation.getString(properties.BehaviorOnMxFailure) : undefined));
  ret.addPropertyResult("mailFromDomain", "MailFromDomain", (properties.MailFromDomain != null ? cfn_parse.FromCloudFormation.getString(properties.MailFromDomain) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnIdentityProps`
 *
 * @param properties - the TypeScript properties of a `CfnIdentityProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnIdentityPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dkimSigningEnabled", cdk.validateBoolean)(properties.dkimSigningEnabled));
  errors.collect(cdk.propertyValidator("feedbackForwardingEnabled", cdk.validateBoolean)(properties.feedbackForwardingEnabled));
  errors.collect(cdk.propertyValidator("mailFromAttributes", CfnIdentityMailFromAttributesPropertyValidator)(properties.mailFromAttributes));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(CfnIdentityTagsPropertyValidator))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnIdentityProps\"");
}

// @ts-ignore TS6133
function convertCfnIdentityPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnIdentityPropsValidator(properties).assertSuccess();
  return {
    "DkimSigningEnabled": cdk.booleanToCloudFormation(properties.dkimSigningEnabled),
    "FeedbackForwardingEnabled": cdk.booleanToCloudFormation(properties.feedbackForwardingEnabled),
    "MailFromAttributes": convertCfnIdentityMailFromAttributesPropertyToCloudFormation(properties.mailFromAttributes),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(convertCfnIdentityTagsPropertyToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnIdentityPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnIdentityProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnIdentityProps>();
  ret.addPropertyResult("dkimSigningEnabled", "DkimSigningEnabled", (properties.DkimSigningEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DkimSigningEnabled) : undefined));
  ret.addPropertyResult("feedbackForwardingEnabled", "FeedbackForwardingEnabled", (properties.FeedbackForwardingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FeedbackForwardingEnabled) : undefined));
  ret.addPropertyResult("mailFromAttributes", "MailFromAttributes", (properties.MailFromAttributes != null ? CfnIdentityMailFromAttributesPropertyFromCloudFormation(properties.MailFromAttributes) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(CfnIdentityTagsPropertyFromCloudFormation)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}