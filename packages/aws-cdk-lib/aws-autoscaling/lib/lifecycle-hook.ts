import type { Construct } from 'constructs';
import { CfnLifecycleHook } from './autoscaling.generated';
import type { ILifecycleHookTarget } from './lifecycle-hook-target';
import type * as iam from '../../aws-iam';
import type { Duration, IResource } from '../../core';
import { Resource, ValidationError } from '../../core';
import { addConstructMetadata } from '../../core/lib/metadata-resource';
import { propertyInjectable } from '../../core/lib/prop-injectable';
import type { IAutoScalingGroupRef, ILifecycleHookRef, LifecycleHookReference } from '../../interfaces/generated/aws-autoscaling-interfaces.generated';

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
   *
   * @default - No target.
   */
  readonly notificationTarget?: ILifecycleHookTarget;

  /**
   * The role that allows publishing to the notification target
   *
   * @default - A role will be created if a target is provided. Otherwise, no role is created.
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
  readonly autoScalingGroup: IAutoScalingGroupRef;
}

/**
 * A basic lifecycle hook object
 */
export interface ILifecycleHook extends ILifecycleHookRef, IResource {
  /**
   * The role for the lifecycle hook to execute
   *
   * @default - A default role is created if 'notificationTarget' is specified.
   * Otherwise, no role is created.
   */
  readonly role: iam.IRole;
}

/**
 * Define a life cycle hook
 */
@propertyInjectable
export class LifecycleHook extends Resource implements ILifecycleHook {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = 'aws-cdk-lib.aws-autoscaling.LifecycleHook';
  private _role?: iam.IRole;
  private readonly _autoScalingGroupName: string;

  /**
   * The role that allows the ASG to publish to the notification target
   *
   * @default - A default role is created if 'notificationTarget' is specified.
   * Otherwise, no role is created.
   */
  public get role() {
    if (!this._role) {
      throw new ValidationError('\'role\' is undefined. Please specify a \'role\' or specify a \'notificationTarget\' to have a role provided for you.', this);
    }

    return this._role;
  }

  /**
   * The name of this lifecycle hook
   * @attribute
   */
  public readonly lifecycleHookName: string;

  public get lifecycleHookRef(): LifecycleHookReference {
    return {
      autoScalingGroupName: this._autoScalingGroupName,
      lifecycleHookName: this.lifecycleHookName,
    };
  }

  constructor(scope: Construct, id: string, props: LifecycleHookProps) {
    super(scope, id, {
      physicalName: props.lifecycleHookName,
    });
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    this._autoScalingGroupName = props.autoScalingGroup.autoScalingGroupRef.autoScalingGroupName;

    const targetProps = props.notificationTarget ? props.notificationTarget.bind(this, { lifecycleHook: this, role: props.role }) : undefined;

    if (props.role) {
      this._role = props.role;

      if (!props.notificationTarget) {
        throw new ValidationError("'notificationTarget' parameter required when 'role' parameter is specified", this);
      }
    } else {
      this._role = targetProps ? targetProps.createdRole : undefined;
    }

    const l1NotificationTargetArn = targetProps ? targetProps.notificationTargetArn : undefined;
    const l1RoleArn = this._role ? this.role.roleArn : undefined;

    const resource = new CfnLifecycleHook(this, 'Resource', {
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupRef.autoScalingGroupName,
      defaultResult: props.defaultResult,
      heartbeatTimeout: props.heartbeatTimeout && props.heartbeatTimeout.toSeconds(),
      lifecycleHookName: this.physicalName,
      lifecycleTransition: props.lifecycleTransition,
      notificationMetadata: props.notificationMetadata,
      notificationTargetArn: l1NotificationTargetArn,
      roleArn: l1RoleArn,
    });

    // A LifecycleHook resource is going to do a permissions test upon creation,
    // so we have to make sure the role has full permissions before creating the
    // lifecycle hook.
    if (this._role) {
      resource.node.addDependency(this.role);
    }

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
