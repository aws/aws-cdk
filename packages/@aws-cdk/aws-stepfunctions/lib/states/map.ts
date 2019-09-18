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
     * JSONPath expression to select the array to iterate over
     *
     * @default $
     */
    readonly itemsPath?: string;

    /**
     * The JSON that you want to override your default iteration input
     *
     * @default $
     */
    readonly parameters?: { [key: string]: any };

    /**
     * MaxConcurrency
     * 
     * An upper bound on the number of iterations you want running at once. Default value of 0
     *
     * @default false
     */
    readonly sequential?: boolean;
}

/**
 * Define a Map state in the state machine
 *
 * A Map state can be used to dynamically process elements of an array through sub state machines
 *
 * The Result of a Map state is the transformed array after processing through the iterator state machines.
 */
export class Map extends State implements INextable {
    public readonly endStates: INextable[];

    private readonly maxConcurrency: number;
    private readonly itemsPath?: string;

    constructor(scope: cdk.Construct, id: string, props: MapProps = {}) {
        super(scope, id, props);
        this.endStates = [this];
        this.maxConcurrency = (props.sequential === true) ? 1 : 0;
        this.itemsPath = props.itemsPath;
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
     * Define iterator state machine in Map
     */
    public iterator(iterator: IChainable): Map {
        const name = `Map ${this.stateId} Iterator`;
        super.addIterator(new StateGraph(iterator.startState, name));
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
            ...this.renderNextEnd(),
            ...this.renderInputOutput(),
            ...this.renderRetryCatch(),
            ...this.renderIterator(),
            ...this.renderItemsPath(),
            MaxConcurrency: this.maxConcurrency
        };
    }

    /**
     * Validate this state
     */
    protected validate(): string[] {
        if (!!this.iterator) {
            return ['Map state must have a non-empty iterator'];
        }
        return [];
    }

    private renderItemsPath(): any {
        return {
            ItemsPath: renderJsonPath(this.itemsPath)
        };
    }
}
