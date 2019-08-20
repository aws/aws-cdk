import { Ec2TaskDefinition } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';
import { ScheduledTaskBase, ScheduledTaskBaseProps } from '../base/scheduled-task-base';

/**
 * The properties for the ScheduledEc2Task task.
 */
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
 * A scheduled EC2 task that will be initiated off of cloudwatch events.
 */
export class ScheduledEc2Task extends ScheduledTaskBase {

  /**
   * The EC2 task definition in this construct.
   */
  public readonly taskDefinition: Ec2TaskDefinition;

  /**
   * Constructs a new instance of the ScheduledEc2Task class.
   */
  constructor(scope: Construct, id: string, props: ScheduledEc2TaskProps) {
    super(scope, id, props);

    // Create a Task Definition for the container to start, also creates a log driver
    this.taskDefinition = new Ec2TaskDefinition(this, 'ScheduledTaskDef');
    this.taskDefinition.addContainer('ScheduledContainer', {
      image: props.image,
      memoryLimitMiB: props.memoryLimitMiB,
      memoryReservationMiB: props.memoryReservationMiB,
      cpu: props.cpu,
      command: props.command,
      environment: props.environment,
      secrets: props.secrets,
      logging: this.logDriver
    });

    this.addTaskDefinitionToEventTarget(this.taskDefinition);
  }
}
