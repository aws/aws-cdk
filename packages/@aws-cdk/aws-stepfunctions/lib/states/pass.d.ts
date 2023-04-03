import { Construct } from 'constructs';
import { State } from './state';
import { Chain } from '../chain';
import { IChainable, INextable } from '../types';
/**
 * The result of a Pass operation
 */
export declare class Result {
    readonly value: any;
    /**
     * The result of the operation is a string
     */
    static fromString(value: string): Result;
    /**
     * The result of the operation is a number
     */
    static fromNumber(value: number): Result;
    /**
     * The result of the operation is a boolean
     */
    static fromBoolean(value: boolean): Result;
    /**
     * The result of the operation is an object
     */
    static fromObject(value: {
        [key: string]: any;
    }): Result;
    /**
     * The result of the operation is an array
     */
    static fromArray(value: any[]): Result;
    /**
     *
     * @param value result of the Pass operation
     */
    protected constructor(value: any);
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
     * If given, treat as the result of this operation
     *
     * Can be used to inject or replace the current execution state.
     *
     * @default No injected result
     */
    readonly result?: Result;
    /**
     * Parameters pass a collection of key-value pairs, either static values or JSONPath expressions that select from the input.
     *
     * @see
     * https://docs.aws.amazon.com/step-functions/latest/dg/input-output-inputpath-params.html#input-output-parameters
     *
     * @default No parameters
     */
    readonly parameters?: {
        [name: string]: any;
    };
}
/**
 * Define a Pass in the state machine
 *
 * A Pass state can be used to transform the current execution's state.
 */
export declare class Pass extends State implements INextable {
    readonly endStates: INextable[];
    private readonly result?;
    constructor(scope: Construct, id: string, props?: PassProps);
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
    /**
     * Render Parameters in ASL JSON format
     */
    private renderParameters;
}
