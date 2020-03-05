import * as AWS from 'aws-sdk';
import * as child_process from 'child_process';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';
import * as util from 'util';
import { debug } from '../../logging';

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

export class AwsCliCompatibleCredentialProvider extends AWS.CredentialProviderChain {
  public static async create(profile: string | undefined, ec2creds: boolean | undefined) {
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

    return new AwsCliCompatibleCredentialProvider(sources);
  }

  protected constructor(sources: Array<() => AWS.Credentials>) {
    super(sources);
  }
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