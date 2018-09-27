/**
 * Models an AWS execution environment, for use within the CDK toolkit.
 */
export interface Environment {
  /** The arbitrary name of this environment (user-set, or at least user-meaningful) */
  name: string;

  /** The 12-digit AWS account ID for the account this environment deploys into */
  account: string;

  /** The AWS region name where this environment deploys into */
  region: string;
}
