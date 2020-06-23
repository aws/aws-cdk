import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';
import { EcsRunTaskCommonProps, EcsRunTaskStateBase } from './run-task-base';

/**
 * Properties to define an ECS service
 */
export interface EcsFargateRunTaskProps extends EcsRunTaskCommonProps {
  /**
   * Assign public IP addresses to each task
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * In what subnets to place the task's ENIs
   *
   * @default - Private subnet if assignPublicIp, public subnets otherwise
   */
  readonly subnets?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the tasks
   *
   * @default - A new security group is created
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default FargatePlatformVersion.LATEST
   */
  readonly platformVersion?: ecs.FargatePlatformVersion;
}

/**
 * Start a service on an ECS cluster
 */
export class EcsFargateRunTask extends EcsRunTaskStateBase {
  constructor(scope: Construct, id: string, props: EcsFargateRunTaskProps) {
    if (!props.taskDefinition.isFargateCompatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with Fargate');
    }

    if (!props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    super(scope, id, {
      ...props,
      parameters: {
        LaunchType: 'FARGATE',
        PlatformVersion: props.platformVersion,
      },
    });

    this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.subnets, props.securityGroup);
  }
}
