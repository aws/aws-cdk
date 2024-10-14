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

  /**
   * Whether to build assets before publishing.
   *
   * @default true To remain backward compatible.
   */
  readonly buildAssets?: boolean;

  /**
   * Whether to build/publish assets in parallel
   *
   * @default true To remain backward compatible.
   */
  readonly parallel?: boolean;
}

/**
 * Use cdk-assets to publish all assets in the given manifest.
 */
export async function publishAssets(
  manifest: cdk_assets.AssetManifest,
  sdk: SdkProvider,
  targetEnv: cxapi.Environment,
  options: PublishAssetsOptions = {},
): Promise<AssetsPublishedProof> {
  // This shouldn't really happen (it's a programming error), but we don't have
  // the types here to guide us. Do an runtime validation to be super super sure.
  if (
    targetEnv.account === undefined ||
    targetEnv.account === cxapi.UNKNOWN_ACCOUNT ||
    targetEnv.region === undefined ||
    targetEnv.account === cxapi.UNKNOWN_REGION
  ) {
    throw new Error(`Asset publishing requires resolved account and region, got ${JSON.stringify(targetEnv)}`);
  }

  const publisher = new cdk_assets.AssetPublishing(manifest, {
    aws: new PublishingAws(sdk, targetEnv),
    progressListener: new PublishingProgressListener(options.quiet ?? false),
    throwOnError: false,
    publishInParallel: options.parallel ?? true,
    buildAssets: options.buildAssets ?? true,
    publishAssets: true,
    quiet: options.quiet,
  });
  await publisher.publish();
  if (publisher.hasFailures) {
    throw new Error('Failed to publish one or more assets. See the error messages above for more information.');
  }

  return { [PUBLISH_ASSET_PROOF_SYM]: true };
}

export interface BuildAssetsOptions {
  /**
   * Print progress at 'debug' level
   */
  readonly quiet?: boolean;

  /**
   * Build assets in parallel
   *
   * @default true
   */
  readonly parallel?: boolean;
}

/**
 * Use cdk-assets to build all assets in the given manifest.
 */
export async function buildAssets(
  manifest: cdk_assets.AssetManifest,
  sdk: SdkProvider,
  targetEnv: cxapi.Environment,
  options: BuildAssetsOptions = {},
) {
  // This shouldn't really happen (it's a programming error), but we don't have
  // the types here to guide us. Do an runtime validation to be super super sure.
  if (
    targetEnv.account === undefined ||
    targetEnv.account === cxapi.UNKNOWN_ACCOUNT ||
    targetEnv.region === undefined ||
    targetEnv.account === cxapi.UNKNOWN_REGION
  ) {
    throw new Error(`Asset building requires resolved account and region, got ${JSON.stringify(targetEnv)}`);
  }

  const publisher = new cdk_assets.AssetPublishing(manifest, {
    aws: new PublishingAws(sdk, targetEnv),
    progressListener: new PublishingProgressListener(options.quiet ?? false),
    throwOnError: false,
    publishInParallel: options.parallel ?? true,
    buildAssets: true,
    publishAssets: false,
  });
  await publisher.publish();
  if (publisher.hasFailures) {
    throw new Error('Failed to build one or more assets. See the error messages above for more information.');
  }
}

export class PublishingAws implements cdk_assets.IAws {
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

    const cacheKeyMap: any = {
      env, // region, name, account
      assumeRuleArn: options.assumeRoleArn,
      assumeRoleExternalId: options.assumeRoleExternalId,
      quiet: options.quiet,
    };

    if (options.assumeRoleAdditionalOptions) {
      cacheKeyMap.assumeRoleAdditionalOptions = options.assumeRoleAdditionalOptions;
    }

    const cacheKey = JSON.stringify(cacheKeyMap);

    const maybeSdk = this.sdkCache.get(cacheKey);
    if (maybeSdk) {
      return maybeSdk;
    }

    const sdk = (await this.aws.forEnvironment(env, Mode.ForWriting, {
      assumeRoleArn: options.assumeRoleArn,
      assumeRoleExternalId: options.assumeRoleExternalId,
      assumeRoleAdditionalOptions: options.assumeRoleAdditionalOptions,
    }, options.quiet)).sdk;
    this.sdkCache.set(cacheKey, sdk);

    return sdk;
  }
}

export const EVENT_TO_LOGGER: Record<cdk_assets.EventType, (x: string) => void> = {
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

const PUBLISH_ASSET_PROOF_SYM = Symbol('publish_assets_proof');

/**
 * This interface represents proof that assets have been published.
 *
 * Objects of this type can only be obtained by calling functions in this module.
 */
export interface AssetsPublishedProof {
  [PUBLISH_ASSET_PROOF_SYM]: true;
}

/**
 * If you promise that you will publish assets for every element of an array, this function will attest it for every size of an array.
 *
 * Without this function, there would be no way to get `AssetsPublishedProof` for an empty array,
 * since you'd have no single element to call `publishAssets` on.
 */
export async function multipleAssetPublishedProof<A>(xs: A[], block: (x: A) => Promise<AssetsPublishedProof>): Promise<AssetsPublishedProof> {
  for (const x of xs) {
    // Don't even care about the return value, just the type checking is good enough.
    await block(x);
  }
  return { [PUBLISH_ASSET_PROOF_SYM]: true };
}

/**
 * Conjure an `AssetsPublishedProof` out of thin air.
 *
 * This is only allowed in one location: the function `deployStack` in
 * `deploy-stack.ts`.  Do not call this function anywhere but there.
 *
 * The reason we have this is because the assets are published in an elaborate
 * way in the work graph there, and it's too much work for too little benefit to
 * do an elaborate token refactoring over there.
 *
 * This proof protocol exists for ancillary locations where we also need to send
 * a template to CloudFormation like `diff` and `import`, and that template
 * might be represented like a stack asset. Use of the proof forces a call
 * to `uploadStackTemplateAssets` in those locations.
 */
export function iAmDeployStack(): AssetsPublishedProof {
  return { [PUBLISH_ASSET_PROOF_SYM]: true };
}