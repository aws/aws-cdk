/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * Creates an asset to ingest VOD content.
 *
 * After it's created, the asset starts ingesting content and generates playback URLs for the packaging configurations associated with it. When ingest is complete, downstream devices use the appropriate URL to request VOD content from AWS Elemental MediaPackage .
 *
 * @cloudformationResource AWS::MediaPackage::Asset
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html
 */
export class CfnAsset extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackage::Asset";

  /**
   * Build a CfnAsset from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnAsset {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnAssetPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnAsset(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the asset. You can get this from the response to any request to the asset.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The date and time that the asset was initially submitted for ingest.
   *
   * @cloudformationAttribute CreatedAt
   */
  public readonly attrCreatedAt: string;

  /**
   * List of playback endpoints that are available for this asset.
   */
  public egressEndpoints?: Array<CfnAsset.EgressEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Unique identifier that you assign to the asset.
   */
  public id: string;

  /**
   * The ID of the packaging group associated with this asset.
   */
  public packagingGroupId: string;

  /**
   * Unique identifier for this asset, as it's configured in the key provider service.
   */
  public resourceId?: string;

  /**
   * The ARN for the source content in Amazon S3.
   */
  public sourceArn: string;

  /**
   * The ARN for the IAM role that provides AWS Elemental MediaPackage access to the Amazon S3 bucket where the source content is stored.
   */
  public sourceRoleArn: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the asset.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnAssetProps) {
    super(scope, id, {
      "type": CfnAsset.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "id", this);
    cdk.requireProperty(props, "packagingGroupId", this);
    cdk.requireProperty(props, "sourceArn", this);
    cdk.requireProperty(props, "sourceRoleArn", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCreatedAt = cdk.Token.asString(this.getAtt("CreatedAt", cdk.ResolutionTypeHint.STRING));
    this.egressEndpoints = props.egressEndpoints;
    this.id = props.id;
    this.packagingGroupId = props.packagingGroupId;
    this.resourceId = props.resourceId;
    this.sourceArn = props.sourceArn;
    this.sourceRoleArn = props.sourceRoleArn;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::Asset", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "egressEndpoints": this.egressEndpoints,
      "id": this.id,
      "packagingGroupId": this.packagingGroupId,
      "resourceId": this.resourceId,
      "sourceArn": this.sourceArn,
      "sourceRoleArn": this.sourceRoleArn,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnAsset.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnAssetPropsToCloudFormation(props);
  }
}

export namespace CfnAsset {
  /**
   * The playback endpoint for a packaging configuration on an asset.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html
   */
  export interface EgressEndpointProperty {
    /**
     * The ID of a packaging configuration that's applied to this asset.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html#cfn-mediapackage-asset-egressendpoint-packagingconfigurationid
     */
    readonly packagingConfigurationId: string;

    /**
     * The URL that's used to request content from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-asset-egressendpoint.html#cfn-mediapackage-asset-egressendpoint-url
     */
    readonly url: string;
  }
}

/**
 * Properties for defining a `CfnAsset`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html
 */
export interface CfnAssetProps {
  /**
   * List of playback endpoints that are available for this asset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-egressendpoints
   */
  readonly egressEndpoints?: Array<CfnAsset.EgressEndpointProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Unique identifier that you assign to the asset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-id
   */
  readonly id: string;

  /**
   * The ID of the packaging group associated with this asset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-packaginggroupid
   */
  readonly packagingGroupId: string;

  /**
   * Unique identifier for this asset, as it's configured in the key provider service.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-resourceid
   */
  readonly resourceId?: string;

  /**
   * The ARN for the source content in Amazon S3.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcearn
   */
  readonly sourceArn: string;

  /**
   * The ARN for the IAM role that provides AWS Elemental MediaPackage access to the Amazon S3 bucket where the source content is stored.
   *
   * Valid format: arn:aws:iam::{accountID}:role/{name}
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-sourcerolearn
   */
  readonly sourceRoleArn: string;

  /**
   * The tags to assign to the asset.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-asset.html#cfn-mediapackage-asset-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `EgressEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `EgressEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetEgressEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("packagingConfigurationId", cdk.requiredValidator)(properties.packagingConfigurationId));
  errors.collect(cdk.propertyValidator("packagingConfigurationId", cdk.validateString)(properties.packagingConfigurationId));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"EgressEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnAssetEgressEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetEgressEndpointPropertyValidator(properties).assertSuccess();
  return {
    "PackagingConfigurationId": cdk.stringToCloudFormation(properties.packagingConfigurationId),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnAssetEgressEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAsset.EgressEndpointProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAsset.EgressEndpointProperty>();
  ret.addPropertyResult("packagingConfigurationId", "PackagingConfigurationId", (properties.PackagingConfigurationId != null ? cfn_parse.FromCloudFormation.getString(properties.PackagingConfigurationId) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnAssetProps`
 *
 * @param properties - the TypeScript properties of a `CfnAssetProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnAssetPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("egressEndpoints", cdk.listValidator(CfnAssetEgressEndpointPropertyValidator))(properties.egressEndpoints));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("packagingGroupId", cdk.requiredValidator)(properties.packagingGroupId));
  errors.collect(cdk.propertyValidator("packagingGroupId", cdk.validateString)(properties.packagingGroupId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.requiredValidator)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceArn", cdk.validateString)(properties.sourceArn));
  errors.collect(cdk.propertyValidator("sourceRoleArn", cdk.requiredValidator)(properties.sourceRoleArn));
  errors.collect(cdk.propertyValidator("sourceRoleArn", cdk.validateString)(properties.sourceRoleArn));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnAssetProps\"");
}

// @ts-ignore TS6133
function convertCfnAssetPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnAssetPropsValidator(properties).assertSuccess();
  return {
    "EgressEndpoints": cdk.listMapper(convertCfnAssetEgressEndpointPropertyToCloudFormation)(properties.egressEndpoints),
    "Id": cdk.stringToCloudFormation(properties.id),
    "PackagingGroupId": cdk.stringToCloudFormation(properties.packagingGroupId),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "SourceArn": cdk.stringToCloudFormation(properties.sourceArn),
    "SourceRoleArn": cdk.stringToCloudFormation(properties.sourceRoleArn),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnAssetPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnAssetProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnAssetProps>();
  ret.addPropertyResult("egressEndpoints", "EgressEndpoints", (properties.EgressEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnAssetEgressEndpointPropertyFromCloudFormation)(properties.EgressEndpoints) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("packagingGroupId", "PackagingGroupId", (properties.PackagingGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.PackagingGroupId) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("sourceArn", "SourceArn", (properties.SourceArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceArn) : undefined));
  ret.addPropertyResult("sourceRoleArn", "SourceRoleArn", (properties.SourceRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceRoleArn) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a channel to receive content.
 *
 * After it's created, a channel provides static input URLs. These URLs remain the same throughout the lifetime of the channel, regardless of any failures or upgrades that might occur. Use these URLs to configure the outputs of your upstream encoder.
 *
 * @cloudformationResource AWS::MediaPackage::Channel
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html
 */
export class CfnChannel extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackage::Channel";

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
   * The channel's unique system-generated resource name, based on the AWS record.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Any descriptive information that you want to add to the channel for future identification purposes.
   */
  public description?: string;

  /**
   * Configures egress access logs.
   */
  public egressAccessLogs?: cdk.IResolvable | CfnChannel.LogConfigurationProperty;

  /**
   * The input URL where the source stream should be sent.
   */
  public hlsIngest?: CfnChannel.HlsIngestProperty | cdk.IResolvable;

  /**
   * Unique identifier that you assign to the channel.
   */
  public id: string;

  /**
   * Configures ingress access logs.
   */
  public ingressAccessLogs?: cdk.IResolvable | CfnChannel.LogConfigurationProperty;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the channel.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnChannelProps) {
    super(scope, id, {
      "type": CfnChannel.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "id", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.description = props.description;
    this.egressAccessLogs = props.egressAccessLogs;
    this.hlsIngest = props.hlsIngest;
    this.id = props.id;
    this.ingressAccessLogs = props.ingressAccessLogs;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::Channel", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "description": this.description,
      "egressAccessLogs": this.egressAccessLogs,
      "hlsIngest": this.hlsIngest,
      "id": this.id,
      "ingressAccessLogs": this.ingressAccessLogs,
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
   * The access log configuration parameters for your channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-logconfiguration.html
   */
  export interface LogConfigurationProperty {
    /**
     * Sets a custom Amazon CloudWatch log group name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-logconfiguration.html#cfn-mediapackage-channel-logconfiguration-loggroupname
     */
    readonly logGroupName?: string;
  }

  /**
   * HLS ingest configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-hlsingest.html
   */
  export interface HlsIngestProperty {
    /**
     * The input URL where the source stream should be sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-hlsingest.html#cfn-mediapackage-channel-hlsingest-ingestendpoints
     */
    readonly ingestEndpoints?: Array<CfnChannel.IngestEndpointProperty | cdk.IResolvable> | cdk.IResolvable;
  }

  /**
   * An endpoint for ingesting source content for a channel.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html
   */
  export interface IngestEndpointProperty {
    /**
     * The endpoint identifier.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-id
     */
    readonly id: string;

    /**
     * The system-generated password for WebDAV input authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-password
     */
    readonly password: string;

    /**
     * The input URL where the source stream should be sent.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-url
     */
    readonly url: string;

    /**
     * The system-generated username for WebDAV input authentication.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-channel-ingestendpoint.html#cfn-mediapackage-channel-ingestendpoint-username
     */
    readonly username: string;
  }
}

/**
 * Properties for defining a `CfnChannel`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html
 */
export interface CfnChannelProps {
  /**
   * Any descriptive information that you want to add to the channel for future identification purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-description
   */
  readonly description?: string;

  /**
   * Configures egress access logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-egressaccesslogs
   */
  readonly egressAccessLogs?: cdk.IResolvable | CfnChannel.LogConfigurationProperty;

  /**
   * The input URL where the source stream should be sent.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-hlsingest
   */
  readonly hlsIngest?: CfnChannel.HlsIngestProperty | cdk.IResolvable;

  /**
   * Unique identifier that you assign to the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-id
   */
  readonly id: string;

  /**
   * Configures ingress access logs.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-ingressaccesslogs
   */
  readonly ingressAccessLogs?: cdk.IResolvable | CfnChannel.LogConfigurationProperty;

  /**
   * The tags to assign to the channel.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-channel.html#cfn-mediapackage-channel-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  return errors.wrap("supplied properties not correct for \"LogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName)
  };
}

// @ts-ignore TS6133
function CfnChannelLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnChannel.LogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.LogConfigurationProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
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
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("password", cdk.requiredValidator)(properties.password));
  errors.collect(cdk.propertyValidator("password", cdk.validateString)(properties.password));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  errors.collect(cdk.propertyValidator("username", cdk.requiredValidator)(properties.username));
  errors.collect(cdk.propertyValidator("username", cdk.validateString)(properties.username));
  return errors.wrap("supplied properties not correct for \"IngestEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelIngestEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelIngestEndpointPropertyValidator(properties).assertSuccess();
  return {
    "Id": cdk.stringToCloudFormation(properties.id),
    "Password": cdk.stringToCloudFormation(properties.password),
    "Url": cdk.stringToCloudFormation(properties.url),
    "Username": cdk.stringToCloudFormation(properties.username)
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
  ret.addPropertyResult("password", "Password", (properties.Password != null ? cfn_parse.FromCloudFormation.getString(properties.Password) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addPropertyResult("username", "Username", (properties.Username != null ? cfn_parse.FromCloudFormation.getString(properties.Username) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsIngestProperty`
 *
 * @param properties - the TypeScript properties of a `HlsIngestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnChannelHlsIngestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("ingestEndpoints", cdk.listValidator(CfnChannelIngestEndpointPropertyValidator))(properties.ingestEndpoints));
  return errors.wrap("supplied properties not correct for \"HlsIngestProperty\"");
}

// @ts-ignore TS6133
function convertCfnChannelHlsIngestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelHlsIngestPropertyValidator(properties).assertSuccess();
  return {
    "ingestEndpoints": cdk.listMapper(convertCfnChannelIngestEndpointPropertyToCloudFormation)(properties.ingestEndpoints)
  };
}

// @ts-ignore TS6133
function CfnChannelHlsIngestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnChannel.HlsIngestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnChannel.HlsIngestProperty>();
  ret.addPropertyResult("ingestEndpoints", "ingestEndpoints", (properties.ingestEndpoints != null ? cfn_parse.FromCloudFormation.getArray(CfnChannelIngestEndpointPropertyFromCloudFormation)(properties.ingestEndpoints) : undefined));
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
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("egressAccessLogs", CfnChannelLogConfigurationPropertyValidator)(properties.egressAccessLogs));
  errors.collect(cdk.propertyValidator("hlsIngest", CfnChannelHlsIngestPropertyValidator)(properties.hlsIngest));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("ingressAccessLogs", CfnChannelLogConfigurationPropertyValidator)(properties.ingressAccessLogs));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnChannelProps\"");
}

// @ts-ignore TS6133
function convertCfnChannelPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnChannelPropsValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "EgressAccessLogs": convertCfnChannelLogConfigurationPropertyToCloudFormation(properties.egressAccessLogs),
    "HlsIngest": convertCfnChannelHlsIngestPropertyToCloudFormation(properties.hlsIngest),
    "Id": cdk.stringToCloudFormation(properties.id),
    "IngressAccessLogs": convertCfnChannelLogConfigurationPropertyToCloudFormation(properties.ingressAccessLogs),
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
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("egressAccessLogs", "EgressAccessLogs", (properties.EgressAccessLogs != null ? CfnChannelLogConfigurationPropertyFromCloudFormation(properties.EgressAccessLogs) : undefined));
  ret.addPropertyResult("hlsIngest", "HlsIngest", (properties.HlsIngest != null ? CfnChannelHlsIngestPropertyFromCloudFormation(properties.HlsIngest) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("ingressAccessLogs", "IngressAccessLogs", (properties.IngressAccessLogs != null ? CfnChannelLogConfigurationPropertyFromCloudFormation(properties.IngressAccessLogs) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Create an endpoint on an AWS Elemental MediaPackage channel.
 *
 * An endpoint represents a single delivery point of a channel, and defines content output handling through various components, such as packaging protocols, DRM and encryption integration, and more.
 *
 * After it's created, an endpoint provides a fixed public URL. This URL remains the same throughout the lifetime of the endpoint, regardless of any failures or upgrades that might occur. Integrate the URL with a downstream CDN (such as Amazon CloudFront) or playback device.
 *
 * @cloudformationResource AWS::MediaPackage::OriginEndpoint
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html
 */
export class CfnOriginEndpoint extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackage::OriginEndpoint";

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
   * The endpoint's unique system-generated resource name, based on the AWS record.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * URL for the key provider’s key retrieval API endpoint. Must start with https://.
   *
   * @cloudformationAttribute Url
   */
  public readonly attrUrl: string;

  /**
   * Parameters for CDN authorization.
   */
  public authorization?: CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable;

  /**
   * The ID of the channel associated with this endpoint.
   */
  public channelId: string;

  /**
   * Parameters for Common Media Application Format (CMAF) packaging.
   */
  public cmafPackage?: CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable;

  /**
   * Parameters for DASH packaging.
   */
  public dashPackage?: CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable;

  /**
   * Any descriptive information that you want to add to the endpoint for future identification purposes.
   */
  public description?: string;

  /**
   * Parameters for Apple HLS packaging.
   */
  public hlsPackage?: CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable;

  /**
   * The manifest ID is required and must be unique within the OriginEndpoint.
   */
  public id: string;

  /**
   * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint.
   */
  public manifestName?: string;

  /**
   * Parameters for Microsoft Smooth Streaming packaging.
   */
  public mssPackage?: cdk.IResolvable | CfnOriginEndpoint.MssPackageProperty;

  /**
   * Controls video origination from this endpoint.
   */
  public origination?: string;

  /**
   * Maximum duration (seconds) of content to retain for startover playback.
   */
  public startoverWindowSeconds?: number;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the endpoint.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Minimum duration (seconds) of delay to enforce on the playback of live content.
   */
  public timeDelaySeconds?: number;

  /**
   * The IP addresses that can access this endpoint.
   */
  public whitelist?: Array<string>;

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

    cdk.requireProperty(props, "channelId", this);
    cdk.requireProperty(props, "id", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrUrl = cdk.Token.asString(this.getAtt("Url", cdk.ResolutionTypeHint.STRING));
    this.authorization = props.authorization;
    this.channelId = props.channelId;
    this.cmafPackage = props.cmafPackage;
    this.dashPackage = props.dashPackage;
    this.description = props.description;
    this.hlsPackage = props.hlsPackage;
    this.id = props.id;
    this.manifestName = props.manifestName;
    this.mssPackage = props.mssPackage;
    this.origination = props.origination;
    this.startoverWindowSeconds = props.startoverWindowSeconds;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::OriginEndpoint", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeDelaySeconds = props.timeDelaySeconds;
    this.whitelist = props.whitelist;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorization": this.authorization,
      "channelId": this.channelId,
      "cmafPackage": this.cmafPackage,
      "dashPackage": this.dashPackage,
      "description": this.description,
      "hlsPackage": this.hlsPackage,
      "id": this.id,
      "manifestName": this.manifestName,
      "mssPackage": this.mssPackage,
      "origination": this.origination,
      "startoverWindowSeconds": this.startoverWindowSeconds,
      "tags": this.tags.renderTags(),
      "timeDelaySeconds": this.timeDelaySeconds,
      "whitelist": this.whitelist
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
   * Parameters for Microsoft Smooth Streaming packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html
   */
  export interface MssPackageProperty {
    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-encryption
     */
    readonly encryption?: cdk.IResolvable | CfnOriginEndpoint.MssEncryptionProperty;

    /**
     * Time window (in seconds) contained in each manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-manifestwindowseconds
     */
    readonly manifestWindowSeconds?: number;

    /**
     * Duration (in seconds) of each fragment.
     *
     * Actual fragments are rounded to the nearest multiple of the source fragment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-msspackage.html#cfn-mediapackage-originendpoint-msspackage-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnOriginEndpoint.StreamSelectionProperty;
  }

  /**
   * Limitations for outputs from the endpoint, based on the video bitrate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html
   */
  export interface StreamSelectionProperty {
    /**
     * The upper limit of the bitrates that this endpoint serves.
     *
     * If the video track exceeds this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 2147483647 bits per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html#cfn-mediapackage-originendpoint-streamselection-maxvideobitspersecond
     */
    readonly maxVideoBitsPerSecond?: number;

    /**
     * The lower limit of the bitrates that this endpoint serves.
     *
     * If the video track is below this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 0 bits per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html#cfn-mediapackage-originendpoint-streamselection-minvideobitspersecond
     */
    readonly minVideoBitsPerSecond?: number;

    /**
     * Order in which the different video bitrates are presented to the player.
     *
     * Valid values: `ORIGINAL` , `VIDEO_BITRATE_ASCENDING` , `VIDEO_BITRATE_DESCENDING` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-streamselection.html#cfn-mediapackage-originendpoint-streamselection-streamorder
     */
    readonly streamOrder?: string;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-mssencryption.html
   */
  export interface MssEncryptionProperty {
    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-mssencryption.html#cfn-mediapackage-originendpoint-mssencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnOriginEndpoint.SpekeKeyProviderProperty;
  }

  /**
   * Key provider settings for DRM.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html
   */
  export interface SpekeKeyProviderProperty {
    /**
     * The Amazon Resource Name (ARN) for the certificate that you imported to AWS Certificate Manager to add content key encryption to this endpoint.
     *
     * For this feature to work, your DRM key provider must support content key encryption.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-certificatearn
     */
    readonly certificateArn?: string;

    /**
     * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines which content keys are used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-encryptioncontractconfiguration
     */
    readonly encryptionContractConfiguration?: CfnOriginEndpoint.EncryptionContractConfigurationProperty | cdk.IResolvable;

    /**
     * Unique identifier for this endpoint, as it is configured in the key provider service.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-resourceid
     */
    readonly resourceId: string;

    /**
     * The ARN for the IAM role that's granted by the key provider to provide access to the key provider API.
     *
     * This role must have a trust policy that allows AWS Elemental MediaPackage to assume the role, and it must have a sufficient permissions policy to allow access to the specific key retrieval URL. Valid format: arn:aws:iam::{accountID}:role/{name}
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-rolearn
     */
    readonly roleArn: string;

    /**
     * List of unique identifiers for the DRM systems to use, as defined in the CPIX specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-systemids
     */
    readonly systemIds: Array<string>;

    /**
     * URL for the key provider’s key retrieval API endpoint.
     *
     * Must start with https://.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-spekekeyprovider.html#cfn-mediapackage-originendpoint-spekekeyprovider-url
     */
    readonly url: string;
  }

  /**
   * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines the content keys used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use. For more information about these presets, see [SPEKE Version 2.0 Presets](https://docs.aws.amazon.com/mediapackage/latest/ug/drm-content-speke-v2-presets.html) .
   *
   * Note the following considerations when using `encryptionContractConfiguration` :
   *
   * - You can use `encryptionContractConfiguration` for DASH endpoints that use SPEKE Version 2.0. SPEKE Version 2.0 relies on the CPIX Version 2.3 specification.
   * - You cannot combine an `UNENCRYPTED` preset with `UNENCRYPTED` or `SHARED` presets across `presetSpeke20Audio` and `presetSpeke20Video` .
   * - When you use a `SHARED` preset, you must use it for both `presetSpeke20Audio` and `presetSpeke20Video` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-encryptioncontractconfiguration.html
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-encryptioncontractconfiguration.html#cfn-mediapackage-originendpoint-encryptioncontractconfiguration-presetspeke20audio
     */
    readonly presetSpeke20Audio: string;

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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-encryptioncontractconfiguration.html#cfn-mediapackage-originendpoint-encryptioncontractconfiguration-presetspeke20video
     */
    readonly presetSpeke20Video: string;
  }

  /**
   * Parameters for enabling CDN authorization on the endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html
   */
  export interface AuthorizationProperty {
    /**
     * The Amazon Resource Name (ARN) for the secret in AWS Secrets Manager that your Content Delivery Network (CDN) uses for authorization to access your endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html#cfn-mediapackage-originendpoint-authorization-cdnidentifiersecret
     */
    readonly cdnIdentifierSecret: string;

    /**
     * The Amazon Resource Name (ARN) for the IAM role that allows AWS Elemental MediaPackage to communicate with AWS Secrets Manager .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-authorization.html#cfn-mediapackage-originendpoint-authorization-secretsrolearn
     */
    readonly secretsRoleArn: string;
  }

  /**
   * Parameters for Common Media Application Format (CMAF) packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html
   */
  export interface CmafPackageProperty {
    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-encryption
     */
    readonly encryption?: CfnOriginEndpoint.CmafEncryptionProperty | cdk.IResolvable;

    /**
     * A list of HLS manifest configurations that are available from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-hlsmanifests
     */
    readonly hlsManifests?: Array<CfnOriginEndpoint.HlsManifestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Duration (in seconds) of each segment.
     *
     * Actual segments are rounded to the nearest multiple of the source segment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * An optional custom string that is prepended to the name of each segment.
     *
     * If not specified, the segment prefix defaults to the ChannelId.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-segmentprefix
     */
    readonly segmentPrefix?: string;

    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafpackage.html#cfn-mediapackage-originendpoint-cmafpackage-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnOriginEndpoint.StreamSelectionProperty;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html
   */
  export interface CmafEncryptionProperty {
    /**
     * An optional 128-bit, 16-byte hex value represented by a 32-character string, used in conjunction with the key for encrypting blocks.
     *
     * If you don't specify a value, then AWS Elemental MediaPackage creates the constant initialization vector (IV).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * The encryption method to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-encryptionmethod
     */
    readonly encryptionMethod?: string;

    /**
     * Number of seconds before AWS Elemental MediaPackage rotates to a new key.
     *
     * By default, rotation is set to 60 seconds. Set to `0` to disable key rotation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-keyrotationintervalseconds
     */
    readonly keyRotationIntervalSeconds?: number;

    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-cmafencryption.html#cfn-mediapackage-originendpoint-cmafencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnOriginEndpoint.SpekeKeyProviderProperty;
  }

  /**
   * An HTTP Live Streaming (HLS) manifest configuration on a CMAF endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html
   */
  export interface HlsManifestProperty {
    /**
     * Controls how ad markers are included in the packaged endpoint.
     *
     * Valid values:
     *
     * - `NONE` - Omits all SCTE-35 ad markers from the output.
     * - `PASSTHROUGH` - Creates a copy in the output of the SCTE-35 ad markers (comments) taken directly from the input manifest.
     * - `SCTE35_ENHANCED` - Generates ad markers and blackout tags in the output based on the SCTE-35 messages from the input manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-admarkers
     */
    readonly adMarkers?: string;

    /**
     * The flags on SCTE-35 segmentation descriptors that have to be present for AWS Elemental MediaPackage to insert ad markers in the output manifest.
     *
     * For information about SCTE-35 in AWS Elemental MediaPackage , see [SCTE-35 Message Options in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/scte.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-adsondeliveryrestrictions
     */
    readonly adsOnDeliveryRestrictions?: string;

    /**
     * Specifies the SCTE-35 message types that AWS Elemental MediaPackage treats as ad markers in the output manifest.
     *
     * Valid values:
     *
     * - `BREAK`
     * - `DISTRIBUTOR_ADVERTISEMENT`
     * - `DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY`
     * - `DISTRIBUTOR_PLACEMENT_OPPORTUNITY`
     * - `PROVIDER_ADVERTISEMENT`
     * - `PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY`
     * - `PROVIDER_PLACEMENT_OPPORTUNITY`
     * - `SPLICE_INSERT`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-adtriggers
     */
    readonly adTriggers?: Array<string>;

    /**
     * The manifest ID is required and must be unique within the OriginEndpoint.
     *
     * The ID can't be changed after the endpoint is created.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-id
     */
    readonly id: string;

    /**
     * Applies to stream sets with a single video track only.
     *
     * When true, the stream set includes an additional I-frame only stream, along with the other tracks. If false, this extra stream is not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-includeiframeonlystream
     */
    readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;

    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint.
     *
     * The manifestName on the HLSManifest object overrides the manifestName that you provided on the originEndpoint object.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-manifestname
     */
    readonly manifestName?: string;

    /**
     * When specified as either `event` or `vod` , a corresponding `EXT-X-PLAYLIST-TYPE` entry is included in the media playlist.
     *
     * Indicates if the playlist is live-to-VOD content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-playlisttype
     */
    readonly playlistType?: string;

    /**
     * Time window (in seconds) contained in each parent manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-playlistwindowseconds
     */
    readonly playlistWindowSeconds?: number;

    /**
     * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify.
     *
     * Additionally, ID3Timed metadata messages are generated every 5 seconds starting when the content was ingested.
     *
     * Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     *
     * Omit this attribute or enter `0` to indicate that the `EXT-X-PROGRAM-DATE-TIME` tags are not included in the manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-programdatetimeintervalseconds
     */
    readonly programDateTimeIntervalSeconds?: number;

    /**
     * The URL that's used to request this manifest from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsmanifest.html#cfn-mediapackage-originendpoint-hlsmanifest-url
     */
    readonly url?: string;
  }

  /**
   * Parameters for Apple HLS packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html
   */
  export interface HlsPackageProperty {
    /**
     * Controls how ad markers are included in the packaged endpoint.
     *
     * Valid values:
     *
     * - `NONE` - Omits all SCTE-35 ad markers from the output.
     * - `PASSTHROUGH` - Creates a copy in the output of the SCTE-35 ad markers (comments) taken directly from the input manifest.
     * - `SCTE35_ENHANCED` - Generates ad markers and blackout tags in the output based on the SCTE-35 messages from the input manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-admarkers
     */
    readonly adMarkers?: string;

    /**
     * The flags on SCTE-35 segmentation descriptors that have to be present for AWS Elemental MediaPackage to insert ad markers in the output manifest.
     *
     * For information about SCTE-35 in AWS Elemental MediaPackage , see [SCTE-35 Message Options in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/scte.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-adsondeliveryrestrictions
     */
    readonly adsOnDeliveryRestrictions?: string;

    /**
     * Specifies the SCTE-35 message types that AWS Elemental MediaPackage treats as ad markers in the output manifest.
     *
     * Valid values:
     *
     * - `BREAK`
     * - `DISTRIBUTOR_ADVERTISEMENT`
     * - `DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY`
     * - `DISTRIBUTOR_PLACEMENT_OPPORTUNITY`
     * - `PROVIDER_ADVERTISEMENT`
     * - `PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY`
     * - `PROVIDER_PLACEMENT_OPPORTUNITY`
     * - `SPLICE_INSERT`
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-adtriggers
     */
    readonly adTriggers?: Array<string>;

    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-encryption
     */
    readonly encryption?: CfnOriginEndpoint.HlsEncryptionProperty | cdk.IResolvable;

    /**
     * When enabled, MediaPackage passes through digital video broadcasting (DVB) subtitles into the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-includedvbsubtitles
     */
    readonly includeDvbSubtitles?: boolean | cdk.IResolvable;

    /**
     * Only applies to stream sets with a single video track.
     *
     * When true, the stream set includes an additional I-frame only stream, along with the other tracks. If false, this extra stream is not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-includeiframeonlystream
     */
    readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;

    /**
     * When specified as either `event` or `vod` , a corresponding `EXT-X-PLAYLIST-TYPE` entry is included in the media playlist.
     *
     * Indicates if the playlist is live-to-VOD content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-playlisttype
     */
    readonly playlistType?: string;

    /**
     * Time window (in seconds) contained in each parent manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-playlistwindowseconds
     */
    readonly playlistWindowSeconds?: number;

    /**
     * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify.
     *
     * Additionally, ID3Timed metadata messages are generated every 5 seconds starting when the content was ingested.
     *
     * Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     *
     * Omit this attribute or enter `0` to indicate that the `EXT-X-PROGRAM-DATE-TIME` tags are not included in the manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-programdatetimeintervalseconds
     */
    readonly programDateTimeIntervalSeconds?: number;

    /**
     * Duration (in seconds) of each fragment.
     *
     * Actual fragments are rounded to the nearest multiple of the source fragment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnOriginEndpoint.StreamSelectionProperty;

    /**
     * When true, AWS Elemental MediaPackage bundles all audio tracks in a rendition group.
     *
     * All other tracks in the stream can be used with any audio rendition from the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlspackage.html#cfn-mediapackage-originendpoint-hlspackage-useaudiorenditiongroup
     */
    readonly useAudioRenditionGroup?: boolean | cdk.IResolvable;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html
   */
  export interface HlsEncryptionProperty {
    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, used with the key for encrypting blocks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * HLS encryption type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-encryptionmethod
     */
    readonly encryptionMethod?: string;

    /**
     * Number of seconds before AWS Elemental MediaPackage rotates to a new key.
     *
     * By default, rotation is set to 60 seconds. Set to `0` to disable key rotation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-keyrotationintervalseconds
     */
    readonly keyRotationIntervalSeconds?: number;

    /**
     * Repeat the `EXT-X-KEY` directive for every media segment.
     *
     * This might result in an increase in client requests to the DRM server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-repeatextxkey
     */
    readonly repeatExtXKey?: boolean | cdk.IResolvable;

    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-hlsencryption.html#cfn-mediapackage-originendpoint-hlsencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnOriginEndpoint.SpekeKeyProviderProperty;
  }

  /**
   * Parameters for DASH packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html
   */
  export interface DashPackageProperty {
    /**
     * The flags on SCTE-35 segmentation descriptors that have to be present for AWS Elemental MediaPackage to insert ad markers in the output manifest.
     *
     * For information about SCTE-35 in AWS Elemental MediaPackage , see [SCTE-35 Message Options in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/scte.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-adsondeliveryrestrictions
     */
    readonly adsOnDeliveryRestrictions?: string;

    /**
     * Specifies the SCTE-35 message types that AWS Elemental MediaPackage treats as ad markers in the output manifest.
     *
     * Valid values:
     *
     * - `BREAK`
     * - `DISTRIBUTOR_ADVERTISEMENT`
     * - `DISTRIBUTOR_OVERLAY_PLACEMENT_OPPORTUNITY` .
     * - `DISTRIBUTOR_PLACEMENT_OPPORTUNITY` .
     * - `PROVIDER_ADVERTISEMENT` .
     * - `PROVIDER_OVERLAY_PLACEMENT_OPPORTUNITY` .
     * - `PROVIDER_PLACEMENT_OPPORTUNITY` .
     * - `SPLICE_INSERT` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-adtriggers
     */
    readonly adTriggers?: Array<string>;

    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-encryption
     */
    readonly encryption?: CfnOriginEndpoint.DashEncryptionProperty | cdk.IResolvable;

    /**
     * This applies only to stream sets with a single video track.
     *
     * When true, the stream set includes an additional I-frame trick-play only stream, along with the other tracks. If false, this extra stream is not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-includeiframeonlystream
     */
    readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;

    /**
     * Determines the position of some tags in the manifest.
     *
     * Valid values:
     *
     * - `FULL` - Elements like `SegmentTemplate` and `ContentProtection` are included in each `Representation` .
     * - `COMPACT` - Duplicate elements are combined and presented at the `AdaptationSet` level.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-manifestlayout
     */
    readonly manifestLayout?: string;

    /**
     * Time window (in seconds) contained in each manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-manifestwindowseconds
     */
    readonly manifestWindowSeconds?: number;

    /**
     * Minimum amount of content (measured in seconds) that a player must keep available in the buffer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-minbuffertimeseconds
     */
    readonly minBufferTimeSeconds?: number;

    /**
     * Minimum amount of time (in seconds) that the player should wait before requesting updates to the manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-minupdateperiodseconds
     */
    readonly minUpdatePeriodSeconds?: number;

    /**
     * Controls whether AWS Elemental MediaPackage produces single-period or multi-period DASH manifests.
     *
     * For more information about periods, see [Multi-period DASH in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/multi-period.html) .
     *
     * Valid values:
     *
     * - `ADS` - AWS Elemental MediaPackage will produce multi-period DASH manifests. Periods are created based on the SCTE-35 ad markers present in the input manifest.
     * - *No value* - AWS Elemental MediaPackage will produce single-period DASH manifests. This is the default setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-periodtriggers
     */
    readonly periodTriggers?: Array<string>;

    /**
     * The DASH profile for the output.
     *
     * Valid values:
     *
     * - `NONE` - The output doesn't use a DASH profile.
     * - `HBBTV_1_5` - The output is compliant with HbbTV v1.5.
     * - `DVB_DASH_2014` - The output is compliant with DVB-DASH 2014.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-profile
     */
    readonly profile?: string;

    /**
     * Duration (in seconds) of each fragment.
     *
     * Actual fragments are rounded to the nearest multiple of the source fragment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * Determines the type of variable used in the `media` URL of the `SegmentTemplate` tag in the manifest.
     *
     * Also specifies if segment timeline information is included in `SegmentTimeline` or `SegmentTemplate` .
     *
     * Valid values:
     *
     * - `NUMBER_WITH_TIMELINE` - The `$Number$` variable is used in the `media` URL. The value of this variable is the sequential number of the segment. A full `SegmentTimeline` object is presented in each `SegmentTemplate` .
     * - `NUMBER_WITH_DURATION` - The `$Number$` variable is used in the `media` URL and a `duration` attribute is added to the segment template. The `SegmentTimeline` object is removed from the representation.
     * - `TIME_WITH_TIMELINE` - The `$Time$` variable is used in the `media` URL. The value of this variable is the timestamp of when the segment starts. A full `SegmentTimeline` object is presented in each `SegmentTemplate` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-segmenttemplateformat
     */
    readonly segmentTemplateFormat?: string;

    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnOriginEndpoint.StreamSelectionProperty;

    /**
     * Amount of time (in seconds) that the player should be from the live point at the end of the manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-suggestedpresentationdelayseconds
     */
    readonly suggestedPresentationDelaySeconds?: number;

    /**
     * Determines the type of UTC timing included in the DASH Media Presentation Description (MPD).
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-utctiming
     */
    readonly utcTiming?: string;

    /**
     * Specifies the value attribute of the UTC timing field when utcTiming is set to HTTP-ISO or HTTP-HEAD.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashpackage.html#cfn-mediapackage-originendpoint-dashpackage-utctiminguri
     */
    readonly utcTimingUri?: string;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html
   */
  export interface DashEncryptionProperty {
    /**
     * Number of seconds before AWS Elemental MediaPackage rotates to a new key.
     *
     * By default, rotation is set to 60 seconds. Set to `0` to disable key rotation.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html#cfn-mediapackage-originendpoint-dashencryption-keyrotationintervalseconds
     */
    readonly keyRotationIntervalSeconds?: number;

    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-originendpoint-dashencryption.html#cfn-mediapackage-originendpoint-dashencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnOriginEndpoint.SpekeKeyProviderProperty;
  }
}

/**
 * Properties for defining a `CfnOriginEndpoint`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html
 */
export interface CfnOriginEndpointProps {
  /**
   * Parameters for CDN authorization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-authorization
   */
  readonly authorization?: CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable;

  /**
   * The ID of the channel associated with this endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-channelid
   */
  readonly channelId: string;

  /**
   * Parameters for Common Media Application Format (CMAF) packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-cmafpackage
   */
  readonly cmafPackage?: CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable;

  /**
   * Parameters for DASH packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-dashpackage
   */
  readonly dashPackage?: CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable;

  /**
   * Any descriptive information that you want to add to the endpoint for future identification purposes.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-description
   */
  readonly description?: string;

  /**
   * Parameters for Apple HLS packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-hlspackage
   */
  readonly hlsPackage?: CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable;

  /**
   * The manifest ID is required and must be unique within the OriginEndpoint.
   *
   * The ID can't be changed after the endpoint is created.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-id
   */
  readonly id: string;

  /**
   * A short string that's appended to the end of the endpoint URL to create a unique path to this endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-manifestname
   */
  readonly manifestName?: string;

  /**
   * Parameters for Microsoft Smooth Streaming packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-msspackage
   */
  readonly mssPackage?: cdk.IResolvable | CfnOriginEndpoint.MssPackageProperty;

  /**
   * Controls video origination from this endpoint.
   *
   * Valid values:
   *
   * - `ALLOW` - enables this endpoint to serve content to requesting devices.
   * - `DENY` - prevents this endpoint from serving content. Denying origination is helpful for harvesting live-to-VOD assets. For more information about harvesting and origination, see [Live-to-VOD Requirements](https://docs.aws.amazon.com/mediapackage/latest/ug/ltov-reqmts.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-origination
   */
  readonly origination?: string;

  /**
   * Maximum duration (seconds) of content to retain for startover playback.
   *
   * Omit this attribute or enter `0` to indicate that startover playback is disabled for this endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-startoverwindowseconds
   */
  readonly startoverWindowSeconds?: number;

  /**
   * The tags to assign to the endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Minimum duration (seconds) of delay to enforce on the playback of live content.
   *
   * Omit this attribute or enter `0` to indicate that there is no time delay in effect for this endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-timedelayseconds
   */
  readonly timeDelaySeconds?: number;

  /**
   * The IP addresses that can access this endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-originendpoint.html#cfn-mediapackage-originendpoint-whitelist
   */
  readonly whitelist?: Array<string>;
}

/**
 * Determine whether the given properties match those of a `StreamSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSelectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointStreamSelectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxVideoBitsPerSecond", cdk.validateNumber)(properties.maxVideoBitsPerSecond));
  errors.collect(cdk.propertyValidator("minVideoBitsPerSecond", cdk.validateNumber)(properties.minVideoBitsPerSecond));
  errors.collect(cdk.propertyValidator("streamOrder", cdk.validateString)(properties.streamOrder));
  return errors.wrap("supplied properties not correct for \"StreamSelectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointStreamSelectionPropertyValidator(properties).assertSuccess();
  return {
    "MaxVideoBitsPerSecond": cdk.numberToCloudFormation(properties.maxVideoBitsPerSecond),
    "MinVideoBitsPerSecond": cdk.numberToCloudFormation(properties.minVideoBitsPerSecond),
    "StreamOrder": cdk.stringToCloudFormation(properties.streamOrder)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.StreamSelectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.StreamSelectionProperty>();
  ret.addPropertyResult("maxVideoBitsPerSecond", "MaxVideoBitsPerSecond", (properties.MaxVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxVideoBitsPerSecond) : undefined));
  ret.addPropertyResult("minVideoBitsPerSecond", "MinVideoBitsPerSecond", (properties.MinVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinVideoBitsPerSecond) : undefined));
  ret.addPropertyResult("streamOrder", "StreamOrder", (properties.StreamOrder != null ? cfn_parse.FromCloudFormation.getString(properties.StreamOrder) : undefined));
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
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("encryptionContractConfiguration", CfnOriginEndpointEncryptionContractConfigurationPropertyValidator)(properties.encryptionContractConfiguration));
  errors.collect(cdk.propertyValidator("resourceId", cdk.requiredValidator)(properties.resourceId));
  errors.collect(cdk.propertyValidator("resourceId", cdk.validateString)(properties.resourceId));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("systemIds", cdk.requiredValidator)(properties.systemIds));
  errors.collect(cdk.propertyValidator("systemIds", cdk.listValidator(cdk.validateString))(properties.systemIds));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"SpekeKeyProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointSpekeKeyProviderPropertyValidator(properties).assertSuccess();
  return {
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "EncryptionContractConfiguration": convertCfnOriginEndpointEncryptionContractConfigurationPropertyToCloudFormation(properties.encryptionContractConfiguration),
    "ResourceId": cdk.stringToCloudFormation(properties.resourceId),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SystemIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.systemIds),
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
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("encryptionContractConfiguration", "EncryptionContractConfiguration", (properties.EncryptionContractConfiguration != null ? CfnOriginEndpointEncryptionContractConfigurationPropertyFromCloudFormation(properties.EncryptionContractConfiguration) : undefined));
  ret.addPropertyResult("resourceId", "ResourceId", (properties.ResourceId != null ? cfn_parse.FromCloudFormation.getString(properties.ResourceId) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("systemIds", "SystemIds", (properties.SystemIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SystemIds) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MssEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `MssEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointMssEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnOriginEndpointSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"MssEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointMssEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointMssEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "SpekeKeyProvider": convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointMssEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.MssEncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.MssEncryptionProperty>();
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MssPackageProperty`
 *
 * @param properties - the TypeScript properties of a `MssPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointMssPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryption", CfnOriginEndpointMssEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("manifestWindowSeconds", cdk.validateNumber)(properties.manifestWindowSeconds));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("streamSelection", CfnOriginEndpointStreamSelectionPropertyValidator)(properties.streamSelection));
  return errors.wrap("supplied properties not correct for \"MssPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointMssPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointMssPackagePropertyValidator(properties).assertSuccess();
  return {
    "Encryption": convertCfnOriginEndpointMssEncryptionPropertyToCloudFormation(properties.encryption),
    "ManifestWindowSeconds": cdk.numberToCloudFormation(properties.manifestWindowSeconds),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "StreamSelection": convertCfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointMssPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnOriginEndpoint.MssPackageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.MssPackageProperty>();
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnOriginEndpointMssEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("manifestWindowSeconds", "ManifestWindowSeconds", (properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthorizationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointAuthorizationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cdnIdentifierSecret", cdk.requiredValidator)(properties.cdnIdentifierSecret));
  errors.collect(cdk.propertyValidator("cdnIdentifierSecret", cdk.validateString)(properties.cdnIdentifierSecret));
  errors.collect(cdk.propertyValidator("secretsRoleArn", cdk.requiredValidator)(properties.secretsRoleArn));
  errors.collect(cdk.propertyValidator("secretsRoleArn", cdk.validateString)(properties.secretsRoleArn));
  return errors.wrap("supplied properties not correct for \"AuthorizationProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointAuthorizationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointAuthorizationPropertyValidator(properties).assertSuccess();
  return {
    "CdnIdentifierSecret": cdk.stringToCloudFormation(properties.cdnIdentifierSecret),
    "SecretsRoleArn": cdk.stringToCloudFormation(properties.secretsRoleArn)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointAuthorizationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.AuthorizationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.AuthorizationProperty>();
  ret.addPropertyResult("cdnIdentifierSecret", "CdnIdentifierSecret", (properties.CdnIdentifierSecret != null ? cfn_parse.FromCloudFormation.getString(properties.CdnIdentifierSecret) : undefined));
  ret.addPropertyResult("secretsRoleArn", "SecretsRoleArn", (properties.SecretsRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CmafEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `CmafEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointCmafEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("encryptionMethod", cdk.validateString)(properties.encryptionMethod));
  errors.collect(cdk.propertyValidator("keyRotationIntervalSeconds", cdk.validateNumber)(properties.keyRotationIntervalSeconds));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnOriginEndpointSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"CmafEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointCmafEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointCmafEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "EncryptionMethod": cdk.stringToCloudFormation(properties.encryptionMethod),
    "KeyRotationIntervalSeconds": cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
    "SpekeKeyProvider": convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointCmafEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.CmafEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.CmafEncryptionProperty>();
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("encryptionMethod", "EncryptionMethod", (properties.EncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMethod) : undefined));
  ret.addPropertyResult("keyRotationIntervalSeconds", "KeyRotationIntervalSeconds", (properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined));
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsManifestProperty`
 *
 * @param properties - the TypeScript properties of a `HlsManifestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointHlsManifestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adMarkers", cdk.validateString)(properties.adMarkers));
  errors.collect(cdk.propertyValidator("adTriggers", cdk.listValidator(cdk.validateString))(properties.adTriggers));
  errors.collect(cdk.propertyValidator("adsOnDeliveryRestrictions", cdk.validateString)(properties.adsOnDeliveryRestrictions));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("includeIframeOnlyStream", cdk.validateBoolean)(properties.includeIframeOnlyStream));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("playlistType", cdk.validateString)(properties.playlistType));
  errors.collect(cdk.propertyValidator("playlistWindowSeconds", cdk.validateNumber)(properties.playlistWindowSeconds));
  errors.collect(cdk.propertyValidator("programDateTimeIntervalSeconds", cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"HlsManifestProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointHlsManifestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointHlsManifestPropertyValidator(properties).assertSuccess();
  return {
    "AdMarkers": cdk.stringToCloudFormation(properties.adMarkers),
    "AdTriggers": cdk.listMapper(cdk.stringToCloudFormation)(properties.adTriggers),
    "AdsOnDeliveryRestrictions": cdk.stringToCloudFormation(properties.adsOnDeliveryRestrictions),
    "Id": cdk.stringToCloudFormation(properties.id),
    "IncludeIframeOnlyStream": cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "PlaylistType": cdk.stringToCloudFormation(properties.playlistType),
    "PlaylistWindowSeconds": cdk.numberToCloudFormation(properties.playlistWindowSeconds),
    "ProgramDateTimeIntervalSeconds": cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsManifestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsManifestProperty>();
  ret.addPropertyResult("adMarkers", "AdMarkers", (properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkers) : undefined));
  ret.addPropertyResult("adsOnDeliveryRestrictions", "AdsOnDeliveryRestrictions", (properties.AdsOnDeliveryRestrictions != null ? cfn_parse.FromCloudFormation.getString(properties.AdsOnDeliveryRestrictions) : undefined));
  ret.addPropertyResult("adTriggers", "AdTriggers", (properties.AdTriggers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdTriggers) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("includeIframeOnlyStream", "IncludeIframeOnlyStream", (properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("playlistType", "PlaylistType", (properties.PlaylistType != null ? cfn_parse.FromCloudFormation.getString(properties.PlaylistType) : undefined));
  ret.addPropertyResult("playlistWindowSeconds", "PlaylistWindowSeconds", (properties.PlaylistWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PlaylistWindowSeconds) : undefined));
  ret.addPropertyResult("programDateTimeIntervalSeconds", "ProgramDateTimeIntervalSeconds", (properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CmafPackageProperty`
 *
 * @param properties - the TypeScript properties of a `CmafPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointCmafPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryption", CfnOriginEndpointCmafEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("hlsManifests", cdk.listValidator(CfnOriginEndpointHlsManifestPropertyValidator))(properties.hlsManifests));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("segmentPrefix", cdk.validateString)(properties.segmentPrefix));
  errors.collect(cdk.propertyValidator("streamSelection", CfnOriginEndpointStreamSelectionPropertyValidator)(properties.streamSelection));
  return errors.wrap("supplied properties not correct for \"CmafPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointCmafPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointCmafPackagePropertyValidator(properties).assertSuccess();
  return {
    "Encryption": convertCfnOriginEndpointCmafEncryptionPropertyToCloudFormation(properties.encryption),
    "HlsManifests": cdk.listMapper(convertCfnOriginEndpointHlsManifestPropertyToCloudFormation)(properties.hlsManifests),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "SegmentPrefix": cdk.stringToCloudFormation(properties.segmentPrefix),
    "StreamSelection": convertCfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointCmafPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.CmafPackageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.CmafPackageProperty>();
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnOriginEndpointCmafEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("hlsManifests", "HlsManifests", (properties.HlsManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnOriginEndpointHlsManifestPropertyFromCloudFormation)(properties.HlsManifests) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("segmentPrefix", "SegmentPrefix", (properties.SegmentPrefix != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentPrefix) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `HlsEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointHlsEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("encryptionMethod", cdk.validateString)(properties.encryptionMethod));
  errors.collect(cdk.propertyValidator("keyRotationIntervalSeconds", cdk.validateNumber)(properties.keyRotationIntervalSeconds));
  errors.collect(cdk.propertyValidator("repeatExtXKey", cdk.validateBoolean)(properties.repeatExtXKey));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnOriginEndpointSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"HlsEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointHlsEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointHlsEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "EncryptionMethod": cdk.stringToCloudFormation(properties.encryptionMethod),
    "KeyRotationIntervalSeconds": cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
    "RepeatExtXKey": cdk.booleanToCloudFormation(properties.repeatExtXKey),
    "SpekeKeyProvider": convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsEncryptionProperty>();
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("encryptionMethod", "EncryptionMethod", (properties.EncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMethod) : undefined));
  ret.addPropertyResult("keyRotationIntervalSeconds", "KeyRotationIntervalSeconds", (properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined));
  ret.addPropertyResult("repeatExtXKey", "RepeatExtXKey", (properties.RepeatExtXKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RepeatExtXKey) : undefined));
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsPackageProperty`
 *
 * @param properties - the TypeScript properties of a `HlsPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointHlsPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adMarkers", cdk.validateString)(properties.adMarkers));
  errors.collect(cdk.propertyValidator("adTriggers", cdk.listValidator(cdk.validateString))(properties.adTriggers));
  errors.collect(cdk.propertyValidator("adsOnDeliveryRestrictions", cdk.validateString)(properties.adsOnDeliveryRestrictions));
  errors.collect(cdk.propertyValidator("encryption", CfnOriginEndpointHlsEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("includeDvbSubtitles", cdk.validateBoolean)(properties.includeDvbSubtitles));
  errors.collect(cdk.propertyValidator("includeIframeOnlyStream", cdk.validateBoolean)(properties.includeIframeOnlyStream));
  errors.collect(cdk.propertyValidator("playlistType", cdk.validateString)(properties.playlistType));
  errors.collect(cdk.propertyValidator("playlistWindowSeconds", cdk.validateNumber)(properties.playlistWindowSeconds));
  errors.collect(cdk.propertyValidator("programDateTimeIntervalSeconds", cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("streamSelection", CfnOriginEndpointStreamSelectionPropertyValidator)(properties.streamSelection));
  errors.collect(cdk.propertyValidator("useAudioRenditionGroup", cdk.validateBoolean)(properties.useAudioRenditionGroup));
  return errors.wrap("supplied properties not correct for \"HlsPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointHlsPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointHlsPackagePropertyValidator(properties).assertSuccess();
  return {
    "AdMarkers": cdk.stringToCloudFormation(properties.adMarkers),
    "AdTriggers": cdk.listMapper(cdk.stringToCloudFormation)(properties.adTriggers),
    "AdsOnDeliveryRestrictions": cdk.stringToCloudFormation(properties.adsOnDeliveryRestrictions),
    "Encryption": convertCfnOriginEndpointHlsEncryptionPropertyToCloudFormation(properties.encryption),
    "IncludeDvbSubtitles": cdk.booleanToCloudFormation(properties.includeDvbSubtitles),
    "IncludeIframeOnlyStream": cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
    "PlaylistType": cdk.stringToCloudFormation(properties.playlistType),
    "PlaylistWindowSeconds": cdk.numberToCloudFormation(properties.playlistWindowSeconds),
    "ProgramDateTimeIntervalSeconds": cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "StreamSelection": convertCfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    "UseAudioRenditionGroup": cdk.booleanToCloudFormation(properties.useAudioRenditionGroup)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointHlsPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.HlsPackageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.HlsPackageProperty>();
  ret.addPropertyResult("adMarkers", "AdMarkers", (properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkers) : undefined));
  ret.addPropertyResult("adsOnDeliveryRestrictions", "AdsOnDeliveryRestrictions", (properties.AdsOnDeliveryRestrictions != null ? cfn_parse.FromCloudFormation.getString(properties.AdsOnDeliveryRestrictions) : undefined));
  ret.addPropertyResult("adTriggers", "AdTriggers", (properties.AdTriggers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdTriggers) : undefined));
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnOriginEndpointHlsEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("includeDvbSubtitles", "IncludeDvbSubtitles", (properties.IncludeDvbSubtitles != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDvbSubtitles) : undefined));
  ret.addPropertyResult("includeIframeOnlyStream", "IncludeIframeOnlyStream", (properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined));
  ret.addPropertyResult("playlistType", "PlaylistType", (properties.PlaylistType != null ? cfn_parse.FromCloudFormation.getString(properties.PlaylistType) : undefined));
  ret.addPropertyResult("playlistWindowSeconds", "PlaylistWindowSeconds", (properties.PlaylistWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.PlaylistWindowSeconds) : undefined));
  ret.addPropertyResult("programDateTimeIntervalSeconds", "ProgramDateTimeIntervalSeconds", (properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
  ret.addPropertyResult("useAudioRenditionGroup", "UseAudioRenditionGroup", (properties.UseAudioRenditionGroup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAudioRenditionGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `DashEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointDashEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyRotationIntervalSeconds", cdk.validateNumber)(properties.keyRotationIntervalSeconds));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnOriginEndpointSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"DashEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointDashEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointDashEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "KeyRotationIntervalSeconds": cdk.numberToCloudFormation(properties.keyRotationIntervalSeconds),
    "SpekeKeyProvider": convertCfnOriginEndpointSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointDashEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.DashEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.DashEncryptionProperty>();
  ret.addPropertyResult("keyRotationIntervalSeconds", "KeyRotationIntervalSeconds", (properties.KeyRotationIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.KeyRotationIntervalSeconds) : undefined));
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnOriginEndpointSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashPackageProperty`
 *
 * @param properties - the TypeScript properties of a `DashPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnOriginEndpointDashPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adTriggers", cdk.listValidator(cdk.validateString))(properties.adTriggers));
  errors.collect(cdk.propertyValidator("adsOnDeliveryRestrictions", cdk.validateString)(properties.adsOnDeliveryRestrictions));
  errors.collect(cdk.propertyValidator("encryption", CfnOriginEndpointDashEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("includeIframeOnlyStream", cdk.validateBoolean)(properties.includeIframeOnlyStream));
  errors.collect(cdk.propertyValidator("manifestLayout", cdk.validateString)(properties.manifestLayout));
  errors.collect(cdk.propertyValidator("manifestWindowSeconds", cdk.validateNumber)(properties.manifestWindowSeconds));
  errors.collect(cdk.propertyValidator("minBufferTimeSeconds", cdk.validateNumber)(properties.minBufferTimeSeconds));
  errors.collect(cdk.propertyValidator("minUpdatePeriodSeconds", cdk.validateNumber)(properties.minUpdatePeriodSeconds));
  errors.collect(cdk.propertyValidator("periodTriggers", cdk.listValidator(cdk.validateString))(properties.periodTriggers));
  errors.collect(cdk.propertyValidator("profile", cdk.validateString)(properties.profile));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("segmentTemplateFormat", cdk.validateString)(properties.segmentTemplateFormat));
  errors.collect(cdk.propertyValidator("streamSelection", CfnOriginEndpointStreamSelectionPropertyValidator)(properties.streamSelection));
  errors.collect(cdk.propertyValidator("suggestedPresentationDelaySeconds", cdk.validateNumber)(properties.suggestedPresentationDelaySeconds));
  errors.collect(cdk.propertyValidator("utcTiming", cdk.validateString)(properties.utcTiming));
  errors.collect(cdk.propertyValidator("utcTimingUri", cdk.validateString)(properties.utcTimingUri));
  return errors.wrap("supplied properties not correct for \"DashPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointDashPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointDashPackagePropertyValidator(properties).assertSuccess();
  return {
    "AdTriggers": cdk.listMapper(cdk.stringToCloudFormation)(properties.adTriggers),
    "AdsOnDeliveryRestrictions": cdk.stringToCloudFormation(properties.adsOnDeliveryRestrictions),
    "Encryption": convertCfnOriginEndpointDashEncryptionPropertyToCloudFormation(properties.encryption),
    "IncludeIframeOnlyStream": cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
    "ManifestLayout": cdk.stringToCloudFormation(properties.manifestLayout),
    "ManifestWindowSeconds": cdk.numberToCloudFormation(properties.manifestWindowSeconds),
    "MinBufferTimeSeconds": cdk.numberToCloudFormation(properties.minBufferTimeSeconds),
    "MinUpdatePeriodSeconds": cdk.numberToCloudFormation(properties.minUpdatePeriodSeconds),
    "PeriodTriggers": cdk.listMapper(cdk.stringToCloudFormation)(properties.periodTriggers),
    "Profile": cdk.stringToCloudFormation(properties.profile),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "SegmentTemplateFormat": cdk.stringToCloudFormation(properties.segmentTemplateFormat),
    "StreamSelection": convertCfnOriginEndpointStreamSelectionPropertyToCloudFormation(properties.streamSelection),
    "SuggestedPresentationDelaySeconds": cdk.numberToCloudFormation(properties.suggestedPresentationDelaySeconds),
    "UtcTiming": cdk.stringToCloudFormation(properties.utcTiming),
    "UtcTimingUri": cdk.stringToCloudFormation(properties.utcTimingUri)
  };
}

// @ts-ignore TS6133
function CfnOriginEndpointDashPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnOriginEndpoint.DashPackageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnOriginEndpoint.DashPackageProperty>();
  ret.addPropertyResult("adsOnDeliveryRestrictions", "AdsOnDeliveryRestrictions", (properties.AdsOnDeliveryRestrictions != null ? cfn_parse.FromCloudFormation.getString(properties.AdsOnDeliveryRestrictions) : undefined));
  ret.addPropertyResult("adTriggers", "AdTriggers", (properties.AdTriggers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AdTriggers) : undefined));
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnOriginEndpointDashEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("includeIframeOnlyStream", "IncludeIframeOnlyStream", (properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined));
  ret.addPropertyResult("manifestLayout", "ManifestLayout", (properties.ManifestLayout != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestLayout) : undefined));
  ret.addPropertyResult("manifestWindowSeconds", "ManifestWindowSeconds", (properties.ManifestWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ManifestWindowSeconds) : undefined));
  ret.addPropertyResult("minBufferTimeSeconds", "MinBufferTimeSeconds", (properties.MinBufferTimeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinBufferTimeSeconds) : undefined));
  ret.addPropertyResult("minUpdatePeriodSeconds", "MinUpdatePeriodSeconds", (properties.MinUpdatePeriodSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinUpdatePeriodSeconds) : undefined));
  ret.addPropertyResult("periodTriggers", "PeriodTriggers", (properties.PeriodTriggers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PeriodTriggers) : undefined));
  ret.addPropertyResult("profile", "Profile", (properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("segmentTemplateFormat", "SegmentTemplateFormat", (properties.SegmentTemplateFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentTemplateFormat) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnOriginEndpointStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
  ret.addPropertyResult("suggestedPresentationDelaySeconds", "SuggestedPresentationDelaySeconds", (properties.SuggestedPresentationDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SuggestedPresentationDelaySeconds) : undefined));
  ret.addPropertyResult("utcTiming", "UtcTiming", (properties.UtcTiming != null ? cfn_parse.FromCloudFormation.getString(properties.UtcTiming) : undefined));
  ret.addPropertyResult("utcTimingUri", "UtcTimingUri", (properties.UtcTimingUri != null ? cfn_parse.FromCloudFormation.getString(properties.UtcTimingUri) : undefined));
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
  errors.collect(cdk.propertyValidator("authorization", CfnOriginEndpointAuthorizationPropertyValidator)(properties.authorization));
  errors.collect(cdk.propertyValidator("channelId", cdk.requiredValidator)(properties.channelId));
  errors.collect(cdk.propertyValidator("channelId", cdk.validateString)(properties.channelId));
  errors.collect(cdk.propertyValidator("cmafPackage", CfnOriginEndpointCmafPackagePropertyValidator)(properties.cmafPackage));
  errors.collect(cdk.propertyValidator("dashPackage", CfnOriginEndpointDashPackagePropertyValidator)(properties.dashPackage));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("hlsPackage", CfnOriginEndpointHlsPackagePropertyValidator)(properties.hlsPackage));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("mssPackage", CfnOriginEndpointMssPackagePropertyValidator)(properties.mssPackage));
  errors.collect(cdk.propertyValidator("origination", cdk.validateString)(properties.origination));
  errors.collect(cdk.propertyValidator("startoverWindowSeconds", cdk.validateNumber)(properties.startoverWindowSeconds));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("timeDelaySeconds", cdk.validateNumber)(properties.timeDelaySeconds));
  errors.collect(cdk.propertyValidator("whitelist", cdk.listValidator(cdk.validateString))(properties.whitelist));
  return errors.wrap("supplied properties not correct for \"CfnOriginEndpointProps\"");
}

// @ts-ignore TS6133
function convertCfnOriginEndpointPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnOriginEndpointPropsValidator(properties).assertSuccess();
  return {
    "Authorization": convertCfnOriginEndpointAuthorizationPropertyToCloudFormation(properties.authorization),
    "ChannelId": cdk.stringToCloudFormation(properties.channelId),
    "CmafPackage": convertCfnOriginEndpointCmafPackagePropertyToCloudFormation(properties.cmafPackage),
    "DashPackage": convertCfnOriginEndpointDashPackagePropertyToCloudFormation(properties.dashPackage),
    "Description": cdk.stringToCloudFormation(properties.description),
    "HlsPackage": convertCfnOriginEndpointHlsPackagePropertyToCloudFormation(properties.hlsPackage),
    "Id": cdk.stringToCloudFormation(properties.id),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "MssPackage": convertCfnOriginEndpointMssPackagePropertyToCloudFormation(properties.mssPackage),
    "Origination": cdk.stringToCloudFormation(properties.origination),
    "StartoverWindowSeconds": cdk.numberToCloudFormation(properties.startoverWindowSeconds),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "TimeDelaySeconds": cdk.numberToCloudFormation(properties.timeDelaySeconds),
    "Whitelist": cdk.listMapper(cdk.stringToCloudFormation)(properties.whitelist)
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
  ret.addPropertyResult("authorization", "Authorization", (properties.Authorization != null ? CfnOriginEndpointAuthorizationPropertyFromCloudFormation(properties.Authorization) : undefined));
  ret.addPropertyResult("channelId", "ChannelId", (properties.ChannelId != null ? cfn_parse.FromCloudFormation.getString(properties.ChannelId) : undefined));
  ret.addPropertyResult("cmafPackage", "CmafPackage", (properties.CmafPackage != null ? CfnOriginEndpointCmafPackagePropertyFromCloudFormation(properties.CmafPackage) : undefined));
  ret.addPropertyResult("dashPackage", "DashPackage", (properties.DashPackage != null ? CfnOriginEndpointDashPackagePropertyFromCloudFormation(properties.DashPackage) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("hlsPackage", "HlsPackage", (properties.HlsPackage != null ? CfnOriginEndpointHlsPackagePropertyFromCloudFormation(properties.HlsPackage) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("mssPackage", "MssPackage", (properties.MssPackage != null ? CfnOriginEndpointMssPackagePropertyFromCloudFormation(properties.MssPackage) : undefined));
  ret.addPropertyResult("origination", "Origination", (properties.Origination != null ? cfn_parse.FromCloudFormation.getString(properties.Origination) : undefined));
  ret.addPropertyResult("startoverWindowSeconds", "StartoverWindowSeconds", (properties.StartoverWindowSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.StartoverWindowSeconds) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("timeDelaySeconds", "TimeDelaySeconds", (properties.TimeDelaySeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeDelaySeconds) : undefined));
  ret.addPropertyResult("whitelist", "Whitelist", (properties.Whitelist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Whitelist) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a packaging configuration in a packaging group.
 *
 * The packaging configuration represents a single delivery point for an asset. It determines the format and setting for the egressing content. Specify only one package format per configuration, such as `HlsPackage` .
 *
 * @cloudformationResource AWS::MediaPackage::PackagingConfiguration
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html
 */
export class CfnPackagingConfiguration extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackage::PackagingConfiguration";

  /**
   * Build a CfnPackagingConfiguration from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackagingConfiguration {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPackagingConfigurationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPackagingConfiguration(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the packaging configuration. You can get this from the response to any request to the packaging configuration.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * Parameters for CMAF packaging.
   */
  public cmafPackage?: CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable;

  /**
   * Parameters for DASH-ISO packaging.
   */
  public dashPackage?: CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable;

  /**
   * Parameters for Apple HLS packaging.
   */
  public hlsPackage?: CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable;

  /**
   * Unique identifier that you assign to the packaging configuration.
   */
  public id: string;

  /**
   * Parameters for Microsoft Smooth Streaming packaging.
   */
  public mssPackage?: cdk.IResolvable | CfnPackagingConfiguration.MssPackageProperty;

  /**
   * The ID of the packaging group associated with this packaging configuration.
   */
  public packagingGroupId: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the packaging configuration.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPackagingConfigurationProps) {
    super(scope, id, {
      "type": CfnPackagingConfiguration.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "id", this);
    cdk.requireProperty(props, "packagingGroupId", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.cmafPackage = props.cmafPackage;
    this.dashPackage = props.dashPackage;
    this.hlsPackage = props.hlsPackage;
    this.id = props.id;
    this.mssPackage = props.mssPackage;
    this.packagingGroupId = props.packagingGroupId;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::PackagingConfiguration", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "cmafPackage": this.cmafPackage,
      "dashPackage": this.dashPackage,
      "hlsPackage": this.hlsPackage,
      "id": this.id,
      "mssPackage": this.mssPackage,
      "packagingGroupId": this.packagingGroupId,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPackagingConfiguration.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPackagingConfigurationPropsToCloudFormation(props);
  }
}

export namespace CfnPackagingConfiguration {
  /**
   * Parameters for a packaging configuration that uses Microsoft Smooth Streaming (MSS) packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html
   */
  export interface MssPackageProperty {
    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html#cfn-mediapackage-packagingconfiguration-msspackage-encryption
     */
    readonly encryption?: cdk.IResolvable | CfnPackagingConfiguration.MssEncryptionProperty;

    /**
     * A list of Microsoft Smooth manifest configurations that are available from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html#cfn-mediapackage-packagingconfiguration-msspackage-mssmanifests
     */
    readonly mssManifests: Array<cdk.IResolvable | CfnPackagingConfiguration.MssManifestProperty> | cdk.IResolvable;

    /**
     * Duration (in seconds) of each fragment.
     *
     * Actual fragments are rounded to the nearest multiple of the source fragment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-msspackage.html#cfn-mediapackage-packagingconfiguration-msspackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;
  }

  /**
   * Parameters for a Microsoft Smooth manifest.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html
   */
  export interface MssManifestProperty {
    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this packaging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html#cfn-mediapackage-packagingconfiguration-mssmanifest-manifestname
     */
    readonly manifestName?: string;

    /**
     * Video bitrate limitations for outputs from this packaging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssmanifest.html#cfn-mediapackage-packagingconfiguration-mssmanifest-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnPackagingConfiguration.StreamSelectionProperty;
  }

  /**
   * Limitations for outputs from the endpoint, based on the video bitrate.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html
   */
  export interface StreamSelectionProperty {
    /**
     * The upper limit of the bitrates that this endpoint serves.
     *
     * If the video track exceeds this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 2147483647 bits per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html#cfn-mediapackage-packagingconfiguration-streamselection-maxvideobitspersecond
     */
    readonly maxVideoBitsPerSecond?: number;

    /**
     * The lower limit of the bitrates that this endpoint serves.
     *
     * If the video track is below this threshold, then AWS Elemental MediaPackage excludes it from output. If you don't specify a value, it defaults to 0 bits per second.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html#cfn-mediapackage-packagingconfiguration-streamselection-minvideobitspersecond
     */
    readonly minVideoBitsPerSecond?: number;

    /**
     * Order in which the different video bitrates are presented to the player.
     *
     * Valid values: `ORIGINAL` , `VIDEO_BITRATE_ASCENDING` , `VIDEO_BITRATE_DESCENDING` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-streamselection.html#cfn-mediapackage-packagingconfiguration-streamselection-streamorder
     */
    readonly streamOrder?: string;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssencryption.html
   */
  export interface MssEncryptionProperty {
    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-mssencryption.html#cfn-mediapackage-packagingconfiguration-mssencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnPackagingConfiguration.SpekeKeyProviderProperty;
  }

  /**
   * A configuration for accessing an external Secure Packager and Encoder Key Exchange (SPEKE) service that provides encryption keys.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html
   */
  export interface SpekeKeyProviderProperty {
    /**
     * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines which content keys are used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-encryptioncontractconfiguration
     */
    readonly encryptionContractConfiguration?: CfnPackagingConfiguration.EncryptionContractConfigurationProperty | cdk.IResolvable;

    /**
     * The ARN for the IAM role that's granted by the key provider to provide access to the key provider API.
     *
     * Valid format: arn:aws:iam::{accountID}:role/{name}
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-rolearn
     */
    readonly roleArn: string;

    /**
     * List of unique identifiers for the DRM systems to use, as defined in the CPIX specification.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-systemids
     */
    readonly systemIds: Array<string>;

    /**
     * URL for the key provider's key retrieval API endpoint.
     *
     * Must start with https://.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-spekekeyprovider.html#cfn-mediapackage-packagingconfiguration-spekekeyprovider-url
     */
    readonly url: string;
  }

  /**
   * Use `encryptionContractConfiguration` to configure one or more content encryption keys for your endpoints that use SPEKE Version 2.0. The encryption contract defines the content keys used to encrypt the audio and video tracks in your stream. To configure the encryption contract, specify which audio and video encryption presets to use. For more information about these presets, see [SPEKE Version 2.0 Presets](https://docs.aws.amazon.com/mediapackage/latest/ug/drm-content-speke-v2-presets.html) .
   *
   * Note the following considerations when using `encryptionContractConfiguration` :
   *
   * - You can use `encryptionContractConfiguration` for DASH endpoints that use SPEKE Version 2.0. SPEKE Version 2.0 relies on the CPIX Version 2.3 specification.
   * - You cannot combine an `UNENCRYPTED` preset with `UNENCRYPTED` or `SHARED` presets across `presetSpeke20Audio` and `presetSpeke20Video` .
   * - When you use a `SHARED` preset, you must use it for both `presetSpeke20Audio` and `presetSpeke20Video` .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-encryptioncontractconfiguration.html
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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-encryptioncontractconfiguration.html#cfn-mediapackage-packagingconfiguration-encryptioncontractconfiguration-presetspeke20audio
     */
    readonly presetSpeke20Audio: string;

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
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-encryptioncontractconfiguration.html#cfn-mediapackage-packagingconfiguration-encryptioncontractconfiguration-presetspeke20video
     */
    readonly presetSpeke20Video: string;
  }

  /**
   * Parameters for a packaging configuration that uses Common Media Application Format (CMAF) packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html
   */
  export interface CmafPackageProperty {
    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-encryption
     */
    readonly encryption?: CfnPackagingConfiguration.CmafEncryptionProperty | cdk.IResolvable;

    /**
     * A list of HLS manifest configurations that are available from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-hlsmanifests
     */
    readonly hlsManifests: Array<CfnPackagingConfiguration.HlsManifestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * When includeEncoderConfigurationInSegments is set to true, AWS Elemental MediaPackage places your encoder's Sequence Parameter Set (SPS), Picture Parameter Set (PPS), and Video Parameter Set (VPS) metadata in every video segment instead of in the init fragment.
     *
     * This lets you use different SPS/PPS/VPS settings for your assets during content playback.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-includeencoderconfigurationinsegments
     */
    readonly includeEncoderConfigurationInSegments?: boolean | cdk.IResolvable;

    /**
     * Duration (in seconds) of each segment.
     *
     * Actual segments are rounded to the nearest multiple of the source fragment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafpackage.html#cfn-mediapackage-packagingconfiguration-cmafpackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafencryption.html
   */
  export interface CmafEncryptionProperty {
    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-cmafencryption.html#cfn-mediapackage-packagingconfiguration-cmafencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnPackagingConfiguration.SpekeKeyProviderProperty;
  }

  /**
   * Parameters for an HLS manifest.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html
   */
  export interface HlsManifestProperty {
    /**
     * This setting controls ad markers in the packaged content.
     *
     * Valid values:
     *
     * - `NONE` - Omits all SCTE-35 ad markers from the output.
     * - `PASSTHROUGH` - Creates a copy in the output of the SCTE-35 ad markers (comments) taken directly from the input manifest.
     * - `SCTE35_ENHANCED` - Generates ad markers and blackout tags in the output based on the SCTE-35 messages from the input manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-admarkers
     */
    readonly adMarkers?: string;

    /**
     * Applies to stream sets with a single video track only.
     *
     * When enabled, the output includes an additional I-frame only stream, along with the other tracks.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-includeiframeonlystream
     */
    readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;

    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this packaging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-manifestname
     */
    readonly manifestName?: string;

    /**
     * Inserts `EXT-X-PROGRAM-DATE-TIME` tags in the output manifest at the interval that you specify.
     *
     * Additionally, ID3Timed metadata messages are generated every 5 seconds starting when the content was ingested.
     *
     * Irrespective of this parameter, if any ID3Timed metadata is in the HLS input, it is passed through to the HLS output.
     *
     * Omit this attribute or enter `0` to indicate that the `EXT-X-PROGRAM-DATE-TIME` tags are not included in the manifest.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-programdatetimeintervalseconds
     */
    readonly programDateTimeIntervalSeconds?: number;

    /**
     * Repeat the `EXT-X-KEY` directive for every media segment.
     *
     * This might result in an increase in client requests to the DRM server.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-repeatextxkey
     */
    readonly repeatExtXKey?: boolean | cdk.IResolvable;

    /**
     * Video bitrate limitations for outputs from this packaging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsmanifest.html#cfn-mediapackage-packagingconfiguration-hlsmanifest-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnPackagingConfiguration.StreamSelectionProperty;
  }

  /**
   * Parameters for a packaging configuration that uses HTTP Live Streaming (HLS) packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html
   */
  export interface HlsPackageProperty {
    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-encryption
     */
    readonly encryption?: CfnPackagingConfiguration.HlsEncryptionProperty | cdk.IResolvable;

    /**
     * A list of HLS manifest configurations that are available from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-hlsmanifests
     */
    readonly hlsManifests: Array<CfnPackagingConfiguration.HlsManifestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * When enabled, MediaPackage passes through digital video broadcasting (DVB) subtitles into the output.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-includedvbsubtitles
     */
    readonly includeDvbSubtitles?: boolean | cdk.IResolvable;

    /**
     * Duration (in seconds) of each fragment.
     *
     * Actual fragments are rounded to the nearest multiple of the source fragment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * When true, AWS Elemental MediaPackage bundles all audio tracks in a rendition group.
     *
     * All other tracks in the stream can be used with any audio rendition from the group.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlspackage.html#cfn-mediapackage-packagingconfiguration-hlspackage-useaudiorenditiongroup
     */
    readonly useAudioRenditionGroup?: boolean | cdk.IResolvable;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html
   */
  export interface HlsEncryptionProperty {
    /**
     * A 128-bit, 16-byte hex value represented by a 32-character string, used with the key for encrypting blocks.
     *
     * If you don't specify a constant initialization vector (IV), AWS Elemental MediaPackage periodically rotates the IV.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html#cfn-mediapackage-packagingconfiguration-hlsencryption-constantinitializationvector
     */
    readonly constantInitializationVector?: string;

    /**
     * HLS encryption type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html#cfn-mediapackage-packagingconfiguration-hlsencryption-encryptionmethod
     */
    readonly encryptionMethod?: string;

    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-hlsencryption.html#cfn-mediapackage-packagingconfiguration-hlsencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnPackagingConfiguration.SpekeKeyProviderProperty;
  }

  /**
   * Parameters for a packaging configuration that uses Dynamic Adaptive Streaming over HTTP (DASH) packaging.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html
   */
  export interface DashPackageProperty {
    /**
     * A list of DASH manifest configurations that are available from this endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-dashmanifests
     */
    readonly dashManifests: Array<CfnPackagingConfiguration.DashManifestProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * Parameters for encrypting content.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-encryption
     */
    readonly encryption?: CfnPackagingConfiguration.DashEncryptionProperty | cdk.IResolvable;

    /**
     * When includeEncoderConfigurationInSegments is set to true, AWS Elemental MediaPackage places your encoder's Sequence Parameter Set (SPS), Picture Parameter Set (PPS), and Video Parameter Set (VPS) metadata in every video segment instead of in the init fragment.
     *
     * This lets you use different SPS/PPS/VPS settings for your assets during content playback.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-includeencoderconfigurationinsegments
     */
    readonly includeEncoderConfigurationInSegments?: boolean | cdk.IResolvable;

    /**
     * This applies only to stream sets with a single video track.
     *
     * When true, the stream set includes an additional I-frame trick-play only stream, along with the other tracks. If false, this extra stream is not included.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-includeiframeonlystream
     */
    readonly includeIframeOnlyStream?: boolean | cdk.IResolvable;

    /**
     * Controls whether AWS Elemental MediaPackage produces single-period or multi-period DASH manifests.
     *
     * For more information about periods, see [Multi-period DASH in AWS Elemental MediaPackage](https://docs.aws.amazon.com/mediapackage/latest/ug/multi-period.html) .
     *
     * Valid values:
     *
     * - `ADS` - AWS Elemental MediaPackage will produce multi-period DASH manifests. Periods are created based on the SCTE-35 ad markers present in the input manifest.
     * - *No value* - AWS Elemental MediaPackage will produce single-period DASH manifests. This is the default setting.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-periodtriggers
     */
    readonly periodTriggers?: Array<string>;

    /**
     * Duration (in seconds) of each fragment.
     *
     * Actual fragments are rounded to the nearest multiple of the source segment duration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-segmentdurationseconds
     */
    readonly segmentDurationSeconds?: number;

    /**
     * Determines the type of SegmentTemplate included in the Media Presentation Description (MPD).
     *
     * When set to `NUMBER_WITH_TIMELINE` , a full timeline is presented in each SegmentTemplate, with $Number$ media URLs. When set to `TIME_WITH_TIMELINE` , a full timeline is presented in each SegmentTemplate, with $Time$ media URLs. When set to `NUMBER_WITH_DURATION` , only a duration is included in each SegmentTemplate, with $Number$ media URLs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashpackage.html#cfn-mediapackage-packagingconfiguration-dashpackage-segmenttemplateformat
     */
    readonly segmentTemplateFormat?: string;
  }

  /**
   * Holds encryption information so that access to the content can be controlled by a DRM solution.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashencryption.html
   */
  export interface DashEncryptionProperty {
    /**
     * Parameters for the SPEKE key provider.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashencryption.html#cfn-mediapackage-packagingconfiguration-dashencryption-spekekeyprovider
     */
    readonly spekeKeyProvider: cdk.IResolvable | CfnPackagingConfiguration.SpekeKeyProviderProperty;
  }

  /**
   * Parameters for a DASH manifest.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html
   */
  export interface DashManifestProperty {
    /**
     * Determines the position of some tags in the Media Presentation Description (MPD).
     *
     * When set to `FULL` , elements like `SegmentTemplate` and `ContentProtection` are included in each `Representation` . When set to `COMPACT` , duplicate elements are combined and presented at the AdaptationSet level.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-manifestlayout
     */
    readonly manifestLayout?: string;

    /**
     * A short string that's appended to the end of the endpoint URL to create a unique path to this packaging configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-manifestname
     */
    readonly manifestName?: string;

    /**
     * Minimum amount of content (measured in seconds) that a player must keep available in the buffer.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-minbuffertimeseconds
     */
    readonly minBufferTimeSeconds?: number;

    /**
     * The DASH profile type.
     *
     * When set to `HBBTV_1_5` , the content is compliant with HbbTV 1.5.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-profile
     */
    readonly profile?: string;

    /**
     * The source of scte markers used.
     *
     * Value description:
     *
     * - `SEGMENTS` - The scte markers are sourced from the segments of the ingested content.
     * - `MANIFEST` - the scte markers are sourced from the manifest of the ingested content. The MANIFEST value is compatible with source HLS playlists using the SCTE-35 Enhanced syntax ( `EXT-OATCLS-SCTE35` tags). SCTE-35 Elemental and SCTE-35 Daterange syntaxes are not supported with this option.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-sctemarkerssource
     */
    readonly scteMarkersSource?: string;

    /**
     * Limitations for outputs from the endpoint, based on the video bitrate.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packagingconfiguration-dashmanifest.html#cfn-mediapackage-packagingconfiguration-dashmanifest-streamselection
     */
    readonly streamSelection?: cdk.IResolvable | CfnPackagingConfiguration.StreamSelectionProperty;
  }
}

/**
 * Properties for defining a `CfnPackagingConfiguration`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html
 */
export interface CfnPackagingConfigurationProps {
  /**
   * Parameters for CMAF packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-cmafpackage
   */
  readonly cmafPackage?: CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable;

  /**
   * Parameters for DASH-ISO packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-dashpackage
   */
  readonly dashPackage?: CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable;

  /**
   * Parameters for Apple HLS packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-hlspackage
   */
  readonly hlsPackage?: CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable;

  /**
   * Unique identifier that you assign to the packaging configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-id
   */
  readonly id: string;

  /**
   * Parameters for Microsoft Smooth Streaming packaging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-msspackage
   */
  readonly mssPackage?: cdk.IResolvable | CfnPackagingConfiguration.MssPackageProperty;

  /**
   * The ID of the packaging group associated with this packaging configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-packaginggroupid
   */
  readonly packagingGroupId: string;

  /**
   * The tags to assign to the packaging configuration.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packagingconfiguration.html#cfn-mediapackage-packagingconfiguration-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `StreamSelectionProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSelectionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationStreamSelectionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("maxVideoBitsPerSecond", cdk.validateNumber)(properties.maxVideoBitsPerSecond));
  errors.collect(cdk.propertyValidator("minVideoBitsPerSecond", cdk.validateNumber)(properties.minVideoBitsPerSecond));
  errors.collect(cdk.propertyValidator("streamOrder", cdk.validateString)(properties.streamOrder));
  return errors.wrap("supplied properties not correct for \"StreamSelectionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationStreamSelectionPropertyValidator(properties).assertSuccess();
  return {
    "MaxVideoBitsPerSecond": cdk.numberToCloudFormation(properties.maxVideoBitsPerSecond),
    "MinVideoBitsPerSecond": cdk.numberToCloudFormation(properties.minVideoBitsPerSecond),
    "StreamOrder": cdk.stringToCloudFormation(properties.streamOrder)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackagingConfiguration.StreamSelectionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.StreamSelectionProperty>();
  ret.addPropertyResult("maxVideoBitsPerSecond", "MaxVideoBitsPerSecond", (properties.MaxVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxVideoBitsPerSecond) : undefined));
  ret.addPropertyResult("minVideoBitsPerSecond", "MinVideoBitsPerSecond", (properties.MinVideoBitsPerSecond != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinVideoBitsPerSecond) : undefined));
  ret.addPropertyResult("streamOrder", "StreamOrder", (properties.StreamOrder != null ? cfn_parse.FromCloudFormation.getString(properties.StreamOrder) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MssManifestProperty`
 *
 * @param properties - the TypeScript properties of a `MssManifestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationMssManifestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("streamSelection", CfnPackagingConfigurationStreamSelectionPropertyValidator)(properties.streamSelection));
  return errors.wrap("supplied properties not correct for \"MssManifestProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationMssManifestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationMssManifestPropertyValidator(properties).assertSuccess();
  return {
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "StreamSelection": convertCfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties.streamSelection)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationMssManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackagingConfiguration.MssManifestProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.MssManifestProperty>();
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
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
function CfnPackagingConfigurationEncryptionContractConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnPackagingConfigurationEncryptionContractConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationEncryptionContractConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "PresetSpeke20Audio": cdk.stringToCloudFormation(properties.presetSpeke20Audio),
    "PresetSpeke20Video": cdk.stringToCloudFormation(properties.presetSpeke20Video)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationEncryptionContractConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.EncryptionContractConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.EncryptionContractConfigurationProperty>();
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
function CfnPackagingConfigurationSpekeKeyProviderPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionContractConfiguration", CfnPackagingConfigurationEncryptionContractConfigurationPropertyValidator)(properties.encryptionContractConfiguration));
  errors.collect(cdk.propertyValidator("roleArn", cdk.requiredValidator)(properties.roleArn));
  errors.collect(cdk.propertyValidator("roleArn", cdk.validateString)(properties.roleArn));
  errors.collect(cdk.propertyValidator("systemIds", cdk.requiredValidator)(properties.systemIds));
  errors.collect(cdk.propertyValidator("systemIds", cdk.listValidator(cdk.validateString))(properties.systemIds));
  errors.collect(cdk.propertyValidator("url", cdk.requiredValidator)(properties.url));
  errors.collect(cdk.propertyValidator("url", cdk.validateString)(properties.url));
  return errors.wrap("supplied properties not correct for \"SpekeKeyProviderProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationSpekeKeyProviderPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionContractConfiguration": convertCfnPackagingConfigurationEncryptionContractConfigurationPropertyToCloudFormation(properties.encryptionContractConfiguration),
    "RoleArn": cdk.stringToCloudFormation(properties.roleArn),
    "SystemIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.systemIds),
    "Url": cdk.stringToCloudFormation(properties.url)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackagingConfiguration.SpekeKeyProviderProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.SpekeKeyProviderProperty>();
  ret.addPropertyResult("encryptionContractConfiguration", "EncryptionContractConfiguration", (properties.EncryptionContractConfiguration != null ? CfnPackagingConfigurationEncryptionContractConfigurationPropertyFromCloudFormation(properties.EncryptionContractConfiguration) : undefined));
  ret.addPropertyResult("roleArn", "RoleArn", (properties.RoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.RoleArn) : undefined));
  ret.addPropertyResult("systemIds", "SystemIds", (properties.SystemIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SystemIds) : undefined));
  ret.addPropertyResult("url", "Url", (properties.Url != null ? cfn_parse.FromCloudFormation.getString(properties.Url) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MssEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `MssEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationMssEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnPackagingConfigurationSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"MssEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationMssEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationMssEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "SpekeKeyProvider": convertCfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationMssEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackagingConfiguration.MssEncryptionProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.MssEncryptionProperty>();
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MssPackageProperty`
 *
 * @param properties - the TypeScript properties of a `MssPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationMssPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryption", CfnPackagingConfigurationMssEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("mssManifests", cdk.requiredValidator)(properties.mssManifests));
  errors.collect(cdk.propertyValidator("mssManifests", cdk.listValidator(CfnPackagingConfigurationMssManifestPropertyValidator))(properties.mssManifests));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  return errors.wrap("supplied properties not correct for \"MssPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationMssPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationMssPackagePropertyValidator(properties).assertSuccess();
  return {
    "Encryption": convertCfnPackagingConfigurationMssEncryptionPropertyToCloudFormation(properties.encryption),
    "MssManifests": cdk.listMapper(convertCfnPackagingConfigurationMssManifestPropertyToCloudFormation)(properties.mssManifests),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationMssPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackagingConfiguration.MssPackageProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.MssPackageProperty>();
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnPackagingConfigurationMssEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("mssManifests", "MssManifests", (properties.MssManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationMssManifestPropertyFromCloudFormation)(properties.MssManifests) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CmafEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `CmafEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationCmafEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnPackagingConfigurationSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"CmafEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationCmafEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationCmafEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "SpekeKeyProvider": convertCfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationCmafEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.CmafEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.CmafEncryptionProperty>();
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsManifestProperty`
 *
 * @param properties - the TypeScript properties of a `HlsManifestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationHlsManifestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("adMarkers", cdk.validateString)(properties.adMarkers));
  errors.collect(cdk.propertyValidator("includeIframeOnlyStream", cdk.validateBoolean)(properties.includeIframeOnlyStream));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("programDateTimeIntervalSeconds", cdk.validateNumber)(properties.programDateTimeIntervalSeconds));
  errors.collect(cdk.propertyValidator("repeatExtXKey", cdk.validateBoolean)(properties.repeatExtXKey));
  errors.collect(cdk.propertyValidator("streamSelection", CfnPackagingConfigurationStreamSelectionPropertyValidator)(properties.streamSelection));
  return errors.wrap("supplied properties not correct for \"HlsManifestProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationHlsManifestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationHlsManifestPropertyValidator(properties).assertSuccess();
  return {
    "AdMarkers": cdk.stringToCloudFormation(properties.adMarkers),
    "IncludeIframeOnlyStream": cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "ProgramDateTimeIntervalSeconds": cdk.numberToCloudFormation(properties.programDateTimeIntervalSeconds),
    "RepeatExtXKey": cdk.booleanToCloudFormation(properties.repeatExtXKey),
    "StreamSelection": convertCfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties.streamSelection)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationHlsManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.HlsManifestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.HlsManifestProperty>();
  ret.addPropertyResult("adMarkers", "AdMarkers", (properties.AdMarkers != null ? cfn_parse.FromCloudFormation.getString(properties.AdMarkers) : undefined));
  ret.addPropertyResult("includeIframeOnlyStream", "IncludeIframeOnlyStream", (properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("programDateTimeIntervalSeconds", "ProgramDateTimeIntervalSeconds", (properties.ProgramDateTimeIntervalSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.ProgramDateTimeIntervalSeconds) : undefined));
  ret.addPropertyResult("repeatExtXKey", "RepeatExtXKey", (properties.RepeatExtXKey != null ? cfn_parse.FromCloudFormation.getBoolean(properties.RepeatExtXKey) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CmafPackageProperty`
 *
 * @param properties - the TypeScript properties of a `CmafPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationCmafPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryption", CfnPackagingConfigurationCmafEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("hlsManifests", cdk.requiredValidator)(properties.hlsManifests));
  errors.collect(cdk.propertyValidator("hlsManifests", cdk.listValidator(CfnPackagingConfigurationHlsManifestPropertyValidator))(properties.hlsManifests));
  errors.collect(cdk.propertyValidator("includeEncoderConfigurationInSegments", cdk.validateBoolean)(properties.includeEncoderConfigurationInSegments));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  return errors.wrap("supplied properties not correct for \"CmafPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationCmafPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationCmafPackagePropertyValidator(properties).assertSuccess();
  return {
    "Encryption": convertCfnPackagingConfigurationCmafEncryptionPropertyToCloudFormation(properties.encryption),
    "HlsManifests": cdk.listMapper(convertCfnPackagingConfigurationHlsManifestPropertyToCloudFormation)(properties.hlsManifests),
    "IncludeEncoderConfigurationInSegments": cdk.booleanToCloudFormation(properties.includeEncoderConfigurationInSegments),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationCmafPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.CmafPackageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.CmafPackageProperty>();
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnPackagingConfigurationCmafEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("hlsManifests", "HlsManifests", (properties.HlsManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationHlsManifestPropertyFromCloudFormation)(properties.HlsManifests) : undefined));
  ret.addPropertyResult("includeEncoderConfigurationInSegments", "IncludeEncoderConfigurationInSegments", (properties.IncludeEncoderConfigurationInSegments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeEncoderConfigurationInSegments) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `HlsEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationHlsEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("constantInitializationVector", cdk.validateString)(properties.constantInitializationVector));
  errors.collect(cdk.propertyValidator("encryptionMethod", cdk.validateString)(properties.encryptionMethod));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnPackagingConfigurationSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"HlsEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationHlsEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationHlsEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "ConstantInitializationVector": cdk.stringToCloudFormation(properties.constantInitializationVector),
    "EncryptionMethod": cdk.stringToCloudFormation(properties.encryptionMethod),
    "SpekeKeyProvider": convertCfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationHlsEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.HlsEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.HlsEncryptionProperty>();
  ret.addPropertyResult("constantInitializationVector", "ConstantInitializationVector", (properties.ConstantInitializationVector != null ? cfn_parse.FromCloudFormation.getString(properties.ConstantInitializationVector) : undefined));
  ret.addPropertyResult("encryptionMethod", "EncryptionMethod", (properties.EncryptionMethod != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionMethod) : undefined));
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HlsPackageProperty`
 *
 * @param properties - the TypeScript properties of a `HlsPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationHlsPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryption", CfnPackagingConfigurationHlsEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("hlsManifests", cdk.requiredValidator)(properties.hlsManifests));
  errors.collect(cdk.propertyValidator("hlsManifests", cdk.listValidator(CfnPackagingConfigurationHlsManifestPropertyValidator))(properties.hlsManifests));
  errors.collect(cdk.propertyValidator("includeDvbSubtitles", cdk.validateBoolean)(properties.includeDvbSubtitles));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("useAudioRenditionGroup", cdk.validateBoolean)(properties.useAudioRenditionGroup));
  return errors.wrap("supplied properties not correct for \"HlsPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationHlsPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationHlsPackagePropertyValidator(properties).assertSuccess();
  return {
    "Encryption": convertCfnPackagingConfigurationHlsEncryptionPropertyToCloudFormation(properties.encryption),
    "HlsManifests": cdk.listMapper(convertCfnPackagingConfigurationHlsManifestPropertyToCloudFormation)(properties.hlsManifests),
    "IncludeDvbSubtitles": cdk.booleanToCloudFormation(properties.includeDvbSubtitles),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "UseAudioRenditionGroup": cdk.booleanToCloudFormation(properties.useAudioRenditionGroup)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationHlsPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.HlsPackageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.HlsPackageProperty>();
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnPackagingConfigurationHlsEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("hlsManifests", "HlsManifests", (properties.HlsManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationHlsManifestPropertyFromCloudFormation)(properties.HlsManifests) : undefined));
  ret.addPropertyResult("includeDvbSubtitles", "IncludeDvbSubtitles", (properties.IncludeDvbSubtitles != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeDvbSubtitles) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("useAudioRenditionGroup", "UseAudioRenditionGroup", (properties.UseAudioRenditionGroup != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseAudioRenditionGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashEncryptionProperty`
 *
 * @param properties - the TypeScript properties of a `DashEncryptionProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationDashEncryptionPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("spekeKeyProvider", cdk.requiredValidator)(properties.spekeKeyProvider));
  errors.collect(cdk.propertyValidator("spekeKeyProvider", CfnPackagingConfigurationSpekeKeyProviderPropertyValidator)(properties.spekeKeyProvider));
  return errors.wrap("supplied properties not correct for \"DashEncryptionProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationDashEncryptionPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationDashEncryptionPropertyValidator(properties).assertSuccess();
  return {
    "SpekeKeyProvider": convertCfnPackagingConfigurationSpekeKeyProviderPropertyToCloudFormation(properties.spekeKeyProvider)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationDashEncryptionPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.DashEncryptionProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.DashEncryptionProperty>();
  ret.addPropertyResult("spekeKeyProvider", "SpekeKeyProvider", (properties.SpekeKeyProvider != null ? CfnPackagingConfigurationSpekeKeyProviderPropertyFromCloudFormation(properties.SpekeKeyProvider) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashManifestProperty`
 *
 * @param properties - the TypeScript properties of a `DashManifestProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationDashManifestPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("manifestLayout", cdk.validateString)(properties.manifestLayout));
  errors.collect(cdk.propertyValidator("manifestName", cdk.validateString)(properties.manifestName));
  errors.collect(cdk.propertyValidator("minBufferTimeSeconds", cdk.validateNumber)(properties.minBufferTimeSeconds));
  errors.collect(cdk.propertyValidator("profile", cdk.validateString)(properties.profile));
  errors.collect(cdk.propertyValidator("scteMarkersSource", cdk.validateString)(properties.scteMarkersSource));
  errors.collect(cdk.propertyValidator("streamSelection", CfnPackagingConfigurationStreamSelectionPropertyValidator)(properties.streamSelection));
  return errors.wrap("supplied properties not correct for \"DashManifestProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationDashManifestPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationDashManifestPropertyValidator(properties).assertSuccess();
  return {
    "ManifestLayout": cdk.stringToCloudFormation(properties.manifestLayout),
    "ManifestName": cdk.stringToCloudFormation(properties.manifestName),
    "MinBufferTimeSeconds": cdk.numberToCloudFormation(properties.minBufferTimeSeconds),
    "Profile": cdk.stringToCloudFormation(properties.profile),
    "ScteMarkersSource": cdk.stringToCloudFormation(properties.scteMarkersSource),
    "StreamSelection": convertCfnPackagingConfigurationStreamSelectionPropertyToCloudFormation(properties.streamSelection)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationDashManifestPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.DashManifestProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.DashManifestProperty>();
  ret.addPropertyResult("manifestLayout", "ManifestLayout", (properties.ManifestLayout != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestLayout) : undefined));
  ret.addPropertyResult("manifestName", "ManifestName", (properties.ManifestName != null ? cfn_parse.FromCloudFormation.getString(properties.ManifestName) : undefined));
  ret.addPropertyResult("minBufferTimeSeconds", "MinBufferTimeSeconds", (properties.MinBufferTimeSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinBufferTimeSeconds) : undefined));
  ret.addPropertyResult("profile", "Profile", (properties.Profile != null ? cfn_parse.FromCloudFormation.getString(properties.Profile) : undefined));
  ret.addPropertyResult("scteMarkersSource", "ScteMarkersSource", (properties.ScteMarkersSource != null ? cfn_parse.FromCloudFormation.getString(properties.ScteMarkersSource) : undefined));
  ret.addPropertyResult("streamSelection", "StreamSelection", (properties.StreamSelection != null ? CfnPackagingConfigurationStreamSelectionPropertyFromCloudFormation(properties.StreamSelection) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DashPackageProperty`
 *
 * @param properties - the TypeScript properties of a `DashPackageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationDashPackagePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dashManifests", cdk.requiredValidator)(properties.dashManifests));
  errors.collect(cdk.propertyValidator("dashManifests", cdk.listValidator(CfnPackagingConfigurationDashManifestPropertyValidator))(properties.dashManifests));
  errors.collect(cdk.propertyValidator("encryption", CfnPackagingConfigurationDashEncryptionPropertyValidator)(properties.encryption));
  errors.collect(cdk.propertyValidator("includeEncoderConfigurationInSegments", cdk.validateBoolean)(properties.includeEncoderConfigurationInSegments));
  errors.collect(cdk.propertyValidator("includeIframeOnlyStream", cdk.validateBoolean)(properties.includeIframeOnlyStream));
  errors.collect(cdk.propertyValidator("periodTriggers", cdk.listValidator(cdk.validateString))(properties.periodTriggers));
  errors.collect(cdk.propertyValidator("segmentDurationSeconds", cdk.validateNumber)(properties.segmentDurationSeconds));
  errors.collect(cdk.propertyValidator("segmentTemplateFormat", cdk.validateString)(properties.segmentTemplateFormat));
  return errors.wrap("supplied properties not correct for \"DashPackageProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationDashPackagePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationDashPackagePropertyValidator(properties).assertSuccess();
  return {
    "DashManifests": cdk.listMapper(convertCfnPackagingConfigurationDashManifestPropertyToCloudFormation)(properties.dashManifests),
    "Encryption": convertCfnPackagingConfigurationDashEncryptionPropertyToCloudFormation(properties.encryption),
    "IncludeEncoderConfigurationInSegments": cdk.booleanToCloudFormation(properties.includeEncoderConfigurationInSegments),
    "IncludeIframeOnlyStream": cdk.booleanToCloudFormation(properties.includeIframeOnlyStream),
    "PeriodTriggers": cdk.listMapper(cdk.stringToCloudFormation)(properties.periodTriggers),
    "SegmentDurationSeconds": cdk.numberToCloudFormation(properties.segmentDurationSeconds),
    "SegmentTemplateFormat": cdk.stringToCloudFormation(properties.segmentTemplateFormat)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationDashPackagePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfiguration.DashPackageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfiguration.DashPackageProperty>();
  ret.addPropertyResult("dashManifests", "DashManifests", (properties.DashManifests != null ? cfn_parse.FromCloudFormation.getArray(CfnPackagingConfigurationDashManifestPropertyFromCloudFormation)(properties.DashManifests) : undefined));
  ret.addPropertyResult("encryption", "Encryption", (properties.Encryption != null ? CfnPackagingConfigurationDashEncryptionPropertyFromCloudFormation(properties.Encryption) : undefined));
  ret.addPropertyResult("includeEncoderConfigurationInSegments", "IncludeEncoderConfigurationInSegments", (properties.IncludeEncoderConfigurationInSegments != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeEncoderConfigurationInSegments) : undefined));
  ret.addPropertyResult("includeIframeOnlyStream", "IncludeIframeOnlyStream", (properties.IncludeIframeOnlyStream != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeIframeOnlyStream) : undefined));
  ret.addPropertyResult("periodTriggers", "PeriodTriggers", (properties.PeriodTriggers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.PeriodTriggers) : undefined));
  ret.addPropertyResult("segmentDurationSeconds", "SegmentDurationSeconds", (properties.SegmentDurationSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.SegmentDurationSeconds) : undefined));
  ret.addPropertyResult("segmentTemplateFormat", "SegmentTemplateFormat", (properties.SegmentTemplateFormat != null ? cfn_parse.FromCloudFormation.getString(properties.SegmentTemplateFormat) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPackagingConfigurationProps`
 *
 * @param properties - the TypeScript properties of a `CfnPackagingConfigurationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingConfigurationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cmafPackage", CfnPackagingConfigurationCmafPackagePropertyValidator)(properties.cmafPackage));
  errors.collect(cdk.propertyValidator("dashPackage", CfnPackagingConfigurationDashPackagePropertyValidator)(properties.dashPackage));
  errors.collect(cdk.propertyValidator("hlsPackage", CfnPackagingConfigurationHlsPackagePropertyValidator)(properties.hlsPackage));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("mssPackage", CfnPackagingConfigurationMssPackagePropertyValidator)(properties.mssPackage));
  errors.collect(cdk.propertyValidator("packagingGroupId", cdk.requiredValidator)(properties.packagingGroupId));
  errors.collect(cdk.propertyValidator("packagingGroupId", cdk.validateString)(properties.packagingGroupId));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPackagingConfigurationProps\"");
}

// @ts-ignore TS6133
function convertCfnPackagingConfigurationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingConfigurationPropsValidator(properties).assertSuccess();
  return {
    "CmafPackage": convertCfnPackagingConfigurationCmafPackagePropertyToCloudFormation(properties.cmafPackage),
    "DashPackage": convertCfnPackagingConfigurationDashPackagePropertyToCloudFormation(properties.dashPackage),
    "HlsPackage": convertCfnPackagingConfigurationHlsPackagePropertyToCloudFormation(properties.hlsPackage),
    "Id": cdk.stringToCloudFormation(properties.id),
    "MssPackage": convertCfnPackagingConfigurationMssPackagePropertyToCloudFormation(properties.mssPackage),
    "PackagingGroupId": cdk.stringToCloudFormation(properties.packagingGroupId),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPackagingConfigurationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingConfigurationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingConfigurationProps>();
  ret.addPropertyResult("cmafPackage", "CmafPackage", (properties.CmafPackage != null ? CfnPackagingConfigurationCmafPackagePropertyFromCloudFormation(properties.CmafPackage) : undefined));
  ret.addPropertyResult("dashPackage", "DashPackage", (properties.DashPackage != null ? CfnPackagingConfigurationDashPackagePropertyFromCloudFormation(properties.DashPackage) : undefined));
  ret.addPropertyResult("hlsPackage", "HlsPackage", (properties.HlsPackage != null ? CfnPackagingConfigurationHlsPackagePropertyFromCloudFormation(properties.HlsPackage) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("mssPackage", "MssPackage", (properties.MssPackage != null ? CfnPackagingConfigurationMssPackagePropertyFromCloudFormation(properties.MssPackage) : undefined));
  ret.addPropertyResult("packagingGroupId", "PackagingGroupId", (properties.PackagingGroupId != null ? cfn_parse.FromCloudFormation.getString(properties.PackagingGroupId) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Creates a packaging group.
 *
 * The packaging group holds one or more packaging configurations. When you create an asset, you specify the packaging group associated with the asset. The asset has playback endpoints for each packaging configuration within the group.
 *
 * @cloudformationResource AWS::MediaPackage::PackagingGroup
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html
 */
export class CfnPackagingGroup extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MediaPackage::PackagingGroup";

  /**
   * Build a CfnPackagingGroup from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPackagingGroup {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPackagingGroupPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPackagingGroup(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The Amazon Resource Name (ARN) for the packaging group. You can get this from the response to any request to the packaging group.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The URL for the assets in the PackagingGroup.
   *
   * @cloudformationAttribute DomainName
   */
  public readonly attrDomainName: string;

  /**
   * Parameters for CDN authorization.
   */
  public authorization?: CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable;

  /**
   * The configuration parameters for egress access logging.
   */
  public egressAccessLogs?: cdk.IResolvable | CfnPackagingGroup.LogConfigurationProperty;

  /**
   * Unique identifier that you assign to the packaging group.
   */
  public id: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags to assign to the packaging group.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPackagingGroupProps) {
    super(scope, id, {
      "type": CfnPackagingGroup.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "id", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrDomainName = cdk.Token.asString(this.getAtt("DomainName", cdk.ResolutionTypeHint.STRING));
    this.authorization = props.authorization;
    this.egressAccessLogs = props.egressAccessLogs;
    this.id = props.id;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::MediaPackage::PackagingGroup", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "authorization": this.authorization,
      "egressAccessLogs": this.egressAccessLogs,
      "id": this.id,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPackagingGroup.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPackagingGroupPropsToCloudFormation(props);
  }
}

export namespace CfnPackagingGroup {
  /**
   * Parameters for enabling CDN authorization.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html
   */
  export interface AuthorizationProperty {
    /**
     * The Amazon Resource Name (ARN) for the secret in AWS Secrets Manager that is used for CDN authorization.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html#cfn-mediapackage-packaginggroup-authorization-cdnidentifiersecret
     */
    readonly cdnIdentifierSecret: string;

    /**
     * The Amazon Resource Name (ARN) for the IAM role that allows AWS Elemental MediaPackage to communicate with AWS Secrets Manager .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-authorization.html#cfn-mediapackage-packaginggroup-authorization-secretsrolearn
     */
    readonly secretsRoleArn: string;
  }

  /**
   * Sets a custom Amazon CloudWatch log group name for egress logs.
   *
   * If a log group name isn't specified, the default name is used: /aws/MediaPackage/EgressAccessLogs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-logconfiguration.html
   */
  export interface LogConfigurationProperty {
    /**
     * Sets a custom Amazon CloudWatch log group name for egress logs.
     *
     * If a log group name isn't specified, the default name is used: /aws/MediaPackage/EgressAccessLogs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mediapackage-packaginggroup-logconfiguration.html#cfn-mediapackage-packaginggroup-logconfiguration-loggroupname
     */
    readonly logGroupName?: string;
  }
}

/**
 * Properties for defining a `CfnPackagingGroup`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html
 */
export interface CfnPackagingGroupProps {
  /**
   * Parameters for CDN authorization.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-authorization
   */
  readonly authorization?: CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable;

  /**
   * The configuration parameters for egress access logging.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-egressaccesslogs
   */
  readonly egressAccessLogs?: cdk.IResolvable | CfnPackagingGroup.LogConfigurationProperty;

  /**
   * Unique identifier that you assign to the packaging group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-id
   */
  readonly id: string;

  /**
   * The tags to assign to the packaging group.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mediapackage-packaginggroup.html#cfn-mediapackage-packaginggroup-tags
   */
  readonly tags?: Array<cdk.CfnTag>;
}

/**
 * Determine whether the given properties match those of a `AuthorizationProperty`
 *
 * @param properties - the TypeScript properties of a `AuthorizationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingGroupAuthorizationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cdnIdentifierSecret", cdk.requiredValidator)(properties.cdnIdentifierSecret));
  errors.collect(cdk.propertyValidator("cdnIdentifierSecret", cdk.validateString)(properties.cdnIdentifierSecret));
  errors.collect(cdk.propertyValidator("secretsRoleArn", cdk.requiredValidator)(properties.secretsRoleArn));
  errors.collect(cdk.propertyValidator("secretsRoleArn", cdk.validateString)(properties.secretsRoleArn));
  return errors.wrap("supplied properties not correct for \"AuthorizationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingGroupAuthorizationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingGroupAuthorizationPropertyValidator(properties).assertSuccess();
  return {
    "CdnIdentifierSecret": cdk.stringToCloudFormation(properties.cdnIdentifierSecret),
    "SecretsRoleArn": cdk.stringToCloudFormation(properties.secretsRoleArn)
  };
}

// @ts-ignore TS6133
function CfnPackagingGroupAuthorizationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingGroup.AuthorizationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingGroup.AuthorizationProperty>();
  ret.addPropertyResult("cdnIdentifierSecret", "CdnIdentifierSecret", (properties.CdnIdentifierSecret != null ? cfn_parse.FromCloudFormation.getString(properties.CdnIdentifierSecret) : undefined));
  ret.addPropertyResult("secretsRoleArn", "SecretsRoleArn", (properties.SecretsRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretsRoleArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LogConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingGroupLogConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  return errors.wrap("supplied properties not correct for \"LogConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPackagingGroupLogConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingGroupLogConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName)
  };
}

// @ts-ignore TS6133
function CfnPackagingGroupLogConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPackagingGroup.LogConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingGroup.LogConfigurationProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPackagingGroupProps`
 *
 * @param properties - the TypeScript properties of a `CfnPackagingGroupProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPackagingGroupPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorization", CfnPackagingGroupAuthorizationPropertyValidator)(properties.authorization));
  errors.collect(cdk.propertyValidator("egressAccessLogs", CfnPackagingGroupLogConfigurationPropertyValidator)(properties.egressAccessLogs));
  errors.collect(cdk.propertyValidator("id", cdk.requiredValidator)(properties.id));
  errors.collect(cdk.propertyValidator("id", cdk.validateString)(properties.id));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnPackagingGroupProps\"");
}

// @ts-ignore TS6133
function convertCfnPackagingGroupPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPackagingGroupPropsValidator(properties).assertSuccess();
  return {
    "Authorization": convertCfnPackagingGroupAuthorizationPropertyToCloudFormation(properties.authorization),
    "EgressAccessLogs": convertCfnPackagingGroupLogConfigurationPropertyToCloudFormation(properties.egressAccessLogs),
    "Id": cdk.stringToCloudFormation(properties.id),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnPackagingGroupPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPackagingGroupProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPackagingGroupProps>();
  ret.addPropertyResult("authorization", "Authorization", (properties.Authorization != null ? CfnPackagingGroupAuthorizationPropertyFromCloudFormation(properties.Authorization) : undefined));
  ret.addPropertyResult("egressAccessLogs", "EgressAccessLogs", (properties.EgressAccessLogs != null ? CfnPackagingGroupLogConfigurationPropertyFromCloudFormation(properties.EgressAccessLogs) : undefined));
  ret.addPropertyResult("id", "Id", (properties.Id != null ? cfn_parse.FromCloudFormation.getString(properties.Id) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}