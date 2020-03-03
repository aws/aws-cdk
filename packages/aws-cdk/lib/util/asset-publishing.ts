import * as asset_schema from '@aws-cdk/cdk-assets-schema';
import * as AWS from 'aws-sdk';
import * as cdk_assets from 'cdk-assets';
import { debug, error } from '../logging';

/**
 * Use cdk-assets to publish all assets in the given manifest.
 */
export async function publishAssets(manifestDirectory: string, manifestData: asset_schema.ManifestFile) {
  const manifest = new cdk_assets.AssetManifest(manifestDirectory, manifestData);
  const publisher = new cdk_assets.AssetPublishing(manifest, {
    aws: new PublishingAws(),
    progressListener: new PublishingProgressListener(),
    throwOnError: false,
  });
}

class PublishingAws implements cdk_assets.IAws {
  public discoverDefaultRegion(): Promise<string> {
    throw new Error("Method not implemented.");

  }
  public discoverCurrentAccount(): Promise<cdk_assets.Account> {
    throw new Error("Method not implemented.");
  }

  public s3Client(options: cdk_assets.ClientOptions): Promise<AWS.S3> {
    throw new Error("Method not implemented.");
  }

  public ecrClient(options: cdk_assets.ClientOptions): Promise<AWS.ECR> {
    throw new Error("Method not implemented.");
  }
}

const EVENT_TO_LOGGER: Record<cdk_assets.EventType, (x: string) => void> = {
  build: debug,
  cached: debug,
  check: debug,
  debug,
  fail: error,
  found: debug,
  start: print,
  success: print,
  upload: debug,
};

class PublishingProgressListener implements cdk_assets.IPublishProgressListener {
  public onPublishEvent(type: cdk_assets.EventType, event: cdk_assets.IPublishProgress): void {
    EVENT_TO_LOGGER[type](`[${event.percentComplete}%] ${type}: ${event.message}`);
  }
}