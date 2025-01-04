import * as os from 'os';
import { ContextLookupRoleOptions } from '@aws-cdk/cloud-assembly-schema';
import { Environment, EnvironmentUtils, UNKNOWN_ACCOUNT, UNKNOWN_REGION } from '@aws-cdk/cx-api';
import { AssumeRoleCommandInput } from '@aws-sdk/client-sts';
import { fromTemporaryCredentials } from '@aws-sdk/credential-providers';
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler';
import { AwsCredentialIdentityProvider, Logger } from '@smithy/types';
import { AwsCliCompatible } from './awscli-compatible';
import { cached } from './cached';
import { CredentialPlugins } from './credential-plugins';
import { makeCachingProvider } from './provider-caching';
import { SDK } from './sdk';
import { debug, warning } from '../../logging';
import { AuthenticationError } from '../../toolkit/error';
import { traceMethods } from '../../util/tracing';
import { Mode } from '../plugin/mode';

export type AssumeRoleAdditionalOptions = Partial<Omit<AssumeRoleCommandInput, 'ExternalId' | 'RoleArn'>>;

/**
 * Options for the default SDK provider
 */
export interface SdkProviderOptions {
  /**
   * Profile to read from ~/.aws
   *
   * @default - No profile
   */
  readonly profile?: string;

  /**
   * HTTP options for SDK
   */
  readonly httpOptions?: SdkHttpOptions;

  /**
   * The logger for sdk calls.
   */
  readonly logger?: Logger;
}

/**
 * Options for individual SDKs
 */
export interface SdkHttpOptions {
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
}

const CACHED_ACCOUNT = Symbol('cached_account');

/**
 * SDK configuration for a given environment
 * 'forEnvironment' will attempt to assume a role and if it
 * is not successful, then it will either:
 *   1. Check to see if the default credentials (local credentials the CLI was executed with)
 *      are for the given environment. If they are then return those.
 *   2. If the default credentials are not for the given environment then
 *      throw an error
 *
 * 'didAssumeRole' allows callers to whether they are receiving the assume role
 * credentials or the default credentials.
 */
export interface SdkForEnvironment {
  /**
   * The SDK for the given environment
   */
  readonly sdk: SDK;

  /**
   * Whether or not the assume role was successful.
   * If the assume role was not successful (false)
   * then that means that the 'sdk' returned contains
   * the default credentials (not the assume role credentials)
   */
  readonly didAssumeRole: boolean;
}

/**
 * Creates instances of the AWS SDK appropriate for a given account/region.
 *
 * Behavior is as follows:
 *
 * - First, a set of "base" credentials are established
 *   - If a target environment is given and the default ("current") SDK credentials are for
 *     that account, return those; otherwise
 *   - If a target environment is given, scan all credential provider plugins
 *     for credentials, and return those if found; otherwise
 *   - Return default ("current") SDK credentials, noting that they might be wrong.
 *
 * - Second, a role may optionally need to be assumed. Use the base credentials
 *   established in the previous process to assume that role.
 *   - If assuming the role fails and the base credentials are for the correct
 *     account, return those. This is a fallback for people who are trying to interact
 *     with a Default Synthesized stack and already have right credentials setup.
 *
 *     Typical cases we see in the wild:
 *     - Credential plugin setup that, although not recommended, works for them
 *     - Seeded terminal with `ReadOnly` credentials in order to do `cdk diff`--the `ReadOnly`
 *       role doesn't have `sts:AssumeRole` and will fail for no real good reason.
 */
@traceMethods
export class SdkProvider {
  /**
   * Create a new SdkProvider which gets its defaults in a way that behaves like the AWS CLI does
   *
   * The AWS SDK for JS behaves slightly differently from the AWS CLI in a number of ways; see the
   * class `AwsCliCompatible` for the details.
   */
  public static async withAwsCliCompatibleDefaults(options: SdkProviderOptions = {}) {
    const credentialProvider = await AwsCliCompatible.credentialChainBuilder({
      profile: options.profile,
      httpOptions: options.httpOptions,
      logger: options.logger,
    });

    const region = await AwsCliCompatible.region(options.profile);
    const requestHandler = AwsCliCompatible.requestHandlerBuilder(options.httpOptions);
    return new SdkProvider(credentialProvider, region, requestHandler, options.logger);
  }

  private readonly plugins = new CredentialPlugins();

  public constructor(
    private readonly defaultCredentialProvider: AwsCredentialIdentityProvider,
    /**
     * Default region
     */
    public readonly defaultRegion: string,
    private readonly requestHandler: NodeHttpHandlerOptions = {},
    private readonly logger?: Logger,
  ) {}

  /**
   * Return an SDK which can do operations in the given environment
   *
   * The `environment` parameter is resolved first (see `resolveEnvironment()`).
   */
  public async forEnvironment(
    environment: Environment,
    mode: Mode,
    options?: CredentialsOptions,
    quiet = false,
  ): Promise<SdkForEnvironment> {
    const env = await this.resolveEnvironment(environment);

    const baseCreds = await this.obtainBaseCredentials(env.account, mode);

    // At this point, we need at least SOME credentials
    if (baseCreds.source === 'none') {
      throw new AuthenticationError(fmtObtainCredentialsError(env.account, baseCreds));
    }

    // Simple case is if we don't need to "assumeRole" here. If so, we must now have credentials for the right
    // account.
    if (options?.assumeRoleArn === undefined) {
      if (baseCreds.source === 'incorrectDefault') {
        throw new AuthenticationError(fmtObtainCredentialsError(env.account, baseCreds));
      }

      // Our current credentials must be valid and not expired. Confirm that before we get into doing
      // actual CloudFormation calls, which might take a long time to hang.
      const sdk = new SDK(baseCreds.credentials, env.region, this.requestHandler, this.logger);
      await sdk.validateCredentials();
      return { sdk, didAssumeRole: false };
    }

    try {
      // We will proceed to AssumeRole using whatever we've been given.
      const sdk = await this.withAssumedRole(
        baseCreds,
        options.assumeRoleArn,
        options.assumeRoleExternalId,
        options.assumeRoleAdditionalOptions,
        env.region,
      );

      return { sdk, didAssumeRole: true };
    } catch (err: any) {
      if (err.name === 'ExpiredToken') {
        throw err;
      }

      // AssumeRole failed. Proceed and warn *if and only if* the baseCredentials were already for the right account
      // or returned from a plugin. This is to cover some current setups for people using plugins or preferring to
      // feed the CLI credentials which are sufficient by themselves. Prefer to assume the correct role if we can,
      // but if we can't then let's just try with available credentials anyway.
      if (baseCreds.source === 'correctDefault' || baseCreds.source === 'plugin') {
        debug(err.message);
        const logger = quiet ? debug : warning;
        logger(
          `${fmtObtainedCredentials(baseCreds)} could not be used to assume '${options.assumeRoleArn}', but are for the right account. Proceeding anyway.`,
        );
        return {
          sdk: new SDK(baseCreds.credentials, env.region, this.requestHandler, this.logger),
          didAssumeRole: false,
        };
      }

      throw err;
    }
  }

  /**
   * Return the partition that base credentials are for
   *
   * Returns `undefined` if there are no base credentials.
   */
  public async baseCredentialsPartition(environment: Environment, mode: Mode): Promise<string | undefined> {
    const env = await this.resolveEnvironment(environment);
    const baseCreds = await this.obtainBaseCredentials(env.account, mode);
    if (baseCreds.source === 'none') {
      return undefined;
    }
    return (await new SDK(baseCreds.credentials, env.region, this.requestHandler, this.logger).currentAccount()).partition;
  }

  /**
   * Resolve the environment for a stack
   *
   * Replaces the magic values `UNKNOWN_REGION` and `UNKNOWN_ACCOUNT`
   * with the defaults for the current SDK configuration (`~/.aws/config` or
   * otherwise).
   *
   * It is an error if `UNKNOWN_ACCOUNT` is used but the user hasn't configured
   * any SDK credentials.
   */
  public async resolveEnvironment(env: Environment): Promise<Environment> {
    const region = env.region !== UNKNOWN_REGION ? env.region : this.defaultRegion;
    const account = env.account !== UNKNOWN_ACCOUNT ? env.account : (await this.defaultAccount())?.accountId;

    if (!account) {
      throw new AuthenticationError(
        'Unable to resolve AWS account to use. It must be either configured when you define your CDK Stack, or through the environment',
      );
    }

    return {
      region,
      account,
      name: EnvironmentUtils.format(account, region),
    };
  }

  /**
   * The account we'd auth into if we used default credentials.
   *
   * Default credentials are the set of ambiently configured credentials using
   * one of the environment variables, or ~/.aws/credentials, or the *one*
   * profile that was passed into the CLI.
   *
   * Might return undefined if there are no default/ambient credentials
   * available (in which case the user should better hope they have
   * credential plugins configured).
   *
   * Uses a cache to avoid STS calls if we don't need 'em.
   */
  public async defaultAccount(): Promise<Account | undefined> {
    return cached(this, CACHED_ACCOUNT, async () => {
      try {
        return await new SDK(this.defaultCredentialProvider, this.defaultRegion, this.requestHandler, this.logger).currentAccount();
      } catch (e: any) {
        // Treat 'ExpiredToken' specially. This is a common situation that people may find themselves in, and
        // they are complaining about if we fail 'cdk synth' on them. We loudly complain in order to show that
        // the current situation is probably undesirable, but we don't fail.
        if (e.name === 'ExpiredToken') {
          warning(
            'There are expired AWS credentials in your environment. The CDK app will synth without current account information.',
          );
          return undefined;
        }

        debug(`Unable to determine the default AWS account (${e.name}): ${e.message}`);
        return undefined;
      }
    });
  }

  /**
   * Get credentials for the given account ID in the given mode
   *
   * 1. Use the default credentials if the destination account matches the
   *    current credentials' account.
   * 2. Otherwise try all credential plugins.
   * 3. Fail if neither of these yield any credentials.
   * 4. Return a failure if any of them returned credentials
   */
  private async obtainBaseCredentials(accountId: string, mode: Mode): Promise<ObtainBaseCredentialsResult> {
    // First try 'current' credentials
    const defaultAccountId = (await this.defaultAccount())?.accountId;
    if (defaultAccountId === accountId) {
      return {
        source: 'correctDefault',
        credentials: await this.defaultCredentialProvider,
      };
    }

    // Then try the plugins
    const pluginCreds = await this.plugins.fetchCredentialsFor(accountId, mode);
    if (pluginCreds) {
      return { source: 'plugin', ...pluginCreds };
    }

    // Fall back to default credentials with a note that they're not the right ones yet
    if (defaultAccountId !== undefined) {
      return {
        source: 'incorrectDefault',
        accountId: defaultAccountId,
        credentials: await this.defaultCredentialProvider,
        unusedPlugins: this.plugins.availablePluginNames,
      };
    }

    // Apparently we didn't find any at all
    return {
      source: 'none',
      unusedPlugins: this.plugins.availablePluginNames,
    };
  }

  /**
   * Return an SDK which uses assumed role credentials
   *
   * The base credentials used to retrieve the assumed role credentials will be the
   * same credentials returned by obtainCredentials if an environment and mode is passed,
   * otherwise it will be the current credentials.
   */
  private async withAssumedRole(
    mainCredentials: Exclude<ObtainBaseCredentialsResult, { source: 'none' }>,
    roleArn: string,
    externalId?: string,
    additionalOptions?: AssumeRoleAdditionalOptions,
    region?: string,
  ): Promise<SDK> {
    debug(`Assuming role '${roleArn}'.`);

    region = region ?? this.defaultRegion;

    const sourceDescription = fmtObtainedCredentials(mainCredentials);

    try {
      const credentials = await makeCachingProvider(fromTemporaryCredentials({
        masterCredentials: mainCredentials.credentials,
        params: {
          RoleArn: roleArn,
          ExternalId: externalId,
          RoleSessionName: `aws-cdk-${safeUsername()}`,
          ...additionalOptions,
          TransitiveTagKeys: additionalOptions?.Tags ? additionalOptions.Tags.map((t) => t.Key!) : undefined,
        },
        clientConfig: {
          region,
          requestHandler: this.requestHandler,
          customUserAgent: 'aws-cdk',
          logger: this.logger,
        },
        logger: this.logger,
      }));

      // Call the provider at least once here, to catch an error if it occurs
      await credentials();

      return new SDK(credentials, region, this.requestHandler, this.logger);
    } catch (err: any) {
      if (err.name === 'ExpiredToken') {
        throw err;
      }

      debug(`Assuming role failed: ${err.message}`);
      throw new AuthenticationError(
        [
          'Could not assume role in target account',
          ...(sourceDescription ? [`using ${sourceDescription}`] : []),
          err.message,
          ". Please make sure that this role exists in the account. If it doesn't exist, (re)-bootstrap the environment " +
            "with the right '--trust', using the latest version of the CDK CLI.",
        ].join(' '),
      );
    }
  }
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

/**
 * Return the username with characters invalid for a RoleSessionName removed
 *
 * @see https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html#API_AssumeRole_RequestParameters
 */
function safeUsername() {
  try {
    return os.userInfo().username.replace(/[^\w+=,.@-]/g, '@');
  } catch {
    return 'noname';
  }
}

/**
 * Options for obtaining credentials for an environment
 */
export interface CredentialsOptions {
  /**
   * The ARN of the role that needs to be assumed, if any
   */
  readonly assumeRoleArn?: string;

  /**
   * External ID required to assume the given role.
   */
  readonly assumeRoleExternalId?: string;

  /**
   * Session tags required to assume the given role.
   */
  readonly assumeRoleAdditionalOptions?: AssumeRoleAdditionalOptions;
}

/**
 * Result of obtaining base credentials
 */
type ObtainBaseCredentialsResult =
  | { source: 'correctDefault'; credentials: AwsCredentialIdentityProvider }
  | { source: 'plugin'; pluginName: string; credentials: AwsCredentialIdentityProvider }
  | {
    source: 'incorrectDefault';
    credentials: AwsCredentialIdentityProvider;
    accountId: string;
    unusedPlugins: string[];
  }
  | { source: 'none'; unusedPlugins: string[] };

/**
 * Isolating the code that translates calculation errors into human error messages
 *
 * We cover the following cases:
 *
 * - No credentials are available at all
 * - Default credentials are for the wrong account
 */
function fmtObtainCredentialsError(
  targetAccountId: string,
  obtainResult: ObtainBaseCredentialsResult & {
    source: 'none' | 'incorrectDefault';
  },
): string {
  const msg = [`Need to perform AWS calls for account ${targetAccountId}`];
  switch (obtainResult.source) {
    case 'incorrectDefault':
      msg.push(`but the current credentials are for ${obtainResult.accountId}`);
      break;
    case 'none':
      msg.push('but no credentials have been configured');
  }
  if (obtainResult.unusedPlugins.length > 0) {
    msg.push(`and none of these plugins found any: ${obtainResult.unusedPlugins.join(', ')}`);
  }
  return msg.join(', ');
}

/**
 * Format a message indicating where we got base credentials for the assume role
 *
 * We cover the following cases:
 *
 * - Default credentials for the right account
 * - Default credentials for the wrong account
 * - Credentials returned from a plugin
 */
function fmtObtainedCredentials(obtainResult: Exclude<ObtainBaseCredentialsResult, { source: 'none' }>): string {
  switch (obtainResult.source) {
    case 'correctDefault':
      return 'current credentials';
    case 'plugin':
      return `credentials returned by plugin '${obtainResult.pluginName}'`;
    case 'incorrectDefault':
      const msg = [];
      msg.push(`current credentials (which are for account ${obtainResult.accountId}`);

      if (obtainResult.unusedPlugins.length > 0) {
        msg.push(`, and none of the following plugins provided credentials: ${obtainResult.unusedPlugins.join(', ')}`);
      }
      msg.push(')');

      return msg.join('');
  }
}

/**
 * Instantiate an SDK for context providers. This function ensures that all
 * lookup assume role options are used when context providers perform lookups.
 */
export async function initContextProviderSdk(aws: SdkProvider, options: ContextLookupRoleOptions): Promise<SDK> {
  const account = options.account;
  const region = options.region;

  const creds: CredentialsOptions = {
    assumeRoleArn: options.lookupRoleArn,
    assumeRoleExternalId: options.lookupRoleExternalId,
    assumeRoleAdditionalOptions: options.assumeRoleAdditionalOptions,
  };

  return (await aws.forEnvironment(EnvironmentUtils.make(account, region), Mode.ForReading, creds)).sdk;
}
