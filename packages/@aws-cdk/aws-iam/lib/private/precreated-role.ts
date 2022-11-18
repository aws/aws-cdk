import { Resource, Stack } from '@aws-cdk/core';
import { PolicySynthesizer } from '@aws-cdk/core/lib/helpers-internal';
import { Construct, Dependable, DependencyGroup } from 'constructs';
import { Grant } from '../grant';
import { IManagedPolicy } from '../managed-policy';
import { Policy } from '../policy';
import { PolicyDocument } from '../policy-document';
import { PolicyStatement } from '../policy-statement';
import { AddToPrincipalPolicyResult, IPrincipal, PrincipalPolicyFragment } from '../principals';
import { IRole } from '../role';

/**
 * Options for a precreated role
 */
export interface PrecreatedRoleProps {
  /**
   * The base role to use for the precreated role. In most cases this will be
   * the `Role` or `IRole` that is being created by a construct. For example,
   * users (or constructs) will create an IAM role with `new Role(this, 'MyRole', {...})`.
   * That `Role` will be used as the base role for the `PrecreatedRole` meaning it be able
   * to access any methods and properties on the base role.
   */
  readonly role: IRole;

  /**
   * The assume role (trust) policy for the precreated role.
   *
   * @default - no assume role policy
   */
  readonly assumeRolePolicy?: PolicyDocument;

  /**
   * If the role is missing from the precreatedRole context
   *
   * @default false
   */
  readonly missing?: boolean;

  /**
   * The construct path to display in the report.
   * This should be the path that the user can trace to the
   * role being created in their application
   *
   * @default the construct path of this construct
   */
  readonly rolePath?: string;

}

/**
 * An IAM role that has been created outside of CDK and can be
 * used in place of a role that CDK _is_ creating.
 *
 * When any policy is attached to a precreated role the policy will be
 * synthesized into a separate report and will _not_ be synthesized in
 * the CloudFormation template.
 */
export class PrecreatedRole extends Resource implements IRole {
  public readonly assumeRoleAction: string;
  public readonly policyFragment: PrincipalPolicyFragment;
  public readonly grantPrincipal = this;
  public readonly principalAccount?: string;
  public readonly roleArn: string;
  public readonly roleName: string;
  public readonly stack: Stack;

  private readonly policySynthesizer: PolicySynthesizer;
  private readonly policyStatements: string[] = [];
  private readonly managedPolicies: IManagedPolicy[] = [];

  private readonly role: IRole;
  constructor(scope: Construct, id: string, props: PrecreatedRoleProps) {
    super(scope, id, {
      account: props.role.env.account,
      region: props.role.env.region,
    });
    this.role = props.role;
    this.assumeRoleAction = this.role.assumeRoleAction;
    this.policyFragment = this.role.policyFragment;
    this.principalAccount = this.role.principalAccount;
    this.roleArn = this.role.roleArn;
    this.roleName = this.role.roleName;
    this.stack = this.role.stack;
    const rolePath = props.rolePath ?? this.node.path;

    Dependable.implement(this, {
      dependencyRoots: [this.role],
    });

    // add a single PolicySynthesizer under the `App` scope
    this.policySynthesizer = PolicySynthesizer.getOrCreate(this);
    this.policySynthesizer.addRole(rolePath, {
      roleName: this.roleName,
      managedPolicies: this.managedPolicies,
      policyStatements: this.policyStatements,
      assumeRolePolicy: Stack.of(this).resolve(props.assumeRolePolicy?.toJSON()?.Statement),
      missing: props.missing,
    });
  }

  public attachInlinePolicy(policy: Policy): void {
    const statements = policy.document.toJSON()?.Statement;
    if (statements && Array.isArray(statements)) {
      statements.forEach(statement => {
        this.policyStatements.push(statement);
      });
    }
  }

  public addManagedPolicy(policy: IManagedPolicy): void {
    this.managedPolicies.push(policy);
  }

  public addToPolicy(statement: PolicyStatement): boolean {
    this.policyStatements.push(statement.toStatementJson());
    return false;
  }

  public addToPrincipalPolicy(statement: PolicyStatement): AddToPrincipalPolicyResult {
    this.addToPolicy(statement);
    // If we return `false`, the grants will try to add the statement to the resource
    // (if possible).
    return { statementAdded: true, policyDependable: new DependencyGroup() };
  }

  public grant(grantee: IPrincipal, ...actions: string[]): Grant {
    return this.role.grant(grantee, ...actions);
  }

  public grantPassRole(grantee: IPrincipal): Grant {
    return this.role.grantPassRole(grantee);
  }

  public grantAssumeRole(identity: IPrincipal): Grant {
    return this.role.grantAssumeRole(identity);
  }
}
