import iam = require('@aws-cdk/aws-iam');
import cdk = require('@aws-cdk/cdk');
import { cloudformation } from './applicationautoscaling.generated';

/**
 * Properties for a scalable target
 */
export interface ScalableTargetProps {
  /**
   * The minimum value that Application Auto Scaling can use to scale a target during a scaling activity.
   */
  minCapacity: number;

  /**
   * The maximum value that Application Auto Scaling can use to scale a target during a scaling activity.
   */
  maxCapacity: number;

  /**
   * Role that allows Application Auto Scaling to modify your scalable target.
   *
   * If not supplied, a service-linked role is used. Some resources require a
   * concrete role.
   *
   * @default A service-linked role is used
   */
  role?: iam.Role;

  /**
   * The resource identifier to associate with this scalable target.
   *
   * This string consists of the resource type and unique identifier.
   *
   * @example service/ecsStack-MyECSCluster-AB12CDE3F4GH/ecsStack-MyECSService-AB12CDE3F4GH
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_RegisterScalableTarget.html
   */
  resourceId: string;

  /**
   * The scalable dimension that's associated with the scalable target.
   *
   * Specify the service namespace, resource type, and scaling property.
   *
   * @example ecs:service:DesiredCount
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_ScalingPolicy.html
   */
  scalableDimension: string;

  /**
   * The namespace of the AWS service that provides the resource or
   * custom-resource for a resource provided by your own application or
   * service.
   *
   * For valid AWS service namespace values, see the RegisterScalableTarget
   * action in the Application Auto Scaling API Reference.
   *
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_RegisterScalableTarget.html
   */
  serviceNamespace: string;
}

/**
 * Define a scalable target
 */
export class ScalableTarget extends cdk.Construct implements IScalableTarget {
  /**
   * ID of the Scalable Target
   *
   * @example service/ecsStack-MyECSCluster-AB12CDE3F4GH/ecsStack-MyECSService-AB12CDE3F4GH|ecs:service:DesiredCount|ecs
   */
  public readonly scalableTargetId: string;

  public readonly resourceId: string;
  public readonly scalableDimension: string;
  public readonly serviceNamespace: string;

  private readonly actions = new Array<cloudformation.ScalableTargetResource.ScheduledActionProperty>();

  constructor(parent: cdk.Construct, id: string, props: ScalableTargetProps) {
    super(parent, id);

    const resource = new cloudformation.ScalableTargetResource(this, 'Resource', {
      maxCapacity: props.maxCapacity,
      minCapacity: props.minCapacity,
      resourceId: props.resourceId,
      // Schema says roleArn is required but docs say it's not. Override typechecking.
      roleArn: (props.role && props.role.roleArn) as any,
      scalableDimension: props.scalableDimension,
      scheduledActions: this.actions,
      serviceNamespace: props.serviceNamespace
    });

    this.resourceId = props.resourceId;
    this.scalableDimension = props.scalableDimension;
    this.serviceNamespace = props.serviceNamespace;
    this.scalableTargetId = resource.scalableTargetId;
  }

  /**
   * Schedule an action for this scalable target
   */
  public addScheduledAction(action: ScheduledAction) {
    if (action.minCapacity === undefined && action.maxCapacity === undefined) {
      throw new Error('You must supply at least one of minCapacity or maxCapacity');
    }
    this.actions.push({
      scheduledActionName: action.name,
      schedule: action.schedule,
      startTime: action.startTime,
      endTime: action.endTime,
      scalableTargetAction: {
        maxCapacity: action.maxCapacity,
        minCapacity: action.minCapacity
      },
    });
  }
}

export interface ScheduledAction {
  /**
   * A name for the scheduled action
   */
  name: string;

  /**
   * When to perform this action.
   *
   * Support formats:
   * - at(yyyy-mm-ddThh:mm:ss)
   * - rate(value unit)
   * - cron(fields)
   *
   * "At" expressions are useful for one-time schedules. Specify the time in
   * UTC.
   *
   * For "rate" expressions, value is a positive integer, and unit is minute,
   * minutes, hour, hours, day, or days.
   *
   * For more information about cron expressions, see https://en.wikipedia.org/wiki/Cron.
   *
   * @example rate(12 hours)
   */
  schedule: string;

  /**
   * When this scheduled action becomes active.
   *
   * @default The rule is activate immediately
   */
  startTime?: Date

  /**
   * When this scheduled action expires.
   *
   * @default The rule never expires.
   */
  endTime?: Date;

  /**
   * The new minimum capacity.
   *
   * During the scheduled time, if the current capacity is below the minimum
   * capacity, Application Auto Scaling scales out to the minimum capacity.
   *
   * At least one of maxCapacity and minCapacity must be supplied.
   *
   * @default No new minimum capacity
   */
  minCapacity?: number;

  /**
   * The new maximum capacity.
   *
   * During the scheduled time, the current capacity is above the maximum
   * capacity, Application Auto Scaling scales in to the maximum capacity.
   *
   * At least one of maxCapacity and minCapacity must be supplied.
   *
   * @default No new maximum capacity
   */
  maxCapacity?: number;
}

export interface IScalableTarget {
  readonly scalableTargetId: string;
  readonly resourceId: string;
  readonly scalableDimension: string;
  readonly serviceNamespace: string;
}