import { SubnetSelection } from '@aws-cdk/aws-ec2';
import { FargateService, FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import { FeatureFlags } from '@aws-cdk/core';
import * as cxapi from '@aws-cdk/cx-api';
import { Construct } from 'constructs';
import { FargateServiceBaseProps } from '../base/fargate-service-base';
import { NetworkLoadBalancedServiceBase, NetworkLoadBalancedServiceBaseProps } from '../base/network-load-balanced-service-base';

/**
 * The properties for the NetworkLoadBalancedFargateService service.
 */
export interface NetworkLoadBalancedFargateServiceProps extends NetworkLoadBalancedServiceBaseProps, FargateServiceBaseProps {

  /**
   * Determines whether the service will be assigned a public IP address.
   *
   * @default false
   */
  readonly assignPublicIp?: boolean;

  /**
   * The subnets to associate with the service.
   *
   * @default - Public subnets if `assignPublicIp` is set, otherwise the first available one of Private, Isolated, Public, in that order.
   */
  readonly taskSubnets?: SubnetSelection;

}

/**
 * A Fargate service running on an ECS cluster fronted by a network load balancer.
 */
export class NetworkLoadBalancedFargateService extends NetworkLoadBalancedServiceBase {

  public readonly assignPublicIp: boolean;
  /**
   * The Fargate service in this construct.
   */
  public readonly service: FargateService;
  /**
   * The Fargate task definition in this construct.
   */
  public readonly taskDefinition: FargateTaskDefinition;

  /**
   * Constructs a new instance of the NetworkLoadBalancedFargateService class.
   */
  constructor(scope: Construct, id: string, props: NetworkLoadBalancedFargateServiceProps = {}) {
    super(scope, id, props);

    this.assignPublicIp = props.assignPublicIp ?? false;

    if (props.taskDefinition && props.taskImageOptions) {
      throw new Error('You must specify either a taskDefinition or an image, not both.');
    } else if (props.taskDefinition) {
      this.taskDefinition = props.taskDefinition;
    } else if (props.taskImageOptions) {
      const taskImageOptions = props.taskImageOptions;
      this.taskDefinition = new FargateTaskDefinition(this, 'TaskDef', {
        memoryLimitMiB: props.memoryLimitMiB,
        cpu: props.cpu,
        executionRole: taskImageOptions.executionRole,
        taskRole: taskImageOptions.taskRole,
        family: taskImageOptions.family,
        runtimePlatform: props.runtimePlatform,
      });

      // Create log driver if logging is enabled
      const enableLogging = taskImageOptions.enableLogging ?? true;
      const logDriver = taskImageOptions.logDriver ?? (enableLogging ? this.createAWSLogDriver(this.node.id) : undefined);

      const containerName = taskImageOptions.containerName ?? 'web';
      const container = this.taskDefinition.addContainer(containerName, {
        image: taskImageOptions.image,
        cpu: props.cpu,
        memoryLimitMiB: props.memoryLimitMiB,
        environment: taskImageOptions.environment,
        secrets: taskImageOptions.secrets,
        logging: logDriver,
        dockerLabels: taskImageOptions.dockerLabels,
      });
      container.addPortMappings({
        containerPort: taskImageOptions.containerPort || 80,
      });
    } else {
      throw new Error('You must specify one of: taskDefinition or image');
    }

    const desiredCount = FeatureFlags.of(this).isEnabled(cxapi.ECS_REMOVE_DEFAULT_DESIRED_COUNT) ? this.internalDesiredCount : this.desiredCount;

    this.service = new FargateService(this, 'Service', {
      cluster: this.cluster,
      desiredCount: desiredCount,
      taskDefinition: this.taskDefinition,
      assignPublicIp: this.assignPublicIp,
      serviceName: props.serviceName,
      healthCheckGracePeriod: props.healthCheckGracePeriod,
      minHealthyPercent: props.minHealthyPercent,
      maxHealthyPercent: props.maxHealthyPercent,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
      cloudMapOptions: props.cloudMapOptions,
      platformVersion: props.platformVersion,
      deploymentController: props.deploymentController,
      circuitBreaker: props.circuitBreaker,
      vpcSubnets: props.taskSubnets,
      enableExecuteCommand: props.enableExecuteCommand,
      capacityProviderStrategies: props.capacityProviderStrategies,
    });
    this.addServiceAsTarget(this.service);
  }
}
