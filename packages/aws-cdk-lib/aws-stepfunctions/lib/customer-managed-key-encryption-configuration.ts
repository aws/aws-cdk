import { EncryptionConfiguration } from './encryption-configuration';
import * as kms from '../../aws-kms';
import * as cdk from '../../core';

const CUSTOMER_MANAGED_KMS_KEY = 'CUSTOMER_MANAGED_KMS_KEY';
/**
 * Define a new CustomerManagedEncryptionConfiguration
 */
export class CustomerManagedEncryptionConfiguration extends EncryptionConfiguration {
  /**
   * The symmetric customer managed KMS key for server-side encryption of the state machine definition, and execution history or activity inputs.
   * Step Functions will reuse the key for a maximum of `kmsDataKeyReusePeriodSeconds`.
   *
   * @default - data is transparently encrypted using an AWS owned key
   */
  public readonly kmsKey: kms.IKey;
  /**
   * Maximum duration that Step Functions will reuse customer managed data keys.
   * When the period expires, Step Functions will call GenerateDataKey.
   *
   * Must be between 60 and 900 seconds.
   *
   * @default Duration.seconds(300)
   */
  public readonly kmsDataKeyReusePeriodSeconds?;

  constructor(kmsKey: kms.IKey, kmsDataKeyReusePeriodSeconds?: cdk.Duration) {
    super(CUSTOMER_MANAGED_KMS_KEY);
    this.kmsKey = kmsKey;
    this.validateKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds);
    this.kmsDataKeyReusePeriodSeconds = kmsDataKeyReusePeriodSeconds;
  }

  private isInvalidKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds: cdk.Duration) {
    return kmsDataKeyReusePeriodSeconds.toSeconds() < 60 || kmsDataKeyReusePeriodSeconds.toSeconds() > 900;
  }

  private validateKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds: cdk.Duration | undefined) {
    if (kmsDataKeyReusePeriodSeconds && this.isInvalidKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds)) {
      throw new Error('kmsDataKeyReusePeriodSeconds must have a value between 60 and 900 seconds');
    }
  }
}
