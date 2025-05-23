import * as ec2 from '../../aws-ec2';
import * as ssm from '../../aws-ssm';

// v2 - keep this import as a separate section to reduce merge conflict when forward merging with the v2 branch.
// eslint-disable-next-line
import { Construct } from 'constructs';

/**
 * The ECS-optimized AMI variant to use. For more information, see
 * [Amazon ECS-optimized AMIs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html).
 */
export enum AmiHardwareType {

  /**
   * Use the standard Amazon ECS-optimized AMI.
   */
  STANDARD = 'Standard',

  /**
   * Use the Amazon ECS GPU-optimized AMI.
   */
  GPU = 'GPU',

  /**
   * Use the Amazon ECS-optimized Amazon Linux 2 (arm64) AMI.
   */
  ARM = 'ARM64',

  /**
   * Use the Amazon ECS-optimized Amazon Linux 2 (Neuron) AMI.
   */
  NEURON = 'Neuron',
}

/**
 * ECS-optimized Windows version list
 */
export enum WindowsOptimizedVersion {
  SERVER_2022 = '2022',
  SERVER_2019 = '2019',
  SERVER_2016 = '2016',
}

/**
 * Windows Server Core variants for ECS-optimized AMIs.
 */
export enum WindowsOptimizedCoreVersion {
  SERVER_2022_CORE = '2022',
  SERVER_2019_CORE = '2019',
}

/**
 * The kernel version for Amazon Linux 2 ECS-optimized AMI.
 */
export enum AmiLinuxKernelVersion {
  /**
   * Kernel version 5.10
   */
  KERNEL_5_10 = '5.10',
}

const BR_IMAGE_SYMBOL = Symbol.for(
  '@aws-cdk/aws-ecs/lib/amis.BottleRocketImage',
);

/*
 * TODO:v2.0.0
 *  * remove `export` keyword
 *  * remove @deprecated
 */
/**
 * The properties that define which ECS-optimized AMI is used.
 *
 * @deprecated see `EcsOptimizedImage`
 */
export interface EcsOptimizedAmiProps {
  /**
   * The Amazon Linux generation to use.
   *
   * @default AmazonLinuxGeneration.AmazonLinux2
   */
  readonly generation?: ec2.AmazonLinuxGeneration;

  /**
   * The Windows Server version to use.
   *
   * @default none, uses Linux generation
   */
  readonly windowsVersion?: WindowsOptimizedVersion;

  /**
   * The Windows Server Core version to use.
   *
   * @default none, uses Linux generation
   */
  readonly windowsCoreVersion?: WindowsOptimizedCoreVersion;

  /**
   * The ECS-optimized AMI variant to use.
   *
   * @default AmiHardwareType.Standard
   */
  readonly hardwareType?: AmiHardwareType;

  /**
   * Whether the AMI ID is cached to be stable between deployments
   *
   * By default, the newest image is used on each deployment. This will cause
   * instances to be replaced whenever a new version is released, and may cause
   * downtime if there aren't enough running instances in the AutoScalingGroup
   * to reschedule the tasks on.
   *
   * If set to true, the AMI ID will be cached in `cdk.context.json` and the
   * same value will be used on future runs. Your instances will not be replaced
   * but your AMI version will grow old over time. To refresh the AMI lookup,
   * you will have to evict the value from the cache using the `cdk context`
   * command. See https://docs.aws.amazon.com/cdk/latest/guide/context.html for
   * more information.
   *
   * Can not be set to `true` in environment-agnostic stacks.
   *
   * @default false
   */
  readonly cachedInContext?: boolean;

  /**
   * The kernel version to use for Amazon Linux 2.
   *
   * @default - kernel value will be undefined
   */
  readonly kernel?: AmiLinuxKernelVersion;
}

/**
 * Internal utility for constructing the SSM parameter path for ECS AMIs.
 * Used by both EcsOptimizedAmi and EcsOptimizedImage classes.
 */
function constructSsmParameterPath(params: {
  windowsVersion?: WindowsOptimizedVersion;
  windowsCoreVersion?: WindowsOptimizedCoreVersion;
  generation?: ec2.AmazonLinuxGeneration;
  hwType: AmiHardwareType;
  kernel?: AmiLinuxKernelVersion;
}): string {
  let path = '/aws/service/';

  if (params.windowsVersion || params.windowsCoreVersion) {
    path += 'ami-windows-latest/';

    let windowsVersion: string;
    let editionType: string;

    if (params.windowsCoreVersion) {
      // For Core variants
      windowsVersion = params.windowsCoreVersion;
      editionType = 'English-Core';
    } else {
      // For Full editions
      windowsVersion = params.windowsVersion!;
      editionType = 'English-Full';
    }

    path += `Windows_Server-${windowsVersion}-${editionType}-ECS_Optimized/`;
    path += 'image_id';
  } else {
    path += 'ecs/optimized-ami/';

    if (params.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX) {
      path += 'amazon-linux/';
    } else if (params.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2) {
      path += 'amazon-linux-2/';

      // Add kernel version for Amazon Linux 2 if specified
      if (params.kernel) {
        path += `kernel-${params.kernel}/`;
      }
    } else if (params.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023) {
      path += 'amazon-linux-2023/';
    }

    // Add hardware type
    if (params.hwType === AmiHardwareType.GPU) {
      path += 'gpu/';
    } else if (params.hwType === AmiHardwareType.ARM) {
      path += 'arm64/';
    } else if (params.hwType === AmiHardwareType.NEURON) {
      path += 'inf/';
    }

    path += 'recommended/image_id';
  }

  return path;
}

/*
 * TODO:v2.0.0 remove EcsOptimizedAmi
 */
/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 *
 * @deprecated see `EcsOptimizedImage#amazonLinux`, `EcsOptimizedImage#amazonLinux` and `EcsOptimizedImage#windows`
 */
export class EcsOptimizedAmi implements ec2.IMachineImage {
  private readonly generation?: ec2.AmazonLinuxGeneration;
  private readonly windowsVersion?: WindowsOptimizedVersion;
  private readonly windowsCoreVersion?: WindowsOptimizedCoreVersion;
  private readonly hwType: AmiHardwareType;

  private readonly amiParameterName: string;
  private readonly cachedInContext: boolean;

  /**
   * Constructs a new instance of the EcsOptimizedAmi class.
   */
  constructor(props?: EcsOptimizedAmiProps) {
    this.hwType = (props && props.hardwareType) || AmiHardwareType.STANDARD;

    // Multiple OS/version validation
    if (props?.windowsVersion && props?.windowsCoreVersion) {
      throw new Error(
        'Cannot specify both windowsVersion and windowsCoreVersion',
      );
    }

    if (props && props.generation) {
      // generation defined in the props object
      if (
        props.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX &&
        this.hwType !== AmiHardwareType.STANDARD
      ) {
        throw new Error(
          'Amazon Linux does not support special hardware type. Use Amazon Linux 2 instead',
        );
      } else if (props.windowsVersion || props.windowsCoreVersion) {
        throw new Error(
          'Windows image and Linux image generation cannot be both set',
        );
      } else {
        this.generation = props.generation;
      }
    } else if (props && props.windowsVersion) {
      if (this.hwType !== AmiHardwareType.STANDARD) {
        throw new Error(
          'Windows Server does not support special hardware type',
        );
      } else {
        this.windowsVersion = props.windowsVersion;
      }
    } else if (props && props.windowsCoreVersion) {
      if (this.hwType !== AmiHardwareType.STANDARD) {
        throw new Error(
          'Windows Server Core does not support special hardware type',
        );
      } else {
        this.windowsCoreVersion = props.windowsCoreVersion;
      }
    } else {
      // no OS/version specified
      // always default to Amazon Linux v2 regardless of HW
      this.generation = ec2.AmazonLinuxGeneration.AMAZON_LINUX_2;
    }

    // Use the shared utility function to construct the SSM parameter path
    this.amiParameterName = constructSsmParameterPath({
      windowsVersion: this.windowsVersion,
      windowsCoreVersion: this.windowsCoreVersion,
      generation: this.generation,
      hwType: this.hwType,
      kernel: props?.kernel,
    });

    this.cachedInContext = props?.cachedInContext ?? false;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);

    // Windows OS type for both regular Windows and Windows Core variants
    const osType =
      this.windowsVersion || this.windowsCoreVersion
        ? ec2.OperatingSystemType.WINDOWS
        : ec2.OperatingSystemType.LINUX;

    return {
      imageId: ami,
      osType,
      userData: ec2.UserData.forOperatingSystem(osType),
    };
  }
}

/**
 * Additional configuration properties for EcsOptimizedImage factory functions
 */
export interface EcsOptimizedImageOptions {
  /**
   * Whether the AMI ID is cached to be stable between deployments
   *
   * By default, the newest image is used on each deployment. This will cause
   * instances to be replaced whenever a new version is released, and may cause
   * downtime if there aren't enough running instances in the AutoScalingGroup
   * to reschedule the tasks on.
   *
   * If set to true, the AMI ID will be cached in `cdk.context.json` and the
   * same value will be used on future runs. Your instances will not be replaced
   * but your AMI version will grow old over time. To refresh the AMI lookup,
   * you will have to evict the value from the cache using the `cdk context`
   * command. See https://docs.aws.amazon.com/cdk/latest/guide/context.html for
   * more information.
   *
   * Can not be set to `true` in environment-agnostic stacks.
   *
   * @default false
   */
  readonly cachedInContext?: boolean;

  /**
   * The kernel version to use for Amazon Linux 2.
   *
   * @default - kernel value will be undefined
   */
  readonly kernel?: AmiLinuxKernelVersion;
}

/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedImage implements ec2.IMachineImage {
  /**
   * Construct an Amazon Linux 2023 image from the latest ECS Optimized AMI published in SSM
   *
   * @param hardwareType ECS-optimized AMI variant to use
   */
  public static amazonLinux2023(hardwareType = AmiHardwareType.STANDARD, options: EcsOptimizedImageOptions = {}): EcsOptimizedImage {
    return new EcsOptimizedImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2023,
      hardwareType,
      cachedInContext: options.cachedInContext,
    });
  }

  /**
   * Construct an Amazon Linux 2 image from the latest ECS Optimized AMI published in SSM
   *
   * @param hardwareType ECS-optimized AMI variant to use
   * @param Additional options to configure `EcsOptimizedImage`
   */
  public static amazonLinux2(
    hardwareType = AmiHardwareType.STANDARD,
    options: EcsOptimizedImageOptions = {},
  ): EcsOptimizedImage {
    return new EcsOptimizedImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      hardwareType,
      cachedInContext: options.cachedInContext,
      kernel: options.kernel,
    });
  }

  /**
   * Construct an Amazon Linux AMI image from the latest ECS Optimized AMI published in SSM
   */
  public static amazonLinux(options: EcsOptimizedImageOptions = {}): EcsOptimizedImage {
    return new EcsOptimizedImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX,
      cachedInContext: options.cachedInContext,
    });
  }

  /**
   * Construct a Windows image from the latest ECS Optimized AMI published in SSM
   *
   * @param windowsVersion Windows Version to use
   */
  public static windows(windowsVersion: WindowsOptimizedVersion, options: EcsOptimizedImageOptions = {}): EcsOptimizedImage {
    return new EcsOptimizedImage({
      windowsVersion,
      cachedInContext: options.cachedInContext,
    });
  }

  /**
   * Construct a Windows Server Core image from the latest ECS Optimized AMI published in SSM
   *
   * @param coreVersion Windows Server Core version to use
   */
  public static windowsCore(
    coreVersion: WindowsOptimizedCoreVersion,
    options: EcsOptimizedImageOptions = {},
  ): EcsOptimizedImage {
    return new EcsOptimizedImage({
      windowsCoreVersion: coreVersion,
      cachedInContext: options.cachedInContext,
    });
  }

  private readonly generation?: ec2.AmazonLinuxGeneration;
  private readonly windowsVersion?: WindowsOptimizedVersion;
  private readonly windowsCoreVersion?: WindowsOptimizedCoreVersion;
  private readonly hwType?: AmiHardwareType;

  private readonly amiParameterName: string;
  private readonly cachedInContext: boolean;

  /**
   * Constructs a new instance of the EcsOptimizedAmi class.
   */
  private constructor(props: EcsOptimizedAmiProps) {
    this.hwType = props?.hardwareType;
    this.windowsCoreVersion = props?.windowsCoreVersion;

    // Check for conflicting OS/version specifications
    if (
      (props?.windowsVersion && props?.windowsCoreVersion) ||
      (props?.windowsVersion && props?.generation) ||
      (props?.windowsCoreVersion && props?.generation)
    ) {
      throw new Error(
        'Cannot specify more than one of: windowsVersion, windowsCoreVersion, or generation',
      );
    }

    if (props?.windowsVersion) {
      // Validate hardware type compatibility with Windows
      if (
        props.hardwareType &&
        props.hardwareType !== AmiHardwareType.STANDARD
      ) {
        throw new Error(
          'Windows Server does not support special hardware types',
        );
      }
      this.windowsVersion = props.windowsVersion;
    } else if (props?.windowsCoreVersion) {
      // Validate hardware type compatibility with Windows Core
      if (
        props.hardwareType &&
        props.hardwareType !== AmiHardwareType.STANDARD
      ) {
        throw new Error(
          'Windows Server Core does not support special hardware types',
        );
      }
      this.windowsCoreVersion = props.windowsCoreVersion;
    } else if (props?.generation) {
      // Validate hardware type compatibility with Amazon Linux
      if (
        props.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX &&
        props.hardwareType &&
        props.hardwareType !== AmiHardwareType.STANDARD
      ) {
        throw new Error(
          'Amazon Linux does not support special hardware types. Use Amazon Linux 2 instead',
        );
      }
      this.generation = props.generation;
    } else {
      // Default to Amazon Linux 2 if no OS/version is specified
      this.generation = ec2.AmazonLinuxGeneration.AMAZON_LINUX_2;
    }

    // Use the shared utility function to construct the SSM parameter path
    this.amiParameterName = constructSsmParameterPath({
      windowsVersion: this.windowsVersion,
      windowsCoreVersion: this.windowsCoreVersion,
      generation: this.generation,
      hwType: this.hwType ?? AmiHardwareType.STANDARD,
      kernel: props.kernel,
    });

    this.cachedInContext = props?.cachedInContext ?? false;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);

    // Windows OS type for both regular Windows and Windows Core variants
    const osType =
      this.windowsVersion || this.windowsCoreVersion
        ? ec2.OperatingSystemType.WINDOWS
        : ec2.OperatingSystemType.LINUX;

    return {
      imageId: ami,
      osType,
      userData: ec2.UserData.forOperatingSystem(osType),
    };
  }
}

/**
 * Amazon ECS variant
 */
export enum BottlerocketEcsVariant {
  /**
   * aws-ecs-1 variant
   */
  AWS_ECS_1 = 'aws-ecs-1',
  /**
   * aws-ecs-1-nvidia variant
   */
  AWS_ECS_1_NVIDIA = 'aws-ecs-1-nvidia',
  /**
   * aws-ecs-2 variant
   */
  AWS_ECS_2 = 'aws-ecs-2',
  /**
   * aws-ecs-2-nvidia variant
   */
  AWS_ECS_2_NVIDIA = 'aws-ecs-2-nvidia',
}

/**
 * Properties for BottleRocketImage
 */
export interface BottleRocketImageProps {
  /**
   * The Amazon ECS variant to use.
   *
   * @default - BottlerocketEcsVariant.AWS_ECS_1
   */
  readonly variant?: BottlerocketEcsVariant;

  /**
   * The CPU architecture
   *
   * @default - x86_64
   */
  readonly architecture?: ec2.InstanceArchitecture;

  /**
   * Whether the AMI ID is cached to be stable between deployments
   *
   * By default, the newest image is used on each deployment. This will cause
   * instances to be replaced whenever a new version is released, and may cause
   * downtime if there aren't enough running instances in the AutoScalingGroup
   * to reschedule the tasks on.
   *
   * If set to true, the AMI ID will be cached in `cdk.context.json` and the
   * same value will be used on future runs. Your instances will not be replaced
   * but your AMI version will grow old over time. To refresh the AMI lookup,
   * you will have to evict the value from the cache using the `cdk context`
   * command. See https://docs.aws.amazon.com/cdk/latest/guide/context.html for
   * more information.
   *
   * Can not be set to `true` in environment-agnostic stacks.
   *
   * @default false
   */
  readonly cachedInContext?: boolean;
}

/**
 * Construct an Bottlerocket image from the latest AMI published in SSM
 */
export class BottleRocketImage implements ec2.IMachineImage {
  /**
   * Return whether the given object is a BottleRocketImage
   */
  public static isBottleRocketImage(x: any): x is BottleRocketImage {
    return x !== null && typeof x === 'object' && BR_IMAGE_SYMBOL in x;
  }

  private readonly amiParameterName: string;
  /**
   * Amazon ECS variant for Bottlerocket AMI
   */
  private readonly variant: string;

  /**
   * Instance architecture
   */
  private readonly architecture: ec2.InstanceArchitecture;

  private readonly cachedInContext: boolean;

  /**
   * Constructs a new instance of the BottleRocketImage class.
   */
  public constructor(props: BottleRocketImageProps = {}) {
    this.variant = props.variant ?? BottlerocketEcsVariant.AWS_ECS_1;
    this.architecture = props.architecture ?? ec2.InstanceArchitecture.X86_64;

    // set the SSM parameter name
    this.amiParameterName = `/aws/service/bottlerocket/${this.variant}/${this.architecture}/latest/image_id`;

    this.cachedInContext = props.cachedInContext ?? false;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);

    return {
      imageId: ami,
      osType: ec2.OperatingSystemType.LINUX,
      userData: ec2.UserData.custom(''),
    };
  }
}

Object.defineProperty(BottleRocketImage.prototype, BR_IMAGE_SYMBOL, {
  value: true,
  enumerable: false,
  writable: false,
});

function lookupImage(scope: Construct, cachedInContext: boolean | undefined, parameterName: string) {
  return cachedInContext
    ? ssm.StringParameter.valueFromLookup(scope, parameterName)
    : ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
}
