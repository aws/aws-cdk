import { AmazonLinuxCpuType, AmazonLinuxEdition, AmazonLinuxGeneration, AmazonLinuxImageSsmParameterCommonOptions, AmazonLinuxImageSsmParameterBase } from './common';

/**
 * Amazon Linux 2022 kernel versions
 */
export class AmazonLinux2022Kernel {
  /**
   * The latest kernel version currently available in a published AMI.
   *
   * When a new kernel version is available for an al2022 AMI this will be
   * updated to contain the latest kernel version and will cause your instances
   * to be replaced. Do not store stateful information on the instance if you are
   * using this version.
   */
  public static readonly CDK_LATEST = new AmazonLinux2022Kernel('5.15');

  /**
   * The default kernel version for Amazon Linux 2022 is 5.15 and
   * the SSM parameter does not include it in the name
   * (i.e. /aws/service/ami-amazon-linux-latest/amzn2022-ami-kernel-default-x86_64)
   */
  public static readonly DEFAULT = new AmazonLinux2022Kernel('default');

  /**
   * Kernel version 5.15
   */
  public static readonly KERNEL_5_15 = new AmazonLinux2022Kernel('5.15');

  constructor(private readonly version: string) { }

  /**
   * Generate a string representation of the kernel
   */
  public toString(): string {
    return `kernel-${this.version}`;
  }
}

/**
 * Properties specific to al2022 images
 */
export interface AmazonLinux2022ImageSsmParameterProps extends AmazonLinuxImageSsmParameterCommonOptions {
  /**
   * What kernel version of Amazon Linux to use
   *
   * @default AmazonLinux2022Kernel.DEFAULT
   */
  readonly kernel?: AmazonLinux2022Kernel;
}

/**
 * A SSM Parameter that contains the AMI ID for Amazon Linux 2023
 */
export class AmazonLinux2022ImageSsmParameter extends AmazonLinuxImageSsmParameterBase {
  /**
   * Generates a SSM Parameter name for a specific amazon linux 2022 AMI
   *
   * Example values:
   *
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-kernel-5.15-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-kernel-default-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-minimal-kernel-5.15-arm64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-minimal-kernel-5.15-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-kernel-5.15-arm64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-minimal-kernel-default-arm64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-minimal-kernel-default-x86_64",
   *     "/aws/service/ami-amazon-linux-latest/al2022-ami-kernel-default-arm64",
   */
  public static ssmParameterName(props: AmazonLinux2022ImageSsmParameterProps): string {
    const edition = (props && props.edition) || AmazonLinuxEdition.STANDARD;

    const parts: Array<string|undefined> = [
      AmazonLinuxGeneration.AMAZON_LINUX_2022,
      'ami',
      edition !== AmazonLinuxEdition.STANDARD ? edition : undefined,
      props.kernel?.toString(),
      props.cpuType ?? AmazonLinuxCpuType.X86_64,
    ].filter(x => !!x);

    return '/aws/service/ami-amazon-linux-latest/' + parts.join('-');
  }

  constructor(props: AmazonLinux2022ImageSsmParameterProps) {
    super({
      parameterName: AmazonLinux2022ImageSsmParameter.ssmParameterName(props),
      cachedInContext: props.cachedInContext,
      additionalCacheKey: props.additionalCacheKey,
      userData: props.userData,
    });
  }
}
