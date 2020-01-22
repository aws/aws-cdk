import { Construct, IResolveContext, Lazy, Resource, Stack} from '@aws-cdk/core';
import { IGroup } from './group';
import { CfnManagedPolicy } from './iam.generated';
import { PolicyDocument } from './policy-document';
import { PolicyStatement } from './policy-statement';
import { IRole } from './role';
import { IUser } from './user';
import { undefinedIfEmpty } from './util';

/**
 * A managed policy
 */
export interface IManagedPolicy {
  /**
   * The ARN of the managed policy
   * @attribute
   */
  readonly managedPolicyArn: string;
}

export interface ManagedPolicyProps {
  /**
   * The name of the managed policy. If you specify multiple policies for an entity,
   * specify unique names. For example, if you specify a list of policies for
   * an IAM role, each policy must have a unique name.
   *
   * @default - A name is automatically generated.
   */
  readonly managedPolicyName?: string;

  /**
   * A description of the managed policy. Typically used to store information about the
   * permissions defined in the policy. For example, "Grants access to production DynamoDB tables."
   * The policy description is immutable. After a value is assigned, it cannot be changed.
   *
   * @default - empty
   */
  readonly description?: string;

  /**
   * The path for the policy. This parameter allows (through its regex pattern) a string of characters
   * consisting of either a forward slash (/) by itself or a string that must begin and end with forward slashes.
   * In addition, it can contain any ASCII character from the ! (\u0021) through the DEL character (\u007F),
   * including most punctuation characters, digits, and upper and lowercased letters.
   *
   * For more information about paths, see IAM Identifiers in the IAM User Guide.
   *
   * @default - "/"
   */
  readonly path?: string;

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
 * Managed policy
 *
 */
export class ManagedPolicy extends Resource implements IManagedPolicy {
  /**
   * Construct a customer managed policy from the managedPolicyName
   *
   * For this managed policy, you only need to know the name to be able to use it.
   *
   */
  public static fromManagedPolicyName(scope: Construct, id: string, managedPolicyName: string): IManagedPolicy {
    class Import extends Resource implements IManagedPolicy {
      public readonly managedPolicyArn = Stack.of(scope).formatArn({
        service: "iam",
        region: "", // no region for managed policy
        account: Stack.of(scope).account, // Can this be something the user specifies?
        resource: "policy",
        resourceName: managedPolicyName
      });
    }
    return new Import(scope, id);
  }

  /**
   * Construct a managed policy from one of the policies that AWS manages
   *
   * For this managed policy, you only need to know the name to be able to use it.
   *
   * Some managed policy names start with "service-role/", some start with
   * "job-function/", and some don't start with anything. Do include the
   * prefix when constructing this object.
   */
  public static fromAwsManagedPolicyName(managedPolicyName: string): IManagedPolicy {
    class AwsManagedPolicy implements IManagedPolicy {
      public readonly managedPolicyArn = Lazy.stringValue({
        produce(ctx: IResolveContext) {
          return Stack.of(ctx.scope).formatArn({
            service: "iam",
            region: "", // no region for managed policy
            account: "aws", // the account for a managed policy is 'aws'
            resource: "policy",
            resourceName: managedPolicyName
          });
        }
      });
    }
    return new AwsManagedPolicy();
  }

  /**
   * Returns the ARN of this managed policy.
   *
   * @attribute
   */
  public readonly managedPolicyArn: string;

  /**
   * The policy document.
   */
  public readonly document = new PolicyDocument();

  /**
   * The name of this policy.
   *
   * @attribute
   */
  public readonly managedPolicyName: string;

  /**
   * The description of this policy.
   *
   * @attribute
   */
  public readonly description: string;

  /**
   * The path of this policy.
   *
   * @attribute
   */
  public readonly path: string;

  private readonly roles = new Array<IRole>();
  private readonly users = new Array<IUser>();
  private readonly groups = new Array<IGroup>();

  constructor(scope: Construct, id: string, props: ManagedPolicyProps = {}) {
    super(scope, id, {
      physicalName: props.managedPolicyName
    });

    this.description = props.description || '';
    this.path = props.path || '/';

    const resource = new CfnManagedPolicy(this, 'Resource', {
      policyDocument: this.document,
      managedPolicyName: this.physicalName,
      description: this.description,
      path: this.path,
      roles: undefinedIfEmpty(() => this.roles.map(r => r.roleName)),
      users: undefinedIfEmpty(() => this.users.map(u => u.userName)),
      groups: undefinedIfEmpty(() => this.groups.map(g => g.groupName)),
    });

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

    // arn:aws:iam::123456789012:policy/teststack-CreateTestDBPolicy-16M23YE3CS700
    this.managedPolicyName = this.getResourceNameAttribute(Stack.of(this).parseArn(resource.ref, '/').resourceName!);
    this.managedPolicyArn = this.getResourceArnAttribute(resource.ref, {
      region: '', // IAM is global in each partition
      service: 'iam',
      resource: 'policy',
      resourceName: this.physicalName,
    });
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
  }

  /**
   * Attaches this policy to a role.
   */
  public attachToRole(role: IRole) {
    if (this.roles.find(r => r === role)) { return; }
    this.roles.push(role);
  }

  /**
   * Attaches this policy to a group.
   */
  public attachToGroup(group: IGroup) {
    if (this.groups.find(g => g === group)) { return; }
    this.groups.push(group);
  }

  protected validate(): string[] {
    const result = new Array<string>();

    // validate that the policy document is not empty
    if (this.document.isEmpty) {
      result.push('Managed Policy is empty. You must add statements to the policy');
    }

    return result;
  }
}
