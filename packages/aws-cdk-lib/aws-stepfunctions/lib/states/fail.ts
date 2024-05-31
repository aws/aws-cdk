import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { renderJsonPath, State } from './state';
import { Token } from '../../../core';
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
   * You can also use an intrinsic function that returns a string to specify this property.
   * The allowed functions include States.Format, States.JsonToString, States.ArrayGetItem, States.Base64Encode, States.Base64Decode, States.Hash, and States.UUID.
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
   * You can also use an intrinsic function that returns a string to specify this property.
   * The allowed functions include States.Format, States.JsonToString, States.ArrayGetItem, States.Base64Encode, States.Base64Decode, States.Hash, and States.UUID.
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
  private static allowedIntrinsics = [
    'States.Format',
    'States.JsonToString',
    'States.ArrayGetItem',
    'States.Base64Encode',
    'States.Base64Decode',
    'States.Hash',
    'States.UUID',
  ];

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
      ErrorPath: this.isIntrinsicString(this.errorPath) ? this.errorPath : renderJsonPath(this.errorPath),
      Cause: this.cause,
      CausePath: this.isIntrinsicString(this.causePath) ? this.causePath : renderJsonPath(this.causePath),
    };
  }

  /**
   * Validate this state
   */
  protected validateState(): string[] {
    const errors = super.validateState();

    if (this.errorPath && this.isIntrinsicString(this.errorPath) && !this.isAllowedIntrinsic(this.errorPath)) {
      errors.push(`You must specify a valid intrinsic function in errorPath. Must be one of ${Fail.allowedIntrinsics.join(', ')}`);
    }

    if (this.causePath && this.isIntrinsicString(this.causePath) && !this.isAllowedIntrinsic(this.causePath)) {
      errors.push(`You must specify a valid intrinsic function in causePath. Must be one of ${Fail.allowedIntrinsics.join(', ')}`);
    }

    if (this.error && this.errorPath) {
      errors.push('Fail state cannot have both error and errorPath');
    }

    if (this.cause && this.causePath) {
      errors.push('Fail state cannot have both cause and causePath');
    }

    return errors;
  }

  private isIntrinsicString(jsonPath?: string): boolean {
    return !Token.isUnresolved(jsonPath) && !jsonPath?.startsWith('$');
  }

  private isAllowedIntrinsic(intrinsic: string): boolean {
    return Fail.allowedIntrinsics.some(allowed => intrinsic.startsWith(allowed));
  }
}
