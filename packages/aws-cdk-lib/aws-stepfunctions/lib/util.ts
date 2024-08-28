import { IKey } from '../../aws-kms';
import { Duration } from '../../core';

export function noEmptyObject<A>(o: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(o).length === 0) { return undefined; }
  return o;
}

function isInValidKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds: Duration) {
  return kmsDataKeyReusePeriodSeconds.toSeconds() < 60 || kmsDataKeyReusePeriodSeconds.toSeconds() > 900;
}

function validateEncryptionConfiguration(kmsKey: IKey | undefined, kmsDataKeyReusePeriodSeconds: Duration | undefined) {
  if (!kmsKey && kmsDataKeyReusePeriodSeconds) {
    throw new Error('You cannot set kmsDataKeyReusePeriodSeconds without providing a value for kmsKey');
  }
  if (kmsKey && kmsDataKeyReusePeriodSeconds && isInValidKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds)) {
    throw new Error('kmsDataKeyReusePeriodSeconds must have a value between 60 and 900 seconds');
  }
}

export function constructEncryptionConfiguration(kmsKey: IKey | undefined, kmsDataKeyReusePeriodSeconds: Duration | undefined) {
  validateEncryptionConfiguration(kmsKey, kmsDataKeyReusePeriodSeconds);

  if (!kmsKey) {
    return undefined;
  }

  // Default value for `kmsDataKeyReusePeriodSeconds`, see: https://docs.aws.amazon.com/step-functions/latest/dg/encryption-at-rest.html#cfn-resources-for-encryption-configuration
  const DEFAULT_KMS_DATA_KEY_REUSE_PERIOD_SECONDS = 300;
  return {
    kmsKeyId: kmsKey.keyArn,
    kmsDataKeyReusePeriodSeconds: kmsDataKeyReusePeriodSeconds ? kmsDataKeyReusePeriodSeconds.toSeconds() : DEFAULT_KMS_DATA_KEY_REUSE_PERIOD_SECONDS,
    type: 'CUSTOMER_MANAGED_KMS_KEY',
  };

}