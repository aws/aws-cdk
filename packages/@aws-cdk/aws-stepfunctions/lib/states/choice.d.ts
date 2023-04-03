import { Construct } from 'constructs';
import { State } from './state';
import { Chain } from '../chain';
import { Condition } from '../condition';
import { IChainable, INextable } from '../types';
/**
 * Properties for defining a Choice state
 */
export interface ChoiceProps {
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
}
/**
 * Define a Choice in the state machine
 *
 * A choice state can be used to make decisions based on the execution
 * state.
 */
export declare class Choice extends State {
    readonly endStates: INextable[];
    constructor(scope: Construct, id: string, props?: ChoiceProps);
    /**
     * If the given condition matches, continue execution with the given state
     */
    when(condition: Condition, next: IChainable): Choice;
    /**
     * If none of the given conditions match, continue execution with the given state
     *
     * If no conditions match and no otherwise() has been given, an execution
     * error will be raised.
     */
    otherwise(def: IChainable): Choice;
    /**
     * Return a Chain that contains all reachable end states from this Choice
     *
     * Use this to combine all possible choice paths back.
     */
    afterwards(options?: AfterwardsOptions): Chain;
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
}
/**
 * Options for selecting the choice paths
 */
export interface AfterwardsOptions {
    /**
     * Whether to include error handling states
     *
     * If this is true, all states which are error handlers (added through 'onError')
     * and states reachable via error handlers will be included as well.
     *
     * @default false
     */
    readonly includeErrorHandlers?: boolean;
    /**
     * Whether to include the default/otherwise transition for the current Choice state
     *
     * If this is true and the current Choice does not have a default outgoing
     * transition, one will be added included when .next() is called on the chain.
     *
     * @default false
     */
    readonly includeOtherwise?: boolean;
}
