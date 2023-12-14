import { Construct } from 'constructs';
import * as iam from '../../../aws-iam';
import * as logs from '../../../aws-logs';
import * as s3 from '../../../aws-s3';
import * as sfn from '../../../aws-stepfunctions';
import { TaskInput } from '../../../aws-stepfunctions';
import * as cdk from '../../../core';
import { RolePolicySingletonFunction } from '../../../custom-resource-handlers/dist/aws-stepfunctions-tasks/role-policy-provider.generated';
import * as cr from '../../../custom-resources';
import * as awscli from '../../../lambda-layer-awscli';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The props for a EMR Containers StartJobRun Task.
 */
export interface EmrContainersStartJobRunProps extends sfn.TaskStateBaseProps {
  /**
   * The ID of the virtual cluster where the job will be run
   */
  readonly virtualCluster: VirtualClusterInput;

  /**
   * The name of the job run.
   *
   * @default - No job run name
   */
  readonly jobName?: string;

  /**
   * The execution role for the job run.
   *
   * If `virtualClusterId` is from a JSON input path, an execution role must be provided.
   * If an execution role is provided, follow the documentation to update the role trust policy.
   * @see https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/setting-up-trust-policy.html
   *
   * @default - Automatically generated only when the provided `virtualClusterId` is not an encoded JSON path
   */
  readonly executionRole?: iam.IRole;

  /**
   * The Amazon EMR release version to use for the job run.
   */
  readonly releaseLabel: ReleaseLabel;

  /**
   * The configurations for the application running in the job run.
   *
   * Maximum of 100 items
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_Configuration.html
   *
   * @default - No application config
   */
  readonly applicationConfig?: ApplicationConfiguration[];

  /**
   * The job driver for the job run.
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_JobDriver.html
   */
  readonly jobDriver: JobDriver;

  /**
   * Configuration for monitoring the job run
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_MonitoringConfiguration.html
   *
   * @default - logging enabled and resources automatically generated if `monitoring.logging` is set to `true`
   */
  readonly monitoring?: Monitoring;

  /**
   * The tags assigned to job runs.
   *
   * @default - None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Starts a job run.
 *
 * A job is a unit of work that you submit to Amazon EMR on EKS for execution.
 * The work performed by the job can be defined by a Spark jar, PySpark script, or SparkSQL query.
 * A job run is an execution of the job on the virtual cluster.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr-eks.html
 */
export class EmrContainersStartJobRun extends sfn.TaskStateBase implements iam.IGrantable {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  public readonly grantPrincipal: iam.IPrincipal;
  private role: iam.IRole;
  private readonly logGroup?: logs.ILogGroup;
  private readonly logBucket?: s3.IBucket;
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EmrContainersStartJobRunProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.RUN_JOB;
    validatePatternSupported(this.integrationPattern, EmrContainersStartJobRun.SUPPORTED_INTEGRATION_PATTERNS);

    if (this.props.applicationConfig) {
      this.validateAppConfig(this.props.applicationConfig);
    }

    if (this.props.jobDriver.sparkSubmitJobDriver) {
      this.validateSparkSubmitJobDriver(props.jobDriver.sparkSubmitJobDriver);
    }

    if (this.props.executionRole === undefined
      && sfn.JsonPath.isEncodedJsonPath(props.virtualCluster.id)) {
      throw new Error('Execution role cannot be undefined when the virtual cluster ID is not a concrete value. Provide an execution role with the correct trust policy');
    }

    this.logGroup = this.assignLogGroup();
    this.logBucket = this.assignLogBucket();
    this.role = this.props.executionRole ?? this.createJobExecutionRole();
    this.grantPrincipal = this.role;

    this.grantMonitoringPolicies();

    this.taskPolicies = this.createPolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('emr-containers', 'startJobRun', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        VirtualClusterId: this.props.virtualCluster.id,
        Name: this.props.jobName,
        ExecutionRoleArn: this.role.roleArn,
        ReleaseLabel: this.props.releaseLabel.label,
        JobDriver: {
          SparkSubmitJobDriver: {
            EntryPoint: this.props.jobDriver.sparkSubmitJobDriver?.entryPoint.value,
            EntryPointArguments: this.props.jobDriver.sparkSubmitJobDriver?.entryPointArguments?.value,
            SparkSubmitParameters: this.props.jobDriver.sparkSubmitJobDriver?.sparkSubmitParameters,
          },
        },
        ConfigurationOverrides: {
          ApplicationConfiguration: cdk.listMapper(this.applicationConfigPropertyToJson)(this.props.applicationConfig),
          MonitoringConfiguration: {
            CloudWatchMonitoringConfiguration: this.logGroup ? {
              LogGroupName: this.logGroup.logGroupName,
              LogStreamNamePrefix: this.props.monitoring!.logStreamNamePrefix,
            } : undefined,
            PersistentAppUI: (this.props.monitoring?.persistentAppUI === false)
              ? 'DISABLED'
              : 'ENABLED',
            S3MonitoringConfiguration: this.logBucket ? {
              LogUri: this.logBucket.s3UrlForObject(),
            } : undefined,
          },
        },
        Tags: this.props.tags,
      }),
    };
  }

  /**
   * Render the EMR Containers ConfigurationProperty as JSON
   */
  private applicationConfigPropertyToJson = (property: ApplicationConfiguration) => {
    return {
      Classification: cdk.stringToCloudFormation(property.classification.classificationStatement),
      Properties: property.properties ? cdk.objectToCloudFormation(property.properties) : undefined,
      Configurations: property.nestedConfig ? cdk.listMapper(this.applicationConfigPropertyToJson)(property.nestedConfig) : undefined,
    };
  }

  private validateAppConfigPropertiesLength(appConfig: ApplicationConfiguration) {
    if (appConfig?.properties === undefined) {
      return;
    } else if (Object.keys(appConfig.properties).length > 100) {
      throw new Error(`Application configuration properties must have 100 or fewer entries. Received ${Object.keys(appConfig.properties).length}`);
    }
  }

  private validatePropertiesNestedAppConfigBothNotUndefined(appConfig: ApplicationConfiguration) {
    if (appConfig?.properties === undefined && appConfig?.nestedConfig === undefined) {
      throw new Error('Application configuration must have either properties or nested app configurations defined.');
    }
  }

  private validateAppConfig(config?: ApplicationConfiguration[]) {
    if (config === undefined) {
      return;
    } else if (config.length > 100) {
      throw new Error(`Application configuration array must have 100 or fewer entries. Received ${config.length}`);
    } else {
      config.forEach(element => this.validateAppConfig(element.nestedConfig));
      config.forEach(element => this.validateAppConfigPropertiesLength(element));
      config.forEach(element => this.validatePropertiesNestedAppConfigBothNotUndefined(element));
    }
  }

  private isArrayOfStrings(value: any): boolean {
    return Array.isArray(value) && value.every(item => typeof item === 'string');
  }

  private validateEntryPointArguments (entryPointArguments:sfn.TaskInput) {
    if (typeof entryPointArguments.value === 'string') {
      if (!sfn.JsonPath.isEncodedJsonPath(entryPointArguments.value)) {
        throw new Error('Entry point arguments must be a string array or an encoded JSON path, but received a non JSON path string');
      }
    } else if (!this.isArrayOfStrings(entryPointArguments.value)) {
      throw new Error(`Entry point arguments must be a string array or an encoded JSON path but received ${typeof entryPointArguments.value}.`);
    }
  }

  private validateEntryPointArgumentsLength (entryPointArguments:sfn.TaskInput) {
    if (this.isArrayOfStrings(entryPointArguments.value)
        && (entryPointArguments.value.length > 10280 || entryPointArguments.value.length < 1)) {
      throw new Error(`Entry point arguments must be a string array between 1 and 10280 in length. Received ${entryPointArguments.value.length}.`);
    }
  }

  private validateSparkSubmitParametersLength (sparkSubmitParameters : string) {
    if (sparkSubmitParameters.length > 102400 || sparkSubmitParameters.length < 1) {
      throw new Error(`Spark submit parameters must be between 1 and 102400 characters in length. Received ${sparkSubmitParameters.length}.`);
    }
  }
  private validateEntryPoint (entryPoint: TaskInput) {
    if (!sfn.JsonPath.isEncodedJsonPath(entryPoint.value) && (entryPoint.value.length > 256|| entryPoint.value.length < 1)) {
      throw new Error(`Entry point must be between 1 and 256 characters in length. Received ${entryPoint.value.length}.`);
    }
  }

  private validateSparkSubmitJobDriver (driver:SparkSubmitJobDriver) {
    this.validateEntryPoint(driver.entryPoint);
    if (driver.entryPointArguments) {
      this.validateEntryPointArguments(driver.entryPointArguments);
      this.validateEntryPointArgumentsLength(driver.entryPointArguments);
    }
    if (driver.sparkSubmitParameters) {
      this.validateSparkSubmitParametersLength(driver.sparkSubmitParameters);
    }
  }

  private assignLogGroup = () : any => {
    if (this.props.monitoring?.logGroup) {
      return (this.props.monitoring?.logGroup);
    } else {
      return (this.props.monitoring?.logging ? new logs.LogGroup(this, 'Monitoring Log Group') : undefined);
    }
  }

  private assignLogBucket = () : any => {
    if (this.props.monitoring?.logBucket) {
      return (this.props.monitoring?.logBucket);
    } else {
      return (this.props.monitoring?.logging ? new s3.Bucket(this, 'Monitoring Bucket') : undefined);
    }
  }

  // https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/creating-job-execution-role.html
  private createJobExecutionRole(): iam.Role {
    const jobExecutionRole = new iam.Role(this, 'Job-Execution-Role', {
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('emr-containers.amazonaws.com'),
        new iam.ServicePrincipal('states.amazonaws.com'),
      ),
    });

    this.logBucket?.grantReadWrite(jobExecutionRole);
    this.logGroup?.grantWrite(jobExecutionRole);
    this.logGroup?.grant(jobExecutionRole, 'logs:DescribeLogStreams');

    jobExecutionRole.addToPrincipalPolicy(
      new iam.PolicyStatement({
        resources: [
          cdk.Stack.of(this).formatArn({
            service: 'logs',
            resource: '*',
          }),
        ],
        actions: [
          'logs:DescribeLogGroups',
        ],
      }),
    );

    this.updateRoleTrustPolicy(jobExecutionRole);

    return jobExecutionRole;
  }
  private grantMonitoringPolicies() {

    this.logBucket?.grantReadWrite(this.role);
    this.logGroup?.grantWrite(this.role);
    this.logGroup?.grant(this.role, 'logs:DescribeLogStreams');

    this.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        resources: [
          cdk.Stack.of(this).formatArn({
            service: 'logs',
            resource: '*',
          }),
        ],
        actions: [
          'logs:DescribeLogGroups',
        ],
      }),
    );
  }

  /**
   * If an execution role is not provided by user, the automatically generated job execution role must create a trust relationship
   * between itself and the identity of the EMR managed service account in order to run jobs on the Kubernetes namespace.
   *
   * This cannot occur if the user provided virtualClusterId is within an encoded JSON path.
   *
   * The trust relationship can be created by updating the trust policy of the job execution role.
   *
   * @param role the automatically generated job execution role
   */
  private updateRoleTrustPolicy(role: iam.Role) {
    const eksClusterInfo = new cr.AwsCustomResource(this, 'GetEksClusterInfo', {
      onCreate: {
        service: 'EMRcontainers',
        action: 'describeVirtualCluster',
        parameters: {
          id: this.props.virtualCluster.id,
        },
        outputPaths: ['virtualCluster.containerProvider.info.eksInfo.namespace', 'virtualCluster.containerProvider.id'],
        physicalResourceId: cr.PhysicalResourceId.of('id'),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
      // APIs are available in 2.1055.0
      installLatestAwsSdk: false,
    });
    /* We make use of custom resources to call update-roll-trust-policy as this command is only available through
     * aws cli because this is only used during the initial setup and is not available through the sdk.
     * https://awscli.amazonaws.com/v2/documentation/api/latest/reference/emr-containers/update-role-trust-policy.html
     * Commands available through SDK: https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EMRcontainers.html
     * Commands available through CLI: https://awscli.amazonaws.com/v2/documentation/api/latest/reference/emr-containers/index.html
    */
    const cliLayer = new awscli.AwsCliLayer(this, 'awsclilayer');
    const shellCliLambda = new RolePolicySingletonFunction(this, 'Call Update-Role-Trust-Policy', {
      uuid: '8693BB64-9689-44B6-9AAF-B0CC9EB8757C',
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
      layers: [cliLayer],
    });
    shellCliLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: [
          cdk.Stack.of(this).formatArn({
            service: 'eks',
            resource: 'cluster',
            resourceName: eksClusterInfo.getResponseField('virtualCluster.containerProvider.id'),
          }),
        ],
        actions: [
          'eks:DescribeCluster',
        ],
      }),
    );
    shellCliLambda.addToRolePolicy(
      new iam.PolicyStatement({
        resources: [role.roleArn],
        actions: [
          'iam:GetRole',
          'iam:UpdateAssumeRolePolicy',
        ],
      }),
    );
    const provider = new cr.Provider(this, 'CustomResourceProvider', {
      onEventHandler: shellCliLambda,
    });
    new cdk.CustomResource(this, 'Custom Resource', {
      properties: {
        eksNamespace: eksClusterInfo.getResponseField('virtualCluster.containerProvider.info.eksInfo.namespace'),
        eksClusterId: eksClusterInfo.getResponseField('virtualCluster.containerProvider.id'),
        roleName: role.roleName,
      },
      serviceToken: provider.serviceToken,
    });
  }

  private createPolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [
      new iam.PolicyStatement({
        resources: [
          cdk.Stack.of(this).formatArn({
            arnFormat: cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
            service: 'emr-containers',
            resource: 'virtualclusters',
            resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.virtualCluster.id) ? '*' : this.props.virtualCluster.id, // Need wild card for dynamic start job run https://docs.aws.amazon.com/step-functions/latest/dg/emr-eks-iam.html
          }),
        ],
        actions: ['emr-containers:StartJobRun'],
        conditions: {
          StringEquals: {
            'emr-containers:ExecutionRoleArn': this.role.roleArn,
          },
        },
      }),
    ];

    if (this.integrationPattern === sfn.IntegrationPattern.RUN_JOB) {
      policyStatements.push(
        new iam.PolicyStatement({
          resources: [
            cdk.Stack.of(this).formatArn({
              arnFormat: cdk.ArnFormat.SLASH_RESOURCE_SLASH_RESOURCE_NAME,
              service: 'emr-containers',
              resource: 'virtualclusters',
              resourceName: sfn.JsonPath.isEncodedJsonPath(this.props.virtualCluster.id) ? '*' : `${this.props.virtualCluster.id}/jobruns/*`, // Need wild card for dynamic start job run https://docs.aws.amazon.com/step-functions/latest/dg/emr-eks-iam.html
            }),
          ],
          actions: [
            'emr-containers:DescribeJobRun',
            'emr-containers:CancelJobRun',
          ],
        }),
      );
    }

    return policyStatements;
  }
}

/**
 * The information about job driver for Spark submit.
 */
export interface SparkSubmitJobDriver {
  /**
   * The entry point of job application.
   *
   * Length Constraints: Minimum length of 1. Maximum length of 256.
   */
  readonly entryPoint: sfn.TaskInput;

  /**
   * The arguments for a job application in a task input object containing an array of strings
   *
   * Length Constraints: Minimum length of 1. Maximum length of 10280.
   * @type sfn.TaskInput which expects payload as an array of strings
   *
   * @default - No arguments defined
   */
  readonly entryPointArguments?: sfn.TaskInput;

  /**
   * The Spark submit parameters that are used for job runs.
   *
   * Length Constraints: Minimum length of 1. Maximum length of 102400.
   *
   * @default - No spark submit parameters
   */
  readonly sparkSubmitParameters?: string;
}

/**
 * Specify the driver that the EMR Containers job runs on.
 * The job driver is used to provide an input for the job that will be run.
 */
export interface JobDriver {
  /**
   * The job driver parameters specified for spark submit.
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_SparkSubmitJobDriver.html
   *
   */
  readonly sparkSubmitJobDriver: SparkSubmitJobDriver;
}

/**
 * The classification within a EMR Containers application configuration.
 * Class can be extended to add other classifications.
 * For example, new Classification('xxx-yyy');
 */
export class Classification {
  /**
   * Sets the maximizeResourceAllocation property to true or false.
   * When true, Amazon EMR automatically configures spark-defaults properties based on cluster hardware configuration.
   *
   * For more info:
   * @see https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark-configure.html#emr-spark-maximizeresourceallocation
   */
  static readonly SPARK = new Classification('spark');

  /**
   * Sets values in the spark-defaults.conf file.
   *
   * For more info:
   * @see https://spark.apache.org/docs/latest/configuration.html
   */
  static readonly SPARK_DEFAULTS = new Classification('spark-defaults');

  /**
   * Sets values in the spark-env.sh file.
   *
   * For more info:
   * @see https://spark.apache.org/docs/latest/configuration.html#environment-variables
   */
  static readonly SPARK_ENV = new Classification('spark-env');

  /**
   * Sets values in the hive-site.xml for Spark.
   */
  static readonly SPARK_HIVE_SITE = new Classification('spark-hive-site');

  /**
   * Sets values in the log4j.properties file.
   *
   * For more settings and info:
   * @see https://github.com/apache/spark/blob/master/conf/log4j.properties.template
   */
  static readonly SPARK_LOG4J = new Classification('spark-log4j');

  /**
   * Sets values in the metrics.properties file.
   *
   * For more settings and info:
   * @see https://github.com/apache/spark/blob/master/conf/metrics.properties.template
   */
  static readonly SPARK_METRICS = new Classification('spark-metrics');

  /**
   * Creates a new Classification
   *
   * @param classificationStatement A literal string in case a new EMR classification is released, if not already defined.
   */
  constructor(public readonly classificationStatement: string) { }
}

/**
 * A configuration specification to be used when provisioning virtual clusters,
 * which can include configurations for applications and software bundled with Amazon EMR on EKS.
 *
 * A configuration consists of a classification, properties, and optional nested configurations.
 * A classification refers to an application-specific configuration file.
 * Properties are the settings you want to change in that file.
 * @see https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-configure-apps.html
 */
export interface ApplicationConfiguration {
  /**
   * The classification within a configuration.
   *
   * Length Constraints: Minimum length of 1. Maximum length of 1024.
   */
  readonly classification: Classification;

  /**
   * A list of additional configurations to apply within a configuration object.
   *
   * Array Members: Maximum number of 100 items.
   *
   * @default - No other configurations
   */
  readonly nestedConfig?: ApplicationConfiguration[];

  /**
   * A set of properties specified within a configuration classification.
   *
   * Map Entries: Maximum number of 100 items.
   *
   * @default - No properties
   */
  readonly properties?: { [key: string]: string };
}

/**
 * Configuration setting for monitoring.
 */
export interface Monitoring {
  /**
   * Enable logging for this job.
   *
   * If set to true, will automatically create a Cloudwatch Log Group and S3 bucket.
   * This will be set to `true` implicitly if values are provided for `logGroup` or `logBucket`.
   *
   * @default true - true if values are provided for `logGroup` or `logBucket`, false otherwise
   */
  readonly logging?: boolean

  /**
   * A log group for CloudWatch monitoring.
   *
   * You can configure your jobs to send log information to CloudWatch Logs.
   *
   * @default - if `logging` is manually set to `true` and a `logGroup` is not provided, a `logGroup` will be automatically generated`.
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * A log stream name prefix for Cloudwatch monitoring.
   *
   * @default - Log streams created in this log group have no default prefix
   */
  readonly logStreamNamePrefix?: string;

  /**
   * Amazon S3 Bucket for monitoring log publishing.
   *
   * You can configure your jobs to send log information to Amazon S3.
   *
   * @default - if `logging` is manually set to `true` and a `logBucket` is not provided, a `logBucket` will be automatically generated`.
   */
  readonly logBucket?: s3.IBucket;

  /**
   * Monitoring configurations for the persistent application UI.
   *
   * @default true
   */
  readonly persistentAppUI?: boolean;
}

/**
 * The Amazon EMR release version to use for the job run.
 *
 * Can be extended to include new EMR releases
 *
 * For example, `new ReleaseLabel('emr-x.xx.x-latest');`
 */
export class ReleaseLabel {
  /**
   * EMR Release version 5.32.0
   */
  static readonly EMR_5_32_0 = new ReleaseLabel('emr-5.32.0-latest');

  /**
   * EMR Release version 5.33.0
   */
  static readonly EMR_5_33_0 = new ReleaseLabel('emr-5.33.0-latest');

  /**
   * EMR Release version 6.2.0
   */
  static readonly EMR_6_2_0 = new ReleaseLabel('emr-6.2.0-latest');

  /**
   * EMR Release version 6.3.0
   */
  static readonly EMR_6_3_0 = new ReleaseLabel('emr-6.3.0-latest');

  /**
   * Initializes the label string.
   *
   * @param label A literal string that contains the release-version ex. 'emr-x.x.x-latest'
   */
  constructor(public readonly label: string) { }
}

/**
 * Class that returns a virtual cluster's id depending on input type
 */
export class VirtualClusterInput {
  /**
   * Input for a virtualClusterId from a Task Input
   */
  static fromTaskInput(taskInput: sfn.TaskInput): VirtualClusterInput {
    return new VirtualClusterInput(taskInput.value);
  }

  /**
   * Input for virtualClusterId from a literal string
   */
  static fromVirtualClusterId(virtualClusterId: string): VirtualClusterInput {
    return new VirtualClusterInput(virtualClusterId);
  }

  /**
   * Initializes the virtual cluster ID.
   *
   * @param id The VirtualCluster Id
   */
  private constructor(public readonly id: string) { }
}
