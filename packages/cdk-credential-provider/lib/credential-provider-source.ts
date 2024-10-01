import { AwsCredentialIdentityProvider, AwsCredentialIdentity } from '@smithy/types';

// TODO (v3 migration): Rename
export interface CdkCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;

  getPromise(): Promise<void>;
}

/**
 * This class provides a layer of backwards compatibility with the SDK v2. In v2,
 * the `AWS.Credentials` class is both a container and a provider of credentials.
 * To read the credentials off of it, you use properties such as `accessKeyId`,
 * and if you want to refresh the credentials, we use the `getPromise()` method
 * (although other methods with slightly different semantics are available).
 *
 * In v3, these concepts were split into `AwsCredentialIdentity` (the container)
 * and `AwsCredentialIdentityProvider`. This class wraps an
 * `AwsCredentialIdentityProvider` and offers the same behavior as
 * `AWS.Credentials` did, via accessors and an implementation of `getPromise()`
 * that respects the expiration time of the previously acquired credentials.
 */
class CredentialIdentityProviderAdapter implements CdkCredentials {
  private _accessKeyId?: string;
  private _secretAccessKey?: string;
  private _sessionToken?: string;
  private nextExpiration?: Date;

  constructor(private readonly provider: AwsCredentialIdentityProvider) {}

  async getPromise(): Promise<void> {
    if (this.nextExpiration == null || new Date() > this.nextExpiration) {
      const identity: AwsCredentialIdentity = await this.provider();
      this.nextExpiration = identity.expiration;
      this._accessKeyId = identity.accessKeyId;
      this._secretAccessKey = identity.secretAccessKey;
      this._sessionToken = identity.sessionToken;
    }
  }

  get accessKeyId(): string {
    return this._accessKeyId!;
  }

  get sessionToken(): string | undefined {
    return this._sessionToken;
  }

  get secretAccessKey(): string {
    return this._secretAccessKey!;
  }
}

export enum Mode {
  ForReading,
  ForWriting,
}

/**
 * Produces an instance of `CdkCredentials` from an `AwsCredentialIdentityProvider`.
 * This is a utility function to be used by plugin writers using AWS SDK v3.
 */
export function fromAwsCredentialIdentityProvider(provider: AwsCredentialIdentityProvider): CdkCredentials {
  return new CredentialIdentityProviderAdapter(provider);
}

/**
 * Produces an instance of `AwsCredentialIdentityProvider` from a `CdkCredentials`.
 * This utility function is intended to be used internally by the CLI.
 */
export function toAwsCredentialIdentityProvider(creds: CdkCredentials): AwsCredentialIdentityProvider {
  return () => Promise.resolve({
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    sessionToken: creds.sessionToken,
  });
}

export interface CredentialProviderRegistry {
  registerCredentialProviderSource(source: CredentialProviderSource): void;
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
  getProvider(accountId: string, mode: Mode): Promise<CdkCredentials>;
}
