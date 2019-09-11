import { FargateTaskDefinition } from '@aws-cdk/aws-ecs';
import { Construct } from '@aws-cdk/core';
import { ScheduledTaskBase, ScheduledTaskBaseProps } from '../base/scheduled-task-base';

/**
 * The properties for the ScheduledFargateTask service.
 */
export interface ScheduledFargateTaskProps extends ScheduledTaskBaseProps {
  /**
   * The number of cpu units used by the task.
   * Valid values, which determines your range of valid values for the memory parameter:
   * 256 (.25 vCPU) - Available memory values: 0.5GB, 1GB, 2GB
   * 512 (.5 vCPU) - Available memory values: 1GB, 2GB, 3GB, 4GB
   * 1024 (1 vCPU) - Available memory values: 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB
   * 2048 (2 vCPU) - Available memory values: Between 4GB and 16GB in 1GB increments
   * 4096 (4 vCPU) - Available memory values: Between 8GB and 30GB in 1GB increments
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 256
   */
  readonly cpu?: number;

  /**
   * The hard limit (in MiB) of memory to present to the container.
   *
   * If your container attempts to exceed the allocated memory, the container
   * is terminated.
   *
   * @default 512
   */
  readonly memoryLimitMiB?: number;
}

/**
 * A scheduled Fargate task that will be initiated off of cloudwatch events.
 */
export class ScheduledFargateTask extends ScheduledTaskBase {
  /**
   * The Fargate task definition in this construct.
   */
  public readonly taskDefinition: FargateTaskDefinition;

  /**
   * Constructs a new instance of the ScheduledFargateTask class.
   */
  constructor(scope: Construct, id: string, props: ScheduledFargateTaskProps) {
    super(scope, id, props);

    this.taskDefinition = new FargateTaskDefinition(this, 'ScheduledTaskDef', {
      memoryLimitMiB: props.memoryLimitMiB || 512,
      cpu: props.cpu || 256,
    });
    this.taskDefinition.addContainer('ScheduledContainer', {
      image: props.image,
      command: props.command,
      environment: props.environment,
      secrets: props.secrets,
      logging: this.logDriver
    });

    this.addTaskDefinitionToEventTarget(this.taskDefinition);
  }
}
