import { Token } from '../../core';
import { UnscopedValidationError } from '../../core/lib/errors';
import { lit } from '../../core/lib/private/literal-string';

/**
 * The minimum amount of memory, in gibibytes (GiB), of each accelerator device
 * exposed to a Lambda Managed Instance (LMI) function's execution environment.
 * Lambda might allocate more, depending on the accelerator instance types available.
 *
 * Use one of the predefined values (`AcceleratorMemorySize.GIB_24`, etc.). If the
 * service adds a size that is not yet listed here, use `AcceleratorMemorySize.of()`
 * to supply it directly.
 */
export class AcceleratorMemorySize {
  /** 3 GiB of accelerator memory. */
  public static readonly GIB_3 = new AcceleratorMemorySize(3);
  /** 6 GiB of accelerator memory. */
  public static readonly GIB_6 = new AcceleratorMemorySize(6);
  /** 12 GiB of accelerator memory. */
  public static readonly GIB_12 = new AcceleratorMemorySize(12);
  /** 16 GiB of accelerator memory. */
  public static readonly GIB_16 = new AcceleratorMemorySize(16);
  /** 24 GiB of accelerator memory. */
  public static readonly GIB_24 = new AcceleratorMemorySize(24);
  /** 48 GiB of accelerator memory. */
  public static readonly GIB_48 = new AcceleratorMemorySize(48);

  /**
   * An amount of accelerator memory expressed as a number of gibibytes (GiB).
   *
   * Prefer the predefined constants; use this escape hatch only for a value the
   * service supports that is not yet represented as a constant. The specific set
   * of valid sizes is a service-side constraint enforced at deploy time, so this
   * method does not restrict the value to the predefined constants. It does reject
   * clearly-invalid input (a non-positive or non-integer number of GiB). The value
   * may be an unresolved token, in which case validation is skipped.
   */
  public static of(gibibytes: number): AcceleratorMemorySize {
    if (!Token.isUnresolved(gibibytes) && (!Number.isInteger(gibibytes) || gibibytes <= 0)) {
      throw new UnscopedValidationError(lit`AcceleratorMemorySizeInvalid`, `acceleratorMemorySize must be a positive integer number of GiB, got ${gibibytes}`);
    }
    return new AcceleratorMemorySize(gibibytes);
  }

  /**
   * The amount of accelerator memory in gibibytes (GiB).
   *
   * May be an unresolved token when supplied via `of()`.
   */
  public readonly gibibytes: number;

  private constructor(gibibytes: number) {
    this.gibibytes = gibibytes;
  }
}

/**
 * Accelerator configuration for Lambda Managed Instance (LMI) functions.
 */
export interface AcceleratorConfig {
  /**
   * The minimum amount of memory of each accelerator device exposed to the execution environment.
   *
   * Lambda might allocate more, depending on the accelerator instance types available.
   */
  readonly acceleratorMemorySize: AcceleratorMemorySize;
}
