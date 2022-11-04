// eslint-disable-next-line import/order
import { LifecycleHook } from './lifecycle-hook';
import * as iam from '@aws-cdk/aws-iam';
import * as constructs from 'constructs';

/**
 * Options needed to bind a target to a lifecycle hook.
 * [disable-awslint:ref-via-interface] The lifecycle hook to attach to and an IRole to use
 */
export interface BindHookTargetOptions {
  /**
   * The lifecycle hook to attach to.
   * [disable-awslint:ref-via-interface]
   */
  readonly lifecycleHook: LifecycleHook;
  /**
   * The role to use when attaching to the lifecycle hook.
   * [disable-awslint:ref-via-interface]
   * @default: a role is not created unless the target arn is specified
   */
  readonly role?: iam.IRole;
}

/**
 * Result of binding a lifecycle hook to a target.
 */
export interface LifecycleHookTargetConfig {
  /**
   * The IRole that was used to bind the lifecycle hook to the target
   */
  readonly createdRole: iam.IRole;
  /**
   * The targetArn that the lifecycle hook was bound to
   */
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
  bind(scope: constructs.Construct, options: BindHookTargetOptions): LifecycleHookTargetConfig;
}
