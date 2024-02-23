/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::EMRServerless::Application` resource specifies an EMR Serverless application.
 *
 * An application uses open source analytics frameworks to run jobs that process data. To create an application, you must specify the release version for the open source framework version you want to use and the type of application you want, such as Apache Spark or Apache Hive. After you create an application, you can submit data processing jobs or interactive requests to it.
 *
 * @cloudformationResource AWS::EMRServerless::Application
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html
 */
export class CfnApplication extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::EMRServerless::Application";

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

  /**
   * The ID of the application, such as `ab4rp1abcs8xz47n3x0example` .
   *
   * @cloudformationAttribute ApplicationId
   */
  public readonly attrApplicationId: string;

  /**
   * The Amazon Resource Name (ARN) of the project.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The CPU architecture of an application.
   */
  public architecture?: string;

  /**
   * The configuration for an application to automatically start on job submission.
   */
  public autoStartConfiguration?: CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration for an application to automatically stop after a certain amount of time being idle.
   */
  public autoStopConfiguration?: CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable;

  /**
   * The image configuration applied to all worker types.
   */
  public imageConfiguration?: CfnApplication.ImageConfigurationInputProperty | cdk.IResolvable;

  /**
   * The initial capacity of the application.
   */
  public initialCapacity?: Array<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The maximum capacity of the application.
   */
  public maximumCapacity?: cdk.IResolvable | CfnApplication.MaximumAllowedResourcesProperty;

  /**
   * A configuration specification to be used when provisioning an application.
   */
  public monitoringConfiguration?: cdk.IResolvable | CfnApplication.MonitoringConfigurationProperty;

  /**
   * The name of the application.
   */
  public name?: string;

  /**
   * The network configuration for customer VPC connectivity for the application.
   */
  public networkConfiguration?: cdk.IResolvable | CfnApplication.NetworkConfigurationProperty;

  /**
   * The EMR release associated with the application.
   */
  public releaseLabel: string;

  /**
   * The [Configuration](https://docs.aws.amazon.com/emr-serverless/latest/APIReference/API_Configuration.html) specifications of an application. Each configuration consists of a classification and properties. You use this parameter when creating or updating an application. To see the runtimeConfiguration object of an application, run the [GetApplication](https://docs.aws.amazon.com/emr-serverless/latest/APIReference/API_GetApplication.html) API operation.
   */
  public runtimeConfiguration?: Array<CfnApplication.ConfigurationObjectProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The tags assigned to the application.
   */
  public tagsRaw?: Array<cdk.CfnTag>;

  /**
   * The type of application, such as Spark or Hive.
   */
  public type: string;

  /**
   * The specification applied to each worker type.
   */
  public workerTypeSpecifications?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnApplication.WorkerTypeSpecificationInputProperty>;

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

    cdk.requireProperty(props, "releaseLabel", this);
    cdk.requireProperty(props, "type", this);

    this.attrApplicationId = cdk.Token.asString(this.getAtt("ApplicationId", cdk.ResolutionTypeHint.STRING));
    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.architecture = props.architecture;
    this.autoStartConfiguration = props.autoStartConfiguration;
    this.autoStopConfiguration = props.autoStopConfiguration;
    this.imageConfiguration = props.imageConfiguration;
    this.initialCapacity = props.initialCapacity;
    this.maximumCapacity = props.maximumCapacity;
    this.monitoringConfiguration = props.monitoringConfiguration;
    this.name = props.name;
    this.networkConfiguration = props.networkConfiguration;
    this.releaseLabel = props.releaseLabel;
    this.runtimeConfiguration = props.runtimeConfiguration;
    this.tags = new cdk.TagManager(cdk.TagType.STANDARD, "AWS::EMRServerless::Application", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.type = props.type;
    this.workerTypeSpecifications = props.workerTypeSpecifications;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "architecture": this.architecture,
      "autoStartConfiguration": this.autoStartConfiguration,
      "autoStopConfiguration": this.autoStopConfiguration,
      "imageConfiguration": this.imageConfiguration,
      "initialCapacity": this.initialCapacity,
      "maximumCapacity": this.maximumCapacity,
      "monitoringConfiguration": this.monitoringConfiguration,
      "name": this.name,
      "networkConfiguration": this.networkConfiguration,
      "releaseLabel": this.releaseLabel,
      "runtimeConfiguration": this.runtimeConfiguration,
      "tags": this.tags.renderTags(),
      "type": this.type,
      "workerTypeSpecifications": this.workerTypeSpecifications
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
   * Configuration for Auto Start of Application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostartconfiguration.html
   */
  export interface AutoStartConfigurationProperty {
    /**
     * If set to true, the Application will automatically start.
     *
     * Defaults to true.
     *
     * @default - true
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostartconfiguration.html#cfn-emrserverless-application-autostartconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;
  }

  /**
   * The specifications for a worker type.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workertypespecificationinput.html
   */
  export interface WorkerTypeSpecificationInputProperty {
    /**
     * The image configuration for a worker type.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workertypespecificationinput.html#cfn-emrserverless-application-workertypespecificationinput-imageconfiguration
     */
    readonly imageConfiguration?: CfnApplication.ImageConfigurationInputProperty | cdk.IResolvable;
  }

  /**
   * The image configuration.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-imageconfigurationinput.html
   */
  export interface ImageConfigurationInputProperty {
    /**
     * The URI of an image in the Amazon ECR registry.
     *
     * This field is required when you create a new application. If you leave this field blank in an update, Amazon EMR will remove the image configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-imageconfigurationinput.html#cfn-emrserverless-application-imageconfigurationinput-imageuri
     */
    readonly imageUri?: string;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html
   */
  export interface InitialCapacityConfigKeyValuePairProperty {
    /**
     * Worker type for an analytics framework.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html#cfn-emrserverless-application-initialcapacityconfigkeyvaluepair-key
     */
    readonly key: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfigkeyvaluepair.html#cfn-emrserverless-application-initialcapacityconfigkeyvaluepair-value
     */
    readonly value: CfnApplication.InitialCapacityConfigProperty | cdk.IResolvable;
  }

  /**
   * The initial capacity configuration per worker.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html
   */
  export interface InitialCapacityConfigProperty {
    /**
     * The resource configuration of the initial capacity configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html#cfn-emrserverless-application-initialcapacityconfig-workerconfiguration
     */
    readonly workerConfiguration: cdk.IResolvable | CfnApplication.WorkerConfigurationProperty;

    /**
     * The number of workers in the initial capacity configuration.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-initialcapacityconfig.html#cfn-emrserverless-application-initialcapacityconfig-workercount
     */
    readonly workerCount: number;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html
   */
  export interface WorkerConfigurationProperty {
    /**
     * Per worker CPU resource.
     *
     * vCPU is the only supported unit and specifying vCPU is optional.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-cpu
     */
    readonly cpu: string;

    /**
     * Per worker Disk resource.
     *
     * GB is the only supported unit and specifying GB is optional
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-disk
     */
    readonly disk?: string;

    /**
     * Per worker memory resource.
     *
     * GB is the only supported unit and specifying GB is optional.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-workerconfiguration.html#cfn-emrserverless-application-workerconfiguration-memory
     */
    readonly memory: string;
  }

  /**
   * The maximum allowed cumulative resources for an application.
   *
   * No new resources will be created once the limit is hit.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html
   */
  export interface MaximumAllowedResourcesProperty {
    /**
     * The maximum allowed CPU for an application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-cpu
     */
    readonly cpu: string;

    /**
     * The maximum allowed disk for an application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-disk
     */
    readonly disk?: string;

    /**
     * The maximum allowed resources for an application.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-maximumallowedresources.html#cfn-emrserverless-application-maximumallowedresources-memory
     */
    readonly memory: string;
  }

  /**
   * Configuration for Auto Stop of Application.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html
   */
  export interface AutoStopConfigurationProperty {
    /**
     * If set to true, the Application will automatically stop after being idle.
     *
     * Defaults to true.
     *
     * @default - true
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html#cfn-emrserverless-application-autostopconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The amount of time [in minutes] to wait before auto stopping the Application when idle.
     *
     * Defaults to 15 minutes.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-autostopconfiguration.html#cfn-emrserverless-application-autostopconfiguration-idletimeoutminutes
     */
    readonly idleTimeoutMinutes?: number;
  }

  /**
   * The network configuration for customer VPC connectivity.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * The array of security group Ids for customer VPC connectivity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html#cfn-emrserverless-application-networkconfiguration-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * The array of subnet Ids for customer VPC connectivity.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-networkconfiguration.html#cfn-emrserverless-application-networkconfiguration-subnetids
     */
    readonly subnetIds?: Array<string>;
  }

  /**
   * The configuration setting for monitoring.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-monitoringconfiguration.html
   */
  export interface MonitoringConfigurationProperty {
    /**
     * The Amazon CloudWatch configuration for monitoring logs.
     *
     * You can configure your jobs to send log information to CloudWatch .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-monitoringconfiguration.html#cfn-emrserverless-application-monitoringconfiguration-cloudwatchloggingconfiguration
     */
    readonly cloudWatchLoggingConfiguration?: CfnApplication.CloudWatchLoggingConfigurationProperty | cdk.IResolvable;

    /**
     * The managed log persistence configuration for a job run.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-monitoringconfiguration.html#cfn-emrserverless-application-monitoringconfiguration-managedpersistencemonitoringconfiguration
     */
    readonly managedPersistenceMonitoringConfiguration?: cdk.IResolvable | CfnApplication.ManagedPersistenceMonitoringConfigurationProperty;

    /**
     * The Amazon S3 configuration for monitoring log publishing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-monitoringconfiguration.html#cfn-emrserverless-application-monitoringconfiguration-s3monitoringconfiguration
     */
    readonly s3MonitoringConfiguration?: cdk.IResolvable | CfnApplication.S3MonitoringConfigurationProperty;
  }

  /**
   * The Amazon S3 configuration for monitoring log publishing.
   *
   * You can configure your jobs to send log information to Amazon S3.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-s3monitoringconfiguration.html
   */
  export interface S3MonitoringConfigurationProperty {
    /**
     * The KMS key ARN to encrypt the logs published to the given Amazon S3 destination.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-s3monitoringconfiguration.html#cfn-emrserverless-application-s3monitoringconfiguration-encryptionkeyarn
     */
    readonly encryptionKeyArn?: string;

    /**
     * The Amazon S3 destination URI for log publishing.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-s3monitoringconfiguration.html#cfn-emrserverless-application-s3monitoringconfiguration-loguri
     */
    readonly logUri?: string;
  }

  /**
   * The managed log persistence configuration for a job run.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-managedpersistencemonitoringconfiguration.html
   */
  export interface ManagedPersistenceMonitoringConfigurationProperty {
    /**
     * Enables managed logging and defaults to true.
     *
     * If set to false, managed logging will be turned off.
     *
     * @default - true
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-managedpersistencemonitoringconfiguration.html#cfn-emrserverless-application-managedpersistencemonitoringconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The KMS key ARN to encrypt the logs stored in managed log persistence.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-managedpersistencemonitoringconfiguration.html#cfn-emrserverless-application-managedpersistencemonitoringconfiguration-encryptionkeyarn
     */
    readonly encryptionKeyArn?: string;
  }

  /**
   * The Amazon CloudWatch configuration for monitoring logs.
   *
   * You can configure your jobs to send log information to CloudWatch .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-cloudwatchloggingconfiguration.html
   */
  export interface CloudWatchLoggingConfigurationProperty {
    /**
     * Enables CloudWatch logging.
     *
     * @default - false
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-cloudwatchloggingconfiguration.html#cfn-emrserverless-application-cloudwatchloggingconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * The AWS Key Management Service (KMS) key ARN to encrypt the logs that you store in CloudWatch Logs .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-cloudwatchloggingconfiguration.html#cfn-emrserverless-application-cloudwatchloggingconfiguration-encryptionkeyarn
     */
    readonly encryptionKeyArn?: string;

    /**
     * The name of the log group in Amazon CloudWatch Logs where you want to publish your logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-cloudwatchloggingconfiguration.html#cfn-emrserverless-application-cloudwatchloggingconfiguration-loggroupname
     */
    readonly logGroupName?: string;

    /**
     * Prefix for the CloudWatch log stream name.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-cloudwatchloggingconfiguration.html#cfn-emrserverless-application-cloudwatchloggingconfiguration-logstreamnameprefix
     */
    readonly logStreamNamePrefix?: string;

    /**
     * The specific log-streams which need to be uploaded to CloudWatch.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-cloudwatchloggingconfiguration.html#cfn-emrserverless-application-cloudwatchloggingconfiguration-logtypemap
     */
    readonly logTypeMap?: Array<cdk.IResolvable | CfnApplication.LogTypeMapKeyValuePairProperty> | cdk.IResolvable;
  }

  /**
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-logtypemapkeyvaluepair.html
   */
  export interface LogTypeMapKeyValuePairProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-logtypemapkeyvaluepair.html#cfn-emrserverless-application-logtypemapkeyvaluepair-key
     */
    readonly key: string;

    /**
     * List of Applicable values: [STDOUT, STDERR, HIVE_LOG, TEZ_AM, SYSTEM_LOGS].
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-logtypemapkeyvaluepair.html#cfn-emrserverless-application-logtypemapkeyvaluepair-value
     */
    readonly value: Array<string>;
  }

  /**
   * Configuration for a JobRun.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-configurationobject.html
   */
  export interface ConfigurationObjectProperty {
    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-configurationobject.html#cfn-emrserverless-application-configurationobject-classification
     */
    readonly classification: string;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-configurationobject.html#cfn-emrserverless-application-configurationobject-configurations
     */
    readonly configurations?: Array<CfnApplication.ConfigurationObjectProperty | cdk.IResolvable> | cdk.IResolvable;

    /**
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-emrserverless-application-configurationobject.html#cfn-emrserverless-application-configurationobject-properties
     */
    readonly properties?: cdk.IResolvable | Record<string, string>;
  }
}

/**
 * Properties for defining a `CfnApplication`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html
 */
export interface CfnApplicationProps {
  /**
   * The CPU architecture of an application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-architecture
   */
  readonly architecture?: string;

  /**
   * The configuration for an application to automatically start on job submission.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostartconfiguration
   */
  readonly autoStartConfiguration?: CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable;

  /**
   * The configuration for an application to automatically stop after a certain amount of time being idle.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-autostopconfiguration
   */
  readonly autoStopConfiguration?: CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable;

  /**
   * The image configuration applied to all worker types.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-imageconfiguration
   */
  readonly imageConfiguration?: CfnApplication.ImageConfigurationInputProperty | cdk.IResolvable;

  /**
   * The initial capacity of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-initialcapacity
   */
  readonly initialCapacity?: Array<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The maximum capacity of the application.
   *
   * This is cumulative across all workers at any given point in time during the lifespan of the application is created. No new resources will be created once any one of the defined limits is hit.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-maximumcapacity
   */
  readonly maximumCapacity?: cdk.IResolvable | CfnApplication.MaximumAllowedResourcesProperty;

  /**
   * A configuration specification to be used when provisioning an application.
   *
   * A configuration consists of a classification, properties, and optional nested configurations. A classification refers to an application-specific configuration file. Properties are the settings you want to change in that file.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-monitoringconfiguration
   */
  readonly monitoringConfiguration?: cdk.IResolvable | CfnApplication.MonitoringConfigurationProperty;

  /**
   * The name of the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-name
   */
  readonly name?: string;

  /**
   * The network configuration for customer VPC connectivity for the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-networkconfiguration
   */
  readonly networkConfiguration?: cdk.IResolvable | CfnApplication.NetworkConfigurationProperty;

  /**
   * The EMR release associated with the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-releaselabel
   */
  readonly releaseLabel: string;

  /**
   * The [Configuration](https://docs.aws.amazon.com/emr-serverless/latest/APIReference/API_Configuration.html) specifications of an application. Each configuration consists of a classification and properties. You use this parameter when creating or updating an application. To see the runtimeConfiguration object of an application, run the [GetApplication](https://docs.aws.amazon.com/emr-serverless/latest/APIReference/API_GetApplication.html) API operation.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-runtimeconfiguration
   */
  readonly runtimeConfiguration?: Array<CfnApplication.ConfigurationObjectProperty | cdk.IResolvable> | cdk.IResolvable;

  /**
   * The tags assigned to the application.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-tags
   */
  readonly tags?: Array<cdk.CfnTag>;

  /**
   * The type of application, such as Spark or Hive.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-type
   */
  readonly type: string;

  /**
   * The specification applied to each worker type.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-emrserverless-application.html#cfn-emrserverless-application-workertypespecifications
   */
  readonly workerTypeSpecifications?: cdk.IResolvable | Record<string, cdk.IResolvable | CfnApplication.WorkerTypeSpecificationInputProperty>;
}

/**
 * Determine whether the given properties match those of a `AutoStartConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AutoStartConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationAutoStartConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  return errors.wrap("supplied properties not correct for \"AutoStartConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationAutoStartConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationAutoStartConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled)
  };
}

// @ts-ignore TS6133
function CfnApplicationAutoStartConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.AutoStartConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.AutoStartConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ImageConfigurationInputProperty`
 *
 * @param properties - the TypeScript properties of a `ImageConfigurationInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationImageConfigurationInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("imageUri", cdk.validateString)(properties.imageUri));
  return errors.wrap("supplied properties not correct for \"ImageConfigurationInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationImageConfigurationInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationImageConfigurationInputPropertyValidator(properties).assertSuccess();
  return {
    "ImageUri": cdk.stringToCloudFormation(properties.imageUri)
  };
}

// @ts-ignore TS6133
function CfnApplicationImageConfigurationInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ImageConfigurationInputProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ImageConfigurationInputProperty>();
  ret.addPropertyResult("imageUri", "ImageUri", (properties.ImageUri != null ? cfn_parse.FromCloudFormation.getString(properties.ImageUri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkerTypeSpecificationInputProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerTypeSpecificationInputProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationWorkerTypeSpecificationInputPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("imageConfiguration", CfnApplicationImageConfigurationInputPropertyValidator)(properties.imageConfiguration));
  return errors.wrap("supplied properties not correct for \"WorkerTypeSpecificationInputProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationWorkerTypeSpecificationInputPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationWorkerTypeSpecificationInputPropertyValidator(properties).assertSuccess();
  return {
    "ImageConfiguration": convertCfnApplicationImageConfigurationInputPropertyToCloudFormation(properties.imageConfiguration)
  };
}

// @ts-ignore TS6133
function CfnApplicationWorkerTypeSpecificationInputPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.WorkerTypeSpecificationInputProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.WorkerTypeSpecificationInputProperty>();
  ret.addPropertyResult("imageConfiguration", "ImageConfiguration", (properties.ImageConfiguration != null ? CfnApplicationImageConfigurationInputPropertyFromCloudFormation(properties.ImageConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `WorkerConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `WorkerConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationWorkerConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpu", cdk.requiredValidator)(properties.cpu));
  errors.collect(cdk.propertyValidator("cpu", cdk.validateString)(properties.cpu));
  errors.collect(cdk.propertyValidator("disk", cdk.validateString)(properties.disk));
  errors.collect(cdk.propertyValidator("memory", cdk.requiredValidator)(properties.memory));
  errors.collect(cdk.propertyValidator("memory", cdk.validateString)(properties.memory));
  return errors.wrap("supplied properties not correct for \"WorkerConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationWorkerConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationWorkerConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Cpu": cdk.stringToCloudFormation(properties.cpu),
    "Disk": cdk.stringToCloudFormation(properties.disk),
    "Memory": cdk.stringToCloudFormation(properties.memory)
  };
}

// @ts-ignore TS6133
function CfnApplicationWorkerConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.WorkerConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.WorkerConfigurationProperty>();
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getString(properties.Cpu) : undefined));
  ret.addPropertyResult("disk", "Disk", (properties.Disk != null ? cfn_parse.FromCloudFormation.getString(properties.Disk) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getString(properties.Memory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InitialCapacityConfigProperty`
 *
 * @param properties - the TypeScript properties of a `InitialCapacityConfigProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInitialCapacityConfigPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("workerConfiguration", cdk.requiredValidator)(properties.workerConfiguration));
  errors.collect(cdk.propertyValidator("workerConfiguration", CfnApplicationWorkerConfigurationPropertyValidator)(properties.workerConfiguration));
  errors.collect(cdk.propertyValidator("workerCount", cdk.requiredValidator)(properties.workerCount));
  errors.collect(cdk.propertyValidator("workerCount", cdk.validateNumber)(properties.workerCount));
  return errors.wrap("supplied properties not correct for \"InitialCapacityConfigProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInitialCapacityConfigPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInitialCapacityConfigPropertyValidator(properties).assertSuccess();
  return {
    "WorkerConfiguration": convertCfnApplicationWorkerConfigurationPropertyToCloudFormation(properties.workerConfiguration),
    "WorkerCount": cdk.numberToCloudFormation(properties.workerCount)
  };
}

// @ts-ignore TS6133
function CfnApplicationInitialCapacityConfigPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InitialCapacityConfigProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InitialCapacityConfigProperty>();
  ret.addPropertyResult("workerConfiguration", "WorkerConfiguration", (properties.WorkerConfiguration != null ? CfnApplicationWorkerConfigurationPropertyFromCloudFormation(properties.WorkerConfiguration) : undefined));
  ret.addPropertyResult("workerCount", "WorkerCount", (properties.WorkerCount != null ? cfn_parse.FromCloudFormation.getNumber(properties.WorkerCount) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `InitialCapacityConfigKeyValuePairProperty`
 *
 * @param properties - the TypeScript properties of a `InitialCapacityConfigKeyValuePairProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationInitialCapacityConfigKeyValuePairPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", CfnApplicationInitialCapacityConfigPropertyValidator)(properties.value));
  return errors.wrap("supplied properties not correct for \"InitialCapacityConfigKeyValuePairProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationInitialCapacityConfigKeyValuePairPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationInitialCapacityConfigKeyValuePairPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": convertCfnApplicationInitialCapacityConfigPropertyToCloudFormation(properties.value)
  };
}

// @ts-ignore TS6133
function CfnApplicationInitialCapacityConfigKeyValuePairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.InitialCapacityConfigKeyValuePairProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.InitialCapacityConfigKeyValuePairProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? CfnApplicationInitialCapacityConfigPropertyFromCloudFormation(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MaximumAllowedResourcesProperty`
 *
 * @param properties - the TypeScript properties of a `MaximumAllowedResourcesProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationMaximumAllowedResourcesPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cpu", cdk.requiredValidator)(properties.cpu));
  errors.collect(cdk.propertyValidator("cpu", cdk.validateString)(properties.cpu));
  errors.collect(cdk.propertyValidator("disk", cdk.validateString)(properties.disk));
  errors.collect(cdk.propertyValidator("memory", cdk.requiredValidator)(properties.memory));
  errors.collect(cdk.propertyValidator("memory", cdk.validateString)(properties.memory));
  return errors.wrap("supplied properties not correct for \"MaximumAllowedResourcesProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationMaximumAllowedResourcesPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationMaximumAllowedResourcesPropertyValidator(properties).assertSuccess();
  return {
    "Cpu": cdk.stringToCloudFormation(properties.cpu),
    "Disk": cdk.stringToCloudFormation(properties.disk),
    "Memory": cdk.stringToCloudFormation(properties.memory)
  };
}

// @ts-ignore TS6133
function CfnApplicationMaximumAllowedResourcesPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.MaximumAllowedResourcesProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MaximumAllowedResourcesProperty>();
  ret.addPropertyResult("cpu", "Cpu", (properties.Cpu != null ? cfn_parse.FromCloudFormation.getString(properties.Cpu) : undefined));
  ret.addPropertyResult("disk", "Disk", (properties.Disk != null ? cfn_parse.FromCloudFormation.getString(properties.Disk) : undefined));
  ret.addPropertyResult("memory", "Memory", (properties.Memory != null ? cfn_parse.FromCloudFormation.getString(properties.Memory) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `AutoStopConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `AutoStopConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationAutoStopConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("idleTimeoutMinutes", cdk.validateNumber)(properties.idleTimeoutMinutes));
  return errors.wrap("supplied properties not correct for \"AutoStopConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationAutoStopConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationAutoStopConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "IdleTimeoutMinutes": cdk.numberToCloudFormation(properties.idleTimeoutMinutes)
  };
}

// @ts-ignore TS6133
function CfnApplicationAutoStopConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.AutoStopConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.AutoStopConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("idleTimeoutMinutes", "IdleTimeoutMinutes", (properties.IdleTimeoutMinutes != null ? cfn_parse.FromCloudFormation.getNumber(properties.IdleTimeoutMinutes) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `NetworkConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `NetworkConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("securityGroupIds", cdk.listValidator(cdk.validateString))(properties.securityGroupIds));
  errors.collect(cdk.propertyValidator("subnetIds", cdk.listValidator(cdk.validateString))(properties.subnetIds));
  return errors.wrap("supplied properties not correct for \"NetworkConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnApplicationNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.NetworkConfigurationProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `S3MonitoringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `S3MonitoringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationS3MonitoringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  errors.collect(cdk.propertyValidator("logUri", cdk.validateString)(properties.logUri));
  return errors.wrap("supplied properties not correct for \"S3MonitoringConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationS3MonitoringConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationS3MonitoringConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn),
    "LogUri": cdk.stringToCloudFormation(properties.logUri)
  };
}

// @ts-ignore TS6133
function CfnApplicationS3MonitoringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.S3MonitoringConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.S3MonitoringConfigurationProperty>();
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addPropertyResult("logUri", "LogUri", (properties.LogUri != null ? cfn_parse.FromCloudFormation.getString(properties.LogUri) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ManagedPersistenceMonitoringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ManagedPersistenceMonitoringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationManagedPersistenceMonitoringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  return errors.wrap("supplied properties not correct for \"ManagedPersistenceMonitoringConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationManagedPersistenceMonitoringConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationManagedPersistenceMonitoringConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn)
  };
}

// @ts-ignore TS6133
function CfnApplicationManagedPersistenceMonitoringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.ManagedPersistenceMonitoringConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ManagedPersistenceMonitoringConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `LogTypeMapKeyValuePairProperty`
 *
 * @param properties - the TypeScript properties of a `LogTypeMapKeyValuePairProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationLogTypeMapKeyValuePairPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("key", cdk.requiredValidator)(properties.key));
  errors.collect(cdk.propertyValidator("key", cdk.validateString)(properties.key));
  errors.collect(cdk.propertyValidator("value", cdk.requiredValidator)(properties.value));
  errors.collect(cdk.propertyValidator("value", cdk.listValidator(cdk.validateString))(properties.value));
  return errors.wrap("supplied properties not correct for \"LogTypeMapKeyValuePairProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationLogTypeMapKeyValuePairPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationLogTypeMapKeyValuePairPropertyValidator(properties).assertSuccess();
  return {
    "Key": cdk.stringToCloudFormation(properties.key),
    "Value": cdk.listMapper(cdk.stringToCloudFormation)(properties.value)
  };
}

// @ts-ignore TS6133
function CfnApplicationLogTypeMapKeyValuePairPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.LogTypeMapKeyValuePairProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.LogTypeMapKeyValuePairProperty>();
  ret.addPropertyResult("key", "Key", (properties.Key != null ? cfn_parse.FromCloudFormation.getString(properties.Key) : undefined));
  ret.addPropertyResult("value", "Value", (properties.Value != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.Value) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CloudWatchLoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `CloudWatchLoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationCloudWatchLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("encryptionKeyArn", cdk.validateString)(properties.encryptionKeyArn));
  errors.collect(cdk.propertyValidator("logGroupName", cdk.validateString)(properties.logGroupName));
  errors.collect(cdk.propertyValidator("logStreamNamePrefix", cdk.validateString)(properties.logStreamNamePrefix));
  errors.collect(cdk.propertyValidator("logTypeMap", cdk.listValidator(CfnApplicationLogTypeMapKeyValuePairPropertyValidator))(properties.logTypeMap));
  return errors.wrap("supplied properties not correct for \"CloudWatchLoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationCloudWatchLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationCloudWatchLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "EncryptionKeyArn": cdk.stringToCloudFormation(properties.encryptionKeyArn),
    "LogGroupName": cdk.stringToCloudFormation(properties.logGroupName),
    "LogStreamNamePrefix": cdk.stringToCloudFormation(properties.logStreamNamePrefix),
    "LogTypeMap": cdk.listMapper(convertCfnApplicationLogTypeMapKeyValuePairPropertyToCloudFormation)(properties.logTypeMap)
  };
}

// @ts-ignore TS6133
function CfnApplicationCloudWatchLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.CloudWatchLoggingConfigurationProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.CloudWatchLoggingConfigurationProperty>();
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("encryptionKeyArn", "EncryptionKeyArn", (properties.EncryptionKeyArn != null ? cfn_parse.FromCloudFormation.getString(properties.EncryptionKeyArn) : undefined));
  ret.addPropertyResult("logGroupName", "LogGroupName", (properties.LogGroupName != null ? cfn_parse.FromCloudFormation.getString(properties.LogGroupName) : undefined));
  ret.addPropertyResult("logStreamNamePrefix", "LogStreamNamePrefix", (properties.LogStreamNamePrefix != null ? cfn_parse.FromCloudFormation.getString(properties.LogStreamNamePrefix) : undefined));
  ret.addPropertyResult("logTypeMap", "LogTypeMap", (properties.LogTypeMap != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationLogTypeMapKeyValuePairPropertyFromCloudFormation)(properties.LogTypeMap) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `MonitoringConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `MonitoringConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationMonitoringConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLoggingConfiguration", CfnApplicationCloudWatchLoggingConfigurationPropertyValidator)(properties.cloudWatchLoggingConfiguration));
  errors.collect(cdk.propertyValidator("managedPersistenceMonitoringConfiguration", CfnApplicationManagedPersistenceMonitoringConfigurationPropertyValidator)(properties.managedPersistenceMonitoringConfiguration));
  errors.collect(cdk.propertyValidator("s3MonitoringConfiguration", CfnApplicationS3MonitoringConfigurationPropertyValidator)(properties.s3MonitoringConfiguration));
  return errors.wrap("supplied properties not correct for \"MonitoringConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationMonitoringConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationMonitoringConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLoggingConfiguration": convertCfnApplicationCloudWatchLoggingConfigurationPropertyToCloudFormation(properties.cloudWatchLoggingConfiguration),
    "ManagedPersistenceMonitoringConfiguration": convertCfnApplicationManagedPersistenceMonitoringConfigurationPropertyToCloudFormation(properties.managedPersistenceMonitoringConfiguration),
    "S3MonitoringConfiguration": convertCfnApplicationS3MonitoringConfigurationPropertyToCloudFormation(properties.s3MonitoringConfiguration)
  };
}

// @ts-ignore TS6133
function CfnApplicationMonitoringConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnApplication.MonitoringConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.MonitoringConfigurationProperty>();
  ret.addPropertyResult("cloudWatchLoggingConfiguration", "CloudWatchLoggingConfiguration", (properties.CloudWatchLoggingConfiguration != null ? CfnApplicationCloudWatchLoggingConfigurationPropertyFromCloudFormation(properties.CloudWatchLoggingConfiguration) : undefined));
  ret.addPropertyResult("managedPersistenceMonitoringConfiguration", "ManagedPersistenceMonitoringConfiguration", (properties.ManagedPersistenceMonitoringConfiguration != null ? CfnApplicationManagedPersistenceMonitoringConfigurationPropertyFromCloudFormation(properties.ManagedPersistenceMonitoringConfiguration) : undefined));
  ret.addPropertyResult("s3MonitoringConfiguration", "S3MonitoringConfiguration", (properties.S3MonitoringConfiguration != null ? CfnApplicationS3MonitoringConfigurationPropertyFromCloudFormation(properties.S3MonitoringConfiguration) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `ConfigurationObjectProperty`
 *
 * @param properties - the TypeScript properties of a `ConfigurationObjectProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnApplicationConfigurationObjectPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("classification", cdk.requiredValidator)(properties.classification));
  errors.collect(cdk.propertyValidator("classification", cdk.validateString)(properties.classification));
  errors.collect(cdk.propertyValidator("configurations", cdk.listValidator(CfnApplicationConfigurationObjectPropertyValidator))(properties.configurations));
  errors.collect(cdk.propertyValidator("properties", cdk.hashValidator(cdk.validateString))(properties.properties));
  return errors.wrap("supplied properties not correct for \"ConfigurationObjectProperty\"");
}

// @ts-ignore TS6133
function convertCfnApplicationConfigurationObjectPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationConfigurationObjectPropertyValidator(properties).assertSuccess();
  return {
    "Classification": cdk.stringToCloudFormation(properties.classification),
    "Configurations": cdk.listMapper(convertCfnApplicationConfigurationObjectPropertyToCloudFormation)(properties.configurations),
    "Properties": cdk.hashMapper(cdk.stringToCloudFormation)(properties.properties)
  };
}

// @ts-ignore TS6133
function CfnApplicationConfigurationObjectPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnApplication.ConfigurationObjectProperty | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnApplication.ConfigurationObjectProperty>();
  ret.addPropertyResult("classification", "Classification", (properties.Classification != null ? cfn_parse.FromCloudFormation.getString(properties.Classification) : undefined));
  ret.addPropertyResult("configurations", "Configurations", (properties.Configurations != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationConfigurationObjectPropertyFromCloudFormation)(properties.Configurations) : undefined));
  ret.addPropertyResult("properties", "Properties", (properties.Properties != null ? cfn_parse.FromCloudFormation.getMap(cfn_parse.FromCloudFormation.getString)(properties.Properties) : undefined));
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
  errors.collect(cdk.propertyValidator("architecture", cdk.validateString)(properties.architecture));
  errors.collect(cdk.propertyValidator("autoStartConfiguration", CfnApplicationAutoStartConfigurationPropertyValidator)(properties.autoStartConfiguration));
  errors.collect(cdk.propertyValidator("autoStopConfiguration", CfnApplicationAutoStopConfigurationPropertyValidator)(properties.autoStopConfiguration));
  errors.collect(cdk.propertyValidator("imageConfiguration", CfnApplicationImageConfigurationInputPropertyValidator)(properties.imageConfiguration));
  errors.collect(cdk.propertyValidator("initialCapacity", cdk.listValidator(CfnApplicationInitialCapacityConfigKeyValuePairPropertyValidator))(properties.initialCapacity));
  errors.collect(cdk.propertyValidator("maximumCapacity", CfnApplicationMaximumAllowedResourcesPropertyValidator)(properties.maximumCapacity));
  errors.collect(cdk.propertyValidator("monitoringConfiguration", CfnApplicationMonitoringConfigurationPropertyValidator)(properties.monitoringConfiguration));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnApplicationNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("releaseLabel", cdk.requiredValidator)(properties.releaseLabel));
  errors.collect(cdk.propertyValidator("releaseLabel", cdk.validateString)(properties.releaseLabel));
  errors.collect(cdk.propertyValidator("runtimeConfiguration", cdk.listValidator(CfnApplicationConfigurationObjectPropertyValidator))(properties.runtimeConfiguration));
  errors.collect(cdk.propertyValidator("tags", cdk.listValidator(cdk.validateCfnTag))(properties.tags));
  errors.collect(cdk.propertyValidator("type", cdk.requiredValidator)(properties.type));
  errors.collect(cdk.propertyValidator("type", cdk.validateString)(properties.type));
  errors.collect(cdk.propertyValidator("workerTypeSpecifications", cdk.hashValidator(CfnApplicationWorkerTypeSpecificationInputPropertyValidator))(properties.workerTypeSpecifications));
  return errors.wrap("supplied properties not correct for \"CfnApplicationProps\"");
}

// @ts-ignore TS6133
function convertCfnApplicationPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnApplicationPropsValidator(properties).assertSuccess();
  return {
    "Architecture": cdk.stringToCloudFormation(properties.architecture),
    "AutoStartConfiguration": convertCfnApplicationAutoStartConfigurationPropertyToCloudFormation(properties.autoStartConfiguration),
    "AutoStopConfiguration": convertCfnApplicationAutoStopConfigurationPropertyToCloudFormation(properties.autoStopConfiguration),
    "ImageConfiguration": convertCfnApplicationImageConfigurationInputPropertyToCloudFormation(properties.imageConfiguration),
    "InitialCapacity": cdk.listMapper(convertCfnApplicationInitialCapacityConfigKeyValuePairPropertyToCloudFormation)(properties.initialCapacity),
    "MaximumCapacity": convertCfnApplicationMaximumAllowedResourcesPropertyToCloudFormation(properties.maximumCapacity),
    "MonitoringConfiguration": convertCfnApplicationMonitoringConfigurationPropertyToCloudFormation(properties.monitoringConfiguration),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkConfiguration": convertCfnApplicationNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "ReleaseLabel": cdk.stringToCloudFormation(properties.releaseLabel),
    "RuntimeConfiguration": cdk.listMapper(convertCfnApplicationConfigurationObjectPropertyToCloudFormation)(properties.runtimeConfiguration),
    "Tags": cdk.listMapper(cdk.cfnTagToCloudFormation)(properties.tags),
    "Type": cdk.stringToCloudFormation(properties.type),
    "WorkerTypeSpecifications": cdk.hashMapper(convertCfnApplicationWorkerTypeSpecificationInputPropertyToCloudFormation)(properties.workerTypeSpecifications)
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
  ret.addPropertyResult("architecture", "Architecture", (properties.Architecture != null ? cfn_parse.FromCloudFormation.getString(properties.Architecture) : undefined));
  ret.addPropertyResult("autoStartConfiguration", "AutoStartConfiguration", (properties.AutoStartConfiguration != null ? CfnApplicationAutoStartConfigurationPropertyFromCloudFormation(properties.AutoStartConfiguration) : undefined));
  ret.addPropertyResult("autoStopConfiguration", "AutoStopConfiguration", (properties.AutoStopConfiguration != null ? CfnApplicationAutoStopConfigurationPropertyFromCloudFormation(properties.AutoStopConfiguration) : undefined));
  ret.addPropertyResult("imageConfiguration", "ImageConfiguration", (properties.ImageConfiguration != null ? CfnApplicationImageConfigurationInputPropertyFromCloudFormation(properties.ImageConfiguration) : undefined));
  ret.addPropertyResult("initialCapacity", "InitialCapacity", (properties.InitialCapacity != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationInitialCapacityConfigKeyValuePairPropertyFromCloudFormation)(properties.InitialCapacity) : undefined));
  ret.addPropertyResult("maximumCapacity", "MaximumCapacity", (properties.MaximumCapacity != null ? CfnApplicationMaximumAllowedResourcesPropertyFromCloudFormation(properties.MaximumCapacity) : undefined));
  ret.addPropertyResult("monitoringConfiguration", "MonitoringConfiguration", (properties.MonitoringConfiguration != null ? CfnApplicationMonitoringConfigurationPropertyFromCloudFormation(properties.MonitoringConfiguration) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnApplicationNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("releaseLabel", "ReleaseLabel", (properties.ReleaseLabel != null ? cfn_parse.FromCloudFormation.getString(properties.ReleaseLabel) : undefined));
  ret.addPropertyResult("runtimeConfiguration", "RuntimeConfiguration", (properties.RuntimeConfiguration != null ? cfn_parse.FromCloudFormation.getArray(CfnApplicationConfigurationObjectPropertyFromCloudFormation)(properties.RuntimeConfiguration) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getCfnTag)(properties.Tags) : undefined));
  ret.addPropertyResult("type", "Type", (properties.Type != null ? cfn_parse.FromCloudFormation.getString(properties.Type) : undefined));
  ret.addPropertyResult("workerTypeSpecifications", "WorkerTypeSpecifications", (properties.WorkerTypeSpecifications != null ? cfn_parse.FromCloudFormation.getMap(CfnApplicationWorkerTypeSpecificationInputPropertyFromCloudFormation)(properties.WorkerTypeSpecifications) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}