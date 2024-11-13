import { AwsCredentials, Mode } from '@aws-cdk/cli-plugin-contract';
import { CredentialPlugins } from '../../lib/api/aws-auth/credential-plugins';
import { PluginHost } from '../../lib/api/plugin';

test('returns credential from plugin', async () => {
  // GIVEN
  const creds = {
    accessKeyId: 'aaa',
    secretAccessKey: 'bbb',
    getPromise: () => Promise.resolve(),
  };
  const host = PluginHost.instance;

  host.registerCredentialProviderSource({
    name: 'Fake',

    canProvideCredentials(_accountId: string): Promise<boolean> {
      return Promise.resolve(true);
    },

    isAvailable(): Promise<boolean> {
      return Promise.resolve(true);
    },

    getProvider(_accountId: string, _mode: Mode): Promise<AwsCredentials> {
      return Promise.resolve(creds);
    },
  });

  const plugins = new CredentialPlugins();

  // WHEN
  const pluginCredentials = await plugins.fetchCredentialsFor('aaa', Mode.ForReading);

  // THEN
  expect(pluginCredentials).toEqual({
    credentials: creds,
    pluginName: 'Fake',
  });
});