import * as cdk from '@aws-cdk/core';
import { INextable } from '../types';
import { StateType } from './private/state-type';
import { State } from './state';

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
export class Fail extends State {
  public readonly endStates: INextable[] = [];

  private readonly error?: string;
  private readonly cause?: string;

  constructor(scope: cdk.Construct, id: string, props: FailProps = {}) {
    super(scope, id, props);

    this.error = props.error;
    this.cause = props.cause;
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(): object {
    return {
      Type: StateType.FAIL,
      Comment: this.comment,
      Error: this.error,
      Cause: this.cause,
    };
  }
}
