import { Construct, IResource, Resource, Stack } from '@aws-cdk/core';
import { CfnJobQueue } from './batch.generated';
import { ComputeEnvironment, IComputeEnvironment } from './compute-environment';

/**
 * Property to determine if the Batch Job
 * Queue should accept incoming jobs to be queued
 */
export enum JobQueueState {
    /**
     * The Job Queue accepts incoming batch jobs
     */
    ENABLED = 'ENABLED',
    /**
     * The Job Queue blocks incoming batch jobs
     */
    DISABLED = 'DISABLED'
}

/**
 * Properties for mapping a compute environment to a job queue
 */
export interface JobQueueComputeEnvironment {
    /**
     * The batch compute environment to use for processing submitted jobs to this queue
     */
    readonly computeEnvironment: IComputeEnvironment;

    /**
     * The order in which this compute environment will be selected for dynamic allocation of resources to process submitted jobs
     */
    readonly order: number;
}

/**
 * Properties of a batch job queue
 */
export interface JobQueueProps {
    /**
     * A name for the job queue.
     *
     * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     *
     * @attribute
     * @default Cloudformation-generated name
     */
    readonly jobQueueName?: string;

    /**
     * The set of compute environments mapped to a job queue and their order relative to each other. The job scheduler uses this parameter to
     * determine which compute environment should execute a given job. Compute environments must be in the VALID state before you can associate them
     * with a job queue. You can associate up to three compute environments with a job queue.
     *
     * @default Default-Compute-Environment
     */
    readonly computeEnvironmentOrder?: JobQueueComputeEnvironment[];

    /**
     * The priority of the job queue. Job queues with a higher priority (or a higher integer value for the priority parameter) are evaluated first
     * when associated with the same compute environment. Priority is determined in descending order, for example, a job queue with a priority value
     * of 10 is given scheduling preference over a job queue with a priority value of 1.
     */
    readonly priority: number;

    /**
     * The state of the job queue. If the job queue state is ENABLED, it is able to accept jobs.
     */
    readonly state: JobQueueState;
}

/**
 * Properties of a Job Queue
 */
export interface IJobQueue extends IResource {
    /**
     * The ARN of this batch job queue
     *
     * @attribute
     * @default Cloudformation-generated ARN
     */
    readonly jobQueueArn: string;

    /**
     * A name for the job queue.
     *
     * Up to 128 letters (uppercase and lowercase), numbers, hyphens, and underscores are allowed.
     *
     * @attribute
     * @default Cloudformation-generated name
     */
    readonly jobQueueName?: string;
}

/**
 * Batch Job Queue
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
        const jobQueueName = stack.parseArn(jobQueueArn).resource;

        class Import extends Resource implements IJobQueue {
            public readonly jobQueueArn = jobQueueArn;
            public readonly jobQueueName = jobQueueName;
        }

        return new Import(scope, id);
    }

    public readonly jobQueueArn: string;
    public readonly jobQueueName?: string;

    constructor(scope: Construct, id: string, props: JobQueueProps) {
        super(scope, id, {
            physicalName: props.jobQueueName,
        });

        const jobQueue = new CfnJobQueue(this, 'Resource', {
            computeEnvironmentOrder: props.computeEnvironmentOrder ? props.computeEnvironmentOrder.map(cp => {
                return {
                    computeEnvironment: cp.computeEnvironment.computeEnvironmentArn,
                    order: cp.order,
                } as CfnJobQueue.ComputeEnvironmentOrderProperty;
            }) : [
                {
                    computeEnvironment: new ComputeEnvironment(this, 'Resource-Batch-Compute-Environment').computeEnvironmentArn,
                    order: 1,
                },
            ],
            jobQueueName: this.physicalName,
            priority: props.priority || 1,
            state: props.state || JobQueueState.DISABLED,
        });

        this.jobQueueArn = jobQueue.ref;
        this.jobQueueName = this.getResourceNameAttribute(props.jobQueueName || this.physicalName);
    }
}