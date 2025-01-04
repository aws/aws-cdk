import { Construct } from 'constructs';
import { lookupImage } from './utils';
import { UserData } from '../user-data';

/**
 * Common options across all generations.
 */
export interface AmazonLinuxImageSsmParameterCommonOptions extends AmazonLinuxImageSsmParameterBaseOptions {
  /**
   * What edition of Amazon Linux to use
   *
   * @default AmazonLinuxEdition.Standard
   */
  readonly edition?: AmazonLinuxEdition;

  /**
   * CPU Type
   *
   * @default AmazonLinuxCpuType.X86_64
   */
  readonly cpuType?: AmazonLinuxCpuType;
}

/**
 * Base options for amazon linux ssm parameters
 */
export interface AmazonLinuxImageSsmParameterBaseOptions {
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
   * Adds an additional discriminator to the `cdk.context.json` cache key.
   *
   * @default - no additional cache key
   */
  readonly additionalCacheKey?: string;

  /**
   * Initial user data
   *
   * @default - Empty UserData for Linux machines
   */
  readonly userData?: UserData;
}

/**
 * Base properties for an Amazon Linux SSM Parameter
 */
export interface AmazonLinuxImageSsmParameterBaseProps extends AmazonLinuxImageSsmParameterBaseOptions {
  /**
   * The name of the SSM parameter that contains the AMI value
   */
  readonly parameterName: string;
}

export abstract class AmazonLinuxImageSsmParameterBase implements IMachineImage {
  private readonly cachedInContext: boolean;
  constructor(private readonly props: AmazonLinuxImageSsmParameterBaseProps) {
    this.cachedInContext = this.props.cachedInContext ?? true;
  }

  getImage(scope: Construct): MachineImageConfig {
    const imageId = lookupImage(scope, this.cachedInContext, this.props.parameterName, this.props.additionalCacheKey);

    const osType = OperatingSystemType.LINUX;
    return {
      imageId,
      osType,
      userData: this.props.userData ?? UserData.forLinux(),
    };
  }

}

/**
 * What generation of Amazon Linux to use
 */
export enum AmazonLinuxGeneration {
  /**
   * Amazon Linux
   */
  AMAZON_LINUX = 'amzn',

  /**
   * Amazon Linux 2
   */
  AMAZON_LINUX_2 = 'amzn2',

  /**
   * Amazon Linux 2022
   */
  AMAZON_LINUX_2022 = 'al2022',

  /**
   * Amazon Linux 2023
   */
  AMAZON_LINUX_2023 = 'al2023',
}

/**
 * Interface for classes that can select an appropriate machine image to use
 */
export interface IMachineImage {
  /**
   * Return the image to use in the given context
   */
  getImage(scope: Construct): MachineImageConfig;
}

/**
 * Configuration for a machine image
 */
export interface MachineImageConfig {
  /**
   * The AMI ID of the image to use
   */
  readonly imageId: string;

  /**
   * Operating system type for this image
   */
  readonly osType: OperatingSystemType;

  /**
   * Initial UserData for this image
   */
  readonly userData: UserData;
}

/**
 * The OS type of a particular image
 */
export enum OperatingSystemType {
  LINUX,
  WINDOWS,
  /**
   * Used when the type of the operating system is not known
   * (for example, for imported Auto-Scaling Groups).
   */
  UNKNOWN,
}

/**
 * CPU type
 */
export enum AmazonLinuxCpuType {
  /**
   * arm64 CPU type
   */
  ARM_64 = 'arm64',

  /**
   * x86_64 CPU type
   */
  X86_64 = 'x86_64',
}

/**
 * Amazon Linux edition
 */
export enum AmazonLinuxEdition {
  /**
   * Standard edition
   */
  STANDARD = 'standard',

  /**
   * Minimal edition
   */
  MINIMAL = 'minimal',
}

/**
 * Virtualization type for Amazon Linux
 */
export enum AmazonLinuxVirt {
  /**
   * HVM virtualization (recommended)
   */
  HVM = 'hvm',

  /**
   * PV virtualization
   */
  PV = 'pv',
}

/**
 * Available storage options for Amazon Linux images
 * Only applies to Amazon Linux & Amazon Linux 2
 */
export enum AmazonLinuxStorage {
  /**
   * EBS-backed storage
   */
  EBS = 'ebs',

  /**
   * S3-backed storage
   */
  S3 = 's3',

  /**
   * General Purpose-based storage (recommended)
   */
  GENERAL_PURPOSE = 'gp2',
}
