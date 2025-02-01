import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { JsonataCommonOptions, JsonPathCommonOptions, State, StateBaseProps } from './state';
import { INextable, QueryLanguage } from '../types';

/**
 * Properties for defining a Succeed state that using JSONPath
 */
export interface SucceedJsonPathProps extends StateBaseProps, JsonPathCommonOptions {}
/**
 * Properties for defining a Succeed state that using JSONata
 */
export interface SucceedJsonataProps extends StateBaseProps, JsonataCommonOptions {}
/**
 * Properties for defining a Succeed state
 */
export interface SucceedProps extends StateBaseProps, JsonPathCommonOptions, JsonataCommonOptions {}

/**
 * Define a Succeed state in the state machine
 *
 * Reaching a Succeed state terminates the state execution in success.
 */
export class Succeed extends State {
  /**
   * Define a Succeed state in the state machine
   *
   * Reaching a Succeed state terminates the state execution in success.
   */
  public static jsonPath(scope: Construct, id: string, props: SucceedJsonPathProps = {}) {
    return new Succeed(scope, id, props);
  }
  /**
   * Define a Succeed state in the state machine
   *
   * Reaching a Succeed state terminates the state execution in success.
   */
  public static jsonata(scope: Construct, id: string, props: SucceedJsonataProps = {}) {
    return new Succeed(scope, id, {
      ...props,
      queryLanguage: QueryLanguage.JSONATA,
    });
  }
  public readonly endStates: INextable[] = [];

  constructor(scope: Construct, id: string, props: SucceedProps = {}) {
    super(scope, id, props);
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(queryLanguage?: QueryLanguage): object {
    return {
      Type: StateType.SUCCEED,
      ...this.renderQueryLanguage(queryLanguage),
      Comment: this.comment,
      ...this.renderInputOutput(),
    };
  }
}
