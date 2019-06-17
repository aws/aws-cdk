import cdk = require('@aws-cdk/cdk');
import {Chain} from '../chain';
import {IChainable, INextable} from '../types';
import {renderJsonPath, State, StateType} from './state';

export interface ResultValue {
    readonly stringValue?: string
    readonly numberValue?: number
    readonly booleanValue?: boolean
    readonly mapValue?: {[key: string]: any}
}

export class Result {
    public static fromString(value: string): Result {
        return new Result(ResultType.Text, value);
    }

    public static fromNumber(value: number): Result {
        return new Result(ResultType.Number, value);
    }

    public static fromBoolean(value: boolean): Result {
        return new Result(ResultType.Boolean, value);
    }

    public static fromObject(value: {[key: string]: any}): Result {
        return new Result(ResultType.Object, value);
    }

    public static fromArray(value: any[]): Result {
        return new Result(ResultType.Array, value);
    }

    private constructor(public readonly type: ResultType, public readonly value: any) {
    }
}

export enum ResultType {
    Text,
    Number,
    Boolean,
    Object,
    Array,
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
            ...this.renderNextEnd()
        };
    }
}
