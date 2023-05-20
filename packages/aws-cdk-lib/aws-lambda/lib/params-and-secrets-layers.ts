import { Duration } from '../../core';

/**
 * Logging levels for Parameters and Secrets Extension
 */
export enum ParamsAndSecretsLogLevels {
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
 * Configuration options for Parameters and Secrets Extension
 */
export interface ParamsAndSecretsConfig {
  /**
   * Enables Parameters and Secrets Extension to cache parameters and secrets
   *
   * @default true
   */
  readonly paramsAndSecretsCacheEnabled?: boolean;

  /**
   * The maximum number of secrets and parameters to cache. Must be a value from
   * 0 to 1000. A value of 0 means there is no caching.
   *
   * Note: This is ignored if both parameterStoreTtl and secretsManagerTtl are 0.
   *
   * @default 1000
   */
  readonly paramsAndSecretsCacheSize?: number;

  /**
   * The port for the local HTTP server.
   *
   * @default 2773
   */
  readonly paramsAndSecretsHttpPort?: number;

  /**
   * The level of logging for the Parameters and Secrets Extension to provide.
   *
   * @default - no logging
   */
  readonly paramsAndSecretsLogLevel?: ParamsAndSecretsLogLevels;

  /**
   * The maximum number of connections for HTTP clients that the Parameters and Secrets
   * Extension uses to make requests to Parameter Store or Secrets Manager. This is a
   * per-client configuration
   *
   * @default 3
   */
  readonly paramsAndSecretsMaxConnections?: number;

  /**
   * Timeout for request to Secrets Manager in milliseconds. A value of 0 means there is
   * no timeout.
   *
   * @default 0
   */
  readonly secretsManagerTimeout?: Duration;

  /**
   * The time to live of a secret in the cache in seconds. A value of 0 means there is no
   * caching. The maximum is 300 seconds.
   *
   * @default 300
   */
  readonly secretsManagerTtl?: Duration;

  /**
   * Timeout for requests to Parameter Store in milliseconds. A value of 0 means there is
   * no timeout.
   *
   * @default 0
   */
  readonly parameterStoreTimeout?: Duration;

  /**
   * The time to live of a parameter in the cache in seconds. A value of 0 means there is
   * no caching. The maximum is 300 seconds.
   *
   * Note: This is ignored if paramsAndSecretsCacheSize is 0.
   *
   * @default 300
   */
  readonly parameterStoreTtl?: Duration;
}

export class ParamsAndSecretsLayer {
  public static fromParamsAndSecretsConfig(config: ParamsAndSecretsConfig = {}): ParamsAndSecretsLayer {
    return new ParamsAndSecretsLayer(config);
  }

  public static _bind(): void {

  }

  private constructor(private readonly config: ParamsAndSecretsConfig) {}
}
