import { ArnPrincipal, Construct, IDependable, PolicyDocument, PolicyPrincipal, PolicyStatement } from '@aws-cdk/cdk';
import { cloudformation } from './iam.generated';
import { IIdentityResource, IPrincipal, Policy } from './policy';
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
   * A list of ARNs for managed policies associated with this role.
   * You can add managed policies later using `attachManagedPolicy(arn)`.
   * @default No managed policies.
   */
  managedPolicyArns?: string[];

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
export class Role extends Construct implements IIdentityResource, IPrincipal, IDependable {
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

    this.assumeRolePolicy = createAssumeRolePolicy(props.assumedBy);
    this.managedPolicyArns = props.managedPolicyArns || [ ];

    validateMaxSessionDuration(props.maxSessionDurationSec);

    const role = new cloudformation.RoleResource(this, 'Resource', {
      assumeRolePolicyDocument: this.assumeRolePolicy as any,
      managedPolicyArns: undefinedIfEmpty(() => this.managedPolicyArns),
      path: props.path,
      roleName: props.roleName,
      maxSessionDuration: props.maxSessionDurationSec
    });

    this.roleArn = role.roleArn;
    this.principal = new ArnPrincipal(this.roleArn);
    this.roleName = role.roleName;
    this.dependencyElements = [ role ];
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

function createAssumeRolePolicy(principal: PolicyPrincipal) {
  return new PolicyDocument()
    .addStatement(new PolicyStatement()
      .addPrincipal(principal)
      .addAction(principal.assumeRoleAction));
}

function validateMaxSessionDuration(duration?: number) {
  if (duration === undefined) {
    return;
  }

  if (duration < 3600 || duration > 43200) {
    throw new Error(`maxSessionDuration is set to ${duration}, but must be >= 3600sec (1hr) and <= 43200sec (12hrs)`);
  }
}
