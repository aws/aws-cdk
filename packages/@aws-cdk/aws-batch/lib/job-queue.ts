import { ArnFormat, IResource, Resource, Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { CfnJobQueue } from './batch.generated';
import { IComputeEnvironment } from './compute-environment';

/**
 * Properties for mapping a compute environment to a job queue.
 */
export interface JobQueueComputeEnvironment {
  /**
   * The batch compute environment to use for processing submitted jobs to this queue.
   */
  readonly computeEnvironment: IComputeEnvironment;

  /**
   * The order in which this compute environment will be selected for dynamic allocation of resources to process submitted jobs.
   */
  readonly order: number;
}

/**
 * Properties of a batch job queue.
 */
export interface JobQueueProps {
  /**
   * A name for the job queue.
   *
   * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
   *
   * @default - Cloudformation-generated name
   */
  readonly jobQueueName?: string;

  /**
   * The set of compute environments mapped to a job queue and their order relative to each other. The job scheduler uses this parameter to
   * determine which compute environment should execute a given job. Compute environments must be in the VALID state before you can associate them
   * with a job queue. You can associate up to three compute environments with a job queue.
   *
   */
  readonly computeEnvironments: JobQueueComputeEnvironment[];

  /**
   * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first
   * when associated with the same compute environment. Priority is determined in descending order, for example, a job queue with a priority value
   * of 10 is given scheduling preference over a job queue with a priority value of 1.
   *
   * @default 1
   */
  readonly priority?: number;

  /**
   * The state of the job queue. If set to true, it is able to accept jobs.
   *
   * @default true
   */
  readonly enabled?: boolean;
}

/**
 * Properties of a Job Queue.
 */
export interface IJobQueue extends IResource {
  /**
   * The ARN of this batch job queue.
   *
   * @attribute
   */
  readonly jobQueueArn: string;

  /**
   * A name for the job queue.
   *
   * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
   *
   * @attribute
   */
  readonly jobQueueName: string;
}

/**
 * Batch Job Queue.
 *
 * Defines a batch job queue to define how submitted batch jobs
 * should be ran based on specified batch compute environments.
 */
export class JobQueue extends Resource implements IJobQueue {
  /**
   * Fetches an existing batch job queue by its amazon resource name.
   *
   * @param scope
   * @param id
   * @param jobQueueArn
   */
  public static fromJobQueueArn(scope: Construct, id: string, jobQueueArn: string): IJobQueue {
    const stack = Stack.of(scope);
    const jobQueueName = stack.splitArn(jobQueueArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

    class Import extends Resource implements IJobQueue {
      public readonly jobQueueArn = jobQueueArn;
      public readonly jobQueueName = jobQueueName;
    }

    return new Import(scope, id);
  }

  public readonly jobQueueArn: string;
  public readonly jobQueueName: string;

  constructor(scope: Construct, id: string, props: JobQueueProps) {
    super(scope, id, {
      physicalName: props.jobQueueName,
    });

    if (props.computeEnvironments.length === 0) {
      throw new Error('computeEnvironments must be non-empty');
    }

    const jobQueue = new CfnJobQueue(this, 'Resource', {
      computeEnvironmentOrder: props.computeEnvironments.map(cp => ({
        computeEnvironment: cp.computeEnvironment.computeEnvironmentArn,
        order: cp.order,
      } as CfnJobQueue.ComputeEnvironmentOrderProperty)),
      jobQueueName: this.physicalName,
      priority: props.priority || 1,
      state: props.enabled === undefined ? 'ENABLED' : (props.enabled ? 'ENABLED' : 'DISABLED'),
    });

    this.jobQueueArn = this.getResourceArnAttribute(jobQueue.ref, {
      service: 'batch',
      resource: 'job-queue',
      resourceName: this.physicalName,
    });
    this.jobQueueName = this.getResourceNameAttribute(jobQueue.ref);
  }
}
