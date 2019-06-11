import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/cdk');
import { QueueProcessingServiceBase, QueueProcessingServiceBaseProps } from '../base/queue-processing-service-base';

/**
 * Properties to define a queue processing Ec2 service
 */
export interface QueueProcessingEc2ServiceProps extends QueueProcessingServiceBaseProps {
  /**
   * The minimum number of CPU units to reserve for the container.
   *
   * @default - No minimum CPU units reserved.
   */
  readonly cpu?: number;

  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
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
   * At least one of memoryLimitMiB and memoryReservationMiB is required for non-Fargate services.
   *
   * @default - No memory reserved.
   */
  readonly memoryReservationMiB?: number;
}

/**
 * Class to create a queue processing Ec2 service
 */
export class QueueProcessingEc2Service extends QueueProcessingServiceBase {

  /**
   * The ECS service in this construct
   */
  public readonly service: ecs.Ec2Service;

  constructor(scope: cdk.Construct, id: string, props: QueueProcessingEc2ServiceProps) {
    super(scope, id, props);

    // Create a Task Definition for the container to start
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'QueueProcessingTaskDef');
    taskDefinition.addContainer('QueueProcessingContainer', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      cpu: props.cpu,
      command: props.command,
      environment: this.environment,
      logging: this.logDriver
    });

    // Create an ECS service with the previously defined Task Definition and configure
    // autoscaling based on cpu utilization and number of messages visible in the SQS queue.
    this.service = new ecs.Ec2Service(this, 'QueueProcessingService', {
      cluster: props.cluster,
      desiredCount: this.desiredCount,
      taskDefinition
    });
    this.configureAutoscalingForService(this.service);
  }
}
