import { ConstructNode, Stack } from "@aws-cdk/core";
import { Grant } from './grant';
import { IGroup } from './group';
import { IManagedPolicy } from './managed-policy';
import { IPolicy, PolicyProps } from './policy';
import { PolicyStatement } from './policy-statement';
import { IPrincipal } from './principals';
import { IRole } from './role';
import { IUser } from './user';

/**
 * An immutable wrapper around an IRole that ignores all mutating operations,
 * like attaching policies or adding policy statements.
 * Useful in cases where you want to turn off CDK's automatic permissions management,
 * and instead have full control over all permissions.
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
  }

  public addPolicy(_id: string, _props?: PolicyProps): IPolicy {
    return new ImmutablePolicy();
  }

  public attachInlinePolicy(_policy: IPolicy): void {
    // do nothing
  }

  public addManagedPolicy(_policy: IManagedPolicy): void {
    // do nothing
  }

  public addToPolicy(_statement: PolicyStatement): boolean {
    return false;
  }

  public grant(grantee: IPrincipal, ...actions: string[]): Grant {
    return this.role.grant(grantee, ...actions);
  }

  public grantPassRole(grantee: IPrincipal): Grant {
    return this.role.grantPassRole(grantee);
  }
}

class ImmutablePolicy implements IPolicy {
  public addStatements(..._statements: PolicyStatement[]): void {
    // do nothing
  }

  public attachToGroup(_group: IGroup): void {
    // do nothing
  }

  public attachToRole(_role: IRole): void {
    // do nothing
  }

  public attachToUser(_user: IUser): void {
    // do nothing
  }

  public get node(): ConstructNode {
    throw new Error('IConstruct.node is not implemented for ImmutablePolicy');
  }

  public get policyName(): string {
    throw new Error('IPolicy.policyName is not implemented for ImmutablePolicy');
  }

  public get stack(): Stack {
    throw new Error('IResource.stack is not implemented for ImmutablePolicy');
  }
}
