import { AppSyncClient } from '@aws-sdk/client-appsync';
import { CloudFormationClient } from '@aws-sdk/client-cloudformation';
import { CloudWatchLogsClient } from '@aws-sdk/client-cloudwatch-logs';
import { CodeBuildClient } from '@aws-sdk/client-codebuild';
import { EC2Client } from '@aws-sdk/client-ec2';
import { ECRClient } from '@aws-sdk/client-ecr';
import { ECSClient } from '@aws-sdk/client-ecs';
import { ElasticLoadBalancingV2Client } from '@aws-sdk/client-elastic-load-balancing-v2';
import { IAMClient } from '@aws-sdk/client-iam';
import { KMSClient } from '@aws-sdk/client-kms';
import { LambdaClient } from '@aws-sdk/client-lambda';
import { Route53Client } from '@aws-sdk/client-route-53';
import { S3Client } from '@aws-sdk/client-s3';
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager';
import { SFNClient } from '@aws-sdk/client-sfn';
import { SSMClient } from '@aws-sdk/client-ssm';
import { GetCallerIdentityCommand, STSClient } from '@aws-sdk/client-sts';
import type { NodeHttpHandlerOptions } from '@smithy/node-http-handler';

import { AwsCredentialIdentity } from '@smithy/types';
import { ConfiguredRetryStrategy } from '@smithy/util-retry';
import { AccountAccessKeyCache } from './account-cache';
import { cached } from './cached';
import { Account } from './sdk-provider';
import { defaultCliUserAgent } from './user-agent';
import { debug } from '../../logging';
import { traceMethods } from '../../util/tracing';

export interface ISDK {
  /**
   * The region this SDK has been instantiated for
   *
   * (As distinct from the `defaultRegion()` on SdkProvider which
   * represents the region configured in the default config).
   */
  readonly currentRegion: string;

  readonly didAssumeRole: boolean;

  /**
   * The Account this SDK has been instantiated for
   *
   * (As distinct from the `defaultAccount()` on SdkProvider which
   * represents the account available by using default credentials).
   */
  currentAccount(): Promise<Account>;

  /**
   * Appends the given string as the extra information to put into the User-Agent header for any requests invoked by this SDK.
   * If the string is 'undefined', this method has no effect.
   */
  appendCustomUserAgent(userAgentData?: string): void;

  /**
   * Removes the given string from the extra User-Agent header data used for requests invoked by this SDK.
   */
  removeCustomUserAgent(userAgentData: string): void;

  lambda(): LambdaClient;
  cloudFormation(): CloudFormationClient;
  ec2(): EC2Client;
  iam(): IAMClient;
  ssm(): SSMClient;
  s3(): S3Client;
  route53(): Route53Client;
  ecr(): ECRClient;
  ecs(): ECSClient;
  elbv2(): ElasticLoadBalancingV2Client;
  secretsManager(): SecretsManagerClient;
  kms(): KMSClient;
  stepFunctions(): SFNClient;
  codeBuild(): CodeBuildClient;
  cloudWatchLogs(): CloudWatchLogsClient;
  appsync(): AppSyncClient;
}

/**
 * Additional SDK configuration options
 */
export interface SdkOptions {
  /**
   * Additional descriptive strings that indicate where the "AssumeRole" credentials are coming from
   *
   * Will be printed in an error message to help users diagnose auth problems.
   */
  readonly assumeRoleCredentialsSourceDescription?: string;
}

export interface ConfigurationOptions {
  region: string;
  credentials: AwsCredentialIdentity;
  requestHandler: NodeHttpHandlerOptions;
  retryStrategy: ConfiguredRetryStrategy;
  customUserAgent: string;
}

/**
 * Base functionality of SDK without credential fetching
 */
@traceMethods
export class SDK implements ISDK {
  private static readonly accountCache = new AccountAccessKeyCache();

  public readonly currentRegion: string;

  private readonly config: ConfigurationOptions;

  /**
   * STS is used to check credential validity, don't do too many retries.
   */
  private readonly stsRetryOptions = {
    maxRetries: 3,
    retryDelayOptions: { base: 100 },
  };

  /**
   * Whether we have proof that the credentials have not expired
   *
   * We need to do some manual plumbing around this because the JS SDKv2 treats `ExpiredToken`
   * as retriable and we have hefty retries on CFN calls making the CLI hang for a good 15 minutes
   * if the credentials have expired.
   */
  private _credentialsValidated = false;

  constructor(
    private readonly _credentials: AwsCredentialIdentity,
    region: string,
    requestHandler: NodeHttpHandlerOptions,
    private readonly sdkOptions: SdkOptions = {},
    public didAssumeRole: boolean = false,
  ) {
    this.config = {
      region,
      credentials: _credentials,
      requestHandler,
      retryStrategy: new ConfiguredRetryStrategy(7, (attempt) => attempt ** 300),
      customUserAgent: defaultCliUserAgent(),
    };
    this.currentRegion = region;
    this.didAssumeRole = didAssumeRole;
  }

  public appendCustomUserAgent(userAgentData?: string): void {
    if (!userAgentData) {
      return;
    }

    const currentCustomUserAgent = this.config.customUserAgent;
    this.config.customUserAgent = currentCustomUserAgent ? `${currentCustomUserAgent} ${userAgentData}` : userAgentData;
  }

  public removeCustomUserAgent(userAgentData: string): void {
    this.config.customUserAgent = this.config.customUserAgent?.replace(userAgentData, '');
  }

  public lambda(): LambdaClient {
    return this.wrapServiceErrorHandling(new LambdaClient(this.config));
  }

  public cloudFormation() {
    return this.wrapServiceErrorHandling(
      new CloudFormationClient({
        ...this.config,
        retryStrategy: new ConfiguredRetryStrategy(11, (attempt: number) => attempt ** 1000),
      }),
    );
  }

  public ec2(): EC2Client {
    return this.wrapServiceErrorHandling(new EC2Client(this.config));
  }

  public iam(): IAMClient {
    return this.wrapServiceErrorHandling(new IAMClient(this.config));
  }

  public ssm(): SSMClient {
    return this.wrapServiceErrorHandling(new SSMClient(this.config));
  }

  public s3(): S3Client {
    return this.wrapServiceErrorHandling(new S3Client(this.config));
  }

  public route53(): Route53Client {
    return this.wrapServiceErrorHandling(new Route53Client(this.config));
  }

  public ecr(): ECRClient {
    return this.wrapServiceErrorHandling(new ECRClient(this.config));
  }

  public ecs(): ECSClient {
    return this.wrapServiceErrorHandling(new ECSClient(this.config));
  }

  public elbv2(): ElasticLoadBalancingV2Client {
    return this.wrapServiceErrorHandling(new ElasticLoadBalancingV2Client(this.config));
  }

  public secretsManager(): SecretsManagerClient {
    return this.wrapServiceErrorHandling(new SecretsManagerClient(this.config));
  }

  public kms(): KMSClient {
    return this.wrapServiceErrorHandling(new KMSClient(this.config));
  }

  public stepFunctions(): SFNClient {
    return this.wrapServiceErrorHandling(new SFNClient(this.config));
  }

  public codeBuild(): CodeBuildClient {
    return this.wrapServiceErrorHandling(new CodeBuildClient(this.config));
  }

  public cloudWatchLogs(): CloudWatchLogsClient {
    return this.wrapServiceErrorHandling(new CloudWatchLogsClient(this.config));
  }

  public appsync(): AppSyncClient {
    return this.wrapServiceErrorHandling(new AppSyncClient(this.config));
  }

  public async currentAccount(): Promise<Account> {
    return cached(this, CURRENT_ACCOUNT_KEY, () =>
      SDK.accountCache.fetch(this._credentials.accessKeyId, async () => {
        // if we don't have one, resolve from STS and store in cache.
        debug('Looking up default account ID from STS');
        const client = new STSClient({
          ...this.config,
          ...this.stsRetryOptions,
        });
        const command = new GetCallerIdentityCommand();
        const result = await client.send(command);
        const accountId = result.Account;
        const partition = result.Arn!.split(':')[1];
        if (!accountId) {
          throw new Error("STS didn't return an account ID");
        }
        debug('Default account ID:', accountId);

        // Save another STS call later if this one already succeeded
        this._credentialsValidated = true;
        return { accountId, partition };
      }),
    );
  }

  /**
   * Make sure the the current credentials are not expired
   */
  public async validateCredentials() {
    if (this._credentialsValidated) {
      return;
    }

    const client = new STSClient({ ...this.config, ...this.stsRetryOptions });
    await client.send(new GetCallerIdentityCommand());
    this._credentialsValidated = true;
  }

  /**
   * Return a wrapping object for the underlying service object
   *
   * Responds to failures in the underlying service calls, in two different
   * ways:
   *
   * - When errors are encountered, log the failing call and the error that
   *   it triggered (at debug level). This is necessary because the lack of
   *   stack traces in NodeJS otherwise makes it very hard to suss out where
   *   a certain AWS error occurred.
   * - The JS SDK has a funny business of wrapping any credential-based error
   *   in a super-generic (and in our case wrong) exception. If we then use a
   *   'ChainableTemporaryCredentials' and the target role doesn't exist,
   *   the error message that shows up by default is super misleading
   *   (https://github.com/aws/aws-sdk-js/issues/3272). We can fix this because
   *   the exception contains the "inner exception", so we unwrap and throw
   *   the correct error ("cannot assume role").
   *
   * The wrapping business below is slightly more complicated than you'd think
   * because we must hook into the `promise()` method of the object that's being
   * returned from the methods of the object that we wrap, so there's two
   * levels of wrapping going on, and also some exceptions to the wrapping magic.
   */
  private wrapServiceErrorHandling<A extends object>(serviceObject: A): A {
    const classObject = serviceObject.constructor.prototype;
    const self = this;

    return new Proxy(serviceObject, {
      get(obj: A, prop: string) {
        const real = (obj as any)[prop];
        // Things we don't want to intercept:
        // - Anything that's not a function.
        // - 'constructor', s3.upload() will use this to do some magic and we need the underlying constructor.
        // - Any method that's not on the service class (do not intercept 'makeRequest' and other helpers).
        if (prop === 'constructor' || !classObject.hasOwnProperty(prop) || !isFunction(real)) {
          return real;
        }

        // NOTE: This must be a function() and not an () => {
        // because I need 'this' to be dynamically bound and not statically bound.
        // If your linter complains don't listen to it!
        return function (this: any) {
          // Call the underlying function. If it returns an object with a promise()
          // method on it, wrap that 'promise' method.
          const args = [].slice.call(arguments, 0);
          const response = real.apply(this, args);

          // Don't intercept unless the return value is an object with a '.promise()' method.
          if (typeof response !== 'object' || !response) {
            return response;
          }
          if (!('promise' in response)) {
            return response;
          }

          // Return an object with the promise method replaced with a wrapper which will
          // do additional things to errors.
          return Object.assign(Object.create(response), {
            promise() {
              return response.promise().catch((e: Error & { code?: string }) => {
                e = self.makeDetailedException(e);
                debug(`Call failed: ${prop}(${JSON.stringify(args[0])}) => ${e.message} (code=${e.name})`);
                return Promise.reject(e); // Re-'throw' the new error
              });
            },
          });
        };
      },
    });
  }

  /**
   * Extract a more detailed error out of a generic error if we can
   *
   * If this is an error about Assuming Roles, add in the context showing the
   * chain of credentials we used to try to assume the role.
   */
  private makeDetailedException(e: Error): Error {
    // This is the super-generic "something's wrong" error that the JS SDK wraps other errors in.
    // https://github.com/aws/aws-sdk-js/blob/f0ac2e53457c7512883d0677013eacaad6cd8a19/lib/event_listeners.js#L84
    if (typeof e.message === 'string' && e.message.startsWith('Missing credentials in config')) {
      const original = (e as any).originalError;
      if (original) {
        // When the SDK does a 'util.copy', they lose the Error-ness of the inner error
        // (they copy the Error's properties into a plain object) so make it an Error object again.
        e = Object.assign(new Error(), original);
      }
    }

    // At this point, the error might still be a generic "ChainableTemporaryCredentials failed"
    // error which wraps the REAL error (AssumeRole failed). We're going to replace the error
    // message with one that's more likely to help users, and tell them the most probable
    // fix (bootstrapping). The underlying service call failure will be appended below.
    if (e.message === 'Could not load credentials from ChainableTemporaryCredentials') {
      e.message = [
        'Could not assume role in target account',
        ...(this.sdkOptions.assumeRoleCredentialsSourceDescription
          ? [`using ${this.sdkOptions.assumeRoleCredentialsSourceDescription}`]
          : []),
        "(did you bootstrap the environment with the right '--trust's?)",
      ].join(' ');
    }

    // Replace the message on this error with a concatenation of all inner error messages.
    // Must more clear what's going on that way.
    e.message = allChainedExceptionMessages(e);
    return e;
  }
}

const CURRENT_ACCOUNT_KEY = Symbol('current_account_key');

function isFunction(x: any): x is (...args: any[]) => any {
  return x && {}.toString.call(x) === '[object Function]';
}

/**
 * Return the concatenated message of all exceptions in the AWS exception chain
 */
function allChainedExceptionMessages(e: Error | undefined) {
  const ret = new Array<string>();
  while (e) {
    ret.push(e.message);
    e = (e as any).originalError;
  }
  return ret.join(': ');
}

/**
 * Return whether an error should not be recovered from
 */
export function isUnrecoverableAwsError(e: Error) {
  return (e as any).code === 'ExpiredToken';
}
