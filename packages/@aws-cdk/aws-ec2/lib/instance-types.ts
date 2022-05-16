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
   * Standard instances for high performance computing, 5th generation
   */
  STANDARD5_HIGH_PERFORMANCE = 'm5n',

  /**
   * Standard instances for high performance computing, 5th generation
   */
  M5N = 'm5n',

  /**
   * Standard instances with local NVME drive for high performance computing, 5th generation
   */
  STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE = 'm5dn',

  /**
   * Standard instances with local NVME drive for high performance computing, 5th generation
   */
  M5DN = 'm5dn',

  /**
   * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   */
  STANDARD5_HIGH_COMPUTE = 'm5zn',

  /**
   * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   */
  M5ZN = 'm5zn',

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
   * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   */
  MEMORY6_INTEL = 'r6i',

  /**
   * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   */
  R6I = 'r6i',

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
  MEMORY5_AMD_NVME_DRIVE = 'r5ad',

  /**
   * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_6TB_1 = 'u-6tb1',

  /**
   * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_6TB1 = 'u-6tb1',

  /**
   * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_9TB_1 = 'u-9tb1',

  /**
   * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_9TB1 = 'u-9tb1',

  /**
   * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_12TB_1 = 'u-12tb1',

  /**
   * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_12TB1 = 'u-12tb1',

  /**
   * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  HIGH_MEMORY_18TB_1 = 'u-18tb1',

  /**
   * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  U_18TB1 = 'u-18tb1',

  /**
   * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  HIGH_MEMORY_24TB_1 = 'u-24tb1',

  /**
   * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  U_24TB1 = 'u-24tb1',

  /**
   * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   */
  R5AD = 'r5ad',

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
   * Compute optimized instances with local NVME drive, 5th generation
   */
  C5D = 'c5d',

  /**
   * Compute optimized instances based on AMD EPYC, 5th generation
   */
  COMPUTE5_AMD = 'c5a',

  /**
   * Compute optimized instances based on AMD EPYC, 5th generation
   */
  C5A = 'c5a',

  /**
   * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   */
  COMPUTE5_AMD_NVME_DRIVE = 'c5ad',

  /**
   * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   */
  C5AD = 'c5ad',

  /**
   * Compute optimized instances for high performance computing, 5th generation
   */
  COMPUTE5_HIGH_PERFORMANCE = 'c5n',

  /**
   * Compute optimized instances for high performance computing, 5th generation
   */
  C5N = 'c5n',

  /**
   * Compute optimized instances, 6th generation
   */
  COMPUTE6_INTEL = 'c6i',

  /**
  * Compute optimized instances, 6th generation
  */
  C6I = 'c6i',

  /**
  * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
  */
  COMPUTE6_AMD = 'c6a',

  /**
  * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
  */
  C6A = 'c6a',

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
   * Storage-optimized instances, 3rd generation
   */
  STORAGE3 = 'd3',

  /**
   * Storage-optimized instances, 3rd generation
   */
  D3 = 'd3',

  /**
  * Storage-optimized instances, 3rd generation
  */
  STORAGE3_ENHANCED_NETWORK = 'd3en',

  /**
  * Storage-optimized instances, 3rd generation
  */
  D3EN = 'd3en',

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
   * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   */
  IO4_INTEL = 'i4i',

  /**
   * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   */
  I4I = 'i4i',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  STORAGE4_GRAVITON_NETWORK_OPTIMIZED = 'im4gn',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  IM4GN = 'im4gn',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED = 'is4gen',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  IS4GEN = 'is4gen',

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
   * Memory-intensive instances, 2nd generation with Graviton2 processors
   *
   * This instance type can be used only in RDS. It is not supported in EC2.
   */
  MEMORY_INTENSIVE_2_GRAVITON2 = 'x2g',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors
   *
   * This instance type can be used only in RDS. It is not supported in EC2.
   */
  X2G = 'x2g',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   */
  MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE = 'x2gd',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   */
  X2GD = 'x2gd',

  /**
   * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   */
  MEMORY_INTENSIVE_2_XT_INTEL = 'x2iedn',

  /**
   *  Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   */
  X2IEDN = 'x2iedn',

  /**
   * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   */
  MEMORY_INTENSIVE_2_INTEL = 'x2idn',

  /**
   * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   */
  X2IDN = 'x2idn',

  /**
   * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   */
  MEMORY_INTENSIVE_2_XTZ_INTEL = 'x2iezn',

  /**
   * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   */
  X2IEZN = 'x2iezn',

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
   * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   */
  GRAPHICS4_AMD_NVME_DRIVE = 'g4ad',

  /**
   * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   */
  G4AD = 'g4ad',

  /**
   * Graphics-optimized instances, 5th generation
   */
  GRAPHICS5 = 'g5',

  /**
   * Graphics-optimized instances, 5th generation
   */
  G5 = 'g5',

  /**
   * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   */
  GRAPHICS5_GRAVITON2 = 'g5g',

  /**
  * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
  */
  G5G = 'g5g',

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
   * Parallel-processing optimized instances, 3rd generation
   */
  P3 = 'p3',

  /**
   * Parallel-processing optimized instances, 4th generation
   */
  PARALLEL4 = 'p4d',

  /**
   * Parallel-processing optimized instances, 4th generation
   */
  P4D = 'p4d',

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
   * Standard instances based on Intel (Ice Lake), 6th generation.
   */
  STANDARD6_INTEL = 'm6i',

  /**
   * Standard instances based on Intel (Ice Lake), 6th generation.
   */
  M6I = 'm6i',

  /**
   * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   */
  STANDARD6_AMD = 'm6a',

  /**
  * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
  */
  M6A = 'm6a',

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
  INF1 = 'inf1',

  /**
   * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
   */
  MACINTOSH1_INTEL = 'mac1',

  /**
   * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
   */
  MAC1 = 'mac1',

  /**
   * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   */
  VIDEO_TRANSCODING1 = 'vt1',

  /**
   * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   */
  VT1 = 'vt1',

  /**
   * High performance computing based on AMD EPYC, 6th generation
   */
  HIGH_PERFORMANCE_COMPUTING6_AMD = 'hpc6a',

  /**
   * High performance computing based on AMD EPYC, 6th generation
   */
  HPC6A = 'hpc6a',
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
   * Instance size XLARGE3 (3xlarge)
   */
  XLARGE3 = '3xlarge',

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
   * Instance size XLARGE48 (48xlarge)
   */
  XLARGE48 = '48xlarge',

  /**
   * Instance size XLARGE56 (56xlarge)
   */
  XLARGE56 = '56xlarge',

  /**
   * Instance size XLARGE56 (112xlarge)
   */
  XLARGE112 = '112xlarge',

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
