import * as cdk from 'aws-cdk-lib';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnImage } from 'aws-cdk-lib/aws-imagebuilder';
import * as logs from 'aws-cdk-lib/aws-logs';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { BaseContainerImage, BaseImage } from './base-image';
import { IDistributionConfiguration } from './distribution-configuration';
import { IInfrastructureConfiguration, InfrastructureConfiguration } from './infrastructure-configuration';
import {
  buildImageScanningConfiguration,
  buildImageTestsConfiguration,
  buildWorkflows,
} from './private/image-and-pipeline-props-helper';
import { defaultExecutionRolePolicy, getExecutionRole } from './private/policy-helper';
import { IRecipeBase } from './recipe-base';
import { WorkflowConfiguration } from './workflow';

const IMAGE_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.Image');

/**
 * Represents the latest version of an image recipe. When using the recipe in a pipeline, the pipeline will use the
 * latest recipe at the time of execution.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/ibhow-semantic-versioning.html
 */
const LATEST_VERSION = 'x.x.x';

/**
 * Properties for creating an Image resource
 */
export interface IImage extends cdk.IResource {
  /**
   * The ARN of the image
   *
   * @attribute
   */
  readonly imageArn: string;

  /**
   * The name of the image
   *
   * @attribute
   */
  readonly imageName: string;

  /**
   * The version of the image
   *
   * @attribute
   */
  readonly imageVersion: string;

  /**
   * Grant custom actions to the given grantee for the image
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grants the default permissions for building an image to the provided execution role.
   *
   * @param grantee The execution role used for the image build.
   */
  grantDefaultExecutionRolePermissions(grantee: iam.IGrantable): iam.Grant[];

  /**
   * Grant read permissions to the given grantee for the image
   *
   * @param grantee The principal
   */
  grantRead(grantee: iam.IGrantable): iam.Grant;

  /**
   * Converts the image to a BaseImage, to use as the parent image in an image recipe
   */
  toBaseImage(): BaseImage;

  /**
   * Converts the image to a ContainerBaseImage, to use as the parent image in a container recipe
   */
  toContainerBaseImage(): BaseContainerImage;
}

/**
 * Properties for creating an Image resource
 */
export interface ImageProps {
  /**
   * The recipe that defines the base image, components, and customizations used to build the image. This can either be
   * an image recipe, or a container recipe.
   */
  readonly recipe: IRecipeBase;

  /**
   * The infrastructure configuration used for building the image.
   *
   * A default infrastructure configuration will be used if one is not provided.
   *
   * The default configuration will create an instance profile and role with minimal permissions needed to build the
   * image, attached to the EC2 instance.
   *
   * IMDSv2 will be required by default on the instances used to build and test the image.
   *
   * @default - an infrastructure configuration will be created with the default settings
   */
  readonly infrastructureConfiguration?: IInfrastructureConfiguration;

  /**
   * The distribution configuration used for distributing the image.
   *
   * @default None
   */
  readonly distributionConfiguration?: IDistributionConfiguration;

  /**
   * The list of workflow configurations used to build the image.
   *
   * @default - Image Builder will use a default set of workflows for the build to build, test, and distribute the
   * image
   */
  readonly workflows?: WorkflowConfiguration[];

  /**
   * The execution role used to perform workflow actions to build the image.
   *
   * By default, the Image Builder Service Linked Role (SLR) will be created automatically and used as the execution
   * role. However, when providing a custom set of image workflows for the pipeline, an execution role will be
   * generated with the minimal permissions needed to execute the workflows.
   *
   * @default - Image Builder will use the SLR if possible. Otherwise, an execution role will be generated
   */
  readonly executionRole?: iam.IRole;

  /**
   * The log group to use for the image. By default, a log group will be created with the format
   * `/aws/imagebuilder/<image-name>`
   *
   * @default - a log group will be created
   */
  readonly logGroup?: logs.ILogGroup;

  /**
   * Indicates whether Image Builder keeps a snapshot of the vulnerability scans that Amazon Inspector runs against the
   * build instance when you create a new image.
   *
   * @default false
   */
  readonly imageScanningEnabled?: boolean;

  /**
   * The container repository that Amazon Inspector scans to identify findings for your container images. If a
   * repository is not provided, Image Builder creates a repository named `image-builder-image-scanning-repository`
   * for vulnerability scanning.
   *
   * @default - if scanning is enabled, a repository will be created by Image Builder if one is not provided
   */
  readonly imageScanningEcrRepository?: ecr.IRepository;

  /**
   * The tags for Image Builder to apply to the output container image that Amazon Inspector scans.
   *
   * @default None
   */
  readonly imageScanningEcrTags?: string[];

  /**
   * If enabled, collects additional information about the image being created, including the operating system (OS)
   * version and package list for the AMI.
   *
   * @default true
   */
  readonly enhancedImageMetadataEnabled?: boolean;

  /**
   * Whether to run tests after building an image.
   *
   * @default true
   */
  readonly imageTestsEnabled?: boolean;

  /**
   * The tags to apply to the image
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * Properties for an EC2 Image Builder image
 */
export interface ImageAttributes {
  /**
   * The ARN of the image
   *
   * @default - derived from the imageName
   */
  readonly imageArn?: string;

  /**
   * The name of the image
   *
   * @default - derived from the imageArn
   */
  readonly imageName?: string;

  /**
   * The version of the image
   *
   * @default - the latest version of the image, x.x.x
   */
  readonly imageVersion?: string;
}

/**
 * The architecture of the image
 */
export enum ImageArchitecture {
  /**
   * 64 bit architecture with the ARM instruction set
   */
  ARM64 = 'arm64',

  /**
   * 64 bit architecture with x86 instruction set
   */
  X86_64 = 'x86_64',
}

/**
 * The type of the image
 */
export enum ImageType {
  /**
   * Indicates the image produced is an AMI
   */
  AMI = 'AMI',

  /**
   * Indicates the image produced is a Docker image
   */
  DOCKER = 'DOCKER',
}

/**
 * Properties for an EC2 Image Builder AWS-managed image
 */
export interface AwsManagedImageAttributes {
  /**
   * The architecture of the AWS-managed image
   *
   * @default - derived automatically if referencing a managed image by name, otherwise an architecture is required when
   * using the pre-defined managed image methods
   */
  readonly imageArchitecture?: ImageArchitecture;

  /**
   * The name of the AWS-managed image. The provided name must be normalized by converting all alphabetical characters
   * to lowercase, and replacing all spaces and underscores with hyphens.
   *
   * @default - none if using the pre-defined managed image methods, otherwise this is required
   */
  readonly imageName?: string;

  /**
   * The type of the AWS-managed image
   *
   * @default - derived automatically if referencing a managed image by name, otherwise an image type is required when
   * using the pre-defined managed image methods
   */
  readonly imageType?: ImageType;

  /**
   * The version of the AWS-managed image
   *
   * @default x.x.x
   */
  readonly imageVersion?: string;
}

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

/**
 * A new or imported Image
 */
abstract class ImageBase extends cdk.Resource implements IImage {
  /**
   * The ARN of the image
   */
  abstract readonly imageArn: string;

  /**
   * The name of the image
   */
  abstract readonly imageName: string;

  /**
   * The version of the image
   */
  abstract readonly imageVersion: string;

  /**
   * Grant custom actions to the given grantee for the image
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      resourceArns: [this.imageArn],
      actions,
    });
  }

  /**
   * Grants the default permissions for building an image to the provided execution role.
   *
   * @param grantee The execution role used for the image build.
   */
  public grantDefaultExecutionRolePermissions(grantee: iam.IGrantable): iam.Grant[] {
    const policies = defaultExecutionRolePolicy(this);
    return policies.map((policy) =>
      iam.Grant.addToPrincipal({
        grantee: grantee,
        resourceArns: policy.resources,
        actions: policy.actions,
        conditions: policy.conditions,
        scope: this,
      }),
    );
  }

  /**
   * Grant read permissions to the given grantee for the image
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetImage');
  }

  /**
   * Converts the image to a BaseImage, to use as the parent image in an image recipe
   */
  public toBaseImage(): BaseImage {
    return BaseImage.fromImage(this);
  }

  /**
   * Converts the image to a ContainerBaseImage, to use as the parent image in a container recipe
   */
  public toContainerBaseImage(): BaseContainerImage {
    return BaseContainerImage.fromImage(this);
  }
}

/**
 * Represents an EC2 Image Builder Image.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/create-images.html
 */
@propertyInjectable
export class Image extends ImageBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.Image';

  /**
   * Import an existing image pipeline given its ARN.
   */
  public static fromImageArn(scope: Construct, id: string, imageArn: string): IImage {
    return this.fromImageAttributes(scope, id, { imageArn });
  }

  /**
   * Import an existing image given its name. The provided name must be normalized by converting all alphabetical
   * characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  public static fromImageName(scope: Construct, id: string, imageName: string): IImage {
    return this.fromImageAttributes(scope, id, { imageName });
  }

  /**
   * Import an existing image by providing its attributes. If the image name is provided as an attribute, it must be
   * normalized by converting all alphabetical characters to lowercase, and replacing all spaces and underscores with
   * hyphens.
   */
  public static fromImageAttributes(scope: Construct, id: string, attrs: ImageAttributes): IImage {
    if (!attrs.imageArn && !attrs.imageName) {
      throw new cdk.ValidationError('either imageArn or imageName is required', scope);
    }

    const imageArn =
      attrs.imageArn ??
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'image',
        resourceName: `${attrs.imageName}/${attrs.imageVersion ?? LATEST_VERSION}`,
      });

    const [imageName, imageVersion] = (() => {
      if (attrs.imageName) {
        return [attrs.imageName, attrs.imageVersion ?? LATEST_VERSION];
      }

      const imageNameVersion = cdk.Stack.of(scope).splitArn(imageArn, cdk.ArnFormat.SLASH_RESOURCE_NAME).resourceName!;

      const imageNameVersionSplit = cdk.Fn.split('/', imageNameVersion);
      return [cdk.Fn.select(0, imageNameVersionSplit), cdk.Fn.select(1, imageNameVersionSplit)];
    })();

    class Import extends ImageBase {
      public readonly imageArn = imageArn;
      public readonly imageName = imageName;
      public readonly imageVersion = imageVersion;
    }

    return new Import(scope, id);
  }

  /**
   * Return whether the given object is an Image.
   */
  public static isImage(x: any): x is Image {
    return x !== null && typeof x === 'object' && IMAGE_SYMBOL in x;
  }

  /**
   * The ARN of the image
   */
  public readonly imageArn: string;

  /**
   * The name of the image
   */
  public readonly imageName: string;

  /**
   * The version of the image
   */
  public readonly imageVersion: string;

  /**
   * The AMI ID of the EC2 AMI, or URI for the container
   *
   * @attribute
   */
  public readonly imageId: string;

  /**
   * The infrastructure configuration used for the image build
   */
  public readonly infrastructureConfiguration: IInfrastructureConfiguration;

  /**
   * The execution role used for the image build
   */
  public readonly executionRole?: iam.IRole;

  private readonly props: ImageProps;

  public constructor(scope: Construct, id: string, props: ImageProps) {
    super(scope, id);

    Object.defineProperty(this, IMAGE_SYMBOL, { value: true });

    this.props = props;
    this.infrastructureConfiguration =
      props.infrastructureConfiguration ?? new InfrastructureConfiguration(this, 'InfrastructureConfiguration');
    this.executionRole = getExecutionRole(
      this,
      (grantee: iam.IGrantable) => this.grantDefaultExecutionRolePermissions(grantee),
      {
        ...props,
        imageLogGroup: props.logGroup,
      },
    );

    if (InfrastructureConfiguration.isInfrastructureConfiguration(this.infrastructureConfiguration)) {
      this.infrastructureConfiguration._bind({ isContainerBuild: props.recipe._isContainerRecipe() });
    }

    if (props.recipe._isImageRecipe() && props.recipe._isContainerRecipe()) {
      throw new cdk.ValidationError('the recipe cannot be both an IImageRecipe and an IContainerRecipe', this);
    }

    if (!props.recipe._isImageRecipe() && !props.recipe._isContainerRecipe()) {
      throw new cdk.ValidationError('the recipe must either be an IImageRecipe or IContainerRecipe', this);
    }

    const image = new CfnImage(this, 'Resource', {
      ...(props.recipe._isImageRecipe() && { imageRecipeArn: props.recipe.imageRecipeArn }),
      ...(props.recipe._isContainerRecipe() && { containerRecipeArn: props.recipe.containerRecipeArn }),
      infrastructureConfigurationArn: this.infrastructureConfiguration.infrastructureConfigurationArn,
      distributionConfigurationArn: props.distributionConfiguration?.distributionConfigurationArn,
      executionRole: this.executionRole?.roleArn,
      enhancedImageMetadataEnabled: props.enhancedImageMetadataEnabled,
      loggingConfiguration: this.buildLoggingConfiguration(props),
      imageTestsConfiguration: buildImageTestsConfiguration<ImageProps, CfnImage.ImageTestsConfigurationProperty>(
        props,
      ),
      imageScanningConfiguration: buildImageScanningConfiguration<
        ImageProps,
        CfnImage.ImageScanningConfigurationProperty
      >(this, props),
      workflows: buildWorkflows<ImageProps, CfnImage.WorkflowConfigurationProperty[]>(props),
      tags: props.tags,
    });

    this.imageName = this.getResourceNameAttribute(image.attrName);
    this.imageArn = image.attrArn;
    this.imageId = image.attrImageId;

    if (props.recipe._isImageRecipe()) {
      this.imageId = image.attrImageId;
      this.imageVersion = props.recipe.imageRecipeVersion;
    } else if (props.recipe._isContainerRecipe()) {
      this.imageId = image.attrImageUri;
      this.imageVersion = props.recipe.containerRecipeVersion;
    } else {
      throw new cdk.ValidationError('recipe must either be an image recipe or container recipe', this);
    }
  }

  /**
   * Grants the default permissions for building an image to the provided execution role.
   *
   * @param grantee The execution role used for the image build.
   */
  public grantDefaultExecutionRolePermissions(grantee: iam.IGrantable): iam.Grant[] {
    const policies = defaultExecutionRolePolicy(this, this.props);
    return policies.map((policy) =>
      iam.Grant.addToPrincipal({
        grantee: grantee,
        resourceArns: policy.resources,
        actions: policy.actions,
        conditions: policy.conditions,
        scope: this,
      }),
    );
  }

  /**
   * Generates the loggingConfiguration property into the `LoggingConfiguration` type in the CloudFormation L1
   * definition.
   *
   * @param props Props input for the construct
   */
  private buildLoggingConfiguration = (props: ImageProps): CfnImage.ImageLoggingConfigurationProperty | undefined => {
    const loggingConfiguration = { ...(props.logGroup && { logGroupName: props.logGroup.logGroupName }) };

    return Object.keys(loggingConfiguration).length ? loggingConfiguration : undefined;
  };
}
