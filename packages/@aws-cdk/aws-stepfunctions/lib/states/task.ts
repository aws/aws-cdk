import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { renderJsonPath, State, StateType } from './state';

/**
 * Properties for defining a Task state
 */
export interface TaskProps {
    /**
     * The resource that represents the work to be executed
     *
     * Can be either a Lambda Function or an Activity.
     */
    readonly resource: IStepFunctionsTaskResource;

    /**
     * An optional description for this state
     *
     * @default No comment
     */
    readonly comment?: string;

    /**
     * JSONPath expression to select part of the state to be the input to this state.
     *
     * May also be the special value DISCARD, which will cause the effective
     * input to be the empty object {}.
     *
     * @default $
     */
    readonly inputPath?: string;

    /**
     * Parameters pass a collection of key-value pairs, either static values or JSONPath expressions that select from the input.
     *
     * @see
     * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
     *
     * @default No parameters
     */
    readonly parameters?: { [name: string]: any };

    /**
     * JSONPath expression to select part of the state to be the output to this state.
     *
     * May also be the special value DISCARD, which will cause the effective
     * output to be the empty object {}.
     *
     * @default $
     */
    readonly outputPath?: string;

    /**
     * JSONPath expression to indicate where to inject the state's output
     *
     * May also be the special value DISCARD, which will cause the state's
     * input to become its output.
     *
     * @default $
     */
    readonly resultPath?: string;

    /**
     * Maximum run time of this state
     *
     * If the state takes longer than this amount of time to complete, a 'Timeout' error is raised.
     *
     * @default 60
     */
    readonly timeoutSeconds?: number;

    /**
     * Maximum time between heart beats
     *
     * If the time between heart beats takes longer than this, a 'Timeout' error is raised.
     *
     * This is only relevant when using an Activity type as resource.
     *
     * @default No heart beat timeout
     */
    readonly heartbeatSeconds?: number;
}

/**
 * Define a Task state in the state machine
 *
 * Reaching a Task state causes some work to be executed, represented
 * by the Task's resource property.
 */
export class Task extends State implements INextable {
    public readonly endStates: INextable[];
    private readonly resourceProps: StepFunctionsTaskResourceProps;
    private readonly timeoutSeconds?: number;
    private readonly heartbeatSeconds?: number;

    constructor(scope: cdk.Construct, id: string, props: TaskProps) {
        super(scope, id, props);

        this.timeoutSeconds = props.timeoutSeconds;
        this.heartbeatSeconds = props.heartbeatSeconds;
        this.resourceProps = props.resource.asStepFunctionsTaskResource(this);
        this.endStates = [this];
    }

    /**
     * Add retry configuration for this state
     *
     * This controls if and how the execution will be retried if a particular
     * error occurs.
     */
    public addRetry(props: RetryProps = {}): Task {
        super._addRetry(props);
        return this;
    }

    /**
     * Add a recovery handler for this state
     *
     * When a particular error occurs, execution will continue at the error
     * handler instead of failing the state machine execution.
     */
    public addCatch(handler: IChainable, props: CatchProps = {}): Task {
        super._addCatch(handler.startState, props);
        return this;
    }

    /**
     * Continue normal execution with the given state
     */
    public next(next: IChainable): Chain {
        super.makeNext(next.startState);
        return Chain.sequence(this, next);
    }

    /**
     * Return the Amazon States Language object for this state
     */
    public toStateJson(): object {
        return {
            ...this.renderNextEnd(),
            ...this.renderRetryCatch(),
            ...this.renderInputOutput(),
            Type: StateType.Task,
            Comment: this.comment,
            Resource: this.resourceProps.resourceArn,
            ResultPath: renderJsonPath(this.resultPath),
            TimeoutSeconds: this.timeoutSeconds,
            HeartbeatSeconds: this.heartbeatSeconds,
        };
    }

    /**
     * Return the given named metric for this Task
     *
     * @default sum over 5 minutes
     */
    public metric(metricName: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return new cloudwatch.Metric({
            namespace: 'AWS/States',
            metricName,
            dimensions: this.resourceProps.metricDimensions,
            statistic: 'sum',
            ...props
        });
    }

    /**
     * The interval, in milliseconds, between the time the Task starts and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricRunTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixSingular, 'RunTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    public metricScheduleTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixSingular, 'ScheduleTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixSingular, 'Time', { statistic: 'avg', ...props });
    }

    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    public metricScheduled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Scheduled', props);
    }

    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'TimedOut', props);
    }

    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Started', props);
    }

    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Succeeded', props);
    }

    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    public metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Failed', props);
    }

    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    public metricHeartbeatTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'HeartbeatTimedOut', props);
    }

    protected onBindToGraph(graph: StateGraph) {
        super.onBindToGraph(graph);
        for (const policyStatement of this.resourceProps.policyStatements || []) {
            graph.registerPolicyStatement(policyStatement);
        }
    }

    private taskMetric(prefix: string | undefined, suffix: string, props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        if (prefix === undefined) {
            throw new Error('This Task Resource does not expose metrics');
        }
        return this.metric(prefix + suffix, props);
    }
}

/**
 * Interface for objects that can be invoked in a Task state
 */
export interface IStepFunctionsTaskResource {
    /**
     * Return the properties required for using this object as a Task resource
     */
    asStepFunctionsTaskResource(callingTask: Task): StepFunctionsTaskResourceProps;
}

/**
 * Properties that define how to refer to a TaskResource
 */
export interface StepFunctionsTaskResourceProps {
    /**
     * The ARN of the resource
     */
    readonly resourceArn: string;

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
