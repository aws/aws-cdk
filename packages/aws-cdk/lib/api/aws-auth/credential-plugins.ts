import { inspect } from 'util';
import type { AwsCredentialIdentityProvider } from '@smithy/types';
import { debug, warning } from '../../logging';
import { CredentialProviderSource, PluginProviderResult, Mode, PluginHost, SDKv2CompatibleCredentials, SDKv3CompatibleCredentialProvider, SDKv3CompatibleCredentials } from '../plugin';

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

  public async fetchCredentialsFor(awsAccountId: string, mode: Mode): Promise<PluginCredentialsFetchResult | undefined> {
    const key = `${awsAccountId}-${mode}`;
    if (!(key in this.cache)) {
      this.cache[key] = await this.lookupCredentials(awsAccountId, mode);
    }
    return this.cache[key];
  }

  public get availablePluginNames(): string[] {
    return PluginHost.instance.credentialProviderSources.map((s) => s.name);
  }

  private async lookupCredentials(awsAccountId: string, mode: Mode): Promise<PluginCredentialsFetchResult | undefined> {
    const triedSources: CredentialProviderSource[] = [];
    // Otherwise, inspect the various credential sources we have
    for (const source of PluginHost.instance.credentialProviderSources) {
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
      const providerOrCreds = await source.getProvider(awsAccountId, mode, {
        supportsV3Providers: true,
      });

      return {
        credentials: v3ProviderFromPluginResult(providerOrCreds),
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
 * Converts whatever the plugin gave us into an SDKv3-compatible credential provider.
 */
function v3ProviderFromPluginResult(x: PluginProviderResult): AwsCredentialIdentityProvider {
  if (isV3Provider(x)) {
    return x;
  } else if (isV3Credentials(x)) {
    return () => Promise.resolve(x);
  } else if (isV2Credentials(x)) {
    return v3ProviderFromV2Credentials(x);
  } else {
    throw new Error(`Unrecognized credential provider result: ${inspect(x)}`);
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
      expiration: x.expireTime,
    };
  };
}

function isV3Provider(x: PluginProviderResult): x is SDKv3CompatibleCredentialProvider {
  return typeof x === 'function';
}

function isV2Credentials(x: PluginProviderResult): x is SDKv2CompatibleCredentials {
  return !!(x && typeof x === 'object' && x.accessKeyId && (x as SDKv2CompatibleCredentials).getPromise);
}

function isV3Credentials(x: PluginProviderResult): x is SDKv3CompatibleCredentials {
  return !!(x && typeof x === 'object' && x.accessKeyId && !isV2Credentials(x));
}