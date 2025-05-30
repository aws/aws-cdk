import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { AssignableStateOptions, ChoiceTransitionOptions, JsonataCommonOptions, JsonPathCommonOptions, State, StateBaseProps } from './state';
import { UnscopedValidationError } from '../../../core';
import { Chain } from '../chain';
import { Condition } from '../condition';
import { IChainable, INextable, QueryLanguage } from '../types';

/**
 * Properties for defining a Choice state that using JSONPath
 */
export interface ChoiceJsonPathProps extends StateBaseProps, AssignableStateOptions, JsonPathCommonOptions {}

/**
 * Properties for defining a Choice state that using JSONata
 */
export interface ChoiceJsonataProps extends StateBaseProps, AssignableStateOptions, JsonataCommonOptions {}

/**
 * Properties for defining a Choice state
 */
export interface ChoiceProps extends StateBaseProps, AssignableStateOptions, JsonPathCommonOptions, JsonataCommonOptions {}

/**
 * Define a Choice in the state machine
 *
 * A choice state can be used to make decisions based on the execution
 * state.
 */
export class Choice extends State {
  /**
   * Define a Choice using JSONPath in the state machine
   *
   * A choice state can be used to make decisions based on the execution
   * state.
   */
  public static jsonPath(scope: Construct, id: string, props: ChoiceJsonPathProps = {}) {
    return new Choice(scope, id, props);
  }
  /**
   * Define a Choice using JSONata in the state machine
   *
   * A choice state can be used to make decisions based on the execution
   * state.
   */
  public static jsonata(scope: Construct, id: string, props: ChoiceJsonataProps = {}) {
    return new Choice(scope, id, {
      ...props,
      queryLanguage: QueryLanguage.JSONATA,
    });
  }
  public readonly endStates: INextable[] = [];

  constructor(scope: Construct, id: string, props: ChoiceProps = {}) {
    super(scope, id, props);
  }

  /**
   * If the given condition matches, continue execution with the given state
   */
  public when(condition: Condition, next: IChainable, options?: ChoiceTransitionOptions): Choice {
    super.addChoice(condition, next.startState, options);
    return this;
  }

  /**
   * If none of the given conditions match, continue execution with the given state
   *
   * If no conditions match and no otherwise() has been given, an execution
   * error will be raised.
   */
  public otherwise(def: IChainable): Choice {
    super.makeDefault(def.startState);
    return this;
  }

  /**
   * Return a Chain that contains all reachable end states from this Choice
   *
   * Use this to combine all possible choice paths back.
   */
  public afterwards(options: AfterwardsOptions = {}): Chain {
    const endStates = State.filterNextables(State.findReachableEndStates(this, { includeErrorHandlers: options.includeErrorHandlers }));
    if (options.includeOtherwise && this.defaultChoice) {
      throw new UnscopedValidationError(`'includeOtherwise' set but Choice state ${this.stateId} already has an 'otherwise' transition`);
    }
    if (options.includeOtherwise) {
      endStates.push(new DefaultAsNext(this));
    }
    return Chain.custom(this, endStates, this);
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(topLevelQueryLanguage?: QueryLanguage): object {
    return {
      Type: StateType.CHOICE,
      ...this.renderQueryLanguage(topLevelQueryLanguage),
      Comment: this.comment,
      ...this.renderInputOutput(),
      ...this.renderChoices(),
      ...this.renderAssign(topLevelQueryLanguage),
    };
  }
}

/**
 * Options for selecting the choice paths
 */
export interface AfterwardsOptions {
  /**
   * Whether to include error handling states
   *
   * If this is true, all states which are error handlers (added through 'onError')
   * and states reachable via error handlers will be included as well.
   *
   * @default false
   */
  readonly includeErrorHandlers?: boolean;

  /**
   * Whether to include the default/otherwise transition for the current Choice state
   *
   * If this is true and the current Choice does not have a default outgoing
   * transition, one will be added included when .next() is called on the chain.
   *
   * @default false
   */
  readonly includeOtherwise?: boolean;
}

/**
 * Adapter to make the .otherwise() transition settable through .next()
 */
class DefaultAsNext implements INextable {
  constructor(private readonly choice: Choice) {
  }

  public next(state: IChainable): Chain {
    this.choice.otherwise(state);
    return Chain.sequence(this.choice, state);
  }
}
