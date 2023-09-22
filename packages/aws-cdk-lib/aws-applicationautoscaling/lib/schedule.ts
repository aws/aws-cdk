import { Duration, TimeZone, CronOptions as CoreCronOptions, Schedule as CoreSchedule } from '../../core';

/**
 * Schedule for scheduled scaling actions
 */
export abstract class Schedule extends CoreSchedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that Application AutoScaling will recognize
   */
  public static expression(expression: string, timeZone?: TimeZone): Schedule {
    return super.protectedExpression(expression, timeZone);
  }

  /**
   * Construct a schedule from an interval and a time unit. Must be a whole number of seconds.
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
    return super.protectedCron(options, 'aws-applicationautoscaling');
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
export interface CronOptions extends CoreCronOptions {}
