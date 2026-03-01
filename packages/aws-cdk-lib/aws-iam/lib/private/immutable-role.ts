import type { Construct } from 'constructs';
import { Dependable, DependencyGroup } from 'constructs';
import { Resource } from '../../../core';
import { addConstructMetadata, MethodMetadata } from '../../../core/lib/metadata-resource';
import { propertyInjectable } from '../../../core/lib/prop-injectable';
import type { Grant } from '../grant';
import type { RoleReference } from '../iam.generated';
import type { IManagedPolicy } from '../managed-policy';
import type { Policy } from '../policy';
import type { PolicyStatement } from '../policy-statement';
import type { AddToPrincipalPolicyResult, IPrincipal } from '../principals';
import type { IRole } from '../role';

/**
 * An immutable wrapper around an IRole
 *
 * This wrapper ignores all mutating operations, like attaching policies or
 * adding policy statements.
 *
 * Useful in cases where you want to turn off CDK's automatic permissions
 * management, and instead have full control over all permissions.
 *
 * Note: if you want to ignore all mutations for an externally defined role
 * which was imported into the CDK with `Role.fromRoleArn`, you don't have to use this class -
 * simply pass the property mutable = false when calling `Role.fromRoleArn`.
 */
@propertyInjectable
export class ImmutableRole extends Resource implements IRole {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-iam.ImmutableRole';
  public readonly assumeRoleAction: string;
  public readonly policyFragment: any;
  public readonly grantPrincipal: IPrincipal;
  public readonly principalAccount: string | undefined;
  public readonly roleArn: string;
  public readonly roleName: string;
  private readonly _stack: IRole['stack'];

  constructor(scope: Construct, id: string, private readonly role: IRole, private readonly addGrantsToResources: boolean) {
    super(scope, id, {
      account: role.env.account,
      region: role.env.region,
    });

    this.assumeRoleAction = this.role.assumeRoleAction;
    this.policyFragment = this.role.policyFragment;
    this.grantPrincipal = this;
    this.principalAccount = this.role.principalAccount;
    this.roleArn = this.role.roleArn;
    this.roleName = this.role.roleName;
    this._stack = this.role.stack;

    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, role);

    // implement IDependable privately
    Dependable.implement(this, {
      dependencyRoots: [role],
    });
    this.node.defaultChild = role.node.defaultChild;
  }

  public get stack() {
    return this._stack;
  }

  public get roleRef(): RoleReference {
    return {
      roleName: this.roleName,
      roleArn: this.roleArn,
    };
  }

  @MethodMetadata()
  public attachInlinePolicy(_policy: Policy): void {
    // do nothing
  }

  @MethodMetadata()
  public addManagedPolicy(_policy: IManagedPolicy): void {
    // do nothing
  }

  @MethodMetadata()
  public addToPolicy(statement: PolicyStatement): boolean {
    return this.addToPrincipalPolicy(statement).statementAdded;
  }

  @MethodMetadata()
  public addToPrincipalPolicy(_statement: PolicyStatement): AddToPrincipalPolicyResult {
    // If we return `false`, the grants will try to add the statement to the resource
    // (if possible).
    const pretendSuccess = !this.addGrantsToResources;
    return { statementAdded: pretendSuccess, policyDependable: new DependencyGroup() };
  }

  @MethodMetadata()
  public grant(grantee: IPrincipal, ...actions: string[]): Grant {
    return this.role.grant(grantee, ...actions);
  }

  @MethodMetadata()
  public grantPassRole(grantee: IPrincipal): Grant {
    return this.role.grantPassRole(grantee);
  }

  @MethodMetadata()
  public grantAssumeRole(identity: IPrincipal): Grant {
    return this.role.grantAssumeRole(identity);
  }
}
