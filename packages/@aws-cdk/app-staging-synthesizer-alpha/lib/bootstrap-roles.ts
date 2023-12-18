import { StringSpecializer, translateAssetTokenToCfnToken, translateCfnTokenToAssetToken } from 'aws-cdk-lib/core/lib/helpers-internal';
import { AppStagingSynthesizer } from './app-staging-synthesizer';

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

  /**
   * Use the Roles that have been created by the default bootstrap stack
   */
  public static defaultBootstrapRoles(options: DefaultBootstrapRolesOptions = {}): DeploymentIdentities {
    function replacePlaceholders(x: string) {
      if (options.bootstrapRegion !== undefined) {
        x = x.replace(/\$\{AWS::Region\}/g, options.bootstrapRegion);
      }
      return x;
    }

    return new DeploymentIdentities({
      deploymentRole: BootstrapRole.fromRoleArn(replacePlaceholders(AppStagingSynthesizer.DEFAULT_DEPLOY_ROLE_ARN)),
      cloudFormationExecutionRole: BootstrapRole.fromRoleArn(replacePlaceholders(AppStagingSynthesizer.DEFAULT_CLOUDFORMATION_ROLE_ARN)),
      lookupRole: BootstrapRole.fromRoleArn(replacePlaceholders(AppStagingSynthesizer.DEFAULT_LOOKUP_ROLE_ARN)),
    });
  }

  /**
   * CloudFormation Execution Role
   */
  public readonly cloudFormationExecutionRole?: BootstrapRole;

  /**
   * Deployment Action Role
   */
  public readonly deploymentRole?: BootstrapRole;

  /**
   * Lookup Role
    @default - use bootstrapped role
   */
  public readonly lookupRole?: BootstrapRole;

  private constructor(
    /** roles that are bootstrapped to your account. */
    roles: BootstrapRoles,
  ) {
    this.cloudFormationExecutionRole = roles.cloudFormationExecutionRole;
    this.deploymentRole = roles.deploymentRole;
    this.lookupRole = roles.lookupRole;
  }
}

/**
 * Options for `DeploymentIdentities.defaultBootstrappedRoles`
 */
export interface DefaultBootstrapRolesOptions {
  /**
   * The region where the default bootstrap roles have been created
   *
   * By default, the region in which the stack is deployed is used.
   *
   * @default - the stack's current region
   */
  readonly bootstrapRegion?: string;
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
