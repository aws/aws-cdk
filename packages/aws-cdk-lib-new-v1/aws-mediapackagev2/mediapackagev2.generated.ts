/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates a channel to receive content.
 *
 * After it's created, a channel provides static input URLs. These URLs remain the same throughout the lifetime of the channel, regardless of any failures or upgrades that might occur. Use these URLs to configure the outputs of your upstream encoder.
 *
 * @cloudformationResource AWS::MediaPackageV2::Channel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackageV2::Channel";

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
   * The Amazon Resource Name (ARN) of the channel.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp of the ccreation of the channel.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The ingest endpoints associated with the channel.
   *
   * @cloudformationAttribute IngestEndpoints
   */
  public readonly attrIngestEndpoints: cdk.IResolvable;

  /**
   * The timestamp of the modification of the channel.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * The name of the channel group associated with the channel configuration.
   */
  public channelGroupName?: string;

  /**
   * The name of the channel.
   */
  public channelName?: string;

  /**
   * The description of the channel.
   */
  public description?: string;

  /**
   * The tags associated with the channel.
   */
  public tags?: Array<cdk.CfnTag>;

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

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrIngestEndpoints = this.getAtt("IngestEndpoints");
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.channelGroupName = props.channelGroupName;
    this.channelName = props.channelName;
    this.description = props.description;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelGroupName": this.channelGroupName,
      "channelName": this.channelName,
      "description": this.description,
      "tags": this.tags
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
   * The input URL where the source stream should be sent.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-channel-ingestendpoint.html
   */
  export interface IngestEndpointProperty {
    /**
     * The identifier associated with the ingest endpoint of the channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-channel-ingestendpoint.html#cfn-mediapackagev2-channel-ingestendpoint-id
     */
    readonly id?: string;

    /**
     * The URL associated with the ingest endpoint of the channel.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-channel-ingestendpoint.html#cfn-mediapackagev2-channel-ingestendpoint-url
     */
    readonly url?: string;
  }
}

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channel.html
 */
export interface CfnChannelProps {
  /**
   * The name of the channel group associated with the channel configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channel.html#cfn-mediapackagev2-channel-channelgroupname
   */
  readonly channelGroupName?: string;

  /**
   * The name of the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channel.html#cfn-mediapackagev2-channel-channelname
   */
  readonly channelName?: string;

  /**
   * The description of the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channel.html#cfn-mediapackagev2-channel-description
   */
  readonly description?: string;

  /**
   * The tags associated with the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channel.html#cfn-mediapackagev2-channel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `IngestEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `IngestEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelIngestEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"IngestEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelIngestEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelIngestEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnChannelIngestEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.IngestEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.IngestEndpointProperty>();
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
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
  errors.collect(cdk.propertyValidator("channelGroupName", cdk.validateString)(properties.channelGroupName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPropsValidator(properties).assertSuccess();
  return {
    "ChannelGroupName": cdk.stringToCloudFormation(properties.channelGroupName),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "Description": cdk.stringToCloudFormation(properties.description),
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
  ret.addPropertyResult("channelGroupName", "ChannelGroupName", (properties.ChannelGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelGroupName) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the configuraiton for a MediaPackage V2 channel group.
 *
 * @cloudformationResource AWS::MediaPackageV2::ChannelGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelgroup.html
 */
export class CfnChannelGroup extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackageV2::ChannelGroup";

  /**
   * Build a CfnChannelGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannelGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnChannelGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnChannelGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the channel group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp of the creation of the channel group.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The egress domain of the channel group.
   *
   * @cloudformationAttribute EgressDomain
   */
  public readonly attrEgressDomain: string;

  /**
   * The timestamp of the modification of the channel group.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * The name of the channel group.
   */
  public channelGroupName?: string;

  /**
   * The configuration for a MediaPackage V2 channel group.
   */
  public description?: string;

  /**
   * The tags associated with the channel group.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelGroupProps = {}) {
    super(scope, id, {
      "type": CfnChannelGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrEgressDomain = cdk.Token.asString(this.getAtt("EgressDomain", cdk.ResolutionTypeHint.STRING));
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.channelGroupName = props.channelGroupName;
    this.description = props.description;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelGroupName": this.channelGroupName,
      "description": this.description,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannelGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnChannelGroupPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnChannelGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelgroup.html
 */
export interface CfnChannelGroupProps {
  /**
   * The name of the channel group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelgroup.html#cfn-mediapackagev2-channelgroup-channelgroupname
   */
  readonly channelGroupName?: string;

  /**
   * The configuration for a MediaPackage V2 channel group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelgroup.html#cfn-mediapackagev2-channelgroup-description
   */
  readonly description?: string;

  /**
   * The tags associated with the channel group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelgroup.html#cfn-mediapackagev2-channelgroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `CfnChannelGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelGroupName", cdk.validateString)(properties.channelGroupName));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnChannelGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelGroupPropsValidator(properties).assertSuccess();
  return {
    "ChannelGroupName": cdk.stringToCloudFormation(properties.channelGroupName),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnChannelGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelGroupProps>();
  ret.addPropertyResult("channelGroupName", "ChannelGroupName", (properties.ChannelGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelGroupName) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the configuration parameters of a MediaPackage V2 channel policy.
 *
 * @cloudformationResource AWS::MediaPackageV2::ChannelPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelpolicy.html
 */
export class CfnChannelPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackageV2::ChannelPolicy";

  /**
   * Build a CfnChannelPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnChannelPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnChannelPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnChannelPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the channel group associated with the channel policy.
   */
  public channelGroupName?: string;

  /**
   * The name of the channel associated with the channel policy.
   */
  public channelName?: string;

  /**
   * The policy associated with the channel.
   */
  public policy: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelPolicyProps) {
    super(scope, id, {
      "type": CfnChannelPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);

    this.channelGroupName = props.channelGroupName;
    this.channelName = props.channelName;
    this.policy = props.policy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelGroupName": this.channelGroupName,
      "channelName": this.channelName,
      "policy": this.policy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnChannelPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnChannelPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnChannelPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelpolicy.html
 */
export interface CfnChannelPolicyProps {
  /**
   * The name of the channel group associated with the channel policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelpolicy.html#cfn-mediapackagev2-channelpolicy-channelgroupname
   */
  readonly channelGroupName?: string;

  /**
   * The name of the channel associated with the channel policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelpolicy.html#cfn-mediapackagev2-channelpolicy-channelname
   */
  readonly channelName?: string;

  /**
   * The policy associated with the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-channelpolicy.html#cfn-mediapackagev2-channelpolicy-policy
   */
  readonly policy: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnChannelPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnChannelPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelGroupName", cdk.validateString)(properties.channelGroupName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  return errors.wrap("supplied properties not correct for \"CfnChannelPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPolicyPropsValidator(properties).assertSuccess();
  return {
    "ChannelGroupName": cdk.stringToCloudFormation(properties.channelGroupName),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "Policy": cdk.objectToCloudFormation(properties.policy)
  };
}

// @ts-ignore TS6133
function CfnChannelPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannelPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannelPolicyProps>();
  ret.addPropertyResult("channelGroupName", "ChannelGroupName", (properties.ChannelGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelGroupName) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the configuration parameters for a MediaPackage V2 origin endpoint.
 *
 * @cloudformationResource AWS::MediaPackageV2::OriginEndpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html
 */
export class CfnOriginEndpoint extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackageV2::OriginEndpoint";

  /**
   * Build a CfnOriginEndpoint from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginEndpoint {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnOriginEndpointPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOriginEndpoint(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) of the origin endpoint.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The timestamp of the creation of the origin endpoint.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * The timestamp of the modification of the origin endpoint.
   *
   * @cloudformationAttribute ModifiedAt
   */
  public readonly attrModifiedAt: string;

  /**
   * The name of the channel group associated with the origin endpoint configuration.
   */
  public channelGroupName?: string;

  /**
   * The channel name associated with the origin endpoint.
   */
  public channelName?: string;

  /**
   * The container type associated with the origin endpoint configuration.
   */
  public containerType: string;

  /**
   * The description associated with the origin endpoint.
   */
  public description?: string;

  /**
   * The HLS manfiests associated with the origin endpoint configuration.
   */
  public hlsManifests?: Array<CfnOriginEndpoint.HlsManifestConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The low-latency HLS (LL-HLS) manifests associated with the origin endpoint.
   */
  public lowLatencyHlsManifests?: Array<cdk.IResolvable | CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty> | cdk.IResolvable;

  /**
   * The name of the origin endpoint associated with the origin endpoint configuration.
   */
  public originEndpointName?: string;

  /**
   * The segment associated with the origin endpoint.
   */
  public segment?: cdk.IResolvable | CfnOriginEndpoint.SegmentProperty;

  /**
   * The size of the window (in seconds) to specify a window of the live stream that's available for on-demand viewing.
   */
  public startoverWindowSeconds?: number;

  /**
   * The tags associated with the origin endpoint.
   */
  public tags?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOriginEndpointProps) {
    super(scope, id, {
      "type": CfnOriginEndpoint.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "containerType", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.attrModifiedAt = cdk.Token.asString(this.getAtt("ModifiedAt", cdk.ResolutionTypeHint.STRING));
    this.channelGroupName = props.channelGroupName;
    this.channelName = props.channelName;
    this.containerType = props.containerType;
    this.description = props.description;
    this.hlsManifests = props.hlsManifests;
    this.lowLatencyHlsManifests = props.lowLatencyHlsManifests;
    this.originEndpointName = props.originEndpointName;
    this.segment = props.segment;
    this.startoverWindowSeconds = props.startoverWindowSeconds;
    this.tags = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelGroupName": this.channelGroupName,
      "channelName": this.channelName,
      "containerType": this.containerType,
      "description": this.description,
      "hlsManifests": this.hlsManifests,
      "lowLatencyHlsManifests": this.lowLatencyHlsManifests,
      "originEndpointName": this.originEndpointName,
      "segment": this.segment,
      "startoverWindowSeconds": this.startoverWindowSeconds,
      "tags": this.tags
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginEndpoint.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOriginEndpointPropsToCloudFormation(props);
  }
}

export namespace CfnOriginEndpoint {
  /**
   * Specify a low-latency HTTP live streaming (LL-HLS) manifest configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html
   */
  export interface LowLatencyHlsManifestConfigurationProperty {
    /**
     * The name of the child manifest associated with the low-latency HLS (LL-HLS) manifest configuration of the origin endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-childmanifestname
     */
    readonly childManifestName?: string;

    /**
     * <p>Filter configuration includes settings for manifest filtering, start and end times, and time delay that apply to all of your egress requests for this manifest.
     *
     * </p>
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-filterconfiguration
     */
    readonly filterConfiguration?: CfnOriginEndpoint.FilterConfigurationProperty | cdk.IResolvable;

    /**
     * A short short string that's appended to the endpoint URL.
     *
     * The manifest name creates a unique path to this endpoint. If you don't enter a value, MediaPackage uses the default manifest name, `index` . MediaPackage automatically inserts the format extension, such as `.m3u8` . You can't use the same manifest name if you use HLS manifest and low-latency HLS manifest. The `manifestName` on the `HLSManifest` object overrides the `manifestName` you provided on the `originEndpoint` object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-manifestname
     */
    readonly manifestName: string;

    /**
     * The total duration (in seconds) of the manifest's content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-manifestwindowseconds
     */
    readonly manifestWindowSeconds?: number;

    /**
     * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify.
     *
     * If you don't enter an interval, `EXT-X-PROGRAM-DATE-TIME` tags aren't included in the manifest. The tags sync the stream to the wall clock so that viewers can seek to a specific time in the playback timeline on the player. `ID3Timed` metadata messages generate every 5 seconds whenever MediaPackage ingests the content.
     *
     * Irrespective of this parameter, if any `ID3Timed` metadata is in the HLS input, MediaPackage passes through that metadata to the HLS output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-programdatetimeintervalseconds
     */
    readonly programDateTimeIntervalSeconds?: number;

    /**
     * The SCTE-35 HLS configuration associated with the low-latency HLS (LL-HLS) manifest configuration of the origin endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-sctehls
     */
    readonly scteHls?: cdk.IResolvable | CfnOriginEndpoint.ScteHlsProperty;

    /**
     * The URL of the low-latency HLS (LL-HLS) manifest configuration of the origin endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifestconfiguration-url
     */
    readonly url?: string;
  }

  /**
   * The SCTE-35 HLS configuration associated with the origin endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-sctehls.html
   */
  export interface ScteHlsProperty {
    /**
     * The SCTE-35 HLS ad-marker configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-sctehls.html#cfn-mediapackagev2-originendpoint-sctehls-admarkerhls
     */
    readonly adMarkerHls?: string;
  }

  /**
   * <p>Filter configuration includes settings for manifest filtering, start and end times, and time delay that apply to all of your egress requests for this manifest.
   *
   * </p>
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-filterconfiguration.html
   */
  export interface FilterConfigurationProperty {
    /**
     * <p>Optionally specify the end time for all of your manifest egress requests.
     *
     * When you include end time, note that you cannot use end time query parameters for this manifest's endpoint URL.</p>
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-filterconfiguration.html#cfn-mediapackagev2-originendpoint-filterconfiguration-end
     */
    readonly end?: string;

    /**
     * <p>Optionally specify one or more manifest filters for all of your manifest egress requests.
     *
     * When you include a manifest filter, note that you cannot use an identical manifest filter query parameter for this manifest's endpoint URL.</p>
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-filterconfiguration.html#cfn-mediapackagev2-originendpoint-filterconfiguration-manifestfilter
     */
    readonly manifestFilter?: string;

    /**
     * <p>Optionally specify the start time for all of your manifest egress requests.
     *
     * When you include start time, note that you cannot use start time query parameters for this manifest's endpoint URL.</p>
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-filterconfiguration.html#cfn-mediapackagev2-originendpoint-filterconfiguration-start
     */
    readonly start?: string;

    /**
     * <p>Optionally specify the time delay for all of your manifest egress requests.
     *
     * Enter a value that is smaller than your endpoint's startover window. When you include time delay, note that you cannot use time delay query parameters for this manifest's endpoint URL.</p>
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-filterconfiguration.html#cfn-mediapackagev2-originendpoint-filterconfiguration-timedelayseconds
     */
    readonly timeDelaySeconds?: number;
  }

  /**
   * The HLS manfiest configuration associated with the origin endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html
   */
  export interface HlsManifestConfigurationProperty {
    /**
     * The name of the child manifest associated with the HLS manifest configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-childmanifestname
     */
    readonly childManifestName?: string;

    /**
     * <p>Filter configuration includes settings for manifest filtering, start and end times, and time delay that apply to all of your egress requests for this manifest.
     *
     * </p>
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-filterconfiguration
     */
    readonly filterConfiguration?: CfnOriginEndpoint.FilterConfigurationProperty | cdk.IResolvable;

    /**
     * The name of the manifest associated with the HLS manifest configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-manifestname
     */
    readonly manifestName: string;

    /**
     * The duration of the manifest window, in seconds, for the HLS manifest configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-manifestwindowseconds
     */
    readonly manifestWindowSeconds?: number;

    /**
     * The `EXT-X-PROGRAM-DATE-TIME` interval, in seconds, associated with the HLS manifest configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-programdatetimeintervalseconds
     */
    readonly programDateTimeIntervalSeconds?: number;

    /**
     * THE SCTE-35 HLS configuration associated with the HLS manifest configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-sctehls
     */
    readonly scteHls?: cdk.IResolvable | CfnOriginEndpoint.ScteHlsProperty;

    /**
     * The URL of the HLS manifest configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-hlsmanifestconfiguration.html#cfn-mediapackagev2-originendpoint-hlsmanifestconfiguration-url
     */
    readonly url?: string;
  }

  /**
   * The segment configuration, including the segment name, duration, and other configuration values.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html
   */
  export interface SegmentProperty {
    /**
     * Whether to use encryption for the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-encryption
     */
    readonly encryption?: CfnOriginEndpoint.EncryptionProperty | cdk.IResolvable;

    /**
     * Whether the segment includes I-frame-only streams.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-includeiframeonlystreams
     */
    readonly includeIframeOnlyStreams?: boolean | cdk.IResolvable;

    /**
     * The SCTE-35 configuration associated with the segment.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-scte
     */
    readonly scte?: cdk.IResolvable | CfnOriginEndpoint.ScteProperty;

    /**
     * The duration of the segment, in seconds.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * The name of the segment associated with the origin endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-segmentname
     */
    readonly segmentName?: string;

    /**
     * Whether the segment includes DVB subtitles.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-tsincludedvbsubtitles
     */
    readonly tsIncludeDvbSubtitles?: boolean | cdk.IResolvable;

    /**
     * Whether the segment is an audio rendition group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-segment.html#cfn-mediapackagev2-originendpoint-segment-tsuseaudiorenditiongroup
     */
    readonly tsUseAudioRenditionGroup?: boolean | cdk.IResolvable;
  }

  /**
   * The SCTE-35 configuration associated with the origin endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-scte.html
   */
  export interface ScteProperty {
    /**
     * The filter associated with the SCTE-35 configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-scte.html#cfn-mediapackagev2-originendpoint-scte-sctefilter
     */
    readonly scteFilter?: Array<string>;
  }

  /**
   * A collection of video encryption presets.
   *
   * Value description:
   *
   * - `PRESET-VIDEO-1` - Use one content key to encrypt all of the video tracks in your stream.
   * - `PRESET-VIDEO-2` - Use one content key to encrypt all of the SD video tracks and one content key for all HD and higher resolutions video tracks.
   * - `PRESET-VIDEO-3` - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks and one content key for all UHD video tracks.
   * - `PRESET-VIDEO-4` - Use one content key to encrypt all of the SD video tracks, one content key for HD video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
   * - `PRESET-VIDEO-5` - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
   * - `PRESET-VIDEO-6` - Use one content key to encrypt all of the SD video tracks, one content key for HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
   * - `PRESET-VIDEO-7` - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks and one content key for all UHD video tracks.
   * - `PRESET-VIDEO-8` - Use one content key to encrypt all of the SD+HD1 video tracks, one content key for HD2 video tracks, one content key for all UHD1 video tracks and one content key for all UHD2 video tracks.
   * - `SHARED` - Use the same content key for all of the video and audio tracks in your stream.
   * - `UNENCRYPTED` - Don't encrypt any of the video tracks in your stream.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryption.html
   */
  export interface EncryptionProperty {
    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, used in conjunction with the key for encrypting content.
     *
     * If you don't specify a value, then MediaPackage creates the constant initialization vector (IV).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryption.html#cfn-mediapackagev2-originendpoint-encryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * The encryption method to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryption.html#cfn-mediapackagev2-originendpoint-encryption-encryptionmethod
     */
    readonly encryptionMethod: CfnOriginEndpoint.EncryptionMethodProperty | cdk.IResolvable;

    /**
     * The interval, in seconds, to rotate encryption keys for the origin endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryption.html#cfn-mediapackagev2-originendpoint-encryption-keyrotationintervalseconds
     */
    readonly keyRotationIntervalSeconds?: number;

    /**
     * The SPEKE key provider to use for encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryption.html#cfn-mediapackagev2-originendpoint-encryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnOriginEndpoint.SpekeKeyProviderProperty;
  }

  /**
   * The parameters for the SPEKE key provider.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-spekekeyprovider.html
   */
  export interface SpekeKeyProviderProperty {
    /**
     * The DRM solution provider you're using to protect your content during distribution.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-spekekeyprovider.html#cfn-mediapackagev2-originendpoint-spekekeyprovider-drmsystems
     */
    readonly drmSystems: Array<string>;

    /**
     * The encryption contract configuration associated with the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-spekekeyprovider.html#cfn-mediapackagev2-originendpoint-spekekeyprovider-encryptioncontractconfiguration
     */
    readonly encryptionContractConfiguration: CfnOriginEndpoint.EncryptionContractConfigurationProperty | cdk.IResolvable;

    /**
     * The unique identifier for the content.
     *
     * The service sends this identifier to the key server to identify the current endpoint. How unique you make this identifier depends on how fine-grained you want access controls to be. The service does not permit you to use the same ID for two simultaneous encryption processes. The resource ID is also known as the content ID.
     *
     * The following example shows a resource ID: `MovieNight20171126093045`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-spekekeyprovider.html#cfn-mediapackagev2-originendpoint-spekekeyprovider-resourceid
     */
    readonly resourceId: string;

    /**
     * The ARN for the IAM role granted by the key provider that provides access to the key provider API.
     *
     * This role must have a trust policy that allows MediaPackage to assume the role, and it must have a sufficient permissions policy to allow access to the specific key retrieval URL. Get this from your DRM solution provider.
     *
     * Valid format: `arn:aws:iam::{accountID}:role/{name}` . The following example shows a role ARN: `arn:aws:iam::444455556666:role/SpekeAccess`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-spekekeyprovider.html#cfn-mediapackagev2-originendpoint-spekekeyprovider-rolearn
     */
    readonly roleArn: string;

    /**
     * The URL of the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-spekekeyprovider.html#cfn-mediapackagev2-originendpoint-spekekeyprovider-url
     */
    readonly url: string;
  }

  /**
   * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines which content keys are used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryptioncontractconfiguration.html
   */
  export interface EncryptionContractConfigurationProperty {
    /**
     * A collection of audio encryption presets.
     *
     * Value description:
     *
     * - `PRESET-AUDIO-1` - Use one content key to encrypt all of the audio tracks in your stream.
     * - `PRESET-AUDIO-2` - Use one content key to encrypt all of the stereo audio tracks and one content key to encrypt all of the multichannel audio tracks.
     * - `PRESET-AUDIO-3` - Use one content key to encrypt all of the stereo audio tracks, one content key to encrypt all of the multichannel audio tracks with 3 to 6 channels, and one content key to encrypt all of the multichannel audio tracks with more than 6 channels.
     * - `SHARED` - Use the same content key for all of the audio and video tracks in your stream.
     * - `UNENCRYPTED` - Don't encrypt any of the audio tracks in your stream.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryptioncontractconfiguration.html#cfn-mediapackagev2-originendpoint-encryptioncontractconfiguration-presetspeke20audio
     */
    readonly presetSpeke20Audio: string;

    /**
     * The SPEKE Version 2.0 preset video associated with the encryption contract configuration of the origin endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryptioncontractconfiguration.html#cfn-mediapackagev2-originendpoint-encryptioncontractconfiguration-presetspeke20video
     */
    readonly presetSpeke20Video: string;
  }

  /**
   * The encryption method associated with the origin endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryptionmethod.html
   */
  export interface EncryptionMethodProperty {
    /**
     * The encryption method to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryptionmethod.html#cfn-mediapackagev2-originendpoint-encryptionmethod-cmafencryptionmethod
     */
    readonly cmafEncryptionMethod?: string;

    /**
     * The encryption method to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackagev2-originendpoint-encryptionmethod.html#cfn-mediapackagev2-originendpoint-encryptionmethod-tsencryptionmethod
     */
    readonly tsEncryptionMethod?: string;
  }
}

/**
 * Properties for defining a `CfnOriginEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html
 */
export interface CfnOriginEndpointProps {
  /**
   * The name of the channel group associated with the origin endpoint configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-channelgroupname
   */
  readonly channelGroupName?: string;

  /**
   * The channel name associated with the origin endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-channelname
   */
  readonly channelName?: string;

  /**
   * The container type associated with the origin endpoint configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-containertype
   */
  readonly containerType: string;

  /**
   * The description associated with the origin endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-description
   */
  readonly description?: string;

  /**
   * The HLS manfiests associated with the origin endpoint configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-hlsmanifests
   */
  readonly hlsManifests?: Array<CfnOriginEndpoint.HlsManifestConfigurationProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The low-latency HLS (LL-HLS) manifests associated with the origin endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-lowlatencyhlsmanifests
   */
  readonly lowLatencyHlsManifests?: Array<cdk.IResolvable | CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty> | cdk.IResolvable;

  /**
   * The name of the origin endpoint associated with the origin endpoint configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-originendpointname
   */
  readonly originEndpointName?: string;

  /**
   * The segment associated with the origin endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-segment
   */
  readonly segment?: cdk.IResolvable | CfnOriginEndpoint.SegmentProperty;

  /**
   * The size of the window (in seconds) to specify a window of the live stream that's available for on-demand viewing.
   *
   * Viewers can start-over or catch-up on content that falls within the window.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-startoverwindowseconds
   */
  readonly startoverWindowSeconds?: number;

  /**
   * The tags associated with the origin endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpoint.html#cfn-mediapackagev2-originendpoint-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `ScteHlsProperty`
 *
 * @param properties - the TypeScript properties of a `ScteHlsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointScteHlsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adMarkerHls", cdk.validateString)(properties.adMarkerHls));
  return errors.wrap("supplied properties not correct for \"ScteHlsProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointScteHlsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointScteHlsPropertyValidator(properties).assertSuccess();
  return {
    "AdMarkerHls": cdk.stringToCloudFormation(properties.adMarkerHls)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointScteHlsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.ScteHlsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.ScteHlsProperty>();
  ret.addPropertyResult("adMarkerHls", "AdMarkerHls", (properties.AdMarkerHls != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkerHls) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FilterConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `FilterConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointFilterConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("end", cdk.validateString)(properties.end));
  errors.collect(cdk.propertyValidator("manifestFilter", cdk.validateString)(properties.manifestFilter));
  errors.collect(cdk.propertyValidator("start", cdk.validateString)(properties.start));
  errors.collect(cdk.propertyValidator("timeDelaySeconds", cdk.validateNumber)(properties.timeDelaySeconds));
  return errors.wrap("supplied properties not correct for \"FilterConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointFilterConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointFilterConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "End": cdk.stringToCloudFormation(properties.end),
    "ManifestFilter": cdk.stringToCloudFormation(properties.manifestFilter),
    "Start": cdk.stringToCloudFormation(properties.start),
    "TimeDelaySeconds": cdk.numberToCloudFormation(properties.timeDelaySeconds)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointFilterConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.FilterConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.FilterConfigurationProperty>();
  ret.addPropertyResult("end", "End", (properties.End != null ? cfn_parse.FromCloudFormation.getString(properties.End) : undefined));
  ret.addPropertyResult("manifestFilter", "ManifestFilter", (properties.ManifestFilter != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestFilter) : undefined));
  ret.addPropertyResult("start", "Start", (properties.Start != null ? cfn_parse.FromCloudFormation.getString(properties.Start) : undefined));
  ret.addPropertyResult("timeDelaySeconds", "TimeDelaySeconds", (properties.TimeDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeDelaySeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LowLatencyHlsManifestConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LowLatencyHlsManifestConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("childManifestName", cdk.validateString)(properties.childManifestName));
  errors.collect(cdk.propertyValidator("filterConfiguration", CfnOriginEndpointFilterConfigurationPropertyValidator)(properties.filterConfiguration));
  errors.collect(cdk.propertyValidator("manifestName", cdk.requiredValidator)(properties.manifestName));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("manifestWindowSeconds", cdk.validateNumber)(properties.manifestWindowSeconds));
  errors.collect(cdk.propertyValidator("programDateTimeIntervalSeconds", cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
  errors.collect(cdk.propertyValidator("scteHls", CfnOriginEndpointScteHlsPropertyValidator)(properties.scteHls));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"LowLatencyHlsManifestConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ChildManifestName": cdk.stringToCloudFormation(properties.childManifestName),
    "FilterConfiguration": convertCfnOriginEndpointFilterConfigurationPropertyToCloudFormation(properties.filterConfiguration),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "ManifestWindowSeconds": cdk.numberToCloudFormation(properties.manifestWindowSeconds),
    "ProgramDateTimeIntervalSeconds": cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
    "ScteHls": convertCfnOriginEndpointScteHlsPropertyToCloudFormation(properties.scteHls),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.LowLatencyHlsManifestConfigurationProperty>();
  ret.addPropertyResult("childManifestName", "ChildManifestName", (properties.ChildManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ChildManifestName) : undefined));
  ret.addPropertyResult("filterConfiguration", "FilterConfiguration", (properties.FilterConfiguration != null ? CfnOriginEndpointFilterConfigurationPropertyFromCloudFormation(properties.FilterConfiguration) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("manifestWindowSeconds", "ManifestWindowSeconds", (properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined));
  ret.addPropertyResult("programDateTimeIntervalSeconds", "ProgramDateTimeIntervalSeconds", (properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined));
  ret.addPropertyResult("scteHls", "ScteHls", (properties.ScteHls != null ? CfnOriginEndpointScteHlsPropertyFromCloudFormation(properties.ScteHls) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsManifestConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HlsManifestConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointHlsManifestConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("childManifestName", cdk.validateString)(properties.childManifestName));
  errors.collect(cdk.propertyValidator("filterConfiguration", CfnOriginEndpointFilterConfigurationPropertyValidator)(properties.filterConfiguration));
  errors.collect(cdk.propertyValidator("manifestName", cdk.requiredValidator)(properties.manifestName));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("manifestWindowSeconds", cdk.validateNumber)(properties.manifestWindowSeconds));
  errors.collect(cdk.propertyValidator("programDateTimeIntervalSeconds", cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
  errors.collect(cdk.propertyValidator("scteHls", CfnOriginEndpointScteHlsPropertyValidator)(properties.scteHls));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"HlsManifestConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointHlsManifestConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointHlsManifestConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "ChildManifestName": cdk.stringToCloudFormation(properties.childManifestName),
    "FilterConfiguration": convertCfnOriginEndpointFilterConfigurationPropertyToCloudFormation(properties.filterConfiguration),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "ManifestWindowSeconds": cdk.numberToCloudFormation(properties.manifestWindowSeconds),
    "ProgramDateTimeIntervalSeconds": cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
    "ScteHls": convertCfnOriginEndpointScteHlsPropertyToCloudFormation(properties.scteHls),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsManifestConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsManifestConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsManifestConfigurationProperty>();
  ret.addPropertyResult("childManifestName", "ChildManifestName", (properties.ChildManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ChildManifestName) : undefined));
  ret.addPropertyResult("filterConfiguration", "FilterConfiguration", (properties.FilterConfiguration != null ? CfnOriginEndpointFilterConfigurationPropertyFromCloudFormation(properties.FilterConfiguration) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("manifestWindowSeconds", "ManifestWindowSeconds", (properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined));
  ret.addPropertyResult("programDateTimeIntervalSeconds", "ProgramDateTimeIntervalSeconds", (properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined));
  ret.addPropertyResult("scteHls", "ScteHls", (properties.ScteHls != null ? CfnOriginEndpointScteHlsPropertyFromCloudFormation(properties.ScteHls) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScteProperty`
 *
 * @param properties - the TypeScript properties of a `ScteProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointSctePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("scteFilter", cdk.listValidator(cdk.validateString))(properties.scteFilter));
  return errors.wrap("supplied properties not correct for \"ScteProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointSctePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointSctePropertyValidator(properties).assertSuccess();
  return {
    "ScteFilter": cdk.listMapper(cdk.stringToCloudFormation)(properties.scteFilter)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointSctePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.ScteProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.ScteProperty>();
  ret.addPropertyResult("scteFilter", "ScteFilter", (properties.ScteFilter != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ScteFilter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionContractConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionContractConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointEncryptionContractConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("presetSpeke20Audio", cdk.requiredValidator)(properties.presetSpeke20Audio));
  errors.collect(cdk.propertyValidator("presetSpeke20Audio", cdk.validateString)(properties.presetSpeke20Audio));
  errors.collect(cdk.propertyValidator("presetSpeke20Video", cdk.requiredValidator)(properties.presetSpeke20Video));
  errors.collect(cdk.propertyValidator("presetSpeke20Video", cdk.validateString)(properties.presetSpeke20Video));
  return errors.wrap("supplied properties not correct for \"EncryptionContractConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointEncryptionContractConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointEncryptionContractConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "PresetSpeke20Audio": cdk.stringToCloudFormation(properties.presetSpeke20Audio),
    "PresetSpeke20Video": cdk.stringToCloudFormation(properties.presetSpeke20Video)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointEncryptionContractConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.EncryptionContractConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.EncryptionContractConfigurationProperty>();
  ret.addPropertyResult("presetSpeke20Audio", "PresetSpeke20Audio", (properties.PresetSpeke20Audio != null ? cfn_parse.FromCloudFormation.getString(properties.PresetSpeke20Audio) : undefined));
  ret.addPropertyResult("presetSpeke20Video", "PresetSpeke20Video", (properties.PresetSpeke20Video != null ? cfn_parse.FromCloudFormation.getString(properties.PresetSpeke20Video) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SpekeKeyProviderProperty`
 *
 * @param properties - the TypeScript properties of a `SpekeKeyProviderProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointSpekeKeyProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("drmSystems", cdk.requiredValidator)(properties.drmSystems));
  errors.collect(cdk.propertyValidator("drmSystems", cdk.listValidator(cdk.validateString))(properties.drmSystems));
  errors.collect(cdk.propertyValidator("encryptionContractConfiguration", cdk.requiredValidator)(properties.encryptionContractConfiguration));
  errors.collect(cdk.propertyValidator("encryptionContractConfiguration", CfnOriginEndpointEncryptionContractConfigurationPropertyValidator)(properties.encryptionContractConfiguration));
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"SpekeKeyProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointSpekeKeyProviderPropertyValidator(properties).assertSuccess();
  return {
    "DrmSystems": cdk.listMapper(cdk.stringToCloudFormation)(properties.drmSystems),
    "EncryptionContractConfiguration": convertCfnOriginEndpointEncryptionContractConfigurationPropertyToCloudFormation(properties.encryptionContractConfiguration),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.SpekeKeyProviderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.SpekeKeyProviderProperty>();
  ret.addPropertyResult("drmSystems", "DrmSystems", (properties.DrmSystems != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.DrmSystems) : undefined));
  ret.addPropertyResult("encryptionContractConfiguration", "EncryptionContractConfiguration", (properties.EncryptionContractConfiguration != null ? CfnOriginEndpointEncryptionContractConfigurationPropertyFromCloudFormation(properties.EncryptionContractConfiguration) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionMethodProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionMethodProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointEncryptionMethodPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cmafEncryptionMethod", cdk.validateString)(properties.cmafEncryptionMethod));
  errors.collect(cdk.propertyValidator("tsEncryptionMethod", cdk.validateString)(properties.tsEncryptionMethod));
  return errors.wrap("supplied properties not correct for \"EncryptionMethodProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointEncryptionMethodPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointEncryptionMethodPropertyValidator(properties).assertSuccess();
  return {
    "CmafEncryptionMethod": cdk.stringToCloudFormation(properties.cmafEncryptionMethod),
    "TsEncryptionMethod": cdk.stringToCloudFormation(properties.tsEncryptionMethod)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointEncryptionMethodPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.EncryptionMethodProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.EncryptionMethodProperty>();
  ret.addPropertyResult("cmafEncryptionMethod", "CmafEncryptionMethod", (properties.CmafEncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.CmafEncryptionMethod) : undefined));
  ret.addPropertyResult("tsEncryptionMethod", "TsEncryptionMethod", (properties.TsEncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.TsEncryptionMethod) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("encryptionMethod", cdk.requiredValidator)(properties.encryptionMethod));
  errors.collect(cdk.propertyValidator("encryptionMethod", CfnOriginEndpointEncryptionMethodPropertyValidator)(properties.encryptionMethod));
  errors.collect(cdk.propertyValidator("keyRotationIntervalSeconds", cdk.validateNumber)(properties.keyRotationIntervalSeconds));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnOriginEndpointSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"EncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "EncryptionMethod": convertCfnOriginEndpointEncryptionMethodPropertyToCloudFormation(properties.encryptionMethod),
    "KeyRotationIntervalSeconds": cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
    "SpekeKeyProvider": convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.EncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.EncryptionProperty>();
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("encryptionMethod", "EncryptionMethod", (properties.EncryptionMethod != null ? CfnOriginEndpointEncryptionMethodPropertyFromCloudFormation(properties.EncryptionMethod) : undefined));
  ret.addPropertyResult("keyRotationIntervalSeconds", "KeyRotationIntervalSeconds", (properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined));
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SegmentProperty`
 *
 * @param properties - the TypeScript properties of a `SegmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointSegmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryption", CfnOriginEndpointEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("includeIframeOnlyStreams", cdk.validateBoolean)(properties.includeIframeOnlyStreams));
  errors.collect(cdk.propertyValidator("scte", CfnOriginEndpointSctePropertyValidator)(properties.scte));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("segmentName", cdk.validateString)(properties.segmentName));
  errors.collect(cdk.propertyValidator("tsIncludeDvbSubtitles", cdk.validateBoolean)(properties.tsIncludeDvbSubtitles));
  errors.collect(cdk.propertyValidator("tsUseAudioRenditionGroup", cdk.validateBoolean)(properties.tsUseAudioRenditionGroup));
  return errors.wrap("supplied properties not correct for \"SegmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointSegmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointSegmentPropertyValidator(properties).assertSuccess();
  return {
    "Encryption": convertCfnOriginEndpointEncryptionPropertyToCloudFormation(properties.encryption),
    "IncludeIframeOnlyStreams": cdk.booleanToCloudFormation(properties.includeIframeOnlyStreams),
    "Scte": convertCfnOriginEndpointSctePropertyToCloudFormation(properties.scte),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "SegmentName": cdk.stringToCloudFormation(properties.segmentName),
    "TsIncludeDvbSubtitles": cdk.booleanToCloudFormation(properties.tsIncludeDvbSubtitles),
    "TsUseAudioRenditionGroup": cdk.booleanToCloudFormation(properties.tsUseAudioRenditionGroup)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointSegmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.SegmentProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.SegmentProperty>();
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnOriginEndpointEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("includeIframeOnlyStreams", "IncludeIframeOnlyStreams", (properties.IncludeIframeOnlyStreams != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStreams) : undefined));
  ret.addPropertyResult("scte", "Scte", (properties.Scte != null ? CfnOriginEndpointSctePropertyFromCloudFormation(properties.Scte) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("segmentName", "SegmentName", (properties.SegmentName != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentName) : undefined));
  ret.addPropertyResult("tsIncludeDvbSubtitles", "TsIncludeDvbSubtitles", (properties.TsIncludeDvbSubtitles != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TsIncludeDvbSubtitles) : undefined));
  ret.addPropertyResult("tsUseAudioRenditionGroup", "TsUseAudioRenditionGroup", (properties.TsUseAudioRenditionGroup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TsUseAudioRenditionGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnOriginEndpointProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginEndpointProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelGroupName", cdk.validateString)(properties.channelGroupName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("containerType", cdk.requiredValidator)(properties.containerType));
  errors.collect(cdk.propertyValidator("containerType", cdk.validateString)(properties.containerType));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("hlsManifests", cdk.listValidator(CfnOriginEndpointHlsManifestConfigurationPropertyValidator))(properties.hlsManifests));
  errors.collect(cdk.propertyValidator("lowLatencyHlsManifests", cdk.listValidator(CfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyValidator))(properties.lowLatencyHlsManifests));
  errors.collect(cdk.propertyValidator("originEndpointName", cdk.validateString)(properties.originEndpointName));
  errors.collect(cdk.propertyValidator("segment", CfnOriginEndpointSegmentPropertyValidator)(properties.segment));
  errors.collect(cdk.propertyValidator("startoverWindowSeconds", cdk.validateNumber)(properties.startoverWindowSeconds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnOriginEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointPropsValidator(properties).assertSuccess();
  return {
    "ChannelGroupName": cdk.stringToCloudFormation(properties.channelGroupName),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "ContainerType": cdk.stringToCloudFormation(properties.containerType),
    "Description": cdk.stringToCloudFormation(properties.description),
    "HlsManifests": cdk.listMapper(convertCfnOriginEndpointHlsManifestConfigurationPropertyToCloudFormation)(properties.hlsManifests),
    "LowLatencyHlsManifests": cdk.listMapper(convertCfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyToCloudFormation)(properties.lowLatencyHlsManifests),
    "OriginEndpointName": cdk.stringToCloudFormation(properties.originEndpointName),
    "Segment": convertCfnOriginEndpointSegmentPropertyToCloudFormation(properties.segment),
    "StartoverWindowSeconds": cdk.numberToCloudFormation(properties.startoverWindowSeconds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpointProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpointProps>();
  ret.addPropertyResult("channelGroupName", "ChannelGroupName", (properties.ChannelGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelGroupName) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("containerType", "ContainerType", (properties.ContainerType != null ? cfn_parse.FromCloudFormation.getString(properties.ContainerType) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("hlsManifests", "HlsManifests", (properties.HlsManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnOriginEndpointHlsManifestConfigurationPropertyFromCloudFormation)(properties.HlsManifests) : undefined));
  ret.addPropertyResult("lowLatencyHlsManifests", "LowLatencyHlsManifests", (properties.LowLatencyHlsManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnOriginEndpointLowLatencyHlsManifestConfigurationPropertyFromCloudFormation)(properties.LowLatencyHlsManifests) : undefined));
  ret.addPropertyResult("originEndpointName", "OriginEndpointName", (properties.OriginEndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.OriginEndpointName) : undefined));
  ret.addPropertyResult("segment", "Segment", (properties.Segment != null ? CfnOriginEndpointSegmentPropertyFromCloudFormation(properties.Segment) : undefined));
  ret.addPropertyResult("startoverWindowSeconds", "StartoverWindowSeconds", (properties.StartoverWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartoverWindowSeconds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Specifies the configuration parameters of a policy associated with a MediaPackage V2 origin endpoint.
 *
 * @cloudformationResource AWS::MediaPackageV2::OriginEndpointPolicy
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpointpolicy.html
 */
export class CfnOriginEndpointPolicy extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackageV2::OriginEndpointPolicy";

  /**
   * Build a CfnOriginEndpointPolicy from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnOriginEndpointPolicy {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnOriginEndpointPolicyPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnOriginEndpointPolicy(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The name of the channel group associated with the origin endpoint policy.
   */
  public channelGroupName?: string;

  /**
   * The channel name associated with the origin endpoint policy.
   */
  public channelName?: string;

  /**
   * The name of the origin endpoint associated with the origin endpoint policy.
   */
  public originEndpointName?: string;

  /**
   * The policy associated with the origin endpoint.
   */
  public policy: any | cdk.IResolvable;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnOriginEndpointPolicyProps) {
    super(scope, id, {
      "type": CfnOriginEndpointPolicy.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "policy", this);

    this.channelGroupName = props.channelGroupName;
    this.channelName = props.channelName;
    this.originEndpointName = props.originEndpointName;
    this.policy = props.policy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "channelGroupName": this.channelGroupName,
      "channelName": this.channelName,
      "originEndpointName": this.originEndpointName,
      "policy": this.policy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnOriginEndpointPolicy.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnOriginEndpointPolicyPropsToCloudFormation(props);
  }
}

/**
 * Properties for defining a `CfnOriginEndpointPolicy`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpointpolicy.html
 */
export interface CfnOriginEndpointPolicyProps {
  /**
   * The name of the channel group associated with the origin endpoint policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpointpolicy.html#cfn-mediapackagev2-originendpointpolicy-channelgroupname
   */
  readonly channelGroupName?: string;

  /**
   * The channel name associated with the origin endpoint policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpointpolicy.html#cfn-mediapackagev2-originendpointpolicy-channelname
   */
  readonly channelName?: string;

  /**
   * The name of the origin endpoint associated with the origin endpoint policy.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpointpolicy.html#cfn-mediapackagev2-originendpointpolicy-originendpointname
   */
  readonly originEndpointName?: string;

  /**
   * The policy associated with the origin endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackagev2-originendpointpolicy.html#cfn-mediapackagev2-originendpointpolicy-policy
   */
  readonly policy: any | cdk.IResolvable;
}

/**
 * Determine whether the given properties match those of a `CfnOriginEndpointPolicyProps`
 *
 * @param properties - the TypeScript properties of a `CfnOriginEndpointPolicyProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointPolicyPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("channelGroupName", cdk.validateString)(properties.channelGroupName));
  errors.collect(cdk.propertyValidator("channelName", cdk.validateString)(properties.channelName));
  errors.collect(cdk.propertyValidator("originEndpointName", cdk.validateString)(properties.originEndpointName));
  errors.collect(cdk.propertyValidator("policy", cdk.requiredValidator)(properties.policy));
  errors.collect(cdk.propertyValidator("policy", cdk.validateObject)(properties.policy));
  return errors.wrap("supplied properties not correct for \"CfnOriginEndpointPolicyProps\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointPolicyPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointPolicyPropsValidator(properties).assertSuccess();
  return {
    "ChannelGroupName": cdk.stringToCloudFormation(properties.channelGroupName),
    "ChannelName": cdk.stringToCloudFormation(properties.channelName),
    "OriginEndpointName": cdk.stringToCloudFormation(properties.originEndpointName),
    "Policy": cdk.objectToCloudFormation(properties.policy)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointPolicyPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpointPolicyProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpointPolicyProps>();
  ret.addPropertyResult("channelGroupName", "ChannelGroupName", (properties.ChannelGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelGroupName) : undefined));
  ret.addPropertyResult("channelName", "ChannelName", (properties.ChannelName != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelName) : undefined));
  ret.addPropertyResult("originEndpointName", "OriginEndpointName", (properties.OriginEndpointName != null ? cfn_parse.FromCloudFormation.getString(properties.OriginEndpointName) : undefined));
  ret.addPropertyResult("policy", "Policy", (properties.Policy != null ? cfn_parse.FromCloudFormation.getAny(properties.Policy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}