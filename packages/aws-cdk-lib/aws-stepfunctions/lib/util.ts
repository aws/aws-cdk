import { StateMachineProps } from './state-machine';
import { IKey } from '../../aws-kms';
import { Duration } from '../../core';

export function noEmptyObject<A>(o: Record<string, A>): Record<string, A> | undefined {
  if (Object.keys(o).length === 0) { return undefined; }
  return o;
}

export function validateEncryptionConfiguration(kmsKey: IKey | undefined, kmsDataKeyReusePeriodSeconds: Duration | undefined) {
  if (kmsKey === undefined && kmsDataKeyReusePeriodSeconds !== undefined) {
    throw new Error('You cannot set kmsDataKeyReusePeriodSeconds without providing a kms key');
  }

  if (kmsKey !== undefined && kmsDataKeyReusePeriodSeconds !== undefined
    && isInValidKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds)) {
    throw new Error('kmsDataKeyReusePeriodSeconds needs to be a value between 60 and 900');
  }
}
function isInValidKmsDataKeyReusePeriodSeconds(kmsDataKeyReusePeriodSeconds: Duration) {
  return kmsDataKeyReusePeriodSeconds < Duration.seconds(60) || kmsDataKeyReusePeriodSeconds > Duration.seconds(900);
}

export function constructEncryptionConfiguration(props: StateMachineProps, defaultPeriodSeconds: number) {
  if (props?.kmsKey) {
    return {
      kmsKeyId: props.kmsKey.keyArn,
      kmsDataKeyReusePeriodSeconds: props.kmsDataKeyReusePeriodSeconds ? props.kmsDataKeyReusePeriodSeconds.toSeconds() : defaultPeriodSeconds,
      type: 'CUSTOMER_MANAGED_KMS_KEY',
    };
  } else {
    return { type: 'AWS_OWNED_KEY' };
  }
}