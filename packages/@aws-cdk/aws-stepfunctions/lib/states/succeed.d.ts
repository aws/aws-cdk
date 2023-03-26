import { Construct } from 'constructs';
import { INextable } from '../types';
import { State } from './state';
/**
 * Properties for defining a Succeed state
 */
export interface SucceedProps {
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
}
/**
 * Define a Succeed state in the state machine
 *
 * Reaching a Succeed state terminates the state execution in success.
 */
export declare class Succeed extends State {
    readonly endStates: INextable[];
    constructor(scope: Construct, id: string, props?: SucceedProps);
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
}
