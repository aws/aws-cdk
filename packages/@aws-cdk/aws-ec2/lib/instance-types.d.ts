/**
 * What class and generation of instance to use
 *
 * We have both symbolic and concrete enums for every type.
 *
 * The first are for people that want to specify by purpose,
 * the second one are for people who already know exactly what
 * 'R4' means.
 */
export declare enum InstanceClass {
    /**
     * Standard instances, 3rd generation
     */
    STANDARD3 = "standard3",
    /**
     * Standard instances, 3rd generation
     */
    M3 = "m3",
    /**
     * Standard instances, 4th generation
     */
    STANDARD4 = "standard4",
    /**
     * Standard instances, 4th generation
     */
    M4 = "m4",
    /**
     * Standard instances, 5th generation
     */
    STANDARD5 = "standard5",
    /**
     * Standard instances, 5th generation
     */
    M5 = "m5",
    /**
     * Standard instances with local NVME drive, 5th generation
     */
    STANDARD5_NVME_DRIVE = "standard5-nvme-drive",
    /**
     * Standard instances with local NVME drive, 5th generation
     */
    M5D = "m5d",
    /**
     * Standard instances based on AMD EPYC, 5th generation
     */
    STANDARD5_AMD = "standard5-amd",
    /**
     * Standard instances based on AMD EPYC, 5th generation
     */
    M5A = "m5a",
    /**
     * Standard instances based on AMD EPYC with local NVME drive, 5th generation
     */
    STANDARD5_AMD_NVME_DRIVE = "standard5-amd-nvme-drive",
    /**
     * Standard instances based on AMD EPYC with local NVME drive, 5th generation
     */
    M5AD = "m5ad",
    /**
     * Standard instances for high performance computing, 5th generation
     */
    STANDARD5_HIGH_PERFORMANCE = "standard5-high-performance",
    /**
     * Standard instances for high performance computing, 5th generation
     */
    M5N = "m5n",
    /**
     * Standard instances with local NVME drive for high performance computing, 5th generation
     */
    STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE = "standard5-nvme-drive-high-performance",
    /**
     * Standard instances with local NVME drive for high performance computing, 5th generation
     */
    M5DN = "m5dn",
    /**
     * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
     */
    STANDARD5_HIGH_COMPUTE = "standard5-high-compute",
    /**
     * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
     */
    M5ZN = "m5zn",
    /**
     * Memory optimized instances, 3rd generation
     */
    MEMORY3 = "memory3",
    /**
     * Memory optimized instances, 3rd generation
     */
    R3 = "r3",
    /**
     * Memory optimized instances, 4th generation
     */
    MEMORY4 = "memory4",
    /**
     * Memory optimized instances, 4th generation
     */
    R4 = "r4",
    /**
     * Memory optimized instances, 5th generation
     */
    MEMORY5 = "memory5",
    /**
     * Memory optimized instances, 5th generation
     */
    R5 = "r5",
    /**
     * Memory optimized instances based on AMD EPYC, 6th generation
     */
    MEMORY6_AMD = "memory6-amd",
    /**
     * Memory optimized instances based on AMD EPYC, 6th generation
     */
    R6A = "r6a",
    /**
     * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    MEMORY6_INTEL = "memory6-intel",
    /**
     * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    R6I = "r6i",
    /**
     * Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    MEMORY6_INTEL_NVME_DRIVE = "memory6-intel-nvme-drive",
    /**
     * Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    R6ID = "r6id",
    /**
     * Memory optimized instances for high performance computing, 5th generation
     */
    MEMORY5_HIGH_PERFORMANCE = "memory5-high-performance",
    /**
     * Memory optimized instances for high performance computing, 5th generation
     */
    R5N = "r5n",
    /**
     * Memory optimized instances with local NVME drive, 5th generation
     */
    MEMORY5_NVME_DRIVE = "memory5-nvme-drive",
    /**
     * Memory optimized instances with local NVME drive, 5th generation
     */
    R5D = "r5d",
    /**
     * Memory optimized instances with local NVME drive for high performance computing, 5th generation
     */
    MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE = "memory5-nvme-drive-high-performance",
    /**
     * Memory optimized instances with local NVME drive for high performance computing, 5th generation
     */
    R5DN = "r5dn",
    /**
     * Memory optimized instances based on AMD EPYC, 5th generation
     */
    MEMORY5_AMD = "memory5-amd",
    /**
     * Memory optimized instances based on AMD EPYC, 5th generation
     */
    R5A = "r5a",
    /**
     * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
     */
    MEMORY5_AMD_NVME_DRIVE = "memory5-amd-nvme-drive",
    /**
     * High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    HIGH_MEMORY_3TB_1 = "high-memory-3tb-1",
    /**
     * High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    U_3TB1 = "u-3tb1",
    /**
     * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    HIGH_MEMORY_6TB_1 = "high-memory-6tb-1",
    /**
     * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    U_6TB1 = "u-6tb1",
    /**
     * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    HIGH_MEMORY_9TB_1 = "high-memory-9tb-1",
    /**
     * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    U_9TB1 = "u-9tb1",
    /**
     * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    HIGH_MEMORY_12TB_1 = "high-memory-12tb-1",
    /**
     * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    U_12TB1 = "u-12tb1",
    /**
     * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    HIGH_MEMORY_18TB_1 = "high-memory-18tb-1",
    /**
     * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    U_18TB1 = "u-18tb1",
    /**
     * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    HIGH_MEMORY_24TB_1 = "high-memory-24tb-1",
    /**
     * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    U_24TB1 = "u-24tb1",
    /**
     * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
     */
    R5AD = "r5ad",
    /**
     * Memory optimized instances that are also EBS-optimized, 5th generation
     */
    MEMORY5_EBS_OPTIMIZED = "memory5-ebs-optimized",
    /**
     * Memory optimized instances that are also EBS-optimized, 5th generation
     */
    R5B = "r5b",
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors
     */
    MEMORY6_GRAVITON = "memory6-graviton",
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors
     */
    R6G = "r6g",
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
     */
    MEMORY6_GRAVITON2_NVME_DRIVE = "memory6-graviton2-nvme-drive",
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
     */
    R6GD = "r6gd",
    /**
     * Compute optimized instances, 3rd generation
     */
    COMPUTE3 = "compute3",
    /**
     * Compute optimized instances, 3rd generation
     */
    C3 = "c3",
    /**
     * Compute optimized instances, 4th generation
     */
    COMPUTE4 = "compute4",
    /**
     * Compute optimized instances, 4th generation
     */
    C4 = "c4",
    /**
     * Compute optimized instances, 5th generation
     */
    COMPUTE5 = "compute5",
    /**
     * Compute optimized instances, 5th generation
     */
    C5 = "c5",
    /**
     * Compute optimized instances with local NVME drive, 5th generation
     */
    COMPUTE5_NVME_DRIVE = "compute5-nvme-drive",
    /**
     * Compute optimized instances with local NVME drive, 5th generation
     */
    C5D = "c5d",
    /**
     * Compute optimized instances based on AMD EPYC, 5th generation
     */
    COMPUTE5_AMD = "compute5-amd",
    /**
     * Compute optimized instances based on AMD EPYC, 5th generation
     */
    C5A = "c5a",
    /**
     * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
     */
    COMPUTE5_AMD_NVME_DRIVE = "compute5-amd-nvme-drive",
    /**
     * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
     */
    C5AD = "c5ad",
    /**
     * Compute optimized instances for high performance computing, 5th generation
     */
    COMPUTE5_HIGH_PERFORMANCE = "compute5-high-performance",
    /**
     * Compute optimized instances for high performance computing, 5th generation
     */
    C5N = "c5n",
    /**
     * Compute optimized instances, 6th generation
     */
    COMPUTE6_INTEL = "compute6-intel",
    /**
     * Compute optimized instances, 6th generation
     */
    C6I = "c6i",
    /**
     * Compute optimized instances with local NVME drive, 6th generation
     */
    COMPUTE6_INTEL_NVME_DRIVE = "compute6-intel-nvme-drive",
    /**
     * Compute optimized instances with local NVME drive, 6th generation
     */
    C6ID = "c6id",
    /**
     * Compute optimized instances for high performance computing, 6th generation
     */
    COMPUTE6_INTEL_HIGH_PERFORMANCE = "compute6-intel-high-performance",
    /**
     * Compute optimized instances for high performance computing, 6th generation
     */
    C6IN = "c6in",
    /**
     * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
     */
    COMPUTE6_AMD = "compute6-amd",
    /**
     * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
     */
    C6A = "c6a",
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     */
    COMPUTE6_GRAVITON2 = "compute6-graviton2",
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     */
    C6G = "c6g",
    /**
     * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
     */
    COMPUTE7_GRAVITON3 = "compute7-graviton3",
    /**
     * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
     */
    C7G = "c7g",
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and local NVME drive
     */
    COMPUTE6_GRAVITON2_NVME_DRIVE = "compute6-graviton2-nvme-drive",
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and local NVME drive
     */
    C6GD = "c6gd",
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and high network bandwidth capabilities
     */
    COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH = "compute6-graviton2-high-network-bandwidth",
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and high network bandwidth capabilities
     */
    C6GN = "c6gn",
    /**
     * Storage-optimized instances, 2nd generation
     */
    STORAGE2 = "storage2",
    /**
     * Storage-optimized instances, 2nd generation
     */
    D2 = "d2",
    /**
     * Storage-optimized instances, 3rd generation
     */
    STORAGE3 = "storage3",
    /**
     * Storage-optimized instances, 3rd generation
     */
    D3 = "d3",
    /**
    * Storage-optimized instances, 3rd generation
    */
    STORAGE3_ENHANCED_NETWORK = "storage3-enhanced-network",
    /**
     * Storage-optimized instances, 3rd generation
     */
    D3EN = "d3en",
    /**
     * Storage/compute balanced instances, 1st generation
     */
    STORAGE_COMPUTE_1 = "storage-compute-1",
    /**
     * Storage/compute balanced instances, 1st generation
     */
    H1 = "h1",
    /**
     * I/O-optimized instances, 3rd generation
     */
    IO3 = "io3",
    /**
     * I/O-optimized instances, 3rd generation
     */
    I3 = "i3",
    /**
     * I/O-optimized instances with local NVME drive, 3rd generation
     */
    IO3_DENSE_NVME_DRIVE = "io3-dense-nvme-drive",
    /**
     * I/O-optimized instances with local NVME drive, 3rd generation
     */
    I3EN = "i3en",
    /**
     * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
     */
    IO4_INTEL = "io4_intel",
    /**
     * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
     */
    I4I = "i4i",
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    STORAGE4_GRAVITON_NETWORK_OPTIMIZED = "storage4-graviton-network-optimized",
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    IM4GN = "im4gn",
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED = "storage4-graviton-network-storage-optimized",
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    IS4GEN = "is4gen",
    /**
     * Burstable instances, 2nd generation
     */
    BURSTABLE2 = "burstable2",
    /**
     * Burstable instances, 2nd generation
     */
    T2 = "t2",
    /**
     * Burstable instances, 3rd generation
     */
    BURSTABLE3 = "burstable3",
    /**
     * Burstable instances, 3rd generation
     */
    T3 = "t3",
    /**
     * Burstable instances based on AMD EPYC, 3rd generation
     */
    BURSTABLE3_AMD = "burstable3-amd",
    /**
     * Burstable instances based on AMD EPYC, 3rd generation
     */
    T3A = "t3a",
    /**
     * Burstable instances, 4th generation with Graviton2 processors
     */
    BURSTABLE4_GRAVITON = "burstable4-graviton",
    /**
     * Burstable instances, 4th generation with Graviton2 processors
     */
    T4G = "t4g",
    /**
     * Memory-intensive instances, 1st generation
     */
    MEMORY_INTENSIVE_1 = "memory-intensive-1",
    /**
     * Memory-intensive instances, 1st generation
     */
    X1 = "x1",
    /**
     * Memory-intensive instances, extended, 1st generation
     */
    MEMORY_INTENSIVE_1_EXTENDED = "memory-intensive-1-extended",
    /**
     * Memory-intensive instances, 1st generation
     */
    X1E = "x1e",
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors
     *
     * This instance type can be used only in RDS. It is not supported in EC2.
     */
    MEMORY_INTENSIVE_2_GRAVITON2 = "memory-intensive-2-graviton2",
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors
     *
     * This instance type can be used only in RDS. It is not supported in EC2.
     */
    X2G = "x2g",
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
     */
    MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE = "memory-intensive-2-graviton2-nvme-drive",
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
     */
    X2GD = "x2gd",
    /**
     * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
     */
    MEMORY_INTENSIVE_2_XT_INTEL = "memory_intensive_2_xt_intel",
    /**
     * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
     */
    X2IEDN = "x2iedn",
    /**
     * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
     */
    MEMORY_INTENSIVE_2_INTEL = "memory_intensive_2_intel",
    /**
     * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
     */
    X2IDN = "x2idn",
    /**
     * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
     */
    MEMORY_INTENSIVE_2_XTZ_INTEL = "memory_intensive_2_xtz_intel",
    /**
     * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
     */
    X2IEZN = "x2iezn",
    /**
     * Instances with customizable hardware acceleration, 1st generation
     */
    FPGA1 = "fpga1",
    /**
     * Instances with customizable hardware acceleration, 1st generation
     */
    F1 = "f1",
    /**
     * Graphics-optimized instances, 3rd generation
     */
    GRAPHICS3_SMALL = "graphics3-small",
    /**
     * Graphics-optimized instances, 3rd generation
     */
    G3S = "g3s",
    /**
     * Graphics-optimized instances, 3rd generation
     */
    GRAPHICS3 = "graphics3",
    /**
     * Graphics-optimized instances, 3rd generation
     */
    G3 = "g3",
    /**
     * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
     */
    GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE = "graphics4-nvme-drive-high-performance",
    /**
     * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
     */
    G4DN = "g4dn",
    /**
     * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
     */
    GRAPHICS4_AMD_NVME_DRIVE = "graphics4-amd-nvme-drive",
    /**
     * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
     */
    G4AD = "g4ad",
    /**
     * Graphics-optimized instances, 5th generation
     */
    GRAPHICS5 = "graphics5",
    /**
     * Graphics-optimized instances, 5th generation
     */
    G5 = "g5",
    /**
     * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
     */
    GRAPHICS5_GRAVITON2 = "graphics5-graviton2",
    /**
     * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
     */
    G5G = "g5g",
    /**
     * Parallel-processing optimized instances, 2nd generation
     */
    PARALLEL2 = "parallel2",
    /**
     * Parallel-processing optimized instances, 2nd generation
     */
    P2 = "p2",
    /**
     * Parallel-processing optimized instances, 3nd generation
     */
    PARALLEL3 = "parallel3",
    /**
     * Parallel-processing optimized instances, 3rd generation
     */
    P3 = "p3",
    /**
     * Parallel-processing optimized instances with local NVME drive for high performance computing, 3nd generation
     */
    PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE = "parallel3-nvme-drive-high-performance",
    /**
     * Parallel-processing optimized instances with local NVME drive for high performance computing, 3rd generation
     */
    P3DN = "p3dn",
    /**
     * Parallel-processing optimized instances with local NVME drive, extended, 4th generation (in developer preview)
     */
    PARALLEL4_NVME_DRIVE_EXTENDED = "parallel4-nvme-drive-extended",
    /**
     * Parallel-processing optimized instances with local NVME drive, extended, 4th generation (in developer preview)
     */
    P4DE = "p4de",
    /**
     * Parallel-processing optimized instances, 4th generation
     */
    PARALLEL4 = "parallel4",
    /**
     * Parallel-processing optimized instances, 4th generation
     */
    P4D = "p4d",
    /**
     * Arm processor based instances, 1st generation
     */
    ARM1 = "arm1",
    /**
     * Arm processor based instances, 1st generation
     */
    A1 = "a1",
    /**
     * Arm processor based instances, 2nd generation
     */
    STANDARD6_GRAVITON = "standard6-graviton",
    /**
     * Arm processor based instances, 2nd generation
     */
    M6G = "m6g",
    /**
     * Standard instances based on Intel (Ice Lake), 6th generation.
     */
    STANDARD6_INTEL = "standard6-intel",
    /**
     * Standard instances based on Intel (Ice Lake), 6th generation.
     */
    M6I = "m6i",
    /**
     * Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
     */
    STANDARD6_INTEL_NVME_DRIVE = "standard6-intel-nvme-drive",
    /**
     * Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
     */
    M6ID = "m6id",
    /**
     * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
     */
    STANDARD6_AMD = "standard6-amd",
    /**
     * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
     */
    M6A = "m6a",
    /**
     * Standard instances, 6th generation with Graviton2 processors and local NVME drive
     */
    STANDARD6_GRAVITON2_NVME_DRIVE = "standard6-graviton2-nvme-drive",
    /**
     * Standard instances, 6th generation with Graviton2 processors and local NVME drive
     */
    M6GD = "m6gd",
    /**
     * High memory and compute capacity instances, 1st generation
     */
    HIGH_COMPUTE_MEMORY1 = "high-compute-memory1",
    /**
     * High memory and compute capacity instances, 1st generation
     */
    Z1D = "z1d",
    /**
     * Inferentia Chips based instances for machine learning inference applications, 1st generation
     */
    INFERENCE1 = "inference1",
    /**
     * Inferentia Chips based instances for machine learning inference applications, 1st generation
     */
    INF1 = "inf1",
    /**
     * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
     */
    MACINTOSH1_INTEL = "macintosh1-intel",
    /**
     * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
     */
    MAC1 = "mac1",
    /**
     * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
     */
    VIDEO_TRANSCODING1 = "video-transcoding1",
    /**
     * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
     */
    VT1 = "vt1",
    /**
     * High performance computing based on AMD EPYC, 6th generation
     */
    HIGH_PERFORMANCE_COMPUTING6_AMD = "high-performance-computing6-amd",
    /**
     * High performance computing based on AMD EPYC, 6th generation
     */
    HPC6A = "hpc6a",
    /**
     * Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
     */
    DEEP_LEARNING1 = "deep-learning1",
    /**
     * Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
     */
    DL1 = "dl1"
}
/**
 * Identifies an instance's CPU architecture
 */
export declare enum InstanceArchitecture {
    /**
     * ARM64 architecture
     */
    ARM_64 = "arm64",
    /**
     * x86-64 architecture
     */
    X86_64 = "x86_64"
}
/**
 * What size of instance to use
 */
export declare enum InstanceSize {
    /**
     * Instance size NANO (nano)
     */
    NANO = "nano",
    /**
     * Instance size MICRO (micro)
     */
    MICRO = "micro",
    /**
     * Instance size SMALL (small)
     */
    SMALL = "small",
    /**
     * Instance size MEDIUM (medium)
     */
    MEDIUM = "medium",
    /**
     * Instance size LARGE (large)
     */
    LARGE = "large",
    /**
     * Instance size XLARGE (xlarge)
     */
    XLARGE = "xlarge",
    /**
     * Instance size XLARGE2 (2xlarge)
     */
    XLARGE2 = "2xlarge",
    /**
     * Instance size XLARGE3 (3xlarge)
     */
    XLARGE3 = "3xlarge",
    /**
     * Instance size XLARGE4 (4xlarge)
     */
    XLARGE4 = "4xlarge",
    /**
     * Instance size XLARGE6 (6xlarge)
     */
    XLARGE6 = "6xlarge",
    /**
     * Instance size XLARGE8 (8xlarge)
     */
    XLARGE8 = "8xlarge",
    /**
     * Instance size XLARGE9 (9xlarge)
     */
    XLARGE9 = "9xlarge",
    /**
     * Instance size XLARGE10 (10xlarge)
     */
    XLARGE10 = "10xlarge",
    /**
     * Instance size XLARGE12 (12xlarge)
     */
    XLARGE12 = "12xlarge",
    /**
     * Instance size XLARGE16 (16xlarge)
     */
    XLARGE16 = "16xlarge",
    /**
     * Instance size XLARGE18 (18xlarge)
     */
    XLARGE18 = "18xlarge",
    /**
     * Instance size XLARGE24 (24xlarge)
     */
    XLARGE24 = "24xlarge",
    /**
     * Instance size XLARGE32 (32xlarge)
     */
    XLARGE32 = "32xlarge",
    /**
     * Instance size XLARGE48 (48xlarge)
     */
    XLARGE48 = "48xlarge",
    /**
     * Instance size XLARGE56 (56xlarge)
     */
    XLARGE56 = "56xlarge",
    /**
     * Instance size XLARGE56 (112xlarge)
     */
    XLARGE112 = "112xlarge",
    /**
     * Instance size METAL (metal)
     */
    METAL = "metal"
}
/**
 * Instance type for EC2 instances
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
export declare class InstanceType {
    private readonly instanceTypeIdentifier;
    /**
     * Instance type for EC2 instances
     *
     * This class takes a combination of a class and size.
     *
     * Be aware that not all combinations of class and size are available, and not all
     * classes are available in all regions.
     */
    static of(instanceClass: InstanceClass, instanceSize: InstanceSize): InstanceType;
    constructor(instanceTypeIdentifier: string);
    /**
     * Return the instance type as a dotted string
     */
    toString(): string;
    /**
     * The instance's CPU architecture
     */
    get architecture(): InstanceArchitecture;
}
