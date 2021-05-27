import { CfnResource } from '@aws-cdk/core';
import { Node, IConstruct } from 'constructs';
import { CfnRole, CfnUser } from './iam.generated';
import { IManagedPolicy } from './managed-policy';

/**
 * Modify the Permissions Boundaries of Users and Roles in a construct tree
 *
 * @example
 *
 * const policy = ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess');
 * PermissionsBoundary.of(stack).apply(policy);
 */
export class PermissionsBoundary {
  /**
   * Access the Permissions Boundaries of a construct tree
   */
  public static of(scope: IConstruct): PermissionsBoundary {
    return new PermissionsBoundary(scope);
  }

  private constructor(private readonly scope: IConstruct) {
  }

  /**
   * Apply the given policy as Permissions Boundary to all Roles and Users in
   * the scope.
   *
   * Will override any Permissions Boundaries configured previously; in case
   * a Permission Boundary is applied in multiple scopes, the Boundary applied
   * closest to the Role wins.
   */
  public apply(boundaryPolicy: IManagedPolicy) {
    Node.of(this.scope).applyAspect({
      visit(node: IConstruct) {
        if (node instanceof CfnRole || node instanceof CfnUser) {
          node.permissionsBoundary = boundaryPolicy.managedPolicyArn;
        } else if (
          node instanceof CfnResource &&
            (node.cfnResourceType == CfnRole.CFN_RESOURCE_TYPE_NAME || node.cfnResourceType == CfnUser.CFN_RESOURCE_TYPE_NAME)
        ) {
          node.addPropertyOverride('PermissionsBoundary', boundaryPolicy.managedPolicyArn);
        }
      },
    });
  }

  /**
   * Remove previously applied Permissions Boundaries
   */
  public clear() {
    Node.of(this.scope).applyAspect({
      visit(node: IConstruct) {
        if (node instanceof CfnRole || node instanceof CfnUser) {
          node.permissionsBoundary = undefined;
        } else if (
          node instanceof CfnResource &&
            (node.cfnResourceType == CfnRole.CFN_RESOURCE_TYPE_NAME || node.cfnResourceType == CfnUser.CFN_RESOURCE_TYPE_NAME)
        ) {
          node.addPropertyDeletionOverride('PermissionsBoundary');
        }
      },
    });
  }
}
