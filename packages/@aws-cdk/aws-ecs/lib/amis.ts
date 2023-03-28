import * as ec2 from '@aws-cdk/aws-ec2';
import * as ssm from '@aws-cdk/aws-ssm';

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
}


/**
 * ECS-optimized Windows version list
 */
export enum WindowsOptimizedVersion {
  SERVER_2019 = '2019',
  SERVER_2016 = '2016',
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
  private readonly hwType: AmiHardwareType;

  private readonly amiParameterName: string;
  private readonly cachedInContext: boolean;

  /**
   * Constructs a new instance of the EcsOptimizedAmi class.
   */
  constructor(props?: EcsOptimizedAmiProps) {
    this.hwType = (props && props.hardwareType) || AmiHardwareType.STANDARD;
    if (props && props.generation) { // generation defined in the props object
      if (props.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX && this.hwType !== AmiHardwareType.STANDARD) {
        throw new Error('Amazon Linux does not support special hardware type. Use Amazon Linux 2 instead');
      } else if (props.windowsVersion) {
        throw new Error('"windowsVersion" and Linux image "generation" cannot be both set');
      } else {
        this.generation = props.generation;
      }
    } else if (props && props.windowsVersion) {
      if (this.hwType !== AmiHardwareType.STANDARD) {
        throw new Error('Windows Server does not support special hardware type');
      } else {
        this.windowsVersion = props.windowsVersion;
      }
    } else { // generation not defined in props object
      // always default to Amazon Linux v2 regardless of HW
      this.generation = ec2.AmazonLinuxGeneration.AMAZON_LINUX_2;
    }

    // set the SSM parameter name
    this.amiParameterName = '/aws/service/ecs/optimized-ami/'
      + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX ? 'amazon-linux/' : '')
      + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 ? 'amazon-linux-2/' : '')
      + (this.windowsVersion ? `windows_server/${this.windowsVersion}/english/full/` : '')
      + (this.hwType === AmiHardwareType.GPU ? 'gpu/' : '')
      + (this.hwType === AmiHardwareType.ARM ? 'arm64/' : '')
      + 'recommended/image_id';

    this.cachedInContext = props?.cachedInContext ?? false;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);

    const osType = this.windowsVersion ? ec2.OperatingSystemType.WINDOWS : ec2.OperatingSystemType.LINUX;
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
}

/**
 * Construct a Linux or Windows machine image from the latest ECS Optimized AMI published in SSM
 */
export class EcsOptimizedImage implements ec2.IMachineImage {
  /**
   * Construct an Amazon Linux 2 image from the latest ECS Optimized AMI published in SSM
   *
   * @param hardwareType ECS-optimized AMI variant to use
   */
  public static amazonLinux2(hardwareType = AmiHardwareType.STANDARD, options: EcsOptimizedImageOptions = {}): EcsOptimizedImage {
    return new EcsOptimizedImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      hardwareType,
      cachedInContext: options.cachedInContext,
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

  private readonly generation?: ec2.AmazonLinuxGeneration;
  private readonly windowsVersion?: WindowsOptimizedVersion;
  private readonly hwType?: AmiHardwareType;

  private readonly amiParameterName: string;
  private readonly cachedInContext: boolean;

  /**
   * Constructs a new instance of the EcsOptimizedAmi class.
   */
  private constructor(props: EcsOptimizedAmiProps) {
    this.hwType = props && props.hardwareType;

    if (props.windowsVersion) {
      this.windowsVersion = props.windowsVersion;
    } else if (props.generation) {
      this.generation = props.generation;
    } else {
      throw new Error('This error should never be thrown');
    }

    // set the SSM parameter name
    this.amiParameterName = '/aws/service/ecs/optimized-ami/'
      + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX ? 'amazon-linux/' : '')
      + (this.generation === ec2.AmazonLinuxGeneration.AMAZON_LINUX_2 ? 'amazon-linux-2/' : '')
      + (this.windowsVersion ? `windows_server/${this.windowsVersion}/english/full/` : '')
      + (this.hwType === AmiHardwareType.GPU ? 'gpu/' : '')
      + (this.hwType === AmiHardwareType.ARM ? 'arm64/' : '')
      + 'recommended/image_id';

    this.cachedInContext = props?.cachedInContext ?? false;
  }

  /**
   * Return the correct image
   */
  public getImage(scope: Construct): ec2.MachineImageConfig {
    const ami = lookupImage(scope, this.cachedInContext, this.amiParameterName);

    const osType = this.windowsVersion ? ec2.OperatingSystemType.WINDOWS : ec2.OperatingSystemType.LINUX;
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
  AWS_ECS_1 = 'aws-ecs-1'

}

/**
 * Properties for BottleRocketImage
 */
export interface BottleRocketImageProps {
  /**
   * The Amazon ECS variant to use.
   * Only `aws-ecs-1` is currently available
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
