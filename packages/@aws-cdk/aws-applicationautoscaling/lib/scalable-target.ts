import iam = require('@aws-cdk/aws-iam');
import { Construct, Resource } from '@aws-cdk/cdk';
import { CfnScalableTarget } from './applicationautoscaling.generated';
import { BasicStepScalingPolicyProps, StepScalingPolicy } from './step-scaling-policy';
import { BasicTargetTrackingScalingPolicyProps, TargetTrackingScalingPolicy } from './target-tracking-scaling-policy';

/**
 * Properties for a scalable target
 */
export interface ScalableTargetProps {
  /**
   * The minimum value that Application Auto Scaling can use to scale a target during a scaling activity.
   */
  readonly minCapacity: number;

  /**
   * The maximum value that Application Auto Scaling can use to scale a target during a scaling activity.
   */
  readonly maxCapacity: number;

  /**
   * Role that allows Application Auto Scaling to modify your scalable target.
   *
   * @default A role is automatically created
   */
  readonly role?: iam.IRole;

  /**
   * The resource identifier to associate with this scalable target.
   *
   * This string consists of the resource type and unique identifier.
   *
   * @example service/ecsStack-MyECSCluster-AB12CDE3F4GH/ecsStack-MyECSService-AB12CDE3F4GH
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_RegisterScalableTarget.html
   */
  readonly resourceId: string;

  /**
   * The scalable dimension that's associated with the scalable target.
   *
   * Specify the service namespace, resource type, and scaling property.
   *
   * @example ecs:service:DesiredCount
   * @see https://docs.aws.amazon.com/autoscaling/application/APIReference/API_ScalingPolicy.html
   */
  readonly scalableDimension: string;

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
  readonly serviceNamespace: ServiceNamespace;
}

/**
 * Define a scalable target
 */
export class ScalableTarget extends Resource {
  /**
   * ID of the Scalable Target
   *
   * @example service/ecsStack-MyECSCluster-AB12CDE3F4GH/ecsStack-MyECSService-AB12CDE3F4GH|ecs:service:DesiredCount|ecs
   * @attribute
   */
  public readonly scalableTargetId: string;

  /**
   * The role used to give AutoScaling permissions to your resource
   */
  public readonly role: iam.IRole;

  private readonly actions = new Array<CfnScalableTarget.ScheduledActionProperty>();

  constructor(scope: Construct, id: string, props: ScalableTargetProps) {
    super(scope, id);

    if (props.maxCapacity < 0) {
      throw new RangeError(`maxCapacity cannot be negative, got: ${props.maxCapacity}`);
    }
    if (props.minCapacity < 0) {
      throw new RangeError(`minCapacity cannot be negative, got: ${props.minCapacity}`);
    }
    if (props.maxCapacity < props.minCapacity) {
      throw new RangeError(`minCapacity (${props.minCapacity}) should be lower than maxCapacity (${props.maxCapacity})`);
    }

    this.role = props.role || new iam.Role(this, 'Role', {
      assumedBy: new iam.ServicePrincipal('application-autoscaling.amazonaws.com')
    });

    const resource = new CfnScalableTarget(this, 'Resource', {
      maxCapacity: props.maxCapacity,
      minCapacity: props.minCapacity,
      resourceId: props.resourceId,
      roleArn: this.role.roleArn,
      scalableDimension: props.scalableDimension,
      scheduledActions: this.actions,
      serviceNamespace: props.serviceNamespace
    });

    this.scalableTargetId = resource.scalableTargetId;
  }

  /**
   * Add a policy statement to the role's policy
   */
  public addToRolePolicy(statement: iam.PolicyStatement) {
    this.role.addToPolicy(statement);
  }

  /**
   * Scale out or in based on time
   */
  public scaleOnSchedule(id: string, action: ScalingSchedule) {
    if (action.minCapacity === undefined && action.maxCapacity === undefined) {
      throw new Error(`You must supply at least one of minCapacity or maxCapacity, got ${JSON.stringify(action)}`);
    }
    this.actions.push({
      scheduledActionName: id,
      schedule: action.schedule,
      startTime: action.startTime,
      endTime: action.endTime,
      scalableTargetAction: {
        maxCapacity: action.maxCapacity,
        minCapacity: action.minCapacity
      },
    });
  }

  /**
   * Scale out or in, in response to a metric
   */
  public scaleOnMetric(id: string, props: BasicStepScalingPolicyProps) {
    return new StepScalingPolicy(this, id, { ...props, scalingTarget: this });
  }

  /**
   * Scale out or in in order to keep a metric around a target value
   */
  public scaleToTrackMetric(id: string, props: BasicTargetTrackingScalingPolicyProps) {
    return new TargetTrackingScalingPolicy(this, id, { ...props, scalingTarget: this });
  }
}

/**
 * A scheduled scaling action
 */
export interface ScalingSchedule {
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
  readonly schedule: string;

  /**
   * When this scheduled action becomes active.
   *
   * @default The rule is activate immediately
   */
  readonly startTime?: Date

  /**
   * When this scheduled action expires.
   *
   * @default The rule never expires.
   */
  readonly endTime?: Date;

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
  readonly minCapacity?: number;

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
  readonly maxCapacity?: number;
}

/**
 * The service that supports Application AutoScaling
 */
export enum ServiceNamespace {
  /**
   * Elastic Container Service
   */
  Ecs = 'ecs',

  /**
   * Elastic Map Reduce
   */
  ElasticMapReduce = 'elasticmapreduce',

  /**
   * Elastic Compute Cloud
   */
  Ec2 = 'ec2',

  /**
   * App Stream
   */
  AppStream = 'appstream',

  /**
   * Dynamo DB
   */
  DynamoDb = 'dynamodb',

  /**
   * Relational Database Service
   */
  Rds = 'rds',

  /**
   * SageMaker
   */
  SageMaker = 'sagemaker',

  /**
   * Custom Resource
   */
  CustomResource = 'custom-resource',
}