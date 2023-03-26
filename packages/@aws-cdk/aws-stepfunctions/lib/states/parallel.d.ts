import { Construct } from 'constructs';
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { State } from './state';
/**
 * Properties for defining a Parallel state
 */
export interface ParallelProps {
    /**
     * An optional description for this state
     *
     * @default No comment
     */
    readonly comment?: string;
    /**
     * JSONPath expression to select part of the state to be the input to this state.
     *
     * May also be the special value JsonPath.DISCARD, which will cause the effective
     * input to be the empty object {}.
     *
     * @default $
     */
    readonly inputPath?: string;
    /**
     * JSONPath expression to select part of the state to be the output to this state.
     *
     * May also be the special value JsonPath.DISCARD, which will cause the effective
     * output to be the empty object {}.
     *
     * @default $
     */
    readonly outputPath?: string;
    /**
     * JSONPath expression to indicate where to inject the state's output
     *
     * May also be the special value JsonPath.DISCARD, which will cause the state's
     * input to become its output.
     *
     * @default $
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
}
/**
 * Define a Parallel state in the state machine
 *
 * A Parallel state can be used to run one or more state machines at the same
 * time.
 *
 * The Result of a Parallel state is an array of the results of its substatemachines.
 */
export declare class Parallel extends State implements INextable {
    readonly endStates: INextable[];
    private readonly _branches;
    constructor(scope: Construct, id: string, props?: ParallelProps);
    /**
     * Add retry configuration for this state
     *
     * This controls if and how the execution will be retried if a particular
     * error occurs.
     */
    addRetry(props?: RetryProps): Parallel;
    /**
     * Add a recovery handler for this state
     *
     * When a particular error occurs, execution will continue at the error
     * handler instead of failing the state machine execution.
     */
    addCatch(handler: IChainable, props?: CatchProps): Parallel;
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
    /**
     * Define one or more branches to run in parallel
     */
    branch(...branches: IChainable[]): Parallel;
    /**
     * Overwrites State.bindToGraph. Adds branches to
     * the Parallel state here so that any necessary
     * prefixes are appended first.
     */
    bindToGraph(graph: StateGraph): void;
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
    /**
     * Validate this state
     */
    protected validateState(): string[];
}
