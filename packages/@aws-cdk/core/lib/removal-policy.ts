export enum RemovalPolicy {
  /**
   * This is the default removal policy. It means that when the resource is
   * removed from the app, it will be physically destroyed.
   */
  DESTROY = 'destroy',

  /**
   * This uses the 'Retain' DeletionPolicy, which will cause the resource to be retained
   * in the account, but orphaned from the stack.
   */
  RETAIN = 'retain',

  /**
   * This retention policy deletes the resource,
   * but saves a snapshot of its data before deleting,
   * so that it can be re-created later.
   * Only available for some stateful resources,
   * like databases, EFS volumes, etc.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html#aws-attribute-deletionpolicy-options
   */
  SNAPSHOT = 'snapshot',
}

export interface RemovalPolicyOptions {
  /**
   * The default policy to apply in case the removal policy is not defined.
   *
   * @default - Default value is resource specific. To determine the default value for a resoure,
   * please consult that specific resource's documentation.
   */
  readonly default?: RemovalPolicy;

  /**
   * Apply the same deletion policy to the resource's "UpdateReplacePolicy"
   * @default true
   */
  readonly applyToUpdateReplacePolicy?: boolean;
}
