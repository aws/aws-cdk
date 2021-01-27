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
   * Standard instances with local NVME drive, 5th generation
   */
  STANDARD5_NVME_DRIVE = 'm5d',

  /**
   * Standard instances with local NVME drive, 5th generation
   */
  M5D = 'm5d',

  /**
   * Standard instances based on AMD EPYC, 5th generation
   */
  STANDARD5_AMD = 'm5a',

  /**
   * Standard instances based on AMD EPYC, 5th generation
   */
  M5A = 'm5a',

  /**
   * Standard instances based on AMD EPYC with local NVME drive, 5th generation
   */
  STANDARD5_AMD_NVME_DRIVE = 'm5ad',

  /**
   * Standard instances based on AMD EPYC with local NVME drive, 5th generation
   */
  M5AD = 'm5ad',

  /**
   * Memory optimized instances, 3rd generation
   */
  MEMORY3 = 'r3',

  /**
   * Memory optimized instances, 3rd generation
   */
  R3 = 'r3',

  /**
   * Memory optimized instances, 4th generation
   */
  MEMORY4 = 'r4',

  /**
   * Memory optimized instances, 4th generation
   */
  R4 = 'r4',

  /**
   * Memory optimized instances, 5th generation
   */
  MEMORY5 = 'r5',

  /**
   * Memory optimized instances, 5th generation
   */
  R5 = 'r5',

  /**
   * Memory optimized instances for high performance computing, 5th generation
   */
  MEMORY5_HIGH_PERFORMANCE = 'r5n',

  /**
   * Memory optimized instances for high performance computing, 5th generation
   */
  R5N = 'r5n',

  /**
   * Memory optimized instances with local NVME drive, 5th generation
   */
  MEMORY5_NVME_DRIVE = 'r5d',

  /**
   * Memory optimized instances with local NVME drive, 5th generation
   */
  R5D = 'r5d',

  /**
   * Memory optimized instances with local NVME drive for high performance computing, 5th generation
   */
  MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE = 'r5dn',

  /**
   * Memory optimized instances with local NVME drive for high performance computing, 5th generation
   */
  R5DN = 'r5dn',

  /**
   * Memory optimized instances based on AMD EPYC, 5th generation
   */
  MEMORY5_AMD = 'r5a',

  /**
   * Memory optimized instances based on AMD EPYC, 5th generation
   */
  R5A = 'r5a',

  /**
   * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   */
  MEMORY5_AMD_NVME_DRIVE = 'r5a',

  /**
   * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   */
  R5AD = 'r5a',

  /**
   * Memory optimized instances that are also EBS-optimized, 5th generation
   */
  MEMORY5_EBS_OPTIMIZED = 'r5b',

  /**
   * Memory optimized instances that are also EBS-optimized, 5th generation
   */
  R5B = 'r5b',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors
   */
  MEMORY6_GRAVITON = 'r6g',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors
   */
  R6G = 'r6g',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   */
  MEMORY6_GRAVITON2_NVME_DRIVE = 'r6gd',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   */
  R6GD = 'r6gd',

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
   * Compute optimized instances with local NVME drive, 5th generation
   */
  COMPUTE5_NVME_DRIVE = 'c5d',

  /**
   * Compute optimized instances based on AMD EPYC, 5th generation.
   */
  COMPUTE5_AMD = 'c5a',

  /**
   * Compute optimized instances based on AMD EPYC, 5th generation
   */
  C5A = 'c5a',

  /**
   * Compute optimized instances with local NVME drive, 5th generation
   */
  C5D = 'c5d',

  /**
   * Compute optimized instances for high performance computing, 5th generation
   */
  COMPUTE5_HIGH_PERFORMANCE = 'c5n',

  /**
   * Compute optimized instances for high performance computing, 5th generation
   */
  C5N = 'c5n',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   */
  COMPUTE6_GRAVITON2 = 'c6g',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   */
  C6G = 'c6g',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and local NVME drive
   */
  COMPUTE6_GRAVITON2_NVME_DRIVE = 'c6gd',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and local NVME drive
   */
  C6GD = 'c6gd',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and high network bandwidth capabilities
   */
  COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWITH = 'c6gn',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and high network bandwidth capabilities
   */
  C6GN = 'c6gn',

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
   * I/O-optimized instances with local NVME drive, 3rd generation
   */
  IO3_DENSE_NVME_DRIVE = 'i3en',

  /**
   * I/O-optimized instances with local NVME drive, 3rd generation
   */
  I3EN = 'i3en',

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
   * Burstable instances based on AMD EPYC, 3rd generation
   */
  BURSTABLE3_AMD = 't3a',

  /**
   * Burstable instances based on AMD EPYC, 3rd generation
   */
  T3A = 't3a',

  /**
   * Burstable instances, 4th generation with Graviton2 processors
   */
  BURSTABLE4_GRAVITON = 't4g',

  /**
   * Burstable instances, 4th generation with Graviton2 processors
   */
  T4G = 't4g',

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
   * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   */
  GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE = 'g4dn',

  /**
   * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   */
  G4DN = 'g4dn',

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

  /**
   * Arm processor based instances, 1st generation
   */
  ARM1 = 'a1',

  /**
   * Arm processor based instances, 1st generation
   */
  A1 = 'a1',

  /**
   * Arm processor based instances, 2nd generation
   */
  STANDARD6_GRAVITON = 'm6g',

  /**
   * Arm processor based instances, 2nd generation
   */
  M6G = 'm6g',

  /**
   * Standard instances, 6th generation with Graviton2 processors and local NVME drive
   */
  STANDARD6_GRAVITON2_NVME_DRIVE = 'm6gd',

  /**
   * Standard instances, 6th generation with Graviton2 processors and local NVME drive
   */
  M6GD = 'm6gd',

  /**
   * High memory and compute capacity instances, 1st generation
   */
  HIGH_COMPUTE_MEMORY1 = 'z1d',

  /**
   * High memory and compute capacity instances, 1st generation
   */
  Z1D = 'z1d',

  /**
   * Inferentia Chips based instances for machine learning inference applications, 1st generation
   */
  INFERENCE1 = 'inf1',

  /**
   * Inferentia Chips based instances for machine learning inference applications, 1st generation
   */
  INF1 = 'inf1'
}

/**
 * Identifies an instance's CPU architecture
 */
export enum InstanceArchitecture {
  /**
   * ARM64 architecture
   */
  ARM_64 = 'arm64',

  /**
   * x86-64 architecture
   */
  X86_64 = 'x86_64',
}

/**
 * What size of instance to use
 */
export enum InstanceSize {
  /**
   * Instance size NANO (nano)
   */
  NANO = 'nano',

  /**
   * Instance size MICRO (micro)
   */
  MICRO = 'micro',

  /**
   * Instance size SMALL (small)
   */
  SMALL = 'small',

  /**
   * Instance size MEDIUM (medium)
   */
  MEDIUM = 'medium',

  /**
   * Instance size LARGE (large)
   */
  LARGE = 'large',

  /**
   * Instance size XLARGE (xlarge)
   */
  XLARGE = 'xlarge',

  /**
   * Instance size XLARGE2 (2xlarge)
   */
  XLARGE2 = '2xlarge',

  /**
   * Instance size XLARGE4 (4xlarge)
   */
  XLARGE4 = '4xlarge',

  /**
   * Instance size XLARGE6 (6xlarge)
   */
  XLARGE6 = '6xlarge',

  /**
   * Instance size XLARGE8 (8xlarge)
   */
  XLARGE8 = '8xlarge',

  /**
   * Instance size XLARGE9 (9xlarge)
   */
  XLARGE9 = '9xlarge',

  /**
   * Instance size XLARGE10 (10xlarge)
   */
  XLARGE10 = '10xlarge',

  /**
   * Instance size XLARGE12 (12xlarge)
   */
  XLARGE12 = '12xlarge',

  /**
   * Instance size XLARGE16 (16xlarge)
   */
  XLARGE16 = '16xlarge',

  /**
   * Instance size XLARGE18 (18xlarge)
   */
  XLARGE18 = '18xlarge',

  /**
   * Instance size XLARGE24 (24xlarge)
   */
  XLARGE24 = '24xlarge',

  /**
   * Instance size XLARGE32 (32xlarge)
   */
  XLARGE32 = '32xlarge',

  /**
   * Instance size METAL (metal)
   */
  METAL = 'metal',

}

/**
 * Instance type for EC2 instances
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export class InstanceType {
  /**
   * Instance type for EC2 instances
   *
   * This class takes a combination of a class and size.
   *
   * Be aware that not all combinations of class and size are available, and not all
   * classes are available in all regions.
   */
  public static of(instanceClass: InstanceClass, instanceSize: InstanceSize) {
    return new InstanceType(`${instanceClass}.${instanceSize}`);
  }

  constructor(private readonly instanceTypeIdentifier: string) {
  }

  /**
   * Return the instance type as a dotted string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }

  /**
   * The instance's CPU architecture
   */
  public get architecture(): InstanceArchitecture {
    // capture the family, generation, capabilities, and size portions of the instance type id
    const instanceTypeComponents = this.instanceTypeIdentifier.match(/^([a-z]+)(\d{1,2})([a-z]*)\.([a-z0-9]+)$/);
    if (instanceTypeComponents == null) {
      throw new Error('Malformed instance type identifier');
    }

    const family = instanceTypeComponents[1];
    const capabilities = instanceTypeComponents[3];

    // Instance family `a` are first-gen Graviton instances
    // Capability `g` indicates the instance is Graviton2 powered
    if (family === 'a' || capabilities.includes('g')) {
      return InstanceArchitecture.ARM_64;
    }

    return InstanceArchitecture.X86_64;
  }
}
