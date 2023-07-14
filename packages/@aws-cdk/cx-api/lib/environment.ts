/**
 * Parser for the artifact environment field.
 *
 * Account validation is relaxed to allow account aliasing in the future.
 */
const AWS_ENV_REGEX = /aws\:\/\/([a-z0-9A-Z\-\@\.\_]+)\/([a-z\-0-9]+)/;

/**
 * Models an AWS execution environment, for use within the CDK toolkit.
 */
export interface Environment {
  /** The arbitrary name of this environment (user-set, or at least user-meaningful) */
  readonly name: string;

  /** The AWS account this environment deploys into */
  readonly account: string;

  /** The AWS region name where this environment deploys into */
  readonly region: string;
}

export const UNKNOWN_ACCOUNT = 'unknown-account';
export const UNKNOWN_REGION = 'unknown-region';

export class EnvironmentUtils {
  public static parse(environment: string): Environment {
    const env = AWS_ENV_REGEX.exec(environment);
    if (!env) {
      throw new Error(
        `Unable to parse environment specification "${environment}". ` +
        'Expected format: aws://account/region');
    }

    const [, account, region] = env;
    if (!account || !region) {
      throw new Error(`Invalid environment specification: ${environment}`);
    }

    return { account, region, name: environment };
  }

  /**
   * Build an environment object from an account and region
   */
  public static make(account: string, region: string): Environment {
    return { account, region, name: this.format(account, region) };
  }

  /**
   * Format an environment string from an account and region
   */
  public static format(account: string, region: string): string {
    return `aws://${account}/${region}`;
  }
}
