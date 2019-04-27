import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { renderJsonPath, State, StateType } from './state';

/**
 * Props that are common to all tasks
 */
export interface BasicTaskProps {
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
 * Properties for defining a Task state
 */
export interface TaskProps extends BasicTaskProps {
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
     * What is passed here will be merged with any default parameters
     * configured by the `resource`. For example, a DynamoDB table target
     * will
     *
     * @see
     * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
     *
     * @default No parameters
     */
    readonly parameters?: { [name: string]: any };

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

    /**
     * Additional policy statements to add to the execution role
     *
     * @default No policy roles
     */
    readonly policyStatements?: iam.PolicyStatement[];
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
    private readonly heartbeatSeconds?: number;
    private readonly resourceArn: string;
    private readonly policyStatements?: iam.PolicyStatement[];

    constructor(scope: cdk.Construct, id: string, props: TaskProps) {
        super(scope, id, props);

        this.timeoutSeconds = props.timeoutSeconds;
        this.heartbeatSeconds = props.heartbeatSeconds;
        this.resourceArn = props.resourceArn;
        this.policyStatements = props.policyStatements;
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
            Resource: this.resourceArn,
            ResultPath: renderJsonPath(this.resultPath),
            TimeoutSeconds: this.timeoutSeconds,
            HeartbeatSeconds: this.heartbeatSeconds,
        };
    }

    protected onBindToGraph(graph: StateGraph) {
        super.onBindToGraph(graph);
        for (const policyStatement of this.policyStatements || []) {
            graph.registerPolicyStatement(policyStatement);
        }
    }
}