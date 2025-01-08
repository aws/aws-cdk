import { inspect } from 'util';
import type { CredentialProviderSource, IPluginHost, Plugin } from '@aws-cdk/cli-plugin-contract';
import * as chalk from 'chalk';

import { type ContextProviderPlugin, isContextProviderPlugin } from './context-provider-plugin';
import { error } from '../../logging';
import { ToolkitError } from '../../toolkit/error';

export let TESTING = false;

export function markTesting() {
  TESTING = true;
}

/**
 * A utility to manage plug-ins.
 *
 */
export class PluginHost implements IPluginHost {
  public static instance = new PluginHost();

  /**
   * Access the currently registered CredentialProviderSources. New sources can
   * be registered using the +registerCredentialProviderSource+ method.
   */
  public readonly credentialProviderSources = new Array<CredentialProviderSource>();

  public readonly contextProviderPlugins: Record<string, ContextProviderPlugin> = {};

  constructor() {
    if (!TESTING && PluginHost.instance && PluginHost.instance !== this) {
      throw new ToolkitError('New instances of PluginHost must not be built. Use PluginHost.instance instead!');
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
        throw new ToolkitError(`Module ${moduleSpec} does not define a valid plug-in.`);
      }
      if (plugin.init) {
        plugin.init(this);
      }
    } catch (e: any) {
      error(`Unable to load ${chalk.green(moduleSpec)}: ${e.stack}`);
      throw new ToolkitError(`Unable to load plug-in: ${moduleSpec}: ${e}`);
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
      throw new ToolkitError(`Object you gave me does not look like a ContextProviderPlugin: ${inspect(provider)}`);
    }
    this.contextProviderPlugins[pluginProviderName] = provider;
  }
}
