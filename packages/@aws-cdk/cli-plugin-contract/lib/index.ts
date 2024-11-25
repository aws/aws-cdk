/**
 * The basic contract for plug-ins to adhere to::
 *
 *   import { CustomCredentialProviderSource, CredentialProviderSourceRepository, Plugin } from '@aws-cdk/cli-plugin-contract';
 *
 *   export default class FooCDKPlugIn implements Plugin {
 *     public readonly version = '1';
 *
 *     public init(host: CredentialProviderSourceRepository) {
 *       host.registerCredentialProviderSource(new CustomCredentialProviderSource());
 *     }
 *   }
 *
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
  init?: (host: CredentialProviderSourceRepository) => void;
}

export interface AwsCredentials {
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
   * AWS credential scope for this set of credentials.
   */
  readonly credentialScope?: string;
  /**
   * AWS accountId.
   */
  readonly accountId?: string;

  /**
   * Refreshes the current credentials. This function only exists for
   * legacy reasons, to be compatible with the `AWS.Credentials` class.
   * Plugins that use the AWS SDK v3 don't need this.
   */
  getPromise?: () => Promise<void>;
}

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
   */
  getProvider(accountId: string, mode: Mode): Promise<AwsCredentials>;
}

/**
 * A list of credential provider sources
 */
export interface CredentialProviderSourceRepository {

  /**
   * Registers a credential provider source. If, in the authentication process,
   * the CLI decides to try credentials from the plugins, it will go through the
   * sources registered in this way, in the same order as they were registered.
   */
  registerCredentialProviderSource(source: CredentialProviderSource): void;
}
