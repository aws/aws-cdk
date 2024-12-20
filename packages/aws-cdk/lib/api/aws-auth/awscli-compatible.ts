import { createCredentialChain, fromEnv, fromIni, fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { MetadataService } from '@aws-sdk/ec2-metadata-service';
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler';
import { loadSharedConfigFiles } from '@smithy/shared-ini-file-loader';
import { AwsCredentialIdentityProvider, Logger } from '@smithy/types';
import * as promptly from 'promptly';
import { ProxyAgent } from 'proxy-agent';
import { makeCachingProvider } from './provider-caching';
import type { SdkHttpOptions } from './sdk-provider';
import { readIfPossible } from './util';
import { debug } from '../../logging';
import { AuthenticationError } from '../../toolkit/error';

const DEFAULT_CONNECTION_TIMEOUT = 10000;
const DEFAULT_TIMEOUT = 300000;

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
   * The credential chain returned by this function is always caching.
   */
  public static async credentialChainBuilder(
    options: CredentialChainOptions = {},
  ): Promise<AwsCredentialIdentityProvider> {
    const clientConfig = {
      requestHandler: AwsCliCompatible.requestHandlerBuilder(options.httpOptions),
      customUserAgent: 'aws-cdk',
      logger: options.logger,
    };

    // Super hacky solution to https://github.com/aws/aws-cdk/issues/32510, proposed by the SDK team.
    //
    // Summary of the problem: we were reading the region from the config file and passing it to
    // the credential providers. However, in the case of SSO, this makes the credential provider
    // use that region to do the SSO flow, which is incorrect. The region that should be used for
    // that is the one set in the sso_session section of the config file.
    //
    // The idea here: the "clientConfig" is for configuring the inner auth client directly,
    // and has the highest priority, whereas "parentClientConfig" is the upper data client
    // and has lower priority than the sso_region but still higher priority than STS global region.
    const parentClientConfig = {
      region: await this.region(options.profile),
    };
    /**
     * The previous implementation matched AWS CLI behavior:
     *
     * If a profile is explicitly set using `--profile`,
     * we use that to the exclusion of everything else.
     *
     * Note: this does not apply to AWS_PROFILE,
     * environment credentials still take precedence over AWS_PROFILE
     */
    if (options.profile) {
      return makeCachingProvider(fromIni({
        profile: options.profile,
        ignoreCache: true,
        mfaCodeProvider: tokenCodeFn,
        clientConfig,
        parentClientConfig,
        logger: options.logger,
      }));
    }

    const envProfile = process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE;

    /**
     * Env AWS - EnvironmentCredentials with string AWS
     * Env Amazon - EnvironmentCredentials with string AMAZON
     * Profile Credentials - PatchedSharedIniFileCredentials with implicit profile, credentials file, http options, and token fn
     *    SSO with implicit profile only
     *    SharedIniFileCredentials with implicit profile and preferStaticCredentials true (profile with source_profile)
     *    Shared Credential file that points to Environment Credentials with AWS prefix
     *    Shared Credential file that points to EC2 Metadata
     *    Shared Credential file that points to ECS Credentials
     * SSO Credentials - SsoCredentials with implicit profile and http options
     * ProcessCredentials with implicit profile
     * ECS Credentials - ECSCredentials with no input OR Web Identity - TokenFileWebIdentityCredentials with no input OR EC2 Metadata - EC2MetadataCredentials with no input
     *
     * These translate to:
     * fromEnv()
     * fromSSO()/fromIni()
     * fromProcess()
     * fromContainerMetadata()
     * fromTokenFile()
     * fromInstanceMetadata()
     *
     * The NodeProviderChain is already cached.
     */
    const nodeProviderChain = fromNodeProviderChain({
      profile: envProfile,
      clientConfig,
      parentClientConfig,
      logger: options.logger,
      mfaCodeProvider: tokenCodeFn,
      ignoreCache: true,
    });

    return shouldPrioritizeEnv()
      ? createCredentialChain(fromEnv(), nodeProviderChain).expireAfter(60 * 60_000)
      : nodeProviderChain;
  }

  public static requestHandlerBuilder(options: SdkHttpOptions = {}): NodeHttpHandlerOptions {
    const agent = this.proxyAgent(options);

    return {
      connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
      requestTimeout: DEFAULT_TIMEOUT,
      httpsAgent: agent,
      httpAgent: agent,
    };
  }

  public static proxyAgent(options: SdkHttpOptions) {
    // Force it to use the proxy provided through the command line.
    // Otherwise, let the ProxyAgent auto-detect the proxy using environment variables.
    const getProxyForUrl = options.proxyAddress != null
      ? () => Promise.resolve(options.proxyAddress!)
      : undefined;

    return new ProxyAgent({
      ca: tryGetCACert(options.caBundlePath),
      getProxyForUrl,
    });
  }

  /**
   * Attempts to get the region from a number of sources and falls back to us-east-1 if no region can be found,
   * as is done in the AWS CLI.
   *
   * The order of priority is the following:
   *
   * 1. Environment variables specifying region, with both an AWS prefix and AMAZON prefix
   *    to maintain backwards compatibility, and without `DEFAULT` in the name because
   *    Lambda and CodeBuild set the $AWS_REGION variable.
   * 2. Regions listed in the Shared Ini Files - First checking for the profile provided
   *    and then checking for the default profile.
   * 3. IMDS instance identity region from the Metadata Service.
   * 4. us-east-1
   */
  public static async region(maybeProfile?: string): Promise<string> {
    const defaultRegion = 'us-east-1';
    const profile = maybeProfile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

    const region =
      process.env.AWS_REGION ||
      process.env.AMAZON_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      process.env.AMAZON_DEFAULT_REGION ||
      (await getRegionFromIni(profile)) ||
      (await regionFromMetadataService());

    if (!region) {
      const usedProfile = !profile ? '' : ` (profile: "${profile}")`;
      debug(
        `Unable to determine AWS region from environment or AWS configuration${usedProfile}, defaulting to '${defaultRegion}'`,
      );
      return defaultRegion;
    }

    return region;
  }
}

/**
 * Looks up the region of the provided profile. If no region is present,
 * it will attempt to lookup the default region.
 * @param profile The profile to use to lookup the region
 * @returns The region for the profile or default profile, if present. Otherwise returns undefined.
 */
async function getRegionFromIni(profile: string): Promise<string | undefined> {
  const sharedFiles = await loadSharedConfigFiles({ ignoreCache: true });

  // Priority:
  //
  // credentials come before config because aws-cli v1 behaves like that.
  //
  // 1. profile-region-in-credentials
  // 2. profile-region-in-config
  // 3. default-region-in-credentials
  // 4. default-region-in-config

  return getRegionFromIniFile(profile, sharedFiles.credentialsFile)
    ?? getRegionFromIniFile(profile, sharedFiles.configFile)
    ?? getRegionFromIniFile('default', sharedFiles.credentialsFile)
    ?? getRegionFromIniFile('default', sharedFiles.configFile);

}

function getRegionFromIniFile(profile: string, data?: any) {
  return data?.[profile]?.region;
}

function tryGetCACert(bundlePath?: string) {
  const path = bundlePath || caBundlePathFromEnvironment();
  if (path) {
    debug('Using CA bundle path: %s', path);
    return readIfPossible(path);
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
 * We used to support both AWS and AMAZON prefixes for these environment variables.
 *
 * Adding this for backward compatibility.
 */
function shouldPrioritizeEnv() {
  const id = process.env.AWS_ACCESS_KEY_ID || process.env.AMAZON_ACCESS_KEY_ID;
  const key = process.env.AWS_SECRET_ACCESS_KEY || process.env.AMAZON_SECRET_ACCESS_KEY;

  if (!!id && !!key) {
    process.env.AWS_ACCESS_KEY_ID = id;
    process.env.AWS_SECRET_ACCESS_KEY = key;

    const sessionToken = process.env.AWS_SESSION_TOKEN ?? process.env.AMAZON_SESSION_TOKEN;
    if (sessionToken) {
      process.env.AWS_SESSION_TOKEN = sessionToken;
    }

    return true;
  }

  return false;
}

/**
 * The MetadataService class will attempt to fetch the instance identity document from
 * IMDSv2 first, and then will attempt v1 as a fallback.
 *
 * If this fails, we will use us-east-1 as the region so no error should be thrown.
 * @returns The region for the instance identity
 */
async function regionFromMetadataService() {
  debug('Looking up AWS region in the EC2 Instance Metadata Service (IMDS).');
  try {
    const metadataService = new MetadataService({
      httpOptions: {
        timeout: 1000,
      },
    });

    await metadataService.fetchMetadataToken();
    const document = await metadataService.request('/latest/dynamic/instance-identity/document', {});
    return JSON.parse(document).region;
  } catch (e) {
    debug(`Unable to retrieve AWS region from IMDS: ${e}`);
  }
}

export interface CredentialChainOptions {
  readonly profile?: string;
  readonly httpOptions?: SdkHttpOptions;
  readonly logger?: Logger;
}

/**
 * Ask user for MFA token for given serial
 *
 * Result is send to callback function for SDK to authorize the request
 */
async function tokenCodeFn(serialArn: string): Promise<string> {
  debug('Require MFA token for serial ARN', serialArn);
  try {
    const token: string = await promptly.prompt(`MFA token for ${serialArn}: `, {
      trim: true,
      default: '',
    });
    debug('Successfully got MFA token from user');
    return token;
  } catch (err: any) {
    debug('Failed to get MFA token', err);
    const e = new AuthenticationError(`Error fetching MFA token: ${err.message ?? err}`);
    e.name = 'SharedIniFileCredentialsProviderFailure';
    throw e;
  }
}
