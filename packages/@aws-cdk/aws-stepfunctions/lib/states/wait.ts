import cdk = require('@aws-cdk/cdk');
import { Chain } from '../chain';
import { IChainable, INextable } from '../types';
import { State, StateType } from './state';

export class WaitDuration {
    /**
     * Wait a fixed number of seconds
     */
    public static seconds(duration: number) { return new WaitDuration({ Seconds: duration }); }

    /**
     * Wait until the given ISO8601 timestamp
     *
     * @example 2016-03-14T01:59:00Z
     */
    public static timestamp(timestamp: string) { return new WaitDuration({ Timestamp: timestamp }); }

    /**
     * Wait for a number of seconds stored in the state object.
     *
     * @example $.waitSeconds
     */
    public static secondsPath(path: string) { return new WaitDuration({ SecondsPath: path }); }

    /**
     * Wait until a timestamp found in the state object.
     *
     * @example $.waitTimestamp
     */
    public static timestampPath(path: string) { return new WaitDuration({ TimestampPath: path }); }

    private constructor(private readonly json: any) { }

    /**
     * @internal
     */
    public get _json() {
        return this.json;
    }
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
    readonly duration: WaitDuration;
}

/**
 * Define a Wait state in the state machine
 *
 * A Wait state can be used to delay execution of the state machine for a while.
 */
export class Wait extends State implements INextable {
    public readonly endStates: INextable[];

    private readonly duration: WaitDuration;

    constructor(scope: cdk.Construct, id: string, props: WaitProps) {
        super(scope, id, props);

        this.duration = props.duration;
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
            ...this.duration._json,
            ...this.renderNextEnd(),
        };
    }
}