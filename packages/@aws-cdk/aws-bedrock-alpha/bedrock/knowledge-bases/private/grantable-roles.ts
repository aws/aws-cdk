import { type CfnResource, Reference, Tokenization, ValidationError } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { IConstruct } from 'constructs';

const FROM_CFN_ROLE_ID = '@FromCfnRole';

const bindings = new WeakMap<CfnResource, iam.IRoleRef & iam.IGrantable>();

/**
 * Finds the grantable role behind a role ARN configured on a resource.
 */
export class GrantableRoles {
  /** Records the role configured on `resource`, so `forRoleArn()` returns it instead of looking it up. */
  public static bind(resource: CfnResource, role: iam.IRoleRef & iam.IGrantable): void {
    bindings.set(resource, role);
  }

  /** The role to grant to for `roleArn`. */
  public static forRoleArn(resource: CfnResource, roleArn: string): iam.IRoleRef & iam.IGrantable {
    const bound = bindings.get(resource);
    if (bound !== undefined && bound.roleRef.roleArn === roleArn) {
      return bound;
    }

    const reversed = Tokenization.reverse(roleArn, { failConcat: false });
    if (!Reference.isReference(reversed) || !iam.CfnRole.isCfnRole(reversed.target)) {
      throw new ValidationError(
        lit`RoleNotFoundForArn`,
        'roleArn must reference an iam.Role or iam.CfnRole defined in this app; imported roles and parameter values are not supported',
        resource,
      );
    }
    const cfnRole = reversed.target;

    const owner = cfnRole.node.scope;
    if (owner !== undefined && iam.Role.isRole(owner) && owner.node.defaultChild === cfnRole) {
      if (hasViewWithoutPolicyUpdates(owner)) {
        throw new ValidationError(
          lit`RoleHasViewWithoutPolicyUpdates`,
          `role ${owner.node.path} is used with withoutPolicyUpdates(), so permissions cannot be granted to it automatically; use a role without a withoutPolicyUpdates() view`,
          resource,
        );
      }
      return owner;
    }

    return roleFromCfnRole(cfnRole);
  }
}

function hasViewWithoutPolicyUpdates(role: iam.Role): boolean {
  // a view from Role.withoutPolicyUpdates() is a sibling that shares the role's default child
  return (role.node.scope?.node.children ?? [])
    .some(sibling => sibling !== role && sibling.node.defaultChild === role.node.defaultChild);
}

function roleFromCfnRole(cfnRole: iam.CfnRole): iam.IRole {
  const existing = cfnRole.node.tryFindChild(FROM_CFN_ROLE_ID);
  if (existing !== undefined) {
    if (!isRole(existing) || existing.roleRef.roleName !== cfnRole.ref) {
      throw new ValidationError(
        lit`RoleAdapterIdConflict`,
        `construct ID ${JSON.stringify(FROM_CFN_ROLE_ID)} under ${cfnRole.node.path} is already used by a construct that is not a role for ${cfnRole.node.path}`,
        cfnRole,
      );
    }
    return existing;
  }
  return iam.Role.fromRoleName(cfnRole, FROM_CFN_ROLE_ID, cfnRole.ref);
}

function isRole(construct: IConstruct): construct is iam.IRole & IConstruct {
  return (construct as Partial<iam.IRoleRef>).roleRef !== undefined
    && (construct as Partial<iam.IGrantable>).grantPrincipal?.addToPrincipalPolicy !== undefined;
}
