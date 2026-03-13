import { UnscopedValidationError } from './errors';

/**
 * Represents a bitrate value.
 *
 * This class provides a type-safe way to specify bitrates with clear units,
 * preventing confusion between bits per second, kilobits per second, etc.
 */
export class Bitrate {
  /**
   * Create a Bitrate representing an amount of bits per second.
   *
   * @param bps the amount of bits per second
   */
  public static bps(bps: number): Bitrate {
    return new Bitrate(bps);
  }

  /**
   * Create a Bitrate representing an amount of kilobits per second.
   *
   * @param kbps the amount of kilobits per second
   */
  public static kbps(kbps: number): Bitrate {
    return new Bitrate(kbps * 1000);
  }

  /**
   * Create a Bitrate representing an amount of megabits per second.
   *
   * @param mbps the amount of megabits per second
   */
  public static mbps(mbps: number): Bitrate {
    return new Bitrate(mbps * 1000000);
  }

  /**
   * Create a Bitrate representing an amount of gigabits per second.
   *
   * @param gbps the amount of gigabits per second
   */
  public static gbps(gbps: number): Bitrate {
    return new Bitrate(gbps * 1000000000);
  }

  private constructor(private readonly bps: number) {
    if (bps < 0) {
      throw new UnscopedValidationError('Bitrate cannot be negative');
    }
  }

  /**
   * Return the total number of bits per second.
   */
  public toBps(): number {
    return this.bps;
  }

  /**
   * Return the total number of kilobits per second.
   */
  public toKbps(): number {
    return this.bps / 1000;
  }

  /**
   * Return the total number of megabits per second.
   */
  public toMbps(): number {
    return this.bps / 1000000;
  }

  /**
   * Return the total number of gigabits per second.
   */
  public toGbps(): number {
    return this.bps / 1000000000;
  }
}
