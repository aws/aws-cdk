import * as events from '@aws-cdk/aws-events';
import { IConstruct } from 'constructs';
import { TargetBaseProps } from './util';
/**
 * Customize the Batch Job Event Target
 */
export interface BatchJobProps extends TargetBaseProps {
    /**
     * The event to send to the Lambda
     *
     * This will be the payload sent to the Lambda Function.
     *
     * @default the entire EventBridge event
     */
    readonly event?: events.RuleTargetInput;
    /**
     * The size of the array, if this is an array batch job.
     *
     * Valid values are integers between 2 and 10,000.
     *
     * @default no arrayProperties are set
     */
    readonly size?: number;
    /**
     * The number of times to attempt to retry, if the job fails. Valid values are 1–10.
     *
     * @default no retryStrategy is set
     */
    readonly attempts?: number;
    /**
     * The name of the submitted job
     *
     * @default - Automatically generated
     */
    readonly jobName?: string;
}
/**
 * Use an AWS Batch Job / Queue as an event rule target.
 * Most likely the code will look something like this:
 * `new BatchJob(jobQueue.jobQueueArn, jobQueue, jobDefinition.jobDefinitionArn, jobDefinition)`
 *
 * In the future this API will be improved to be fully typed
 */
export declare class BatchJob implements events.IRuleTarget {
    /**
     * The JobQueue arn
     */
    private readonly jobQueueArn;
    /**
     * The JobQueue Resource
     */
    private readonly jobQueueScope;
    /**
     * The jobDefinition arn
     */
    private readonly jobDefinitionArn;
    /**
     * The JobQueue Resource
     */
    private readonly jobDefinitionScope;
    private readonly props;
    constructor(
    /**
     * The JobQueue arn
     */
    jobQueueArn: string, 
    /**
     * The JobQueue Resource
     */
    jobQueueScope: IConstruct, 
    /**
     * The jobDefinition arn
     */
    jobDefinitionArn: string, 
    /**
     * The JobQueue Resource
     */
    jobDefinitionScope: IConstruct, props?: BatchJobProps);
    /**
     * Returns a RuleTarget that can be used to trigger queue this batch job as a
     * result from an EventBridge event.
     */
    bind(rule: events.IRule, _id?: string): events.RuleTargetConfig;
}
