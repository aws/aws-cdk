import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import { Duration } from '@aws-cdk/core';
import { Task } from './states/task';
/**
 * Interface for resources that can be used as tasks
 * @deprecated replaced by `TaskStateBase`.
 */
export interface IStepFunctionsTask {
    /**
     * Called when the task object is used in a workflow
     */
    bind(task: Task): StepFunctionsTaskConfig;
}
/**
 * Properties that define what kind of task should be created
 * @deprecated used by `IStepFunctionsTask`. `IStepFunctionsTask` is deprecated and replaced by `TaskStateBase`.
 */
export interface StepFunctionsTaskConfig {
    /**
     * The resource that represents the work to be executed
     *
     * Either the ARN of a Lambda Function or Activity, or a special
     * ARN.
     */
    readonly resourceArn: string;
    /**
     * Parameters pass a collection of key-value pairs, either static values or JSONPath expressions that select from the input.
     *
     * The meaning of these parameters is task-dependent.
     *
     * Its values will be merged with the `parameters` property which is configured directly
     * on the Task state.
     *
     * @see
     * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
     *
     * @default No parameters
     */
    readonly parameters?: {
        [name: string]: any;
    };
    /**
     * Maximum time between heart beats
     *
     * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
     *
     * This is only relevant when using an Activity type as resource.
     *
     * @default No heart beat timeout
     */
    readonly heartbeat?: Duration;
    /**
     * Additional policy statements to add to the execution role
     *
     * @default No policy roles
     */
    readonly policyStatements?: iam.PolicyStatement[];
    /**
     * Prefix for singular metric names of activity actions
     *
     * @default No such metrics
     */
    readonly metricPrefixSingular?: string;
    /**
     * Prefix for plural metric names of activity actions
     *
     * @default No such metrics
     */
    readonly metricPrefixPlural?: string;
    /**
     * The dimensions to attach to metrics
     *
     * @default No metrics
     */
    readonly metricDimensions?: cloudwatch.DimensionHash;
}
/**
 * Three ways to call an integrated service: Request Response, Run a Job and Wait for a Callback with Task Token.
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 *
 * Here, they are named as FIRE_AND_FORGET, SYNC and WAIT_FOR_TASK_TOKEN respectfully.
 *
 * @default FIRE_AND_FORGET
 */
export declare enum ServiceIntegrationPattern {
    /**
     * Call a service and progress to the next state immediately after the API call completes
     */
    FIRE_AND_FORGET = "FIRE_AND_FORGET",
    /**
     * Call a service and wait for a job to complete.
     */
    SYNC = "SYNC",
    /**
     * Call a service with a task token and wait until that token is returned by SendTaskSuccess/SendTaskFailure with payload.
     */
    WAIT_FOR_TASK_TOKEN = "WAIT_FOR_TASK_TOKEN"
}
