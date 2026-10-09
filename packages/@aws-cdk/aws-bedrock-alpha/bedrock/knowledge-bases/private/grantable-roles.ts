import { type CfnResource, Reference, Tokenization, ValidationError } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { IConstruct } from 'constructs';

const recordedRoleRefs = new WeakMap<CfnResource, iam.IRoleRef & iam.IGrantable>();

/**
 * Finds the grantable role behind a role ARN configured on a resource, in two steps:
 * the role reference for the ARN, then the grantable for that role reference.
 */
export class GrantableRoles {
  /** Records the role reference that `resource`'s role ARN was taken from. */
  public static recordRoleRef(resource: CfnResource, roleRef: iam.IRoleRef & iam.IGrantable): void {
    recordedRoleRefs.set(resource, roleRef);
  }

  /** The role to grant to for `roleArn`. */
  public static forRoleArn(resource: CfnResource, roleArn: string): iam.IRoleRef & iam.IGrantable {
    return grantableFor(resource, roleRefFor(resource, roleArn));
  }
}

/**
 * The role reference for `roleArn`: the one recorded for `resource`, or the `iam.CfnRole` the ARN references.
 */
function roleRefFor(resource: CfnResource, roleArn: string): (iam.IRoleRef & iam.IGrantable) | iam.CfnRole {
  const recorded = recordedRoleRefs.get(resource);
  if (recorded !== undefined && recorded.roleRef.roleArn === roleArn) {
    return recorded;
  }

  const reversed = Tokenization.reverse(roleArn, { failConcat: false });
  if (Reference.isReference(reversed) && iam.CfnRole.isCfnRole(reversed.target)) {
    return reversed.target;
  }

  throw new ValidationError(
    lit`RoleNotFoundForArn`,
    'cannot determine the role for roleArn; it must reference an iam.Role defined in this app',
    resource,
  );
}

/**
 * The grantable for `roleRef`: the reference itself, or the role construct whose
 * default child is the `iam.CfnRole`.
 */
function grantableFor(resource: CfnResource, roleRef: (iam.IRoleRef & iam.IGrantable) | iam.CfnRole): iam.IRoleRef & iam.IGrantable {
  if (!iam.CfnRole.isCfnRole(roleRef)) {
    return roleRef;
  }

  const owner = roleRef.node.scope;
  if (owner !== undefined && isGrantableRole(owner) && owner.node.defaultChild === roleRef) {
    return owner;
  }

  throw new ValidationError(
    lit`RoleNotGrantable`,
    `role ${roleRef.node.path} is a bare iam.CfnRole, which cannot be granted permissions; use an iam.Role, or a construct implementing iam.IRoleRef and iam.IGrantable whose default child is the iam.CfnRole`,
    resource,
  );
}

function isGrantableRole(construct: IConstruct): construct is IConstruct & iam.IRoleRef & iam.IGrantable {
  return (construct as Partial<iam.IRoleRef>).roleRef !== undefined
    && (construct as Partial<iam.IGrantable>).grantPrincipal?.addToPrincipalPolicy !== undefined;
}
