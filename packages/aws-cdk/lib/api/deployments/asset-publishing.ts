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
import type { SDK } from '..';
import { debug, error, info } from '../../logging';
import { ToolkitError } from '../../toolkit/error';
import type { SdkProvider } from '../aws-auth';
import { Mode } from '../plugin';

interface PublishAssetsOptions {
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
 *
 * @deprecated used in legacy deployments only, should be migrated at some point
 */
export async function publishAssets(
  manifest: AssetManifest,
  sdk: SdkProvider,
  targetEnv: Environment,
  options: PublishAssetsOptions,
) {
  // This shouldn't really happen (it's a programming error), but we don't have
  // the types here to guide us. Do an runtime validation to be super super sure.
  if (
    targetEnv.account === undefined ||
    targetEnv.account === UNKNOWN_ACCOUNT ||
    targetEnv.region === undefined ||
    targetEnv.account === UNKNOWN_REGION
  ) {
    throw new ToolkitError(`Asset publishing requires resolved account and region, got ${JSON.stringify(targetEnv)}`);
  }

  const publisher = new AssetPublishing(manifest, {
    aws: new PublishingAws(sdk, targetEnv),
    progressListener: new PublishingProgressListener(),
    throwOnError: false,
    publishInParallel: options.parallel ?? true,
    buildAssets: true,
    publishAssets: true,
    quiet: false,
  });
  await publisher.publish({ allowCrossAccount: options.allowCrossAccount });
  if (publisher.hasFailures) {
    throw new ToolkitError('Failed to publish one or more assets. See the error messages above for more information.');
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

function ignore() {
}

export const EVENT_TO_LOGGER: Record<EventType, (x: string) => void> = {
  build: debug,
  cached: debug,
  check: debug,
  debug,
  fail: error,
  found: debug,
  start: info,
  success: info,
  upload: debug,
  shell_open: debug,
  shell_stderr: ignore,
  shell_stdout: ignore,
  shell_close: ignore,
};

class PublishingProgressListener implements IPublishProgressListener {
  constructor() {}

  public onPublishEvent(type: EventType, event: IPublishProgress): void {
    const handler = EVENT_TO_LOGGER[type];
    handler(`[${event.percentComplete}%] ${type}: ${event.message}`);
  }
}
