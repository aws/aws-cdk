import type { CredentialProviderSource } from '@aws-cdk/cli-plugin-contract';
import { ContextProviderPlugin, PluginHost, markTesting } from '../../../lib/api/plugin';

markTesting();

beforeEach(() => {
  jest.resetModules();
});

const THE_PLUGIN = 'the-plugin';

test('load a plugin using the PluginHost', () => {
  const host = new PluginHost();

  jest.mock(THE_PLUGIN, () => {
    return {
      version: '1',
      init() {
      },
    };
  }, { virtual: true });

  host.load(THE_PLUGIN);
});

test('fail to load a plugin using the PluginHost', () => {
  const host = new PluginHost();

  // This is not a plugin
  jest.mock(THE_PLUGIN, () => {
    return {};
  }, { virtual: true });

  expect(() => host.load(THE_PLUGIN)).toThrow(/Unable to load plug-in/);
});

test('plugin that registers a Credential Provider', () => {
  const host = new PluginHost();

  jest.mock(THE_PLUGIN, () => {
    return {
      version: '1',
      init(h: PluginHost) {
        h.registerCredentialProviderSource({
          canProvideCredentials() { return Promise.resolve(false); },
          name: 'test',
          isAvailable() { return Promise.resolve(false); },
          getProvider() { return Promise.reject('Dont call me'); },
        } satisfies CredentialProviderSource);

      },
    };
  }, { virtual: true });

  host.load(THE_PLUGIN);

  expect(host.credentialProviderSources).toHaveLength(1);
});

test('plugin that registers a Context Provider', () => {
  const host = new PluginHost();

  jest.mock(THE_PLUGIN, () => {
    return {
      version: '1',
      init(h: PluginHost) {
        h.registerContextProviderAlpha('name', {
          getValue(_args: Record<string, any>) {
            return Promise.resolve('asdf');
          },
        } satisfies ContextProviderPlugin);
      },
    };
  }, { virtual: true });

  host.load(THE_PLUGIN);

  expect(Object.keys(host.contextProviderPlugins)).toHaveLength(1);
});

test('plugin that registers an invalid Context Provider throws', () => {
  const host = new PluginHost();

  jest.mock(THE_PLUGIN, () => {
    return {
      version: '1',
      init(h: PluginHost) {
        h.registerContextProviderAlpha('name', {} as any);
      },
    };
  }, { virtual: true });

  expect(() => host.load(THE_PLUGIN)).toThrow(/does not look like a ContextProviderPlugin/);
});
