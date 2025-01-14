import type { PluginProviderResult, SDKv2CompatibleCredentials } from '@aws-cdk/cli-plugin-contract';
import { CredentialPlugins } from '@aws-cdk/tmp-toolkit-helpers/lib/api/aws-auth/credential-plugins';
import { PluginHost } from '@aws-cdk/tmp-toolkit-helpers/lib/api/plugin';
import { Mode } from '@aws-cdk/tmp-toolkit-helpers/lib/api/plugin/mode';

test('returns credential from plugin', async () => {
  // GIVEN
  const creds = {
    accessKeyId: 'aaa',
    secretAccessKey: 'bbb',
    getPromise: () => Promise.resolve(),
  } satisfies SDKv2CompatibleCredentials;
  const host = PluginHost.instance;

  host.registerCredentialProviderSource({
    name: 'Fake',

    canProvideCredentials(_accountId: string): Promise<boolean> {
      return Promise.resolve(true);
    },

    isAvailable(): Promise<boolean> {
      return Promise.resolve(true);
    },

    getProvider(_accountId: string, _mode: Mode): Promise<PluginProviderResult> {
      return Promise.resolve(creds);
    },
  });

  const plugins = new CredentialPlugins();

  // WHEN
  const pluginCredentials = await plugins.fetchCredentialsFor('aaa', Mode.ForReading);

  // THEN
  await expect(pluginCredentials?.credentials()).resolves.toEqual(expect.objectContaining({
    accessKeyId: 'aaa',
    secretAccessKey: 'bbb',
  }));
});
