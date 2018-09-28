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
  Standard3 = 'm3',

  /**
   * Standard instances, 3rd generation
   */
  M3 = 'm3',

  /**
   * Standard instances, 4th generation
   */
  Standard4 = 'm4',

  /**
   * Standard instances, 4th generation
   */
  M4 = 'm4',

  /**
   * Standard instances, 5th generation
   */
  Standard5 = 'm5',

  /**
   * Standard instances, 5th generation
   */
  M5 = 'm5',

  /**
   * Memory optimized instances, 3rd generation
   */
  Memory3 = 'r3',

  /**
   * Memory optimized instances, 3rd generation
   */
  R3 = 'r3',

  /**
   * Memory optimized instances, 3rd generation
   */
  Memory4 = 'r4',

  /**
   * Memory optimized instances, 3rd generation
   */
  R4 = 'r4',

  /**
   * Compute optimized instances, 3rd generation
   */
  Compute3 = 'c3',

  /**
   * Compute optimized instances, 3rd generation
   */
  C3 = 'c3',

  /**
   * Compute optimized instances, 4th generation
   */
  Compute4 = 'c4',

  /**
   * Compute optimized instances, 4th generation
   */
  C4 = 'c4',

  /**
   * Compute optimized instances, 5th generation
   */
  Compute5 = 'c5',

  /**
   * Compute optimized instances, 5th generation
   */
  C5 = 'c5',

  /**
   * Storage-optimized instances, 2nd generation
   */
  Storage2 = 'd2',

  /**
   * Storage-optimized instances, 2nd generation
   */
  D2 = 'd2',

  /**
   * Storage/compute balanced instances, 1st generation
   */
  StorageCompute1 = 'h1',

  /**
   * Storage/compute balanced instances, 1st generation
   */
  H1 = 'h1',

  /**
   * I/O-optimized instances, 3rd generation
   */
  Io3 = 'i3',

  /**
   * I/O-optimized instances, 3rd generation
   */
  I3 = 'i3',

  /**
   * Burstable instances, 2nd generation
   */
  Burstable2 = 't2',

  /**
   * Burstable instances, 2nd generation
   */
  T2 = 't2',

  /**
   * Memory-intensive instances, 1st generation
   */
  MemoryIntensive1 = 'x1',

  /**
   * Memory-intensive instances, 1st generation
   */
  X1 = 'x1',

  /**
   * Memory-intensive instances, extended, 1st generation
   */
  MemoryIntensive1Extended = 'x1e',

  /**
   * Memory-intensive instances, 1st generation
   */
  X1e = 'x1e',

  /**
   * Instances with customizable hardware acceleration, 1st generation
   */
  Fpga1 = 'f1',

  /**
   * Instances with customizable hardware acceleration, 1st generation
   */
  F1 = 'f1',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  Graphics3 = 'g3',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  G3 = 'g3',

  /**
   * Parallel-processing optimized instances, 2nd generation
   */
  Parallel2 = 'p2',

  /**
   * Parallel-processing optimized instances, 2nd generation
   */
  P2 = 'p2',

  /**
   * Parallel-processing optimized instances, 3nd generation
   */
  Parallel3 = 'p3',

  /**
   * Parallel-processing optimized instances, 3nd generation
   */
  P3 = 'p3',
}

/**
 * What size of instance to use
 */
export enum InstanceSize {
  None = 'nano',
  Micro = 'micro',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
  XLarge = 'xlarge',
  XLarge2 = '2xlarge',
  XLarge4 = '4xlarge',
  XLarge8 = '8xlarge',
  XLarge9 = '9xlarge',
  XLarge10 = '10xlarge',
  XLarge12 = '12xlarge',
  XLarge16 = '16xlarge',
  XLarge18 = '18xlarge',
  XLarge24 = '24xlarge',
  XLarge32 = '32xlarge',
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
