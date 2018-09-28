import { Environment} from '@aws-cdk/cx-api';
import AWS = require('aws-sdk');
import child_process = require('child_process');
import fs = require('fs-extra');
import os = require('os');
import path = require('path');
import util = require('util');
import { debug } from '../../logging';
import { PluginHost } from '../../plugin';
import { CredentialProviderSource, Mode } from '../aws-auth/credentials';
import { AccountAccessKeyCache } from './account-cache';
import { SharedIniFile } from './sdk_ini_file';

export interface SDKOptions {
  /**
   * Profile name to use
   *
   * @default No profile
   */
  profile?: string;

  /**
   * Proxy address to use
   *
   * @default No proxy
   */
  proxyAddress?: string;

  /**
   * Whether we should try instance credentials
   *
   * True/false to force/disable. Default is to guess.
   *
   * @default Automatically determine.
   */
  ec2creds?: boolean;
}

/**
 * Source for SDK client objects
 *
 * Credentials are first obtained from the SDK defaults (using environment variables and the
 * ~/.aws/{config,credentials} files).
 *
 * If those don't suffice, a list of CredentialProviderSources is interrogated for access
 * to the requested account.
 */
export class SDK {
  private readonly defaultAwsAccount: DefaultAWSAccount;
  private readonly credentialsCache: CredentialsCache;
  private readonly defaultClientArgs: any = {};
  private readonly profile?: string;

  constructor(options: SDKOptions) {
    this.profile = options.profile;

    const defaultCredentialProvider = makeCLICompatibleCredentialProvider(options.profile, options.ec2creds);

    // Find the package.json from the main toolkit
    const pkg = (require.main as any).require('../package.json');
    this.defaultClientArgs.userAgent = `${pkg.name}/${pkg.version}`;

    // https://aws.amazon.com/blogs/developer/using-the-aws-sdk-for-javascript-from-behind-a-proxy/
    if (options.proxyAddress === undefined) {
      options.proxyAddress = httpsProxyFromEnvironment();
    }
    if (options.proxyAddress) { // Ignore empty string on purpose
      debug('Using proxy server: %s', options.proxyAddress);
      this.defaultClientArgs.httpOptions = {
        agent: require('proxy-agent')(options.proxyAddress)
      };
    }

    this.defaultAwsAccount = new DefaultAWSAccount(defaultCredentialProvider, this.defaultClientArgs);
    this.credentialsCache = new CredentialsCache(this.defaultAwsAccount, defaultCredentialProvider);
  }

  public async cloudFormation(environment: Environment, mode: Mode): Promise<AWS.CloudFormation> {
    return new AWS.CloudFormation({
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode),
      ...this.defaultClientArgs
    });
  }

  public async ec2(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.EC2> {
    return new AWS.EC2({
      region,
      credentials: await this.credentialsCache.get(awsAccountId, mode),
      ...this.defaultClientArgs
    });
  }

  public async ssm(awsAccountId: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.SSM> {
    return new AWS.SSM({
      region,
      credentials: await this.credentialsCache.get(awsAccountId, mode),
      ...this.defaultClientArgs
    });
  }

  public async s3(environment: Environment, mode: Mode): Promise<AWS.S3> {
    return new AWS.S3({
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode),
      ...this.defaultClientArgs
    });
  }

  public async defaultRegion(): Promise<string | undefined> {
    return await getCLICompatibleDefaultRegion(this.profile);
  }

  public defaultAccount(): Promise<string | undefined> {
    return this.defaultAwsAccount.get();
  }
}

/**
 * Cache for credential providers.
 *
 * Given an account and an operating mode (read or write) will return an
 * appropriate credential provider for credentials for the given account. The
 * credential provider will be cached so that multiple AWS clients for the same
 * environment will not make multiple network calls to obtain credentials.
 *
 * Will use default credentials if they are for the right account; otherwise,
 * all loaded credential provider plugins will be tried to obtain credentials
 * for the given account.
 */
class CredentialsCache {
  private readonly cache: {[key: string]: AWS.Credentials} = {};

  public constructor(
      private readonly defaultAwsAccount: DefaultAWSAccount,
      private readonly defaultCredentialProvider: Promise<AWS.CredentialProviderChain>) {
  }

  public async get(awsAccountId: string | undefined, mode: Mode): Promise<AWS.Credentials> {
    const key = `${awsAccountId}-${mode}`;
    if (!(key in this.cache)) {
      this.cache[key] = await this.getCredentials(awsAccountId, mode);
    }
    return this.cache[key];
  }

  private async getCredentials(awsAccountId: string | undefined, mode: Mode): Promise<AWS.Credentials> {
    // If requested account is undefined or equal to default account, use default credentials provider.
    // (Note that we ignore the mode in this case, if you preloaded credentials they better be correct!)
    const defaultAccount = await this.defaultAwsAccount.get();
    if (!awsAccountId || awsAccountId === defaultAccount) {
      debug(`Using default AWS SDK credentials for account ${awsAccountId}`);

      // CredentialProviderChain extends Credentials, but that is a lie.
      // https://github.com/aws/aws-sdk-js/issues/2235
      // Call resolve() instead.
      return (await this.defaultCredentialProvider).resolvePromise();
    }

    const triedSources: CredentialProviderSource[] = [];
    // Otherwise, inspect the various credential sources we have
    for (const source of PluginHost.instance.credentialProviderSources) {
      if (!(await source.isAvailable())) {
        debug('Credentials source %s is not available, ignoring it.', source.name);
        continue;
      }
      triedSources.push(source);
      if (!(await source.canProvideCredentials(awsAccountId))) { continue; }
      debug(`Using ${source.name} credentials for account ${awsAccountId}`);
      const providerOrCreds = await source.getProvider(awsAccountId, mode);

      // Backwards compatibility: if the plugin returns a ProviderChain, resolve that chain.
      // Otherwise it must have returned credentials.
      if ((providerOrCreds as any).resolvePromise) {
        return await (providerOrCreds as any).resolvePromise();
      }
      return providerOrCreds;
    }
    const sourceNames = ['default credentials'].concat(triedSources.map(s => s.name)).join(', ');
    throw new Error(`Need to perform AWS calls for account ${awsAccountId}, but no credentials found. Tried: ${sourceNames}.`);
  }
}

/**
 * Class to retrieve the account for default credentials and cache it.
 *
 * Uses the default credentials provider to obtain credentials (if available),
 * and uses those credentials to call STS to request the current account ID.
 *
 * The credentials => accountId lookup is cached on disk, since it's
 * guaranteed that igven access key will always remain for the same account.
 */
class DefaultAWSAccount {
  private defaultAccountFetched = false;
  private defaultAccountId?: string = undefined;
  private readonly accountCache = new AccountAccessKeyCache();

  constructor(private readonly defaultCredentialsProvider: Promise<AWS.CredentialProviderChain>, private readonly defaultClientArgs: any) {
  }

  /**
   * Return the default account
   */
  public async get(): Promise<string | undefined> {
    if (!this.defaultAccountFetched) {
      this.defaultAccountId = await this.lookupDefaultAccount();
      this.defaultAccountFetched = true;
    }
    return this.defaultAccountId;
  }

  private async lookupDefaultAccount(): Promise<string | undefined> {
    try {
      debug('Resolving default credentials');
      const credentialProvider = await this.defaultCredentialsProvider;
      const creds = await credentialProvider.resolvePromise();

      const accessKeyId = creds.accessKeyId;
      if (!accessKeyId) {
        throw new Error('Unable to resolve AWS credentials (setup with "aws configure")');
      }

      const accountId = await this.accountCache.fetch(creds.accessKeyId, async () => {
        // if we don't have one, resolve from STS and store in cache.
        debug('Looking up default account ID from STS');
        const result = await new AWS.STS({ credentials: creds, ...this.defaultClientArgs }).getCallerIdentity().promise();
        const aid = result.Account;
        if (!aid) {
          debug('STS didn\'t return an account ID');
          return undefined;
        }
        debug('Default account ID:', aid);
        return aid;
      });

      return accountId;
    } catch (e) {
      debug('Unable to determine the default AWS account (did you configure "aws configure"?):', e);
      return undefined;
    }
  }
}

/**
 * Build an AWS CLI-compatible credential chain provider
 *
 * This is similar to the default credential provider chain created by the SDK
 * except it also accepts the profile argument in the constructor (not just from
 * the environment).
 *
 * To mimic the AWS CLI behavior:
 *
 * - we default to ~/.aws/credentials if environment variable for credentials
 * file location is not given (SDK expects explicit environment variable with name).
 * - AWS_DEFAULT_PROFILE is also inspected for profile name (not just AWS_PROFILE).
 */
async function makeCLICompatibleCredentialProvider(profile: string | undefined, ec2creds: boolean | undefined) {
  profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

  // Need to construct filename ourselves, without appropriate environment variables
  // no defaults used by JS SDK.
  const filename = process.env.AWS_SHARED_CREDENTIALS_FILE || path.join(os.homedir(), '.aws', 'credentials');

  const sources = [
    () => new AWS.EnvironmentCredentials('AWS'),
    () => new AWS.EnvironmentCredentials('AMAZON'),
  ];
  if (fs.pathExists(filename)) {
    sources.push(() => new AWS.SharedIniFileCredentials({ profile, filename }));
  }

  if (hasEcsCredentials()) {
    sources.push(() => new AWS.ECSCredentials());
  } else {
    // else if: don't get EC2 creds if we should have gotten ECS creds--ECS instances also
    // run on EC2 boxes but the creds represent something different. Same behavior as
    // upstream code.

    if (ec2creds === undefined) { ec2creds = await hasEc2Credentials(); }

    if (ec2creds) {
      sources.push(() => new AWS.EC2MetadataCredentials());
    }
  }

  return new AWS.CredentialProviderChain(sources);
}

/**
 * Return the default region in a CLI-compatible way
 *
 * Mostly copied from node_loader.js, but with the following differences:
 *
 * - Takes a runtime profile name to load the region from, not just based on environment
 *   variables at process start.
 * - We have needed to create a local copy of the SharedIniFile class because the
 *   implementation in 'aws-sdk' is private (and the default use of it in the
 *   SDK does not allow us to specify a profile at runtime).
 * - AWS_DEFAULT_PROFILE and AWS_DEFAULT_REGION are also used as environment
 *   variables to be used to determine the region.
 */
async function getCLICompatibleDefaultRegion(profile: string | undefined): Promise<string | undefined> {
  profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

  // Defaults inside constructor
  const toCheck = [
    {filename: process.env.AWS_SHARED_CREDENTIALS_FILE },
    {isConfig: true, filename: process.env.AWS_CONFIG_FILE},
    ];

  let region = process.env.AWS_REGION || process.env.AMAZON_REGION ||
      process.env.AWS_DEFAULT_REGION || process.env.AMAZON_DEFAULT_REGION;

  while (!region && toCheck.length > 0) {
    const configFile = new SharedIniFile(toCheck.shift());
    const section = await configFile.getProfile(profile);
    region = section && section.region;
  }

  return region;
}

/**
 * Find and return the configured HTTPS proxy address
 */
function httpsProxyFromEnvironment(): string | undefined {
  if (process.env.https_proxy) {
    return process.env.https_proxy;
  }
  if (process.env.HTTPS_PROXY) {
    return process.env.HTTPS_PROXY;
  }
  return undefined;
}

/**
 * Return whether it looks like we'll have ECS credentials available
 */
function hasEcsCredentials() {
  return (AWS.ECSCredentials.prototype as any).isConfiguredForEcsCredentials();
}

/**
 * Return whether we're on an EC2 instance
 */
async function hasEc2Credentials() {
  debug("Determining whether we're on an EC2 instance.");

  let instance = false;
  if (process.platform === 'win32') {
    // https://docs.aws.amazon.com/AWSEC2/latest/WindowsGuide/identify_ec2_instances.html
    const result = await util.promisify(child_process.exec)('wmic path win32_computersystemproduct get uuid', { encoding: 'utf-8' });
    // output looks like
    //  UUID
    //  EC2AE145-D1DC-13B2-94ED-01234ABCDEF
    const lines = result.stdout.toString().split('\n');
    instance = lines.some(x => matchesRegex(/^ec2/i, x));
  } else {
    // https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/identify_ec2_instances.html
    const files: Array<[string, RegExp]> = [
      // This recognizes the Xen hypervisor based instances (pre-5th gen)
      ['/sys/hypervisor/uuid', /^ec2/i],

      // This recognizes the new Hypervisor (5th-gen instances and higher)
      // Can't use the advertised file '/sys/devices/virtual/dmi/id/product_uuid' because it requires root to read.
      // Instead, sys_vendor contains something like 'Amazon EC2'.
      ['/sys/devices/virtual/dmi/id/sys_vendor', /ec2/i],
    ];
    for (const [file, re] of files) {
      if (matchesRegex(re, await readIfPossible(file))) {
        instance = true;
        break;
      }
    }
  }

  debug(instance ? 'Looks like EC2 instance.' : 'Does not look like EC2 instance.');
  return instance;
}

async function readIfPossible(filename: string): Promise<string | undefined> {
  try {
    if (!await fs.pathExists(filename)) { return undefined; }
    return fs.readFile(filename, { encoding: 'utf-8' });
  } catch (e) {
    debug(e);
    return undefined;
  }
}

function matchesRegex(re: RegExp, s: string | undefined) {
  return s !== undefined && re.exec(s) !== null;
}
