import * as cxapi from '@aws-cdk/cx-api';
import * as AWS from 'aws-sdk';
import { ConfigurationOptions } from 'aws-sdk/lib/config';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as https from 'https';
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

  assumeRole(arn: string, region: string): Promise<ISDK>;

  defaultRegion(): Promise<string | undefined>;

  defaultAccount(): Promise<Account | undefined>;
}

/**
 * An AWS account
 *
 * An AWS account always exists in only one partition. Usually we don't care about
 * the partition, but when we need to form ARNs we do.
 */
export interface Account {
  /**
   * The account number
   */
  readonly accountId: string;

  /**
   * The partition ('aws' or 'aws-cn' or otherwise)
   */
  readonly partition: string;
}

export interface SDKBaseOptions {
  /**
   * Proxy address to use
   *
   * @default No proxy
   */
  readonly proxyAddress?: string;

  /**
   * A path to a certificate bundle that contains a cert to be trusted.
   *
   * @default No certificate bundle
   */
  readonly caBundlePath?: string;

  /**
   * The custom user agent to use.
   *
   * @default - <package-name>/<package-version>
   */
  readonly userAgent?: string;
}

/**
 * Base functionality of SDK without credential fetching
 */
abstract class SDKBase implements ISDK {
  private readonly config: ConfigurationOptions;

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

  constructor(protected readonly options: SDKBaseOptions = {}) {
    this.config = this.configureSDKHttpOptions(options);
  }

  public cloudFormation(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.CloudFormation> {
    return this.service(AWS.CloudFormation, account, region, mode);
  }

  public ec2(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.EC2> {
    return this.service(AWS.EC2, account, region, mode);
  }

  public ssm(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.SSM> {
    return this.service(AWS.SSM, account, region, mode);
  }

  public s3(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.S3> {
    return this.service(AWS.S3, account, region, mode);
  }

  public route53(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.Route53> {
    return this.service(AWS.Route53, account, region, mode);
  }

  public ecr(account: string | undefined, region: string | undefined, mode: Mode): Promise<AWS.ECR> {
    return this.service(AWS.ECR, account, region, mode);
  }

  /**
   * Obtain an SDK initialized by assuming a role
   *
   * WARNING: This does not refresh any credentials, because I don't understand
   * the applicable building blocks of the JS SDK well enough. There is a
   * discrepancy between TemporaryCredentials and CredentialProviders that I
   * don't fully grok.
   */
  public async assumeRole(arn: string, region: string): Promise<ISDK> {
    debug(`Assuming role '${arn}'`);
    const sts = await this.service(AWS.STS, (await this.defaultAccount())?.accountId, region, Mode.ForWriting);
    const response = await sts.assumeRole({
      RoleArn: arn,
      RoleSessionName: `aws-cdk-${os.userInfo().username}`,
    }).promise();

    return new FixedCredentialsSDK(this, new AWS.Credentials({
      accessKeyId: response.Credentials!.AccessKeyId,
      secretAccessKey: response.Credentials!.SecretAccessKey,
      sessionToken: response.Credentials?.SessionToken,
    }));
  }

  public abstract defaultRegion(): Promise<string | undefined>;

  public abstract defaultAccount(): Promise<Account | undefined>;

  protected async service<T extends AWS.Service>(
    ctor: new <O extends ServiceConfigurationOptions>(opts?: O) => T,
    account: string | undefined,
    region: string | undefined,
    mode: Mode): Promise<T> {
    const environment = await this.resolveEnvironment(account, region);
    return new ctor({
      ...this.retryOptions,
      ...this.config,
      region: environment.region,
      credentials: await this.obtainCredentials(environment.account, mode)
    });
  }

  protected abstract obtainCredentials(account: string, mode: Mode): Promise<AWS.Credentials>;

  private async resolveEnvironment(accountId: string | undefined, region: string | undefined) {
    if (region === cxapi.UNKNOWN_REGION) {
      region = await this.defaultRegion();
    }

    if (accountId === cxapi.UNKNOWN_ACCOUNT) {
      accountId = (await this.defaultAccount())?.accountId;
    }

    if (!region) {
      throw new Error(`AWS region must be configured either when you configure your CDK stack or through the environment`);
    }

    if (!accountId) {
      throw new Error(`Unable to resolve AWS account to use. It must be either configured when you define your CDK or through the environment`);
    }

    const environment: cxapi.Environment = {
      region, account: accountId, name: cxapi.EnvironmentUtils.format(accountId, region)
    };

    return environment;
  }

  private configureSDKHttpOptions(options: SDKBaseOptions) {
    const config: ConfigurationOptions = {};
    config.httpOptions = {};

    let userAgent = options.userAgent;
    if (userAgent == null) {
      // Find the package.json from the main toolkit
      const pkg = (require.main as any).require(path.join(__dirname, '..', '..', '..', 'package.json'));
      userAgent = `${pkg.name}/${pkg.version}`;
    }
    config.customUserAgent = userAgent;

    const proxyAddress = options.proxyAddress || httpsProxyFromEnvironment();
    const caBundlePath = options.caBundlePath || caBundlePathFromEnvironment();

    if (proxyAddress && caBundlePath) {
      throw new Error(`At the moment, cannot specify Proxy (${proxyAddress}) and CA Bundle (${caBundlePath}) at the same time. See https://github.com/aws/aws-cdk/issues/5804`);
      // Maybe it's possible after all, but I've been staring at
      // https://github.com/TooTallNate/node-proxy-agent/blob/master/index.js#L79
      // a while now trying to figure out what to pass in so that the underlying Agent
      // object will get the 'ca' argument. It's not trivial and I don't want to risk it.
    }

    if (proxyAddress) { // Ignore empty string on purpose
      // https://aws.amazon.com/blogs/developer/using-the-aws-sdk-for-javascript-from-behind-a-proxy/
      debug('Using proxy server: %s', proxyAddress);
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const ProxyAgent: any = require('proxy-agent');
      config.httpOptions.agent = new ProxyAgent(proxyAddress);
    }
    if (caBundlePath) {
      debug('Using CA bundle path: %s', caBundlePath);
      config.httpOptions.agent = new https.Agent({
        ca: readIfPossible(caBundlePath)
      });
    }

    return config;
  }
}

export interface SDKOptions extends SDKBaseOptions {
  /**
   * Profile name to use
   *
   * @default No profile
   */
  profile?: string;

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
 * Implementation of SDK with logic for obtaining credentials
 */
export class SDK extends SDKBase {
  private readonly defaultAwsAccount: DefaultAWSAccount;
  private readonly credentialsCache: CredentialsCache;
  private readonly profile?: string;

  constructor(options: SDKOptions = {}) {
    super();

    this.profile = options.profile;

    const defaultCredentialProvider = makeCLICompatibleCredentialProvider(options.profile, options.ec2creds);

    this.defaultAwsAccount = new DefaultAWSAccount(defaultCredentialProvider, getCLICompatibleDefaultRegionGetter(this.profile));
    this.credentialsCache = new CredentialsCache(this.defaultAwsAccount, defaultCredentialProvider);
  }

  public async defaultRegion(): Promise<string | undefined> {
    return await getCLICompatibleDefaultRegionGetter(this.profile)();
  }

  public defaultAccount(): Promise<Account | undefined> {
    return this.defaultAwsAccount.get();
  }

  protected obtainCredentials(account: string, mode: Mode): Promise<AWS.Credentials> {
    return this.credentialsCache.get(account, mode);
  }
}

class FixedCredentialsSDK extends SDKBase {
  constructor(protected readonly inner: SDKBase, private readonly credentials: AWS.Credentials) {
    super((inner as any).options); // TypeScript is not Java and won't let me access the protected otherwise
  }

  public async defaultRegion(): Promise<string | undefined> {
    return this.inner.defaultRegion();
  }

  public defaultAccount(): Promise<Account | undefined> {
    return this.inner.defaultAccount();
  }

  protected async obtainCredentials(_account: string, _mode: Mode): Promise<AWS.Credentials> {
    return this.credentials;
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
    if (!awsAccountId || awsAccountId === defaultAccount?.accountId || awsAccountId === cxapi.UNKNOWN_ACCOUNT) {
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
  private defaultAccount?: Account = undefined;
  private readonly accountCache = new AccountAccessKeyCache();

  constructor(
      private readonly defaultCredentialsProvider: Promise<AWS.CredentialProviderChain>,
      private readonly region: () => Promise<string | undefined>) {
  }

  /**
   * Return the default account
   */
  public async get(): Promise<Account | undefined> {
    if (!this.defaultAccountFetched) {
      this.defaultAccount = await this.lookupDefaultAccount();
      this.defaultAccountFetched = true;
    }
    return this.defaultAccount;
  }

  private async lookupDefaultAccount(): Promise<Account | undefined> {
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

      const account = await this.accountCache.fetch(creds.accessKeyId, async () => {
        // if we don't have one, resolve from STS and store in cache.
        debug('Looking up default account ID from STS');
        const result = await new AWS.STS({ credentials: creds, region: await this.region() }).getCallerIdentity().promise();
        const accountId = result.Account;
        const partition = result.Arn!.split(':')[1];
        if (!accountId) {
          debug('STS didn\'t return an account ID');
          return undefined;
        }
        debug('Default account ID:', accountId);
        return { accountId, partition };
      });

      return account;
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
  if (await fs.pathExists(filename)) {
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
 * Find and return a CA certificate bundle path to be passed into the SDK.
 */
function caBundlePathFromEnvironment(): string | undefined {
  if (process.env.aws_ca_bundle) {
    return process.env.aws_ca_bundle;
  }
  if (process.env.AWS_CA_BUNDLE) {
    return process.env.AWS_CA_BUNDLE;
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
      if (matchesRegex(re, readIfPossible(file))) {
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

/**
 * Read a file if it exists, or return undefined
 *
 * Not async because it is used in the constructor
 */
function readIfPossible(filename: string): string | undefined {
  try {
    if (!fs.pathExistsSync(filename)) { return undefined; }
    return fs.readFileSync(filename, { encoding: 'utf-8' });
  } catch (e) {
    debug(e);
    return undefined;
  }
}

function matchesRegex(re: RegExp, s: string | undefined) {
  return s !== undefined && re.exec(s) !== null;
}
