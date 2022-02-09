import { IAction } from './action';
import { Expression } from './expression';

/**
 * Specifies the actions to be performed when the condition evaluates to TRUE.
 */
export interface Event {
  /**
   * The name of the event.
   */
  readonly eventName: string;

  /**
   * The Boolean expression that, when TRUE, causes the actions to be performed.
   *
   * @default - none (the actions are always executed)
   */
  readonly condition?: Expression;

  /**
   * The actions to be performed.
   *
   * @default - no actions will be performed
   */
  readonly actions?: IAction[];
}
