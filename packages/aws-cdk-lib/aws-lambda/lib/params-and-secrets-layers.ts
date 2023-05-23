import { Construct, IConstruct } from 'constructs';
import { Architecture } from './architecture';
import { ISecret } from '../../aws-secretsmanager';
import { Token, Stack, Lazy, Duration } from '../../core';
import { RegionInfo, FactName } from '../../region-info';

/**
 * Config returned from `ParamsAndSecretsVersion._bind`
 */
interface ParamsAndSecretsBindConfig {
  /**
   * ARN of the Parameters and Secrets layer version
   */
  readonly arn: string;
}

/**
 * Logging levels for the Parametes and Secrets Extension layer
 */
export enum ParamsAndSecretsLogLevel {
  /**
   * Debug
   */
  DEBUG = 'debug',

  /**
   * Info
   */
  INFO = 'info',

  /**
   * Warn
   */
  WARN = 'warn',

  /**
   * Error
   */
  ERROR = 'error',

  /**
   * No logging
   */
  NONE = 'none',
}

/**
 * Parameters and Secrets Extension configuration options
 */
export interface ParamsAndSecretsOptions {
  /**
   * Whether the Parameters and Secrets Extension will cache parameters and
   * secrets.
   *
   * @default true
   */
  readonly cacheEnabled?: boolean;

  /**
   * The maximum number of secrets and parameters to cache. Must be a value
   * from 0 to 1000. A value of 0 means there is no caching.
   *
   * Note: This variable is ignored is parameterStoreTtl and secretsManagerTtl
   * are 0.
   *
   * @default 1000
   */
  readonly cacheSize?: number;

  /**
   * The port for the local HTTP server.
   *
   * @default 2773
   */
  readonly httpPort?: number;

  /**
   * The level of logging provided by the Parameters and Secrets Extension.
   *
   * Note: Set to debug to see the cache configuration.
   *
   * @default - Logging level will be `info`
   */
  readonly logLevel?: ParamsAndSecretsLogLevel;

  /**
   * The maximum number of connection for HTTP clients that the Parameters and
   * Secrets Extension uses to make requests to Parameter Store or Secrets
   * Manager.
   *
   * Note: This is a per-client configuration.
   *
   * @default 3
   */
  readonly maxConnections?: number;

  /**
   * The timeout for requests to Secrets Manager. A value of 0 means that there is
   * no timeout.
   *
   * @default 0
   */
  readonly secretsManagerTimeout?: Duration;

  /**
   * The time-to-live of a secret in the cache. A value of 0 means there is no caching.
   * The maximum time-to-live is 300 seconds.
   *
   * Note: This variable is ignored if cacheSize is 0.
   *
   * @default 300 seconds
   */
  readonly secretsManagerTtl?: Duration;

  /**
   * The timeout for requests to Parameter Store. A value of 0 means that there is no
   * timeout.
   *
   * @default 0
   */
  readonly parameterStoreTimeout?: Duration;

  /**
   * The time-to-live of a parameter in the cache. A value of 0 means there is no caching.
   * The maximum time-to-live is 300 seconds.
   *
   * Note: This variable is ignored if cacheSize is 0.
   *
   * @default 300 seconds
   */
  readonly parameterStoreTtl?: Duration;
}

/**
 * Parameters and Secrets Extension configuration
 */
export interface ParamsAndSecretsConfig {
  /**
   * The secret to grant the function access to
   *
   * TODO: Multiple secrets
   */
  readonly secret: ISecret;

  /**
   * The Parameters and Secrets Extension layer
   */
  readonly layerVersion: ParamsAndSecretsLayerVersion;

  /**
   * Configuration options for the Parameters and Secrets Extension layer
   */
  readonly options: ParamsAndSecretsOptions;
}

/**
 * Version of Parameters and Secrets Extension
 */
export abstract class ParamsAndSecretsLayerVersion {
  /**
   * Version for x86_64 architecture
   */
  public static readonly FOR_X86_64 = ParamsAndSecretsLayerVersion.fromArchitecture(Architecture.X86_64);

  /**
   * Version for ARM_64 architecture
   */
  public static readonly FOR_ARM_64 = ParamsAndSecretsLayerVersion.fromArchitecture(Architecture.ARM_64);

  /**
   * Use the Parameters and Secrets Extension associated with the provided ARN. Make sure the ARN is associated
   * with the same region as your function.
   *
   * @see https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html#retrieving-secrets_lambda_ARNs
   */
  public static fromVersionArn(arn: string): ParamsAndSecretsLayerVersion {
    class ParamsAndSecretsArn extends ParamsAndSecretsLayerVersion {
      public readonly layerVersionArn = arn;

      public _bind(_scope: Construct): ParamsAndSecretsBindConfig {
        return {
          arn,
        };
      }
    }

    return new ParamsAndSecretsArn();
  }

  /**
   * Use the architecture to build the object
   */
  private static fromArchitecture(architecture: Architecture): ParamsAndSecretsLayerVersion {
    class ParamsAndSecretsVersion extends ParamsAndSecretsLayerVersion {
      public readonly layerVersionArn = Lazy.uncachedString({
        produce: (context) => getVersionArn(context.scope, architecture.name),
      });

      public _bind(_scope: Construct): ParamsAndSecretsBindConfig {
        return {
          arn: getVersionArn(_scope, architecture.name),
        };
      }
    }

    return new ParamsAndSecretsVersion();
  }

  /**
   * The ARN of the Parameters and Secrets Extension lambda
   */
  public readonly layerVersionArn: string = '';

  /**
   * Returns the ARN of the Parameters and Secrets Extension
   *
   * @internal
   */
  public abstract _bind(_scope: Construct): ParamsAndSecretsBindConfig;
}

/**
 * Function to retrieve the correct Parameters and Secrets Extension Lambda ARN from RegionInfo,
 * or create a mapping to look it up at stack deployment time.
 *
 * This function is run on CDK synthesis.
 */
function getVersionArn(scope: IConstruct, architecture: string): string {
  const stack = Stack.of(scope);
  const region = stack.region;

  if (region !== undefined && !Token.isUnresolved(region)) {
    const layerArn = RegionInfo.get(region).paramsAndSecretsLambdaLayerArn(architecture);
    if (layerArn === undefined) {
      throw new Error(`Parameters and Secrets Extension is not supported in region ${region} for ${architecture} architecture`);
    }
    return layerArn;
  }

  return stack.regionalFact(FactName.paramsAndSecretsLambdaLayer(architecture));
}
