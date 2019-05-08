import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { IStepFunctionsTask, StepFunctionsTaskProperties } from '../step-functions-task';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { renderJsonPath, State, StateType } from './state';

/**
 * Props that are common to all tasks
 */
export interface TaskProps {
    /**
     * Actual task to be invoked in this workflow
     */
    readonly task: IStepFunctionsTask;

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
export class Task extends State implements INextable {
    public readonly endStates: INextable[];
    private readonly timeoutSeconds?: number;
    private readonly taskProps: StepFunctionsTaskProperties;

    constructor(scope: cdk.Construct, id: string, props: TaskProps) {
        super(scope, id, props);

        this.timeoutSeconds = props.timeoutSeconds;
        this.taskProps = props.task.bind(this);
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
            Resource: this.taskProps.resourceArn,
            Parameters: this.taskProps.parameters,
            ResultPath: renderJsonPath(this.resultPath),
            TimeoutSeconds: this.timeoutSeconds,
            HeartbeatSeconds: this.taskProps.heartbeatSeconds,
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
            dimensions: this.taskProps.metricDimensions,
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
        return this.taskMetric(this.taskProps.metricPrefixSingular, 'RunTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    public metricScheduleTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixSingular, 'ScheduleTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricTime(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixSingular, 'Time', { statistic: 'avg', ...props });
    }

    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    public metricScheduled(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Scheduled', props);
    }

    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'TimedOut', props);
    }

    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Started', props);
    }

    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Succeeded', props);
    }

    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    public metricFailed(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'Failed', props);
    }

    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    public metricHeartbeatTimedOut(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
        return this.taskMetric(this.taskProps.metricPrefixPlural, 'HeartbeatTimedOut', props);
    }

    protected onBindToGraph(graph: StateGraph) {
        super.onBindToGraph(graph);
        for (const policyStatement of this.taskProps.policyStatements || []) {
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