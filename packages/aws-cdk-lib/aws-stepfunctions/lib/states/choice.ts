import { Construct } from 'constructs';
import { StateType } from './private/state-type';
import { State } from './state';
import { Chain } from '../chain';
import { Condition } from '../condition';
import { IChainable, INextable } from '../types';

/**
 * Properties for defining a Choice state
 */
export interface ChoiceProps {
  /**
   * An optional description for this state
   *
   * @default No comment
   */
  readonly comment?: string;

  /**
   * JSONPath expression to select part of the state to be the input to this state.
   *
   * May also be the special value DISCARD, which will cause the effective
   * input to be the empty object {}.
   *
   * @default $
   */
  readonly inputPath?: string;

  /**
   * JSONPath expression to select part of the state to be the output to this state.
   *
   * May also be the special value DISCARD, which will cause the effective
   * output to be the empty object {}.
   *
   * @default $
   */
  readonly outputPath?: string;
}

/**
 * Define a Choice in the state machine
 *
 * A choice state can be used to make decisions based on the execution
 * state.
 */
export class Choice extends State {
  public readonly endStates: INextable[] = [];

  constructor(scope: Construct, id: string, props: ChoiceProps = {}) {
    super(scope, id, props);
  }

  /**
   * If the given condition matches, continue execution with the given state
   */
  public when(condition: Condition, next: IChainable): Choice {
    super.addChoice(condition, next.startState);
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
      throw new Error(`'includeOtherwise' set but Choice state ${this.stateId} already has an 'otherwise' transition`);
    }
    if (options.includeOtherwise) {
      endStates.push(new DefaultAsNext(this));
    }
    return Chain.custom(this, endStates, this);
  }

  /**
   * Return the Amazon States Language object for this state
   */
  public toStateJson(): object {
    return {
      Type: StateType.CHOICE,
      Comment: this.comment,
      ...this.renderInputOutput(),
      ...this.renderChoices(),
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
