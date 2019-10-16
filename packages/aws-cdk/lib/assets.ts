// eslint-disable-next-line max-len
import cxapi = require('@aws-cdk/cx-api');
import { CloudFormation } from 'aws-sdk';
import colors = require('colors');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import { ToolkitInfo } from './api/toolkit-info';
import { zipDirectory } from './archive';
import { prepareContainerAsset } from './docker';
import { debug, success } from './logging';

// eslint-disable-next-line max-len
export async function prepareAssets(stack: cxapi.CloudFormationStackArtifact, toolkitInfo?: ToolkitInfo, ci?: boolean, reuse?: string[]): Promise<CloudFormation.Parameter[]> {
  reuse = reuse || [];
  const assets = stack.assets;

  if (assets.length === 0) {
    return [];
  }

  if (!toolkitInfo) {
    // eslint-disable-next-line max-len
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

    const assemblyDir = stack.assembly.directory;
    params = params.concat(await prepareAsset(assemblyDir, asset, toolkitInfo, reuseAsset, ci));
  }

  return params;
}

// eslint-disable-next-line max-len
async function prepareAsset(assemblyDir: string, asset: cxapi.AssetMetadataEntry, toolkitInfo: ToolkitInfo, reuse: boolean, ci?: boolean): Promise<CloudFormation.Parameter[]> {
  switch (asset.packaging) {
    case 'zip':
      return await prepareZipAsset(assemblyDir, asset, toolkitInfo, reuse);
    case 'file':
      return await prepareFileAsset(assemblyDir, asset, toolkitInfo, reuse);
    case 'container-image':
      return await prepareContainerAsset(assemblyDir, asset, toolkitInfo, reuse, ci);
    default:
      // eslint-disable-next-line max-len
      throw new Error(`Unsupported packaging type: ${(asset as any).packaging}. You might need to upgrade your aws-cdk toolkit to support this asset type.`);
  }
}

async function prepareZipAsset(
    assemblyDir: string,
    asset: cxapi.FileAssetMetadataEntry,
    toolkitInfo: ToolkitInfo,
    reuse: boolean): Promise<CloudFormation.Parameter[]> {

  if (reuse) {
    return await prepareFileAsset(assemblyDir, asset, toolkitInfo, reuse);
  }

  const dirPath = path.isAbsolute(asset.path) ? asset.path : path.join(assemblyDir, asset.path);

  if (!(await fs.pathExists(dirPath)) || !(await fs.stat(dirPath)).isDirectory()) {
    throw new Error(`Unable to find directory: ${dirPath}`);
  }

  debug('Preparing zip asset from directory:', dirPath);
  const staging = await fs.mkdtemp(path.join(os.tmpdir(), 'cdk-assets'));
  try {
    const archiveFile = path.join(staging, 'archive.zip');
    await zipDirectory(dirPath, archiveFile);
    debug('zip archive:', archiveFile);
    return await prepareFileAsset(assemblyDir, asset, toolkitInfo, reuse, archiveFile, 'application/zip');
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
    assemblyDir: string,
    asset: cxapi.FileAssetMetadataEntry,
    toolkitInfo: ToolkitInfo,
    reuse: boolean,
    filePath?: string,
    contentType?: string): Promise<CloudFormation.Parameter[]> {

  if (reuse) {
    return [
      { ParameterKey: asset.s3BucketParameter, UsePreviousValue: true },
      { ParameterKey: asset.s3KeyParameter, UsePreviousValue: true },
      { ParameterKey: asset.artifactHashParameter, UsePreviousValue: true },
    ];
  }

  filePath = filePath || asset.path;

  if (!path.isAbsolute(filePath)) {
    filePath = path.join(assemblyDir, filePath);
  }

  debug('Preparing file asset:', filePath);

  const data = await fs.readFile(filePath);

  const s3KeyPrefix = `assets/${asset.id}/`;

  const { filename, key, changed, hash } = await toolkitInfo.uploadIfChanged(data, {
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
    { ParameterKey: asset.s3KeyParameter, ParameterValue: `${s3KeyPrefix}${cxapi.ASSET_PREFIX_SEPARATOR}${filename}` },
    { ParameterKey: asset.artifactHashParameter, ParameterValue: hash },
  ];
}
