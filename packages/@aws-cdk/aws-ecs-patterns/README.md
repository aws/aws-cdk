# CDK Construct library for higher-level ECS Constructs
<div class="stability_label"
     style="background-color: #EC5315; color: white !important; margin: 0 0 1rem 0; padding: 1rem; line-height: 1.5;">
  Stability: 1 - Experimental. This API is still under active development and subject to non-backward
  compatible changes or removal in any future version. Use of the API is not recommended in production
  environments. Experimental APIs are not subject to the Semantic Versioning model.
</div>


This library provides higher-level ECS constructs which follow common architectural patterns. It contains:

* Load Balanced Services
* Queue Worker Services
* Scheduled Tasks (cron jobs)

## Load Balanced Services

To define a service that is behind a load balancer, instantiate one of the following: 

* `LoadBalancedEc2Service`

```ts
const loadBalancedEcsService = new ecsPatterns.LoadBalancedEc2Service(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  image: ecs.ContainerImage.fromRegistry('test'),
  desiredCount: 2,
  environment: {
    TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
    TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
  }
});
```

* `LoadBalancedFargateService`

```ts
const loadBalancedFargateService = new ecsPatterns.LoadBalancedFargateService(stack, 'Service', {
  cluster,
  memoryMiB: '1GB',
  cpu: '512',
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});
```

## Queue Worker Services

To define a service that creates a queue and reads from that queue, instantiate one of the following:

* `Ec2QueueWorkerService`

```ts
const ecsQueueWorkerService = new Ec2QueueWorkerService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {
    TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
    TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
  },
  queue,
  maxScalingCapacity: 5
});
```

* `FargateQueueWorkerService`

```ts
const fargateQueueWorkerService = new FargateQueueWorkerService(stack, 'Service', {
  cluster,
  memoryMiB: '512',
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {
    TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
    TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
  },
  queue,
  maxScalingCapacity: 5
});
```

## Scheduled Tasks

To define a task that runs periodically, instantiate an `ScheduledEc2Task`:


```ts
// Instantiate an Amazon EC2 Task to run at a scheduled interval
const ecsScheduledTask = new ScheduledEc2Task(this, 'ScheduledTask', {
  cluster,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  scheduleExpression: 'rate(1 minute)',
  environment: [{ name: 'TRIGGER', value: 'CloudWatch Events' }],
  memoryLimitMiB: 256
});
```
