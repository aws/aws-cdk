import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AwsManagedImageAttributes, IImage, Image, ImageArchitecture, ImageType } from './image';

/**
 * Represents the latest version of an image. When using the image as the base image in a recipe, the recipe will use
 * the latest version at the time of execution.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/ibhow-semantic-versioning.html
 */
const LATEST_VERSION = 'x.x.x';

/**
 * Helper class for working with AWS-managed images
 */
export class AwsManagedImage {
  /**
   * Imports the Amazon Linux 2 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static amazonLinux2(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Amazon Linux 2';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.DOCKER && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-x86-2',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Amazon Linux 2023 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static amazonLinux2023(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Amazon Linux 2023';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2023-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2023-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.DOCKER && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'amazon-linux-2023-x86-2023',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Red Hat Enterprise Linux 10 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static redHatEnterpriseLinux10(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Red Hat Enterprise Linux 10';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'red-hat-enterprise-linux-10-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'red-hat-enterprise-linux-10-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the SUSE Linux Enterprise Server 15 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static suseLinuxEnterpriseServer15(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'SUSE Linux Enterprise Server 15';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'suse-linux-enterprise-server-15-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'suse-linux-enterprise-server-15-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Ubuntu 22.04 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static ubuntuServer2204(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Ubuntu 22.04';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-22-lts-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-22-lts-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.DOCKER && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-22-x86-22-04',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Ubuntu 24.04 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static ubuntuServer2404(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Ubuntu 24.04';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-24-lts-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-server-24-lts-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.DOCKER && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'ubuntu-24-x86-24-04',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2016 Core AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2016Core(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2016 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2016-english-core-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.DOCKER && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2016-x86-core-ltsc2016-amd64',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2016 Full AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2016Full(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2016 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2016-english-full-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2019 Core AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2019Core(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2019 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2019-english-core-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.DOCKER && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2019-x86-core-ltsc2019-amd64',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2019 Full AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2019Full(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2019 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2019-english-full-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2022 Core AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2022Core(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2022 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2022-english-core-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2022 Full AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2022Full(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2022 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2022-english-full-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2025 Core AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2025Core(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2025 Core';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2025-english-core-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the Windows Server 2025 Full AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static windowsServer2025Full(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'Windows Server 2025 Full';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'windows-server-2025-english-full-base-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the macOS 14 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static macOS14(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'macOS 14';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'macos-sonoma-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'macos-sonoma-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports the macOS 14 AWS-managed image
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs The AWS-managed image attributes
   */
  public static macOS15(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    const image = 'macOS 15';
    this.validatePredefinedManagedImageMethodAttributes(scope, attrs, image);

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.X86_64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'macos-sequoia-x86',
        imageVersion: attrs.imageVersion,
      });
    }

    if (attrs.imageType === ImageType.AMI && attrs.imageArchitecture === ImageArchitecture.ARM64) {
      return this.fromAwsManagedImageAttributes(scope, id, {
        imageName: 'macos-sequoia-arm64',
        imageVersion: attrs.imageVersion,
      });
    }

    throw this.defaultValidationError(scope, attrs, image);
  }

  /**
   * Imports an AWS-managed image from its attributes
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param attrs - The AWS-managed image attributes
   */
  public static fromAwsManagedImageAttributes(scope: Construct, id: string, attrs: AwsManagedImageAttributes): IImage {
    if (attrs.imageType !== undefined) {
      throw new cdk.ValidationError(
        'imageType can only be used with pre-defined AWS-managed image methods, such as amazonLinux2023',
        scope,
      );
    }

    if (attrs.imageArchitecture !== undefined) {
      throw new cdk.ValidationError(
        'imageArchitecture can only be used with pre-defined AWS-managed image methods, such as amazonLinux2023',
        scope,
      );
    }

    if (attrs.imageName === undefined) {
      throw new cdk.ValidationError('an AWS-managed image name is required', scope);
    }

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
   * Imports an AWS-managed image from its name
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param awsManagedImageName - The name of the AWS-managed image
   */
  public static fromAwsManagedImageName(scope: Construct, id: string, awsManagedImageName: string): IImage {
    return this.fromAwsManagedImageAttributes(scope, id, { imageName: awsManagedImageName });
  }

  private static validatePredefinedManagedImageMethodAttributes(
    scope: Construct,
    attrs: AwsManagedImageAttributes,
    image: string,
  ) {
    if (attrs.imageName !== undefined) {
      throw new cdk.ValidationError(`a name is not allowed for ${image}`, scope);
    }

    if (attrs.imageArchitecture === undefined) {
      throw new cdk.ValidationError(`an architecture is required for ${image}`, scope);
    }

    if (attrs.imageType === undefined) {
      throw new cdk.ValidationError(`an image type is required for ${image}`, scope);
    }

    if (cdk.Token.isUnresolved(attrs.imageArchitecture)) {
      throw new cdk.ValidationError(`architecture cannot be a token for ${image}`, scope);
    }

    if (cdk.Token.isUnresolved(attrs.imageType)) {
      throw new cdk.ValidationError(`type cannot be a token for ${image}`, scope);
    }
  }

  private static defaultValidationError(
    scope: Construct,
    attrs: AwsManagedImageAttributes,
    image: string,
  ): cdk.ValidationError {
    return new cdk.ValidationError(
      `architecture ${attrs.imageArchitecture} with type ${attrs.imageType} is not a supported architecture and type for ${image}`,
      scope,
    );
  }
}
