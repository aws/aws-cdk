import cdk = require('@aws-cdk/cdk');
import { INextable } from '../types';
import { State, StateType } from './state';

/**
 * Properties for defining a Fail state
 */
export interface FailProps {
    /**
     * An optional description for this state
     *
     * @default No comment
     */
    comment?: string;

    /**
     * Error code used to represent this failure
     */
    error: string;

    /**
     * A description for the cause of the failure
     *
     * @default No description
     */
    cause?: string;
}

/**
 * Define a Fail state in the state machine
 *
 * Reaching a Fail state terminates the state execution in failure.
 */
export class Fail extends State {
    public readonly endStates: INextable[] = [];

    private readonly error: string;
    private readonly cause?: string;

    constructor(parent: cdk.Construct, id: string, props: FailProps) {
        super(parent, id, props);

        this.error = props.error;
        this.cause = props.cause;
    }

    /**
     * Return the Amazon States Language object for this state
     */
    public toStateJson(): object {
        return {
            Type: StateType.Fail,
            Comment: this.comment,
            Error: this.error,
            Cause: this.cause,
        };
    }
}