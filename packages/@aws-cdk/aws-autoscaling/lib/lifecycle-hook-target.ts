// eslint-disable-next-line import/order
import { LifecycleHook } from './lifecycle-hook';
import * as iam from '@aws-cdk/aws-iam';

// keep this import separate from other imports to reduce chance for merge conflicts with v2-main
// eslint-disable-next-line no-duplicate-imports, import/order
import * as constructs from 'constructs';

export interface BindHookTargetOptions {
  readonly lifecycleHook: LifecycleHook;
  readonly role?: iam.IRole;
}

export interface BindHookTargetResult {
  readonly createdRole: iam.IRole;
  readonly notificationTargetArn: string;
}

/**
 * Interface for autoscaling lifecycle hook targets
 */
export interface ILifecycleHookTarget {
  /**
   * Called when this object is used as the target of a lifecycle hook
   * @param options [disable-awslint:ref-via-interface] The lifecycle hook to attach to and a role to use
   */
  bind(scope: constructs.Construct, options: BindHookTargetOptions): BindHookTargetResult;
  //bind(scope: Construct, lifecycleHook: ILifecycleHook): LifecycleHookTargetConfig;
}

export function createRole(scope: constructs.Construct, _role?: iam.IRole) {
  let role = _role;
  if (!role) {
    role = new iam.Role(scope, 'Role', {
      assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
    });
  }

  return role;
}

/**
 * Properties to add the target to a lifecycle hook
 */
export interface LifecycleHookTargetConfig {
  /**
   * The ARN to use as the notification target
   */
  readonly notificationTargetArn: string;
}
