import { Token } from "./token";

/**
 * Represents the amount of digital storage.
 *
 * The amount can be specified either as a literal value (e.g: `10`) which
 * cannot be negative, or as an unresolved number token.
 *
 * When the amount is passed as a token, unit conversion is not possible.
 */
export class Size {
  /**
   * Create a Storage representing an amount kibibytes.
   * 1 KiB = 1024 bytes
   */
  public static kibibytes(amount: number): Size {
    return new Size(amount, StorageUnit.Kibibytes);
  }

  /**
   * Create a Storage representing an amount mebibytes.
   * 1 MiB = 1024 KiB
   */
  public static mebibytes(amount: number): Size {
    return new Size(amount, StorageUnit.Mebibytes);
  }

  /**
   * Create a Storage representing an amount mebibytes.
   * 1 GiB = 1024 MiB
   */
  public static gibibytes(amount: number): Size {
    return new Size(amount, StorageUnit.Gibibytes);
  }

  /**
   * Create a Storage representing an amount tebibytes.
   * 1 TiB = 1024 GiB
   */
  public static tebibytes(amount: number): Size {
    return new Size(amount, StorageUnit.Tebibytes);
  }

  /**
   * Create a Storage representing an amount pebibytes.
   * 1 PiB = 1024 TiB
   */
  public static pebibyte(amount: number): Size {
    return new Size(amount, StorageUnit.Pebibytes);
  }

  private readonly amount: number;
  private readonly unit: StorageUnit;

  private constructor(amount: number, unit: StorageUnit) {
    if (!Token.isUnresolved(amount) && amount < 0) {
      throw new Error(`Storage amounts cannot be negative. Received: ${amount}`);
    }
    this.amount = amount;
    this.unit = unit;
  }

  /**
   * Return this storage as a total number of kibibytes.
   */
  public toKibibytes(opts: SizeConversionOptions = {}): number {
    return convert(this.amount, this.unit, StorageUnit.Kibibytes, opts);
  }

  /**
   * Return this storage as a total number of mebibytes.
   */
  public toMebibytes(opts: SizeConversionOptions = {}): number {
    return convert(this.amount, this.unit, StorageUnit.Mebibytes, opts);
  }

  /**
   * Return this storage as a total number of gibibytes.
   */
  public toGibibytes(opts: SizeConversionOptions = {}): number {
    return convert(this.amount, this.unit, StorageUnit.Gibibytes, opts);
  }

  /**
   * Return this storage as a total number of tebibytes.
   */
  public toTebibytes(opts: SizeConversionOptions = {}): number {
    return convert(this.amount, this.unit, StorageUnit.Tebibytes, opts);
  }

  /**
   * Return this storage as a total number of pebibytes.
   */
  public toPebibytes(opts: SizeConversionOptions = {}): number {
    return convert(this.amount, this.unit, StorageUnit.Pebibytes, opts);
  }
}

/**
 * Rouding behaviour when converting between units of `Size`.
 */
export enum SizeRoundingBehavior {
  /** Fail the conversion if the result is not an integer. */
  FAIL,
  /** If the result is not an integer, round it to the closest integer less than the result */
  FLOOR,
  /** Don't round. Return even if the result is a fraction. */
  NONE,

}

/**
 * Options for how to convert time to a different unit.
 */
export interface SizeConversionOptions {
  /**
   * How conversions should behave when it encounters a non-integer result
   * @default SizeRoundingBehavior.FAIL
   */
  readonly rounding?: SizeRoundingBehavior;
}

class StorageUnit {
  public static readonly Kibibytes = new StorageUnit('kibibytes', 1);
  public static readonly Mebibytes = new StorageUnit('mebibytes', 1024);
  public static readonly Gibibytes = new StorageUnit('gibibytes', 1024 * 1024);
  public static readonly Tebibytes = new StorageUnit('tebibytes', 1024 * 1024 * 1024);
  public static readonly Pebibytes = new StorageUnit('pebibytes', 1024 * 1024 * 1024 * 1024);

  private constructor(public readonly label: string, public readonly inKibiBytes: number) {
    // MAX_SAFE_INTEGER is 2^53, so by representing storage in kibibytes,
    // the highest storage we can represent is 8 exbibytes.
  }

  public toString() {
    return this.label;
  }
}

function convert(amount: number, fromUnit: StorageUnit, toUnit: StorageUnit, options: SizeConversionOptions = {}) {
  const rounding = options.rounding ?? SizeRoundingBehavior.FAIL;
  if (fromUnit.inKibiBytes === toUnit.inKibiBytes) { return amount; }
  if (Token.isUnresolved(amount)) {
    throw new Error(`Unable to perform time unit conversion on un-resolved token ${amount}.`);
  }

  const multiplier = fromUnit.inKibiBytes / toUnit.inKibiBytes;
  const value = amount * multiplier;
  switch (rounding) {
    case SizeRoundingBehavior.NONE:
      return value;
    case SizeRoundingBehavior.FLOOR:
      return Math.floor(value);
    default:
    case SizeRoundingBehavior.FAIL:
      if (!Number.isInteger(value)) {
        throw new Error(`'${amount} ${fromUnit}' cannot be converted into a whole number of ${toUnit}.`);
      }
      return value;
  }
}
