/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Contains information about an outbound campaign.
 *
 * @cloudformationResource AWS::ConnectCampaigns::Campaign
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html
 */
export class CfnCampaign extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::ConnectCampaigns::Campaign";

  /**
   * Build a CfnCampaign from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnCampaign {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnCampaignPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnCampaign(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the high-volume outbound campaign.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   */
  public connectInstanceArn: string;

  /**
   * Contains information about the dialer configuration.
   */
  public dialerConfig: CfnCampaign.DialerConfigProperty | cdk.IResolvable;

  /**
   * The name of the campaign.
   */
  public name: string;

  /**
   * Contains information about the outbound call configuration.
   */
  public outboundCallConfig: cdk.IResolvable | CfnCampaign.OutboundCallConfigProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags used to organize, track, or control access for this resource.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnCampaignProps) {
    super(scope, id, {
      "type": CfnCampaign.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "connectInstanceArn", this);
    cdk.requireProperty(props, "dialerConfig", this);
    cdk.requireProperty(props, "name", this);
    cdk.requireProperty(props, "outboundCallConfig", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.connectInstanceArn = props.connectInstanceArn;
    this.dialerConfig = props.dialerConfig;
    this.name = props.name;
    this.outboundCallConfig = props.outboundCallConfig;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::ConnectCampaigns::Campaign", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "connectInstanceArn": this.connectInstanceArn,
      "dialerConfig": this.dialerConfig,
      "name": this.name,
      "outboundCallConfig": this.outboundCallConfig,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnCampaign.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnCampaignPropsToCloudFormation(props);
  }
}

export namespace CfnCampaign {
  /**
   * Contains outbound call configuration for an outbound campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html
   */
  export interface OutboundCallConfigProperty {
    /**
     * Whether answering machine detection has been enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-answermachinedetectionconfig
     */
    readonly answerMachineDetectionConfig?: CfnCampaign.AnswerMachineDetectionConfigProperty | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the flow.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-connectcontactflowarn
     */
    readonly connectContactFlowArn: string;

    /**
     * The Amazon Resource Name (ARN) of the queue.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-connectqueuearn
     */
    readonly connectQueueArn?: string;

    /**
     * The phone number associated with the outbound call.
     *
     * This is the caller ID that is displayed to customers when an agent calls them.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-outboundcallconfig.html#cfn-connectcampaigns-campaign-outboundcallconfig-connectsourcephonenumber
     */
    readonly connectSourcePhoneNumber?: string;
  }

  /**
   * Contains information about answering machine detection.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-answermachinedetectionconfig.html
   */
  export interface AnswerMachineDetectionConfigProperty {
    /**
     * Whether answering machine detection is enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-answermachinedetectionconfig.html#cfn-connectcampaigns-campaign-answermachinedetectionconfig-enableanswermachinedetection
     */
    readonly enableAnswerMachineDetection: boolean | cdk.IResolvable;
  }

  /**
   * Contains dialer configuration for an outbound campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html
   */
  export interface DialerConfigProperty {
    /**
     * The configuration of the agentless dialer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html#cfn-connectcampaigns-campaign-dialerconfig-agentlessdialerconfig
     */
    readonly agentlessDialerConfig?: CfnCampaign.AgentlessDialerConfigProperty | cdk.IResolvable;

    /**
     * The configuration of the predictive dialer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html#cfn-connectcampaigns-campaign-dialerconfig-predictivedialerconfig
     */
    readonly predictiveDialerConfig?: cdk.IResolvable | CfnCampaign.PredictiveDialerConfigProperty;

    /**
     * The configuration of the progressive dialer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-dialerconfig.html#cfn-connectcampaigns-campaign-dialerconfig-progressivedialerconfig
     */
    readonly progressiveDialerConfig?: cdk.IResolvable | CfnCampaign.ProgressiveDialerConfigProperty;
  }

  /**
   * Contains agentless dialer configuration for an outbound campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-agentlessdialerconfig.html
   */
  export interface AgentlessDialerConfigProperty {
    /**
     * The allocation of dialing capacity between multiple active campaigns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-agentlessdialerconfig.html#cfn-connectcampaigns-campaign-agentlessdialerconfig-dialingcapacity
     */
    readonly dialingCapacity?: number;
  }

  /**
   * Contains predictive dialer configuration for an outbound campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-predictivedialerconfig.html
   */
  export interface PredictiveDialerConfigProperty {
    /**
     * Bandwidth allocation for the predictive dialer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-predictivedialerconfig.html#cfn-connectcampaigns-campaign-predictivedialerconfig-bandwidthallocation
     */
    readonly bandwidthAllocation: number;

    /**
     * The allocation of dialing capacity between multiple active campaigns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-predictivedialerconfig.html#cfn-connectcampaigns-campaign-predictivedialerconfig-dialingcapacity
     */
    readonly dialingCapacity?: number;
  }

  /**
   * Contains progressive dialer configuration for an outbound campaign.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-progressivedialerconfig.html
   */
  export interface ProgressiveDialerConfigProperty {
    /**
     * Bandwidth allocation for the progressive dialer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-progressivedialerconfig.html#cfn-connectcampaigns-campaign-progressivedialerconfig-bandwidthallocation
     */
    readonly bandwidthAllocation: number;

    /**
     * The allocation of dialing capacity between multiple active campaigns.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-connectcampaigns-campaign-progressivedialerconfig.html#cfn-connectcampaigns-campaign-progressivedialerconfig-dialingcapacity
     */
    readonly dialingCapacity?: number;
  }
}

/**
 * Properties for defining a `CfnCampaign`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html
 */
export interface CfnCampaignProps {
  /**
   * The Amazon Resource Name (ARN) of the Amazon Connect instance.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-connectinstancearn
   */
  readonly connectInstanceArn: string;

  /**
   * Contains information about the dialer configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-dialerconfig
   */
  readonly dialerConfig: CfnCampaign.DialerConfigProperty | cdk.IResolvable;

  /**
   * The name of the campaign.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-name
   */
  readonly name: string;

  /**
   * Contains information about the outbound call configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-outboundcallconfig
   */
  readonly outboundCallConfig: cdk.IResolvable | CfnCampaign.OutboundCallConfigProperty;

  /**
   * The tags used to organize, track, or control access for this resource.
   *
   * For example, { "tags": {"key1":"value1", "key2":"value2"} }.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-connectcampaigns-campaign.html#cfn-connectcampaigns-campaign-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AnswerMachineDetectionConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AnswerMachineDetectionConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignAnswerMachineDetectionConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enableAnswerMachineDetection", cdk.requiredValidator)(properties.enableAnswerMachineDetection));
  errors.collect(cdk.propertyValidator("enableAnswerMachineDetection", cdk.validateBoolean)(properties.enableAnswerMachineDetection));
  return errors.wrap("supplied properties not correct for \"AnswerMachineDetectionConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignAnswerMachineDetectionConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignAnswerMachineDetectionConfigPropertyValidator(properties).assertSuccess();
  return {
    "EnableAnswerMachineDetection": cdk.booleanToCloudFormation(properties.enableAnswerMachineDetection)
  };
}

// @ts-ignore TS6133
function CfnCampaignAnswerMachineDetectionConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.AnswerMachineDetectionConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.AnswerMachineDetectionConfigProperty>();
  ret.addPropertyResult("enableAnswerMachineDetection", "EnableAnswerMachineDetection", (properties.EnableAnswerMachineDetection != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EnableAnswerMachineDetection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `OutboundCallConfigProperty`
 *
 * @param properties - the TypeScript properties of a `OutboundCallConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignOutboundCallConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("answerMachineDetectionConfig", CfnCampaignAnswerMachineDetectionConfigPropertyValidator)(properties.answerMachineDetectionConfig));
  errors.collect(cdk.propertyValidator("connectContactFlowArn", cdk.requiredValidator)(properties.connectContactFlowArn));
  errors.collect(cdk.propertyValidator("connectContactFlowArn", cdk.validateString)(properties.connectContactFlowArn));
  errors.collect(cdk.propertyValidator("connectQueueArn", cdk.validateString)(properties.connectQueueArn));
  errors.collect(cdk.propertyValidator("connectSourcePhoneNumber", cdk.validateString)(properties.connectSourcePhoneNumber));
  return errors.wrap("supplied properties not correct for \"OutboundCallConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignOutboundCallConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignOutboundCallConfigPropertyValidator(properties).assertSuccess();
  return {
    "AnswerMachineDetectionConfig": convertCfnCampaignAnswerMachineDetectionConfigPropertyToCloudFormation(properties.answerMachineDetectionConfig),
    "ConnectContactFlowArn": cdk.stringToCloudFormation(properties.connectContactFlowArn),
    "ConnectQueueArn": cdk.stringToCloudFormation(properties.connectQueueArn),
    "ConnectSourcePhoneNumber": cdk.stringToCloudFormation(properties.connectSourcePhoneNumber)
  };
}

// @ts-ignore TS6133
function CfnCampaignOutboundCallConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.OutboundCallConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.OutboundCallConfigProperty>();
  ret.addPropertyResult("answerMachineDetectionConfig", "AnswerMachineDetectionConfig", (properties.AnswerMachineDetectionConfig != null ? CfnCampaignAnswerMachineDetectionConfigPropertyFromCloudFormation(properties.AnswerMachineDetectionConfig) : undefined));
  ret.addPropertyResult("connectContactFlowArn", "ConnectContactFlowArn", (properties.ConnectContactFlowArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectContactFlowArn) : undefined));
  ret.addPropertyResult("connectQueueArn", "ConnectQueueArn", (properties.ConnectQueueArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectQueueArn) : undefined));
  ret.addPropertyResult("connectSourcePhoneNumber", "ConnectSourcePhoneNumber", (properties.ConnectSourcePhoneNumber != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectSourcePhoneNumber) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AgentlessDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `AgentlessDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignAgentlessDialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dialingCapacity", cdk.validateNumber)(properties.dialingCapacity));
  return errors.wrap("supplied properties not correct for \"AgentlessDialerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignAgentlessDialerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignAgentlessDialerConfigPropertyValidator(properties).assertSuccess();
  return {
    "DialingCapacity": cdk.numberToCloudFormation(properties.dialingCapacity)
  };
}

// @ts-ignore TS6133
function CfnCampaignAgentlessDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.AgentlessDialerConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.AgentlessDialerConfigProperty>();
  ret.addPropertyResult("dialingCapacity", "DialingCapacity", (properties.DialingCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.DialingCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PredictiveDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `PredictiveDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignPredictiveDialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bandwidthAllocation", cdk.requiredValidator)(properties.bandwidthAllocation));
  errors.collect(cdk.propertyValidator("bandwidthAllocation", cdk.validateNumber)(properties.bandwidthAllocation));
  errors.collect(cdk.propertyValidator("dialingCapacity", cdk.validateNumber)(properties.dialingCapacity));
  return errors.wrap("supplied properties not correct for \"PredictiveDialerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignPredictiveDialerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignPredictiveDialerConfigPropertyValidator(properties).assertSuccess();
  return {
    "BandwidthAllocation": cdk.numberToCloudFormation(properties.bandwidthAllocation),
    "DialingCapacity": cdk.numberToCloudFormation(properties.dialingCapacity)
  };
}

// @ts-ignore TS6133
function CfnCampaignPredictiveDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.PredictiveDialerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.PredictiveDialerConfigProperty>();
  ret.addPropertyResult("bandwidthAllocation", "BandwidthAllocation", (properties.BandwidthAllocation != null ? cfn_parse.FromCloudFormation.getNumber(properties.BandwidthAllocation) : undefined));
  ret.addPropertyResult("dialingCapacity", "DialingCapacity", (properties.DialingCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.DialingCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProgressiveDialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ProgressiveDialerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignProgressiveDialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bandwidthAllocation", cdk.requiredValidator)(properties.bandwidthAllocation));
  errors.collect(cdk.propertyValidator("bandwidthAllocation", cdk.validateNumber)(properties.bandwidthAllocation));
  errors.collect(cdk.propertyValidator("dialingCapacity", cdk.validateNumber)(properties.dialingCapacity));
  return errors.wrap("supplied properties not correct for \"ProgressiveDialerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignProgressiveDialerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignProgressiveDialerConfigPropertyValidator(properties).assertSuccess();
  return {
    "BandwidthAllocation": cdk.numberToCloudFormation(properties.bandwidthAllocation),
    "DialingCapacity": cdk.numberToCloudFormation(properties.dialingCapacity)
  };
}

// @ts-ignore TS6133
function CfnCampaignProgressiveDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnCampaign.ProgressiveDialerConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.ProgressiveDialerConfigProperty>();
  ret.addPropertyResult("bandwidthAllocation", "BandwidthAllocation", (properties.BandwidthAllocation != null ? cfn_parse.FromCloudFormation.getNumber(properties.BandwidthAllocation) : undefined));
  ret.addPropertyResult("dialingCapacity", "DialingCapacity", (properties.DialingCapacity != null ? cfn_parse.FromCloudFormation.getNumber(properties.DialingCapacity) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DialerConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DialerConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignDialerConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("agentlessDialerConfig", CfnCampaignAgentlessDialerConfigPropertyValidator)(properties.agentlessDialerConfig));
  errors.collect(cdk.propertyValidator("predictiveDialerConfig", CfnCampaignPredictiveDialerConfigPropertyValidator)(properties.predictiveDialerConfig));
  errors.collect(cdk.propertyValidator("progressiveDialerConfig", CfnCampaignProgressiveDialerConfigPropertyValidator)(properties.progressiveDialerConfig));
  return errors.wrap("supplied properties not correct for \"DialerConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnCampaignDialerConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignDialerConfigPropertyValidator(properties).assertSuccess();
  return {
    "AgentlessDialerConfig": convertCfnCampaignAgentlessDialerConfigPropertyToCloudFormation(properties.agentlessDialerConfig),
    "PredictiveDialerConfig": convertCfnCampaignPredictiveDialerConfigPropertyToCloudFormation(properties.predictiveDialerConfig),
    "ProgressiveDialerConfig": convertCfnCampaignProgressiveDialerConfigPropertyToCloudFormation(properties.progressiveDialerConfig)
  };
}

// @ts-ignore TS6133
function CfnCampaignDialerConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaign.DialerConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaign.DialerConfigProperty>();
  ret.addPropertyResult("agentlessDialerConfig", "AgentlessDialerConfig", (properties.AgentlessDialerConfig != null ? CfnCampaignAgentlessDialerConfigPropertyFromCloudFormation(properties.AgentlessDialerConfig) : undefined));
  ret.addPropertyResult("predictiveDialerConfig", "PredictiveDialerConfig", (properties.PredictiveDialerConfig != null ? CfnCampaignPredictiveDialerConfigPropertyFromCloudFormation(properties.PredictiveDialerConfig) : undefined));
  ret.addPropertyResult("progressiveDialerConfig", "ProgressiveDialerConfig", (properties.ProgressiveDialerConfig != null ? CfnCampaignProgressiveDialerConfigPropertyFromCloudFormation(properties.ProgressiveDialerConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnCampaignProps`
 *
 * @param properties - the TypeScript properties of a `CfnCampaignProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnCampaignPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("connectInstanceArn", cdk.requiredValidator)(properties.connectInstanceArn));
  errors.collect(cdk.propertyValidator("connectInstanceArn", cdk.validateString)(properties.connectInstanceArn));
  errors.collect(cdk.propertyValidator("dialerConfig", cdk.requiredValidator)(properties.dialerConfig));
  errors.collect(cdk.propertyValidator("dialerConfig", CfnCampaignDialerConfigPropertyValidator)(properties.dialerConfig));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("outboundCallConfig", cdk.requiredValidator)(properties.outboundCallConfig));
  errors.collect(cdk.propertyValidator("outboundCallConfig", CfnCampaignOutboundCallConfigPropertyValidator)(properties.outboundCallConfig));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnCampaignProps\"");
}

// @ts-ignore TS6133
function convertCfnCampaignPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnCampaignPropsValidator(properties).assertSuccess();
  return {
    "ConnectInstanceArn": cdk.stringToCloudFormation(properties.connectInstanceArn),
    "DialerConfig": convertCfnCampaignDialerConfigPropertyToCloudFormation(properties.dialerConfig),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OutboundCallConfig": convertCfnCampaignOutboundCallConfigPropertyToCloudFormation(properties.outboundCallConfig),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnCampaignPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnCampaignProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnCampaignProps>();
  ret.addPropertyResult("connectInstanceArn", "ConnectInstanceArn", (properties.ConnectInstanceArn != null ? cfn_parse.FromCloudFormation.getString(properties.ConnectInstanceArn) : undefined));
  ret.addPropertyResult("dialerConfig", "DialerConfig", (properties.DialerConfig != null ? CfnCampaignDialerConfigPropertyFromCloudFormation(properties.DialerConfig) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("outboundCallConfig", "OutboundCallConfig", (properties.OutboundCallConfig != null ? CfnCampaignOutboundCallConfigPropertyFromCloudFormation(properties.OutboundCallConfig) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}