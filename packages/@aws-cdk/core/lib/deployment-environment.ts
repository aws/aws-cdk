import * as asset_schema from '@aws-cdk/cdk-assets-schema';
import * as cxapi from '@aws-cdk/cx-api';
import * as fs from 'fs';
import * as path from 'path';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from "./assets";
import { Fn } from './cfn-fn';
import { Construct, ISynthesisSession } from "./construct";
import { FileAssetParameters } from './private/asset-parameters';
import { TemplatedString } from './private/templated-string';
import { Stack } from "./stack";
import { Token } from './token';

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

  /**
   * Synthesize additional artifacts into the session
   *
   * @experimental
   */
  synthesize(session: ISynthesisSession): DeploymentEnvironmentSynthesisResult;
}

/**
 * Result of synthesis
 */
export interface DeploymentEnvironmentSynthesisResult {
  /**
   * Artifact names that got generated that the stack should depend on
   *
   * @default - No additional dependencies
   */
  readonly additionalStackDependencies?: string[];
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
   * @default "arn:aws:iam::${AWS::AccountId}:role/cdk-bootstrap-publishing-role-${AWS::AccountId}-${AWS::Region}"
   */
  readonly assetPublishingRoleArn?: string;

  /**
   * External ID to use when assuming role for asset publishing
   *
   * @default - No external ID
   */
  readonly assetPublishingExternalId?: string;

  /**
   * The role to assume to execute
   *
   * You must supply this if you have given a non-standard name to the publishing role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "arn:aws:iam::${AWS::AccountId}:role/cdk-bootstrap-deploy-action-role-${AWS::AccountId}-${AWS::Region}"
   */
  readonly deployActionRoleArn?: string;

  /**
   * The role CloudFormation will assume when deploying the Stack
   *
   * You must supply this if you have given a non-standard name to the execution role.
   *
   * The placeholders `${Qualifier}`, `${AWS::AccountId}` and `${AWS::Region}` will
   * be replaced with the values of qualifier and the stack's account and region,
   * respectively.
   *
   * @default "arn:aws:iam::${AWS::AccountId}:role/cdk-bootstrap-cfn-exec-role-${AWS::AccountId}-${AWS::Region}"
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
  private readonly bucketName: TemplatedString<DeployPlaceholders>;
  private readonly repositoryName: TemplatedString<DeployPlaceholders>;
  private readonly deployActionRoleArn: TemplatedString<DeployPlaceholders>;
  private readonly cloudFormationPassRoleArn: TemplatedString<DeployPlaceholders>;
  private readonly assetPublishingRoleArn: TemplatedString<DeployPlaceholders>;
  private readonly qualifier: string;

  private readonly assets: asset_schema.ManifestFile = {
    version: asset_schema.AssetManifestSchema.currentVersion(),
    files: {},
    dockerImages: {},
  };

  constructor(private readonly props: ConventionModeDeploymentEnvironmentProps = {}) {
    const TPL = (s: string) => new TemplatedString<DeployPlaceholders>(s);

    this.qualifier = this.props.qualifier ?? "hnb659fds",

    // tslint:disable:max-line-length
    this.bucketName = TPL(this.props.stagingBucketName ?? 'cdk-bootstrap-${Qualifier}-assets-${AWS::AccountId}-${AWS::Region}');
    this.repositoryName = TPL(this.props.ecrRepositoryName ?? 'cdk-bootstrap-${Qualifier}-container-assets-${AWS::AccountId}-${AWS::Region}');
    this.deployActionRoleArn = TPL(this.props.deployActionRoleArn ?? 'arn:aws:iam::${AWS::AccountId}:role/cdk-bootstrap-deploy-action-role-${AWS::AccountId}-${AWS::Region}');
    this.cloudFormationPassRoleArn = TPL(this.props.cloudFormationExecutionRole ?? 'arn:aws:iam::${AWS::AccountId}:role/cdk-bootstrap-cfn-exec-role-${AWS::AccountId}-${AWS::Region}');
    this.assetPublishingRoleArn = TPL(this.props.assetPublishingRoleArn ?? 'arn:aws:iam::${AWS::AccountId}:role/cdk-bootstrap-publishing-role-${AWS::AccountId}-${AWS::Region}');
    // tslint:enable:max-line-length
  }

  public bind(stack: Stack): void {
    this.stack = stack;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    const objectKey = asset.sourceHash + '.zip';

    // Add to manifest
    this.assets.files![asset.sourceHash] = {
      source: {
        path: asset.fileName,
        packaging: asset.packaging
      },
      destinations: {
        [this.manifestEnvName]: {
          bucketName: this.manifestSub(this.bucketName),
          objectKey,
          region: resolvedOr(this.stack.region, undefined),
          assumeRoleArn: this.manifestSub(this.assetPublishingRoleArn),
          assumeRoleExternalId: this.props.assetPublishingExternalId,
        }
      },
    };

    // Return CFN expression
    const bucketName = this.cfnSub(this.bucketName);
    return {
      bucketName,
      objectKey,
      s3Url: `https://s3.${this.stack.region}.${this.stack.urlSuffix}/${bucketName}/${objectKey}`,
    };
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    const imageTag = asset.sourceHash;

    // Add to manifest
    this.assets.dockerImages![asset.sourceHash] = {
      source: {
        directory: asset.directoryName,
        dockerBuildArgs: asset.dockerBuildArgs,
        dockerBuildTarget: asset.dockerBuildTarget,
        dockerFile: asset.dockerFile
      },
      destinations: {
        [this.manifestEnvName]: {
          repositoryName: this.manifestSub(this.repositoryName),
          imageTag,
        }
      },
    };

    // Return CFN expression
    const repositoryName = this.cfnSub(this.repositoryName);
    return {
      repositoryName,
      imageUri: `${this.stack.account}.dkr.ecr.${this.stack.region}.${this.stack.urlSuffix}/${repositoryName}:${imageTag}`,
    };
  }

  public stackDeploymentConfig(): StackDeploymentConfig {
    return {
      assumeRoleArn: this.cfnSub(this.deployActionRoleArn),
      cloudFormationPassRoleArn: this.cfnSub(this.cloudFormationPassRoleArn),
    };
  }

  public synthesize(session: ISynthesisSession): DeploymentEnvironmentSynthesisResult {
    if (Object.keys(this.assets.files!).length + Object.keys(this.assets.dockerImages!).length === 0) {
      // Nothing to do
      return { };
    }

    const artifactId = `${this.stack.artifactId}.assets`;
    const manifestFile = `${artifactId}.json`;
    const outPath = path.join(session.assembly.outdir, manifestFile);
    const text = JSON.stringify(this.assets, undefined, 2);
    fs.writeFileSync(outPath, text);

    session.assembly.addArtifact(artifactId, {
      type: cxapi.ArtifactType.ASSET_MANIFEST,
      properties: {
        file: manifestFile
      },
    });

    return {
      additionalStackDependencies: [artifactId]
    };
  }

  /**
   * Substitute placeholders in a TemplatedString out for values usable in CFN
   */
  private cfnSub(s: TemplatedString<DeployPlaceholders>): string {
    return s.sub({
      'Qualifier': this.qualifier,
      'AWS::Region': this.stack.region,
      'AWS::AccountId': this.stack.account
    }).get();
  }

  /**
   * Substitute placeholders in a TemplatedString out for values usable in the asset manifest
   */
  private manifestSub(s: TemplatedString<DeployPlaceholders>): string {
    return s.sub({
      'Qualifier': this.qualifier,
      'AWS::Region': resolvedOr(this.stack.region, asset_schema.Placeholders.CURRENT_REGION),
      'AWS::AccountId': resolvedOr(this.stack.account, asset_schema.Placeholders.CURRENT_ACCOUNT),
    }).get();
  }

  private get manifestEnvName(): string {
    return [
      resolvedOr(this.stack.account, 'current_account'),
      resolvedOr(this.stack.region, 'current_region'),
    ].join('-');
  }
}

/**
 * Return the given value if resolved or fall back to a default
 */
function resolvedOr<A>(x: string, def: A): string | A {
  return Token.isUnresolved(x) ? def : x;
}

/**
 * Placeholders that can occur in a template string for deployment targets
 */
export type DeployPlaceholders = 'Qualifier' | 'AWS::AccountId' | 'AWS::Region';

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

  public synthesize(_session: ISynthesisSession): DeploymentEnvironmentSynthesisResult {
    return {};
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

  public synthesize(_session: ISynthesisSession): DeploymentEnvironmentSynthesisResult {
    throw new Error('NestedStackDeploymentEnvironment cannot be directly synthesized. Deploy the parent stack instead.');
  }
}

// TODO: lambda.Code.fromAsset() and for ContainerImage as well.
// TODO: roles in Bootstrap Stack V2 also need the qualifier
// TODO: support ${AWS::Partition} in cdk-assets