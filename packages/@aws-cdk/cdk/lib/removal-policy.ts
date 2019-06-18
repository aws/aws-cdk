import { CfnResource } from './cfn-resource';
import { DeletionPolicy } from './resource-policy';

export enum RemovalPolicy {
  /**
   * This is the default removal policy for most resources. It means that when the resource
   * is removed from the app, it will be physically destroyed.
   */
  DESTROY = 0,

  /**
   * This uses the 'Retain' DeletionPolicy, which will cause the resource to be retained
   * in the account, but orphaned from the stack.
   */
  ORPHAN,

  /**
   * This will apply the 'Retain' DeletionPolicy and also add metadata for the toolkit
   * to apply a CloudFormation stack policy which forbids the deletion of resource.
   */
  FORBID
}

export function applyRemovalPolicy(resource: CfnResource, removalPolicy: RemovalPolicy | undefined) {
  if (removalPolicy === RemovalPolicy.ORPHAN || removalPolicy === RemovalPolicy.FORBID) {
    resource.options.deletionPolicy = DeletionPolicy.RETAIN;
  }

  // attach metadata that will tell the toolkit to protect this resource by
  // applying an appropriate stack update policy.
  if (removalPolicy === RemovalPolicy.FORBID) {
    resource.node.addMetadata('aws:cdk:protected', true);
  }
}
