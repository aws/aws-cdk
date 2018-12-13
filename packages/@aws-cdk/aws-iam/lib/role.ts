import { Construct, IDependable } from '@aws-cdk/cdk';
import { cloudformation } from './iam.generated';
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
  assumedBy: PolicyPrincipal;

  /**
   * ID that the role assumer needs to provide when assuming this role
   *
   * If the configured and provided external IDs do not match, the
   * AssumeRole operation will fail.
   *
   * @default No external ID required
   */
  externalId?: string;

  /**
   * A list of ARNs for managed policies associated with this role.
   * You can add managed policies later using `attachManagedPolicy(arn)`.
   * @default No managed policies.
   */
  managedPolicyArns?: string[];

  /**
   * A list of named policies to inline into this role. These policies will be
   * created with the role, whereas those added by ``addToPolicy`` are added
   * using a separate CloudFormation resource (allowing a way around circular
   * dependencies that could otherwise be introduced).
   * @default No policy is inlined in the Role resource.
   */
  inlinePolicies?: { [name: string]: PolicyDocument };

  /**
   * The path associated with this role. For information about IAM paths, see
   * Friendly Names and Paths in IAM User Guide.
   */
  path?: string;

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
  roleName?: string;

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
  maxSessionDurationSec?: number;
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
  public static import(parent: Construct, id: string, props: ImportedRoleProps): IRole {
    return new ImportedRole(parent, id, props);
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
   * Returns the name of the role.
   */
  public readonly roleName: string;

  /**
   * Returns the ARN of this role.
   */
  public readonly principal: PolicyPrincipal;

  /**
   * Returns the role.
   */
  public readonly dependencyElements: IDependable[];

  private defaultPolicy?: Policy;
  private readonly managedPolicyArns: string[];
  private readonly attachedPolicies = new AttachedPolicies();

  constructor(parent: Construct, name: string, props: RoleProps) {
    super(parent, name);

    this.assumeRolePolicy = createAssumeRolePolicy(props.assumedBy, props.externalId);
    this.managedPolicyArns = props.managedPolicyArns || [ ];

    validateMaxSessionDuration(props.maxSessionDurationSec);

    const role = new cloudformation.RoleResource(this, 'Resource', {
      assumeRolePolicyDocument: this.assumeRolePolicy as any,
      managedPolicyArns: undefinedIfEmpty(() => this.managedPolicyArns),
      policies: _flatten(props.inlinePolicies),
      path: props.path,
      roleName: props.roleName,
      maxSessionDuration: props.maxSessionDurationSec,
    });

    this.roleArn = role.roleArn;
    this.principal = new ArnPrincipal(this.roleArn);
    this.roleName = role.roleName;
    this.dependencyElements = [ role ];

    function _flatten(policies?: { [name: string]: PolicyDocument }) {
      if (policies == null || Object.keys(policies).length === 0) {
        return undefined;
      }
      const result = new Array<cloudformation.RoleResource.PolicyProperty>();
      for (const policyName of Object.keys(policies)) {
        const policyDocument = policies[policyName];
        result.push({ policyName, policyDocument });
      }
      return result;
    }
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
      this.dependencyElements.push(this.defaultPolicy);
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
}

/**
 * A Role object
 */
export interface IRole extends IPrincipal, IDependable {
  /**
   * Returns the ARN of this role.
   */
  readonly roleArn: string;
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
export interface ImportedRoleProps {
  /**
   * The role's ARN
   */
  roleArn: string;
}

/**
 * A role that already exists
 */
class ImportedRole extends Construct implements IRole {
  public readonly roleArn: string;
  public readonly principal: PolicyPrincipal;
  public readonly dependencyElements: IDependable[] = [];

  constructor(parent: Construct, id: string, props: ImportedRoleProps) {
    super(parent, id);
    this.roleArn = props.roleArn;
    this.principal = new ArnPrincipal(this.roleArn);
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
}
