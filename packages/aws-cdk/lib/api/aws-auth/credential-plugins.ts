import { inspect } from 'util';
import type { CredentialProviderSource, ForReading, ForWriting, PluginProviderResult, SDKv2CompatibleCredentials, SDKv3CompatibleCredentialProvider, SDKv3CompatibleCredentials } from '@aws-cdk/cli-plugin-contract';
import type { AwsCredentialIdentity, AwsCredentialIdentityProvider } from '@smithy/types';
import { credentialsAboutToExpire, makeCachingProvider } from './provider-caching';
import { debug, warning } from '../../logging';
import { AuthenticationError } from '../../toolkit/error';
import { Mode } from '../plugin/mode';
import { PluginHost } from '../plugin/plugin';

/**
 * Cache for credential providers.
 *
 * Given an account and an operating mode (read or write) will return an
 * appropriate credential provider for credentials for the given account. The
 * credential provider will be cached so that multiple AWS clients for the same
 * environment will not make multiple network calls to obtain credentials.
 *
 * Will use default credentials if they are for the right account; otherwise,
 * all loaded credential provider plugins will be tried to obtain credentials
 * for the given account.
 */
export class CredentialPlugins {
  private readonly cache: { [key: string]: PluginCredentialsFetchResult | undefined } = {};
  private readonly host: PluginHost;

  constructor(host?: PluginHost) {
    this.host = host ?? PluginHost.instance;
  }

  public async fetchCredentialsFor(awsAccountId: string, mode: Mode): Promise<PluginCredentialsFetchResult | undefined> {
    const key = `${awsAccountId}-${mode}`;
    if (!(key in this.cache)) {
      this.cache[key] = await this.lookupCredentials(awsAccountId, mode);
    }
    return this.cache[key];
  }

  public get availablePluginNames(): string[] {
    return this.host.credentialProviderSources.map((s) => s.name);
  }

  private async lookupCredentials(awsAccountId: string, mode: Mode): Promise<PluginCredentialsFetchResult | undefined> {
    const triedSources: CredentialProviderSource[] = [];
    // Otherwise, inspect the various credential sources we have
    for (const source of this.host.credentialProviderSources) {
      let available: boolean;
      try {
        available = await source.isAvailable();
      } catch (e: any) {
        // This shouldn't happen, but let's guard against it anyway
        warning(`Uncaught exception in ${source.name}: ${e.message}`);
        available = false;
      }

      if (!available) {
        debug('Credentials source %s is not available, ignoring it.', source.name);
        continue;
      }
      triedSources.push(source);
      let canProvide: boolean;
      try {
        canProvide = await source.canProvideCredentials(awsAccountId);
      } catch (e: any) {
        // This shouldn't happen, but let's guard against it anyway
        warning(`Uncaught exception in ${source.name}: ${e.message}`);
        canProvide = false;
      }
      if (!canProvide) {
        continue;
      }
      debug(`Using ${source.name} credentials for account ${awsAccountId}`);

      return {
        credentials: await v3ProviderFromPlugin(() => source.getProvider(awsAccountId, mode as ForReading | ForWriting, {
          supportsV3Providers: true,
        })),
        pluginName: source.name,
      };
    }
    return undefined;
  }
}

/**
 * Result from trying to fetch credentials from the Plugin host
 */
export interface PluginCredentialsFetchResult {
  /**
   * SDK-v3 compatible credential provider
   */
  readonly credentials: AwsCredentialIdentityProvider;

  /**
   * Name of plugin that successfully provided credentials
   */
  readonly pluginName: string;
}

/**
 * Take a function that calls the plugin, and turn it into an SDKv3-compatible credential provider.
 *
 * What we will do is the following:
 *
 * - Query the plugin and see what kind of result it gives us.
 * - If the result is self-refreshing or doesn't need refreshing, we turn it into an SDKv3 provider
 *   and return it directly.
 *   * If the underlying return value is a provider, we will make it a caching provider
 *     (because we can't know if it will cache by itself or not).
 *   * If the underlying return value is a static credential, caching isn't relevant.
 *   * If the underlying return value is V2 credentials, those have caching built-in.
 * - If the result is a static credential that expires, we will wrap it in an SDKv3 provider
 *   that will query the plugin again when the credential expires.
 */
async function v3ProviderFromPlugin(producer: () => Promise<PluginProviderResult>): Promise<AwsCredentialIdentityProvider> {
  const initial = await producer();

  if (isV3Provider(initial)) {
    // Already a provider, make caching
    return makeCachingProvider(initial);
  } else if (isV3Credentials(initial) && initial.expiration === undefined) {
    // Static credentials that don't need refreshing nor caching
    return () => Promise.resolve(initial);
  } else if (isV3Credentials(initial) && initial.expiration !== undefined) {
    // Static credentials that do need refreshing and caching
    return refreshFromPluginProvider(initial, producer);
  } else if (isV2Credentials(initial)) {
    // V2 credentials that refresh and cache themselves
    return v3ProviderFromV2Credentials(initial);
  } else {
    throw new AuthenticationError(`Plugin returned a value that doesn't resemble AWS credentials: ${inspect(initial)}`);
  }
}

/**
 * Converts a V2 credential into a V3-compatible provider
 */
function v3ProviderFromV2Credentials(x: SDKv2CompatibleCredentials): AwsCredentialIdentityProvider {
  return async () => {
    // Get will fetch or refresh as necessary
    await x.getPromise();

    return {
      accessKeyId: x.accessKeyId,
      secretAccessKey: x.secretAccessKey,
      sessionToken: x.sessionToken,
      expiration: x.expireTime ?? undefined,
    };
  };
}

function refreshFromPluginProvider(current: AwsCredentialIdentity, producer: () => Promise<PluginProviderResult>): AwsCredentialIdentityProvider {
  return async () => {
    // eslint-disable-next-line no-console
    console.error(current, Date.now());
    if (credentialsAboutToExpire(current)) {
      const newCreds = await producer();
      if (!isV3Credentials(newCreds)) {
        throw new AuthenticationError(`Plugin initially returned static V3 credentials but now returned something else: ${inspect(newCreds)}`);
      }
      current = newCreds;
    }
    return current;
  };
}

function isV3Provider(x: PluginProviderResult): x is SDKv3CompatibleCredentialProvider {
  return typeof x === 'function';
}

function isV2Credentials(x: PluginProviderResult): x is SDKv2CompatibleCredentials {
  return !!(x && typeof x === 'object' && (x as SDKv2CompatibleCredentials).getPromise);
}

function isV3Credentials(x: PluginProviderResult): x is SDKv3CompatibleCredentials {
  return !!(x && typeof x === 'object' && x.accessKeyId && !isV2Credentials(x));
}
