/**
 * The deployment environment for a stack.
 */
export interface Environment {
  /**
   * The AWS account ID for this environment.
   *
   * This can be either a concrete value such as `585191031104` or `Aws.ACCOUNT_ID` which
   * indicates that account ID will only be determined during deployment (it
   * will resolve to the CloudFormation intrinsic `{"Ref":"AWS::AccountId"}`).
   * Note that certain features, such as cross-stack references and
   * environmental context providers require concrete region information and
   * will cause this stack to emit synthesis errors.
   *
   * @default Aws.ACCOUNT_ID which means that the stack will be account-agnostic.
   */
  readonly account?: string;

  /**
   * The AWS region for this environment.
   *
   * This can be either a concrete value such as `eu-west-2` or `Aws.REGION`
   * which indicates that account ID will only be determined during deployment
   * (it will resolve to the CloudFormation intrinsic `{"Ref":"AWS::Region"}`).
   * Note that certain features, such as cross-stack references and
   * environmental context providers require concrete region information and
   * will cause this stack to emit synthesis errors.
   *
   * @default Aws.REGION which means that the stack will be region-agnostic.
   */
  readonly region?: string;
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
