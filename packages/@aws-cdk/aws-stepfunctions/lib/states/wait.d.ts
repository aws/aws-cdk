import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Chain } from '../chain';
import { IChainable, INextable } from '../types';
import { State } from './state';
/**
 * Represents the Wait state which delays a state machine from continuing for a specified time
 * @see https://docs.aws.amazon.com/step-functions/latest/dg/amazon-states-language-wait-state.html
 */
export declare class WaitTime {
    private readonly json;
    /**
     * Wait a fixed amount of time.
     */
    static duration(duration: cdk.Duration): WaitTime;
    /**
     * Wait until the given ISO8601 timestamp
     *
     * Example value: `2016-03-14T01:59:00Z`
     */
    static timestamp(timestamp: string): WaitTime;
    /**
     * Wait for a number of seconds stored in the state object.
     *
     * Example value: `$.waitSeconds`
     */
    static secondsPath(path: string): WaitTime;
    /**
     * Wait until a timestamp found in the state object.
     *
     * Example value: `$.waitTimestamp`
     */
    static timestampPath(path: string): WaitTime;
    private constructor();
    /**
     * @internal
     */
    get _json(): any;
}
/**
 * Properties for defining a Wait state
 */
export interface WaitProps {
    /**
     * An optional description for this state
     *
     * @default No comment
     */
    readonly comment?: string;
    /**
     * Wait duration.
     */
    readonly time: WaitTime;
}
/**
 * Define a Wait state in the state machine
 *
 * A Wait state can be used to delay execution of the state machine for a while.
 */
export declare class Wait extends State implements INextable {
    readonly endStates: INextable[];
    private readonly time;
    constructor(scope: Construct, id: string, props: WaitProps);
    /**
     * Continue normal execution with the given state
     */
    next(next: IChainable): Chain;
    /**
     * Return the Amazon States Language object for this state
     */
    toStateJson(): object;
}
