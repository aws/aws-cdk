import { CfnEC2Fleet } from './ec2.generated';
import { Size } from '../../core';

/**
 * CPU manufacturers for instance requirements.
 */
export enum CpuManufacturer {
  /**
   * Intel
   */
  INTEL = 'intel',

  /**
   * AMD
   */
  AMD = 'amd',

  /**
   * Amazon Web Services
   */
  AMAZON_WEB_SERVICES = 'amazon-web-services',
}

/**
 * Instance generations for instance requirements.
 */
export enum InstanceGeneration {
  /**
   * Current generation
   */
  CURRENT = 'current',

  /**
   * Previous generation
   */
  PREVIOUS = 'previous',
}

/**
 * Bare metal options for instance requirements.
 */
export enum BareMetal {
  /**
   * Included
   */
  INCLUDED = 'included',

  /**
   * Required
   */
  REQUIRED = 'required',

  /**
   * Excluded
   */
  EXCLUDED = 'excluded',
}

/**
 * Burstable performance options for instance requirements.
 */
export enum BurstablePerformance {
  /**
   * Included
   */
  INCLUDED = 'included',

  /**
   * Required
   */
  REQUIRED = 'required',

  /**
   * Excluded
   */
  EXCLUDED = 'excluded',
}

/**
 * Local storage options for instance requirements.
 */
export enum LocalStorage {
  /**
   * Included
   */
  INCLUDED = 'included',

  /**
   * Required
   */
  REQUIRED = 'required',

  /**
   * Excluded
   */
  EXCLUDED = 'excluded',
}

/**
 * Local storage types for instance requirements.
 */
export enum LocalStorageType {
  /**
   * HDD
   */
  HDD = 'hdd',

  /**
   * SSD
   */
  SSD = 'ssd',
}

/**
 * Accelerator types for instance requirements.
 */
export enum AcceleratorType {
  /**
   * GPU
   */
  GPU = 'gpu',

  /**
   * FPGA
   */
  FPGA = 'fpga',

  /**
   * Inference
   */
  INFERENCE = 'inference',
}

/**
 * Accelerator manufacturers for instance requirements.
 */
export enum AcceleratorManufacturer {
  /**
   * Amazon Web Services
   */
  AMAZON_WEB_SERVICES = 'amazon-web-services',

  /**
   * AMD
   */
  AMD = 'amd',

  /**
   * Habana
   */
  HABANA = 'habana',

  /**
   * NVIDIA
   */
  NVIDIA = 'nvidia',

  /**
   * Xilinx
   */
  XILINX = 'xilinx',
}

/**
 * Accelerator names for instance requirements.
 */
export enum AcceleratorName {
  /**
   * A10G
   */
  A10G = 'a10g',

  /**
   * A100
   */
  A100 = 'a100',

  /**
   * H100
   */
  H100 = 'h100',

  /**
   * Inferentia
   */
  INFERENTIA = 'inferentia',

  /**
   * K520
   */
  K520 = 'k520',

  /**
   * K80
   */
  K80 = 'k80',

  /**
   * M60
   */
  M60 = 'm60',

  /**
   * Radeon Pro V520
   */
  RADEON_PRO_V520 = 'radeon-pro-v520',

  /**
   * T4
   */
  T4 = 't4',

  /**
   * T4G
   */
  T4G = 't4g',

  /**
   * VU9P
   */
  VU9P = 'vu9p',

  /**
   * V100
   */
  V100 = 'v100',
}

/**
 * Instance requirements request
 */
export interface InstanceRequirementsConfig {
  /**
   * The minimum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) on an instance.
   *
   * @default - no accelerator count preference
   */
  readonly acceleratorCountMin?: number;

  /**
   * The maximum number of accelerators (GPUs, FPGAs, or AWS Inferentia chips) on an instance.
   *
   * @default - no accelerator count preference
   */
  readonly acceleratorCountMax?: number;

  /**
   * Indicates which accelerator manufacturers to include.
   *
   * @default - no accelerator manufacturer preference
   */
  readonly acceleratorManufacturers?: AcceleratorManufacturer[];

  /**
   * The accelerator names that must be on the instance type.
   *
   * @default - no accelerator name preference
   */
  readonly acceleratorNames?: AcceleratorName[];

  /**
   * The minimum amount of total accelerator memory.
   *
   * @default - no accelerator memory preference
   */
  readonly acceleratorTotalMemoryMin?: Size;

  /**
   * The maximum amount of total accelerator memory.
   *
   * @default - no accelerator memory preference
   */
  readonly acceleratorTotalMemoryMax?: Size;

  /**
   * The accelerator types that must be on the instance type.
   *
   * @default - no accelerator type preference
   */
  readonly acceleratorTypes?: AcceleratorType[];

  /**
   * The instance types to allow.
   *
   * @default - no instance type restrictions
   */
  readonly allowedInstanceTypes?: string[];

  /**
   * Indicates whether bare metal instance types must be included, excluded, or have no preference.
   *
   * @default - no bare metal preference
   */
  readonly bareMetal?: BareMetal;

  /**
   * The minimum baseline bandwidth to Amazon EBS, in Mbps.
   *
   * @default - no baseline EBS bandwidth preference
   */
  readonly baselineEbsBandwidthMbpsMin?: number;

  /**
   * The maximum baseline bandwidth to Amazon EBS, in Mbps.
   *
   * @default - no baseline EBS bandwidth preference
   */
  readonly baselineEbsBandwidthMbpsMax?: number;

  /**
   * Indicates whether burstable performance T instance types are included, excluded, or have no preference.
   *
   * @default - no burstable performance preference
   */
  readonly burstablePerformance?: BurstablePerformance;

  /**
   * The CPU manufacturers to include.
   *
   * @default - no CPU manufacturer preference
   */
  readonly cpuManufacturers?: CpuManufacturer[];

  /**
   * The instance types to exclude.
   *
   * @default - no instance types excluded
   */
  readonly excludedInstanceTypes?: string[];

  /**
   * Indicates whether current or previous generation instance types are included.
   *
   * @default - no generation preference
   */
  readonly instanceGenerations?: InstanceGeneration[];

  /**
   * Indicates whether instance types with instance store volumes are included, excluded, or have no preference.
   *
   * @default - no local storage preference
   */
  readonly localStorage?: LocalStorage;

  /**
   * The type of local storage that is required.
   *
   * @default - no local storage type preference
   */
  readonly localStorageTypes?: LocalStorageType[];

  /**
   * The price protection threshold for Spot Instances, as a percentage of the optimal On-Demand price.
   *
   * @default - no max spot price protection
   */
  readonly maxSpotPriceAsPercentageOfOptimalOnDemandPrice?: number;

  /**
   * The minimum amount of memory per vCPU.
   *
   * @default - no memory per vCPU preference
   */
  readonly memoryPerVCpuMin?: Size;

  /**
   * The maximum amount of memory per vCPU.
   *
   * @default - no memory per vCPU preference
   */
  readonly memoryPerVCpuMax?: Size;

  /**
   * The minimum amount of memory (required).
   */
  readonly memoryMin: Size;

  /**
   * The maximum amount of memory.
   *
   * @default - no maximum limit
   */
  readonly memoryMax?: Size;

  /**
   * The minimum network bandwidth, in Gbps.
   *
   * @default - no network bandwidth preference
   */
  readonly networkBandwidthGbpsMin?: number;

  /**
   * The maximum network bandwidth, in Gbps.
   *
   * @default - no network bandwidth preference
   */
  readonly networkBandwidthGbpsMax?: number;

  /**
   * The minimum number of network interfaces.
   *
   * @default - no network interface count preference
   */
  readonly networkInterfaceCountMin?: number;

  /**
   * The maximum number of network interfaces.
   *
   * @default - no network interface count preference
   */
  readonly networkInterfaceCountMax?: number;

  /**
   * The price protection threshold for On-Demand Instances, as a percentage higher than an identified On-Demand price.
   *
   * @default - no on-demand price protection
   */
  readonly onDemandMaxPricePercentageOverLowestPrice?: number;

  /**
   * Indicates whether instance types must support hibernation.
   *
   * @default false
   */
  readonly requireHibernateSupport?: boolean;

  /**
   * The price protection threshold for Spot Instances, as a percentage higher than an identified Spot price.
   *
   * @default - no spot price protection
   */
  readonly spotMaxPricePercentageOverLowestPrice?: number;

  /**
   * The minimum amount of total local storage, in GB.
   *
   * @default - no total local storage preference
   */
  readonly totalLocalStorageGBMin?: number;

  /**
   * The maximum amount of total local storage, in GB.
   *
   * @default - no total local storage preference
   */
  readonly totalLocalStorageGBMax?: number;

  /**
   * The minimum number of vCPUs (required).
   */
  readonly vCpuCountMin: number;

  /**
   * The maximum number of vCPUs.
   *
   * @default - no maximum limit
   */
  readonly vCpuCountMax?: number;
}

/**
 * Converts the InstanceRequirementsRequest to CloudFormation format
 */
export function renderInstanceRequirements(
  instanceRequirements: InstanceRequirementsConfig,
): CfnEC2Fleet.InstanceRequirementsRequestProperty {
  return {
    acceleratorCount: (instanceRequirements.acceleratorCountMin !== undefined ||
        instanceRequirements.acceleratorCountMax !== undefined) ? {
        min: instanceRequirements.acceleratorCountMin,
        max: instanceRequirements.acceleratorCountMax,
      } : undefined,
    acceleratorManufacturers: instanceRequirements.acceleratorManufacturers,
    acceleratorNames: instanceRequirements.acceleratorNames,
    acceleratorTotalMemoryMiB: (instanceRequirements.acceleratorTotalMemoryMin !== undefined ||
        instanceRequirements.acceleratorTotalMemoryMax !== undefined) ? {
        min: instanceRequirements.acceleratorTotalMemoryMin?.toMebibytes(),
        max: instanceRequirements.acceleratorTotalMemoryMax?.toMebibytes(),
      } : undefined,
    acceleratorTypes: instanceRequirements.acceleratorTypes,
    allowedInstanceTypes: instanceRequirements.allowedInstanceTypes,
    bareMetal: instanceRequirements.bareMetal,
    baselineEbsBandwidthMbps: (instanceRequirements.baselineEbsBandwidthMbpsMin !== undefined ||
        instanceRequirements.baselineEbsBandwidthMbpsMax !== undefined) ? {
        min: instanceRequirements.baselineEbsBandwidthMbpsMin,
        max: instanceRequirements.baselineEbsBandwidthMbpsMax,
      } : undefined,
    burstablePerformance: instanceRequirements.burstablePerformance,
    cpuManufacturers: instanceRequirements.cpuManufacturers,
    excludedInstanceTypes: instanceRequirements.excludedInstanceTypes,
    instanceGenerations: instanceRequirements.instanceGenerations,
    localStorage: instanceRequirements.localStorage,
    localStorageTypes: instanceRequirements.localStorageTypes,
    maxSpotPriceAsPercentageOfOptimalOnDemandPrice:
      instanceRequirements.maxSpotPriceAsPercentageOfOptimalOnDemandPrice,
    memoryGiBPerVCpu: (instanceRequirements.memoryPerVCpuMin !== undefined ||
        instanceRequirements.memoryPerVCpuMax !== undefined) ? {
        min: instanceRequirements.memoryPerVCpuMin?.toGibibytes(),
        max: instanceRequirements.memoryPerVCpuMax?.toGibibytes(),
      } : undefined,
    memoryMiB: ( instanceRequirements.memoryMin !== undefined ||
        instanceRequirements.memoryMax !== undefined) ? {
        min: instanceRequirements.memoryMin.toMebibytes(),
        max: instanceRequirements.memoryMax?.toMebibytes(),
      } : undefined,
    networkBandwidthGbps: (instanceRequirements.networkBandwidthGbpsMin !== undefined ||
        instanceRequirements.networkBandwidthGbpsMax !== undefined) ? {
        min: instanceRequirements.networkBandwidthGbpsMin,
        max: instanceRequirements.networkBandwidthGbpsMax,
      } : undefined,
    networkInterfaceCount: (instanceRequirements.networkInterfaceCountMin !== undefined ||
        instanceRequirements.networkInterfaceCountMax !== undefined) ? {
        min: instanceRequirements.networkInterfaceCountMin,
        max: instanceRequirements.networkInterfaceCountMax,
      } : undefined,
    onDemandMaxPricePercentageOverLowestPrice: instanceRequirements.onDemandMaxPricePercentageOverLowestPrice,
    requireHibernateSupport: instanceRequirements.requireHibernateSupport,
    spotMaxPricePercentageOverLowestPrice: instanceRequirements.spotMaxPricePercentageOverLowestPrice,
    totalLocalStorageGb: (instanceRequirements.totalLocalStorageGBMin !== undefined ||
        instanceRequirements.totalLocalStorageGBMax !== undefined) ? {
        min: instanceRequirements.totalLocalStorageGBMin,
        max: instanceRequirements.totalLocalStorageGBMax,
      } : undefined,
    vCpuCount: (instanceRequirements.vCpuCountMin !== undefined ||
        instanceRequirements.vCpuCountMax !== undefined) ? {
        min: instanceRequirements.vCpuCountMin,
        max: instanceRequirements.vCpuCountMax,
      } : undefined,
  };
}
