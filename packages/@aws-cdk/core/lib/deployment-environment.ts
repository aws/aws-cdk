import * as cxapi from '@aws-cdk/cx-api';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from "./assets";
import { Fn } from './cfn-fn';
import { Construct } from "./construct";
import { FileAssetParameters } from './private/asset-parameters';
import { Stack } from "./stack";

/**
 * The well-known name for the docker image asset ECR repository. All docker
 * image assets will be pushed into this repository with an image tag based on
 * the source hash.
 */
const ASSETS_ECR_REPOSITORY_NAME = "aws-cdk/assets";

/**
 * This allows users to work around the fact that the ECR repository is
 * (currently) not configurable by setting this context key to their desired
 * repository name. The CLI will auto-create this ECR repository if it's not
 * already created.
 */
const ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY = "assets-ecr-repository-name";

/**
 * Encodes information how a certain Stack should be deployed
 */
export interface IDeploymentEnvironment {
  /**
   * Bind to the stack this environment is going to be used on
   *
   * Must be called before any of the other methods are called.
   */
  bind(stack: Stack): void;

  /**
   * Register a File Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   */
  addFileAsset(asset: FileAssetSource): FileAssetLocation;

  /**
   * Register a Docker Image Asset
   *
   * Returns the parameters that can be used to refer to the asset inside the template.
   */
  addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation;

  /**
   * Access the stack deployment configuration
   */
  stackDeploymentConfig(): StackDeploymentConfig;
}

/**
 * Configuration necessary for deploying the stack
 */
export interface StackDeploymentConfig {
  /**
   * The role that needs to be assumed to deploy the stack
   *
   * @default - No role is assumed (current credentials are used)
   */
  readonly assumeRoleArn?: string;

  /**
   * The role that is passed to CloudFormation to execute the change set
   *
   * @default - No role is passed (current role/credentials are used)
   */
  readonly cloudFormationPassRoleArn?: string;
}

/**
 * Configuration properties for ConventionModeDeploymentEnvironment
 */
export interface ConventionModeDeploymentEnvironmentProps {
  /**
   * Name of the staging bucket
   *
   * You must supply this if you have given a non-standard name to the staging bucket.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "cdk-bootstrap-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}"
   */
  readonly stagingBucketName?: string;

  /**
   * Name of the ECR repository to push Docker Images
   *
   * You must supply this if you have given a non-standard name to the ECR repository.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "cdk-bootstrap-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}"
   */
  readonly ecrRepositoryName?: string;

  /**
   * The role to use to publish assets to this environment
   *
   * You must supply this if you have given a non-standard name to the publishing role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "cdk-bootstrap-publishing-role-${AWS::AccountId}-${AWS::Region}"
   */
  readonly assetPublishingRoleName?: string;

  /**
   * The role to assume to execute
   *
   * You must supply this if you have given a non-standard name to the publishing role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "cdk-bootstrap-deploy-action-role-${AWS::AccountId}-${AWS::Region}"
   */
  readonly deployActionRoleName?: string;

  /**
   * The role CloudFormation will assume when deploying the Stack
   *
   * You must supply this if you have given a non-standard name to the execution role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "cdk-bootstrap-cfn-exec-role-${AWS::AccountId}-${AWS::Region}"
   */
  readonly cloudFormationExecutionRole?: string;

  /**
   * Qualifier to disambiguate multiple environments in the same account
   *
   * You can use this and leave the other naming properties empty if you have deployed
   * the bootstrap environment with standard names but only differnet qualifiers.
   *
   * @default "hnb659fds"
   */
  readonly qualifier?: string;
}

/**
 * Uses conventionally named roles and reify asset storage locations
 *
 * This DeploymentEnvironment is the only DeploymentEnvironment that generates
 * an asset manifest, and is required to deploy CDK applications using the
 * `@aws-cdk/app-delivery` CI/CD library.
 *
 * Requires the environment to have been bootstrapped with Bootstrap Stack V2.
 */
export class ConventionModeDeploymentEnvironment implements IDeploymentEnvironment {
  private stack!: Stack;

  constructor(private readonly props: ConventionModeDeploymentEnvironmentProps = {}) {
  }

  public bind(stack: Stack): void {
    this.stack = stack;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const bucketName = this.unplaceHold(this.props.stagingBucketName ?? 'cdk-bootstrap-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}');
    const objectKey = asset.sourceHash + '.zip';

    // FIXME: collect for adding to manifest

    return {
      bucketName,
      objectKey,
      s3Url: `https://s3.${this.stack.region}.${this.stack.urlSuffix}/${bucketName}/${objectKey}`,
    };
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const imageTag = asset.sourceHash;
    const repositoryName = this.unplaceHold(this.props.ecrRepositoryName ?? 'cdk-bootstrap-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}');

    // FIXME: collect to manifest

    return {
      repositoryName,
      imageUri: `${this.stack.account}.dkr.ecr.${this.stack.region}.${this.stack.urlSuffix}/${repositoryName}:${imageTag}`,
    };
  }

  public stackDeploymentConfig(): StackDeploymentConfig {
    return {
      assumeRoleArn: this.unplaceHold(this.props.deployActionRoleName ?? 'cdk-bootstrap-deploy-action-role-${AWS::AccountId}-${AWS::Region}'),
      cloudFormationPassRoleArn: this.unplaceHold(this.props.cloudFormationExecutionRole ?? 'cdk-bootstrap-cfn-exec-role-${AWS::AccountId}-${AWS::Region}'),
    };
  }

  private unplaceHold(s: string) {
    return replacePlaceholders(s, {
      qualifier: this.props.qualifier ?? "hnb659fds",
      region: this.stack.region,
      account: this.stack.account
    });
  }

}

/**
 * Use the original deployment environment
 *
 * This deployment environment is restricted in cross-environment deployments,
 * CI/CD deployments, and will use up CloudFormation parameters in your template.
 *
 * This is the only DeploymentEnvironment that supports customizing asset behavior
 * by overriding `Stack.addFileAsset()` and `Stack.addDockerImageAsset()`.
 */
export class LegacyDeploymentEnvironment implements IDeploymentEnvironment {
  private stack!: Stack;
  private cycle = false;

  /**
   * Includes all parameters synthesized for assets (lazy).
   */
  private _assetParameters?: Construct;

  /**
   * The image ID of all the docker image assets that were already added to this
   * stack (to avoid duplication).
   */
  private readonly addedImageAssets = new Set<string>();

  public bind(stack: Stack): void {
    this.stack = stack;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    // Backwards compatibility hack. We have a number of conflicting goals here:
    //
    // - We want put the actual logic in this class
    // - We ALSO want to keep supporting people overriding Stack.addFileAsset (for backwards compatibility,
    // because that mechanism is currently used to make CI/CD scenarios work)
    // - We ALSO want to allow both entry points from user code (our own framework
    // code will always call stack.deploymentMechanism.addFileAsset() but existing users
    // may still be calling `stack.addFileAsset()` directly.
    //
    // Solution: delegate call to the stack, but if the stack delegates back to us again
    // then do the actual logic.
    if (this.cycle) {
      return this.doAddFileAsset(asset);
    }
    this.cycle = true;
    try {
      return this.stack.addFileAsset(asset);
    } finally {
      this.cycle = false;
    }
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    // See `addFileAsset` for explanation.
    if (this.cycle) {
      return this.doAddDockerImageAsset(asset);
    }
    this.cycle = true;
    try {
      return this.stack.addDockerImageAsset(asset);
    } finally {
      this.cycle = false;
    }
  }

  public stackDeploymentConfig(): StackDeploymentConfig {
    return { /* Legacy mode always uses current credentials */ };
  }

  private doAddDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    // check if we have an override from context
    const repositoryNameOverride = this.stack.node.tryGetContext(ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY);
    const repositoryName = asset.repositoryName ?? repositoryNameOverride ?? ASSETS_ECR_REPOSITORY_NAME;
    const imageTag = asset.sourceHash;
    const assetId = asset.sourceHash;

    // only add every image (identified by source hash) once for each stack that uses it.
    if (!this.addedImageAssets.has(assetId)) {
      const metadata: cxapi.ContainerImageAssetMetadataEntry = {
        repositoryName,
        imageTag,
        id: assetId,
        packaging: 'container-image',
        path: asset.directoryName,
        sourceHash: asset.sourceHash,
        buildArgs: asset.dockerBuildArgs,
        target: asset.dockerBuildTarget,
        file: asset.dockerFile,
      };

      this.stack.node.addMetadata(cxapi.ASSET_METADATA, metadata);
      this.addedImageAssets.add(assetId);
    }

    return {
      imageUri: `${this.stack.account}.dkr.ecr.${this.stack.region}.${this.stack.urlSuffix}/${repositoryName}:${imageTag}`,
      repositoryName
    };
  }

  private doAddFileAsset(asset: FileAssetSource): FileAssetLocation {
    let params = this.assetParameters.node.tryFindChild(asset.sourceHash) as FileAssetParameters;
    if (!params) {
      params = new FileAssetParameters(this.assetParameters, asset.sourceHash);

      const metadata: cxapi.FileAssetMetadataEntry = {
        path: asset.fileName,
        id: asset.sourceHash,
        packaging: asset.packaging,
        sourceHash: asset.sourceHash,

        s3BucketParameter: params.bucketNameParameter.logicalId,
        s3KeyParameter: params.objectKeyParameter.logicalId,
        artifactHashParameter: params.artifactHashParameter.logicalId,
      };

      this.stack.node.addMetadata(cxapi.ASSET_METADATA, metadata);
    }

    const bucketName = params.bucketNameParameter.valueAsString;

    // key is prefix|postfix
    const encodedKey = params.objectKeyParameter.valueAsString;

    const s3Prefix = Fn.select(0, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const s3Filename = Fn.select(1, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const objectKey = `${s3Prefix}${s3Filename}`;

    const s3Url = `https://s3.${this.stack.region}.${this.stack.urlSuffix}/${bucketName}/${objectKey}`;

    return { bucketName, objectKey, s3Url };
  }

  private get assetParameters() {
    if (!this._assetParameters) {
      this._assetParameters = new Construct(this.stack, 'AssetParameters');
    }
    return this._assetParameters;
  }
}

/**
 * Deployment environment for a nested stack
 *
 * Interoperates with the DeploymentEnvironment of the parent stack.
 */
export class NestedStackDeploymentEnvironment implements IDeploymentEnvironment {
  constructor(private readonly parentDeployment: IDeploymentEnvironment) {
  }

  public bind(_stack: Stack): void {
    // Nothing to do
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    // Forward to parent deployment. By the magic of cross-stack references any parameter
    // returned and used will magically be forwarded to the nested stack.
    return this.parentDeployment.addFileAsset(asset);
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    // Forward to parent deployment. By the magic of cross-stack references any parameter
    // returned and used will magically be forwarded to the nested stack.
    return this.parentDeployment.addDockerImageAsset(asset);
  }

  public stackDeploymentConfig(): StackDeploymentConfig {
    throw new Error('NestedStackDeploymentEnvironment cannot be directly deployed. Deploy the parent stack instead.');
  }
}

// TODO: lambda.Code.fromAsset() and for ContainerImage as well.
// TODO: cdk-assets placeholders needs to retrieve base of imageUri from the repository
// TODO: roles in Bootstrap Stack V2 also need the qualifier

function replacePlaceholders(s: string, replacements: {
    qualifier: string,
    account: string,
    region: string,
  }) {

  return s.replace(/\$\{Qualifier\}/g, replacements.qualifier)
    .replace(/\$\{AWS::Region\}/g, replacements.region)
    .replace(/\$\{AWS::AccountId\}/g, replacements.account);
}