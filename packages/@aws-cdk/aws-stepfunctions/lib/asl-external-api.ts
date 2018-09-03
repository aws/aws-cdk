import cdk = require('@aws-cdk/cdk');

export interface IChainable {
    /**
     * Return a chain representing this state object.
     */
    toStateChain(): IStateChain;
}

export interface IStateChain extends IChainable {
    /**
     * Add a state or chain onto the existing chain.
     *
     * Returns a new chain with the state/chain added.
     */
    next(state: IChainable): IStateChain;

    /**
     * Add a Catch handlers to the states in the chain
     *
     * If the chain does not consist completely of states that
     * can have error handlers applied, it is wrapped in a Parallel
     * block first.
     */
    onError(errorHandler: IChainable, ...errors: string[]): IStateChain;

    /**
     * Add retries to all states in the chains which can have retries applied
     */
    defaultRetry(retry?: RetryProps): IStateChain;

    /**
     * Return a chain with all states reachable from the current chain.
     *
     * This includes the states reachable via error handler (Catch)
     * transitions.
     */
    closure(): IStateChain;

    /**
     * Apply the closure, then render the state machine.
     */
    renderStateMachine(): RenderedStateMachine;
}

export interface RenderedStateMachine {
    stateMachineDefinition: any;
    policyStatements: cdk.PolicyStatement[];
}

/**
 * Predefined error strings
 */
export class Errors {
    /**
     * Matches any Error.
     */
    public static all = 'States.ALL';

    /**
     * A Task State either ran longer than the “TimeoutSeconds” value, or
     * failed to heartbeat for a time longer than the “HeartbeatSeconds” value.
     */
    public static timeout = 'States.Timeout';

    /**
     * A Task State failed during the execution.
     */
    public static taskFailed = 'States.TaskFailed';

    /**
     * A Task State failed because it had insufficient privileges to execute
     * the specified code.
     */
    public static permissions = 'States.Permissions';

    /**
     * A Task State’s “ResultPath” field cannot be applied to the input the state received.
     */
    public static resultPathMatchFailure = 'States.ResultPathMatchFailure';

    /**
     * A branch of a Parallel state failed.
     */
    public static branchFailed = 'States.BranchFailed';

    /**
     * A Choice state failed to find a match for the condition field extracted
     * from its input.
     */
    public static noChoiceMatched = 'States.NoChoiceMatched';
}

export interface RetryProps {
    errors?: string[];

    /**
     * @default 1
     */
    intervalSeconds?: number;

    /**
     * May be 0 to disable retry in case of multiple entries.
     *
     * @default 3
     */
    maxAttempts?: number;

    /**
     * @default 2
     */
    backoffRate?: number;
}