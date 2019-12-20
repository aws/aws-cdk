import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { debug } from '../../logging';
import { PluginHost } from '../../plugin';
import { CredentialProviderSource, Mode } from '../aws-auth/credentials';
import { AccountAccessKeyCache } from './account-cache';
import { SharedIniFile } from './sdk_ini_file';

/** @experimental */
export interface ISDK {
  cloudFormation(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.CloudFormation>;

  ec2(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.EC2>;

  ssm(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.SSM>;

  s3(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.S3>;

  route53(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.Route53>;

  ecr(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.ECR>;

  defaultRegion(): Promise<string | undefined>;

  defaultAccount(): Promise<string | undefined>;
}

interface ServiceEndpoints {
  [serviceName: string]: string
}

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

  /**
   * Change the endpoint addresses of the aws sdk services
   *
   * The argument supports both comma separated serviceName=URL pairs,
   * and JSON structures
   * E.g.
   * cdk deploy --endpoints 'cloudformation=http://localhost:4581,s3=http://localhost:4572'
   * cdk deploy --endpoints '{"cloudformation":"http://localhost:4581","s3":"http://localhost:4572"}'
   *
   * @default Standard AWS cloud endpoints
   */

   endpoints?: string;
}

/**
 * Source for SDK client objects
 *
 * Credentials are first obtained from the SDK defaults (using environment variables and the
 * ~/.aws/{config,credentials} files).
 *
 * If those don't suffice, a list of CredentialProviderSources is interrogated for access
 * to the requested account.
 *
 * @experimental
 */
export class SDK implements ISDK {
  private readonly defaultAwsAccount: DefaultAWSAccount;
  private readonly credentialsCache: CredentialsCache;
  private readonly endpoints: ServiceEndpoints = {};
  private readonly profile?: string;

  /**
   * Default retry options for SDK clients
   *
   * Biggest bottleneck is CloudFormation, with a 1tps call rate. We want to be
   * a little more tenacious than the defaults, and with a little more breathing
   * room between calls (defaults are {retries=3, base=100}).
   *
   * I've left this running in a tight loop for an hour and the throttle errors
   * haven't escaped the retry mechanism.
   */
  private readonly retryOptions = { maxRetries: 6, retryDelayOptions: { base: 300 }};

  constructor(options: SDKOptions = {}) {
    this.profile = options.profile;

    const defaultCredentialProvider = makeCLICompatibleCredentialProvider(options.profile, options.ec2creds);

    // Find the package.json from the main toolkit
    const pkg = (require.main as any).require('../package.json');
    AWS.config.update({
        customUserAgent: `${pkg.name}/${pkg.version}`
    });

    // https://aws.amazon.com/blogs/developer/using-the-aws-sdk-for-javascript-from-behind-a-proxy/
    if (options.proxyAddress === undefined) {
      options.proxyAddress = httpsProxyFromEnvironment();
    }
    if (options.proxyAddress) { // Ignore empty string on purpose
      debug('Using proxy server: %s', options.proxyAddress);
      AWS.config.update({
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        httpOptions: { agent: require('proxy-agent')(options.proxyAddress) }
      });
    }

    if (options.endpoints) {
      try {
        this.endpoints = JSON.parse(options.endpoints);
      } catch (_e) {}

      try {
          this.endpoints = this.endpoints ||
          options.endpoints.split(/,/g).reduce<ServiceEndpoints>((acc, entry) => {
              const [service, url] = entry.split('=');
              if (service && url) {
                  acc[service] = url;
              }
              return acc;
          }, {});
      } catch (_e) {}

      this.endpoints = this.endpoints || {};
    }

    this.defaultAwsAccount = new DefaultAWSAccount(defaultCredentialProvider, getCLICompatibleDefaultRegionGetter(this.profile));
    this.credentialsCache = new CredentialsCache(this.defaultAwsAccount, defaultCredentialProvider);
  }

  public async cloudFormation(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.CloudFormation> {
    const environment = await this.resolveEnvironment(account, region);
    return new AWS.CloudFormation({
      ...this.retryOptions,
      endpoint: this.endpoints.cloudformation,
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode)
    });
  }

  public async ec2(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.EC2> {
    const environment = await this.resolveEnvironment(account, region);
    return new AWS.EC2({
      ...this.retryOptions,
      endpoint: this.endpoints.ec2,
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode)
    });
  }

  public async ssm(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.SSM> {
    const environment = await this.resolveEnvironment(account, region);
    return new AWS.SSM({
      ...this.retryOptions,
      endpoint: this.endpoints.ssm,
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode)
    });
  }

  public async s3(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.S3> {
    const environment = await this.resolveEnvironment(account, region);
    return new AWS.S3({
      ...this.retryOptions,
      endpoint: this.endpoints.s3,
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode)
    });
  }

  public async route53(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.Route53> {
    const environment = await this.resolveEnvironment(account, region);
    return new AWS.Route53({
      ...this.retryOptions,
      endpoint: this.endpoints.route53,
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode),
    });
  }

  public async ecr(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.ECR> {
    const environment = await this.resolveEnvironment(account, region);
    return new AWS.ECR({
      ...this.retryOptions,
      endpoint: this.endpoints.ecr,
      region: environment.region,
      credentials: await this.credentialsCache.get(environment.account, mode)
    });
  }

  public async defaultRegion(): Promise<string | undefined> {
    return await getCLICompatibleDefaultRegionGetter(this.profile)();
  }

  public defaultAccount(): Promise<string | undefined> {
    return this.defaultAwsAccount.get();
  }

  private async resolveEnvironment(account: string | undefined, region: string | undefined, ) {
    if (region === cxapi.UNKNOWN_REGION) {
      region = await this.defaultRegion();
    }

    if (account === cxapi.UNKNOWN_ACCOUNT) {
      account = await this.defaultAccount();
    }

    if (!region) {
      throw new Error(`AWS region must be configured either when you configure your CDK stack or through the environment`);
    }

    if (!account) {
      throw new Error(`Unable to resolve AWS account to use. It must be either configured when you define your CDK or through the environment`);
    }

    const environment: cxapi.Environment = {
      region, account, name: cxapi.EnvironmentUtils.format(account, region)
    };

    return environment;
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
    if (!awsAccountId || awsAccountId === defaultAccount || awsAccountId === cxapi.UNKNOWN_ACCOUNT) {
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

  constructor(
      private readonly defaultCredentialsProvider: Promise<AWS.CredentialProviderChain>,
      private readonly region: () => Promise<string | undefined>) {
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
      // There just is *NO* way to do AssumeRole credentials as long as AWS_SDK_LOAD_CONFIG is not set. The SDK
      // crash if the file does not exist though. So set the environment variable if we can find that file.
      await setConfigVariable();

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
        const result = await new AWS.STS({ credentials: creds, region: await this.region() }).getCallerIdentity().promise();
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
 *
 * Returns a function that can be invoked to retrieve the actual region value
 * (used to be just a promise, but that would lead to firing off a failing
 * operation and if it was never awaited NodeJS would complain).
 */
function getCLICompatibleDefaultRegionGetter(profile: string | undefined): () => Promise<string | undefined> {
  let retrieved = false;
  let region: string | undefined;
  return async () => {
    if (!retrieved) {
      profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

      // Defaults inside constructor
      const toCheck = [
        {filename: process.env.AWS_SHARED_CREDENTIALS_FILE },
        {isConfig: true, filename: process.env.AWS_CONFIG_FILE},
      ];

      region = process.env.AWS_REGION || process.env.AMAZON_REGION ||
        process.env.AWS_DEFAULT_REGION || process.env.AMAZON_DEFAULT_REGION;

      while (!region && toCheck.length > 0) {
        const configFile = new SharedIniFile(toCheck.shift());
        const section = await configFile.getProfile(profile);
        region = section && section.region;
      }

      if (!region) {
        const usedProfile = !profile ? '' : ` (profile: "${profile}")`;
        debug(`Unable to determine AWS region from environment or AWS configuration${usedProfile}`);
      }

      retrieved = true;
    }

    return region;
  };
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

async function setConfigVariable() {
  const homeDir = process.env.HOME || process.env.USERPROFILE
    || (process.env.HOMEPATH ? ((process.env.HOMEDRIVE || 'C:/') + process.env.HOMEPATH) : null) || os.homedir();

  if (await fs.pathExists(path.resolve(homeDir, '.aws', 'config'))) {
    process.env.AWS_SDK_LOAD_CONFIG = '1';
  }
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
