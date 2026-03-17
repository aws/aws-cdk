import { UnscopedValidationError } from './errors';
import { Token } from './token';

/**
 * Represents a bitrate value.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
export class Bitrate {
  /**
   * Create a Bitrate representing an amount of bits per second.
   *
   * @param amount the amount of bits per second
   */
  public static bps(amount: number): Bitrate {
    return new Bitrate(amount, BitrateUnit.Bps);
  }

  /**
   * Create a Bitrate representing an amount of kilobits per second.
   *
   * @param amount the amount of kilobits per second
   */
  public static kbps(amount: number): Bitrate {
    return new Bitrate(amount, BitrateUnit.Kbps);
  }

  /**
   * Create a Bitrate representing an amount of megabits per second.
   *
   * @param amount the amount of megabits per second
   */
  public static mbps(amount: number): Bitrate {
    return new Bitrate(amount, BitrateUnit.Mbps);
  }

  /**
   * Create a Bitrate representing an amount of gigabits per second.
   *
   * @param amount the amount of gigabits per second
   */
  public static gbps(amount: number): Bitrate {
    return new Bitrate(amount, BitrateUnit.Gbps);
  }

  /**
   * The amount of bitrate.
   */
  private readonly amount: number;

  /**
   * The unit of bitrate.
   */
  private readonly unit: BitrateUnit;

  private constructor(amount: number, unit: BitrateUnit) {
    if (!Token.isUnresolved(amount) && amount < 0) {
      throw new UnscopedValidationError(`Bitrate amounts cannot be negative. Received: ${amount}`);
    }

    this.amount = amount;
    this.unit = unit;
  }

  /**
   * Return the total number of bits per second.
   */
  public toBps(): number {
    return convert(this.amount, this.unit, BitrateUnit.Bps);
  }

  /**
   * Return the total number of kilobits per second.
   */
  public toKbps(): number {
    return convert(this.amount, this.unit, BitrateUnit.Kbps);
  }

  /**
   * Return the total number of megabits per second.
   */
  public toMbps(): number {
    return convert(this.amount, this.unit, BitrateUnit.Mbps);
  }

  /**
   * Return the total number of gigabits per second.
   */
  public toGbps(): number {
    return convert(this.amount, this.unit, BitrateUnit.Gbps);
  }

  /**
   * Checks if bitrate is a token or a resolvable object
   */
  public isUnresolved() {
    return Token.isUnresolved(this.amount);
  }
}

class BitrateUnit {
  public static readonly Bps = new BitrateUnit('bps', 1);
  public static readonly Kbps = new BitrateUnit('kbps', 1_000);
  public static readonly Mbps = new BitrateUnit('mbps', 1_000_000);
  public static readonly Gbps = new BitrateUnit('gbps', 1_000_000_000);

  private constructor(public readonly label: string, public readonly inBps: number) {}

  public toString() {
    return this.label;
  }
}

function convert(amount: number, fromUnit: BitrateUnit, toUnit: BitrateUnit): number {
  if (fromUnit.inBps === toUnit.inBps) {
    return amount;
  }
  if (Token.isUnresolved(amount)) {
    throw new UnscopedValidationError(`Bitrate must be specified as 'Bitrate.${toUnit}()' here since its value comes from a token and cannot be converted (got Bitrate.${fromUnit})`);
  }
  return (amount * fromUnit.inBps) / toUnit.inBps;
}
