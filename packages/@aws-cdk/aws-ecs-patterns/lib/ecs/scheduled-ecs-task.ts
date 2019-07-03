import ecs = require('@aws-cdk/aws-ecs');
import cdk = require('@aws-cdk/core');
import { ScheduledTaskBase, ScheduledTaskBaseProps } from '../base/scheduled-task-base';

export interface ScheduledEc2TaskProps extends ScheduledTaskBaseProps {
  /**
   * The minimum number of CPU units to reserve for the container.
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
 * A scheduled Ec2 task that will be initiated off of cloudwatch events.
 */
export class ScheduledEc2Task extends ScheduledTaskBase {
  constructor(scope: cdk.Construct, id: string, props: ScheduledEc2TaskProps) {
    super(scope, id, props);

    // Create a Task Definition for the container to start, also creates a log driver
    const taskDefinition = new ecs.Ec2TaskDefinition(this, 'ScheduledTaskDef');
    taskDefinition.addContainer('ScheduledContainer', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      cpu: props.cpu,
      command: props.command,
      environment: props.environment,
      logging: this.createAWSLogDriver(this.node.id)
    });

    this.addTaskDefinitionToEventTarget(taskDefinition);
  }
}
