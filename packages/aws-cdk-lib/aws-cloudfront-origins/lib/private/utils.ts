import * as cdk from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * Throws an error if a duration is defined and not an integer number of seconds within a range.
 *
 * Pass `undefined` for `max` to validate the lower bound only. This is for values whose upper
 * bound is an adjustable service quota, so the effective maximum depends on the target account
 * and can only be enforced by the service at deploy time.
 */
export function validateSecondsInRangeOrUndefined(name: string, min: number, max: number | undefined, duration?: cdk.Duration) {
  if (duration === undefined) { return; }
  const value = duration.toSeconds();
  if (!Number.isInteger(value) || value < min || (max !== undefined && value > max)) {
    const range = max !== undefined ? `between ${min} and ${max} seconds (inclusive)` : `${min} seconds or greater`;
    throw new cdk.UnscopedValidationError(lit`InvalidDurationRange`, `${name}: Must be an int ${range}; received ${value}.`);
  }
}
