import iam = require('@aws-cdk/aws-iam');

/**
 * A basic lifecycle hook object
 */
export interface ILifecycleHook {
  /**
   * The role for the lifecycle hook to execute
   */
  readonly role: iam.IRole;
}

/**
 * Interface for autoscaling lifecycle hook targets
 */
export interface ILifecycleHookTarget {
  /**
   * Called when this object is used as the target of a lifecycle hook
   */
  asLifecycleHookTarget(lifecycleHook: ILifecycleHook): LifecycleHookTargetProps;
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