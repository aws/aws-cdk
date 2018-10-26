import cdk = require('@aws-cdk/cdk');
import { Policy } from './policy';
import { PolicyPrincipal, PolicyStatement } from './policy-document';
import { IRole, Role, RoleProps } from './role';

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
  private role?: Role;
  private readonly statements = new Array<PolicyStatement>();
  private readonly policies = new Array<Policy>();
  private readonly managedPolicies = new Array<string>();

  constructor(parent: cdk.Construct, id: string, private readonly props: RoleProps) {
    super(parent, id);
  }

  /**
   * Adds a permission to the role's default policy document.
   * If there is no default policy attached to this role, it will be created.
   * @param permission The permission statement to add to the policy document
   */
  public addToPolicy(statement: PolicyStatement): void {
    if (this.role) {
      this.role.addToPolicy(statement);
    } else {
      this.statements.push(statement);
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
   * Returns the role.
   */
  public get dependencyElements(): cdk.IDependable[] {
    return this.instantiate().dependencyElements;
  }

  /**
   * Returns the ARN of this role.
   */
  public get roleArn(): string {
    return this.instantiate().roleArn;
  }

  /**
   * Returns a Principal object representing the ARN of this role.
   */
  public get principal(): PolicyPrincipal {
    return this.instantiate().principal;
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