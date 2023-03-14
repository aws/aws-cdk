import * as fs from 'fs';
import * as path from 'path';
import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { resolvedOr } from './_shared';
import { ISynthesisSession } from './types';
import { FileAssetSource, FileAssetPackaging, DockerImageAssetSource } from '../assets';
import { Stack } from '../stack';

/**
 * Build an asset manifest from assets added to a stack
 *
 * This class does not need to be used by app builders; it is only nessary for building Stack Synthesizers.
 */
export class AssetManifestBuilder {
  private readonly files: NonNullable<cxschema.AssetManifest['files']> = {};
  private readonly dockerImages: NonNullable<cxschema.AssetManifest['dockerImages']> = {};

  /**
   * Add a file asset to the manifest with default settings
   *
   * Derive the region from the stack, use the asset hash as the key, copy the
   * file extension over, and set the prefix.
   */
  public defaultAddFileAsset(stack: Stack, asset: FileAssetSource, target: AssetManifestFileDestination) {
    validateFileAssetSource(asset);

    const extension =
      asset.fileName != undefined ? path.extname(asset.fileName) : '';
    const objectKey =
      (target.bucketPrefix ?? '') +
      asset.sourceHash +
      (asset.packaging === FileAssetPackaging.ZIP_DIRECTORY
        ? '.zip'
        : extension);

    // Add to manifest
    return this.addFileAsset(stack, asset.sourceHash, {
      path: asset.fileName,
      executable: asset.executable,
      packaging: asset.packaging,
    }, {
      bucketName: target.bucketName,
      objectKey,
      region: resolvedOr(stack.region, undefined),
      assumeRoleArn: target.role?.assumeRoleArn,
      assumeRoleExternalId: target.role?.assumeRoleExternalId,
    });
  }

  /**
   * Add a docker image asset to the manifest with default settings
   *
   * Derive the region from the stack, use the asset hash as the key, and set the prefix.
   */
  public defaultAddDockerImageAsset(
    stack: Stack,
    asset: DockerImageAssetSource,
    target: AssetManifestDockerImageDestination,
  ) {
    validateDockerImageAssetSource(asset);
    const imageTag = `${target.dockerTagPrefix ?? ''}${asset.sourceHash}`;

    // Add to manifest
    return this.addDockerImageAsset(stack, asset.sourceHash, {
      executable: asset.executable,
      directory: asset.directoryName,
      dockerBuildArgs: asset.dockerBuildArgs,
      dockerBuildSecrets: asset.dockerBuildSecrets,
      dockerBuildTarget: asset.dockerBuildTarget,
      dockerFile: asset.dockerFile,
      networkMode: asset.networkMode,
      platform: asset.platform,
      dockerOutputs: asset.dockerOutputs,
      cacheFrom: asset.dockerCacheFrom,
      cacheTo: asset.dockerCacheTo,
    }, {
      repositoryName: target.repositoryName,
      imageTag,
      region: resolvedOr(stack.region, undefined),
      assumeRoleArn: target.role?.assumeRoleArn,
      assumeRoleExternalId: target.role?.assumeRoleExternalId,
    });
  }

  /**
   * Add a file asset source and destination to the manifest
   *
   * sourceHash should be unique for every source.
   */
  public addFileAsset(stack: Stack, sourceHash: string, source: cxschema.FileSource, dest: cxschema.FileDestination) {
    if (!this.files[sourceHash]) {
      this.files[sourceHash] = {
        source,
        destinations: {},
      };
    }
    this.files[sourceHash].destinations[this.manifestEnvName(stack)] = dest;
    return dest;
  }

  /**
   * Add a docker asset source and destination to the manifest
   *
   * sourceHash should be unique for every source.
   */
  public addDockerImageAsset(stack: Stack, sourceHash: string, source: cxschema.DockerImageSource, dest: cxschema.DockerImageDestination) {
    if (!this.dockerImages[sourceHash]) {
      this.dockerImages[sourceHash] = {
        source,
        destinations: {},
      };
    }
    this.dockerImages[sourceHash].destinations[this.manifestEnvName(stack)] = dest;
    return dest;
  }

  /**
   * Whether there are any assets registered in the manifest
   */
  public get hasAssets() {
    return Object.keys(this.files).length + Object.keys(this.dockerImages).length > 0;
  }

  /**
   * Write the manifest to disk, and add it to the synthesis session
   *
   * Return the artifact id, which should be added to the `additionalDependencies`
   * field of the stack artifact.
   */
  public emitManifest(
    stack: Stack,
    session: ISynthesisSession,
    options: cxschema.AssetManifestOptions = {},
  ): string {
    const artifactId = `${stack.artifactId}.assets`;
    const manifestFile = `${artifactId}.json`;
    const outPath = path.join(session.assembly.outdir, manifestFile);

    const manifest: cxschema.AssetManifest = {
      version: cxschema.Manifest.version(),
      files: this.files,
      dockerImages: this.dockerImages,
    };

    fs.writeFileSync(outPath, JSON.stringify(manifest, undefined, 2));

    session.assembly.addArtifact(artifactId, {
      type: cxschema.ArtifactType.ASSET_MANIFEST,
      properties: {
        file: manifestFile,
        ...options,
      },
    });

    return artifactId;
  }

  private manifestEnvName(stack: Stack): string {
    return [
      resolvedOr(stack.account, 'current_account'),
      resolvedOr(stack.region, 'current_region'),
    ].join('-');
  }
}

/**
 * The destination for a file asset, when it is given to the AssetManifestBuilder
 */
export interface AssetManifestFileDestination {
  /**
   * Bucket name where the file asset should be written
   */
  readonly bucketName: string;

  /**
   * Prefix to prepend to the asset hash
   *
   * @default ''
   */
  readonly bucketPrefix?: string;

  /**
   * Role to use for uploading
   *
   * @default - current role
   */
  readonly role?: RoleOptions;
}

/**
 * The destination for a docker image asset, when it is given to the AssetManifestBuilder
 */
export interface AssetManifestDockerImageDestination {
  /**
   * Repository name where the docker image asset should be written
   */
  readonly repositoryName: string;

  /**
   * Prefix to add to the asset hash to make the Docker image tag
   *
   * @default ''
   */
  readonly dockerTagPrefix?: string;

  /**
   * Role to use to perform the upload
   *
   * @default - No role
   */
  readonly role?: RoleOptions;
}

/**
 * Options for specifying a role
 */
export interface RoleOptions {
  /**
   * ARN of the role to assume
   */
  readonly assumeRoleArn: string;

  /**
   * External ID to use when assuming the role
   *
   * @default - No external ID
   */
  readonly assumeRoleExternalId?: string;
}

function validateFileAssetSource(asset: FileAssetSource) {
  if (!!asset.executable === !!asset.fileName) {
    throw new Error(`Exactly one of 'fileName' or 'executable' is required, got: ${JSON.stringify(asset)}`);
  }

  if (!!asset.packaging !== !!asset.fileName) {
    throw new Error(`'packaging' is expected in combination with 'fileName', got: ${JSON.stringify(asset)}`);
  }
}

function validateDockerImageAssetSource(asset: DockerImageAssetSource) {
  if (!!asset.executable === !!asset.directoryName) {
    throw new Error(`Exactly one of 'directoryName' or 'executable' is required, got: ${JSON.stringify(asset)}`);
  }

  check('dockerBuildArgs');
  check('dockerBuildTarget');
  check('dockerOutputs');
  check('dockerFile');

  function check<K extends keyof DockerImageAssetSource>(key: K) {
    if (asset[key] && !asset.directoryName) {
      throw new Error(`'${key}' is only allowed in combination with 'directoryName', got: ${JSON.stringify(asset)}`);
    }
  }
}
