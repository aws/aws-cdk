/**
 * Bootstrapped role specifier. These roles must exist already.
 * This class does not create new IAM Roles.
 */
export class BootstrapRole {
  /**
   * Use the currently assumed role/credentials
   */
  public static cliCredentials() {
    return new BootstrapRole(undefined);
  }

  /**
   * Specify an existing IAM Role to assume
   */
  public static fromRoleArn(arn: string) {
    return new BootstrapRole(arn);
  }

  private constructor(/** Bootstrap role arn */ public readonly roleArn: string | undefined) {}
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
