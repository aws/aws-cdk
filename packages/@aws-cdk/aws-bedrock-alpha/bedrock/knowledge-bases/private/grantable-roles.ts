import { Reference, Stage, Tokenization, UnscopedValidationError, ValidationError } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { lit } from 'aws-cdk-lib/core/lib/helpers-internal';
import type { IConstruct } from 'constructs';

const registries = new WeakMap<IConstruct, GrantableRoles>();

/**
 * Finds the grantable role for a role ARN, in two steps: the role reference for
 * the ARN, then the grantable for that role reference.
 */
export class GrantableRoles {
  /** The registry for the Stage that `construct` belongs to, or for its construct tree if there is no Stage. */
  public static of(construct: IConstruct): GrantableRoles {
    const root = Stage.of(construct) ?? construct.node.root;
    let registry = registries.get(root);
    if (registry === undefined) {
      registry = new GrantableRoles();
      registries.set(root, registry);
    }
    return registry;
  }

  private readonly roleRefsByArn = new Map<string, iam.IRoleRef>();

  private constructor() {}

  public registerRoleObject(roleArn: string, roleRef: iam.IRoleRef): void {
    this.roleRefsByArn.set(roleArn, roleRef);
  }

  /** The role to grant to for `roleArn`. */
  public forRoleArn(roleArn: string): iam.IRoleRef & iam.IGrantable {
    // The role reference: the registered one, else the role the ARN references, which is
    // the iam.Role that owns the iam.CfnRole if there is one, since a CfnRole can't be granted to
    let roleRef = this.roleRefsByArn.get(roleArn);
    if (roleRef === undefined) {
      const reversed = Tokenization.reverse(roleArn, { failConcat: false });
      if (!Reference.isReference(reversed) || !iam.CfnRole.isCfnRole(reversed.target)) {
        throw new UnscopedValidationError(
          lit`RoleNotFoundForArn`,
          'cannot determine the role for roleArn; it must reference an iam.Role defined in this app',
        );
      }
      const cfnRole = reversed.target;
      const owner = cfnRole.node.scope;
      roleRef = iam.Role.isRole(owner) && owner.node.defaultChild === cfnRole ? owner : cfnRole;
    }

    // The grantable: the role reference itself, if it can be granted to
    const grantable = roleRef as iam.IRoleRef & Partial<iam.IGrantable>;
    if (grantable.grantPrincipal?.addToPrincipalPolicy === undefined) {
      throw new ValidationError(
        lit`RoleNotGrantable`,
        `role ${roleRef.node.path} cannot be granted permissions; use an iam.Role`,
        roleRef,
      );
    }
    return grantable as iam.IRoleRef & iam.IGrantable;
  }
}
