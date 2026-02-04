import * as cdk from 'aws-cdk-lib';
import type { Construct } from 'constructs';
import type { IImage } from './image';
import { Image, ImageArchitecture, ImageType } from './image';
import { LATEST_VERSION } from './private/constants';

/**
 * Attributes for importing an Amazon-managed image by name (and optionally a version)
 */
export interface AmazonManagedImageAttributes {
  /**
   * The name of the Amazon-managed image. The provided name must be normalized by converting all alphabetical
   * characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  readonly imageName: string;

  /**
   * The version of the Amazon-managed image
   *
   * @default x.x.x
   */
  readonly imageVersion?: string;
}

/**
 * Options for selecting a predefined Amazon-managed image
 */
export interface AmazonManagedImageOptions {
  /**
   * The architecture of the Amazon-managed image
   */
  readonly imageArchitecture: ImageArchitecture;

  /**
   * The type of the Amazon-managed image
   */
  readonly imageType: ImageType;

  /**
   * The version of the Amazon-managed image
   *
   * @default x.x.x
   */
  readonly imageVersion?: string;
}

interface AmazonManagedImageConfig {
  readonly image: string;
  readonly supportedCombinations: { [combo: string]: string };
}

/**
 * Helper class for working with Amazon-managed images
 */
export class AmazonManagedImage {
  /**
   * Imports the Amazon Linux 2 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/linux/al2/ug/index.html
   * @see https://gallery.ecr.aws/amazonlinux/amazonlinux
   */
  public static amazonLinux2(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.AMAZON_LINUX_2_CONFIG);
  }

  /**
   * Imports the Amazon Linux 2023 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/linux/al2023/ug/what-is-amazon-linux.html
   * @see https://gallery.ecr.aws/amazonlinux/amazonlinux
   */
  public static amazonLinux2023(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.AMAZON_LINUX_2023_CONFIG);
  }

  /**
   * Imports the Red Hat Enterprise Linux 10 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://aws.amazon.com/partners/redhat/faqs
   */
  public static redHatEnterpriseLinux10(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.RED_HAT_ENTERPRISE_LINUX_10_CONFIG);
  }

  /**
   * Imports the SUSE Linux Enterprise Server 15 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://aws.amazon.com/linux/commercial-linux/faqs/
   */
  public static suseLinuxEnterpriseServer15(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.SUSE_LINUX_ENTERPRISE_SERVER_15_CONFIG);
  }

  /**
   * Imports the Ubuntu 22.04 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://documentation.ubuntu.com/aws
   * @see https://hub.docker.com/_/ubuntu
   */
  public static ubuntuServer2204(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.UBUNTU_SERVER_22_04_CONFIG);
  }

  /**
   * Imports the Ubuntu 24.04 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://documentation.ubuntu.com/aws
   * @see https://hub.docker.com/_/ubuntu
   */
  public static ubuntuServer2404(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.UBUNTU_SERVER_24_04_CONFIG);
  }

  /**
   * Imports the Windows Server 2016 Core Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   * @see https://hub.docker.com/r/microsoft/windows-servercore
   */
  public static windowsServer2016Core(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2016_CORE_CONFIG);
  }

  /**
   * Imports the Windows Server 2016 Full Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   */
  public static windowsServer2016Full(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2016_FULL_CONFIG);
  }

  /**
   * Imports the Windows Server 2019 Core Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   * @see https://hub.docker.com/r/microsoft/windows-servercore
   */
  public static windowsServer2019Core(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2019_CORE_CONFIG);
  }

  /**
   * Imports the Windows Server 2019 Full Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   */
  public static windowsServer2019Full(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2019_FULL_CONFIG);
  }

  /**
   * Imports the Windows Server 2022 Core Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   */
  public static windowsServer2022Core(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2022_CORE_CONFIG);
  }

  /**
   * Imports the Windows Server 2022 Full Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   */
  public static windowsServer2022Full(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2022_FULL_CONFIG);
  }

  /**
   * Imports the Windows Server 2025 Core Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   */
  public static windowsServer2025Core(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2025_CORE_CONFIG);
  }

  /**
   * Imports the Windows Server 2025 Full Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/ec2/latest/windows-ami-reference/index.html
   */
  public static windowsServer2025Full(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.WINDOWS_SERVER_2025_FULL_CONFIG);
  }

  /**
   * Imports the macOS 14 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-mac-instances.html
   */
  public static macOS14(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.MACOS_14_CONFIG);
  }

  /**
   * Imports the macOS 15 Amazon-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param opts The Amazon-managed image attributes
   *
   * @see https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-mac-instances.html
   */
  public static macOS15(scope: Construct, id: string, opts: AmazonManagedImageOptions): IImage {
    return this.predefinedManagedImage(scope, id, opts, this.MACOS_15_CONFIG);
  }

  /**
   * Imports an Amazon-managed image from its attributes
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs - The Amazon-managed image attributes
   */
  public static fromAmazonManagedImageAttributes(
    scope: Construct,
    id: string,
    attrs: AmazonManagedImageAttributes,
  ): IImage {
    return Image.fromImageArn(
      scope,
      id,
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        account: 'aws',
        resource: 'image',
        resourceName: `${attrs.imageName}/${attrs.imageVersion ?? LATEST_VERSION}`,
      }),
    );
  }

  /**
   * Imports an Amazon-managed image from its name
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param amazonManagedImageName - The name of the Amazon-managed image
   */
  public static fromAmazonManagedImageName(scope: Construct, id: string, amazonManagedImageName: string): IImage {
    return this.fromAmazonManagedImageAttributes(scope, id, { imageName: amazonManagedImageName });
  }

  private static readonly AMAZON_LINUX_2_CONFIG: AmazonManagedImageConfig = {
    image: 'Amazon Linux 2',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'amazon-linux-2-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'amazon-linux-2-arm64',
      [`${ImageType.DOCKER}-${ImageArchitecture.X86_64}`]: 'amazon-linux-x86-2',
    },
  };

  private static readonly AMAZON_LINUX_2023_CONFIG: AmazonManagedImageConfig = {
    image: 'Amazon Linux 2023',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'amazon-linux-2023-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'amazon-linux-2023-arm64',
      [`${ImageType.DOCKER}-${ImageArchitecture.X86_64}`]: 'amazon-linux-2023-x86-2023',
    },
  };

  private static readonly RED_HAT_ENTERPRISE_LINUX_10_CONFIG: AmazonManagedImageConfig = {
    image: 'Red Hat Enterprise Linux 10',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'red-hat-enterprise-linux-10-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'red-hat-enterprise-linux-10-arm64',
    },
  };

  private static readonly SUSE_LINUX_ENTERPRISE_SERVER_15_CONFIG: AmazonManagedImageConfig = {
    image: 'SUSE Linux Enterprise Server 15',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'suse-linux-enterprise-server-15-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'suse-linux-enterprise-server-15-arm64',
    },
  };

  private static readonly UBUNTU_SERVER_22_04_CONFIG: AmazonManagedImageConfig = {
    image: 'Ubuntu 22.04',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'ubuntu-server-22-lts-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'ubuntu-server-22-lts-arm64',
      [`${ImageType.DOCKER}-${ImageArchitecture.X86_64}`]: 'ubuntu-22-x86-22-04',
    },
  };

  private static readonly UBUNTU_SERVER_24_04_CONFIG: AmazonManagedImageConfig = {
    image: 'Ubuntu 24.04',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'ubuntu-server-24-lts-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'ubuntu-server-24-lts-arm64',
      [`${ImageType.DOCKER}-${ImageArchitecture.X86_64}`]: 'ubuntu-24-x86-24-04',
    },
  };

  private static readonly WINDOWS_SERVER_2016_CORE_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2016 Core',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2016-english-core-base-x86',
      [`${ImageType.DOCKER}-${ImageArchitecture.X86_64}`]: 'windows-server-2016-x86-core-ltsc2016-amd64',
    },
  };

  private static readonly WINDOWS_SERVER_2016_FULL_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2016 Full',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2016-english-full-base-x86',
    },
  };

  private static readonly WINDOWS_SERVER_2019_CORE_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2019 Core',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2019-english-core-base-x86',
      [`${ImageType.DOCKER}-${ImageArchitecture.X86_64}`]: 'windows-server-2019-x86-core-ltsc2019-amd64',
    },
  };

  private static readonly WINDOWS_SERVER_2019_FULL_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2019 Full',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2019-english-full-base-x86',
    },
  };

  private static readonly WINDOWS_SERVER_2022_CORE_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2022 Core',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2022-english-core-base-x86',
    },
  };

  private static readonly WINDOWS_SERVER_2022_FULL_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2022 Full',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2022-english-full-base-x86',
    },
  };

  private static readonly WINDOWS_SERVER_2025_CORE_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2025 Core',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2025-english-core-base-x86',
    },
  };

  private static readonly WINDOWS_SERVER_2025_FULL_CONFIG: AmazonManagedImageConfig = {
    image: 'Windows Server 2025 Full',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'windows-server-2025-english-full-base-x86',
    },
  };

  private static readonly MACOS_14_CONFIG: AmazonManagedImageConfig = {
    image: 'macOS 14',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'macos-sonoma-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'macos-sonoma-arm64',
    },
  };

  private static readonly MACOS_15_CONFIG: AmazonManagedImageConfig = {
    image: 'macOS 15',
    supportedCombinations: {
      [`${ImageType.AMI}-${ImageArchitecture.X86_64}`]: 'macos-sequoia-x86',
      [`${ImageType.AMI}-${ImageArchitecture.ARM64}`]: 'macos-sequoia-arm64',
    },
  };

  private static validatePredefinedManagedImageOptions(
    scope: Construct,
    opts: AmazonManagedImageOptions,
    image: string,
  ) {
    if (cdk.Token.isUnresolved(opts.imageArchitecture)) {
      throw new cdk.ValidationError(`architecture cannot be a token for ${image}`, scope);
    }

    if (cdk.Token.isUnresolved(opts.imageType)) {
      throw new cdk.ValidationError(`type cannot be a token for ${image}`, scope);
    }
  }

  private static predefinedManagedImage(
    scope: Construct,
    id: string,
    opts: AmazonManagedImageOptions,
    config: AmazonManagedImageConfig,
  ): IImage {
    this.validatePredefinedManagedImageOptions(scope, opts, config.image);

    const key = `${opts.imageType}-${opts.imageArchitecture}`;
    const imageName = config.supportedCombinations[key];

    if (!imageName) {
      throw new cdk.ValidationError(
        `architecture ${opts.imageArchitecture} with type ${opts.imageType} is not a supported architecture and type for ${config.image}`,
        scope,
      );
    }

    return this.fromAmazonManagedImageAttributes(scope, id, {
      imageName,
      imageVersion: opts.imageVersion,
    });
  }
}
