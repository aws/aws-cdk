import * as ecs from '@aws-cdk/aws-ecs';
import * as cdk from '@aws-cdk/core';
import { ServiceExtension, ServiceBuild } from './extension-interfaces';

/**
 * The autoscaling settings
 */
export interface CpuScalingProps {
  /**
   * How many tasks to launch initially
   * @default - 2
   */
  readonly initialTaskCount?: number;

  /**
   * The minimum number of tasks when scaling in
   * @default - 2
   */
  readonly minTaskCount?: number;

  /**
   * The maximum number of tasks when scaling out
   * @default - 8
   */
  readonly maxTaskCount?: number;

  /**
   * The CPU utilization to try ot maintain
   * @default - 50%
   */
  readonly targetCpuUtilization?: number;

  /**
   * How long to wait between scale out actions
   * @default - 60 seconds
   */
  readonly scaleOutCooldown?: cdk.Duration;

  /**
   * How long to wait between scale in actions
   * @default - 60 seconds
   */
  readonly scaleInCooldown?: cdk.Duration;
}

// The default autoscaling settings
const cpuScalingPropsDefault = {
  initialTaskCount: 2,
  minTaskCount: 2,
  maxTaskCount: 8,
  targetCpuUtilization: 50,
  scaleOutCooldown: cdk.Duration.seconds(60),
  scaleInCooldown: cdk.Duration.seconds(60),
};

/**
 * This extension helps you scale your service according to CPU utilization
 */
export class ScaleOnCpuUtilization extends ServiceExtension {
  /**
   * How many tasks to launch initially
   */
  public readonly initialTaskCount: number;

  /**
   * The minimum number of tasks when scaling in
   */
  public readonly minTaskCount: number;

  /**
   * The maximum number of tasks when scaling out
   */
  public readonly maxTaskCount: number;

  /**
   * The CPU utilization to try ot maintain
   */
  public readonly targetCpuUtilization: number;

  /**
   * How long to wait between scale out actions
   */
  public readonly scaleOutCooldown: cdk.Duration;

  /**
   * How long to wait between scale in actions
   */
  public readonly scaleInCooldown: cdk.Duration;

  constructor(props?: CpuScalingProps) {
    super('scale-on-cpu-utilization');

    let combinedProps = {
      ...cpuScalingPropsDefault,
      ...props,
    };

    this.initialTaskCount = combinedProps.initialTaskCount;
    this.minTaskCount = combinedProps.minTaskCount;
    this.maxTaskCount = combinedProps.maxTaskCount;
    this.targetCpuUtilization = combinedProps.targetCpuUtilization;
    this.scaleOutCooldown = combinedProps.scaleOutCooldown;
    this.scaleInCooldown = combinedProps.scaleInCooldown;
  }

  // This service modifies properties of the service prior
  // to construct creation.
  public modifyServiceProps(props: ServiceBuild): ServiceBuild {
    return {
      ...props,

      // Launch an initial number of tasks
      // In the future we should change this to use a custom resource
      // to read the current task count set by autoscaling, so that the task
      // count doesn't rollback to the initial level on each deploy.
      desiredCount: this.initialTaskCount,
    } as ServiceBuild;
  }

  // This hook utilizes the resulting service construct
  // once it is created
  public useService(service: ecs.Ec2Service | ecs.FargateService) {
    const scalingTarget = service.autoScaleTaskCount({
      minCapacity: this.minTaskCount,
      maxCapacity: this.maxTaskCount,
    });

    scalingTarget.scaleOnCpuUtilization(`${this.parentService.id}-target-cpu-utilization-${this.targetCpuUtilization}`, {
      targetUtilizationPercent: this.targetCpuUtilization,
      scaleInCooldown: this.scaleInCooldown,
      scaleOutCooldown: this.scaleOutCooldown,
    });
  }
}