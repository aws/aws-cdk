import * as cdk from '@aws-cdk/core';

/**
 * Throws an error if a duration is defined and not an integer number of seconds within a range.
 */
export function validateSecondsInRangeOrUndefined(name: string, min: number, max: number, duration?: cdk.Duration) {
  if (duration === undefined) { return; }
  const value = duration.toSeconds();
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name}: Must be an int between ${min} and ${max} seconds (inclusive); received ${value}.`);
  }
}
