import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Duration, Stack, withResolved } from '@aws-cdk/core';
import { getResourceArn } from '../resource-arn-suffix';

/**
 * The overrides that should be sent to a container.
 */
export interface ContainerOverrides {
  /**
   * The command to send to the container that overrides
   * the default command from the Docker image or the job definition.
   *
   * @default - No command overrides
   */
  readonly command?: string[];

  /**
   * The environment variables to send to the container.
   * You can add new environment variables, which are added to the container
   * at launch, or you can override the existing environment variables from
   * the Docker image or the job definition.
   *
   * @default - No environment overrides
   */
  readonly environment?: { [key: string]: string };

  /**
   * The instance type to use for a multi-node parallel job.
   * This parameter is not valid for single-node container jobs.
   *
   * @default - No instance type overrides
   */
  readonly instanceType?: ec2.InstanceType;

  /**
   * The number of MiB of memory reserved for the job.
   * This value overrides the value set in the job definition.
   *
   * @default - No memory overrides
   */
  readonly memory?: number;

  /**
   * The number of physical GPUs to reserve for the container.
   * The number of GPUs reserved for all containers in a job
   * should not exceed the number of available GPUs on the compute
   * resource that the job is launched on.
   *
   * @default - No GPU reservation
   */
  readonly gpuCount?: number;

  /**
   * The number of vCPUs to reserve for the container.
   * This value overrides the value set in the job definition.
   *
   * @default - No vCPUs overrides
   */
  readonly vcpus?: number;
}

/**
 * An object representing an AWS Batch job dependency.
 */
export interface JobDependency {
  /**
   * The job ID of the AWS Batch job associated with this dependency.
   *
   * @default - No jobId
   */
  readonly jobId?: string;

  /**
   * The type of the job dependency.
   *
   * @default - No type
   */
  readonly type?: string;
}

/**
 * Properties for RunBatchJob
 *
 * @deprecated use `BatchSubmitJob`
 */
export interface RunBatchJobProps {
  /**
   * The arn of the job definition used by this job.
   */
  readonly jobDefinitionArn: string;

  /**
   * The name of the job.
   * The first character must be alphanumeric, and up to 128 letters (uppercase and lowercase),
   * numbers, hyphens, and underscores are allowed.
   */
  readonly jobName: string;

  /**
   * The arn of the job queue into which the job is submitted.
   */
  readonly jobQueueArn: string;

  /**
   * The array size can be between 2 and 10,000.
   * If you specify array properties for a job, it becomes an array job.
   * For more information, see Array Jobs in the AWS Batch User Guide.
   *
   * @default - No array size
   */
  readonly arraySize?: number;

  /**
   * A list of container overrides in JSON format that specify the name of a container
   * in the specified job definition and the overrides it should receive.
   *
   * @see https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html#Batch-SubmitJob-request-containerOverrides
   *
   * @default - No container overrides
   */
  readonly containerOverrides?: ContainerOverrides;

  /**
   * A list of dependencies for the job.
   * A job can depend upon a maximum of 20 jobs.
   *
   * @see https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html#Batch-SubmitJob-request-dependsOn
   *
   * @default - No dependencies
   */
  readonly dependsOn?: JobDependency[];

  /**
   * The payload to be passed as parametrs to the batch job
   *
   * @default - No parameters are passed
   */
  readonly payload?: { [key: string]: any };

  /**
   * The number of times to move a job to the RUNNABLE status.
   * You may specify between 1 and 10 attempts.
   * If the value of attempts is greater than one,
   * the job is retried on failure the same number of attempts as the value.
   *
   * @default - 1
   */
  readonly attempts?: number;

  /**
   * The timeout configuration for this SubmitJob operation.
   * The minimum value for the timeout is 60 seconds.
   *
   * @see https://docs.aws.amazon.com/batch/latest/APIReference/API_SubmitJob.html#Batch-SubmitJob-request-timeout
   *
   * @default - No timeout
   */
  readonly timeout?: Duration;

  /**
   * The service integration pattern indicates different ways to call TerminateCluster.
   *
   * The valid value is either FIRE_AND_FORGET or SYNC.
   *
   * @default SYNC
   */
  readonly integrationPattern?: sfn.ServiceIntegrationPattern;
}

/**
 * A Step Functions Task to run AWS Batch
 *
 * @deprecated use `BatchSubmitJob`
 */
export class RunBatchJob implements sfn.IStepFunctionsTask {
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: RunBatchJobProps) {
    // validate integrationPattern
    this.integrationPattern =
      props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC,
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(
        `Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call RunBatchJob.`,
      );
    }

    // validate arraySize limits
    withResolved(props.arraySize, (arraySize) => {
      if (arraySize !== undefined && (arraySize < 2 || arraySize > 10_000)) {
        throw new Error(`arraySize must be between 2 and 10,000. Received ${arraySize}.`);
      }
    });

    // validate dependency size
    if (props.dependsOn && props.dependsOn.length > 20) {
      throw new Error(`dependencies must be 20 or less. Received ${props.dependsOn.length}.`);
    }

    // validate attempts
    withResolved(props.attempts, (attempts) => {
      if (attempts !== undefined && (attempts < 1 || attempts > 10)) {
        throw new Error(`attempts must be between 1 and 10. Received ${attempts}.`);
      }
    });

    // validate timeout
    props.timeout !== undefined && withResolved(props.timeout.toSeconds(), (timeout) => {
      if (timeout < 60) {
        throw new Error(`timeout must be greater than 60 seconds. Received ${timeout} seconds.`);
      }
    });

    // This is reuqired since environment variables must not start with AWS_BATCH;
    // this naming convention is reserved for variables that are set by the AWS Batch service.
    if (props.containerOverrides?.environment) {
      Object.keys(props.containerOverrides.environment).forEach(key => {
        if (key.match(/^AWS_BATCH/)) {
          throw new Error(
            `Invalid environment variable name: ${key}. Environment variable names starting with 'AWS_BATCH' are reserved.`,
          );
        }
      });
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn(
        'batch',
        'submitJob',
        this.integrationPattern,
      ),
      policyStatements: this.configurePolicyStatements(_task),
      parameters: {
        JobDefinition: this.props.jobDefinitionArn,
        JobName: this.props.jobName,
        JobQueue: this.props.jobQueueArn,
        Parameters: this.props.payload,

        ArrayProperties:
          this.props.arraySize !== undefined
            ? { Size: this.props.arraySize }
            : undefined,

        ContainerOverrides: this.props.containerOverrides
          ? this.configureContainerOverrides(this.props.containerOverrides)
          : undefined,

        DependsOn: this.props.dependsOn
          ? this.props.dependsOn.map(jobDependency => ({
            JobId: jobDependency.jobId,
            Type: jobDependency.type,
          }))
          : undefined,

        RetryStrategy:
          this.props.attempts !== undefined
            ? { Attempts: this.props.attempts }
            : undefined,

        Timeout: this.props.timeout
          ? { AttemptDurationSeconds: this.props.timeout.toSeconds() }
          : undefined,
      },
    };
  }

  private configurePolicyStatements(task: sfn.Task): iam.PolicyStatement[] {
    return [
      // Resource level access control for job-definition requires revision which batch does not support yet
      // Using the alternative permissions as mentioned here:
      // https://docs.aws.amazon.com/batch/latest/userguide/batch-supported-iam-actions-resources.html
      new iam.PolicyStatement({
        resources: [
          Stack.of(task).formatArn({
            service: 'batch',
            resource: 'job-definition',
            resourceName: '*',
          }),
          this.props.jobQueueArn,
        ],
        actions: ['batch:SubmitJob'],
      }),
      new iam.PolicyStatement({
        resources: [
          Stack.of(task).formatArn({
            service: 'events',
            resource: 'rule/StepFunctionsGetEventsForBatchJobsRule',
          }),
        ],
        actions: ['events:PutTargets', 'events:PutRule', 'events:DescribeRule'],
      }),
    ];
  }

  private configureContainerOverrides(containerOverrides: ContainerOverrides) {
    let environment;
    if (containerOverrides.environment) {
      environment = Object.entries(containerOverrides.environment).map(
        ([key, value]) => ({
          Name: key,
          Value: value,
        }),
      );
    }

    let resources;
    if (containerOverrides.gpuCount) {
      resources = [
        {
          Type: 'GPU',
          Value: `${containerOverrides.gpuCount}`,
        },
      ];
    }

    return {
      Command: containerOverrides.command,
      Environment: environment,
      InstanceType: containerOverrides.instanceType?.toString(),
      Memory: containerOverrides.memory,
      ResourceRequirements: resources,
      Vcpus: containerOverrides.vcpus,
    };
  }
}
