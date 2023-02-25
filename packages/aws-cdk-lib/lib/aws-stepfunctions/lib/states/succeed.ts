import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { State } from './state';
import { INextable } from '../types';

/**
 * Properties for defining a Succeed state
 */
export interface SucceedProps {
  /**
   * An optional description for this state
   *
   * @default No comment
   */
  readonly comment?: string;

  /**
   * JSONPath expression to select part of the state to be the input to this state.
   *
   * May also be the special value JsonPath.DISCARD, which will cause the effective
   * input to be the empty object {}.
   *
   * @default $
   */
  readonly inputPath?: string;

  /**
   * JSONPath expression to select part of the state to be the output to this state.
   *
   * May also be the special value JsonPath.DISCARD, which will cause the effective
   * output to be the empty object {}.
   *
   * @default $
   */
  readonly outputPath?: string;

}

/**
 * Define a Succeed state in the state machine
 *
 * Reaching a Succeed state terminates the state execution in success.
 */
export class Succeed extends State {
  public readonly endStates: INextable[] = [];

  constructor(scope: Construct, id: string, props: SucceedProps = {}) {
    super(scope, id, props);
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(): object {
    return {
      Type: StateType.SUCCEED,
      Comment: this.comment,
      ...this.renderInputOutput(),
    };
  }
}
