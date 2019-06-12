/**
 * Schedule for scheduled event rules
 */
export abstract class Schedule {
  /**
   * Construct a schedule from a literal schedule expression
   *
   * @param expression The expression to use. Must be in a format that Cloudwatch Events will recognize
   */
  public static fromExpression(expression: string): Schedule {
    return new LiteralSchedule(expression);
  }

  /**
   * Construct a schedule from an interval and a time unit
   */
  public static fromRate(interval: number, unit: TimeUnit = TimeUnit.Hour): Schedule {
    const unitStr = interval !== 1 ? `${unit}s` : unit;

    return new LiteralSchedule(`rate(${interval} ${unitStr})`);
  }

  /**
   * Create a schedule from a set of cron fields
   */
  public static fromCron(options: CronOptions): Schedule {
    if (options.weekDay !== undefined && options.day !== undefined) {
      throw new Error(`Cannot supply both 'day' and 'weekDay', use at most one`);
    }

    const minute = ifUndef(options.minute, '*');
    const hour = ifUndef(options.hour, '*');
    const month = ifUndef(options.month, '*');
    const year = ifUndef(options.year, '*');

    // Weekday defaults to '?' if not supplied. If it is supplied, day must become '?'
    const day = ifUndef(options.day, options.weekDay !== undefined ? '?' : '*');
    const weekDay = ifUndef(options.weekDay, '?');

    return new LiteralSchedule(`cron(${minute} ${hour} ${day} ${month} ${weekDay} ${year})`);
  }

  /**
   * Retrieve the expression for this schedule
   */
  public abstract readonly expression: string;

  protected constructor() {
  }
}

/**
 * What unit to interpret the rate in
 */
export enum TimeUnit {
  /**
   * The rate is in minutes
   */
  Minute = 'minute',

  /**
   * The rate is in hours
   */
  Hour = 'hour',

  /**
   * The rate is in days
   */
  Day = 'day'
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expresions. Absence of
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

class LiteralSchedule extends Schedule {
  constructor(public readonly expression: string) {
    super();
  }
}

function ifUndef<T>(x: T | undefined, def: T): T {
  return x === undefined ? def : x;
}