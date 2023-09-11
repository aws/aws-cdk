import { Duration, TimeZone, CronOptions as CoreCronOptions, Schedule as ScheduleExpression } from '../../core';

/**
 * Schedule for scheduled scaling actions
 */
export abstract class Schedule extends ScheduleExpression {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that Application AutoScaling will recognize
   */
  public static expression(expression: string): Schedule {
    return super.protectedExpression(expression);
  }

  /**
   * Construct a schedule from an interval and a time unit
   */
  public static rate(duration: Duration): Schedule {
    return super.protectedRate(duration);
  }

  /**
   * Construct a Schedule from a moment in time
   */
  public static at(moment: Date, timeZone?: TimeZone): Schedule {
    return super.protectedAt(moment, timeZone);
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
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions
 * @deprecated use core.CronOptions instead
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
   * The year to run this rule at
   *
   * @default - Every year
   */
  readonly year?: string;

  /**
   * The day of the week to run this rule at
   *
   * @default - Any day of the week
   */
  readonly weekDay?: string;
}
