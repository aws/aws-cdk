import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';

/**
 * Represents an AppSpec to be used for ECS services.
 *
 * {@link https://docs.aws.amazon.com/codedeploy/latest/userguide/reference-appspec-file-structure-resources.html#reference-appspec-file-structure-resources-ecs}
 */
export class EcsAppSpec {
  /**
   * List of services to target for the deployment. Must have a length of 1.
   */
  private readonly targetServices: TargetService[];

  constructor(...targetServices: TargetService[]) {
    if (targetServices.length !== 1) {
      throw new Error('targetServices must have a length of 1');
    }
    this.targetServices = targetServices;
  }

  /**
   * Render JSON string for this AppSpec to be used
   *
   * @returns string representation of this AppSpec
   */
  toString(): string {
    const appSpec = {
      version: '0.0',
      Resources: this.targetServices.map(targetService => {
        return {
          TargetService: {
            Type: 'AWS::ECS::Service',
            Properties: {
              TaskDefinition: targetService.taskDefinition.taskDefinitionArn,
              LoadBalancerInfo: {
                ContainerName: targetService.containerName,
                ContainerPort: targetService.containerPort,
              },
              PlatformVersion: targetService.platformVersion,
              NetworkConfiguration: this.configureAwsVpcNetworkingWithSecurityGroups(targetService.awsvpcConfiguration),
              CapacityProviderStrategy: targetService.capacityProviderStrategy?.map(capacityProviderStrategy => {
                return {
                  Base: capacityProviderStrategy.base,
                  CapacityProvider: capacityProviderStrategy.capacityProvider,
                  Weight: capacityProviderStrategy.weight,
                };
              }),
            },
          },
        };
      }),
    };
    return JSON.stringify(appSpec);
  }

  private configureAwsVpcNetworkingWithSecurityGroups(awsvpcConfiguration?: AwsvpcConfiguration) {
    if (!awsvpcConfiguration) {
      return undefined;
    }
    return {
      awsvpcConfiguration: {
        assignPublicIp: awsvpcConfiguration.assignPublicIp ? 'ENABLED' : 'DISABLED',
        subnets: awsvpcConfiguration.vpc.selectSubnets(awsvpcConfiguration.vpcSubnets).subnetIds,
        securityGroups: awsvpcConfiguration.securityGroups?.map((sg) => sg.securityGroupId),
      },
    };
  }
}

/**
 * Describe the target for CodeDeploy to use when creating a deployment for a {@link ecs.EcsDeploymentGroup}.
 */
export interface TargetService {
  /**
   * The TaskDefintion to deploy to the target services.
   */
  readonly taskDefinition: ecs.ITaskDefinition;

  /**
   * The name of the Amazon ECS container that contains your Amazon ECS application. It must be a container specified in your Amazon ECS task definition.
   */
  readonly containerName: string;

  /**
   * The port on the container where traffic will be routed to.
   */
  readonly containerPort: number;

  /**
   * The platform version of the Fargate tasks in the deployed Amazon ECS service.
   * {@link https://docs.aws.amazon.com/AmazonECS/latest/developerguide/platform_versions.html}
   *
   * @default LATEST
   */
  readonly platformVersion?: ecs.FargatePlatformVersion;

  /**
   * Network configuration for ECS services that have a network type of `awsvpc`.
   *
   * @default reuse current network settings for ECS service.
   */
  readonly awsvpcConfiguration?: AwsvpcConfiguration;

  /**
   * A list of Amazon ECS capacity providers to use for the deployment.
   *
   * @default reuse current capcity provider strategy for ECS service.
   */
  readonly capacityProviderStrategy?: ecs.CapacityProviderStrategy[];

}

/**
 * Network configuration for ECS services that have a network type of `awsvpc`.
 */
export interface AwsvpcConfiguration {
  /**
   * The VPC to use for the task.
   */
  readonly vpc: ec2.IVpc;

  /**
   * The Subnets to use for the task.
   */
  readonly vpcSubnets: ec2.SubnetSelection;

  /**
   * The Security Groups to use for the task.
   */
  readonly securityGroups: ec2.ISecurityGroup[];

  /**
   * Assign a public IP address to the task.
   */
  readonly assignPublicIp: boolean;
}