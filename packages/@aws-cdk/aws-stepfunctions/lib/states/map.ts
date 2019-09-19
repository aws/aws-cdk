import cdk = require('@aws-cdk/core');
import { Chain } from '../chain';
import { StateGraph } from '../state-graph';
import { CatchProps, IChainable, INextable, RetryProps } from '../types';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';

/**
 * Properties for defining a Map state
 */
export interface MapProps {
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
     * The “MaxConcurrency” field’s value is an integer that provides an
     * upper bound on how many invocations of the Iterator may run in parallel.
     *
     * @default 0
     */
    readonly maxConcurrency?: number;
}

/**
 * Define a Map state in the state machine
 *
 * A Map state can be used to run one or more state machines at the same
 * time.
 *
 * The Result of a Map state is an array of the results of its substatemachines.
 */
export class Map extends State implements INextable {
    public readonly endStates: INextable[];

    /**
     * Usually, State Properties are contained in the state.ts file, but maxConcurrency
     * only exists in this one state (for now).
     */
    protected readonly maxConcurrency: string;

    constructor(scope: cdk.Construct, id: string, props: MapProps = {}) {
        super(scope, id, props);

        this.endStates = [this];
    }

    /**
     * Add retry configuration for this state
     *
     * This controls if and how the execution will be retried if a particular
     * error occurs.
     */
    public addRetry(props: RetryProps = {}): Map {
        super._addRetry(props);
        return this;
    }

    /**
     * Add a recovery handler for this state
     *
     * When a particular error occurs, execution will continue at the error
     * handler instead of failing the state machine execution.
     */
    public addCatch(handler: IChainable, props: CatchProps = {}): Map {
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
     * Define one or more graphs to run in map
     */
    public dynamicBranch(graph: IChainable): Map {
        const name = `Dynamic Map '${this.stateId}'`;
        super.addDynamicBranch(new StateGraph(graph.startState, name));
        return this;
    }

    /**
     * Return the Amazon States Language object for this state
     */
    public toStateJson(): object {
        return {
            Type: StateType.MAP,
            Comment: this.comment,
            ResultPath: renderJsonPath(this.resultPath),
            MaxConcurrency: this.maxConcurrency,
            ...this.renderNextEnd(),
            ...this.renderInputOutput(),
            ...this.renderRetryCatch(),
            ...this.renderDynamicMap(),
        };
    }

    /**
     * Validate this state
     */
    protected validate(): string[] {
        if (this.branches.length === 0) {
            return ['Map must have at least one branch'];
        }
        return [];
    }
}
