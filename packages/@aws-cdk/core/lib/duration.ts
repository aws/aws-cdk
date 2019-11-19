import { Token } from "./token";

/**
 * Represents a length of time.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * Whent he amount is passed as an token, unit conversion is not possible.
 */
export class Duration {
  /**
   * @param amount the amount of Milliseconds the `Duration` will represent.
   * @returns a new `Duration` representing `amount` ms.
   */
  public static millis(amount: number): Duration {
    return new Duration(amount, TimeUnit.Milliseconds);
  }

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
   * Parse a period formatted according to the ISO 8601 standard (see https://www.iso.org/fr/standard/70907.html).
   *
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
      + (_toInt(minutes) * TimeUnit.Minutes.inSeconds)
      + (_toInt(hours) * TimeUnit.Hours.inSeconds)
      + (_toInt(days) * TimeUnit.Days.inSeconds)
    );

    function _toInt(str: string): number {
      if (!str) { return 0; }
      return Number(str);
    }
  }

  private readonly amount: number;
  private readonly unit: TimeUnit;

  private constructor(amount: number, unit: TimeUnit) {
    if (!Token.isUnresolved(amount) && amount < 0) {
      throw new Error(`Duration amounts cannot be negative. Received: ${amount}`);
    }

    this.amount = amount;
    this.unit = unit;
  }

  /**
   * @returns the value of this `Duration` expressed in Milliseconds.
   */
  public toMilliseconds(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Milliseconds, opts);
  }

  /**
   * @returns the value of this `Duration` expressed in Seconds.
   */
  public toSeconds(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Seconds, opts);
  }

  /**
   * @returns the value of this `Duration` expressed in Minutes.
   */
  public toMinutes(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Minutes, opts);
  }

  /**
   * @returns the value of this `Duration` expressed in Hours.
   */
  public toHours(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Hours, opts);
  }

  /**
   * @returns the value of this `Duration` expressed in Days.
   */
  public toDays(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Days, opts);
  }

  /**
   * @returns an ISO 8601 representation of this period (see https://www.iso.org/fr/standard/70907.html).
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

  /**
   * Returns a string representation of this `Duration` that is also a Token that cannot be successfully resolved. This
   * protects users against inadvertently stringifying a `Duration` object, when they should have called one of the
   * `to*` methods instead.
   */
  public toString(): string {
    return Token.asString(
      () => {
        throw new Error(`Duration.toString() was used, but .toSeconds, .toMinutes or .toDays should have been called instead`);
      },
      { displayHint: `${this.amount} ${this.unit.label}` }
    );
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

class TimeUnit {
  public static readonly Milliseconds = new TimeUnit('millis', 0.001);
  public static readonly Seconds = new TimeUnit('seconds', 1);
  public static readonly Minutes = new TimeUnit('minutes', 60);
  public static readonly Hours = new TimeUnit('hours', 3_600);
  public static readonly Days = new TimeUnit('days', 86_400);

  private constructor(public readonly label: string, public readonly inSeconds: number) {
  }

  public toString() {
    return this.label;
  }
}

function convert(amount: number, fromUnit: TimeUnit, toUnit: TimeUnit, { integral = true }: TimeConversionOptions) {
  if (fromUnit.inSeconds === toUnit.inSeconds) { return amount; }
  const multiplier = fromUnit.inSeconds / toUnit.inSeconds;

  if (Token.isUnresolved(amount)) {
    throw new Error(`Unable to perform time unit conversion on un-resolved token ${amount}.`);
  }
  const value = amount * multiplier;
  if (!Number.isInteger(value) && integral) {
    throw new Error(`'${amount} ${fromUnit}' cannot be converted into a whole number of ${toUnit}.`);
  }
  return value;
}