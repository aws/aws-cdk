import * as cdk from 'aws-cdk-lib';
import type * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { CfnContainerRecipe } from 'aws-cdk-lib/aws-imagebuilder';
import type * as kms from 'aws-cdk-lib/aws-kms';
import type * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import { memoizedGetter } from 'aws-cdk-lib/core/lib/helpers-internal';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import type { Construct } from 'constructs';
import type { BaseContainerImage, ContainerInstanceImage } from './base-image';
import type { Repository } from './distribution-configuration';
import type { IImageRecipe } from './image-recipe';
import type { OSVersion } from './os-version';
import type { ComponentConfiguration, IRecipeBase } from './recipe-base';

const CONTAINER_RECIPE_SYMBOL = Symbol.for('@aws-cdk/aws-imagebuilder-alpha.ContainerRecipe');

/**
 * Represents the latest version of a container recipe. When using the recipe in a pipeline, the pipeline will use the
 * latest recipe at the time of execution.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/ibhow-semantic-versioning.html
 */
const LATEST_VERSION = 'x.x.x';

/**
 * The default version to use in the container recipe. When the recipe is updated, the `x` will be incremented off from
 * the latest recipe version that exists.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/create-image-recipes.html
 */
const DEFAULT_RECIPE_VERSION = '1.0.x';

/**
 * An EC2 Image Builder Container Recipe.
 */
export interface IContainerRecipe extends IRecipeBase {
  /**
   * The ARN of the container recipe
   *
   * @attribute
   */
  readonly containerRecipeArn: string;

  /**
   * The name of the container recipe
   *
   * @attribute
   */
  readonly containerRecipeName: string;

  /**
   * The version of the container recipe
   *
   * @attribute
   */
  readonly containerRecipeVersion: string;
}

/**
 * Properties for creating a Container Recipe resource
 */
export interface ContainerRecipeProps {
  /**
   * The base image for customizations specified in the container recipe.
   */
  readonly baseImage: BaseContainerImage;

  /**
   * The container repository where the output container image is stored.
   */
  readonly targetRepository: Repository;

  /**
   * The name of the container recipe.
   *
   * @default a name is generated
   */
  readonly containerRecipeName?: string;

  /**
   * The version of the container recipe.
   *
   * @default 1.0.x
   */
  readonly containerRecipeVersion?: string;

  /**
   * The description of the container recipe.
   *
   * @default None
   */
  readonly description?: string;

  /**
   * The dockerfile template used to build the container image.
   *
   * @default - a standard dockerfile template will be generated to pull the base image, perform environment setup, and
   * run all components in the recipe
   */
  readonly dockerfile?: DockerfileData;

  /**
   * The list of component configurations to apply in the image build.
   *
   * @default None
   */
  readonly components?: ComponentConfiguration[];

  /**
   * The KMS key used to encrypt the dockerfile template.
   *
   * @default None
   */
  readonly kmsKey?: kms.IKey;

  /**
   * The working directory for use during build and test workflows.
   *
   * @default - the Image Builder default working directory is used. For Linux and macOS builds, this would be /tmp. For
   * Windows builds, this would be C:/
   */
  readonly workingDirectory?: string;

  /**
   * The operating system (OS) version of the base image.
   *
   * @default - Image Builder will determine the OS version of the base image, if sourced from a third-party container
   * registry. Otherwise, the OS version of the base image is required.
   */
  readonly osVersion?: OSVersion;

  /**
   * The block devices to attach to the instance used for building, testing, and distributing the container image.
   *
   * @default the block devices of the instance image will be used
   */
  readonly instanceBlockDevices?: ec2.BlockDevice[];

  /**
   * The image to use to launch the instance used for building, testing, and distributing the container image.
   *
   * @default Image Builder will use the appropriate ECS-optimized AMI
   */
  readonly instanceImage?: ContainerInstanceImage;

  /**
   * The tags to apply to the container recipe
   *
   * @default None
   */
  readonly tags?: { [key: string]: string };
}

/**
 * The type of the container being used in the container recipe
 */
export enum ContainerType {
  /**
   * Indicates the container recipe uses a Docker container
   */
  DOCKER = 'DOCKER',
}

/**
 * The rendered Dockerfile value, for use in CloudFormation.
 * - For inline dockerfiles, dockerfileTemplateData is the Dockerfile template text
 * - For S3-backed dockerfiles, dockerfileTemplateUri is the S3 URL
 */
export interface DockerfileTemplateConfig {
  /**
   * The rendered Dockerfile data, for use in CloudFormation
   *
   * @default - none if dockerfileTemplateUri is set
   */
  readonly dockerfileTemplateData?: string;

  /**
   * The rendered Dockerfile URI, for use in CloudFormation
   *
   * @default - none if dockerfileTemplateData is set
   */
  readonly dockerfileTemplateUri?: string;
}

/**
 * Helper class for referencing and uploading dockerfile data for the container recipe
 */
export abstract class DockerfileData {
  /**
   * Uploads dockerfile data from a local file to S3 to use as the dockerfile data
   *
   * @param scope The construct scope
   * @param id Identifier of the construct
   * @param path The local path to the dockerfile data file
   * @param options S3 asset upload options
   */
  public static fromAsset(
    scope: Construct,
    id: string,
    path: string,
    options: s3assets.AssetOptions = {},
  ): S3DockerfileData {
    const asset = new s3assets.Asset(scope, id, { ...options, path });
    return new S3DockerfileDataFromAsset(asset);
  }

  /**
   * References dockerfile data from a pre-existing S3 object
   *
   * @param bucket The S3 bucket where the dockerfile data is stored
   * @param key The S3 key of the dockerfile data file
   */
  public static fromS3(bucket: s3.IBucket, key: string): S3DockerfileData {
    return new S3DockerfileDataFromBucketKey(bucket, key);
  }

  /**
   * Uses an inline string as the dockerfile data
   *
   * @param data An inline string representing the dockerfile data
   */
  public static fromInline(data: string): DockerfileData {
    return new InlineDockerfileData(data);
  }

  /**
   * The rendered Dockerfile value, for use in CloudFormation.
   * - For inline dockerfiles, dockerfileTemplateData is the Dockerfile template text
   * - For S3-backed dockerfiles, dockerfileTemplateUri is the S3 URL
   */
  abstract render(): DockerfileTemplateConfig;
}

/**
 * Helper class for S3-based dockerfile data references, containing additional permission grant methods on the S3 object
 */
export abstract class S3DockerfileData extends DockerfileData {
  protected readonly bucket: s3.IBucket;
  protected readonly key: string;

  protected constructor(bucket: s3.IBucket, key: string) {
    super();

    this.bucket = bucket;
    this.key = key;
  }

  /**
   * The rendered Dockerfile S3 URL, for use in CloudFormation
   */
  public render(): DockerfileTemplateConfig {
    return { dockerfileTemplateUri: this.bucket.s3UrlForObject(this.key) };
  }

  /**
   * Grant put permissions to the given grantee for the dockerfile data in S3
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantPut(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantPut(grantee, this.key);
  }

  /**
   * Grant read permissions to the given grantee for the dockerfile data in S3
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.bucket.grantRead(grantee, this.key);
  }
}

class InlineDockerfileData extends DockerfileData {
  protected readonly data: string;

  public constructor(data: string) {
    super();

    this.data = data;
  }

  /**
   * The rendered Dockerfile text, for use in CloudFormation
   */
  public render(): DockerfileTemplateConfig {
    return { dockerfileTemplateData: this.data };
  }
}

class S3DockerfileDataFromBucketKey extends S3DockerfileData {
  public constructor(bucket: s3.IBucket, key: string) {
    super(bucket, key);
  }
}

class S3DockerfileDataFromAsset extends S3DockerfileData {
  public constructor(asset: s3assets.Asset) {
    super(asset.bucket, asset.s3ObjectKey);
  }
}

/**
 * Properties for an EC2 Image Builder container recipe
 */
export interface ContainerRecipeAttributes {
  /**
   * The ARN of the container recipe
   *
   * @default - derived from containerRecipeName
   */
  readonly containerRecipeArn?: string;

  /**
   * The name of the container recipe
   *
   * @default - derived from containerRecipeArn
   */
  readonly containerRecipeName?: string;

  /**
   * The version of the container recipe
   *
   * @default - derived from containerRecipeArn. if a containerRecipeName is provided, the latest version, x.x.x, will
   * be used.
   */
  readonly containerRecipeVersion?: string;
}

/**
 * A new or imported Container Recipe
 */
export abstract class ContainerRecipeBase extends cdk.Resource implements IContainerRecipe {
  /**
   * The ARN of the container recipe
   */
  abstract readonly containerRecipeArn: string;

  /**
   * The name of the container recipe
   */
  abstract readonly containerRecipeName: string;

  /**
   * The version of the container recipe
   */
  abstract readonly containerRecipeVersion: string;

  /**
   * Grant custom actions to the given grantee for the container recipe
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   * @param actions The list of actions
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.containerRecipeArn],
      scope: this,
    });
  }

  /**
   * Grant read permissions to the given grantee for the container recipe
   * [disable-awslint:no-grants]
   *
   * @param grantee The principal
   */
  public grantRead(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'imagebuilder:GetContainerRecipe');
  }

  /**
   * Indicates whether the recipe is a Container Recipe
   *
   * @internal
   */
  public _isContainerRecipe(): this is IContainerRecipe {
    return true;
  }

  /**
   * Indicates whether the recipe is an Image Recipe
   *
   * @internal
   */
  public _isImageRecipe(): this is IImageRecipe {
    return false;
  }
}

/**
 * Represents an EC2 Image Builder Container Recipe.
 *
 * @see https://docs.aws.amazon.com/imagebuilder/latest/userguide/manage-recipes.html
 */
@propertyInjectable
export class ContainerRecipe extends ContainerRecipeBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-imagebuilder-alpha.ContainerRecipe';

  /**
   * Import an existing container recipe given its ARN.
   */
  public static fromContainerRecipeArn(scope: Construct, id: string, containerRecipeArn: string): IContainerRecipe {
    return this.fromContainerRecipeAttributes(scope, id, { containerRecipeArn });
  }

  /**
   * Import the latest version of an existing container recipe given its name. The provided name must be normalized by
   * converting all alphabetical characters to lowercase, and replacing all spaces and underscores with hyphens.
   */
  public static fromContainerRecipeName(scope: Construct, id: string, containerRecipeName: string): IContainerRecipe {
    return this.fromContainerRecipeAttributes(scope, id, { containerRecipeName });
  }

  /**
   * Import an existing container recipe by providing its attributes. If the container recipe name is provided as an
   * attribute, it must be normalized by converting all alphabetical characters to lowercase, and replacing all spaces
   * and underscores with hyphens.
   */
  public static fromContainerRecipeAttributes(
    scope: Construct,
    id: string,
    attrs: ContainerRecipeAttributes,
  ): IContainerRecipe {
    if (!attrs.containerRecipeArn && !attrs.containerRecipeName) {
      throw new cdk.ValidationError(
        'either either containerRecipeArn or containerRecipeName must be provided to import a container recipe',
        scope,
      );
    }

    const containerRecipeArn =
      attrs.containerRecipeArn ??
      cdk.Stack.of(scope).formatArn({
        service: 'imagebuilder',
        resource: 'container-recipe',
        resourceName: `${attrs.containerRecipeName}/${attrs.containerRecipeVersion ?? LATEST_VERSION}`,
      });

    const [containerRecipeName, containerRecipeVersion] = (() => {
      if (attrs.containerRecipeName) {
        return [attrs.containerRecipeName, attrs.containerRecipeVersion ?? LATEST_VERSION];
      }

      const containerRecipeNameVersion = cdk.Stack.of(scope).splitArn(
        containerRecipeArn,
        cdk.ArnFormat.SLASH_RESOURCE_NAME,
      ).resourceName!;

      const containerRecipeNameVersionSplit = cdk.Fn.split('/', containerRecipeNameVersion);
      return [cdk.Fn.select(0, containerRecipeNameVersionSplit), cdk.Fn.select(1, containerRecipeNameVersionSplit)];
    })();

    class Import extends ContainerRecipeBase {
      public readonly containerRecipeArn = containerRecipeArn;
      public readonly containerRecipeName = containerRecipeName;
      public readonly containerRecipeVersion = containerRecipeVersion;
    }

    return new Import(scope, id);
  }

  /**
   * Return whether the given object is a ContainerRecipe.
   */
  public static isContainerRecipe(x: any): x is ContainerRecipe {
    return x !== null && typeof x === 'object' && CONTAINER_RECIPE_SYMBOL in x;
  }

  private readonly instanceBlockDevices: ec2.BlockDevice[] = [];
  private resource: CfnContainerRecipe;

  public constructor(scope: Construct, id: string, props: ContainerRecipeProps) {
    super(scope, id, {
      physicalName:
        props.containerRecipeName ??
        cdk.Lazy.string({
          produce: () =>
            cdk.Names.uniqueResourceName(this, {
              maxLength: 128,
              separator: '-',
              allowedSpecialCharacters: '-',
            }).toLowerCase(), // Enforce lowercase for the auto-generated fallback
        }),
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    Object.defineProperty(this, CONTAINER_RECIPE_SYMBOL, { value: true });

    this.validateContainerRecipeName();

    this.addInstanceBlockDevice(...(props.instanceBlockDevices ?? []));

    const components: CfnContainerRecipe.ComponentConfigurationProperty[] | undefined = props.components?.map(
      (component) => ({
        componentArn: component.component.componentArn,
        ...(component.parameters && {
          parameters: Object.entries(component.parameters).map(
            ([name, param]): CfnContainerRecipe.ComponentParameterProperty => ({
              name,
              value: param.value,
            }),
          ),
        }),
      }),
    );

    const dockerfile =
      props.dockerfile ??
      DockerfileData.fromInline(
        'FROM {{{ imagebuilder:parentImage }}}\n{{{ imagebuilder:environments }}}\n{{{ imagebuilder:components }}}',
      );

    const containerRecipeVersion = props.containerRecipeVersion ?? DEFAULT_RECIPE_VERSION;
    this.resource = new CfnContainerRecipe(this, 'Resource', {
      name: this.physicalName,
      version: containerRecipeVersion,
      description: props.description,
      parentImage: props.baseImage.image,
      containerType: ContainerType.DOCKER,
      targetRepository: {
        repositoryName: props.targetRepository.repositoryName,
        service: props.targetRepository.service,
      },
      platformOverride: props.osVersion?.platform,
      imageOsVersionOverride: props.osVersion?.osVersion,
      kmsKeyId: props.kmsKey?.keyArn,
      instanceConfiguration: cdk.Lazy.any({ produce: () => this.buildInstanceConfiguration(props) }),
      workingDirectory: props.workingDirectory,
      tags: props.tags,
      ...dockerfile.render(),
      ...(components?.length && { components }),
    });
  }

  @memoizedGetter
  public get containerRecipeName(): string {
    return this.getResourceNameAttribute(this.resource.attrName);
  }

  @memoizedGetter
  public get containerRecipeArn(): string {
    return this.getResourceArnAttribute(this.resource.attrArn, {
      service: 'imagebuilder',
      resource: 'container-recipe',
      resourceName: `${this.physicalName}/${this.resource.version}`,
    });
  }

  @memoizedGetter
  public get containerRecipeVersion(): string {
    return this.resource.getAtt('Version').toString();
  }

  /**
   * Adds block devices to attach to the instance used for building, testing, and distributing the container image.
   *
   * @param instanceBlockDevices - The list of block devices to attach
   */
  @MethodMetadata()
  public addInstanceBlockDevice(...instanceBlockDevices: ec2.BlockDevice[]): void {
    this.instanceBlockDevices.push(...instanceBlockDevices);
  }

  /**
   * Renders the block devices provided as input to the construct, into the block device mapping structure that
   * CfnContainerRecipe expects to receive.
   *
   * This is rendered at synthesis time, as users can add additional block devices with `addInstanceBlockDevice`, after
   * the construct has been instantiated.
   *
   * @private
   */
  private renderBlockDevices(): CfnContainerRecipe.InstanceBlockDeviceMappingProperty[] | undefined {
    const blockDevices = this.instanceBlockDevices.map(
      (blockDevice): CfnContainerRecipe.InstanceBlockDeviceMappingProperty => {
        const ebsDevice = blockDevice.volume.ebsDevice;
        const ebs: CfnContainerRecipe.EbsInstanceBlockDeviceSpecificationProperty = {
          ...(ebsDevice?.deleteOnTermination !== undefined && { deleteOnTermination: ebsDevice.deleteOnTermination }),
          ...(ebsDevice?.encrypted !== undefined && { encrypted: ebsDevice.encrypted }),
          ...(ebsDevice?.iops !== undefined && { iops: ebsDevice.iops }),
          ...(ebsDevice?.kmsKey !== undefined && { kmsKeyId: ebsDevice.kmsKey.keyArn }),
          ...(ebsDevice?.snapshotId !== undefined && { snapshotId: ebsDevice.snapshotId }),
          ...(ebsDevice?.throughput !== undefined && { throughput: ebsDevice.throughput }),
          ...(ebsDevice?.volumeSize !== undefined && { volumeSize: ebsDevice.volumeSize }),
          ...(ebsDevice?.volumeType !== undefined && { volumeType: ebsDevice.volumeType }),
        };

        const mappingEnabled = blockDevice.mappingEnabled ?? true;
        return {
          deviceName: blockDevice.deviceName,
          virtualName: blockDevice.volume.virtualName,
          ...(!mappingEnabled && { noDevice: '' }),
          ...(Object.keys(ebs).length && { ebs }),
        };
      },
    );

    return blockDevices.length ? blockDevices : undefined;
  }

  /**
   * Generates the instance configuration property into the `InstanceConfiguration` type in the  CloudFormation L1
   * definition.
   *
   * @param props The props passed as input to the construct
   * @private
   */
  private buildInstanceConfiguration(
    props: ContainerRecipeProps,
  ): CfnContainerRecipe.InstanceConfigurationProperty | undefined {
    const blockDevices = this.renderBlockDevices();

    const instanceConfiguration: CfnContainerRecipe.InstanceConfigurationProperty = {
      ...(blockDevices?.length && { blockDeviceMappings: blockDevices }),
      ...(props.instanceImage !== undefined && { image: props.instanceImage.image }),
    };

    return Object.keys(instanceConfiguration).length ? instanceConfiguration : undefined;
  }

  private validateContainerRecipeName() {
    if (cdk.Token.isUnresolved(this.physicalName)) {
      return; // Cannot validate unresolved tokens, given their actual value is rendered at deployment time
    }

    if (this.physicalName.length > 128) {
      throw new cdk.ValidationError(
        `the containerRecipeName cannot be longer than 128 characters, got: '${this.physicalName}'`,
        this,
      );
    }

    if (this.physicalName.includes(' ')) {
      throw new cdk.ValidationError(`the containerRecipeName cannot contain spaces, got: '${this.physicalName}'`, this);
    }

    if (this.physicalName.includes('_')) {
      throw new cdk.ValidationError(
        `the containerRecipeName cannot contain underscores, got: '${this.physicalName}'`,
        this,
      );
    }

    if (this.physicalName !== this.physicalName.toLowerCase()) {
      throw new cdk.ValidationError(`the containerRecipeName must be lowercase, got: '${this.physicalName}'`, this);
    }
  }
}
