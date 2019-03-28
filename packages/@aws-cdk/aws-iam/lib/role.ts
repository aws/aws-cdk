import { CfnOutput, Construct, IConstruct } from '@aws-cdk/cdk';
import { CfnRole } from './iam.generated';
import { IPrincipal, Policy } from './policy';
import { ArnPrincipal, PolicyDocument, PolicyPrincipal, PolicyStatement } from './policy-document';
import { AttachedPolicies, undefinedIfEmpty } from './util';

export interface RoleProps {
  /**
   * The IAM principal (i.e. `new ServicePrincipal('sns.amazonaws.com')`)
   * which can assume this role.
   *
   * You can later modify the assume role policy document by accessing it via
   * the `assumeRolePolicy` property.
   */
  readonly assumedBy: PolicyPrincipal;

  /**
   * ID that the role assumer needs to provide when assuming this role
   *
   * If the configured and provided external IDs do not match, the
   * AssumeRole operation will fail.
   *
   * @default No external ID required
   */
  readonly externalId?: string;

  /**
   * A list of ARNs for managed policies associated with this role.
   * You can add managed policies later using `attachManagedPolicy(arn)`.
   * @default No managed policies.
   */
  readonly managedPolicyArns?: string[];

  /**
   * A list of named policies to inline into this role. These policies will be
   * created with the role, whereas those added by ``addToPolicy`` are added
   * using a separate CloudFormation resource (allowing a way around circular
   * dependencies that could otherwise be introduced).
   * @default No policy is inlined in the Role resource.
   */
  readonly inlinePolicies?: { [name: string]: PolicyDocument };

  /**
   * The path associated with this role. For information about IAM paths, see
   * Friendly Names and Paths in IAM User Guide.
   */
  readonly path?: string;

  /**
   * A name for the IAM role. For valid values, see the RoleName parameter for
   * the CreateRole action in the IAM API Reference. If you don't specify a
   * name, AWS CloudFormation generates a unique physical ID and uses that ID
   * for the group name.
   *
   * IMPORTANT: If you specify a name, you cannot perform updates that require
   * replacement of this resource. You can perform updates that require no or
   * some interruption. If you must replace the resource, specify a new name.
   *
   * If you specify a name, you must specify the CAPABILITY_NAMED_IAM value to
   * acknowledge your template's capabilities. For more information, see
   * Acknowledging IAM Resources in AWS CloudFormation Templates.
   */
  readonly roleName?: string;

  /**
   * The maximum session duration (in seconds) that you want to set for the
   * specified role. If you do not specify a value for this setting, the
   * default maximum of one hour is applied. This setting can have a value
   * from 1 hour (3600sec) to 12 (43200sec) hours.
   *
   * Anyone who assumes the role from the AWS CLI or API can use the
   * DurationSeconds API parameter or the duration-seconds CLI parameter to
   * request a longer session. The MaxSessionDuration setting determines the
   * maximum duration that can be requested using the DurationSeconds
   * parameter.
   *
   * If users don't specify a value for the DurationSeconds parameter, their
   * security credentials are valid for one hour by default. This applies when
   * you use the AssumeRole* API operations or the assume-role* CLI operations
   * but does not apply when you use those operations to create a console URL.
   *
   * @link https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use.html
   */
  readonly maxSessionDurationSec?: number;
}

/**
 * IAM Role
 *
 * Defines an IAM role. The role is created with an assume policy document associated with
 * the specified AWS service principal defined in `serviceAssumeRole`.
 */
export class Role extends Construct implements IRole {
  /**
   * Import a role that already exists
   */
  public static import(scope: Construct, id: string, props: RoleImportProps): IRole {
    return new ImportedRole(scope, id, props);
  }

  /**
   * The assume role policy document associated with this role.
   */
  public readonly assumeRolePolicy?: PolicyDocument;

  /**
   * Returns the ARN of this role.
   */
  public readonly roleArn: string;

  /**
   * Returns the stable and unique string identifying the role. For example,
   * AIDAJQABLZS4A3QDU576Q.
   */
  public readonly roleId: string;

  /**
   * Returns the name of the role.
   */
  public readonly roleName: string;

  /**
   * Returns the ARN of this role.
   */
  public readonly principal: PolicyPrincipal;

  private defaultPolicy?: Policy;
  private readonly managedPolicyArns: string[];
  private readonly attachedPolicies = new AttachedPolicies();

  constructor(scope: Construct, id: string, props: RoleProps) {
    super(scope, id);

    this.assumeRolePolicy = createAssumeRolePolicy(props.assumedBy, props.externalId);
    this.managedPolicyArns = props.managedPolicyArns || [ ];

    validateMaxSessionDuration(props.maxSessionDurationSec);

    const role = new CfnRole(this, 'Resource', {
      assumeRolePolicyDocument: this.assumeRolePolicy as any,
      managedPolicyArns: undefinedIfEmpty(() => this.managedPolicyArns),
      policies: _flatten(props.inlinePolicies),
      path: props.path,
      roleName: props.roleName,
      maxSessionDuration: props.maxSessionDurationSec,
    });

    this.roleId = role.roleId;
    this.roleArn = role.roleArn;
    this.principal = new ArnPrincipal(this.roleArn);
    this.roleName = role.roleName;

    function _flatten(policies?: { [name: string]: PolicyDocument }) {
      if (policies == null || Object.keys(policies).length === 0) {
        return undefined;
      }
      const result = new Array<CfnRole.PolicyProperty>();
      for (const policyName of Object.keys(policies)) {
        const policyDocument = policies[policyName];
        result.push({ policyName, policyDocument });
      }
      return result;
    }
  }

  public export(): RoleImportProps {
    return {
      roleArn: new CfnOutput(this, 'RoleArn', { value: this.roleArn }).makeImportValue(),
      roleId: new CfnOutput(this, 'RoleId', { value: this.roleId }).makeImportValue()
    };
  }

  /**
   * Adds a permission to the role's default policy document.
   * If there is no default policy attached to this role, it will be created.
   * @param permission The permission statement to add to the policy document
   */
  public addToPolicy(statement: PolicyStatement) {
    if (!this.defaultPolicy) {
      this.defaultPolicy = new Policy(this, 'DefaultPolicy');
      this.attachInlinePolicy(this.defaultPolicy);
    }
    this.defaultPolicy.addStatement(statement);
  }

  /**
   * Attaches a managed policy to this role.
   * @param arn The ARN of the managed policy to attach.
   */
  public attachManagedPolicy(arn: string) {
    this.managedPolicyArns.push(arn);
  }

  /**
   * Attaches a policy to this role.
   * @param policy The policy to attach
   */
  public attachInlinePolicy(policy: Policy) {
    this.attachedPolicies.attach(policy);
    policy.attachToRole(this);
  }

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  public grant(identity?: IPrincipal, ...actions: string[]) {
      if (!identity) {
        return;
      }

      identity.addToPolicy(new PolicyStatement()
        .addResource(this.roleArn)
        .addActions(...actions));
  }

  /**
   * Grant permissions to the given principal to pass this role.
   */
  public grantPassRole(identity?: IPrincipal) {
    this.grant(identity, 'iam:PassRole');
  }
}

/**
 * A Role object
 */
export interface IRole extends IConstruct, IPrincipal {
  /**
   * Returns the ARN of this role.
   */
  readonly roleArn: string;

  /**
   * Returns the stable and unique string identifying the role. For example,
   * AIDAJQABLZS4A3QDU576Q.
   */
  readonly roleId: string;

  /**
   * Returns the name of this role.
   */
  readonly roleName: string;

  /**
   * Export this role to another stack.
   */
  export(): RoleImportProps;

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  grant(identity?: IPrincipal, ...actions: string[]): void;

  /**
   * Grant permissions to the given principal to pass this role.
   */
  grantPassRole(identity?: IPrincipal): void;
}

function createAssumeRolePolicy(principal: PolicyPrincipal, externalId?: string) {
  const statement = new PolicyStatement();
  statement
      .addPrincipal(principal)
      .addAction(principal.assumeRoleAction);

  if (externalId !== undefined) {
    statement.addCondition('StringEquals', { 'sts:ExternalId': externalId });
  }

  return new PolicyDocument().addStatement(statement);
}

function validateMaxSessionDuration(duration?: number) {
  if (duration === undefined) {
    return;
  }

  if (duration < 3600 || duration > 43200) {
    throw new Error(`maxSessionDuration is set to ${duration}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`);
  }
}

/**
 * Properties to import a Role
 */
export interface RoleImportProps {
  /**
   * The role's ARN
   */
  readonly roleArn: string;

  /**
   * The stable and unique string identifying the role. For example,
   * AIDAJQABLZS4A3QDU576Q.
   *
   * @default If "roleId" is not specified for an imported role, then
   * `role.roleId` will throw an exception. In most cases, role ID is not really needed.
   */
  readonly roleId?: string;
}

/**
 * A role that already exists
 */
class ImportedRole extends Construct implements IRole {
  public readonly roleArn: string;
  public readonly principal: PolicyPrincipal;

  private readonly _roleId?: string;

  constructor(scope: Construct, id: string, private readonly props: RoleImportProps) {
    super(scope, id);
    this.roleArn = props.roleArn;
    this._roleId = props.roleId;
    this.principal = new ArnPrincipal(this.roleArn);
  }

  public get roleId() {
    if (!this._roleId) {
      throw new Error(`No roleId specified for imported role`);
    }
    return this._roleId;
  }

  public get roleName() {
    return this.node.stack.parseArn(this.roleArn).resourceName!;
  }

  public export() {
    return this.props;
  }

  public addToPolicy(_statement: PolicyStatement): void {
    // FIXME: Add warning that we're ignoring this
  }

  public attachInlinePolicy(_policy: Policy): void {
    // FIXME: Add warning that we're ignoring this
  }

  public attachManagedPolicy(_arn: string): void {
    // FIXME: Add warning that we're ignoring this
  }

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  public grant(_identity?: IPrincipal, ..._actions: string[]): void {
    // FIXME: Add warning that we're ignoring this
  }

  /**
   * Grant permissions to the given principal to pass this role.
   */
  public grantPassRole(_identity?: IPrincipal): void {
    // FIXME: Add warning that we're ignoring this
  }
}
