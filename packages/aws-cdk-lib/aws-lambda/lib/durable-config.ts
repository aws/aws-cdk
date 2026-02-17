import type { Duration } from '../../core';

/**
 * Configuration for durable functions.
 *
 * Lambda durable functions allow for long-running executions with persistent state.
 */
export interface DurableConfig {
  /**
   * The amount of time that Lambda allows a durable function to run before stopping it.
   *
   * Must be between 1 and 31,622,400 seconds (366 days).
   */
  readonly executionTimeout: Duration;

  /**
   * The number of days after a durable execution is closed that Lambda retains its history.
   *
   * Must be between 1 and 90 days.
   *
   * The underlying configuration is expressed in whole numbers of days. Providing a Duration that
   * does not represent a whole number of days will result in a runtime or deployment error.
   *
   * @default Duration.days(14)
   */
  readonly retentionPeriod?: Duration;
}
