import { Construct, IConstruct } from 'constructs';
import { IFunction } from './function-base';
import { Token, Stack, Duration } from '../../core';
import { RegionInfo, FactName } from '../../region-info';

/**
 * Config returned from `ParamsAndSecretsVersion._bind`
 */
interface ParamsAndSecretsBindConfig {
  /**
   * ARN of the Parameters and Secrets layer version
   */
  readonly arn: string;

  /**
   * Environment variables for the Parameters and Secrets layer configuration
   */
  readonly environmentVars: { [key: string]: string };
}

/**
 * Parameters and Secrets Extension versions
 */
export enum ParamsAndSecretsVersions {
  /**
   * Version 1.0.103
   *
   * Note: This is the latest version
   */
  V1_0_103 = '1.0.103',
}

/**
 * Logging levels for the Parametes and Secrets Extension
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
   * Note: This variable is ignored if parameterStoreTtl and secretsManagerTtl
   * are 0.
   *
   * @default 1000
   */
  readonly cacheSize?: number;

  /**
   * The port for the local HTTP server. Valid port numbers are 1 - 65535.
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
   * Manager. There is no maximum limit. Minimum is 1.
   *
   * Note: Every running copy of this Lambda function may open the number of
   * connections specified by this property. Thus, the total number of connections
   * may exceed this number.
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
 * Parameters and Secrets Extension layer version
 */
export abstract class ParamsAndSecretsLayerVersion {
  /**
   * Use the Parameters and Secrets Extension associated with the provided ARN. Make sure the ARN is associated
   * with the same region and architecture as your function.
   *
   * @see https://docs.aws.amazon.com/secretsmanager/latest/userguide/retrieving-secrets_lambda.html#retrieving-secrets_lambda_ARNs
   */
  public static fromVersionArn(arn: string, options: ParamsAndSecretsOptions = {}): ParamsAndSecretsLayerVersion {
    return new (class extends ParamsAndSecretsLayerVersion {
      public _bind(_scope: Construct, _fn: IFunction): ParamsAndSecretsBindConfig {
        return {
          arn,
          environmentVars: this.environmentVariablesFromOptions,
        };
      }
    })(options);
  }

  /**
   * Use a specific version of the Parameters and Secrets Extension to generate a layer version.
   */
  public static fromVersion(version: ParamsAndSecretsVersions, options: ParamsAndSecretsOptions = {}): ParamsAndSecretsLayerVersion {
    return new (class extends ParamsAndSecretsLayerVersion {
      public _bind(scope: Construct, fn: IFunction): ParamsAndSecretsBindConfig {
        return {
          arn: this.getVersionArn(scope, version, fn.architecture.name),
          environmentVars: this.environmentVariablesFromOptions,
        };
      }
    })(options);
  }

  private constructor(private readonly options: ParamsAndSecretsOptions) {}

  /**
   * Returns the ARN of the Parameters and Secrets Extension
   *
   * @internal
   */
  public abstract _bind(scope: Construct, fn: IFunction): ParamsAndSecretsBindConfig;

  /**
   * Configure environment variables for Parameters and Secrets Extension based on configuration options
   */
  private get environmentVariablesFromOptions(): { [key: string]: any } {
    if (this.options.cacheSize !== undefined && (this.options.cacheSize < 0 || this.options.cacheSize > 1000)) {
      throw new Error(`Cache size must be between 0 and 1000 inclusive - provided: ${this.options.cacheSize}`);
    }

    if (this.options.httpPort !== undefined && (this.options.httpPort < 1 || this.options.httpPort > 65535)) {
      throw new Error(`HTTP port must be between 1 and 65535 inclusive - provided: ${this.options.httpPort}`);
    }

    // max connections has no maximum limit
    if (this.options.maxConnections !== undefined && this.options.maxConnections < 1) {
      throw new Error(`Maximum connections must be at least 1 - provided: ${this.options.maxConnections}`);
    }

    if (this.options.secretsManagerTtl !== undefined && this.options.secretsManagerTtl.toSeconds() > 300) {
      throw new Error(`Maximum TTL for a cached secret is 300 seconds - provided: ${this.options.secretsManagerTtl.toSeconds()} seconds`);
    }

    if (this.options.parameterStoreTtl !== undefined && this.options.parameterStoreTtl.toSeconds() > 300) {
      throw new Error(`Maximum TTL for a cached parameter is 300 seconds - provided: ${this.options.parameterStoreTtl.toSeconds()} seconds`);
    }

    return {
      PARAMETERS_SECRETS_EXTENSION_CACHE_ENABLED: this.options.cacheEnabled ?? true,
      PARAMETERS_SECRETS_EXTENSION_CACHE_SIZE: this.options.cacheSize ?? 1000,
      PARAMETERS_SECRETS_EXTENSION_HTTP_PORT: this.options.httpPort ?? 2773,
      PARAMETERS_SECRETS_EXTENSION_LOG_LEVEL: this.options.logLevel ?? ParamsAndSecretsLogLevel.INFO,
      PARAMETERS_SECRETS_EXTENSION_MAX_CONNECTIONS: this.options.maxConnections ?? 3,
      SECRETS_MANAGER_TIMEOUT_MILLIS: this.options.secretsManagerTimeout?.toMilliseconds() ?? 0,
      SECRETS_MANAGER_TTL: this.options.secretsManagerTtl?.toSeconds() ?? 300,
      SSM_PARAMETER_STORE_TIMEOUT_MILLIS: this.options.parameterStoreTimeout?.toMilliseconds() ?? 0,
      SSM_PARAMETER_STORE_TTL: this.options.parameterStoreTtl?.toSeconds() ?? 300,
    };
  }

  /**
   * Retrieve the correct Parameters and Secrets Extension Lambda ARN from RegionInfo,
   * or create a mapping to look it up at stack deployment time.
   *
   * This function is run on CDK synthesis.
   */
  private getVersionArn(scope: IConstruct, version: string, architecture: string): string {
    const stack = Stack.of(scope);
    const region = stack.region;

    // region is resolved - look it up directly from table
    if (region !== undefined && !Token.isUnresolved(region)) {
      const layerArn = RegionInfo.get(region).paramsAndSecretsLambdaLayerArn(version, architecture);
      if (layerArn === undefined) {
        throw new Error(`Parameters and Secrets Extension is not supported in region ${region} for ${architecture} architecture`);
      }
      return layerArn;
    }

    // region is unresolved - create mapping and look up during deployment
    return stack.regionalFact(FactName.paramsAndSecretsLambdaLayer(version, architecture));
  }
}
