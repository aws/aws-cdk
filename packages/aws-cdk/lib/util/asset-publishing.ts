import { type Environment, UNKNOWN_ACCOUNT, UNKNOWN_REGION } from '@aws-cdk/cx-api';
import {
  type Account,
  type AssetManifest,
  AssetPublishing,
  ClientOptions,
  EventType,
  type IAws,
  type IECRClient,
  type IPublishProgress,
  type IPublishProgressListener,
  type IS3Client,
  type ISecretsManagerClient,
} from 'cdk-assets';
import type { SDK } from '../api';
import type { SdkProvider } from '../api/aws-auth/sdk-provider';
import { Mode } from '../api/plugin';
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

  /**
   * Whether cdk-assets is allowed to do cross account publishing.
   */
  readonly allowCrossAccount: boolean;
}

/**
 * Use cdk-assets to publish all assets in the given manifest.
 */
export async function publishAssets(
  manifest: AssetManifest,
  sdk: SdkProvider,
  targetEnv: Environment,
  options: PublishAssetsOptions,
): Promise<AssetsPublishedProof> {
  // This shouldn't really happen (it's a programming error), but we don't have
  // the types here to guide us. Do an runtime validation to be super super sure.
  if (
    targetEnv.account === undefined ||
    targetEnv.account === UNKNOWN_ACCOUNT ||
    targetEnv.region === undefined ||
    targetEnv.account === UNKNOWN_REGION
  ) {
    throw new Error(`Asset publishing requires resolved account and region, got ${JSON.stringify(targetEnv)}`);
  }

  const publisher = new AssetPublishing(manifest, {
    aws: new PublishingAws(sdk, targetEnv),
    progressListener: new PublishingProgressListener(options.quiet ?? false),
    throwOnError: false,
    publishInParallel: options.parallel ?? true,
    buildAssets: options.buildAssets ?? true,
    publishAssets: true,
    quiet: options.quiet,
  });
  await publisher.publish({
    allowCrossAccount: options.allowCrossAccount,
  });
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
  manifest: AssetManifest,
  sdk: SdkProvider,
  targetEnv: Environment,
  options: BuildAssetsOptions = {},
) {
  // This shouldn't really happen (it's a programming error), but we don't have
  // the types here to guide us. Do an runtime validation to be super super sure.
  if (
    targetEnv.account === undefined ||
    targetEnv.account === UNKNOWN_ACCOUNT ||
    targetEnv.region === undefined ||
    targetEnv.account === UNKNOWN_REGION
  ) {
    throw new Error(`Asset building requires resolved account and region, got ${JSON.stringify(targetEnv)}`);
  }

  const publisher = new AssetPublishing(manifest, {
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

export class PublishingAws implements IAws {
  private sdkCache: Map<String, SDK> = new Map();

  constructor(
    /**
     * The base SDK to work with
     */
    private readonly aws: SdkProvider,

    /**
     * Environment where the stack we're deploying is going
     */
    private readonly targetEnv: Environment,
  ) {}

  public async discoverPartition(): Promise<string> {
    return (await this.aws.baseCredentialsPartition(this.targetEnv, Mode.ForWriting)) ?? 'aws';
  }

  public async discoverDefaultRegion(): Promise<string> {
    return this.targetEnv.region;
  }

  public async discoverCurrentAccount(): Promise<Account> {
    const account = await this.aws.defaultAccount();
    return (
      account ?? {
        accountId: '<unknown account>',
        partition: 'aws',
      }
    );
  }

  public async discoverTargetAccount(options: ClientOptions): Promise<Account> {
    return (await this.sdk(options)).currentAccount();
  }

  public async s3Client(options: ClientOptions): Promise<IS3Client> {
    return (await this.sdk(options)).s3();
  }

  public async ecrClient(options: ClientOptions): Promise<IECRClient> {
    return (await this.sdk(options)).ecr();
  }

  public async secretsManagerClient(options: ClientOptions): Promise<ISecretsManagerClient> {
    return (await this.sdk(options)).secretsManager();
  }

  /**
   * Get an SDK appropriate for the given client options
   */
  private async sdk(options: ClientOptions): Promise<SDK> {
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

    const sdk = (
      await this.aws.forEnvironment(
        env,
        Mode.ForWriting,
        {
          assumeRoleArn: options.assumeRoleArn,
          assumeRoleExternalId: options.assumeRoleExternalId,
          assumeRoleAdditionalOptions: options.assumeRoleAdditionalOptions,
        },
        options.quiet,
      )
    ).sdk;
    this.sdkCache.set(cacheKey, sdk);

    return sdk;
  }
}

export const EVENT_TO_LOGGER: Record<EventType, (x: string) => void> = {
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

class PublishingProgressListener implements IPublishProgressListener {
  constructor(private readonly quiet: boolean) {}

  public onPublishEvent(type: EventType, event: IPublishProgress): void {
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