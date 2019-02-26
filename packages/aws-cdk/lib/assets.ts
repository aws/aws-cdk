// tslint:disable-next-line:max-line-length
import { ASSET_METADATA, ASSET_PREFIX_SEPARATOR, AssetMetadataEntry, BuildMetadataEntry, FileAssetMetadataEntry, StackMetadata, SynthesizedStack } from '@aws-cdk/cx-api';
import { CloudFormation } from 'aws-sdk';
import colors = require('colors');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { ToolkitInfo } from './api/toolkit-info';
import { zipDirectory } from './archive';
import { prepareContainerAsset } from './docker';
import { debug, success } from './logging';
import { shell } from './os';

export async function prepareAssets(stack: SynthesizedStack, toolkitInfo?: ToolkitInfo, ci?: boolean): Promise<CloudFormation.Parameter[]> {
  const assets = findAssets(stack.metadata);
  if (assets.length === 0) {
    return [];
  }

  if (!toolkitInfo) {
    // tslint:disable-next-line:max-line-length
    throw new Error(`This stack uses assets, so the toolkit stack must be deployed to the environment (Run "${colors.blue("cdk bootstrap " + stack.environment!.name)}")`);
  }

  debug('Preparing assets');
  let params = new Array<CloudFormation.Parameter>();
  for (const asset of assets) {
    debug(` - ${asset.path} (${asset.packaging})`);

    params = params.concat(await prepareAsset(asset, toolkitInfo, ci));
  }

  return params;
}

async function prepareAsset(asset: AssetMetadataEntry, toolkitInfo: ToolkitInfo, ci?: boolean): Promise<CloudFormation.Parameter[]> {
  debug('Preparing asset', JSON.stringify(asset));
  switch (asset.packaging) {
    case 'zip':
      return await prepareZipAsset(asset, toolkitInfo);
    case 'file':
      return await prepareFileAsset(asset, toolkitInfo);
    case 'build':
      return await prepareBuildAsset(asset, toolkitInfo);
    case 'container-image':
      return await prepareContainerAsset(asset, toolkitInfo, ci);
    default:
      // tslint:disable-next-line:max-line-length
      throw new Error(`Unsupported packaging type: ${(asset as any).packaging}. You might need to upgrade your aws-cdk toolkit to support this asset type.`);
  }
}

async function prepareBuildAsset(asset: BuildMetadataEntry, toolkitInfo: ToolkitInfo): Promise<CloudFormation.Parameter[]> {
  debug('Building project asset:', asset.codePath);

  // working directory within container
  const wd = '/tmp/cdk.out/';

  await shell([
    'docker', 'run',
    ...(asset.stdin !== undefined ? ['-i'] : []),
    '-w', wd,
    '--mount', `type=bind,source=${asset.codePath},target=${wd}`,
    asset.image,
    asset.command,
    ...(asset.args || [])], {
      stdin: asset.stdin
    });

  return await prepareFileAsset({
    ...asset,
    packaging: 'zip',
  }, toolkitInfo);
}

async function prepareZipAsset(asset: FileAssetMetadataEntry, toolkitInfo: ToolkitInfo): Promise<CloudFormation.Parameter[]> {
  debug('Preparing zip asset from directory:', asset.path);
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-assets'));
  // const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-assets'));
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
    asset: FileAssetMetadataEntry,
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
