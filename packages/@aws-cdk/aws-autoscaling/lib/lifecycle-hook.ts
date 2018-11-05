import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { IAutoScalingGroup } from './auto-scaling-group';
import { cloudformation } from './autoscaling.generated';

/**
 * Basic properties for a lifecycle hook
 */
export interface BasicLifecycleHookProps {
  /**
   * Name of the lifecycle hook
   *
   * @default Automatically generated name
   */
  lifecycleHookName?: string;

  /**
   * The action the Auto Scaling group takes when the lifecycle hook timeout elapses or if an unexpected failure occurs.
   *
   * @default Continue
   */
  defaultResult?: DefaultResult;

  /**
   * Maximum time between calls to RecordLifecycleActionHeartbeat for the hook
   *
   * If the lifecycle hook times out, perform the action in DefaultResult.
   */
  heartbeatTimeout?: number;

  /**
   * The state of the Amazon EC2 instance to which you want to attach the lifecycle hook.
   */
  lifecycleTransition: Transition;

  /**
   * Additional data to pass to the lifecycle hook target
   *
   * @default No metadata
   */
  notificationMetadata?: string;

  /**
   * The target of the lifecycle hook
   */
  notificationTarget?: ILifecycleHookTarget;

  /**
   * The role that allows publishing to the notification target
   *
   * @default A role is automatically created
   */
  role?: iam.IRole;
}

/**
 * Properties for a Lifecycle hook
 */
export interface LifecycleHookProps extends BasicLifecycleHookProps {
  /**
   * The AutoScalingGroup to add the lifecycle hook to
   */
  autoScalingGroup: IAutoScalingGroup;
}

export class LifecycleHook extends cdk.Construct {
  /**
   * The role that allows the ASG to publish to the notification target
   */
  public readonly role: iam.IRole;

  /**
   * The name of this lifecycle hook
   */
  public readonly lifecycleHookName: string;

  constructor(parent: cdk.Construct, id: string, props: LifecycleHookProps) {
    super(parent, id);

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('autoscaling.amazonaws.com')
    });

    const targetProps = props.notificationTarget && props.notificationTarget.asLifecycleHookTarget(this);

    const resource = new cloudformation.LifecycleHookResource(this, 'Resource', {
      autoScalingGroupName: props.autoScalingGroup.autoScalingGroupName,
      defaultResult: props.defaultResult,
      heartbeatTimeout: props.heartbeatTimeout,
      lifecycleHookName: props.lifecycleHookName,
      lifecycleTransition: props.lifecycleTransition,
      notificationMetadata: props.notificationMetadata,
      notificationTargetArn: targetProps && targetProps.notificationTargetArn,
      roleArn: this.role.roleArn,
    });

    this.lifecycleHookName = resource.lifecycleHookName;
  }
}

export enum DefaultResult {
  Continue = 'CONTINUE',
  Abandon = 'ABANDON',
}

/**
 * What instance transition to attach the hook to
 */
export enum Transition {
  /**
   * Execute the hook when an instance is about to be added
   */
  InstanceLaunching = 'autoscaling:EC2_INSTANCE_LAUNCHING',

  /**
   * Execute the hook when an instance is about to be terminated
   */
  InstanceTerminating = 'autoscaling:EC2_INSTANCE_TERMINATING',
}

/**
 * Interface for autoscaling lifecycle hook targets
 */
export interface ILifecycleHookTarget {
  /**
   * Called when this object is used as the target of a lifecycle hook
   */
  asLifecycleHookTarget(lifecycleHook: LifecycleHook): LifecycleHookTargetProps;
}

/**
 * Properties to add the target to a lifecycle hook
 */
export interface LifecycleHookTargetProps {
  /**
   * The ARN to use as the notification target
   */
  notificationTargetArn: string;
}