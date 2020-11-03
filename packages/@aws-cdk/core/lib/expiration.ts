import { Duration } from './duration';
/**
 * Represents a date of expiration.
 *
 * The amount can be specified either as a Date object, timestamp, Duration or string.
 */
export class Expiration {
  /**
   * Expire at the specified date
   * @param d date to expire at
   */
  public static atDate(d: Date) { return new Expiration(d); }

  /**
   * Expire at the specified timestamp
   * @param t timestamp in unix milliseconds
   */
  public static atTimestamp(t: number) { return Expiration.atDate(new Date(t)); }

  /**
   * Expire once the specified duration has passed since deployment time
   * @param t the duration to wait before expiring
   */
  public static after(t: Duration) { return Expiration.atDate(new Date(Date.now() + t.toMilliseconds())); }

  /**
   * Expire at specified date, represented as a string
   *
   * @param s the string that represents date to expire at
   */
  public static fromString(s: string) { return new Expiration(new Date(s)); }

  /**
   * Expiration value as a Date object
   */
  public readonly date: Date;

  private constructor(date: Date) {
    this.date = date;
  }

  /**
   * Exipration Value in a formatted Unix Epoch Time in seconds
   */
  public toEpoch(): number {
    return Math.round(this.date.getTime() / 1000);
  }
  /**
   * Check if Exipiration expires before input
   * @param t the duration to check against
   */
  public isBefore(t: Duration): boolean {
    return this.date < new Date(Date.now() + t.toMilliseconds());
  }

  /**
   * Check if Exipiration expires after input
   * @param t the duration to check against
   */
  public isAfter( t: Duration ): boolean {
    return this.date > new Date(Date.now() + t.toMilliseconds());
  }
}
