import * as child_process from 'child_process';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import * as AWS from 'aws-sdk';
import * as fs from 'fs-extra';
import { debug } from '../../logging';
import { SharedIniFile } from './sdk_ini_file';

/**
 * Behaviors to match AWS CLI
 *
 * See these links:
 *
 * https://docs.aws.amazon.com/cli/latest/topic/config-vars.html
 * https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-envvars.html
 */
export class AwsCliCompatible {
  /**
   * Build an AWS CLI-compatible credential chain provider
   *
   * This is similar to the default credential provider chain created by the SDK
   * except:
   *
   * 1. Accepts profile argument in the constructor (the SDK must have it prepopulated
   *    in the environment).
   * 2. Conditionally checks EC2 credentials, because checking for EC2
   *    credentials on a non-EC2 machine may lead to long delays (in the best case)
   *    or an exception (in the worst case).
   * 3. Respects $AWS_SHARED_CREDENTIALS_FILE.
   * 4. Respects $AWS_DEFAULT_PROFILE in addition to $AWS_PROFILE.
   */
  public static async credentialChain(
    profile: string | undefined,
    ec2creds: boolean | undefined,
    containerCreds: boolean | undefined,
    httpOptions: AWS.HTTPOptions | undefined) {
    await forceSdkToReadConfigIfPresent();

    profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

    const sources = [
      () => new AWS.EnvironmentCredentials('AWS'),
      () => new AWS.EnvironmentCredentials('AMAZON'),
    ];

    if (await fs.pathExists(credentialsFileName())) {
      sources.push(() => new AWS.SharedIniFileCredentials({ profile, filename: credentialsFileName(), httpOptions }));
    }

    if (await fs.pathExists(configFileName())) {
      sources.push(() => new AWS.SharedIniFileCredentials({ profile, filename: credentialsFileName(), httpOptions }));
    }

    if (containerCreds ?? hasEcsCredentials()) {
      sources.push(() => new AWS.ECSCredentials());
    } else if (ec2creds ?? await hasEc2Credentials()) {
      // else if: don't get EC2 creds if we should have gotten ECS creds--ECS instances also
      // run on EC2 boxes but the creds represent something different. Same behavior as
      // upstream code.
      sources.push(() => new AWS.EC2MetadataCredentials());
    }

    return new AWS.CredentialProviderChain(sources);
  }

  /**
   * Return the default region in a CLI-compatible way
   *
   * Mostly copied from node_loader.js, but with the following differences to make it
   * AWS CLI compatible:
   *
   * 1. Takes a profile name as an argument (instead of forcing it to be taken from $AWS_PROFILE).
   *    This requires having made a copy of the SDK's `SharedIniFile` (the original
   *    does not take an argument).
   * 2. $AWS_DEFAULT_PROFILE and $AWS_DEFAULT_REGION are also respected.
   *
   * Lambda and CodeBuild set the $AWS_REGION variable.
   *
   * FIXME: EC2 instances require querying the metadata service to determine the current region.
   */
  public static async region(profile: string | undefined): Promise<string> {
    profile = profile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

    // Defaults inside constructor
    const toCheck = [
      { filename: credentialsFileName(), profile },
      { isConfig: true, filename: configFileName(), profile },
      { isConfig: true, filename: configFileName(), profile: 'default' },
    ];

    let region = process.env.AWS_REGION || process.env.AMAZON_REGION ||
      process.env.AWS_DEFAULT_REGION || process.env.AMAZON_DEFAULT_REGION;

    while (!region && toCheck.length > 0) {
      const options = toCheck.shift()!;
      if (await fs.pathExists(options.filename)) {
        const configFile = new SharedIniFile(options);
        const section = await configFile.getProfile(options.profile);
        region = section?.region;
      }
    }

    if (!region) {
      const usedProfile = !profile ? '' : ` (profile: "${profile}")`;
      region = 'us-east-1'; // This is what the AWS CLI does
      debug(`Unable to determine AWS region from environment or AWS configuration${usedProfile}, defaulting to '${region}'`);
    }

    return region;
  }
}

/**
 * Return whether it looks like we'll have ECS credentials available
 */
function hasEcsCredentials(): boolean {
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

function homeDir() {
  return process.env.HOME || process.env.USERPROFILE
    || (process.env.HOMEPATH ? ((process.env.HOMEDRIVE || 'C:/') + process.env.HOMEPATH) : null) || os.homedir();
}

function credentialsFileName() {
  return process.env.AWS_SHARED_CREDENTIALS_FILE || path.join(homeDir(), '.aws', 'credentials');
}

function configFileName() {
  return process.env.AWS_CONFIG_FILE || path.join(homeDir(), '.aws', 'config');
}

/**
 * Force the JS SDK to honor the ~/.aws/config file (and various settings therein)
 *
 * For example, ther is just *NO* way to do AssumeRole credentials as long as AWS_SDK_LOAD_CONFIG is not set,
 * or read credentials from that file.
 *
 * The SDK crashes if the variable is set but the file does not exist, so conditionally set it.
 */
async function forceSdkToReadConfigIfPresent() {
  if (await fs.pathExists(configFileName())) {
    process.env.AWS_SDK_LOAD_CONFIG = '1';
  }
}

function matchesRegex(re: RegExp, s: string | undefined) {
  return s !== undefined && re.exec(s) !== null;
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