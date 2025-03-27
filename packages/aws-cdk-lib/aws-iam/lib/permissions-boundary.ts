import { IConstruct } from 'constructs';
import { CfnRole, CfnUser } from './iam.generated';
import { IManagedPolicy } from './managed-policy';
import { AspectPriority, Aspects, CfnResource, FeatureFlags } from '../../core';
import * as cxapi from '../../cx-api';

/**
 * Modify the Permissions Boundaries of Users and Roles in a construct tree
 *
 * ```ts
 * const policy = iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess');
 * iam.PermissionsBoundary.of(this).apply(policy);
 * ```
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
    Aspects.of(this.scope).add({
      visit(node: IConstruct) {
        if (
          CfnResource.isCfnResource(node) &&
            (node.cfnResourceType == CfnRole.CFN_RESOURCE_TYPE_NAME || node.cfnResourceType == CfnUser.CFN_RESOURCE_TYPE_NAME)
        ) {
          node.addPropertyOverride('PermissionsBoundary', boundaryPolicy.managedPolicyArn);
        }
      },
    }, {
      priority: FeatureFlags.of(this.scope).isEnabled(cxapi.ASPECT_PRIORITIES_MUTATING) ? AspectPriority.MUTATING : undefined,
    });
  }

  /**
   * Remove previously applied Permissions Boundaries
   */
  public clear() {
    Aspects.of(this.scope).add({
      visit(node: IConstruct) {
        if (
          CfnResource.isCfnResource(node) &&
            (node.cfnResourceType == CfnRole.CFN_RESOURCE_TYPE_NAME || node.cfnResourceType == CfnUser.CFN_RESOURCE_TYPE_NAME)
        ) {
          node.addPropertyDeletionOverride('PermissionsBoundary');
        }
      },
    }, {
      priority: FeatureFlags.of(this.scope).isEnabled(cxapi.ASPECT_PRIORITIES_MUTATING) ? AspectPriority.MUTATING : undefined,
    });
  }
}
