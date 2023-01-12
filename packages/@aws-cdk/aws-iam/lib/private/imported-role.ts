import { FeatureFlags, Names, Resource, Token, TokenComparison, Annotations } from '@aws-cdk/core';
import { IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME } from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { Grant } from '../grant';
import { IManagedPolicy } from '../managed-policy';
import { Policy } from '../policy';
import { PolicyStatement } from '../policy-statement';
import { IComparablePrincipal, IPrincipal, ArnPrincipal, AddToPrincipalPolicyResult, PrincipalPolicyFragment } from '../principals';
import { IRole, FromRoleArnOptions } from '../role';
import { AttachedPolicies } from '../util';

export interface ImportedRoleProps extends FromRoleArnOptions {
  readonly roleArn: string;
  readonly roleName: string;
  readonly account?: string;
}

export class ImportedRole extends Resource implements IRole, IComparablePrincipal {
  public readonly grantPrincipal: IPrincipal = this;
  public readonly principalAccount?: string;
  public readonly assumeRoleAction: string = 'sts:AssumeRole';
  public readonly policyFragment: PrincipalPolicyFragment;
  public readonly roleArn: string;
  public readonly roleName: string;
  private readonly attachedPolicies = new AttachedPolicies();
  private readonly defaultPolicyName?: string;
  private defaultPolicy?: Policy;

  constructor(scope: Construct, id: string, props: ImportedRoleProps) {
    super(scope, id, {
      account: props.account,
    });

    this.roleArn = props.roleArn;
    this.roleName = props.roleName;
    this.policyFragment = new ArnPrincipal(this.roleArn).policyFragment;
    this.defaultPolicyName = props.defaultPolicyName;
    this.principalAccount = props.account;
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    if (!this.defaultPolicy) {
      const useUniqueName = FeatureFlags.of(this).isEnabled(IAM_IMPORTED_ROLE_STACK_SAFE_DEFAULT_POLICY_NAME);
      const defaultDefaultPolicyName = useUniqueName
        ? `Policy${Names.uniqueId(this)}`
        : 'Policy';
      const policyName = this.defaultPolicyName ?? defaultDefaultPolicyName;
      this.defaultPolicy = new Policy(this, policyName, useUniqueName ? { policyName } : undefined);
      this.attachInlinePolicy(this.defaultPolicy);
    }
    this.defaultPolicy.addStatements(statement);
    return { statementAdded: true, policyDependable: this.defaultPolicy };
  }

  public attachInlinePolicy(policy: Policy): void {
    const thisAndPolicyAccountComparison = Token.compareStrings(this.env.account, policy.env.account);
    const equalOrAnyUnresolved = thisAndPolicyAccountComparison === TokenComparison.SAME ||
      thisAndPolicyAccountComparison === TokenComparison.BOTH_UNRESOLVED ||
      thisAndPolicyAccountComparison === TokenComparison.ONE_UNRESOLVED;
    if (equalOrAnyUnresolved) {
      this.attachedPolicies.attach(policy);
      policy.attachToRole(this);
    }
  }

  public addManagedPolicy(policy: IManagedPolicy): void {
    Annotations.of(this).addWarning(`Not adding managed policy: ${policy.managedPolicyArn} to imported role: ${this.roleName}`);
  }

  public grantPassRole(identity: IPrincipal): Grant {
    return this.grant(identity, 'iam:PassRole');
  }

  public grantAssumeRole(identity: IPrincipal): Grant {
    return this.grant(identity, 'sts:AssumeRole');
  }

  public grant(grantee: IPrincipal, ...actions: string[]): Grant {
    return Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.roleArn],
      scope: this,
    });
  }

  public dedupeString(): string | undefined {
    return `ImportedRole:${this.roleArn}`;
  }
}
