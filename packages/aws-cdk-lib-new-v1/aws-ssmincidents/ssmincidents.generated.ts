/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::SSMIncidents::ReplicationSet` resource specifies a set of Regions that Incident Manager data is replicated to and the KMS key used to encrypt the data.
 *
 * @cloudformationResource AWS::SSMIncidents::ReplicationSet
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html
 */
export class CfnReplicationSet extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSMIncidents::ReplicationSet";

  /**
   * Build a CfnReplicationSet from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnReplicationSet {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnReplicationSetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnReplicationSet(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the ReplicationSet.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Determines if the replication set deletion protection is enabled or not.
   */
  public deletionProtected?: boolean | cdk.IResolvable;

  /**
   * Specifies the Regions of the replication set.
   */
  public regions: Array<cdk.IResolvable | CfnReplicationSet.ReplicationRegionProperty> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * A list of tags to add to the replication set.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnReplicationSetProps) {
    super(scope, id, {
      "type": CfnReplicationSet.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "regions", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.deletionProtected = props.deletionProtected;
    this.regions = props.regions;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSMIncidents::ReplicationSet", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "deletionProtected": this.deletionProtected,
      "regions": this.regions,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnReplicationSet.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnReplicationSetPropsToCloudFormation(props);
  }
}

export namespace CfnReplicationSet {
  /**
   * The `ReplicationRegion` property type specifies the Region and KMS key to add to the replication set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html
   */
  export interface ReplicationRegionProperty {
    /**
     * Specifies the Region configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html#cfn-ssmincidents-replicationset-replicationregion-regionconfiguration
     */
    readonly regionConfiguration?: cdk.IResolvable | CfnReplicationSet.RegionConfigurationProperty;

    /**
     * Specifies the region name to add to the replication set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-replicationregion.html#cfn-ssmincidents-replicationset-replicationregion-regionname
     */
    readonly regionName?: string;
  }

  /**
   * The `RegionConfiguration` property specifies the Region and KMS key to add to the replication set.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-regionconfiguration.html
   */
  export interface RegionConfigurationProperty {
    /**
     * The KMS key ID to use to encrypt your replication set.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-replicationset-regionconfiguration.html#cfn-ssmincidents-replicationset-regionconfiguration-ssekmskeyid
     */
    readonly sseKmsKeyId: string;
  }
}

/**
 * Properties for defining a `CfnReplicationSet`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html
 */
export interface CfnReplicationSetProps {
  /**
   * Determines if the replication set deletion protection is enabled or not.
   *
   * If deletion protection is enabled, you can't delete the last Region in the replication set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-deletionprotected
   */
  readonly deletionProtected?: boolean | cdk.IResolvable;

  /**
   * Specifies the Regions of the replication set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-regions
   */
  readonly regions: Array<cdk.IResolvable | CfnReplicationSet.ReplicationRegionProperty> | cdk.IResolvable;

  /**
   * A list of tags to add to the replication set.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-replicationset.html#cfn-ssmincidents-replicationset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `RegionConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `RegionConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationSetRegionConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sseKmsKeyId", cdk.requiredValidator)(properties.sseKmsKeyId));
  errors.collect(cdk.propertyValidator("sseKmsKeyId", cdk.validateString)(properties.sseKmsKeyId));
  return errors.wrap("supplied properties not correct for \"RegionConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicationSetRegionConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationSetRegionConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SseKmsKeyId": cdk.stringToCloudFormation(properties.sseKmsKeyId)
  };
}

// @ts-ignore TS6133
function CfnReplicationSetRegionConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicationSet.RegionConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSet.RegionConfigurationProperty>();
  ret.addPropertyResult("sseKmsKeyId", "SseKmsKeyId", (properties.SseKmsKeyId != null ? cfn_parse.FromCloudFormation.getString(properties.SseKmsKeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ReplicationRegionProperty`
 *
 * @param properties - the TypeScript properties of a `ReplicationRegionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationSetReplicationRegionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("regionConfiguration", CfnReplicationSetRegionConfigurationPropertyValidator)(properties.regionConfiguration));
  errors.collect(cdk.propertyValidator("regionName", cdk.validateString)(properties.regionName));
  return errors.wrap("supplied properties not correct for \"ReplicationRegionProperty\"");
}

// @ts-ignore TS6133
function convertCfnReplicationSetReplicationRegionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationSetReplicationRegionPropertyValidator(properties).assertSuccess();
  return {
    "RegionConfiguration": convertCfnReplicationSetRegionConfigurationPropertyToCloudFormation(properties.regionConfiguration),
    "RegionName": cdk.stringToCloudFormation(properties.regionName)
  };
}

// @ts-ignore TS6133
function CfnReplicationSetReplicationRegionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnReplicationSet.ReplicationRegionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSet.ReplicationRegionProperty>();
  ret.addPropertyResult("regionConfiguration", "RegionConfiguration", (properties.RegionConfiguration != null ? CfnReplicationSetRegionConfigurationPropertyFromCloudFormation(properties.RegionConfiguration) : undefined));
  ret.addPropertyResult("regionName", "RegionName", (properties.RegionName != null ? cfn_parse.FromCloudFormation.getString(properties.RegionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnReplicationSetProps`
 *
 * @param properties - the TypeScript properties of a `CfnReplicationSetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnReplicationSetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deletionProtected", cdk.validateBoolean)(properties.deletionProtected));
  errors.collect(cdk.propertyValidator("regions", cdk.requiredValidator)(properties.regions));
  errors.collect(cdk.propertyValidator("regions", cdk.listValidator(CfnReplicationSetReplicationRegionPropertyValidator))(properties.regions));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnReplicationSetProps\"");
}

// @ts-ignore TS6133
function convertCfnReplicationSetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnReplicationSetPropsValidator(properties).assertSuccess();
  return {
    "DeletionProtected": cdk.booleanToCloudFormation(properties.deletionProtected),
    "Regions": cdk.listMapper(convertCfnReplicationSetReplicationRegionPropertyToCloudFormation)(properties.regions),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnReplicationSetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnReplicationSetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnReplicationSetProps>();
  ret.addPropertyResult("deletionProtected", "DeletionProtected", (properties.DeletionProtected != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DeletionProtected) : undefined));
  ret.addPropertyResult("regions", "Regions", (properties.Regions != null ? cfn_parse.FromCloudFormation.getArray(CfnReplicationSetReplicationRegionPropertyFromCloudFormation)(properties.Regions) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * The `AWS::SSMIncidents::ResponsePlan` resource specifies the details of the response plan that are used when creating an incident.
 *
 * @cloudformationResource AWS::SSMIncidents::ResponsePlan
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html
 */
export class CfnResponsePlan extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::SSMIncidents::ResponsePlan";

  /**
   * Build a CfnResponsePlan from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnResponsePlan {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnResponsePlanPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnResponsePlan(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN of the response plan.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The actions that the response plan starts at the beginning of an incident.
   */
  public actions?: Array<CfnResponsePlan.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Chatbot chat channel used for collaboration during an incident.
   */
  public chatChannel?: CfnResponsePlan.ChatChannelProperty | cdk.IResolvable;

  /**
   * The human readable name of the response plan.
   */
  public displayName?: string;

  /**
   * The Amazon Resource Name (ARN) for the contacts and escalation plans that the response plan engages during an incident.
   */
  public engagements?: Array<string>;

  /**
   * Details used to create an incident when using this response plan.
   */
  public incidentTemplate: CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable;

  /**
   * Information about third-party services integrated into the response plan.
   */
  public integrations?: Array<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the response plan.
   */
  public name: string;

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
  public constructor(scope: constructs.Construct, id: string, props: CfnResponsePlanProps) {
    super(scope, id, {
      "type": CfnResponsePlan.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "incidentTemplate", this);
    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.actions = props.actions;
    this.chatChannel = props.chatChannel;
    this.displayName = props.displayName;
    this.engagements = props.engagements;
    this.incidentTemplate = props.incidentTemplate;
    this.integrations = props.integrations;
    this.name = props.name;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::SSMIncidents::ResponsePlan", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "actions": this.actions,
      "chatChannel": this.chatChannel,
      "displayName": this.displayName,
      "engagements": this.engagements,
      "incidentTemplate": this.incidentTemplate,
      "integrations": this.integrations,
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
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnResponsePlan.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnResponsePlanPropsToCloudFormation(props);
  }
}

export namespace CfnResponsePlan {
  /**
   * The AWS Chatbot chat channel used for collaboration during an incident.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-chatchannel.html
   */
  export interface ChatChannelProperty {
    /**
     * The SNS targets that AWS Chatbot uses to notify the chat channel of updates to an incident.
     *
     * You can also make updates to the incident through the chat channel by using the SNS topics
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-chatchannel.html#cfn-ssmincidents-responseplan-chatchannel-chatbotsns
     */
    readonly chatbotSns?: Array<string>;
  }

  /**
   * Information about third-party services integrated into a response plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-integration.html
   */
  export interface IntegrationProperty {
    /**
     * Information about the PagerDuty service where the response plan creates an incident.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-integration.html#cfn-ssmincidents-responseplan-integration-pagerdutyconfiguration
     */
    readonly pagerDutyConfiguration: cdk.IResolvable | CfnResponsePlan.PagerDutyConfigurationProperty;
  }

  /**
   * Details about the PagerDuty configuration for a response plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html
   */
  export interface PagerDutyConfigurationProperty {
    /**
     * The name of the PagerDuty configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-name
     */
    readonly name: string;

    /**
     * Details about the PagerDuty service associated with the configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-pagerdutyincidentconfiguration
     */
    readonly pagerDutyIncidentConfiguration: cdk.IResolvable | CfnResponsePlan.PagerDutyIncidentConfigurationProperty;

    /**
     * The ID of the AWS Secrets Manager secret that stores your PagerDuty key, either a General Access REST API Key or User Token REST API Key, and other user credentials.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyconfiguration-secretid
     */
    readonly secretId: string;
  }

  /**
   * Details about the PagerDuty service where the response plan creates an incident.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyincidentconfiguration.html
   */
  export interface PagerDutyIncidentConfigurationProperty {
    /**
     * The ID of the PagerDuty service that the response plan associates with an incident when it launches.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-pagerdutyincidentconfiguration.html#cfn-ssmincidents-responseplan-pagerdutyincidentconfiguration-serviceid
     */
    readonly serviceId: string;
  }

  /**
   * The `Action` property type specifies the configuration to launch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-action.html
   */
  export interface ActionProperty {
    /**
     * Details about the Systems Manager automation document that will be used as a runbook during an incident.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-action.html#cfn-ssmincidents-responseplan-action-ssmautomation
     */
    readonly ssmAutomation?: cdk.IResolvable | CfnResponsePlan.SsmAutomationProperty;
  }

  /**
   * The `SsmAutomation` property type specifies details about the Systems Manager automation document that will be used as a runbook during an incident.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html
   */
  export interface SsmAutomationProperty {
    /**
     * The automation document's name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-documentname
     */
    readonly documentName: string;

    /**
     * The automation document's version to use when running.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-documentversion
     */
    readonly documentVersion?: string;

    /**
     * The key-value pairs to resolve dynamic parameter values when processing a Systems Manager Automation runbook.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-dynamicparameters
     */
    readonly dynamicParameters?: Array<CfnResponsePlan.DynamicSsmParameterProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The key-value pair parameters to use when running the automation document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-parameters
     */
    readonly parameters?: Array<cdk.IResolvable | CfnResponsePlan.SsmParameterProperty> | cdk.IResolvable;

    /**
     * The Amazon Resource Name (ARN) of the role that the automation document will assume when running commands.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-rolearn
     */
    readonly roleArn: string;

    /**
     * The account that the automation document will be run in.
     *
     * This can be in either the management account or an application account.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmautomation.html#cfn-ssmincidents-responseplan-ssmautomation-targetaccount
     */
    readonly targetAccount?: string;
  }

  /**
   * The key-value pair parameters to use when running the automation document.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html
   */
  export interface SsmParameterProperty {
    /**
     * The key parameter to use when running the automation document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html#cfn-ssmincidents-responseplan-ssmparameter-key
     */
    readonly key: string;

    /**
     * The value parameter to use when running the automation document.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-ssmparameter.html#cfn-ssmincidents-responseplan-ssmparameter-values
     */
    readonly values: Array<string>;
  }

  /**
   * When you add a runbook to a response plan, you can specify the parameters the runbook should use at runtime.
   *
   * Response plans support parameters with both static and dynamic values. For static values, you enter the value when you define the parameter in the response plan. For dynamic values, the system determines the correct parameter value by collecting information from the incident. Incident Manager supports the following dynamic parameters:
   *
   * *Incident ARN*
   *
   * When Incident Manager creates an incident, the system captures the Amazon Resource Name (ARN) of the corresponding incident record and enters it for this parameter in the runbook.
   *
   * > This value can only be assigned to parameters of type `String` . If assigned to a parameter of any other type, the runbook fails to run.
   *
   * *Involved resources*
   *
   * When Incident Manager creates an incident, the system captures the ARNs of the resources involved in the incident. These resource ARNs are then assigned to this parameter in the runbook.
   *
   * > This value can only be assigned to parameters of type `StringList` . If assigned to a parameter of any other type, the runbook fails to run.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html
   */
  export interface DynamicSsmParameterProperty {
    /**
     * The key parameter to use when running the Systems Manager Automation runbook.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html#cfn-ssmincidents-responseplan-dynamicssmparameter-key
     */
    readonly key: string;

    /**
     * The dynamic parameter value.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparameter.html#cfn-ssmincidents-responseplan-dynamicssmparameter-value
     */
    readonly value: CfnResponsePlan.DynamicSsmParameterValueProperty | cdk.IResolvable;
  }

  /**
   * The dynamic parameter value.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparametervalue.html
   */
  export interface DynamicSsmParameterValueProperty {
    /**
     * Variable dynamic parameters.
     *
     * A parameter value is determined when an incident is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-dynamicssmparametervalue.html#cfn-ssmincidents-responseplan-dynamicssmparametervalue-variable
     */
    readonly variable?: string;
  }

  /**
   * The `IncidentTemplate` property type specifies details used to create an incident when using this response plan.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html
   */
  export interface IncidentTemplateProperty {
    /**
     * Used to create only one incident record for an incident.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-dedupestring
     */
    readonly dedupeString?: string;

    /**
     * Defines the impact to the customers. Providing an impact overwrites the impact provided by a response plan.
     *
     * **Possible impacts:** - `1` - Critical impact, this typically relates to full application failure that impacts many to all customers.
     * - `2` - High impact, partial application failure with impact to many customers.
     * - `3` - Medium impact, the application is providing reduced service to customers.
     * - `4` - Low impact, customer might aren't impacted by the problem yet.
     * - `5` - No impact, customers aren't currently impacted but urgent action is needed to avoid impact.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-impact
     */
    readonly impact: number;

    /**
     * Tags to assign to the template.
     *
     * When the `StartIncident` API action is called, Incident Manager assigns the tags specified in the template to the incident.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-incidenttags
     */
    readonly incidentTags?: Array<cdk.CfnTag | cdk.IResolvable> | cdk.IResolvable;

    /**
     * The SNS targets that AWS Chatbot uses to notify the chat channel of updates to an incident.
     *
     * You can also make updates to the incident through the chat channel using the SNS topics.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-notificationtargets
     */
    readonly notificationTargets?: Array<cdk.IResolvable | CfnResponsePlan.NotificationTargetItemProperty> | cdk.IResolvable;

    /**
     * The summary describes what has happened during the incident.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-summary
     */
    readonly summary?: string;

    /**
     * The title of the incident is a brief and easily recognizable.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-incidenttemplate.html#cfn-ssmincidents-responseplan-incidenttemplate-title
     */
    readonly title: string;
  }

  /**
   * The SNS topic that's used by AWS Chatbot to notify the incidents chat channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-notificationtargetitem.html
   */
  export interface NotificationTargetItemProperty {
    /**
     * The Amazon Resource Name (ARN) of the SNS topic.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmincidents-responseplan-notificationtargetitem.html#cfn-ssmincidents-responseplan-notificationtargetitem-snstopicarn
     */
    readonly snsTopicArn?: string;
  }
}

/**
 * Properties for defining a `CfnResponsePlan`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html
 */
export interface CfnResponsePlanProps {
  /**
   * The actions that the response plan starts at the beginning of an incident.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-actions
   */
  readonly actions?: Array<CfnResponsePlan.ActionProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The AWS Chatbot chat channel used for collaboration during an incident.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-chatchannel
   */
  readonly chatChannel?: CfnResponsePlan.ChatChannelProperty | cdk.IResolvable;

  /**
   * The human readable name of the response plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-displayname
   */
  readonly displayName?: string;

  /**
   * The Amazon Resource Name (ARN) for the contacts and escalation plans that the response plan engages during an incident.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-engagements
   */
  readonly engagements?: Array<string>;

  /**
   * Details used to create an incident when using this response plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-incidenttemplate
   */
  readonly incidentTemplate: CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable;

  /**
   * Information about third-party services integrated into the response plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-integrations
   */
  readonly integrations?: Array<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The name of the response plan.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-name
   */
  readonly name: string;

  /**
   * An array of key-value pairs to apply to this resource.
   *
   * For more information, see [Tag](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-resource-tags.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-ssmincidents-responseplan.html#cfn-ssmincidents-responseplan-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ChatChannelProperty`
 *
 * @param properties - the TypeScript properties of a `ChatChannelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanChatChannelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("chatbotSns", cdk.listValidator(cdk.validateString))(properties.chatbotSns));
  return errors.wrap("supplied properties not correct for \"ChatChannelProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanChatChannelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanChatChannelPropertyValidator(properties).assertSuccess();
  return {
    "ChatbotSns": cdk.listMapper(cdk.stringToCloudFormation)(properties.chatbotSns)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanChatChannelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.ChatChannelProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.ChatChannelProperty>();
  ret.addPropertyResult("chatbotSns", "ChatbotSns", (properties.ChatbotSns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ChatbotSns) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PagerDutyIncidentConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PagerDutyIncidentConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanPagerDutyIncidentConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("serviceId", cdk.requiredValidator)(properties.serviceId));
  errors.collect(cdk.propertyValidator("serviceId", cdk.validateString)(properties.serviceId));
  return errors.wrap("supplied properties not correct for \"PagerDutyIncidentConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanPagerDutyIncidentConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanPagerDutyIncidentConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ServiceId": cdk.stringToCloudFormation(properties.serviceId)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanPagerDutyIncidentConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponsePlan.PagerDutyIncidentConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.PagerDutyIncidentConfigurationProperty>();
  ret.addPropertyResult("serviceId", "ServiceId", (properties.ServiceId != null ? cfn_parse.FromCloudFormation.getString(properties.ServiceId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `PagerDutyConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `PagerDutyConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanPagerDutyConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("pagerDutyIncidentConfiguration", cdk.requiredValidator)(properties.pagerDutyIncidentConfiguration));
  errors.collect(cdk.propertyValidator("pagerDutyIncidentConfiguration", CfnResponsePlanPagerDutyIncidentConfigurationPropertyValidator)(properties.pagerDutyIncidentConfiguration));
  errors.collect(cdk.propertyValidator("secretId", cdk.requiredValidator)(properties.secretId));
  errors.collect(cdk.propertyValidator("secretId", cdk.validateString)(properties.secretId));
  return errors.wrap("supplied properties not correct for \"PagerDutyConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanPagerDutyConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanPagerDutyConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "PagerDutyIncidentConfiguration": convertCfnResponsePlanPagerDutyIncidentConfigurationPropertyToCloudFormation(properties.pagerDutyIncidentConfiguration),
    "SecretId": cdk.stringToCloudFormation(properties.secretId)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanPagerDutyConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponsePlan.PagerDutyConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.PagerDutyConfigurationProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("pagerDutyIncidentConfiguration", "PagerDutyIncidentConfiguration", (properties.PagerDutyIncidentConfiguration != null ? CfnResponsePlanPagerDutyIncidentConfigurationPropertyFromCloudFormation(properties.PagerDutyIncidentConfiguration) : undefined));
  ret.addPropertyResult("secretId", "SecretId", (properties.SecretId != null ? cfn_parse.FromCloudFormation.getString(properties.SecretId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IntegrationProperty`
 *
 * @param properties - the TypeScript properties of a `IntegrationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanIntegrationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("pagerDutyConfiguration", cdk.requiredValidator)(properties.pagerDutyConfiguration));
  errors.collect(cdk.propertyValidator("pagerDutyConfiguration", CfnResponsePlanPagerDutyConfigurationPropertyValidator)(properties.pagerDutyConfiguration));
  return errors.wrap("supplied properties not correct for \"IntegrationProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanIntegrationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanIntegrationPropertyValidator(properties).assertSuccess();
  return {
    "PagerDutyConfiguration": convertCfnResponsePlanPagerDutyConfigurationPropertyToCloudFormation(properties.pagerDutyConfiguration)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanIntegrationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.IntegrationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.IntegrationProperty>();
  ret.addPropertyResult("pagerDutyConfiguration", "PagerDutyConfiguration", (properties.PagerDutyConfiguration != null ? CfnResponsePlanPagerDutyConfigurationPropertyFromCloudFormation(properties.PagerDutyConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SsmParameterProperty`
 *
 * @param properties - the TypeScript properties of a `SsmParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanSsmParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("values", cdk.requiredValidator)(properties.values));
  errors.collect(cdk.propertyValidator("values", cdk.listValidator(cdk.validateString))(properties.values));
  return errors.wrap("supplied properties not correct for \"SsmParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanSsmParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanSsmParameterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Values": cdk.listMapper(cdk.stringToCloudFormation)(properties.values)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanSsmParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponsePlan.SsmParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.SsmParameterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("values", "Values", (properties.Values != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Values) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamicSsmParameterValueProperty`
 *
 * @param properties - the TypeScript properties of a `DynamicSsmParameterValueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanDynamicSsmParameterValuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("variable", cdk.validateString)(properties.variable));
  return errors.wrap("supplied properties not correct for \"DynamicSsmParameterValueProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanDynamicSsmParameterValuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanDynamicSsmParameterValuePropertyValidator(properties).assertSuccess();
  return {
    "Variable": cdk.stringToCloudFormation(properties.variable)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanDynamicSsmParameterValuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.DynamicSsmParameterValueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.DynamicSsmParameterValueProperty>();
  ret.addPropertyResult("variable", "Variable", (properties.Variable != null ? cfn_parse.FromCloudFormation.getString(properties.Variable) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamicSsmParameterProperty`
 *
 * @param properties - the TypeScript properties of a `DynamicSsmParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanDynamicSsmParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnResponsePlanDynamicSsmParameterValuePropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"DynamicSsmParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanDynamicSsmParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanDynamicSsmParameterPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": convertCfnResponsePlanDynamicSsmParameterValuePropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanDynamicSsmParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.DynamicSsmParameterProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.DynamicSsmParameterProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnResponsePlanDynamicSsmParameterValuePropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SsmAutomationProperty`
 *
 * @param properties - the TypeScript properties of a `SsmAutomationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanSsmAutomationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("documentName", cdk.requiredValidator)(properties.documentName));
  errors.collect(cdk.propertyValidator("documentName", cdk.validateString)(properties.documentName));
  errors.collect(cdk.propertyValidator("documentVersion", cdk.validateString)(properties.documentVersion));
  errors.collect(cdk.propertyValidator("dynamicParameters", cdk.listValidator(CfnResponsePlanDynamicSsmParameterPropertyValidator))(properties.dynamicParameters));
  errors.collect(cdk.propertyValidator("parameters", cdk.listValidator(CfnResponsePlanSsmParameterPropertyValidator))(properties.parameters));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("targetAccount", cdk.validateString)(properties.targetAccount));
  return errors.wrap("supplied properties not correct for \"SsmAutomationProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanSsmAutomationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanSsmAutomationPropertyValidator(properties).assertSuccess();
  return {
    "DocumentName": cdk.stringToCloudFormation(properties.documentName),
    "DocumentVersion": cdk.stringToCloudFormation(properties.documentVersion),
    "DynamicParameters": cdk.listMapper(convertCfnResponsePlanDynamicSsmParameterPropertyToCloudFormation)(properties.dynamicParameters),
    "Parameters": cdk.listMapper(convertCfnResponsePlanSsmParameterPropertyToCloudFormation)(properties.parameters),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "TargetAccount": cdk.stringToCloudFormation(properties.targetAccount)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanSsmAutomationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponsePlan.SsmAutomationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.SsmAutomationProperty>();
  ret.addPropertyResult("documentName", "DocumentName", (properties.DocumentName != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentName) : undefined));
  ret.addPropertyResult("documentVersion", "DocumentVersion", (properties.DocumentVersion != null ? cfn_parse.FromCloudFormation.getString(properties.DocumentVersion) : undefined));
  ret.addPropertyResult("dynamicParameters", "DynamicParameters", (properties.DynamicParameters != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanDynamicSsmParameterPropertyFromCloudFormation)(properties.DynamicParameters) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanSsmParameterPropertyFromCloudFormation)(properties.Parameters) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("targetAccount", "TargetAccount", (properties.TargetAccount != null ? cfn_parse.FromCloudFormation.getString(properties.TargetAccount) : undefined));
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
function CfnResponsePlanActionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ssmAutomation", CfnResponsePlanSsmAutomationPropertyValidator)(properties.ssmAutomation));
  return errors.wrap("supplied properties not correct for \"ActionProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanActionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanActionPropertyValidator(properties).assertSuccess();
  return {
    "SsmAutomation": convertCfnResponsePlanSsmAutomationPropertyToCloudFormation(properties.ssmAutomation)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanActionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.ActionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.ActionProperty>();
  ret.addPropertyResult("ssmAutomation", "SsmAutomation", (properties.SsmAutomation != null ? CfnResponsePlanSsmAutomationPropertyFromCloudFormation(properties.SsmAutomation) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NotificationTargetItemProperty`
 *
 * @param properties - the TypeScript properties of a `NotificationTargetItemProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanNotificationTargetItemPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("snsTopicArn", cdk.validateString)(properties.snsTopicArn));
  return errors.wrap("supplied properties not correct for \"NotificationTargetItemProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanNotificationTargetItemPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanNotificationTargetItemPropertyValidator(properties).assertSuccess();
  return {
    "SnsTopicArn": cdk.stringToCloudFormation(properties.snsTopicArn)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanNotificationTargetItemPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnResponsePlan.NotificationTargetItemProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.NotificationTargetItemProperty>();
  ret.addPropertyResult("snsTopicArn", "SnsTopicArn", (properties.SnsTopicArn != null ? cfn_parse.FromCloudFormation.getString(properties.SnsTopicArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IncidentTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `IncidentTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanIncidentTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dedupeString", cdk.validateString)(properties.dedupeString));
  errors.collect(cdk.propertyValidator("impact", cdk.requiredValidator)(properties.impact));
  errors.collect(cdk.propertyValidator("impact", cdk.validateNumber)(properties.impact));
  errors.collect(cdk.propertyValidator("incidentTags", cdk.listValidator(cdk.validateCfnTag))(properties.incidentTags));
  errors.collect(cdk.propertyValidator("notificationTargets", cdk.listValidator(CfnResponsePlanNotificationTargetItemPropertyValidator))(properties.notificationTargets));
  errors.collect(cdk.propertyValidator("summary", cdk.validateString)(properties.summary));
  errors.collect(cdk.propertyValidator("title", cdk.requiredValidator)(properties.title));
  errors.collect(cdk.propertyValidator("title", cdk.validateString)(properties.title));
  return errors.wrap("supplied properties not correct for \"IncidentTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanIncidentTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanIncidentTemplatePropertyValidator(properties).assertSuccess();
  return {
    "DedupeString": cdk.stringToCloudFormation(properties.dedupeString),
    "Impact": cdk.numberToCloudFormation(properties.impact),
    "IncidentTags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.incidentTags),
    "NotificationTargets": cdk.listMapper(convertCfnResponsePlanNotificationTargetItemPropertyToCloudFormation)(properties.notificationTargets),
    "Summary": cdk.stringToCloudFormation(properties.summary),
    "Title": cdk.stringToCloudFormation(properties.title)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanIncidentTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlan.IncidentTemplateProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlan.IncidentTemplateProperty>();
  ret.addPropertyResult("dedupeString", "DedupeString", (properties.DedupeString != null ? cfn_parse.FromCloudFormation.getString(properties.DedupeString) : undefined));
  ret.addPropertyResult("impact", "Impact", (properties.Impact != null ? cfn_parse.FromCloudFormation.getNumber(properties.Impact) : undefined));
  ret.addPropertyResult("incidentTags", "IncidentTags", (properties.IncidentTags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.IncidentTags) : undefined));
  ret.addPropertyResult("notificationTargets", "NotificationTargets", (properties.NotificationTargets != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanNotificationTargetItemPropertyFromCloudFormation)(properties.NotificationTargets) : undefined));
  ret.addPropertyResult("summary", "Summary", (properties.Summary != null ? cfn_parse.FromCloudFormation.getString(properties.Summary) : undefined));
  ret.addPropertyResult("title", "Title", (properties.Title != null ? cfn_parse.FromCloudFormation.getString(properties.Title) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnResponsePlanProps`
 *
 * @param properties - the TypeScript properties of a `CfnResponsePlanProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnResponsePlanPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("actions", cdk.listValidator(CfnResponsePlanActionPropertyValidator))(properties.actions));
  errors.collect(cdk.propertyValidator("chatChannel", CfnResponsePlanChatChannelPropertyValidator)(properties.chatChannel));
  errors.collect(cdk.propertyValidator("displayName", cdk.validateString)(properties.displayName));
  errors.collect(cdk.propertyValidator("engagements", cdk.listValidator(cdk.validateString))(properties.engagements));
  errors.collect(cdk.propertyValidator("incidentTemplate", cdk.requiredValidator)(properties.incidentTemplate));
  errors.collect(cdk.propertyValidator("incidentTemplate", CfnResponsePlanIncidentTemplatePropertyValidator)(properties.incidentTemplate));
  errors.collect(cdk.propertyValidator("integrations", cdk.listValidator(CfnResponsePlanIntegrationPropertyValidator))(properties.integrations));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnResponsePlanProps\"");
}

// @ts-ignore TS6133
function convertCfnResponsePlanPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnResponsePlanPropsValidator(properties).assertSuccess();
  return {
    "Actions": cdk.listMapper(convertCfnResponsePlanActionPropertyToCloudFormation)(properties.actions),
    "ChatChannel": convertCfnResponsePlanChatChannelPropertyToCloudFormation(properties.chatChannel),
    "DisplayName": cdk.stringToCloudFormation(properties.displayName),
    "Engagements": cdk.listMapper(cdk.stringToCloudFormation)(properties.engagements),
    "IncidentTemplate": convertCfnResponsePlanIncidentTemplatePropertyToCloudFormation(properties.incidentTemplate),
    "Integrations": cdk.listMapper(convertCfnResponsePlanIntegrationPropertyToCloudFormation)(properties.integrations),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnResponsePlanPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnResponsePlanProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnResponsePlanProps>();
  ret.addPropertyResult("actions", "Actions", (properties.Actions != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanActionPropertyFromCloudFormation)(properties.Actions) : undefined));
  ret.addPropertyResult("chatChannel", "ChatChannel", (properties.ChatChannel != null ? CfnResponsePlanChatChannelPropertyFromCloudFormation(properties.ChatChannel) : undefined));
  ret.addPropertyResult("displayName", "DisplayName", (properties.DisplayName != null ? cfn_parse.FromCloudFormation.getString(properties.DisplayName) : undefined));
  ret.addPropertyResult("engagements", "Engagements", (properties.Engagements != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Engagements) : undefined));
  ret.addPropertyResult("incidentTemplate", "IncidentTemplate", (properties.IncidentTemplate != null ? CfnResponsePlanIncidentTemplatePropertyFromCloudFormation(properties.IncidentTemplate) : undefined));
  ret.addPropertyResult("integrations", "Integrations", (properties.Integrations != null ? cfn_parse.FromCloudFormation.getArray(CfnResponsePlanIntegrationPropertyFromCloudFormation)(properties.Integrations) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}