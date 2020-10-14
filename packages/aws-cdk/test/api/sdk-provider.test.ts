import * as os from 'os';
import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as SDKMock from 'aws-sdk-mock';
import type { ConfigurationOptions } from 'aws-sdk/lib/config-base';
import * as uuid from 'uuid';
import { PluginHost } from '../../lib';
import { ISDK, Mode, SdkProvider } from '../../lib/api/aws-auth';
import * as logging from '../../lib/logging';
import * as bockfs from '../bockfs';
import { withMocked } from '../util';

// Mock promptly prompt to test MFA support
jest.mock('promptly', () => ({
  prompt: jest.fn().mockRejectedValue(new Error('test')),
}));

SDKMock.setSDKInstance(AWS);

type AwsCallback<T> = (err: Error | null, val: T) => void;

const defaultCredOptions = {
  ec2creds: false,
  containerCreds: false,
};

// Account cache buster
let uid: string;
let pluginQueried = false;
let defaultEnv: cxapi.Environment;
let getCallerIdentityError: Error | null = null;

beforeEach(() => {
  uid = `(${uuid.v4()})`;

  logging.setLogLevel(logging.LogLevel.TRACE);

  SDKMock.mock('STS', 'getCallerIdentity', (cb: AwsCallback<AWS.STS.GetCallerIdentityResponse>) => {
    return cb(getCallerIdentityError, {
      Account: `${uid}the_account_#`,
      UserId: 'you!',
      Arn: 'arn:aws-here:iam::12345:role/test',
    });
  });

  PluginHost.instance.credentialProviderSources.splice(0);
  PluginHost.instance.credentialProviderSources.push({
    isAvailable() { return Promise.resolve(true); },
    canProvideCredentials(account) { return Promise.resolve(account === `${uid}plugin_account_#`); },
    getProvider() {
      pluginQueried = true;
      return Promise.resolve(new AWS.Credentials({
        accessKeyId: `${uid}plugin_key`,
        secretAccessKey: 'plugin_secret',
        sessionToken: 'plugin_token',
      }));
    },
    name: 'test plugin',
  });

  defaultEnv = cxapi.EnvironmentUtils.make(`${uid}the_account_#`, 'def');

  // Scrub some environment variables that might be set if we're running on CodeBuild which will interfere with the tests.
  delete process.env.AWS_PROFILE;
  delete process.env.AWS_REGION;
  delete process.env.AWS_DEFAULT_REGION;
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
  delete process.env.AWS_SESSION_TOKEN;
});

afterEach(() => {
  logging.setLogLevel(logging.LogLevel.DEFAULT);

  SDKMock.restore();
  bockfs.restore();
});

describe('with default config files', () => {
  beforeEach(() => {
    bockfs({
      '/home/me/.bxt/credentials': dedent(`
        [default]
        aws_access_key_id=${uid}access
        aws_secret_access_key=secret

        [foo]
        aws_access_key_id=${uid}fooccess
        aws_secret_access_key=secret

        [assumer]
        aws_access_key_id=${uid}assumer
        aws_secret_access_key=secret

        [mfa]
        aws_access_key_id=${uid}mfaccess
        aws_secret_access_key=secret
      `),
      '/home/me/.bxt/config': dedent(`
        [default]
        region=eu-bla-5

        [profile foo]
        region=eu-west-1

        [profile boo]
        aws_access_key_id=${uid}booccess
        aws_secret_access_key=boocret
        # No region here

        [profile assumable]
        role_arn=arn:aws:iam::12356789012:role/Assumable
        source_profile=assumer

        [profile assumer]
        region=us-east-2

        [profile mfa]
        region=eu-west-1

        [profile mfa-role]
        source_profile=mfa
        role_arn=arn:aws:iam::account:role/role
        mfa_serial=arn:aws:iam::account:mfa/user
      `),
    });

    // Set environment variables that we want
    process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
    process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');
  });

  describe('CLI compatible credentials loading', () => {
    test('default config credentials', async () => {
      // WHEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions });

      // THEN
      expect(provider.defaultRegion).toEqual('eu-bla-5');
      await expect(provider.defaultAccount()).resolves.toEqual({ accountId: `${uid}the_account_#`, partition: 'aws-here' });
      const sdk = await provider.forEnvironment({ ...defaultEnv, region: 'rgn' }, Mode.ForReading);
      expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}access`);
      expect(sdkConfig(sdk).region).toEqual('rgn');
    });

    test('unknown account and region uses current', async () => {
      // WHEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions });

      // THEN
      const sdk = await provider.forEnvironment(cxapi.EnvironmentUtils.make(cxapi.UNKNOWN_ACCOUNT, cxapi.UNKNOWN_REGION), Mode.ForReading);
      expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}access`);
      expect(sdkConfig(sdk).region).toEqual('eu-bla-5');
    });

    test('passing profile does not use EnvironmentCredentials', async () => {
      // GIVEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions, profile: 'foo' });

      const environmentCredentialsPrototype = (new AWS.EnvironmentCredentials('AWS')).constructor.prototype;

      await withMocked(environmentCredentialsPrototype, 'refresh', async (refresh) => {
        refresh.mockImplementation((callback: (err?: Error) => void) => callback(new Error('This function should not have been called')));

        // WHEN
        await provider.defaultAccount();

        expect(refresh).not.toHaveBeenCalled();
      });
    });

    test('mixed profile credentials', async () => {
      // WHEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions, profile: 'foo' });

      // THEN
      expect(provider.defaultRegion).toEqual('eu-west-1');
      await expect(provider.defaultAccount()).resolves.toEqual({ accountId: `${uid}the_account_#`, partition: 'aws-here' });
      const sdk = await provider.forEnvironment(defaultEnv, Mode.ForReading);
      expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}fooccess`);
    });

    test('pure config credentials', async () => {
      // WHEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions, profile: 'boo' });

      // THEN
      expect(provider.defaultRegion).toEqual('eu-bla-5'); // Fall back to default config
      await expect(provider.defaultAccount()).resolves.toEqual({ accountId: `${uid}the_account_#`, partition: 'aws-here' });
      const sdk = await provider.forEnvironment(defaultEnv, Mode.ForReading);
      expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}booccess`);
    });

    test('mfa_serial in profile will ask user for token', async () => {
      // WHEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions, profile: 'mfa-role' });

      // THEN
      try {
        await provider.withAssumedRole('arn:aws:iam::account:role/role', undefined, undefined);
      } catch (e) {
        // Mock response was set to fail with message test to make sure we don't call STS
        expect(e.message).toEqual('Error fetching MFA token: test');
      }
    });

    test('different account throws', async () => {
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions, profile: 'boo' });

      await expect(provider.forEnvironment({ ...defaultEnv, account: `${uid}some_account_#` }, Mode.ForReading)).rejects.toThrow('Need to perform AWS calls');
    });

    test('even when using a profile to assume another profile, STS calls goes through the proxy', async () => {
      // Messy mocking
      let called = false;
      jest.mock('proxy-agent', () => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        class FakeAgent extends require('https').Agent {
          public addRequest(_: any, __: any) {
            // FIXME: this error takes 6 seconds to be completely handled. It
            // might be retries in the SDK somewhere, or something about the Node
            // event loop. I've spent an hour trying to figure it out and I can't,
            // and I gave up. We'll just have to live with this until someone gets
            // inspired.
            const error = new Error('ABORTED BY TEST');
            (error as any).code = 'RequestAbortedError';
            (error as any).retryable = false;
            called = true;
            throw error;
          }
        }
        return FakeAgent;
      });

      // WHEN
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({
        ...defaultCredOptions,
        profile: 'assumable',
        httpOptions: {
          proxyAddress: 'http://DOESNTMATTER/',
        },
      });

      await provider.defaultAccount();

      // THEN -- the fake proxy agent got called, we don't care about the result
      expect(called).toEqual(true);
    });

    test('error we get from assuming a role is useful', async () => {
      // GIVEN
      // Because of the way ChainableTemporaryCredentials gets its STS client, it's not mockable
      // using 'mock-aws-sdk'. So instead, we have to mess around with its internals.
      function makeAssumeRoleFail(s: ISDK) {
        (s as any).credentials.service.assumeRole = jest.fn().mockImplementation((_request, cb) => {
          cb(new Error('Nope!'));
        });
      }

      const provider = await SdkProvider.withAwsCliCompatibleDefaults({
        ...defaultCredOptions,
        httpOptions: {
          proxyAddress: 'http://localhost:8080/',
        },
      });

      // WHEN
      const sdk = await provider.withAssumedRole('bla.role.arn', undefined, undefined);
      makeAssumeRoleFail(sdk);

      // THEN - error message contains both a helpful hint and the underlying AssumeRole message
      await expect(sdk.s3().listBuckets().promise()).rejects.toThrow('did you bootstrap');
      await expect(sdk.s3().listBuckets().promise()).rejects.toThrow('Nope!');
    });

    test('assuming a role sanitizes the username into the session name', async () => {
      // GIVEN
      SDKMock.restore();

      await withMocked(os, 'userInfo', async (userInfo) => {
        userInfo.mockReturnValue({ username: 'skål', uid: 1, gid: 1, homedir: '/here', shell: '/bin/sh' });

        await withMocked((new AWS.STS()).constructor.prototype, 'assumeRole', async (assumeRole) => {
          let assumeRoleRequest;

          assumeRole.mockImplementation(function (
            this: any,
            request: AWS.STS.Types.AssumeRoleRequest,
            cb?: (err: Error | null, x: AWS.STS.Types.AssumeRoleResponse) => void) {

            // Part of the request is stored on "this"
            assumeRoleRequest = { ...this.config.params, ...request };

            const response = {
              Credentials: { AccessKeyId: `${uid}aid`, Expiration: new Date(), SecretAccessKey: 's', SessionToken: '' },
            };
            if (cb) { cb(null, response); }
            return { promise: () => Promise.resolve(response) };
          });

          // WHEN
          const provider = new SdkProvider(new AWS.CredentialProviderChain([() => new AWS.Credentials({ accessKeyId: 'a', secretAccessKey: 's' })]), 'eu-somewhere');
          const sdk = await provider.withAssumedRole('bla.role.arn', undefined, undefined);

          await sdk.currentCredentials();

          expect(assumeRoleRequest).toEqual(expect.objectContaining({
            RoleSessionName: 'aws-cdk-sk@l',
          }));
        });
      });
    });
  });

  describe('Plugins', () => {
    test('does not use plugins if current credentials are for expected account', async () => {
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions });
      await provider.forEnvironment(defaultEnv, Mode.ForReading);
      expect(pluginQueried).toEqual(false);
    });

    test('uses plugin for other account', async () => {
      const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions });
      await provider.forEnvironment({ ...defaultEnv, account: `${uid}plugin_account_#` }, Mode.ForReading);
      expect(pluginQueried).toEqual(true);
    });
  });
});

test('can assume role without a [default] profile', async () => {
  // GIVEN
  bockfs({
    '/home/me/.bxt/credentials': dedent(`
      [assumer]
      aws_access_key_id=${uid}assumer
      aws_secret_access_key=secret

      [assumable]
      role_arn=arn:aws:iam::12356789012:role/Assumable
      source_profile=assumer
    `),
    '/home/me/.bxt/config': dedent(`
      [profile assumable]
      region=eu-bla-5
    `),
  });

  SDKMock.mock('STS', 'assumeRole', (_request: AWS.STS.AssumeRoleRequest, cb: AwsCallback<AWS.STS.AssumeRoleResponse>) => {
    return cb(null, {
      Credentials: {
        AccessKeyId: `${uid}access`, // Needs UID in here otherwise key will be cached
        Expiration: new Date(Date.now() + 10000),
        SecretAccessKey: 'b',
        SessionToken: 'c',
      },
    });
  });

  // Set environment variables that we want
  process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
  process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');

  // WHEN
  const provider = await SdkProvider.withAwsCliCompatibleDefaults({
    ...defaultCredOptions,
    profile: 'assumable',
  });

  const account = await provider.defaultAccount();

  // THEN
  expect(account?.accountId).toEqual(`${uid}the_account_#`);
});

test('can assume role with ecs credentials', async () => {

  return withMocked(AWS.ECSCredentials.prototype, 'needsRefresh', async (needsRefresh) => {

    // GIVEN
    bockfs({
      '/home/me/.bxt/credentials': '',
      '/home/me/.bxt/config': dedent(`
      [profile ecs]
      role_arn=arn:aws:iam::12356789012:role/Assumable
      credential_source = EcsContainer
    `),
    });

    // Set environment variables that we want
    process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
    process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');

    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({
      ...defaultCredOptions,
      profile: 'ecs',
    });

    await provider.defaultAccount();

    // THEN
    // expect(account?.accountId).toEqual(`${uid}the_account_#`);
    expect(needsRefresh).toHaveBeenCalled();

  });

});

test('can assume role with ec2 credentials', async () => {

  return withMocked(AWS.EC2MetadataCredentials.prototype, 'needsRefresh', async (needsRefresh) => {

    // GIVEN
    bockfs({
      '/home/me/.bxt/credentials': '',
      '/home/me/.bxt/config': dedent(`
      [profile ecs]
      role_arn=arn:aws:iam::12356789012:role/Assumable
      credential_source = Ec2InstanceMetadata
    `),
    });

    // Set environment variables that we want
    process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
    process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');

    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({
      ...defaultCredOptions,
      profile: 'ecs',
    });

    await provider.defaultAccount();

    // THEN
    // expect(account?.accountId).toEqual(`${uid}the_account_#`);
    expect(needsRefresh).toHaveBeenCalled();

  });

});

test('can assume role with env credentials', async () => {

  return withMocked(AWS.EnvironmentCredentials.prototype, 'needsRefresh', async (needsRefresh) => {

    // GIVEN
    bockfs({
      '/home/me/.bxt/credentials': '',
      '/home/me/.bxt/config': dedent(`
      [profile ecs]
      role_arn=arn:aws:iam::12356789012:role/Assumable
      credential_source = Environment
    `),
    });

    // Set environment variables that we want
    process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
    process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');

    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({
      ...defaultCredOptions,
      profile: 'ecs',
    });

    await provider.defaultAccount();

    // THEN
    // expect(account?.accountId).toEqual(`${uid}the_account_#`);
    expect(needsRefresh).toHaveBeenCalled();

  });

});

test('assume fails with unsupported credential_source', async () => {
  // GIVEN
  bockfs({
    '/home/me/.bxt/credentials': '',
    '/home/me/.bxt/config': dedent(`
      [profile assumable]
      role_arn=arn:aws:iam::12356789012:role/Assumable
      credential_source = unsupported
    `),
  });

  SDKMock.mock('STS', 'assumeRole', (_request: AWS.STS.AssumeRoleRequest, cb: AwsCallback<AWS.STS.AssumeRoleResponse>) => {
    return cb(null, {
      Credentials: {
        AccessKeyId: `${uid}access`, // Needs UID in here otherwise key will be cached
        Expiration: new Date(Date.now() + 10000),
        SecretAccessKey: 'b',
        SessionToken: 'c',
      },
    });
  });

  // Set environment variables that we want
  process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
  process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');

  // WHEN
  const provider = await SdkProvider.withAwsCliCompatibleDefaults({
    ...defaultCredOptions,
    profile: 'assumable',
  });

  const account = await provider.defaultAccount();

  // THEN
  expect(account?.accountId).toEqual(undefined);
});

test('defaultAccount returns undefined if STS call fails', async () => {
  // GIVEN
  process.env.AWS_ACCESS_KEY_ID = `${uid}akid`;
  process.env.AWS_SECRET_ACCESS_KEY = 'sekrit';
  getCallerIdentityError = new Error('Something is wrong here');

  // WHEN
  const provider = await SdkProvider.withAwsCliCompatibleDefaults({
    ...defaultCredOptions,
  });

  // THEN
  await expect(provider.defaultAccount()).resolves.toBe(undefined);
});

test('plugins are still queried even if current credentials are expired', async () => {
  // GIVEN
  process.env.AWS_ACCESS_KEY_ID = `${uid}akid`;
  process.env.AWS_SECRET_ACCESS_KEY = 'sekrit';
  getCallerIdentityError = new Error('Something is wrong here');

  // WHEN
  const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ...defaultCredOptions });
  await provider.forEnvironment({ ...defaultEnv, account: `${uid}plugin_account_#` }, Mode.ForReading);

  // THEN
  expect(pluginQueried).toEqual(true);
});

/**
 * Strip shared whitespace from the start of lines
 */
function dedent(x: string): string {
  const lines = x.split('\n');
  while (lines.length > 0 && lines[0].trim() === '') { lines.shift(); }
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') { lines.pop(); }

  const wsRe = /^\s*/;
  const lineParts: Array<[string, string]> = x.split('\n').map(s => {
    const ws = wsRe.exec(s)![0];
    return [ws, s.substr(ws.length)];
  });

  if (lineParts.length === 0) { return ''; } // Reduce won't work well in this case

  // Calculate common whitespace only for non-empty lines
  const sharedWs = lineParts.reduce((commonWs: string, [ws, text]) => text !== '' ? commonPrefix(commonWs, ws) : commonWs, lineParts[0][0]);
  return lines.map(s => s.substr(sharedWs.length)).join('\n');
}

/**
 * Use object hackery to get the credentials out of the SDK object
 */
function sdkConfig(sdk: ISDK): ConfigurationOptions {
  return (sdk as any).config;
}

function commonPrefix(a: string, b: string): string {
  const N = Math.min(a.length, b.length);
  for (let i = 0; i < N; i++) {
    if (a[i] !== b[i]) { return a.substring(0, i); }
  }
  return a.substr(N);
}
