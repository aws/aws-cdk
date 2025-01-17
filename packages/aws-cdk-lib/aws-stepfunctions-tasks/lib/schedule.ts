import { Duration } from '../../core';

/**
 * Schedule for EventBridge Scheduler
 */
export class Schedule {

  /**
   * Construct a one-time schedule from a Date.
   */
  public static oneTime(time: Date): Schedule {
    const pad = (num: number) => (num < 10 ? '0' + num : num);

    const year = time.getFullYear();
    const month = pad(time.getMonth() + 1);
    const day = pad(time.getDate());
    const hours = pad(time.getHours());
    const minutes = pad(time.getMinutes());
    const seconds = pad(time.getSeconds());

    return new Schedule(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}`);
  }

  /**
   * Construct a rate-based schedule from an interval.
   *
   * The minimum interval is 1 minute.
   */
  public static rate(duration: Duration): Schedule {
    if (duration.toMilliseconds() < Duration.minutes(1).toMilliseconds()) {
      throw new Error('Duration cannot be less than 1 minute');
    }

    // maybeRate method returns the rate if the rate is whole number
    const maybeRate = (value: number, unit: string) => (value > 0 && Number.isInteger(value)) ? `${value} ${unit}` : undefined;

    let rate = maybeRate(duration.toDays({ integral: false }), 'days');
    if (rate === undefined) { rate = maybeRate(duration.toHours({ integral: false }), 'hours'); }
    if (rate === undefined) { rate = maybeRate(duration.toMinutes({ integral: true }), 'minutes'); }

    return new Schedule(`rate(${rate})`);
  }

  /**
   * Create a cron-based schedule from a set of cron fields
   */
  public static cron(options: CronOptions): Schedule {
    if (options.weekDay !== undefined && options.day !== undefined) {
      throw new Error('Cannot supply both \'day\' and \'weekDay\', use at most one');
    }

    const minute = options.minute ?? '*';
    const hour = options.hour ?? '*';
    const month = options.month ?? '*';

    // Weekday defaults to '?' if not supplied. If it is supplied, day must become '?'
    const day = options.day ?? (options.weekDay !== undefined ? '?' : '*');
    const weekDay = options.weekDay ?? '?';

    const year = options.year ?? '*';

    return new Schedule(`cron(${minute} ${hour} ${day} ${month} ${weekDay} ${year})`);
  }

  private constructor(
    /**
     * The Schedule expression
     */
    public readonly expressionString: string) {}
}

/**
 * Options to configure a cron expression
 *
 * All fields are strings so you can use complex expressions. Absence of
 * a field implies '*' or '?', whichever one is appropriate.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch_Synthetics_Canaries_cron.html
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
   * @default - Whichever day of the week that `day` falls on
   */
  readonly weekDay?: string;

  /**
   * The year to run this rule at
   *
   * @default - Every year
   */
  readonly year?: string;
}
