import { Construct, IResource, Lazy, Resource } from '@aws-cdk/core';
import { IGroup } from './group';
import { CfnPolicy } from './iam.generated';
import { PolicyDocument } from './policy-document';
import { PolicyStatement } from './policy-statement';
import { IRole } from './role';
import { IUser } from './user';
import { generatePolicyName, undefinedIfEmpty } from './util';

export interface IPolicy extends IResource {
  /**
   * @attribute
   */
  readonly policyName: string;
}

export interface PolicyProps {
  /**
   * The name of the policy. If you specify multiple policies for an entity,
   * specify unique names. For example, if you specify a list of policies for
   * an IAM role, each policy must have a unique name.
   *
   * @default - Uses the logical ID of the policy resource, which is ensured
   * to be unique within the stack.
   */
  readonly policyName?: string;

  /**
   * Users to attach this policy to.
   * You can also use `attachToUser(user)` to attach this policy to a user.
   *
   * @default - No users.
   */
  readonly users?: IUser[];

  /**
   * Roles to attach this policy to.
   * You can also use `attachToRole(role)` to attach this policy to a role.
   *
   * @default - No roles.
   */
  readonly roles?: IRole[];

  /**
   * Groups to attach this policy to.
   * You can also use `attachToGroup(group)` to attach this policy to a group.
   *
   * @default - No groups.
   */
  readonly groups?: IGroup[];

  /**
   * Initial set of permissions to add to this policy document.
   * You can also use `addPermission(statement)` to add permissions later.
   *
   * @default - No statements.
   */
  readonly statements?: PolicyStatement[];
}

/**
 * The AWS::IAM::Policy resource associates an IAM policy with IAM users, roles,
 * or groups. For more information about IAM policies, see [Overview of IAM
 * Policies](http://docs.aws.amazon.com/IAM/latest/UserGuide/policies_overview.html)
 * in the IAM User Guide guide.
 */
export class Policy extends Resource implements IPolicy {

  public static fromPolicyName(scope: Construct, id: string, policyName: string): IPolicy {
    class Import extends Resource implements IPolicy {
      public readonly policyName = policyName;
    }

    return new Import(scope, id);
  }

  /**
   * The policy document.
   */
  public readonly document = new PolicyDocument();

  /**
   * The name of this policy.
   *
   * @attribute
   */
  public readonly policyName: string;

  private readonly roles = new Array<IRole>();
  private readonly users = new Array<IUser>();
  private readonly groups = new Array<IGroup>();

  constructor(scope: Construct, id: string, props: PolicyProps = {}) {
    super(scope, id, {
      physicalName: props.policyName ||
        // generatePolicyName will take the last 128 characters of the logical id since
        // policy names are limited to 128. the last 8 chars are a stack-unique hash, so
        // that shouod be sufficient to ensure uniqueness within a principal.
        Lazy.stringValue({ produce: () => generatePolicyName(scope, resource.logicalId) })
    });

    const resource = new CfnPolicy(this, 'Resource', {
      policyDocument: this.document,
      policyName: this.physicalName,
      roles: undefinedIfEmpty(() => this.roles.map(r => r.roleName)),
      users: undefinedIfEmpty(() => this.users.map(u => u.userName)),
      groups: undefinedIfEmpty(() => this.groups.map(g => g.groupName)),
    });

    this.policyName = this.physicalName!;

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
      props.statements.forEach(p => this.addStatements(p));
    }
  }

  /**
   * Adds a statement to the policy document.
   */
  public addStatements(...statement: PolicyStatement[]) {
    this.document.addStatements(...statement);
  }

  /**
   * Attaches this policy to a user.
   */
  public attachToUser(user: IUser) {
    if (this.users.find(u => u === user)) { return; }
    this.users.push(user);
    user.attachInlinePolicy(this);
  }

  /**
   * Attaches this policy to a role.
   */
  public attachToRole(role: IRole) {
    if (this.roles.find(r => r === role)) { return; }
    this.roles.push(role);
    role.attachInlinePolicy(this);
  }

  /**
   * Attaches this policy to a group.
   */
  public attachToGroup(group: IGroup) {
    if (this.groups.find(g => g === group)) { return; }
    this.groups.push(group);
    group.attachInlinePolicy(this);
  }

  protected validate(): string[] {
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
