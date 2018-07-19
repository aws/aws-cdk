import { ASSET_METADATA, AssetMetadataEntry, StackMetadata, SynthesizedStack } from "@aws-cdk/cx-api";
import { CloudFormation } from "aws-sdk";
import fs = require('fs-extra');
import path = require('path');
import { ToolkitInfo } from "./api/toolkit-info";
import { zipDirectory } from './archive';
import { debug, success } from "./logging";

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
    const staging = await fs.mkdtemp('/tmp/cdk-assets');
    try {
        const archiveFile = path.join(staging, 'archive.zip');
        await zipDirectory(asset.path, archiveFile);
        debug('zip archive:', archiveFile);

        // now it's a file asset...
        asset.path = archiveFile;
        asset.packaging = 'file';
        return await prepareFileAsset(asset, toolkitInfo, 'application/zip');
    } finally {
        await fs.remove(staging);
    }
}

async function prepareFileAsset(asset: AssetMetadataEntry, toolkitInfo: ToolkitInfo, contentType?: string): Promise<CloudFormation.Parameter[]> {
    debug('Preparing file asset:', asset.path);

    const data = await fs.readFile(asset.path);

    const { key, changed } = await toolkitInfo.uploadIfChanged(data, {
        s3KeyPrefix: 'assets/',
        s3KeySuffix: path.extname(asset.path),
        contentType
    });

    const s3url = `s3://${toolkitInfo.bucketName}/${key}`;
    if (changed) {
        success(` 👜  Asset ${asset.path} uploaded to ${s3url}`);
    } else {
        success(` 👜  Asset ${asset.path} is already up-to-date in ${s3url}`);
    }

    return [
        { ParameterKey: asset.s3BucketParameter, ParameterValue: toolkitInfo.bucketName },
        { ParameterKey: asset.s3KeyParameter, ParameterValue: key }
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