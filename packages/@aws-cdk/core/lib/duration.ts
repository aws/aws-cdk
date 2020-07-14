import { Token } from './token';

/**
 * Represents a length of time.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
export class Duration {
  /**
   * Create a Duration representing an amount of milliseconds
   *
   * @param amount the amount of Milliseconds the `Duration` will represent.
   * @returns a new `Duration` representing `amount` ms.
   */
  public static millis(amount: number): Duration {
    return new Duration(amount, TimeUnit.Milliseconds);
  }

  /**
   * Create a Duration representing an amount of seconds
   *
   * @param amount the amount of Seconds the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Seconds.
   */
  public static seconds(amount: number): Duration {
    return new Duration(amount, TimeUnit.Seconds);
  }

  /**
   * Create a Duration representing an amount of minutes
   *
   * @param amount the amount of Minutes the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Minutes.
   */
  public static minutes(amount: number): Duration {
    return new Duration(amount, TimeUnit.Minutes);
  }

  /**
   * Create a Duration representing an amount of hours
   *
   * @param amount the amount of Hours the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Hours.
   */
  public static hours(amount: number): Duration {
    return new Duration(amount, TimeUnit.Hours);
  }

  /**
   * Create a Duration representing an amount of days
   *
   * @param amount the amount of Days the `Duration` will represent.
   * @returns a new `Duration` representing `amount` Days.
   */
  public static days(amount: number): Duration {
    return new Duration(amount, TimeUnit.Days);
  }

  /**
   * Parse a period formatted according to the ISO 8601 standard
   *
   * @see https://www.iso.org/fr/standard/70907.html
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
    return Duration.millis(
      _toInt(seconds) * TimeUnit.Seconds.inMillis
      + (_toInt(minutes) * TimeUnit.Minutes.inMillis)
      + (_toInt(hours) * TimeUnit.Hours.inMillis)
      + (_toInt(days) * TimeUnit.Days.inMillis),
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
   * Add two Durations together
   */
  public plus(rhs: Duration): Duration {
    const targetUnit = finestUnit(this.unit, rhs.unit);
    const total = convert(this.amount, this.unit, targetUnit, {}) + convert(rhs.amount, rhs.unit, targetUnit, {});
    return new Duration(total, targetUnit);
  }

  /**
   * Return the total number of milliseconds in this Duration
   *
   * @returns the value of this `Duration` expressed in Milliseconds.
   */
  public toMilliseconds(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Milliseconds, opts);
  }

  /**
   * Return the total number of seconds in this Duration
   *
   * @returns the value of this `Duration` expressed in Seconds.
   */
  public toSeconds(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Seconds, opts);
  }

  /**
   * Return the total number of minutes in this Duration
   *
   * @returns the value of this `Duration` expressed in Minutes.
   */
  public toMinutes(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Minutes, opts);
  }

  /**
   * Return the total number of hours in this Duration
   *
   * @returns the value of this `Duration` expressed in Hours.
   */
  public toHours(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Hours, opts);
  }

  /**
   * Return the total number of days in this Duration
   *
   * @returns the value of this `Duration` expressed in Days.
   */
  public toDays(opts: TimeConversionOptions = {}): number {
    return convert(this.amount, this.unit, TimeUnit.Days, opts);
  }

  /**
   * Return an ISO 8601 representation of this period
   *
   * @returns a string starting with 'PT' describing the period
   * @see https://www.iso.org/fr/standard/70907.html
   */
  public toIsoString(): string {
    if (this.amount === 0) { return 'PT0S'; }
    switch (this.unit) {
      case TimeUnit.Milliseconds:
        return Duration.seconds(this.amount / 1000.0).toIsoString();
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
   * Return an ISO 8601 representation of this period
   *
   * @returns a string starting with 'PT' describing the period
   * @see https://www.iso.org/fr/standard/70907.html
   * @deprecated Use `toIsoString()` instead.
   */
  public toISOString(): string {
    return this.toIsoString();
  }

  /**
   * Turn this duration into a human-readable string
   */
  public toHumanString(): string {
    if (this.amount === 0) { return fmtUnit(0, this.unit); }
    if (Token.isUnresolved(this.amount)) { return `<token> ${this.unit.label}`; }

    let millis = convert(this.amount, this.unit, TimeUnit.Milliseconds, { integral: false });
    const parts = new Array<string>();

    for (const unit of [TimeUnit.Days, TimeUnit.Hours, TimeUnit.Hours, TimeUnit.Minutes, TimeUnit.Seconds]) {
      const wholeCount = Math.floor(convert(millis, TimeUnit.Milliseconds, unit, { integral: false }));
      if (wholeCount > 0) {
        parts.push(fmtUnit(wholeCount, unit));
        millis -= wholeCount * unit.inMillis;
      }
    }

    // Remainder in millis
    if (millis > 0) {
      parts.push(fmtUnit(millis, TimeUnit.Milliseconds));
    }

    // 2 significant parts, that's totally enough for humans
    return parts.slice(0, 2).join(' ');

    function fmtUnit(amount: number, unit: TimeUnit) {
      if (amount === 1) {
        // All of the labels end in 's'
        return `${amount} ${unit.label.substring(0, unit.label.length - 1)}`;
      }
      return `${amount} ${unit.label}`;
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
        throw new Error('Duration.toString() was used, but .toSeconds, .toMinutes or .toDays should have been called instead');
      },
      { displayHint: `${this.amount} ${this.unit.label}` },
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
   * If `true`, conversions into a larger time unit (e.g. `Seconds` to `Minutes`) will fail if the result is not an
   * integer.
   *
   * @default true
   */
  readonly integral?: boolean;
}

class TimeUnit {
  public static readonly Milliseconds = new TimeUnit('millis', 1);
  public static readonly Seconds = new TimeUnit('seconds', 1_000);
  public static readonly Minutes = new TimeUnit('minutes', 60_000);
  public static readonly Hours = new TimeUnit('hours', 3_600_000);
  public static readonly Days = new TimeUnit('days', 86_400_000);

  private constructor(public readonly label: string, public readonly inMillis: number) {
    // MAX_SAFE_INTEGER is 2^53, so by representing our duration in millis (the lowest
    // common unit) the highest duration we can represent is
    // 2^53 / 86*10^6 ~= 104 * 10^6 days (about 100 million days).
  }

  public toString() {
    return this.label;
  }
}

function convert(amount: number, fromUnit: TimeUnit, toUnit: TimeUnit, { integral = true }: TimeConversionOptions) {
  if (fromUnit.inMillis === toUnit.inMillis) { return amount; }
  const multiplier = fromUnit.inMillis / toUnit.inMillis;

  if (Token.isUnresolved(amount)) {
    throw new Error(`Unable to perform time unit conversion on un-resolved token ${amount}.`);
  }
  const value = amount * multiplier;
  if (!Number.isInteger(value) && integral) {
    throw new Error(`'${amount} ${fromUnit}' cannot be converted into a whole number of ${toUnit}.`);
  }
  return value;
}

/**
 * Return the time unit with highest granularity
 */
function finestUnit(a: TimeUnit, b: TimeUnit) {
  return a.inMillis < b.inMillis ? a : b;
}