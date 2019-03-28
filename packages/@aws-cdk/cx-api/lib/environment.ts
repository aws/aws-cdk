/**
 * Models an AWS execution environment, for use within the CDK toolkit.
 */
export interface Environment {
  /** The arbitrary name of this environment (user-set, or at least user-meaningful) */
  readonly name: string;

  /** The 12-digit AWS account ID for the account this environment deploys into */
  readonly account: string;

  /** The AWS region name where this environment deploys into */
  readonly region: string;
}
