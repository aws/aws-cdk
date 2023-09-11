import { Duration, TimeZone, Schedule, CronOptions } from 'aws-cdk-lib/core';

/**
 * ScheduleExpression for EventBridge Schedule
 *
 * You can choose from three schedule types when configuring your schedule: rate-based, cron-based, and one-time schedules.
 * Both rate-based and cron-based schedules are recurring schedules.
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html
 */
export abstract class ScheduleExpression extends Schedule {
  /**
   * Construct a one-time schedule from a date.
   *
   * @param date The date and time to use. The millisecond part will be ignored.
   * @param timeZone The time zone to use for interpreting the date. Default: - UTC
   */
  public static at(date: Date, timeZone?: TimeZone): ScheduleExpression {
    return super.protectedAt(date, timeZone);
  }

  /**
   * Construct a schedule from a literal schedule expression
   * @param expression The expression to use. Must be in a format that EventBridge will recognize
   * @param timeZone The time zone to use for interpreting the expression. Default: - UTC
   */
  public static expression(expression: string, timeZone?: TimeZone): ScheduleExpression {
    return super.protectedExpression(expression, timeZone);
  }

  /**
   * Construct a recurring schedule from an interval and a time unit
   *
   * Rates may be defined with any unit of time, but when converted into minutes, the duration must be a positive whole number of minutes.
   */
  public static rate(duration: Duration): ScheduleExpression {
    return super.protectedRate(duration);
  }

  /**
   * Create a recurring schedule from a set of cron fields and time zone.
   */
  public static cron(options: CronOptions): ScheduleExpression {
    return super.protectedCron(options);
  }
}

