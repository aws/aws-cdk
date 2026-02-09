import * as cdk from 'aws-cdk-lib';
import type * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnImage } from 'aws-cdk-lib/aws-imagebuilder';
import type * as logs from 'aws-cdk-lib/aws-logs';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import { BaseContainerImage, BaseImage } from './base-image';
import type { IDistributionConfiguration } from './distribution-configuration';
import type { IInfrastructureConfiguration } from './infrastructure-configuration';
import { InfrastructureConfiguration } from './infrastructure-configuration';
import { LATEST_VERSION } from './private/constants';
import {
  buildImageScanningConfiguration,
  buildImageTestsConfiguration,
  buildWorkflows,
} from './private/image-and-pipeline-props-helper';
import { defaultExecutionRolePolicy, getExecutionRole } from './private/policy-helper';
import type { IRecipeBase } from './recipe-base';
import type { WorkflowConfiguration } from './workflow';

const IMAGE_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.Image');

/**
 * An EC2 Image Builder Image
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
   * role. However, when providing a custom set of image workflows for the image, an execution role will be
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
   * The execution role to use for deleting the image as well as the underlying resources, such as the AMIs, snapshots,
   * and containers. This role should contain resource lifecycle permissions required to delete the underlying
   * AMIs/containers.
   *
   * @default - no execution role. Only the Image Builder image will be deleted.
   */
  readonly deletionExecutionRole?: iam.IRole;

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
   * [disable-awslint:no-grants]
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
   * [disable-awslint:no-grants]
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
   * [disable-awslint:no-grants]
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
   * Import an existing image given its ARN
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
   * The infrastructure configuration used for the image build
   */
  public readonly infrastructureConfiguration: IInfrastructureConfiguration;

  /**
   * The execution role used for the image build
   */
  public readonly executionRole?: iam.IRole;

  private readonly props: ImageProps;
  private resource: CfnImage;

  public constructor(scope: Construct, id: string, props: ImageProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

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

    const [image, _] = this.createImageFromRecipe(props);
    this.resource = image;
  }

  /**
   * Grants the default permissions for building an image to the provided execution role.
   *
   * [disable-awslint:no-grants]
   *
   * @param grantee The execution role used for the image build.
   */
  @MethodMetadata()
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

  @memoizedGetter
  public get imageName(): string {
    return this.getResourceNameAttribute(this.resource.attrName);
  }

  @memoizedGetter
  public get imageArn(): string {
    return this.resource.attrArn;
  }

  @memoizedGetter
  public get imageVersion(): string {
    const recipe = this.props.recipe;
    if (recipe._isImageRecipe()) {
      return recipe.imageRecipeVersion;
    } else if (recipe._isContainerRecipe()) {
      return recipe.containerRecipeVersion;
    } else {
      throw new cdk.ValidationError('recipe must either be an image recipe or container recipe', this);
    }
  }

  /**
   * The AMI ID of the EC2 AMI, or URI for the container
   *
   * @attribute
   */
  @memoizedGetter
  public get imageId(): string {
    const recipe = this.props.recipe;
    if (recipe._isImageRecipe()) {
      return this.resource.attrImageId;
    } else if (recipe._isContainerRecipe()) {
      return this.resource.attrImageUri;
    } else {
      throw new cdk.ValidationError('recipe must either be an image recipe or container recipe', this);
    }
  }

  /**
   * Creates a CfnImage resource from the recipe and props provided.
   *
   * @param props Props input for the construct
   * @private
   */
  private createImageFromRecipe(props: ImageProps): [CfnImage, IRecipeBase] {
    const recipe = props.recipe;
    if (InfrastructureConfiguration.isInfrastructureConfiguration(this.infrastructureConfiguration)) {
      this.infrastructureConfiguration._bind({ isContainerBuild: recipe._isContainerRecipe() });
    }

    if (recipe._isImageRecipe() && recipe._isContainerRecipe()) {
      throw new cdk.ValidationError('the recipe cannot be both an IImageRecipe and an IContainerRecipe', this);
    }

    if (!recipe._isImageRecipe() && !recipe._isContainerRecipe()) {
      throw new cdk.ValidationError('the recipe must either be an IImageRecipe or IContainerRecipe', this);
    }

    const image = new CfnImage(this, 'Resource', {
      ...(recipe._isImageRecipe() && { imageRecipeArn: recipe.imageRecipeArn }),
      ...(recipe._isContainerRecipe() && { containerRecipeArn: recipe.containerRecipeArn }),
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
      deletionSettings: this.buildDeletionSettings(props),
      tags: props.tags,
    });

    return [image, recipe];
  }

  /**
   * Generates the loggingConfiguration property into the `LoggingConfiguration` type in the CloudFormation L1
   * definition.
   *
   * @param props Props input for the construct
   */
  private buildLoggingConfiguration(props: ImageProps): CfnImage.ImageLoggingConfigurationProperty | undefined {
    if (!props.logGroup) {
      return undefined;
    }

    return { logGroupName: props.logGroup.logGroupName };
  }

  /**
   * Generates the deletionSettings property into the `DeletionSettings` type in the CloudFormation L1 definition.
   *
   * @param props Props input for the construct
   */
  private buildDeletionSettings(props: ImageProps): CfnImage.DeletionSettingsProperty | undefined {
    if (props.deletionExecutionRole === undefined) {
      return undefined;
    }

    return { executionRole: props.deletionExecutionRole.roleArn };
  }
}
