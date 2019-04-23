import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');
import { BaseRunTask, BaseRunTaskProps } from './base-run-task';

/**
 * Properties to define an ECS service
 */
export interface FargateRunTaskProps extends BaseRunTaskProps {
  /**
   * Assign public IP addresses to each task
   *
   * @default false
   */
  assignPublicIp?: boolean;

  /**
   * In what subnets to place the task's ENIs
   *
   * @default Private subnet if assignPublicIp, public subnets otherwise
   */
  vpcPlacement?: ec2.VpcPlacementStrategy;

  /**
   * Existing security group to use for the tasks
   *
   * @default A new security group is created
   */
  securityGroup?: ec2.ISecurityGroup;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default Latest
   */
  platformVersion?: ecs.FargatePlatformVersion;
}

/**
 * Start a service on an ECS cluster
 */
export class FargateRunTask extends BaseRunTask {
  constructor(scope: cdk.Construct, id: string, props: FargateRunTaskProps) {
    if (!props.taskDefinition.isFargateCompatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with EC2');
    }

    if (!props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }

    super(scope, id, props);

    this._parameters.LaunchType = 'FARGATE';
    this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcPlacement, props.securityGroup);
  }
}
