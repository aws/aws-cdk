import * as os from 'os';
import { bockfs } from '@aws-cdk/cdk-build-tools';
import * as cxapi from '@aws-cdk/cx-api';
import { AssumeRoleCommand, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import * as promptly from 'promptly';
import * as uuid from 'uuid';
import { FakeSts, RegisterRoleOptions, RegisterUserOptions } from './fake-sts';
import { ConfigurationOptions, CredentialsOptions, SDK, SdkProvider } from '../../lib/api/aws-auth';
import { AwsCliCompatible } from '../../lib/api/aws-auth/awscli-compatible';
import { defaultCliUserAgent } from '../../lib/api/aws-auth/user-agent';
import { PluginHost } from '../../lib/api/plugin';
import { Mode } from '../../lib/api/plugin/mode';
import * as logging from '../../lib/logging';
import { withMocked } from '../util';
import { mockSTSClient, restoreSdkMocksToDefault } from '../util/mock-sdk';

let mockFetchMetadataToken = jest.fn();
let mockRequest = jest.fn();

jest.mock('@aws-sdk/ec2-metadata-service', () => {
  return {
    MetadataService: jest.fn().mockImplementation(() => {
      return {
        fetchMetadataToken: mockFetchMetadataToken,
        request: mockRequest,
      };
    }),
  };
});

let uid: string;
let pluginQueried: boolean;

beforeEach(() => {
  // Cache busters!
  // We prefix everything with UUIDs because:
  //
  // - We have a cache from account# -> credentials
  // - We have a cache from access key -> account
  uid = `(${uuid.v4()})`;
  pluginQueried = false;

  logging.setLogLevel(logging.LogLevel.TRACE);

  PluginHost.instance.credentialProviderSources.splice(0);
  PluginHost.instance.credentialProviderSources.push({
    isAvailable() {
      return Promise.resolve(true);
    },
    canProvideCredentials(account) {
      return Promise.resolve(account === uniq('99999'));
    },
    getProvider() {
      pluginQueried = true;
      return Promise.resolve({
        accessKeyId: `${uid}plugin_key`,
        secretAccessKey: 'plugin_secret',
        sessionToken: 'plugin_token',
      });
    },
    name: 'test plugin',
  });

  // Make sure these point to nonexistant files to start, if we don't call
  // prepare() then we don't accidentally want to fall back to system config.
  process.env.AWS_CONFIG_FILE = '/dev/null';
  process.env.AWS_SHARED_CREDENTIALS_FILE = '/dev/null';

  jest.clearAllMocks();
  restoreSdkMocksToDefault();
});

afterEach(() => {
  bockfs.restore();
  jest.restoreAllMocks();
});

function uniq(account: string) {
  return `${uid}${account}`;
}

function env(account: string) {
  return cxapi.EnvironmentUtils.make(account, 'def');
}

describe('with intercepted network calls', () => {
  // Most tests will use intercepted network calls, except one test that tests
  // that the right HTTP `Agent` is used.

  let fakeSts: FakeSts;
  beforeEach(() => {
    fakeSts = new FakeSts();
    fakeSts.begin();

    // Make sure the KeyID returned by the plugin is recognized
    fakeSts.registerUser(uniq('99999'), uniq('plugin_key'));
    mockRequest = jest.fn().mockResolvedValue(JSON.stringify({ region: undefined }));
  });

  afterEach(() => {
    fakeSts.restore();
  });

  // Set of tests where the CDK will not trigger assume-role
  // (the INI file might still do assume-role)
  describe('when CDK does not AssumeRole', () => {
    test('uses default credentials by default', async () => {
      // WHEN
      const account = uniq('11111');
      mockSTSClient.on(GetCallerIdentityCommand).resolves({
        Account: account,
        Arn: 'arn:aws-here',
      });
      prepareCreds({
        credentials: {
          default: { aws_access_key_id: 'access', $account: '11111', $fakeStsOptions: { partition: 'aws-here' } },
        },
        config: {
          default: { region: 'eu-bla-5' },
        },
      });
      const provider = await providerFromProfile(undefined);

      // THEN
      expect(provider.defaultRegion).toEqual('eu-bla-5');
      await expect(provider.defaultAccount()).resolves.toEqual({ accountId: account, partition: 'aws-here' });

      // Ask for a different region
      const sdk = (await provider.forEnvironment({ ...env(account), region: 'rgn' }, Mode.ForReading)).sdk;
      expect((await sdkConfig(sdk).credentials()).accessKeyId).toEqual(uniq('access'));
      expect(sdk.currentRegion).toEqual('rgn');
    });

    test('throws if no credentials could be found', async () => {
      const account = uniq('11111');
      const provider = await providerFromProfile(undefined);
      await expect(exerciseCredentials(provider, { ...env(account), region: 'rgn' }))
        .rejects
        .toThrow(/Need to perform AWS calls for account .*, but no credentials have been configured, and none of these plugins found any/);
    });

    test('no base credentials partition if token is expired', async () => {
      const account = uniq('11111');
      const error = new Error('Expired Token');
      error.name = 'ExpiredToken';
      const identityProvider = () => Promise.reject(error);
      const provider = new SdkProvider(identityProvider, 'rgn');
      const creds = await provider.baseCredentialsPartition({ ...env(account), region: 'rgn' }, Mode.ForReading);

      expect(creds).toBeUndefined();
    });

    test('throws if profile credentials are not for the right account', async () => {
      // WHEN
      jest.spyOn(AwsCliCompatible, 'region').mockResolvedValue('us-east-123');
      prepareCreds({
        fakeSts,
        config: {
          'profile boo': { aws_access_key_id: 'access', $account: '11111' },
        },
      });
      const provider = await providerFromProfile('boo');

      await expect(exerciseCredentials(provider, env(uniq('some_account_#')))).rejects.toThrow(
        'Need to perform AWS calls',
      );
    });

    test('use profile acct/region if agnostic env requested', async () => {
      // WHEN
      prepareCreds({
        fakeSts,
        credentials: {
          default: { aws_access_key_id: 'access', $account: '11111' },
        },
        config: {
          default: { region: 'eu-bla-5' },
        },
      });
      const provider = await providerFromProfile(undefined);

      // THEN
      const sdk = (
        await provider.forEnvironment(
          cxapi.EnvironmentUtils.make(cxapi.UNKNOWN_ACCOUNT, cxapi.UNKNOWN_REGION),
          Mode.ForReading,
        )
      ).sdk;
      expect((await sdkConfig(sdk).credentials()).accessKeyId).toEqual(uniq('access'));
      expect((await sdk.currentAccount()).accountId).toEqual(uniq('11111'));
      expect(sdk.currentRegion).toEqual('eu-bla-5');
    });

    test('passing profile skips EnvironmentCredentials', async () => {
      // GIVEN
      const calls = jest.spyOn(console, 'debug');
      prepareCreds({
        fakeSts,
        credentials: {
          foo: { aws_access_key_id: 'access', $account: '11111' },
        },
      });
      const provider = await providerFromProfile('foo');
      await provider.defaultAccount();
      // Only credential-provider-ini is used.
      expect(calls).toHaveBeenCalledTimes(2);
      expect(calls.mock.calls[0]).toEqual(['@aws-sdk/credential-provider-ini - fromIni']);
      expect(calls.mock.calls[1]).toEqual(['@aws-sdk/credential-provider-ini - resolveStaticCredentials']);
    });

    test('supports profile spread over config_file and credentials_file', async () => {
      // WHEN
      prepareCreds({
        fakeSts,
        credentials: {
          foo: { aws_access_key_id: 'fooccess', $account: '22222' },
        },
        config: {
          'default': { region: 'eu-bla-5' },
          'profile foo': { region: 'eu-west-1' },
        },
      });
      const provider = await providerFromProfile('foo');

      // THEN
      expect(provider.defaultRegion).toEqual('eu-west-1');
      await expect(provider.defaultAccount()).resolves.toEqual({ accountId: uniq('22222'), partition: 'aws' });

      const sdk = (await provider.forEnvironment(env(uniq('22222')), Mode.ForReading)).sdk;
      expect((await sdkConfig(sdk).credentials()).accessKeyId).toEqual(uniq('fooccess'));
    });

    test('supports profile only in config_file', async () => {
      // WHEN
      prepareCreds({
        fakeSts,
        config: {
          'default': { region: 'eu-bla-5' },
          'profile foo': { aws_access_key_id: 'fooccess', $account: '22222' },
        },
      });
      const provider = await providerFromProfile('foo');

      // THEN
      expect(provider.defaultRegion).toEqual('eu-bla-5'); // Fall back to default config
      await expect(provider.defaultAccount()).resolves.toEqual({ accountId: uniq('22222'), partition: 'aws' });

      const sdk = (await provider.forEnvironment(env(uniq('22222')), Mode.ForReading)).sdk;
      expect((await sdkConfig(sdk).credentials()).accessKeyId).toEqual(uniq('fooccess'));
    });

    test('can assume-role configured in config', async () => {
      // GIVEN
      jest.spyOn(console, 'debug');
      prepareCreds({
        fakeSts,
        credentials: {
          assumer: { aws_access_key_id: 'assumer', $account: '11111' },
        },
        config: {
          'default': { region: 'eu-bla-5' },
          'profile assumer': { region: 'us-east-2' },
          'profile assumable': {
            role_arn: 'arn:aws:iam::66666:role/Assumable',
            source_profile: 'assumer',
            $account: '66666',
            $fakeStsOptions: { allowedAccounts: ['11111'] },
          },
        },
      });
      const provider = await providerFromProfile('assumable');

      // WHEN
      const sdk = (await provider.forEnvironment(env(uniq('66666')), Mode.ForReading)).sdk;

      // THEN
      expect((await sdk.currentAccount()).accountId).toEqual(uniq('66666'));
    });

    test('can assume role even if [default] profile is missing', async () => {
      // GIVEN
      prepareCreds({
        fakeSts,
        credentials: {
          assumer: { aws_access_key_id: 'assumer', $account: '22222' },
          assumable: {
            role_arn: 'arn:aws:iam::12356789012:role/Assumable',
            source_profile: 'assumer',
            $account: '22222',
          },
        },
        config: {
          'profile assumable': { region: 'eu-bla-5' },
        },
      });

      // WHEN
      const provider = await providerFromProfile('assumable');

      // THEN
      expect((await provider.defaultAccount())?.accountId).toEqual(uniq('22222'));
    });

    const providersForMfa = [
      (() => providerFromProfile('mfa-role')),
      (async () => {
        // The profile is not passed explicitly. Should be picked from the environment variable
        process.env.AWS_PROFILE = 'mfa-role';
        // Awaiting to make sure the environment variable is only deleted after it's used
        const provider = await SdkProvider.withAwsCliCompatibleDefaults({ logger: console });
        delete process.env.AWS_PROFILE;
        return Promise.resolve(provider);
      }),
    ];

    test.each(providersForMfa)('mfa_serial in profile will ask user for token', async (metaProvider: () => Promise<SdkProvider>) => {
      // GIVEN
      const mockPrompt = jest.spyOn(promptly, 'prompt').mockResolvedValue('1234');

      prepareCreds({
        fakeSts,
        credentials: {
          assumer: { aws_access_key_id: 'assumer', $account: '66666' },
        },
        config: {
          'default': { region: 'eu-bla-5' },
          'profile assumer': { region: 'us-east-2' },
          'profile mfa-role': {
            role_arn: 'arn:aws:iam::66666:role/Assumable',
            source_profile: 'assumer',
            mfa_serial: 'arn:aws:iam::account:mfa/user',
            $account: '66666',
          },
        },
      });

      const provider = await metaProvider();

      // THEN
      const sdk = (await provider.forEnvironment(env(uniq('66666')), Mode.ForReading)).sdk;
      expect((await sdk.currentAccount()).accountId).toEqual(uniq('66666'));
      expect(mockSTSClient).toHaveReceivedCommandWith(AssumeRoleCommand, {
        RoleArn: 'arn:aws:iam::66666:role/Assumable',
        SerialNumber: 'arn:aws:iam::account:mfa/user',
        TokenCode: '1234',
        RoleSessionName: expect.anything(),
      });

      // Make sure the MFA mock was called during this test, only once
      // (Credentials need to remain cached)
      expect(mockPrompt).toHaveBeenCalledTimes(1);
    });
  });

  // For DefaultSynthesis we will do an assume-role after having gotten base credentials
  describe('when CDK AssumeRoles', () => {
    beforeEach(() => {
      // All these tests share that 'arn:aws:role' is a role into account 88888 which can be assumed from 11111
      fakeSts.registerRole(uniq('88888'), 'arn:aws:role', { allowedAccounts: [uniq('11111')] });
    });

    test('error we get from assuming a role is useful', async () => {
      // GIVEN
      prepareCreds({
        fakeSts,
        config: {
          default: { aws_access_key_id: 'foo' },
        },
      });
      mockSTSClient.on(AssumeRoleCommand).rejectsOnce('doesnotexist.role.arn');
      const provider = await providerFromProfile(undefined);

      // WHEN
      const promise = exerciseCredentials(provider, env(uniq('88888')), Mode.ForReading, {
        assumeRoleArn: 'doesnotexist.role.arn',
      });

      // THEN - error message contains both a helpful hint and the underlying AssumeRole message
      await expect(promise).rejects.toThrow('(re)-bootstrap the environment');
      await expect(promise).rejects.toThrow('doesnotexist.role.arn');
    });

    test('assuming a role sanitizes the username into the session name', async () => {
      // GIVEN
      prepareCreds({
        // fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '11111' },
        },
      });

      await withMocked(os, 'userInfo', async (userInfo) => {
        userInfo.mockReturnValue({ username: 'skål', uid: 1, gid: 1, homedir: '/here', shell: '/bin/sh' });

        // WHEN
        const provider = await providerFromProfile(undefined);

        const sdk = (
          await provider.forEnvironment(env(uniq('88888')), Mode.ForReading, { assumeRoleArn: 'arn:aws:role' })
        ).sdk as SDK;
        await sdk.currentAccount();

        // THEN
        expect(mockSTSClient).toHaveReceivedCommandWith(AssumeRoleCommand, {
          RoleArn: 'arn:aws:role',
          RoleSessionName: 'aws-cdk-sk@l',
        });
      });
    });

    test('session tags can be passed when assuming a role', async () => {
      // GIVEN
      prepareCreds({
        fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '11111' },
        },
      });

      await withMocked(os, 'userInfo', async (userInfo) => {
        userInfo.mockReturnValue({ username: 'skål', uid: 1, gid: 1, homedir: '/here', shell: '/bin/sh' });

        // WHEN
        const provider = await providerFromProfile(undefined);

        const sdk = (
          await provider.forEnvironment(env(uniq('88888')), Mode.ForReading, {
            assumeRoleArn: 'arn:aws:role',
            assumeRoleExternalId: 'bruh',
            assumeRoleAdditionalOptions: {
              Tags: [{ Key: 'Department', Value: 'Engineering' }],
            },
          })
        ).sdk as SDK;
        await sdk.currentAccount();

        // THEN
        expect(mockSTSClient).toHaveReceivedCommandWith(AssumeRoleCommand, {
          Tags: [{ Key: 'Department', Value: 'Engineering' }],
          TransitiveTagKeys: ['Department'],
          RoleArn: 'arn:aws:role',
          ExternalId: 'bruh',
          RoleSessionName: 'aws-cdk-sk@l',
        });
      });
    });

    test('assuming a role does not fail when OS username cannot be read', async () => {
      // GIVEN
      prepareCreds({
        // fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '11111' },
        },
      });

      await withMocked(os, 'userInfo', async (userInfo) => {
        userInfo.mockImplementation(() => {
          // SystemError thrown as documented: https://nodejs.org/docs/latest-v16.x/api/os.html#osuserinfooptions
          throw new Error('SystemError on Linux: uv_os_get_passwd returned ENOENT. See #19401 issue.');
        });

        // WHEN
        const provider = await providerFromProfile(undefined);

        await exerciseCredentials(provider, env(uniq('88888')), Mode.ForReading, { assumeRoleArn: 'arn:aws:role' });

        // THEN
        expect(mockSTSClient).toHaveReceivedCommandWith(AssumeRoleCommand, {
          RoleArn: 'arn:aws:role',
          RoleSessionName: 'aws-cdk-noname',
        });
      });
    });

    test('even if current credentials are for the wrong account, we will still use them to AssumeRole', async () => {
      // GIVEN
      prepareCreds({
        // fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '11111' },
        },
      });
      const provider = await providerFromProfile(undefined);

      // WHEN
      const sdk = (
        await provider.forEnvironment(env(uniq('88888')), Mode.ForReading, { assumeRoleArn: 'arn:aws:role' })
      ).sdk as SDK;

      // THEN
      expect((await sdk.currentAccount()).accountId).toEqual(uniq('88888'));
    });

    test('if AssumeRole fails but current credentials are for the right account, we will still use them', async () => {
      // GIVEN
      prepareCreds({
        // fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '88888' },
        },
      });
      const provider = await providerFromProfile(undefined);

      // WHEN - assumeRole fails because the role can only be assumed from account 11111
      const sdk = (
        await provider.forEnvironment(env(uniq('88888')), Mode.ForReading, { assumeRoleArn: 'arn:aws:role' })
      ).sdk as SDK;

      // THEN
      expect((await sdk.currentAccount()).accountId).toEqual(uniq('88888'));
    });

    test('if AssumeRole fails because of ExpiredToken, then fail completely', async () => {
      // GIVEN
      prepareCreds({
        // fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '88888' },
        },
      });
      const error = new Error('Too late');
      error.name = 'ExpiredToken';
      mockSTSClient.on(AssumeRoleCommand).rejectsOnce(error);
      const provider = await providerFromProfile(undefined);

      // WHEN - assumeRole fails with a specific error
      await expect(exerciseCredentials(provider, env(uniq('88888')), Mode.ForReading, { assumeRoleArn: '<FAIL:ExpiredToken>' }))
        .rejects.toThrow(error);
    });
  });

  describe('Plugins', () => {
    test('does not use plugins if current credentials are for expected account', async () => {
      prepareCreds({
        fakeSts,
        config: {
          default: { aws_access_key_id: 'foo', $account: '11111' },
        },
      });
      const provider = await providerFromProfile(undefined);
      await exerciseCredentials(provider, env(uniq('11111')));
      expect(pluginQueried).toEqual(false);
    });

    test('uses plugin for account 99999', async () => {
      const provider = await providerFromProfile(undefined);
      await exerciseCredentials(provider, env(uniq('99999')));
      expect(pluginQueried).toEqual(true);
    });

    test('can assume role with credentials from plugin', async () => {
      fakeSts.registerRole(uniq('99999'), 'arn:aws:iam::99999:role/Assumable');

      const provider = await providerFromProfile(undefined);
      await exerciseCredentials(provider, env(uniq('99999')), Mode.ForReading, {
        assumeRoleArn: 'arn:aws:iam::99999:role/Assumable',
      });

      expect(pluginQueried).toEqual(true);
      expect(mockSTSClient).toHaveReceivedCommandWith(AssumeRoleCommand, {
        RoleArn: 'arn:aws:iam::99999:role/Assumable',
        RoleSessionName: expect.anything(),
      });
    });

    test('even if AssumeRole fails but current credentials are from a plugin, we will still use them', async () => {
      const provider = await providerFromProfile(undefined);
      const sdk = (
        await provider.forEnvironment(env(uniq('99999')), Mode.ForReading, { assumeRoleArn: 'does:not:exist' })
      ).sdk;

      // THEN
      expect((await sdk.currentAccount()).accountId).toEqual(uniq('99999'));
    });

    test('plugins are still queried even if current credentials are expired (or otherwise invalid)', async () => {
      // GIVEN
      // WHEN
      const account = uniq('11111');
      mockSTSClient.on(GetCallerIdentityCommand).resolves({
        Account: account,
        Arn: 'arn:aws-here',
      });
      prepareCreds({
        credentials: {
          default: { aws_access_key_id: `${uid}akid`, $account: '11111', $fakeStsOptions: { partition: 'aws-here' } },
        },
        config: {
          default: { region: 'eu-bla-5' },
        },
      });
      process.env.AWS_ACCESS_KEY_ID = `${uid}akid`;
      process.env.AWS_SECRET_ACCESS_KEY = 'sekrit';
      const provider = await providerFromProfile(undefined);

      // WHEN
      await exerciseCredentials(provider, env(uniq('99999')));

      // THEN
      expect(pluginQueried).toEqual(true);
    });
  });

  describe('support for credential_source', () => {
    test('can assume role with ecs credentials', async () => {
      // GIVEN
      const calls = jest.spyOn(console, 'debug');
      prepareCreds({
        config: {
          'profile ecs': {
            role_arn: 'arn:aws:iam::12356789012:role/Assumable',
            credential_source: 'EcsContainer',
            $account: '22222',
          },
        },
      });

      // WHEN
      const provider = await providerFromProfile('ecs');
      await provider.defaultAccount();

      // THEN
      expect(calls.mock.calls).toContainEqual([
        '@aws-sdk/credential-provider-ini - finding credential resolver using profile=[ecs]',
      ]);
      expect(calls.mock.calls).toContainEqual(['@aws-sdk/credential-provider-ini - credential_source is EcsContainer']);
    });

    test('can assume role with ec2 credentials', async () => {
      // GIVEN
      const calls = jest.spyOn(console, 'debug');
      prepareCreds({
        config: {
          'profile ecs': {
            role_arn: 'arn:aws:iam::12356789012:role/Assumable',
            credential_source: 'Ec2InstanceMetadata',
            $account: '22222',
          },
        },
      });

      // WHEN
      const provider = await providerFromProfile('ecs');
      await provider.defaultAccount();

      // THEN
      expect(calls.mock.calls).toContainEqual([
        '@aws-sdk/credential-provider-ini - finding credential resolver using profile=[ecs]',
      ]);
      expect(calls.mock.calls).toContainEqual([
        '@aws-sdk/credential-provider-ini - credential_source is Ec2InstanceMetadata',
      ]);
    });

    test('can assume role with env credentials', async () => {
      // GIVEN
      const calls = jest.spyOn(console, 'debug');
      prepareCreds({
        config: {
          'profile ecs': {
            role_arn: 'arn:aws:iam::12356789012:role/Assumable',
            credential_source: 'Environment',
            $account: '22222',
          },
        },
      });

      // WHEN
      const provider = await providerFromProfile('ecs');
      await provider.defaultAccount();

      // THEN
      expect(calls.mock.calls).toContainEqual([
        '@aws-sdk/credential-provider-ini - finding credential resolver using profile=[ecs]',
      ]);
      expect(calls.mock.calls).toContainEqual(['@aws-sdk/credential-provider-ini - credential_source is Environment']);
    });

    test('assume fails with unsupported credential_source', async () => {
      // GIVEN
      prepareCreds({
        config: {
          'profile ecs': {
            role_arn: 'arn:aws:iam::12356789012:role/Assumable',
            credential_source: 'unsupported',
            $account: '22222',
          },
        },
      });
      const provider = await providerFromProfile('ecs');

      // WHEN
      const account = await provider.defaultAccount();

      // THEN
      expect(account?.accountId).toEqual(undefined);
    });
  });

  test('defaultAccount returns undefined if STS call fails', async () => {
    // GIVEN
    mockSTSClient.on(AssumeRoleCommand).rejectsOnce('Oops, bad sekrit');

    // WHEN
    const provider = await providerFromProfile(undefined);

    // THEN
    await expect(provider.defaultAccount()).resolves.toBe(undefined);
  });

  test('defaultAccount returns undefined, event if STS call fails with ExpiredToken', async () => {
    // GIVEN
    const error = new Error('Too late');
    error.name = 'ExpiredToken';
    mockSTSClient.on(AssumeRoleCommand).rejectsOnce(error);

    // WHEN
    const provider = await providerFromProfile(undefined);

    // THEN
    await expect(provider.defaultAccount()).resolves.toBe(undefined);
  });
});

test('default useragent is reasonable', () => {
  expect(defaultCliUserAgent()).toContain('aws-cdk/');
});

/**
 * Use object hackery to get the credentials out of the SDK object
 */
function sdkConfig(sdk: SDK): ConfigurationOptions {
  return (sdk as any).config;
}

/**
 * Fixture for SDK auth for this test suite
 *
 * Has knowledge of the cache buster, will write proper fake config files and
 * register users and roles in FakeSts at the same time.
 */
function prepareCreds(options: PrepareCredsOptions) {
  function convertSections(sections?: Record<string, ProfileUser | ProfileRole>) {
    const ret = [];
    for (const [profile, user] of Object.entries(sections ?? {})) {
      ret.push(`[${profile}]`);

      if (isProfileRole(user)) {
        ret.push(`role_arn=${user.role_arn}`);
        if ('source_profile' in user) {
          ret.push(`source_profile=${user.source_profile}`);
        }
        if ('credential_source' in user) {
          ret.push(`credential_source=${user.credential_source}`);
        }
        if (user.mfa_serial) {
          ret.push(`mfa_serial=${user.mfa_serial}`);
        }
        options.fakeSts?.registerRole(uniq(user.$account ?? '00000'), user.role_arn, {
          ...user.$fakeStsOptions,
          allowedAccounts: user.$fakeStsOptions?.allowedAccounts?.map(uniq),
        });
      } else {
        if (user.aws_access_key_id) {
          ret.push(`aws_access_key_id=${uniq(user.aws_access_key_id)}`);
          ret.push('aws_secret_access_key=secret');
          options.fakeSts?.registerUser(
            uniq(user.$account ?? '00000'),
            uniq(user.aws_access_key_id),
            user.$fakeStsOptions,
          );
        }
      }

      if (user.region) {
        ret.push(`region=${user.region}`);
      }
    }
    return ret.join('\n');
  }

  bockfs({
    '/home/me/.bxt/credentials': convertSections(options.credentials),
    '/home/me/.bxt/config': convertSections(options.config),
  });

  // Set environment variables that we want
  process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
  process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');
}

interface PrepareCredsOptions {
  /**
   * Write the aws/credentials file
   */
  readonly credentials?: Record<string, ProfileUser | ProfileRole>;

  /**
   * Write the aws/config file
   */
  readonly config?: Record<string, ProfileUser | ProfileRole>;

  /**
   * If given, add users to FakeSTS
   */
  readonly fakeSts?: FakeSts;
}

interface ProfileUser {
  readonly aws_access_key_id?: string;
  readonly $account?: string;
  readonly region?: string;
  readonly $fakeStsOptions?: RegisterUserOptions;
}

type ProfileRole = {
  readonly role_arn: string;
  readonly mfa_serial?: string;
  readonly $account: string;
  readonly region?: string;
  readonly $fakeStsOptions?: RegisterRoleOptions;
} & ({ readonly source_profile: string } | { readonly credential_source: string });

function isProfileRole(x: ProfileUser | ProfileRole): x is ProfileRole {
  return 'role_arn' in x;
}

async function providerFromProfile(profile: string | undefined) {
  return SdkProvider.withAwsCliCompatibleDefaults({ profile, logger: console });
}

async function exerciseCredentials(provider: SdkProvider, e: cxapi.Environment, mode: Mode = Mode.ForReading,
  options?: CredentialsOptions) {
  const sdk = await provider.forEnvironment(e, mode, options);
  await sdk.sdk.currentAccount();
}
