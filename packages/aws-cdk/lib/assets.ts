// tslint:disable-next-line:max-line-length
import * as asset_schema from '@aws-cdk/cdk-assets-schema';
import * as cxapi from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import * as colors from 'colors';
import * as path from 'path';
import { ToolkitInfo } from './api/toolkit-info';
import { debug } from './logging';
import { AssetManifestBuilder } from './util/asset-manifest-builder';

/**
 * Take the metadata assets from the given stack and add them to the given asset manifest
 *
 * Returns the CloudFormation parameters that need to be sent to the template to
 * pass Asset coordinates.
 */
// tslint:disable-next-line:max-line-length
export async function addMetadataAssetsToManifest(stack: cxapi.CloudFormationStackArtifact, assetManifest: AssetManifestBuilder, toolkitInfo?: ToolkitInfo, reuse?: string[]): Promise<CloudFormation.Parameter[]> {
  reuse = reuse || [];
  const assets = stack.assets;

  if (assets.length === 0) {
    return [];
  }

  if (!toolkitInfo) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`This stack uses assets, so the toolkit stack must be deployed to the environment (Run "${colors.blue("cdk bootstrap " + stack.environment!.name)}")`);
  }

  let params = new Array<CloudFormation.Parameter>();
  for (const asset of assets) {
    // FIXME: Should have excluded by construct path here instead of by unique ID, preferably using
    // minimatch so we can support globs. Maybe take up during artifact refactoring.
    const reuseAsset = reuse.indexOf(asset.id) > -1;

    if (reuseAsset) {
      debug(`Preparing asset ${asset.id}: ${JSON.stringify(asset)} (reusing)`);
    } else {
      debug(`Preparing asset ${asset.id}: ${JSON.stringify(asset)}`);
    }

    if (!stack.assembly) {
      throw new Error(`Unexpected: stack assembly is required in order to find assets in assemly directory`);
    }

    params = params.concat(await prepareAsset(asset, assetManifest, toolkitInfo, reuseAsset));
  }

  return params;
}

// tslint:disable-next-line:max-line-length
async function prepareAsset(asset: cxapi.AssetMetadataEntry, assetManifest: AssetManifestBuilder, toolkitInfo: ToolkitInfo, reuse: boolean): Promise<CloudFormation.Parameter[]> {
  switch (asset.packaging) {
    case 'zip':
    case 'file':
      return prepareFileAsset(
        asset,
        assetManifest,
        toolkitInfo,
        asset.packaging === 'zip' ? asset_schema.FileAssetPackaging.ZIP_DIRECTORY : asset_schema.FileAssetPackaging.FILE,
        reuse);
    case 'container-image':
      return await prepareDockerImageAsset(asset, assetManifest, toolkitInfo, reuse);
    default:
      // tslint:disable-next-line:max-line-length
      throw new Error(`Unsupported packaging type: ${(asset as any).packaging}. You might need to upgrade your aws-cdk toolkit to support this asset type.`);
  }
}

function prepareFileAsset(
    asset: cxapi.FileAssetMetadataEntry,
    assetManifest: AssetManifestBuilder,
    toolkitInfo: ToolkitInfo,
    packaging: asset_schema.FileAssetPackaging,
    reuse: boolean): CloudFormation.Parameter[] {

  if (reuse) {
    return [
      { ParameterKey: asset.s3BucketParameter, UsePreviousValue: true },
      { ParameterKey: asset.s3KeyParameter, UsePreviousValue: true },
      { ParameterKey: asset.artifactHashParameter, UsePreviousValue: true },
    ];
  }

  const extension = packaging === asset_schema.FileAssetPackaging.ZIP_DIRECTORY ? '.zip' : path.extname(asset.path);
  const baseName = `${asset.sourceHash}${extension}`;
  const key = `assets/${asset.id}/${baseName}`;
  const s3url = `s3://${toolkitInfo.bucketName}/${key}`;

  debug(`Storing asset ${asset.path} at ${s3url}`);

  assetManifest.addFileAsset(asset.sourceHash, {
    path: asset.path,
    packaging
  }, {
    bucketName: toolkitInfo.bucketName,
    objectKey: key,
  });

  return [
    { ParameterKey: asset.s3BucketParameter, ParameterValue: toolkitInfo.bucketName },
    { ParameterKey: asset.s3KeyParameter, ParameterValue: `${key}${cxapi.ASSET_PREFIX_SEPARATOR}${baseName}` },
    { ParameterKey: asset.artifactHashParameter, ParameterValue: asset.sourceHash },
  ];
}

async function prepareDockerImageAsset(
    asset: cxapi.ContainerImageAssetMetadataEntry,
    assetManifest: AssetManifestBuilder,
    toolkitInfo: ToolkitInfo,
    reuse: boolean): Promise<CloudFormation.Parameter[]> {

  if (reuse) {
    if (!asset.imageNameParameter) { return []; }
    return [{ ParameterKey: asset.imageNameParameter, UsePreviousValue: true }];
  }

  // Pre-1.21.0, repositoryName can be specified by the user or can be left out, in which case we make
  // a per-asset repository which will get adopted and cleaned up along with the stack.
  // Post-1.21.0, repositoryName will always be specified and it will be a shared repository between
  // all assets.
  const repositoryName = asset.repositoryName ?? 'cdk/' + asset.id.replace(/[:/]/g, '-').toLowerCase();

  // Make sure the repository exists, since the 'cdk-assets' tool will not create it for us.
  const repositoryUri = await toolkitInfo.prepareEcrRepository(repositoryName);
  const imageTag = asset.sourceHash;

  assetManifest.addDockerImageAsset(asset.sourceHash, {
    directory: asset.path,
    dockerBuildArgs: asset.buildArgs,
    dockerBuildTarget: asset.target,
    dockerFile: asset.file
  }, {
    repositoryName,
    imageTag,
  });

  if (!asset.imageNameParameter) { return []; }
  return [{ ParameterKey: asset.imageNameParameter, ParameterValue: `${repositoryUri}:${imageTag}` }];
}