import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as cdk_assets from 'cdk-assets';
import { ISDK, Mode, SdkProvider } from '../api';
import { debug, error, print } from '../logging';

/**
 * Use cdk-assets to publish all assets in the given manifest.
 */
export async function publishAssets(manifest: cdk_assets.AssetManifest, sdk: SdkProvider, targetEnv: cxapi.Environment) {
  const publisher = new cdk_assets.AssetPublishing(manifest, {
    aws: new PublishingAws(sdk, targetEnv),
    progressListener: new PublishingProgressListener(),
    throwOnError: false,
  });
  await publisher.publish();
}

class PublishingAws implements cdk_assets.IAws {
  constructor(
    /**
     * The base SDK to work with
     */
    private readonly aws: SdkProvider,

    /**
     * Environment where the stack we're deploying is going
     */
    private readonly targetEnv: cxapi.Environment) {
  }

  public async discoverDefaultRegion(): Promise<string> {
    return this.aws.defaultRegion;
  }

  public async discoverCurrentAccount(): Promise<cdk_assets.Account> {
    const account = await this.aws.defaultAccount();
    if (!account) {
      throw new Error('AWS credentials are required to upload assets. Please configure environment variables or ~/.aws/credentials.');
    }
    return account;
  }

  public async s3Client(options: cdk_assets.ClientOptions): Promise<AWS.S3> {
    return (await this.sdk(options)).s3();
  }

  public async ecrClient(options: cdk_assets.ClientOptions): Promise<AWS.ECR> {
    return (await this.sdk(options)).ecr();
  }

  /**
   * Get an SDK appropriate for the given client options
   */
  private sdk(options: cdk_assets.ClientOptions): Promise<ISDK> {
    const region = options.region ?? this.targetEnv.region; // Default: same region as the stack

    return options.assumeRoleArn
      ? this.aws.withAssumedRole(options.assumeRoleArn, options.assumeRoleExternalId, region)
      : this.aws.forEnvironment(this.targetEnv.account, region, Mode.ForWriting);

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