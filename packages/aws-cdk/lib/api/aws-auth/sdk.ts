import * as AWS from 'aws-sdk';
import { ConfigurationOptions } from 'aws-sdk/lib/config';
import { debug } from '../../logging';
import { cached } from '../../util/functions';
import { AccountAccessKeyCache } from './account-cache';
import { Account } from './sdk-provider';

/** @experimental */
export interface ISDK {
  /**
   * The region this SDK has been instantiated for
   *
   * (As distinct from the `defaultRegion()` on SdkProvider which
   * represents the region configured in the default config).
   */
  readonly currentRegion: string;

  /**
   * The Account this SDK has been instantiated for
   *
   * (As distinct from the `defaultAccount()` on SdkProvider which
   * represents the account available by using default credentials).
   */
  currentAccount(): Promise<Account>;

  cloudFormation(): AWS.CloudFormation;
  ec2(): AWS.EC2;
  ssm(): AWS.SSM;
  s3(): AWS.S3;
  route53(): AWS.Route53;
  ecr(): AWS.ECR;
}

/**
 * Base functionality of SDK without credential fetching
 */
export class SDK implements ISDK {
  private static readonly accountCache = new AccountAccessKeyCache();

  public readonly currentRegion: string;

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

  constructor(private readonly credentials: AWS.Credentials, region: string, httpOptions: ConfigurationOptions = {}) {
    this.config = {
      ...httpOptions,
      ...this.retryOptions,
      credentials,
      region,
    };
    this.currentRegion = region;
  }

  public cloudFormation(): AWS.CloudFormation {
    return logFailingCalls(new AWS.CloudFormation(this.config));
  }

  public ec2(): AWS.EC2 {
    return logFailingCalls(new AWS.EC2(this.config));
  }

  public ssm(): AWS.SSM {
    return logFailingCalls(new AWS.SSM(this.config));
  }

  public s3(): AWS.S3 {
    return logFailingCalls(new AWS.S3(this.config));
  }

  public route53(): AWS.Route53 {
    return logFailingCalls(new AWS.Route53(this.config));
  }

  public ecr(): AWS.ECR {
    return logFailingCalls(new AWS.ECR(this.config));
  }

  public async currentAccount(): Promise<Account> {
    return cached(this, CURRENT_ACCOUNT_KEY, () => SDK.accountCache.fetch(this.credentials.accessKeyId, async () => {
      // if we don't have one, resolve from STS and store in cache.
      debug('Looking up default account ID from STS');
      const result = await new AWS.STS(this.config).getCallerIdentity().promise();
      const accountId = result.Account;
      const partition = result.Arn!.split(':')[1];
      if (!accountId) {
        throw new Error('STS didn\'t return an account ID');
      }
      debug('Default account ID:', accountId);
      return { accountId, partition };
    }));
  }
}

/**
 * Return a wrapping object for the underlying service object
 *
 * Monitor all calls and log the ones that failed. This is slightly more
 * complicated than necessary because we must hook into the `promise()` method
 * of the object that's being returned from the methods of the object that we
 * wrap.
 */
function logFailingCalls<A extends object>(service: A): A {
  return new Proxy(service, {
    get(obj: A, prop: string) {
      const real = (obj as any)[prop];
      // Only intercept methods, and not the 'makeRequest' method or the
      // 'constructor' field (which points to a function but one that I don't wanna replace).
      if (!obj.hasOwnProperty(prop) || !isFunction(real)) { return real; }

      // NOTE: This must be a function() and not an () => {
      // because I need 'this' to be dynamically bound and not statically bound.
      // If your linter complains don't listen to it!
      return function(this: any) {
        // Call the underlying function. If it returns an object with a promise()
        // method on it, wrap that 'promise' method.
        const args = [].slice.call(arguments, 0);
        const response = real.apply(this, args);
        if (typeof response !== 'object' || !response) { return response; }
        if (!('promise' in response)) { return response; }

        const ret = Object.create(response);
        ret.promise = () => {
          return response.promise().catch((e: Error) => {
            debug(`Call failed: ${prop}(${JSON.stringify(args[0])}) => ${e.message}`);
            return Promise.reject(e); // Re-'throw' the error
          });
        };
        return ret;
      };
    },
  });
}

const CURRENT_ACCOUNT_KEY = Symbol('current_account_key');

function isFunction(x: any): x is (...args: any[]) => any {
  return x && {}.toString.call(x) === '[object Function]';
}