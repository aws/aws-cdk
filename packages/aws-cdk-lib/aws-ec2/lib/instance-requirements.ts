import type { Size } from '../../core';

/**
 * Hardware accelerator categories available for EC2 instances.
 *
 * Defines the general type of hardware accelerator that can be attached
 * to an instance, typically used in instance requirement specifications
 * (e.g., GPUs for compute-intensive tasks, FPGAs for custom logic, or
 * inference chips for ML workloads).
 */
export enum AcceleratorType {
  /**
   * Graphics Processing Unit accelerators, such as NVIDIA GPUs.
   * Commonly used for machine learning training, graphics rendering,
   * or high-performance parallel computing.
   */
  GPU = 'gpu',

  /**
   * Field Programmable Gate Array accelerators, such as Xilinx FPGAs.
   * Used for hardware-level customization and specialized workloads.
   */
  FPGA = 'fpga',

  /**
   * Inference accelerators, such as AWS Inferentia.
   * Purpose-built for efficient machine learning inference.
   */
  INFERENCE = 'inference',

  /**
   * Media accelerators for video transcoding and processing workloads.
   */
  MEDIA = 'media',
}

/**
 * Supported hardware accelerator manufacturers.
 *
 * Restricts instance selection to accelerators from a particular vendor.
 * Useful for choosing specific ecosystems (e.g., NVIDIA CUDA, AWS chips).
 */
export enum AcceleratorManufacturer {
  /** Amazon Web Services (e.g., Inferentia, Trainium accelerators). */
  AWS = 'amazon-web-services',

  /** AMD (e.g., Radeon Pro V520 GPU). */
  AMD = 'amd',

  /** NVIDIA (e.g., A100, V100, T4, K80, M60 GPUs). */
  NVIDIA = 'nvidia',

  /** Xilinx (e.g., VU9P FPGA). */
  XILINX = 'xilinx',

  /** Habana Labs(e.g, Gaudi accelerator). */
  HABANA = 'habana',
}

/**
 * Specific hardware accelerator models supported by EC2.
 *
 * Defines exact accelerator models that can be required or excluded
 * when selecting instance types.
 */
export enum AcceleratorName {
  /** NVIDIA A100 GPU. */
  A100 = 'a100',

  /** NVIDIA K80 GPU. */
  K80 = 'k80',

  /** NVIDIA M60 GPU. */
  M60 = 'm60',

  /** AMD Radeon Pro V520 GPU. */
  RADEON_PRO_V520 = 'radeon-pro-v520',

  /** NVIDIA T4 GPU. */
  T4 = 't4',

  /** NVIDIA V100 GPU. */
  V100 = 'v100',

  /** Xilinx VU9P FPGA. */
  VU9P = 'vu9p',

  /** NVIDIA A10G GPU. */
  A10G = 'a10g',

  /** NVIDIA H100 GPU. */
  H100 = 'h100',

  /** AWS Inferentia chips. */
  INFERENTIA = 'inferentia',

  /** NVIDIA GRID K520 GPU. */
  K520 = 'k520',

  /** NVIDIA T4G GPUs. */
  T4G = 't4g',

  /** NVIDIA L40S GPU for AI inference and graphics workloads. */
  L40S = 'l40s',

  /** NVIDIA L4 GPU for AI inference and graphics workloads. */
  L4 = 'l4',

  /** Habana Gaudi HL-205 accelerator for deep learning training. */
  GAUDI_HL_205 = 'gaudi-hl-205',

  /** AWS Inferentia2 chips for high-performance ML inference. */
  INFERENTIA2 = 'inferentia2',

  /** AWS Trainium chips for high-performance ML training. */
  TRAINIUM = 'trainium',

  /** AWS Trainium2 chips for high-performance ML training. */
  TRAINIUM2 = 'trainium2',

  /** Xilinx U30 media transcoding accelerator for video processing. */
  U30 = 'u30',
}

/**
 * Bare metal support requirements for EC2 instances.
 *
 * Controls whether selected instance types must, may, or must not
 * be bare metal variants (i.e., instances that run directly on
 * physical hardware without a hypervisor).
 */
export enum BareMetal {
  /**
   * Bare metal instance types are allowed, but non-bare-metal
   * (virtualized) types may also be selected.
   */
  INCLUDED = 'included',

  /**
   * Only bare metal instance types are allowed.
   * Non-bare-metal types will be excluded from selection.
   */
  REQUIRED = 'required',

  /**
   * Bare metal instance types are disallowed.
   * Only non-bare-metal types may be selected.
   */
  EXCLUDED = 'excluded',
}

/**
 * Burstable CPU performance requirements for EC2 instances.
 *
 * Controls whether selected instance types must, may, or must not
 * support burstable vCPU performance (e.g., T3, T4g families).
 */
export enum BurstablePerformance {
  /**
   * Burstable-performance instance types are allowed, but
   * non-burstable types may also be selected.
   */
  INCLUDED = 'included',

  /**
   * Only burstable-performance instance types are allowed.
   * Non-burstable types will be excluded from selection.
   */
  REQUIRED = 'required',

  /**
   * Burstable-performance instance types are disallowed.
   * Only non-burstable types may be selected.
   */
  EXCLUDED = 'excluded',
}

/**
 * CPU manufacturers supported by EC2 instances.
 *
 * Restricts the acceptable CPU vendor for selected instance types.
 */
export enum CpuManufacturer {
  /** Intel CPUs (e.g., Xeon families). */
  INTEL = 'intel',

  /** AMD CPUs (e.g., EPYC families). */
  AMD = 'amd',

  /** AWS-designed CPUs (e.g., Graviton families). */
  AWS = 'amazon-web-services',

  /** Apple CPUs (e.g., M1, M2). */
  APPLE = 'apple',
}

/**
 * Instance generation categories for EC2.
 *
 * Determines whether the instance type must belong to the latest
 * (current) generation or to an older (previous) generation.
 */
export enum InstanceGeneration {
  /** Current generation instances (latest families). */
  CURRENT = 'current',

  /** Previous generation instances (older families). */
  PREVIOUS = 'previous',
}

/**
 * Local storage support requirements for EC2 instances.
 *
 * Controls whether selected instance types must, may, or must not
 * include directly attached local storage (instance store).
 */
export enum LocalStorage {
  /**
   * Instance types with local storage are allowed, but types without
   * local storage may also be selected.
   */
  INCLUDED = 'included',

  /**
   * Only instance types with local storage are allowed.
   * Types without local storage will be excluded.
   */
  REQUIRED = 'required',

  /**
   * Instance types with local storage are disallowed.
   * Only types without local storage may be selected.
   */
  EXCLUDED = 'excluded',
}

/**
 * Types of local storage available for EC2 instances.
 *
 * Specifies the physical medium used for local (instance store) storage.
 */
export enum LocalStorageType {
  /** Hard disk drive storage. */
  HDD = 'hdd',

  /** Solid state drive storage. */
  SSD = 'ssd',
}

/**
 * The attributes for the instance types for a mixed instances policy.
 *
 * When you specify multiple attributes, you get instance types that satisfy all of the specified attributes. If you specify multiple values for an attribute, you get instance types that satisfy any of the specified values.
 *
 * To limit the list of instance types from which Amazon EC2 can identify matching instance types, you can use one of the following parameters, but not both in the same request:
 * - AllowedInstanceTypes - The instance types to include in the list. All other instance types are ignored, even if they match your specified attributes.
 * - ExcludedInstanceTypes - The instance types to exclude from the list, even if they match your specified attributes.
 *
 * Note: You must specify VCpuCount and MemoryMiB. All other attributes are optional. Any unspecified optional attribute is set to its default.
 */
export interface InstanceRequirementsConfig {
  /**
   * The minimum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) for an instance type.
   *
   * To exclude accelerator-enabled instance types, set acceleratorCountMax to 0.
   *
   * @default - No minimum or maximum limits
   */
  readonly acceleratorCountMin?: number;

  /**
   * The maximum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) for an instance type.
   *
   * To exclude accelerator-enabled instance types, set Max to 0.
   *
   * @default - No minimum or maximum limits
   */
  readonly acceleratorCountMax?: number;

  /**
   * Indicates whether instance types must have accelerators by specific manufacturers.
   *
   * - For instance types with NVIDIA devices, specify nvidia.
   * - For instance types with AMD devices, specify amd.
   * - For instance types with AWS devices, specify amazon-web-services.
   * - For instance types with Xilinx devices, specify xilinx.
   *
   * @default - Any manufacturer
   */
  readonly acceleratorManufacturers?: AcceleratorManufacturer[];

  /**
   * Lists the accelerators that must be on an instance type.
   *
   * - For instance types with NVIDIA A100 GPUs, specify a100.
   * - For instance types with NVIDIA V100 GPUs, specify v100.
   * - For instance types with NVIDIA K80 GPUs, specify k80.
   * - For instance types with NVIDIA T4 GPUs, specify t4.
   * - For instance types with NVIDIA M60 GPUs, specify m60.
   * - For instance types with AMD Radeon Pro V520 GPUs, specify radeon-pro-v520.
   * - For instance types with Xilinx VU9P FPGAs, specify vu9p.
   *
   * @default - Any accelerator
   */
  readonly acceleratorNames?: AcceleratorName[];

  /**
   * The minimum total memory size for the accelerators on an instance type, in MiB.
   *
   * @default - No minimum or maximum limits
   */
  readonly acceleratorTotalMemoryMin?: Size;

  /**
   * The maximum total memory size for the accelerators on an instance type, in MiB.
   *
   * @default - No minimum or maximum limits
   */
  readonly acceleratorTotalMemoryMax?: Size;

  /**
   * Lists the accelerator types that must be on an instance type.
   *
   * - For instance types with GPU accelerators, specify gpu.
   * - For instance types with FPGA accelerators, specify fpga.
   * - For instance types with inference accelerators, specify inference.
   *
   * @default - Any accelerator type
   */
  readonly acceleratorTypes?: AcceleratorType[];

  /**
   * The instance types to apply your specified attributes against. All other instance types are ignored, even if they match your specified attributes.
   *
   * You can use strings with one or more wild cards, represented by an asterisk (*), to allow an instance type, size, or generation. The following are examples: m5.8xlarge, c5*.*, m5a.*, r*, *3*.
   *
   * For example, if you specify c5*, Amazon EC2 Auto Scaling will allow the entire C5 instance family, which includes all C5a and C5n instance types. If you specify m5a.*, Amazon EC2 Auto Scaling will allow all the M5a instance types, but not the M5n instance types.
   *
   * Note: If you specify AllowedInstanceTypes, you can't specify ExcludedInstanceTypes.
   *
   * @default - All instance types
   */
  readonly allowedInstanceTypes?: string[];

  /**
   * Indicates whether bare metal instance types are included, excluded, or required.
   *
   * @default - excluded
   */
  readonly bareMetal?: BareMetal;

  /**
   * The minimum baseline bandwidth performance for an instance type, in Mbps. For more information, see Amazon EBS–optimized instances in the Amazon EC2 User Guide.
   *
   * @default - No minimum or maximum limits
   */
  readonly baselineEbsBandwidthMbpsMin?: number;

  /**
   * The maximum baseline bandwidth performance for an instance type, in Mbps. For more information, see Amazon EBS–optimized instances in the Amazon EC2 User Guide.
   *
   * @default - No minimum or maximum limits
   */
  readonly baselineEbsBandwidthMbpsMax?: number;

  /**
   * Indicates whether burstable performance instance types are included, excluded, or required. For more information, see Burstable performance instances in the Amazon EC2 User Guide.
   *
   * @default - excluded
   */
  readonly burstablePerformance?: BurstablePerformance;

  /**
   * Lists which specific CPU manufacturers to include.
   *
   * - For instance types with Intel CPUs, specify intel.
   * - For instance types with AMD CPUs, specify amd.
   * - For instance types with AWS CPUs, specify amazon-web-services.
   * - For instance types with Apple CPUs, specify apple.
   *
   * Note: Don't confuse the CPU hardware manufacturer with the CPU hardware architecture. Instances will be launched with a compatible CPU architecture based on the Amazon Machine Image (AMI) that you specify in your launch template.
   *
   * @default - Any manufacturer
   */
  readonly cpuManufacturers?: CpuManufacturer[];

  /**
   * The instance types to exclude. You can use strings with one or more wild cards, represented by an asterisk (*), to exclude an instance family, type, size, or generation. The following are examples: m5.8xlarge, c5*.*, m5a.*, r*, *3*.
   *
   * For example, if you specify c5*, you are excluding the entire C5 instance family, which includes all C5a and C5n instance types. If you specify m5a.*, Amazon EC2 Auto Scaling will exclude all the M5a instance types, but not the M5n instance types.
   *
   * Note: If you specify ExcludedInstanceTypes, you can't specify AllowedInstanceTypes.
   *
   * @default - No excluded instance types
   */
  readonly excludedInstanceTypes?: string[];

  /**
   * Indicates whether current or previous generation instance types are included.
   *
   * - For current generation instance types, specify current. The current generation includes EC2 instance types currently recommended for use. This typically includes the latest two to three generations in each instance family. For more information, see Instance types in the Amazon EC2 User Guide.
   * - For previous generation instance types, specify previous.
   *
   * @default - Any current or previous generation
   */
  readonly instanceGenerations?: InstanceGeneration[];

  /**
   * Indicates whether instance types with instance store volumes are included, excluded, or required. For more information, see Amazon EC2 instance store in the Amazon EC2 User Guide.
   *
   * @default - included
   */
  readonly localStorage?: LocalStorage;

  /**
   * Indicates the type of local storage that is required.
   *
   * - For instance types with hard disk drive (HDD) storage, specify hdd.
   * - For instance types with solid state drive (SSD) storage, specify ssd.
   *
   * @default - Any local storage type
   */
  readonly localStorageTypes?: LocalStorageType[];

  /**
   * [Price protection] The price protection threshold for Spot Instances, as a percentage of an identified On-Demand price. The identified On-Demand price is the price of the lowest priced current generation C, M, or R instance type with your specified attributes. If no current generation C, M, or R instance type matches your attributes, then the identified price is from either the lowest priced current generation instance types or, failing that, the lowest priced previous generation instance types that match your attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price exceeds your specified threshold.
   *
   * The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage.
   *
   * If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is based on the per-vCPU or per-memory price instead of the per instance price.
   *
   * Note: Only one of SpotMaxPricePercentageOverLowestPrice or MaxSpotPriceAsPercentageOfOptimalOnDemandPrice can be specified. If you don't specify either, Amazon EC2 Auto Scaling will automatically apply optimal price protection to consistently select from a wide range of instance types. To indicate no price protection threshold for Spot Instances, meaning you want to consider all instance types that match your attributes, include one of these parameters and specify a high value, such as 999999.
   *
   * @default - Automatic optimal price protection
   */
  readonly maxSpotPriceAsPercentageOfOptimalOnDemandPrice?: number;

  /**
   * The minimum amount of memory per vCPU for an instance type, in GiB.
   *
   * @default - No minimum or maximum limits
   */
  readonly memoryPerVCpuMin?: Size;

  /**
   * The maximum amount of memory per vCPU for an instance type, in GiB.
   *
   * @default - No minimum or maximum limits
   */
  readonly memoryPerVCpuMax?: Size;

  /**
   * The minimum instance memory size for an instance type, in MiB.
   *
   * Required: Yes
   */
  readonly memoryMin: Size;

  /**
   * The maximum instance memory size for an instance type, in MiB.
   *
   * @default - No maximum limit
   */
  readonly memoryMax?: Size;

  /**
   * The minimum amount of network bandwidth, in gigabits per second (Gbps).
   *
   * @default - No minimum or maximum limits
   */
  readonly networkBandwidthGbpsMin?: number;

  /**
   * The maximum amount of network bandwidth, in gigabits per second (Gbps).
   *
   * @default - No minimum or maximum limits
   */
  readonly networkBandwidthGbpsMax?: number;

  /**
   * The minimum number of network interfaces for an instance type.
   *
   * @default - No minimum or maximum limits
   */
  readonly networkInterfaceCountMin?: number;

  /**
   * The maximum number of network interfaces for an instance type.
   *
   * @default - No minimum or maximum limits
   */
  readonly networkInterfaceCountMax?: number;

  /**
   * [Price protection] The price protection threshold for On-Demand Instances, as a percentage higher than an identified On-Demand price. The identified On-Demand price is the price of the lowest priced current generation C, M, or R instance type with your specified attributes. If no current generation C, M, or R instance type matches your attributes, then the identified price is from either the lowest priced current generation instance types or, failing that, the lowest priced previous generation instance types that match your attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price exceeds your specified threshold.
   *
   * The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage.
   *
   * To turn off price protection, specify a high value, such as 999999.
   *
   * If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is applied based on the per-vCPU or per-memory price instead of the per instance price.
   *
   * @default - 20
   */
  readonly onDemandMaxPricePercentageOverLowestPrice?: number;

  /**
   * Indicates whether instance types must provide On-Demand Instance hibernation support.
   *
   * @default - false
   */
  readonly requireHibernateSupport?: boolean;

  /**
   * [Price protection] The price protection threshold for Spot Instances, as a percentage higher than an identified Spot price. The identified Spot price is the price of the lowest priced current generation C, M, or R instance type with your specified attributes. If no current generation C, M, or R instance type matches your attributes, then the identified price is from either the lowest priced current generation instance types or, failing that, the lowest priced previous generation instance types that match your attributes. When Amazon EC2 Auto Scaling selects instance types with your attributes, we will exclude instance types whose price exceeds your specified threshold.
   *
   * The parameter accepts an integer, which Amazon EC2 Auto Scaling interprets as a percentage.
   *
   * If you set DesiredCapacityType to vcpu or memory-mib, the price protection threshold is based on the per-vCPU or per-memory price instead of the per instance price.
   *
   * Note: Only one of SpotMaxPricePercentageOverLowestPrice or MaxSpotPriceAsPercentageOfOptimalOnDemandPrice can be specified. If you don't specify either, Amazon EC2 Auto Scaling will automatically apply optimal price protection to consistently select from a wide range of instance types. To indicate no price protection threshold for Spot Instances, meaning you want to consider all instance types that match your attributes, include one of these parameters and specify a high value, such as 999999.
   *
   * @default - Automatic optimal price protection
   */
  readonly spotMaxPricePercentageOverLowestPrice?: number;

  /**
   * The minimum total local storage size for an instance type, in GB.
   *
   * @default - No minimum or maximum limits
   */
  readonly totalLocalStorageGBMin?: number;

  /**
   * The maximum total local storage size for an instance type, in GB.
   *
   * @default - No minimum or maximum limits
   */
  readonly totalLocalStorageGBMax?: number;

  /**
   * The minimum number of vCPUs for an instance type.
   *
   * Required: Yes
   */
  readonly vCpuCountMin: number;

  /**
   * The maximum number of vCPUs for an instance type.
   *
   * @default - No maximum limit
   */
  readonly vCpuCountMax?: number;
}
