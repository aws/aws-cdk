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
   * The condition that is used to determine to cause the actions.
   * When this was evaluated to TRUE, the actions are triggered.
   *
   * @default - none (the actions are always executed)
   */
  readonly when?: Expression;
}
