import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { IImage, Image, ImageArchitecture, ImageType } from './image';
import { LATEST_VERSION } from './private/constants';

/**
 * Properties for an EC2 Image Builder Amazon-managed image
 */
export interface AmazonManagedImageNameAttributes {
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
 * Properties for an EC2 Image Builder Amazon-managed image
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
    const image = 'Amazon Linux 2';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.DOCKER && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-x86-2',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Amazon Linux 2023';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2023-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2023-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.DOCKER && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2023-x86-2023',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Red Hat Enterprise Linux 10';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'red-hat-enterprise-linux-10-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'red-hat-enterprise-linux-10-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'SUSE Linux Enterprise Server 15';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'suse-linux-enterprise-server-15-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'suse-linux-enterprise-server-15-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Ubuntu 22.04';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-22-lts-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-22-lts-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.DOCKER && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-22-x86-22-04',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Ubuntu 24.04';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-24-lts-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-24-lts-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.DOCKER && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-24-x86-24-04',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2016 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2016-english-core-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.DOCKER && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2016-x86-core-ltsc2016-amd64',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2016 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2016-english-full-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2019 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2019-english-core-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.DOCKER && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2019-x86-core-ltsc2019-amd64',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2019 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2019-english-full-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2022 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2022-english-core-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2022 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2022-english-full-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2025 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2025-english-core-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'Windows Server 2025 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2025-english-full-base-x86',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'macOS 14';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'macos-sonoma-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'macos-sonoma-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    const image = 'macOS 15';
    this.validatePredefinedManagedImageMethodAttributes(scope, opts, image);

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'macos-sequoia-x86',
        imageVersion: opts.imageVersion,
      });
    }

    if (opts.imageType === ImageType.AMI && opts.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAmazonManagedImageAttributes(scope, id, {
        imageName: 'macos-sequoia-arm64',
        imageVersion: opts.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, opts, image);
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
    attrs: AmazonManagedImageNameAttributes,
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

  private static validatePredefinedManagedImageMethodAttributes(
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

  private static defaultValidationError(
    scope: Construct,
    opts: AmazonManagedImageOptions,
    image: string,
  ): cdk.ValidationError {
    return new cdk.ValidationError(
      `architecture ${opts.imageArchitecture} with type ${opts.imageType} is not a supported architecture and type for ${image}`,
      scope,
    );
  }
}
