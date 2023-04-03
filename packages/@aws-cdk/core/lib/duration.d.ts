/**
 * Represents a length of time.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
export declare class Duration {
    /**
     * Create a Duration representing an amount of milliseconds
     *
     * @param amount the amount of Milliseconds the `Duration` will represent.
     * @returns a new `Duration` representing `amount` ms.
     */
    static millis(amount: number): Duration;
    /**
     * Create a Duration representing an amount of seconds
     *
     * @param amount the amount of Seconds the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Seconds.
     */
    static seconds(amount: number): Duration;
    /**
     * Create a Duration representing an amount of minutes
     *
     * @param amount the amount of Minutes the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Minutes.
     */
    static minutes(amount: number): Duration;
    /**
     * Create a Duration representing an amount of hours
     *
     * @param amount the amount of Hours the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Hours.
     */
    static hours(amount: number): Duration;
    /**
     * Create a Duration representing an amount of days
     *
     * @param amount the amount of Days the `Duration` will represent.
     * @returns a new `Duration` representing `amount` Days.
     */
    static days(amount: number): Duration;
    /**
     * Parse a period formatted according to the ISO 8601 standard
     *
     * @see https://www.iso.org/standard/70907.html
     * @param duration an ISO-formatted duration to be parsed.
     * @returns the parsed `Duration`.
     */
    static parse(duration: string): Duration;
    private readonly amount;
    private readonly unit;
    private constructor();
    /**
     * Add two Durations together
     */
    plus(rhs: Duration): Duration;
    /**
     * Substract two Durations together
     */
    minus(rhs: Duration): Duration;
    /**
     * Return the total number of milliseconds in this Duration
     *
     * @returns the value of this `Duration` expressed in Milliseconds.
     */
    toMilliseconds(opts?: TimeConversionOptions): number;
    /**
     * Return the total number of seconds in this Duration
     *
     * @returns the value of this `Duration` expressed in Seconds.
     */
    toSeconds(opts?: TimeConversionOptions): number;
    /**
     * Return the total number of minutes in this Duration
     *
     * @returns the value of this `Duration` expressed in Minutes.
     */
    toMinutes(opts?: TimeConversionOptions): number;
    /**
     * Return the total number of hours in this Duration
     *
     * @returns the value of this `Duration` expressed in Hours.
     */
    toHours(opts?: TimeConversionOptions): number;
    /**
     * Return the total number of days in this Duration
     *
     * @returns the value of this `Duration` expressed in Days.
     */
    toDays(opts?: TimeConversionOptions): number;
    /**
     * Return an ISO 8601 representation of this period
     *
     * @returns a string starting with 'P' describing the period
     * @see https://www.iso.org/standard/70907.html
     */
    toIsoString(): string;
    /**
     * Return an ISO 8601 representation of this period
     *
     * @returns a string starting with 'P' describing the period
     * @see https://www.iso.org/standard/70907.html
     * @deprecated Use `toIsoString()` instead.
     */
    toISOString(): string;
    /**
     * Turn this duration into a human-readable string
     */
    toHumanString(): string;
    /**
     * Returns a string representation of this `Duration`
     *
     * This is is never the right function to use when you want to use the `Duration`
     * object in a template. Use `toSeconds()`, `toMinutes()`, `toDays()`, etc. instead.
     */
    toString(): string;
    /**
     * Return the duration in a set of whole numbered time components, ordered from largest to smallest
     *
     * Only components != 0 will be returned.
     *
     * Can combine millis and seconds together for the benefit of toIsoString,
     * makes the logic in there simpler.
     */
    private components;
    /**
     * Checks if duration is a token or a resolvable object
     */
    isUnresolved(): boolean;
    /**
     * Returns unit of the duration
     */
    unitLabel(): string;
    /**
     * Returns stringified number of duration
     */
    formatTokenToNumber(): string;
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
