import { Ec2Service, Ec2TaskDefinition } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';
import { QueueProcessingServiceBase, QueueProcessingServiceBaseProps } from '../base/queue-processing-service-base';

/**
 * The properties for the QueueProcessingEc2Service service.
 */
export interface QueueProcessingEc2ServiceProps extends QueueProcessingServiceBaseProps {
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
 * Class to create a queue processing EC2 service.
 */
export class QueueProcessingEc2Service extends QueueProcessingServiceBase {

  /**
   * The EC2 service in this construct.
   */
  public readonly service: Ec2Service;
  /**
   * The EC2 task definition in this construct
   */
  public readonly taskDefinition: Ec2TaskDefinition;

  /**
   * Constructs a new instance of the QueueProcessingEc2Service class.
   */
  constructor(scope: Construct, id: string, props: QueueProcessingEc2ServiceProps) {
    super(scope, id, props);

    // Create a Task Definition for the container to start
    this.taskDefinition = new Ec2TaskDefinition(this, 'QueueProcessingTaskDef');
    this.taskDefinition.addContainer('QueueProcessingContainer', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      cpu: props.cpu,
      command: props.command,
      environment: this.environment,
      secrets: this.secrets,
      logging: this.logDriver
    });

    // Create an ECS service with the previously defined Task Definition and configure
    // autoscaling based on cpu utilization and number of messages visible in the SQS queue.
    this.service = new Ec2Service(this, 'QueueProcessingService', {
      cluster: this.cluster,
      desiredCount: this.desiredCount,
      taskDefinition: this.taskDefinition,
      propagateTags: props.propagateTags,
      enableECSManagedTags: props.enableECSManagedTags,
    });
    this.configureAutoscalingForService(this.service);
  }
}
