import cloudwatch = require('@aws-cdk/aws-cloudwatch');
import cdk = require('@aws-cdk/cdk');
import { CatchProps, Errors, IChainable, IStateChain, RetryProps } from '../asl-external-api';
import { IInternalState, StateType, TransitionType } from '../asl-internal-api';
import { StateChain } from '../asl-state-chain';
import { State } from './state';
import { renderRetries } from './util';

export interface TaskProps {
    resource: IStepFunctionsTaskResource;
    inputPath?: string;
    outputPath?: string;
    resultPath?: string;
    timeoutSeconds?: number;
    heartbeatSeconds?: number;
    comment?: string;
}

export class Task extends State {
    private static Internals = class implements IInternalState {
        public readonly canHaveCatch = true;
        public readonly stateId: string;
        public readonly policyStatements: cdk.PolicyStatement[];

        constructor(private readonly task: Task) {
            this.stateId = task.stateId;
            this.policyStatements = task.resourceProps.policyStatements || [];
        }

        public renderState() {
            return {
                ...this.task.renderBaseState(),
                ...renderRetries(this.task.retries),
                ...this.task.transitions.renderSingle(TransitionType.Next, { End: true }),
                ...this.task.transitions.renderList(TransitionType.Catch),
            };
        }

        public addNext(targetState: IStateChain): void {
            this.task.addNextTransition(targetState);
        }

        public addCatch(targetState: IStateChain, props: CatchProps = {}): void {
            this.task.transitions.add(TransitionType.Catch, targetState, {
                ErrorEquals: props.errors ? props.errors : [Errors.all],
                ResultPath: props.resultPath
            });
        }

        public addRetry(retry?: RetryProps): void {
            this.task.retry(retry);
        }

        public accessibleChains() {
            return this.task.accessibleStates();
        }

        public get hasOpenNextTransition(): boolean {
            return !this.task.hasNextTransition;
        }
    };

    private readonly resourceProps: StepFunctionsTaskResourceProps;
    private readonly retries = new Array<RetryProps>();

    constructor(parent: cdk.Construct, id: string, props: TaskProps) {
        super(parent, id, {
            Type: StateType.Task,
            InputPath: props.inputPath,
            OutputPath: props.outputPath,
            Resource: new cdk.Token(() => this.resourceProps.resourceArn),
            ResultPath: props.resultPath,
            TimeoutSeconds: props.timeoutSeconds,
            HeartbeatSeconds: props.heartbeatSeconds,
            Comment: props.comment,
        });
        this.resourceProps = props.resource.asStepFunctionsTaskResource(this);
    }

    public next(sm: IChainable): IStateChain {
        return this.toStateChain().next(sm);
    }

    public onError(handler: IChainable, props?: CatchProps): IStateChain {
        return this.toStateChain().onError(handler, props);
    }

    public retry(props: RetryProps = {}): Task {
        if (!props.errors) {
            props.errors = [Errors.all];
        }
        this.retries.push(props);
        return this;
    }

    public toStateChain(): IStateChain {
        return new StateChain(new Task.Internals(this));
    }

    /**
     * Return the given named metric for this Task
     *
     * @default sum over 5 minutes
     */
    public metric(metricName: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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
    public metricRunTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixSingular, 'RunTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, for which the activity stays in the schedule state.
     *
     * @default average over 5 minutes
     */
    public metricScheduleTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixSingular, 'ScheduleTime', { statistic: 'avg', ...props });
    }

    /**
     * The interval, in milliseconds, between the time the activity is scheduled and the time it closes.
     *
     * @default average over 5 minutes
     */
    public metricTime(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixSingular, 'ActivityTime', { statistic: 'avg', ...props });
    }

    /**
     * Metric for the number of times this activity is scheduled
     *
     * @default sum over 5 minutes
     */
    public metricScheduled(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Scheduled', props);
    }

    /**
     * Metric for the number of times this activity times out
     *
     * @default sum over 5 minutes
     */
    public metricTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'TimedOut', props);
    }

    /**
     * Metric for the number of times this activity is started
     *
     * @default sum over 5 minutes
     */
    public metricStarted(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Started', props);
    }

    /**
     * Metric for the number of times this activity succeeds
     *
     * @default sum over 5 minutes
     */
    public metricSucceeded(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Succeeded', props);
    }

    /**
     * Metric for the number of times this activity fails
     *
     * @default sum over 5 minutes
     */
    public metricFailed(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'Failed', props);
    }

    /**
     * Metric for the number of times the heartbeat times out for this activity
     *
     * @default sum over 5 minutes
     */
    public metricHeartbeatTimedOut(props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
        return this.taskMetric(this.resourceProps.metricPrefixPlural, 'HeartbeatTimedOut', props);
    }

    private taskMetric(prefix: string | undefined, suffix: string, props?: cloudwatch.MetricCustomization): cloudwatch.Metric {
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

export interface StepFunctionsTaskResourceProps {
    resourceArn: string;
    policyStatements?: cdk.PolicyStatement[];
    metricPrefixSingular?: string;
    metricPrefixPlural?: string;
    metricDimensions?: cloudwatch.DimensionHash;
}