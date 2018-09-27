import { Resource } from './resource';
import { DeletionPolicy } from './resource-policy';

export enum RemovalPolicy {
  /**
   * This is the default removal policy for most resources. It means that when the resource
   * is removed from the app, it will be physically destroyed.
   */
  Destroy = 0,

  /**
   * This uses the 'Retain' DeletionPolicy, which will cause the resource to be retained
   * in the account, but orphaned from the stack.
   */
  Orphan,

  /**
   * This will apply the 'Retain' DeletionPolicy and also add metadata for the toolkit
   * to apply a CloudFormation stack policy which forbids the deletion of resource.
   */
  Forbid
}

export function applyRemovalPolicy(resource: Resource, removalPolicy: RemovalPolicy | undefined) {
  if (removalPolicy === RemovalPolicy.Orphan || removalPolicy === RemovalPolicy.Forbid) {
    resource.options.deletionPolicy = DeletionPolicy.Retain;
  }

  // attach metadata that will tell the toolkit to protect this resource by
  // applying an appropriate stack update policy.
  if (removalPolicy === RemovalPolicy.Forbid) {
    resource.addMetadata('aws:cdk:protected', true);
  }
}
