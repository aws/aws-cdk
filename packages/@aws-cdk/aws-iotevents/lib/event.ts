/**
 * Specifies the actions to be performed when the condition evaluates to TRUE.
 */
export interface Event {
  /**
   * The name of the event
   */
  readonly eventName: string;

  /**
   * The Boolean expression that, when TRUE, causes the actions to be performed.
   *
   * @default None - Defaults to perform the actions always.
   */
  readonly condition?: string;
}
