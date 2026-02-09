import type { Construct } from 'constructs';
import { CfnJobQueue } from './batch.generated';
import { toISchedulingPolicy } from './private/ref-utils';
import type { ISchedulingPolicy } from './scheduling-policy';
import type { Duration, IResource } from '../../core';
import { ArnFormat, Lazy, Resource, Stack, ValidationError } from '../../core';
import { memoizedGetter } from '../../core/lib/helpers-internal';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IComputeEnvironmentRef, IJobQueueRef, ISchedulingPolicyRef, JobQueueReference } from '../../interfaces/generated/aws-batch-interfaces.generated';

/**
 * Represents a JobQueue
 */
export interface IJobQueue extends IResource, IJobQueueRef {
  /**
   * The name of the job queue. It can be up to 128 letters long.
   * It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_)
   *
   * @attribute
   */
  readonly jobQueueName: string;

  /**
   * The ARN of this job queue
   *
   * @attribute
   */
  readonly jobQueueArn: string;

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
  readonly computeEnvironments: OrderedComputeEnvironment[];

  /**
   * The priority of the job queue.
   * Job queues with a higher priority are evaluated first when associated with the same compute environment.
   * Priority is determined in descending order.
   * For example, a job queue with a priority value of 10 is given scheduling preference over a job queue with a priority value of 1.
   */
  readonly priority: number;

  /**
   * If the job queue is enabled, it is able to accept jobs.
   * Otherwise, new jobs can't be added to the queue, but jobs already in the queue can finish.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The SchedulingPolicy for this JobQueue. Instructs the Scheduler how to schedule different jobs.
   *
   * @default - no scheduling policy
   */
  readonly schedulingPolicy?: ISchedulingPolicy;

  /**
   * Add a `ComputeEnvironment` to this Queue.
   * The Queue will prefer lower-order `ComputeEnvironment`s.
   */
  addComputeEnvironment(computeEnvironment: IComputeEnvironmentRef, order: number): void;
}

/**
 * Props to configure a JobQueue
 */
export interface JobQueueProps {
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
   *
   * @default none
   */
  readonly computeEnvironments?: OrderedComputeEnvironment[];

  /**
   * The priority of the job queue.
   * Job queues with a higher priority are evaluated first when associated with the same compute environment.
   * Priority is determined in descending order.
   * For example, a job queue with a priority of 10 is given scheduling preference over a job queue with a priority of 1.
   *
   * @default 1
   */
  readonly priority?: number;

  /**
   * The name of the job queue. It can be up to 128 letters long.
   * It can contain uppercase and lowercase letters, numbers, hyphens (-), and underscores (_)
   *
   * @default - no name
   */
  readonly jobQueueName?: string;

  /**
   * If the job queue is enabled, it is able to accept jobs.
   * Otherwise, new jobs can't be added to the queue, but jobs already in the queue can finish.
   *
   * @default true
   */
  readonly enabled?: boolean;

  /**
   * The SchedulingPolicy for this JobQueue. Instructs the Scheduler how to schedule different jobs.
   *
   * @default - no scheduling policy
   */
  readonly schedulingPolicy?: ISchedulingPolicyRef;

  /**
   * The set of actions that AWS Batch perform on jobs that remain at the head of the job queue in
   * the specified state longer than specified times.
   *
   * @default - no actions
   */
  readonly jobStateTimeLimitActions?: JobStateTimeLimitAction[];
}

/**
 * Assigns an order to a ComputeEnvironment.
 * The JobQueue will prioritize the lowest-order ComputeEnvironment.
 */
export interface OrderedComputeEnvironment {
  /**
   * The ComputeEnvironment to link to this JobQueue
   */
  readonly computeEnvironment: IComputeEnvironmentRef;

  /**
   * The order associated with `computeEnvironment`
   */
  readonly order: number;
}

/**
 * Specifies an action that AWS Batch will take after the job has remained at
 * the head of the queue in the specified state for longer than the specified time.
 */
export interface JobStateTimeLimitAction {
  /**
   * The action to take when a job is at the head of the job queue in the specified state
   * for the specified period of time.
   *
   * @default JobStateTimeLimitActionsAction.CANCEL
   */
  readonly action?: JobStateTimeLimitActionsAction;

  /**
   * The approximate amount of time, that must pass with the job in the specified
   * state before the action is taken.
   *
   * The minimum value is 10 minutes and the maximum value is 24 hours.
   */
  readonly maxTime: Duration;

  /**
   * The reason to log for the action being taken.
   *
   * @see https://docs.aws.amazon.com/batch/latest/userguide/troubleshooting.html#job_stuck_in_runnable
   */
  readonly reason: JobStateTimeLimitActionsReason;

  /**
   * The state of the job needed to trigger the action.
   *
   * @default JobStateTimeLimitActionsState.RUNNABLE
   */
  readonly state?: JobStateTimeLimitActionsState;
}

/**
 * The action to take when a job is at the head of the job queue in the specified state
 * for the specified period of time.
 */
export enum JobStateTimeLimitActionsAction {
  /**
   * Cancel the job.
   */
  CANCEL = 'CANCEL',
  /**
   * Terminate the job.
   */
  TERMINATE = 'TERMINATE',
}

/**
 * The reason to log for the action being taken.
 *
 * @see https://docs.aws.amazon.com/batch/latest/userguide/troubleshooting.html#job_stuck_in_runnable
 */
export enum JobStateTimeLimitActionsReason {
  /**
   * All connected compute environments have insufficient capacity errors.
   */
  INSUFFICIENT_INSTANCE_CAPACITY = 'CAPACITY:INSUFFICIENT_INSTANCE_CAPACITY',

  /**
   * All compute environments have a maxvCpus parameter that is smaller than the job requirements.
   */
  COMPUTE_ENVIRONMENT_MAX_RESOURCE = 'MISCONFIGURATION:COMPUTE_ENVIRONMENT_MAX_RESOURCE',

  /**
   * None of the compute environments have instances that meet the job requirements.
   */
  JOB_RESOURCE_REQUIREMENT = 'MISCONFIGURATION:JOB_RESOURCE_REQUIREMENT',
}

/**
 * The state of the job needed to trigger the action.
 */
export enum JobStateTimeLimitActionsState {
  /**
   * RUNNABLE state triggers the action.
   */
  RUNNABLE = 'RUNNABLE',
}

/**
 * JobQueues can receive Jobs, which are removed from the queue when
 * sent to the linked ComputeEnvironment(s) to be executed.
 * Jobs exit the queue in FIFO order unless a `SchedulingPolicy` is linked.
 */
@propertyInjectable
export class JobQueue extends Resource implements IJobQueue {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-batch.JobQueue';

  /**
   * refer to an existing JobQueue by its arn
   */
  public static fromJobQueueArn(scope: Construct, id: string, jobQueueArn: string): IJobQueue {
    const stack = Stack.of(scope);
    class Import extends Resource implements IJobQueue {
      public readonly computeEnvironments = [];
      public readonly priority = 1;
      public readonly jobQueueArn = jobQueueArn;
      public readonly jobQueueName = stack.splitArn(jobQueueArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

      public get jobQueueRef(): JobQueueReference {
        return {
          jobQueueArn: this.jobQueueArn,
        };
      }

      public addComputeEnvironment(_computeEnvironment: IComputeEnvironmentRef, _order: number): void {
        throw new ValidationError(`cannot add ComputeEnvironments to imported JobQueue '${id}'`, this);
      }
    }

    return new Import(scope, id);
  }

  public readonly computeEnvironments: OrderedComputeEnvironment[];
  public readonly priority: number;
  public readonly enabled?: boolean;
  private readonly _schedulingPolicy?: ISchedulingPolicyRef;

  private readonly resource: CfnJobQueue;

  @memoizedGetter
  public get jobQueueArn(): string {
    return this.getResourceArnAttribute(this.resource.attrJobQueueArn, {
      service: 'batch',
      resource: 'job-queue',
      resourceName: this.physicalName,
    });
  }

  @memoizedGetter
  public get jobQueueName(): string {
    return Stack.of(this).splitArn(this.jobQueueArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
  }

  /**
   * The SchedulingPolicy for this JobQueue. Instructs the Scheduler how to schedule different jobs.
   */
  public get schedulingPolicy(): ISchedulingPolicy | undefined {
    return this._schedulingPolicy ? toISchedulingPolicy(this._schedulingPolicy) : undefined;
  }

  public get jobQueueRef(): JobQueueReference {
    return {
      jobQueueArn: this.jobQueueArn,
    };
  }

  constructor(scope: Construct, id: string, props?: JobQueueProps) {
    super(scope, id, {
      physicalName: props?.jobQueueName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this.computeEnvironments = props?.computeEnvironments ?? [];
    this.priority = props?.priority ?? 1;
    this.enabled = props?.enabled;
    this._schedulingPolicy = props?.schedulingPolicy;

    this.resource = new CfnJobQueue(this, 'Resource', {
      computeEnvironmentOrder: Lazy.any({
        produce: () => this.computeEnvironments.map((ce) => {
          return {
            computeEnvironment: ce.computeEnvironment.computeEnvironmentRef.computeEnvironmentArn,
            order: ce.order,
          };
        }),
      }),
      priority: this.priority,
      jobQueueName: props?.jobQueueName,
      state: (this.enabled ?? true) ? 'ENABLED' : 'DISABLED',
      schedulingPolicyArn: this._schedulingPolicy?.schedulingPolicyRef.schedulingPolicyArn,
      jobStateTimeLimitActions: this.renderJobStateTimeLimitActions(props?.jobStateTimeLimitActions),
    });

    this.node.addValidation({ validate: () => validateOrderedComputeEnvironments(this.computeEnvironments) });
  }

  addComputeEnvironment(computeEnvironment: IComputeEnvironmentRef, order: number): void {
    this.computeEnvironments.push({
      computeEnvironment,
      order,
    });
  }

  private renderJobStateTimeLimitActions(
    jobStateTimeLimitActions?: JobStateTimeLimitAction[],
  ): CfnJobQueue.JobStateTimeLimitActionProperty[] | undefined {
    if (!jobStateTimeLimitActions || jobStateTimeLimitActions.length === 0) {
      return;
    }

    return jobStateTimeLimitActions.map((action, index) => renderJobStateTimeLimitAction(this, action, index));

    function renderJobStateTimeLimitAction(
      scope: Construct,
      jobStateTimeLimitAction: JobStateTimeLimitAction,
      index: number,
    ): CfnJobQueue.JobStateTimeLimitActionProperty {
      const maxTimeSeconds = jobStateTimeLimitAction.maxTime.toSeconds();

      if (maxTimeSeconds < 600 || maxTimeSeconds > 86400) {
        throw new ValidationError(`maxTime must be between 600 and 86400 seconds, got ${maxTimeSeconds} seconds at jobStateTimeLimitActions[${index}]`, scope);
      }

      return {
        action: jobStateTimeLimitAction.action ?? JobStateTimeLimitActionsAction.CANCEL,
        maxTimeSeconds,
        reason: jobStateTimeLimitAction.reason,
        state: jobStateTimeLimitAction.state ?? JobStateTimeLimitActionsState.RUNNABLE,
      };
    }
  }
}

function validateOrderedComputeEnvironments(computeEnvironments: OrderedComputeEnvironment[]): string[] {
  const seenOrders: number[] = [];

  for (const ce of computeEnvironments) {
    if (seenOrders.includes(ce.order)) {
      return ['assigns the same order to different ComputeEnvironments'];
    }
    seenOrders.push(ce.order);
  }

  return seenOrders.length === 0 ? ['This JobQueue does not link any ComputeEnvironments'] : [];
}
