/**
 * Used to indicate that a particular construct has an resource environment
 */
export interface IEnvironmentAware {
  /**
   * The environment this resource belongs to.
   *
   * For resources that are created and managed in a Stack (those created by
   * creating new class instances like `new Role()`, `new Bucket()`, etc.), this
   * is always the same as the environment of the stack they belong to.
   *
   * For referenced resources (those obtained from referencing methods like
   * `Role.fromRoleArn()`, `Bucket.fromBucketName()`, etc.), they might be
   * different than the stack they were imported into.
   */
  readonly env: ResourceEnvironment;
}

/**
 * Represents the environment a given resource lives in.
 *
 * Used as the return value for the `IEnvironmentAware.env` property.
 */
export interface ResourceEnvironment {
  /**
   * The AWS Account ID that this resource belongs to.
   *
   * Since this can be a Token (for example, when the account is
   * CloudFormation's `AWS::AccountId` intrinsic), make sure to use
   * `Token.compareStrings()` instead of comparing the values with direct
   * string equality.
   */
  readonly account: string;

  /**
   * The AWS Region that this resource belongs to.
   *
   * Since this can be a Token (for example, when the region is CloudFormation's
   * `AWS::Region` intrinsic), make sure to use `Token.compareStrings()` instead
   * of comparing the values with direct string equality.
   */
  readonly region: string;
}
