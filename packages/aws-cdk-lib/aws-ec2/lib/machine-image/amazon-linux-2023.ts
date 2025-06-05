import { AmazonLinuxCpuType, AmazonLinuxEdition, AmazonLinuxGeneration, AmazonLinuxImageSsmParameterCommonOptions, AmazonLinuxImageSsmParameterBase } from './common';

/**
 * Amazon Linux 2023 kernel versions
 */
export class AmazonLinux2023Kernel {
  /**
   * The latest kernel version currently available in a published AMI.
   *
   * When a new kernel version is available for an al2023 AMI this will be
   * updated to contain the latest kernel version and will cause your instances
   * to be replaced. Do not store stateful information on the instance if you are
   * using this version.
   */
  public static readonly CDK_LATEST = new AmazonLinux2023Kernel('6.1');

  /**
   * The default kernel version for Amazon Linux 2023 is 6.1 and
   * the SSM parameter does not include it in the name
   * (i.e. /aws/service/ami-amazon-linux-latest/amzn2023-ami-kernel-default-x86_64)
   */
  public static readonly DEFAULT = new AmazonLinux2023Kernel('default');

  /**
   * Kernel version 6.1
   */
  public static readonly KERNEL_6_1 = new AmazonLinux2023Kernel('6.1');
  constructor(private readonly version: string) { }

  /**
   * Generate a string representation of the kernel
   */
  public toString(): string {
    return `kernel-${this.version}`;
  }
}

/**
 * Properties specific to al2023 images
 */
export interface AmazonLinux2023ImageSsmParameterProps extends AmazonLinuxImageSsmParameterCommonOptions {
  /**
   * What kernel version of Amazon Linux to use
   *
   * @default AmazonLinux2023Kernel.DEFAULT
   */
  readonly kernel?: AmazonLinux2023Kernel;
}

/**
 * A SSM Parameter that contains the AMI ID for Amazon Linux 2023
 */
export class AmazonLinux2023ImageSsmParameter extends AmazonLinuxImageSsmParameterBase {
  /**
   * Generates a SSM Parameter name for a specific amazon linux 2023 AMI
   *
   * Example values:
   *
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-arm64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-6.1-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-6.1-arm64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-6.1-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-arm64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-minimal-kernel-default-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64",
   */
  public static ssmParameterName(props: AmazonLinux2023ImageSsmParameterProps): string {
    const edition = (props && props.edition) || AmazonLinuxEdition.STANDARD;

    const parts: Array<string|undefined> = [
      AmazonLinuxGeneration.AMAZON_LINUX_2023,
      'ami',
      edition !== AmazonLinuxEdition.STANDARD ? edition : undefined,
      (props.kernel ?? AmazonLinux2023Kernel.DEFAULT)?.toString(),
      props.cpuType ?? AmazonLinuxCpuType.X86_64,
    ].filter(x => !!x);

    return '/aws/service/ami-amazon-linux-latest/' + parts.join('-');
  }

  constructor(props: AmazonLinux2023ImageSsmParameterProps = {}) {
    super({
      parameterName: AmazonLinux2023ImageSsmParameter.ssmParameterName(props),
      cachedInContext: props.cachedInContext,
      additionalCacheKey: props.additionalCacheKey,
      userData: props.userData,
    });
  }
}
