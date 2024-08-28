import { fromIni, fromNodeProviderChain } from '@aws-sdk/credential-providers';
import { MetadataService } from '@aws-sdk/ec2-metadata-service';
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler';
import { AwsCredentialIdentityProvider } from '@smithy/types';
import * as promptly from 'promptly';
import type { SdkHttpOptions } from './sdk-provider';
import { readIfPossible } from './util';
import { debug } from '../../logging';

const DEFAULT_CONNECTION_TIMEOUT = 10000;
const DEFAULT_TIMEOUT = 300000;

/**
 * TODO:
 *  - Verify localAddress is correct way to add proxy
 *  - Add back in logic to get the region when it's not default using sdk tooling
 *  - Fill in any settings that need to be added to the chain
 */

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
   */
  public static async credentialChainBuilder(
    options: CredentialChainOptions = {},
  ): Promise<AwsCredentialIdentityProvider> {
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
      return fromIni({
        profile: options.profile,
        mfaCodeProvider: tokenCodeFn,
        clientConfig: {
          requestHandler: AwsCliCompatible.requestHandlerBuilder(options.httpOptions),
          customUserAgent: '',
        },
      });
    }

    makeEnvironmentVariablesCompatible();
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
     */

    return fromNodeProviderChain({
      profile: options.profile,
      clientConfig: {
        requestHandler: AwsCliCompatible.requestHandlerBuilder(options.httpOptions),
        customUserAgent: '',
      },
    });
  }

  public static requestHandlerBuilder(options: SdkHttpOptions = {}): NodeHttpHandlerOptions {
    const config: NodeHttpHandlerOptions = {
      connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
      requestTimeout: DEFAULT_TIMEOUT,
      httpsAgent: {
        ca: tryGetCACert(options.caBundlePath),
        // TODO: Verify - I don't feel confident about this one
        localAddress: options.proxyAddress,
      },
    };
    return config;
  }

  public static async region(maybeProfile?: string): Promise<string> {
    const defaultRegion = 'us-east-1';
    const profile = maybeProfile || process.env.AWS_PROFILE || process.env.AWS_DEFAULT_PROFILE || 'default';

    const region =
      process.env.AWS_REGION ||
      process.env.AMAZON_REGION ||
      process.env.AWS_DEFAULT_REGION ||
      process.env.AMAZON_DEFAULT_REGION ||
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

function tryGetCACert(bundlePath?: string) {
  const path = bundlePath || caBundlePathFromEnvironment();
  if (path) {
    debug('Using CA bundle path: %s', bundlePath);
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
 * Adding this for backward compatibility and to ensure the original order of precedence is still respected.
 * See: https://github.com/aws/aws-sdk-js-v3/pull/6277
 */
function makeEnvironmentVariablesCompatible() {
  process.env.AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID || process.env.AMAZON_ACCESS_KEY_ID || undefined;
  process.env.AWS_SECRET_ACCESS_KEY =
    process.env.AWS_SECRET_ACCESS_KEY || process.env.AMAZON_SECRET_ACCESS_KEY || undefined;
  process.env.AWS_SESSION_TOKEN = process.env.AWS_SESSION_TOKEN || process.env.AMAZON_SESSION_TOKEN || undefined;

  if (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY) {
    process.env.AWS_PROFILE = undefined;
  }
}

async function regionFromMetadataService() {
  const metadataService = new MetadataService({
    ec2MetadataV1Disabled: true,
    httpOptions: {
      timeout: 1000,
    },
  });

  await metadataService.fetchMetadataToken();
  const document = await metadataService.request('/latest/dynamic/instance-identity/document', {});
  return JSON.parse(document).region;
}

export interface CredentialChainOptions {
  readonly profile?: string;
  readonly ec2instance?: boolean;
  readonly httpOptions?: SdkHttpOptions;
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
    const e = new Error(`Error fetching MFA token: ${err.message ?? err}`);
    e.name = 'SharedIniFileCredentialsProviderFailure';
    throw e;
  }
}
