import { Duration } from '../lib';

/**
 * Represents a schedule for which scheduled actions can be configured
 *
 * This class has all methods protected instead of public so they can be selectively
 * exposed and/or more specific versions of them can be exposed by derived
 * classes.
 */
export abstract class BaseSchedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use.
   */
  protected static createExpression(expression: string): BaseSchedule {
    return new LiteralSchedule(expression);
  }

  /**
   * Construct a schedule from an interval and a time unit
   */
  protected static createRate(duration: Duration): BaseSchedule {
    if (duration.toSeconds() === 0) {
      throw new Error('Duration cannot be 0');
    }

    let rate = maybeRate(duration.toDays({ integral: false }), 'day');
    if (rate === undefined) { rate = maybeRate(duration.toHours({ integral: false }), 'hour'); }
    if (rate === undefined) { rate = makeRate(duration.toMinutes({ integral: true }), 'minute'); }
    return new LiteralSchedule(rate);
  }

  /**
   * Construct a schedule from a moment in time
   */
  protected static createAt(moment: Date): BaseSchedule {
    return new LiteralSchedule(`at(${formatISO(moment)})`);
  }

  /**
   * Create a schedule from a set of cron fields
   *
   * @param options The options to configure a cron expression
   * @param unix Whether or not the cron expression follows UNIX cron format
   */
  protected static createCron(options: CronOptions, unix?: boolean): BaseSchedule {
    if (options.weekDay !== undefined && options.day !== undefined) {
      throw new Error('Cannot supply both \'day\' and \'weekDay\', use at most one');
    }

    const minute = fallback(options.minute, '*');
    const hour = fallback(options.hour, '*');
    const month = fallback(options.month, '*');

    if(unix) {
      const day = fallback(options.day, '*');
      const weekDay = fallback(options.weekDay, '*');

      return new LiteralSchedule(`${minute} ${hour} ${day} ${month} ${weekDay}`);
    } else {
      const year = fallback(options.year, '*');
      // Weekday defaults to '?' if not supplied. If it is supplied, day must become '?'
      const day = fallback(options.day, options.weekDay !== undefined ? '?' : '*');
      const weekDay = fallback(options.weekDay, '?');

      return new LiteralSchedule(`cron(${minute} ${hour} ${day} ${month} ${weekDay} ${year})`);
    }
  }

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly expressionString: string;

  protected constructor() {
  }
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html#CronExpressions
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

class LiteralSchedule extends BaseSchedule {
  constructor(public readonly expressionString: string) {
    super();
  }
}

function fallback<T>(x: T | undefined, def: T): T {
  return x === undefined ? def : x;
}

function formatISO(date?: Date) {
  if (!date) { return undefined; }

  return date.getUTCFullYear() +
    '-' + pad(date.getUTCMonth() + 1) +
    '-' + pad(date.getUTCDate()) +
    'T' + pad(date.getUTCHours()) +
    ':' + pad(date.getUTCMinutes()) +
    ':' + pad(date.getUTCSeconds());

  function pad(num: number) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  }
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