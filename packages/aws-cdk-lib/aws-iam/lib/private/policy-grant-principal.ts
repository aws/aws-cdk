import { Stack } from '../../../core';
import { ManagedPolicy } from '../managed-policy';
import { Policy } from '../policy';
import { PolicyStatement } from '../policy-statement';
import { AddToPrincipalPolicyResult, ArnPrincipal, IPrincipal, PrincipalPolicyFragment } from '../principals';

export class PolicyGrantPrincipal implements IPrincipal {
  public readonly grantPrincipal: IPrincipal = this;
  public readonly assumeRoleAction = 'sts:AssumeRole';
  public readonly policyFragment: PrincipalPolicyFragment;
  public readonly principalAccount?: string | undefined;

  constructor(public readonly _policy: Policy) {
    const dummyArn = Stack.of(_policy).formatArn({ service: 'iam', resource: 'dummy-policy', resourceName: _policy.node.path });
    this.principalAccount = _policy.env.account;
    this.policyFragment = new ArnPrincipal(dummyArn).policyFragment;
  }

  /**
   * Adds an IAM statement to the policy document.
   */
  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    this._policy.addStatements(statement);
    return { statementAdded: true, policyDependable: this };
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }
}

export class ManagedPolicyGrantPrincipal implements IPrincipal {
  public readonly grantPrincipal: IPrincipal = this;
  public readonly assumeRoleAction = 'sts:AssumeRole';
  public readonly policyFragment: PrincipalPolicyFragment;
  public readonly principalAccount?: string | undefined;

  constructor(public readonly _managedPolicy: ManagedPolicy) {
    this.principalAccount = _managedPolicy.env.account;
    this.policyFragment = new ArnPrincipal(_managedPolicy.managedPolicyArn).policyFragment;
  }

  /**
   * Adds an IAM statement to the policy document.
   */
  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    this._managedPolicy.addStatements(statement);
    return { statementAdded: true, policyDependable: this };
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }
}
