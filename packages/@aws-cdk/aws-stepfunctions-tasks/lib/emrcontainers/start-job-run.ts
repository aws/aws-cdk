import * as iam from '@aws-cdk/aws-iam';
import * as lambda from '@aws-cdk/aws-lambda';
import * as logs from '@aws-cdk/aws-logs';
import * as s3 from '@aws-cdk/aws-s3';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import * as cdk from '@aws-cdk/core';
import * as cr from '@aws-cdk/custom-resources';
import * as awscli from '@aws-cdk/lambda-layer-awscli';
import { Construct } from 'constructs';
import { integrationResourceArn, validatePatternSupported } from '../private/task-utils';

/**
 * The props for a EMR Containers StartJobRun Task.
 */
export interface EmrContainersStartJobRunProps extends sfn.TaskStateBaseProps {

  /**
   * The virtual cluster ID for which the job run request is submitted.
   */
  readonly virtualClusterId: sfn.TaskInput;

  /**
   * The name of the job run.
   *
   * @default - No job name
   */
  readonly jobName?: string;

  /**
   * The execution role for the job run.
   *
   * @default - Automatically generated
   */
  readonly executionRole?: iam.IRole;

  /**
   * The Amazon EMR release version to use for the job run.
   *
   * @example - ReleaseLabel.EMR_6_3_0
   */
  readonly releaseLabel: ReleaseLabel;

  /**
   * The configurations for the application running by the job run.
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
   *
   * @default - No job driver
   */
  readonly jobDriver: JobDriver;

  /**
   * The configurations for monitoring.
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_MonitoringConfiguration.html
   *
   * @default - Automatically generated if monitoring.logging is set to true
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
 * Starts a job run. A job run is a unit of work, such as a Spark jar, PySpark script, or SparkSQL query,
 * that you submit to Amazon EMR on EKS.
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-emr-eks.html
 */
export class EmrContainersStartJobRun extends sfn.TaskStateBase {
  private static readonly SUPPORTED_INTEGRATION_PATTERNS: sfn.IntegrationPattern[] = [
    sfn.IntegrationPattern.REQUEST_RESPONSE,
    sfn.IntegrationPattern.RUN_JOB,
  ];

  protected readonly taskMetrics?: sfn.TaskMetricsConfig;
  protected readonly taskPolicies?: iam.PolicyStatement[];

  protected role: iam.IRole;
  private readonly integrationPattern: sfn.IntegrationPattern;

  constructor(scope: Construct, id: string, private readonly props: EmrContainersStartJobRunProps) {
    super(scope, id, props);
    this.integrationPattern = props.integrationPattern ?? sfn.IntegrationPattern.RUN_JOB;

    validatePatternSupported(this.integrationPattern, EmrContainersStartJobRun.SUPPORTED_INTEGRATION_PATTERNS);

    // validate application config size
    if (props.applicationConfig && props.applicationConfig.length > 100) {
      throw new Error(`Application configuration must be 100 or less. Received ${props.applicationConfig.length}.`);
    }

    // validate spark submit driver entry point size
    cdk.withResolved(props.jobDriver.sparkSubmitJobDriver?.entryPoint, (entryPoint) => {
      if (entryPoint !== undefined && !sfn.JsonPath.isEncodedJsonPath(entryPoint.value)
        && (entryPoint.value.length > 256 || entryPoint.value.length < 1)) {
        throw new Error(`Entry point must be greater than 0 and 256 or less in length. Received ${entryPoint.value.length}.`);
      }
    });

    // validate spark submit driver entry point arguments size
    cdk.withResolved(props.jobDriver.sparkSubmitJobDriver?.entryPointArguments, (entryPointArgs) => {
      if (entryPointArgs !== undefined && !sfn.JsonPath.isEncodedJsonPath(entryPointArgs.value)
        && (entryPointArgs.value.length > 10280 || entryPointArgs.value.length < 1)) {
        throw new Error(`Entry point arguments must be greater than 0 and 10280 or less in length. Received ${entryPointArgs.value.length}.`);
      }
    });

    // validate spark submit parameters size
    if (props.jobDriver.sparkSubmitJobDriver?.sparkSubmitParameters
      && (props.jobDriver.sparkSubmitJobDriver.sparkSubmitParameters.length > 102400
        || props.jobDriver.sparkSubmitJobDriver.sparkSubmitParameters.length < 1)) {
      throw new Error(`Spark submit parameters must be greater than 0 and 102400 or less in length.
       Received ${props.jobDriver.sparkSubmitJobDriver.sparkSubmitParameters.length}.`);
    }


    this.role = this.props.executionRole || this.createJobExecutionRole();
    this.taskPolicies = this.createPolicyStatements();
  }

  /**
   * @internal
   */
  protected _renderTask(): any {
    return {
      Resource: integrationResourceArn('emr-containers', 'startJobRun', this.integrationPattern),
      Parameters: sfn.FieldUtils.renderObject({
        VirtualClusterId: this.props.virtualClusterId.value,
        Name: this.props.jobName,
        ExecutionRoleArn: this.role.roleArn,
        ReleaseLabel: this.props.releaseLabel.label,
        JobDriver: {
          SparkSubmitJobDriver: {
            EntryPoint: this.props.jobDriver?.sparkSubmitJobDriver?.entryPoint.value,
            EntryPointArguments: this.props.jobDriver?.sparkSubmitJobDriver?.entryPointArguments?.value,
            SparkSubmitParameters: this.props.jobDriver?.sparkSubmitJobDriver?.sparkSubmitParameters,
          },
        },
        ConfigurationOverrides: {
          ApplicationConfiguration: cdk.listMapper(this.ApplicationConfigPropertyToJson)(this.props.applicationConfig),
          MonitoringConfiguration: {
            CloudWatchMonitoringConfiguration: {
              LogGroupName: (this.props.monitoring?.logging === true)
                ? this.renderLogGroupName() // automatically generated name https://docs.aws.amazon.com/cdk/api/latest/typescript/api/aws-logs/loggroup.html#aws_logs_LogGroup_synopsis
                : this.props.monitoring?.logGroup?.logGroupName,
              LogStreamNamePrefix: this.props.monitoring?.logStreamNamePrefix,
            },
            PersistentAppUI: (this.props.monitoring?.persistentAppUI === false)
              ? 'DISABLED'
              : 'ENABLED',
            S3MonitoringConfiguration: {
              LogUri: (this.props.monitoring?.logging === true)
                ? `s3://${this.renderS3BucketName()}`// automatically generated name https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-s3.Bucket.html#bucketname
                : `s3://${this.props.monitoring?.logBucket?.bucketName}`,
            },
          },
          Tags: this.props.tags ? this.renderTags(this.props.tags) : undefined,
        },
      }),
    };
  }


  /**
   * Render the EMR Containers ConfigurationProperty as JSON
   *
   * @param property
   */
  private ApplicationConfigPropertyToJson(property: ApplicationConfiguration) {
    return {
      Classification: cdk.stringToCloudFormation(property.classification.classificationStatement),
      Properties: cdk.objectToCloudFormation(property.properties),
      Configurations: cdk.listMapper(this.ApplicationConfigPropertyToJson)(property.nestedConfig),
    };
  }

  private renderTags(tags: { [key: string]: any } | undefined): { [key: string]: any } {
    return tags ? { Tags: Object.keys(tags).map((key) => ({ Key: key, Value: tags[key] })) } : {};
  }

  /**
   * Creates a Cloudwatch log group
   *
   * @returns name if user enables props.monitoring.logging to be true
   **/
  private renderLogGroupName(): string {
    return new logs.LogGroup(this, 'Emr Containers Default Cloudwatch Log Group').logGroupName;
  }

  /**
   * Creates a S3 bucket
   *
   * @returns an automatically generated bucket name
   **/
  private renderS3BucketName(): string {
    return new s3.Bucket(this, 'Emr Containers Default S3 Bucket').bucketName;
  }

  // https://docs.aws.amazon.com/emr/latest/EMR-on-EKS-DevelopmentGuide/creating-job-execution-role.html
  private createJobExecutionRole(): iam.Role {
    let jobExecutionRole: iam.Role = new iam.Role(this, 'Job-Execution-Role', {
      assumedBy: new iam.ServicePrincipal('emr-containers.amazonaws.com'),
    });

    // allow job-execution-role to be used by Step Functions
    jobExecutionRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        principals: [new iam.ServicePrincipal('states.amazonaws.com')],
      }),
    );

    jobExecutionRole.addManagedPolicy(
      new iam.ManagedPolicy(this, 'Emr Containers Managing Virtual Clusters Policies', {
        statements: [
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              'emr-containers:CreateVirtualCluster',
              'emr-containers:DeleteVirtualCluster',
              'emr-containers:DescribeVirtualCluster',
              'emr-containers:ListVirtualClusters',
            ],
          }),
        ],
      }),
    );

    jobExecutionRole.addManagedPolicy(
      new iam.ManagedPolicy(this, 'Emr Containers S3 and Log Policies', {
        statements: [
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              's3:PutObject',
              's3:GetObject',
              's3:ListBucket',
            ],
          }),
          new iam.PolicyStatement({
            resources: ['arn:aws:logs:*:*:*'],
            actions: [
              'logs:PutLogEvents',
              'logs:CreateLogStream',
              'logs:DescribeLogGroups',
              'logs:DescribeLogStreams',
            ],
          }),
        ],
      }),
    );

    jobExecutionRole.addManagedPolicy(
      new iam.ManagedPolicy(this, 'Emr Containers Job Run Policy', {
        statements: [
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              'emr-containers:StartJobRun',
              'emr-containers:ListJobRuns',
              'emr-containers:DescribeJobRun',
              'emr-containers:CancelJobRun',
            ],
          }),
        ],
      }),
    );

    jobExecutionRole.addManagedPolicy(
      new iam.ManagedPolicy(this, 'Emr Containers Monitoring Policy', {
        statements: [
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              'emr-containers:DescribeJobRun',
              'elasticmapreduce:CreatePersistentAppUI',
              'elasticmapreduce:DescribePersistentAppUI',
              'elasticmapreduce:GetPersistentAppUIPresignedURL',
            ],
          }),
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              's3:GetObject',
              's3:ListBucket',
            ],
          }),
          new iam.PolicyStatement({
            resources: ['*'],
            actions: [
              'logs:Get*',
              'logs:DescribeLogGroups',
              'logs:DescribeLogStreams',
            ],
          }),
        ],
      }),
    );

    this.updateRoleTrustPolicy(jobExecutionRole.roleName);

    return jobExecutionRole;
  }

  /**
   * Creates custom resources that call describeJobRun and executes an lambda
   * that calls update-role-trust-policy using the inputs.
   *
   * @param roleName - provided from automatically generated name
   */
  private updateRoleTrustPolicy(roleName: string) {

    // first create a custom resource to retrieve the eks namespace and eks cluster output from describe virtual cluster
    const descVirtClust = new cr.AwsCustomResource(this, 'EMR Containers DescribeVirtualCluster SDK caller', {
      onCreate: {
        service: 'EMRcontainers',
        action: 'describeVirtualCluster',
        parameters: {
          id: this.props.virtualClusterId.value,
        },
        outputPaths: ['virtualCluster.containerProvider.info.eksInfo.namespace', 'virtualCluster.containerProvider.id'],
        physicalResourceId: cr.PhysicalResourceId.of('id'),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE,
      }),
    });

    // next use the awscli within the lambda layer to call update-role-trust-policy using the eks namespace and eks clusterId
    const cliLayer = new awscli.AwsCliLayer(this, 'awsclilayer');
    const shellCliLambda = new lambda.SingletonFunction(this, 'Call Update-Role-Trust-Policy', {
      uuid: this.renderSingletonUuid(roleName), // ensures a random uuid for a singleton function
      runtime: lambda.Runtime.PYTHON_3_6,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('../../lib/emrcontainers/utils/role-policy'),
      timeout: cdk.Duration.minutes(1),
      environment: {
        eksNamespace: descVirtClust.getResponseField('virtualCluster.containerProvider.info.eksInfo.namespace'),
        eksClusterId: descVirtClust.getResponseField('virtualCluster.containerProvider.id'),
        roleName: roleName,
      },
      initialPolicy: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: [
            'eks:DescribeCluster',
            'iam:GetRole',
            'iam:UpdateAssumeRolePolicy',
          ],
        }),
      ],
      layers: [cliLayer],
    });
    shellCliLambda.addPermission('Permission for Update-Role-Trust-Policy', {
      principal: new iam.ServicePrincipal('emr-containers.amazonaws.com'),
    },
    );

    const provider = new cr.Provider(this, 'CustomResourceProvider', {
      onEventHandler: shellCliLambda,
    });
    new cdk.CustomResource(this, 'Custom Resource', {
      serviceToken: provider.serviceToken,
    });
  }

  /**
   * Generates a UUID for a lambda singleton for update-role-trust-policy
   *
   * @param roleName generated from Names.uniqueId by the CDK IAM Role ensuring uniqueness
   **/
  private renderSingletonUuid(roleName: string) {
    let uuid = '8693BB64-9689-44B6-9AAF-B0CC9EB8756C';

    uuid += `-${roleName}`;

    return uuid;
  }


  private createPolicyStatements(): iam.PolicyStatement[] {
    const policyStatements = [
      new iam.PolicyStatement({
        resources: [
          cdk.Stack.of(this).formatArn({
            service: 'emr-containers',
            resource: 'virtualclusters',
            resourceName: '*', // Need wild card for dynamic start job run https://docs.aws.amazon.com/step-functions/latest/dg/emr-eks-iam.html
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
              service: 'emr-containers',
              resource: 'virtualclusters',
              resourceName: '*', // Need wild card for dynamic start job run https://docs.aws.amazon.com/step-functions/latest/dg/emr-eks-iam.html
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
   * Length Constraints: Minimum length of 1. Maximum length of 256.
   *
   * @default - No entry point
   */
  readonly entryPoint: sfn.TaskInput;

  /**
   * The arguments for job application.
   * Length Constraints: Minimum length of 1. Maximum length of 10280.
   *
   * @default - No arguments defined
   */
  readonly entryPointArguments?: sfn.TaskInput;

  /**
   * The Spark submit parameters that are used for job runs.
   * Length Constraints: Minimum length of 1. Maximum length of 102400.
   *
   * @default - No spark submit parameters
   */
  readonly sparkSubmitParameters?: string;
}

/**
 * Specify the driver that the EMR Containers job runs on.
 */
export interface JobDriver {

  /**
   * The job driver parameters specified for spark submit.
   *
   * @see https://docs.aws.amazon.com/emr-on-eks/latest/APIReference/API_SparkSubmitJobDriver.html
   *
   * @default - No spark submit job driver parameters specified.
   */
  readonly sparkSubmitJobDriver?: SparkSubmitJobDriver;
}

/**
 * The classification within a EMR Containers application configuration.
 * Class can be extended to add other classifications.
 * @example - class Example extends Classification { static configExample = new Example('xxxx-xxxx')}
 */
export class Classification {

  /**
   * Sets the maximizeResourceAllocation property to true or false.
   * When true, Amazon EMR automatically configures spark-defaults properties based on cluster hardware configuration.
   *
   * For more info:
   * @see https://docs.aws.amazon.com/emr/latest/ReleaseGuide/emr-spark-configure.html#emr-spark-maximizeresourceallocation
   *
   * @returns 'spark'
   */
  static CONFIG_SPARK = new Classification('spark');

  /**
   * Sets values in the spark-defaults.conf file.
   *
   * For more info:
   * @see https://spark.apache.org/docs/latest/configuration.html
   *
   * @returns 'spark-defaults'
   */
  static CONFIG_SPARK_DEFAULTS = new Classification('spark-defaults');

  /**
   * Sets values in the spark-env.sh file.
   *
   * For more info:
   * @see https://spark.apache.org/docs/latest/configuration.html#environment-variables
   *
   * @returns 'spark-env'
   */
  static CONFIG_SPARK_ENV = new Classification('spark-env');

  /**
   * Sets values in the hive-site.xml for Spark.
   *
   * @returns 'spark-hive-site'
   */
  static CONFIG_SPARK_HIVE_SITE = new Classification('spark-hive-site');

  /**
   * Sets values in the log4j.properties file.
   *
   * For more settings and info:
   * @see https://github.com/apache/spark/blob/master/conf/log4j.properties.template
   *
   * @returns 'spark-log4j'
   */
  static CONFIG_SPARK_LOG4J = new Classification('spark-log4j');

  /**
   * Sets values in the metrics.properties file.
   *
   * For more settings and info:
   * @see https://github.com/apache/spark/blob/master/conf/metrics.properties.template
   *
   * @returns 'spark-metrics'
   */
  static CONFIG_SPARK_METRICS = new Classification('spark-metrics');

  /**
   * Creates a new Classification, can be extended to support a classification
   *
   * @param classificationStatement A literal string in case a new EMR classification is released, if not already defined.
   */
  constructor(public readonly classificationStatement: string) { }
}

/**
 * A configuration specification to be used when provisioning virtual clusters,
 * which can include configurations for applications and software bundled with Amazon EMR on EKS.
 * A configuration consists of a classification, properties, and optional nested configurations.
 * A classification refers to an application-specific configuration file.
 * Properties are the settings you want to change in that file.
 */
export interface ApplicationConfiguration {

  /**
   * The classification within a configuration.
   * Length Constraints: Minimum length of 1. Maximum length of 1024.
   */
  readonly classification: Classification;

  /**
   * A list of additional configurations to apply within a configuration object.
   * Array Members: Maximum number of 100 items.
   *
   * @default - No other configurations
   */
  readonly nestedConfig?: ApplicationConfiguration[];

  /**
   * A set of properties specified within a configuration classification.
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
   * @default false - logging is enabled by providing values for `logGroup` or `logBucket`
   */
  readonly logging?: boolean

  /**
   * A log group for CloudWatch monitoring.
   * You can configure your jobs to send log information to CloudWatch Logs.
   *
   * @default - Automatically generated
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
   * You can configure your jobs to send log information to Amazon S3.
   *
   * @default - Automatically generated
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
 * Can be extended to include new EMR releases
 *
 * @example class Example extends ReleaseLabel { static EMR_X_XX_X = new Example('emr-x.xx.x-latest')}
 */
export class ReleaseLabel {

  /**
   * EMR Release version 5.32.0
   *
   * @returns 'emr-5.32.0-latest'
   */
  static readonly EMR_5_32_0 = new ReleaseLabel('emr-5.32.0-latest');

  /**
   * EMR Release version 5.33.0
   *
   * @returns 'emr-5.33.0-latest'
   */
  static readonly EMR_5_33_0 = new ReleaseLabel('emr-5.33.0-latest');

  /**
   * EMR Release version 6.2.0
   *
   * @returns 'emr-6.2.0-latest'
   */
  static readonly EMR_6_2_0 = new ReleaseLabel('emr-6.2.0-latest');

  /**
   * EMR Release version 6.3.0
   *
   * @returns 'emr-6.3.0-latest'
   */
  static readonly EMR_6_3_0 = new ReleaseLabel('emr-6.3.0-latest');

  /**
   * Initializes the label string, can be extended in case a new EMR Release occurs
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
   *
   * @param taskInput Task Input that contains a virtualClusterId.
   * @returns a Task Input's value - typically a literal string or path that contains the virtualClusterId.
   */
  static fromTaskInput(taskInput: sfn.TaskInput): VirtualClusterInput {
    return new VirtualClusterInput(taskInput.value);
  }

  /**
   * Input for virtualClusterId from a literal string
   *
   * @param virtualClusterId literal string containing the virtualClusterId
   * @returns the virtualClusterId
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

