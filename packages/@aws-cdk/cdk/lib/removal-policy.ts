export enum RemovalPolicy {
  /**
   * This is the default removal policy for most resources. It means that when the resource
   * is removed from the app, it will be physically destroyed.
   */
  Destroy,

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
