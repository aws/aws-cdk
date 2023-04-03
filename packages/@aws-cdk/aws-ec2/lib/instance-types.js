"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceType = exports.InstanceSize = exports.InstanceArchitecture = exports.InstanceClass = void 0;
const jsiiDeprecationWarnings = require("../.warnings.jsii.js");
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
/**
 * What class and generation of instance to use
 *
 * We have both symbolic and concrete enums for every type.
 *
 * The first are for people that want to specify by purpose,
 * the second one are for people who already know exactly what
 * 'R4' means.
 */
var InstanceClass;
(function (InstanceClass) {
    /**
     * Standard instances, 3rd generation
     */
    InstanceClass["STANDARD3"] = "standard3";
    /**
     * Standard instances, 3rd generation
     */
    InstanceClass["M3"] = "m3";
    /**
     * Standard instances, 4th generation
     */
    InstanceClass["STANDARD4"] = "standard4";
    /**
     * Standard instances, 4th generation
     */
    InstanceClass["M4"] = "m4";
    /**
     * Standard instances, 5th generation
     */
    InstanceClass["STANDARD5"] = "standard5";
    /**
     * Standard instances, 5th generation
     */
    InstanceClass["M5"] = "m5";
    /**
     * Standard instances with local NVME drive, 5th generation
     */
    InstanceClass["STANDARD5_NVME_DRIVE"] = "standard5-nvme-drive";
    /**
     * Standard instances with local NVME drive, 5th generation
     */
    InstanceClass["M5D"] = "m5d";
    /**
     * Standard instances based on AMD EPYC, 5th generation
     */
    InstanceClass["STANDARD5_AMD"] = "standard5-amd";
    /**
     * Standard instances based on AMD EPYC, 5th generation
     */
    InstanceClass["M5A"] = "m5a";
    /**
     * Standard instances based on AMD EPYC with local NVME drive, 5th generation
     */
    InstanceClass["STANDARD5_AMD_NVME_DRIVE"] = "standard5-amd-nvme-drive";
    /**
     * Standard instances based on AMD EPYC with local NVME drive, 5th generation
     */
    InstanceClass["M5AD"] = "m5ad";
    /**
     * Standard instances for high performance computing, 5th generation
     */
    InstanceClass["STANDARD5_HIGH_PERFORMANCE"] = "standard5-high-performance";
    /**
     * Standard instances for high performance computing, 5th generation
     */
    InstanceClass["M5N"] = "m5n";
    /**
     * Standard instances with local NVME drive for high performance computing, 5th generation
     */
    InstanceClass["STANDARD5_NVME_DRIVE_HIGH_PERFORMANCE"] = "standard5-nvme-drive-high-performance";
    /**
     * Standard instances with local NVME drive for high performance computing, 5th generation
     */
    InstanceClass["M5DN"] = "m5dn";
    /**
     * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
     */
    InstanceClass["STANDARD5_HIGH_COMPUTE"] = "standard5-high-compute";
    /**
     * Standard instances with high memory and compute capacity based on Intel Xeon Scalable (Cascade Lake) processors, 5nd generation
     */
    InstanceClass["M5ZN"] = "m5zn";
    /**
     * Memory optimized instances, 3rd generation
     */
    InstanceClass["MEMORY3"] = "memory3";
    /**
     * Memory optimized instances, 3rd generation
     */
    InstanceClass["R3"] = "r3";
    /**
     * Memory optimized instances, 4th generation
     */
    InstanceClass["MEMORY4"] = "memory4";
    /**
     * Memory optimized instances, 4th generation
     */
    InstanceClass["R4"] = "r4";
    /**
     * Memory optimized instances, 5th generation
     */
    InstanceClass["MEMORY5"] = "memory5";
    /**
     * Memory optimized instances, 5th generation
     */
    InstanceClass["R5"] = "r5";
    /**
     * Memory optimized instances based on AMD EPYC, 6th generation
     */
    InstanceClass["MEMORY6_AMD"] = "memory6-amd";
    /**
     * Memory optimized instances based on AMD EPYC, 6th generation
     */
    InstanceClass["R6A"] = "r6a";
    /**
     * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    InstanceClass["MEMORY6_INTEL"] = "memory6-intel";
    /**
     * Memory optimized instances, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    InstanceClass["R6I"] = "r6i";
    /**
     * Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    InstanceClass["MEMORY6_INTEL_NVME_DRIVE"] = "memory6-intel-nvme-drive";
    /**
     * Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
     */
    InstanceClass["R6ID"] = "r6id";
    /**
     * Memory optimized instances for high performance computing, 5th generation
     */
    InstanceClass["MEMORY5_HIGH_PERFORMANCE"] = "memory5-high-performance";
    /**
     * Memory optimized instances for high performance computing, 5th generation
     */
    InstanceClass["R5N"] = "r5n";
    /**
     * Memory optimized instances with local NVME drive, 5th generation
     */
    InstanceClass["MEMORY5_NVME_DRIVE"] = "memory5-nvme-drive";
    /**
     * Memory optimized instances with local NVME drive, 5th generation
     */
    InstanceClass["R5D"] = "r5d";
    /**
     * Memory optimized instances with local NVME drive for high performance computing, 5th generation
     */
    InstanceClass["MEMORY5_NVME_DRIVE_HIGH_PERFORMANCE"] = "memory5-nvme-drive-high-performance";
    /**
     * Memory optimized instances with local NVME drive for high performance computing, 5th generation
     */
    InstanceClass["R5DN"] = "r5dn";
    /**
     * Memory optimized instances based on AMD EPYC, 5th generation
     */
    InstanceClass["MEMORY5_AMD"] = "memory5-amd";
    /**
     * Memory optimized instances based on AMD EPYC, 5th generation
     */
    InstanceClass["R5A"] = "r5a";
    /**
     * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
     */
    InstanceClass["MEMORY5_AMD_NVME_DRIVE"] = "memory5-amd-nvme-drive";
    /**
     * High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["HIGH_MEMORY_3TB_1"] = "high-memory-3tb-1";
    /**
     * High memory instances (3TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["U_3TB1"] = "u-3tb1";
    /**
     * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["HIGH_MEMORY_6TB_1"] = "high-memory-6tb-1";
    /**
     * High memory instances (6TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["U_6TB1"] = "u-6tb1";
    /**
     * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["HIGH_MEMORY_9TB_1"] = "high-memory-9tb-1";
    /**
     * High memory instances (9TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["U_9TB1"] = "u-9tb1";
    /**
     * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["HIGH_MEMORY_12TB_1"] = "high-memory-12tb-1";
    /**
     * High memory instances (12TB) based on Intel Xeon Platinum 8176M (Skylake) processors, 1st generation
     */
    InstanceClass["U_12TB1"] = "u-12tb1";
    /**
     * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    InstanceClass["HIGH_MEMORY_18TB_1"] = "high-memory-18tb-1";
    /**
     * High memory instances (18TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    InstanceClass["U_18TB1"] = "u-18tb1";
    /**
     * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    InstanceClass["HIGH_MEMORY_24TB_1"] = "high-memory-24tb-1";
    /**
     * High memory instances (24TB) based on Intel Xeon Scalable (Cascade Lake) processors, 1st generation
     */
    InstanceClass["U_24TB1"] = "u-24tb1";
    /**
     * Memory optimized instances based on AMD EPYC with local NVME drive, 5th generation
     */
    InstanceClass["R5AD"] = "r5ad";
    /**
     * Memory optimized instances that are also EBS-optimized, 5th generation
     */
    InstanceClass["MEMORY5_EBS_OPTIMIZED"] = "memory5-ebs-optimized";
    /**
     * Memory optimized instances that are also EBS-optimized, 5th generation
     */
    InstanceClass["R5B"] = "r5b";
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors
     */
    InstanceClass["MEMORY6_GRAVITON"] = "memory6-graviton";
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors
     */
    InstanceClass["R6G"] = "r6g";
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
     */
    InstanceClass["MEMORY6_GRAVITON2_NVME_DRIVE"] = "memory6-graviton2-nvme-drive";
    /**
     * Memory optimized instances, 6th generation with Graviton2 processors and local NVME drive
     */
    InstanceClass["R6GD"] = "r6gd";
    /**
     * Memory optimized instances, 7th generation with Graviton3 processors
     *
     * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
     */
    InstanceClass["MEMORY7_GRAVITON"] = "memory7-graviton";
    /**
     * Memory optimized instances, 7th generation with Graviton3 processors
     *
     * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
     */
    InstanceClass["R7G"] = "r7g";
    /**
     * Compute optimized instances, 3rd generation
     */
    InstanceClass["COMPUTE3"] = "compute3";
    /**
     * Compute optimized instances, 3rd generation
     */
    InstanceClass["C3"] = "c3";
    /**
     * Compute optimized instances, 4th generation
     */
    InstanceClass["COMPUTE4"] = "compute4";
    /**
     * Compute optimized instances, 4th generation
     */
    InstanceClass["C4"] = "c4";
    /**
     * Compute optimized instances, 5th generation
     */
    InstanceClass["COMPUTE5"] = "compute5";
    /**
     * Compute optimized instances, 5th generation
     */
    InstanceClass["C5"] = "c5";
    /**
     * Compute optimized instances with local NVME drive, 5th generation
     */
    InstanceClass["COMPUTE5_NVME_DRIVE"] = "compute5-nvme-drive";
    /**
     * Compute optimized instances with local NVME drive, 5th generation
     */
    InstanceClass["C5D"] = "c5d";
    /**
     * Compute optimized instances based on AMD EPYC, 5th generation
     */
    InstanceClass["COMPUTE5_AMD"] = "compute5-amd";
    /**
     * Compute optimized instances based on AMD EPYC, 5th generation
     */
    InstanceClass["C5A"] = "c5a";
    /**
     * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
     */
    InstanceClass["COMPUTE5_AMD_NVME_DRIVE"] = "compute5-amd-nvme-drive";
    /**
     * Compute optimized instances with local NVME drive based on AMD EPYC, 5th generation
     */
    InstanceClass["C5AD"] = "c5ad";
    /**
     * Compute optimized instances for high performance computing, 5th generation
     */
    InstanceClass["COMPUTE5_HIGH_PERFORMANCE"] = "compute5-high-performance";
    /**
     * Compute optimized instances for high performance computing, 5th generation
     */
    InstanceClass["C5N"] = "c5n";
    /**
     * Compute optimized instances, 6th generation
     */
    InstanceClass["COMPUTE6_INTEL"] = "compute6-intel";
    /**
     * Compute optimized instances, 6th generation
     */
    InstanceClass["C6I"] = "c6i";
    /**
     * Compute optimized instances with local NVME drive, 6th generation
     */
    InstanceClass["COMPUTE6_INTEL_NVME_DRIVE"] = "compute6-intel-nvme-drive";
    /**
     * Compute optimized instances with local NVME drive, 6th generation
     */
    InstanceClass["C6ID"] = "c6id";
    /**
     * Compute optimized instances for high performance computing, 6th generation
     */
    InstanceClass["COMPUTE6_INTEL_HIGH_PERFORMANCE"] = "compute6-intel-high-performance";
    /**
     * Compute optimized instances for high performance computing, 6th generation
     */
    InstanceClass["C6IN"] = "c6in";
    /**
     * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
     */
    InstanceClass["COMPUTE6_AMD"] = "compute6-amd";
    /**
     * Compute optimized instances based on AMD EPYC (codename Milan), 6th generation
     */
    InstanceClass["C6A"] = "c6a";
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     */
    InstanceClass["COMPUTE6_GRAVITON2"] = "compute6-graviton2";
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     */
    InstanceClass["C6G"] = "c6g";
    /**
     * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
     */
    InstanceClass["COMPUTE7_GRAVITON3"] = "compute7-graviton3";
    /**
     * Compute optimized instances for high performance computing, 7th generation with Graviton3 processors
     */
    InstanceClass["C7G"] = "c7g";
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and local NVME drive
     */
    InstanceClass["COMPUTE6_GRAVITON2_NVME_DRIVE"] = "compute6-graviton2-nvme-drive";
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and local NVME drive
     */
    InstanceClass["C6GD"] = "c6gd";
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and high network bandwidth capabilities
     */
    InstanceClass["COMPUTE6_GRAVITON2_HIGH_NETWORK_BANDWIDTH"] = "compute6-graviton2-high-network-bandwidth";
    /**
     * Compute optimized instances for high performance computing, 6th generation with Graviton2 processors
     * and high network bandwidth capabilities
     */
    InstanceClass["C6GN"] = "c6gn";
    /**
     * Storage-optimized instances, 2nd generation
     */
    InstanceClass["STORAGE2"] = "storage2";
    /**
     * Storage-optimized instances, 2nd generation
     */
    InstanceClass["D2"] = "d2";
    /**
     * Storage-optimized instances, 3rd generation
     */
    InstanceClass["STORAGE3"] = "storage3";
    /**
     * Storage-optimized instances, 3rd generation
     */
    InstanceClass["D3"] = "d3";
    /**
    * Storage-optimized instances, 3rd generation
    */
    InstanceClass["STORAGE3_ENHANCED_NETWORK"] = "storage3-enhanced-network";
    /**
     * Storage-optimized instances, 3rd generation
     */
    InstanceClass["D3EN"] = "d3en";
    /**
     * Storage/compute balanced instances, 1st generation
     */
    InstanceClass["STORAGE_COMPUTE_1"] = "storage-compute-1";
    /**
     * Storage/compute balanced instances, 1st generation
     */
    InstanceClass["H1"] = "h1";
    /**
     * I/O-optimized instances, 3rd generation
     */
    InstanceClass["IO3"] = "io3";
    /**
     * I/O-optimized instances, 3rd generation
     */
    InstanceClass["I3"] = "i3";
    /**
     * I/O-optimized instances with local NVME drive, 3rd generation
     */
    InstanceClass["IO3_DENSE_NVME_DRIVE"] = "io3-dense-nvme-drive";
    /**
     * I/O-optimized instances with local NVME drive, 3rd generation
     */
    InstanceClass["I3EN"] = "i3en";
    /**
     * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
     */
    InstanceClass["IO4_INTEL"] = "io4_intel";
    /**
     * I/O-optimized instances with local NVME drive powered by Intel Xeon Scalable processors (code named Ice Lake), 4th generation
     */
    InstanceClass["I4I"] = "i4i";
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    InstanceClass["STORAGE4_GRAVITON_NETWORK_OPTIMIZED"] = "storage4-graviton-network-optimized";
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    InstanceClass["IM4GN"] = "im4gn";
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    InstanceClass["STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED"] = "storage4-graviton-network-storage-optimized";
    /**
     * Storage optimized instances powered by Graviton2 processor, 4th generation
     */
    InstanceClass["IS4GEN"] = "is4gen";
    /**
     * Burstable instances, 2nd generation
     */
    InstanceClass["BURSTABLE2"] = "burstable2";
    /**
     * Burstable instances, 2nd generation
     */
    InstanceClass["T2"] = "t2";
    /**
     * Burstable instances, 3rd generation
     */
    InstanceClass["BURSTABLE3"] = "burstable3";
    /**
     * Burstable instances, 3rd generation
     */
    InstanceClass["T3"] = "t3";
    /**
     * Burstable instances based on AMD EPYC, 3rd generation
     */
    InstanceClass["BURSTABLE3_AMD"] = "burstable3-amd";
    /**
     * Burstable instances based on AMD EPYC, 3rd generation
     */
    InstanceClass["T3A"] = "t3a";
    /**
     * Burstable instances, 4th generation with Graviton2 processors
     */
    InstanceClass["BURSTABLE4_GRAVITON"] = "burstable4-graviton";
    /**
     * Burstable instances, 4th generation with Graviton2 processors
     */
    InstanceClass["T4G"] = "t4g";
    /**
     * Memory-intensive instances, 1st generation
     */
    InstanceClass["MEMORY_INTENSIVE_1"] = "memory-intensive-1";
    /**
     * Memory-intensive instances, 1st generation
     */
    InstanceClass["X1"] = "x1";
    /**
     * Memory-intensive instances, extended, 1st generation
     */
    InstanceClass["MEMORY_INTENSIVE_1_EXTENDED"] = "memory-intensive-1-extended";
    /**
     * Memory-intensive instances, 1st generation
     */
    InstanceClass["X1E"] = "x1e";
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors
     *
     * This instance type can be used only in RDS. It is not supported in EC2.
     */
    InstanceClass["MEMORY_INTENSIVE_2_GRAVITON2"] = "memory-intensive-2-graviton2";
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors
     *
     * This instance type can be used only in RDS. It is not supported in EC2.
     */
    InstanceClass["X2G"] = "x2g";
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
     */
    InstanceClass["MEMORY_INTENSIVE_2_GRAVITON2_NVME_DRIVE"] = "memory-intensive-2-graviton2-nvme-drive";
    /**
     * Memory-intensive instances, 2nd generation with Graviton2 processors and local NVME drive
     */
    InstanceClass["X2GD"] = "x2gd";
    /**
     * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
     */
    InstanceClass["MEMORY_INTENSIVE_2_XT_INTEL"] = "memory_intensive_2_xt_intel";
    /**
     * Memory-intensive instances with higher network bandwith, local NVME drive, and extended memory. Intel Xeon Scalable (Ice Lake) processors
     */
    InstanceClass["X2IEDN"] = "x2iedn";
    /**
     * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
     */
    InstanceClass["MEMORY_INTENSIVE_2_INTEL"] = "memory_intensive_2_intel";
    /**
     * Memory-intensive instances with higher network bandwith and local NVME drive, Intel Xeon Scalable (Ice Lake) processors
     */
    InstanceClass["X2IDN"] = "x2idn";
    /**
     * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
     */
    InstanceClass["MEMORY_INTENSIVE_2_XTZ_INTEL"] = "memory_intensive_2_xtz_intel";
    /**
     * Memory-intensive instances with higher network bandwith and single-threaded performance, Intel Xeon Scalable (Cascade Lake) processors
     */
    InstanceClass["X2IEZN"] = "x2iezn";
    /**
     * Instances with customizable hardware acceleration, 1st generation
     */
    InstanceClass["FPGA1"] = "fpga1";
    /**
     * Instances with customizable hardware acceleration, 1st generation
     */
    InstanceClass["F1"] = "f1";
    /**
     * Graphics-optimized instances, 3rd generation
     */
    InstanceClass["GRAPHICS3_SMALL"] = "graphics3-small";
    /**
     * Graphics-optimized instances, 3rd generation
     */
    InstanceClass["G3S"] = "g3s";
    /**
     * Graphics-optimized instances, 3rd generation
     */
    InstanceClass["GRAPHICS3"] = "graphics3";
    /**
     * Graphics-optimized instances, 3rd generation
     */
    InstanceClass["G3"] = "g3";
    /**
     * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
     */
    InstanceClass["GRAPHICS4_NVME_DRIVE_HIGH_PERFORMANCE"] = "graphics4-nvme-drive-high-performance";
    /**
     * Graphics-optimized instances with NVME drive for high performance computing, 4th generation
     */
    InstanceClass["G4DN"] = "g4dn";
    /**
     * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
     */
    InstanceClass["GRAPHICS4_AMD_NVME_DRIVE"] = "graphics4-amd-nvme-drive";
    /**
     * Graphics-optimized instances based on AMD EPYC And Radeon Pro GPU (NAVI) with local NVME drive, 4th generation
     */
    InstanceClass["G4AD"] = "g4ad";
    /**
     * Graphics-optimized instances, 5th generation
     */
    InstanceClass["GRAPHICS5"] = "graphics5";
    /**
     * Graphics-optimized instances, 5th generation
     */
    InstanceClass["G5"] = "g5";
    /**
     * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
     */
    InstanceClass["GRAPHICS5_GRAVITON2"] = "graphics5-graviton2";
    /**
     * Graphics-optimized instances powered by AWS Graviton2 Processors and NVIDIA T4G Tensor Core GPUs, 5th generation
     */
    InstanceClass["G5G"] = "g5g";
    /**
     * Parallel-processing optimized instances, 2nd generation
     */
    InstanceClass["PARALLEL2"] = "parallel2";
    /**
     * Parallel-processing optimized instances, 2nd generation
     */
    InstanceClass["P2"] = "p2";
    /**
     * Parallel-processing optimized instances, 3nd generation
     */
    InstanceClass["PARALLEL3"] = "parallel3";
    /**
     * Parallel-processing optimized instances, 3rd generation
     */
    InstanceClass["P3"] = "p3";
    /**
     * Parallel-processing optimized instances with local NVME drive for high performance computing, 3nd generation
     */
    InstanceClass["PARALLEL3_NVME_DRIVE_HIGH_PERFORMANCE"] = "parallel3-nvme-drive-high-performance";
    /**
     * Parallel-processing optimized instances with local NVME drive for high performance computing, 3rd generation
     */
    InstanceClass["P3DN"] = "p3dn";
    /**
     * Parallel-processing optimized instances with local NVME drive, extended, 4th generation (in developer preview)
     */
    InstanceClass["PARALLEL4_NVME_DRIVE_EXTENDED"] = "parallel4-nvme-drive-extended";
    /**
     * Parallel-processing optimized instances with local NVME drive, extended, 4th generation (in developer preview)
     */
    InstanceClass["P4DE"] = "p4de";
    /**
     * Parallel-processing optimized instances, 4th generation
     */
    InstanceClass["PARALLEL4"] = "parallel4";
    /**
     * Parallel-processing optimized instances, 4th generation
     */
    InstanceClass["P4D"] = "p4d";
    /**
     * Arm processor based instances, 1st generation
     */
    InstanceClass["ARM1"] = "arm1";
    /**
     * Arm processor based instances, 1st generation
     */
    InstanceClass["A1"] = "a1";
    /**
     * Arm processor based instances, 2nd generation
     */
    InstanceClass["STANDARD6_GRAVITON"] = "standard6-graviton";
    /**
     * Arm processor based instances, 2nd generation
     */
    InstanceClass["M6G"] = "m6g";
    /**
     * Standard instances based on Intel (Ice Lake), 6th generation.
     */
    InstanceClass["STANDARD6_INTEL"] = "standard6-intel";
    /**
     * Standard instances based on Intel (Ice Lake), 6th generation.
     */
    InstanceClass["M6I"] = "m6i";
    /**
     * Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
     */
    InstanceClass["STANDARD6_INTEL_NVME_DRIVE"] = "standard6-intel-nvme-drive";
    /**
     * Standard instances based on Intel (Ice Lake) with local NVME drive, 6th generation.
     */
    InstanceClass["M6ID"] = "m6id";
    /**
     * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
     */
    InstanceClass["STANDARD6_AMD"] = "standard6-amd";
    /**
     * Standard instances based on 3rd Gen AMD EPYC processors, 6th generation.
     */
    InstanceClass["M6A"] = "m6a";
    /**
     * Standard instances, 6th generation with Graviton2 processors and local NVME drive
     */
    InstanceClass["STANDARD6_GRAVITON2_NVME_DRIVE"] = "standard6-graviton2-nvme-drive";
    /**
     * Standard instances, 6th generation with Graviton2 processors and local NVME drive
     */
    InstanceClass["M6GD"] = "m6gd";
    /**
     * Standard instances, 7th generation with Graviton3 processors
     *
     * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
     */
    InstanceClass["STANDARD7_GRAVITON"] = "standard7-graviton";
    /**
     * Standard instances, 7th generation with Graviton3 processors
     *
     * This instance class is currently only available in US East (Ohio), US East (N. Virginia), US West (Oregon), and Europe (Ireland).
     */
    InstanceClass["M7G"] = "m7g";
    /**
     * High memory and compute capacity instances, 1st generation
     */
    InstanceClass["HIGH_COMPUTE_MEMORY1"] = "high-compute-memory1";
    /**
     * High memory and compute capacity instances, 1st generation
     */
    InstanceClass["Z1D"] = "z1d";
    /**
     * Inferentia Chips based instances for machine learning inference applications, 1st generation
     */
    InstanceClass["INFERENCE1"] = "inference1";
    /**
     * Inferentia Chips based instances for machine learning inference applications, 1st generation
     */
    InstanceClass["INF1"] = "inf1";
    /**
     * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
     */
    InstanceClass["MACINTOSH1_INTEL"] = "macintosh1-intel";
    /**
     * Macintosh instances built on Apple Mac mini computers, 1st generation with Intel procesors
     */
    InstanceClass["MAC1"] = "mac1";
    /**
     * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
     */
    InstanceClass["VIDEO_TRANSCODING1"] = "video-transcoding1";
    /**
     * Multi-stream video transcoding instances for resolutions up to 4K UHD, 1st generation
     */
    InstanceClass["VT1"] = "vt1";
    /**
     * High performance computing based on AMD EPYC, 6th generation
     */
    InstanceClass["HIGH_PERFORMANCE_COMPUTING6_AMD"] = "high-performance-computing6-amd";
    /**
     * High performance computing based on AMD EPYC, 6th generation
     */
    InstanceClass["HPC6A"] = "hpc6a";
    /**
     * Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
     */
    InstanceClass["DEEP_LEARNING1"] = "deep-learning1";
    /**
     * Deep learning instances powered by Gaudi accelerators from Habana Labs (an Intel company), 1st generation
     */
    InstanceClass["DL1"] = "dl1";
})(InstanceClass = exports.InstanceClass || (exports.InstanceClass = {}));
/**
 * Identifies an instance's CPU architecture
 */
var InstanceArchitecture;
(function (InstanceArchitecture) {
    /**
     * ARM64 architecture
     */
    InstanceArchitecture["ARM_64"] = "arm64";
    /**
     * x86-64 architecture
     */
    InstanceArchitecture["X86_64"] = "x86_64";
})(InstanceArchitecture = exports.InstanceArchitecture || (exports.InstanceArchitecture = {}));
/**
 * What size of instance to use
 */
var InstanceSize;
(function (InstanceSize) {
    /**
     * Instance size NANO (nano)
     */
    InstanceSize["NANO"] = "nano";
    /**
     * Instance size MICRO (micro)
     */
    InstanceSize["MICRO"] = "micro";
    /**
     * Instance size SMALL (small)
     */
    InstanceSize["SMALL"] = "small";
    /**
     * Instance size MEDIUM (medium)
     */
    InstanceSize["MEDIUM"] = "medium";
    /**
     * Instance size LARGE (large)
     */
    InstanceSize["LARGE"] = "large";
    /**
     * Instance size XLARGE (xlarge)
     */
    InstanceSize["XLARGE"] = "xlarge";
    /**
     * Instance size XLARGE2 (2xlarge)
     */
    InstanceSize["XLARGE2"] = "2xlarge";
    /**
     * Instance size XLARGE3 (3xlarge)
     */
    InstanceSize["XLARGE3"] = "3xlarge";
    /**
     * Instance size XLARGE4 (4xlarge)
     */
    InstanceSize["XLARGE4"] = "4xlarge";
    /**
     * Instance size XLARGE6 (6xlarge)
     */
    InstanceSize["XLARGE6"] = "6xlarge";
    /**
     * Instance size XLARGE8 (8xlarge)
     */
    InstanceSize["XLARGE8"] = "8xlarge";
    /**
     * Instance size XLARGE9 (9xlarge)
     */
    InstanceSize["XLARGE9"] = "9xlarge";
    /**
     * Instance size XLARGE10 (10xlarge)
     */
    InstanceSize["XLARGE10"] = "10xlarge";
    /**
     * Instance size XLARGE12 (12xlarge)
     */
    InstanceSize["XLARGE12"] = "12xlarge";
    /**
     * Instance size XLARGE16 (16xlarge)
     */
    InstanceSize["XLARGE16"] = "16xlarge";
    /**
     * Instance size XLARGE18 (18xlarge)
     */
    InstanceSize["XLARGE18"] = "18xlarge";
    /**
     * Instance size XLARGE24 (24xlarge)
     */
    InstanceSize["XLARGE24"] = "24xlarge";
    /**
     * Instance size XLARGE32 (32xlarge)
     */
    InstanceSize["XLARGE32"] = "32xlarge";
    /**
     * Instance size XLARGE48 (48xlarge)
     */
    InstanceSize["XLARGE48"] = "48xlarge";
    /**
     * Instance size XLARGE56 (56xlarge)
     */
    InstanceSize["XLARGE56"] = "56xlarge";
    /**
     * Instance size XLARGE56 (112xlarge)
     */
    InstanceSize["XLARGE112"] = "112xlarge";
    /**
     * Instance size METAL (metal)
     */
    InstanceSize["METAL"] = "metal";
})(InstanceSize = exports.InstanceSize || (exports.InstanceSize = {}));
/**
 * Instance type for EC2 instances
 *
 * This class takes a literal string, good if you already
 * know the identifier of the type you want.
 */
class InstanceType {
    /**
     * Instance type for EC2 instances
     *
     * This class takes a combination of a class and size.
     *
     * Be aware that not all combinations of class and size are available, and not all
     * classes are available in all regions.
     */
    static of(instanceClass, instanceSize) {
        try {
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InstanceClass(instanceClass);
            jsiiDeprecationWarnings._aws_cdk_aws_ec2_InstanceSize(instanceSize);
        }
        catch (error) {
            if (process.env.JSII_DEBUG !== "1" && error.name === "DeprecationError") {
                Error.captureStackTrace(error, this.of);
            }
            throw error;
        }
        // JSII does not allow enum types to have same value. So to support the enum, the enum with same value has to be mapped later.
        const instanceClassMap = {
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
            [InstanceClass.MEMORY5_EBS_OPTIMIZED]: 'r5b',
            [InstanceClass.R5B]: 'r5b',
            [InstanceClass.MEMORY6_GRAVITON]: 'r6g',
            [InstanceClass.R6G]: 'r6g',
            [InstanceClass.MEMORY6_GRAVITON2_NVME_DRIVE]: 'r6gd',
            [InstanceClass.R6GD]: 'r6gd',
            [InstanceClass.MEMORY7_GRAVITON]: 'r7g',
            [InstanceClass.R7G]: 'r7g',
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
            [InstanceClass.STORAGE2]: 'd2',
            [InstanceClass.D2]: 'd2',
            [InstanceClass.STORAGE3]: 'd3',
            [InstanceClass.D3]: 'd3',
            [InstanceClass.STORAGE3_ENHANCED_NETWORK]: 'd3en',
            [InstanceClass.D3EN]: 'd3en',
            [InstanceClass.STORAGE_COMPUTE_1]: 'h1',
            [InstanceClass.H1]: 'h1',
            [InstanceClass.IO3]: 'i3',
            [InstanceClass.I3]: 'i3',
            [InstanceClass.IO3_DENSE_NVME_DRIVE]: 'i3en',
            [InstanceClass.I3EN]: 'i3en',
            [InstanceClass.STORAGE4_GRAVITON_NETWORK_OPTIMIZED]: 'im4gn',
            [InstanceClass.IM4GN]: 'im4gn',
            [InstanceClass.STORAGE4_GRAVITON_NETWORK_STORAGE_OPTIMIZED]: 'is4gen',
            [InstanceClass.IS4GEN]: 'is4gen',
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
            [InstanceClass.ARM1]: 'a1',
            [InstanceClass.A1]: 'a1',
            [InstanceClass.STANDARD6_GRAVITON]: 'm6g',
            [InstanceClass.M6G]: 'm6g',
            [InstanceClass.STANDARD6_INTEL]: 'm6i',
            [InstanceClass.M6I]: 'm6i',
            [InstanceClass.STANDARD6_INTEL_NVME_DRIVE]: 'm6id',
            [InstanceClass.M6ID]: 'm6id',
            [InstanceClass.STANDARD6_AMD]: 'm6a',
            [InstanceClass.M6A]: 'm6a',
            [InstanceClass.STANDARD6_GRAVITON2_NVME_DRIVE]: 'm6gd',
            [InstanceClass.M6GD]: 'm6gd',
            [InstanceClass.STANDARD7_GRAVITON]: 'm7g',
            [InstanceClass.M7G]: 'm7g',
            [InstanceClass.HIGH_COMPUTE_MEMORY1]: 'z1d',
            [InstanceClass.Z1D]: 'z1d',
            [InstanceClass.INFERENCE1]: 'inf1',
            [InstanceClass.INF1]: 'inf1',
            [InstanceClass.MACINTOSH1_INTEL]: 'mac1',
            [InstanceClass.MAC1]: 'mac1',
            [InstanceClass.VIDEO_TRANSCODING1]: 'vt1',
            [InstanceClass.VT1]: 'vt1',
            [InstanceClass.HIGH_PERFORMANCE_COMPUTING6_AMD]: 'hpc6a',
            [InstanceClass.HPC6A]: 'hpc6a',
            [InstanceClass.I4I]: 'i4i',
            [InstanceClass.IO4_INTEL]: 'i4i',
            [InstanceClass.X2IEDN]: 'x2iedn',
            [InstanceClass.MEMORY_INTENSIVE_2_XT_INTEL]: 'x2iedn',
            [InstanceClass.X2IDN]: 'x2idn',
            [InstanceClass.MEMORY_INTENSIVE_2_INTEL]: 'x2idn',
            [InstanceClass.X2IEZN]: 'x2iezn',
            [InstanceClass.MEMORY_INTENSIVE_2_XTZ_INTEL]: 'x2iezn',
            [InstanceClass.DEEP_LEARNING1]: 'dl1',
            [InstanceClass.DL1]: 'dl1',
        };
        return new InstanceType(`${instanceClassMap[instanceClass] ?? instanceClass}.${instanceSize}`);
    }
    constructor(instanceTypeIdentifier) {
        this.instanceTypeIdentifier = instanceTypeIdentifier;
    }
    /**
     * Return the instance type as a dotted string
     */
    toString() {
        return this.instanceTypeIdentifier;
    }
    /**
     * The instance's CPU architecture
     */
    get architecture() {
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
_a = JSII_RTTI_SYMBOL_1;
InstanceType[_a] = { fqn: "@aws-cdk/aws-ec2.InstanceType", version: "0.0.0" };
exports.InstanceType = InstanceType;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFuY2UtdHlwZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbnN0YW5jZS10eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7Ozs7Ozs7R0FRRztBQUNILElBQVksYUFvNUJYO0FBcDVCRCxXQUFZLGFBQWE7SUFDdkI7O09BRUc7SUFDSCx3Q0FBdUIsQ0FBQTtJQUV2Qjs7T0FFRztJQUNILDBCQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILHdDQUF1QixDQUFBO0lBRXZCOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsd0NBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCw4REFBNkMsQ0FBQTtJQUU3Qzs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILGdEQUErQixDQUFBO0lBRS9COztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsc0VBQXFELENBQUE7SUFFckQ7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCwwRUFBeUQsQ0FBQTtJQUV6RDs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILGdHQUErRSxDQUFBO0lBRS9FOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsa0VBQWlELENBQUE7SUFFakQ7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCxvQ0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILDBCQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILG9DQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsb0NBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCw0Q0FBMkIsQ0FBQTtJQUUzQjs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILGdEQUErQixDQUFBO0lBRS9COztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsc0VBQXFELENBQUE7SUFFckQ7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCxzRUFBcUQsQ0FBQTtJQUVyRDs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDBEQUF5QyxDQUFBO0lBRXpDOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsNEZBQTJFLENBQUE7SUFFM0U7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCw0Q0FBMkIsQ0FBQTtJQUUzQjs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILGtFQUFpRCxDQUFBO0lBRWpEOztPQUVHO0lBQ0gsd0RBQXVDLENBQUE7SUFFdkM7O09BRUc7SUFDSCxrQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILHdEQUF1QyxDQUFBO0lBRXZDOztPQUVHO0lBQ0gsa0NBQWlCLENBQUE7SUFFakI7O09BRUc7SUFDSCx3REFBdUMsQ0FBQTtJQUV2Qzs7T0FFRztJQUNILGtDQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsMERBQXlDLENBQUE7SUFFekM7O09BRUc7SUFDSCxvQ0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILDBEQUF5QyxDQUFBO0lBRXpDOztPQUVHO0lBQ0gsb0NBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCwwREFBeUMsQ0FBQTtJQUV6Qzs7T0FFRztJQUNILG9DQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsZ0VBQStDLENBQUE7SUFFL0M7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxzREFBcUMsQ0FBQTtJQUVyQzs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDhFQUE2RCxDQUFBO0lBRTdEOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOzs7O09BSUc7SUFDSCxzREFBcUMsQ0FBQTtJQUVyQzs7OztPQUlHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsc0NBQXFCLENBQUE7SUFFckI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCxzQ0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILDBCQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILHNDQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsNERBQTJDLENBQUE7SUFFM0M7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCw4Q0FBNkIsQ0FBQTtJQUU3Qjs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILG9FQUFtRCxDQUFBO0lBRW5EOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsd0VBQXVELENBQUE7SUFFdkQ7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxrREFBaUMsQ0FBQTtJQUVqQzs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILHdFQUF1RCxDQUFBO0lBRXZEOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsb0ZBQW1FLENBQUE7SUFFbkU7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCw4Q0FBNkIsQ0FBQTtJQUU3Qjs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDBEQUF5QyxDQUFBO0lBRXpDOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsMERBQXlDLENBQUE7SUFFekM7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7OztPQUdHO0lBQ0gsZ0ZBQStELENBQUE7SUFFL0Q7OztPQUdHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOzs7T0FHRztJQUNILHdHQUF1RixDQUFBO0lBRXZGOzs7T0FHRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILHNDQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsc0NBQXFCLENBQUE7SUFFckI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O01BRUU7SUFDRix3RUFBdUQsQ0FBQTtJQUV2RDs7T0FFRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILHdEQUF1QyxDQUFBO0lBRXZDOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsOERBQTZDLENBQUE7SUFFN0M7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCx3Q0FBdUIsQ0FBQTtJQUV2Qjs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDRGQUEyRSxDQUFBO0lBRTNFOztPQUVHO0lBQ0gsZ0NBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsNEdBQTJGLENBQUE7SUFFM0Y7O09BRUc7SUFDSCxrQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILDBDQUF5QixDQUFBO0lBRXpCOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsMENBQXlCLENBQUE7SUFFekI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCxrREFBaUMsQ0FBQTtJQUVqQzs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILDREQUEyQyxDQUFBO0lBRTNDOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsMERBQXlDLENBQUE7SUFFekM7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCw0RUFBMkQsQ0FBQTtJQUUzRDs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7OztPQUlHO0lBQ0gsOEVBQTZELENBQUE7SUFFN0Q7Ozs7T0FJRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILG9HQUFtRixDQUFBO0lBRW5GOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsNEVBQTJELENBQUE7SUFFM0Q7O09BRUc7SUFDSCxrQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILHNFQUFxRCxDQUFBO0lBRXJEOztPQUVHO0lBQ0gsZ0NBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsOEVBQTZELENBQUE7SUFFN0Q7O09BRUc7SUFDSCxrQ0FBaUIsQ0FBQTtJQUVqQjs7T0FFRztJQUNILGdDQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILDBCQUFTLENBQUE7SUFFVDs7T0FFRztJQUNILG9EQUFtQyxDQUFBO0lBRW5DOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsd0NBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCxnR0FBK0UsQ0FBQTtJQUUvRTs7T0FFRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILHNFQUFxRCxDQUFBO0lBRXJEOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsd0NBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCw0REFBMkMsQ0FBQTtJQUUzQzs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILHdDQUF1QixDQUFBO0lBRXZCOztPQUVHO0lBQ0gsMEJBQVMsQ0FBQTtJQUVUOztPQUVHO0lBQ0gsd0NBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCxnR0FBK0UsQ0FBQTtJQUUvRTs7T0FFRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILGdGQUErRCxDQUFBO0lBRS9EOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsd0NBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCwwQkFBUyxDQUFBO0lBRVQ7O09BRUc7SUFDSCwwREFBeUMsQ0FBQTtJQUV6Qzs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILG9EQUFtQyxDQUFBO0lBRW5DOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsMEVBQXlELENBQUE7SUFFekQ7O09BRUc7SUFDSCw4QkFBYSxDQUFBO0lBRWI7O09BRUc7SUFDSCxnREFBK0IsQ0FBQTtJQUUvQjs7T0FFRztJQUNILDRCQUFXLENBQUE7SUFFWDs7T0FFRztJQUNILGtGQUFpRSxDQUFBO0lBRWpFOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOzs7O09BSUc7SUFDSCwwREFBeUMsQ0FBQTtJQUV6Qzs7OztPQUlHO0lBQ0gsNEJBQVcsQ0FBQTtJQUVYOztPQUVHO0lBQ0gsOERBQTZDLENBQUE7SUFFN0M7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCwwQ0FBeUIsQ0FBQTtJQUV6Qjs7T0FFRztJQUNILDhCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILHNEQUFxQyxDQUFBO0lBRXJDOztPQUVHO0lBQ0gsOEJBQWEsQ0FBQTtJQUViOztPQUVHO0lBQ0gsMERBQXlDLENBQUE7SUFFekM7O09BRUc7SUFDSCw0QkFBVyxDQUFBO0lBRVg7O09BRUc7SUFDSCxvRkFBbUUsQ0FBQTtJQUVuRTs7T0FFRztJQUNILGdDQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILGtEQUFpQyxDQUFBO0lBRWpDOztPQUVHO0lBQ0gsNEJBQVcsQ0FBQTtBQUNiLENBQUMsRUFwNUJXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBbzVCeEI7QUFFRDs7R0FFRztBQUNILElBQVksb0JBVVg7QUFWRCxXQUFZLG9CQUFvQjtJQUM5Qjs7T0FFRztJQUNILHdDQUFnQixDQUFBO0lBRWhCOztPQUVHO0lBQ0gseUNBQWlCLENBQUE7QUFDbkIsQ0FBQyxFQVZXLG9CQUFvQixHQUFwQiw0QkFBb0IsS0FBcEIsNEJBQW9CLFFBVS9CO0FBRUQ7O0dBRUc7QUFDSCxJQUFZLFlBOEdYO0FBOUdELFdBQVksWUFBWTtJQUN0Qjs7T0FFRztJQUNILDZCQUFhLENBQUE7SUFFYjs7T0FFRztJQUNILCtCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILCtCQUFlLENBQUE7SUFFZjs7T0FFRztJQUNILGlDQUFpQixDQUFBO0lBRWpCOztPQUVHO0lBQ0gsK0JBQWUsQ0FBQTtJQUVmOztPQUVHO0lBQ0gsaUNBQWlCLENBQUE7SUFFakI7O09BRUc7SUFDSCxtQ0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILG1DQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsbUNBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCxtQ0FBbUIsQ0FBQTtJQUVuQjs7T0FFRztJQUNILG1DQUFtQixDQUFBO0lBRW5COztPQUVHO0lBQ0gsbUNBQW1CLENBQUE7SUFFbkI7O09BRUc7SUFDSCxxQ0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILHFDQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gscUNBQXFCLENBQUE7SUFFckI7O09BRUc7SUFDSCxxQ0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILHFDQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gscUNBQXFCLENBQUE7SUFFckI7O09BRUc7SUFDSCxxQ0FBcUIsQ0FBQTtJQUVyQjs7T0FFRztJQUNILHFDQUFxQixDQUFBO0lBRXJCOztPQUVHO0lBQ0gsdUNBQXVCLENBQUE7SUFFdkI7O09BRUc7SUFDSCwrQkFBZSxDQUFBO0FBQ2pCLENBQUMsRUE5R1csWUFBWSxHQUFaLG9CQUFZLEtBQVosb0JBQVksUUE4R3ZCO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFhLFlBQVk7SUFDdkI7Ozs7Ozs7T0FPRztJQUNJLE1BQU0sQ0FBQyxFQUFFLENBQUMsYUFBNEIsRUFBRSxZQUEwQjs7Ozs7Ozs7Ozs7UUFDdkUsOEhBQThIO1FBQzlILE1BQU0sZ0JBQWdCLEdBQWtDO1lBQ3RELENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUk7WUFDL0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJO1lBQy9CLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSTtZQUMvQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLG9CQUFvQixDQUFDLEVBQUUsS0FBSztZQUMzQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxFQUFFLEtBQUs7WUFDcEMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLE1BQU07WUFDaEQsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxFQUFFLEtBQUs7WUFDakQsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxFQUFFLE1BQU07WUFDN0QsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLE1BQU07WUFDOUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJO1lBQzdCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSTtZQUM3QixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxFQUFFLElBQUk7WUFDN0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxLQUFLO1lBQ2xDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLEVBQUUsS0FBSztZQUNwQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsTUFBTTtZQUNoRCxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsS0FBSztZQUMvQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsS0FBSztZQUN6QyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLG1DQUFtQyxDQUFDLEVBQUUsTUFBTTtZQUMzRCxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEtBQUs7WUFDbEMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxzQkFBc0IsQ0FBQyxFQUFFLE1BQU07WUFDOUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFFBQVE7WUFDM0MsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUTtZQUNoQyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFFBQVE7WUFDM0MsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUTtZQUNoQyxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLFFBQVE7WUFDM0MsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUTtZQUNoQyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFNBQVM7WUFDN0MsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztZQUNsQyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFNBQVM7WUFDN0MsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztZQUNsQyxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLFNBQVM7WUFDN0MsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUztZQUNsQyxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEtBQUs7WUFDNUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEtBQUs7WUFDdkMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLE1BQU07WUFDcEQsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLEtBQUs7WUFDdkMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1lBQzlCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtZQUM5QixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUk7WUFDOUIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEtBQUs7WUFDMUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsRUFBRSxLQUFLO1lBQ25DLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsdUJBQXVCLENBQUMsRUFBRSxNQUFNO1lBQy9DLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU07WUFDNUIsQ0FBQyxhQUFhLENBQUMseUJBQXlCLENBQUMsRUFBRSxLQUFLO1lBQ2hELENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEVBQUUsS0FBSztZQUNyQyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLCtCQUErQixDQUFDLEVBQUUsTUFBTTtZQUN2RCxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsTUFBTTtZQUNqRCxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFLEtBQUs7WUFDbkMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUs7WUFDekMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFLE1BQU07WUFDckQsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyx5Q0FBeUMsQ0FBQyxFQUFFLE1BQU07WUFDakUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLEtBQUs7WUFDekMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJO1lBQzlCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSTtZQUM5QixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLHlCQUF5QixDQUFDLEVBQUUsTUFBTTtZQUNqRCxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSTtZQUN2QyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUk7WUFDekIsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxFQUFFLE1BQU07WUFDNUMsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxtQ0FBbUMsQ0FBQyxFQUFFLE9BQU87WUFDNUQsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUUsT0FBTztZQUM5QixDQUFDLGFBQWEsQ0FBQywyQ0FBMkMsQ0FBQyxFQUFFLFFBQVE7WUFDckUsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUTtZQUNoQyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJO1lBQ2hDLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEVBQUUsSUFBSTtZQUNoQyxDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEtBQUs7WUFDckMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEtBQUs7WUFDMUMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFFLElBQUk7WUFDeEMsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQywyQkFBMkIsQ0FBQyxFQUFFLEtBQUs7WUFDbEQsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyw0QkFBNEIsQ0FBQyxFQUFFLEtBQUs7WUFDbkQsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQyx1Q0FBdUMsQ0FBQyxFQUFFLE1BQU07WUFDL0QsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJO1lBQzNCLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLEVBQUUsS0FBSztZQUN0QyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUk7WUFDL0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxFQUFFLE1BQU07WUFDN0QsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLE1BQU07WUFDaEQsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFJO1lBQy9CLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUk7WUFDeEIsQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsRUFBRSxLQUFLO1lBQzFDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSTtZQUMvQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUk7WUFDL0IsQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSTtZQUN4QixDQUFDLGFBQWEsQ0FBQyxxQ0FBcUMsQ0FBQyxFQUFFLE1BQU07WUFDN0QsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyw2QkFBNkIsQ0FBQyxFQUFFLE1BQU07WUFDckQsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLO1lBQ2hDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSTtZQUMxQixDQUFDLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJO1lBQ3hCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsS0FBSztZQUN6QyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLGVBQWUsQ0FBQyxFQUFFLEtBQUs7WUFDdEMsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSztZQUMxQixDQUFDLGFBQWEsQ0FBQywwQkFBMEIsQ0FBQyxFQUFFLE1BQU07WUFDbEQsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTTtZQUM1QixDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsRUFBRSxLQUFLO1lBQ3BDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsOEJBQThCLENBQUMsRUFBRSxNQUFNO1lBQ3RELENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU07WUFDNUIsQ0FBQyxhQUFhLENBQUMsa0JBQWtCLENBQUMsRUFBRSxLQUFLO1lBQ3pDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLENBQUMsRUFBRSxLQUFLO1lBQzNDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTTtZQUNsQyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLEVBQUUsTUFBTTtZQUN4QyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNO1lBQzVCLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLEVBQUUsS0FBSztZQUN6QyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLO1lBQzFCLENBQUMsYUFBYSxDQUFDLCtCQUErQixDQUFDLEVBQUUsT0FBTztZQUN4RCxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPO1lBQzlCLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7WUFDMUIsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEVBQUUsS0FBSztZQUNoQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRO1lBQ2hDLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLEVBQUUsUUFBUTtZQUNyRCxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxPQUFPO1lBQzlCLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLEVBQUUsT0FBTztZQUNqRCxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRO1lBQ2hDLENBQUMsYUFBYSxDQUFDLDRCQUE0QixDQUFDLEVBQUUsUUFBUTtZQUN0RCxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsRUFBRSxLQUFLO1lBQ3JDLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUs7U0FDM0IsQ0FBQztRQUNGLE9BQU8sSUFBSSxZQUFZLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxhQUFhLElBQUksWUFBWSxFQUFFLENBQUMsQ0FBQztLQUNoRztJQUVELFlBQTZCLHNCQUE4QjtRQUE5QiwyQkFBc0IsR0FBdEIsc0JBQXNCLENBQVE7S0FDMUQ7SUFFRDs7T0FFRztJQUNJLFFBQVE7UUFDYixPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztLQUNwQztJQUVEOztPQUVHO0lBQ0gsSUFBVyxZQUFZO1FBQ3JCLDBGQUEwRjtRQUMxRixNQUFNLHNCQUFzQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsMENBQTBDLENBQUMsQ0FBQztRQUM3RyxJQUFJLHNCQUFzQixJQUFJLElBQUksRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDdkQ7UUFFRCxNQUFNLE1BQU0sR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QyxNQUFNLFlBQVksR0FBRyxzQkFBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQyx1REFBdUQ7UUFDdkQsNkRBQTZEO1FBQzdELElBQUksTUFBTSxLQUFLLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ2hELE9BQU8sb0JBQW9CLENBQUMsTUFBTSxDQUFDO1NBQ3BDO1FBRUQsT0FBTyxvQkFBb0IsQ0FBQyxNQUFNLENBQUM7S0FDcEM7Ozs7QUFsT1Usb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFdoYXQgY2xhc3MgYW5kIGdlbmVyYXRpb24gb2YgaW5zdGFuY2UgdG8gdXNlXG4gKlxuICogV2UgaGF2ZSBib3RoIHN5bWJvbGljIGFuZCBjb25jcmV0ZSBlbnVtcyBmb3IgZXZlcnkgdHlwZS5cbiAqXG4gKiBUaGUgZmlyc3QgYXJlIGZvciBwZW9wbGUgdGhhdCB3YW50IHRvIHNwZWNpZnkgYnkgcHVycG9zZSxcbiAqIHRoZSBzZWNvbmQgb25lIGFyZSBmb3IgcGVvcGxlIHdobyBhbHJlYWR5IGtub3cgZXhhY3RseSB3aGF0XG4gKiAnUjQnIG1lYW5zLlxuICovXG5leHBvcnQgZW51bSBJbnN0YW5jZUNsYXNzIHtcbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIFNUQU5EQVJEMyA9ICdzdGFuZGFyZDMnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMsIDNyZCBnZW5lcmF0aW9uXG4gICAqL1xuICBNMyA9ICdtMycsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcywgNHRoIGdlbmVyYXRpb25cbiAgICovXG4gIFNUQU5EQVJENCA9ICdzdGFuZGFyZDQnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBNNCA9ICdtNCcsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIFNUQU5EQVJENSA9ICdzdGFuZGFyZDUnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBNNSA9ICdtNScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVEFOREFSRDVfTlZNRV9EUklWRSA9ICdzdGFuZGFyZDUtbnZtZS1kcml2ZScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBNNUQgPSAnbTVkJyxcblxuICAvKipcbiAgICogU3RhbmRhcmQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgU1RBTkRBUkQ1X0FNRCA9ICdzdGFuZGFyZDUtYW1kJyxcblxuICAvKipcbiAgICogU3RhbmRhcmQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgTTVBID0gJ201YScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVEFOREFSRDVfQU1EX05WTUVfRFJJVkUgPSAnc3RhbmRhcmQ1LWFtZC1udm1lLWRyaXZlJyxcblxuICAvKipcbiAgICogU3RhbmRhcmQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIE01QUQgPSAnbTVhZCcsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVEFOREFSRDVfSElHSF9QRVJGT1JNQU5DRSA9ICdzdGFuZGFyZDUtaGlnaC1wZXJmb3JtYW5jZScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBNNU4gPSAnbTVuJyxcblxuICAvKipcbiAgICogU3RhbmRhcmQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVEFOREFSRDVfTlZNRV9EUklWRV9ISUdIX1BFUkZPUk1BTkNFID0gJ3N0YW5kYXJkNS1udm1lLWRyaXZlLWhpZ2gtcGVyZm9ybWFuY2UnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIE01RE4gPSAnbTVkbicsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyB3aXRoIGhpZ2ggbWVtb3J5IGFuZCBjb21wdXRlIGNhcGFjaXR5IGJhc2VkIG9uIEludGVsIFhlb24gU2NhbGFibGUgKENhc2NhZGUgTGFrZSkgcHJvY2Vzc29ycywgNW5kIGdlbmVyYXRpb25cbiAgICovXG4gIFNUQU5EQVJENV9ISUdIX0NPTVBVVEUgPSAnc3RhbmRhcmQ1LWhpZ2gtY29tcHV0ZScsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyB3aXRoIGhpZ2ggbWVtb3J5IGFuZCBjb21wdXRlIGNhcGFjaXR5IGJhc2VkIG9uIEludGVsIFhlb24gU2NhbGFibGUgKENhc2NhZGUgTGFrZSkgcHJvY2Vzc29ycywgNW5kIGdlbmVyYXRpb25cbiAgICovXG4gIE01Wk4gPSAnbTV6bicsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgTUVNT1JZMyA9ICdtZW1vcnkzJyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMsIDNyZCBnZW5lcmF0aW9uXG4gICAqL1xuICBSMyA9ICdyMycsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA0dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgTUVNT1JZNCA9ICdtZW1vcnk0JyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBSNCA9ICdyNCcsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgTUVNT1JZNSA9ICdtZW1vcnk1JyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBSNSA9ICdyNScsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDLCA2dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgTUVNT1JZNl9BTUQgPSAnbWVtb3J5Ni1hbWQnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQywgNnRoIGdlbmVyYXRpb25cbiAgICovXG4gIFI2QSA9ICdyNmEnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcywgNnRoIGdlbmVyYXRpb24gd2l0aCBJbnRlbCBYZW9uIFNjYWxhYmxlIHByb2Nlc3NvcnMgKDNyZCBnZW5lcmF0aW9uIHByb2Nlc3NvcnMgY29kZSBuYW1lZCBJY2UgTGFrZSlcbiAgICovXG4gIE1FTU9SWTZfSU5URUwgPSAnbWVtb3J5Ni1pbnRlbCcsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEludGVsIFhlb24gU2NhbGFibGUgcHJvY2Vzc29ycyAoM3JkIGdlbmVyYXRpb24gcHJvY2Vzc29ycyBjb2RlIG5hbWVkIEljZSBMYWtlKVxuICAgKi9cbiAgUjZJID0gJ3I2aScsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgNnRoIGdlbmVyYXRpb24gd2l0aCBJbnRlbCBYZW9uIFNjYWxhYmxlIHByb2Nlc3NvcnMgKDNyZCBnZW5lcmF0aW9uIHByb2Nlc3NvcnMgY29kZSBuYW1lZCBJY2UgTGFrZSlcbiAgICovXG4gIE1FTU9SWTZfSU5URUxfTlZNRV9EUklWRSA9ICdtZW1vcnk2LWludGVsLW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDZ0aCBnZW5lcmF0aW9uIHdpdGggSW50ZWwgWGVvbiBTY2FsYWJsZSBwcm9jZXNzb3JzICgzcmQgZ2VuZXJhdGlvbiBwcm9jZXNzb3JzIGNvZGUgbmFtZWQgSWNlIExha2UpXG4gICAqL1xuICBSNklEID0gJ3I2aWQnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBNRU1PUlk1X0hJR0hfUEVSRk9STUFOQ0UgPSAnbWVtb3J5NS1oaWdoLXBlcmZvcm1hbmNlJyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgUjVOID0gJ3I1bicsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIE1FTU9SWTVfTlZNRV9EUklWRSA9ICdtZW1vcnk1LW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBSNUQgPSAncjVkJyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIE1FTU9SWTVfTlZNRV9EUklWRV9ISUdIX1BFUkZPUk1BTkNFID0gJ21lbW9yeTUtbnZtZS1kcml2ZS1oaWdoLXBlcmZvcm1hbmNlJyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIFI1RE4gPSAncjVkbicsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgTUVNT1JZNV9BTUQgPSAnbWVtb3J5NS1hbWQnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIFI1QSA9ICdyNWEnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBNRU1PUlk1X0FNRF9OVk1FX0RSSVZFID0gJ21lbW9yeTUtYW1kLW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBIaWdoIG1lbW9yeSBpbnN0YW5jZXMgKDNUQikgYmFzZWQgb24gSW50ZWwgWGVvbiBQbGF0aW51bSA4MTc2TSAoU2t5bGFrZSkgcHJvY2Vzc29ycywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIEhJR0hfTUVNT1JZXzNUQl8xID0gJ2hpZ2gtbWVtb3J5LTN0Yi0xJyxcblxuICAvKipcbiAgICogSGlnaCBtZW1vcnkgaW5zdGFuY2VzICgzVEIpIGJhc2VkIG9uIEludGVsIFhlb24gUGxhdGludW0gODE3Nk0gKFNreWxha2UpIHByb2Nlc3NvcnMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBVXzNUQjEgPSAndS0zdGIxJyxcblxuICAvKipcbiAgICogSGlnaCBtZW1vcnkgaW5zdGFuY2VzICg2VEIpIGJhc2VkIG9uIEludGVsIFhlb24gUGxhdGludW0gODE3Nk0gKFNreWxha2UpIHByb2Nlc3NvcnMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBISUdIX01FTU9SWV82VEJfMSA9ICdoaWdoLW1lbW9yeS02dGItMScsXG5cbiAgLyoqXG4gICAqIEhpZ2ggbWVtb3J5IGluc3RhbmNlcyAoNlRCKSBiYXNlZCBvbiBJbnRlbCBYZW9uIFBsYXRpbnVtIDgxNzZNIChTa3lsYWtlKSBwcm9jZXNzb3JzLCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgVV82VEIxID0gJ3UtNnRiMScsXG5cbiAgLyoqXG4gICAqIEhpZ2ggbWVtb3J5IGluc3RhbmNlcyAoOVRCKSBiYXNlZCBvbiBJbnRlbCBYZW9uIFBsYXRpbnVtIDgxNzZNIChTa3lsYWtlKSBwcm9jZXNzb3JzLCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgSElHSF9NRU1PUllfOVRCXzEgPSAnaGlnaC1tZW1vcnktOXRiLTEnLFxuXG4gIC8qKlxuICAgKiBIaWdoIG1lbW9yeSBpbnN0YW5jZXMgKDlUQikgYmFzZWQgb24gSW50ZWwgWGVvbiBQbGF0aW51bSA4MTc2TSAoU2t5bGFrZSkgcHJvY2Vzc29ycywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIFVfOVRCMSA9ICd1LTl0YjEnLFxuXG4gIC8qKlxuICAgKiBIaWdoIG1lbW9yeSBpbnN0YW5jZXMgKDEyVEIpIGJhc2VkIG9uIEludGVsIFhlb24gUGxhdGludW0gODE3Nk0gKFNreWxha2UpIHByb2Nlc3NvcnMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBISUdIX01FTU9SWV8xMlRCXzEgPSAnaGlnaC1tZW1vcnktMTJ0Yi0xJyxcblxuICAvKipcbiAgICogSGlnaCBtZW1vcnkgaW5zdGFuY2VzICgxMlRCKSBiYXNlZCBvbiBJbnRlbCBYZW9uIFBsYXRpbnVtIDgxNzZNIChTa3lsYWtlKSBwcm9jZXNzb3JzLCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgVV8xMlRCMSA9ICd1LTEydGIxJyxcblxuICAvKipcbiAgICogSGlnaCBtZW1vcnkgaW5zdGFuY2VzICgxOFRCKSBiYXNlZCBvbiBJbnRlbCBYZW9uIFNjYWxhYmxlIChDYXNjYWRlIExha2UpIHByb2Nlc3NvcnMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBISUdIX01FTU9SWV8xOFRCXzEgPSAnaGlnaC1tZW1vcnktMTh0Yi0xJyxcblxuICAvKipcbiAgICogSGlnaCBtZW1vcnkgaW5zdGFuY2VzICgxOFRCKSBiYXNlZCBvbiBJbnRlbCBYZW9uIFNjYWxhYmxlIChDYXNjYWRlIExha2UpIHByb2Nlc3NvcnMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBVXzE4VEIxID0gJ3UtMTh0YjEnLFxuXG4gIC8qKlxuICAgKiBIaWdoIG1lbW9yeSBpbnN0YW5jZXMgKDI0VEIpIGJhc2VkIG9uIEludGVsIFhlb24gU2NhbGFibGUgKENhc2NhZGUgTGFrZSkgcHJvY2Vzc29ycywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIEhJR0hfTUVNT1JZXzI0VEJfMSA9ICdoaWdoLW1lbW9yeS0yNHRiLTEnLFxuXG4gIC8qKlxuICAgKiBIaWdoIG1lbW9yeSBpbnN0YW5jZXMgKDI0VEIpIGJhc2VkIG9uIEludGVsIFhlb24gU2NhbGFibGUgKENhc2NhZGUgTGFrZSkgcHJvY2Vzc29ycywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIFVfMjRUQjEgPSAndS0yNHRiMScsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIFI1QUQgPSAncjVhZCcsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzIHRoYXQgYXJlIGFsc28gRUJTLW9wdGltaXplZCwgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIE1FTU9SWTVfRUJTX09QVElNSVpFRCA9ICdtZW1vcnk1LWVicy1vcHRpbWl6ZWQnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcyB0aGF0IGFyZSBhbHNvIEVCUy1vcHRpbWl6ZWQsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBSNUIgPSAncjViJyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMsIDZ0aCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24yIHByb2Nlc3NvcnNcbiAgICovXG4gIE1FTU9SWTZfR1JBVklUT04gPSAnbWVtb3J5Ni1ncmF2aXRvbicsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqL1xuICBSNkcgPSAncjZnJyxcblxuICAvKipcbiAgICogTWVtb3J5IG9wdGltaXplZCBpbnN0YW5jZXMsIDZ0aCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24yIHByb2Nlc3NvcnMgYW5kIGxvY2FsIE5WTUUgZHJpdmVcbiAgICovXG4gIE1FTU9SWTZfR1JBVklUT04yX05WTUVfRFJJVkUgPSAnbWVtb3J5Ni1ncmF2aXRvbjItbnZtZS1kcml2ZScsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzIGFuZCBsb2NhbCBOVk1FIGRyaXZlXG4gICAqL1xuICBSNkdEID0gJ3I2Z2QnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnkgb3B0aW1pemVkIGluc3RhbmNlcywgN3RoIGdlbmVyYXRpb24gd2l0aCBHcmF2aXRvbjMgcHJvY2Vzc29yc1xuICAgKlxuICAgKiBUaGlzIGluc3RhbmNlIGNsYXNzIGlzIGN1cnJlbnRseSBvbmx5IGF2YWlsYWJsZSBpbiBVUyBFYXN0IChPaGlvKSwgVVMgRWFzdCAoTi4gVmlyZ2luaWEpLCBVUyBXZXN0IChPcmVnb24pLCBhbmQgRXVyb3BlIChJcmVsYW5kKS5cbiAgICovXG4gIE1FTU9SWTdfR1JBVklUT04gPSAnbWVtb3J5Ny1ncmF2aXRvbicsXG5cbiAgLyoqXG4gICAqIE1lbW9yeSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA3dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMyBwcm9jZXNzb3JzXG4gICAqXG4gICAqIFRoaXMgaW5zdGFuY2UgY2xhc3MgaXMgY3VycmVudGx5IG9ubHkgYXZhaWxhYmxlIGluIFVTIEVhc3QgKE9oaW8pLCBVUyBFYXN0IChOLiBWaXJnaW5pYSksIFVTIFdlc3QgKE9yZWdvbiksIGFuZCBFdXJvcGUgKElyZWxhbmQpLlxuICAgKi9cbiAgUjdHID0gJ3I3ZycsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIENPTVBVVEUzID0gJ2NvbXB1dGUzJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgQzMgPSAnYzMnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDT01QVVRFNCA9ICdjb21wdXRlNCcsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcywgNHRoIGdlbmVyYXRpb25cbiAgICovXG4gIEM0ID0gJ2M0JyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgQ09NUFVURTUgPSAnY29tcHV0ZTUnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDNSA9ICdjNScsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDT01QVVRFNV9OVk1FX0RSSVZFID0gJ2NvbXB1dGU1LW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgQzVEID0gJ2M1ZCcsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIENPTVBVVEU1X0FNRCA9ICdjb21wdXRlNS1hbWQnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgYmFzZWQgb24gQU1EIEVQWUMsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDNUEgPSAnYzVhJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSBiYXNlZCBvbiBBTUQgRVBZQywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIENPTVBVVEU1X0FNRF9OVk1FX0RSSVZFID0gJ2NvbXB1dGU1LWFtZC1udm1lLWRyaXZlJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSBiYXNlZCBvbiBBTUQgRVBZQywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIEM1QUQgPSAnYzVhZCcsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcyBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDT01QVVRFNV9ISUdIX1BFUkZPUk1BTkNFID0gJ2NvbXB1dGU1LWhpZ2gtcGVyZm9ybWFuY2UnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgQzVOID0gJ2M1bicsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcywgNnRoIGdlbmVyYXRpb25cbiAgICovXG4gIENPTVBVVEU2X0lOVEVMID0gJ2NvbXB1dGU2LWludGVsJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzLCA2dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgQzZJID0gJ2M2aScsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDZ0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDT01QVVRFNl9JTlRFTF9OVk1FX0RSSVZFID0gJ2NvbXB1dGU2LWludGVsLW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlLCA2dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgQzZJRCA9ICdjNmlkJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgNnRoIGdlbmVyYXRpb25cbiAgICovXG4gIENPTVBVVEU2X0lOVEVMX0hJR0hfUEVSRk9STUFOQ0UgPSAnY29tcHV0ZTYtaW50ZWwtaGlnaC1wZXJmb3JtYW5jZScsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcyBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDZ0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBDNklOID0gJ2M2aW4nLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgYmFzZWQgb24gQU1EIEVQWUMgKGNvZGVuYW1lIE1pbGFuKSwgNnRoIGdlbmVyYXRpb25cbiAgICovXG4gIENPTVBVVEU2X0FNRCA9ICdjb21wdXRlNi1hbWQnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgYmFzZWQgb24gQU1EIEVQWUMgKGNvZGVuYW1lIE1pbGFuKSwgNnRoIGdlbmVyYXRpb25cbiAgICovXG4gIEM2QSA9ICdjNmEnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqL1xuICBDT01QVVRFNl9HUkFWSVRPTjIgPSAnY29tcHV0ZTYtZ3Jhdml0b24yJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgNnRoIGdlbmVyYXRpb24gd2l0aCBHcmF2aXRvbjIgcHJvY2Vzc29yc1xuICAgKi9cbiAgQzZHID0gJ2M2ZycsXG5cbiAgLyoqXG4gICAqIENvbXB1dGUgb3B0aW1pemVkIGluc3RhbmNlcyBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDd0aCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24zIHByb2Nlc3NvcnNcbiAgICovXG4gIENPTVBVVEU3X0dSQVZJVE9OMyA9ICdjb21wdXRlNy1ncmF2aXRvbjMnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA3dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMyBwcm9jZXNzb3JzXG4gICAqL1xuICBDN0cgPSAnYzdnJyxcblxuICAvKipcbiAgICogQ29tcHV0ZSBvcHRpbWl6ZWQgaW5zdGFuY2VzIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgNnRoIGdlbmVyYXRpb24gd2l0aCBHcmF2aXRvbjIgcHJvY2Vzc29yc1xuICAgKiBhbmQgbG9jYWwgTlZNRSBkcml2ZVxuICAgKi9cbiAgQ09NUFVURTZfR1JBVklUT04yX05WTUVfRFJJVkUgPSAnY29tcHV0ZTYtZ3Jhdml0b24yLW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqIGFuZCBsb2NhbCBOVk1FIGRyaXZlXG4gICAqL1xuICBDNkdEID0gJ2M2Z2QnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqIGFuZCBoaWdoIG5ldHdvcmsgYmFuZHdpZHRoIGNhcGFiaWxpdGllc1xuICAgKi9cbiAgQ09NUFVURTZfR1JBVklUT04yX0hJR0hfTkVUV09SS19CQU5EV0lEVEggPSAnY29tcHV0ZTYtZ3Jhdml0b24yLWhpZ2gtbmV0d29yay1iYW5kd2lkdGgnLFxuXG4gIC8qKlxuICAgKiBDb21wdXRlIG9wdGltaXplZCBpbnN0YW5jZXMgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCA2dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqIGFuZCBoaWdoIG5ldHdvcmsgYmFuZHdpZHRoIGNhcGFiaWxpdGllc1xuICAgKi9cbiAgQzZHTiA9ICdjNmduJyxcblxuICAvKipcbiAgICogU3RvcmFnZS1vcHRpbWl6ZWQgaW5zdGFuY2VzLCAybmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgU1RPUkFHRTIgPSAnc3RvcmFnZTInLFxuXG4gIC8qKlxuICAgKiBTdG9yYWdlLW9wdGltaXplZCBpbnN0YW5jZXMsIDJuZCBnZW5lcmF0aW9uXG4gICAqL1xuICBEMiA9ICdkMicsXG5cbiAgLyoqXG4gICAqIFN0b3JhZ2Utb3B0aW1pemVkIGluc3RhbmNlcywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIFNUT1JBR0UzID0gJ3N0b3JhZ2UzJyxcblxuICAvKipcbiAgICogU3RvcmFnZS1vcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgRDMgPSAnZDMnLFxuXG4gIC8qKlxuICAqIFN0b3JhZ2Utb3B0aW1pemVkIGluc3RhbmNlcywgM3JkIGdlbmVyYXRpb25cbiAgKi9cbiAgU1RPUkFHRTNfRU5IQU5DRURfTkVUV09SSyA9ICdzdG9yYWdlMy1lbmhhbmNlZC1uZXR3b3JrJyxcblxuICAvKipcbiAgICogU3RvcmFnZS1vcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgRDNFTiA9ICdkM2VuJyxcblxuICAvKipcbiAgICogU3RvcmFnZS9jb21wdXRlIGJhbGFuY2VkIGluc3RhbmNlcywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIFNUT1JBR0VfQ09NUFVURV8xID0gJ3N0b3JhZ2UtY29tcHV0ZS0xJyxcblxuICAvKipcbiAgICogU3RvcmFnZS9jb21wdXRlIGJhbGFuY2VkIGluc3RhbmNlcywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIEgxID0gJ2gxJyxcblxuICAvKipcbiAgICogSS9PLW9wdGltaXplZCBpbnN0YW5jZXMsIDNyZCBnZW5lcmF0aW9uXG4gICAqL1xuICBJTzMgPSAnaW8zJyxcblxuICAvKipcbiAgICogSS9PLW9wdGltaXplZCBpbnN0YW5jZXMsIDNyZCBnZW5lcmF0aW9uXG4gICAqL1xuICBJMyA9ICdpMycsXG5cbiAgLyoqXG4gICAqIEkvTy1vcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIElPM19ERU5TRV9OVk1FX0RSSVZFID0gJ2lvMy1kZW5zZS1udm1lLWRyaXZlJyxcblxuICAvKipcbiAgICogSS9PLW9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgSTNFTiA9ICdpM2VuJyxcblxuICAvKipcbiAgICogSS9PLW9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlIHBvd2VyZWQgYnkgSW50ZWwgWGVvbiBTY2FsYWJsZSBwcm9jZXNzb3JzIChjb2RlIG5hbWVkIEljZSBMYWtlKSwgNHRoIGdlbmVyYXRpb25cbiAgICovXG4gIElPNF9JTlRFTCA9ICdpbzRfaW50ZWwnLFxuXG4gIC8qKlxuICAgKiBJL08tb3B0aW1pemVkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUgcG93ZXJlZCBieSBJbnRlbCBYZW9uIFNjYWxhYmxlIHByb2Nlc3NvcnMgKGNvZGUgbmFtZWQgSWNlIExha2UpLCA0dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgSTRJID0gJ2k0aScsXG5cbiAgLyoqXG4gICAqIFN0b3JhZ2Ugb3B0aW1pemVkIGluc3RhbmNlcyBwb3dlcmVkIGJ5IEdyYXZpdG9uMiBwcm9jZXNzb3IsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVE9SQUdFNF9HUkFWSVRPTl9ORVRXT1JLX09QVElNSVpFRCA9ICdzdG9yYWdlNC1ncmF2aXRvbi1uZXR3b3JrLW9wdGltaXplZCcsXG5cbiAgLyoqXG4gICAqIFN0b3JhZ2Ugb3B0aW1pemVkIGluc3RhbmNlcyBwb3dlcmVkIGJ5IEdyYXZpdG9uMiBwcm9jZXNzb3IsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBJTTRHTiA9ICdpbTRnbicsXG5cbiAgLyoqXG4gICAqIFN0b3JhZ2Ugb3B0aW1pemVkIGluc3RhbmNlcyBwb3dlcmVkIGJ5IEdyYXZpdG9uMiBwcm9jZXNzb3IsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVE9SQUdFNF9HUkFWSVRPTl9ORVRXT1JLX1NUT1JBR0VfT1BUSU1JWkVEID0gJ3N0b3JhZ2U0LWdyYXZpdG9uLW5ldHdvcmstc3RvcmFnZS1vcHRpbWl6ZWQnLFxuXG4gIC8qKlxuICAgKiBTdG9yYWdlIG9wdGltaXplZCBpbnN0YW5jZXMgcG93ZXJlZCBieSBHcmF2aXRvbjIgcHJvY2Vzc29yLCA0dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgSVM0R0VOID0gJ2lzNGdlbicsXG5cbiAgLyoqXG4gICAqIEJ1cnN0YWJsZSBpbnN0YW5jZXMsIDJuZCBnZW5lcmF0aW9uXG4gICAqL1xuICBCVVJTVEFCTEUyID0gJ2J1cnN0YWJsZTInLFxuXG4gIC8qKlxuICAgKiBCdXJzdGFibGUgaW5zdGFuY2VzLCAybmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgVDIgPSAndDInLFxuXG4gIC8qKlxuICAgKiBCdXJzdGFibGUgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgQlVSU1RBQkxFMyA9ICdidXJzdGFibGUzJyxcblxuICAvKipcbiAgICogQnVyc3RhYmxlIGluc3RhbmNlcywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIFQzID0gJ3QzJyxcblxuICAvKipcbiAgICogQnVyc3RhYmxlIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIEJVUlNUQUJMRTNfQU1EID0gJ2J1cnN0YWJsZTMtYW1kJyxcblxuICAvKipcbiAgICogQnVyc3RhYmxlIGluc3RhbmNlcyBiYXNlZCBvbiBBTUQgRVBZQywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIFQzQSA9ICd0M2EnLFxuXG4gIC8qKlxuICAgKiBCdXJzdGFibGUgaW5zdGFuY2VzLCA0dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqL1xuICBCVVJTVEFCTEU0X0dSQVZJVE9OID0gJ2J1cnN0YWJsZTQtZ3Jhdml0b24nLFxuXG4gIC8qKlxuICAgKiBCdXJzdGFibGUgaW5zdGFuY2VzLCA0dGggZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzXG4gICAqL1xuICBUNEcgPSAndDRnJyxcblxuICAvKipcbiAgICogTWVtb3J5LWludGVuc2l2ZSBpbnN0YW5jZXMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBNRU1PUllfSU5URU5TSVZFXzEgPSAnbWVtb3J5LWludGVuc2l2ZS0xJyxcblxuICAvKipcbiAgICogTWVtb3J5LWludGVuc2l2ZSBpbnN0YW5jZXMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBYMSA9ICd4MScsXG5cbiAgLyoqXG4gICAqIE1lbW9yeS1pbnRlbnNpdmUgaW5zdGFuY2VzLCBleHRlbmRlZCwgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIE1FTU9SWV9JTlRFTlNJVkVfMV9FWFRFTkRFRCA9ICdtZW1vcnktaW50ZW5zaXZlLTEtZXh0ZW5kZWQnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnktaW50ZW5zaXZlIGluc3RhbmNlcywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIFgxRSA9ICd4MWUnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnktaW50ZW5zaXZlIGluc3RhbmNlcywgMm5kIGdlbmVyYXRpb24gd2l0aCBHcmF2aXRvbjIgcHJvY2Vzc29yc1xuICAgKlxuICAgKiBUaGlzIGluc3RhbmNlIHR5cGUgY2FuIGJlIHVzZWQgb25seSBpbiBSRFMuIEl0IGlzIG5vdCBzdXBwb3J0ZWQgaW4gRUMyLlxuICAgKi9cbiAgTUVNT1JZX0lOVEVOU0lWRV8yX0dSQVZJVE9OMiA9ICdtZW1vcnktaW50ZW5zaXZlLTItZ3Jhdml0b24yJyxcblxuICAvKipcbiAgICogTWVtb3J5LWludGVuc2l2ZSBpbnN0YW5jZXMsIDJuZCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24yIHByb2Nlc3NvcnNcbiAgICpcbiAgICogVGhpcyBpbnN0YW5jZSB0eXBlIGNhbiBiZSB1c2VkIG9ubHkgaW4gUkRTLiBJdCBpcyBub3Qgc3VwcG9ydGVkIGluIEVDMi5cbiAgICovXG4gIFgyRyA9ICd4MmcnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnktaW50ZW5zaXZlIGluc3RhbmNlcywgMm5kIGdlbmVyYXRpb24gd2l0aCBHcmF2aXRvbjIgcHJvY2Vzc29ycyBhbmQgbG9jYWwgTlZNRSBkcml2ZVxuICAgKi9cbiAgTUVNT1JZX0lOVEVOU0lWRV8yX0dSQVZJVE9OMl9OVk1FX0RSSVZFID0gJ21lbW9yeS1pbnRlbnNpdmUtMi1ncmF2aXRvbjItbnZtZS1kcml2ZScsXG5cbiAgLyoqXG4gICAqIE1lbW9yeS1pbnRlbnNpdmUgaW5zdGFuY2VzLCAybmQgZ2VuZXJhdGlvbiB3aXRoIEdyYXZpdG9uMiBwcm9jZXNzb3JzIGFuZCBsb2NhbCBOVk1FIGRyaXZlXG4gICAqL1xuICBYMkdEID0gJ3gyZ2QnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnktaW50ZW5zaXZlIGluc3RhbmNlcyB3aXRoIGhpZ2hlciBuZXR3b3JrIGJhbmR3aXRoLCBsb2NhbCBOVk1FIGRyaXZlLCBhbmQgZXh0ZW5kZWQgbWVtb3J5LiBJbnRlbCBYZW9uIFNjYWxhYmxlIChJY2UgTGFrZSkgcHJvY2Vzc29yc1xuICAgKi9cbiAgTUVNT1JZX0lOVEVOU0lWRV8yX1hUX0lOVEVMID0gJ21lbW9yeV9pbnRlbnNpdmVfMl94dF9pbnRlbCcsXG5cbiAgLyoqXG4gICAqIE1lbW9yeS1pbnRlbnNpdmUgaW5zdGFuY2VzIHdpdGggaGlnaGVyIG5ldHdvcmsgYmFuZHdpdGgsIGxvY2FsIE5WTUUgZHJpdmUsIGFuZCBleHRlbmRlZCBtZW1vcnkuIEludGVsIFhlb24gU2NhbGFibGUgKEljZSBMYWtlKSBwcm9jZXNzb3JzXG4gICAqL1xuICBYMklFRE4gPSAneDJpZWRuJyxcblxuICAvKipcbiAgICogTWVtb3J5LWludGVuc2l2ZSBpbnN0YW5jZXMgd2l0aCBoaWdoZXIgbmV0d29yayBiYW5kd2l0aCBhbmQgbG9jYWwgTlZNRSBkcml2ZSwgSW50ZWwgWGVvbiBTY2FsYWJsZSAoSWNlIExha2UpIHByb2Nlc3NvcnNcbiAgICovXG4gIE1FTU9SWV9JTlRFTlNJVkVfMl9JTlRFTCA9ICdtZW1vcnlfaW50ZW5zaXZlXzJfaW50ZWwnLFxuXG4gIC8qKlxuICAgKiBNZW1vcnktaW50ZW5zaXZlIGluc3RhbmNlcyB3aXRoIGhpZ2hlciBuZXR3b3JrIGJhbmR3aXRoIGFuZCBsb2NhbCBOVk1FIGRyaXZlLCBJbnRlbCBYZW9uIFNjYWxhYmxlIChJY2UgTGFrZSkgcHJvY2Vzc29yc1xuICAgKi9cbiAgWDJJRE4gPSAneDJpZG4nLFxuXG4gIC8qKlxuICAgKiBNZW1vcnktaW50ZW5zaXZlIGluc3RhbmNlcyB3aXRoIGhpZ2hlciBuZXR3b3JrIGJhbmR3aXRoIGFuZCBzaW5nbGUtdGhyZWFkZWQgcGVyZm9ybWFuY2UsIEludGVsIFhlb24gU2NhbGFibGUgKENhc2NhZGUgTGFrZSkgcHJvY2Vzc29yc1xuICAgKi9cbiAgTUVNT1JZX0lOVEVOU0lWRV8yX1hUWl9JTlRFTCA9ICdtZW1vcnlfaW50ZW5zaXZlXzJfeHR6X2ludGVsJyxcblxuICAvKipcbiAgICogTWVtb3J5LWludGVuc2l2ZSBpbnN0YW5jZXMgd2l0aCBoaWdoZXIgbmV0d29yayBiYW5kd2l0aCBhbmQgc2luZ2xlLXRocmVhZGVkIHBlcmZvcm1hbmNlLCBJbnRlbCBYZW9uIFNjYWxhYmxlIChDYXNjYWRlIExha2UpIHByb2Nlc3NvcnNcbiAgICovXG4gIFgySUVaTiA9ICd4Mmllem4nLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZXMgd2l0aCBjdXN0b21pemFibGUgaGFyZHdhcmUgYWNjZWxlcmF0aW9uLCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgRlBHQTEgPSAnZnBnYTEnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZXMgd2l0aCBjdXN0b21pemFibGUgaGFyZHdhcmUgYWNjZWxlcmF0aW9uLCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgRjEgPSAnZjEnLFxuXG4gIC8qKlxuICAgKiBHcmFwaGljcy1vcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgR1JBUEhJQ1MzX1NNQUxMID0gJ2dyYXBoaWNzMy1zbWFsbCcsXG5cbiAgLyoqXG4gICAqIEdyYXBoaWNzLW9wdGltaXplZCBpbnN0YW5jZXMsIDNyZCBnZW5lcmF0aW9uXG4gICAqL1xuICBHM1MgPSAnZzNzJyxcblxuICAvKipcbiAgICogR3JhcGhpY3Mtb3B0aW1pemVkIGluc3RhbmNlcywgM3JkIGdlbmVyYXRpb25cbiAgICovXG4gIEdSQVBISUNTMyA9ICdncmFwaGljczMnLFxuXG4gIC8qKlxuICAgKiBHcmFwaGljcy1vcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgRzMgPSAnZzMnLFxuXG4gIC8qKlxuICAgKiBHcmFwaGljcy1vcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggTlZNRSBkcml2ZSBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBHUkFQSElDUzRfTlZNRV9EUklWRV9ISUdIX1BFUkZPUk1BTkNFID0gJ2dyYXBoaWNzNC1udm1lLWRyaXZlLWhpZ2gtcGVyZm9ybWFuY2UnLFxuXG4gIC8qKlxuICAgKiBHcmFwaGljcy1vcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggTlZNRSBkcml2ZSBmb3IgaGlnaCBwZXJmb3JtYW5jZSBjb21wdXRpbmcsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBHNEROID0gJ2c0ZG4nLFxuXG4gIC8qKlxuICAgKiBHcmFwaGljcy1vcHRpbWl6ZWQgaW5zdGFuY2VzIGJhc2VkIG9uIEFNRCBFUFlDIEFuZCBSYWRlb24gUHJvIEdQVSAoTkFWSSkgd2l0aCBsb2NhbCBOVk1FIGRyaXZlLCA0dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgR1JBUEhJQ1M0X0FNRF9OVk1FX0RSSVZFID0gJ2dyYXBoaWNzNC1hbWQtbnZtZS1kcml2ZScsXG5cbiAgLyoqXG4gICAqIEdyYXBoaWNzLW9wdGltaXplZCBpbnN0YW5jZXMgYmFzZWQgb24gQU1EIEVQWUMgQW5kIFJhZGVvbiBQcm8gR1BVIChOQVZJKSB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBHNEFEID0gJ2c0YWQnLFxuXG4gIC8qKlxuICAgKiBHcmFwaGljcy1vcHRpbWl6ZWQgaW5zdGFuY2VzLCA1dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgR1JBUEhJQ1M1ID0gJ2dyYXBoaWNzNScsXG5cbiAgLyoqXG4gICAqIEdyYXBoaWNzLW9wdGltaXplZCBpbnN0YW5jZXMsIDV0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBHNSA9ICdnNScsXG5cbiAgLyoqXG4gICAqIEdyYXBoaWNzLW9wdGltaXplZCBpbnN0YW5jZXMgcG93ZXJlZCBieSBBV1MgR3Jhdml0b24yIFByb2Nlc3NvcnMgYW5kIE5WSURJQSBUNEcgVGVuc29yIENvcmUgR1BVcywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIEdSQVBISUNTNV9HUkFWSVRPTjIgPSAnZ3JhcGhpY3M1LWdyYXZpdG9uMicsXG5cbiAgLyoqXG4gICAqIEdyYXBoaWNzLW9wdGltaXplZCBpbnN0YW5jZXMgcG93ZXJlZCBieSBBV1MgR3Jhdml0b24yIFByb2Nlc3NvcnMgYW5kIE5WSURJQSBUNEcgVGVuc29yIENvcmUgR1BVcywgNXRoIGdlbmVyYXRpb25cbiAgICovXG4gIEc1RyA9ICdnNWcnLFxuXG4gIC8qKlxuICAgKiBQYXJhbGxlbC1wcm9jZXNzaW5nIG9wdGltaXplZCBpbnN0YW5jZXMsIDJuZCBnZW5lcmF0aW9uXG4gICAqL1xuICBQQVJBTExFTDIgPSAncGFyYWxsZWwyJyxcblxuICAvKipcbiAgICogUGFyYWxsZWwtcHJvY2Vzc2luZyBvcHRpbWl6ZWQgaW5zdGFuY2VzLCAybmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgUDIgPSAncDInLFxuXG4gIC8qKlxuICAgKiBQYXJhbGxlbC1wcm9jZXNzaW5nIG9wdGltaXplZCBpbnN0YW5jZXMsIDNuZCBnZW5lcmF0aW9uXG4gICAqL1xuICBQQVJBTExFTDMgPSAncGFyYWxsZWwzJyxcblxuICAvKipcbiAgICogUGFyYWxsZWwtcHJvY2Vzc2luZyBvcHRpbWl6ZWQgaW5zdGFuY2VzLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgUDMgPSAncDMnLFxuXG4gIC8qKlxuICAgKiBQYXJhbGxlbC1wcm9jZXNzaW5nIG9wdGltaXplZCBpbnN0YW5jZXMgd2l0aCBsb2NhbCBOVk1FIGRyaXZlIGZvciBoaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZywgM25kIGdlbmVyYXRpb25cbiAgICovXG4gIFBBUkFMTEVMM19OVk1FX0RSSVZFX0hJR0hfUEVSRk9STUFOQ0UgPSAncGFyYWxsZWwzLW52bWUtZHJpdmUtaGlnaC1wZXJmb3JtYW5jZScsXG5cbiAgLyoqXG4gICAqIFBhcmFsbGVsLXByb2Nlc3Npbmcgb3B0aW1pemVkIGluc3RhbmNlcyB3aXRoIGxvY2FsIE5WTUUgZHJpdmUgZm9yIGhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nLCAzcmQgZ2VuZXJhdGlvblxuICAgKi9cbiAgUDNETiA9ICdwM2RuJyxcblxuICAvKipcbiAgICogUGFyYWxsZWwtcHJvY2Vzc2luZyBvcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgZXh0ZW5kZWQsIDR0aCBnZW5lcmF0aW9uIChpbiBkZXZlbG9wZXIgcHJldmlldylcbiAgICovXG4gIFBBUkFMTEVMNF9OVk1FX0RSSVZFX0VYVEVOREVEID0gJ3BhcmFsbGVsNC1udm1lLWRyaXZlLWV4dGVuZGVkJyxcblxuICAvKipcbiAgICogUGFyYWxsZWwtcHJvY2Vzc2luZyBvcHRpbWl6ZWQgaW5zdGFuY2VzIHdpdGggbG9jYWwgTlZNRSBkcml2ZSwgZXh0ZW5kZWQsIDR0aCBnZW5lcmF0aW9uIChpbiBkZXZlbG9wZXIgcHJldmlldylcbiAgICovXG4gIFA0REUgPSAncDRkZScsXG5cbiAgLyoqXG4gICAqIFBhcmFsbGVsLXByb2Nlc3Npbmcgb3B0aW1pemVkIGluc3RhbmNlcywgNHRoIGdlbmVyYXRpb25cbiAgICovXG4gIFBBUkFMTEVMNCA9ICdwYXJhbGxlbDQnLFxuXG4gIC8qKlxuICAgKiBQYXJhbGxlbC1wcm9jZXNzaW5nIG9wdGltaXplZCBpbnN0YW5jZXMsIDR0aCBnZW5lcmF0aW9uXG4gICAqL1xuICBQNEQgPSAncDRkJyxcblxuICAvKipcbiAgICogQXJtIHByb2Nlc3NvciBiYXNlZCBpbnN0YW5jZXMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBBUk0xID0gJ2FybTEnLFxuXG4gIC8qKlxuICAgKiBBcm0gcHJvY2Vzc29yIGJhc2VkIGluc3RhbmNlcywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIEExID0gJ2ExJyxcblxuICAvKipcbiAgICogQXJtIHByb2Nlc3NvciBiYXNlZCBpbnN0YW5jZXMsIDJuZCBnZW5lcmF0aW9uXG4gICAqL1xuICBTVEFOREFSRDZfR1JBVklUT04gPSAnc3RhbmRhcmQ2LWdyYXZpdG9uJyxcblxuICAvKipcbiAgICogQXJtIHByb2Nlc3NvciBiYXNlZCBpbnN0YW5jZXMsIDJuZCBnZW5lcmF0aW9uXG4gICAqL1xuICBNNkcgPSAnbTZnJyxcblxuICAvKipcbiAgICogU3RhbmRhcmQgaW5zdGFuY2VzIGJhc2VkIG9uIEludGVsIChJY2UgTGFrZSksIDZ0aCBnZW5lcmF0aW9uLlxuICAgKi9cbiAgU1RBTkRBUkQ2X0lOVEVMID0gJ3N0YW5kYXJkNi1pbnRlbCcsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcyBiYXNlZCBvbiBJbnRlbCAoSWNlIExha2UpLCA2dGggZ2VuZXJhdGlvbi5cbiAgICovXG4gIE02SSA9ICdtNmknLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMgYmFzZWQgb24gSW50ZWwgKEljZSBMYWtlKSB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDZ0aCBnZW5lcmF0aW9uLlxuICAgKi9cbiAgU1RBTkRBUkQ2X0lOVEVMX05WTUVfRFJJVkUgPSAnc3RhbmRhcmQ2LWludGVsLW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMgYmFzZWQgb24gSW50ZWwgKEljZSBMYWtlKSB3aXRoIGxvY2FsIE5WTUUgZHJpdmUsIDZ0aCBnZW5lcmF0aW9uLlxuICAgKi9cbiAgTTZJRCA9ICdtNmlkJyxcblxuICAvKipcbiAgICogU3RhbmRhcmQgaW5zdGFuY2VzIGJhc2VkIG9uIDNyZCBHZW4gQU1EIEVQWUMgcHJvY2Vzc29ycywgNnRoIGdlbmVyYXRpb24uXG4gICAqL1xuICBTVEFOREFSRDZfQU1EID0gJ3N0YW5kYXJkNi1hbWQnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMgYmFzZWQgb24gM3JkIEdlbiBBTUQgRVBZQyBwcm9jZXNzb3JzLCA2dGggZ2VuZXJhdGlvbi5cbiAgICovXG4gIE02QSA9ICdtNmEnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMsIDZ0aCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24yIHByb2Nlc3NvcnMgYW5kIGxvY2FsIE5WTUUgZHJpdmVcbiAgICovXG4gIFNUQU5EQVJENl9HUkFWSVRPTjJfTlZNRV9EUklWRSA9ICdzdGFuZGFyZDYtZ3Jhdml0b24yLW52bWUtZHJpdmUnLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMsIDZ0aCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24yIHByb2Nlc3NvcnMgYW5kIGxvY2FsIE5WTUUgZHJpdmVcbiAgICovXG4gIE02R0QgPSAnbTZnZCcsXG5cbiAgLyoqXG4gICAqIFN0YW5kYXJkIGluc3RhbmNlcywgN3RoIGdlbmVyYXRpb24gd2l0aCBHcmF2aXRvbjMgcHJvY2Vzc29yc1xuICAgKlxuICAgKiBUaGlzIGluc3RhbmNlIGNsYXNzIGlzIGN1cnJlbnRseSBvbmx5IGF2YWlsYWJsZSBpbiBVUyBFYXN0IChPaGlvKSwgVVMgRWFzdCAoTi4gVmlyZ2luaWEpLCBVUyBXZXN0IChPcmVnb24pLCBhbmQgRXVyb3BlIChJcmVsYW5kKS5cbiAgICovXG4gIFNUQU5EQVJEN19HUkFWSVRPTiA9ICdzdGFuZGFyZDctZ3Jhdml0b24nLFxuXG4gIC8qKlxuICAgKiBTdGFuZGFyZCBpbnN0YW5jZXMsIDd0aCBnZW5lcmF0aW9uIHdpdGggR3Jhdml0b24zIHByb2Nlc3NvcnNcbiAgICpcbiAgICogVGhpcyBpbnN0YW5jZSBjbGFzcyBpcyBjdXJyZW50bHkgb25seSBhdmFpbGFibGUgaW4gVVMgRWFzdCAoT2hpbyksIFVTIEVhc3QgKE4uIFZpcmdpbmlhKSwgVVMgV2VzdCAoT3JlZ29uKSwgYW5kIEV1cm9wZSAoSXJlbGFuZCkuXG4gICAqL1xuICBNN0cgPSAnbTdnJyxcblxuICAvKipcbiAgICogSGlnaCBtZW1vcnkgYW5kIGNvbXB1dGUgY2FwYWNpdHkgaW5zdGFuY2VzLCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgSElHSF9DT01QVVRFX01FTU9SWTEgPSAnaGlnaC1jb21wdXRlLW1lbW9yeTEnLFxuXG4gIC8qKlxuICAgKiBIaWdoIG1lbW9yeSBhbmQgY29tcHV0ZSBjYXBhY2l0eSBpbnN0YW5jZXMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBaMUQgPSAnejFkJyxcblxuICAvKipcbiAgICogSW5mZXJlbnRpYSBDaGlwcyBiYXNlZCBpbnN0YW5jZXMgZm9yIG1hY2hpbmUgbGVhcm5pbmcgaW5mZXJlbmNlIGFwcGxpY2F0aW9ucywgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIElORkVSRU5DRTEgPSAnaW5mZXJlbmNlMScsXG5cbiAgLyoqXG4gICAqIEluZmVyZW50aWEgQ2hpcHMgYmFzZWQgaW5zdGFuY2VzIGZvciBtYWNoaW5lIGxlYXJuaW5nIGluZmVyZW5jZSBhcHBsaWNhdGlvbnMsIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBJTkYxID0gJ2luZjEnLFxuXG4gIC8qKlxuICAgKiBNYWNpbnRvc2ggaW5zdGFuY2VzIGJ1aWx0IG9uIEFwcGxlIE1hYyBtaW5pIGNvbXB1dGVycywgMXN0IGdlbmVyYXRpb24gd2l0aCBJbnRlbCBwcm9jZXNvcnNcbiAgICovXG4gIE1BQ0lOVE9TSDFfSU5URUwgPSAnbWFjaW50b3NoMS1pbnRlbCcsXG5cbiAgLyoqXG4gICAqIE1hY2ludG9zaCBpbnN0YW5jZXMgYnVpbHQgb24gQXBwbGUgTWFjIG1pbmkgY29tcHV0ZXJzLCAxc3QgZ2VuZXJhdGlvbiB3aXRoIEludGVsIHByb2Nlc29yc1xuICAgKi9cbiAgTUFDMSA9ICdtYWMxJyxcblxuICAvKipcbiAgICogTXVsdGktc3RyZWFtIHZpZGVvIHRyYW5zY29kaW5nIGluc3RhbmNlcyBmb3IgcmVzb2x1dGlvbnMgdXAgdG8gNEsgVUhELCAxc3QgZ2VuZXJhdGlvblxuICAgKi9cbiAgVklERU9fVFJBTlNDT0RJTkcxID0gJ3ZpZGVvLXRyYW5zY29kaW5nMScsXG5cbiAgLyoqXG4gICAqIE11bHRpLXN0cmVhbSB2aWRlbyB0cmFuc2NvZGluZyBpbnN0YW5jZXMgZm9yIHJlc29sdXRpb25zIHVwIHRvIDRLIFVIRCwgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIFZUMSA9ICd2dDEnLFxuXG4gIC8qKlxuICAgKiBIaWdoIHBlcmZvcm1hbmNlIGNvbXB1dGluZyBiYXNlZCBvbiBBTUQgRVBZQywgNnRoIGdlbmVyYXRpb25cbiAgICovXG4gIEhJR0hfUEVSRk9STUFOQ0VfQ09NUFVUSU5HNl9BTUQgPSAnaGlnaC1wZXJmb3JtYW5jZS1jb21wdXRpbmc2LWFtZCcsXG5cbiAgLyoqXG4gICAqIEhpZ2ggcGVyZm9ybWFuY2UgY29tcHV0aW5nIGJhc2VkIG9uIEFNRCBFUFlDLCA2dGggZ2VuZXJhdGlvblxuICAgKi9cbiAgSFBDNkEgPSAnaHBjNmEnLFxuXG4gIC8qKlxuICAgKiBEZWVwIGxlYXJuaW5nIGluc3RhbmNlcyBwb3dlcmVkIGJ5IEdhdWRpIGFjY2VsZXJhdG9ycyBmcm9tIEhhYmFuYSBMYWJzIChhbiBJbnRlbCBjb21wYW55KSwgMXN0IGdlbmVyYXRpb25cbiAgICovXG4gIERFRVBfTEVBUk5JTkcxID0gJ2RlZXAtbGVhcm5pbmcxJyxcblxuICAvKipcbiAgICogRGVlcCBsZWFybmluZyBpbnN0YW5jZXMgcG93ZXJlZCBieSBHYXVkaSBhY2NlbGVyYXRvcnMgZnJvbSBIYWJhbmEgTGFicyAoYW4gSW50ZWwgY29tcGFueSksIDFzdCBnZW5lcmF0aW9uXG4gICAqL1xuICBETDEgPSAnZGwxJyxcbn1cblxuLyoqXG4gKiBJZGVudGlmaWVzIGFuIGluc3RhbmNlJ3MgQ1BVIGFyY2hpdGVjdHVyZVxuICovXG5leHBvcnQgZW51bSBJbnN0YW5jZUFyY2hpdGVjdHVyZSB7XG4gIC8qKlxuICAgKiBBUk02NCBhcmNoaXRlY3R1cmVcbiAgICovXG4gIEFSTV82NCA9ICdhcm02NCcsXG5cbiAgLyoqXG4gICAqIHg4Ni02NCBhcmNoaXRlY3R1cmVcbiAgICovXG4gIFg4Nl82NCA9ICd4ODZfNjQnLFxufVxuXG4vKipcbiAqIFdoYXQgc2l6ZSBvZiBpbnN0YW5jZSB0byB1c2VcbiAqL1xuZXhwb3J0IGVudW0gSW5zdGFuY2VTaXplIHtcbiAgLyoqXG4gICAqIEluc3RhbmNlIHNpemUgTkFOTyAobmFubylcbiAgICovXG4gIE5BTk8gPSAnbmFubycsXG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIHNpemUgTUlDUk8gKG1pY3JvKVxuICAgKi9cbiAgTUlDUk8gPSAnbWljcm8nLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFNNQUxMIChzbWFsbClcbiAgICovXG4gIFNNQUxMID0gJ3NtYWxsJyxcblxuICAvKipcbiAgICogSW5zdGFuY2Ugc2l6ZSBNRURJVU0gKG1lZGl1bSlcbiAgICovXG4gIE1FRElVTSA9ICdtZWRpdW0nLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIExBUkdFIChsYXJnZSlcbiAgICovXG4gIExBUkdFID0gJ2xhcmdlJyxcblxuICAvKipcbiAgICogSW5zdGFuY2Ugc2l6ZSBYTEFSR0UgKHhsYXJnZSlcbiAgICovXG4gIFhMQVJHRSA9ICd4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTIgKDJ4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0UyID0gJzJ4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTMgKDN4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0UzID0gJzN4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTQgKDR4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0U0ID0gJzR4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTYgKDZ4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0U2ID0gJzZ4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTggKDh4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0U4ID0gJzh4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTkgKDl4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0U5ID0gJzl4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTEwICgxMHhsYXJnZSlcbiAgICovXG4gIFhMQVJHRTEwID0gJzEweGxhcmdlJyxcblxuICAvKipcbiAgICogSW5zdGFuY2Ugc2l6ZSBYTEFSR0UxMiAoMTJ4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0UxMiA9ICcxMnhsYXJnZScsXG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIHNpemUgWExBUkdFMTYgKDE2eGxhcmdlKVxuICAgKi9cbiAgWExBUkdFMTYgPSAnMTZ4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTE4ICgxOHhsYXJnZSlcbiAgICovXG4gIFhMQVJHRTE4ID0gJzE4eGxhcmdlJyxcblxuICAvKipcbiAgICogSW5zdGFuY2Ugc2l6ZSBYTEFSR0UyNCAoMjR4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0UyNCA9ICcyNHhsYXJnZScsXG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIHNpemUgWExBUkdFMzIgKDMyeGxhcmdlKVxuICAgKi9cbiAgWExBUkdFMzIgPSAnMzJ4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIFhMQVJHRTQ4ICg0OHhsYXJnZSlcbiAgICovXG4gIFhMQVJHRTQ4ID0gJzQ4eGxhcmdlJyxcblxuICAvKipcbiAgICogSW5zdGFuY2Ugc2l6ZSBYTEFSR0U1NiAoNTZ4bGFyZ2UpXG4gICAqL1xuICBYTEFSR0U1NiA9ICc1NnhsYXJnZScsXG5cbiAgLyoqXG4gICAqIEluc3RhbmNlIHNpemUgWExBUkdFNTYgKDExMnhsYXJnZSlcbiAgICovXG4gIFhMQVJHRTExMiA9ICcxMTJ4bGFyZ2UnLFxuXG4gIC8qKlxuICAgKiBJbnN0YW5jZSBzaXplIE1FVEFMIChtZXRhbClcbiAgICovXG4gIE1FVEFMID0gJ21ldGFsJyxcbn1cblxuLyoqXG4gKiBJbnN0YW5jZSB0eXBlIGZvciBFQzIgaW5zdGFuY2VzXG4gKlxuICogVGhpcyBjbGFzcyB0YWtlcyBhIGxpdGVyYWwgc3RyaW5nLCBnb29kIGlmIHlvdSBhbHJlYWR5XG4gKiBrbm93IHRoZSBpZGVudGlmaWVyIG9mIHRoZSB0eXBlIHlvdSB3YW50LlxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VUeXBlIHtcbiAgLyoqXG4gICAqIEluc3RhbmNlIHR5cGUgZm9yIEVDMiBpbnN0YW5jZXNcbiAgICpcbiAgICogVGhpcyBjbGFzcyB0YWtlcyBhIGNvbWJpbmF0aW9uIG9mIGEgY2xhc3MgYW5kIHNpemUuXG4gICAqXG4gICAqIEJlIGF3YXJlIHRoYXQgbm90IGFsbCBjb21iaW5hdGlvbnMgb2YgY2xhc3MgYW5kIHNpemUgYXJlIGF2YWlsYWJsZSwgYW5kIG5vdCBhbGxcbiAgICogY2xhc3NlcyBhcmUgYXZhaWxhYmxlIGluIGFsbCByZWdpb25zLlxuICAgKi9cbiAgcHVibGljIHN0YXRpYyBvZihpbnN0YW5jZUNsYXNzOiBJbnN0YW5jZUNsYXNzLCBpbnN0YW5jZVNpemU6IEluc3RhbmNlU2l6ZSkge1xuICAgIC8vIEpTSUkgZG9lcyBub3QgYWxsb3cgZW51bSB0eXBlcyB0byBoYXZlIHNhbWUgdmFsdWUuIFNvIHRvIHN1cHBvcnQgdGhlIGVudW0sIHRoZSBlbnVtIHdpdGggc2FtZSB2YWx1ZSBoYXMgdG8gYmUgbWFwcGVkIGxhdGVyLlxuICAgIGNvbnN0IGluc3RhbmNlQ2xhc3NNYXA6IFJlY29yZDxJbnN0YW5jZUNsYXNzLCBzdHJpbmc+ID0ge1xuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQzXTogJ20zJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk0zXTogJ20zJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlNUQU5EQVJENF06ICdtNCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NNF06ICdtNCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5TVEFOREFSRDVdOiAnbTUnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTTVdOiAnbTUnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ1X05WTUVfRFJJVkVdOiAnbTVkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk01RF06ICdtNWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ1X0FNRF06ICdtNWEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTTVBXTogJ201YScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5TVEFOREFSRDVfQU1EX05WTUVfRFJJVkVdOiAnbTVhZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NNUFEXTogJ201YWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ1X0hJR0hfUEVSRk9STUFOQ0VdOiAnbTVuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk01Tl06ICdtNW4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ1X05WTUVfRFJJVkVfSElHSF9QRVJGT1JNQU5DRV06ICdtNWRuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk01RE5dOiAnbTVkbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5TVEFOREFSRDVfSElHSF9DT01QVVRFXTogJ201em4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTTVaTl06ICdtNXpuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWTNdOiAncjMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUjNdOiAncjMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZNF06ICdyNCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5SNF06ICdyNCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NRU1PUlk1XTogJ3I1JyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI1XTogJ3I1JyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWTZfQU1EXTogJ3I2YScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5SNkFdOiAncjZhJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWTZfSU5URUxdOiAncjZpJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI2SV06ICdyNmknLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZNl9JTlRFTF9OVk1FX0RSSVZFXTogJ3I2aWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUjZJRF06ICdyNmlkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWTVfSElHSF9QRVJGT1JNQU5DRV06ICdyNW4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUjVOXTogJ3I1bicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NRU1PUlk1X05WTUVfRFJJVkVdOiAncjVkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI1RF06ICdyNWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZNV9OVk1FX0RSSVZFX0hJR0hfUEVSRk9STUFOQ0VdOiAncjVkbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5SNUROXTogJ3I1ZG4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZNV9BTURdOiAncjVhJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI1QV06ICdyNWEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZNV9BTURfTlZNRV9EUklWRV06ICdyNWFkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI1QURdOiAncjVhZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5ISUdIX01FTU9SWV8zVEJfMV06ICd1LTN0YjEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuVV8zVEIxXTogJ3UtM3RiMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5ISUdIX01FTU9SWV82VEJfMV06ICd1LTZ0YjEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuVV82VEIxXTogJ3UtNnRiMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5ISUdIX01FTU9SWV85VEJfMV06ICd1LTl0YjEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuVV85VEIxXTogJ3UtOXRiMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5ISUdIX01FTU9SWV8xMlRCXzFdOiAndS0xMnRiMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5VXzEyVEIxXTogJ3UtMTJ0YjEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuSElHSF9NRU1PUllfMThUQl8xXTogJ3UtMTh0YjEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuVV8xOFRCMV06ICd1LTE4dGIxJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkhJR0hfTUVNT1JZXzI0VEJfMV06ICd1LTI0dGIxJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlVfMjRUQjFdOiAndS0yNHRiMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NRU1PUlk1X0VCU19PUFRJTUlaRURdOiAncjViJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI1Ql06ICdyNWInLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZNl9HUkFWSVRPTl06ICdyNmcnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUjZHXTogJ3I2ZycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NRU1PUlk2X0dSQVZJVE9OMl9OVk1FX0RSSVZFXTogJ3I2Z2QnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUjZHRF06ICdyNmdkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWTdfR1JBVklUT05dOiAncjdnJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlI3R106ICdyN2cnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTNdOiAnYzMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzNdOiAnYzMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTRdOiAnYzQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzRdOiAnYzQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTVdOiAnYzUnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzVdOiAnYzUnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTVfTlZNRV9EUklWRV06ICdjNWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzVEXTogJ2M1ZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DT01QVVRFNV9BTURdOiAnYzVhJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkM1QV06ICdjNWEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTVfQU1EX05WTUVfRFJJVkVdOiAnYzVhZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DNUFEXTogJ2M1YWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTVfSElHSF9QRVJGT1JNQU5DRV06ICdjNW4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzVOXTogJ2M1bicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DT01QVVRFNl9JTlRFTF06ICdjNmknLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzZJXTogJ2M2aScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DT01QVVRFNl9JTlRFTF9ISUdIX1BFUkZPUk1BTkNFXTogJ2M2aW4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzZJTl06ICdjNmluJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkNPTVBVVEU2X0lOVEVMX05WTUVfRFJJVkVdOiAnYzZpZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DNklEXTogJ2M2aWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQ09NUFVURTZfQU1EXTogJ2M2YScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DNkFdOiAnYzZhJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkNPTVBVVEU2X0dSQVZJVE9OMl06ICdjNmcnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQzZHXTogJ2M2ZycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DT01QVVRFNl9HUkFWSVRPTjJfTlZNRV9EUklWRV06ICdjNmdkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkM2R0RdOiAnYzZnZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DT01QVVRFNl9HUkFWSVRPTjJfSElHSF9ORVRXT1JLX0JBTkRXSURUSF06ICdjNmduJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkM2R05dOiAnYzZnbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5DT01QVVRFN19HUkFWSVRPTjNdOiAnYzdnJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkM3R106ICdjN2cnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RPUkFHRTJdOiAnZDInLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuRDJdOiAnZDInLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RPUkFHRTNdOiAnZDMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuRDNdOiAnZDMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RPUkFHRTNfRU5IQU5DRURfTkVUV09SS106ICdkM2VuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkQzRU5dOiAnZDNlbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5TVE9SQUdFX0NPTVBVVEVfMV06ICdoMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5IMV06ICdoMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5JTzNdOiAnaTMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuSTNdOiAnaTMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuSU8zX0RFTlNFX05WTUVfRFJJVkVdOiAnaTNlbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5JM0VOXTogJ2kzZW4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RPUkFHRTRfR1JBVklUT05fTkVUV09SS19PUFRJTUlaRURdOiAnaW00Z24nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuSU00R05dOiAnaW00Z24nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RPUkFHRTRfR1JBVklUT05fTkVUV09SS19TVE9SQUdFX09QVElNSVpFRF06ICdpczRnZW4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuSVM0R0VOXTogJ2lzNGdlbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5CVVJTVEFCTEUyXTogJ3QyJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlQyXTogJ3QyJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkJVUlNUQUJMRTNdOiAndDMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuVDNdOiAndDMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQlVSU1RBQkxFM19BTURdOiAndDNhJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlQzQV06ICd0M2EnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuQlVSU1RBQkxFNF9HUkFWSVRPTl06ICd0NGcnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuVDRHXTogJ3Q0ZycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NRU1PUllfSU5URU5TSVZFXzFdOiAneDEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuWDFdOiAneDEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZX0lOVEVOU0lWRV8xX0VYVEVOREVEXTogJ3gxZScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5YMUVdOiAneDFlJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWV9JTlRFTlNJVkVfMl9HUkFWSVRPTjJdOiAneDJnJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlgyR106ICd4MmcnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUVNT1JZX0lOVEVOU0lWRV8yX0dSQVZJVE9OMl9OVk1FX0RSSVZFXTogJ3gyZ2QnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuWDJHRF06ICd4MmdkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkZQR0ExXTogJ2YxJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkYxXTogJ2YxJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkdSQVBISUNTM19TTUFMTF06ICdnM3MnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuRzNTXTogJ2czcycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5HUkFQSElDUzNdOiAnZzMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuRzNdOiAnZzMnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuR1JBUEhJQ1M0X05WTUVfRFJJVkVfSElHSF9QRVJGT1JNQU5DRV06ICdnNGRuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkc0RE5dOiAnZzRkbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5HUkFQSElDUzRfQU1EX05WTUVfRFJJVkVdOiAnZzRhZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5HNEFEXTogJ2c0YWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuR1JBUEhJQ1M1XTogJ2c1JyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkc1XTogJ2c1JyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkdSQVBISUNTNV9HUkFWSVRPTjJdOiAnZzVnJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkc1R106ICdnNWcnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUEFSQUxMRUwyXTogJ3AyJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlAyXTogJ3AyJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlBBUkFMTEVMM106ICdwMycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5QM106ICdwMycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5QQVJBTExFTDNfTlZNRV9EUklWRV9ISUdIX1BFUkZPUk1BTkNFXTogJ3AzZG4nLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUDNETl06ICdwM2RuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlBBUkFMTEVMNF9OVk1FX0RSSVZFX0VYVEVOREVEXTogJ3A0ZGUnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUDRERV06ICdwNGRlJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlBBUkFMTEVMNF06ICdwNGQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuUDREXTogJ3A0ZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5BUk0xXTogJ2ExJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkExXTogJ2ExJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlNUQU5EQVJENl9HUkFWSVRPTl06ICdtNmcnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTTZHXTogJ202ZycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5TVEFOREFSRDZfSU5URUxdOiAnbTZpJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk02SV06ICdtNmknLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ2X0lOVEVMX05WTUVfRFJJVkVdOiAnbTZpZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NNklEXTogJ202aWQnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ2X0FNRF06ICdtNmEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTTZBXTogJ202YScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5TVEFOREFSRDZfR1JBVklUT04yX05WTUVfRFJJVkVdOiAnbTZnZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NNkdEXTogJ202Z2QnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuU1RBTkRBUkQ3X0dSQVZJVE9OXTogJ203ZycsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NN0ddOiAnbTdnJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkhJR0hfQ09NUFVURV9NRU1PUlkxXTogJ3oxZCcsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5aMURdOiAnejFkJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLklORkVSRU5DRTFdOiAnaW5mMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5JTkYxXTogJ2luZjEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuTUFDSU5UT1NIMV9JTlRFTF06ICdtYWMxJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1BQzFdOiAnbWFjMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5WSURFT19UUkFOU0NPRElORzFdOiAndnQxJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlZUMV06ICd2dDEnLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuSElHSF9QRVJGT1JNQU5DRV9DT01QVVRJTkc2X0FNRF06ICdocGM2YScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5IUEM2QV06ICdocGM2YScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5JNEldOiAnaTRpJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLklPNF9JTlRFTF06ICdpNGknLFxuICAgICAgW0luc3RhbmNlQ2xhc3MuWDJJRUROXTogJ3gyaWVkbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5NRU1PUllfSU5URU5TSVZFXzJfWFRfSU5URUxdOiAneDJpZWRuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLlgySUROXTogJ3gyaWRuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWV9JTlRFTlNJVkVfMl9JTlRFTF06ICd4MmlkbicsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5YMklFWk5dOiAneDJpZXpuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLk1FTU9SWV9JTlRFTlNJVkVfMl9YVFpfSU5URUxdOiAneDJpZXpuJyxcbiAgICAgIFtJbnN0YW5jZUNsYXNzLkRFRVBfTEVBUk5JTkcxXTogJ2RsMScsXG4gICAgICBbSW5zdGFuY2VDbGFzcy5ETDFdOiAnZGwxJyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgSW5zdGFuY2VUeXBlKGAke2luc3RhbmNlQ2xhc3NNYXBbaW5zdGFuY2VDbGFzc10gPz8gaW5zdGFuY2VDbGFzc30uJHtpbnN0YW5jZVNpemV9YCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGluc3RhbmNlVHlwZUlkZW50aWZpZXI6IHN0cmluZykge1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgaW5zdGFuY2UgdHlwZSBhcyBhIGRvdHRlZCBzdHJpbmdcbiAgICovXG4gIHB1YmxpYyB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmluc3RhbmNlVHlwZUlkZW50aWZpZXI7XG4gIH1cblxuICAvKipcbiAgICogVGhlIGluc3RhbmNlJ3MgQ1BVIGFyY2hpdGVjdHVyZVxuICAgKi9cbiAgcHVibGljIGdldCBhcmNoaXRlY3R1cmUoKTogSW5zdGFuY2VBcmNoaXRlY3R1cmUge1xuICAgIC8vIGNhcHR1cmUgdGhlIGZhbWlseSwgZ2VuZXJhdGlvbiwgY2FwYWJpbGl0aWVzLCBhbmQgc2l6ZSBwb3J0aW9ucyBvZiB0aGUgaW5zdGFuY2UgdHlwZSBpZFxuICAgIGNvbnN0IGluc3RhbmNlVHlwZUNvbXBvbmVudHMgPSB0aGlzLmluc3RhbmNlVHlwZUlkZW50aWZpZXIubWF0Y2goL14oW2Etel0rKShcXGR7MSwyfSkoW2Etel0qKVxcLihbYS16MC05XSspJC8pO1xuICAgIGlmIChpbnN0YW5jZVR5cGVDb21wb25lbnRzID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWFsZm9ybWVkIGluc3RhbmNlIHR5cGUgaWRlbnRpZmllcicpO1xuICAgIH1cblxuICAgIGNvbnN0IGZhbWlseSA9IGluc3RhbmNlVHlwZUNvbXBvbmVudHNbMV07XG4gICAgY29uc3QgY2FwYWJpbGl0aWVzID0gaW5zdGFuY2VUeXBlQ29tcG9uZW50c1szXTtcblxuICAgIC8vIEluc3RhbmNlIGZhbWlseSBgYWAgYXJlIGZpcnN0LWdlbiBHcmF2aXRvbiBpbnN0YW5jZXNcbiAgICAvLyBDYXBhYmlsaXR5IGBnYCBpbmRpY2F0ZXMgdGhlIGluc3RhbmNlIGlzIEdyYXZpdG9uMiBwb3dlcmVkXG4gICAgaWYgKGZhbWlseSA9PT0gJ2EnIHx8IGNhcGFiaWxpdGllcy5pbmNsdWRlcygnZycpKSB7XG4gICAgICByZXR1cm4gSW5zdGFuY2VBcmNoaXRlY3R1cmUuQVJNXzY0O1xuICAgIH1cblxuICAgIHJldHVybiBJbnN0YW5jZUFyY2hpdGVjdHVyZS5YODZfNjQ7XG4gIH1cbn1cbiJdfQ==