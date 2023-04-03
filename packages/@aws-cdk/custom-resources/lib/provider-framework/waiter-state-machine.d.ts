import { Grant, IGrantable } from '@aws-cdk/aws-iam';
import { IFunction } from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';
import { Construct } from 'constructs';
export interface WaiterStateMachineProps {
    /**
     * The main handler that notifies if the waiter to decide 'complete' or 'incomplete'.
     */
    readonly isCompleteHandler: IFunction;
    /**
     * The handler to call if the waiter times out and is incomplete.
     */
    readonly timeoutHandler: IFunction;
    /**
     * The interval to wait between attempts.
     */
    readonly interval: Duration;
    /**
     * Number of attempts.
     */
    readonly maxAttempts: number;
    /**
     * Backoff between attempts.
     */
    readonly backoffRate: number;
}
/**
 * A very simple StateMachine construct highly customized to the provider framework.
 * This is so that this package does not need to depend on aws-stepfunctions module.
 *
 * The state machine continuously calls the isCompleteHandler, until it succeeds or times out.
 * The handler is called `maxAttempts` times with an `interval` duration and a `backoffRate` rate.
 */
export declare class WaiterStateMachine extends Construct {
    readonly stateMachineArn: string;
    constructor(scope: Construct, id: string, props: WaiterStateMachineProps);
    grantStartExecution(identity: IGrantable): Grant;
}
