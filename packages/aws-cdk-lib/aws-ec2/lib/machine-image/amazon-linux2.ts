import { AmazonLinuxCpuType, AmazonLinuxEdition, AmazonLinuxGeneration, AmazonLinuxImageBase, AmazonLinuxImageCommonOptions, AmazonLinuxStorage, AmazonLinuxVirt } from './common';


export class AmazonLinux2Kernel {
  /**
   * The latest kernel version currently available in a published AMI.
   */
  public static readonly LATEST = new AmazonLinux2Kernel('5.10');

  /**
   * The default kernel version for Amazon Linux 2 is 4.14 and
   * Linux 4.14.311-233.529.amzn2.x86_64
   * the SSM parameter does not include it in the name
   * (i.e. /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2)
   */
  public static readonly DEFAULT = new AmazonLinux2Kernel('default');

  /**
   * Kernel version 5.10
   */
  public static readonly KERNEL_5_10 = new AmazonLinux2Kernel('5.10');

  constructor(private readonly version: string) { }

  /**
   * Generate a string representation of the kernel
   */
  public toString(): string | undefined {
    return this.version === 'default'
      ? undefined
      : `kernel-${this.version}`;
  }
}

/**
 * Storage doesn't apply to al2022 for example
 */
export interface AmazonLinux2ImageProps extends AmazonLinuxImageCommonOptions {
  /**
   * What storage backed image to use
   *
   * @default GeneralPurpose
   */
  readonly storage?: AmazonLinuxStorage;

  /**
   * What kernel version of Amazon Linux to use
   *
   * @default -
   */
  readonly kernel?: AmazonLinux2Kernel;

  /**
   * Virtualization type
   *
   * @default HVM
   */
  readonly virtualization?: AmazonLinuxVirt;
}

export class AmazonLinux2Image extends AmazonLinuxImageBase {
  /**
   * Generates a SSM Parameter name for a specific amazon linux 2 AMI
   *
   * Example values:
   *
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-ebs",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-kernel-5.10-hvm-x86_64-ebs",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-arm64-gp2",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-minimal-hvm-arm64-ebs",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-kernel-5.10-hvm-arm64-gp2",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-kernel-5.10-hvm-x86_64-gp2",
   *     "/aws/service/ami-amazon-linux-latest/amzn2-ami-minimal-hvm-x86_64-ebs"
   */
  public static ssmParameterName(props: AmazonLinux2ImageProps): string {
    const edition = (props && props.edition) || AmazonLinuxEdition.STANDARD;

    const parts: Array<string|undefined> = [
      AmazonLinuxGeneration.AMAZON_LINUX_2,
      'ami',
      edition !== AmazonLinuxEdition.STANDARD ? edition : undefined,
      props.kernel?.toString(),
      props.virtualization ?? AmazonLinuxVirt.HVM,
      props.cpuType ?? AmazonLinuxCpuType.X86_64,
      props.storage ?? AmazonLinuxStorage.GENERAL_PURPOSE,
    ].filter(x => !!x);

    return '/aws/service/ami-amazon-linux-latest/' + parts.join('-');
  }

  constructor(props: AmazonLinux2ImageProps) {
    super({
      parameterName: AmazonLinux2Image.ssmParameterName(props),
      cachedInContext: props.cachedInContext,
      userData: props.userData,
    });
  }
}
