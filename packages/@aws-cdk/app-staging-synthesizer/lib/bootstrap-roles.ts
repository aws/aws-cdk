import { StringSpecializer, translateAssetTokenToCfnToken, translateCfnTokenToAssetToken } from 'aws-cdk-lib/core/lib/helpers-internal';

/**
 * Bootstrapped role specifier. These roles must exist already.
 * This class does not create new IAM Roles.
 */
export class BootstrapRole {
  /**
   * Use the currently assumed role/credentials
   */
  public static cliCredentials() {
    return new BootstrapRole(BootstrapRole.CLI_CREDS);
  }

  /**
   * Specify an existing IAM Role to assume
   */
  public static fromRoleArn(arn: string) {
    return new BootstrapRole(arn);
  }

  private static CLI_CREDS = 'cli-credentials';

  private constructor(private readonly roleArn: string) {}

  public isCliCredentials() {
    return this.roleArn === BootstrapRole.CLI_CREDS;
  }

  public renderRoleArn(options: {
    spec?: StringSpecializer,
    tokenType?: 'asset' | 'cfn',
  } = {}) {
    if (this.isCliCredentials()) { return undefined; }
    if (!options.spec) { return this.roleArn; }

    const arn = options.spec.specialize(this.roleArn);
    if (options.tokenType === 'asset') {
      return translateCfnTokenToAssetToken(arn);
    } else if (options.tokenType === 'cfn') {
      return translateAssetTokenToCfnToken(arn);
    } else {
      return arn;
    }
  }
}


/**
 * Roles that are bootstrapped to your account.
 */
export interface BootstrapRoles {
  /**
   * CloudFormation Execution Role
   *
   * @default - use bootstrapped role
   */
  readonly cloudFormationExecutionRole?: BootstrapRole;

  /**
   * Deployment Action Role
   *
   * @default - use boostrapped role
   */
  readonly deploymentActionRole?: BootstrapRole;

  /**
   * Lookup Role
   *
   * @default - use bootstrapped role
   */
  readonly lookupRole?: BootstrapRole;
}

/**
 * Roles that are included in the Staging Stack
 * (for access to Staging Resources)
 */
export interface StagingRoles {
  /**
   * File Asset Publishing Role
   *
   * @default - staging stack creates a file asset publishing role
   */
  readonly fileAssetPublishingRole?: BootstrapRole;

  /**
   * Docker Asset Publishing Role
   *
   * @default - staging stack creates a docker asset publishing role
   */
  readonly dockerAssetPublishingRole?: BootstrapRole;
}
