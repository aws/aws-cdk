import { IResource, Resource, ResourceProps } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IComputeEnvironment } from './compute-environment-base';
import { ISchedulingPolicy } from './scheduling-policy';

export interface IJobQueue extends IResource {
  /**
   * The set of compute environments mapped to a job queue and their order relative to each other.
   * The job scheduler uses this parameter to determine which compute environment runs a specific job.
   * Compute environments must be in the VALID state before you can associate them with a job queue.
   * You can associate up to three compute environments with a job queue.
   * All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT);
   * EC2 and Fargate compute environments can't be mixed.
   *
   * *Note*: All compute environments that are associated with a job queue must share the same architecture.
   * AWS Batch doesn't support mixing compute environment architecture types in a single job queue.
   */
  computeEnvironments: OrderedComputeEnvironment[]

  /**
   * The priority of the job queue.
   * Job queues with a higher priority are evaluated first when associated with the same compute environment.
   * Priority is determined in descending order.
   * For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1.
   */
  priority: number

  /**
   * The name of the job queue. It can be up to 128 letters long.
   * It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_)
   *
   * @default - no name
   */
  name?: string

  /**
   * If the job queue is enabled, it is able to accept jobs.
   * Otherwise, new jobs can't be added to the queue, but jobs already in the queue can finish.
   *
   * @default true
   */
  enabled?: boolean

  /**
   * The SchedulingPolicy for this JobQueue. Instructs the Scheduler how to schedule different jobs.
   */
  schedulingPolicy?: ISchedulingPolicy
}

export interface JobQueueProps extends ResourceProps {
  /**
   * The set of compute environments mapped to a job queue and their order relative to each other.
   * The job scheduler uses this parameter to determine which compute environment runs a specific job.
   * Compute environments must be in the VALID state before you can associate them with a job queue.
   * You can associate up to three compute environments with a job queue.
   * All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT);
   * EC2 and Fargate compute environments can't be mixed.
   *
   * *Note*: All compute environments that are associated with a job queue must share the same architecture.
   * AWS Batch doesn't support mixing compute environment architecture types in a single job queue.
   */
  computeEnvironments: OrderedComputeEnvironment[]

  /**
   * The priority of the job queue.
   * Job queues with a higher priority are evaluated first when associated with the same compute environment.
   * Priority is determined in descending order.
   * For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1.
   */
  priority: number

  /**
   * The name of the job queue. It can be up to 128 letters long.
   * It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_)
   *
   * @default - no name
   */
  name?: string

  /**
   * If the job queue is enabled, it is able to accept jobs.
   * Otherwise, new jobs can't be added to the queue, but jobs already in the queue can finish.
   *
   * @default true
   */
  enabled?: boolean

  /**
   * The SchedulingPolicy for this JobQueue. Instructs the Scheduler how to schedule different jobs.
   */
  schedulingPolicy?: ISchedulingPolicy
}

export interface OrderedComputeEnvironment {
  computeEnvironment: IComputeEnvironment;
  order: number;
}

export class JobQueue extends Resource implements IJobQueue {
  /**
   * The set of compute environments mapped to a job queue and their order relative to each other.
   * The job scheduler uses this parameter to determine which compute environment runs a specific job.
   * Compute environments must be in the VALID state before you can associate them with a job queue.
   * You can associate up to three compute environments with a job queue.
   * All of the compute environments must be either EC2 (EC2 or SPOT) or Fargate (FARGATE or FARGATE_SPOT);
   * EC2 and Fargate compute environments can't be mixed.
   *
   * *Note*: All compute environments that are associated with a job queue must share the same architecture.
   * AWS Batch doesn't support mixing compute environment architecture types in a single job queue.
   */
  computeEnvironments: OrderedComputeEnvironment[]

  /**
   * The priority of the job queue.
   * Job queues with a higher priority are evaluated first when associated with the same compute environment.
   * Priority is determined in descending order.
   * For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1.
   */
  priority: number

  /**
   * The name of the job queue. It can be up to 128 letters long.
   * It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_)
   *
   * @default - no name
   */
  name?: string

  /**
   * If the job queue is enabled, it is able to accept jobs.
   * Otherwise, new jobs can't be added to the queue, but jobs already in the queue can finish.
   *
   * @default true
   */
  enabled?: boolean

  /**
   * The SchedulingPolicy for this JobQueue. Instructs the Scheduler how to schedule different jobs.
   */
  schedulingPolicy?: ISchedulingPolicy

  constructor(scope: Construct, id: string, props: JobQueueProps) {
    super(scope, id, props);

    this.computeEnvironments = props.computeEnvironments;
    this.priority = props.priority;
    this.name = props.name;
    this.enabled = props.enabled;
    this.schedulingPolicy = props.schedulingPolicy;
  }

  //addComputeEnvironment(computeEnvironment: IComputeEnvironment, order: number)
}
