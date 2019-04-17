import cdk = require('@aws-cdk/cdk');
import { Grant } from './grant';
import { Policy } from './policy';
import { PolicyStatement, PrincipalPolicyFragment } from './policy-document';
import { IPrincipal } from './principals';
import { IRole, Role, RoleImportProps, RoleProps } from './role';

/**
 * An IAM role that only gets attached to the construct tree once it gets used, not before
 *
 * This construct can be used to simplify logic in other constructs
 * which need to create a role but only if certain configurations occur
 * (such as when AutoScaling is configured). The role can be configured in one
 * place, but if it never gets used it doesn't get instantiated and will
 * not be synthesized or deployed.
 */
export class LazyRole extends cdk.Construct implements IRole {
  public readonly grantPrincipal: IPrincipal = this;
  public readonly assumeRoleAction: string = 'sts:AssumeRole';
  private role?: Role;
  private readonly statements = new Array<PolicyStatement>();
  private readonly policies = new Array<Policy>();
  private readonly managedPolicies = new Array<string>();

  constructor(scope: cdk.Construct, id: string, private readonly props: RoleProps) {
    super(scope, id);
  }

  public export(): RoleImportProps {
    return this.instantiate().export();
  }

  /**
   * Adds a permission to the role's default policy document.
   * If there is no default policy attached to this role, it will be created.
   * @param statement The permission statement to add to the policy document
   */
  public addToPolicy(statement: PolicyStatement): boolean {
    if (this.role) {
      return this.role.addToPolicy(statement);
    } else {
      this.statements.push(statement);
      return true;
    }
  }

  /**
   * Attaches a policy to this role.
   * @param policy The policy to attach
   */
  public attachInlinePolicy(policy: Policy): void {
    if (this.role) {
      this.role.attachInlinePolicy(policy);
    } else {
      this.policies.push(policy);
    }
  }

  /**
   * Attaches a managed policy to this role.
   * @param arn The ARN of the managed policy to attach.
   */
  public attachManagedPolicy(arn: string): void {
    if (this.role) {
      this.role.attachManagedPolicy(arn);
    } else {
      this.managedPolicies.push(arn);
    }
  }

  /**
   * Returns the ARN of this role.
   */
  public get roleArn(): string {
    return this.instantiate().roleArn;
  }

  public get roleId(): string {
    return this.instantiate().roleId;
  }

  public get roleName(): string {
    return this.instantiate().roleName;
  }

  public get policyFragment(): PrincipalPolicyFragment {
    return this.instantiate().policyFragment;
  }

  /**
   * Grant the actions defined in actions to the identity Principal on this resource.
   */
  public grant(identity: IPrincipal, ...actions: string[]): Grant {
    return this.instantiate().grant(identity, ...actions);
  }

  /**
   * Grant permissions to the given principal to pass this role.
   */
  public grantPassRole(identity: IPrincipal): Grant {
    return this.instantiate().grantPassRole(identity);
  }

  private instantiate(): Role {
    if (!this.role) {
      const role = new Role(this, 'Default', this.props);
      this.statements.forEach(role.addToPolicy.bind(role));
      this.policies.forEach(role.attachInlinePolicy.bind(role));
      this.managedPolicies.forEach(role.attachManagedPolicy.bind(role));
      this.role = role;
    }
    return this.role;
  }
}
