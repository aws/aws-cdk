/**
 * Represents a length of time.
 */
export class Duration {
  /**
   * @param amount the amount of Seconds the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Seconds.
   */
  public static seconds(amount: number): Duration {
    return new Duration(amount, TimeUnit.Seconds);
  }

  /**
   * @param amount the amount of Minutes the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Minutes.
   */
  public static minutes(amount: number): Duration {
    return new Duration(amount, TimeUnit.Minutes);
  }

  /**
   * @param amount the amount of Hours the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Hours.
   */
  public static hours(amount: number): Duration {
    return new Duration(amount, TimeUnit.Hours);
  }

  /**
   * @param amount the amount of Days the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Days.
   */
  public static days(amount: number): Duration {
    return new Duration(amount, TimeUnit.Days);
  }

  /**
   * @param duration an ISO-formtted duration to be parsed.
   * @returns the parsed `Duration`.
   */
  public static parse(duration: string): Duration {
    const matches = duration.match(/^PT(?:(\d+)D)?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
    if (!matches) {
      throw new Error(`Not a valid ISO duration: ${duration}`);
    }
    const [, days, hours, minutes, seconds] = matches;
    if (!days && !hours && !minutes && !seconds) {
      throw new Error(`Not a valid ISO duration: ${duration}`);
    }
    return Duration.seconds(
      _toInt(seconds)
      + (_toInt(minutes) * 60)
      + (_toInt(hours) * 3_600)
      + (_toInt(days) * 86_400)
    );

    function _toInt(str: string): number {
      if (!str) { return 0; }
      return Number(str);
    }
  }

  private readonly amount: number;
  private readonly unit: TimeUnit;

  private constructor(amount: number, unit: TimeUnit) {
    if (amount < 0) {
      throw new Error(`Duration amounts cannot be negative. Received: ${amount}`);
    }

    this.amount = amount;
    this.unit = unit;
  }

  /**
   * @returns the value of this `Duration` expressed in Seconds.
   */
  public toSeconds(_opts: TimeConversionOptions = {}): number {
    switch (this.unit) {
      case TimeUnit.Seconds:
        return this.amount;
      case TimeUnit.Minutes:
        return this.amount * 60;
      case TimeUnit.Hours:
        return this.amount * 3600;
      case TimeUnit.Days:
        return this.amount * 86_400;
      default:
        throw new Error(`Unexpected time unit: ${this.unit}`);
    }
  }

  public toMinutes(opts: TimeConversionOptions = {}): number {
    switch (this.unit) {
      case TimeUnit.Seconds:
        return this.safeConversion(60, opts, TimeUnit.Seconds);
      case TimeUnit.Minutes:
        return this.amount;
      case TimeUnit.Hours:
        return this.amount * 60;
      case TimeUnit.Days:
        return this.amount * 1_440;
      default:
        throw new Error(`Unexpected time unit: ${this.unit}`);
    }
  }

  /**
   * @returns the value of this `Duration` expressed in Days.
   */
  public toDays(opts: TimeConversionOptions = {}): number {
    switch (this.unit) {
      case TimeUnit.Seconds:
        return this.safeConversion(86_400, opts, TimeUnit.Days);
      case TimeUnit.Minutes:
        return this.safeConversion(1_440, opts, TimeUnit.Days);
      case TimeUnit.Hours:
        return this.safeConversion(24, opts, TimeUnit.Days);
      case TimeUnit.Days:
        return this.amount;
      default:
        throw new Error(`Unexpected time unit: ${this.unit}`);
    }
  }

  /**
   * @returns ISO representation of this period.
   */
  public toISOString(): string {
    if (this.amount === 0) { return 'PT0S'; }
    switch (this.unit) {
      case TimeUnit.Seconds:
        return `PT${this.fractionDuration('S', 60, Duration.minutes)}`;
      case TimeUnit.Minutes:
        return `PT${this.fractionDuration('M', 60, Duration.hours)}`;
      case TimeUnit.Hours:
        return `PT${this.fractionDuration('H', 24, Duration.days)}`;
      case TimeUnit.Days:
        return `PT${this.amount}D`;
      default:
        throw new Error(`Unexpected time unit: ${this.unit}`);
    }
  }

  public toString(): string {
    return `${this.amount} ${this.unit}`;
  }

  /**
   * Divides the current duration by a certain amount and throws an exception if `opts` requires `integral` conversion
   * and the requirement is not satisfied.
   *
   * @param divisor    the value to divide `this.amount` by.
   * @param opts       conversion options instructing whether integral conversion is required or not.
   * @param targetUnit the unit of time we are converting to, so it can be used in the error message when needed
   *
   * @returns the result of `this.amount / divisor`.
   */
  private safeConversion(divisor: number, { integral = true }: TimeConversionOptions, targetUnit: TimeUnit): number {
    const remainder = this.amount % divisor;
    if (integral && remainder !== 0) {
      throw new Error(`Impossible intergal conversion of ${this} to ${targetUnit} was requested`);
    }
    return this.amount / divisor;
  }

  private fractionDuration(symbol: string, modulus: number, next: (amount: number) => Duration): string {
    if (this.amount < modulus) {
      return `${this.amount}${symbol}`;
    }
    const remainder = this.amount % modulus;
    const quotient = next((this.amount - remainder) / modulus).toISOString().slice(2);
    return remainder > 0
      ? `${quotient}${remainder}${symbol}`
      : quotient;
  }
}

/**
 * Options for how to convert time to a different unit.
 */
export interface TimeConversionOptions {
  /**
   * If `true`, conversions into a larger time unit (e.g. `Seconds` to `Mintues`) will fail if the result is not an
   * integer.
   *
   * @default true
   */
  readonly integral?: boolean;
}

const enum TimeUnit {
  Seconds = 's',
  Minutes = 'minutes',
  Hours = 'hours',
  Days = 'days'
}

/**
 * Helpful syntax sugar for turning an optional `Duration` into a count of seconds.
 *
 * @param duration an optional duration to convert into an amount of sunctions.
 *
 * @return `duration && duration.toSeconds()`.
 */
export function toSeconds(duration: Duration | undefined): number | undefined {
  return duration && duration.toSeconds();
}
