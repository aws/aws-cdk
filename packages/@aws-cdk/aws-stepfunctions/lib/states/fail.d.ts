import { Construct } from 'constructs';
import { State } from './state';
import { INextable } from '../types';
/**
 * Properties for defining a Fail state
 */
export interface FailProps {
    /**
     * An optional description for this state
     *
     * @default No comment
     */
    readonly comment?: string;
    /**
     * Error code used to represent this failure
     *
     * @default No error code
     */
    readonly error?: string;
    /**
     * A description for the cause of the failure
     *
     * @default No description
     */
    readonly cause?: string;
}
/**
 * Define a Fail state in the state machine
 *
 * Reaching a Fail state terminates the state execution in failure.
 */
export declare class Fail extends State {
    readonly endStates: INextable[];
    private readonly error?;
    private readonly cause?;
    constructor(scope: Construct, id: string, props?: FailProps);
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
}
