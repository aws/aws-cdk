import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';
import { INextable } from '../types';

/**
 * Properties for defining a Fail state
 */
export interface FailProps {
  /**
   * Optional name for this state
   *
   * @default - The construct ID will be used as state name
   */
  readonly stateName?: string;

  /**
   * An optional description for this state
   *
   * @default - No comment
   */
  readonly comment?: string;

  /**
   * Error code used to represent this failure
   *
   * @default - No error code
   */
  readonly error?: string;

  /**
   * JsonPath expression to select part of the state to be the error to this state.
   *
   * @default - No error path
   */
  readonly errorPath?: string;

  /**
   * A description for the cause of the failure
   *
   * @default - No description
   */
  readonly cause?: string;

  /**
   * JsonPath expression to select part of the state to be the cause to this state.
   *
   * @default - No cause path
   */
  readonly causePath?: string;
}

/**
 * Define a Fail state in the state machine
 *
 * Reaching a Fail state terminates the state execution in failure.
 */
export class Fail extends State {
  public readonly endStates: INextable[] = [];

  private readonly error?: string;
  private readonly errorPath?: string;
  private readonly cause?: string;
  private readonly causePath?: string;

  constructor(scope: Construct, id: string, props: FailProps = {}) {
    super(scope, id, props);

    this.error = props.error;
    this.errorPath = props.errorPath;
    this.cause = props.cause;
    this.causePath = props.causePath;
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(): object {
    return {
      Type: StateType.FAIL,
      Comment: this.comment,
      Error: this.error,
      ErrorPath: renderJsonPath(this.errorPath),
      Cause: this.cause,
      CausePath: renderJsonPath(this.causePath),
    };
  }
}