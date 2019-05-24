import { ILifecycleHook } from './lifecycle-hook';

/**
 * Interface for autoscaling lifecycle hook targets
 */
export interface ILifecycleHookTarget {
  /**
   * Called when this object is used as the target of a lifecycle hook
   */
  bind(lifecycleHook: ILifecycleHook): LifecycleHookTargetProps;
}

/**
 * Properties to add the target to a lifecycle hook
 */
export interface LifecycleHookTargetProps {
  /**
   * The ARN to use as the notification target
   */
  readonly notificationTargetArn: string;
}
