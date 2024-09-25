import { AwsCredentialIdentityProvider, AwsCredentialIdentity } from '@smithy/types';

// TODO (v3 migration): Rename
export interface CdkCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;

  getPromise(): Promise<void>;
}

// TODO (v3 migration): rename
class CdkCredentialsImpl implements CdkCredentials {
  private _accessKeyId: string;
  private _secretAccessKey: string;
  private _sessionToken?: string;

  constructor(private readonly provider: AwsCredentialIdentityProvider, identity: AwsCredentialIdentity) {
    this._accessKeyId = identity.accessKeyId;
    this._secretAccessKey = identity.secretAccessKey;
    this._sessionToken = identity.sessionToken;
  }

  async getPromise(): Promise<void> {
    const identity: AwsCredentialIdentity = await this.provider();
    this._accessKeyId = identity.accessKeyId;
  }

  get accessKeyId(): string {
    return this._accessKeyId;
  }

  get sessionToken(): string | undefined {
    return this._sessionToken;
  }

  get secretAccessKey(): string {
    return this._secretAccessKey;
  }
}

export enum Mode {
  ForReading,
  ForWriting,
}

export async function fromAwsCredentialIdentityProvider(provider: AwsCredentialIdentityProvider): Promise<CdkCredentials> {
  const identity: AwsCredentialIdentity = await provider();
  return new CdkCredentialsImpl(provider, identity);
}

export function toAwsCredentialIdentity(creds: CdkCredentials): AwsCredentialIdentity {
  return {
    accessKeyId: creds.accessKeyId,
    secretAccessKey: creds.secretAccessKey,
    sessionToken: creds.sessionToken,
  };
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
