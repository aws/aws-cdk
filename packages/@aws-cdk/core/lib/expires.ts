import { Duration } from './duration';

/**
 * Enum for formating getEpoch output
 */
export enum EpochFormat {
  /**
   * Round down to nearest day
   */
  DAY = 86400000,
  /**
   * Round down to nearest hour
   */
  HOUR = 3600000,
  /**
   * Round down to nearest minute
   */
  MINUTE = 60000,
  /**
   * Round down to nearest second
   */
  SECOND = 1000,
}

/**
 * Represents a date of expiration.
 *
 * The amount can be specified either as a Date object, timestamp, Duration or string.
 */
export class Expires {
  /**
   * Expire at the specified date
   * @param d date to expire at
   */
  public static atDate(d: Date) { return new Expires(d.toUTCString(), d); }

  /**
   * Expire at the specified timestamp
   * @param t timestamp in unix milliseconds
   */
  public static atTimestamp(t: number) { return Expires.atDate(new Date(t)); }

  /**
   * Expire once the specified duration has passed since deployment time
   * @param t the duration to wait before expiring
   */
  public static after(t: Duration) { return Expires.atDate(new Date(Date.now() + t.toMilliseconds())); }

  /**
   * Expire at specified date, represented as a string
   *
   * @param s the string that represents date to expire at
   */
  public static fromString(s: string) { return new Expires(s, new Date(s)); }

  /**
   * Expiration value as a string
   */
  public readonly value: string;

  /**
   * Expiration value as a Date object
   */
  public readonly date: Date;

  private constructor(value: string, date: Date) {
    this.value = value;
    this.date = date;
  }
  /**
   * Exipration Value in a formatted Unix Epoch Time in seconds
   * @param format - round down to nearest formated number, default is seconds
   */
  public getEpoch(format?: EpochFormat): number {
    format = format ?? EpochFormat.SECOND;
    return Math.floor( this.date.getTime() / format) * format / EpochFormat.SECOND;
  }
}