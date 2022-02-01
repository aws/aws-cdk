import { Expression } from './expression';
import { State } from './state';

/**
 * The base interface for events.
 */
interface IEventBase {
  /**
   * The name of the event.
   */
  readonly eventName: string;
}

/**
 * Specifies the actions to be performed when the condition evaluates to TRUE.
 */
export interface IEvent extends IEventBase {
  /**
   * The Boolean expression that, when TRUE, causes the actions to be performed.
   *
   * @default - none (the actions are always executed)
   */
  readonly condition?: Expression;
}

/**
 * Specifies the state transition and the actions to be performed when the condition evaluates to TRUE.
 */
export interface ITransitionEvent extends IEventBase {
  /**
   * The Boolean expression that, when TRUE, causes the state transition and the actions to be performed.
   */
  readonly condition: Expression;

  /**
   * The next state to transit to. When the resuld of condition expression is TRUE, the state is transited.
   */
  readonly nextState: State;
}
