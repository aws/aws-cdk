import * as aws from 'aws-sdk';

export enum Mode {
  ForReading,
  ForWriting
}

/**
 * @experimental
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
  getProvider(accountId: string, mode: Mode): Promise<aws.Credentials>;
}
