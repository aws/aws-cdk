import { Size } from '../../core';

/**
 * Instance type properties
 */
export interface InstanceProperties {
  /**
   * If true, Amazon CloudWatch action based recovery is supported
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-recover.html#cloudwatch-recovery
   */
  readonly autoRecoverySupported?: boolean;

  /**
   * If true, the instance is a bare metal instance type.
   *
   * Not to be confused with {@link dedicatedHostsSupported dedicated hosts}
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-nitro-perf.html
   */
  readonly bareMetal?: boolean;

  /**
   * If true, the instance is a burstable performance `T*` instance type.
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances.html
   */
  readonly burstablePerformanceSupported?: boolean;

  /**
   * If true, this instance type is current generation
   *
   * @default - not specified
   */
  readonly currentGeneration?: boolean;

  /**
   * If true, this instance type supports Dedicated Hosts
   *
   * Not to be confused with {@link bareMetal bare metal instances},
   * nor {@link https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-instance.html dedicated instances}
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/dedicated-hosts-overview.html
   */
  readonly dedicatedHostsSupported?: boolean;

  /**
   * If true, this instance type is eligible for the AWS free trial
   *
   * @default - not specified
   * @see https://aws.amazon.com/free/
   */
  readonly freeTierEligible?: boolean;

  /**
   * If true, this instance type supports On-Demand hibernation
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/Hibernate.html
   */
  readonly hibernationSupported?: boolean;

  /**
   * Hypervisor running the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ena-nitro-perf.html
   */
  readonly hypervisor?: HypervisorType;

  /**
   * If true, this instance type is an instance store instance
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/InstanceStore.html
   */
  readonly instanceStorageSupported?: boolean;

  /**
   * Memory size of the instance type
   *
   * @default - not specified
   */
  readonly memorySize?: Size;

  /**
   * If true, this instance type supports Nitro Enclaves
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/enclaves/latest/user/nitro-enclave.html
   */
  readonly nitroEnclavesSupported?: boolean;

  /**
   * If true, this instance type supports Nitro Trusted Platform Module (NitroTPM)
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/nitrotpm.html
   */
  readonly nitroTpmSupported?: boolean;

  /**
   * The supported boot modes for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-boot.html
   */
  readonly supportedBootModes?: BootMode[];

  /**
   * List of supported Nitro Trusted Platform Module (NitroTPM) versions for the instance type
   *
   * @default - not specified
   */
  readonly supportedNitroTpmVersions?: string[];

  /**
   * List of supported placement group strategies for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
   */
  readonly supportedPlacementGroupStrategies?: PlacementGroupStrategy[];

  /**
   * The supported root device types for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/RootDeviceStorage.html#RootDeviceStorageConcepts
   */
  readonly supportedRootDeviceTypes?: RootDeviceType[];

  /**
   * The supported usage classes for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html
   */
  readonly supportedUsageClasses?: UsageClass[];

  /**
   * The supported virtualization types for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/virtualization_types.html
   */
  readonly supportedVirtualizationTypes?: VirtualizationType[];

  /**
   * Describes the Amazon EBS settings for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html
   */
  readonly ebsInfo?: EbsInfo;

  /**
   * Describe the FPGA accelerator settings for the instance type
   *
   * @default - not specified
   * @see https://aws.amazon.com/ec2/instance-types/f1/
   */
  readonly fpgaInfo?: FpgaInfo;

  /**
   * Describes the graphics processing unit (GPU) accelerator settings for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configure-gpu-instances.html
   */
  readonly gpuInfo?: GpuInfo;

  /**
   * Describes the Inference accelerator settings for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/elastic-inference/latest/developerguide/setting-up-ei.html#eia-launch
   */
  readonly inferenceAcceleratorInfo?: InferenceAcceleratorInfo;

  /**
   * Describes the storage for the instance type
   *
   * @default - not specified
   */
  readonly instanceStorageInfo?: InstanceStorageInfo;

  /**
   * Describes the media accelerator settings for the instance type
   *
   * @default - not specified
   */
  readonly mediaAcceleratorInfo?: MediaAcceleratorInfo;

  /**
   * Describes the network settings for the instance type
   *
   * @default - not specified
   */
  readonly networkInfo?: NetworkInfo;

  /**
   * Describes the Neuron accelerator settings for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html
   */
  readonly neuronInfo?: NeuronInfo;

  /**
   * Describes the processor settings for the instance type
   *
   * @default - not specified
   */
  readonly processorInfo?: ProcessorInfo;

  /**
   * Describes the vCPU (virtual CPU) settings for the instance type
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-optimize-cpu.html
   */
  readonly vCpuInfo?: VcpuInfo;
}

/**
 * Describes Amazon EBS settings
 *
 * @see https://docs.aws.amazon.com/ebs/latest/userguide/what-is-ebs.html
 */
export interface EbsInfo {
  /**
   * Describes the optimized EBS performance for the instance type
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html
   */
  readonly ebsOptimizedInfo?: EbsOptimizedInfo;

  /**
   * If true, the instance type supports EBS optimization,
   * and must be enabled for the optimization to take effect
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html#previous
   */
  readonly ebsOptimizedSupported?: boolean;

  /**
   * If true, the instance type is EBS-optimized by default,
   * and cannot be disabled
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html#current
   */
  readonly ebsOptimizedSupportedByDefault?: boolean;

  /**
   * If true, the instance type supports KMS encryption of its EBS volumes
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EBSEncryption.html
   */
  readonly encryptionSupported?: boolean;

  /**
   * If true, the instance type supports non-volatile memory express (NVMe)
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/nvme-ebs-volumes.html
   */
  readonly nvmeSupported?: boolean;

  /**
   * If true, the instance type requires non-volatile memory express (NVMe) volume
   * to be attached at launch.
   * These are local NVMe-based SSDs, physically connected to the host server
   *
   * @default - not specified
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/nvme-ebs-volumes.html
   */
  readonly nvmeRequired?: boolean;
}

/**
 * Describes the optimized EBS performance
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ebs-optimized.html
 */
export interface EbsOptimizedInfo {
  /**
   * The baseline bandwidth performance for an EBS-optimized instance type, in Mbps
   *
   * @default - not specified
   */
  readonly baselineBandwidthInMbps?: number;
  /**
   * The baseline input/output storage operations per seconds for an EBS-optimized instance type
   *
   * @default - not specified
   */
  readonly baselineIops?: number;
  /**
   * The baseline throughput performance for an EBS-optimized instance type, in MB/s
   *
   * @default - not specified
   */
  readonly baselineThroughputInMBps?: number;
  /**
   * The maximum bandwidth performance for an EBS-optimized instance type, in Mbps
   *
   * @default - not specified
   */
  readonly maximumBandwidthInMbps?: number;
  /**
   * The maximum input/output storage operations per second for an EBS-optimized instance type
   *
   * @default - not specified
   */
  readonly maximumIops?: number;
  /**
   * The maximum throughput performance for an EBS-optimized instance type, in MB/s
   *
   * @default - not specified
   */
  readonly maximumThroughputInMBps?: number;

}

/**
 * Describe FPGA accelerator settings
 *
 * @see https://aws.amazon.com/ec2/instance-types/f1/
 */
export interface FpgaInfo {
  /**
   * Describes the FPGA accelerator devices for the instance type
   *
   * @default - not specified
   */
  readonly fpgas?: FpgaDeviceInfo[];

  /**
   * The total memory of all FPGA accelerators for the instance type
   *
   * @default - not specified
   */
  readonly totalFpgaMemory?: Size;
}

/**
 * Describes an FPGA accelerator device
 */
export interface FpgaDeviceInfo {
  /**
   * The name of the FPGA accelerator
   *
   * @default - not specified
   */
  readonly name?: string;

  /**
   * The number of FGPA accelerators from this configuration for this instance type
   *
   * @default - not specified
   */
  readonly count?: number;

  /**
   * The manufacturer of the FPGA accelerator
   *
   * @default - not specified
   */
  readonly manufacturer?: string;

  /**
   * The memory size of the FPGA accelerator
   *
   * @default - not specified
   */
  readonly memorySize?: Size;
}

/**
 * Describes graphics processing unit (GPU) accelerator settings
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configure-gpu-instances.html
 */
export interface GpuInfo {
  /**
   * Describes the GPU devices for the instance type
   *
   * @default - not specified
   */
  readonly gpus?: GpuDeviceInfo[];

  /**
   * The total memory of all GPU devices for the instance type
   *
   * @default - not specified
   */
  readonly totalGpuMemory?: Size;
}

/**
 * Describes graphics processing unit (GPU) device information
 */
export interface GpuDeviceInfo {
  /**
   * The name of the GPU
   *
   * @default - not specified
   */
  readonly name?: string;

  /**
   * The number of GPUs for the instance type
   *
   * @default - not specified
   */
  readonly gpus?: number;

  /**
   * The manufacturer of the GPU
   *
   * @default - not specified
   */
  readonly manufacturer?: string;

  /**
   * The memory size of the GPU
   *
   * @default - not specified
   */
  readonly memorySize?: Size;
}

/**
 * Describes inference accelerator settings
 *
 * @see https://docs.aws.amazon.com/elastic-inference/latest/developerguide/setting-up-ei.html#eia-launch
 */
export interface InferenceAcceleratorInfo {
  /**
   * Describes the inference accelerator devices for the instance type
   *
   * @default - not specified
   */
  readonly accelerators?: InferenceAcceleratorDeviceInfo[];

  /**
   * The total memory of all inference accelerators for the instance type
   *
   * @default - not specified
   */
  readonly totalInferenceMemory?: Size;
}

/**
 * Describes inference accelerator device information
 */
export interface InferenceAcceleratorDeviceInfo {
  /**
   * The name of the inference accelerator
   *
   * @default - not specified
   */
  readonly name?: string;

  /**
   * The number of inference accelerator from this configuration for this instance type
   *
   * @default - not specified
   */
  readonly count?: number;

  /**
   * The manufacturer of the inference accelerator
   *
   * @default - not specified
   */
  readonly manufacturer?: string;

  /**
   * The memory size of the inference accelerator
   *
   * @default - not specified
   */
  readonly memorySize?: Size;
}

/**
 * Describes instance storage settings
 */
export interface InstanceStorageInfo {
  /**
   * Describes the disks for the instance type
   *
   * @default - not specified
   */
  readonly disks?: InstanceDiskInfo[];

  /**
   * The total storage size of all disks for the instance type
   *
   * @default - not specified
   */
  readonly totalStorage?: Size;
}

/**
 * Describes disk settings
 */
export interface InstanceDiskInfo {
  /**
   * The number of disks with this configuration
   *
   * @default - not specified
   */
  readonly count?: number;

  /**
   * The storage size of the disk
   *
   * @default - not specified
   */
  readonly size?: Size;

  /**
   * The type of the disk
   *
   * @default - not specified
   */
  readonly type?: DiskType;
}

/**
 * Describes media accelerator settings
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/media-accelerators.html
 */
export interface MediaAcceleratorInfo {
  /**
   * Describes the media accelerator devices for the instance type
   *
   * @default - not specified
   */
  readonly accelerators?: MediaDeviceInfo[];

  /**
   * The total memory of all media accelerators for the instance type
   *
   * @default - not specified
   */
  readonly totalMediaMemory?: Size;
}

/**
 * Describes media accelerator device information
 */
export interface MediaDeviceInfo {
  /**
   * The name of the media accelerator
   *
   * @default - not specified
   */
  readonly name?: string;

  /**
   * The number of media accelerator from this configuration for this instance type
   *
   * @default - not specified
   */
  readonly count?: number;

  /**
   * The manufacturer of the media accelerator
   *
   * @default - not specified
   */
  readonly manufacturer?: string;

  /**
   * The memory size of the media accelerator
   *
   * @default - not specified
   */
  readonly memorySize?: Size;
}

/**
 * TODO
 */
export interface NetworkInfo {}
/**
 * Describe Neuron accelerator settings
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-inference.html
 */
export interface NeuronInfo {
  /**
   * Describes the Neuron devices for the instance type
   *
   * @default - not specified
   */
  readonly neurons?: NeuronDeviceInfo[];

  /**
   * The total memory of all Neuron devices for the instance type
   *
   * @default - not specified
   */
  readonly totalNeuronMemory?: Size;
}

/**
 * Describes Neuron device information
 */
export interface NeuronDeviceInfo {
  /**
   * The name of the Neuron device
   *
   * @default - not specified
   */
  readonly name?: string;

  /**
   * The number of cores available to the neuron accelerator
   *
   * @default - not specified
   */
  readonly count?: number;

  /**
   * The version of the neuron accelerator
   *
   * @default - not specified
   */
  readonly version?: string;

  /**
   * The manufacturer of the Neuron device
   *
   * @default - not specified
   */
  readonly manufacturer?: string;

  /**
   * The memory size of the Neuron device
   *
   * @default - not specified
   */
  readonly memorySize?: Size;
}

/**
 * TODO
 */
export interface PlacementGroupInfo {}
/**
 * TODO
 */
export interface ProcessorInfo {}
/**
 * TODO
 */
export interface VcpuInfo {}

/**
 * Instance hypervisor type
 */
export enum HypervisorType {
  /** Nitro hypervisor */
  NITRO = 'nitro',

  /** Xen hypervisor */
  XEN = 'xen',
}

/**
 * Instance boot modes
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ami-boot.html
 */
export enum BootMode {
  /**  Legacy BIOS */
  LEGACY_BIOS = 'legacy-bios',
  /** Unified Extensible Firmware Interface (UEFI) */
  UEFI = 'uefi',
}
/**
 * Instance root device types
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/RootDeviceStorage.html#RootDeviceStorageConcepts
 */
export enum RootDeviceType {
  /** EBS-backed root device */
  EBS = 'ebs',
  /** Instance store-backed root device */
  INSTANCE_STORE = 'instance-store',
}

/**
 * Instance usage classes
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/instance-purchasing-options.html
 */
export enum UsageClass {
  /**
   * On-Demand
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-on-demand-instances.html
   */
  ON_DEMAND = 'on-demand',
  /**
   * Spot
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-spot-instances.html
   */
  SPOT = 'spot',
  /**
   * Capacity Blocks for Machine Learning (ML)
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html
   */
  CAPACITY_BLOCK = 'capacity-block',
}

/**
 * Instance virtualization types
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/virtualization_types.html
 */
export enum VirtualizationType {
  /** Hardware virtual machine (HVM) */
  HVM = 'hvm',
  /** Paravirtualization (PV) */
  PARAVIRTUAL = 'paravirtual',
}

/**
 * Instance storage disk types
 *
 * @see https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volume-types.html
 **/
export enum DiskType {
  /** Hard disk drive (HDD) */
  HDD = 'hdd',
  /** Solid state drive (SSD) */
  ssd = 'ssd',
}

/**
 * Instance placement group strategies
 *
 * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/placement-groups.html
 */
export enum PlacementGroupStrategy {
  /** Cluster */
  CLUSTER = 'cluster',
  /** Partition */
  PARTITION = 'partition',
  /** Spread */
  SPREAD = 'spread',
}