import { Grant } from './grant';
import { IManagedPolicy } from './managed-policy';
import { Policy } from './policy';
import { PolicyStatement } from './policy-statement';
import { IPrincipal } from './principals';
import { IRole } from './role';
import { DependableTrait } from '@aws-cdk/core';

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
 * which was imported into the CDK with {@link Role.fromRoleArn}, you don't have to use this class -
 * simply pass the property mutable = false when calling {@link Role.fromRoleArn}.
 */
export class ImmutableRole implements IRole {
  public readonly assumeRoleAction = this.role.assumeRoleAction;
  public readonly policyFragment = this.role.policyFragment;
  public readonly grantPrincipal = this.role.grantPrincipal;
  public readonly roleArn = this.role.roleArn;
  public readonly roleName = this.role.roleName;
  public readonly node = this.role.node;
  public readonly stack = this.role.stack;

  constructor(private readonly role: IRole) {
    // implement IDependable privately
    DependableTrait.implement(this, {
      dependencyRoots: [ role ]
    });
  }

  public attachInlinePolicy(_policy: Policy): void {
    // do nothing
  }

  public addManagedPolicy(_policy: IManagedPolicy): void {
    // do nothing
  }

  public addToPolicy(_statement: PolicyStatement): boolean {
    // Not really added, but for the purposes of consumer code pretend that it was.
    return true;
  }

  public grant(grantee: IPrincipal, ...actions: string[]): Grant {
    return this.role.grant(grantee, ...actions);
  }

  public grantPassRole(grantee: IPrincipal): Grant {
    return this.role.grantPassRole(grantee);
  }
}