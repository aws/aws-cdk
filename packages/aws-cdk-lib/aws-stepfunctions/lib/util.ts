import { AwsOwnedEncryptionConfiguration } from './aokencryptionconfiguration';
import { CustomerManagedEncryptionConfiguration } from './cmkencryptionconfiguration';
import { CfnActivity, CfnStateMachine } from './stepfunctions.generated';

export function noEmptyObject<A>(o: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(o).length === 0) { return undefined; }
  return o;
}

// eslint-disable-next-line max-len
export function buildEncryptionConfiguration(encryptionConfiguration? : CustomerManagedEncryptionConfiguration | AwsOwnedEncryptionConfiguration) : CfnStateMachine.EncryptionConfigurationProperty | CfnActivity.EncryptionConfigurationProperty | undefined {
  if (encryptionConfiguration instanceof AwsOwnedEncryptionConfiguration) {
    return {
      type: encryptionConfiguration.type,
    };
  }

  if (encryptionConfiguration instanceof CustomerManagedEncryptionConfiguration) {
    // Default value for `kmsDataKeyReusePeriodSeconds`, see: https://docs.aws.amazon.com/step-functions/latest/dg/encryption-at-rest.html#cfn-resources-for-encryption-configuration
    const DEFAULT_KMS_DATA_KEY_REUSE_PERIOD_SECONDS = 300;
    return {
      kmsKeyId: encryptionConfiguration.kmsKey.keyArn,
      kmsDataKeyReusePeriodSeconds: encryptionConfiguration.kmsDataKeyReusePeriodSeconds ?
        encryptionConfiguration.kmsDataKeyReusePeriodSeconds.toSeconds() : DEFAULT_KMS_DATA_KEY_REUSE_PERIOD_SECONDS,
      type: encryptionConfiguration.type,
    };
  }

  return undefined;
}