import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { Credentials } from '../task-credentials';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { State } from './state';
/**
 * Props that are common to all tasks
 */
export interface TaskStateBaseProps {
    /**
     * An optional description for this state
     *
     * @default - No comment
     */
    readonly comment?: string;
    /**
     * JSONPath expression to select part of the state to be the input to this state.
     *
     * May also be the special value JsonPath.DISCARD, which will cause the effective
     * input to be the empty object {}.
     *
     * @default - The entire task input (JSON path '$')
     */
    readonly inputPath?: string;
    /**
     * JSONPath expression to select select a portion of the state output to pass
     * to the next state.
     *
     * May also be the special value JsonPath.DISCARD, which will cause the effective
     * output to be the empty object {}.
     *
     * @default - The entire JSON node determined by the state input, the task result,
     *   and resultPath is passed to the next state (JSON path '$')
     */
    readonly outputPath?: string;
    /**
     * JSONPath expression to indicate where to inject the state's output
     *
     * May also be the special value JsonPath.DISCARD, which will cause the state's
     * input to become its output.
     *
     * @default - Replaces the entire input with the result (JSON path '$')
     */
    readonly resultPath?: string;
    /**
     * The JSON that will replace the state's raw result and become the effective
     * result before ResultPath is applied.
     *
     * You can use ResultSelector to create a payload with values that are static
     * or selected from the state's raw result.
     *
     * @see
     * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-resultselector
     *
     * @default - None
     */
    readonly resultSelector?: {
        [key: string]: any;
    };
    /**
     * Timeout for the state machine
     *
     * @default - None
     */
    readonly timeout?: cdk.Duration;
    /**
     * Timeout for the heartbeat
     *
     * @default - None
     */
    readonly heartbeat?: cdk.Duration;
    /**
     * AWS Step Functions integrates with services directly in the Amazon States Language.
     * You can control these AWS services using service integration patterns
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token
     *
     * @default - `IntegrationPattern.REQUEST_RESPONSE` for most tasks.
     * `IntegrationPattern.RUN_JOB` for the following exceptions:
     *  `BatchSubmitJob`, `EmrAddStep`, `EmrCreateCluster`, `EmrTerminationCluster`, and `EmrContainersStartJobRun`.
     *
     */
    readonly integrationPattern?: IntegrationPattern;
    /**
     * Credentials for an IAM Role that the State Machine assumes for executing the task.
     * This enables cross-account resource invocations.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/concepts-access-cross-acct-resources.html
     *
     * @default - None (Task is executed using the State Machine's execution role)
     */
    readonly credentials?: Credentials;
}
/**
 * Define a Task state in the state machine
 *
 * Reaching a Task state causes some work to be executed, represented by the
 * Task's resource property. Task constructs represent a generic Amazon
 * States Language Task.
 *
 * For some resource types, more specific subclasses of Task may be available
 * which are more convenient to use.
 */
export declare abstract class TaskStateBase extends State implements INextable {
    readonly endStates: INextable[];
    protected abstract readonly taskMetrics?: TaskMetricsConfig;
    protected abstract readonly taskPolicies?: iam.PolicyStatement[];
    private readonly timeout?;
    private readonly heartbeat?;
    private readonly credentials?;
    constructor(scope: Construct, id: string, props: TaskStateBaseProps);
    /**
     * Add retry configuration for this state
     *
     * This controls if and how the execution will be retried if a particular
     * error occurs.
     */
    addRetry(props?: RetryProps): TaskStateBase;
    /**
     * Add a recovery handler for this state
     *
     * When a particular error occurs, execution will continue at the error
     * handler instead of failing the state machine execution.
     */
    addCatch(handler: IChainable, props?: CatchProps): TaskStateBase;
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
    /**
     * Return the given named metric for this Task
     *
     * @default - sum over 5 minutes
     */
    metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The interval, in milliseconds, between the time the Task starts and the time it closes.
     *
     * @default - average over 5 minutes
     */
    metricRunTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default - average over 5 minutes
     */
    metricScheduleTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default - average over 5 minutes
     */
    metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default - sum over 5 minutes
     */
    metricScheduled(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity times out
     *
     * @default - sum over 5 minutes
     */
    metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity is started
     *
     * @default - sum over 5 minutes
     */
    metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity succeeds
     *
     * @default - sum over 5 minutes
     */
    metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times this activity fails
     *
     * @default - sum over 5 minutes
     */
    metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default - sum over 5 minutes
     */
    metricHeartbeatTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
    protected whenBoundToGraph(graph: StateGraph): void;
    /**
     * @internal
     */
    protected abstract _renderTask(): any;
    private taskMetric;
    private renderCredentials;
    private renderTaskBase;
}
/**
 * Task Metrics
 */
export interface TaskMetricsConfig {
    /**
     * Prefix for singular metric names of activity actions
     *
     * @default - No such metrics
     */
    readonly metricPrefixSingular?: string;
    /**
     * Prefix for plural metric names of activity actions
     *
     * @default - No such metrics
     */
    readonly metricPrefixPlural?: string;
    /**
     * The dimensions to attach to metrics
     *
     * @default - No metrics
     */
    readonly metricDimensions?: cloudwatch.DimensionHash;
}
/**
 *
 * AWS Step Functions integrates with services directly in the Amazon States Language.
 * You can control these AWS services using service integration patterns:
 *
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html
 *
 */
export declare enum IntegrationPattern {
    /**
     * Step Functions will wait for an HTTP response and then progress to the next state.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-default
     */
    REQUEST_RESPONSE = "REQUEST_RESPONSE",
    /**
     * Step Functions can wait for a request to complete before progressing to the next state.
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-sync
     */
    RUN_JOB = "RUN_JOB",
    /**
     * Callback tasks provide a way to pause a workflow until a task token is returned.
     * You must set a task token when using the callback pattern
     *
     * @see https://docs.aws.amazon.com/step-functions/latest/dg/connect-to-resource.html#connect-wait-token
     */
    WAIT_FOR_TASK_TOKEN = "WAIT_FOR_TASK_TOKEN"
}
