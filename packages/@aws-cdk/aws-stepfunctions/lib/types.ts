import { Chain } from './chain';
import { State } from './states/state';

/**
 * Interface for states that can have 'next' states
 */
export interface INextable {
    next(state: IChainable): Chain;
}

/**
 * Interface for objects that can be used in a Chain
 */
export interface IChainable {
    readonly id: string;
    readonly startState: State;
    readonly endStates: INextable[];
}

/**
 * Predefined error strings
 */
export class Errors {
    /**
     * Matches any Error.
     */
    public static readonly All = 'States.ALL';

    /**
     * A Task State either ran longer than the “TimeoutSeconds” value, or
     * failed to heartbeat for a time longer than the “HeartbeatSeconds” value.
     */
    public static readonly Timeout = 'States.Timeout';

    /**
     * A Task State failed during the execution.
     */
    public static readonly TaskFailed = 'States.TaskFailed';

    /**
     * A Task State failed because it had insufficient privileges to execute
     * the specified code.
     */
    public static readonly Permissions = 'States.Permissions';

    /**
     * A Task State’s “ResultPath” field cannot be applied to the input the state received.
     */
    public static readonly ResultPathMatchFailure = 'States.ResultPathMatchFailure';

    /**
     * A branch of a Parallel state failed.
     */
    public static readonly BranchFailed = 'States.BranchFailed';

    /**
     * A Choice state failed to find a match for the condition field extracted
     * from its input.
     */
    public static readonly NoChoiceMatched = 'States.NoChoiceMatched';
}

/**
 * Retry details
 */
export interface RetryProps {
    /**
     * Errors to retry
     *
     * A list of error strings to retry, which can be either predefined errors
     * (for example Errors.NoChoiceMatched) or a self-defined error.
     *
     * @default All errors
     */
    errors?: string[];

    /**
     * How many seconds to wait initially before retrying
     *
     * @default 1
     */
    intervalSeconds?: number;

    /**
     * How many times to retry this particular error.
     *
     * May be 0 to disable retry for specific errors (in case you have
     * a catch-all retry policy).
     *
     * @default 3
     */
    maxAttempts?: number;

    /**
     * Multiplication for how much longer the wait interval gets on every retry
     *
     * @default 2
     */
    backoffRate?: number;
}

/**
 * Error handler details
 */
export interface CatchProps {
    /**
     * Errors to recover from by going to the given state
     *
     * A list of error strings to retry, which can be either predefined errors
     * (for example Errors.NoChoiceMatched) or a self-defined error.
     *
     * @default All errors
     */
    errors?: string[];

    /**
     * JSONPath expression to indicate where to inject the error data
     *
     * May also be the special value DISCARD, which will cause the error
     * data to be discarded.
     *
     * @default $
     */
    resultPath?: string;
}

/**
 * Special string value to discard state input, output or result
 */
export const DISCARD = 'DISCARD';