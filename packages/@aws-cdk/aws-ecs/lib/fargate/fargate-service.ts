import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { BaseService, BaseServiceProps } from '../base/base-service';
import { IFargateCluster } from './fargate-cluster';
import { FargateTaskDefinition } from './fargate-task-definition';

/**
 * Properties to define a Fargate service
 */
export interface FargateServiceProps extends BaseServiceProps {
  /**
   * Cluster where service will be deployed
   */
  cluster: IFargateCluster; // should be required? do we assume 'default' exists?

  /**
   * Task Definition used for running tasks in the service
   */
  taskDefinition: FargateTaskDefinition;

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
  securityGroup?: ec2.SecurityGroupRef;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default Latest
   */
  platformVersion?: FargatePlatformVersion;
}

/**
 * Start a service on an ECS cluster
 */
export class FargateService extends BaseService {
  constructor(parent: cdk.Construct, name: string, props: FargateServiceProps) {
    super(parent, name, props, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      launchType: 'FARGATE',
      platformVersion: props.platformVersion,
    }, props.cluster.clusterName, props.taskDefinition);

    this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcPlacement, props.securityGroup);

    if (!props.taskDefinition.defaultContainer) {
      throw new Error('A TaskDefinition must have at least one essential container');
    }
  }
}

/**
 * Fargate platform version
 *
 * @see https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html
 */
export enum FargatePlatformVersion {
  /**
   * The latest, recommended platform version
   */
  Latest = 'LATEST',

  /**
   * Version 1.2
   *
   * Supports private registries.
   */
  Version1_2 = '1.2.0',

  /**
   * Version 1.1.0
   *
   * Supports task metadata, health checks, service discovery.
   */
  Version1_1 = '1.1.0',

  /**
   * Initial release
   *
   * Based on Amazon Linux 2017.09.
   */
  Version1_0 = '1.0.0',
}
