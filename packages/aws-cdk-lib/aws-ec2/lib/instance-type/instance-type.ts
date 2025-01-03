import type { InstanceTypeInfo } from '@aws-sdk/client-ec2';
import { Size } from '../../../core';
import * as instancePropertiesJsonData from '../../data/instance-properties.json';
import { PlacementGroupStrategy } from '../placement-group';
import { InstanceClass, _instanceClassMap } from './instance-class';
import { BootMode, DiskType, FpgaDeviceInfo, GpuDeviceInfo, HypervisorType, InferenceAcceleratorDeviceInfo, InstanceArchitecture, InstanceDiskInfo, InstanceProperties, MediaDeviceInfo, NetworkCardInfo, NeuronDeviceInfo, ProcessorFeature, RootDeviceType, UsageClass, VirtualizationType } from './instance-properties';
import { InstanceSize } from './instance-size';

const instancePropertiesData = instancePropertiesJsonData as {
  [InstanceType: string]: Omit<InstanceTypeInfo, 'InstanceType'>;
};

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
   * Be aware that not all combinations of class and size are available,
   * and not all classes are available in all regions.
   */
  public static of(instanceClass: InstanceClass, instanceSize: InstanceSize) {
    // JSII does not allow enum types to have same value. So to support the enum, the enum with same value has to be mapped later.
    return new InstanceType(`${_instanceClassMap[instanceClass] ?? instanceClass}.${instanceSize}`);
  }
  private static mapInstanceProperties(instanceTypeIdentifier: string): InstanceProperties | undefined {
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
      nitroEnclavesSupported: mapSupportedValue(data.NitroEnclavesSupport),
      nitroTpmSupported: mapSupportedValue(data.NitroTpmSupport),
      phcSupported: mapSupportedValue(data.PhcSupport),
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
        ebsOptimizedSupported: mapSupportedValue(data.EbsInfo?.EbsOptimizedSupport, { supported: ['supported', 'default'] }),
        ebsOptimizedSupportedByDefault: data.EbsInfo?.EbsOptimizedSupport === 'default',
        encryptionSupported: mapSupportedValue(data.EbsInfo?.EncryptionSupport),
        nvmeSupported: mapSupportedValue(data.EbsInfo?.NvmeSupport, { supported: ['supported', 'required'] }),
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
        enaSupported: mapSupportedValue(data.NetworkInfo?.EnaSupport),
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

  constructor(
    /**
     * The instance type, as returned by the EC2 API
     *
     * @example "t3.small"
     */
    private readonly instanceTypeIdentifier: string,

    /**
     * Instance properties for the instance type, obtained from cached SDK data
     *
     * @default - Cached SDK data properties for the corresponding instance type
     */
    public readonly instanceProperties = InstanceType.mapInstanceProperties(instanceTypeIdentifier)) {
  }

  /**
   * Return the instance type as a dotted string
   */
  public toString(): string {
    return this.instanceTypeIdentifier;
  }

  /**
   * The instance's CPU architecture
   *
   * @deprecated - use {@link instanceProperties}
   */
  public get architecture(): InstanceArchitecture {
    // TODO use data first
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
   *
   * @deprecated - use {@link instanceProperties}
   */
  public isBurstable(): boolean {
    // TODO use data first
    return this.instanceTypeIdentifier.startsWith('t3') || this.instanceTypeIdentifier.startsWith('t4g') || this.instanceTypeIdentifier.startsWith('t2');
  }
}

function mapSupportedValue(value = '', opts = { supported: ['supported'] }): boolean | undefined {
  if (opts.supported.includes(value)) return true;
  if (value === 'unsupported') return false;

  // Return undefined if the value is either undefined or unknown
  return undefined;
}
