import * as AWS from 'aws-sdk';
import * as cdk_assets from 'cdk-assets';
import { ISDK } from '../api';
import { debug, error } from '../logging';

/**
 * Use cdk-assets to publish all assets in the given manifest.
 */
export async function publishAssets(manifest: cdk_assets.AssetManifest, sdk: ISDK) {
  const publisher = new cdk_assets.AssetPublishing(manifest, {
    aws: new PublishingAws(sdk),
    progressListener: new PublishingProgressListener(),
    throwOnError: false,
  });
}

class PublishingAws implements cdk_assets.IAws {
  constructor(private readonly sdk: ISDK) {
  }

  public async discoverDefaultRegion(): Promise<string> {
    return await this.sdk.defaultRegion() ?? 'us-east-1';
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