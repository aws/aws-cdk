import { Duration } from './duration';
/**
 * Represents a date of expiration.
 *
 * The amount can be specified either as a Date object, timestamp, Duration or string.
 */
export declare class Expiration {
    /**
     * Expire at the specified date
     * @param d date to expire at
     */
    static atDate(d: Date): Expiration;
    /**
     * Expire at the specified timestamp
     * @param t timestamp in unix milliseconds
     */
    static atTimestamp(t: number): Expiration;
    /**
     * Expire once the specified duration has passed since deployment time
     * @param t the duration to wait before expiring
     */
    static after(t: Duration): Expiration;
    /**
     * Expire at specified date, represented as a string
     *
     * @param s the string that represents date to expire at
     */
    static fromString(s: string): Expiration;
    /**
     * Expiration value as a Date object
     */
    readonly date: Date;
    private constructor();
    /**
     * Expiration Value in a formatted Unix Epoch Time in seconds
     */
    toEpoch(): number;
    /**
     * Check if Expiration expires before input
     * @param t the duration to check against
     */
    isBefore(t: Duration): boolean;
    /**
     * Check if Expiration expires after input
     * @param t the duration to check against
     */
    isAfter(t: Duration): boolean;
}
