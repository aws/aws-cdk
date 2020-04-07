import { debug } from '../../logging';
import { PluginHost } from '../../plugin';
import { CredentialProviderSource, Mode } from './credentials';

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
  private readonly cache: {[key: string]: AWS.Credentials | undefined} = {};

  public async fetchCredentialsFor(awsAccountId: string, mode: Mode): Promise<AWS.Credentials | undefined> {
    const key = `${awsAccountId}-${mode}`;
    if (!(key in this.cache)) {
      this.cache[key] = await this.lookupCredentials(awsAccountId, mode);
    }
    return this.cache[key];
  }

  public get availablePluginNames(): string[] {
    return PluginHost.instance.credentialProviderSources.map(s => s.name);
  }

  private async lookupCredentials(awsAccountId: string, mode: Mode): Promise<AWS.Credentials | undefined> {
    const triedSources: CredentialProviderSource[] = [];
    // Otherwise, inspect the various credential sources we have
    for (const source of PluginHost.instance.credentialProviderSources) {
      if (!(await source.isAvailable())) {
        debug('Credentials source %s is not available, ignoring it.', source.name);
        continue;
      }
      triedSources.push(source);
      if (!(await source.canProvideCredentials(awsAccountId))) { continue; }
      debug(`Using ${source.name} credentials for account ${awsAccountId}`);
      const providerOrCreds = await source.getProvider(awsAccountId, mode);

      // Backwards compatibility: if the plugin returns a ProviderChain, resolve that chain.
      // Otherwise it must have returned credentials.
      if ((providerOrCreds as any).resolvePromise) {
        return await (providerOrCreds as any).resolvePromise();
      }
      return providerOrCreds;
    }
    return undefined;
  }
}
