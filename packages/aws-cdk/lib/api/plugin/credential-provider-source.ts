export enum Mode {
  ForReading,
  ForWriting,
}

/**
 */
export interface CredentialProviderSource {
  name: string;

  /**
   * Whether the credential provider is even online
   *
   * Guaranteed to be called before any of the other functions are called.
   */
  isAvailable(): Promise<boolean>;

  /**
   * Whether the credential provider can provide credentials for the given account.
   */
  canProvideCredentials(accountId: string): Promise<boolean>;

  /**
   * Construct a credential provider for the given account and the given access mode
   *
   * Guaranteed to be called only if canProvideCredentails() returned true at some point.
   *
   * While it is possible for the plugin to return a static set of credentials, it is
   * recommended to return a provider.
   */
  getProvider(accountId: string, mode: Mode, options?: PluginProviderOptions): Promise<PluginProviderResult>;
}

/**
 * Options for the `getProvider()` function of a CredentialProviderSource
 */
export interface PluginProviderOptions {
  /**
   * Whether or not this implementation of the CLI will recognize the `SDKv3CompatibleCredentialProvider` return variant
   *
   * Unless otherwise indicated, the CLI version will only support SDKv3
   * credentials, not SDKv3 providers. You should avoid returning types that the
   * consuming CLI will not understand, because it will most likely crash.
   *
   * @default false
   */
  readonly supportsV3Providers?: boolean;
}

export type PluginProviderResult = SDKv2CompatibleCredentials | SDKv3CompatibleCredentialProvider | SDKv3CompatibleCredentials;

/**
 * SDKv2-compatible credential provider.
 *
 * Based on the `Credentials` class in SDKv2. This object is a set of credentials
 * and a credential provider in one (it is a set of credentials that remember
 * where they came from and can refresh themselves).
 */
export interface SDKv2CompatibleCredentials {
  /**
   * AWS access key ID.
   */
  accessKeyId: string;
  /**
    * Whether the credentials have been expired and require a refresh.
    * Used in conjunction with expireTime.
    */
  expired: boolean;
  /**
    * Time when credentials should be considered expired.
    * Used in conjunction with expired.
    */
  expireTime: Date;
  /**
    * AWS secret access key.
    */
  secretAccessKey: string;
  /**
    * AWS session token.
    */
  sessionToken: string;

  /**
   * Gets the existing credentials, refreshing them if necessary, and returns
   * a promise that will be fulfilled immediately (if no refresh is necessary)
   * or when the refresh has completed.
   */
  getPromise(): Promise<void>;
}

/**
 * Provider for credentials
 *
 * Based on the `AwsCredentialIdentityProvider` type from SDKv3. This type
 * is only a credential factory. It may or may not be cached; that is,
 * calling the provider twice may do 2 API requests, or it may do one
 * if the result from the first call can be reused.
 */
export type SDKv3CompatibleCredentialProvider = (identityProperties?: Record<string, any>) => Promise<SDKv3CompatibleCredentials>;

/**
 * Based on the `AwsCredentialIdentity` type from SDKv3.
 *
 * This is a static set of credentials.
 */
export interface SDKv3CompatibleCredentials {
  /**
   * AWS access key ID
   */
  readonly accessKeyId: string;
  /**
   * AWS secret access key
   */
  readonly secretAccessKey: string;
  /**
   * A security or session token to use with these credentials. Usually
   * present for temporary credentials.
   */
  readonly sessionToken?: string;
  /**
   * A `Date` when the identity or credential will no longer be accepted.
   */
  readonly expiration?: Date;
}