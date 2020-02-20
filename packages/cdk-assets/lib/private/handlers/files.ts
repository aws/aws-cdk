import { FileAssetPackaging } from '@aws-cdk/cdk-assets-schema';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';
import { FileManifestEntry } from '../../asset-manifest';
import { EventType } from '../../progress';
import { zipDirectory } from '../archive';
import { IAssetHandler, IHandlerHost } from "../asset-handler";
import { pathExists } from '../fs-extra';
import { replaceAwsPlaceholders } from "../placeholders";

export class FileAssetHandler implements IAssetHandler {
  private readonly fileCacheRoot: string;

  constructor(
    private readonly workDir: string,
    private readonly asset: FileManifestEntry,
    private readonly host: IHandlerHost) {
    this.fileCacheRoot = path.join(workDir, '.cache');
  }

  public async publish(): Promise<void> {
    const destination = await replaceAwsPlaceholders(this.asset.destination, this.host.aws);
    const s3Url = `s3://${destination.bucketName}/${destination.objectKey}`;

    const s3 = this.host.aws.s3Client(destination);
    this.host.emitMessage(EventType.CHECK, `Check ${s3Url}`);

    if (!await bucketExist(s3, destination.bucketName)) {
      throw new Error(`No bucket with name ${destination.bucketName} in account. Is this account bootstrapped?`);
    }

    if (await objectExists(s3, destination.bucketName, destination.objectKey)) {
      this.host.emitMessage(EventType.FOUND, `Found ${s3Url}`);
      return;
    }

    if (this.host.aborted) { return; }
    const publishFile = await this.packageFile();
    const contentType = this.asset.source.packaging === FileAssetPackaging.ZIP_DIRECTORY ? 'application/zip' : undefined;

    this.host.emitMessage(EventType.UPLOAD, `Upload ${s3Url}`);
    await s3.putObject({
      Bucket: destination.bucketName,
      Key: destination.objectKey,
      Body: createReadStream(publishFile),
      ContentType: contentType
    }).promise();
  }

  private async packageFile(): Promise<string> {
    const source = this.asset.source;
    const fullPath = path.join(this.workDir, this.asset.source.path);

    if (source.packaging === FileAssetPackaging.ZIP_DIRECTORY) {
      await fs.mkdir(this.fileCacheRoot, { recursive: true });
      const ret = path.join(this.fileCacheRoot, `${this.asset.id.assetId}.zip`);

      if (await pathExists(ret)) {
        this.host.emitMessage(EventType.CACHED, `From cache ${ret}`);
        return ret;
      }

      this.host.emitMessage(EventType.BUILD, `Zip ${fullPath} -> ${ret}`);
      await zipDirectory(fullPath, ret);
      return ret;
    } else {
      return fullPath;
    }
  }
}

async function bucketExist(s3: AWS.S3, bucket: string) {
  try {
    await s3.getBucketLocation({ Bucket: bucket });
    return true;
  } catch (e) {
    if (['NoSuchBucket', 'AccessDenied', 'AllAccessDisabled'].includes(e.code)) {
      return false;
    }
    throw e;
  }
}

async function objectExists(s3: AWS.S3, bucket: string, key: string) {
  try {
    await s3.headObject({ Bucket: bucket, Key: key }).promise();
    return true;
  } catch (e) {
    if (e.code === 'NotFound') {
      return false;
    }

    throw e;
  }
}