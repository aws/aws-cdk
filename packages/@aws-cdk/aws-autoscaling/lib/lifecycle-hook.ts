import * as iam from '@aws-cdk/aws-iam';
import { Duration, IResource, Resource } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { IAutoScalingGroup } from './auto-scaling-group';
import { CfnLifecycleHook } from './autoscaling.generated';
import { ILifecycleHookTarget } from './lifecycle-hook-target';

/**
 * Basic properties for a lifecycle hook
 */
export interface BasicLifecycleHookProps {
  /**
   * Name of the lifecycle hook
   *
   * @default - Automatically generated name.
   */
  readonly lifecycleHookName?: string;

  /**
   * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs.
   *
   * @default Continue
   */
  readonly defaultResult?: DefaultResult;

  /**
   * Maximum time between calls to RecordLifecycleActionHeartbeat for the hook
   *
   * If the lifecycle hook times out, perform the action in DefaultResult.
   *
   * @default - No heartbeat timeout.
   */
  readonly heartbeatTimeout?: Duration;

  /**
   * The state of the Amazon EC2 instance to which you want to attach the lifecycle hook.
   */
  readonly lifecycleTransition: LifecycleTransition;

  /**
   * Additional data to pass to the lifecycle hook target
   *
   * @default - No metadata.
   */
  readonly notificationMetadata?: string;

  /**
   * The target of the lifecycle hook
   */
  readonly notificationTarget: ILifecycleHookTarget;

  /**
   * The role that allows publishing to the notification target
   *
   * @default - A role is automatically created.
   */
  readonly role?: iam.IRole;
}

/**
 * Properties for a Lifecycle hook
 */
export interface LifecycleHookProps extends BasicLifecycleHookProps {
  /**
   * The AutoScalingGroup to add the lifecycle hook to
   */
  readonly autoScalingGroup: IAutoScalingGroup;
}

/**
 * A basic lifecycle hook object
 */
export interface ILifecycleHook extends IResource {
  /**
   * The role for the lifecycle hook to execute
   */
  readonly role: iam.IRole;
}

/**
 * Define a life cycle hook
 */
export class LifecycleHook extends Resource implements ILifecycleHook {
  /**
   * The role that allows the ASG to publish to the notification target
   */
  public readonly role: iam.IRole;

  /**
   * The name of this lifecycle hook
   * @attribute
   */
  public readonly lifecycleHookName: string;

  constructor(scope: Construct, id: string, props: LifecycleHookProps) {
    super(scope, id, {
      physicalName: props.lifecycleHookName,
    });

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com'),
    });

    const targetProps = props.notificationTarget.bind(this, this);

    const resource = new CfnLifecycleHook(this, 'Resource', {
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      defaultResult: props.defaultResult,
      heartbeatTimeout: props.heartbeatTimeout && props.heartbeatTimeout.toSeconds(),
      lifecycleHookName: this.physicalName,
      lifecycleTransition: props.lifecycleTransition,
      notificationMetadata: props.notificationMetadata,
      notificationTargetArn: targetProps.notificationTargetArn,
      roleArn: this.role.roleArn,
    });

    // A LifecycleHook resource is going to do a permissions test upon creation,
    // so we have to make sure the role has full permissions before creating the
    // lifecycle hook.
    resource.node.addDependency(this.role);

    this.lifecycleHookName = resource.ref;
  }
}

export enum DefaultResult {
  CONTINUE = 'CONTINUE',
  ABANDON = 'ABANDON',
}

/**
 * What instance transition to attach the hook to
 */
export enum LifecycleTransition {
  /**
   * Execute the hook when an instance is about to be added
   */
  INSTANCE_LAUNCHING = 'autoscaling:EC2_INSTANCE_LAUNCHING',

  /**
   * Execute the hook when an instance is about to be terminated
   */
  INSTANCE_TERMINATING = 'autoscaling:EC2_INSTANCE_TERMINATING',
}
