import cdk = require('@aws-cdk/cdk');
import {Chain} from '../chain';
import {IChainable, INextable} from '../types';
import {renderJsonPath, State, StateType} from './state';

export abstract class Result {
    public static fromString(value: string): StringResult {
        return new StringResult(value);
    }

    public static fromNumber(value: number): NumberResult {
        return new NumberResult(value);
    }

    public static fromBoolean(value: boolean): BooleanResult {
        return new BooleanResult(value);
    }

    public static fromMap(value: {[key: string]: any}): MapResult {
        return new MapResult(value);
    }

    public abstract value: any;
}

export class StringResult extends Result {
    public readonly value: string;

    constructor(value: string) {
        super();

        this.value = value;
    }
}

export class NumberResult extends Result {
    public readonly value: number;

    constructor(value: number) {
        super();

        this.value = value;
    }
}

export class BooleanResult extends Result {
    readonly value: boolean;

    constructor(value: boolean) {
        super();

        this.value = value;
    }
}

export class ArrayResult extends Result {
    public readonly value: any[];

    constructor(value: any[]) {
        super();

        this.value = value;
    }
}

export class MapResult extends Result {
    public readonly value: {[key: string]: any};

    constructor(value: {[key: string]: any}) {
        super();

        this.value = value;
    }
}

/**
 * Properties for defining a Pass state
 */
export interface PassProps {
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
     * If given, treat as the result of this operation
     *
     * Can be used to inject or replace the current execution state.
     *
     * @default No injected result
     */
    readonly result?: Result;
}

/**
 * Define a Pass in the state machine
 *
 * A Pass state can be used to transform the current exeuction's state.
 */
export class Pass extends State implements INextable {
    public readonly endStates: INextable[];

    private readonly result?: Result;

    constructor(scope: cdk.Construct, id: string, props: PassProps = {}) {
        super(scope, id, props);

        this.result = props.result;
        this.endStates = [this];
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
            Type: StateType.Pass,
            Comment: this.comment,
            Result: this.result ? this.result.value : undefined,
            ResultPath: renderJsonPath(this.resultPath),
            ...this.renderInputOutput(),
            ...this.renderNextEnd(),
        };
    }
}
