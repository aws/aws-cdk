import { Construct } from 'constructs';
import { Annotations } from './annotations';
import { Duration } from './duration';
import { TimeZone } from './time-zone';

/**
 * A Core Schedule. This construct is not meant to be used as is or exposed to consumers in other modules.
 * It is meant to be extended by other modules that require some sort of schedule implementation. All
 * methods in `core.Schedule` are protected, so that construct authors can decide which APIs to expose.
 *
 * Note that rates cannot be defined in fractions of minutes.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html
 */
export abstract class Schedule {
  /**
   * Construct a one-time schedule from a date.
   *
   * @param date The date and time to use. The millisecond part will be ignored.
   * @param timeZone The time zone to use for interpreting the date. Default: - UTC
   */
  protected static protectedAt(date: Date, timeZone?: TimeZone): Schedule {
    try {
      const literal = date.toISOString().split('.')[0];
      return new LiteralSchedule(`at(${literal})`, timeZone ?? TimeZone.ETC_UTC);
    } catch (e) {
      if (e instanceof RangeError) {
        throw new Error('Invalid date');
      }
      throw e;
    }
  }

  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that EventBridge will recognize
   * @param timeZone The time zone, if applicable. This is only valid for 'at' and 'cron' expressions
   */
  protected static protectedExpression(expression: string, timeZone?: TimeZone): Schedule {
    return new LiteralSchedule(expression, timeZone);
  }

  /**
   * Construct a schedule from an interval and a time unit
   *
   * Rates may be defined with any unit of time, but when converted into minutes, the duration must be a positive whole number of minutes.
   */
  protected static protectedRate(duration: Duration): Schedule {
    if (duration.isUnresolved()) {
      const validDurationUnit = ['minute', 'minutes', 'hour', 'hours', 'day', 'days'];
      if (validDurationUnit.indexOf(duration.unitLabel()) === -1) {
        throw new Error("Allowed units for scheduling are: 'minute', 'minutes', 'hour', 'hours', 'day', 'days'");
      }
      return new LiteralSchedule(`rate(${duration.formatTokenToNumber()})`);
    }
    if (duration.toMinutes() === 0) {
      throw new Error('Duration cannot be 0');
    }

    let rate = maybeRate(duration.toDays({ integral: false }), 'day');
    if (rate === undefined) { rate = maybeRate(duration.toHours({ integral: false }), 'hour'); }
    if (rate === undefined) { rate = makeRate(duration.toMinutes({ integral: true }), 'minute'); }
    return new LiteralSchedule(rate);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  protected static protectedCron(options: CronOptions): Schedule {
    if (options.weekDay !== undefined && options.day !== undefined &&
      !(options.weekDay === '*' && options.day === '*') // special case for aws-autoscaling
    ) {
      throw new Error('Cannot supply both \'day\' and \'weekDay\', use at most one');
    }

    const minute = fallback(options.minute, '*');
    const hour = fallback(options.hour, '*');
    const month = fallback(options.month, '*');
    const year = fallback(options.year, '*');

    // Weekday defaults to '?' if not supplied. If it is supplied, day must become '?'
    const day = fallback(options.day, options.weekDay !== undefined ? '?' : '*');
    const weekDay = fallback(options.weekDay, '?');

    return new class extends Schedule {
      public readonly expressionString = `cron(${minute} ${hour} ${day} ${month} ${weekDay} ${year})`;
      public _bind(scope: Construct) {
        if (!options.minute) {
          Annotations.of(scope).addWarningV2('@aws-cdk/core:scheduleDefaultRunsEveryMinute', 'cron: If you don\'t pass \'minute\', by default the event runs every minute. Pass \'minute: \'*\'\' if that\'s what you intend, or \'minute: 0\' to run once per hour instead.');
        }
        return new LiteralSchedule(this.expressionString, options.timeZone);
      }
    };
  }

  /**
   * Retrieve the expression for this schedule.
   */
  public abstract readonly expressionString: string;

  /**
   * The timezone of the expression, if applicable.
   */
  public readonly timeZone?: TimeZone = undefined;

  protected constructor() {}

  /**
   * @internal
   */
  public abstract _bind(scope: Construct): void;
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see https://docs.aws.amazon.com/eventbridge/latest/userguide/scheduled-events.html#cron-expressions
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

  /**
   * Retrieve the expression for this schedule
   *
   * @default TimeZone.ETC_UTC
   */
  readonly timeZone?: TimeZone;
}

const DEFAULT_TIMEZONE = TimeZone.ETC_UTC;

class LiteralSchedule extends Schedule {
  constructor(
    public readonly expressionString: string,
    public readonly timeZone: TimeZone = DEFAULT_TIMEZONE,
  ) {
    super();
  }

  public _bind() {}
}

function fallback<T>(x: T | undefined, def: T): T {
  return x ?? def;
}

/**
 * Return the rate if the rate is whole number
 */
function maybeRate(interval: number, singular: string) {
  if (interval === 0 || !Number.isInteger(interval)) { return undefined; }
  return makeRate(interval, singular);
}

/**
 * Return 'rate(${interval} ${singular}(s))` for the interval
 */
function makeRate(interval: number, singular: string) {
  return interval === 1 ? `rate(1 ${singular})` : `rate(${interval} ${singular}s)`;
}
