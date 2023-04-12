import { AmazonLinuxCpuType, AmazonLinuxEdition, AmazonLinuxGeneration, AmazonLinuxImageBase, AmazonLinuxImageCommonOptions } from './common';


export class AmazonLinux2023Kernel {
  /**
   * The latest kernel version currently available in a published AMI.
   */
  public static readonly LATEST = new AmazonLinux2023Kernel('6.1');

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
 * Storage doesn't apply to al2023 for example
 */
export interface AmazonLinux2023ImageProps extends AmazonLinuxImageCommonOptions {
  /**
   * What kernel version of Amazon Linux to use
   *
   * @default AmazonLinux2023Kernel.DEFAULT
   */
  readonly kernel?: AmazonLinux2023Kernel;
}


export class AmazonLinux2023Image extends AmazonLinuxImageBase {
  /**
   * Generates a SSM Parameter name for a specific amazon linux 2022 AMI
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
  public static ssmParameterName(props: AmazonLinux2023ImageProps): string {
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

  constructor(props: AmazonLinux2023ImageProps) {
    super({
      parameterName: AmazonLinux2023Image.ssmParameterName(props),
      cachedInContext: props.cachedInContext,
      userData: props.userData,
    });
  }
}
