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
  STANDARD3 = 'standard3',

  /**
   * Standard instances, 3rd generation
   */
  M3 = 'm3',

  /**
   * Standard instances, 4th generation
   */
  STANDARD4 = 'standard4',

  /**
   * Standard instances, 4th generation
   */
  M4 = 'm4',

  /**
   * Standard instances, 5th generation
   */
  STANDARD5 = 'standard5',

  /**
   * Standard instances, 5th generation
   */
  M5 = 'm5',

  /**
   * Standard instances with local NVME drive, 5th generation
   */
  STANDARD5_NVME_DRIVE = 'standard5-nvme-drive',

  /**
   * Standard instances with local NVME drive, 5th generation
   */
  M5D = 'm5d',

  /**
   * Standard instances based on AMD EPYC, 5th generation
   */
  STANDARD5_AMD = 'standard5-amd',

  /**
   * Standard instances based on AMD EPYC, 5th generation
   */
  M5A = 'm5a',

  /**
   * Standard instances based on AMD EPYC with local NVME drive, 5th generation
   */
  STANDARD5_AMD_NVME_DRIVE = 'standard5-amd-nvme-drive',

  /**
   * Standard instances based on AMD EPYC with local NVME drive, 5th generation
   */
  M5AD = 'm5ad',

  /**
   * Standard instances for high performance computing, 5th generation
   */
  STANDARD5_HIGH_PERFORMANCE = 'standard5-high-performance',

  /**
   * Standard instances for high performance computing, 5th generation
   */
  M5N = 'm5n',

  /**
   * Standard instances with local NVME drive for high performance computing, 5th generation
   */
  STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE = 'standard5-nvme-drive-high-performance',

  /**
   * Standard instances with local NVME drive for high performance computing, 5th generation
   */
  M5DN = 'm5dn',

  /**
   * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   */
  STANDARD5_HIGH_COMPUTE = 'standard5-high-compute',

  /**
   * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
   */
  M5ZN = 'm5zn',

  /**
   * Memory optimized instances, 3rd generation
   */
  MEMORY3 = 'memory3',

  /**
   * Memory optimized instances, 3rd generation
   */
  R3 = 'r3',

  /**
   * Memory optimized instances, 4th generation
   */
  MEMORY4 = 'memory4',

  /**
   * Memory optimized instances, 4th generation
   */
  R4 = 'r4',

  /**
   * Memory optimized instances, 5th generation
   */
  MEMORY5 = 'memory5',

  /**
   * Memory optimized instances, 5th generation
   */
  R5 = 'r5',

  /**
   * Memory optimized instances based on AMD EPYC, 6th generation
   */
  MEMORY6_AMD = 'memory6-amd',

  /**
   * Memory optimized instances based on AMD EPYC, 6th generation
   */
  R6A = 'r6a',

  /**
   * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   */
  MEMORY6_INTEL = 'memory6-intel',

  /**
   * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   */
  R6I = 'r6i',

  /**
   * Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   */
  MEMORY6_INTEL_NVME_DRIVE = 'memory6-intel-nvme-drive',

  /**
   * Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   */
  R6ID = 'r6id',

  /**
   * Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   */
  MEMORY6_INTEL_HIGH_PERFORMANCE = 'memory6-intel-high-performance',

  /**
   * Memory optimized instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   */
  R6IN = 'r6in',

  /**
   * Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   */
  MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE = 'memory6-intel-nvme-drive-high-performance',

  /**
   * Memory optimized instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation
   */
  R6IDN = 'r6idn',

  /**
   * Memory optimized instances for high performance computing, 5th generation
   */
  MEMORY5_HIGH_PERFORMANCE = 'memory5-high-performance',

  /**
   * Memory optimized instances for high performance computing, 5th generation
   */
  R5N = 'r5n',

  /**
   * Memory optimized instances with local NVME drive, 5th generation
   */
  MEMORY5_NVME_DRIVE = 'memory5-nvme-drive',

  /**
   * Memory optimized instances with local NVME drive, 5th generation
   */
  R5D = 'r5d',

  /**
   * Memory optimized instances with local NVME drive for high performance computing, 5th generation
   */
  MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE = 'memory5-nvme-drive-high-performance',

  /**
   * Memory optimized instances with local NVME drive for high performance computing, 5th generation
   */
  R5DN = 'r5dn',

  /**
   * Memory optimized instances based on AMD EPYC, 5th generation
   */
  MEMORY5_AMD = 'memory5-amd',

  /**
   * Memory optimized instances based on AMD EPYC, 5th generation
   */
  R5A = 'r5a',

  /**
   * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   */
  MEMORY5_AMD_NVME_DRIVE = 'memory5-amd-nvme-drive',

  /**
   * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
   */
  R5AD = 'r5ad',

  /**
   * High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_3TB_1 = 'high-memory-3tb-1',

  /**
   * High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_3TB1 = 'u-3tb1',

  /**
   * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_6TB_1 = 'high-memory-6tb-1',

  /**
   * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_6TB1 = 'u-6tb1',

  /**
   * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_9TB_1 = 'high-memory-9tb-1',

  /**
   * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_9TB1 = 'u-9tb1',

  /**
   * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  HIGH_MEMORY_12TB_1 = 'high-memory-12tb-1',

  /**
   * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
   */
  U_12TB1 = 'u-12tb1',

  /**
   * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  HIGH_MEMORY_18TB_1 = 'high-memory-18tb-1',

  /**
   * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  U_18TB1 = 'u-18tb1',

  /**
   * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  HIGH_MEMORY_24TB_1 = 'high-memory-24tb-1',

  /**
   * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
   */
  U_24TB1 = 'u-24tb1',

  /**
   * High memory instances (6TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  HIGH_MEMORY_6TB_7 = 'high-memory-6tb-7',

  /**
   * High memory instances (6TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  U7I_6TB = 'u7i-6tb',

  /**
   * High memory instances (8TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  HIGH_MEMORY_8TB_7 = 'high-memory-8tb-7',

  /**
   * High memory instances (8TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  U7I_8TB = 'u7i-8tb',

  /**
   * High memory instances (12TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  HIGH_MEMORY_12TB_7 = 'high-memory-12tb-7',

  /**
   * High memory instances (12TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  U7I_12TB = 'u7i-12tb',

  /**
   * High memory, network-intensive instances (16TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  HIGH_MEMORY_HIGH_NETWORK_16TB_7 = 'high-memory-high-network-16tb-7',

  /**
   * High memory, network-intensive instances (16TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  U7IN_16TB = 'u7in-16tb',

  /**
   * High memory, network-intensive instances (24TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  HIGH_MEMORY_HIGH_NETWORK_24TB_7 = 'high-memory-high-network-24tb-7',

  /**
   * High memory, network-intensive instances (24TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  U7IN_24TB = 'u7in-24tb',

  /**
   * High memory, network-intensive instances (32TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  HIGH_MEMORY_HIGH_NETWORK_32TB_7 = 'high-memory-high-network-32tb-7',

  /**
   * High memory, network-intensive instances (32TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   */
  U7IN_32TB = 'u7in-32tb',

  /**
   * High memory, network-intensive instances (32TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * U7inh instances use Hewlett Packard Enterprise (HPE) Compute Scale Up Server 3200.
   */
  HIGH_MEMORY_HIGH_NETWORK_HPE_32TB_7 = 'high-memory-high-network-hpe-32tb-7',

  /**
   * High memory, network-intensive instances (32TB) based on 4th Generation Intel Xeon Scalable processors (Sapphire Rapids), 7th generation
   * U7inh instances use Hewlett Packard Enterprise (HPE) Compute Scale Up Server 3200.
   */
  U7INH_32TB = 'u7inh-32tb',

  /**
   * Memory optimized instances that are also EBS-optimized, 5th generation
   */
  MEMORY5_EBS_OPTIMIZED = 'memory5-ebs-optimized',

  /**
   * Memory optimized instances that are also EBS-optimized, 5th generation
   */
  R5B = 'r5b',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors
   */
  MEMORY6_GRAVITON = 'memory6-graviton',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors
   */
  R6G = 'r6g',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   */
  MEMORY6_GRAVITON2_NVME_DRIVE = 'memory6-graviton2-nvme-drive',

  /**
   * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
   */
  R6GD = 'r6gd',

  /**
   * Memory optimized instances, 7th generation with Graviton3 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  MEMORY7_GRAVITON = 'memory7-graviton',

  /**
   * Memory optimized instances, 7th generation with Graviton3 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  R7G = 'r7g',

  /**
   * Memory optimized instances, 7th generation with Graviton3 processors and local NVME drive
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  MEMORY7_GRAVITON3_NVME_DRIVE = 'memory7-graviton3-nvme-drive',

  /**
   * Memory optimized instances, 7th generation with Graviton3 processors and local NVME drive
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  R7GD = 'r7gd',

  /**
   * Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   */
  MEMORY7_INTEL_BASE = 'memory7-intel-base',

  /**
   * Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation w/  3.2GHz turbo frequency
   */
  R7I = 'r7i',

  /**
   * Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   */
  MEMORY7_INTEL = 'memory7-intel',

  /**
   * Memory optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation, with sustained 3.9GHz turbo frequency
   */
  R7IZ = 'r7iz',

  /**
   * Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   */
  MEMORY7_AMD = 'memory7-amd',

  /**
   * Memory optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   */
  R7A = 'r7a',

  /**
   * Memory optimized instances with Graviton4 processors
   */
  MEMORY8_GRAVITON = 'memory8-graviton',

  /**
   * Memory optimized instances with Graviton4 processors
   */
  R8G = 'r8g',

  /**
   * Compute optimized instances, 3rd generation
   */
  COMPUTE3 = 'compute3',

  /**
   * Compute optimized instances, 3rd generation
   */
  C3 = 'c3',

  /**
   * Compute optimized instances, 4th generation
   */
  COMPUTE4 = 'compute4',

  /**
   * Compute optimized instances, 4th generation
   */
  C4 = 'c4',

  /**
   * Compute optimized instances, 5th generation
   */
  COMPUTE5 = 'compute5',

  /**
   * Compute optimized instances, 5th generation
   */
  C5 = 'c5',

  /**
   * Compute optimized instances with local NVME drive, 5th generation
   */
  COMPUTE5_NVME_DRIVE = 'compute5-nvme-drive',

  /**
   * Compute optimized instances with local NVME drive, 5th generation
   */
  C5D = 'c5d',

  /**
   * Compute optimized instances based on AMD EPYC, 5th generation
   */
  COMPUTE5_AMD = 'compute5-amd',

  /**
   * Compute optimized instances based on AMD EPYC, 5th generation
   */
  C5A = 'c5a',

  /**
   * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   */
  COMPUTE5_AMD_NVME_DRIVE = 'compute5-amd-nvme-drive',

  /**
   * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
   */
  C5AD = 'c5ad',

  /**
   * Compute optimized instances for high performance computing, 5th generation
   */
  COMPUTE5_HIGH_PERFORMANCE = 'compute5-high-performance',

  /**
   * Compute optimized instances for high performance computing, 5th generation
   */
  C5N = 'c5n',

  /**
   * Compute optimized instances, 6th generation
   */
  COMPUTE6_INTEL = 'compute6-intel',

  /**
   * Compute optimized instances, 6th generation
   */
  C6I = 'c6i',

  /**
   * Compute optimized instances with local NVME drive, 6th generation
   */
  COMPUTE6_INTEL_NVME_DRIVE = 'compute6-intel-nvme-drive',

  /**
   * Compute optimized instances with local NVME drive, 6th generation
   */
  C6ID = 'c6id',

  /**
   * Compute optimized instances for high performance computing, 6th generation
   */
  COMPUTE6_INTEL_HIGH_PERFORMANCE = 'compute6-intel-high-performance',

  /**
   * Compute optimized instances for high performance computing, 6th generation
   */
  C6IN = 'c6in',

  /**
   * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   */
  COMPUTE6_AMD = 'compute6-amd',

  /**
   * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
   */
  C6A = 'c6a',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   */
  COMPUTE6_GRAVITON2 = 'compute6-graviton2',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   */
  C6G = 'c6g',

  /**
   * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   */
  COMPUTE7_GRAVITON3 = 'compute7-graviton3',

  /**
   * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   */
  C7G = 'c7g',

  /**
   * Compute optimized instances for high performance computing, 8th generation with Graviton4 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   */
  COMPUTE8_GRAVITON4 = 'compute8-graviton4',

  /**
   * Compute optimized instances for high performance computing, 8th generation with Graviton4 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   */
  C8G = 'c8g',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and local NVME drive
   */
  COMPUTE6_GRAVITON2_NVME_DRIVE = 'compute6-graviton2-nvme-drive',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and local NVME drive
   */
  C6GD = 'c6gd',

  /**
   * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME drive
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  COMPUTE7_GRAVITON3_NVME_DRIVE = 'compute7-graviton3-nvme-drive',

  /**
   * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors and local NVME drive
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  C7GD = 'c7gd',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and high network bandwidth capabilities
   */
  COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH = 'compute6-graviton2-high-network-bandwidth',

  /**
   * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
   * and high network bandwidth capabilities
   */
  C6GN = 'c6gn',

  /**
   * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * and high network bandwidth capabilities
   */
  COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH = 'compute7-graviton3-high-network-bandwidth',

  /**
   * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
   * and high network bandwidth capabilities
   */
  C7GN = 'c7gn',

  /**
   * Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   */
  COMPUTE7_INTEL = 'compute7-intel',

  /**
   * Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   */
  C7I = 'c7i',

  /**
   * Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * C7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   */
  COMPUTE7_INTEL_FLEX = 'compute7-intel-flex',

  /**
   * Compute optimized instances based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * C7i-flex instances efficiently use compute resources to deliver a baseline level of performance with the ability to scale up to the full compute performance a majority of the time.
   */
  C7I_FLEX = 'c7i-flex',

  /**
   * Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   */
  COMPUTE7_AMD = 'compute7-amd',

  /**
   * Compute optimized instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   */
  C7A = 'c7a',

  /**
   * Storage-optimized instances, 2nd generation
   */
  STORAGE2 = 'storage2',

  /**
   * Storage-optimized instances, 2nd generation
   */
  D2 = 'd2',

  /**
   * Storage-optimized instances, 3rd generation
   */
  STORAGE3 = 'storage3',

  /**
   * Storage-optimized instances, 3rd generation
   */
  D3 = 'd3',

  /**
  * Storage-optimized instances, 3rd generation
  */
  STORAGE3_ENHANCED_NETWORK = 'storage3-enhanced-network',

  /**
   * Storage-optimized instances, 3rd generation
   */
  D3EN = 'd3en',

  /**
   * Storage/compute balanced instances, 1st generation
   */
  STORAGE_COMPUTE_1 = 'storage-compute-1',

  /**
   * Storage/compute balanced instances, 1st generation
   */
  H1 = 'h1',

  /**
   * High performance computing powered by AWS Trainium
   */
  TRAINING_ACCELERATOR1 = 'training-accelerator1',

  /**
   * High performance computing powered by AWS Trainium
   */
  TRN1 = 'trn1',

  /**
   * Network-optimized high performance computing powered by AWS Trainium
   */
  TRAINING_ACCELERATOR1_ENHANCED_NETWORK = 'training-accelerator1-enhanced-network',

  /**
   * Network-optimized high performance computing powered by AWS Trainium
   */
  TRN1N = 'trn1n',

  /**
   * High performance computing powered by AWS Trainium2, 2nd generation
   */
  TRAINING_ACCELERATOR2 = 'training-accelerator2',

  /**
   * High performance computing powered by AWS Trainium2, 2nd generation
   */
  TRN2 = 'trn2',

  /**
   * High performance computing powered by AWS Trainium2 and EC2 Ultra Servers, 2nd generation
   * UltraServers connect multiple EC2 instances using a dedicated, high-bandwidth, low-latency accelerator interconnect
   */
  TRAINING_ACCELERATOR2_ULTRASERVER = 'training-accelerator2-ultraserver',

  /**
   * High performance computing powered by AWS Trainium2 and EC2 Ultra Servers, 2nd generation
   * UltraServers connect multiple EC2 instances using a dedicated, high-bandwidth, low-latency accelerator interconnect
   */
  TRN2U = 'trn2u',

  /**
   * I/O-optimized instances, 3rd generation
   */
  IO3 = 'io3',

  /**
   * I/O-optimized instances, 3rd generation
   */
  I3 = 'i3',

  /**
   * I/O-optimized instances with local NVME drive, 3rd generation
   */
  IO3_DENSE_NVME_DRIVE = 'io3-dense-nvme-drive',

  /**
   * I/O-optimized instances with local NVME drive, 3rd generation
   */
  I3EN = 'i3en',

  /**
   * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   */
  IO4_INTEL = 'io4_intel',

  /**
   * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
   */
  I4I = 'i4i',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  STORAGE4_GRAVITON = 'storage4_graviton',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  I4G = 'i4g',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  STORAGE4_GRAVITON_NETWORK_OPTIMIZED = 'storage4-graviton-network-optimized',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  IM4GN = 'im4gn',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED = 'storage4-graviton-network-storage-optimized',

  /**
   * Storage optimized instances powered by Graviton2 processor, 4th generation
   */
  IS4GEN = 'is4gen',

  /**
   * Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   */
  STORAGE7_INTEL_STORAGE_OPTIMIZED = 'storage7-intel-storage-optimized',

  /**
   * Storage optimized instances powered by 5th generation Intel Xeon Scalable processors, 7th generation
   */
  I7IE = 'i7ie',

  /**
   * Storage optimized instances powered by Graviton4 processor, 8th generation
   */
  STORAGE8_GRAVITON = 'storage8-graviton',

  /**
   * Storage optimized instances powered by Graviton4 processor, 8th generation
   */
  I8G = 'i8g',

  /**
   * Burstable instances, 2nd generation
   */
  BURSTABLE2 = 'burstable2',

  /**
   * Burstable instances, 2nd generation
   */
  T2 = 't2',

  /**
   * Burstable instances, 3rd generation
   */
  BURSTABLE3 = 'burstable3',

  /**
   * Burstable instances, 3rd generation
   */
  T3 = 't3',

  /**
   * Burstable instances based on AMD EPYC, 3rd generation
   */
  BURSTABLE3_AMD = 'burstable3-amd',

  /**
   * Burstable instances based on AMD EPYC, 3rd generation
   */
  T3A = 't3a',

  /**
   * Burstable instances, 4th generation with Graviton2 processors
   */
  BURSTABLE4_GRAVITON = 'burstable4-graviton',

  /**
   * Burstable instances, 4th generation with Graviton2 processors
   */
  T4G = 't4g',

  /**
   * Memory-intensive instances, 1st generation
   */
  MEMORY_INTENSIVE_1 = 'memory-intensive-1',

  /**
   * Memory-intensive instances, 1st generation
   */
  X1 = 'x1',

  /**
   * Memory-intensive instances, extended, 1st generation
   */
  MEMORY_INTENSIVE_1_EXTENDED = 'memory-intensive-1-extended',

  /**
   * Memory-intensive instances, extended, 1st generation
   */
  X1E = 'x1e',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors
   *
   * This instance type can be used only in RDS. It is not supported in EC2.
   */
  MEMORY_INTENSIVE_2_GRAVITON2 = 'memory-intensive-2-graviton2',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors
   *
   * This instance type can be used only in RDS. It is not supported in EC2.
   */
  X2G = 'x2g',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   */
  MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE = 'memory-intensive-2-graviton2-nvme-drive',

  /**
   * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
   */
  X2GD = 'x2gd',

  /**
   * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   */
  MEMORY_INTENSIVE_2_XT_INTEL = 'memory_intensive_2_xt_intel',

  /**
   * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
   */
  X2IEDN = 'x2iedn',

  /**
   * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   */
  MEMORY_INTENSIVE_2_INTEL = 'memory_intensive_2_intel',

  /**
   * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
   */
  X2IDN = 'x2idn',

  /**
   * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   */
  MEMORY_INTENSIVE_2_XTZ_INTEL = 'memory_intensive_2_xtz_intel',

  /**
   * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
   */
  X2IEZN = 'x2iezn',

  /**
   * Memory-intensive instances powered by Graviton4 processors, 8th generation
   */
  MEMORY_INTENSIVE_8_GRAVITON = 'memory-intensive-8-graviton',

  /**
   * Memory-intensive instances powered by Graviton4 processors, 8th generation
   */
  X8G = 'x8g',

  /**
   * Instances with customizable hardware acceleration, 1st generation
   */
  FPGA1 = 'fpga1',

  /**
   * Instances with customizable hardware acceleration, 1st generation
   */
  F1 = 'f1',

  /**
   * Instances with customizable hardware acceleration, 2nd generation
   */
  FPGA2 = 'fpga2',

  /**
   * Instances with customizable hardware acceleration, 2nd generation
   */
  F2 = 'f2',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  GRAPHICS3_SMALL = 'graphics3-small',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  G3S = 'g3s',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  GRAPHICS3 = 'graphics3',

  /**
   * Graphics-optimized instances, 3rd generation
   */
  G3 = 'g3',

  /**
   * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   */
  GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE = 'graphics4-nvme-drive-high-performance',

  /**
   * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
   */
  G4DN = 'g4dn',

  /**
   * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   */
  GRAPHICS4_AMD_NVME_DRIVE = 'graphics4-amd-nvme-drive',

  /**
   * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
   */
  G4AD = 'g4ad',

  /**
   * Graphics-optimized instances, 5th generation
   */
  GRAPHICS5 = 'graphics5',

  /**
   * Graphics-optimized instances, 5th generation
   */
  G5 = 'g5',

  /**
   * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   */
  GRAPHICS5_GRAVITON2 = 'graphics5-graviton2',

  /**
   * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
   */
  G5G = 'g5g',

  /**
   * Graphics-optimized instances, 6th generation
   */
  GRAPHICS6 = 'graphics6',

  /**
   * Graphics-optimized instances, 6th generation
   */
  G6 = 'g6',

  /**
   * Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   */
  GRAPHICS6_EFFICIENT = 'graphics6-efficient',

  /**
   * Cost-efficient GPU-based instances for AI inference and spatial computing workloads, 6th generation
   */
  G6E = 'g6e',

  /**
   * Graphics-optimized instances, 6th generation
   * Gr6 instances offer a 1:8 vCPU to RAM ratio, making them better suited for graphics workloads with higher memory requirements.
   */
  GRAPHICS_RAM_6 = 'graphics-ram-6',

  /**
   * Graphics-optimized instances, 6th generation
   * Gr6 instances offer a 1:8 vCPU to RAM ratio, making them better suited for graphics workloads with higher memory requirements.
   */
  GR6 = 'gr6',

  /**
   * Parallel-processing optimized instances, 2nd generation
   */
  PARALLEL2 = 'parallel2',

  /**
   * Parallel-processing optimized instances, 2nd generation
   */
  P2 = 'p2',

  /**
   * Parallel-processing optimized instances, 3rd generation
   */
  PARALLEL3 = 'parallel3',

  /**
   * Parallel-processing optimized instances, 3rd generation
   */
  P3 = 'p3',

  /**
   * Parallel-processing optimized instances with local NVME drive for high performance computing, 3rd generation
   */
  PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE = 'parallel3-nvme-drive-high-performance',

  /**
   * Parallel-processing optimized instances with local NVME drive for high performance computing, 3rd generation
   */
  P3DN = 'p3dn',

  /**
   * Parallel-processing optimized instances with local NVME drive, extended, 4th generation (in developer preview)
   */
  PARALLEL4_NVME_DRIVE_EXTENDED = 'parallel4-nvme-drive-extended',

  /**
   * Parallel-processing optimized instances with local NVME drive, extended, 4th generation (in developer preview)
   */
  P4DE = 'p4de',

  /**
   * Parallel-processing optimized instances, 4th generation
   */
  PARALLEL4 = 'parallel4',

  /**
   * Parallel-processing optimized instances, 4th generation
   */
  P4D = 'p4d',

  /**
   * Parallel-processing optimized instances powered by NVIDIA H100 Tensor Core GPUs, 5th generation
   */
  PARALLEL5 = 'parallel5',

  /**
   * Parallel-processing optimized instances powered by NVIDIA H100 Tensor Core GPUs, 5th generation
   */
  P5 = 'p5',

  /**
   * Parallel-processing optimized instances powered by NVIDIA H200 Tensor Core GPUs, 5th generation
   */
  PARALLEL5_EXTENDED = 'parallel5-extended',

  /**
   * Parallel-processing optimized instances, 5th generation
   */
  P5E = 'p5e',

  /**
   * Parallel-processing, network-optimized instances powered by NVIDIA H200 Tensor Core GPUs, 5th generation
   * P5en instances pair NVIDIA H200 Tensor Core GPUs with Intel Sapphire Rapids CPU, enabling Gen5 PCIe between CPU and GPU
   */
  PARALLEL5_EXTENDED_NETWORK = 'parallel5-extended-network',

  /**
   * Parallel-processing optimized instances, 5th generation
   */
  P5EN = 'p5en',

  /**
   * Arm processor based instances, 1st generation
   */
  ARM1 = 'arm1',

  /**
   * Arm processor based instances, 1st generation
   */
  A1 = 'a1',

  /**
   * Arm processor based instances, 2nd generation
   */
  STANDARD6_GRAVITON = 'standard6-graviton',

  /**
   * Arm processor based instances, 2nd generation
   */
  M6G = 'm6g',

  /**
   * Standard instances based on Intel (Ice Lake), 6th generation.
   */
  STANDARD6_INTEL = 'standard6-intel',

  /**
   * Standard instances based on Intel (Ice Lake), 6th generation.
   */
  M6I = 'm6i',

  /**
   * Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   */
  STANDARD6_INTEL_NVME_DRIVE = 'standard6-intel-nvme-drive',

  /**
   * Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
   */
  M6ID = 'm6id',

  /**
   * Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   */
  STANDARD6_INTEL_HIGH_PERFORMANCE = 'standard6-intel-high-performance',

  /**
   * Standard instances for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   */
  M6IN = 'm6in',

  /**
   * Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   */
  STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE = 'standard6-intel-nvme-drive-high-performance',

  /**
   * Standard instances with local NVME drive for high performance computing powered by Intel Xeon Scalable processors (code named Ice Lake), 6th generation.
   */
  M6IDN = 'm6idn',

  /**
   * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   */
  STANDARD6_AMD = 'standard6-amd',

  /**
   * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
   */
  M6A = 'm6a',

  /**
   * Standard instances, 6th generation with Graviton2 processors and local NVME drive
   */
  STANDARD6_GRAVITON2_NVME_DRIVE = 'standard6-graviton2-nvme-drive',

  /**
   * Standard instances, 6th generation with Graviton2 processors and local NVME drive
   */
  M6GD = 'm6gd',

  /**
   * Standard instances, 7th generation with Graviton3 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  STANDARD7_GRAVITON = 'standard7-graviton',

  /**
   * Standard instances, 7th generation with Graviton3 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  M7G = 'm7g',

  /**
   * Standard instances, 8th generation with Graviton4 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   */
  STANDARD8_GRAVITON = 'standard8-graviton',

  /**
   * Standard instances, 8th generation with Graviton4 processors
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Frankfurt).
   */
  M8G = 'm8g',

  /**
   * Standard instances, 7th generation with Graviton3 processors and local NVME drive
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  STANDARD7_GRAVITON3_NVME_DRIVE = 'standard7-graviton3-nvme-drive',

  /**
   * Standard instances, 7th generation with Graviton3 processors and local NVME drive
   *
   * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
   */
  M7GD = 'm7gd',

  /**
   * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   */
  STANDARD7_INTEL = 'standard7-intel',

  /**
   * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   */
  M7I = 'm7i',

  /**
   * Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * The M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   */
  STANDARD7_INTEL_FLEX = 'standard7-intel-flex',

  /**
   * Flexible instances with high memory and compute capacity based on Intel Xeon Scalable (Sapphire Rapids) processors, 7th generation
   * The M7i-Flex instances deliver a baseline of 40% CPU performance, and can scale up to full CPU performance 95% of the time
   */
  M7I_FLEX = 'm7i-flex',

  /**
   * Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   */
  STANDARD7_AMD = 'standard7-amd',

  /**
   * Standard instances based on 4th generation AMD EPYC (codename Genoa), 7th generation
   */
  M7A = 'm7a',

  /**
   * High memory and compute capacity instances, 1st generation
   */
  HIGH_COMPUTE_MEMORY1 = 'high-compute-memory1',

  /**
   * High memory and compute capacity instances, 1st generation
   */
  Z1D = 'z1d',

  /**
   * Inferentia Chips based instances for machine learning inference applications, 1st generation
   */
  INFERENCE1 = 'inference1',

  /**
   * Inferentia Chips based instances for machine learning inference applications, 1st generation
   */
  INF1 = 'inf1',

  /**
   * Inferentia Chips based instances for machine learning inference applications, 2nd generation
   */
  INFERENCE2 = 'inference2',

  /**
   * Inferentia Chips based instances for machine learning inference applications, 2nd generation
   */
  INF2 = 'inf2',

  /**
   * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
   */
  MACINTOSH1_INTEL = 'macintosh1-intel',

  /**
   * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
   */
  MAC1 = 'mac1',

  /**
   * Macintosh instances built on Apple Mac mini 2020 computers, 2nd generation with Apple silicon M1 processors
   */
  MACINTOSH2_M1 = 'macintosh2-m1',

  /**
   * Macintosh instances built on Apple Mac mini 2020 computers, 2nd generation with Apple silicon M1 processors
   */
  MAC2 = 'mac2',

  /**
   * Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 processors
   */
  MACINTOSH2_M2 = 'macintosh2-m2',

  /**
   * Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 processors
   */
  MAC2_M2 = 'mac2-m2',

  /**
   * Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 Pro processors
   */
  MACINTOSH2_M2_PRO = 'macintosh2-m2-pro',

  /**
   * Macintosh instances built on Apple Mac mini 2023 computers, 2nd generation with Apple silicon M2 Pro processors
   */
  MAC2_M2PRO = 'mac2-m2pro',

  /**
   * Macintosh instances built on 2022 Mac Studio hardware powered by Apple silicon M1 Ultra processors
   */
  MACINTOSH2_M1_ULTRA = 'macintosh2-m1-ultra',

  /**
   * Macintosh instances built on 2022 Mac Studio hardware powered by Apple silicon M1 Ultra processors
   */
  MAC2_M1ULTRA = 'mac2-m1ultra',

  /**
   * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   */
  VIDEO_TRANSCODING1 = 'video-transcoding1',

  /**
   * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
   */
  VT1 = 'vt1',

  /**
   * High performance computing based on AMD EPYC, 6th generation
   */
  HIGH_PERFORMANCE_COMPUTING6_AMD = 'high-performance-computing6-amd',

  /**
   * High performance computing based on AMD EPYC, 6th generation
   */
  HPC6A = 'hpc6a',

  /**
   * High performance computing with local NVME drive based on 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake), 6th generation
   */
  HIGH_PERFORMANCE_COMPUTING6_INTEL_NVME_DRIVE = 'high-performance-computing6-intel-nvme-drive',

  /**
   * High performance computing with local NVME drive based on 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake), 6th generation
   */
  HPC6ID = 'hpc6id',

  /**
   * High performance computing based on AMD EPYC, 7th generation
   */
  HIGH_PERFORMANCE_COMPUTING7_AMD = 'high-performance-computing7-amd',

  /**
   * High performance computing based on AMD EPYC, 7th generation
   */
  HPC7A = 'hpc7a',

  /**
   * High performance computing based on Graviton, 7th generation
   */
  HIGH_PERFORMANCE_COMPUTING7_GRAVITON = 'high-performance-computing7-graviton',

  /**
   * High performance computing based on Graviton, 7th generation
   */
  HPC7G = 'hpc7g',

  /**
   * Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
   */
  DEEP_LEARNING1 = 'deep-learning1',

  /**
   * Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
   */
  DL1 = 'dl1',

  /**
   * Deep learning instances powered by Qualcomm AI 100 Standard accelerators, 2nd generation
   */
  DEEP_LEARNING2_QUALCOMM = 'deep-learning2-qualcomm',

  /**
   * Deep learning instances powered by Qualcomm AI 100 Standard accelerators, 2nd generation
   */
  DL2Q = 'dl2q',
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
   * Instance size XLARGE96 (96xlarge)
   */
  XLARGE96 = '96xlarge',

  /**
   * Instance size XLARGE112 (112xlarge)
   */
  XLARGE112 = '112xlarge',

  /**
   * Instance size XLARGE224 (224xlarge)
   */
  XLARGE224 = '224xlarge',

  /**
   * Instance size XLARGE480 (480xlarge)
   */
  XLARGE480 = '480xlarge',

  /**
   * Instance size METAL (metal)
   */
  METAL = 'metal',

  /**
   * Instance size XLARGE16METAL (metal-16xl)
   */
  XLARGE16METAL = 'metal-16xl',

  /**
   * Instance size XLARGE24METAL (metal-24xl)
   */
  XLARGE24METAL = 'metal-24xl',

  /**
   * Instance size XLARGE32METAL (metal-32xl)
   */
  XLARGE32METAL = 'metal-32xl',

  /**
   * Instance size XLARGE48METAL (metal-48xl)
   */
  XLARGE48METAL = 'metal-48xl',
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
    // JSII does not allow enum types to have same value. So to support the enum, the enum with same value has to be mapped later.
    const instanceClassMap: Record<InstanceClass, string> = {
      [InstanceClass.STANDARD3]: 'm3',
      [InstanceClass.M3]: 'm3',
      [InstanceClass.STANDARD4]: 'm4',
      [InstanceClass.M4]: 'm4',
      [InstanceClass.STANDARD5]: 'm5',
      [InstanceClass.M5]: 'm5',
      [InstanceClass.STANDARD5_NVME_DRIVE]: 'm5d',
      [InstanceClass.M5D]: 'm5d',
      [InstanceClass.STANDARD5_AMD]: 'm5a',
      [InstanceClass.M5A]: 'm5a',
      [InstanceClass.STANDARD5_AMD_NVME_DRIVE]: 'm5ad',
      [InstanceClass.M5AD]: 'm5ad',
      [InstanceClass.STANDARD5_HIGH_PERFORMANCE]: 'm5n',
      [InstanceClass.M5N]: 'm5n',
      [InstanceClass.STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE]: 'm5dn',
      [InstanceClass.M5DN]: 'm5dn',
      [InstanceClass.STANDARD5_HIGH_COMPUTE]: 'm5zn',
      [InstanceClass.M5ZN]: 'm5zn',
      [InstanceClass.MEMORY3]: 'r3',
      [InstanceClass.R3]: 'r3',
      [InstanceClass.MEMORY4]: 'r4',
      [InstanceClass.R4]: 'r4',
      [InstanceClass.MEMORY5]: 'r5',
      [InstanceClass.R5]: 'r5',
      [InstanceClass.MEMORY6_AMD]: 'r6a',
      [InstanceClass.R6A]: 'r6a',
      [InstanceClass.MEMORY6_INTEL]: 'r6i',
      [InstanceClass.R6I]: 'r6i',
      [InstanceClass.MEMORY6_INTEL_NVME_DRIVE]: 'r6id',
      [InstanceClass.R6ID]: 'r6id',
      [InstanceClass.MEMORY6_INTEL_HIGH_PERFORMANCE]: 'r6in',
      [InstanceClass.R6IN]: 'r6in',
      [InstanceClass.MEMORY6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE]: 'r6idn',
      [InstanceClass.R6IDN]: 'r6idn',
      [InstanceClass.MEMORY5_HIGH_PERFORMANCE]: 'r5n',
      [InstanceClass.R5N]: 'r5n',
      [InstanceClass.MEMORY5_NVME_DRIVE]: 'r5d',
      [InstanceClass.R5D]: 'r5d',
      [InstanceClass.MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE]: 'r5dn',
      [InstanceClass.R5DN]: 'r5dn',
      [InstanceClass.MEMORY5_AMD]: 'r5a',
      [InstanceClass.R5A]: 'r5a',
      [InstanceClass.MEMORY5_AMD_NVME_DRIVE]: 'r5ad',
      [InstanceClass.R5AD]: 'r5ad',
      [InstanceClass.HIGH_MEMORY_3TB_1]: 'u-3tb1',
      [InstanceClass.U_3TB1]: 'u-3tb1',
      [InstanceClass.HIGH_MEMORY_6TB_1]: 'u-6tb1',
      [InstanceClass.U_6TB1]: 'u-6tb1',
      [InstanceClass.HIGH_MEMORY_9TB_1]: 'u-9tb1',
      [InstanceClass.U_9TB1]: 'u-9tb1',
      [InstanceClass.HIGH_MEMORY_12TB_1]: 'u-12tb1',
      [InstanceClass.U_12TB1]: 'u-12tb1',
      [InstanceClass.HIGH_MEMORY_18TB_1]: 'u-18tb1',
      [InstanceClass.U_18TB1]: 'u-18tb1',
      [InstanceClass.HIGH_MEMORY_24TB_1]: 'u-24tb1',
      [InstanceClass.U_24TB1]: 'u-24tb1',
      [InstanceClass.HIGH_MEMORY_6TB_7]: 'u7i-6tb',
      [InstanceClass.U7I_6TB]: 'u7i-6tb',
      [InstanceClass.HIGH_MEMORY_8TB_7]: 'u7i-8tb',
      [InstanceClass.U7I_8TB]: 'u7i-8tb',
      [InstanceClass.HIGH_MEMORY_12TB_7]: 'u7i-12tb',
      [InstanceClass.U7I_12TB]: 'u7i-12tb',
      [InstanceClass.HIGH_MEMORY_HIGH_NETWORK_16TB_7]: 'u7in-16tb',
      [InstanceClass.U7IN_16TB]: 'u7in-16tb',
      [InstanceClass.HIGH_MEMORY_HIGH_NETWORK_24TB_7]: 'u7in-24tb',
      [InstanceClass.U7IN_24TB]: 'u7in-24tb',
      [InstanceClass.HIGH_MEMORY_HIGH_NETWORK_32TB_7]: 'u7in-32tb',
      [InstanceClass.U7IN_32TB]: 'u7in-32tb',
      [InstanceClass.HIGH_MEMORY_HIGH_NETWORK_HPE_32TB_7]: 'u7inh-32tb',
      [InstanceClass.U7INH_32TB]: 'u7inh-32tb',
      [InstanceClass.MEMORY5_EBS_OPTIMIZED]: 'r5b',
      [InstanceClass.R5B]: 'r5b',
      [InstanceClass.MEMORY6_GRAVITON]: 'r6g',
      [InstanceClass.R6G]: 'r6g',
      [InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE]: 'r6gd',
      [InstanceClass.R6GD]: 'r6gd',
      [InstanceClass.MEMORY7_GRAVITON]: 'r7g',
      [InstanceClass.R7G]: 'r7g',
      [InstanceClass.MEMORY7_GRAVITON3_NVME_DRIVE]: 'r7gd',
      [InstanceClass.R7GD]: 'r7gd',
      [InstanceClass.MEMORY7_INTEL_BASE]: 'r7i',
      [InstanceClass.R7I]: 'r7i',
      [InstanceClass.MEMORY7_INTEL]: 'r7iz',
      [InstanceClass.R7IZ]: 'r7iz',
      [InstanceClass.MEMORY7_AMD]: 'r7a',
      [InstanceClass.R7A]: 'r7a',
      [InstanceClass.MEMORY8_GRAVITON]: 'r8g',
      [InstanceClass.R8G]: 'r8g',
      [InstanceClass.COMPUTE3]: 'c3',
      [InstanceClass.C3]: 'c3',
      [InstanceClass.COMPUTE4]: 'c4',
      [InstanceClass.C4]: 'c4',
      [InstanceClass.COMPUTE5]: 'c5',
      [InstanceClass.C5]: 'c5',
      [InstanceClass.COMPUTE5_NVME_DRIVE]: 'c5d',
      [InstanceClass.C5D]: 'c5d',
      [InstanceClass.COMPUTE5_AMD]: 'c5a',
      [InstanceClass.C5A]: 'c5a',
      [InstanceClass.COMPUTE5_AMD_NVME_DRIVE]: 'c5ad',
      [InstanceClass.C5AD]: 'c5ad',
      [InstanceClass.COMPUTE5_HIGH_PERFORMANCE]: 'c5n',
      [InstanceClass.C5N]: 'c5n',
      [InstanceClass.COMPUTE6_INTEL]: 'c6i',
      [InstanceClass.C6I]: 'c6i',
      [InstanceClass.COMPUTE6_INTEL_HIGH_PERFORMANCE]: 'c6in',
      [InstanceClass.C6IN]: 'c6in',
      [InstanceClass.COMPUTE6_INTEL_NVME_DRIVE]: 'c6id',
      [InstanceClass.C6ID]: 'c6id',
      [InstanceClass.COMPUTE6_AMD]: 'c6a',
      [InstanceClass.C6A]: 'c6a',
      [InstanceClass.COMPUTE6_GRAVITON2]: 'c6g',
      [InstanceClass.C6G]: 'c6g',
      [InstanceClass.COMPUTE6_GRAVITON2_NVME_DRIVE]: 'c6gd',
      [InstanceClass.C6GD]: 'c6gd',
      [InstanceClass.COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH]: 'c6gn',
      [InstanceClass.C6GN]: 'c6gn',
      [InstanceClass.COMPUTE7_GRAVITON3]: 'c7g',
      [InstanceClass.C7G]: 'c7g',
      [InstanceClass.COMPUTE7_GRAVITON3_NVME_DRIVE]: 'c7gd',
      [InstanceClass.C7GD]: 'c7gd',
      [InstanceClass.COMPUTE7_GRAVITON3_HIGH_NETWORK_BANDWIDTH]: 'c7gn',
      [InstanceClass.C7GN]: 'c7gn',
      [InstanceClass.COMPUTE7_INTEL]: 'c7i',
      [InstanceClass.C7I]: 'c7i',
      [InstanceClass.COMPUTE7_INTEL_FLEX]: 'c7i-flex',
      [InstanceClass.C7I_FLEX]: 'c7i-flex',
      [InstanceClass.COMPUTE7_AMD]: 'c7a',
      [InstanceClass.C7A]: 'c7a',
      [InstanceClass.COMPUTE8_GRAVITON4]: 'c8g',
      [InstanceClass.C8G]: 'c8g',
      [InstanceClass.STORAGE2]: 'd2',
      [InstanceClass.D2]: 'd2',
      [InstanceClass.STORAGE3]: 'd3',
      [InstanceClass.D3]: 'd3',
      [InstanceClass.STORAGE3_ENHANCED_NETWORK]: 'd3en',
      [InstanceClass.D3EN]: 'd3en',
      [InstanceClass.TRAINING_ACCELERATOR1]: 'trn1',
      [InstanceClass.TRN1]: 'trn1',
      [InstanceClass.TRAINING_ACCELERATOR1_ENHANCED_NETWORK]: 'trn1n',
      [InstanceClass.TRN1N]: 'trn1n',
      [InstanceClass.TRAINING_ACCELERATOR2]: 'trn2',
      [InstanceClass.TRN2]: 'trn2',
      [InstanceClass.TRAINING_ACCELERATOR2_ULTRASERVER]: 'trn2u',
      [InstanceClass.TRN2U]: 'trn2u',
      [InstanceClass.STORAGE_COMPUTE_1]: 'h1',
      [InstanceClass.H1]: 'h1',
      [InstanceClass.IO3]: 'i3',
      [InstanceClass.I3]: 'i3',
      [InstanceClass.IO3_DENSE_NVME_DRIVE]: 'i3en',
      [InstanceClass.I3EN]: 'i3en',
      [InstanceClass.STORAGE4_GRAVITON]: 'i4g',
      [InstanceClass.I4G]: 'i4g',
      [InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED]: 'im4gn',
      [InstanceClass.IM4GN]: 'im4gn',
      [InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED]: 'is4gen',
      [InstanceClass.IS4GEN]: 'is4gen',
      [InstanceClass.STORAGE7_INTEL_STORAGE_OPTIMIZED]: 'i7ie',
      [InstanceClass.I7IE]: 'i7ie',
      [InstanceClass.STORAGE8_GRAVITON]: 'i8g',
      [InstanceClass.I8G]: 'i8g',
      [InstanceClass.BURSTABLE2]: 't2',
      [InstanceClass.T2]: 't2',
      [InstanceClass.BURSTABLE3]: 't3',
      [InstanceClass.T3]: 't3',
      [InstanceClass.BURSTABLE3_AMD]: 't3a',
      [InstanceClass.T3A]: 't3a',
      [InstanceClass.BURSTABLE4_GRAVITON]: 't4g',
      [InstanceClass.T4G]: 't4g',
      [InstanceClass.MEMORY_INTENSIVE_1]: 'x1',
      [InstanceClass.X1]: 'x1',
      [InstanceClass.MEMORY_INTENSIVE_1_EXTENDED]: 'x1e',
      [InstanceClass.X1E]: 'x1e',
      [InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2]: 'x2g',
      [InstanceClass.X2G]: 'x2g',
      [InstanceClass.MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE]: 'x2gd',
      [InstanceClass.X2GD]: 'x2gd',
      [InstanceClass.FPGA1]: 'f1',
      [InstanceClass.F1]: 'f1',
      [InstanceClass.FPGA2]: 'f2',
      [InstanceClass.F2]: 'f2',
      [InstanceClass.GRAPHICS3_SMALL]: 'g3s',
      [InstanceClass.G3S]: 'g3s',
      [InstanceClass.GRAPHICS3]: 'g3',
      [InstanceClass.G3]: 'g3',
      [InstanceClass.GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE]: 'g4dn',
      [InstanceClass.G4DN]: 'g4dn',
      [InstanceClass.GRAPHICS4_AMD_NVME_DRIVE]: 'g4ad',
      [InstanceClass.G4AD]: 'g4ad',
      [InstanceClass.GRAPHICS5]: 'g5',
      [InstanceClass.G5]: 'g5',
      [InstanceClass.GRAPHICS5_GRAVITON2]: 'g5g',
      [InstanceClass.G5G]: 'g5g',
      [InstanceClass.GRAPHICS6]: 'g6',
      [InstanceClass.G6]: 'g6',
      [InstanceClass.GRAPHICS6_EFFICIENT]: 'g6e',
      [InstanceClass.G6E]: 'g6e',
      [InstanceClass.GRAPHICS_RAM_6]: 'gr6',
      [InstanceClass.GR6]: 'gr6',
      [InstanceClass.PARALLEL2]: 'p2',
      [InstanceClass.P2]: 'p2',
      [InstanceClass.PARALLEL3]: 'p3',
      [InstanceClass.P3]: 'p3',
      [InstanceClass.PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE]: 'p3dn',
      [InstanceClass.P3DN]: 'p3dn',
      [InstanceClass.PARALLEL4_NVME_DRIVE_EXTENDED]: 'p4de',
      [InstanceClass.P4DE]: 'p4de',
      [InstanceClass.PARALLEL4]: 'p4d',
      [InstanceClass.P4D]: 'p4d',
      [InstanceClass.PARALLEL5]: 'p5',
      [InstanceClass.P5]: 'p5',
      [InstanceClass.PARALLEL5_EXTENDED]: 'parallel5-extended',
      [InstanceClass.P5E]: 'p5e',
      [InstanceClass.PARALLEL5_EXTENDED_NETWORK]: 'parallel5-extended-network',
      [InstanceClass.P5EN]: 'p5en',
      [InstanceClass.ARM1]: 'a1',
      [InstanceClass.A1]: 'a1',
      [InstanceClass.STANDARD6_GRAVITON]: 'm6g',
      [InstanceClass.M6G]: 'm6g',
      [InstanceClass.STANDARD6_INTEL]: 'm6i',
      [InstanceClass.M6I]: 'm6i',
      [InstanceClass.STANDARD6_INTEL_NVME_DRIVE]: 'm6id',
      [InstanceClass.M6ID]: 'm6id',
      [InstanceClass.STANDARD6_INTEL_HIGH_PERFORMANCE]: 'm6in',
      [InstanceClass.M6IN]: 'm6in',
      [InstanceClass.STANDARD6_INTEL_NVME_DRIVE_HIGH_PERFORMANCE]: 'm6idn',
      [InstanceClass.M6IDN]: 'm6idn',
      [InstanceClass.STANDARD6_AMD]: 'm6a',
      [InstanceClass.M6A]: 'm6a',
      [InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE]: 'm6gd',
      [InstanceClass.M6GD]: 'm6gd',
      [InstanceClass.STANDARD7_GRAVITON]: 'm7g',
      [InstanceClass.M7G]: 'm7g',
      [InstanceClass.STANDARD8_GRAVITON]: 'm8g',
      [InstanceClass.M8G]: 'm8g',
      [InstanceClass.STANDARD7_GRAVITON3_NVME_DRIVE]: 'm7gd',
      [InstanceClass.M7GD]: 'm7gd',
      [InstanceClass.STANDARD7_INTEL]: 'm7i',
      [InstanceClass.M7I]: 'm7i',
      [InstanceClass.STANDARD7_INTEL_FLEX]: 'm7i-flex',
      [InstanceClass.M7I_FLEX]: 'm7i-flex',
      [InstanceClass.STANDARD7_AMD]: 'm7a',
      [InstanceClass.M7A]: 'm7a',
      [InstanceClass.HIGH_COMPUTE_MEMORY1]: 'z1d',
      [InstanceClass.Z1D]: 'z1d',
      [InstanceClass.INFERENCE1]: 'inf1',
      [InstanceClass.INF1]: 'inf1',
      [InstanceClass.INFERENCE2]: 'inf2',
      [InstanceClass.INF2]: 'inf2',
      [InstanceClass.MACINTOSH1_INTEL]: 'mac1',
      [InstanceClass.MAC1]: 'mac1',
      [InstanceClass.MACINTOSH2_M1]: 'mac2',
      [InstanceClass.MAC2]: 'mac2',
      [InstanceClass.MACINTOSH2_M2]: 'mac2-m2',
      [InstanceClass.MAC2_M2]: 'mac2-m2',
      [InstanceClass.MACINTOSH2_M2_PRO]: 'mac2-m2pro',
      [InstanceClass.MAC2_M2PRO]: 'mac2-m2pro',
      [InstanceClass.MACINTOSH2_M1_ULTRA]: 'mac2-m1ultra',
      [InstanceClass.MAC2_M1ULTRA]: 'mac2-m1ultra',
      [InstanceClass.VIDEO_TRANSCODING1]: 'vt1',
      [InstanceClass.VT1]: 'vt1',
      [InstanceClass.HIGH_PERFORMANCE_COMPUTING6_AMD]: 'hpc6a',
      [InstanceClass.HPC6A]: 'hpc6a',
      [InstanceClass.HIGH_PERFORMANCE_COMPUTING6_INTEL_NVME_DRIVE]: 'hpc6id',
      [InstanceClass.HPC6ID]: 'hpc6id',
      [InstanceClass.HIGH_PERFORMANCE_COMPUTING7_AMD]: 'hpc7a',
      [InstanceClass.HPC7A]: 'hpc7a',
      [InstanceClass.HIGH_PERFORMANCE_COMPUTING7_GRAVITON]: 'hpc7g',
      [InstanceClass.HPC7G]: 'hpc7g',
      [InstanceClass.I4I]: 'i4i',
      [InstanceClass.IO4_INTEL]: 'i4i',
      [InstanceClass.X2IEDN]: 'x2iedn',
      [InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL]: 'x2iedn',
      [InstanceClass.X2IDN]: 'x2idn',
      [InstanceClass.MEMORY_INTENSIVE_2_INTEL]: 'x2idn',
      [InstanceClass.X2IEZN]: 'x2iezn',
      [InstanceClass.MEMORY_INTENSIVE_8_GRAVITON]: 'x8g',
      [InstanceClass.X8G]: 'x8g',
      [InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL]: 'x2iezn',
      [InstanceClass.DEEP_LEARNING1]: 'dl1',
      [InstanceClass.DL1]: 'dl1',
      [InstanceClass.DEEP_LEARNING2_QUALCOMM]: 'dl2q',
      [InstanceClass.DL2Q]: 'dl2q',
    };
    return new InstanceType(`${instanceClassMap[instanceClass] ?? instanceClass}.${instanceSize}`);
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
    const instanceTypeComponents = this.instanceTypeIdentifier.match(/^([a-z]+)(\d{1,2})([a-z\-]*)\.([a-z0-9\-]+)$/);
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

  public sameInstanceClassAs(other: InstanceType): boolean {
    const instanceClass: RegExp = /^([a-z]+\d{1,2}[a-z\-]*)\.([a-z0-9\-]+)$/;
    const instanceClassId = this.instanceTypeIdentifier.match(instanceClass);
    const otherInstanceClassId = other.instanceTypeIdentifier.match(instanceClass);
    if (instanceClassId == null || otherInstanceClassId == null) {
      throw new Error('Malformed instance type identifier');
    }
    return instanceClassId[1] === otherInstanceClassId[1];
  }

  /**
   * Return whether this instance type is a burstable instance type
   */
  public isBurstable(): boolean {
    return this.instanceTypeIdentifier.startsWith('t3') || this.instanceTypeIdentifier.startsWith('t4g') || this.instanceTypeIdentifier.startsWith('t2');
  }

}
