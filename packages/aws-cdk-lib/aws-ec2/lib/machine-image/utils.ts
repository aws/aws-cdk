import { Construct } from 'constructs';
import * as ssm from '../../../aws-ssm';

export function lookupImage(scope: Construct, cachedInContext: boolean | undefined, parameterName: string, additionalCacheKey?: string) {
  return cachedInContext
    ? ssm.StringParameter.valueFromLookup(scope, parameterName, undefined, { additionalCacheKey })
    : ssm.StringParameter.valueForTypedStringParameterV2(scope, parameterName, ssm.ParameterValueType.AWS_EC2_IMAGE_ID);
}

