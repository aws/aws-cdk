/**
 * The basic contract for plug-ins to adhere to::
 *
 * ```ts
 * import { CustomCredentialProviderSource, IPluginHost, Plugin } from '@aws-cdk/cli-plugin-contract';
 *
 * export default class FooCDKPlugIn implements Plugin {
 *   public readonly version = '1';
 *
 *   public init(host: IPluginHost) {
 *     host.registerCredentialProviderSource(new CustomCredentialProviderSource());
 *   }
 * }
 * ```
 */
export interface Plugin {
  /**
   * The version of the plug-in interface used by the plug-in. This will be used by
   * the plug-in host to handle version changes.
   */
  version: '1';

  /**
   * When defined, this function is invoked right after the plug-in has been loaded,
   * so that the plug-in is able to initialize itself. It may call methods of the
   * `CredentialProviderSourceRepository` instance it receives to register new
   * `CredentialProviderSource` instances.
   */
  init?: (host: IPluginHost) => void;
}

/**
 * Indicates that we want to query read-only credentials
 *
 * This type definition replaces the legacy `Mode.ForReading` enum value. We
 * don't want to use that enum definition anymore, because it requires run-time
 * code and we want this library to be a types-only package with no runtime
 * implications.
 *
 * By all rights this should have been a string (`'for-reading'`), but due to
 * legacy reasons this is now an integer value.
 *
 * Use as follows:
 *
 * ```ts
 * 0 satisfies ForReading
 * ```
 *
 * If this bothers you a lot, you can copy/paste the following into your own
 * plugin codebase:
 *
 * ```ts
 * enum Mode {
 *   ForReading = 0,
 *   ForWriting = 1,
 * }
 * ```
 */
export type ForReading = 0;

/**
 * Indicates that we want to query for read-write credentials
 *
 * This type definition replaces the legacy `Mode.ForWriting` enum value. We
 * don't want to use that enum definition anymore, because it requires run-time
 * code and we want this library to be a types-only package with no runtime
 * implications.
 *
 * By all rights this should have been a string (`'for-writing'`), but due to
 * legacy reasons this is now an integer value.
 *
 * Use as follows:
 *
 * ```ts
 * 1 satisfies ForWriting
 * ```
 *
 * If this bothers you a lot, you can copy/paste the following into your own
 * plugin codebase:
 *
 * ```ts
 * enum Mode {
 *   ForReading = 0,
 *   ForWriting = 1,
 * }
 * ```
 */
export type ForWriting = 1;

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
  getProvider(accountId: string, mode: ForReading | ForWriting, options?: PluginProviderOptions): Promise<PluginProviderResult>;
}

/**
 * A list of credential provider sources
 */
export interface IPluginHost {

  /**
   * Registers a credential provider source. If, in the authentication process,
   * the CLI decides to try credentials from the plugins, it will go through the
   * sources registered in this way, in the same order as they were registered.
   */
  registerCredentialProviderSource(source: CredentialProviderSource): void;
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
   * Time when credentials should be considered expired.
   * Used in conjunction with expired.
   */
  expireTime?: Date | null;

  /**
   * AWS secret access key.
   */
  secretAccessKey: string;

  /**
   * AWS session token.
   */
  sessionToken?: string;

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
