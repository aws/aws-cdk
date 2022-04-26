import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as cdk_assets from 'cdk-assets';
import { Mode } from '../api/aws-auth/credentials';
import { ISDK } from '../api/aws-auth/sdk';
import { SdkProvider } from '../api/aws-auth/sdk-provider';
import { debug, error, print } from '../logging';

export interface PublishAssetsOptions {
  /**
   * Print progress at 'debug' level
   */
  readonly quiet?: boolean;
}

/**
 * Use cdk-assets to publish all assets in the given manifest.
 */
export async function publishAssets(
  manifest: cdk_assets.AssetManifest,
  sdk: SdkProvider,
  targetEnv: cxapi.Environment,
  options: PublishAssetsOptions = {},
) {
  // This shouldn't really happen (it's a programming error), but we don't have
  // the types here to guide us. Do an runtime validation to be super super sure.
  if (
    targetEnv.account === undefined ||
    targetEnv.account === cxapi.UNKNOWN_ACCOUNT ||
    targetEnv.region === undefined ||
    targetEnv.account === cxapi.UNKNOWN_REGION
  ) {
    throw new Error(`Asset publishing requires resolved account and region, got ${JSON.stringify( targetEnv)}`);
  }

  const publisher = new cdk_assets.AssetPublishing(manifest, {
    aws: new PublishingAws(sdk, targetEnv),
    progressListener: new PublishingProgressListener(options.quiet ?? false),
    throwOnError: false,
    publishInParallel: true,
  });
  await publisher.publish();
  if (publisher.hasFailures) {
    throw new Error('Failed to publish one or more assets. See the error messages above for more information.');
  }
}

class PublishingAws implements cdk_assets.IAws {
  private sdkCache: Map<String, ISDK> = new Map();

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

  public async discoverPartition(): Promise<string> {
    return (await this.aws.baseCredentialsPartition(this.targetEnv, Mode.ForWriting)) ?? 'aws';
  }

  public async discoverDefaultRegion(): Promise<string> {
    return this.targetEnv.region;
  }

  public async discoverCurrentAccount(): Promise<cdk_assets.Account> {
    const account = await this.aws.defaultAccount();
    return account ?? {
      accountId: '<unknown account>',
      partition: 'aws',
    };
  }

  public async discoverTargetAccount(options: cdk_assets.ClientOptions): Promise<cdk_assets.Account> {
    return (await this.sdk(options)).currentAccount();
  }

  public async s3Client(options: cdk_assets.ClientOptions): Promise<AWS.S3> {
    return (await this.sdk(options)).s3();
  }

  public async ecrClient(options: cdk_assets.ClientOptions): Promise<AWS.ECR> {
    return (await this.sdk(options)).ecr();
  }

  public async secretsManagerClient(options: cdk_assets.ClientOptions): Promise<AWS.SecretsManager> {
    return (await this.sdk(options)).secretsManager();
  }

  /**
   * Get an SDK appropriate for the given client options
   */
  private async sdk(options: cdk_assets.ClientOptions): Promise<ISDK> {
    const env = {
      ...this.targetEnv,
      region: options.region ?? this.targetEnv.region, // Default: same region as the stack
    };

    const cacheKey = JSON.stringify({
      env, // region, name, account
      assumeRuleArn: options.assumeRoleArn,
      assumeRoleExternalId: options.assumeRoleExternalId,
    });

    const maybeSdk = this.sdkCache.get(cacheKey);
    if (maybeSdk) {
      return maybeSdk;
    }

    const sdk = (await this.aws.forEnvironment(env, Mode.ForWriting, {
      assumeRoleArn: options.assumeRoleArn,
      assumeRoleExternalId: options.assumeRoleExternalId,
    })).sdk;
    this.sdkCache.set(cacheKey, sdk);

    return sdk;
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
  constructor(private readonly quiet: boolean) {
  }

  public onPublishEvent(type: cdk_assets.EventType, event: cdk_assets.IPublishProgress): void {
    const handler = this.quiet && type !== 'fail' ? debug : EVENT_TO_LOGGER[type];
    handler(`[${event.percentComplete}%] ${type}: ${event.message}`);
  }
}
