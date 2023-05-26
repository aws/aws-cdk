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
    StringSpecializer.validateNoTokens(arn, 'BootstrapRole ARN');
    return new BootstrapRole(arn);
  }

  private static CLI_CREDS = 'cli-credentials';

  private constructor(private readonly roleArn: string) {}

  /**
   * Whether or not this is object was created using BootstrapRole.cliCredentials()
   */
  public isCliCredentials() {
    return this.roleArn === BootstrapRole.CLI_CREDS;
  }

  /**
   * @internal
   */
  public _arnForCloudFormation() {
    return this.isCliCredentials() ? undefined : translateAssetTokenToCfnToken(this.roleArn);
  }

  /**
   * @internal
   */
  public _arnForCloudAssembly() {
    return this.isCliCredentials() ? undefined : translateCfnTokenToAssetToken(this.roleArn);
  }

  /**
   * @internal
   */
  public _specialize(spec: StringSpecializer) {
    return new BootstrapRole(spec.specialize(this.roleArn));
  }
}

/**
 * Deployment identities are the class of roles to be assumed by the CDK
 * when deploying the App.
 */
export class DeploymentIdentities {
  /**
   * Use CLI credentials for all deployment identities.
   */
  public static cliCredentials(): DeploymentIdentities {
    return new DeploymentIdentities({
      cloudFormationExecutionRole: BootstrapRole.cliCredentials(),
      deploymentRole: BootstrapRole.cliCredentials(),
      lookupRole: BootstrapRole.cliCredentials(),
    });
  }

  /**
   * Specify your own roles for all deployment identities. These roles
   * must already exist.
   */
  public static specifyRoles(roles: BootstrapRoles): DeploymentIdentities {
    return new DeploymentIdentities(roles);
  }

  private constructor(
    /** roles that are bootstrapped to your account. */
    public readonly roles: BootstrapRoles,
  ) {}
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
  readonly deploymentRole?: BootstrapRole;

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
