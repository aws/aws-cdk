import { Type, ExternalModule } from '@cdklabs/typewriter';

class MixinsCore extends ExternalModule {
  public readonly IMixin = Type.fromName(this, 'IMixin');
  public readonly Mixin = Type.fromName(this, 'Mixin');
}

class MixinsKms extends ExternalModule {
  public readonly IKey = Type.fromName(this, 'IKey');
}

export const MIXINS_CORE = new MixinsCore('@aws-cdk/mixins-preview/core');
export const MIXINS_KMS = new MixinsKms('aws-cdk-lib/aws-kms');

/**
 * Property purpose from the encryption-at-rest data
 */
export type PropertyPurpose = 'enable-flag' | 'kms-key-id' | 'encryption-type' | 'configuration';

/**
 * A single encryption property definition
 */
export interface EncryptionProperty {
  readonly name: string;
  readonly path?: string;
  readonly type: string;
  readonly required: boolean;
  readonly purpose: PropertyPurpose;
  readonly keyTypeValues?: {
    readonly customerManaged?: string | boolean;
    readonly awsManaged?: string | boolean;
  };
  readonly context?: string;
}

/**
 * Encryption configuration for a CloudFormation resource
 */
export interface EncryptionResourceConfig {
  readonly properties: EncryptionProperty[];
  readonly defaultBehavior: string;
  readonly notes: string;
}

/**
 * The full encryption-at-rest data structure
 */
export type EncryptionAtRestData = Record<string, EncryptionResourceConfig>;
