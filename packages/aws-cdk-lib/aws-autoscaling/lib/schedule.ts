import { CronOptions as CoreCronOptions, Schedule as ScheduleExpression, TimeZone } from '../../core';

/**
 * Schedule for scheduled scaling actions
 */
export abstract class Schedule extends ScheduleExpression {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that AutoScaling will recognize
   * @see http://crontab.org/
   */
  public static expression(expression: string, timeZone?: TimeZone): Schedule {
    return super.protectedExpression(expression, timeZone);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  public static cron(options: CoreCronOptions): Schedule {
    return super.protectedCron(options);
  }
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see http://crontab.org/
 * @deprecated use core.CronOptions
 */
export interface CronOptions {
  /**
   * The minute to run this rule at
   *
   * @default - Every minute
   */
  readonly minute?: string;

  /**
   * The hour to run this rule at
   *
   * @default - Every hour
   */
  readonly hour?: string;

  /**
   * The day of the month to run this rule at
   *
   * @default - Every day of the month
   */
  readonly day?: string;

  /**
   * The month to run this rule at
   *
   * @default - Every month
   */
  readonly month?: string;

  /**
   * The day of the week to run this rule at
   *
   * @default - Any day of the week
   */
  readonly weekDay?: string;
}
