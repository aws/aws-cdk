/**
 * This context key is used to determine the value of `stack.availabilityZones`
 * when a stack is not associated with a specific account/region (env-agnostic).
 *
 * If this key is passed in the context, the values will be used. Otherwise, a
 * system-fallback which uses `Fn::GetAZs` will be used.
 */
export declare const AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY = "aws:cdk:availability-zones:fallback";
/**
 * Response of the AZ provider looks like this
 */
export type AvailabilityZonesContextResponse = string[];
