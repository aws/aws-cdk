import * as fs from 'fs';
import * as path from 'path';

import * as cxschema from '@aws-cdk/cloud-assembly-schema';
import { FileAssetSource, FileAssetLocation, FileAssetPackaging, DockerImageAssetSource, DockerImageAssetLocation } from '../assets';
import { Fn } from '../cfn-fn';
import { Stack } from '../stack';
import { resolvedOr } from './_shared';
import { ISynthesisSession } from './types';

/**
 * Build an manifest from assets added to a stack synthesizer
 */
export class AssetManifestBuilder {
  private readonly files: NonNullable<cxschema.AssetManifest['files']> = {};
  private readonly dockerImages: NonNullable<cxschema.AssetManifest['dockerImages']> = {};

  public addFileAssetDefault(
    asset: FileAssetSource,
    stack: Stack,
    bucketName: string,
    bucketPrefix: string,
    role?: RoleOptions,
  ): FileAssetLocation {
    validateFileAssetSource(asset);

    const extension =
      asset.fileName != undefined ? path.extname(asset.fileName) : '';
    const objectKey =
      bucketPrefix +
      asset.sourceHash +
      (asset.packaging === FileAssetPackaging.ZIP_DIRECTORY
        ? '.zip'
        : extension);

    // Add to manifest
    this.files[asset.sourceHash] = {
      source: {
        path: asset.fileName,
        executable: asset.executable,
        packaging: asset.packaging,
      },
      destinations: {
        [this.manifestEnvName(stack)]: {
          bucketName: bucketName,
          objectKey,
          region: resolvedOr(stack.region, undefined),
          assumeRoleArn: role?.assumeRoleArn,
          assumeRoleExternalId: role?.assumeRoleExternalId,
        },
      },
    };

    const { region, urlSuffix } = stackLocationOrInstrinsics(stack);
    const httpUrl = cfnify(
      `https://s3.${region}.${urlSuffix}/${bucketName}/${objectKey}`,
    );
    const s3ObjectUrlWithPlaceholders = `s3://${bucketName}/${objectKey}`;

    // Return CFN expression
    //
    // 's3ObjectUrlWithPlaceholders' is intended for the CLI. The CLI ultimately needs a
    // 'https://s3.REGION.amazonaws.com[.cn]/name/hash' URL to give to CloudFormation.
    // However, there's no way for us to actually know the URL_SUFFIX in the framework, so
    // we can't construct that URL. Instead, we record the 's3://.../...' form, and the CLI
    // transforms it to the correct 'https://.../' URL before calling CloudFormation.
    return {
      bucketName: cfnify(bucketName),
      objectKey,
      httpUrl,
      s3ObjectUrl: cfnify(s3ObjectUrlWithPlaceholders),
      s3ObjectUrlWithPlaceholders,
      s3Url: httpUrl,
    };
  }

  public addDockerImageAssetDefault(
    asset: DockerImageAssetSource,
    stack: Stack,
    repositoryName: string,
    dockerTagPrefix: string,
    role?: RoleOptions,
  ): DockerImageAssetLocation {
    validateDockerImageAssetSource(asset);
    const imageTag = `${dockerTagPrefix}${asset.sourceHash}`;

    // Add to manifest
    this.dockerImages[asset.sourceHash] = {
      source: {
        executable: asset.executable,
        directory: asset.directoryName,
        dockerBuildArgs: asset.dockerBuildArgs,
        dockerBuildSecrets: asset.dockerBuildSecrets,
        dockerBuildTarget: asset.dockerBuildTarget,
        dockerFile: asset.dockerFile,
        networkMode: asset.networkMode,
        platform: asset.platform,
      },
      destinations: {
        [this.manifestEnvName(stack)]: {
          repositoryName: repositoryName,
          imageTag,
          region: resolvedOr(stack.region, undefined),
          assumeRoleArn: role?.assumeRoleArn,
          assumeRoleExternalId: role?.assumeRoleExternalId,
        },
      },
    };

    const { account, region, urlSuffix } = stackLocationOrInstrinsics(stack);

    // Return CFN expression
    return {
      repositoryName: cfnify(repositoryName),
      imageUri: cfnify(
        `${account}.dkr.ecr.${region}.${urlSuffix}/${repositoryName}:${imageTag}`,
      ),
      imageTag: cfnify(imageTag),
    };
  }

  /**
   * Write the manifest to disk, and add it to the synthesis session
   *
   * Reutrn the artifact Id
   */
  public writeManifest(
    stack: Stack,
    session: ISynthesisSession,
    additionalProps: Partial<cxschema.AssetManifestProperties> = {},
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
        ...additionalProps,
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

export interface RoleOptions {
  readonly assumeRoleArn?: string;
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
  check('dockerFile');

  function check<K extends keyof DockerImageAssetSource>(key: K) {
    if (asset[key] && !asset.directoryName) {
      throw new Error(`'${key}' is only allowed in combination with 'directoryName', got: ${JSON.stringify(asset)}`);
    }
  }
}

/**
 * Return the stack locations if they're concrete, or the original CFN intrisics otherwise
 *
 * We need to return these instead of the tokenized versions of the strings,
 * since we must accept those same ${AWS::AccountId}/${AWS::Region} placeholders
 * in bucket names and role names (in order to allow environment-agnostic stacks).
 *
 * We'll wrap a single {Fn::Sub} around the final string in order to replace everything,
 * but we can't have the token system render part of the string to {Fn::Join} because
 * the CFN specification doesn't allow the {Fn::Sub} template string to be an arbitrary
 * expression--it must be a string literal.
 */
function stackLocationOrInstrinsics(stack: Stack) {
  return {
    account: resolvedOr(stack.account, '${AWS::AccountId}'),
    region: resolvedOr(stack.region, '${AWS::Region}'),
    urlSuffix: resolvedOr(stack.urlSuffix, '${AWS::URLSuffix}'),
  };
}

/**
 * If the string still contains placeholders, wrap it in a Fn::Sub so they will be substituted at CFN deployment time
 *
 * (This happens to work because the placeholders we picked map directly onto CFN
 * placeholders. If they didn't we'd have to do a transformation here).
 */
function cfnify(s: string): string {
  return s.indexOf('${') > -1 ? Fn.sub(s) : s;
}