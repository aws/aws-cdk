import * as events from 'aws-cdk-lib/aws-events';
import { Duration, TimeZone } from 'aws-cdk-lib/core';

/**
 * ScheduleExpression for EventBridge Schedule
 *
 * You can choose from three schedule types when configuring your schedule: rate-based, cron-based, and one-time schedules.
 * Both rate-based and cron-based schedules are recurring schedules.
 *
 * @see https://docs.aws.amazon.com/scheduler/latest/UserGuide/schedule-types.html
 */
export abstract class ScheduleExpression {
  /**
   * Construct a one-time schedule from a date.
   *
   * @param date The date and time to use. The millisecond part will be ignored.
   * @param timeZone The time zone to use for interpreting the date. Default: - UTC
   */
  public static at(date: Date, timeZone?: TimeZone): ScheduleExpression {
    try {
      const literal = date.toISOString().split('.')[0];
      return new LiteralScheduleExpression(`at(${literal})`, timeZone ?? TimeZone.ETC_UTC);
    } catch (e) {
      if (e instanceof RangeError) {
        throw new Error('Invalid date');
      }
      throw e;
    }
  }

  /**
   * Construct a schedule from a literal schedule expression
   * @param expression The expression to use. Must be in a format that EventBridge will recognize
   * @param timeZone The time zone to use for interpreting the expression. Default: - UTC
   */
  public static expression(expression: string, timeZone?: TimeZone): ScheduleExpression {
    return new LiteralScheduleExpression(expression, timeZone ?? TimeZone.ETC_UTC);
  }

  /**
   * Construct a recurring schedule from an interval and a time unit
   *
   * Rates may be defined with any unit of time, but when converted into minutes, the duration must be a positive whole number of minutes.
   */
  public static rate(duration: Duration): ScheduleExpression {
    const schedule = events.Schedule.rate(duration);
    return new LiteralScheduleExpression(schedule.expressionString);
  }

  /**
   * Create a recurring schedule from a set of cron fields and time zone.
   */
  public static cron(options: CronOptionsWithTimezone): ScheduleExpression {
    const { timeZone, ...cronOptions } = options;
    const schedule = events.Schedule.cron(cronOptions);
    return new LiteralScheduleExpression(schedule.expressionString, timeZone);
  }

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly expressionString: string;

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly timeZone?: TimeZone;

  protected constructor() {}
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html#cron-expressions
 */
export interface CronOptionsWithTimezone extends events.CronOptions {
  /**
   * The timezone to run the schedule in
   *
   * @default - TimeZone.ETC_UTC
   */
  readonly timeZone?: TimeZone;
}

const DEFAULT_TIMEZONE = TimeZone.ETC_UTC;

class LiteralScheduleExpression extends ScheduleExpression {
  constructor(public readonly expressionString: string, public readonly timeZone: TimeZone = DEFAULT_TIMEZONE) {
    super();
  }
}
