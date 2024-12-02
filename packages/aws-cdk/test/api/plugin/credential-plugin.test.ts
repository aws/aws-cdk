import { CredentialPlugins } from '../../../lib/api/aws-auth/credential-plugins';
import { CredentialProviderSource, Mode } from '../../../lib/api/plugin/credential-provider-source';
import { PluginHost, markTesting } from '../../../lib/api/plugin/plugin';

markTesting();

let host: PluginHost;
let credentialPlugins: CredentialPlugins;

beforeEach(() => {
  host = new PluginHost();
  credentialPlugins = new CredentialPlugins(host);
  jest.resetModules();
});

const THE_PLUGIN = 'the-plugin';

test('plugin can return V3 compatible credentials', async () => {
  // GIVEN
  mockCredentialFunction(() => Promise.resolve({
    accessKeyId: 'keyid',
    secretAccessKey: 'secret',
  }));

  // WHEN
  const prov = await credentialPlugins.fetchCredentialsFor('1111', Mode.ForReading);

  await expect(prov?.credentials()).resolves.toEqual(expect.objectContaining({
    accessKeyId: 'keyid',
  }));
});

test('plugin can return V3 compatible credential-provider', async () => {
  // GIVEN
  mockCredentialFunction(() => Promise.resolve(() => Promise.resolve({
    accessKeyId: 'keyid',
    secretAccessKey: 'secret',
  })));

  // WHEN
  const prov = await credentialPlugins.fetchCredentialsFor('1111', Mode.ForReading);

  await expect(prov?.credentials()).resolves.toEqual(expect.objectContaining({
    accessKeyId: 'keyid',
  }));
});

test('plugin can return V2 compatible credential-provider', async () => {
  // GIVEN
  let getPromise = jest.fn().mockResolvedValue(undefined);

  mockCredentialFunction(() => Promise.resolve({
    accessKeyId: 'keyid',
    secretAccessKey: 'secret',
    expired: false,
    getPromise,
  }));

  // WHEN
  const prov = await credentialPlugins.fetchCredentialsFor('1111', Mode.ForReading);

  await expect(prov?.credentials()).resolves.toEqual(expect.objectContaining({
    accessKeyId: 'keyid',
  }));
  expect(getPromise).toHaveBeenCalled();
});

function mockCredentialFunction(p: CredentialProviderSource['getProvider']) {
  mockCredentialPlugin({
    name: 'test',
    canProvideCredentials() { return Promise.resolve(true); },
    isAvailable() { return Promise.resolve(true); },
    getProvider(...args: Parameters<CredentialProviderSource['getProvider']>) {
      return p(...args);
    },
  });
}

function mockCredentialPlugin(p: CredentialProviderSource) {
  jest.mock(THE_PLUGIN, () => {
    return {
      version: '1',
      init(h: PluginHost) {
        h.registerCredentialProviderSource(p);
      },
    };
  }, { virtual: true });

  host.load(THE_PLUGIN);
}