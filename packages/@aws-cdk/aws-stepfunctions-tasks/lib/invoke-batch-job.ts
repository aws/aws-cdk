import * as iam from '@aws-cdk/aws-iam';
import * as sfn from '@aws-cdk/aws-stepfunctions';
import { Aws } from '@aws-cdk/core';
import { getResourceArn } from './resource-arn-suffix';

/**
 * An object representing an AWS Batch array job.
 */
export interface ArrayProperties {
  /**
   * The size of the array job.
   *
   * @default - No size
   */
  readonly Size?: number;
}

/**
 * A key-value pair object.
 */
export interface KeyValuePair {
  /**
   * The name of the key-value pair.
   * For environment variables, this is the name of the environment variable.
   *
   * @default - No name
   */
  Name?: string;

  /**
   * The value of the key-value pair.
   * For environment variables, this is the value of the environment variable.
   *
   * @default - No value
   */
  Value?: string;
}

/**
 * The type and amount of a resource to assign to a container.
 * Currently, the only supported resource type is GPU.
 */
export interface ResourceRequirement {
  /**
   * The type of resource to assign to a container.
   * Currently, the only supported resource type is GPU.
   */
  readonly Type: string;

  /**
   * The number of physical GPUs to reserve for the container.
   * The number of GPUs reserved for all containers in a job
   * should not exceed the number of available GPUs on the compute
   * resource that the job is launched on.
   */
  readonly Value: string;
}

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
  readonly Command?: string[];

  /**
   * The environment variables to send to the container.
   * You can add new environment variables, which are added to the container
   * at launch, or you can override the existing environment variables from
   * the Docker image or the job definition.
   *
   * @default - No environment overrides
   */
  readonly Environment?: KeyValuePair[];

  /**
   * The instance type to use for a multi-node parallel job.
   * This parameter is not valid for single-node container jobs.
   *
   * @default - No instance type overrides
   */
  readonly InstanceType?: string;

  /**
   * The number of MiB of memory reserved for the job.
   * This value overrides the value set in the job definition.
   *
   * @default - No memory overrides
   */
  readonly Memory?: number;

  /**
   * The type and amount of a resource to assign to a container.
   * This value overrides the value set in the job definition.
   * Currently, the only supported resource is GPU.
   *
   * @default - No resource requirements overrides
   */
  readonly ResourceRequirements?: ResourceRequirement[];

  /**
   * The number of vCPUs to reserve for the container.
   * This value overrides the value set in the job definition.
   *
   * @default - No vCPUs overrides
   */
  readonly Vcpus?: number;
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
  readonly JobId?: string;

  /**
   * The type of the job dependency.
   *
   * @default - No type
   */
  readonly Type?: string;
}

/**
 * The retry strategy associated with a job.
 */
export interface RetryStrategy {
  /**
   * The number of times to move a job to the RUNNABLE status.
   * You may specify between 1 and 10 attempts.
   * If the value of attempts is greater than one,
   * the job is retried on failure the same number of attempts as the value.
   *
   * @default - No attempts
   */
  readonly Attempts?: number;
}

/**
 * An object representing a job timeout configuration.
 */
export interface JobTimeout {
  /**
   * The time duration in seconds
   * (measured from the job attempt's startedAt timestamp)
   * after which AWS Batch terminates your jobs if they have not finished.
   *
   * @default - No timeout seconds
   */
  readonly AttemptDurationSeconds?: number;
}

/**
 * Properties for InvokeBatchJob
 *
 * @experimental
 */
export interface InvokeBatchJobProps {
  /**
   * The job definition used by this job.
   * This value can be one of name, name:revision, or the Amazon Resource Name (ARN) for the job definition.
   * If name is specified without a revision then the latest active revision is used
   */
  readonly jobDefinition: string;

  /**
   * The name of the job.
   * The first character must be alphanumeric, and up to 128 letters (uppercase and lowercase),
   * numbers, hyphens, and underscores are allowed.
   */
  readonly jobName: string;

  /**
   * The job queue into which the job is submitted.
   * You can specify either the name or the Amazon Resource Name (ARN) of the queue.
   *
   */
  readonly jobQueue: string;

  /**
   * The array properties for the submitted job, such as the size of the array.
   * The array size can be between 2 and 10,000.
   * If you specify array properties for a job, it becomes an array job.
   * For more information, see Array Jobs in the AWS Batch User Guide.
   *
   * @default - No array properties
   */
  readonly arrayProperties?: ArrayProperties;

  /**
   * A list of container overrides in JSON format that specify the name of a
   * container in the specified job definition and the overrides it
   * should receive. You can override the default command for a container
   * (that is specified in the job definition or the Docker image) with a
   * command override. You can also override existing environment variables
   * (that are specified in the job definition or Docker image) on a container
   * or add new environment variables to it with an environment override.
   *
   * @default - No container overrides
   */
  readonly containerOverrides?: ContainerOverrides;

  /**
   * A list of dependencies for the job.
   * A job can depend upon a maximum of 20 jobs. You can specify a SEQUENTIAL
   * type dependency without specifying a job ID for array jobs so that each
   * child array job completes sequentially, starting at index 0.
   * You can also specify an N_TO_N type dependency with a job ID for array jobs.
   * In that case, each index child of this job must wait for the corresponding
   * index child of each dependency to complete before it can begin.
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
   * The retry strategy to use for failed jobs from this SubmitJob operation.
   * When a retry strategy is specified here,
   * it overrides the retry strategy defined in the job definition.
   *
   * @default - No retry strategy
   */
  readonly retryStrategy?: RetryStrategy;

  /**
   * The timeout configuration for this SubmitJob operation.
   *
   * @default - No timeout
   */
  readonly timeout?: JobTimeout;

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
 * A Step Functions Task to invoke AWS Batch
 *
 * @experimental
 */
export class InvokeBatchJob implements sfn.IStepFunctionsTask {
  private readonly integrationPattern: sfn.ServiceIntegrationPattern;

  constructor(private readonly props: InvokeBatchJobProps) {
    this.integrationPattern =
      props.integrationPattern || sfn.ServiceIntegrationPattern.SYNC;

    const supportedPatterns = [
      sfn.ServiceIntegrationPattern.FIRE_AND_FORGET,
      sfn.ServiceIntegrationPattern.SYNC
    ];

    if (!supportedPatterns.includes(this.integrationPattern)) {
      throw new Error(
        `Invalid Service Integration Pattern: ${this.integrationPattern} is not supported to call InvokeBatchJob.`
      );
    }
  }

  public bind(_task: sfn.Task): sfn.StepFunctionsTaskConfig {
    return {
      resourceArn: getResourceArn(
        'batch',
        'submitJob',
        this.integrationPattern
      ),
      policyStatements: [
        new iam.PolicyStatement({
          resources: ['*'],
          actions: [
            'batch:SubmitJob',
            'batch:DescribeJobs',
            'batch:TerminateJob'
          ]
        }),
        new iam.PolicyStatement({
          resources: [
            `arn:aws:events:${Aws.REGION}:${Aws.ACCOUNT_ID}:rule/StepFunctionsGetEventsForBatchJobsRule`
          ],
          actions: [
            'events:PutTargets',
            'events:PutRule',
            'events:DescribeRule'
          ]
        })
      ],
      parameters: {
        JobDefinition: this.props.jobDefinition,
        JobName: this.props.jobName,
        JobQueue: this.props.jobQueue,
        ArrayProperties: this.props.arrayProperties,
        ContainerOverrides: this.props.containerOverrides,
        DependsOn: this.props.dependsOn,
        Parameters: this.props.payload,
        RetryStrategy: this.props.retryStrategy,
        Timeout: this.props.timeout
      }
    };
  }
}
