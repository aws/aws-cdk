/**
 * What class and generation of instance to use
 *
 * We have both symbolic and concrete enums for every type.
 *
 * The first are for people that want to specify by purpose,
 * the second one are for people who already know exactly what
 * 'R4' means.
 */
export enum InstanceClass {
  /**
   * Standard instances, 3rd generation
   */
  STANDARD3 = 'm3',

  /**
   * Standard instances, 3rd generation
   */
  M3 = 'm3',

  /**
   * Standard instances, 4th generation
   */
  STANDARD4 = 'm4',

  /**
   * Standard instances, 4th generation
   */
  M4 = 'm4',

  /**
   * Standard instances, 5th generation
   */
  STANDARD5 = 'm5',

  /**
   * Standard instances, 5th generation
   */
  M5 = 'm5',

  /**
   * Memory optimized instances, 3rd generation
   */
  MEMORY3 = 'r3',

  /**
   * Memory optimized instances, 3rd generation
   */
  R3 = 'r3',

  /**
   * Memory optimized instances, 3rd generation
   */
  MEMORY4 = 'r4',

  /**
   * Memory optimized instances, 3rd generation
   */
  R4 = 'r4',

  /**
   * Compute optimized instances, 3rd generation
   */
  COMPUTE3 = 'c3',

  /**
   * Compute optimized instances, 3rd generation
   */
  C3 = 'c3',

  /**
   * Compute optimized instances, 4th generation
   */
  COMPUTE4 = 'c4',

  /**
   * Compute optimized instances, 4th generation
   */
  C4 = 'c4',

  /**
   * Compute optimized instances, 5th generation
   */
  COMPUTE5 = 'c5',

  /**
   * Compute optimized instances, 5th generation
   */
  C5 = 'c5',

  /**
   * Storage-optimized instances, 2nd generation
   */
  STORAGE2 = 'd2',

  /**
   * Storage-optimized instances, 2nd generation
   */
  D2 = 'd2',

  /**
   * Storage/compute balanced instances, 1st generation
   */
  STORAGE_COMPUTE_1 = 'h1',

  /**
   * Storage/compute balanced instances, 1st generation
   */
  H1 = 'h1',

  /**
   * I/O-optimized instances, 3rd generation
   */
  IO3 = 'i3',

  /**
   * I/O-optimized instances, 3rd generation
   */
  I3 = 'i3',

  /**
   * Burstable instances, 2nd generation
   */
  BURSTABLE2 = 't2',

  /**
   * Burstable instances, 2nd generation
   */
  T2 = 't2',

  /**
   * Burstable instances, 3rd generation
   */
  BURSTABLE3 = 't3',

  /**
   * Burstable instances, 3rd generation
   */
  T3 = 't3',

  /**
   * Memory-intensive instances, 1st generation
   */
  MEMORY_INTENSIVE_1 = 'x1',

  /**
   * Memory-intensive instances, 1st generation
   */
  X1 = 'x1',

  /**
   * Memory-intensive instances, extended, 1st generation
   */
  MEMORY_INTENSIVE_1_EXTENDED = 'x1e',

  /**
   * Memory-intensive instances, 1st generation
   */
  X1E = 'x1e',

  /**
   * Instances with customizable hardware acceleration, 1st generation
   */
  FPGA1 = 'f1',

  /**
   * Instances with customizable hardware acceleration, 1st generation
   */
  F1 = 'f1',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  GRAPHICS3 = 'g3',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  G3 = 'g3',

  /**
   * Parallel-processing optimized instances, 2nd generation
   */
  PARALLEL2 = 'p2',

  /**
   * Parallel-processing optimized instances, 2nd generation
   */
  P2 = 'p2',

  /**
   * Parallel-processing optimized instances, 3nd generation
   */
  PARALLEL3 = 'p3',

  /**
   * Parallel-processing optimized instances, 3nd generation
   */
  P3 = 'p3',
}

/**
 * What size of instance to use
 */
export enum InstanceSize {
  NANO = 'nano',
  MICRO = 'micro',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XLARGE2 = '2xlarge',
  XLARGE4 = '4xlarge',
  XLARGE8 = '8xlarge',
  XLARGE9 = '9xlarge',
  XLARGE10 = '10xlarge',
  XLARGE12 = '12xlarge',
  XLARGE16 = '16xlarge',
  XLARGE18 = '18xlarge',
  XLARGE24 = '24xlarge',
  XLARGE32 = '32xlarge',
}

/**
 * Instance type for EC2 instances
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export class InstanceType {
  constructor(private readonly instanceTypeIdentifier: string) {
  }

  /**
   * Return the instance type as a dotted string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }
}

/**
 * Instance type for EC2 instances
 *
 * This class takes a combination of a class and size.
 *
 * Be aware that not all combinations of class and size are available, and not all
 * classes are available in all regions.
 */
export class InstanceTypePair extends InstanceType {
  constructor(public readonly instanceClass: InstanceClass,
              public readonly instanceSize: InstanceSize) {
    super(instanceClass + '.' + instanceSize);
  }
}
