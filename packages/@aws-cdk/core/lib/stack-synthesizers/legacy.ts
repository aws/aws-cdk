import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Fn } from '../cfn-fn';
import { Construct, ISynthesisSession } from '../construct-compat';
import { FileAssetParameters } from '../private/asset-parameters';
import { Stack } from '../stack';
import { assertBound } from './_shared';
import { StackSynthesizer } from './stack-synthesizer';

/**
 * The well-known name for the docker image asset ECR repository. All docker
 * image assets will be pushed into this repository with an image tag based on
 * the source hash.
 */
const ASSETS_ECR_REPOSITORY_NAME = 'aws-cdk/assets';

/**
 * This allows users to work around the fact that the ECR repository is
 * (currently) not configurable by setting this context key to their desired
 * repository name. The CLI will auto-create this ECR repository if it's not
 * already created.
 */
const ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY = 'assets-ecr-repository-name';

/**
 * Use the original deployment environment
 *
 * This deployment environment is restricted in cross-environment deployments,
 * CI/CD deployments, and will use up CloudFormation parameters in your template.
 *
 * This is the only StackSynthesizer that supports customizing asset behavior
 * by overriding `Stack.addFileAsset()` and `Stack.addDockerImageAsset()`.
 */
export class LegacyStackSynthesizer extends StackSynthesizer {
  private stack?: Stack;
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
    if (this.stack !== undefined) {
      throw new Error('A StackSynthesizer can only be used for one Stack: create a new instance to use with a different Stack');
    }
    this.stack = stack;
  }

  public addFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.stack);

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
    //
    // @deprecated: this can be removed for v2
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
    assertBound(this.stack);

    // See `addFileAsset` for explanation.
    // @deprecated: this can be removed for v2
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

  /**
   * Synthesize the associated stack to the session
   */
  public synthesize(session: ISynthesisSession): void {
    assertBound(this.stack);

    this.synthesizeStackTemplate(this.stack, session);

    // Just do the default stuff, nothing special
    this.emitStackArtifact(this.stack, session);
  }

  private doAddDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    assertBound(this.stack);

    // check if we have an override from context
    const repositoryNameOverride = this.stack.node.tryGetContext(ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY);
    const repositoryName = asset.repositoryName ?? repositoryNameOverride ?? ASSETS_ECR_REPOSITORY_NAME;
    const imageTag = asset.sourceHash;
    const assetId = asset.sourceHash;

    // only add every image (identified by source hash) once for each stack that uses it.
    if (!this.addedImageAssets.has(assetId)) {
      if (!asset.directoryName) {
        throw new Error(`LegacyStackSynthesizer does not support this type of file asset: ${JSON.stringify(asset)}`);
      }

      const metadata: cxschema.ContainerImageAssetMetadataEntry = {
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

      this.stack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, metadata);
      this.addedImageAssets.add(assetId);
    }

    return {
      imageUri: `${this.stack.account}.dkr.ecr.${this.stack.region}.${this.stack.urlSuffix}/${repositoryName}:${imageTag}`,
      repositoryName,
    };
  }

  private doAddFileAsset(asset: FileAssetSource): FileAssetLocation {
    assertBound(this.stack);

    let params = this.assetParameters.node.tryFindChild(asset.sourceHash) as FileAssetParameters;
    if (!params) {
      params = new FileAssetParameters(this.assetParameters, asset.sourceHash);

      if (!asset.fileName || !asset.packaging) {
        throw new Error(`LegacyStackSynthesizer does not support this type of file asset: ${JSON.stringify(asset)}`);
      }

      const metadata: cxschema.FileAssetMetadataEntry = {
        path: asset.fileName,
        id: asset.sourceHash,
        packaging: asset.packaging,
        sourceHash: asset.sourceHash,

        s3BucketParameter: params.bucketNameParameter.logicalId,
        s3KeyParameter: params.objectKeyParameter.logicalId,
        artifactHashParameter: params.artifactHashParameter.logicalId,
      };

      this.stack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, metadata);
    }

    const bucketName = params.bucketNameParameter.valueAsString;

    // key is prefix|postfix
    const encodedKey = params.objectKeyParameter.valueAsString;

    const s3Prefix = Fn.select(0, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const s3Filename = Fn.select(1, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const objectKey = `${s3Prefix}${s3Filename}`;

    const httpUrl = `https://s3.${this.stack.region}.${this.stack.urlSuffix}/${bucketName}/${objectKey}`;
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl, s3Url: httpUrl };
  }

  private get assetParameters() {
    assertBound(this.stack);

    if (!this._assetParameters) {
      this._assetParameters = new Construct(this.stack, 'AssetParameters');
    }
    return this._assetParameters;
  }
}
