// tslint:disable-next-line:max-line-length
import { debug, success } from '@aws-cdk/cdk-common';
import { ASSET_METADATA, ASSET_PREFIX_SEPARATOR, AssetMetadataEntry, FileAssetMetadataEntry, StackMetadata, SynthesizedStack } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import colors = require('colors');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { zipDirectory } from '../lib/archive';
import { ToolkitInfo } from './api/toolkit-info';
import { prepareContainerAsset } from './docker';

// tslint:disable-next-line:max-line-length
export async function prepareAssets(stack: SynthesizedStack, toolkitInfo?: ToolkitInfo, ci?: boolean, reuse?: string[]): Promise<CloudFormation.Parameter[]> {
  reuse = reuse || [];
  const assets = findAssets(stack.metadata);

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

    params = params.concat(await prepareAsset(asset, toolkitInfo, reuseAsset, ci));
  }

  return params;
}

// tslint:disable-next-line:max-line-length
async function prepareAsset(asset: AssetMetadataEntry, toolkitInfo: ToolkitInfo, reuse: boolean, ci?: boolean): Promise<CloudFormation.Parameter[]> {
  switch (asset.packaging) {
    case 'zip':
      return await prepareZipAsset(asset, toolkitInfo, reuse);
    case 'file':
      return await prepareFileAsset(asset, toolkitInfo, reuse);
    case 'container-image':
      return await prepareContainerAsset(asset, toolkitInfo, reuse, ci);
    default:
      // tslint:disable-next-line:max-line-length
      throw new Error(`Unsupported packaging type: ${(asset as any).packaging}. You might need to upgrade your aws-cdk toolkit to support this asset type.`);
  }
}

async function prepareZipAsset(asset: FileAssetMetadataEntry, toolkitInfo: ToolkitInfo, reuse: boolean): Promise<CloudFormation.Parameter[]> {
  if (reuse) {
    return await prepareFileAsset(asset, toolkitInfo, reuse);
  }

  debug('Preparing zip asset from directory:', asset.path);
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-assets'));
  try {
    const archiveFile = path.join(staging, 'archive.zip');
    await zipDirectory(asset.path, archiveFile);
    debug('zip archive:', archiveFile);
    return await prepareFileAsset(asset, toolkitInfo, reuse, archiveFile, 'application/zip');
  } finally {
    await fs.remove(staging);
  }
}

/**
 * @param asset The asset descriptor
 * @param toolkitInfo The toolkit stack
 * @param filePath Alternative file path to use (instead of asset.path)
 * @param contentType Content-type to use when uploading to S3 (none will be specified by default)
 */
async function prepareFileAsset(
    asset: FileAssetMetadataEntry,
    toolkitInfo: ToolkitInfo,
    reuse: boolean,
    filePath?: string,
    contentType?: string): Promise<CloudFormation.Parameter[]> {

  if (reuse) {
    return [
      { ParameterKey: asset.s3BucketParameter, UsePreviousValue: true },
      { ParameterKey: asset.s3KeyParameter, UsePreviousValue: true },
    ];
  }

  filePath = filePath || asset.path;
  debug('Preparing file asset:', filePath);

  const data = await fs.readFile(filePath);

  const s3KeyPrefix = `assets/${asset.id}/`;

  const { filename, key, changed } = await toolkitInfo.uploadIfChanged(data, {
    s3KeyPrefix,
    s3KeySuffix: path.extname(filePath),
    contentType
  });

  const relativePath = path.relative(process.cwd(), asset.path);

  const s3url = `s3://${toolkitInfo.bucketName}/${key}`;
  debug(`S3 url for ${relativePath}: ${s3url}`);
  if (changed) {
    success(`Updated: ${colors.bold(relativePath)} (${asset.packaging})`);
  } else {
    debug(`Up-to-date: ${colors.bold(relativePath)} (${asset.packaging})`);
  }

  return [
    { ParameterKey: asset.s3BucketParameter, ParameterValue: toolkitInfo.bucketName },
    { ParameterKey: asset.s3KeyParameter, ParameterValue: `${s3KeyPrefix}${ASSET_PREFIX_SEPARATOR}${filename}` },
  ];
}

function findAssets(metadata: StackMetadata): AssetMetadataEntry[] {
  const assets = new Array<AssetMetadataEntry>();

  for (const k of Object.keys(metadata)) {
    for (const entry of metadata[k]) {
      if (entry.type === ASSET_METADATA) {
        assets.push(entry.data);
      }
    }
  }

  return assets;
}
