import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import { Construct, Resource } from '@aws-cdk/cdk';
import { BaseService, BaseServiceProps, IService, LaunchType } from '../base/base-service';
import { TaskDefinition } from '../base/task-definition';

/**
 * Properties to define a Fargate service
 */
export interface FargateServiceProps extends BaseServiceProps {
  /**
   * Task Definition used for running tasks in the service
   *
   * [disable-awslint:ref-via-interface]
   */
  readonly taskDefinition: TaskDefinition;

  /**
   * Assign public IP addresses to each task
   *
   * @default - Use subnet default.
   */
  readonly assignPublicIp?: boolean;

  /**
   * In what subnets to place the task's ENIs
   *
   * @default - Private subnets.
   */
  readonly vpcSubnets?: ec2.SubnetSelection;

  /**
   * Existing security group to use for the tasks
   *
   * @default - A new security group is created.
   */
  readonly securityGroup?: ec2.ISecurityGroup;

  /**
   * Fargate platform version to run this service on
   *
   * Unless you have specific compatibility requirements, you don't need to
   * specify this.
   *
   * @default Latest
   */
  readonly platformVersion?: FargatePlatformVersion;
}

export interface IFargateService extends IService {

}

/**
 * Start a service on an ECS cluster
 *
 * @resource AWS::ECS::Service
 */
export class FargateService extends BaseService implements IFargateService {

  public static fromFargateServiceArn(scope: Construct, id: string, fargateServiceArn: string): IFargateService {
    class Import extends Resource implements IFargateService {
      public readonly serviceArn = fargateServiceArn;
    }
    return new Import(scope, id);
  }

  constructor(scope: cdk.Construct, id: string, props: FargateServiceProps) {
    if (!props.taskDefinition.isFargateCompatible) {
      throw new Error('Supplied TaskDefinition is not configured for compatibility with Fargate');
    }

    super(scope, id, {
      ...props,
      desiredCount: props.desiredCount !== undefined ? props.desiredCount : 1,
      launchType: LaunchType.FARGATE,
    }, {
      cluster: props.cluster.clusterName,
      taskDefinition: props.taskDefinition.taskDefinitionArn,
      platformVersion: props.platformVersion,
    }, props.taskDefinition);

    this.configureAwsVpcNetworking(props.cluster.vpc, props.assignPublicIp, props.vpcSubnets, props.securityGroup);

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
  LATEST = 'LATEST',

  /**
   * Version 1.3.0
   *
   * Supports secrets, task recycling.
   */
  VERSION1_3 = '1.3.0',

  /**
   * Version 1.2.0
   *
   * Supports private registries.
   */
  VERSION1_2 = '1.2.0',

  /**
   * Version 1.1.0
   *
   * Supports task metadata, health checks, service discovery.
   */
  VERSION1_1 = '1.1.0',

  /**
   * Initial release
   *
   * Based on Amazon Linux 2017.09.
   */
  VERSION1_0 = '1.0.0',
}
