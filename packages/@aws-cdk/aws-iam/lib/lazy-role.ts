import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import { Grant } from './grant';
import { IManagedPolicy } from './managed-policy';
import { Policy } from './policy';
import { PolicyStatement } from './policy-statement';
import { AddToPrincipalPolicyResult, IPrincipal, PrincipalPolicyFragment } from './principals';
import { IRole, Role, RoleProps } from './role';

/**
 * Properties for defining a LazyRole
 */
export interface LazyRoleProps extends RoleProps {

}

/**
 * An IAM role that only gets attached to the construct tree once it gets used, not before
 *
 * This construct can be used to simplify logic in other constructs
 * which need to create a role but only if certain configurations occur
 * (such as when AutoScaling is configured). The role can be configured in one
 * place, but if it never gets used it doesn't get instantiated and will
 * not be synthesized or deployed.
 *
 * @resource AWS::IAM::Role
 */
export class LazyRole extends cdk.Resource implements IRole {
  public readonly grantPrincipal: IPrincipal = this;
  public readonly principalAccount: string | undefined = this.env.account;
  public readonly assumeRoleAction: string = 'sts:AssumeRole';

  private role?: Role;
  private readonly statements = new Array<PolicyStatement>();
  private readonly policies = new Array<Policy>();
  private readonly managedPolicies = new Array<IManagedPolicy>();

  constructor(scope: Construct, id: string, private readonly props: LazyRoleProps) {
    super(scope, id);
  }

  /**
   * Adds a permission to the role's default policy document.
   * If there is no default policy attached to this role, it will be created.
   * @param statement The permission statement to add to the policy document
   */
  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    if (this.role) {
      return this.role.addToPrincipalPolicy(statement);
    } else {
      this.statements.push(statement);
      return { statementAdded: true, policyDependable: this };
    }
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
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
   * @param policy The managed policy to attach.
   */
  public addManagedPolicy(policy: IManagedPolicy): void {
    if (this.role) {
      this.role.addManagedPolicy(policy);
    } else {
      this.managedPolicies.push(policy);
    }
  }

  /**
   * Returns the ARN of this role.
   */
  public get roleArn(): string {
    return this.instantiate().roleArn;
  }

  /**
   * Returns the stable and unique string identifying the role (i.e. AIDAJQABLZS4A3QDU576Q)
   *
   * @attribute
   */
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

  /**
   * Grant permissions to the given principal to assume this role.
   */
  public grantAssumeRole(identity: IPrincipal): Grant {
    return this.instantiate().grantAssumeRole(identity);
  }

  private instantiate(): Role {
    if (!this.role) {
      const role = new Role(this, 'Default', this.props);
      this.statements.forEach(role.addToPolicy.bind(role));
      this.policies.forEach(role.attachInlinePolicy.bind(role));
      this.managedPolicies.forEach(role.addManagedPolicy.bind(role));
      this.role = role;
    }
    return this.role;
  }
}
