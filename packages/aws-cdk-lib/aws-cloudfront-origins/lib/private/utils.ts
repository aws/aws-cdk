import * as cdk from '../../../core';
import { lit } from '../../../core/lib/private/literal-string';

/**
 * Throws an error if a duration is defined and below a minimum number of seconds.
 *
 * There is deliberately no upper bound. The timeouts validated here are governed by adjustable
 * service quotas (`Response timeout per origin`, `Keep-alive timeout per origin`), so the effective
 * maximum depends on the target account and can only be enforced by the service at deploy time.
 * A hardcoded ceiling rejects values the service would accept.
 *
 * Fractional durations are not checked here because `Duration.toSeconds()` already rejects them.
 */
export function validateMinimumSeconds(name: string, min: number, duration?: cdk.Duration) {
  if (duration === undefined) { return; }
  const value = duration.toSeconds();
  if (value < min) {
    throw new cdk.UnscopedValidationError(lit`InvalidDurationRange`, `${name}: Must be an int ${min} seconds or greater; received ${value}.`);
  }
}
