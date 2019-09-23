import { Ec2Service, Ec2TaskDefinition } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';
import { NetworkLoadBalancedServiceBase, NetworkLoadBalancedServiceBaseProps } from '../base/network-load-balanced-service-base';

/**
 * The properties for the NetworkLoadBalancedEc2Service service.
 */
export interface NetworkLoadBalancedEc2ServiceProps extends NetworkLoadBalancedServiceBaseProps {

  /**
   * The number of cpu units used by the task.
   * Valid values, which determines your range of valid values for the memory parameter:
   *
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   *
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   *
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   *
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   *
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default none
   */
  readonly cpu?: number;
  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required.
   *
   * @default - No memory limit.
   */
  readonly memoryLimitMiB?: number;

  /**
   * The soft limit (in MiB) of memory to reserve for the container.
   *
   * When system memory is under contention, Docker attempts to keep the
   * container memory within the limit. If the container requires more memory,
   * it can consume up to the value specified by the Memory property or all of
   * the available memory on the container instance—whichever comes first.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required.
   *
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;
}

/**
 * An EC2 service running on an ECS cluster fronted by a network load balancer.
 */
export class NetworkLoadBalancedEc2Service extends NetworkLoadBalancedServiceBase {

  /**
   * The ECS service in this construct.
   */
  public readonly service: Ec2Service;
  /**
   * The EC2 Task Definition in this construct.
   */
  public readonly taskDefinition: Ec2TaskDefinition;

  /**
   * Constructs a new instance of the NetworkLoadBalancedEc2Service class.
   */
  constructor(scope: Construct, id: string, props: NetworkLoadBalancedEc2ServiceProps) {
    super(scope, id, props);

    this.taskDefinition = new Ec2TaskDefinition(this, 'TaskDef', {
      executionRole: props.executionRole,
      taskRole: props.taskRole
    });

    const containerName = props.containerName !== undefined ? props.containerName : 'web';
    const container = this.taskDefinition.addContainer(containerName, {
      image: props.image,
      cpu: props.cpu,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      environment: props.environment,
      secrets: props.secrets,
      logging: this.logDriver,
    });
    container.addPortMappings({
      containerPort: props.containerPort || 80
    });

    this.service = new Ec2Service(this, "Service", {
      cluster: this.cluster,
      desiredCount: this.desiredCount,
      taskDefinition: this.taskDefinition,
      assignPublicIp: false,
      serviceName: props.serviceName,
      healthCheckGracePeriod: props.healthCheckGracePeriod,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
    });
    this.addServiceAsTarget(this.service);
  }
}
