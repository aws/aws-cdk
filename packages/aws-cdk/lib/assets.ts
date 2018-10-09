import { ASSET_METADATA, ASSET_PREFIX_SEPARATOR, AssetMetadataEntry, StackMetadata, SynthesizedStack } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { ToolkitInfo } from './api/toolkit-info';
import { zipDirectory } from './archive';
import { debug, success } from './logging';

export async function prepareAssets(stack: SynthesizedStack, toolkitInfo?: ToolkitInfo): Promise<CloudFormation.Parameter[]> {
  const assets = findAssets(stack.metadata);
  if (assets.length === 0) {
    return [];
  }

  if (!toolkitInfo) {
    throw new Error('Since this stack uses assets, the toolkit stack must be deployed to the environment ("cdk bootstrap")');
  }

  debug('Preparing assets');
  let params = new Array<CloudFormation.Parameter>();
  for (const asset of assets) {
    debug(` - ${asset.path} (${asset.packaging})`);

    params = params.concat(await prepareAsset(asset, toolkitInfo));
  }

  return params;
}

async function prepareAsset(asset: AssetMetadataEntry, toolkitInfo: ToolkitInfo): Promise<CloudFormation.Parameter[]> {
  debug('Preparing asset', JSON.stringify(asset));
  switch (asset.packaging) {
    case 'zip':
      return await prepareZipAsset(asset, toolkitInfo);
    case 'file':
      return await prepareFileAsset(asset, toolkitInfo);
    default:
      throw new Error(`Unsupported packaging type: ${asset.packaging}`);
  }
}

async function prepareZipAsset(asset: AssetMetadataEntry, toolkitInfo: ToolkitInfo): Promise<CloudFormation.Parameter[]> {
  debug('Preparing zip asset from directory:', asset.path);
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-assets'));
  try {
    const archiveFile = path.join(staging, 'archive.zip');
    await zipDirectory(asset.path, archiveFile);
    debug('zip archive:', archiveFile);
    return await prepareFileAsset(asset, toolkitInfo, archiveFile, 'application/zip');
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
    asset: AssetMetadataEntry,
    toolkitInfo: ToolkitInfo,
    filePath?: string,
    contentType?: string): Promise<CloudFormation.Parameter[]> {

  filePath = filePath || asset.path;
  debug('Preparing file asset:', filePath);

  const data = await fs.readFile(filePath);

  const s3KeyPrefix = `assets/${asset.id}/`;

  const { filename, key, changed } = await toolkitInfo.uploadIfChanged(data, {
    s3KeyPrefix,
    s3KeySuffix: path.extname(filePath),
    contentType
  });

  const s3url = `s3://${toolkitInfo.bucketName}/${key}`;
  if (changed) {
    success(` 👑  Asset ${asset.path} (${asset.packaging}) uploaded: ${s3url}`);
  } else {
    debug(` 👑  Asset ${asset.path} (${asset.packaging}) is up-to-date: ${s3url}`);
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
