/* eslint-disable prettier/prettier,max-len */
import * as cdk from "aws-cdk-lib";
import * as constructs from "constructs";
import * as cfn_parse from "aws-cdk-lib/core/lib/helpers-internal";

/**
 * The `AWS::MWAA::Environment` resource creates an Amazon Managed Workflows for Apache Airflow (MWAA) environment.
 *
 * @cloudformationResource AWS::MWAA::Environment
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html
 */
export class CfnEnvironment extends cdk.CfnResource implements cdk.IInspectable, cdk.ITaggable {
  /**
   * The CloudFormation resource type name for this resource class.
   */
  public static readonly CFN_RESOURCE_TYPE_NAME: string = "AWS::MWAA::Environment";

  /**
   * Build a CfnEnvironment from CloudFormation properties
   *
   * A factory method that creates a new instance of this class from an object
   * containing the CloudFormation properties of this resource.
   * Used in the @aws-cdk/cloudformation-include module.
   *
   * @internal
   */
  public static _fromCloudFormation(scope: constructs.Construct, id: string, resourceAttributes: any, options: cfn_parse.FromCloudFormationOptions): CfnEnvironment {
    resourceAttributes = resourceAttributes || {};
    const resourceProperties = options.parser.parseValue(resourceAttributes.Properties);
    const propsResult = CfnEnvironmentPropsFromCloudFormation(resourceProperties);
    if (cdk.isResolvableObject(propsResult.value)) {
      throw new Error("Unexpected IResolvable");
    }
    const ret = new CfnEnvironment(scope, id, propsResult.value);
    for (const [propKey, propVal] of Object.entries(propsResult.extraProperties)) {
      ret.addPropertyOverride(propKey, propVal);
    }
    options.parser.handleAttributes(ret, resourceAttributes, id);
    return ret;
  }

  /**
   * The ARN for the Amazon MWAA environment.
   *
   * @cloudformationAttribute Arn
   */
  public readonly attrArn: string;

  /**
   * The queue ARN for the environment's [Celery Executor](https://docs.aws.amazon.com/https://airflow.apache.org/docs/apache-airflow/stable/core-concepts/executor/celery.html) . Amazon MWAA uses a Celery Executor to distribute tasks across multiple workers. When you create an environment in a shared VPC, you must provide access to the Celery Executor queue from your VPC.
   *
   * @cloudformationAttribute CeleryExecutorQueue
   */
  public readonly attrCeleryExecutorQueue: string;

  /**
   * The VPC endpoint for the environment's Amazon RDS database.
   *
   * @cloudformationAttribute DatabaseVpcEndpointService
   */
  public readonly attrDatabaseVpcEndpointService: string;

  /**
   * @cloudformationAttribute LoggingConfiguration.DagProcessingLogs.CloudWatchLogGroupArn
   */
  public readonly attrLoggingConfigurationDagProcessingLogsCloudWatchLogGroupArn: string;

  /**
   * @cloudformationAttribute LoggingConfiguration.SchedulerLogs.CloudWatchLogGroupArn
   */
  public readonly attrLoggingConfigurationSchedulerLogsCloudWatchLogGroupArn: string;

  /**
   * @cloudformationAttribute LoggingConfiguration.TaskLogs.CloudWatchLogGroupArn
   */
  public readonly attrLoggingConfigurationTaskLogsCloudWatchLogGroupArn: string;

  /**
   * @cloudformationAttribute LoggingConfiguration.WebserverLogs.CloudWatchLogGroupArn
   */
  public readonly attrLoggingConfigurationWebserverLogsCloudWatchLogGroupArn: string;

  /**
   * @cloudformationAttribute LoggingConfiguration.WorkerLogs.CloudWatchLogGroupArn
   */
  public readonly attrLoggingConfigurationWorkerLogsCloudWatchLogGroupArn: string;

  /**
   * The URL of your Apache Airflow UI.
   *
   * @cloudformationAttribute WebserverUrl
   */
  public readonly attrWebserverUrl: string;

  /**
   * The VPC endpoint for the environment's web server.
   *
   * @cloudformationAttribute WebserverVpcEndpointService
   */
  public readonly attrWebserverVpcEndpointService: string;

  /**
   * A list of key-value pairs containing the Airflow configuration options for your environment.
   */
  public airflowConfigurationOptions?: any | cdk.IResolvable;

  /**
   * The version of Apache Airflow to use for the environment.
   */
  public airflowVersion?: string;

  /**
   * The relative path to the DAGs folder on your Amazon S3 bucket.
   */
  public dagS3Path?: string;

  /**
   * Defines whether the VPC endpoints configured for the environment are created, and managed, by the customer or by Amazon MWAA.
   */
  public endpointManagement?: string;

  /**
   * The environment class type.
   */
  public environmentClass?: string;

  /**
   * The Amazon Resource Name (ARN) of the execution role in IAM that allows MWAA to access AWS resources in your environment.
   */
  public executionRoleArn?: string;

  /**
   * The AWS Key Management Service (KMS) key to encrypt and decrypt the data in your environment.
   */
  public kmsKey?: string;

  /**
   * The Apache Airflow logs being sent to CloudWatch Logs: `DagProcessingLogs` , `SchedulerLogs` , `TaskLogs` , `WebserverLogs` , `WorkerLogs` .
   */
  public loggingConfiguration?: cdk.IResolvable | CfnEnvironment.LoggingConfigurationProperty;

  /**
   * The maximum number of workers that you want to run in your environment.
   */
  public maxWorkers?: number;

  /**
   * The minimum number of workers that you want to run in your environment.
   */
  public minWorkers?: number;

  /**
   * The name of your Amazon MWAA environment.
   */
  public name: string;

  /**
   * The VPC networking components used to secure and enable network traffic between the AWS resources for your environment.
   */
  public networkConfiguration?: cdk.IResolvable | CfnEnvironment.NetworkConfigurationProperty;

  /**
   * The version of the plugins.zip file on your Amazon S3 bucket. To learn more, see [Installing custom plugins](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-dag-import-plugins.html) .
   */
  public pluginsS3ObjectVersion?: string;

  /**
   * The relative path to the `plugins.zip` file on your Amazon S3 bucket. For example, `plugins.zip` . To learn more, see [Installing custom plugins](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-dag-import-plugins.html) .
   */
  public pluginsS3Path?: string;

  /**
   * The version of the requirements.txt file on your Amazon S3 bucket. To learn more, see [Installing Python dependencies](https://docs.aws.amazon.com/mwaa/latest/userguide/working-dags-dependencies.html) .
   */
  public requirementsS3ObjectVersion?: string;

  /**
   * The relative path to the `requirements.txt` file on your Amazon S3 bucket. For example, `requirements.txt` . To learn more, see [Installing Python dependencies](https://docs.aws.amazon.com/mwaa/latest/userguide/working-dags-dependencies.html) .
   */
  public requirementsS3Path?: string;

  /**
   * The number of schedulers that you want to run in your environment. Valid values:.
   */
  public schedulers?: number;

  /**
   * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored.
   */
  public sourceBucketArn?: string;

  /**
   * The version of the startup shell script in your Amazon S3 bucket.
   */
  public startupScriptS3ObjectVersion?: string;

  /**
   * The relative path to the startup shell script in your Amazon S3 bucket. For example, `s3://mwaa-environment/startup.sh` .
   */
  public startupScriptS3Path?: string;

  /**
   * Tag Manager which manages the tags for this resource
   */
  public readonly tags: cdk.TagManager;

  /**
   * The key-value tag pairs associated to your environment. For example, `"Environment": "Staging"` . To learn more, see [Tagging](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   */
  public tagsRaw?: any;

  /**
   * The Apache Airflow *Web server* access mode.
   */
  public webserverAccessMode?: string;

  /**
   * The day and time of the week to start weekly maintenance updates of your environment in the following format: `DAY:HH:MM` .
   */
  public weeklyMaintenanceWindowStart?: string;

  /**
   * @param scope Scope in which this resource is defined
   * @param id Construct identifier for this resource (unique in its scope)
   * @param props Resource properties
   */
  public constructor(scope: constructs.Construct, id: string, props: CfnEnvironmentProps) {
    super(scope, id, {
      "type": CfnEnvironment.CFN_RESOURCE_TYPE_NAME,
      "properties": props
    });

    cdk.requireProperty(props, "name", this);

    this.attrArn = cdk.Token.asString(this.getAtt("Arn", cdk.ResolutionTypeHint.STRING));
    this.attrCeleryExecutorQueue = cdk.Token.asString(this.getAtt("CeleryExecutorQueue", cdk.ResolutionTypeHint.STRING));
    this.attrDatabaseVpcEndpointService = cdk.Token.asString(this.getAtt("DatabaseVpcEndpointService", cdk.ResolutionTypeHint.STRING));
    this.attrLoggingConfigurationDagProcessingLogsCloudWatchLogGroupArn = cdk.Token.asString(this.getAtt("LoggingConfiguration.DagProcessingLogs.CloudWatchLogGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrLoggingConfigurationSchedulerLogsCloudWatchLogGroupArn = cdk.Token.asString(this.getAtt("LoggingConfiguration.SchedulerLogs.CloudWatchLogGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrLoggingConfigurationTaskLogsCloudWatchLogGroupArn = cdk.Token.asString(this.getAtt("LoggingConfiguration.TaskLogs.CloudWatchLogGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrLoggingConfigurationWebserverLogsCloudWatchLogGroupArn = cdk.Token.asString(this.getAtt("LoggingConfiguration.WebserverLogs.CloudWatchLogGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrLoggingConfigurationWorkerLogsCloudWatchLogGroupArn = cdk.Token.asString(this.getAtt("LoggingConfiguration.WorkerLogs.CloudWatchLogGroupArn", cdk.ResolutionTypeHint.STRING));
    this.attrWebserverUrl = cdk.Token.asString(this.getAtt("WebserverUrl", cdk.ResolutionTypeHint.STRING));
    this.attrWebserverVpcEndpointService = cdk.Token.asString(this.getAtt("WebserverVpcEndpointService", cdk.ResolutionTypeHint.STRING));
    this.airflowConfigurationOptions = props.airflowConfigurationOptions;
    this.airflowVersion = props.airflowVersion;
    this.dagS3Path = props.dagS3Path;
    this.endpointManagement = props.endpointManagement;
    this.environmentClass = props.environmentClass;
    this.executionRoleArn = props.executionRoleArn;
    this.kmsKey = props.kmsKey;
    this.loggingConfiguration = props.loggingConfiguration;
    this.maxWorkers = props.maxWorkers;
    this.minWorkers = props.minWorkers;
    this.name = props.name;
    this.networkConfiguration = props.networkConfiguration;
    this.pluginsS3ObjectVersion = props.pluginsS3ObjectVersion;
    this.pluginsS3Path = props.pluginsS3Path;
    this.requirementsS3ObjectVersion = props.requirementsS3ObjectVersion;
    this.requirementsS3Path = props.requirementsS3Path;
    this.schedulers = props.schedulers;
    this.sourceBucketArn = props.sourceBucketArn;
    this.startupScriptS3ObjectVersion = props.startupScriptS3ObjectVersion;
    this.startupScriptS3Path = props.startupScriptS3Path;
    this.tags = new cdk.TagManager(cdk.TagType.MAP, "AWS::MWAA::Environment", props.tags, {
      "tagPropertyName": "tags"
    });
    this.tagsRaw = props.tags;
    this.webserverAccessMode = props.webserverAccessMode;
    this.weeklyMaintenanceWindowStart = props.weeklyMaintenanceWindowStart;
  }

  protected get cfnProperties(): Record<string, any> {
    return {
      "airflowConfigurationOptions": this.airflowConfigurationOptions,
      "airflowVersion": this.airflowVersion,
      "dagS3Path": this.dagS3Path,
      "endpointManagement": this.endpointManagement,
      "environmentClass": this.environmentClass,
      "executionRoleArn": this.executionRoleArn,
      "kmsKey": this.kmsKey,
      "loggingConfiguration": this.loggingConfiguration,
      "maxWorkers": this.maxWorkers,
      "minWorkers": this.minWorkers,
      "name": this.name,
      "networkConfiguration": this.networkConfiguration,
      "pluginsS3ObjectVersion": this.pluginsS3ObjectVersion,
      "pluginsS3Path": this.pluginsS3Path,
      "requirementsS3ObjectVersion": this.requirementsS3ObjectVersion,
      "requirementsS3Path": this.requirementsS3Path,
      "schedulers": this.schedulers,
      "sourceBucketArn": this.sourceBucketArn,
      "startupScriptS3ObjectVersion": this.startupScriptS3ObjectVersion,
      "startupScriptS3Path": this.startupScriptS3Path,
      "tags": this.tags.renderTags(),
      "webserverAccessMode": this.webserverAccessMode,
      "weeklyMaintenanceWindowStart": this.weeklyMaintenanceWindowStart
    };
  }

  /**
   * Examines the CloudFormation resource and discloses attributes
   *
   * @param inspector tree inspector to collect and process attributes
   */
  public inspect(inspector: cdk.TreeInspector): void {
    inspector.addAttribute("aws:cdk:cloudformation:type", CfnEnvironment.CFN_RESOURCE_TYPE_NAME);
    inspector.addAttribute("aws:cdk:cloudformation:props", this.cfnProperties);
  }

  protected renderProperties(props: Record<string, any>): Record<string, any> {
    return convertCfnEnvironmentPropsToCloudFormation(props);
  }
}

export namespace CfnEnvironment {
  /**
   * The type of Apache Airflow logs to send to CloudWatch Logs.
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-loggingconfiguration.html
   */
  export interface LoggingConfigurationProperty {
    /**
     * Defines the processing logs sent to CloudWatch Logs and the logging level to send.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-loggingconfiguration.html#cfn-mwaa-environment-loggingconfiguration-dagprocessinglogs
     */
    readonly dagProcessingLogs?: cdk.IResolvable | CfnEnvironment.ModuleLoggingConfigurationProperty;

    /**
     * Defines the scheduler logs sent to CloudWatch Logs and the logging level to send.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-loggingconfiguration.html#cfn-mwaa-environment-loggingconfiguration-schedulerlogs
     */
    readonly schedulerLogs?: cdk.IResolvable | CfnEnvironment.ModuleLoggingConfigurationProperty;

    /**
     * Defines the task logs sent to CloudWatch Logs and the logging level to send.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-loggingconfiguration.html#cfn-mwaa-environment-loggingconfiguration-tasklogs
     */
    readonly taskLogs?: cdk.IResolvable | CfnEnvironment.ModuleLoggingConfigurationProperty;

    /**
     * Defines the web server logs sent to CloudWatch Logs and the logging level to send.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-loggingconfiguration.html#cfn-mwaa-environment-loggingconfiguration-webserverlogs
     */
    readonly webserverLogs?: cdk.IResolvable | CfnEnvironment.ModuleLoggingConfigurationProperty;

    /**
     * Defines the worker logs sent to CloudWatch Logs and the logging level to send.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-loggingconfiguration.html#cfn-mwaa-environment-loggingconfiguration-workerlogs
     */
    readonly workerLogs?: cdk.IResolvable | CfnEnvironment.ModuleLoggingConfigurationProperty;
  }

  /**
   * Defines the type of logs to send for the Apache Airflow log type (e.g. `DagProcessingLogs` ).
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-moduleloggingconfiguration.html
   */
  export interface ModuleLoggingConfigurationProperty {
    /**
     * The ARN of the CloudWatch Logs log group for each type of Apache Airflow log type that you have enabled.
     *
     * > `CloudWatchLogGroupArn` is available only as a return value, accessible when specified as an attribute in the [`Fn:GetAtt`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#aws-resource-mwaa-environment-return-values) intrinsic function. Any value you provide for `CloudWatchLogGroupArn` is discarded by Amazon MWAA.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-moduleloggingconfiguration.html#cfn-mwaa-environment-moduleloggingconfiguration-cloudwatchloggrouparn
     */
    readonly cloudWatchLogGroupArn?: string;

    /**
     * Indicates whether to enable the Apache Airflow log type (e.g. `DagProcessingLogs` ) in CloudWatch Logs.
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-moduleloggingconfiguration.html#cfn-mwaa-environment-moduleloggingconfiguration-enabled
     */
    readonly enabled?: boolean | cdk.IResolvable;

    /**
     * Defines the Apache Airflow logs to send for the log type (e.g. `DagProcessingLogs` ) to CloudWatch Logs. Valid values: `CRITICAL` , `ERROR` , `WARNING` , `INFO` .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-moduleloggingconfiguration.html#cfn-mwaa-environment-moduleloggingconfiguration-loglevel
     */
    readonly logLevel?: string;
  }

  /**
   * The VPC networking components used to secure and enable network traffic between the AWS resources for your environment.
   *
   * To learn more, see [About networking on Amazon MWAA](https://docs.aws.amazon.com/mwaa/latest/userguide/networking-about.html) .
   *
   * @struct
   * @stability external
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-networkconfiguration.html
   */
  export interface NetworkConfigurationProperty {
    /**
     * A list of one or more security group IDs.
     *
     * Accepts up to 5 security group IDs. A security group must be attached to the same VPC as the subnets. To learn more, see [Security in your VPC on Amazon MWAA](https://docs.aws.amazon.com/mwaa/latest/userguide/vpc-security.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-networkconfiguration.html#cfn-mwaa-environment-networkconfiguration-securitygroupids
     */
    readonly securityGroupIds?: Array<string>;

    /**
     * A list of subnet IDs.
     *
     * *Required* to create an environment. Must be private subnets in two different availability zones. A subnet must be attached to the same VPC as the security group. To learn more, see [About networking on Amazon MWAA](https://docs.aws.amazon.com/mwaa/latest/userguide/networking-about.html) .
     *
     * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-mwaa-environment-networkconfiguration.html#cfn-mwaa-environment-networkconfiguration-subnetids
     */
    readonly subnetIds?: Array<string>;
  }
}

/**
 * Properties for defining a `CfnEnvironment`
 *
 * @struct
 * @stability external
 * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html
 */
export interface CfnEnvironmentProps {
  /**
   * A list of key-value pairs containing the Airflow configuration options for your environment.
   *
   * For example, `core.default_timezone: utc` . To learn more, see [Apache Airflow configuration options](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-env-variables.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-airflowconfigurationoptions
   */
  readonly airflowConfigurationOptions?: any | cdk.IResolvable;

  /**
   * The version of Apache Airflow to use for the environment.
   *
   * If no value is specified, defaults to the latest version.
   *
   * If you specify a newer version number for an existing environment, the version update requires some service interruption before taking effect.
   *
   * *Allowed Values* : `1.10.12` | `2.0.2` | `2.2.2` | `2.4.3` | `2.5.1` | `2.6.3` | `2.7.2` (latest)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-airflowversion
   */
  readonly airflowVersion?: string;

  /**
   * The relative path to the DAGs folder on your Amazon S3 bucket.
   *
   * For example, `dags` . To learn more, see [Adding or updating DAGs](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-dag-folder.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-dags3path
   */
  readonly dagS3Path?: string;

  /**
   * Defines whether the VPC endpoints configured for the environment are created, and managed, by the customer or by Amazon MWAA.
   *
   * If set to `SERVICE` , Amazon MWAA will create and manage the required VPC endpoints in your VPC. If set to `CUSTOMER` , you must create, and manage, the VPC endpoints in your VPC.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-endpointmanagement
   */
  readonly endpointManagement?: string;

  /**
   * The environment class type.
   *
   * Valid values: `mw1.small` , `mw1.medium` , `mw1.large` . To learn more, see [Amazon MWAA environment class](https://docs.aws.amazon.com/mwaa/latest/userguide/environment-class.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-environmentclass
   */
  readonly environmentClass?: string;

  /**
   * The Amazon Resource Name (ARN) of the execution role in IAM that allows MWAA to access AWS resources in your environment.
   *
   * For example, `arn:aws:iam::123456789:role/my-execution-role` . To learn more, see [Amazon MWAA Execution role](https://docs.aws.amazon.com/mwaa/latest/userguide/mwaa-create-role.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-executionrolearn
   */
  readonly executionRoleArn?: string;

  /**
   * The AWS Key Management Service (KMS) key to encrypt and decrypt the data in your environment.
   *
   * You can use an AWS KMS key managed by MWAA, or a customer-managed KMS key (advanced).
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-kmskey
   */
  readonly kmsKey?: string;

  /**
   * The Apache Airflow logs being sent to CloudWatch Logs: `DagProcessingLogs` , `SchedulerLogs` , `TaskLogs` , `WebserverLogs` , `WorkerLogs` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-loggingconfiguration
   */
  readonly loggingConfiguration?: cdk.IResolvable | CfnEnvironment.LoggingConfigurationProperty;

  /**
   * The maximum number of workers that you want to run in your environment.
   *
   * MWAA scales the number of Apache Airflow workers up to the number you specify in the `MaxWorkers` field. For example, `20` . When there are no more tasks running, and no more in the queue, MWAA disposes of the extra workers leaving the one worker that is included with your environment, or the number you specify in `MinWorkers` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-maxworkers
   */
  readonly maxWorkers?: number;

  /**
   * The minimum number of workers that you want to run in your environment.
   *
   * MWAA scales the number of Apache Airflow workers up to the number you specify in the `MaxWorkers` field. When there are no more tasks running, and no more in the queue, MWAA disposes of the extra workers leaving the worker count you specify in the `MinWorkers` field. For example, `2` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-minworkers
   */
  readonly minWorkers?: number;

  /**
   * The name of your Amazon MWAA environment.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-name
   */
  readonly name: string;

  /**
   * The VPC networking components used to secure and enable network traffic between the AWS resources for your environment.
   *
   * To learn more, see [About networking on Amazon MWAA](https://docs.aws.amazon.com/mwaa/latest/userguide/networking-about.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-networkconfiguration
   */
  readonly networkConfiguration?: cdk.IResolvable | CfnEnvironment.NetworkConfigurationProperty;

  /**
   * The version of the plugins.zip file on your Amazon S3 bucket. To learn more, see [Installing custom plugins](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-dag-import-plugins.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-pluginss3objectversion
   */
  readonly pluginsS3ObjectVersion?: string;

  /**
   * The relative path to the `plugins.zip` file on your Amazon S3 bucket. For example, `plugins.zip` . To learn more, see [Installing custom plugins](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-dag-import-plugins.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-pluginss3path
   */
  readonly pluginsS3Path?: string;

  /**
   * The version of the requirements.txt file on your Amazon S3 bucket. To learn more, see [Installing Python dependencies](https://docs.aws.amazon.com/mwaa/latest/userguide/working-dags-dependencies.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-requirementss3objectversion
   */
  readonly requirementsS3ObjectVersion?: string;

  /**
   * The relative path to the `requirements.txt` file on your Amazon S3 bucket. For example, `requirements.txt` . To learn more, see [Installing Python dependencies](https://docs.aws.amazon.com/mwaa/latest/userguide/working-dags-dependencies.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-requirementss3path
   */
  readonly requirementsS3Path?: string;

  /**
   * The number of schedulers that you want to run in your environment. Valid values:.
   *
   * - *v2* - Accepts between 2 to 5. Defaults to 2.
   * - *v1* - Accepts 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-schedulers
   */
  readonly schedulers?: number;

  /**
   * The Amazon Resource Name (ARN) of the Amazon S3 bucket where your DAG code and supporting files are stored.
   *
   * For example, `arn:aws:s3:::my-airflow-bucket-unique-name` . To learn more, see [Create an Amazon S3 bucket for Amazon MWAA](https://docs.aws.amazon.com/mwaa/latest/userguide/mwaa-s3-bucket.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-sourcebucketarn
   */
  readonly sourceBucketArn?: string;

  /**
   * The version of the startup shell script in your Amazon S3 bucket.
   *
   * You must specify the [version ID](https://docs.aws.amazon.com/AmazonS3/latest/userguide/versioning-workflows.html) that Amazon S3 assigns to the file every time you update the script.
   *
   * Version IDs are Unicode, UTF-8 encoded, URL-ready, opaque strings that are no more than 1,024 bytes long. The following is an example:
   *
   * `3sL4kqtJlcpXroDTDmJ+rmSpXd3dIbrHY+MTRCxf3vjVBH40Nr8X8gdRQBpUMLUo`
   *
   * For more information, see [Using a startup script](https://docs.aws.amazon.com/mwaa/latest/userguide/using-startup-script.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-startupscripts3objectversion
   */
  readonly startupScriptS3ObjectVersion?: string;

  /**
   * The relative path to the startup shell script in your Amazon S3 bucket. For example, `s3://mwaa-environment/startup.sh` .
   *
   * Amazon MWAA runs the script as your environment starts, and before running the Apache Airflow process. You can use this script to install dependencies, modify Apache Airflow configuration options, and set environment variables. For more information, see [Using a startup script](https://docs.aws.amazon.com/mwaa/latest/userguide/using-startup-script.html) .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-startupscripts3path
   */
  readonly startupScriptS3Path?: string;

  /**
   * The key-value tag pairs associated to your environment. For example, `"Environment": "Staging"` . To learn more, see [Tagging](https://docs.aws.amazon.com/general/latest/gr/aws_tagging.html) .
   *
   * If you specify new tags for an existing environment, the update requires service interruption before taking effect.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-tags
   */
  readonly tags?: any;

  /**
   * The Apache Airflow *Web server* access mode.
   *
   * To learn more, see [Apache Airflow access modes](https://docs.aws.amazon.com/mwaa/latest/userguide/configuring-networking.html) . Valid values: `PRIVATE_ONLY` or `PUBLIC_ONLY` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-webserveraccessmode
   */
  readonly webserverAccessMode?: string;

  /**
   * The day and time of the week to start weekly maintenance updates of your environment in the following format: `DAY:HH:MM` .
   *
   * For example: `TUE:03:30` . You can specify a start time in 30 minute increments only. Supported input includes the following:
   *
   * - MON|TUE|WED|THU|FRI|SAT|SUN:([01]\\d|2[0-3]):(00|30)
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-mwaa-environment.html#cfn-mwaa-environment-weeklymaintenancewindowstart
   */
  readonly weeklyMaintenanceWindowStart?: string;
}

/**
 * Determine whether the given properties match those of a `ModuleLoggingConfigurationProperty`
 *
 * @param properties - the TypeScript properties of a `ModuleLoggingConfigurationProperty`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentModuleLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("cloudWatchLogGroupArn", cdk.validateString)(properties.cloudWatchLogGroupArn));
  errors.collect(cdk.propertyValidator("enabled", cdk.validateBoolean)(properties.enabled));
  errors.collect(cdk.propertyValidator("logLevel", cdk.validateString)(properties.logLevel));
  return errors.wrap("supplied properties not correct for \"ModuleLoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentModuleLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentModuleLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "CloudWatchLogGroupArn": cdk.stringToCloudFormation(properties.cloudWatchLogGroupArn),
    "Enabled": cdk.booleanToCloudFormation(properties.enabled),
    "LogLevel": cdk.stringToCloudFormation(properties.logLevel)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentModuleLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.ModuleLoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.ModuleLoggingConfigurationProperty>();
  ret.addPropertyResult("cloudWatchLogGroupArn", "CloudWatchLogGroupArn", (properties.CloudWatchLogGroupArn != null ? cfn_parse.FromCloudFormation.getString(properties.CloudWatchLogGroupArn) : undefined));
  ret.addPropertyResult("enabled", "Enabled", (properties.Enabled != null ? cfn_parse.FromCloudFormation.getBoolean(properties.Enabled) : undefined));
  ret.addPropertyResult("logLevel", "LogLevel", (properties.LogLevel != null ? cfn_parse.FromCloudFormation.getString(properties.LogLevel) : undefined));
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
function CfnEnvironmentLoggingConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("dagProcessingLogs", CfnEnvironmentModuleLoggingConfigurationPropertyValidator)(properties.dagProcessingLogs));
  errors.collect(cdk.propertyValidator("schedulerLogs", CfnEnvironmentModuleLoggingConfigurationPropertyValidator)(properties.schedulerLogs));
  errors.collect(cdk.propertyValidator("taskLogs", CfnEnvironmentModuleLoggingConfigurationPropertyValidator)(properties.taskLogs));
  errors.collect(cdk.propertyValidator("webserverLogs", CfnEnvironmentModuleLoggingConfigurationPropertyValidator)(properties.webserverLogs));
  errors.collect(cdk.propertyValidator("workerLogs", CfnEnvironmentModuleLoggingConfigurationPropertyValidator)(properties.workerLogs));
  return errors.wrap("supplied properties not correct for \"LoggingConfigurationProperty\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentLoggingConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentLoggingConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "DagProcessingLogs": convertCfnEnvironmentModuleLoggingConfigurationPropertyToCloudFormation(properties.dagProcessingLogs),
    "SchedulerLogs": convertCfnEnvironmentModuleLoggingConfigurationPropertyToCloudFormation(properties.schedulerLogs),
    "TaskLogs": convertCfnEnvironmentModuleLoggingConfigurationPropertyToCloudFormation(properties.taskLogs),
    "WebserverLogs": convertCfnEnvironmentModuleLoggingConfigurationPropertyToCloudFormation(properties.webserverLogs),
    "WorkerLogs": convertCfnEnvironmentModuleLoggingConfigurationPropertyToCloudFormation(properties.workerLogs)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentLoggingConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.LoggingConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.LoggingConfigurationProperty>();
  ret.addPropertyResult("dagProcessingLogs", "DagProcessingLogs", (properties.DagProcessingLogs != null ? CfnEnvironmentModuleLoggingConfigurationPropertyFromCloudFormation(properties.DagProcessingLogs) : undefined));
  ret.addPropertyResult("schedulerLogs", "SchedulerLogs", (properties.SchedulerLogs != null ? CfnEnvironmentModuleLoggingConfigurationPropertyFromCloudFormation(properties.SchedulerLogs) : undefined));
  ret.addPropertyResult("taskLogs", "TaskLogs", (properties.TaskLogs != null ? CfnEnvironmentModuleLoggingConfigurationPropertyFromCloudFormation(properties.TaskLogs) : undefined));
  ret.addPropertyResult("webserverLogs", "WebserverLogs", (properties.WebserverLogs != null ? CfnEnvironmentModuleLoggingConfigurationPropertyFromCloudFormation(properties.WebserverLogs) : undefined));
  ret.addPropertyResult("workerLogs", "WorkerLogs", (properties.WorkerLogs != null ? CfnEnvironmentModuleLoggingConfigurationPropertyFromCloudFormation(properties.WorkerLogs) : undefined));
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
function CfnEnvironmentNetworkConfigurationPropertyValidator(properties: any): cdk.ValidationResult {
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
function convertCfnEnvironmentNetworkConfigurationPropertyToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentNetworkConfigurationPropertyValidator(properties).assertSuccess();
  return {
    "SecurityGroupIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.securityGroupIds),
    "SubnetIds": cdk.listMapper(cdk.stringToCloudFormation)(properties.subnetIds)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentNetworkConfigurationPropertyFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<cdk.IResolvable | CfnEnvironment.NetworkConfigurationProperty> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironment.NetworkConfigurationProperty>();
  ret.addPropertyResult("securityGroupIds", "SecurityGroupIds", (properties.SecurityGroupIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SecurityGroupIds) : undefined));
  ret.addPropertyResult("subnetIds", "SubnetIds", (properties.SubnetIds != null ? cfn_parse.FromCloudFormation.getArray(cfn_parse.FromCloudFormation.getString)(properties.SubnetIds) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}

/**
 * Determine whether the given properties match those of a `CfnEnvironmentProps`
 *
 * @param properties - the TypeScript properties of a `CfnEnvironmentProps`
 *
 * @returns the result of the validation.
 */
// @ts-ignore TS6133
function CfnEnvironmentPropsValidator(properties: any): cdk.ValidationResult {
  if (!cdk.canInspect(properties)) return cdk.VALIDATION_SUCCESS;
  const errors = new cdk.ValidationResults();
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    errors.collect(new cdk.ValidationResult("Expected an object, but received: " + JSON.stringify(properties)));
  }
  errors.collect(cdk.propertyValidator("airflowConfigurationOptions", cdk.validateObject)(properties.airflowConfigurationOptions));
  errors.collect(cdk.propertyValidator("airflowVersion", cdk.validateString)(properties.airflowVersion));
  errors.collect(cdk.propertyValidator("dagS3Path", cdk.validateString)(properties.dagS3Path));
  errors.collect(cdk.propertyValidator("endpointManagement", cdk.validateString)(properties.endpointManagement));
  errors.collect(cdk.propertyValidator("environmentClass", cdk.validateString)(properties.environmentClass));
  errors.collect(cdk.propertyValidator("executionRoleArn", cdk.validateString)(properties.executionRoleArn));
  errors.collect(cdk.propertyValidator("kmsKey", cdk.validateString)(properties.kmsKey));
  errors.collect(cdk.propertyValidator("loggingConfiguration", CfnEnvironmentLoggingConfigurationPropertyValidator)(properties.loggingConfiguration));
  errors.collect(cdk.propertyValidator("maxWorkers", cdk.validateNumber)(properties.maxWorkers));
  errors.collect(cdk.propertyValidator("minWorkers", cdk.validateNumber)(properties.minWorkers));
  errors.collect(cdk.propertyValidator("name", cdk.requiredValidator)(properties.name));
  errors.collect(cdk.propertyValidator("name", cdk.validateString)(properties.name));
  errors.collect(cdk.propertyValidator("networkConfiguration", CfnEnvironmentNetworkConfigurationPropertyValidator)(properties.networkConfiguration));
  errors.collect(cdk.propertyValidator("pluginsS3ObjectVersion", cdk.validateString)(properties.pluginsS3ObjectVersion));
  errors.collect(cdk.propertyValidator("pluginsS3Path", cdk.validateString)(properties.pluginsS3Path));
  errors.collect(cdk.propertyValidator("requirementsS3ObjectVersion", cdk.validateString)(properties.requirementsS3ObjectVersion));
  errors.collect(cdk.propertyValidator("requirementsS3Path", cdk.validateString)(properties.requirementsS3Path));
  errors.collect(cdk.propertyValidator("schedulers", cdk.validateNumber)(properties.schedulers));
  errors.collect(cdk.propertyValidator("sourceBucketArn", cdk.validateString)(properties.sourceBucketArn));
  errors.collect(cdk.propertyValidator("startupScriptS3ObjectVersion", cdk.validateString)(properties.startupScriptS3ObjectVersion));
  errors.collect(cdk.propertyValidator("startupScriptS3Path", cdk.validateString)(properties.startupScriptS3Path));
  errors.collect(cdk.propertyValidator("tags", cdk.validateObject)(properties.tags));
  errors.collect(cdk.propertyValidator("webserverAccessMode", cdk.validateString)(properties.webserverAccessMode));
  errors.collect(cdk.propertyValidator("weeklyMaintenanceWindowStart", cdk.validateString)(properties.weeklyMaintenanceWindowStart));
  return errors.wrap("supplied properties not correct for \"CfnEnvironmentProps\"");
}

// @ts-ignore TS6133
function convertCfnEnvironmentPropsToCloudFormation(properties: any): any {
  if (!cdk.canInspect(properties)) return properties;
  CfnEnvironmentPropsValidator(properties).assertSuccess();
  return {
    "AirflowConfigurationOptions": cdk.objectToCloudFormation(properties.airflowConfigurationOptions),
    "AirflowVersion": cdk.stringToCloudFormation(properties.airflowVersion),
    "DagS3Path": cdk.stringToCloudFormation(properties.dagS3Path),
    "EndpointManagement": cdk.stringToCloudFormation(properties.endpointManagement),
    "EnvironmentClass": cdk.stringToCloudFormation(properties.environmentClass),
    "ExecutionRoleArn": cdk.stringToCloudFormation(properties.executionRoleArn),
    "KmsKey": cdk.stringToCloudFormation(properties.kmsKey),
    "LoggingConfiguration": convertCfnEnvironmentLoggingConfigurationPropertyToCloudFormation(properties.loggingConfiguration),
    "MaxWorkers": cdk.numberToCloudFormation(properties.maxWorkers),
    "MinWorkers": cdk.numberToCloudFormation(properties.minWorkers),
    "Name": cdk.stringToCloudFormation(properties.name),
    "NetworkConfiguration": convertCfnEnvironmentNetworkConfigurationPropertyToCloudFormation(properties.networkConfiguration),
    "PluginsS3ObjectVersion": cdk.stringToCloudFormation(properties.pluginsS3ObjectVersion),
    "PluginsS3Path": cdk.stringToCloudFormation(properties.pluginsS3Path),
    "RequirementsS3ObjectVersion": cdk.stringToCloudFormation(properties.requirementsS3ObjectVersion),
    "RequirementsS3Path": cdk.stringToCloudFormation(properties.requirementsS3Path),
    "Schedulers": cdk.numberToCloudFormation(properties.schedulers),
    "SourceBucketArn": cdk.stringToCloudFormation(properties.sourceBucketArn),
    "StartupScriptS3ObjectVersion": cdk.stringToCloudFormation(properties.startupScriptS3ObjectVersion),
    "StartupScriptS3Path": cdk.stringToCloudFormation(properties.startupScriptS3Path),
    "Tags": cdk.objectToCloudFormation(properties.tags),
    "WebserverAccessMode": cdk.stringToCloudFormation(properties.webserverAccessMode),
    "WeeklyMaintenanceWindowStart": cdk.stringToCloudFormation(properties.weeklyMaintenanceWindowStart)
  };
}

// @ts-ignore TS6133
function CfnEnvironmentPropsFromCloudFormation(properties: any): cfn_parse.FromCloudFormationResult<CfnEnvironmentProps | cdk.IResolvable> {
  if (cdk.isResolvableObject(properties)) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  properties = ((properties == null) ? {} : properties);
  if (!(properties && typeof properties == 'object' && !Array.isArray(properties))) {
    return new cfn_parse.FromCloudFormationResult(properties);
  }
  const ret = new cfn_parse.FromCloudFormationPropertyObject<CfnEnvironmentProps>();
  ret.addPropertyResult("airflowConfigurationOptions", "AirflowConfigurationOptions", (properties.AirflowConfigurationOptions != null ? cfn_parse.FromCloudFormation.getAny(properties.AirflowConfigurationOptions) : undefined));
  ret.addPropertyResult("airflowVersion", "AirflowVersion", (properties.AirflowVersion != null ? cfn_parse.FromCloudFormation.getString(properties.AirflowVersion) : undefined));
  ret.addPropertyResult("dagS3Path", "DagS3Path", (properties.DagS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.DagS3Path) : undefined));
  ret.addPropertyResult("endpointManagement", "EndpointManagement", (properties.EndpointManagement != null ? cfn_parse.FromCloudFormation.getString(properties.EndpointManagement) : undefined));
  ret.addPropertyResult("environmentClass", "EnvironmentClass", (properties.EnvironmentClass != null ? cfn_parse.FromCloudFormation.getString(properties.EnvironmentClass) : undefined));
  ret.addPropertyResult("executionRoleArn", "ExecutionRoleArn", (properties.ExecutionRoleArn != null ? cfn_parse.FromCloudFormation.getString(properties.ExecutionRoleArn) : undefined));
  ret.addPropertyResult("kmsKey", "KmsKey", (properties.KmsKey != null ? cfn_parse.FromCloudFormation.getString(properties.KmsKey) : undefined));
  ret.addPropertyResult("loggingConfiguration", "LoggingConfiguration", (properties.LoggingConfiguration != null ? CfnEnvironmentLoggingConfigurationPropertyFromCloudFormation(properties.LoggingConfiguration) : undefined));
  ret.addPropertyResult("maxWorkers", "MaxWorkers", (properties.MaxWorkers != null ? cfn_parse.FromCloudFormation.getNumber(properties.MaxWorkers) : undefined));
  ret.addPropertyResult("minWorkers", "MinWorkers", (properties.MinWorkers != null ? cfn_parse.FromCloudFormation.getNumber(properties.MinWorkers) : undefined));
  ret.addPropertyResult("name", "Name", (properties.Name != null ? cfn_parse.FromCloudFormation.getString(properties.Name) : undefined));
  ret.addPropertyResult("networkConfiguration", "NetworkConfiguration", (properties.NetworkConfiguration != null ? CfnEnvironmentNetworkConfigurationPropertyFromCloudFormation(properties.NetworkConfiguration) : undefined));
  ret.addPropertyResult("pluginsS3ObjectVersion", "PluginsS3ObjectVersion", (properties.PluginsS3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.PluginsS3ObjectVersion) : undefined));
  ret.addPropertyResult("pluginsS3Path", "PluginsS3Path", (properties.PluginsS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.PluginsS3Path) : undefined));
  ret.addPropertyResult("requirementsS3ObjectVersion", "RequirementsS3ObjectVersion", (properties.RequirementsS3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.RequirementsS3ObjectVersion) : undefined));
  ret.addPropertyResult("requirementsS3Path", "RequirementsS3Path", (properties.RequirementsS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.RequirementsS3Path) : undefined));
  ret.addPropertyResult("schedulers", "Schedulers", (properties.Schedulers != null ? cfn_parse.FromCloudFormation.getNumber(properties.Schedulers) : undefined));
  ret.addPropertyResult("sourceBucketArn", "SourceBucketArn", (properties.SourceBucketArn != null ? cfn_parse.FromCloudFormation.getString(properties.SourceBucketArn) : undefined));
  ret.addPropertyResult("startupScriptS3ObjectVersion", "StartupScriptS3ObjectVersion", (properties.StartupScriptS3ObjectVersion != null ? cfn_parse.FromCloudFormation.getString(properties.StartupScriptS3ObjectVersion) : undefined));
  ret.addPropertyResult("startupScriptS3Path", "StartupScriptS3Path", (properties.StartupScriptS3Path != null ? cfn_parse.FromCloudFormation.getString(properties.StartupScriptS3Path) : undefined));
  ret.addPropertyResult("tags", "Tags", (properties.Tags != null ? cfn_parse.FromCloudFormation.getAny(properties.Tags) : undefined));
  ret.addPropertyResult("webserverAccessMode", "WebserverAccessMode", (properties.WebserverAccessMode != null ? cfn_parse.FromCloudFormation.getString(properties.WebserverAccessMode) : undefined));
  ret.addPropertyResult("weeklyMaintenanceWindowStart", "WeeklyMaintenanceWindowStart", (properties.WeeklyMaintenanceWindowStart != null ? cfn_parse.FromCloudFormation.getString(properties.WeeklyMaintenanceWindowStart) : undefined));
  ret.addUnrecognizedPropertiesAsExtra(properties);
  return ret;
}