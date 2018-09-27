import { Construct, IDependable, PolicyDocument, PolicyPrincipal, PolicyStatement, Token } from '@aws-cdk/cdk';
import { Group } from './group';
import { cloudformation } from './iam.generated';
import { Role } from './role';
import { User } from './user';
import { generatePolicyName, undefinedIfEmpty } from './util';

/**
 * A construct that represents an IAM principal, such as a user, group or role.
 */
export interface IPrincipal {
  /**
   * The IAM principal of this identity (i.e. AWS principal, service principal, etc).
   */
  readonly principal: PolicyPrincipal;

  /**
   * Adds an IAM statement to the default inline policy associated with this
   * principal. If a policy doesn't exist, it is created.
   */
  addToPolicy(statement: PolicyStatement): void;

  /**
   * Attaches an inline policy to this principal.
   * This is the same as calling `policy.addToXxx(principal)`.
   * @param policy The policy resource to attach to this principal.
   */
  attachInlinePolicy(policy: Policy): void;

  /**
   * Attaches a managed policy to this principal.
   * @param arn The ARN of the managed policy
   */
  attachManagedPolicy(arn: string): void;
}

/**
 * @deprecated Use IPrincipal
 */
// tslint:disable-next-line:no-empty-interface
export interface IIdentityResource extends IPrincipal { }

export interface PolicyProps {
  /**
   * The name of the policy. If you specify multiple policies for an entity,
   * specify unique names. For example, if you specify a list of policies for
   * an IAM role, each policy must have a unique name.
   *
   * @default Uses the logical ID of the policy resource, which is ensured to
   *      be unique within the stack.
   */
  policyName?: string;

  /**
   * Users to attach this policy to.
   * You can also use `attachToUser(user)` to attach this policy to a user.
   */
  users?: User[];

  /**
   * Roles to attach this policy to.
   * You can also use `attachToRole(role)` to attach this policy to a role.
   */
  roles?: Role[];

  /**
   * Groups to attach this policy to.
   * You can also use `attachToGroup(group)` to attach this policy to a group.
   */
  groups?: Group[];

  /**
   * Initial set of permissions to add to this policy document.
   * You can also use `addPermission(statement)` to add permissions later.
   */
  statements?: PolicyStatement[];
}

/**
 * The AWS::IAM::Policy resource associates an IAM policy with IAM users, roles,
 * or groups. For more information about IAM policies, see [Overview of IAM
 * Policies](http://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html)
 * in the IAM User Guide guide.
 */
export class Policy extends Construct implements IDependable {
  /**
   * The policy document.
   */
  public readonly document = new PolicyDocument();

  /**
   * The name of this policy.
   */
  public readonly policyName: string;

  /**
   * Lists all the elements consumers should "depend-on".
   */
  public readonly dependencyElements: IDependable[];

  private readonly roles = new Array<Role>();
  private readonly users = new Array<User>();
  private readonly groups = new Array<Group>();

  constructor(parent: Construct, name: string, props: PolicyProps = {}) {
    super(parent, name);

    const resource = new cloudformation.PolicyResource(this, 'Resource', {
      policyDocument: this.document,
      policyName: new Token(() => this.policyName),
      roles: undefinedIfEmpty(() => this.roles.map(r => r.roleName)),
      users: undefinedIfEmpty(() => this.users.map(u => u.userName)),
      groups: undefinedIfEmpty(() => this.groups.map(g => g.groupName)),
    });

    // generatePolicyName will take the last 128 characters of the logical id since
    // policy names are limited to 128. the last 8 chars are a stack-unique hash, so
    // that shouod be sufficient to ensure uniqueness within a principal.
    this.policyName = props.policyName || generatePolicyName(resource.logicalId);
    this.dependencyElements = [ resource ];

    if (props.users) {
      props.users.forEach(u => this.attachToUser(u));
    }

    if (props.groups) {
      props.groups.forEach(g => this.attachToGroup(g));
    }

    if (props.roles) {
      props.roles.forEach(r => this.attachToRole(r));
    }

    if (props.statements) {
      props.statements.forEach(p => this.addStatement(p));
    }
  }

  /**
   * Adds a statement to the policy document.
   */
  public addStatement(statement: PolicyStatement) {
    this.document.addStatement(statement);
  }

  /**
   * Attaches this policy to a user.
   */
  public attachToUser(user: User) {
    if (this.users.find(u => u === user)) { return; }
    this.users.push(user);
    user.attachInlinePolicy(this);
  }

  /**
   * Attaches this policy to a role.
   */
  public attachToRole(role: Role) {
    if (this.roles.find(r => r === role)) { return; }
    this.roles.push(role);
    role.attachInlinePolicy(this);
  }

  /**
   * Attaches this policy to a group.
   */
  public attachToGroup(group: Group) {
    if (this.groups.find(g => g === group)) { return; }
    this.groups.push(group);
    group.attachInlinePolicy(this);
  }

  public validate(): string[] {
    const result = new Array<string>();

    // validate that the policy document is not empty
    if (this.document.isEmpty) {
      result.push('Policy is empty. You must add statements to the policy');
    }

    // validate that the policy is attached to at least one principal (role, user or group).
    if (this.groups.length + this.users.length + this.roles.length === 0) {
      result.push(`Policy must be attached to at least one principal: user, group or role`);
    }

    return result;
  }
}
