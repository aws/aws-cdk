import { EncryptionConfiguration } from './encryptionconfiguration';

export function noEmptyObject<A>(o: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(o).length === 0) { return undefined; }
  return o;
}

export function constructEncryptionConfiguration(encryptionConfiguration? : EncryptionConfiguration) {
  if (!encryptionConfiguration) {
    return undefined;
  }
  // Default value for `kmsDataKeyReusePeriodSeconds`, see: https://docs.aws.amazon.com/step-functions/latest/dg/encryption-at-rest.html#cfn-resources-for-encryption-configuration
  const DEFAULT_KMS_DATA_KEY_REUSE_PERIOD_SECONDS = 300;
  return {
    kmsKeyId: encryptionConfiguration.kmsKey.keyArn,
    kmsDataKeyReusePeriodSeconds: encryptionConfiguration.kmsDataKeyReusePeriodSeconds ?
      encryptionConfiguration.kmsDataKeyReusePeriodSeconds.toSeconds() : DEFAULT_KMS_DATA_KEY_REUSE_PERIOD_SECONDS,
    type: 'CUSTOMER_MANAGED_KMS_KEY',
  };

}