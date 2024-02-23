/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessfunction.
 *
 * @cloudformationResource AWS::Serverless::Function
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html
 */
export class CfnFunction extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::Function";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnFunction from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnFunction {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnFunctionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnFunction(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public architectures?: Array<string>;

  public assumeRolePolicyDocument?: any | cdk.IResolvable;

  public autoPublishAlias?: string;

  public autoPublishCodeSha256?: string;

  public codeSigningConfigArn?: string;

  public codeUri?: cdk.IResolvable | CfnFunction.S3LocationProperty | string;

  public deadLetterQueue?: CfnFunction.DeadLetterQueueProperty | cdk.IResolvable;

  public deploymentPreference?: CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable;

  public description?: string;

  public environment?: CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable;

  public ephemeralStorage?: CfnFunction.EphemeralStorageProperty | cdk.IResolvable;

  public eventInvokeConfig?: CfnFunction.EventInvokeConfigProperty | cdk.IResolvable;

  public events?: cdk.IResolvable | Record<string, CfnFunction.EventSourceProperty | cdk.IResolvable>;

  public fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  public functionName?: string;

  public functionUrlConfig?: CfnFunction.FunctionUrlConfigProperty | cdk.IResolvable;

  public handler?: string;

  public imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;

  public imageUri?: string;

  public inlineCode?: string;

  public kmsKeyArn?: string;

  public layers?: Array<string>;

  public memorySize?: number;

  public packageType?: string;

  public permissionsBoundary?: string;

  public policies?: Array<CfnFunction.IAMPolicyDocumentProperty | cdk.IResolvable | CfnFunction.SAMPolicyTemplateProperty | string> | CfnFunction.IAMPolicyDocumentProperty | cdk.IResolvable | string;

  public provisionedConcurrencyConfig?: cdk.IResolvable | CfnFunction.ProvisionedConcurrencyConfigProperty;

  public reservedConcurrentExecutions?: number;

  public role?: string;

  public runtime?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Record<string, string>;

  public timeout?: number;

  public tracing?: string;

  public versionDescription?: string;

  public vpcConfig?: cdk.IResolvable | CfnFunction.VpcConfigProperty;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnFunctionProps = {}) {
    super(scope, id, {
      "type": CfnFunction.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    // Automatically add the required transform
    this.stack.addTransform(CfnFunction.REQUIRED_TRANSFORM);

    this.architectures = props.architectures;
    this.assumeRolePolicyDocument = props.assumeRolePolicyDocument;
    this.autoPublishAlias = props.autoPublishAlias;
    this.autoPublishCodeSha256 = props.autoPublishCodeSha256;
    this.codeSigningConfigArn = props.codeSigningConfigArn;
    this.codeUri = props.codeUri;
    this.deadLetterQueue = props.deadLetterQueue;
    this.deploymentPreference = props.deploymentPreference;
    this.description = props.description;
    this.environment = props.environment;
    this.ephemeralStorage = props.ephemeralStorage;
    this.eventInvokeConfig = props.eventInvokeConfig;
    this.events = props.events;
    this.fileSystemConfigs = props.fileSystemConfigs;
    this.functionName = props.functionName;
    this.functionUrlConfig = props.functionUrlConfig;
    this.handler = props.handler;
    this.imageConfig = props.imageConfig;
    this.imageUri = props.imageUri;
    this.inlineCode = props.inlineCode;
    this.kmsKeyArn = props.kmsKeyArn;
    this.layers = props.layers;
    this.memorySize = props.memorySize;
    this.packageType = props.packageType;
    this.permissionsBoundary = props.permissionsBoundary;
    this.policies = props.policies;
    this.provisionedConcurrencyConfig = props.provisionedConcurrencyConfig;
    this.reservedConcurrentExecutions = props.reservedConcurrentExecutions;
    this.role = props.role;
    this.runtime = props.runtime;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::Function", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeout = props.timeout;
    this.tracing = props.tracing;
    this.versionDescription = props.versionDescription;
    this.vpcConfig = props.vpcConfig;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "architectures": this.architectures,
      "assumeRolePolicyDocument": this.assumeRolePolicyDocument,
      "autoPublishAlias": this.autoPublishAlias,
      "autoPublishCodeSha256": this.autoPublishCodeSha256,
      "codeSigningConfigArn": this.codeSigningConfigArn,
      "codeUri": this.codeUri,
      "deadLetterQueue": this.deadLetterQueue,
      "deploymentPreference": this.deploymentPreference,
      "description": this.description,
      "environment": this.environment,
      "ephemeralStorage": this.ephemeralStorage,
      "eventInvokeConfig": this.eventInvokeConfig,
      "events": this.events,
      "fileSystemConfigs": this.fileSystemConfigs,
      "functionName": this.functionName,
      "functionUrlConfig": this.functionUrlConfig,
      "handler": this.handler,
      "imageConfig": this.imageConfig,
      "imageUri": this.imageUri,
      "inlineCode": this.inlineCode,
      "kmsKeyArn": this.kmsKeyArn,
      "layers": this.layers,
      "memorySize": this.memorySize,
      "packageType": this.packageType,
      "permissionsBoundary": this.permissionsBoundary,
      "policies": this.policies,
      "provisionedConcurrencyConfig": this.provisionedConcurrencyConfig,
      "reservedConcurrentExecutions": this.reservedConcurrentExecutions,
      "role": this.role,
      "runtime": this.runtime,
      "tags": this.tags.renderTags(),
      "timeout": this.timeout,
      "tracing": this.tracing,
      "versionDescription": this.versionDescription,
      "vpcConfig": this.vpcConfig
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnFunction.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnFunctionPropsToCloudFormation(props);
  }
}

export namespace CfnFunction {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3location.html#cfn-serverless-function-s3location-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3location.html#cfn-serverless-function-s3location-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3location.html#cfn-serverless-function-s3location-version
     */
    readonly version?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-filesystemconfig.html
   */
  export interface FileSystemConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-filesystemconfig.html#cfn-serverless-function-filesystemconfig-arn
     */
    readonly arn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-filesystemconfig.html#cfn-serverless-function-filesystemconfig-localmountpath
     */
    readonly localMountPath?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-iampolicydocument.html
   */
  export interface IAMPolicyDocumentProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-iampolicydocument.html#cfn-serverless-function-iampolicydocument-statement
     */
    readonly statement: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-iampolicydocument.html#cfn-serverless-function-iampolicydocument-version
     */
    readonly version?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html
   */
  export interface SAMPolicyTemplateProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-amidescribepolicy
     */
    readonly amiDescribePolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-awssecretsmanagergetsecretvaluepolicy
     */
    readonly awsSecretsManagerGetSecretValuePolicy?: cdk.IResolvable | CfnFunction.SecretArnSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-cloudformationdescribestackspolicy
     */
    readonly cloudFormationDescribeStacksPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-cloudwatchputmetricpolicy
     */
    readonly cloudWatchPutMetricPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-dynamodbcrudpolicy
     */
    readonly dynamoDbCrudPolicy?: cdk.IResolvable | CfnFunction.TableSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-dynamodbreadpolicy
     */
    readonly dynamoDbReadPolicy?: cdk.IResolvable | CfnFunction.TableSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-dynamodbstreamreadpolicy
     */
    readonly dynamoDbStreamReadPolicy?: cdk.IResolvable | CfnFunction.TableStreamSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-dynamodbwritepolicy
     */
    readonly dynamoDbWritePolicy?: cdk.IResolvable | CfnFunction.TableSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-ec2describepolicy
     */
    readonly ec2DescribePolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-elasticsearchhttppostpolicy
     */
    readonly elasticsearchHttpPostPolicy?: CfnFunction.DomainSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-filterlogeventspolicy
     */
    readonly filterLogEventsPolicy?: cdk.IResolvable | CfnFunction.LogGroupSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-kinesiscrudpolicy
     */
    readonly kinesisCrudPolicy?: cdk.IResolvable | CfnFunction.StreamSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-kinesisstreamreadpolicy
     */
    readonly kinesisStreamReadPolicy?: cdk.IResolvable | CfnFunction.StreamSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-kmsdecryptpolicy
     */
    readonly kmsDecryptPolicy?: cdk.IResolvable | CfnFunction.KeySAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-lambdainvokepolicy
     */
    readonly lambdaInvokePolicy?: CfnFunction.FunctionSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-rekognitiondetectonlypolicy
     */
    readonly rekognitionDetectOnlyPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-rekognitionlabelspolicy
     */
    readonly rekognitionLabelsPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-rekognitionnodataaccesspolicy
     */
    readonly rekognitionNoDataAccessPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-rekognitionreadpolicy
     */
    readonly rekognitionReadPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-rekognitionwriteonlyaccesspolicy
     */
    readonly rekognitionWriteOnlyAccessPolicy?: CfnFunction.CollectionSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-s3crudpolicy
     */
    readonly s3CrudPolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-s3readpolicy
     */
    readonly s3ReadPolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-s3writepolicy
     */
    readonly s3WritePolicy?: CfnFunction.BucketSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-sesbulktemplatedcrudpolicy
     */
    readonly sesBulkTemplatedCrudPolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-sescrudpolicy
     */
    readonly sesCrudPolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-sesemailtemplatecrudpolicy
     */
    readonly sesEmailTemplateCrudPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-sessendbouncepolicy
     */
    readonly sesSendBouncePolicy?: CfnFunction.IdentitySAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-snscrudpolicy
     */
    readonly snsCrudPolicy?: cdk.IResolvable | CfnFunction.TopicSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-snspublishmessagepolicy
     */
    readonly snsPublishMessagePolicy?: cdk.IResolvable | CfnFunction.TopicSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-sqspollerpolicy
     */
    readonly sqsPollerPolicy?: cdk.IResolvable | CfnFunction.QueueSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-sqssendmessagepolicy
     */
    readonly sqsSendMessagePolicy?: cdk.IResolvable | CfnFunction.QueueSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-ssmparameterreadpolicy
     */
    readonly ssmParameterReadPolicy?: cdk.IResolvable | CfnFunction.ParameterNameSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-stepfunctionsexecutionpolicy
     */
    readonly stepFunctionsExecutionPolicy?: cdk.IResolvable | CfnFunction.StateMachineSAMPTProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sampolicytemplate.html#cfn-serverless-function-sampolicytemplate-vpcaccesspolicy
     */
    readonly vpcAccessPolicy?: CfnFunction.EmptySAMPTProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-emptysampt.html
   */
  export interface EmptySAMPTProperty {

  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-queuesampt.html
   */
  export interface QueueSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-queuesampt.html#cfn-serverless-function-queuesampt-queuename
     */
    readonly queueName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionsampt.html
   */
  export interface FunctionSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionsampt.html#cfn-serverless-function-functionsampt-functionname
     */
    readonly functionName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-tablesampt.html
   */
  export interface TableSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-tablesampt.html#cfn-serverless-function-tablesampt-tablename
     */
    readonly tableName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-tablestreamsampt.html
   */
  export interface TableStreamSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-tablestreamsampt.html#cfn-serverless-function-tablestreamsampt-streamname
     */
    readonly streamName: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-tablestreamsampt.html#cfn-serverless-function-tablestreamsampt-tablename
     */
    readonly tableName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-identitysampt.html
   */
  export interface IdentitySAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-identitysampt.html#cfn-serverless-function-identitysampt-identityname
     */
    readonly identityName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-domainsampt.html
   */
  export interface DomainSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-domainsampt.html#cfn-serverless-function-domainsampt-domainname
     */
    readonly domainName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-bucketsampt.html
   */
  export interface BucketSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-bucketsampt.html#cfn-serverless-function-bucketsampt-bucketname
     */
    readonly bucketName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-collectionsampt.html
   */
  export interface CollectionSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-collectionsampt.html#cfn-serverless-function-collectionsampt-collectionid
     */
    readonly collectionId: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-topicsampt.html
   */
  export interface TopicSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-topicsampt.html#cfn-serverless-function-topicsampt-topicname
     */
    readonly topicName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-streamsampt.html
   */
  export interface StreamSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-streamsampt.html#cfn-serverless-function-streamsampt-streamname
     */
    readonly streamName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-keysampt.html
   */
  export interface KeySAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-keysampt.html#cfn-serverless-function-keysampt-keyid
     */
    readonly keyId: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-loggroupsampt.html
   */
  export interface LogGroupSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-loggroupsampt.html#cfn-serverless-function-loggroupsampt-loggroupname
     */
    readonly logGroupName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-statemachinesampt.html
   */
  export interface StateMachineSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-statemachinesampt.html#cfn-serverless-function-statemachinesampt-statemachinename
     */
    readonly stateMachineName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-parameternamesampt.html
   */
  export interface ParameterNameSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-parameternamesampt.html#cfn-serverless-function-parameternamesampt-parametername
     */
    readonly parameterName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-secretarnsampt.html
   */
  export interface SecretArnSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-secretarnsampt.html#cfn-serverless-function-secretarnsampt-secretarn
     */
    readonly secretArn: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionenvironment.html
   */
  export interface FunctionEnvironmentProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionenvironment.html#cfn-serverless-function-functionenvironment-variables
     */
    readonly variables: cdk.IResolvable | Record<string, string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-vpcconfig.html
   */
  export interface VpcConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-vpcconfig.html#cfn-serverless-function-vpcconfig-securitygroupids
     */
    readonly securityGroupIds: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-vpcconfig.html#cfn-serverless-function-vpcconfig-subnetids
     */
    readonly subnetIds: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventsource.html
   */
  export interface EventSourceProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventsource.html#cfn-serverless-function-eventsource-properties
     */
    readonly properties: CfnFunction.AlexaSkillEventProperty | CfnFunction.ApiEventProperty | CfnFunction.CloudWatchEventEventProperty | CfnFunction.CloudWatchLogsEventProperty | CfnFunction.CognitoEventProperty | CfnFunction.DynamoDBEventProperty | CfnFunction.EventBridgeRuleEventProperty | CfnFunction.HttpApiEventProperty | CfnFunction.IoTRuleEventProperty | cdk.IResolvable | CfnFunction.KinesisEventProperty | CfnFunction.S3EventProperty | CfnFunction.ScheduleEventProperty | CfnFunction.SNSEventProperty | CfnFunction.SQSEventProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventsource.html#cfn-serverless-function-eventsource-type
     */
    readonly type: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3event.html
   */
  export interface S3EventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3event.html#cfn-serverless-function-s3event-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3event.html#cfn-serverless-function-s3event-events
     */
    readonly events: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3event.html#cfn-serverless-function-s3event-filter
     */
    readonly filter?: cdk.IResolvable | CfnFunction.S3NotificationFilterProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3notificationfilter.html
   */
  export interface S3NotificationFilterProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3notificationfilter.html#cfn-serverless-function-s3notificationfilter-s3key
     */
    readonly s3Key: cdk.IResolvable | CfnFunction.S3KeyFilterProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3keyfilter.html
   */
  export interface S3KeyFilterProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3keyfilter.html#cfn-serverless-function-s3keyfilter-rules
     */
    readonly rules: Array<cdk.IResolvable | CfnFunction.S3KeyFilterRuleProperty> | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3keyfilterrule.html
   */
  export interface S3KeyFilterRuleProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3keyfilterrule.html#cfn-serverless-function-s3keyfilterrule-name
     */
    readonly name: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-s3keyfilterrule.html#cfn-serverless-function-s3keyfilterrule-value
     */
    readonly value: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-snsevent.html
   */
  export interface SNSEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-snsevent.html#cfn-serverless-function-snsevent-topic
     */
    readonly topic: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sqsevent.html
   */
  export interface SQSEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sqsevent.html#cfn-serverless-function-sqsevent-batchsize
     */
    readonly batchSize?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sqsevent.html#cfn-serverless-function-sqsevent-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-sqsevent.html#cfn-serverless-function-sqsevent-queue
     */
    readonly queue: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-kinesisevent.html
   */
  export interface KinesisEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-kinesisevent.html#cfn-serverless-function-kinesisevent-batchsize
     */
    readonly batchSize?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-kinesisevent.html#cfn-serverless-function-kinesisevent-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-kinesisevent.html#cfn-serverless-function-kinesisevent-functionresponsetypes
     */
    readonly functionResponseTypes?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-kinesisevent.html#cfn-serverless-function-kinesisevent-startingposition
     */
    readonly startingPosition: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-kinesisevent.html#cfn-serverless-function-kinesisevent-stream
     */
    readonly stream: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html
   */
  export interface DynamoDBEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-batchsize
     */
    readonly batchSize?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-bisectbatchonfunctionerror
     */
    readonly bisectBatchOnFunctionError?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-destinationconfig
     */
    readonly destinationConfig?: CfnFunction.DestinationConfigProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-maximumbatchingwindowinseconds
     */
    readonly maximumBatchingWindowInSeconds?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-maximumrecordageinseconds
     */
    readonly maximumRecordAgeInSeconds?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-parallelizationfactor
     */
    readonly parallelizationFactor?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-startingposition
     */
    readonly startingPosition: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-dynamodbevent.html#cfn-serverless-function-dynamodbevent-stream
     */
    readonly stream: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-destinationconfig.html
   */
  export interface DestinationConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-destinationconfig.html#cfn-serverless-function-destinationconfig-onfailure
     */
    readonly onFailure: CfnFunction.DestinationProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-destination.html
   */
  export interface DestinationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-destination.html#cfn-serverless-function-destination-destination
     */
    readonly destination: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-destination.html#cfn-serverless-function-destination-type
     */
    readonly type?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html
   */
  export interface ApiEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html#cfn-serverless-function-apievent-auth
     */
    readonly auth?: CfnFunction.AuthProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html#cfn-serverless-function-apievent-method
     */
    readonly method: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html#cfn-serverless-function-apievent-path
     */
    readonly path: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html#cfn-serverless-function-apievent-requestmodel
     */
    readonly requestModel?: cdk.IResolvable | CfnFunction.RequestModelProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html#cfn-serverless-function-apievent-requestparameters
     */
    readonly requestParameters?: Array<cdk.IResolvable | CfnFunction.RequestParameterProperty | string> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-apievent.html#cfn-serverless-function-apievent-restapiid
     */
    readonly restApiId?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-auth.html
   */
  export interface AuthProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-auth.html#cfn-serverless-function-auth-apikeyrequired
     */
    readonly apiKeyRequired?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-auth.html#cfn-serverless-function-auth-authorizationscopes
     */
    readonly authorizationScopes?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-auth.html#cfn-serverless-function-auth-authorizer
     */
    readonly authorizer?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-auth.html#cfn-serverless-function-auth-resourcepolicy
     */
    readonly resourcePolicy?: CfnFunction.AuthResourcePolicyProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html
   */
  export interface AuthResourcePolicyProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-awsaccountblacklist
     */
    readonly awsAccountBlacklist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-awsaccountwhitelist
     */
    readonly awsAccountWhitelist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-customstatements
     */
    readonly customStatements?: Array<any | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-intrinsicvpcblacklist
     */
    readonly intrinsicVpcBlacklist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-intrinsicvpceblacklist
     */
    readonly intrinsicVpceBlacklist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-intrinsicvpcewhitelist
     */
    readonly intrinsicVpceWhitelist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-intrinsicvpcwhitelist
     */
    readonly intrinsicVpcWhitelist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-iprangeblacklist
     */
    readonly ipRangeBlacklist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-iprangewhitelist
     */
    readonly ipRangeWhitelist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-sourcevpcblacklist
     */
    readonly sourceVpcBlacklist?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-authresourcepolicy.html#cfn-serverless-function-authresourcepolicy-sourcevpcwhitelist
     */
    readonly sourceVpcWhitelist?: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestmodel.html
   */
  export interface RequestModelProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestmodel.html#cfn-serverless-function-requestmodel-model
     */
    readonly model: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestmodel.html#cfn-serverless-function-requestmodel-required
     */
    readonly required?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestmodel.html#cfn-serverless-function-requestmodel-validatebody
     */
    readonly validateBody?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestmodel.html#cfn-serverless-function-requestmodel-validateparameters
     */
    readonly validateParameters?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestparameter.html
   */
  export interface RequestParameterProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestparameter.html#cfn-serverless-function-requestparameter-caching
     */
    readonly caching?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-requestparameter.html#cfn-serverless-function-requestparameter-required
     */
    readonly required?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-scheduleevent.html
   */
  export interface ScheduleEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-scheduleevent.html#cfn-serverless-function-scheduleevent-description
     */
    readonly description?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-scheduleevent.html#cfn-serverless-function-scheduleevent-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-scheduleevent.html#cfn-serverless-function-scheduleevent-input
     */
    readonly input?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-scheduleevent.html#cfn-serverless-function-scheduleevent-name
     */
    readonly name?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-scheduleevent.html#cfn-serverless-function-scheduleevent-schedule
     */
    readonly schedule: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatcheventevent.html
   */
  export interface CloudWatchEventEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatcheventevent.html#cfn-serverless-function-cloudwatcheventevent-input
     */
    readonly input?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatcheventevent.html#cfn-serverless-function-cloudwatcheventevent-inputpath
     */
    readonly inputPath?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatcheventevent.html#cfn-serverless-function-cloudwatcheventevent-pattern
     */
    readonly pattern: any | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatchlogsevent.html
   */
  export interface CloudWatchLogsEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatchlogsevent.html#cfn-serverless-function-cloudwatchlogsevent-filterpattern
     */
    readonly filterPattern: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cloudwatchlogsevent.html#cfn-serverless-function-cloudwatchlogsevent-loggroupname
     */
    readonly logGroupName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-iotruleevent.html
   */
  export interface IoTRuleEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-iotruleevent.html#cfn-serverless-function-iotruleevent-awsiotsqlversion
     */
    readonly awsIotSqlVersion?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-iotruleevent.html#cfn-serverless-function-iotruleevent-sql
     */
    readonly sql: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-alexaskillevent.html
   */
  export interface AlexaSkillEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-alexaskillevent.html#cfn-serverless-function-alexaskillevent-skillid
     */
    readonly skillId: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventbridgeruleevent.html
   */
  export interface EventBridgeRuleEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventbridgeruleevent.html#cfn-serverless-function-eventbridgeruleevent-eventbusname
     */
    readonly eventBusName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventbridgeruleevent.html#cfn-serverless-function-eventbridgeruleevent-input
     */
    readonly input?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventbridgeruleevent.html#cfn-serverless-function-eventbridgeruleevent-inputpath
     */
    readonly inputPath?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventbridgeruleevent.html#cfn-serverless-function-eventbridgeruleevent-pattern
     */
    readonly pattern: any | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html
   */
  export interface HttpApiEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-apiid
     */
    readonly apiId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-auth
     */
    readonly auth?: CfnFunction.HttpApiFunctionAuthProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-method
     */
    readonly method?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-path
     */
    readonly path?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-payloadformatversion
     */
    readonly payloadFormatVersion?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-routesettings
     */
    readonly routeSettings?: cdk.IResolvable | CfnFunction.RouteSettingsProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapievent.html#cfn-serverless-function-httpapievent-timeoutinmillis
     */
    readonly timeoutInMillis?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapifunctionauth.html
   */
  export interface HttpApiFunctionAuthProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapifunctionauth.html#cfn-serverless-function-httpapifunctionauth-authorizationscopes
     */
    readonly authorizationScopes?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-httpapifunctionauth.html#cfn-serverless-function-httpapifunctionauth-authorizer
     */
    readonly authorizer?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-routesettings.html
   */
  export interface RouteSettingsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-routesettings.html#cfn-serverless-function-routesettings-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-routesettings.html#cfn-serverless-function-routesettings-detailedmetricsenabled
     */
    readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-routesettings.html#cfn-serverless-function-routesettings-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-routesettings.html#cfn-serverless-function-routesettings-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-routesettings.html#cfn-serverless-function-routesettings-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cognitoevent.html
   */
  export interface CognitoEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cognitoevent.html#cfn-serverless-function-cognitoevent-trigger
     */
    readonly trigger: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-cognitoevent.html#cfn-serverless-function-cognitoevent-userpool
     */
    readonly userPool: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deadletterqueue.html
   */
  export interface DeadLetterQueueProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deadletterqueue.html#cfn-serverless-function-deadletterqueue-targetarn
     */
    readonly targetArn: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deadletterqueue.html#cfn-serverless-function-deadletterqueue-type
     */
    readonly type: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deploymentpreference.html
   */
  export interface DeploymentPreferenceProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deploymentpreference.html#cfn-serverless-function-deploymentpreference-alarms
     */
    readonly alarms?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deploymentpreference.html#cfn-serverless-function-deploymentpreference-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deploymentpreference.html#cfn-serverless-function-deploymentpreference-hooks
     */
    readonly hooks?: CfnFunction.HooksProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deploymentpreference.html#cfn-serverless-function-deploymentpreference-role
     */
    readonly role?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-deploymentpreference.html#cfn-serverless-function-deploymentpreference-type
     */
    readonly type?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-hooks.html
   */
  export interface HooksProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-hooks.html#cfn-serverless-function-hooks-posttraffic
     */
    readonly postTraffic?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-hooks.html#cfn-serverless-function-hooks-pretraffic
     */
    readonly preTraffic?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-provisionedconcurrencyconfig.html
   */
  export interface ProvisionedConcurrencyConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-provisionedconcurrencyconfig.html#cfn-serverless-function-provisionedconcurrencyconfig-provisionedconcurrentexecutions
     */
    readonly provisionedConcurrentExecutions: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokeconfig.html
   */
  export interface EventInvokeConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokeconfig.html#cfn-serverless-function-eventinvokeconfig-destinationconfig
     */
    readonly destinationConfig?: CfnFunction.EventInvokeDestinationConfigProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokeconfig.html#cfn-serverless-function-eventinvokeconfig-maximumeventageinseconds
     */
    readonly maximumEventAgeInSeconds?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokeconfig.html#cfn-serverless-function-eventinvokeconfig-maximumretryattempts
     */
    readonly maximumRetryAttempts?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokedestinationconfig.html
   */
  export interface EventInvokeDestinationConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokedestinationconfig.html#cfn-serverless-function-eventinvokedestinationconfig-onfailure
     */
    readonly onFailure: CfnFunction.DestinationProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-eventinvokedestinationconfig.html#cfn-serverless-function-eventinvokedestinationconfig-onsuccess
     */
    readonly onSuccess: CfnFunction.DestinationProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-imageconfig.html
   */
  export interface ImageConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-imageconfig.html#cfn-serverless-function-imageconfig-command
     */
    readonly command?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-imageconfig.html#cfn-serverless-function-imageconfig-entrypoint
     */
    readonly entryPoint?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-imageconfig.html#cfn-serverless-function-imageconfig-workingdirectory
     */
    readonly workingDirectory?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionurlconfig.html
   */
  export interface FunctionUrlConfigProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionurlconfig.html#cfn-serverless-function-functionurlconfig-authtype
     */
    readonly authType: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionurlconfig.html#cfn-serverless-function-functionurlconfig-cors
     */
    readonly cors?: CfnFunction.CorsConfigurationProperty | cdk.IResolvable | string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-functionurlconfig.html#cfn-serverless-function-functionurlconfig-invokemode
     */
    readonly invokeMode?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-corsconfiguration.html
   */
  export interface CorsConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-corsconfiguration.html#cfn-serverless-function-corsconfiguration-allowcredentials
     */
    readonly allowCredentials?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-corsconfiguration.html#cfn-serverless-function-corsconfiguration-allowheaders
     */
    readonly allowHeaders?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-corsconfiguration.html#cfn-serverless-function-corsconfiguration-allowmethods
     */
    readonly allowMethods?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-corsconfiguration.html#cfn-serverless-function-corsconfiguration-alloworigin
     */
    readonly allowOrigin: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-corsconfiguration.html#cfn-serverless-function-corsconfiguration-maxage
     */
    readonly maxAge?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-ephemeralstorage.html
   */
  export interface EphemeralStorageProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-function-ephemeralstorage.html#cfn-serverless-function-ephemeralstorage-size
     */
    readonly size: number;
  }
}

/**
 * Properties for defining a `CfnFunction`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html
 */
export interface CfnFunctionProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-architectures
   */
  readonly architectures?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-assumerolepolicydocument
   */
  readonly assumeRolePolicyDocument?: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-autopublishalias
   */
  readonly autoPublishAlias?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-autopublishcodesha256
   */
  readonly autoPublishCodeSha256?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-codesigningconfigarn
   */
  readonly codeSigningConfigArn?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-codeuri
   */
  readonly codeUri?: cdk.IResolvable | CfnFunction.S3LocationProperty | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-deadletterqueue
   */
  readonly deadLetterQueue?: CfnFunction.DeadLetterQueueProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-deploymentpreference
   */
  readonly deploymentPreference?: CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-description
   */
  readonly description?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-environment
   */
  readonly environment?: CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-ephemeralstorage
   */
  readonly ephemeralStorage?: CfnFunction.EphemeralStorageProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-eventinvokeconfig
   */
  readonly eventInvokeConfig?: CfnFunction.EventInvokeConfigProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-events
   */
  readonly events?: cdk.IResolvable | Record<string, CfnFunction.EventSourceProperty | cdk.IResolvable>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-filesystemconfigs
   */
  readonly fileSystemConfigs?: Array<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-functionname
   */
  readonly functionName?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-functionurlconfig
   */
  readonly functionUrlConfig?: CfnFunction.FunctionUrlConfigProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-handler
   */
  readonly handler?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-imageconfig
   */
  readonly imageConfig?: CfnFunction.ImageConfigProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-imageuri
   */
  readonly imageUri?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-inlinecode
   */
  readonly inlineCode?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-kmskeyarn
   */
  readonly kmsKeyArn?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-layers
   */
  readonly layers?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-memorysize
   */
  readonly memorySize?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-packagetype
   */
  readonly packageType?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-permissionsboundary
   */
  readonly permissionsBoundary?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-policies
   */
  readonly policies?: Array<CfnFunction.IAMPolicyDocumentProperty | cdk.IResolvable | CfnFunction.SAMPolicyTemplateProperty | string> | CfnFunction.IAMPolicyDocumentProperty | cdk.IResolvable | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-provisionedconcurrencyconfig
   */
  readonly provisionedConcurrencyConfig?: cdk.IResolvable | CfnFunction.ProvisionedConcurrencyConfigProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-reservedconcurrentexecutions
   */
  readonly reservedConcurrentExecutions?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-role
   */
  readonly role?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-runtime
   */
  readonly runtime?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-timeout
   */
  readonly timeout?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-tracing
   */
  readonly tracing?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-versiondescription
   */
  readonly versionDescription?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-function.html#cfn-serverless-function-vpcconfig
   */
  readonly vpcConfig?: cdk.IResolvable | CfnFunction.VpcConfigProperty;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnFunctionS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FileSystemConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FileSystemConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFileSystemConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("arn", cdk.validateString)(properties.arn));
  errors.collect(cdk.propertyValidator("localMountPath", cdk.validateString)(properties.localMountPath));
  return errors.wrap("supplied properties not correct for \"FileSystemConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFileSystemConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFileSystemConfigPropertyValidator(properties).assertSuccess();
  return {
    "Arn": cdk.stringToCloudFormation(properties.arn),
    "LocalMountPath": cdk.stringToCloudFormation(properties.localMountPath)
  };
}

// @ts-ignore TS6133
function CfnFunctionFileSystemConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FileSystemConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FileSystemConfigProperty>();
  ret.addPropertyResult("arn", "Arn", (properties.Arn != null ? cfn_parse.FromCloudFormation.getString(properties.Arn) : undefined));
  ret.addPropertyResult("localMountPath", "LocalMountPath", (properties.LocalMountPath != null ? cfn_parse.FromCloudFormation.getString(properties.LocalMountPath) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IAMPolicyDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionIAMPolicyDocumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", cdk.validateObject)(properties.statement));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"IAMPolicyDocumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionIAMPolicyDocumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionIAMPolicyDocumentPropertyValidator(properties).assertSuccess();
  return {
    "Statement": cdk.objectToCloudFormation(properties.statement),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnFunctionIAMPolicyDocumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.IAMPolicyDocumentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.IAMPolicyDocumentProperty>();
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? cfn_parse.FromCloudFormation.getAny(properties.Statement) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EmptySAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `EmptySAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEmptySAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  return errors.wrap("supplied properties not correct for \"EmptySAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEmptySAMPTPropertyValidator(properties).assertSuccess();
  return {};
}

// @ts-ignore TS6133
function CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EmptySAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EmptySAMPTProperty>();
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `QueueSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `QueueSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionQueueSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("queueName", cdk.requiredValidator)(properties.queueName));
  errors.collect(cdk.propertyValidator("queueName", cdk.validateString)(properties.queueName));
  return errors.wrap("supplied properties not correct for \"QueueSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionQueueSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionQueueSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "QueueName": cdk.stringToCloudFormation(properties.queueName)
  };
}

// @ts-ignore TS6133
function CfnFunctionQueueSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.QueueSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.QueueSAMPTProperty>();
  ret.addPropertyResult("queueName", "QueueName", (properties.QueueName != null ? cfn_parse.FromCloudFormation.getString(properties.QueueName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFunctionSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  return errors.wrap("supplied properties not correct for \"FunctionSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFunctionSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFunctionSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "FunctionName": cdk.stringToCloudFormation(properties.functionName)
  };
}

// @ts-ignore TS6133
function CfnFunctionFunctionSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionSAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionSAMPTProperty>();
  ret.addPropertyResult("functionName", "FunctionName", (properties.FunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `TableSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionTableSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"TableSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionTableSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionTableSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnFunctionTableSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.TableSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TableSAMPTProperty>();
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TableStreamSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `TableStreamSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionTableStreamSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("streamName", cdk.requiredValidator)(properties.streamName));
  errors.collect(cdk.propertyValidator("streamName", cdk.validateString)(properties.streamName));
  errors.collect(cdk.propertyValidator("tableName", cdk.requiredValidator)(properties.tableName));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  return errors.wrap("supplied properties not correct for \"TableStreamSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionTableStreamSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionTableStreamSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "StreamName": cdk.stringToCloudFormation(properties.streamName),
    "TableName": cdk.stringToCloudFormation(properties.tableName)
  };
}

// @ts-ignore TS6133
function CfnFunctionTableStreamSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.TableStreamSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TableStreamSAMPTProperty>();
  ret.addPropertyResult("streamName", "StreamName", (properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IdentitySAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `IdentitySAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionIdentitySAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("identityName", cdk.requiredValidator)(properties.identityName));
  errors.collect(cdk.propertyValidator("identityName", cdk.validateString)(properties.identityName));
  return errors.wrap("supplied properties not correct for \"IdentitySAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionIdentitySAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionIdentitySAMPTPropertyValidator(properties).assertSuccess();
  return {
    "IdentityName": cdk.stringToCloudFormation(properties.identityName)
  };
}

// @ts-ignore TS6133
function CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.IdentitySAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.IdentitySAMPTProperty>();
  ret.addPropertyResult("identityName", "IdentityName", (properties.IdentityName != null ? cfn_parse.FromCloudFormation.getString(properties.IdentityName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `DomainSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDomainSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  return errors.wrap("supplied properties not correct for \"DomainSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDomainSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDomainSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "DomainName": cdk.stringToCloudFormation(properties.domainName)
  };
}

// @ts-ignore TS6133
function CfnFunctionDomainSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DomainSAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DomainSAMPTProperty>();
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `BucketSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `BucketSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionBucketSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucketName", cdk.requiredValidator)(properties.bucketName));
  errors.collect(cdk.propertyValidator("bucketName", cdk.validateString)(properties.bucketName));
  return errors.wrap("supplied properties not correct for \"BucketSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionBucketSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionBucketSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "BucketName": cdk.stringToCloudFormation(properties.bucketName)
  };
}

// @ts-ignore TS6133
function CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.BucketSAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.BucketSAMPTProperty>();
  ret.addPropertyResult("bucketName", "BucketName", (properties.BucketName != null ? cfn_parse.FromCloudFormation.getString(properties.BucketName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CollectionSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `CollectionSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionCollectionSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("collectionId", cdk.requiredValidator)(properties.collectionId));
  errors.collect(cdk.propertyValidator("collectionId", cdk.validateString)(properties.collectionId));
  return errors.wrap("supplied properties not correct for \"CollectionSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionCollectionSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionCollectionSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "CollectionId": cdk.stringToCloudFormation(properties.collectionId)
  };
}

// @ts-ignore TS6133
function CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CollectionSAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CollectionSAMPTProperty>();
  ret.addPropertyResult("collectionId", "CollectionId", (properties.CollectionId != null ? cfn_parse.FromCloudFormation.getString(properties.CollectionId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TopicSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `TopicSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionTopicSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("topicName", cdk.requiredValidator)(properties.topicName));
  errors.collect(cdk.propertyValidator("topicName", cdk.validateString)(properties.topicName));
  return errors.wrap("supplied properties not correct for \"TopicSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionTopicSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionTopicSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "TopicName": cdk.stringToCloudFormation(properties.topicName)
  };
}

// @ts-ignore TS6133
function CfnFunctionTopicSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.TopicSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.TopicSAMPTProperty>();
  ret.addPropertyResult("topicName", "TopicName", (properties.TopicName != null ? cfn_parse.FromCloudFormation.getString(properties.TopicName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StreamSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `StreamSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionStreamSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("streamName", cdk.requiredValidator)(properties.streamName));
  errors.collect(cdk.propertyValidator("streamName", cdk.validateString)(properties.streamName));
  return errors.wrap("supplied properties not correct for \"StreamSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionStreamSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionStreamSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "StreamName": cdk.stringToCloudFormation(properties.streamName)
  };
}

// @ts-ignore TS6133
function CfnFunctionStreamSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.StreamSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.StreamSAMPTProperty>();
  ret.addPropertyResult("streamName", "StreamName", (properties.StreamName != null ? cfn_parse.FromCloudFormation.getString(properties.StreamName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KeySAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `KeySAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionKeySAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("keyId", cdk.requiredValidator)(properties.keyId));
  errors.collect(cdk.propertyValidator("keyId", cdk.validateString)(properties.keyId));
  return errors.wrap("supplied properties not correct for \"KeySAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionKeySAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionKeySAMPTPropertyValidator(properties).assertSuccess();
  return {
    "KeyId": cdk.stringToCloudFormation(properties.keyId)
  };
}

// @ts-ignore TS6133
function CfnFunctionKeySAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.KeySAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.KeySAMPTProperty>();
  ret.addPropertyResult("keyId", "KeyId", (properties.KeyId != null ? cfn_parse.FromCloudFormation.getString(properties.KeyId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogGroupSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `LogGroupSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionLogGroupSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  return errors.wrap("supplied properties not correct for \"LogGroupSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionLogGroupSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionLogGroupSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName)
  };
}

// @ts-ignore TS6133
function CfnFunctionLogGroupSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.LogGroupSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.LogGroupSAMPTProperty>();
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StateMachineSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `StateMachineSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionStateMachineSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.requiredValidator)(properties.stateMachineName));
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.validateString)(properties.stateMachineName));
  return errors.wrap("supplied properties not correct for \"StateMachineSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionStateMachineSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionStateMachineSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "StateMachineName": cdk.stringToCloudFormation(properties.stateMachineName)
  };
}

// @ts-ignore TS6133
function CfnFunctionStateMachineSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.StateMachineSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.StateMachineSAMPTProperty>();
  ret.addPropertyResult("stateMachineName", "StateMachineName", (properties.StateMachineName != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ParameterNameSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `ParameterNameSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionParameterNameSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("parameterName", cdk.requiredValidator)(properties.parameterName));
  errors.collect(cdk.propertyValidator("parameterName", cdk.validateString)(properties.parameterName));
  return errors.wrap("supplied properties not correct for \"ParameterNameSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionParameterNameSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionParameterNameSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "ParameterName": cdk.stringToCloudFormation(properties.parameterName)
  };
}

// @ts-ignore TS6133
function CfnFunctionParameterNameSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.ParameterNameSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ParameterNameSAMPTProperty>();
  ret.addPropertyResult("parameterName", "ParameterName", (properties.ParameterName != null ? cfn_parse.FromCloudFormation.getString(properties.ParameterName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SecretArnSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `SecretArnSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionSecretArnSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("secretArn", cdk.requiredValidator)(properties.secretArn));
  errors.collect(cdk.propertyValidator("secretArn", cdk.validateString)(properties.secretArn));
  return errors.wrap("supplied properties not correct for \"SecretArnSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionSecretArnSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionSecretArnSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "SecretArn": cdk.stringToCloudFormation(properties.secretArn)
  };
}

// @ts-ignore TS6133
function CfnFunctionSecretArnSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.SecretArnSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SecretArnSAMPTProperty>();
  ret.addPropertyResult("secretArn", "SecretArn", (properties.SecretArn != null ? cfn_parse.FromCloudFormation.getString(properties.SecretArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAMPolicyTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `SAMPolicyTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionSAMPolicyTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("amiDescribePolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.amiDescribePolicy));
  errors.collect(cdk.propertyValidator("awsSecretsManagerGetSecretValuePolicy", CfnFunctionSecretArnSAMPTPropertyValidator)(properties.awsSecretsManagerGetSecretValuePolicy));
  errors.collect(cdk.propertyValidator("cloudFormationDescribeStacksPolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.cloudFormationDescribeStacksPolicy));
  errors.collect(cdk.propertyValidator("cloudWatchPutMetricPolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.cloudWatchPutMetricPolicy));
  errors.collect(cdk.propertyValidator("dynamoDbCrudPolicy", CfnFunctionTableSAMPTPropertyValidator)(properties.dynamoDbCrudPolicy));
  errors.collect(cdk.propertyValidator("dynamoDbReadPolicy", CfnFunctionTableSAMPTPropertyValidator)(properties.dynamoDbReadPolicy));
  errors.collect(cdk.propertyValidator("dynamoDbStreamReadPolicy", CfnFunctionTableStreamSAMPTPropertyValidator)(properties.dynamoDbStreamReadPolicy));
  errors.collect(cdk.propertyValidator("dynamoDbWritePolicy", CfnFunctionTableSAMPTPropertyValidator)(properties.dynamoDbWritePolicy));
  errors.collect(cdk.propertyValidator("ec2DescribePolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.ec2DescribePolicy));
  errors.collect(cdk.propertyValidator("elasticsearchHttpPostPolicy", CfnFunctionDomainSAMPTPropertyValidator)(properties.elasticsearchHttpPostPolicy));
  errors.collect(cdk.propertyValidator("filterLogEventsPolicy", CfnFunctionLogGroupSAMPTPropertyValidator)(properties.filterLogEventsPolicy));
  errors.collect(cdk.propertyValidator("kmsDecryptPolicy", CfnFunctionKeySAMPTPropertyValidator)(properties.kmsDecryptPolicy));
  errors.collect(cdk.propertyValidator("kinesisCrudPolicy", CfnFunctionStreamSAMPTPropertyValidator)(properties.kinesisCrudPolicy));
  errors.collect(cdk.propertyValidator("kinesisStreamReadPolicy", CfnFunctionStreamSAMPTPropertyValidator)(properties.kinesisStreamReadPolicy));
  errors.collect(cdk.propertyValidator("lambdaInvokePolicy", CfnFunctionFunctionSAMPTPropertyValidator)(properties.lambdaInvokePolicy));
  errors.collect(cdk.propertyValidator("rekognitionDetectOnlyPolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.rekognitionDetectOnlyPolicy));
  errors.collect(cdk.propertyValidator("rekognitionLabelsPolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.rekognitionLabelsPolicy));
  errors.collect(cdk.propertyValidator("rekognitionNoDataAccessPolicy", CfnFunctionCollectionSAMPTPropertyValidator)(properties.rekognitionNoDataAccessPolicy));
  errors.collect(cdk.propertyValidator("rekognitionReadPolicy", CfnFunctionCollectionSAMPTPropertyValidator)(properties.rekognitionReadPolicy));
  errors.collect(cdk.propertyValidator("rekognitionWriteOnlyAccessPolicy", CfnFunctionCollectionSAMPTPropertyValidator)(properties.rekognitionWriteOnlyAccessPolicy));
  errors.collect(cdk.propertyValidator("s3CrudPolicy", CfnFunctionBucketSAMPTPropertyValidator)(properties.s3CrudPolicy));
  errors.collect(cdk.propertyValidator("s3ReadPolicy", CfnFunctionBucketSAMPTPropertyValidator)(properties.s3ReadPolicy));
  errors.collect(cdk.propertyValidator("s3WritePolicy", CfnFunctionBucketSAMPTPropertyValidator)(properties.s3WritePolicy));
  errors.collect(cdk.propertyValidator("sesBulkTemplatedCrudPolicy", CfnFunctionIdentitySAMPTPropertyValidator)(properties.sesBulkTemplatedCrudPolicy));
  errors.collect(cdk.propertyValidator("sesCrudPolicy", CfnFunctionIdentitySAMPTPropertyValidator)(properties.sesCrudPolicy));
  errors.collect(cdk.propertyValidator("sesEmailTemplateCrudPolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.sesEmailTemplateCrudPolicy));
  errors.collect(cdk.propertyValidator("sesSendBouncePolicy", CfnFunctionIdentitySAMPTPropertyValidator)(properties.sesSendBouncePolicy));
  errors.collect(cdk.propertyValidator("snsCrudPolicy", CfnFunctionTopicSAMPTPropertyValidator)(properties.snsCrudPolicy));
  errors.collect(cdk.propertyValidator("snsPublishMessagePolicy", CfnFunctionTopicSAMPTPropertyValidator)(properties.snsPublishMessagePolicy));
  errors.collect(cdk.propertyValidator("sqsPollerPolicy", CfnFunctionQueueSAMPTPropertyValidator)(properties.sqsPollerPolicy));
  errors.collect(cdk.propertyValidator("sqsSendMessagePolicy", CfnFunctionQueueSAMPTPropertyValidator)(properties.sqsSendMessagePolicy));
  errors.collect(cdk.propertyValidator("ssmParameterReadPolicy", CfnFunctionParameterNameSAMPTPropertyValidator)(properties.ssmParameterReadPolicy));
  errors.collect(cdk.propertyValidator("stepFunctionsExecutionPolicy", CfnFunctionStateMachineSAMPTPropertyValidator)(properties.stepFunctionsExecutionPolicy));
  errors.collect(cdk.propertyValidator("vpcAccessPolicy", CfnFunctionEmptySAMPTPropertyValidator)(properties.vpcAccessPolicy));
  return errors.wrap("supplied properties not correct for \"SAMPolicyTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionSAMPolicyTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionSAMPolicyTemplatePropertyValidator(properties).assertSuccess();
  return {
    "AMIDescribePolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.amiDescribePolicy),
    "AWSSecretsManagerGetSecretValuePolicy": convertCfnFunctionSecretArnSAMPTPropertyToCloudFormation(properties.awsSecretsManagerGetSecretValuePolicy),
    "CloudFormationDescribeStacksPolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.cloudFormationDescribeStacksPolicy),
    "CloudWatchPutMetricPolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.cloudWatchPutMetricPolicy),
    "DynamoDBCrudPolicy": convertCfnFunctionTableSAMPTPropertyToCloudFormation(properties.dynamoDbCrudPolicy),
    "DynamoDBReadPolicy": convertCfnFunctionTableSAMPTPropertyToCloudFormation(properties.dynamoDbReadPolicy),
    "DynamoDBStreamReadPolicy": convertCfnFunctionTableStreamSAMPTPropertyToCloudFormation(properties.dynamoDbStreamReadPolicy),
    "DynamoDBWritePolicy": convertCfnFunctionTableSAMPTPropertyToCloudFormation(properties.dynamoDbWritePolicy),
    "EC2DescribePolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.ec2DescribePolicy),
    "ElasticsearchHttpPostPolicy": convertCfnFunctionDomainSAMPTPropertyToCloudFormation(properties.elasticsearchHttpPostPolicy),
    "FilterLogEventsPolicy": convertCfnFunctionLogGroupSAMPTPropertyToCloudFormation(properties.filterLogEventsPolicy),
    "KMSDecryptPolicy": convertCfnFunctionKeySAMPTPropertyToCloudFormation(properties.kmsDecryptPolicy),
    "KinesisCrudPolicy": convertCfnFunctionStreamSAMPTPropertyToCloudFormation(properties.kinesisCrudPolicy),
    "KinesisStreamReadPolicy": convertCfnFunctionStreamSAMPTPropertyToCloudFormation(properties.kinesisStreamReadPolicy),
    "LambdaInvokePolicy": convertCfnFunctionFunctionSAMPTPropertyToCloudFormation(properties.lambdaInvokePolicy),
    "RekognitionDetectOnlyPolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.rekognitionDetectOnlyPolicy),
    "RekognitionLabelsPolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.rekognitionLabelsPolicy),
    "RekognitionNoDataAccessPolicy": convertCfnFunctionCollectionSAMPTPropertyToCloudFormation(properties.rekognitionNoDataAccessPolicy),
    "RekognitionReadPolicy": convertCfnFunctionCollectionSAMPTPropertyToCloudFormation(properties.rekognitionReadPolicy),
    "RekognitionWriteOnlyAccessPolicy": convertCfnFunctionCollectionSAMPTPropertyToCloudFormation(properties.rekognitionWriteOnlyAccessPolicy),
    "S3CrudPolicy": convertCfnFunctionBucketSAMPTPropertyToCloudFormation(properties.s3CrudPolicy),
    "S3ReadPolicy": convertCfnFunctionBucketSAMPTPropertyToCloudFormation(properties.s3ReadPolicy),
    "S3WritePolicy": convertCfnFunctionBucketSAMPTPropertyToCloudFormation(properties.s3WritePolicy),
    "SESBulkTemplatedCrudPolicy": convertCfnFunctionIdentitySAMPTPropertyToCloudFormation(properties.sesBulkTemplatedCrudPolicy),
    "SESCrudPolicy": convertCfnFunctionIdentitySAMPTPropertyToCloudFormation(properties.sesCrudPolicy),
    "SESEmailTemplateCrudPolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.sesEmailTemplateCrudPolicy),
    "SESSendBouncePolicy": convertCfnFunctionIdentitySAMPTPropertyToCloudFormation(properties.sesSendBouncePolicy),
    "SNSCrudPolicy": convertCfnFunctionTopicSAMPTPropertyToCloudFormation(properties.snsCrudPolicy),
    "SNSPublishMessagePolicy": convertCfnFunctionTopicSAMPTPropertyToCloudFormation(properties.snsPublishMessagePolicy),
    "SQSPollerPolicy": convertCfnFunctionQueueSAMPTPropertyToCloudFormation(properties.sqsPollerPolicy),
    "SQSSendMessagePolicy": convertCfnFunctionQueueSAMPTPropertyToCloudFormation(properties.sqsSendMessagePolicy),
    "SSMParameterReadPolicy": convertCfnFunctionParameterNameSAMPTPropertyToCloudFormation(properties.ssmParameterReadPolicy),
    "StepFunctionsExecutionPolicy": convertCfnFunctionStateMachineSAMPTPropertyToCloudFormation(properties.stepFunctionsExecutionPolicy),
    "VPCAccessPolicy": convertCfnFunctionEmptySAMPTPropertyToCloudFormation(properties.vpcAccessPolicy)
  };
}

// @ts-ignore TS6133
function CfnFunctionSAMPolicyTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.SAMPolicyTemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SAMPolicyTemplateProperty>();
  ret.addPropertyResult("amiDescribePolicy", "AMIDescribePolicy", (properties.AMIDescribePolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.AMIDescribePolicy) : undefined));
  ret.addPropertyResult("awsSecretsManagerGetSecretValuePolicy", "AWSSecretsManagerGetSecretValuePolicy", (properties.AWSSecretsManagerGetSecretValuePolicy != null ? CfnFunctionSecretArnSAMPTPropertyFromCloudFormation(properties.AWSSecretsManagerGetSecretValuePolicy) : undefined));
  ret.addPropertyResult("cloudFormationDescribeStacksPolicy", "CloudFormationDescribeStacksPolicy", (properties.CloudFormationDescribeStacksPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.CloudFormationDescribeStacksPolicy) : undefined));
  ret.addPropertyResult("cloudWatchPutMetricPolicy", "CloudWatchPutMetricPolicy", (properties.CloudWatchPutMetricPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.CloudWatchPutMetricPolicy) : undefined));
  ret.addPropertyResult("dynamoDbCrudPolicy", "DynamoDBCrudPolicy", (properties.DynamoDBCrudPolicy != null ? CfnFunctionTableSAMPTPropertyFromCloudFormation(properties.DynamoDBCrudPolicy) : undefined));
  ret.addPropertyResult("dynamoDbReadPolicy", "DynamoDBReadPolicy", (properties.DynamoDBReadPolicy != null ? CfnFunctionTableSAMPTPropertyFromCloudFormation(properties.DynamoDBReadPolicy) : undefined));
  ret.addPropertyResult("dynamoDbStreamReadPolicy", "DynamoDBStreamReadPolicy", (properties.DynamoDBStreamReadPolicy != null ? CfnFunctionTableStreamSAMPTPropertyFromCloudFormation(properties.DynamoDBStreamReadPolicy) : undefined));
  ret.addPropertyResult("dynamoDbWritePolicy", "DynamoDBWritePolicy", (properties.DynamoDBWritePolicy != null ? CfnFunctionTableSAMPTPropertyFromCloudFormation(properties.DynamoDBWritePolicy) : undefined));
  ret.addPropertyResult("ec2DescribePolicy", "EC2DescribePolicy", (properties.EC2DescribePolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.EC2DescribePolicy) : undefined));
  ret.addPropertyResult("elasticsearchHttpPostPolicy", "ElasticsearchHttpPostPolicy", (properties.ElasticsearchHttpPostPolicy != null ? CfnFunctionDomainSAMPTPropertyFromCloudFormation(properties.ElasticsearchHttpPostPolicy) : undefined));
  ret.addPropertyResult("filterLogEventsPolicy", "FilterLogEventsPolicy", (properties.FilterLogEventsPolicy != null ? CfnFunctionLogGroupSAMPTPropertyFromCloudFormation(properties.FilterLogEventsPolicy) : undefined));
  ret.addPropertyResult("kinesisCrudPolicy", "KinesisCrudPolicy", (properties.KinesisCrudPolicy != null ? CfnFunctionStreamSAMPTPropertyFromCloudFormation(properties.KinesisCrudPolicy) : undefined));
  ret.addPropertyResult("kinesisStreamReadPolicy", "KinesisStreamReadPolicy", (properties.KinesisStreamReadPolicy != null ? CfnFunctionStreamSAMPTPropertyFromCloudFormation(properties.KinesisStreamReadPolicy) : undefined));
  ret.addPropertyResult("kmsDecryptPolicy", "KMSDecryptPolicy", (properties.KMSDecryptPolicy != null ? CfnFunctionKeySAMPTPropertyFromCloudFormation(properties.KMSDecryptPolicy) : undefined));
  ret.addPropertyResult("lambdaInvokePolicy", "LambdaInvokePolicy", (properties.LambdaInvokePolicy != null ? CfnFunctionFunctionSAMPTPropertyFromCloudFormation(properties.LambdaInvokePolicy) : undefined));
  ret.addPropertyResult("rekognitionDetectOnlyPolicy", "RekognitionDetectOnlyPolicy", (properties.RekognitionDetectOnlyPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.RekognitionDetectOnlyPolicy) : undefined));
  ret.addPropertyResult("rekognitionLabelsPolicy", "RekognitionLabelsPolicy", (properties.RekognitionLabelsPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.RekognitionLabelsPolicy) : undefined));
  ret.addPropertyResult("rekognitionNoDataAccessPolicy", "RekognitionNoDataAccessPolicy", (properties.RekognitionNoDataAccessPolicy != null ? CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties.RekognitionNoDataAccessPolicy) : undefined));
  ret.addPropertyResult("rekognitionReadPolicy", "RekognitionReadPolicy", (properties.RekognitionReadPolicy != null ? CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties.RekognitionReadPolicy) : undefined));
  ret.addPropertyResult("rekognitionWriteOnlyAccessPolicy", "RekognitionWriteOnlyAccessPolicy", (properties.RekognitionWriteOnlyAccessPolicy != null ? CfnFunctionCollectionSAMPTPropertyFromCloudFormation(properties.RekognitionWriteOnlyAccessPolicy) : undefined));
  ret.addPropertyResult("s3CrudPolicy", "S3CrudPolicy", (properties.S3CrudPolicy != null ? CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties.S3CrudPolicy) : undefined));
  ret.addPropertyResult("s3ReadPolicy", "S3ReadPolicy", (properties.S3ReadPolicy != null ? CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties.S3ReadPolicy) : undefined));
  ret.addPropertyResult("s3WritePolicy", "S3WritePolicy", (properties.S3WritePolicy != null ? CfnFunctionBucketSAMPTPropertyFromCloudFormation(properties.S3WritePolicy) : undefined));
  ret.addPropertyResult("sesBulkTemplatedCrudPolicy", "SESBulkTemplatedCrudPolicy", (properties.SESBulkTemplatedCrudPolicy != null ? CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties.SESBulkTemplatedCrudPolicy) : undefined));
  ret.addPropertyResult("sesCrudPolicy", "SESCrudPolicy", (properties.SESCrudPolicy != null ? CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties.SESCrudPolicy) : undefined));
  ret.addPropertyResult("sesEmailTemplateCrudPolicy", "SESEmailTemplateCrudPolicy", (properties.SESEmailTemplateCrudPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.SESEmailTemplateCrudPolicy) : undefined));
  ret.addPropertyResult("sesSendBouncePolicy", "SESSendBouncePolicy", (properties.SESSendBouncePolicy != null ? CfnFunctionIdentitySAMPTPropertyFromCloudFormation(properties.SESSendBouncePolicy) : undefined));
  ret.addPropertyResult("snsCrudPolicy", "SNSCrudPolicy", (properties.SNSCrudPolicy != null ? CfnFunctionTopicSAMPTPropertyFromCloudFormation(properties.SNSCrudPolicy) : undefined));
  ret.addPropertyResult("snsPublishMessagePolicy", "SNSPublishMessagePolicy", (properties.SNSPublishMessagePolicy != null ? CfnFunctionTopicSAMPTPropertyFromCloudFormation(properties.SNSPublishMessagePolicy) : undefined));
  ret.addPropertyResult("sqsPollerPolicy", "SQSPollerPolicy", (properties.SQSPollerPolicy != null ? CfnFunctionQueueSAMPTPropertyFromCloudFormation(properties.SQSPollerPolicy) : undefined));
  ret.addPropertyResult("sqsSendMessagePolicy", "SQSSendMessagePolicy", (properties.SQSSendMessagePolicy != null ? CfnFunctionQueueSAMPTPropertyFromCloudFormation(properties.SQSSendMessagePolicy) : undefined));
  ret.addPropertyResult("ssmParameterReadPolicy", "SSMParameterReadPolicy", (properties.SSMParameterReadPolicy != null ? CfnFunctionParameterNameSAMPTPropertyFromCloudFormation(properties.SSMParameterReadPolicy) : undefined));
  ret.addPropertyResult("stepFunctionsExecutionPolicy", "StepFunctionsExecutionPolicy", (properties.StepFunctionsExecutionPolicy != null ? CfnFunctionStateMachineSAMPTPropertyFromCloudFormation(properties.StepFunctionsExecutionPolicy) : undefined));
  ret.addPropertyResult("vpcAccessPolicy", "VPCAccessPolicy", (properties.VPCAccessPolicy != null ? CfnFunctionEmptySAMPTPropertyFromCloudFormation(properties.VPCAccessPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionEnvironmentProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionEnvironmentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFunctionEnvironmentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("variables", cdk.requiredValidator)(properties.variables));
  errors.collect(cdk.propertyValidator("variables", cdk.hashValidator(cdk.validateString))(properties.variables));
  return errors.wrap("supplied properties not correct for \"FunctionEnvironmentProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFunctionEnvironmentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFunctionEnvironmentPropertyValidator(properties).assertSuccess();
  return {
    "Variables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnFunctionFunctionEnvironmentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionEnvironmentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionEnvironmentProperty>();
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `VpcConfigProperty`
 *
 * @param properties - the TypeScript properties of a `VpcConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionVpcConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.requiredValidator)(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.requiredValidator)(properties.subnetIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"VpcConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionVpcConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionVpcConfigPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnFunctionVpcConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.VpcConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.VpcConfigProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3KeyFilterRuleProperty`
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterRuleProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionS3KeyFilterRulePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.validateString)(properties.value));
  return errors.wrap("supplied properties not correct for \"S3KeyFilterRuleProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionS3KeyFilterRulePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionS3KeyFilterRulePropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Value": cdk.stringToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnFunctionS3KeyFilterRulePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.S3KeyFilterRuleProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3KeyFilterRuleProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getString(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3KeyFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3KeyFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionS3KeyFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("rules", cdk.requiredValidator)(properties.rules));
  errors.collect(cdk.propertyValidator("rules", cdk.listValidator(CfnFunctionS3KeyFilterRulePropertyValidator))(properties.rules));
  return errors.wrap("supplied properties not correct for \"S3KeyFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionS3KeyFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionS3KeyFilterPropertyValidator(properties).assertSuccess();
  return {
    "Rules": cdk.listMapper(convertCfnFunctionS3KeyFilterRulePropertyToCloudFormation)(properties.rules)
  };
}

// @ts-ignore TS6133
function CfnFunctionS3KeyFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.S3KeyFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3KeyFilterProperty>();
  ret.addPropertyResult("rules", "Rules", (properties.Rules != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionS3KeyFilterRulePropertyFromCloudFormation)(properties.Rules) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3NotificationFilterProperty`
 *
 * @param properties - the TypeScript properties of a `S3NotificationFilterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionS3NotificationFilterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("s3Key", cdk.requiredValidator)(properties.s3Key));
  errors.collect(cdk.propertyValidator("s3Key", CfnFunctionS3KeyFilterPropertyValidator)(properties.s3Key));
  return errors.wrap("supplied properties not correct for \"S3NotificationFilterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionS3NotificationFilterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionS3NotificationFilterPropertyValidator(properties).assertSuccess();
  return {
    "S3Key": convertCfnFunctionS3KeyFilterPropertyToCloudFormation(properties.s3Key)
  };
}

// @ts-ignore TS6133
function CfnFunctionS3NotificationFilterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.S3NotificationFilterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3NotificationFilterProperty>();
  ret.addPropertyResult("s3Key", "S3Key", (properties.S3Key != null ? CfnFunctionS3KeyFilterPropertyFromCloudFormation(properties.S3Key) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3EventProperty`
 *
 * @param properties - the TypeScript properties of a `S3EventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionS3EventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("events", cdk.requiredValidator)(properties.events));
  errors.collect(cdk.propertyValidator("events", cdk.validateString)(properties.events));
  errors.collect(cdk.propertyValidator("filter", CfnFunctionS3NotificationFilterPropertyValidator)(properties.filter));
  return errors.wrap("supplied properties not correct for \"S3EventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionS3EventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionS3EventPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Events": cdk.stringToCloudFormation(properties.events),
    "Filter": convertCfnFunctionS3NotificationFilterPropertyToCloudFormation(properties.filter)
  };
}

// @ts-ignore TS6133
function CfnFunctionS3EventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.S3EventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.S3EventProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getString(properties.Events) : undefined));
  ret.addPropertyResult("filter", "Filter", (properties.Filter != null ? CfnFunctionS3NotificationFilterPropertyFromCloudFormation(properties.Filter) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SNSEventProperty`
 *
 * @param properties - the TypeScript properties of a `SNSEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionSNSEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("topic", cdk.requiredValidator)(properties.topic));
  errors.collect(cdk.propertyValidator("topic", cdk.validateString)(properties.topic));
  return errors.wrap("supplied properties not correct for \"SNSEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionSNSEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionSNSEventPropertyValidator(properties).assertSuccess();
  return {
    "Topic": cdk.stringToCloudFormation(properties.topic)
  };
}

// @ts-ignore TS6133
function CfnFunctionSNSEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.SNSEventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SNSEventProperty>();
  ret.addPropertyResult("topic", "Topic", (properties.Topic != null ? cfn_parse.FromCloudFormation.getString(properties.Topic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SQSEventProperty`
 *
 * @param properties - the TypeScript properties of a `SQSEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionSQSEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("queue", cdk.requiredValidator)(properties.queue));
  errors.collect(cdk.propertyValidator("queue", cdk.validateString)(properties.queue));
  return errors.wrap("supplied properties not correct for \"SQSEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionSQSEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionSQSEventPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Queue": cdk.stringToCloudFormation(properties.queue)
  };
}

// @ts-ignore TS6133
function CfnFunctionSQSEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.SQSEventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.SQSEventProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("queue", "Queue", (properties.Queue != null ? cfn_parse.FromCloudFormation.getString(properties.Queue) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `KinesisEventProperty`
 *
 * @param properties - the TypeScript properties of a `KinesisEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionKinesisEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("functionResponseTypes", cdk.listValidator(cdk.validateString))(properties.functionResponseTypes));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.requiredValidator)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("stream", cdk.requiredValidator)(properties.stream));
  errors.collect(cdk.propertyValidator("stream", cdk.validateString)(properties.stream));
  return errors.wrap("supplied properties not correct for \"KinesisEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionKinesisEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionKinesisEventPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "FunctionResponseTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.functionResponseTypes),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition),
    "Stream": cdk.stringToCloudFormation(properties.stream)
  };
}

// @ts-ignore TS6133
function CfnFunctionKinesisEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.KinesisEventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.KinesisEventProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("functionResponseTypes", "FunctionResponseTypes", (properties.FunctionResponseTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.FunctionResponseTypes) : undefined));
  ret.addPropertyResult("startingPosition", "StartingPosition", (properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined));
  ret.addPropertyResult("stream", "Stream", (properties.Stream != null ? cfn_parse.FromCloudFormation.getString(properties.Stream) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destination", cdk.requiredValidator)(properties.destination));
  errors.collect(cdk.propertyValidator("destination", cdk.validateString)(properties.destination));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDestinationPropertyValidator(properties).assertSuccess();
  return {
    "Destination": cdk.stringToCloudFormation(properties.destination),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFunctionDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DestinationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DestinationProperty>();
  ret.addPropertyResult("destination", "Destination", (properties.Destination != null ? cfn_parse.FromCloudFormation.getString(properties.Destination) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `DestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onFailure", cdk.requiredValidator)(properties.onFailure));
  errors.collect(cdk.propertyValidator("onFailure", CfnFunctionDestinationPropertyValidator)(properties.onFailure));
  return errors.wrap("supplied properties not correct for \"DestinationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDestinationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDestinationConfigPropertyValidator(properties).assertSuccess();
  return {
    "OnFailure": convertCfnFunctionDestinationPropertyToCloudFormation(properties.onFailure)
  };
}

// @ts-ignore TS6133
function CfnFunctionDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DestinationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DestinationConfigProperty>();
  ret.addPropertyResult("onFailure", "OnFailure", (properties.OnFailure != null ? CfnFunctionDestinationPropertyFromCloudFormation(properties.OnFailure) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DynamoDBEventProperty`
 *
 * @param properties - the TypeScript properties of a `DynamoDBEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDynamoDBEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("batchSize", cdk.validateNumber)(properties.batchSize));
  errors.collect(cdk.propertyValidator("bisectBatchOnFunctionError", cdk.validateBoolean)(properties.bisectBatchOnFunctionError));
  errors.collect(cdk.propertyValidator("destinationConfig", CfnFunctionDestinationConfigPropertyValidator)(properties.destinationConfig));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("maximumBatchingWindowInSeconds", cdk.validateNumber)(properties.maximumBatchingWindowInSeconds));
  errors.collect(cdk.propertyValidator("maximumRecordAgeInSeconds", cdk.validateNumber)(properties.maximumRecordAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  errors.collect(cdk.propertyValidator("parallelizationFactor", cdk.validateNumber)(properties.parallelizationFactor));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.requiredValidator)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("startingPosition", cdk.validateString)(properties.startingPosition));
  errors.collect(cdk.propertyValidator("stream", cdk.requiredValidator)(properties.stream));
  errors.collect(cdk.propertyValidator("stream", cdk.validateString)(properties.stream));
  return errors.wrap("supplied properties not correct for \"DynamoDBEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDynamoDBEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDynamoDBEventPropertyValidator(properties).assertSuccess();
  return {
    "BatchSize": cdk.numberToCloudFormation(properties.batchSize),
    "BisectBatchOnFunctionError": cdk.booleanToCloudFormation(properties.bisectBatchOnFunctionError),
    "DestinationConfig": convertCfnFunctionDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "MaximumBatchingWindowInSeconds": cdk.numberToCloudFormation(properties.maximumBatchingWindowInSeconds),
    "MaximumRecordAgeInSeconds": cdk.numberToCloudFormation(properties.maximumRecordAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts),
    "ParallelizationFactor": cdk.numberToCloudFormation(properties.parallelizationFactor),
    "StartingPosition": cdk.stringToCloudFormation(properties.startingPosition),
    "Stream": cdk.stringToCloudFormation(properties.stream)
  };
}

// @ts-ignore TS6133
function CfnFunctionDynamoDBEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DynamoDBEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DynamoDBEventProperty>();
  ret.addPropertyResult("batchSize", "BatchSize", (properties.BatchSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.BatchSize) : undefined));
  ret.addPropertyResult("bisectBatchOnFunctionError", "BisectBatchOnFunctionError", (properties.BisectBatchOnFunctionError != null ? cfn_parse.FromCloudFormation.getBoolean(properties.BisectBatchOnFunctionError) : undefined));
  ret.addPropertyResult("destinationConfig", "DestinationConfig", (properties.DestinationConfig != null ? CfnFunctionDestinationConfigPropertyFromCloudFormation(properties.DestinationConfig) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("maximumBatchingWindowInSeconds", "MaximumBatchingWindowInSeconds", (properties.MaximumBatchingWindowInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumBatchingWindowInSeconds) : undefined));
  ret.addPropertyResult("maximumRecordAgeInSeconds", "MaximumRecordAgeInSeconds", (properties.MaximumRecordAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRecordAgeInSeconds) : undefined));
  ret.addPropertyResult("maximumRetryAttempts", "MaximumRetryAttempts", (properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined));
  ret.addPropertyResult("parallelizationFactor", "ParallelizationFactor", (properties.ParallelizationFactor != null ? cfn_parse.FromCloudFormation.getNumber(properties.ParallelizationFactor) : undefined));
  ret.addPropertyResult("startingPosition", "StartingPosition", (properties.StartingPosition != null ? cfn_parse.FromCloudFormation.getString(properties.StartingPosition) : undefined));
  ret.addPropertyResult("stream", "Stream", (properties.Stream != null ? cfn_parse.FromCloudFormation.getString(properties.Stream) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthResourcePolicyProperty`
 *
 * @param properties - the TypeScript properties of a `AuthResourcePolicyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionAuthResourcePolicyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsAccountBlacklist", cdk.listValidator(cdk.validateString))(properties.awsAccountBlacklist));
  errors.collect(cdk.propertyValidator("awsAccountWhitelist", cdk.listValidator(cdk.validateString))(properties.awsAccountWhitelist));
  errors.collect(cdk.propertyValidator("customStatements", cdk.listValidator(cdk.validateObject))(properties.customStatements));
  errors.collect(cdk.propertyValidator("intrinsicVpcBlacklist", cdk.listValidator(cdk.validateString))(properties.intrinsicVpcBlacklist));
  errors.collect(cdk.propertyValidator("intrinsicVpcWhitelist", cdk.listValidator(cdk.validateString))(properties.intrinsicVpcWhitelist));
  errors.collect(cdk.propertyValidator("intrinsicVpceBlacklist", cdk.listValidator(cdk.validateString))(properties.intrinsicVpceBlacklist));
  errors.collect(cdk.propertyValidator("intrinsicVpceWhitelist", cdk.listValidator(cdk.validateString))(properties.intrinsicVpceWhitelist));
  errors.collect(cdk.propertyValidator("ipRangeBlacklist", cdk.listValidator(cdk.validateString))(properties.ipRangeBlacklist));
  errors.collect(cdk.propertyValidator("ipRangeWhitelist", cdk.listValidator(cdk.validateString))(properties.ipRangeWhitelist));
  errors.collect(cdk.propertyValidator("sourceVpcBlacklist", cdk.listValidator(cdk.validateString))(properties.sourceVpcBlacklist));
  errors.collect(cdk.propertyValidator("sourceVpcWhitelist", cdk.listValidator(cdk.validateString))(properties.sourceVpcWhitelist));
  return errors.wrap("supplied properties not correct for \"AuthResourcePolicyProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionAuthResourcePolicyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionAuthResourcePolicyPropertyValidator(properties).assertSuccess();
  return {
    "AwsAccountBlacklist": cdk.listMapper(cdk.stringToCloudFormation)(properties.awsAccountBlacklist),
    "AwsAccountWhitelist": cdk.listMapper(cdk.stringToCloudFormation)(properties.awsAccountWhitelist),
    "CustomStatements": cdk.listMapper(cdk.objectToCloudFormation)(properties.customStatements),
    "IntrinsicVpcBlacklist": cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpcBlacklist),
    "IntrinsicVpcWhitelist": cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpcWhitelist),
    "IntrinsicVpceBlacklist": cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpceBlacklist),
    "IntrinsicVpceWhitelist": cdk.listMapper(cdk.stringToCloudFormation)(properties.intrinsicVpceWhitelist),
    "IpRangeBlacklist": cdk.listMapper(cdk.stringToCloudFormation)(properties.ipRangeBlacklist),
    "IpRangeWhitelist": cdk.listMapper(cdk.stringToCloudFormation)(properties.ipRangeWhitelist),
    "SourceVpcBlacklist": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceVpcBlacklist),
    "SourceVpcWhitelist": cdk.listMapper(cdk.stringToCloudFormation)(properties.sourceVpcWhitelist)
  };
}

// @ts-ignore TS6133
function CfnFunctionAuthResourcePolicyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.AuthResourcePolicyProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.AuthResourcePolicyProperty>();
  ret.addPropertyResult("awsAccountBlacklist", "AwsAccountBlacklist", (properties.AwsAccountBlacklist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AwsAccountBlacklist) : undefined));
  ret.addPropertyResult("awsAccountWhitelist", "AwsAccountWhitelist", (properties.AwsAccountWhitelist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AwsAccountWhitelist) : undefined));
  ret.addPropertyResult("customStatements", "CustomStatements", (properties.CustomStatements != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.CustomStatements) : undefined));
  ret.addPropertyResult("intrinsicVpcBlacklist", "IntrinsicVpcBlacklist", (properties.IntrinsicVpcBlacklist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IntrinsicVpcBlacklist) : undefined));
  ret.addPropertyResult("intrinsicVpceBlacklist", "IntrinsicVpceBlacklist", (properties.IntrinsicVpceBlacklist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IntrinsicVpceBlacklist) : undefined));
  ret.addPropertyResult("intrinsicVpceWhitelist", "IntrinsicVpceWhitelist", (properties.IntrinsicVpceWhitelist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IntrinsicVpceWhitelist) : undefined));
  ret.addPropertyResult("intrinsicVpcWhitelist", "IntrinsicVpcWhitelist", (properties.IntrinsicVpcWhitelist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IntrinsicVpcWhitelist) : undefined));
  ret.addPropertyResult("ipRangeBlacklist", "IpRangeBlacklist", (properties.IpRangeBlacklist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IpRangeBlacklist) : undefined));
  ret.addPropertyResult("ipRangeWhitelist", "IpRangeWhitelist", (properties.IpRangeWhitelist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.IpRangeWhitelist) : undefined));
  ret.addPropertyResult("sourceVpcBlacklist", "SourceVpcBlacklist", (properties.SourceVpcBlacklist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceVpcBlacklist) : undefined));
  ret.addPropertyResult("sourceVpcWhitelist", "SourceVpcWhitelist", (properties.SourceVpcWhitelist != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SourceVpcWhitelist) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthProperty`
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionAuthPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiKeyRequired", cdk.validateBoolean)(properties.apiKeyRequired));
  errors.collect(cdk.propertyValidator("authorizationScopes", cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
  errors.collect(cdk.propertyValidator("authorizer", cdk.validateString)(properties.authorizer));
  errors.collect(cdk.propertyValidator("resourcePolicy", CfnFunctionAuthResourcePolicyPropertyValidator)(properties.resourcePolicy));
  return errors.wrap("supplied properties not correct for \"AuthProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionAuthPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionAuthPropertyValidator(properties).assertSuccess();
  return {
    "ApiKeyRequired": cdk.booleanToCloudFormation(properties.apiKeyRequired),
    "AuthorizationScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
    "Authorizer": cdk.stringToCloudFormation(properties.authorizer),
    "ResourcePolicy": convertCfnFunctionAuthResourcePolicyPropertyToCloudFormation(properties.resourcePolicy)
  };
}

// @ts-ignore TS6133
function CfnFunctionAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.AuthProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.AuthProperty>();
  ret.addPropertyResult("apiKeyRequired", "ApiKeyRequired", (properties.ApiKeyRequired != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ApiKeyRequired) : undefined));
  ret.addPropertyResult("authorizationScopes", "AuthorizationScopes", (properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthorizationScopes) : undefined));
  ret.addPropertyResult("authorizer", "Authorizer", (properties.Authorizer != null ? cfn_parse.FromCloudFormation.getString(properties.Authorizer) : undefined));
  ret.addPropertyResult("resourcePolicy", "ResourcePolicy", (properties.ResourcePolicy != null ? CfnFunctionAuthResourcePolicyPropertyFromCloudFormation(properties.ResourcePolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RequestModelProperty`
 *
 * @param properties - the TypeScript properties of a `RequestModelProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionRequestModelPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("model", cdk.requiredValidator)(properties.model));
  errors.collect(cdk.propertyValidator("model", cdk.validateString)(properties.model));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  errors.collect(cdk.propertyValidator("validateBody", cdk.validateBoolean)(properties.validateBody));
  errors.collect(cdk.propertyValidator("validateParameters", cdk.validateBoolean)(properties.validateParameters));
  return errors.wrap("supplied properties not correct for \"RequestModelProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionRequestModelPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionRequestModelPropertyValidator(properties).assertSuccess();
  return {
    "Model": cdk.stringToCloudFormation(properties.model),
    "Required": cdk.booleanToCloudFormation(properties.required),
    "ValidateBody": cdk.booleanToCloudFormation(properties.validateBody),
    "ValidateParameters": cdk.booleanToCloudFormation(properties.validateParameters)
  };
}

// @ts-ignore TS6133
function CfnFunctionRequestModelPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.RequestModelProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RequestModelProperty>();
  ret.addPropertyResult("model", "Model", (properties.Model != null ? cfn_parse.FromCloudFormation.getString(properties.Model) : undefined));
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addPropertyResult("validateBody", "ValidateBody", (properties.ValidateBody != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ValidateBody) : undefined));
  ret.addPropertyResult("validateParameters", "ValidateParameters", (properties.ValidateParameters != null ? cfn_parse.FromCloudFormation.getBoolean(properties.ValidateParameters) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RequestParameterProperty`
 *
 * @param properties - the TypeScript properties of a `RequestParameterProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionRequestParameterPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("caching", cdk.validateBoolean)(properties.caching));
  errors.collect(cdk.propertyValidator("required", cdk.validateBoolean)(properties.required));
  return errors.wrap("supplied properties not correct for \"RequestParameterProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionRequestParameterPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionRequestParameterPropertyValidator(properties).assertSuccess();
  return {
    "Caching": cdk.booleanToCloudFormation(properties.caching),
    "Required": cdk.booleanToCloudFormation(properties.required)
  };
}

// @ts-ignore TS6133
function CfnFunctionRequestParameterPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.RequestParameterProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RequestParameterProperty>();
  ret.addPropertyResult("caching", "Caching", (properties.Caching != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Caching) : undefined));
  ret.addPropertyResult("required", "Required", (properties.Required != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Required) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionApiEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("auth", CfnFunctionAuthPropertyValidator)(properties.auth));
  errors.collect(cdk.propertyValidator("method", cdk.requiredValidator)(properties.method));
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("requestModel", CfnFunctionRequestModelPropertyValidator)(properties.requestModel));
  errors.collect(cdk.propertyValidator("requestParameters", cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnFunctionRequestParameterPropertyValidator)))(properties.requestParameters));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  return errors.wrap("supplied properties not correct for \"ApiEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionApiEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionApiEventPropertyValidator(properties).assertSuccess();
  return {
    "Auth": convertCfnFunctionAuthPropertyToCloudFormation(properties.auth),
    "Method": cdk.stringToCloudFormation(properties.method),
    "Path": cdk.stringToCloudFormation(properties.path),
    "RequestModel": convertCfnFunctionRequestModelPropertyToCloudFormation(properties.requestModel),
    "RequestParameters": cdk.listMapper(cdk.unionMapper([cdk.validateString, CfnFunctionRequestParameterPropertyValidator], [cdk.stringToCloudFormation, convertCfnFunctionRequestParameterPropertyToCloudFormation]))(properties.requestParameters),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId)
  };
}

// @ts-ignore TS6133
function CfnFunctionApiEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ApiEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ApiEventProperty>();
  ret.addPropertyResult("auth", "Auth", (properties.Auth != null ? CfnFunctionAuthPropertyFromCloudFormation(properties.Auth) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("requestModel", "RequestModel", (properties.RequestModel != null ? CfnFunctionRequestModelPropertyFromCloudFormation(properties.RequestModel) : undefined));
  ret.addPropertyResult("requestParameters", "RequestParameters", (properties.RequestParameters != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnFunctionRequestParameterPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnFunctionRequestParameterPropertyFromCloudFormation]))(properties.RequestParameters) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleEventProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionScheduleEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("schedule", cdk.requiredValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  return errors.wrap("supplied properties not correct for \"ScheduleEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionScheduleEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionScheduleEventPropertyValidator(properties).assertSuccess();
  return {
    "Description": cdk.stringToCloudFormation(properties.description),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Input": cdk.stringToCloudFormation(properties.input),
    "Name": cdk.stringToCloudFormation(properties.name),
    "Schedule": cdk.stringToCloudFormation(properties.schedule)
  };
}

// @ts-ignore TS6133
function CfnFunctionScheduleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.ScheduleEventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ScheduleEventProperty>();
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchEventEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionCloudWatchEventEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("inputPath", cdk.validateString)(properties.inputPath));
  errors.collect(cdk.propertyValidator("pattern", cdk.requiredValidator)(properties.pattern));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateObject)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"CloudWatchEventEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionCloudWatchEventEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionCloudWatchEventEventPropertyValidator(properties).assertSuccess();
  return {
    "Input": cdk.stringToCloudFormation(properties.input),
    "InputPath": cdk.stringToCloudFormation(properties.inputPath),
    "Pattern": cdk.objectToCloudFormation(properties.pattern)
  };
}

// @ts-ignore TS6133
function CfnFunctionCloudWatchEventEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CloudWatchEventEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CloudWatchEventEventProperty>();
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("inputPath", "InputPath", (properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getAny(properties.Pattern) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionCloudWatchLogsEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("filterPattern", cdk.requiredValidator)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("filterPattern", cdk.validateString)(properties.filterPattern));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.requiredValidator)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionCloudWatchLogsEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionCloudWatchLogsEventPropertyValidator(properties).assertSuccess();
  return {
    "FilterPattern": cdk.stringToCloudFormation(properties.filterPattern),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName)
  };
}

// @ts-ignore TS6133
function CfnFunctionCloudWatchLogsEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CloudWatchLogsEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CloudWatchLogsEventProperty>();
  ret.addPropertyResult("filterPattern", "FilterPattern", (properties.FilterPattern != null ? cfn_parse.FromCloudFormation.getString(properties.FilterPattern) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IoTRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `IoTRuleEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionIoTRuleEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("awsIotSqlVersion", cdk.validateString)(properties.awsIotSqlVersion));
  errors.collect(cdk.propertyValidator("sql", cdk.requiredValidator)(properties.sql));
  errors.collect(cdk.propertyValidator("sql", cdk.validateString)(properties.sql));
  return errors.wrap("supplied properties not correct for \"IoTRuleEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionIoTRuleEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionIoTRuleEventPropertyValidator(properties).assertSuccess();
  return {
    "AwsIotSqlVersion": cdk.stringToCloudFormation(properties.awsIotSqlVersion),
    "Sql": cdk.stringToCloudFormation(properties.sql)
  };
}

// @ts-ignore TS6133
function CfnFunctionIoTRuleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.IoTRuleEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.IoTRuleEventProperty>();
  ret.addPropertyResult("awsIotSqlVersion", "AwsIotSqlVersion", (properties.AwsIotSqlVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AwsIotSqlVersion) : undefined));
  ret.addPropertyResult("sql", "Sql", (properties.Sql != null ? cfn_parse.FromCloudFormation.getString(properties.Sql) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AlexaSkillEventProperty`
 *
 * @param properties - the TypeScript properties of a `AlexaSkillEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionAlexaSkillEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("skillId", cdk.requiredValidator)(properties.skillId));
  errors.collect(cdk.propertyValidator("skillId", cdk.validateString)(properties.skillId));
  return errors.wrap("supplied properties not correct for \"AlexaSkillEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionAlexaSkillEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionAlexaSkillEventPropertyValidator(properties).assertSuccess();
  return {
    "SkillId": cdk.stringToCloudFormation(properties.skillId)
  };
}

// @ts-ignore TS6133
function CfnFunctionAlexaSkillEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.AlexaSkillEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.AlexaSkillEventProperty>();
  ret.addPropertyResult("skillId", "SkillId", (properties.SkillId != null ? cfn_parse.FromCloudFormation.getString(properties.SkillId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeRuleEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEventBridgeRuleEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBusName", cdk.validateString)(properties.eventBusName));
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("inputPath", cdk.validateString)(properties.inputPath));
  errors.collect(cdk.propertyValidator("pattern", cdk.requiredValidator)(properties.pattern));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateObject)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"EventBridgeRuleEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEventBridgeRuleEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEventBridgeRuleEventPropertyValidator(properties).assertSuccess();
  return {
    "EventBusName": cdk.stringToCloudFormation(properties.eventBusName),
    "Input": cdk.stringToCloudFormation(properties.input),
    "InputPath": cdk.stringToCloudFormation(properties.inputPath),
    "Pattern": cdk.objectToCloudFormation(properties.pattern)
  };
}

// @ts-ignore TS6133
function CfnFunctionEventBridgeRuleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventBridgeRuleEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventBridgeRuleEventProperty>();
  ret.addPropertyResult("eventBusName", "EventBusName", (properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("inputPath", "InputPath", (properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getAny(properties.Pattern) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpApiFunctionAuthProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiFunctionAuthProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionHttpApiFunctionAuthPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizationScopes", cdk.listValidator(cdk.validateString))(properties.authorizationScopes));
  errors.collect(cdk.propertyValidator("authorizer", cdk.validateString)(properties.authorizer));
  return errors.wrap("supplied properties not correct for \"HttpApiFunctionAuthProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionHttpApiFunctionAuthPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionHttpApiFunctionAuthPropertyValidator(properties).assertSuccess();
  return {
    "AuthorizationScopes": cdk.listMapper(cdk.stringToCloudFormation)(properties.authorizationScopes),
    "Authorizer": cdk.stringToCloudFormation(properties.authorizer)
  };
}

// @ts-ignore TS6133
function CfnFunctionHttpApiFunctionAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.HttpApiFunctionAuthProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.HttpApiFunctionAuthProperty>();
  ret.addPropertyResult("authorizationScopes", "AuthorizationScopes", (properties.AuthorizationScopes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AuthorizationScopes) : undefined));
  ret.addPropertyResult("authorizer", "Authorizer", (properties.Authorizer != null ? cfn_parse.FromCloudFormation.getString(properties.Authorizer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionRouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("detailedMetricsEnabled", cdk.validateBoolean)(properties.detailedMetricsEnabled));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap("supplied properties not correct for \"RouteSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionRouteSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionRouteSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "DetailedMetricsEnabled": cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit)
  };
}

// @ts-ignore TS6133
function CfnFunctionRouteSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.RouteSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.RouteSettingsProperty>();
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("detailedMetricsEnabled", "DetailedMetricsEnabled", (properties.DetailedMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetailedMetricsEnabled) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionHttpApiEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("apiId", cdk.validateString)(properties.apiId));
  errors.collect(cdk.propertyValidator("auth", CfnFunctionHttpApiFunctionAuthPropertyValidator)(properties.auth));
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("payloadFormatVersion", cdk.validateString)(properties.payloadFormatVersion));
  errors.collect(cdk.propertyValidator("routeSettings", CfnFunctionRouteSettingsPropertyValidator)(properties.routeSettings));
  errors.collect(cdk.propertyValidator("timeoutInMillis", cdk.validateNumber)(properties.timeoutInMillis));
  return errors.wrap("supplied properties not correct for \"HttpApiEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionHttpApiEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionHttpApiEventPropertyValidator(properties).assertSuccess();
  return {
    "ApiId": cdk.stringToCloudFormation(properties.apiId),
    "Auth": convertCfnFunctionHttpApiFunctionAuthPropertyToCloudFormation(properties.auth),
    "Method": cdk.stringToCloudFormation(properties.method),
    "Path": cdk.stringToCloudFormation(properties.path),
    "PayloadFormatVersion": cdk.stringToCloudFormation(properties.payloadFormatVersion),
    "RouteSettings": convertCfnFunctionRouteSettingsPropertyToCloudFormation(properties.routeSettings),
    "TimeoutInMillis": cdk.numberToCloudFormation(properties.timeoutInMillis)
  };
}

// @ts-ignore TS6133
function CfnFunctionHttpApiEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.HttpApiEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.HttpApiEventProperty>();
  ret.addPropertyResult("apiId", "ApiId", (properties.ApiId != null ? cfn_parse.FromCloudFormation.getString(properties.ApiId) : undefined));
  ret.addPropertyResult("auth", "Auth", (properties.Auth != null ? CfnFunctionHttpApiFunctionAuthPropertyFromCloudFormation(properties.Auth) : undefined));
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("payloadFormatVersion", "PayloadFormatVersion", (properties.PayloadFormatVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PayloadFormatVersion) : undefined));
  ret.addPropertyResult("routeSettings", "RouteSettings", (properties.RouteSettings != null ? CfnFunctionRouteSettingsPropertyFromCloudFormation(properties.RouteSettings) : undefined));
  ret.addPropertyResult("timeoutInMillis", "TimeoutInMillis", (properties.TimeoutInMillis != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMillis) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CognitoEventProperty`
 *
 * @param properties - the TypeScript properties of a `CognitoEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionCognitoEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("trigger", cdk.requiredValidator)(properties.trigger));
  errors.collect(cdk.propertyValidator("trigger", cdk.validateString)(properties.trigger));
  errors.collect(cdk.propertyValidator("userPool", cdk.requiredValidator)(properties.userPool));
  errors.collect(cdk.propertyValidator("userPool", cdk.validateString)(properties.userPool));
  return errors.wrap("supplied properties not correct for \"CognitoEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionCognitoEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionCognitoEventPropertyValidator(properties).assertSuccess();
  return {
    "Trigger": cdk.stringToCloudFormation(properties.trigger),
    "UserPool": cdk.stringToCloudFormation(properties.userPool)
  };
}

// @ts-ignore TS6133
function CfnFunctionCognitoEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CognitoEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CognitoEventProperty>();
  ret.addPropertyResult("trigger", "Trigger", (properties.Trigger != null ? cfn_parse.FromCloudFormation.getString(properties.Trigger) : undefined));
  ret.addPropertyResult("userPool", "UserPool", (properties.UserPool != null ? cfn_parse.FromCloudFormation.getString(properties.UserPool) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("properties", cdk.requiredValidator)(properties.properties));
  errors.collect(cdk.propertyValidator("properties", cdk.unionValidator(CfnFunctionDynamoDBEventPropertyValidator, CfnFunctionApiEventPropertyValidator, CfnFunctionKinesisEventPropertyValidator, CfnFunctionS3EventPropertyValidator, CfnFunctionCloudWatchLogsEventPropertyValidator, CfnFunctionCognitoEventPropertyValidator, CfnFunctionScheduleEventPropertyValidator, CfnFunctionEventBridgeRuleEventPropertyValidator, CfnFunctionCloudWatchEventEventPropertyValidator, CfnFunctionSQSEventPropertyValidator, CfnFunctionIoTRuleEventPropertyValidator, CfnFunctionAlexaSkillEventPropertyValidator, CfnFunctionSNSEventPropertyValidator, CfnFunctionHttpApiEventPropertyValidator))(properties.properties));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"EventSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEventSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEventSourcePropertyValidator(properties).assertSuccess();
  return {
    "Properties": cdk.unionMapper([CfnFunctionDynamoDBEventPropertyValidator, CfnFunctionApiEventPropertyValidator, CfnFunctionKinesisEventPropertyValidator, CfnFunctionS3EventPropertyValidator, CfnFunctionCloudWatchLogsEventPropertyValidator, CfnFunctionCognitoEventPropertyValidator, CfnFunctionScheduleEventPropertyValidator, CfnFunctionEventBridgeRuleEventPropertyValidator, CfnFunctionCloudWatchEventEventPropertyValidator, CfnFunctionSQSEventPropertyValidator, CfnFunctionIoTRuleEventPropertyValidator, CfnFunctionAlexaSkillEventPropertyValidator, CfnFunctionSNSEventPropertyValidator, CfnFunctionHttpApiEventPropertyValidator], [convertCfnFunctionDynamoDBEventPropertyToCloudFormation, convertCfnFunctionApiEventPropertyToCloudFormation, convertCfnFunctionKinesisEventPropertyToCloudFormation, convertCfnFunctionS3EventPropertyToCloudFormation, convertCfnFunctionCloudWatchLogsEventPropertyToCloudFormation, convertCfnFunctionCognitoEventPropertyToCloudFormation, convertCfnFunctionScheduleEventPropertyToCloudFormation, convertCfnFunctionEventBridgeRuleEventPropertyToCloudFormation, convertCfnFunctionCloudWatchEventEventPropertyToCloudFormation, convertCfnFunctionSQSEventPropertyToCloudFormation, convertCfnFunctionIoTRuleEventPropertyToCloudFormation, convertCfnFunctionAlexaSkillEventPropertyToCloudFormation, convertCfnFunctionSNSEventPropertyToCloudFormation, convertCfnFunctionHttpApiEventPropertyToCloudFormation])(properties.properties),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFunctionEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventSourceProperty>();
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnFunctionDynamoDBEventPropertyValidator, CfnFunctionApiEventPropertyValidator, CfnFunctionKinesisEventPropertyValidator, CfnFunctionS3EventPropertyValidator, CfnFunctionCloudWatchLogsEventPropertyValidator, CfnFunctionCognitoEventPropertyValidator, CfnFunctionScheduleEventPropertyValidator, CfnFunctionEventBridgeRuleEventPropertyValidator, CfnFunctionCloudWatchEventEventPropertyValidator, CfnFunctionSQSEventPropertyValidator, CfnFunctionIoTRuleEventPropertyValidator, CfnFunctionAlexaSkillEventPropertyValidator, CfnFunctionSNSEventPropertyValidator, CfnFunctionHttpApiEventPropertyValidator], [CfnFunctionDynamoDBEventPropertyFromCloudFormation, CfnFunctionApiEventPropertyFromCloudFormation, CfnFunctionKinesisEventPropertyFromCloudFormation, CfnFunctionS3EventPropertyFromCloudFormation, CfnFunctionCloudWatchLogsEventPropertyFromCloudFormation, CfnFunctionCognitoEventPropertyFromCloudFormation, CfnFunctionScheduleEventPropertyFromCloudFormation, CfnFunctionEventBridgeRuleEventPropertyFromCloudFormation, CfnFunctionCloudWatchEventEventPropertyFromCloudFormation, CfnFunctionSQSEventPropertyFromCloudFormation, CfnFunctionIoTRuleEventPropertyFromCloudFormation, CfnFunctionAlexaSkillEventPropertyFromCloudFormation, CfnFunctionSNSEventPropertyFromCloudFormation, CfnFunctionHttpApiEventPropertyFromCloudFormation])(properties.Properties) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeadLetterQueueProperty`
 *
 * @param properties - the TypeScript properties of a `DeadLetterQueueProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDeadLetterQueuePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("targetArn", cdk.requiredValidator)(properties.targetArn));
  errors.collect(cdk.propertyValidator("targetArn", cdk.validateString)(properties.targetArn));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DeadLetterQueueProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDeadLetterQueuePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDeadLetterQueuePropertyValidator(properties).assertSuccess();
  return {
    "TargetArn": cdk.stringToCloudFormation(properties.targetArn),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFunctionDeadLetterQueuePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DeadLetterQueueProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DeadLetterQueueProperty>();
  ret.addPropertyResult("targetArn", "TargetArn", (properties.TargetArn != null ? cfn_parse.FromCloudFormation.getString(properties.TargetArn) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HooksProperty`
 *
 * @param properties - the TypeScript properties of a `HooksProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionHooksPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("postTraffic", cdk.validateString)(properties.postTraffic));
  errors.collect(cdk.propertyValidator("preTraffic", cdk.validateString)(properties.preTraffic));
  return errors.wrap("supplied properties not correct for \"HooksProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionHooksPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionHooksPropertyValidator(properties).assertSuccess();
  return {
    "PostTraffic": cdk.stringToCloudFormation(properties.postTraffic),
    "PreTraffic": cdk.stringToCloudFormation(properties.preTraffic)
  };
}

// @ts-ignore TS6133
function CfnFunctionHooksPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.HooksProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.HooksProperty>();
  ret.addPropertyResult("postTraffic", "PostTraffic", (properties.PostTraffic != null ? cfn_parse.FromCloudFormation.getString(properties.PostTraffic) : undefined));
  ret.addPropertyResult("preTraffic", "PreTraffic", (properties.PreTraffic != null ? cfn_parse.FromCloudFormation.getString(properties.PreTraffic) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DeploymentPreferenceProperty`
 *
 * @param properties - the TypeScript properties of a `DeploymentPreferenceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionDeploymentPreferencePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("alarms", cdk.listValidator(cdk.validateString))(properties.alarms));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("hooks", CfnFunctionHooksPropertyValidator)(properties.hooks));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"DeploymentPreferenceProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionDeploymentPreferencePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionDeploymentPreferencePropertyValidator(properties).assertSuccess();
  return {
    "Alarms": cdk.listMapper(cdk.stringToCloudFormation)(properties.alarms),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "Hooks": convertCfnFunctionHooksPropertyToCloudFormation(properties.hooks),
    "Role": cdk.stringToCloudFormation(properties.role),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnFunctionDeploymentPreferencePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.DeploymentPreferenceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.DeploymentPreferenceProperty>();
  ret.addPropertyResult("alarms", "Alarms", (properties.Alarms != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Alarms) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("hooks", "Hooks", (properties.Hooks != null ? CfnFunctionHooksPropertyFromCloudFormation(properties.Hooks) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisionedConcurrencyConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedConcurrencyConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionProvisionedConcurrencyConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("provisionedConcurrentExecutions", cdk.requiredValidator)(properties.provisionedConcurrentExecutions));
  errors.collect(cdk.propertyValidator("provisionedConcurrentExecutions", cdk.validateString)(properties.provisionedConcurrentExecutions));
  return errors.wrap("supplied properties not correct for \"ProvisionedConcurrencyConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionProvisionedConcurrencyConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionProvisionedConcurrencyConfigPropertyValidator(properties).assertSuccess();
  return {
    "ProvisionedConcurrentExecutions": cdk.stringToCloudFormation(properties.provisionedConcurrentExecutions)
  };
}

// @ts-ignore TS6133
function CfnFunctionProvisionedConcurrencyConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnFunction.ProvisionedConcurrencyConfigProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ProvisionedConcurrencyConfigProperty>();
  ret.addPropertyResult("provisionedConcurrentExecutions", "ProvisionedConcurrentExecutions", (properties.ProvisionedConcurrentExecutions != null ? cfn_parse.FromCloudFormation.getString(properties.ProvisionedConcurrentExecutions) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventInvokeDestinationConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EventInvokeDestinationConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEventInvokeDestinationConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("onFailure", cdk.requiredValidator)(properties.onFailure));
  errors.collect(cdk.propertyValidator("onFailure", CfnFunctionDestinationPropertyValidator)(properties.onFailure));
  errors.collect(cdk.propertyValidator("onSuccess", cdk.requiredValidator)(properties.onSuccess));
  errors.collect(cdk.propertyValidator("onSuccess", CfnFunctionDestinationPropertyValidator)(properties.onSuccess));
  return errors.wrap("supplied properties not correct for \"EventInvokeDestinationConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEventInvokeDestinationConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEventInvokeDestinationConfigPropertyValidator(properties).assertSuccess();
  return {
    "OnFailure": convertCfnFunctionDestinationPropertyToCloudFormation(properties.onFailure),
    "OnSuccess": convertCfnFunctionDestinationPropertyToCloudFormation(properties.onSuccess)
  };
}

// @ts-ignore TS6133
function CfnFunctionEventInvokeDestinationConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventInvokeDestinationConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventInvokeDestinationConfigProperty>();
  ret.addPropertyResult("onFailure", "OnFailure", (properties.OnFailure != null ? CfnFunctionDestinationPropertyFromCloudFormation(properties.OnFailure) : undefined));
  ret.addPropertyResult("onSuccess", "OnSuccess", (properties.OnSuccess != null ? CfnFunctionDestinationPropertyFromCloudFormation(properties.OnSuccess) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventInvokeConfigProperty`
 *
 * @param properties - the TypeScript properties of a `EventInvokeConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEventInvokeConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationConfig", CfnFunctionEventInvokeDestinationConfigPropertyValidator)(properties.destinationConfig));
  errors.collect(cdk.propertyValidator("maximumEventAgeInSeconds", cdk.validateNumber)(properties.maximumEventAgeInSeconds));
  errors.collect(cdk.propertyValidator("maximumRetryAttempts", cdk.validateNumber)(properties.maximumRetryAttempts));
  return errors.wrap("supplied properties not correct for \"EventInvokeConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEventInvokeConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEventInvokeConfigPropertyValidator(properties).assertSuccess();
  return {
    "DestinationConfig": convertCfnFunctionEventInvokeDestinationConfigPropertyToCloudFormation(properties.destinationConfig),
    "MaximumEventAgeInSeconds": cdk.numberToCloudFormation(properties.maximumEventAgeInSeconds),
    "MaximumRetryAttempts": cdk.numberToCloudFormation(properties.maximumRetryAttempts)
  };
}

// @ts-ignore TS6133
function CfnFunctionEventInvokeConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EventInvokeConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EventInvokeConfigProperty>();
  ret.addPropertyResult("destinationConfig", "DestinationConfig", (properties.DestinationConfig != null ? CfnFunctionEventInvokeDestinationConfigPropertyFromCloudFormation(properties.DestinationConfig) : undefined));
  ret.addPropertyResult("maximumEventAgeInSeconds", "MaximumEventAgeInSeconds", (properties.MaximumEventAgeInSeconds != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumEventAgeInSeconds) : undefined));
  ret.addPropertyResult("maximumRetryAttempts", "MaximumRetryAttempts", (properties.MaximumRetryAttempts != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaximumRetryAttempts) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageConfigProperty`
 *
 * @param properties - the TypeScript properties of a `ImageConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionImageConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("command", cdk.listValidator(cdk.validateString))(properties.command));
  errors.collect(cdk.propertyValidator("entryPoint", cdk.listValidator(cdk.validateString))(properties.entryPoint));
  errors.collect(cdk.propertyValidator("workingDirectory", cdk.validateString)(properties.workingDirectory));
  return errors.wrap("supplied properties not correct for \"ImageConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionImageConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionImageConfigPropertyValidator(properties).assertSuccess();
  return {
    "Command": cdk.listMapper(cdk.stringToCloudFormation)(properties.command),
    "EntryPoint": cdk.listMapper(cdk.stringToCloudFormation)(properties.entryPoint),
    "WorkingDirectory": cdk.stringToCloudFormation(properties.workingDirectory)
  };
}

// @ts-ignore TS6133
function CfnFunctionImageConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.ImageConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.ImageConfigProperty>();
  ret.addPropertyResult("command", "Command", (properties.Command != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Command) : undefined));
  ret.addPropertyResult("entryPoint", "EntryPoint", (properties.EntryPoint != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.EntryPoint) : undefined));
  ret.addPropertyResult("workingDirectory", "WorkingDirectory", (properties.WorkingDirectory != null ? cfn_parse.FromCloudFormation.getString(properties.WorkingDirectory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionCorsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCredentials", cdk.validateBoolean)(properties.allowCredentials));
  errors.collect(cdk.propertyValidator("allowHeaders", cdk.validateString)(properties.allowHeaders));
  errors.collect(cdk.propertyValidator("allowMethods", cdk.validateString)(properties.allowMethods));
  errors.collect(cdk.propertyValidator("allowOrigin", cdk.requiredValidator)(properties.allowOrigin));
  errors.collect(cdk.propertyValidator("allowOrigin", cdk.validateString)(properties.allowOrigin));
  errors.collect(cdk.propertyValidator("maxAge", cdk.validateString)(properties.maxAge));
  return errors.wrap("supplied properties not correct for \"CorsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionCorsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionCorsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowCredentials": cdk.booleanToCloudFormation(properties.allowCredentials),
    "AllowHeaders": cdk.stringToCloudFormation(properties.allowHeaders),
    "AllowMethods": cdk.stringToCloudFormation(properties.allowMethods),
    "AllowOrigin": cdk.stringToCloudFormation(properties.allowOrigin),
    "MaxAge": cdk.stringToCloudFormation(properties.maxAge)
  };
}

// @ts-ignore TS6133
function CfnFunctionCorsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.CorsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.CorsConfigurationProperty>();
  ret.addPropertyResult("allowCredentials", "AllowCredentials", (properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined));
  ret.addPropertyResult("allowHeaders", "AllowHeaders", (properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getString(properties.AllowHeaders) : undefined));
  ret.addPropertyResult("allowMethods", "AllowMethods", (properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getString(properties.AllowMethods) : undefined));
  ret.addPropertyResult("allowOrigin", "AllowOrigin", (properties.AllowOrigin != null ? cfn_parse.FromCloudFormation.getString(properties.AllowOrigin) : undefined));
  ret.addPropertyResult("maxAge", "MaxAge", (properties.MaxAge != null ? cfn_parse.FromCloudFormation.getString(properties.MaxAge) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionUrlConfigProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionUrlConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionFunctionUrlConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authType", cdk.requiredValidator)(properties.authType));
  errors.collect(cdk.propertyValidator("authType", cdk.validateString)(properties.authType));
  errors.collect(cdk.propertyValidator("cors", cdk.unionValidator(cdk.validateString, CfnFunctionCorsConfigurationPropertyValidator))(properties.cors));
  errors.collect(cdk.propertyValidator("invokeMode", cdk.validateString)(properties.invokeMode));
  return errors.wrap("supplied properties not correct for \"FunctionUrlConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionFunctionUrlConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionFunctionUrlConfigPropertyValidator(properties).assertSuccess();
  return {
    "AuthType": cdk.stringToCloudFormation(properties.authType),
    "Cors": cdk.unionMapper([cdk.validateString, CfnFunctionCorsConfigurationPropertyValidator], [cdk.stringToCloudFormation, convertCfnFunctionCorsConfigurationPropertyToCloudFormation])(properties.cors),
    "InvokeMode": cdk.stringToCloudFormation(properties.invokeMode)
  };
}

// @ts-ignore TS6133
function CfnFunctionFunctionUrlConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.FunctionUrlConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.FunctionUrlConfigProperty>();
  ret.addPropertyResult("authType", "AuthType", (properties.AuthType != null ? cfn_parse.FromCloudFormation.getString(properties.AuthType) : undefined));
  ret.addPropertyResult("cors", "Cors", (properties.Cors != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnFunctionCorsConfigurationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnFunctionCorsConfigurationPropertyFromCloudFormation])(properties.Cors) : undefined));
  ret.addPropertyResult("invokeMode", "InvokeMode", (properties.InvokeMode != null ? cfn_parse.FromCloudFormation.getString(properties.InvokeMode) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EphemeralStorageProperty`
 *
 * @param properties - the TypeScript properties of a `EphemeralStorageProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionEphemeralStoragePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("size", cdk.requiredValidator)(properties.size));
  errors.collect(cdk.propertyValidator("size", cdk.validateNumber)(properties.size));
  return errors.wrap("supplied properties not correct for \"EphemeralStorageProperty\"");
}

// @ts-ignore TS6133
function convertCfnFunctionEphemeralStoragePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionEphemeralStoragePropertyValidator(properties).assertSuccess();
  return {
    "Size": cdk.numberToCloudFormation(properties.size)
  };
}

// @ts-ignore TS6133
function CfnFunctionEphemeralStoragePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunction.EphemeralStorageProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunction.EphemeralStorageProperty>();
  ret.addPropertyResult("size", "Size", (properties.Size != null ? cfn_parse.FromCloudFormation.getNumber(properties.Size) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnFunctionProps`
 *
 * @param properties - the TypeScript properties of a `CfnFunctionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnFunctionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("architectures", cdk.listValidator(cdk.validateString))(properties.architectures));
  errors.collect(cdk.propertyValidator("assumeRolePolicyDocument", cdk.validateObject)(properties.assumeRolePolicyDocument));
  errors.collect(cdk.propertyValidator("autoPublishAlias", cdk.validateString)(properties.autoPublishAlias));
  errors.collect(cdk.propertyValidator("autoPublishCodeSha256", cdk.validateString)(properties.autoPublishCodeSha256));
  errors.collect(cdk.propertyValidator("codeSigningConfigArn", cdk.validateString)(properties.codeSigningConfigArn));
  errors.collect(cdk.propertyValidator("codeUri", cdk.unionValidator(cdk.validateString, CfnFunctionS3LocationPropertyValidator))(properties.codeUri));
  errors.collect(cdk.propertyValidator("deadLetterQueue", CfnFunctionDeadLetterQueuePropertyValidator)(properties.deadLetterQueue));
  errors.collect(cdk.propertyValidator("deploymentPreference", CfnFunctionDeploymentPreferencePropertyValidator)(properties.deploymentPreference));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("environment", CfnFunctionFunctionEnvironmentPropertyValidator)(properties.environment));
  errors.collect(cdk.propertyValidator("ephemeralStorage", CfnFunctionEphemeralStoragePropertyValidator)(properties.ephemeralStorage));
  errors.collect(cdk.propertyValidator("eventInvokeConfig", CfnFunctionEventInvokeConfigPropertyValidator)(properties.eventInvokeConfig));
  errors.collect(cdk.propertyValidator("events", cdk.hashValidator(CfnFunctionEventSourcePropertyValidator))(properties.events));
  errors.collect(cdk.propertyValidator("fileSystemConfigs", cdk.listValidator(CfnFunctionFileSystemConfigPropertyValidator))(properties.fileSystemConfigs));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionUrlConfig", CfnFunctionFunctionUrlConfigPropertyValidator)(properties.functionUrlConfig));
  errors.collect(cdk.propertyValidator("handler", cdk.validateString)(properties.handler));
  errors.collect(cdk.propertyValidator("imageConfig", CfnFunctionImageConfigPropertyValidator)(properties.imageConfig));
  errors.collect(cdk.propertyValidator("imageUri", cdk.validateString)(properties.imageUri));
  errors.collect(cdk.propertyValidator("inlineCode", cdk.validateString)(properties.inlineCode));
  errors.collect(cdk.propertyValidator("kmsKeyArn", cdk.validateString)(properties.kmsKeyArn));
  errors.collect(cdk.propertyValidator("layers", cdk.listValidator(cdk.validateString))(properties.layers));
  errors.collect(cdk.propertyValidator("memorySize", cdk.validateNumber)(properties.memorySize));
  errors.collect(cdk.propertyValidator("packageType", cdk.validateString)(properties.packageType));
  errors.collect(cdk.propertyValidator("permissionsBoundary", cdk.validateString)(properties.permissionsBoundary));
  errors.collect(cdk.propertyValidator("policies", cdk.unionValidator(cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator, CfnFunctionSAMPolicyTemplatePropertyValidator)), cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator))(properties.policies));
  errors.collect(cdk.propertyValidator("provisionedConcurrencyConfig", CfnFunctionProvisionedConcurrencyConfigPropertyValidator)(properties.provisionedConcurrencyConfig));
  errors.collect(cdk.propertyValidator("reservedConcurrentExecutions", cdk.validateNumber)(properties.reservedConcurrentExecutions));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("runtime", cdk.validateString)(properties.runtime));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("timeout", cdk.validateNumber)(properties.timeout));
  errors.collect(cdk.propertyValidator("tracing", cdk.validateString)(properties.tracing));
  errors.collect(cdk.propertyValidator("versionDescription", cdk.validateString)(properties.versionDescription));
  errors.collect(cdk.propertyValidator("vpcConfig", CfnFunctionVpcConfigPropertyValidator)(properties.vpcConfig));
  return errors.wrap("supplied properties not correct for \"CfnFunctionProps\"");
}

// @ts-ignore TS6133
function convertCfnFunctionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnFunctionPropsValidator(properties).assertSuccess();
  return {
    "Architectures": cdk.listMapper(cdk.stringToCloudFormation)(properties.architectures),
    "AssumeRolePolicyDocument": cdk.objectToCloudFormation(properties.assumeRolePolicyDocument),
    "AutoPublishAlias": cdk.stringToCloudFormation(properties.autoPublishAlias),
    "AutoPublishCodeSha256": cdk.stringToCloudFormation(properties.autoPublishCodeSha256),
    "CodeSigningConfigArn": cdk.stringToCloudFormation(properties.codeSigningConfigArn),
    "CodeUri": cdk.unionMapper([cdk.validateString, CfnFunctionS3LocationPropertyValidator], [cdk.stringToCloudFormation, convertCfnFunctionS3LocationPropertyToCloudFormation])(properties.codeUri),
    "DeadLetterQueue": convertCfnFunctionDeadLetterQueuePropertyToCloudFormation(properties.deadLetterQueue),
    "DeploymentPreference": convertCfnFunctionDeploymentPreferencePropertyToCloudFormation(properties.deploymentPreference),
    "Description": cdk.stringToCloudFormation(properties.description),
    "Environment": convertCfnFunctionFunctionEnvironmentPropertyToCloudFormation(properties.environment),
    "EphemeralStorage": convertCfnFunctionEphemeralStoragePropertyToCloudFormation(properties.ephemeralStorage),
    "EventInvokeConfig": convertCfnFunctionEventInvokeConfigPropertyToCloudFormation(properties.eventInvokeConfig),
    "Events": cdk.hashMapper(convertCfnFunctionEventSourcePropertyToCloudFormation)(properties.events),
    "FileSystemConfigs": cdk.listMapper(convertCfnFunctionFileSystemConfigPropertyToCloudFormation)(properties.fileSystemConfigs),
    "FunctionName": cdk.stringToCloudFormation(properties.functionName),
    "FunctionUrlConfig": convertCfnFunctionFunctionUrlConfigPropertyToCloudFormation(properties.functionUrlConfig),
    "Handler": cdk.stringToCloudFormation(properties.handler),
    "ImageConfig": convertCfnFunctionImageConfigPropertyToCloudFormation(properties.imageConfig),
    "ImageUri": cdk.stringToCloudFormation(properties.imageUri),
    "InlineCode": cdk.stringToCloudFormation(properties.inlineCode),
    "KmsKeyArn": cdk.stringToCloudFormation(properties.kmsKeyArn),
    "Layers": cdk.listMapper(cdk.stringToCloudFormation)(properties.layers),
    "MemorySize": cdk.numberToCloudFormation(properties.memorySize),
    "PackageType": cdk.stringToCloudFormation(properties.packageType),
    "PermissionsBoundary": cdk.stringToCloudFormation(properties.permissionsBoundary),
    "Policies": cdk.unionMapper([cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator, CfnFunctionSAMPolicyTemplatePropertyValidator)), cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator], [cdk.listMapper(cdk.unionMapper([cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator, CfnFunctionSAMPolicyTemplatePropertyValidator], [cdk.stringToCloudFormation, convertCfnFunctionIAMPolicyDocumentPropertyToCloudFormation, convertCfnFunctionSAMPolicyTemplatePropertyToCloudFormation])), cdk.stringToCloudFormation, convertCfnFunctionIAMPolicyDocumentPropertyToCloudFormation])(properties.policies),
    "ProvisionedConcurrencyConfig": convertCfnFunctionProvisionedConcurrencyConfigPropertyToCloudFormation(properties.provisionedConcurrencyConfig),
    "ReservedConcurrentExecutions": cdk.numberToCloudFormation(properties.reservedConcurrentExecutions),
    "Role": cdk.stringToCloudFormation(properties.role),
    "Runtime": cdk.stringToCloudFormation(properties.runtime),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Timeout": cdk.numberToCloudFormation(properties.timeout),
    "Tracing": cdk.stringToCloudFormation(properties.tracing),
    "VersionDescription": cdk.stringToCloudFormation(properties.versionDescription),
    "VpcConfig": convertCfnFunctionVpcConfigPropertyToCloudFormation(properties.vpcConfig)
  };
}

// @ts-ignore TS6133
function CfnFunctionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnFunctionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnFunctionProps>();
  ret.addPropertyResult("architectures", "Architectures", (properties.Architectures != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Architectures) : undefined));
  ret.addPropertyResult("assumeRolePolicyDocument", "AssumeRolePolicyDocument", (properties.AssumeRolePolicyDocument != null ? cfn_parse.FromCloudFormation.getAny(properties.AssumeRolePolicyDocument) : undefined));
  ret.addPropertyResult("autoPublishAlias", "AutoPublishAlias", (properties.AutoPublishAlias != null ? cfn_parse.FromCloudFormation.getString(properties.AutoPublishAlias) : undefined));
  ret.addPropertyResult("autoPublishCodeSha256", "AutoPublishCodeSha256", (properties.AutoPublishCodeSha256 != null ? cfn_parse.FromCloudFormation.getString(properties.AutoPublishCodeSha256) : undefined));
  ret.addPropertyResult("codeSigningConfigArn", "CodeSigningConfigArn", (properties.CodeSigningConfigArn != null ? cfn_parse.FromCloudFormation.getString(properties.CodeSigningConfigArn) : undefined));
  ret.addPropertyResult("codeUri", "CodeUri", (properties.CodeUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnFunctionS3LocationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnFunctionS3LocationPropertyFromCloudFormation])(properties.CodeUri) : undefined));
  ret.addPropertyResult("deadLetterQueue", "DeadLetterQueue", (properties.DeadLetterQueue != null ? CfnFunctionDeadLetterQueuePropertyFromCloudFormation(properties.DeadLetterQueue) : undefined));
  ret.addPropertyResult("deploymentPreference", "DeploymentPreference", (properties.DeploymentPreference != null ? CfnFunctionDeploymentPreferencePropertyFromCloudFormation(properties.DeploymentPreference) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("environment", "Environment", (properties.Environment != null ? CfnFunctionFunctionEnvironmentPropertyFromCloudFormation(properties.Environment) : undefined));
  ret.addPropertyResult("ephemeralStorage", "EphemeralStorage", (properties.EphemeralStorage != null ? CfnFunctionEphemeralStoragePropertyFromCloudFormation(properties.EphemeralStorage) : undefined));
  ret.addPropertyResult("eventInvokeConfig", "EventInvokeConfig", (properties.EventInvokeConfig != null ? CfnFunctionEventInvokeConfigPropertyFromCloudFormation(properties.EventInvokeConfig) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnFunctionEventSourcePropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addPropertyResult("fileSystemConfigs", "FileSystemConfigs", (properties.FileSystemConfigs != null ? cfn_parse.FromCloudFormation.getArray(CfnFunctionFileSystemConfigPropertyFromCloudFormation)(properties.FileSystemConfigs) : undefined));
  ret.addPropertyResult("functionName", "FunctionName", (properties.FunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionName) : undefined));
  ret.addPropertyResult("functionUrlConfig", "FunctionUrlConfig", (properties.FunctionUrlConfig != null ? CfnFunctionFunctionUrlConfigPropertyFromCloudFormation(properties.FunctionUrlConfig) : undefined));
  ret.addPropertyResult("handler", "Handler", (properties.Handler != null ? cfn_parse.FromCloudFormation.getString(properties.Handler) : undefined));
  ret.addPropertyResult("imageConfig", "ImageConfig", (properties.ImageConfig != null ? CfnFunctionImageConfigPropertyFromCloudFormation(properties.ImageConfig) : undefined));
  ret.addPropertyResult("imageUri", "ImageUri", (properties.ImageUri != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUri) : undefined));
  ret.addPropertyResult("inlineCode", "InlineCode", (properties.InlineCode != null ? cfn_parse.FromCloudFormation.getString(properties.InlineCode) : undefined));
  ret.addPropertyResult("kmsKeyArn", "KmsKeyArn", (properties.KmsKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKeyArn) : undefined));
  ret.addPropertyResult("layers", "Layers", (properties.Layers != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Layers) : undefined));
  ret.addPropertyResult("memorySize", "MemorySize", (properties.MemorySize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MemorySize) : undefined));
  ret.addPropertyResult("packageType", "PackageType", (properties.PackageType != null ? cfn_parse.FromCloudFormation.getString(properties.PackageType) : undefined));
  ret.addPropertyResult("permissionsBoundary", "PermissionsBoundary", (properties.PermissionsBoundary != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionsBoundary) : undefined));
  ret.addPropertyResult("policies", "Policies", (properties.Policies != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator, CfnFunctionSAMPolicyTemplatePropertyValidator)), cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator], [cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnFunctionIAMPolicyDocumentPropertyValidator, CfnFunctionSAMPolicyTemplatePropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnFunctionIAMPolicyDocumentPropertyFromCloudFormation, CfnFunctionSAMPolicyTemplatePropertyFromCloudFormation])), cfn_parse.FromCloudFormation.getString, CfnFunctionIAMPolicyDocumentPropertyFromCloudFormation])(properties.Policies) : undefined));
  ret.addPropertyResult("provisionedConcurrencyConfig", "ProvisionedConcurrencyConfig", (properties.ProvisionedConcurrencyConfig != null ? CfnFunctionProvisionedConcurrencyConfigPropertyFromCloudFormation(properties.ProvisionedConcurrencyConfig) : undefined));
  ret.addPropertyResult("reservedConcurrentExecutions", "ReservedConcurrentExecutions", (properties.ReservedConcurrentExecutions != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReservedConcurrentExecutions) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("runtime", "Runtime", (properties.Runtime != null ? cfn_parse.FromCloudFormation.getString(properties.Runtime) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("timeout", "Timeout", (properties.Timeout != null ? cfn_parse.FromCloudFormation.getNumber(properties.Timeout) : undefined));
  ret.addPropertyResult("tracing", "Tracing", (properties.Tracing != null ? cfn_parse.FromCloudFormation.getString(properties.Tracing) : undefined));
  ret.addPropertyResult("versionDescription", "VersionDescription", (properties.VersionDescription != null ? cfn_parse.FromCloudFormation.getString(properties.VersionDescription) : undefined));
  ret.addPropertyResult("vpcConfig", "VpcConfig", (properties.VpcConfig != null ? CfnFunctionVpcConfigPropertyFromCloudFormation(properties.VpcConfig) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapi.
 *
 * @cloudformationResource AWS::Serverless::Api
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html
 */
export class CfnApi extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::Api";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnApi from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApi {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApiPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApi(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public accessLogSetting?: CfnApi.AccessLogSettingProperty | cdk.IResolvable;

  public alwaysDeploy?: boolean | cdk.IResolvable;

  public auth?: CfnApi.AuthProperty | cdk.IResolvable;

  public binaryMediaTypes?: Array<string>;

  public cacheClusterEnabled?: boolean | cdk.IResolvable;

  public cacheClusterSize?: string;

  public canarySetting?: CfnApi.CanarySettingProperty | cdk.IResolvable;

  public cors?: CfnApi.CorsConfigurationProperty | cdk.IResolvable | string;

  public definitionBody?: any | cdk.IResolvable;

  public definitionUri?: cdk.IResolvable | CfnApi.S3LocationProperty | string;

  public description?: string;

  public disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  public domain?: CfnApi.DomainConfigurationProperty | cdk.IResolvable;

  public endpointConfiguration?: CfnApi.EndpointConfigurationProperty | cdk.IResolvable | string;

  public gatewayResponses?: any | cdk.IResolvable;

  public methodSettings?: Array<any | cdk.IResolvable> | cdk.IResolvable;

  public minimumCompressionSize?: number;

  public models?: any | cdk.IResolvable;

  public name?: string;

  public openApiVersion?: string;

  public stageName: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Record<string, string>;

  public tracingEnabled?: boolean | cdk.IResolvable;

  public variables?: cdk.IResolvable | Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApiProps) {
    super(scope, id, {
      "type": CfnApi.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "stageName", this);

    // Automatically add the required transform
    this.stack.addTransform(CfnApi.REQUIRED_TRANSFORM);

    this.accessLogSetting = props.accessLogSetting;
    this.alwaysDeploy = props.alwaysDeploy;
    this.auth = props.auth;
    this.binaryMediaTypes = props.binaryMediaTypes;
    this.cacheClusterEnabled = props.cacheClusterEnabled;
    this.cacheClusterSize = props.cacheClusterSize;
    this.canarySetting = props.canarySetting;
    this.cors = props.cors;
    this.definitionBody = props.definitionBody;
    this.definitionUri = props.definitionUri;
    this.description = props.description;
    this.disableExecuteApiEndpoint = props.disableExecuteApiEndpoint;
    this.domain = props.domain;
    this.endpointConfiguration = props.endpointConfiguration;
    this.gatewayResponses = props.gatewayResponses;
    this.methodSettings = props.methodSettings;
    this.minimumCompressionSize = props.minimumCompressionSize;
    this.models = props.models;
    this.name = props.name;
    this.openApiVersion = props.openApiVersion;
    this.stageName = props.stageName;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::Api", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tracingEnabled = props.tracingEnabled;
    this.variables = props.variables;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessLogSetting": this.accessLogSetting,
      "alwaysDeploy": this.alwaysDeploy,
      "auth": this.auth,
      "binaryMediaTypes": this.binaryMediaTypes,
      "cacheClusterEnabled": this.cacheClusterEnabled,
      "cacheClusterSize": this.cacheClusterSize,
      "canarySetting": this.canarySetting,
      "cors": this.cors,
      "definitionBody": this.definitionBody,
      "definitionUri": this.definitionUri,
      "description": this.description,
      "disableExecuteApiEndpoint": this.disableExecuteApiEndpoint,
      "domain": this.domain,
      "endpointConfiguration": this.endpointConfiguration,
      "gatewayResponses": this.gatewayResponses,
      "methodSettings": this.methodSettings,
      "minimumCompressionSize": this.minimumCompressionSize,
      "models": this.models,
      "name": this.name,
      "openApiVersion": this.openApiVersion,
      "stageName": this.stageName,
      "tags": this.tags.renderTags(),
      "tracingEnabled": this.tracingEnabled,
      "variables": this.variables
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApi.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApiPropsToCloudFormation(props);
  }
}

export namespace CfnApi {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-s3location.html#cfn-serverless-api-s3location-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-s3location.html#cfn-serverless-api-s3location-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-s3location.html#cfn-serverless-api-s3location-version
     */
    readonly version: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-endpointconfiguration.html
   */
  export interface EndpointConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-endpointconfiguration.html#cfn-serverless-api-endpointconfiguration-type
     */
    readonly type?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-endpointconfiguration.html#cfn-serverless-api-endpointconfiguration-vpcendpointids
     */
    readonly vpcEndpointIds?: Array<string>;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-corsconfiguration.html
   */
  export interface CorsConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-corsconfiguration.html#cfn-serverless-api-corsconfiguration-allowcredentials
     */
    readonly allowCredentials?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-corsconfiguration.html#cfn-serverless-api-corsconfiguration-allowheaders
     */
    readonly allowHeaders?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-corsconfiguration.html#cfn-serverless-api-corsconfiguration-allowmethods
     */
    readonly allowMethods?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-corsconfiguration.html#cfn-serverless-api-corsconfiguration-alloworigin
     */
    readonly allowOrigin: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-corsconfiguration.html#cfn-serverless-api-corsconfiguration-maxage
     */
    readonly maxAge?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-auth.html
   */
  export interface AuthProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-auth.html#cfn-serverless-api-auth-adddefaultauthorizertocorspreflight
     */
    readonly addDefaultAuthorizerToCorsPreflight?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-auth.html#cfn-serverless-api-auth-authorizers
     */
    readonly authorizers?: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-auth.html#cfn-serverless-api-auth-defaultauthorizer
     */
    readonly defaultAuthorizer?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-accesslogsetting.html
   */
  export interface AccessLogSettingProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-accesslogsetting.html#cfn-serverless-api-accesslogsetting-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-accesslogsetting.html#cfn-serverless-api-accesslogsetting-format
     */
    readonly format?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-canarysetting.html
   */
  export interface CanarySettingProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-canarysetting.html#cfn-serverless-api-canarysetting-deploymentid
     */
    readonly deploymentId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-canarysetting.html#cfn-serverless-api-canarysetting-percenttraffic
     */
    readonly percentTraffic?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-canarysetting.html#cfn-serverless-api-canarysetting-stagevariableoverrides
     */
    readonly stageVariableOverrides?: cdk.IResolvable | Record<string, string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-canarysetting.html#cfn-serverless-api-canarysetting-usestagecache
     */
    readonly useStageCache?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html
   */
  export interface DomainConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-basepath
     */
    readonly basePath?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-certificatearn
     */
    readonly certificateArn: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-domainname
     */
    readonly domainName: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-endpointconfiguration
     */
    readonly endpointConfiguration?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-mutualtlsauthentication
     */
    readonly mutualTlsAuthentication?: cdk.IResolvable | CfnApi.MutualTlsAuthenticationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-ownershipverificationcertificatearn
     */
    readonly ownershipVerificationCertificateArn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-route53
     */
    readonly route53?: cdk.IResolvable | CfnApi.Route53ConfigurationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-domainconfiguration.html#cfn-serverless-api-domainconfiguration-securitypolicy
     */
    readonly securityPolicy?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-mutualtlsauthentication.html
   */
  export interface MutualTlsAuthenticationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-mutualtlsauthentication.html#cfn-serverless-api-mutualtlsauthentication-truststoreuri
     */
    readonly truststoreUri?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-mutualtlsauthentication.html#cfn-serverless-api-mutualtlsauthentication-truststoreversion
     */
    readonly truststoreVersion?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-route53configuration.html
   */
  export interface Route53ConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-route53configuration.html#cfn-serverless-api-route53configuration-distributeddomainname
     */
    readonly distributedDomainName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-route53configuration.html#cfn-serverless-api-route53configuration-evaluatetargethealth
     */
    readonly evaluateTargetHealth?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-route53configuration.html#cfn-serverless-api-route53configuration-hostedzoneid
     */
    readonly hostedZoneId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-route53configuration.html#cfn-serverless-api-route53configuration-hostedzonename
     */
    readonly hostedZoneName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-api-route53configuration.html#cfn-serverless-api-route53configuration-ipv6
     */
    readonly ipV6?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnApi`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html
 */
export interface CfnApiProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-accesslogsetting
   */
  readonly accessLogSetting?: CfnApi.AccessLogSettingProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-alwaysdeploy
   */
  readonly alwaysDeploy?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-auth
   */
  readonly auth?: CfnApi.AuthProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-binarymediatypes
   */
  readonly binaryMediaTypes?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-cacheclusterenabled
   */
  readonly cacheClusterEnabled?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-cacheclustersize
   */
  readonly cacheClusterSize?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-canarysetting
   */
  readonly canarySetting?: CfnApi.CanarySettingProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-cors
   */
  readonly cors?: CfnApi.CorsConfigurationProperty | cdk.IResolvable | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-definitionbody
   */
  readonly definitionBody?: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-definitionuri
   */
  readonly definitionUri?: cdk.IResolvable | CfnApi.S3LocationProperty | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-description
   */
  readonly description?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-disableexecuteapiendpoint
   */
  readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-domain
   */
  readonly domain?: CfnApi.DomainConfigurationProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-endpointconfiguration
   */
  readonly endpointConfiguration?: CfnApi.EndpointConfigurationProperty | cdk.IResolvable | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-gatewayresponses
   */
  readonly gatewayResponses?: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-methodsettings
   */
  readonly methodSettings?: Array<any | cdk.IResolvable> | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-minimumcompressionsize
   */
  readonly minimumCompressionSize?: number;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-models
   */
  readonly models?: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-name
   */
  readonly name?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-openapiversion
   */
  readonly openApiVersion?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-stagename
   */
  readonly stageName: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-tracingenabled
   */
  readonly tracingEnabled?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-api.html#cfn-serverless-api-variables
   */
  readonly variables?: cdk.IResolvable | Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnApiS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApi.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EndpointConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `EndpointConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiEndpointConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("vpcEndpointIds", cdk.listValidator(cdk.validateString))(properties.vpcEndpointIds));
  return errors.wrap("supplied properties not correct for \"EndpointConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiEndpointConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiEndpointConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Type": cdk.stringToCloudFormation(properties.type),
    "VpcEndpointIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.vpcEndpointIds)
  };
}

// @ts-ignore TS6133
function CfnApiEndpointConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.EndpointConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.EndpointConfigurationProperty>();
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("vpcEndpointIds", "VpcEndpointIds", (properties.VpcEndpointIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.VpcEndpointIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiCorsConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCredentials", cdk.validateBoolean)(properties.allowCredentials));
  errors.collect(cdk.propertyValidator("allowHeaders", cdk.validateString)(properties.allowHeaders));
  errors.collect(cdk.propertyValidator("allowMethods", cdk.validateString)(properties.allowMethods));
  errors.collect(cdk.propertyValidator("allowOrigin", cdk.requiredValidator)(properties.allowOrigin));
  errors.collect(cdk.propertyValidator("allowOrigin", cdk.validateString)(properties.allowOrigin));
  errors.collect(cdk.propertyValidator("maxAge", cdk.validateString)(properties.maxAge));
  return errors.wrap("supplied properties not correct for \"CorsConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiCorsConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiCorsConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "AllowCredentials": cdk.booleanToCloudFormation(properties.allowCredentials),
    "AllowHeaders": cdk.stringToCloudFormation(properties.allowHeaders),
    "AllowMethods": cdk.stringToCloudFormation(properties.allowMethods),
    "AllowOrigin": cdk.stringToCloudFormation(properties.allowOrigin),
    "MaxAge": cdk.stringToCloudFormation(properties.maxAge)
  };
}

// @ts-ignore TS6133
function CfnApiCorsConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.CorsConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.CorsConfigurationProperty>();
  ret.addPropertyResult("allowCredentials", "AllowCredentials", (properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined));
  ret.addPropertyResult("allowHeaders", "AllowHeaders", (properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getString(properties.AllowHeaders) : undefined));
  ret.addPropertyResult("allowMethods", "AllowMethods", (properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getString(properties.AllowMethods) : undefined));
  ret.addPropertyResult("allowOrigin", "AllowOrigin", (properties.AllowOrigin != null ? cfn_parse.FromCloudFormation.getString(properties.AllowOrigin) : undefined));
  ret.addPropertyResult("maxAge", "MaxAge", (properties.MaxAge != null ? cfn_parse.FromCloudFormation.getString(properties.MaxAge) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AuthProperty`
 *
 * @param properties - the TypeScript properties of a `AuthProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiAuthPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("addDefaultAuthorizerToCorsPreflight", cdk.validateBoolean)(properties.addDefaultAuthorizerToCorsPreflight));
  errors.collect(cdk.propertyValidator("authorizers", cdk.validateObject)(properties.authorizers));
  errors.collect(cdk.propertyValidator("defaultAuthorizer", cdk.validateString)(properties.defaultAuthorizer));
  return errors.wrap("supplied properties not correct for \"AuthProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiAuthPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiAuthPropertyValidator(properties).assertSuccess();
  return {
    "AddDefaultAuthorizerToCorsPreflight": cdk.booleanToCloudFormation(properties.addDefaultAuthorizerToCorsPreflight),
    "Authorizers": cdk.objectToCloudFormation(properties.authorizers),
    "DefaultAuthorizer": cdk.stringToCloudFormation(properties.defaultAuthorizer)
  };
}

// @ts-ignore TS6133
function CfnApiAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.AuthProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.AuthProperty>();
  ret.addPropertyResult("addDefaultAuthorizerToCorsPreflight", "AddDefaultAuthorizerToCorsPreflight", (properties.AddDefaultAuthorizerToCorsPreflight != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AddDefaultAuthorizerToCorsPreflight) : undefined));
  ret.addPropertyResult("authorizers", "Authorizers", (properties.Authorizers != null ? cfn_parse.FromCloudFormation.getAny(properties.Authorizers) : undefined));
  ret.addPropertyResult("defaultAuthorizer", "DefaultAuthorizer", (properties.DefaultAuthorizer != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthorizer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiAccessLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  return errors.wrap("supplied properties not correct for \"AccessLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiAccessLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiAccessLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Format": cdk.stringToCloudFormation(properties.format)
  };
}

// @ts-ignore TS6133
function CfnApiAccessLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.AccessLogSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.AccessLogSettingProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CanarySettingProperty`
 *
 * @param properties - the TypeScript properties of a `CanarySettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiCanarySettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("deploymentId", cdk.validateString)(properties.deploymentId));
  errors.collect(cdk.propertyValidator("percentTraffic", cdk.validateNumber)(properties.percentTraffic));
  errors.collect(cdk.propertyValidator("stageVariableOverrides", cdk.hashValidator(cdk.validateString))(properties.stageVariableOverrides));
  errors.collect(cdk.propertyValidator("useStageCache", cdk.validateBoolean)(properties.useStageCache));
  return errors.wrap("supplied properties not correct for \"CanarySettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiCanarySettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiCanarySettingPropertyValidator(properties).assertSuccess();
  return {
    "DeploymentId": cdk.stringToCloudFormation(properties.deploymentId),
    "PercentTraffic": cdk.numberToCloudFormation(properties.percentTraffic),
    "StageVariableOverrides": cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariableOverrides),
    "UseStageCache": cdk.booleanToCloudFormation(properties.useStageCache)
  };
}

// @ts-ignore TS6133
function CfnApiCanarySettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.CanarySettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.CanarySettingProperty>();
  ret.addPropertyResult("deploymentId", "DeploymentId", (properties.DeploymentId != null ? cfn_parse.FromCloudFormation.getString(properties.DeploymentId) : undefined));
  ret.addPropertyResult("percentTraffic", "PercentTraffic", (properties.PercentTraffic != null ? cfn_parse.FromCloudFormation.getNumber(properties.PercentTraffic) : undefined));
  ret.addPropertyResult("stageVariableOverrides", "StageVariableOverrides", (properties.StageVariableOverrides != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariableOverrides) : undefined));
  ret.addPropertyResult("useStageCache", "UseStageCache", (properties.UseStageCache != null ? cfn_parse.FromCloudFormation.getBoolean(properties.UseStageCache) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MutualTlsAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiMutualTlsAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("truststoreUri", cdk.validateString)(properties.truststoreUri));
  errors.collect(cdk.propertyValidator("truststoreVersion", cdk.validateString)(properties.truststoreVersion));
  return errors.wrap("supplied properties not correct for \"MutualTlsAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiMutualTlsAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiMutualTlsAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "TruststoreUri": cdk.stringToCloudFormation(properties.truststoreUri),
    "TruststoreVersion": cdk.stringToCloudFormation(properties.truststoreVersion)
  };
}

// @ts-ignore TS6133
function CfnApiMutualTlsAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApi.MutualTlsAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.MutualTlsAuthenticationProperty>();
  ret.addPropertyResult("truststoreUri", "TruststoreUri", (properties.TruststoreUri != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreUri) : undefined));
  ret.addPropertyResult("truststoreVersion", "TruststoreVersion", (properties.TruststoreVersion != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `Route53ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `Route53ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiRoute53ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("distributedDomainName", cdk.validateString)(properties.distributedDomainName));
  errors.collect(cdk.propertyValidator("evaluateTargetHealth", cdk.validateBoolean)(properties.evaluateTargetHealth));
  errors.collect(cdk.propertyValidator("hostedZoneId", cdk.validateString)(properties.hostedZoneId));
  errors.collect(cdk.propertyValidator("hostedZoneName", cdk.validateString)(properties.hostedZoneName));
  errors.collect(cdk.propertyValidator("ipV6", cdk.validateBoolean)(properties.ipV6));
  return errors.wrap("supplied properties not correct for \"Route53ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiRoute53ConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiRoute53ConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DistributedDomainName": cdk.stringToCloudFormation(properties.distributedDomainName),
    "EvaluateTargetHealth": cdk.booleanToCloudFormation(properties.evaluateTargetHealth),
    "HostedZoneId": cdk.stringToCloudFormation(properties.hostedZoneId),
    "HostedZoneName": cdk.stringToCloudFormation(properties.hostedZoneName),
    "IpV6": cdk.booleanToCloudFormation(properties.ipV6)
  };
}

// @ts-ignore TS6133
function CfnApiRoute53ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApi.Route53ConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.Route53ConfigurationProperty>();
  ret.addPropertyResult("distributedDomainName", "DistributedDomainName", (properties.DistributedDomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DistributedDomainName) : undefined));
  ret.addPropertyResult("evaluateTargetHealth", "EvaluateTargetHealth", (properties.EvaluateTargetHealth != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EvaluateTargetHealth) : undefined));
  ret.addPropertyResult("hostedZoneId", "HostedZoneId", (properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined));
  ret.addPropertyResult("hostedZoneName", "HostedZoneName", (properties.HostedZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneName) : undefined));
  ret.addPropertyResult("ipV6", "IpV6", (properties.IpV6 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IpV6) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `DomainConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `DomainConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiDomainConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basePath", cdk.listValidator(cdk.validateString))(properties.basePath));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("endpointConfiguration", cdk.validateString)(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("mutualTlsAuthentication", CfnApiMutualTlsAuthenticationPropertyValidator)(properties.mutualTlsAuthentication));
  errors.collect(cdk.propertyValidator("ownershipVerificationCertificateArn", cdk.validateString)(properties.ownershipVerificationCertificateArn));
  errors.collect(cdk.propertyValidator("route53", CfnApiRoute53ConfigurationPropertyValidator)(properties.route53));
  errors.collect(cdk.propertyValidator("securityPolicy", cdk.validateString)(properties.securityPolicy));
  return errors.wrap("supplied properties not correct for \"DomainConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApiDomainConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiDomainConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BasePath": cdk.listMapper(cdk.stringToCloudFormation)(properties.basePath),
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EndpointConfiguration": cdk.stringToCloudFormation(properties.endpointConfiguration),
    "MutualTlsAuthentication": convertCfnApiMutualTlsAuthenticationPropertyToCloudFormation(properties.mutualTlsAuthentication),
    "OwnershipVerificationCertificateArn": cdk.stringToCloudFormation(properties.ownershipVerificationCertificateArn),
    "Route53": convertCfnApiRoute53ConfigurationPropertyToCloudFormation(properties.route53),
    "SecurityPolicy": cdk.stringToCloudFormation(properties.securityPolicy)
  };
}

// @ts-ignore TS6133
function CfnApiDomainConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApi.DomainConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApi.DomainConfigurationProperty>();
  ret.addPropertyResult("basePath", "BasePath", (properties.BasePath != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BasePath) : undefined));
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("endpointConfiguration", "EndpointConfiguration", (properties.EndpointConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointConfiguration) : undefined));
  ret.addPropertyResult("mutualTlsAuthentication", "MutualTlsAuthentication", (properties.MutualTlsAuthentication != null ? CfnApiMutualTlsAuthenticationPropertyFromCloudFormation(properties.MutualTlsAuthentication) : undefined));
  ret.addPropertyResult("ownershipVerificationCertificateArn", "OwnershipVerificationCertificateArn", (properties.OwnershipVerificationCertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.OwnershipVerificationCertificateArn) : undefined));
  ret.addPropertyResult("route53", "Route53", (properties.Route53 != null ? CfnApiRoute53ConfigurationPropertyFromCloudFormation(properties.Route53) : undefined));
  ret.addPropertyResult("securityPolicy", "SecurityPolicy", (properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnApiProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApiPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLogSetting", CfnApiAccessLogSettingPropertyValidator)(properties.accessLogSetting));
  errors.collect(cdk.propertyValidator("alwaysDeploy", cdk.validateBoolean)(properties.alwaysDeploy));
  errors.collect(cdk.propertyValidator("auth", CfnApiAuthPropertyValidator)(properties.auth));
  errors.collect(cdk.propertyValidator("binaryMediaTypes", cdk.listValidator(cdk.validateString))(properties.binaryMediaTypes));
  errors.collect(cdk.propertyValidator("cacheClusterEnabled", cdk.validateBoolean)(properties.cacheClusterEnabled));
  errors.collect(cdk.propertyValidator("cacheClusterSize", cdk.validateString)(properties.cacheClusterSize));
  errors.collect(cdk.propertyValidator("canarySetting", CfnApiCanarySettingPropertyValidator)(properties.canarySetting));
  errors.collect(cdk.propertyValidator("cors", cdk.unionValidator(cdk.validateString, CfnApiCorsConfigurationPropertyValidator))(properties.cors));
  errors.collect(cdk.propertyValidator("definitionBody", cdk.validateObject)(properties.definitionBody));
  errors.collect(cdk.propertyValidator("definitionUri", cdk.unionValidator(cdk.validateString, CfnApiS3LocationPropertyValidator))(properties.definitionUri));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disableExecuteApiEndpoint", cdk.validateBoolean)(properties.disableExecuteApiEndpoint));
  errors.collect(cdk.propertyValidator("domain", CfnApiDomainConfigurationPropertyValidator)(properties.domain));
  errors.collect(cdk.propertyValidator("endpointConfiguration", cdk.unionValidator(cdk.validateString, CfnApiEndpointConfigurationPropertyValidator))(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("gatewayResponses", cdk.validateObject)(properties.gatewayResponses));
  errors.collect(cdk.propertyValidator("methodSettings", cdk.listValidator(cdk.validateObject))(properties.methodSettings));
  errors.collect(cdk.propertyValidator("minimumCompressionSize", cdk.validateNumber)(properties.minimumCompressionSize));
  errors.collect(cdk.propertyValidator("models", cdk.validateObject)(properties.models));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("openApiVersion", cdk.validateString)(properties.openApiVersion));
  errors.collect(cdk.propertyValidator("stageName", cdk.requiredValidator)(properties.stageName));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("tracingEnabled", cdk.validateBoolean)(properties.tracingEnabled));
  errors.collect(cdk.propertyValidator("variables", cdk.hashValidator(cdk.validateString))(properties.variables));
  return errors.wrap("supplied properties not correct for \"CfnApiProps\"");
}

// @ts-ignore TS6133
function convertCfnApiPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApiPropsValidator(properties).assertSuccess();
  return {
    "AccessLogSetting": convertCfnApiAccessLogSettingPropertyToCloudFormation(properties.accessLogSetting),
    "AlwaysDeploy": cdk.booleanToCloudFormation(properties.alwaysDeploy),
    "Auth": convertCfnApiAuthPropertyToCloudFormation(properties.auth),
    "BinaryMediaTypes": cdk.listMapper(cdk.stringToCloudFormation)(properties.binaryMediaTypes),
    "CacheClusterEnabled": cdk.booleanToCloudFormation(properties.cacheClusterEnabled),
    "CacheClusterSize": cdk.stringToCloudFormation(properties.cacheClusterSize),
    "CanarySetting": convertCfnApiCanarySettingPropertyToCloudFormation(properties.canarySetting),
    "Cors": cdk.unionMapper([cdk.validateString, CfnApiCorsConfigurationPropertyValidator], [cdk.stringToCloudFormation, convertCfnApiCorsConfigurationPropertyToCloudFormation])(properties.cors),
    "DefinitionBody": cdk.objectToCloudFormation(properties.definitionBody),
    "DefinitionUri": cdk.unionMapper([cdk.validateString, CfnApiS3LocationPropertyValidator], [cdk.stringToCloudFormation, convertCfnApiS3LocationPropertyToCloudFormation])(properties.definitionUri),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisableExecuteApiEndpoint": cdk.booleanToCloudFormation(properties.disableExecuteApiEndpoint),
    "Domain": convertCfnApiDomainConfigurationPropertyToCloudFormation(properties.domain),
    "EndpointConfiguration": cdk.unionMapper([cdk.validateString, CfnApiEndpointConfigurationPropertyValidator], [cdk.stringToCloudFormation, convertCfnApiEndpointConfigurationPropertyToCloudFormation])(properties.endpointConfiguration),
    "GatewayResponses": cdk.objectToCloudFormation(properties.gatewayResponses),
    "MethodSettings": cdk.listMapper(cdk.objectToCloudFormation)(properties.methodSettings),
    "MinimumCompressionSize": cdk.numberToCloudFormation(properties.minimumCompressionSize),
    "Models": cdk.objectToCloudFormation(properties.models),
    "Name": cdk.stringToCloudFormation(properties.name),
    "OpenApiVersion": cdk.stringToCloudFormation(properties.openApiVersion),
    "StageName": cdk.stringToCloudFormation(properties.stageName),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TracingEnabled": cdk.booleanToCloudFormation(properties.tracingEnabled),
    "Variables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.variables)
  };
}

// @ts-ignore TS6133
function CfnApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApiProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApiProps>();
  ret.addPropertyResult("accessLogSetting", "AccessLogSetting", (properties.AccessLogSetting != null ? CfnApiAccessLogSettingPropertyFromCloudFormation(properties.AccessLogSetting) : undefined));
  ret.addPropertyResult("alwaysDeploy", "AlwaysDeploy", (properties.AlwaysDeploy != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AlwaysDeploy) : undefined));
  ret.addPropertyResult("auth", "Auth", (properties.Auth != null ? CfnApiAuthPropertyFromCloudFormation(properties.Auth) : undefined));
  ret.addPropertyResult("binaryMediaTypes", "BinaryMediaTypes", (properties.BinaryMediaTypes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.BinaryMediaTypes) : undefined));
  ret.addPropertyResult("cacheClusterEnabled", "CacheClusterEnabled", (properties.CacheClusterEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.CacheClusterEnabled) : undefined));
  ret.addPropertyResult("cacheClusterSize", "CacheClusterSize", (properties.CacheClusterSize != null ? cfn_parse.FromCloudFormation.getString(properties.CacheClusterSize) : undefined));
  ret.addPropertyResult("canarySetting", "CanarySetting", (properties.CanarySetting != null ? CfnApiCanarySettingPropertyFromCloudFormation(properties.CanarySetting) : undefined));
  ret.addPropertyResult("cors", "Cors", (properties.Cors != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnApiCorsConfigurationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnApiCorsConfigurationPropertyFromCloudFormation])(properties.Cors) : undefined));
  ret.addPropertyResult("definitionBody", "DefinitionBody", (properties.DefinitionBody != null ? cfn_parse.FromCloudFormation.getAny(properties.DefinitionBody) : undefined));
  ret.addPropertyResult("definitionUri", "DefinitionUri", (properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnApiS3LocationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnApiS3LocationPropertyFromCloudFormation])(properties.DefinitionUri) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disableExecuteApiEndpoint", "DisableExecuteApiEndpoint", (properties.DisableExecuteApiEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableExecuteApiEndpoint) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? CfnApiDomainConfigurationPropertyFromCloudFormation(properties.Domain) : undefined));
  ret.addPropertyResult("endpointConfiguration", "EndpointConfiguration", (properties.EndpointConfiguration != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnApiEndpointConfigurationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnApiEndpointConfigurationPropertyFromCloudFormation])(properties.EndpointConfiguration) : undefined));
  ret.addPropertyResult("gatewayResponses", "GatewayResponses", (properties.GatewayResponses != null ? cfn_parse.FromCloudFormation.getAny(properties.GatewayResponses) : undefined));
  ret.addPropertyResult("methodSettings", "MethodSettings", (properties.MethodSettings != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getAny)(properties.MethodSettings) : undefined));
  ret.addPropertyResult("minimumCompressionSize", "MinimumCompressionSize", (properties.MinimumCompressionSize != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinimumCompressionSize) : undefined));
  ret.addPropertyResult("models", "Models", (properties.Models != null ? cfn_parse.FromCloudFormation.getAny(properties.Models) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("openApiVersion", "OpenApiVersion", (properties.OpenApiVersion != null ? cfn_parse.FromCloudFormation.getString(properties.OpenApiVersion) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("tracingEnabled", "TracingEnabled", (properties.TracingEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TracingEnabled) : undefined));
  ret.addPropertyResult("variables", "Variables", (properties.Variables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Variables) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * https://github.com/aws/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesshttpapi.
 *
 * @cloudformationResource AWS::Serverless::HttpApi
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html
 */
export class CfnHttpApi extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::HttpApi";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnHttpApi from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnHttpApi {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnHttpApiPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnHttpApi(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public accessLogSetting?: CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable;

  public auth?: CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable;

  public corsConfiguration?: boolean | CfnHttpApi.CorsConfigurationObjectProperty | cdk.IResolvable;

  public defaultRouteSettings?: cdk.IResolvable | CfnHttpApi.RouteSettingsProperty;

  public definitionBody?: any | cdk.IResolvable;

  public definitionUri?: cdk.IResolvable | CfnHttpApi.S3LocationProperty | string;

  public description?: string;

  public disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  public domain?: CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable;

  public failOnWarnings?: boolean | cdk.IResolvable;

  public routeSettings?: cdk.IResolvable | CfnHttpApi.RouteSettingsProperty;

  public stageName?: string;

  public stageVariables?: cdk.IResolvable | Record<string, string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnHttpApiProps = {}) {
    super(scope, id, {
      "type": CfnHttpApi.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    // Automatically add the required transform
    this.stack.addTransform(CfnHttpApi.REQUIRED_TRANSFORM);

    this.accessLogSetting = props.accessLogSetting;
    this.auth = props.auth;
    this.corsConfiguration = props.corsConfiguration;
    this.defaultRouteSettings = props.defaultRouteSettings;
    this.definitionBody = props.definitionBody;
    this.definitionUri = props.definitionUri;
    this.description = props.description;
    this.disableExecuteApiEndpoint = props.disableExecuteApiEndpoint;
    this.domain = props.domain;
    this.failOnWarnings = props.failOnWarnings;
    this.routeSettings = props.routeSettings;
    this.stageName = props.stageName;
    this.stageVariables = props.stageVariables;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::HttpApi", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "accessLogSetting": this.accessLogSetting,
      "auth": this.auth,
      "corsConfiguration": this.corsConfiguration,
      "defaultRouteSettings": this.defaultRouteSettings,
      "definitionBody": this.definitionBody,
      "definitionUri": this.definitionUri,
      "description": this.description,
      "disableExecuteApiEndpoint": this.disableExecuteApiEndpoint,
      "domain": this.domain,
      "failOnWarnings": this.failOnWarnings,
      "routeSettings": this.routeSettings,
      "stageName": this.stageName,
      "stageVariables": this.stageVariables,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnHttpApi.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnHttpApiPropsToCloudFormation(props);
  }
}

export namespace CfnHttpApi {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-s3location.html#cfn-serverless-httpapi-s3location-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-s3location.html#cfn-serverless-httpapi-s3location-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-s3location.html#cfn-serverless-httpapi-s3location-version
     */
    readonly version: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapiauth.html
   */
  export interface HttpApiAuthProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapiauth.html#cfn-serverless-httpapi-httpapiauth-authorizers
     */
    readonly authorizers?: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapiauth.html#cfn-serverless-httpapi-httpapiauth-defaultauthorizer
     */
    readonly defaultAuthorizer?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-accesslogsetting.html
   */
  export interface AccessLogSettingProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-accesslogsetting.html#cfn-serverless-httpapi-accesslogsetting-destinationarn
     */
    readonly destinationArn?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-accesslogsetting.html#cfn-serverless-httpapi-accesslogsetting-format
     */
    readonly format?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html
   */
  export interface CorsConfigurationObjectProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html#cfn-serverless-httpapi-corsconfigurationobject-allowcredentials
     */
    readonly allowCredentials?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html#cfn-serverless-httpapi-corsconfigurationobject-allowheaders
     */
    readonly allowHeaders?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html#cfn-serverless-httpapi-corsconfigurationobject-allowmethods
     */
    readonly allowMethods?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html#cfn-serverless-httpapi-corsconfigurationobject-alloworigins
     */
    readonly allowOrigins?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html#cfn-serverless-httpapi-corsconfigurationobject-exposeheaders
     */
    readonly exposeHeaders?: Array<string>;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-corsconfigurationobject.html#cfn-serverless-httpapi-corsconfigurationobject-maxage
     */
    readonly maxAge?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-routesettings.html
   */
  export interface RouteSettingsProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-routesettings.html#cfn-serverless-httpapi-routesettings-datatraceenabled
     */
    readonly dataTraceEnabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-routesettings.html#cfn-serverless-httpapi-routesettings-detailedmetricsenabled
     */
    readonly detailedMetricsEnabled?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-routesettings.html#cfn-serverless-httpapi-routesettings-logginglevel
     */
    readonly loggingLevel?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-routesettings.html#cfn-serverless-httpapi-routesettings-throttlingburstlimit
     */
    readonly throttlingBurstLimit?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-routesettings.html#cfn-serverless-httpapi-routesettings-throttlingratelimit
     */
    readonly throttlingRateLimit?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html
   */
  export interface HttpApiDomainConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-basepath
     */
    readonly basePath?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-certificatearn
     */
    readonly certificateArn: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-domainname
     */
    readonly domainName: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-endpointconfiguration
     */
    readonly endpointConfiguration?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-mutualtlsauthentication
     */
    readonly mutualTlsAuthentication?: cdk.IResolvable | CfnHttpApi.MutualTlsAuthenticationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-route53
     */
    readonly route53?: cdk.IResolvable | CfnHttpApi.Route53ConfigurationProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-httpapidomainconfiguration.html#cfn-serverless-httpapi-httpapidomainconfiguration-securitypolicy
     */
    readonly securityPolicy?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-route53configuration.html
   */
  export interface Route53ConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-route53configuration.html#cfn-serverless-httpapi-route53configuration-distributeddomainname
     */
    readonly distributedDomainName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-route53configuration.html#cfn-serverless-httpapi-route53configuration-evaluatetargethealth
     */
    readonly evaluateTargetHealth?: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-route53configuration.html#cfn-serverless-httpapi-route53configuration-hostedzoneid
     */
    readonly hostedZoneId?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-route53configuration.html#cfn-serverless-httpapi-route53configuration-hostedzonename
     */
    readonly hostedZoneName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-route53configuration.html#cfn-serverless-httpapi-route53configuration-ipv6
     */
    readonly ipV6?: boolean | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-mutualtlsauthentication.html
   */
  export interface MutualTlsAuthenticationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-mutualtlsauthentication.html#cfn-serverless-httpapi-mutualtlsauthentication-truststoreuri
     */
    readonly truststoreUri?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-httpapi-mutualtlsauthentication.html#cfn-serverless-httpapi-mutualtlsauthentication-truststoreversion
     */
    readonly truststoreVersion?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnHttpApi`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html
 */
export interface CfnHttpApiProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-accesslogsetting
   */
  readonly accessLogSetting?: CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-auth
   */
  readonly auth?: CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-corsconfiguration
   */
  readonly corsConfiguration?: boolean | CfnHttpApi.CorsConfigurationObjectProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-defaultroutesettings
   */
  readonly defaultRouteSettings?: cdk.IResolvable | CfnHttpApi.RouteSettingsProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-definitionbody
   */
  readonly definitionBody?: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-definitionuri
   */
  readonly definitionUri?: cdk.IResolvable | CfnHttpApi.S3LocationProperty | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-description
   */
  readonly description?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-disableexecuteapiendpoint
   */
  readonly disableExecuteApiEndpoint?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-domain
   */
  readonly domain?: CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-failonwarnings
   */
  readonly failOnWarnings?: boolean | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-routesettings
   */
  readonly routeSettings?: cdk.IResolvable | CfnHttpApi.RouteSettingsProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-stagename
   */
  readonly stageName?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-stagevariables
   */
  readonly stageVariables?: cdk.IResolvable | Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-httpapi.html#cfn-serverless-httpapi-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnHttpApiS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnHttpApi.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpApiAuthProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiAuthProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiHttpApiAuthPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("authorizers", cdk.validateObject)(properties.authorizers));
  errors.collect(cdk.propertyValidator("defaultAuthorizer", cdk.validateString)(properties.defaultAuthorizer));
  return errors.wrap("supplied properties not correct for \"HttpApiAuthProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiHttpApiAuthPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiHttpApiAuthPropertyValidator(properties).assertSuccess();
  return {
    "Authorizers": cdk.objectToCloudFormation(properties.authorizers),
    "DefaultAuthorizer": cdk.stringToCloudFormation(properties.defaultAuthorizer)
  };
}

// @ts-ignore TS6133
function CfnHttpApiHttpApiAuthPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.HttpApiAuthProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.HttpApiAuthProperty>();
  ret.addPropertyResult("authorizers", "Authorizers", (properties.Authorizers != null ? cfn_parse.FromCloudFormation.getAny(properties.Authorizers) : undefined));
  ret.addPropertyResult("defaultAuthorizer", "DefaultAuthorizer", (properties.DefaultAuthorizer != null ? cfn_parse.FromCloudFormation.getString(properties.DefaultAuthorizer) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AccessLogSettingProperty`
 *
 * @param properties - the TypeScript properties of a `AccessLogSettingProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiAccessLogSettingPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinationArn", cdk.validateString)(properties.destinationArn));
  errors.collect(cdk.propertyValidator("format", cdk.validateString)(properties.format));
  return errors.wrap("supplied properties not correct for \"AccessLogSettingProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiAccessLogSettingPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiAccessLogSettingPropertyValidator(properties).assertSuccess();
  return {
    "DestinationArn": cdk.stringToCloudFormation(properties.destinationArn),
    "Format": cdk.stringToCloudFormation(properties.format)
  };
}

// @ts-ignore TS6133
function CfnHttpApiAccessLogSettingPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.AccessLogSettingProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.AccessLogSettingProperty>();
  ret.addPropertyResult("destinationArn", "DestinationArn", (properties.DestinationArn != null ? cfn_parse.FromCloudFormation.getString(properties.DestinationArn) : undefined));
  ret.addPropertyResult("format", "Format", (properties.Format != null ? cfn_parse.FromCloudFormation.getString(properties.Format) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CorsConfigurationObjectProperty`
 *
 * @param properties - the TypeScript properties of a `CorsConfigurationObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiCorsConfigurationObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("allowCredentials", cdk.validateBoolean)(properties.allowCredentials));
  errors.collect(cdk.propertyValidator("allowHeaders", cdk.listValidator(cdk.validateString))(properties.allowHeaders));
  errors.collect(cdk.propertyValidator("allowMethods", cdk.listValidator(cdk.validateString))(properties.allowMethods));
  errors.collect(cdk.propertyValidator("allowOrigins", cdk.listValidator(cdk.validateString))(properties.allowOrigins));
  errors.collect(cdk.propertyValidator("exposeHeaders", cdk.listValidator(cdk.validateString))(properties.exposeHeaders));
  errors.collect(cdk.propertyValidator("maxAge", cdk.validateNumber)(properties.maxAge));
  return errors.wrap("supplied properties not correct for \"CorsConfigurationObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiCorsConfigurationObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiCorsConfigurationObjectPropertyValidator(properties).assertSuccess();
  return {
    "AllowCredentials": cdk.booleanToCloudFormation(properties.allowCredentials),
    "AllowHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowHeaders),
    "AllowMethods": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowMethods),
    "AllowOrigins": cdk.listMapper(cdk.stringToCloudFormation)(properties.allowOrigins),
    "ExposeHeaders": cdk.listMapper(cdk.stringToCloudFormation)(properties.exposeHeaders),
    "MaxAge": cdk.numberToCloudFormation(properties.maxAge)
  };
}

// @ts-ignore TS6133
function CfnHttpApiCorsConfigurationObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.CorsConfigurationObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.CorsConfigurationObjectProperty>();
  ret.addPropertyResult("allowCredentials", "AllowCredentials", (properties.AllowCredentials != null ? cfn_parse.FromCloudFormation.getBoolean(properties.AllowCredentials) : undefined));
  ret.addPropertyResult("allowHeaders", "AllowHeaders", (properties.AllowHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowHeaders) : undefined));
  ret.addPropertyResult("allowMethods", "AllowMethods", (properties.AllowMethods != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowMethods) : undefined));
  ret.addPropertyResult("allowOrigins", "AllowOrigins", (properties.AllowOrigins != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.AllowOrigins) : undefined));
  ret.addPropertyResult("exposeHeaders", "ExposeHeaders", (properties.ExposeHeaders != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.ExposeHeaders) : undefined));
  ret.addPropertyResult("maxAge", "MaxAge", (properties.MaxAge != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxAge) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `RouteSettingsProperty`
 *
 * @param properties - the TypeScript properties of a `RouteSettingsProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiRouteSettingsPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dataTraceEnabled", cdk.validateBoolean)(properties.dataTraceEnabled));
  errors.collect(cdk.propertyValidator("detailedMetricsEnabled", cdk.validateBoolean)(properties.detailedMetricsEnabled));
  errors.collect(cdk.propertyValidator("loggingLevel", cdk.validateString)(properties.loggingLevel));
  errors.collect(cdk.propertyValidator("throttlingBurstLimit", cdk.validateNumber)(properties.throttlingBurstLimit));
  errors.collect(cdk.propertyValidator("throttlingRateLimit", cdk.validateNumber)(properties.throttlingRateLimit));
  return errors.wrap("supplied properties not correct for \"RouteSettingsProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiRouteSettingsPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiRouteSettingsPropertyValidator(properties).assertSuccess();
  return {
    "DataTraceEnabled": cdk.booleanToCloudFormation(properties.dataTraceEnabled),
    "DetailedMetricsEnabled": cdk.booleanToCloudFormation(properties.detailedMetricsEnabled),
    "LoggingLevel": cdk.stringToCloudFormation(properties.loggingLevel),
    "ThrottlingBurstLimit": cdk.numberToCloudFormation(properties.throttlingBurstLimit),
    "ThrottlingRateLimit": cdk.numberToCloudFormation(properties.throttlingRateLimit)
  };
}

// @ts-ignore TS6133
function CfnHttpApiRouteSettingsPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnHttpApi.RouteSettingsProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.RouteSettingsProperty>();
  ret.addPropertyResult("dataTraceEnabled", "DataTraceEnabled", (properties.DataTraceEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DataTraceEnabled) : undefined));
  ret.addPropertyResult("detailedMetricsEnabled", "DetailedMetricsEnabled", (properties.DetailedMetricsEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DetailedMetricsEnabled) : undefined));
  ret.addPropertyResult("loggingLevel", "LoggingLevel", (properties.LoggingLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LoggingLevel) : undefined));
  ret.addPropertyResult("throttlingBurstLimit", "ThrottlingBurstLimit", (properties.ThrottlingBurstLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingBurstLimit) : undefined));
  ret.addPropertyResult("throttlingRateLimit", "ThrottlingRateLimit", (properties.ThrottlingRateLimit != null ? cfn_parse.FromCloudFormation.getNumber(properties.ThrottlingRateLimit) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `Route53ConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `Route53ConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiRoute53ConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("distributedDomainName", cdk.validateString)(properties.distributedDomainName));
  errors.collect(cdk.propertyValidator("evaluateTargetHealth", cdk.validateBoolean)(properties.evaluateTargetHealth));
  errors.collect(cdk.propertyValidator("hostedZoneId", cdk.validateString)(properties.hostedZoneId));
  errors.collect(cdk.propertyValidator("hostedZoneName", cdk.validateString)(properties.hostedZoneName));
  errors.collect(cdk.propertyValidator("ipV6", cdk.validateBoolean)(properties.ipV6));
  return errors.wrap("supplied properties not correct for \"Route53ConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiRoute53ConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiRoute53ConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DistributedDomainName": cdk.stringToCloudFormation(properties.distributedDomainName),
    "EvaluateTargetHealth": cdk.booleanToCloudFormation(properties.evaluateTargetHealth),
    "HostedZoneId": cdk.stringToCloudFormation(properties.hostedZoneId),
    "HostedZoneName": cdk.stringToCloudFormation(properties.hostedZoneName),
    "IpV6": cdk.booleanToCloudFormation(properties.ipV6)
  };
}

// @ts-ignore TS6133
function CfnHttpApiRoute53ConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnHttpApi.Route53ConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.Route53ConfigurationProperty>();
  ret.addPropertyResult("distributedDomainName", "DistributedDomainName", (properties.DistributedDomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DistributedDomainName) : undefined));
  ret.addPropertyResult("evaluateTargetHealth", "EvaluateTargetHealth", (properties.EvaluateTargetHealth != null ? cfn_parse.FromCloudFormation.getBoolean(properties.EvaluateTargetHealth) : undefined));
  ret.addPropertyResult("hostedZoneId", "HostedZoneId", (properties.HostedZoneId != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneId) : undefined));
  ret.addPropertyResult("hostedZoneName", "HostedZoneName", (properties.HostedZoneName != null ? cfn_parse.FromCloudFormation.getString(properties.HostedZoneName) : undefined));
  ret.addPropertyResult("ipV6", "IpV6", (properties.IpV6 != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IpV6) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MutualTlsAuthenticationProperty`
 *
 * @param properties - the TypeScript properties of a `MutualTlsAuthenticationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiMutualTlsAuthenticationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("truststoreUri", cdk.validateString)(properties.truststoreUri));
  errors.collect(cdk.propertyValidator("truststoreVersion", cdk.validateBoolean)(properties.truststoreVersion));
  return errors.wrap("supplied properties not correct for \"MutualTlsAuthenticationProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiMutualTlsAuthenticationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiMutualTlsAuthenticationPropertyValidator(properties).assertSuccess();
  return {
    "TruststoreUri": cdk.stringToCloudFormation(properties.truststoreUri),
    "TruststoreVersion": cdk.booleanToCloudFormation(properties.truststoreVersion)
  };
}

// @ts-ignore TS6133
function CfnHttpApiMutualTlsAuthenticationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnHttpApi.MutualTlsAuthenticationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.MutualTlsAuthenticationProperty>();
  ret.addPropertyResult("truststoreUri", "TruststoreUri", (properties.TruststoreUri != null ? cfn_parse.FromCloudFormation.getString(properties.TruststoreUri) : undefined));
  ret.addPropertyResult("truststoreVersion", "TruststoreVersion", (properties.TruststoreVersion != null ? cfn_parse.FromCloudFormation.getBoolean(properties.TruststoreVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `HttpApiDomainConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `HttpApiDomainConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiHttpApiDomainConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("basePath", cdk.validateString)(properties.basePath));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.requiredValidator)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("certificateArn", cdk.validateString)(properties.certificateArn));
  errors.collect(cdk.propertyValidator("domainName", cdk.requiredValidator)(properties.domainName));
  errors.collect(cdk.propertyValidator("domainName", cdk.validateString)(properties.domainName));
  errors.collect(cdk.propertyValidator("endpointConfiguration", cdk.validateString)(properties.endpointConfiguration));
  errors.collect(cdk.propertyValidator("mutualTlsAuthentication", CfnHttpApiMutualTlsAuthenticationPropertyValidator)(properties.mutualTlsAuthentication));
  errors.collect(cdk.propertyValidator("route53", CfnHttpApiRoute53ConfigurationPropertyValidator)(properties.route53));
  errors.collect(cdk.propertyValidator("securityPolicy", cdk.validateString)(properties.securityPolicy));
  return errors.wrap("supplied properties not correct for \"HttpApiDomainConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiHttpApiDomainConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiHttpApiDomainConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "BasePath": cdk.stringToCloudFormation(properties.basePath),
    "CertificateArn": cdk.stringToCloudFormation(properties.certificateArn),
    "DomainName": cdk.stringToCloudFormation(properties.domainName),
    "EndpointConfiguration": cdk.stringToCloudFormation(properties.endpointConfiguration),
    "MutualTlsAuthentication": convertCfnHttpApiMutualTlsAuthenticationPropertyToCloudFormation(properties.mutualTlsAuthentication),
    "Route53": convertCfnHttpApiRoute53ConfigurationPropertyToCloudFormation(properties.route53),
    "SecurityPolicy": cdk.stringToCloudFormation(properties.securityPolicy)
  };
}

// @ts-ignore TS6133
function CfnHttpApiHttpApiDomainConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApi.HttpApiDomainConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApi.HttpApiDomainConfigurationProperty>();
  ret.addPropertyResult("basePath", "BasePath", (properties.BasePath != null ? cfn_parse.FromCloudFormation.getString(properties.BasePath) : undefined));
  ret.addPropertyResult("certificateArn", "CertificateArn", (properties.CertificateArn != null ? cfn_parse.FromCloudFormation.getString(properties.CertificateArn) : undefined));
  ret.addPropertyResult("domainName", "DomainName", (properties.DomainName != null ? cfn_parse.FromCloudFormation.getString(properties.DomainName) : undefined));
  ret.addPropertyResult("endpointConfiguration", "EndpointConfiguration", (properties.EndpointConfiguration != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointConfiguration) : undefined));
  ret.addPropertyResult("mutualTlsAuthentication", "MutualTlsAuthentication", (properties.MutualTlsAuthentication != null ? CfnHttpApiMutualTlsAuthenticationPropertyFromCloudFormation(properties.MutualTlsAuthentication) : undefined));
  ret.addPropertyResult("route53", "Route53", (properties.Route53 != null ? CfnHttpApiRoute53ConfigurationPropertyFromCloudFormation(properties.Route53) : undefined));
  ret.addPropertyResult("securityPolicy", "SecurityPolicy", (properties.SecurityPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.SecurityPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnHttpApiProps`
 *
 * @param properties - the TypeScript properties of a `CfnHttpApiProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnHttpApiPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("accessLogSetting", CfnHttpApiAccessLogSettingPropertyValidator)(properties.accessLogSetting));
  errors.collect(cdk.propertyValidator("auth", CfnHttpApiHttpApiAuthPropertyValidator)(properties.auth));
  errors.collect(cdk.propertyValidator("corsConfiguration", cdk.unionValidator(cdk.validateBoolean, CfnHttpApiCorsConfigurationObjectPropertyValidator))(properties.corsConfiguration));
  errors.collect(cdk.propertyValidator("defaultRouteSettings", CfnHttpApiRouteSettingsPropertyValidator)(properties.defaultRouteSettings));
  errors.collect(cdk.propertyValidator("definitionBody", cdk.validateObject)(properties.definitionBody));
  errors.collect(cdk.propertyValidator("definitionUri", cdk.unionValidator(cdk.validateString, CfnHttpApiS3LocationPropertyValidator))(properties.definitionUri));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("disableExecuteApiEndpoint", cdk.validateBoolean)(properties.disableExecuteApiEndpoint));
  errors.collect(cdk.propertyValidator("domain", CfnHttpApiHttpApiDomainConfigurationPropertyValidator)(properties.domain));
  errors.collect(cdk.propertyValidator("failOnWarnings", cdk.validateBoolean)(properties.failOnWarnings));
  errors.collect(cdk.propertyValidator("routeSettings", CfnHttpApiRouteSettingsPropertyValidator)(properties.routeSettings));
  errors.collect(cdk.propertyValidator("stageName", cdk.validateString)(properties.stageName));
  errors.collect(cdk.propertyValidator("stageVariables", cdk.hashValidator(cdk.validateString))(properties.stageVariables));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnHttpApiProps\"");
}

// @ts-ignore TS6133
function convertCfnHttpApiPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnHttpApiPropsValidator(properties).assertSuccess();
  return {
    "AccessLogSetting": convertCfnHttpApiAccessLogSettingPropertyToCloudFormation(properties.accessLogSetting),
    "Auth": convertCfnHttpApiHttpApiAuthPropertyToCloudFormation(properties.auth),
    "CorsConfiguration": cdk.unionMapper([cdk.validateBoolean, CfnHttpApiCorsConfigurationObjectPropertyValidator], [cdk.booleanToCloudFormation, convertCfnHttpApiCorsConfigurationObjectPropertyToCloudFormation])(properties.corsConfiguration),
    "DefaultRouteSettings": convertCfnHttpApiRouteSettingsPropertyToCloudFormation(properties.defaultRouteSettings),
    "DefinitionBody": cdk.objectToCloudFormation(properties.definitionBody),
    "DefinitionUri": cdk.unionMapper([cdk.validateString, CfnHttpApiS3LocationPropertyValidator], [cdk.stringToCloudFormation, convertCfnHttpApiS3LocationPropertyToCloudFormation])(properties.definitionUri),
    "Description": cdk.stringToCloudFormation(properties.description),
    "DisableExecuteApiEndpoint": cdk.booleanToCloudFormation(properties.disableExecuteApiEndpoint),
    "Domain": convertCfnHttpApiHttpApiDomainConfigurationPropertyToCloudFormation(properties.domain),
    "FailOnWarnings": cdk.booleanToCloudFormation(properties.failOnWarnings),
    "RouteSettings": convertCfnHttpApiRouteSettingsPropertyToCloudFormation(properties.routeSettings),
    "StageName": cdk.stringToCloudFormation(properties.stageName),
    "StageVariables": cdk.hashMapper(cdk.stringToCloudFormation)(properties.stageVariables),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnHttpApiPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnHttpApiProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnHttpApiProps>();
  ret.addPropertyResult("accessLogSetting", "AccessLogSetting", (properties.AccessLogSetting != null ? CfnHttpApiAccessLogSettingPropertyFromCloudFormation(properties.AccessLogSetting) : undefined));
  ret.addPropertyResult("auth", "Auth", (properties.Auth != null ? CfnHttpApiHttpApiAuthPropertyFromCloudFormation(properties.Auth) : undefined));
  ret.addPropertyResult("corsConfiguration", "CorsConfiguration", (properties.CorsConfiguration != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateBoolean, CfnHttpApiCorsConfigurationObjectPropertyValidator], [cfn_parse.FromCloudFormation.getBoolean, CfnHttpApiCorsConfigurationObjectPropertyFromCloudFormation])(properties.CorsConfiguration) : undefined));
  ret.addPropertyResult("defaultRouteSettings", "DefaultRouteSettings", (properties.DefaultRouteSettings != null ? CfnHttpApiRouteSettingsPropertyFromCloudFormation(properties.DefaultRouteSettings) : undefined));
  ret.addPropertyResult("definitionBody", "DefinitionBody", (properties.DefinitionBody != null ? cfn_parse.FromCloudFormation.getAny(properties.DefinitionBody) : undefined));
  ret.addPropertyResult("definitionUri", "DefinitionUri", (properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnHttpApiS3LocationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnHttpApiS3LocationPropertyFromCloudFormation])(properties.DefinitionUri) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("disableExecuteApiEndpoint", "DisableExecuteApiEndpoint", (properties.DisableExecuteApiEndpoint != null ? cfn_parse.FromCloudFormation.getBoolean(properties.DisableExecuteApiEndpoint) : undefined));
  ret.addPropertyResult("domain", "Domain", (properties.Domain != null ? CfnHttpApiHttpApiDomainConfigurationPropertyFromCloudFormation(properties.Domain) : undefined));
  ret.addPropertyResult("failOnWarnings", "FailOnWarnings", (properties.FailOnWarnings != null ? cfn_parse.FromCloudFormation.getBoolean(properties.FailOnWarnings) : undefined));
  ret.addPropertyResult("routeSettings", "RouteSettings", (properties.RouteSettings != null ? CfnHttpApiRouteSettingsPropertyFromCloudFormation(properties.RouteSettings) : undefined));
  ret.addPropertyResult("stageName", "StageName", (properties.StageName != null ? cfn_parse.FromCloudFormation.getString(properties.StageName) : undefined));
  ret.addPropertyResult("stageVariables", "StageVariables", (properties.StageVariables != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.StageVariables) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlessapplication.
 *
 * @cloudformationResource AWS::Serverless::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::Application";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnApplication from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnApplication {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnApplicationPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnApplication(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public location: CfnApplication.ApplicationLocationProperty | cdk.IResolvable | string;

  public notificationArns?: Array<string>;

  public parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Record<string, string>;

  public timeoutInMinutes?: number;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnApplicationProps) {
    super(scope, id, {
      "type": CfnApplication.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "location", this);

    // Automatically add the required transform
    this.stack.addTransform(CfnApplication.REQUIRED_TRANSFORM);

    this.location = props.location;
    this.notificationArns = props.notificationArns;
    this.parameters = props.parameters;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.timeoutInMinutes = props.timeoutInMinutes;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "location": this.location,
      "notificationArns": this.notificationArns,
      "parameters": this.parameters,
      "tags": this.tags.renderTags(),
      "timeoutInMinutes": this.timeoutInMinutes
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnApplication.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnApplicationPropsToCloudFormation(props);
  }
}

export namespace CfnApplication {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-application-applicationlocation.html
   */
  export interface ApplicationLocationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-application-applicationlocation.html#cfn-serverless-application-applicationlocation-applicationid
     */
    readonly applicationId: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-application-applicationlocation.html#cfn-serverless-application-applicationlocation-semanticversion
     */
    readonly semanticVersion: string;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html
 */
export interface CfnApplicationProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html#cfn-serverless-application-location
   */
  readonly location: CfnApplication.ApplicationLocationProperty | cdk.IResolvable | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html#cfn-serverless-application-notificationarns
   */
  readonly notificationArns?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html#cfn-serverless-application-parameters
   */
  readonly parameters?: cdk.IResolvable | Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html#cfn-serverless-application-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-application.html#cfn-serverless-application-timeoutinminutes
   */
  readonly timeoutInMinutes?: number;
}

/**
 * Determine whether the given properties match those of a `ApplicationLocationProperty`
 *
 * @param properties - the TypeScript properties of a `ApplicationLocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationApplicationLocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("applicationId", cdk.requiredValidator)(properties.applicationId));
  errors.collect(cdk.propertyValidator("applicationId", cdk.validateString)(properties.applicationId));
  errors.collect(cdk.propertyValidator("semanticVersion", cdk.requiredValidator)(properties.semanticVersion));
  errors.collect(cdk.propertyValidator("semanticVersion", cdk.validateString)(properties.semanticVersion));
  return errors.wrap("supplied properties not correct for \"ApplicationLocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationApplicationLocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationApplicationLocationPropertyValidator(properties).assertSuccess();
  return {
    "ApplicationId": cdk.stringToCloudFormation(properties.applicationId),
    "SemanticVersion": cdk.stringToCloudFormation(properties.semanticVersion)
  };
}

// @ts-ignore TS6133
function CfnApplicationApplicationLocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ApplicationLocationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ApplicationLocationProperty>();
  ret.addPropertyResult("applicationId", "ApplicationId", (properties.ApplicationId != null ? cfn_parse.FromCloudFormation.getString(properties.ApplicationId) : undefined));
  ret.addPropertyResult("semanticVersion", "SemanticVersion", (properties.SemanticVersion != null ? cfn_parse.FromCloudFormation.getString(properties.SemanticVersion) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnApplicationProps`
 *
 * @param properties - the TypeScript properties of a `CfnApplicationProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("location", cdk.requiredValidator)(properties.location));
  errors.collect(cdk.propertyValidator("location", cdk.unionValidator(cdk.validateString, CfnApplicationApplicationLocationPropertyValidator))(properties.location));
  errors.collect(cdk.propertyValidator("notificationArns", cdk.listValidator(cdk.validateString))(properties.notificationArns));
  errors.collect(cdk.propertyValidator("parameters", cdk.hashValidator(cdk.validateString))(properties.parameters));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("timeoutInMinutes", cdk.validateNumber)(properties.timeoutInMinutes));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "Location": cdk.unionMapper([cdk.validateString, CfnApplicationApplicationLocationPropertyValidator], [cdk.stringToCloudFormation, convertCfnApplicationApplicationLocationPropertyToCloudFormation])(properties.location),
    "NotificationArns": cdk.listMapper(cdk.stringToCloudFormation)(properties.notificationArns),
    "Parameters": cdk.hashMapper(cdk.stringToCloudFormation)(properties.parameters),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "TimeoutInMinutes": cdk.numberToCloudFormation(properties.timeoutInMinutes)
  };
}

// @ts-ignore TS6133
function CfnApplicationPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplicationProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplicationProps>();
  ret.addPropertyResult("location", "Location", (properties.Location != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnApplicationApplicationLocationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnApplicationApplicationLocationPropertyFromCloudFormation])(properties.Location) : undefined));
  ret.addPropertyResult("notificationArns", "NotificationArns", (properties.NotificationArns != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.NotificationArns) : undefined));
  ret.addPropertyResult("parameters", "Parameters", (properties.Parameters != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Parameters) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("timeoutInMinutes", "TimeoutInMinutes", (properties.TimeoutInMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.TimeoutInMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesssimpletable.
 *
 * @cloudformationResource AWS::Serverless::SimpleTable
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html
 */
export class CfnSimpleTable extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::SimpleTable";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnSimpleTable from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnSimpleTable {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnSimpleTablePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnSimpleTable(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public primaryKey?: cdk.IResolvable | CfnSimpleTable.PrimaryKeyProperty;

  public provisionedThroughput?: cdk.IResolvable | CfnSimpleTable.ProvisionedThroughputProperty;

  public sseSpecification?: cdk.IResolvable | CfnSimpleTable.SSESpecificationProperty;

  public tableName?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Record<string, string>;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnSimpleTableProps = {}) {
    super(scope, id, {
      "type": CfnSimpleTable.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    // Automatically add the required transform
    this.stack.addTransform(CfnSimpleTable.REQUIRED_TRANSFORM);

    this.primaryKey = props.primaryKey;
    this.provisionedThroughput = props.provisionedThroughput;
    this.sseSpecification = props.sseSpecification;
    this.tableName = props.tableName;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::SimpleTable", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "primaryKey": this.primaryKey,
      "provisionedThroughput": this.provisionedThroughput,
      "sseSpecification": this.sseSpecification,
      "tableName": this.tableName,
      "tags": this.tags.renderTags()
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnSimpleTable.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnSimpleTablePropsToCloudFormation(props);
  }
}

export namespace CfnSimpleTable {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-primarykey.html
   */
  export interface PrimaryKeyProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-primarykey.html#cfn-serverless-simpletable-primarykey-name
     */
    readonly name?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-primarykey.html#cfn-serverless-simpletable-primarykey-type
     */
    readonly type: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-provisionedthroughput.html
   */
  export interface ProvisionedThroughputProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-provisionedthroughput.html#cfn-serverless-simpletable-provisionedthroughput-readcapacityunits
     */
    readonly readCapacityUnits?: number;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-provisionedthroughput.html#cfn-serverless-simpletable-provisionedthroughput-writecapacityunits
     */
    readonly writeCapacityUnits: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-ssespecification.html
   */
  export interface SSESpecificationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-simpletable-ssespecification.html#cfn-serverless-simpletable-ssespecification-sseenabled
     */
    readonly sseEnabled?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnSimpleTable`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html
 */
export interface CfnSimpleTableProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html#cfn-serverless-simpletable-primarykey
   */
  readonly primaryKey?: cdk.IResolvable | CfnSimpleTable.PrimaryKeyProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html#cfn-serverless-simpletable-provisionedthroughput
   */
  readonly provisionedThroughput?: cdk.IResolvable | CfnSimpleTable.ProvisionedThroughputProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html#cfn-serverless-simpletable-ssespecification
   */
  readonly sseSpecification?: cdk.IResolvable | CfnSimpleTable.SSESpecificationProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html#cfn-serverless-simpletable-tablename
   */
  readonly tableName?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-simpletable.html#cfn-serverless-simpletable-tags
   */
  readonly tags?: Record<string, string>;
}

/**
 * Determine whether the given properties match those of a `PrimaryKeyProperty`
 *
 * @param properties - the TypeScript properties of a `PrimaryKeyProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimpleTablePrimaryKeyPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"PrimaryKeyProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimpleTablePrimaryKeyPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimpleTablePrimaryKeyPropertyValidator(properties).assertSuccess();
  return {
    "Name": cdk.stringToCloudFormation(properties.name),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnSimpleTablePrimaryKeyPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimpleTable.PrimaryKeyProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTable.PrimaryKeyProperty>();
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ProvisionedThroughputProperty`
 *
 * @param properties - the TypeScript properties of a `ProvisionedThroughputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimpleTableProvisionedThroughputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("readCapacityUnits", cdk.validateNumber)(properties.readCapacityUnits));
  errors.collect(cdk.propertyValidator("writeCapacityUnits", cdk.requiredValidator)(properties.writeCapacityUnits));
  errors.collect(cdk.propertyValidator("writeCapacityUnits", cdk.validateNumber)(properties.writeCapacityUnits));
  return errors.wrap("supplied properties not correct for \"ProvisionedThroughputProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimpleTableProvisionedThroughputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimpleTableProvisionedThroughputPropertyValidator(properties).assertSuccess();
  return {
    "ReadCapacityUnits": cdk.numberToCloudFormation(properties.readCapacityUnits),
    "WriteCapacityUnits": cdk.numberToCloudFormation(properties.writeCapacityUnits)
  };
}

// @ts-ignore TS6133
function CfnSimpleTableProvisionedThroughputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimpleTable.ProvisionedThroughputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTable.ProvisionedThroughputProperty>();
  ret.addPropertyResult("readCapacityUnits", "ReadCapacityUnits", (properties.ReadCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.ReadCapacityUnits) : undefined));
  ret.addPropertyResult("writeCapacityUnits", "WriteCapacityUnits", (properties.WriteCapacityUnits != null ? cfn_parse.FromCloudFormation.getNumber(properties.WriteCapacityUnits) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SSESpecificationProperty`
 *
 * @param properties - the TypeScript properties of a `SSESpecificationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimpleTableSSESpecificationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("sseEnabled", cdk.validateBoolean)(properties.sseEnabled));
  return errors.wrap("supplied properties not correct for \"SSESpecificationProperty\"");
}

// @ts-ignore TS6133
function convertCfnSimpleTableSSESpecificationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimpleTableSSESpecificationPropertyValidator(properties).assertSuccess();
  return {
    "SSEEnabled": cdk.booleanToCloudFormation(properties.sseEnabled)
  };
}

// @ts-ignore TS6133
function CfnSimpleTableSSESpecificationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnSimpleTable.SSESpecificationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTable.SSESpecificationProperty>();
  ret.addPropertyResult("sseEnabled", "SSEEnabled", (properties.SSEEnabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.SSEEnabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnSimpleTableProps`
 *
 * @param properties - the TypeScript properties of a `CfnSimpleTableProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnSimpleTablePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("primaryKey", CfnSimpleTablePrimaryKeyPropertyValidator)(properties.primaryKey));
  errors.collect(cdk.propertyValidator("provisionedThroughput", CfnSimpleTableProvisionedThroughputPropertyValidator)(properties.provisionedThroughput));
  errors.collect(cdk.propertyValidator("sseSpecification", CfnSimpleTableSSESpecificationPropertyValidator)(properties.sseSpecification));
  errors.collect(cdk.propertyValidator("tableName", cdk.validateString)(properties.tableName));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  return errors.wrap("supplied properties not correct for \"CfnSimpleTableProps\"");
}

// @ts-ignore TS6133
function convertCfnSimpleTablePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnSimpleTablePropsValidator(properties).assertSuccess();
  return {
    "PrimaryKey": convertCfnSimpleTablePrimaryKeyPropertyToCloudFormation(properties.primaryKey),
    "ProvisionedThroughput": convertCfnSimpleTableProvisionedThroughputPropertyToCloudFormation(properties.provisionedThroughput),
    "SSESpecification": convertCfnSimpleTableSSESpecificationPropertyToCloudFormation(properties.sseSpecification),
    "TableName": cdk.stringToCloudFormation(properties.tableName),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags)
  };
}

// @ts-ignore TS6133
function CfnSimpleTablePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnSimpleTableProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnSimpleTableProps>();
  ret.addPropertyResult("primaryKey", "PrimaryKey", (properties.PrimaryKey != null ? CfnSimpleTablePrimaryKeyPropertyFromCloudFormation(properties.PrimaryKey) : undefined));
  ret.addPropertyResult("provisionedThroughput", "ProvisionedThroughput", (properties.ProvisionedThroughput != null ? CfnSimpleTableProvisionedThroughputPropertyFromCloudFormation(properties.ProvisionedThroughput) : undefined));
  ret.addPropertyResult("sseSpecification", "SSESpecification", (properties.SSESpecification != null ? CfnSimpleTableSSESpecificationPropertyFromCloudFormation(properties.SSESpecification) : undefined));
  ret.addPropertyResult("tableName", "TableName", (properties.TableName != null ? cfn_parse.FromCloudFormation.getString(properties.TableName) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#awsserverlesslayerversion.
 *
 * @cloudformationResource AWS::Serverless::LayerVersion
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html
 */
export class CfnLayerVersion extends cdk.CfnResource implements cdk.IInspectable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::LayerVersion";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnLayerVersion from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnLayerVersion {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnLayerVersionPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnLayerVersion(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public compatibleRuntimes?: Array<string>;

  public contentUri?: cdk.IResolvable | CfnLayerVersion.S3LocationProperty | string;

  public description?: string;

  public layerName?: string;

  public licenseInfo?: string;

  public retentionPolicy?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnLayerVersionProps = {}) {
    super(scope, id, {
      "type": CfnLayerVersion.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    // Automatically add the required transform
    this.stack.addTransform(CfnLayerVersion.REQUIRED_TRANSFORM);

    this.compatibleRuntimes = props.compatibleRuntimes;
    this.contentUri = props.contentUri;
    this.description = props.description;
    this.layerName = props.layerName;
    this.licenseInfo = props.licenseInfo;
    this.retentionPolicy = props.retentionPolicy;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "compatibleRuntimes": this.compatibleRuntimes,
      "contentUri": this.contentUri,
      "description": this.description,
      "layerName": this.layerName,
      "licenseInfo": this.licenseInfo,
      "retentionPolicy": this.retentionPolicy
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnLayerVersion.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnLayerVersionPropsToCloudFormation(props);
  }
}

export namespace CfnLayerVersion {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-layerversion-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-layerversion-s3location.html#cfn-serverless-layerversion-s3location-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-layerversion-s3location.html#cfn-serverless-layerversion-s3location-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-layerversion-s3location.html#cfn-serverless-layerversion-s3location-version
     */
    readonly version?: number;
  }
}

/**
 * Properties for defining a `CfnLayerVersion`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html
 */
export interface CfnLayerVersionProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html#cfn-serverless-layerversion-compatibleruntimes
   */
  readonly compatibleRuntimes?: Array<string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html#cfn-serverless-layerversion-contenturi
   */
  readonly contentUri?: cdk.IResolvable | CfnLayerVersion.S3LocationProperty | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html#cfn-serverless-layerversion-description
   */
  readonly description?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html#cfn-serverless-layerversion-layername
   */
  readonly layerName?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html#cfn-serverless-layerversion-licenseinfo
   */
  readonly licenseInfo?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-layerversion.html#cfn-serverless-layerversion-retentionpolicy
   */
  readonly retentionPolicy?: string;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerVersionS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnLayerVersionS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerVersionS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnLayerVersionS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnLayerVersion.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersion.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnLayerVersionProps`
 *
 * @param properties - the TypeScript properties of a `CfnLayerVersionProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnLayerVersionPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("compatibleRuntimes", cdk.listValidator(cdk.validateString))(properties.compatibleRuntimes));
  errors.collect(cdk.propertyValidator("contentUri", cdk.unionValidator(cdk.validateString, CfnLayerVersionS3LocationPropertyValidator))(properties.contentUri));
  errors.collect(cdk.propertyValidator("description", cdk.validateString)(properties.description));
  errors.collect(cdk.propertyValidator("layerName", cdk.validateString)(properties.layerName));
  errors.collect(cdk.propertyValidator("licenseInfo", cdk.validateString)(properties.licenseInfo));
  errors.collect(cdk.propertyValidator("retentionPolicy", cdk.validateString)(properties.retentionPolicy));
  return errors.wrap("supplied properties not correct for \"CfnLayerVersionProps\"");
}

// @ts-ignore TS6133
function convertCfnLayerVersionPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnLayerVersionPropsValidator(properties).assertSuccess();
  return {
    "CompatibleRuntimes": cdk.listMapper(cdk.stringToCloudFormation)(properties.compatibleRuntimes),
    "ContentUri": cdk.unionMapper([cdk.validateString, CfnLayerVersionS3LocationPropertyValidator], [cdk.stringToCloudFormation, convertCfnLayerVersionS3LocationPropertyToCloudFormation])(properties.contentUri),
    "Description": cdk.stringToCloudFormation(properties.description),
    "LayerName": cdk.stringToCloudFormation(properties.layerName),
    "LicenseInfo": cdk.stringToCloudFormation(properties.licenseInfo),
    "RetentionPolicy": cdk.stringToCloudFormation(properties.retentionPolicy)
  };
}

// @ts-ignore TS6133
function CfnLayerVersionPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnLayerVersionProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnLayerVersionProps>();
  ret.addPropertyResult("compatibleRuntimes", "CompatibleRuntimes", (properties.CompatibleRuntimes != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.CompatibleRuntimes) : undefined));
  ret.addPropertyResult("contentUri", "ContentUri", (properties.ContentUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnLayerVersionS3LocationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnLayerVersionS3LocationPropertyFromCloudFormation])(properties.ContentUri) : undefined));
  ret.addPropertyResult("description", "Description", (properties.Description != null ? cfn_parse.FromCloudFormation.getString(properties.Description) : undefined));
  ret.addPropertyResult("layerName", "LayerName", (properties.LayerName != null ? cfn_parse.FromCloudFormation.getString(properties.LayerName) : undefined));
  ret.addPropertyResult("licenseInfo", "LicenseInfo", (properties.LicenseInfo != null ? cfn_parse.FromCloudFormation.getString(properties.LicenseInfo) : undefined));
  ret.addPropertyResult("retentionPolicy", "RetentionPolicy", (properties.RetentionPolicy != null ? cfn_parse.FromCloudFormation.getString(properties.RetentionPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/sam-resource-statemachine.html.
 *
 * @cloudformationResource AWS::Serverless::StateMachine
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html
 */
export class CfnStateMachine extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::Serverless::StateMachine";

  /**
   * The `Transform` a template must use in order to use this resource
   */
  public static readonly REQUIRED_TRANSFORM: string = "AWS::Serverless-2016-10-31";

  /**
   * Build a CfnStateMachine from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnStateMachine {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnStateMachinePropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnStateMachine(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  public definition?: any | cdk.IResolvable;

  public definitionSubstitutions?: cdk.IResolvable | Record<string, string>;

  public definitionUri?: cdk.IResolvable | CfnStateMachine.S3LocationProperty | string;

  public events?: cdk.IResolvable | Record<string, CfnStateMachine.EventSourceProperty | cdk.IResolvable>;

  public logging?: cdk.IResolvable | CfnStateMachine.LoggingConfigurationProperty;

  public name?: string;

  public permissionsBoundaries?: string;

  public policies?: Array<CfnStateMachine.IAMPolicyDocumentProperty | cdk.IResolvable | CfnStateMachine.SAMPolicyTemplateProperty | string> | CfnStateMachine.IAMPolicyDocumentProperty | cdk.IResolvable | string;

  public role?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  public tagsRaw?: Record<string, string>;

  public tracing?: cdk.IResolvable | CfnStateMachine.TracingConfigurationProperty;

  public type?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnStateMachineProps = {}) {
    super(scope, id, {
      "type": CfnStateMachine.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    // Automatically add the required transform
    this.stack.addTransform(CfnStateMachine.REQUIRED_TRANSFORM);

    this.definition = props.definition;
    this.definitionSubstitutions = props.definitionSubstitutions;
    this.definitionUri = props.definitionUri;
    this.events = props.events;
    this.logging = props.logging;
    this.name = props.name;
    this.permissionsBoundaries = props.permissionsBoundaries;
    this.policies = props.policies;
    this.role = props.role;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::Serverless::StateMachine", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.tracing = props.tracing;
    this.type = props.type;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "definition": this.definition,
      "definitionSubstitutions": this.definitionSubstitutions,
      "definitionUri": this.definitionUri,
      "events": this.events,
      "logging": this.logging,
      "name": this.name,
      "permissionsBoundaries": this.permissionsBoundaries,
      "policies": this.policies,
      "role": this.role,
      "tags": this.tags.renderTags(),
      "tracing": this.tracing,
      "type": this.type
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnStateMachine.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnStateMachinePropsToCloudFormation(props);
  }
}

export namespace CfnStateMachine {
  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-s3location.html
   */
  export interface S3LocationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-s3location.html#cfn-serverless-statemachine-s3location-bucket
     */
    readonly bucket: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-s3location.html#cfn-serverless-statemachine-s3location-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-s3location.html#cfn-serverless-statemachine-s3location-version
     */
    readonly version?: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventsource.html
   */
  export interface EventSourceProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventsource.html#cfn-serverless-statemachine-eventsource-properties
     */
    readonly properties: CfnStateMachine.ApiEventProperty | CfnStateMachine.CloudWatchEventEventProperty | CfnStateMachine.EventBridgeRuleEventProperty | cdk.IResolvable | CfnStateMachine.ScheduleEventProperty;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventsource.html#cfn-serverless-statemachine-eventsource-type
     */
    readonly type: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatcheventevent.html
   */
  export interface CloudWatchEventEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatcheventevent.html#cfn-serverless-statemachine-cloudwatcheventevent-eventbusname
     */
    readonly eventBusName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatcheventevent.html#cfn-serverless-statemachine-cloudwatcheventevent-input
     */
    readonly input?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatcheventevent.html#cfn-serverless-statemachine-cloudwatcheventevent-inputpath
     */
    readonly inputPath?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatcheventevent.html#cfn-serverless-statemachine-cloudwatcheventevent-pattern
     */
    readonly pattern: any | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventbridgeruleevent.html
   */
  export interface EventBridgeRuleEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventbridgeruleevent.html#cfn-serverless-statemachine-eventbridgeruleevent-eventbusname
     */
    readonly eventBusName?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventbridgeruleevent.html#cfn-serverless-statemachine-eventbridgeruleevent-input
     */
    readonly input?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventbridgeruleevent.html#cfn-serverless-statemachine-eventbridgeruleevent-inputpath
     */
    readonly inputPath?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-eventbridgeruleevent.html#cfn-serverless-statemachine-eventbridgeruleevent-pattern
     */
    readonly pattern: any | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-scheduleevent.html
   */
  export interface ScheduleEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-scheduleevent.html#cfn-serverless-statemachine-scheduleevent-input
     */
    readonly input?: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-scheduleevent.html#cfn-serverless-statemachine-scheduleevent-schedule
     */
    readonly schedule: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-apievent.html
   */
  export interface ApiEventProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-apievent.html#cfn-serverless-statemachine-apievent-method
     */
    readonly method: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-apievent.html#cfn-serverless-statemachine-apievent-path
     */
    readonly path: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-apievent.html#cfn-serverless-statemachine-apievent-restapiid
     */
    readonly restApiId?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-loggingconfiguration.html
   */
  export interface LoggingConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-loggingconfiguration.html#cfn-serverless-statemachine-loggingconfiguration-destinations
     */
    readonly destinations: Array<cdk.IResolvable | CfnStateMachine.LogDestinationProperty> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-loggingconfiguration.html#cfn-serverless-statemachine-loggingconfiguration-includeexecutiondata
     */
    readonly includeExecutionData: boolean | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-loggingconfiguration.html#cfn-serverless-statemachine-loggingconfiguration-level
     */
    readonly level: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-logdestination.html
   */
  export interface LogDestinationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-logdestination.html#cfn-serverless-statemachine-logdestination-cloudwatchlogsloggroup
     */
    readonly cloudWatchLogsLogGroup: CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatchlogsloggroup.html
   */
  export interface CloudWatchLogsLogGroupProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-cloudwatchlogsloggroup.html#cfn-serverless-statemachine-cloudwatchlogsloggroup-loggrouparn
     */
    readonly logGroupArn: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-iampolicydocument.html
   */
  export interface IAMPolicyDocumentProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-iampolicydocument.html#cfn-serverless-statemachine-iampolicydocument-statement
     */
    readonly statement: any | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-iampolicydocument.html#cfn-serverless-statemachine-iampolicydocument-version
     */
    readonly version: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-sampolicytemplate.html
   */
  export interface SAMPolicyTemplateProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-sampolicytemplate.html#cfn-serverless-statemachine-sampolicytemplate-lambdainvokepolicy
     */
    readonly lambdaInvokePolicy?: CfnStateMachine.FunctionSAMPTProperty | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-sampolicytemplate.html#cfn-serverless-statemachine-sampolicytemplate-stepfunctionsexecutionpolicy
     */
    readonly stepFunctionsExecutionPolicy?: cdk.IResolvable | CfnStateMachine.StateMachineSAMPTProperty;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-functionsampt.html
   */
  export interface FunctionSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-functionsampt.html#cfn-serverless-statemachine-functionsampt-functionname
     */
    readonly functionName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-statemachinesampt.html
   */
  export interface StateMachineSAMPTProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-statemachinesampt.html#cfn-serverless-statemachine-statemachinesampt-statemachinename
     */
    readonly stateMachineName: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-tracingconfiguration.html
   */
  export interface TracingConfigurationProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-serverless-statemachine-tracingconfiguration.html#cfn-serverless-statemachine-tracingconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }
}

/**
 * Properties for defining a `CfnStateMachine`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html
 */
export interface CfnStateMachineProps {
  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-definition
   */
  readonly definition?: any | cdk.IResolvable;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-definitionsubstitutions
   */
  readonly definitionSubstitutions?: cdk.IResolvable | Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-definitionuri
   */
  readonly definitionUri?: cdk.IResolvable | CfnStateMachine.S3LocationProperty | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-events
   */
  readonly events?: cdk.IResolvable | Record<string, CfnStateMachine.EventSourceProperty | cdk.IResolvable>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-logging
   */
  readonly logging?: cdk.IResolvable | CfnStateMachine.LoggingConfigurationProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-name
   */
  readonly name?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-permissionsboundaries
   */
  readonly permissionsBoundaries?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-policies
   */
  readonly policies?: Array<CfnStateMachine.IAMPolicyDocumentProperty | cdk.IResolvable | CfnStateMachine.SAMPolicyTemplateProperty | string> | CfnStateMachine.IAMPolicyDocumentProperty | cdk.IResolvable | string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-role
   */
  readonly role?: string;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-tags
   */
  readonly tags?: Record<string, string>;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-tracing
   */
  readonly tracing?: cdk.IResolvable | CfnStateMachine.TracingConfigurationProperty;

  /**
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-serverless-statemachine.html#cfn-serverless-statemachine-type
   */
  readonly type?: string;
}

/**
 * Determine whether the given properties match those of a `S3LocationProperty`
 *
 * @param properties - the TypeScript properties of a `S3LocationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineS3LocationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("bucket", cdk.requiredValidator)(properties.bucket));
  errors.collect(cdk.propertyValidator("bucket", cdk.validateString)(properties.bucket));
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("version", cdk.validateNumber)(properties.version));
  return errors.wrap("supplied properties not correct for \"S3LocationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineS3LocationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineS3LocationPropertyValidator(properties).assertSuccess();
  return {
    "Bucket": cdk.stringToCloudFormation(properties.bucket),
    "Key": cdk.stringToCloudFormation(properties.key),
    "Version": cdk.numberToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnStateMachineS3LocationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.S3LocationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.S3LocationProperty>();
  ret.addPropertyResult("bucket", "Bucket", (properties.Bucket != null ? cfn_parse.FromCloudFormation.getString(properties.Bucket) : undefined));
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getNumber(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchEventEventProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchEventEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineCloudWatchEventEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBusName", cdk.validateString)(properties.eventBusName));
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("inputPath", cdk.validateString)(properties.inputPath));
  errors.collect(cdk.propertyValidator("pattern", cdk.requiredValidator)(properties.pattern));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateObject)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"CloudWatchEventEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineCloudWatchEventEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineCloudWatchEventEventPropertyValidator(properties).assertSuccess();
  return {
    "EventBusName": cdk.stringToCloudFormation(properties.eventBusName),
    "Input": cdk.stringToCloudFormation(properties.input),
    "InputPath": cdk.stringToCloudFormation(properties.inputPath),
    "Pattern": cdk.objectToCloudFormation(properties.pattern)
  };
}

// @ts-ignore TS6133
function CfnStateMachineCloudWatchEventEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.CloudWatchEventEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.CloudWatchEventEventProperty>();
  ret.addPropertyResult("eventBusName", "EventBusName", (properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("inputPath", "InputPath", (properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getAny(properties.Pattern) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventBridgeRuleEventProperty`
 *
 * @param properties - the TypeScript properties of a `EventBridgeRuleEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineEventBridgeRuleEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("eventBusName", cdk.validateString)(properties.eventBusName));
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("inputPath", cdk.validateString)(properties.inputPath));
  errors.collect(cdk.propertyValidator("pattern", cdk.requiredValidator)(properties.pattern));
  errors.collect(cdk.propertyValidator("pattern", cdk.validateObject)(properties.pattern));
  return errors.wrap("supplied properties not correct for \"EventBridgeRuleEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineEventBridgeRuleEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineEventBridgeRuleEventPropertyValidator(properties).assertSuccess();
  return {
    "EventBusName": cdk.stringToCloudFormation(properties.eventBusName),
    "Input": cdk.stringToCloudFormation(properties.input),
    "InputPath": cdk.stringToCloudFormation(properties.inputPath),
    "Pattern": cdk.objectToCloudFormation(properties.pattern)
  };
}

// @ts-ignore TS6133
function CfnStateMachineEventBridgeRuleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.EventBridgeRuleEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.EventBridgeRuleEventProperty>();
  ret.addPropertyResult("eventBusName", "EventBusName", (properties.EventBusName != null ? cfn_parse.FromCloudFormation.getString(properties.EventBusName) : undefined));
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("inputPath", "InputPath", (properties.InputPath != null ? cfn_parse.FromCloudFormation.getString(properties.InputPath) : undefined));
  ret.addPropertyResult("pattern", "Pattern", (properties.Pattern != null ? cfn_parse.FromCloudFormation.getAny(properties.Pattern) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ScheduleEventProperty`
 *
 * @param properties - the TypeScript properties of a `ScheduleEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineScheduleEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("input", cdk.validateString)(properties.input));
  errors.collect(cdk.propertyValidator("schedule", cdk.requiredValidator)(properties.schedule));
  errors.collect(cdk.propertyValidator("schedule", cdk.validateString)(properties.schedule));
  return errors.wrap("supplied properties not correct for \"ScheduleEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineScheduleEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineScheduleEventPropertyValidator(properties).assertSuccess();
  return {
    "Input": cdk.stringToCloudFormation(properties.input),
    "Schedule": cdk.stringToCloudFormation(properties.schedule)
  };
}

// @ts-ignore TS6133
function CfnStateMachineScheduleEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.ScheduleEventProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.ScheduleEventProperty>();
  ret.addPropertyResult("input", "Input", (properties.Input != null ? cfn_parse.FromCloudFormation.getString(properties.Input) : undefined));
  ret.addPropertyResult("schedule", "Schedule", (properties.Schedule != null ? cfn_parse.FromCloudFormation.getString(properties.Schedule) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ApiEventProperty`
 *
 * @param properties - the TypeScript properties of a `ApiEventProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineApiEventPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("method", cdk.requiredValidator)(properties.method));
  errors.collect(cdk.propertyValidator("method", cdk.validateString)(properties.method));
  errors.collect(cdk.propertyValidator("path", cdk.requiredValidator)(properties.path));
  errors.collect(cdk.propertyValidator("path", cdk.validateString)(properties.path));
  errors.collect(cdk.propertyValidator("restApiId", cdk.validateString)(properties.restApiId));
  return errors.wrap("supplied properties not correct for \"ApiEventProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineApiEventPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineApiEventPropertyValidator(properties).assertSuccess();
  return {
    "Method": cdk.stringToCloudFormation(properties.method),
    "Path": cdk.stringToCloudFormation(properties.path),
    "RestApiId": cdk.stringToCloudFormation(properties.restApiId)
  };
}

// @ts-ignore TS6133
function CfnStateMachineApiEventPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.ApiEventProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.ApiEventProperty>();
  ret.addPropertyResult("method", "Method", (properties.Method != null ? cfn_parse.FromCloudFormation.getString(properties.Method) : undefined));
  ret.addPropertyResult("path", "Path", (properties.Path != null ? cfn_parse.FromCloudFormation.getString(properties.Path) : undefined));
  ret.addPropertyResult("restApiId", "RestApiId", (properties.RestApiId != null ? cfn_parse.FromCloudFormation.getString(properties.RestApiId) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `EventSourceProperty`
 *
 * @param properties - the TypeScript properties of a `EventSourceProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineEventSourcePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("properties", cdk.requiredValidator)(properties.properties));
  errors.collect(cdk.propertyValidator("properties", cdk.unionValidator(CfnStateMachineApiEventPropertyValidator, CfnStateMachineCloudWatchEventEventPropertyValidator, CfnStateMachineEventBridgeRuleEventPropertyValidator, CfnStateMachineScheduleEventPropertyValidator))(properties.properties));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"EventSourceProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineEventSourcePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineEventSourcePropertyValidator(properties).assertSuccess();
  return {
    "Properties": cdk.unionMapper([CfnStateMachineApiEventPropertyValidator, CfnStateMachineCloudWatchEventEventPropertyValidator, CfnStateMachineEventBridgeRuleEventPropertyValidator, CfnStateMachineScheduleEventPropertyValidator], [convertCfnStateMachineApiEventPropertyToCloudFormation, convertCfnStateMachineCloudWatchEventEventPropertyToCloudFormation, convertCfnStateMachineEventBridgeRuleEventPropertyToCloudFormation, convertCfnStateMachineScheduleEventPropertyToCloudFormation])(properties.properties),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnStateMachineEventSourcePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.EventSourceProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.EventSourceProperty>();
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getTypeUnion([CfnStateMachineApiEventPropertyValidator, CfnStateMachineCloudWatchEventEventPropertyValidator, CfnStateMachineEventBridgeRuleEventPropertyValidator, CfnStateMachineScheduleEventPropertyValidator], [CfnStateMachineApiEventPropertyFromCloudFormation, CfnStateMachineCloudWatchEventEventPropertyFromCloudFormation, CfnStateMachineEventBridgeRuleEventPropertyFromCloudFormation, CfnStateMachineScheduleEventPropertyFromCloudFormation])(properties.Properties) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLogsLogGroupProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLogsLogGroupProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineCloudWatchLogsLogGroupPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.requiredValidator)(properties.logGroupArn));
  errors.collect(cdk.propertyValidator("logGroupArn", cdk.validateString)(properties.logGroupArn));
  return errors.wrap("supplied properties not correct for \"CloudWatchLogsLogGroupProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineCloudWatchLogsLogGroupPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineCloudWatchLogsLogGroupPropertyValidator(properties).assertSuccess();
  return {
    "LogGroupArn": cdk.stringToCloudFormation(properties.logGroupArn)
  };
}

// @ts-ignore TS6133
function CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.CloudWatchLogsLogGroupProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.CloudWatchLogsLogGroupProperty>();
  ret.addPropertyResult("logGroupArn", "LogGroupArn", (properties.LogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogDestinationProperty`
 *
 * @param properties - the TypeScript properties of a `LogDestinationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineLogDestinationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogsLogGroup", cdk.requiredValidator)(properties.cloudWatchLogsLogGroup));
  errors.collect(cdk.propertyValidator("cloudWatchLogsLogGroup", CfnStateMachineCloudWatchLogsLogGroupPropertyValidator)(properties.cloudWatchLogsLogGroup));
  return errors.wrap("supplied properties not correct for \"LogDestinationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineLogDestinationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineLogDestinationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogsLogGroup": convertCfnStateMachineCloudWatchLogsLogGroupPropertyToCloudFormation(properties.cloudWatchLogsLogGroup)
  };
}

// @ts-ignore TS6133
function CfnStateMachineLogDestinationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.LogDestinationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.LogDestinationProperty>();
  ret.addPropertyResult("cloudWatchLogsLogGroup", "CloudWatchLogsLogGroup", (properties.CloudWatchLogsLogGroup != null ? CfnStateMachineCloudWatchLogsLogGroupPropertyFromCloudFormation(properties.CloudWatchLogsLogGroup) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `LoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("destinations", cdk.requiredValidator)(properties.destinations));
  errors.collect(cdk.propertyValidator("destinations", cdk.listValidator(CfnStateMachineLogDestinationPropertyValidator))(properties.destinations));
  errors.collect(cdk.propertyValidator("includeExecutionData", cdk.requiredValidator)(properties.includeExecutionData));
  errors.collect(cdk.propertyValidator("includeExecutionData", cdk.validateBoolean)(properties.includeExecutionData));
  errors.collect(cdk.propertyValidator("level", cdk.requiredValidator)(properties.level));
  errors.collect(cdk.propertyValidator("level", cdk.validateString)(properties.level));
  return errors.wrap("supplied properties not correct for \"LoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Destinations": cdk.listMapper(convertCfnStateMachineLogDestinationPropertyToCloudFormation)(properties.destinations),
    "IncludeExecutionData": cdk.booleanToCloudFormation(properties.includeExecutionData),
    "Level": cdk.stringToCloudFormation(properties.level)
  };
}

// @ts-ignore TS6133
function CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.LoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.LoggingConfigurationProperty>();
  ret.addPropertyResult("destinations", "Destinations", (properties.Destinations != null ? cfn_parse.FromCloudFormation.getArray(CfnStateMachineLogDestinationPropertyFromCloudFormation)(properties.Destinations) : undefined));
  ret.addPropertyResult("includeExecutionData", "IncludeExecutionData", (properties.IncludeExecutionData != null ? cfn_parse.FromCloudFormation.getBoolean(properties.IncludeExecutionData) : undefined));
  ret.addPropertyResult("level", "Level", (properties.Level != null ? cfn_parse.FromCloudFormation.getString(properties.Level) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `IAMPolicyDocumentProperty`
 *
 * @param properties - the TypeScript properties of a `IAMPolicyDocumentProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineIAMPolicyDocumentPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("statement", cdk.requiredValidator)(properties.statement));
  errors.collect(cdk.propertyValidator("statement", cdk.validateObject)(properties.statement));
  errors.collect(cdk.propertyValidator("version", cdk.requiredValidator)(properties.version));
  errors.collect(cdk.propertyValidator("version", cdk.validateString)(properties.version));
  return errors.wrap("supplied properties not correct for \"IAMPolicyDocumentProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineIAMPolicyDocumentPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineIAMPolicyDocumentPropertyValidator(properties).assertSuccess();
  return {
    "Statement": cdk.objectToCloudFormation(properties.statement),
    "Version": cdk.stringToCloudFormation(properties.version)
  };
}

// @ts-ignore TS6133
function CfnStateMachineIAMPolicyDocumentPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.IAMPolicyDocumentProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.IAMPolicyDocumentProperty>();
  ret.addPropertyResult("statement", "Statement", (properties.Statement != null ? cfn_parse.FromCloudFormation.getAny(properties.Statement) : undefined));
  ret.addPropertyResult("version", "Version", (properties.Version != null ? cfn_parse.FromCloudFormation.getString(properties.Version) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `FunctionSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `FunctionSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineFunctionSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("functionName", cdk.requiredValidator)(properties.functionName));
  errors.collect(cdk.propertyValidator("functionName", cdk.validateString)(properties.functionName));
  return errors.wrap("supplied properties not correct for \"FunctionSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineFunctionSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineFunctionSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "FunctionName": cdk.stringToCloudFormation(properties.functionName)
  };
}

// @ts-ignore TS6133
function CfnStateMachineFunctionSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachine.FunctionSAMPTProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.FunctionSAMPTProperty>();
  ret.addPropertyResult("functionName", "FunctionName", (properties.FunctionName != null ? cfn_parse.FromCloudFormation.getString(properties.FunctionName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `StateMachineSAMPTProperty`
 *
 * @param properties - the TypeScript properties of a `StateMachineSAMPTProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineStateMachineSAMPTPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.requiredValidator)(properties.stateMachineName));
  errors.collect(cdk.propertyValidator("stateMachineName", cdk.validateString)(properties.stateMachineName));
  return errors.wrap("supplied properties not correct for \"StateMachineSAMPTProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineStateMachineSAMPTPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineStateMachineSAMPTPropertyValidator(properties).assertSuccess();
  return {
    "StateMachineName": cdk.stringToCloudFormation(properties.stateMachineName)
  };
}

// @ts-ignore TS6133
function CfnStateMachineStateMachineSAMPTPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.StateMachineSAMPTProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.StateMachineSAMPTProperty>();
  ret.addPropertyResult("stateMachineName", "StateMachineName", (properties.StateMachineName != null ? cfn_parse.FromCloudFormation.getString(properties.StateMachineName) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `SAMPolicyTemplateProperty`
 *
 * @param properties - the TypeScript properties of a `SAMPolicyTemplateProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineSAMPolicyTemplatePropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("lambdaInvokePolicy", CfnStateMachineFunctionSAMPTPropertyValidator)(properties.lambdaInvokePolicy));
  errors.collect(cdk.propertyValidator("stepFunctionsExecutionPolicy", CfnStateMachineStateMachineSAMPTPropertyValidator)(properties.stepFunctionsExecutionPolicy));
  return errors.wrap("supplied properties not correct for \"SAMPolicyTemplateProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineSAMPolicyTemplatePropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineSAMPolicyTemplatePropertyValidator(properties).assertSuccess();
  return {
    "LambdaInvokePolicy": convertCfnStateMachineFunctionSAMPTPropertyToCloudFormation(properties.lambdaInvokePolicy),
    "StepFunctionsExecutionPolicy": convertCfnStateMachineStateMachineSAMPTPropertyToCloudFormation(properties.stepFunctionsExecutionPolicy)
  };
}

// @ts-ignore TS6133
function CfnStateMachineSAMPolicyTemplatePropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.SAMPolicyTemplateProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.SAMPolicyTemplateProperty>();
  ret.addPropertyResult("lambdaInvokePolicy", "LambdaInvokePolicy", (properties.LambdaInvokePolicy != null ? CfnStateMachineFunctionSAMPTPropertyFromCloudFormation(properties.LambdaInvokePolicy) : undefined));
  ret.addPropertyResult("stepFunctionsExecutionPolicy", "StepFunctionsExecutionPolicy", (properties.StepFunctionsExecutionPolicy != null ? CfnStateMachineStateMachineSAMPTPropertyFromCloudFormation(properties.StepFunctionsExecutionPolicy) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `TracingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `TracingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachineTracingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"TracingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnStateMachineTracingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachineTracingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnStateMachine.TracingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachine.TracingConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnStateMachineProps`
 *
 * @param properties - the TypeScript properties of a `CfnStateMachineProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnStateMachinePropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("definition", cdk.validateObject)(properties.definition));
  errors.collect(cdk.propertyValidator("definitionSubstitutions", cdk.hashValidator(cdk.validateString))(properties.definitionSubstitutions));
  errors.collect(cdk.propertyValidator("definitionUri", cdk.unionValidator(cdk.validateString, CfnStateMachineS3LocationPropertyValidator))(properties.definitionUri));
  errors.collect(cdk.propertyValidator("events", cdk.hashValidator(CfnStateMachineEventSourcePropertyValidator))(properties.events));
  errors.collect(cdk.propertyValidator("logging", CfnStateMachineLoggingConfigurationPropertyValidator)(properties.logging));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("permissionsBoundaries", cdk.validateString)(properties.permissionsBoundaries));
  errors.collect(cdk.propertyValidator("policies", cdk.unionValidator(cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator, CfnStateMachineSAMPolicyTemplatePropertyValidator)), cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator))(properties.policies));
  errors.collect(cdk.propertyValidator("role", cdk.validateString)(properties.role));
  errors.collect(cdk.propertyValidator("tags", cdk.hashValidator(cdk.validateString))(properties.tags));
  errors.collect(cdk.propertyValidator("tracing", CfnStateMachineTracingConfigurationPropertyValidator)(properties.tracing));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  return errors.wrap("supplied properties not correct for \"CfnStateMachineProps\"");
}

// @ts-ignore TS6133
function convertCfnStateMachinePropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnStateMachinePropsValidator(properties).assertSuccess();
  return {
    "Definition": cdk.objectToCloudFormation(properties.definition),
    "DefinitionSubstitutions": cdk.hashMapper(cdk.stringToCloudFormation)(properties.definitionSubstitutions),
    "DefinitionUri": cdk.unionMapper([cdk.validateString, CfnStateMachineS3LocationPropertyValidator], [cdk.stringToCloudFormation, convertCfnStateMachineS3LocationPropertyToCloudFormation])(properties.definitionUri),
    "Events": cdk.hashMapper(convertCfnStateMachineEventSourcePropertyToCloudFormation)(properties.events),
    "Logging": convertCfnStateMachineLoggingConfigurationPropertyToCloudFormation(properties.logging),
    "Name": cdk.stringToCloudFormation(properties.name),
    "PermissionsBoundaries": cdk.stringToCloudFormation(properties.permissionsBoundaries),
    "Policies": cdk.unionMapper([cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator, CfnStateMachineSAMPolicyTemplatePropertyValidator)), cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator], [cdk.listMapper(cdk.unionMapper([cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator, CfnStateMachineSAMPolicyTemplatePropertyValidator], [cdk.stringToCloudFormation, convertCfnStateMachineIAMPolicyDocumentPropertyToCloudFormation, convertCfnStateMachineSAMPolicyTemplatePropertyToCloudFormation])), cdk.stringToCloudFormation, convertCfnStateMachineIAMPolicyDocumentPropertyToCloudFormation])(properties.policies),
    "Role": cdk.stringToCloudFormation(properties.role),
    "Tags": cdk.hashMapper(cdk.stringToCloudFormation)(properties.tags),
    "Tracing": convertCfnStateMachineTracingConfigurationPropertyToCloudFormation(properties.tracing),
    "Type": cdk.stringToCloudFormation(properties.type)
  };
}

// @ts-ignore TS6133
function CfnStateMachinePropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnStateMachineProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnStateMachineProps>();
  ret.addPropertyResult("definition", "Definition", (properties.Definition != null ? cfn_parse.FromCloudFormation.getAny(properties.Definition) : undefined));
  ret.addPropertyResult("definitionSubstitutions", "DefinitionSubstitutions", (properties.DefinitionSubstitutions != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.DefinitionSubstitutions) : undefined));
  ret.addPropertyResult("definitionUri", "DefinitionUri", (properties.DefinitionUri != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnStateMachineS3LocationPropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnStateMachineS3LocationPropertyFromCloudFormation])(properties.DefinitionUri) : undefined));
  ret.addPropertyResult("events", "Events", (properties.Events != null ? cfn_parse.FromCloudFormation.getMap(CfnStateMachineEventSourcePropertyFromCloudFormation)(properties.Events) : undefined));
  ret.addPropertyResult("logging", "Logging", (properties.Logging != null ? CfnStateMachineLoggingConfigurationPropertyFromCloudFormation(properties.Logging) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("permissionsBoundaries", "PermissionsBoundaries", (properties.PermissionsBoundaries != null ? cfn_parse.FromCloudFormation.getString(properties.PermissionsBoundaries) : undefined));
  ret.addPropertyResult("policies", "Policies", (properties.Policies != null ? cfn_parse.FromCloudFormation.getTypeUnion([cdk.listValidator(cdk.unionValidator(cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator, CfnStateMachineSAMPolicyTemplatePropertyValidator)), cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator], [cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getTypeUnion([cdk.validateString, CfnStateMachineIAMPolicyDocumentPropertyValidator, CfnStateMachineSAMPolicyTemplatePropertyValidator], [cfn_parse.FromCloudFormation.getString, CfnStateMachineIAMPolicyDocumentPropertyFromCloudFormation, CfnStateMachineSAMPolicyTemplatePropertyFromCloudFormation])), cfn_parse.FromCloudFormation.getString, CfnStateMachineIAMPolicyDocumentPropertyFromCloudFormation])(properties.Policies) : undefined));
  ret.addPropertyResult("role", "Role", (properties.Role != null ? cfn_parse.FromCloudFormation.getString(properties.Role) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Tags) : undefined));
  ret.addPropertyResult("tracing", "Tracing", (properties.Tracing != null ? CfnStateMachineTracingConfigurationPropertyFromCloudFormation(properties.Tracing) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}