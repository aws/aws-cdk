# AWS ECS - L3 Construct for Autoscaling ECS/Fargate Service that Processes Items in a SQS Queue

To address issue [#2396](https://github.com/aws/aws-cdk/issues/2396), the AWS ECS CDK construct library should provide a way for customers to create a queue processing service (an AWS ECS/Fargate service that processes items from an sqs queue). This would mean adding new ECS CDK constructs `QueueProcessingEc2Service` and `QueueProcessingFargateService`, that would take in the necessary properties required to create a task definition, an SQS queue as well as an ECS/Fargate service and enable autoscaling for the service based on cpu usage and the SQS queue's approximateNumberOfMessagesVisible metric.

## General approach

The new `ecs.QueueProcessingServiceBase`, `ecs.QueueProcessingEc2Service` and `ecs.QueueProcessingFargateService` classes will create L3 constructs for:

* QueueProcessingEc2Service
* QueueProcessingFargateService

A `QueueProcessingService` will create a task definition with the specified container (on both EC2 and Fargate). An AWS SQS `Queue` will be created and autoscaling of the ECS Service will be dependent on both CPU as well as the SQS queue's `ApproximateNumberOfMessagesVisible` metric.

The `QueueProcessingService` constructs (for EC2 and Fargate) will use the following existing constructs:

* Ec2TaskDefinition/FargateTaskDefinition - To create a Task Definition for the container to start
* SQSQueue - The queue that the service is processing from
* Ec2Service/FargateService - The Service running the container

## Code changes

Given the above, we should make the following changes to support queue processing on ECS (for both EC2 and Fargate):
1. Create `QueueProcessingServiceBaseProps` interface and `QueueProcessingServiceBase` construct
2. Create `QueueProcessingEc2ServiceProps` interface  and `QueueProcessingEc2Service` construct
3. Create `QueueProcessingFargateServiceProps` interface  and `QueueProcessingFargateService` construct

### Part 1: Create `QueueProcessingServiceBaseProps` interface  and `QueueProcessingServiceBase` construct

The `QueueProcessingServiceBaseProps` interface will contain common properties used to construct both the QueueProcessingEc2Service and the QueueProcessingFargateService:

```ts
/**
 * Properties to define a queue processing service
 */
export interface QueueProcessingServiceBaseProps {
  /**
   * Cluster where service will be deployed
   */
  readonly cluster: ICluster;

  /**
   * The image to start.
   */
  readonly image: ContainerImage;

  /**
   * The CMD value to pass to the container as a string array.
   *
   * @default none
   */
  readonly command?: string[];

  /**
   * Number of desired copies of running tasks
   *
   * @default 1
   */
  readonly desiredTaskCount?: number;

  /**
   * Flag to indicate whether to enable logging
   *
   * @default true
   */
  readonly enableLogging?: boolean;

  /**
   * The environment variables to pass to the container.
   *
   * @default 'QUEUE_NAME: queue.queueName'
   */
  readonly environment?: { [key: string]: string };

  /**
   * A queue for which to process items from.
   *
   * If specified and this is a FIFO queue, the queue name must end in the string '.fifo'.
   * @see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_CreateQueue.html
   *
   * @default 'SQSQueue with CloudFormation-generated name'
   */
  readonly queue?: IQueue;

  /**
   * Maximum capacity to scale to.
   *
   * @default (desiredTaskCount * 2)
   */
  readonly maxScalingCapacity?: number

  /**
   * The intervals for scaling based on the SQS queue's ApproximateNumberOfMessagesVisible metric.
   *
   * Maps a range of metric values to a particular scaling behavior.
   * https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-scaling-simple-step.html
   *
   * @default [{ upper: 0, change: -1 },{ lower: 100, change: +1 },{ lower: 500, change: +5 }]
   */
  readonly scalingSteps: autoScaling.ScalingInterval[];
}
```

### Part 2: Create `QueueProcessingEc2ServiceProps` interface  and `QueueProcessingEc2Service` construct

The `QueueProcessingEc2ServiceProps` interface will contain properties to construct the Ec2TaskDefinition, SQSQueue and Ec2Service:

```ts
/**
 * Properties to define an ECS service
 */
export interface QueueProcessingEc2ServiceProps {
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
```

An example use case:
```ts
// Create the vpc and cluster used by the queue processing service
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });
cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro')
});
const queue = new sqs.Queue(stack, 'ProcessingQueue', {
  QueueName: 'EcsEventQueue'
});

// Create the queue processing service
new QueueProcessingEc2Service(stack, 'QueueProcessingEc2Service', {
  cluster,
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  desiredTaskCount: 2,
  maxScalingCapacity: 5,
  memoryReservationMiB: 512,
  cpu: 256,
  queue
});
```

### Part 3: Create `QueueProcessingFargateServiceProps` interface  and `QueueProcessingFargateService` construct

The `QueueProcessingFargateServiceProps` interface will contain properties to construct the FargateTaskDefinition, SQSQueue and FargateService:

```ts
/**
 * Properties to define a Fargate service
 */
export interface QueueProcessingFargateServiceProps {
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
```

An example use case:
```ts
// Create the vpc and cluster used by the queue processing service
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });
const queue = new sqs.Queue(stack, 'ProcessingQueue', {
  QueueName: 'FargateEventQueue'
});

// Create the queue processing service
new QueueProcessingFargateService(stack, 'QueueProcessingFargateService', {
  cluster,
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  desiredTaskCount: 2,
  maxScalingCapacity: 5,
  queue
});
```
