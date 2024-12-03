import { CredentialPlugins } from '../../../lib/api/aws-auth/credential-plugins';
import { CredentialProviderSource, Mode, SDKv3CompatibleCredentials } from '../../../lib/api/plugin/credential-provider-source';
import { PluginHost, markTesting } from '../../../lib/api/plugin/plugin';

markTesting();

let host: PluginHost;
let credentialPlugins: CredentialPlugins;

beforeEach(() => {
  host = new PluginHost();
  credentialPlugins = new CredentialPlugins(host);
  jest.resetModules();
  jest.useFakeTimers();
});

const THE_PLUGIN = 'the-plugin';

test('plugin can return V3 compatible credentials', async () => {
  // GIVEN
  mockCredentialFunction(() => Promise.resolve({
    accessKeyId: 'keyid',
    secretAccessKey: 'secret',
  }));

  // WHEN
  const creds = await fetchNow();

  await expect(creds).toEqual(expect.objectContaining({
    accessKeyId: 'keyid',
  }));
});

test('plugin can return V3 compatible credentials that expire', async () => {
  // GIVEN
  const mockProducer = jest.fn().mockImplementation(() => Promise.resolve({
    accessKeyId: 'keyid',
    secretAccessKey: 'secret',
    sessionToken: 'session',
    expiration: new Date(Date.now() + 300_000), // 5 minutes from now
  } satisfies SDKv3CompatibleCredentials));
  mockCredentialFunction(mockProducer);

  // WHEN
  await fetchNow();
  await fetchNow();
  expect(mockProducer).toHaveBeenCalledTimes(1); // Caching

  jest.advanceTimersByTime(300_000); // 5 minutes into the future we go
  await fetchNow();
  expect(mockProducer).toHaveBeenCalledTimes(2); // Cache busted
});

test('plugin can return V3 compatible credential-provider', async () => {
  // GIVEN
  mockCredentialFunction(() => Promise.resolve(() => Promise.resolve({
    accessKeyId: 'keyid',
    secretAccessKey: 'secret',
  })));

  // WHEN
  const creds = await fetchNow();

  await expect(creds).toEqual(expect.objectContaining({
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
  const creds = await fetchNow();

  await expect(creds).toEqual(expect.objectContaining({
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

async function fetchNow() {
  const prov = await credentialPlugins.fetchCredentialsFor('1111', Mode.ForReading);
  return prov?.credentials();
}