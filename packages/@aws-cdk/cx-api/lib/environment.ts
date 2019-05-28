/**
 * Parser for the artifact environment field.
 */
const AWS_ENV_REGEX = /aws\:\/\/([0-9]+|unknown-account)\/([a-z\-0-9]+)/;

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

export class EnvironmentUtils {
  public static parse(environment: string): Environment {
    const env = AWS_ENV_REGEX.exec(environment);
    if (!env) {
      throw new Error(
        `Unable to parse environment specification "${environment}". ` +
        `Expected format: aws://acount/region`);
    }

    const [ , account, region ] = env;
    if (!account || !region) {
      throw new Error(`Invalid environment specification: ${environment}`);
    }

    return { account, region, name: environment };
  }

  public static format(account: string, region: string): string {
    return `aws://${account}/${region}`;
  }
}
