import * as cdk from '../../../core';
import { RetentionDays } from '../log-group';

/**
   * Validate log retention
   */
export function validateLogGroupRetention(retentionInDays?: RetentionDays): RetentionDays | undefined {
  if (retentionInDays === undefined) { retentionInDays = RetentionDays.TWO_YEARS; }
  if (retentionInDays === Infinity || retentionInDays === RetentionDays.INFINITE) { retentionInDays = undefined; }

  if (retentionInDays !== undefined && !cdk.Token.isUnresolved(retentionInDays) && retentionInDays <= 0) {
    throw new Error(`retentionInDays must be positive, got ${retentionInDays}`);
  }

  return retentionInDays;
}
