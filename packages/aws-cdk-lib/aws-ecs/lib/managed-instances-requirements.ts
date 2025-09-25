import { CfnCapacityProvider } from './ecs.generated';
import { InstanceRequirementsConfig } from '../../aws-ec2';

/**
 * Converts EC2 InstanceRequirementsConfig directly to CloudFormation format for ECS Managed Instances
 */
export function renderInstanceRequirements(
  instanceRequirements: InstanceRequirementsConfig,
): CfnCapacityProvider.InstanceRequirementsRequestProperty {
  // Validate required properties
  if (instanceRequirements.vCpuCountMin === undefined || instanceRequirements.vCpuCountMin === null) {
    throw new TypeError('vCpuCountMin is required and must be specified');
  }

  if (instanceRequirements.memoryMin === undefined || instanceRequirements.memoryMin === null) {
    throw new TypeError('memoryMin is required and must be specified');
  }

  return {
    vCpuCount: {
      min: instanceRequirements.vCpuCountMin,
      max: instanceRequirements.vCpuCountMax,
    },
    memoryMiB: {
      min: instanceRequirements.memoryMin.toMebibytes(),
      max: instanceRequirements.memoryMax?.toMebibytes(),
    },
    acceleratorCount: (instanceRequirements.acceleratorCountMin !== undefined ||
        instanceRequirements.acceleratorCountMax !== undefined) ? {
        min: instanceRequirements.acceleratorCountMin,
        max: instanceRequirements.acceleratorCountMax,
      } : undefined,
    acceleratorManufacturers: instanceRequirements.acceleratorManufacturers?.map(m => m.toString()),
    acceleratorNames: instanceRequirements.acceleratorNames?.map(n => n.toString()),
    acceleratorTotalMemoryMiB: (instanceRequirements.acceleratorTotalMemoryMin !== undefined ||
        instanceRequirements.acceleratorTotalMemoryMax !== undefined) ? {
        min: instanceRequirements.acceleratorTotalMemoryMin?.toMebibytes(),
        max: instanceRequirements.acceleratorTotalMemoryMax?.toMebibytes(),
      } : undefined,
    acceleratorTypes: instanceRequirements.acceleratorTypes?.map(t => t.toString()),
    allowedInstanceTypes: instanceRequirements.allowedInstanceTypes,
    bareMetal: instanceRequirements.bareMetal?.toString(),
    baselineEbsBandwidthMbps: (instanceRequirements.baselineEbsBandwidthMbpsMin !== undefined ||
        instanceRequirements.baselineEbsBandwidthMbpsMax !== undefined) ? {
        min: instanceRequirements.baselineEbsBandwidthMbpsMin,
        max: instanceRequirements.baselineEbsBandwidthMbpsMax,
      } : undefined,
    burstablePerformance: instanceRequirements.burstablePerformance?.toString(),
    cpuManufacturers: instanceRequirements.cpuManufacturers?.map(m => m.toString()),
    excludedInstanceTypes: instanceRequirements.excludedInstanceTypes,
    instanceGenerations: instanceRequirements.instanceGenerations?.map(g => g.toString()),
    localStorage: instanceRequirements.localStorage?.toString(),
    localStorageTypes: instanceRequirements.localStorageTypes?.map(t => t.toString()),
    maxSpotPriceAsPercentageOfOptimalOnDemandPrice:
      instanceRequirements.maxSpotPriceAsPercentageOfOptimalOnDemandPrice,
    memoryGiBPerVCpu: (instanceRequirements.memoryPerVCpuMin !== undefined ||
        instanceRequirements.memoryPerVCpuMax !== undefined) ? {
        min: instanceRequirements.memoryPerVCpuMin?.toGibibytes(),
        max: instanceRequirements.memoryPerVCpuMax?.toGibibytes(),
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
  };
}
