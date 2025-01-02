import type { InstanceTypeInfo } from '@aws-sdk/client-ec2';
import { InstanceClass } from './instance-class';
import { InstanceProperties, HypervisorType, BootMode, RootDeviceType, UsageClass, VirtualizationType, FpgaDeviceInfo, GpuDeviceInfo, InferenceAcceleratorDeviceInfo, InstanceDiskInfo, DiskType, NetworkCardInfo, InstanceArchitecture, ProcessorFeature, NeuronDeviceInfo, MediaDeviceInfo } from './instance-properties';
import { InstanceSize } from './instance-size';
import { InstanceType } from './instance-type';
import { Size } from '../../../core';
import * as instancePropertiesJsonData from '../../data/instance-properties.json';
import { PlacementGroupStrategy } from '../placement-group';

const instancePropertiesData = instancePropertiesJsonData as {
  [InstanceType: string]: Omit<InstanceTypeInfo, 'InstanceType'>;
};

/**
 * Known instance type for EC2 instances, retrieved from the AWS API.
 *
 * Not all instance types are available in all regions, and some are available only to
 * specific accounts. This class may not be exhaustive.
 */
export class NamedInstanceType {
  /**
   * **Instance type**: `r6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * Alias: {@link NamedInstanceType.MEMORY6_INTEL_NVME_DRIVE_16XLARGE}
   */
  public static readonly R6ID_16XLARGE = InstanceType.of(InstanceClass.R6ID, InstanceSize.XLARGE16);

  /**
   * **Instance type**: `r6id.16xlarge`:
   *
   * * **Instance class**: {@link InstanceClass.R6ID} Memory optimized instances with local NVME drive, 6th generation with Intel Xeon Scalable processors (3rd generation processors code named Ice Lake)
   * * **Instance size**: {@link InstanceSize.XLARGE16}
   *
   * Alias of: {@link NamedInstanceType.R6ID_16XLARGE}
   */
  public static readonly MEMORY6_INTEL_NVME_DRIVE_16XLARGE = InstanceType.of(InstanceClass.MEMORY6_INTEL_NVME_DRIVE, InstanceSize.XLARGE16);

  public static mapInstanceProperties(instanceTypeIdentifier: string): InstanceProperties | undefined {
    const data = instancePropertiesData[instanceTypeIdentifier];
    if (!data) return;

    return {
      autoRecoverySupported: data.AutoRecoverySupported,
      bareMetal: data.BareMetal,
      burstablePerformanceSupported: data.BurstablePerformanceSupported,
      currentGeneration: data.CurrentGeneration,
      dedicatedHostsSupported: data.DedicatedHostsSupported,
      freeTierEligible: data.FreeTierEligible,
      hibernationSupported: data.HibernationSupported,
      hypervisor: data.Hypervisor as HypervisorType | undefined,
      instanceStorageSupported: data.InstanceStorageSupported,
      memorySize: data.MemoryInfo?.SizeInMiB ? Size.mebibytes(data.MemoryInfo.SizeInMiB) : undefined,
      nitroEnclavesSupported: NamedInstanceType.mapSupportedValue(data.NitroEnclavesSupport),
      nitroTpmSupported: NamedInstanceType.mapSupportedValue(data.NitroTpmSupport),
      phcSupported: NamedInstanceType.mapSupportedValue(data.PhcSupport),
      supportedBootModes: data.SupportedBootModes as BootMode[] | undefined,
      supportedNitroTpmVersions: data.NitroTpmInfo?.SupportedVersions,
      supportedPlacementGroupStrategies: data.PlacementGroupInfo?.SupportedStrategies as PlacementGroupStrategy[],
      supportedRootDeviceTypes: data.SupportedRootDeviceTypes as RootDeviceType[] | undefined,
      supportedUsageClasses: data.SupportedUsageClasses as UsageClass[] | undefined,
      supportedVirtualizationTypes: data.SupportedVirtualizationTypes as VirtualizationType[] | undefined,
      ebsInfo: {
        ebsOptimizedInfo: {
          baselineBandwidthInMbps: data.EbsInfo?.EbsOptimizedInfo?.BaselineBandwidthInMbps,
          baselineIops: data.EbsInfo?.EbsOptimizedInfo?.BaselineIops,
          baselineThroughputInMBps: data.EbsInfo?.EbsOptimizedInfo?.BaselineThroughputInMBps,
          maximumBandwidthInMbps: data.EbsInfo?.EbsOptimizedInfo?.MaximumBandwidthInMbps,
          maximumIops: data.EbsInfo?.EbsOptimizedInfo?.MaximumIops,
          maximumThroughputInMBps: data.EbsInfo?.EbsOptimizedInfo?.MaximumThroughputInMBps,
        },
        ebsOptimizedSupported: NamedInstanceType.mapSupportedValue(data.EbsInfo?.EbsOptimizedSupport, { supported: ['supported', 'default'] }),
        ebsOptimizedSupportedByDefault: data.EbsInfo?.EbsOptimizedSupport === 'default',
        encryptionSupported: NamedInstanceType.mapSupportedValue(data.EbsInfo?.EncryptionSupport),
        nvmeSupported: NamedInstanceType.mapSupportedValue(data.EbsInfo?.NvmeSupport, { supported: ['supported', 'required'] }),
        nvmeRequired: data.EbsInfo?.NvmeSupport === 'required',
      },
      fpgaInfo: {
        fpgas: data.FpgaInfo?.Fpgas?.map<FpgaDeviceInfo>((fpga) => ({
          name: fpga.Name,
          count: fpga.Count,
          manufacturer: fpga.Manufacturer,
          memorySize: fpga.MemoryInfo?.SizeInMiB ? Size.mebibytes(fpga.MemoryInfo.SizeInMiB) : undefined,
        })),
        totalFpgaMemory: data.FpgaInfo?.TotalFpgaMemoryInMiB ? Size.mebibytes(data.FpgaInfo?.TotalFpgaMemoryInMiB) : undefined,
      },
      gpuInfo: {
        gpus: data.GpuInfo?.Gpus?.map<GpuDeviceInfo>((gpu) => ({
          name: gpu.Name,
          manufacturer: gpu.Manufacturer,
          count: gpu.Count,
          memorySize: gpu.MemoryInfo?.SizeInMiB ? Size.mebibytes(gpu.MemoryInfo.SizeInMiB) : undefined,
        })),
        totalGpuMemory: data.GpuInfo?.TotalGpuMemoryInMiB ? Size.mebibytes(data.GpuInfo?.TotalGpuMemoryInMiB) : undefined,
      },
      inferenceAcceleratorInfo: {
        accelerators: data.InferenceAcceleratorInfo?.Accelerators?.map<InferenceAcceleratorDeviceInfo>((accelerator) => ({
          name: accelerator.Name,
          manufacturer: accelerator.Manufacturer,
          count: accelerator.Count,
          memoryInfo: accelerator.MemoryInfo?.SizeInMiB ?
            Size.mebibytes(accelerator.MemoryInfo.SizeInMiB)
            : undefined,
        })),
        totalInferenceMemory: data.InferenceAcceleratorInfo?.TotalInferenceMemoryInMiB ?
          Size.mebibytes(data.InferenceAcceleratorInfo?.TotalInferenceMemoryInMiB)
          : undefined,
      },
      instanceStorageInfo: {
        disks: data.InstanceStorageInfo?.Disks?.map<InstanceDiskInfo>((disk) => ({
          count: disk.Count,
          size: disk.SizeInGB ? Size.gibibytes(disk.SizeInGB) : undefined,
          type: disk.Type as DiskType,
        })),
        totalStorage: data.InstanceStorageInfo?.TotalSizeInGB ?
          Size.gibibytes(data.InstanceStorageInfo.TotalSizeInGB) :
          undefined,
      },
      mediaAcceleratorInfo: {
        accelerators: data.MediaAcceleratorInfo?.Accelerators?.map<MediaDeviceInfo>((accelerator) => ({
          name: accelerator.Name,
          manufacturer: accelerator.Manufacturer,
          count: accelerator.Count,
        })),
        totalMediaMemory: data.MediaAcceleratorInfo?.TotalMediaMemoryInMiB ?
          Size.mebibytes(data.MediaAcceleratorInfo?.TotalMediaMemoryInMiB)
          : undefined,
      },
      networkInfo: {
        defaultNetworkCardIndex: data.NetworkInfo?.DefaultNetworkCardIndex,
        maximumEfaInterfaces: data.NetworkInfo?.EfaInfo?.MaximumEfaInterfaces,
        efaSupported: data.NetworkInfo?.EfaSupported,
        enaSupported: NamedInstanceType.mapSupportedValue(data.NetworkInfo?.EnaSupport),
        // This mapping is not a mistake, 'required' is being interpreted as supported by default.
        // CloudFormation's 'required' does not accurately reflect the actual behavior, since
        // the instance type can be successfully launched without the requirements of ENA
        enaSupportedByDefault: data.NetworkInfo?.EnaSupport === 'required',
        enaSrdSupported: data.NetworkInfo?.EnaSrdSupported,
        encryptionInTransitSupported: data.NetworkInfo?.EncryptionInTransitSupported,
        ipv4AddressesPerInterface: data.NetworkInfo?.Ipv4AddressesPerInterface,
        ipv6AddressesPerInterface: data.NetworkInfo?.Ipv6AddressesPerInterface,
        ipv6Supported: data.NetworkInfo?.Ipv6Supported,
        maximumNetworkCards: data.NetworkInfo?.MaximumNetworkCards,
        maximumNetworkInterfaces: data.NetworkInfo?.MaximumNetworkInterfaces,
        networkPerformance: data.NetworkInfo?.NetworkPerformance,
        networkCards: data.NetworkInfo?.NetworkCards?.map<NetworkCardInfo>((card) => ({
          maximumNetworkInterfaces: card.MaximumNetworkInterfaces,
          networkCardIndex: card.NetworkCardIndex,
          networkPerformance: card.NetworkPerformance,
          baselineBandwidthInGbps: card.BaselineBandwidthInGbps,
          peakBandwidthInGbps: card.PeakBandwidthInGbps,
        })),
      },
      neuronInfo: {
        neurons: data.NeuronInfo?.NeuronDevices?.map<NeuronDeviceInfo>((neuron) => ({
          name: neuron.Name,
          count: neuron.CoreInfo?.Count,
          version: neuron.CoreInfo?.Version,
          memorySize: neuron.MemoryInfo?.SizeInMiB ?
            Size.mebibytes(neuron.MemoryInfo?.SizeInMiB)
            : undefined,
        })),
        totalNeuronMemory: data.NeuronInfo?.TotalNeuronDeviceMemoryInMiB ?
          Size.mebibytes(data.NeuronInfo?.TotalNeuronDeviceMemoryInMiB)
          : undefined,
      },
      processorInfo: {
        manufacturer: data.ProcessorInfo?.Manufacturer,
        supportedArchitectures: data.ProcessorInfo?.SupportedArchitectures as InstanceArchitecture[] | undefined,
        supportedFeatures: data.ProcessorInfo?.SupportedFeatures as ProcessorFeature[] | undefined,
        sustainedClockSpeedInGhz: data.ProcessorInfo?.SustainedClockSpeedInGhz,
      },
      vCpuInfo: {
        defaultCores: data.VCpuInfo?.DefaultCores,
        defaultThreadsPerCore: data.VCpuInfo?.DefaultThreadsPerCore,
        defaultVCpus: data.VCpuInfo?.DefaultVCpus,
        validCores: data.VCpuInfo?.ValidCores,
        validThreadsPerCore: data.VCpuInfo?.ValidThreadsPerCore,
      },
    };
  };

  private static mapSupportedValue(value = '', opts = { supported: ['supported'] }): boolean | undefined {
    if (opts.supported.includes(value)) return true;
    if (value === 'unsupported') return false;

    // Return undefined if the value is either undefined or unknown
    return undefined;
  }
}
