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
import { JobDriver, ReleaseLabel, ApplicationConfiguration, Monitoring } from './base-types';
import { ApplicationConfigPropertyToJson } from './utils/job-run-utils';

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
  readonly jobDriver?: JobDriver;

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
 * @see https://docs.amazonaws.cn/en_us/step-functions/latest/dg/connect-emr-eks.html
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
          ApplicationConfiguration: cdk.listMapper(ApplicationConfigPropertyToJson)(this.props.applicationConfig),
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
