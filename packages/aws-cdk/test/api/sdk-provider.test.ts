import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as SDKMock from 'aws-sdk-mock';
import { ConfigurationOptions } from 'aws-sdk/lib/config';
import * as uuid from 'uuid';
import { PluginHost } from '../../lib';
import { ISDK, Mode, SdkProvider } from '../../lib/api/aws-auth';
import * as logging from '../../lib/logging';
import * as bockfs from '../bockfs';

SDKMock.setSDKInstance(AWS);
logging.setVerbose(true);

type AwsCallback<T> = (err: Error | null, val: T) => void;

// Account cache buster
let uid: string;
let pluginQueried = false;

beforeEach(() => {
  uid = `(${uuid.v4()})`;

  bockfs({
    '/home/me/.bxt/credentials': dedent(`
      [default]
      aws_access_key_id=${uid}access
      aws_secret_access_key=secret

      [foo]
      aws_access_key_id=${uid}fooccess
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
    `),
  });

  SDKMock.mock('STS', 'getCallerIdentity', (cb: AwsCallback<AWS.STS.GetCallerIdentityResponse>) => {
    return cb(null, {
      Account: `${uid}the_account_#`,
      UserId: 'you!',
      Arn: 'arn:aws-here:iam::12345:role/test'
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

  // Set environment variables that we want
  process.env.AWS_CONFIG_FILE = bockfs.path('/home/me/.bxt/config');
  process.env.AWS_SHARED_CREDENTIALS_FILE = bockfs.path('/home/me/.bxt/credentials');
  // Scrub some environment variables that might be set if we're running on CodeBuild which will interfere with the tests.
  process.env.AWS_REGION = undefined;
  process.env.AWS_DEFAULT_REGION = undefined;
  process.env.AWS_ACCESS_KEY_ID = undefined;
  process.env.AWS_SECRET_ACCESS_KEY = undefined;
  process.env.AWS_SESSION_TOKEN = undefined;
});

afterEach(() => {
  SDKMock.restore();
  bockfs.restore();
});

describe('CLI compatible credentials loading', () => {
  test('default config credentials', async () => {
    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false });

    // THEN
    expect(provider.defaultRegion).toEqual('eu-bla-5');
    await expect(provider.defaultAccount()).resolves.toEqual({ accountId: `${uid}the_account_#`, partition: 'aws-here' });
    const sdk = await provider.forEnvironment(`${uid}the_account_#`, 'rgn', Mode.ForReading);
    expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}access`);
    expect(sdkConfig(sdk).region).toEqual(`rgn`);
  });

  test('unknown account and region uses current', async () => {
    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false });

    // THEN
    const sdk = await provider.forEnvironment(cxapi.UNKNOWN_ACCOUNT, cxapi.UNKNOWN_REGION, Mode.ForReading);
    expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}access`);
    expect(sdkConfig(sdk).region).toEqual('eu-bla-5');
  });

  test('mixed profile credentials', async () => {
    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false, profile: 'foo' });

    // THEN
    expect(provider.defaultRegion).toEqual('eu-west-1');
    await expect(provider.defaultAccount()).resolves.toEqual({ accountId: `${uid}the_account_#`, partition: 'aws-here' });
    const sdk = await provider.forEnvironment(`${uid}the_account_#`, 'def', Mode.ForReading);
    expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}fooccess`);
  });

  test('pure config credentials', async () => {
    // WHEN
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false, profile: 'boo' });

    // THEN
    expect(provider.defaultRegion).toEqual('eu-bla-5');  // Fall back to default config
    await expect(provider.defaultAccount()).resolves.toEqual({ accountId: `${uid}the_account_#`, partition: 'aws-here' });
    const sdk = await provider.forEnvironment(`${uid}the_account_#`, 'def', Mode.ForReading);
    expect(sdkConfig(sdk).credentials!.accessKeyId).toEqual(`${uid}booccess`);
  });

  test('different account throws', async () => {
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false, profile: 'boo' });

    expect(provider.forEnvironment(`${uid}some_account_#`, 'def', Mode.ForReading)).rejects.toThrow('Need to perform AWS calls');
  });
});

describe('Plugins', () => {
  test('does not use plugins if current credentials are for expected account', async () => {
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false });
    await provider.forEnvironment(`${uid}the_account_#`, 'def', Mode.ForReading);
    expect(pluginQueried).toEqual(false);
  });

  test('uses plugin for other account', async () => {
    const provider = await SdkProvider.withAwsCliCompatibleDefaults({ ec2creds: false });
    await provider.forEnvironment(`${uid}plugin_account_#`, 'def', Mode.ForReading);
    expect(pluginQueried).toEqual(true);
  });
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

  if (lineParts.length === 0) { return ''; }  // Reduce won't work well in this case

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