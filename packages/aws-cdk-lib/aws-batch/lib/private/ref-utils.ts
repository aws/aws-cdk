import { UnscopedValidationError } from '../../../core';
import { ISchedulingPolicyRef } from '../../../interfaces/generated/aws-batch-interfaces.generated';
import { ISchedulingPolicy } from '../scheduling-policy';

/**
 * Converts an ISchedulingPolicyRef to ISchedulingPolicy, validating that it implements the full interface.
 */
export function toISchedulingPolicy(policy: ISchedulingPolicyRef): ISchedulingPolicy {
  if (!('schedulingPolicyArn' in policy) || !('schedulingPolicyName' in policy)) {
    throw new UnscopedValidationError(`'schedulingPolicy' instance should implement ISchedulingPolicy, but doesn't: ${policy.constructor.name}`);
  }
  return policy as ISchedulingPolicy;
}
