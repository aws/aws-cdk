/**
 * Models an AWS execution environment, for use within the CDK toolkit.
 */
export interface Environment {
  /** The 12-digit AWS account ID for the account this environment deploys into */
  readonly account: string;

  /** The AWS region name where this environment deploys into */
  readonly region: string;
}
