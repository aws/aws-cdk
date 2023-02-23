import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { assertBound } from './_shared';
import { StackSynthesizer } from './stack-synthesizer';
import { ISynthesisSession, IReusableStackSynthesizer, IBoundStackSynthesizer } from './types';
import { DockerImageAssetLocation, DockerImageAssetSource, FileAssetLocation, FileAssetSource } from '../assets';
import { Fn } from '../cfn-fn';
import { FileAssetParameters } from '../private/asset-parameters';
import { Stack } from '../stack';

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
 * Use the CDK classic way of referencing assets
 *
 * This synthesizer will generate CloudFormation parameters for every referenced
 * asset, and use the CLI's current credentials to deploy the stack.
 *
 * - It does not support cross-account deployment (the CLI must have credentials
 *   to the account you are trying to deploy to).
 * - It cannot be used with **CDK Pipelines**. To deploy using CDK Pipelines,
 *   you must use the `DefaultStackSynthesizer`.
 * - Each asset will take up a CloudFormation Parameter in your template. Keep in
 *   mind that there is a maximum of 200 parameters in a CloudFormation template.
 *   To use determinstic asset locations instead, use `CliCredentialsStackSynthesizer`.
 *
 * Be aware that your CLI credentials must be valid for the duration of the
 * entire deployment. If you are using session credentials, make sure the
 * session lifetime is long enough.
 *
 * This is the only StackSynthesizer that supports customizing asset behavior
 * by overriding `Stack.addFileAsset()` and `Stack.addDockerImageAsset()`.
 */
export class LegacyStackSynthesizer extends StackSynthesizer implements IReusableStackSynthesizer, IBoundStackSynthesizer {
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
    //
    // @deprecated: this can be removed for v2
    if (this.cycle) {
      return this.doAddFileAsset(asset);
    }
    this.cycle = true;
    try {
      const stack = this.boundStack;
      return withoutDeprecationWarnings(() => stack.addFileAsset(asset));
    } finally {
      this.cycle = false;
    }
  }

  public addDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    // See `addFileAsset` for explanation.
    // @deprecated: this can be removed for v2
    if (this.cycle) {
      return this.doAddDockerImageAsset(asset);
    }
    this.cycle = true;
    try {
      const stack = this.boundStack;
      return withoutDeprecationWarnings(() => stack.addDockerImageAsset(asset));
    } finally {
      this.cycle = false;
    }
  }

  /**
   * Synthesize the associated stack to the session
   */
  public synthesize(session: ISynthesisSession): void {
    this.synthesizeTemplate(session);

    // Just do the default stuff, nothing special
    this.emitArtifact(session);
  }

  /**
   * Produce a bound Stack Synthesizer for the given stack.
   *
   * This method may be called more than once on the same object.
   */
  public reusableBind(stack: Stack): IBoundStackSynthesizer {
    // Create a copy of the current object and bind that
    const copy = Object.create(this);
    copy.bind(stack);
    return copy;
  }

  private doAddDockerImageAsset(asset: DockerImageAssetSource): DockerImageAssetLocation {
    // check if we have an override from context
    const repositoryNameOverride = this.boundStack.node.tryGetContext(ASSETS_ECR_REPOSITORY_NAME_OVERRIDE_CONTEXT_KEY);
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
        networkMode: asset.networkMode,
        platform: asset.platform,
        outputs: asset.dockerOutputs,
        cacheFrom: asset.dockerCacheFrom,
        cacheTo: asset.dockerCacheTo,
      };

      this.boundStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, metadata);
      this.addedImageAssets.add(assetId);
    }

    return {
      imageUri: `${this.boundStack.account}.dkr.ecr.${this.boundStack.region}.${this.boundStack.urlSuffix}/${repositoryName}:${imageTag}`,
      repositoryName,
    };
  }

  private doAddFileAsset(asset: FileAssetSource): FileAssetLocation {
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

      this.boundStack.node.addMetadata(cxschema.ArtifactMetadataEntryType.ASSET, metadata);
    }

    const bucketName = params.bucketNameParameter.valueAsString;

    // key is prefix|postfix
    const encodedKey = params.objectKeyParameter.valueAsString;

    const s3Prefix = Fn.select(0, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const s3Filename = Fn.select(1, Fn.split(cxapi.ASSET_PREFIX_SEPARATOR, encodedKey));
    const objectKey = `${s3Prefix}${s3Filename}`;

    const httpUrl = `https://s3.${this.boundStack.region}.${this.boundStack.urlSuffix}/${bucketName}/${objectKey}`;
    const s3ObjectUrl = `s3://${bucketName}/${objectKey}`;

    return { bucketName, objectKey, httpUrl, s3ObjectUrl, s3Url: httpUrl };
  }

  private get assetParameters() {
    assertBound(this.boundStack);

    if (!this._assetParameters) {
      this._assetParameters = new Construct(this.boundStack, 'AssetParameters');
    }
    return this._assetParameters;
  }
}

function withoutDeprecationWarnings<A>(block: () => A): A {
  const orig = process.env.JSII_DEPRECATED;
  process.env.JSII_DEPRECATED = 'quiet';
  try {
    return block();
  } finally {
    process.env.JSII_DEPRECATED = orig;
  }
}
