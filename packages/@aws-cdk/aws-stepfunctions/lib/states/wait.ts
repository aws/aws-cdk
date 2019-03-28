import cdk = require('@aws-cdk/cdk');
import { Chain } from '../chain';
import { IChainable, INextable } from '../types';
import { State, StateType } from './state';

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
     * Wait a fixed number of seconds
     *
     * Exactly one of seconds, secondsPath, timestamp, timestampPath must be supplied.
     */
    readonly seconds?: number;

    /**
     * Wait until the given ISO8601 timestamp
     *
     * Exactly one of seconds, secondsPath, timestamp, timestampPath must be supplied.
     *
     * @example 2016-03-14T01:59:00Z
     */
    readonly timestamp?: string;

    /**
     * Wait for a number of seconds stored in the state object.
     *
     * Exactly one of seconds, secondsPath, timestamp, timestampPath must be supplied.
     *
     * @example $.waitSeconds
     */
    readonly secondsPath?: string;

    /**
     * Wait until a timestamp found in the state object.
     *
     * Exactly one of seconds, secondsPath, timestamp, timestampPath must be supplied.
     *
     * @example $.waitTimestamp
     */
    readonly timestampPath?: string;
}

/**
 * Define a Wait state in the state machine
 *
 * A Wait state can be used to delay execution of the state machine for a while.
 */
export class Wait extends State implements INextable {
    public readonly endStates: INextable[];

    private readonly seconds?: number;
    private readonly timestamp?: string;
    private readonly secondsPath?: string;
    private readonly timestampPath?: string;

    constructor(scope: cdk.Construct, id: string, props: WaitProps) {
        super(scope, id, props);

        this.seconds = props.seconds;
        this.timestamp = props.timestamp;
        this.secondsPath = props.secondsPath;
        this.timestampPath = props.timestampPath;

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
            Type: StateType.Wait,
            Comment: this.comment,
            Seconds: this.seconds,
            Timestamp: this.timestamp,
            SecondsPath: this.secondsPath,
            TimestampPath: this.timestampPath,
            ...this.renderNextEnd(),
        };
    }
}