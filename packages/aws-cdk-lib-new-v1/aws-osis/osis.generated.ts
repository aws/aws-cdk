/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The AWS::OSIS::Pipeline resource creates an Amazon OpenSearch Ingestion pipeline.
 *
 * @cloudformationResource AWS::OSIS::Pipeline
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html
 */
export class CfnPipeline extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::OSIS::Pipeline";

  /**
   * Build a CfnPipeline from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnPipeline {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnPipelinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnPipeline(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * A list of the ingestion endpoints for the pipeline that you can send data to. Currently, only a single ingestion endpoint is supported for a pipeline. For example, `my-pipeline-123456789012.us-east-1.osis.amazonaws.com` .
   *
   * @cloudformationAttribute IngestEndpointUrls
   */
  public readonly attrIngestEndpointUrls: Array<string>;

  /**
   * The Amazon Resource Name (ARN) of the pipeline.
   *
   * @cloudformationAttribute PipelineArn
   */
  public readonly attrPipelineArn: string;

  /**
   * The VPC interface endpoints that have access to the pipeline.
   *
   * @cloudformationAttribute VpcEndpoints
   */
  public readonly attrVpcEndpoints: cdk.IResolvable;

  /**
   * Options that specify the configuration of a persistent buffer.
   */
  public bufferOptions?: CfnPipeline.BufferOptionsProperty | cdk.IResolvable;

  /**
   * Options to control how OpenSearch encrypts all data-at-rest.
   */
  public encryptionAtRestOptions?: CfnPipeline.EncryptionAtRestOptionsProperty | cdk.IResolvable;

  /**
   * Key-value pairs that represent log publishing settings.
   */
  public logPublishingOptions?: cdk.IResolvable | CfnPipeline.LogPublishingOptionsProperty;

  /**
   * The maximum pipeline capacity, in Ingestion Compute Units (ICUs).
   */
  public maxUnits: number;

  /**
   * The minimum pipeline capacity, in Ingestion Compute Units (ICUs).
   */
  public minUnits: number;

  /**
   * The Data Prepper pipeline configuration in YAML format.
   */
  public pipelineConfigurationBody: string;

  /**
   * The name of the pipeline.
   */
  public pipelineName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * List of tags to add to the pipeline upon creation.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * Options that specify the subnets and security groups for an OpenSearch Ingestion VPC endpoint.
   */
  public vpcOptions?: cdk.IResolvable | CfnPipeline.VpcOptionsProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnPipelineProps) {
    super(scope, id, {
      "type": CfnPipeline.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "maxUnits", this);
    cdk.requireProperty(props, "minUnits", this);
    cdk.requireProperty(props, "pipelineConfigurationBody", this);
    cdk.requireProperty(props, "pipelineName", this);

    this.attrIngestEndpointUrls = cdk.Token.asList(this.getAtt("IngestEndpointUrls", cdk.ResolutionTypeHint.STRING_LIST));
    this.attrPipelineArn = cdk.Token.asString(this.getAtt("PipelineArn", cdk.ResolutionTypeHint.STRING));
    this.attrVpcEndpoints = this.getAtt("VpcEndpoints");
    this.bufferOptions = props.bufferOptions;
    this.encryptionAtRestOptions = props.encryptionAtRestOptions;
    this.logPublishingOptions = props.logPublishingOptions;
    this.maxUnits = props.maxUnits;
    this.minUnits = props.minUnits;
    this.pipelineConfigurationBody = props.pipelineConfigurationBody;
    this.pipelineName = props.pipelineName;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::OSIS::Pipeline", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.vpcOptions = props.vpcOptions;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "bufferOptions": this.bufferOptions,
      "encryptionAtRestOptions": this.encryptionAtRestOptions,
      "logPublishingOptions": this.logPublishingOptions,
      "maxUnits": this.maxUnits,
      "minUnits": this.minUnits,
      "pipelineConfigurationBody": this.pipelineConfigurationBody,
      "pipelineName": this.pipelineName,
      "tags": this.tags.renderTags(),
      "vpcOptions": this.vpcOptions
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnPipeline.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnPipelinePropsToCloudFormation(props);
  }
}

export namespace CfnPipeline {
  /**
   * Options that specify the subnets and security groups for an OpenSearch Ingestion VPC endpoint.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcoptions.html
   */
  export interface VpcOptionsProperty {
    /**
     * A list of security groups associated with the VPC endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcoptions.html#cfn-osis-pipeline-vpcoptions-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * A list of subnet IDs associated with the VPC endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcoptions.html#cfn-osis-pipeline-vpcoptions-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * Container for the values required to configure logging for the pipeline.
   *
   * If you don't specify these values, OpenSearch Ingestion will not publish logs from your application to CloudWatch Logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-logpublishingoptions.html
   */
  export interface LogPublishingOptionsProperty {
    /**
     * The destination for OpenSearch Ingestion logs sent to Amazon CloudWatch Logs.
     *
     * This parameter is required if `IsLoggingEnabled` is set to `true` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-logpublishingoptions.html#cfn-osis-pipeline-logpublishingoptions-cloudwatchlogdestination
     */
    readonly cloudWatchLogDestination?: CfnPipeline.CloudWatchLogDestinationProperty | cdk.IResolvable;

    /**
     * Whether logs should be published.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-logpublishingoptions.html#cfn-osis-pipeline-logpublishingoptions-isloggingenabled
     */
    readonly isLoggingEnabled?: boolean | cdk.IResolvable;
  }

  /**
   * The destination for OpenSearch Ingestion logs sent to Amazon CloudWatch.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-cloudwatchlogdestination.html
   */
  export interface CloudWatchLogDestinationProperty {
    /**
     * The name of the CloudWatch Logs group to send pipeline logs to.
     *
     * You can specify an existing log group or create a new one. For example, `/aws/OpenSearchService/IngestionService/my-pipeline` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-cloudwatchlogdestination.html#cfn-osis-pipeline-cloudwatchlogdestination-loggroup
     */
    readonly logGroup: string;
  }

  /**
   * Options that specify the configuration of a persistent buffer.
   *
   * To configure how OpenSearch Ingestion encrypts this data, set the EncryptionAtRestOptions.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-bufferoptions.html
   */
  export interface BufferOptionsProperty {
    /**
     * Whether persistent buffering should be enabled.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-bufferoptions.html#cfn-osis-pipeline-bufferoptions-persistentbufferenabled
     */
    readonly persistentBufferEnabled: boolean | cdk.IResolvable;
  }

  /**
   * Options to control how OpenSearch encrypts all data-at-rest.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-encryptionatrestoptions.html
   */
  export interface EncryptionAtRestOptionsProperty {
    /**
     * The ARN of the KMS key used to encrypt data-at-rest in OpenSearch Ingestion.
     *
     * By default, data is encrypted using an AWS owned key.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-encryptionatrestoptions.html#cfn-osis-pipeline-encryptionatrestoptions-kmskeyarn
     */
    readonly kmsKeyArn: string;
  }

  /**
   * An OpenSearch Ingestion-managed VPC endpoint that will access one or more pipelines.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcendpoint.html
   */
  export interface VpcEndpointProperty {
    /**
     * The unique identifier of the endpoint.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcendpoint.html#cfn-osis-pipeline-vpcendpoint-vpcendpointid
     */
    readonly vpcEndpointId?: string;

    /**
     * The ID for your VPC.
     *
     * AWS PrivateLink generates this value when you create a VPC.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcendpoint.html#cfn-osis-pipeline-vpcendpoint-vpcid
     */
    readonly vpcId?: string;

    /**
     * Information about the VPC, including associated subnets and security groups.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-osis-pipeline-vpcendpoint.html#cfn-osis-pipeline-vpcendpoint-vpcoptions
     */
    readonly vpcOptions?: cdk.IResolvable | CfnPipeline.VpcOptionsProperty;
  }
}

/**
 * Properties for defining a `CfnPipeline`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html
 */
export interface CfnPipelineProps {
  /**
   * Options that specify the configuration of a persistent buffer.
   *
   * To configure how OpenSearch Ingestion encrypts this data, set the EncryptionAtRestOptions.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-bufferoptions
   */
  readonly bufferOptions?: CfnPipeline.BufferOptionsProperty | cdk.IResolvable;

  /**
   * Options to control how OpenSearch encrypts all data-at-rest.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-encryptionatrestoptions
   */
  readonly encryptionAtRestOptions?: CfnPipeline.EncryptionAtRestOptionsProperty | cdk.IResolvable;

  /**
   * Key-value pairs that represent log publishing settings.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-logpublishingoptions
   */
  readonly logPublishingOptions?: cdk.IResolvable | CfnPipeline.LogPublishingOptionsProperty;

  /**
   * The maximum pipeline capacity, in Ingestion Compute Units (ICUs).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-maxunits
   */
  readonly maxUnits: number;

  /**
   * The minimum pipeline capacity, in Ingestion Compute Units (ICUs).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-minunits
   */
  readonly minUnits: number;

  /**
   * The Data Prepper pipeline configuration in YAML format.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-pipelineconfigurationbody
   */
  readonly pipelineConfigurationBody: string;

  /**
   * The name of the pipeline.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-pipelinename
   */
  readonly pipelineName: string;

  /**
   * List of tags to add to the pipeline upon creation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * Options that specify the subnets and security groups for an OpenSearch Ingestion VPC endpoint.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-osis-pipeline.html#cfn-osis-pipeline-vpcoptions
   */
  readonly vpcOptions?: cdk.IResolvable | CfnPipeline.VpcOptionsProperty;
}

/**
 * Determine whether the given properties match those of a `VpcOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `VpcOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineVpcOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineVpcOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineVpcOptionsPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnPipelineVpcOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.VpcOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.VpcOptionsProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineCloudWatchLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroup", cdk.requiredValidator)(properties.logGroup));
  errors.collect(cdk.propertyValidator("logGroup", cdk.validateString)(properties.logGroup));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineCloudWatchLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineCloudWatchLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "LogGroup": cdk.stringToCloudFormation(properties.logGroup)
  };
}

// @ts-ignore TS6133
function CfnPipelineCloudWatchLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.CloudWatchLogDestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.CloudWatchLogDestinationProperty>();
  ret.addPropertyResult("logGroup", "LogGroup", (properties.LogGroup != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogPublishingOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `LogPublishingOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineLogPublishingOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogDestination", CfnPipelineCloudWatchLogDestinationPropertyValidator)(properties.cloudWatchLogDestination));
  errors.collect(cdk.propertyValidator("isLoggingEnabled", cdk.validateBoolean)(properties.isLoggingEnabled));
  return errors.wrap("supplied properties not correct for \"LogPublishingOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineLogPublishingOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineLogPublishingOptionsPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogDestination": convertCfnPipelineCloudWatchLogDestinationPropertyToCloudFormation(properties.cloudWatchLogDestination),
    "IsLoggingEnabled": cdk.booleanToCloudFormation(properties.isLoggingEnabled)
  };
}

// @ts-ignore TS6133
function CfnPipelineLogPublishingOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.LogPublishingOptionsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.LogPublishingOptionsProperty>();
  ret.addPropertyResult("cloudWatchLogDestination", "CloudWatchLogDestination", (properties.CloudWatchLogDestination != null ? CfnPipelineCloudWatchLogDestinationPropertyFromCloudFormation(properties.CloudWatchLogDestination) : undefined));
  ret.addPropertyResult("isLoggingEnabled", "IsLoggingEnabled", (properties.IsLoggingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IsLoggingEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BufferOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `BufferOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineBufferOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("persistentBufferEnabled", cdk.requiredValidator)(properties.persistentBufferEnabled));
  errors.collect(cdk.propertyValidator("persistentBufferEnabled", cdk.validateBoolean)(properties.persistentBufferEnabled));
  return errors.wrap("supplied properties not correct for \"BufferOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineBufferOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineBufferOptionsPropertyValidator(properties).assertSuccess();
  return {
    "PersistentBufferEnabled": cdk.booleanToCloudFormation(properties.persistentBufferEnabled)
  };
}

// @ts-ignore TS6133
function CfnPipelineBufferOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.BufferOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.BufferOptionsProperty>();
  ret.addPropertyResult("persistentBufferEnabled", "PersistentBufferEnabled", (properties.PersistentBufferEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.PersistentBufferEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EncryptionAtRestOptionsProperty`
 *
 * @param properties - the TypeScript properties of a `EncryptionAtRestOptionsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineEncryptionAtRestOptionsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.requiredValidator)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  return errors.wrap("supplied properties not correct for \"EncryptionAtRestOptionsProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineEncryptionAtRestOptionsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineEncryptionAtRestOptionsPropertyValidator(properties).assertSuccess();
  return {
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn)
  };
}

// @ts-ignore TS6133
function CfnPipelineEncryptionAtRestOptionsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipeline.EncryptionAtRestOptionsProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.EncryptionAtRestOptionsProperty>();
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcEndpointProperty`
 *
 * @param properties - the TypeScript properties of a `VpcEndpointProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelineVpcEndpointPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("vpcEndpointId", cdk.validateString)(properties.vpcEndpointId));
  errors.collect(cdk.propertyValidator("vpcId", cdk.validateString)(properties.vpcId));
  errors.collect(cdk.propertyValidator("vpcOptions", CfnPipelineVpcOptionsPropertyValidator)(properties.vpcOptions));
  return errors.wrap("supplied properties not correct for \"VpcEndpointProperty\"");
}

// @ts-ignore TS6133
function convertCfnPipelineVpcEndpointPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelineVpcEndpointPropertyValidator(properties).assertSuccess();
  return {
    "VpcEndpointId": cdk.stringToCloudFormation(properties.vpcEndpointId),
    "VpcId": cdk.stringToCloudFormation(properties.vpcId),
    "VpcOptions": convertCfnPipelineVpcOptionsPropertyToCloudFormation(properties.vpcOptions)
  };
}

// @ts-ignore TS6133
function CfnPipelineVpcEndpointPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnPipeline.VpcEndpointProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipeline.VpcEndpointProperty>();
  ret.addPropertyResult("vpcEndpointId", "VpcEndpointId", (properties.VpcEndpointId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcEndpointId) : undefined));
  ret.addPropertyResult("vpcId", "VpcId", (properties.VpcId != null ? cfn_parse.FromCloudFormation.getString(properties.VpcId) : undefined));
  ret.addPropertyResult("vpcOptions", "VpcOptions", (properties.VpcOptions != null ? CfnPipelineVpcOptionsPropertyFromCloudFormation(properties.VpcOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnPipelineProps`
 *
 * @param properties - the TypeScript properties of a `CfnPipelineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnPipelinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bufferOptions", CfnPipelineBufferOptionsPropertyValidator)(properties.bufferOptions));
  errors.collect(cdk.propertyValidator("encryptionAtRestOptions", CfnPipelineEncryptionAtRestOptionsPropertyValidator)(properties.encryptionAtRestOptions));
  errors.collect(cdk.propertyValidator("logPublishingOptions", CfnPipelineLogPublishingOptionsPropertyValidator)(properties.logPublishingOptions));
  errors.collect(cdk.propertyValidator("maxUnits", cdk.requiredValidator)(properties.maxUnits));
  errors.collect(cdk.propertyValidator("maxUnits", cdk.validateNumber)(properties.maxUnits));
  errors.collect(cdk.propertyValidator("minUnits", cdk.requiredValidator)(properties.minUnits));
  errors.collect(cdk.propertyValidator("minUnits", cdk.validateNumber)(properties.minUnits));
  errors.collect(cdk.propertyValidator("pipelineConfigurationBody", cdk.requiredValidator)(properties.pipelineConfigurationBody));
  errors.collect(cdk.propertyValidator("pipelineConfigurationBody", cdk.validateString)(properties.pipelineConfigurationBody));
  errors.collect(cdk.propertyValidator("pipelineName", cdk.requiredValidator)(properties.pipelineName));
  errors.collect(cdk.propertyValidator("pipelineName", cdk.validateString)(properties.pipelineName));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("vpcOptions", CfnPipelineVpcOptionsPropertyValidator)(properties.vpcOptions));
  return errors.wrap("supplied properties not correct for \"CfnPipelineProps\"");
}

// @ts-ignore TS6133
function convertCfnPipelinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnPipelinePropsValidator(properties).assertSuccess();
  return {
    "BufferOptions": convertCfnPipelineBufferOptionsPropertyToCloudFormation(properties.bufferOptions),
    "EncryptionAtRestOptions": convertCfnPipelineEncryptionAtRestOptionsPropertyToCloudFormation(properties.encryptionAtRestOptions),
    "LogPublishingOptions": convertCfnPipelineLogPublishingOptionsPropertyToCloudFormation(properties.logPublishingOptions),
    "MaxUnits": cdk.numberToCloudFormation(properties.maxUnits),
    "MinUnits": cdk.numberToCloudFormation(properties.minUnits),
    "PipelineConfigurationBody": cdk.stringToCloudFormation(properties.pipelineConfigurationBody),
    "PipelineName": cdk.stringToCloudFormation(properties.pipelineName),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "VpcOptions": convertCfnPipelineVpcOptionsPropertyToCloudFormation(properties.vpcOptions)
  };
}

// @ts-ignore TS6133
function CfnPipelinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnPipelineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnPipelineProps>();
  ret.addPropertyResult("bufferOptions", "BufferOptions", (properties.BufferOptions != null ? CfnPipelineBufferOptionsPropertyFromCloudFormation(properties.BufferOptions) : undefined));
  ret.addPropertyResult("encryptionAtRestOptions", "EncryptionAtRestOptions", (properties.EncryptionAtRestOptions != null ? CfnPipelineEncryptionAtRestOptionsPropertyFromCloudFormation(properties.EncryptionAtRestOptions) : undefined));
  ret.addPropertyResult("logPublishingOptions", "LogPublishingOptions", (properties.LogPublishingOptions != null ? CfnPipelineLogPublishingOptionsPropertyFromCloudFormation(properties.LogPublishingOptions) : undefined));
  ret.addPropertyResult("maxUnits", "MaxUnits", (properties.MaxUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxUnits) : undefined));
  ret.addPropertyResult("minUnits", "MinUnits", (properties.MinUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinUnits) : undefined));
  ret.addPropertyResult("pipelineConfigurationBody", "PipelineConfigurationBody", (properties.PipelineConfigurationBody != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineConfigurationBody) : undefined));
  ret.addPropertyResult("pipelineName", "PipelineName", (properties.PipelineName != null ? cfn_parse.FromCloudFormation.getString(properties.PipelineName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("vpcOptions", "VpcOptions", (properties.VpcOptions != null ? CfnPipelineVpcOptionsPropertyFromCloudFormation(properties.VpcOptions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}