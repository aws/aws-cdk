import cdk = require('@aws-cdk/cdk');
import { FargateService } from './fargate/fargate-service';
import { FargateTaskDefinition } from './fargate/fargate-task-definition';
import { QueueWorkerServiceBase, QueueWorkerServiceBaseProps } from './queue-worker-service-base';

/**
 * Properties to define a Fargate queue worker service
 */
export interface FargateQueueWorkerServiceProps extends QueueWorkerServiceBaseProps {
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
  readonly cpu?: string;

  /**
   * The amount (in MiB) of memory used by the task.
   *
   * This field is required and you must use one of the following values, which determines your range of valid values
   * for the cpu parameter:
   *
   * 0.5GB, 1GB, 2GB - Available cpu values: 256 (.25 vCPU)
   *
   * 1GB, 2GB, 3GB, 4GB - Available cpu values: 512 (.5 vCPU)
   *
   * 2GB, 3GB, 4GB, 5GB, 6GB, 7GB, 8GB - Available cpu values: 1024 (1 vCPU)
   *
   * Between 4GB and 16GB in 1GB increments - Available cpu values: 2048 (2 vCPU)
   *
   * Between 8GB and 30GB in 1GB increments - Available cpu values: 4096 (4 vCPU)
   *
   * This default is set in the underlying FargateTaskDefinition construct.
   *
   * @default 512
   */
  readonly memoryMiB?: string;
}

/**
 * Class to create a Fargate query worker service
 */
export class FargateQueueWorkerService extends QueueWorkerServiceBase {
  constructor(scope: cdk.Construct, id: string, props: FargateQueueWorkerServiceProps) {
    super(scope, id, props);

    // Create a Task Definition for the container to start
    const taskDefinition = new FargateTaskDefinition(this, 'QueueWorkerTaskDef', {
      memoryMiB: props.memoryMiB !== undefined ? props.memoryMiB : '512',
      cpu: props.cpu !== undefined ? props.cpu : '256',
    });
    taskDefinition.addContainer('QueueWorkerContainer', {
      image: props.image,
      command: props.command !== undefined ? cdk.Fn.split(",", props.command) : undefined,
      environment: this.environment,
      logging: this.logDriver
    });

    // Create a Fargate service with the previously defined Task Definition and configure
    // autoscaling based on cpu utilization and number of messages visible in the SQS queue.
    const fargateService = new FargateService(this, 'FargateQueueWorkerService', {
      cluster: props.cluster,
      desiredCount: this.desiredCount,
      taskDefinition
    });
    this.configureAutoscalingForService(fargateService);
  }
}
