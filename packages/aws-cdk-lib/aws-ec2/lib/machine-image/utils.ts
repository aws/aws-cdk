import type { Construct } from 'constructs';
import * as ssm from '../../../aws-ssm';
import { Validations } from '../../../core';

export function lookupImage(scope: Construct, cachedInContext: boolean | undefined, parameterName: string, additionalCacheKey?: string) {
  if (cachedInContext) {
    // A cached lookup bakes the resolved AMI ID into the template as a literal,
    // which is exactly what the machine image is supposed to do here. Silence
    // the W9010 "hardcoded AMI" warning on the consuming construct.
    acknowledgeAmiLookupWarning(scope);
    return ssm.StringParameter.valueFromLookup(scope, parameterName, undefined, { additionalCacheKey });
  }
  return ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
}

/**
 * Silence the CloudFormation validation "hardcoded AMI ID" warning (W9010) on the given scope.
 *
 * Some machine images resolve an AMI ID at synth time (via a context lookup) and emit it into
 * the template as a literal `ami-xxxx` value. That is the intended behavior of these images, so
 * the W9010 warning is a false positive for the consuming construct. The acknowledgement is
 * recorded on `scope` (the construct consuming the AMI), so that genuinely hand-authored
 * hardcoded AMI IDs elsewhere in the app continue to be flagged as usual.
 */
export function acknowledgeAmiLookupWarning(scope: Construct) {
  Validations.of(scope).acknowledge({
    id: 'CloudFormation-Validate::W9010',
    reason: 'The AMI ID is resolved from a synth-time lookup, so the literal AMI ID in the template is expected.',
  });
}

