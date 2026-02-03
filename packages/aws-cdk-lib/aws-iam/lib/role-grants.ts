import { Grant } from './grant';
import type { IRoleRef } from './iam.generated';
import type { IPrincipal } from './principals';
import { AccountPrincipal, ServicePrincipal } from './principals';
import { ValidationError } from '../../core';

/**
 * Collection of grant methods for a IRoleRef
 */
export class RoleGrants {
  /**
   * Creates grants for IRoleRef
   */
  public static fromRole(role: IRoleRef): RoleGrants {
    return new RoleGrants(role);
  }

  private constructor(private readonly role: IRoleRef) {
  }

  /**
   * Grant permissions to the given principal to assume this role.
   */
  public assumeRole(identity: IPrincipal): Grant {
    // Service and account principals must use assumeRolePolicy
    if (identity instanceof ServicePrincipal || identity instanceof AccountPrincipal) {
      throw new ValidationError('Cannot use a service or account principal with grantAssumeRole, use assumeRolePolicy instead.', this.role);
    }
    return Grant.addToPrincipal({
      grantee: identity,
      actions: ['sts:AssumeRole'],
      resourceArns: [this.role.roleRef.roleArn],
    });
  }

  /**
   * Grant permissions to the given principal to pass this role.
   */
  public passRole(identity: IPrincipal): Grant {
    return Grant.addToPrincipal({
      grantee: identity,
      actions: ['iam:PassRole'],
      resourceArns: [this.role.roleRef.roleArn],
    });
  }
}
