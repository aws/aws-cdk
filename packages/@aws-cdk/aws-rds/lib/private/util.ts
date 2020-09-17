import { CfnDeletionPolicy, CfnResource, RemovalPolicy } from '@aws-cdk/core';

export function applyRemovalPolicy(cfnDatabase: CfnResource, removalPolicy?: RemovalPolicy): void {
  if (!removalPolicy) {
    // the default DeletionPolicy is 'Snapshot', which is fine,
    // but we should also make it 'Snapshot' for UpdateReplace policy
    cfnDatabase.cfnOptions.updateReplacePolicy = CfnDeletionPolicy.SNAPSHOT;
  } else {
    // just apply whatever removal policy the customer explicitly provided
    cfnDatabase.applyRemovalPolicy(removalPolicy);
  }
}

/**
 * By default, deletion protection is disabled.
 * Enable if explicitly provided or if the RemovalPolicy has been set to RETAIN
 */
export function defaultDeletionProtection(deletionProtection?: boolean, removalPolicy?: RemovalPolicy): boolean | undefined {
  return deletionProtection !== undefined
    ? deletionProtection
    : (removalPolicy === RemovalPolicy.RETAIN ? true : undefined);
}
