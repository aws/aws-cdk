/**
 * Define an EncryptionConfiguration
 */
export interface EncryptionConfiguration {
  /**
   * Identifier for KMS key, which can in the format of key ARN, key ID, alias ARN or alias name
   * @default - no kmsKeyId is associated
   */
  readonly kmsKeyId?: string;
  /**
   * Maximum duration for which SFN will reuse data keys. When the period expires,
   * SFN will call GenerateDataKey. This setting only applies to customer managed KMS key and does not apply to AWS owned KMS key.
   * @default - 300s
   */
  readonly kmsDataKeyReusePeriodSeconds?: number;
  /**
   * The encryption option specified for the state machine
   * @default - AWS_OWNED_KEY
   */
  readonly type: EncryptionType;
}
/**
 * Define an EncryptionType
 */
export enum EncryptionType {
/**
 * SFN owned key
 */
  AWS_OWNED_KEY = 'AWS_OWNED_KEY',
  /**
 * Customer managed key
 */
  CUSTOMER_MANAGED_KMS_KEY = 'CUSTOMER_MANAGED_KMS_KEY',
}