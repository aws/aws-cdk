import { inspect } from 'util';
import * as chalk from 'chalk';

import { error } from './_env';
import { ContextProviderPlugin, isContextProviderPlugin } from './context-provider-plugin';
import { CredentialProviderSource } from './credential-provider-source';

/**
 * The basic contract for plug-ins to adhere to::
 *
 *   import { Plugin, PluginHost } from 'aws-cdk';
 *   import { CustomCredentialProviderSource } from './custom-credential-provider-source';
 *
 *   export default class FooCDKPlugIn implements PluginHost {
 *     public readonly version = '1';
 *
 *     public init(host: PluginHost) {
 *     host.registerCredentialProviderSource(new CustomCredentialProviderSource());
 *     }
 *   }
 *
 */
export interface Plugin {
  /**
   * The version of the plug-in interface used by the plug-in. This will be used by
   * the plug-in host to handle version changes.
   */
  version: '1';

  /**
   * When defined, this function is invoked right after the plug-in has been loaded,
   * so that the plug-in is able to initialize itself. It may call methods of the
   * ``PluginHost`` instance it receives to register new ``CredentialProviderSource``
   * instances.
   */
  init?: (host: PluginHost) => void;
}

/**
 * A utility to manage plug-ins.
 *
 */
export class PluginHost {
  public static instance = new PluginHost();

  /**
   * Access the currently registered CredentialProviderSources. New sources can
   * be registered using the +registerCredentialProviderSource+ method.
   */
  public readonly credentialProviderSources = new Array<CredentialProviderSource>();

  public readonly contextProviderPlugins: Record<string, ContextProviderPlugin> = {};

  constructor() {
    if (PluginHost.instance && PluginHost.instance !== this) {
      throw new Error('New instances of PluginHost must not be built. Use PluginHost.instance instead!');
    }
  }

  /**
   * Loads a plug-in into this PluginHost.
   *
   * @param moduleSpec the specification (path or name) of the plug-in module to be loaded.
   */
  public load(moduleSpec: string) {
    try {
      /* eslint-disable @typescript-eslint/no-require-imports */
      const plugin = require(moduleSpec);
      /* eslint-enable */
      if (!isPlugin(plugin)) {
        error(`Module ${chalk.green(moduleSpec)} is not a valid plug-in, or has an unsupported version.`);
        throw new Error(`Module ${moduleSpec} does not define a valid plug-in.`);
      }
      if (plugin.init) { plugin.init(PluginHost.instance); }
    } catch (e: any) {
      error(`Unable to load ${chalk.green(moduleSpec)}: ${e.stack}`);
      throw new Error(`Unable to load plug-in: ${moduleSpec}`);
    }

    function isPlugin(x: any): x is Plugin {
      return x != null && x.version === '1';
    }
  }

  /**
   * Allows plug-ins to register new CredentialProviderSources.
   *
   * @param source a new CredentialProviderSource to register.
   */
  public registerCredentialProviderSource(source: CredentialProviderSource) {
    // Forward to the right credentials-related plugin host
    this.credentialProviderSources.push(source);
  }

  /**
   * (EXPERIMENTAL) Allow plugins to register context providers
   *
   * Context providers are objects with the following method:
   *
   * ```ts
   *   getValue(args: {[key: string]: any}): Promise<any>;
   * ```
   *
   * Currently, they cannot reuse the CDK's authentication mechanisms, so they
   * must be prepared to either not make AWS calls or use their own source of
   * AWS credentials.
   *
   * This feature is experimental, and only intended to be used internally at Amazon
   * as a trial.
   *
   * After registering with 'my-plugin-name', the provider must be addressed as follows:
   *
   * ```ts
   * const value = ContextProvider.getValue(this, {
   *   providerName: 'plugin',
   *   props: {
   *     pluginName: 'my-plugin-name',
   *     myParameter1: 'xyz',
   *   },
   *   includeEnvironment: true | false,
   *   dummyValue: 'what-to-return-on-the-first-pass',
   * })
   * ```
   *
   * @experimental
   */
  public registerContextProviderAlpha(pluginProviderName: string, provider: ContextProviderPlugin) {
    if (!isContextProviderPlugin(provider)) {
      throw new Error(`Object you gave me does not look like a ContextProviderPlugin: ${inspect(provider)}`);
    }
    this.contextProviderPlugins[pluginProviderName] = provider;
  }
}
