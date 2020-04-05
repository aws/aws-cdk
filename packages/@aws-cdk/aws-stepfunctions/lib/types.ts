import { Duration } from '@aws-cdk/core';
import { Chain } from './chain';
import { State } from './states/state';

/**
 * Interface for states that can have 'next' states
 */
export interface INextable {
  /**
   * Go to the indicated state after this state
   *
   * @returns The chain of states built up
   */
  next(state: IChainable): Chain;
}

/**
 * Interface for objects that can be used in a Chain
 */
export interface IChainable {
  /**
   * Descriptive identifier for this chainable
   */
  readonly id: string;

  /**
   * The start state of this chainable
   */
  readonly startState: State;

  /**
   * The chainable end state(s) of this chainable
   */
  readonly endStates: INextable[];
}

/**
 * Predefined error strings
 * Error names in Amazon States Language - https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html
 */
export class Errors {
  /**
   * Matches any Error.
   */
  public static readonly ALL = 'States.ALL';

  /**
   * A Task State either ran longer than the “TimeoutSeconds” value, or
   * failed to heartbeat for a time longer than the “HeartbeatSeconds” value.
   */
  public static readonly TIMEOUT = 'States.Timeout';

  /**
   * A Task State failed during the execution.
   */
  public static readonly TASKS_FAILED = 'States.TaskFailed';

  /**
   * A Task State failed because it had insufficient privileges to execute
   * the specified code.
   */
  public static readonly PERMISSIONS = 'States.Permissions';

  /**
   * A Task State’s “ResultPath” field cannot be applied to the input the state received.
   */
  public static readonly RESULT_PATH_MATCH_FAILURE = 'States.ResultPathMatchFailure';

  /**
   * A branch of a Parallel state failed.
   */
  public static readonly BRANCH_FAILED = 'States.BranchFailed';

  /**
   * A Choice state failed to find a match for the condition field extracted
   * from its input.
   */
  public static readonly NO_CHOICE_MATCHED = 'States.NoChoiceMatched';
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
  readonly errors?: string[];

  /**
   * How many seconds to wait initially before retrying
   *
   * @default Duration.seconds(1)
   */
  readonly interval?: Duration;

  /**
   * How many times to retry this particular error.
   *
   * May be 0 to disable retry for specific errors (in case you have
   * a catch-all retry policy).
   *
   * @default 3
   */
  readonly maxAttempts?: number;

  /**
   * Multiplication for how much longer the wait interval gets on every retry
   *
   * @default 2
   */
  readonly backoffRate?: number;
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
  readonly errors?: string[];

  /**
   * JSONPath expression to indicate where to inject the error data
   *
   * May also be the special value DISCARD, which will cause the error
   * data to be discarded.
   *
   * @default $
   */
  readonly resultPath?: string;
}

/**
 * Special string value to discard state input, output or result
 */
export const DISCARD = 'DISCARD';
