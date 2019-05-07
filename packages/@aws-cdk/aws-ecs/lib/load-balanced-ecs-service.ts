import cdk = require('@aws-cdk/cdk');
import { Ec2Service } from './ec2/ec2-service';
import { Ec2TaskDefinition } from './ec2/ec2-task-definition';
import { LoadBalancedServiceBase, LoadBalancedServiceBaseProps } from './load-balanced-service-base';

/**
 * Properties for a LoadBalancedEc2Service
 */
export interface LoadBalancedEc2ServiceProps extends LoadBalancedServiceBaseProps {
  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required.
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
   */
  readonly memoryReservationMiB?: number;
}

/**
 * A single task running on an ECS cluster fronted by a load balancer
 */
export class LoadBalancedEc2Service extends LoadBalancedServiceBase {

  /**
   * The ECS service in this construct
   */
  public readonly service: Ec2Service;

  constructor(scope: cdk.Construct, id: string, props: LoadBalancedEc2ServiceProps) {
    super(scope, id, props);

    const taskDefinition = new Ec2TaskDefinition(this, 'TaskDef', {});

    const container = taskDefinition.addContainer('web', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      environment: props.environment
    });

    container.addPortMappings({
      containerPort: props.containerPort || 80
    });

    const service = new Ec2Service(this, "Service", {
      cluster: props.cluster,
      desiredCount: props.desiredCount || 1,
      taskDefinition
    });

    this.service = service;
    this.addServiceAsTarget(service);
  }
}
