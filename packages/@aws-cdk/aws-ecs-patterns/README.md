# CDK Construct library for higher-level ECS Constructs
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This library provides higher-level Amazon ECS constructs which follow common architectural patterns. It contains:

* Application Load Balanced Services
* Network Load Balanced Services
* Queue Processing Services
* Scheduled Tasks (cron jobs)

## Application Load Balanced Services

To define an Amazon ECS service that is behind an application load balancer, instantiate one of the following: 

* `ApplicationLoadBalancedEc2Service`

```ts
const loadBalancedEcsService = new ecsPatterns.ApplicationLoadBalancedEc2Service(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('test'),
    environment: {
      TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
      TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
    },
  },
  desiredCount: 2,
});
```

* `ApplicationLoadBalancedFargateService`

```ts
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
});
```

Instead of providing a cluster you can specify a VPC and CDK will create a new ECS cluster. 
If you deploy multiple services CDK will only create one cluster per VPC.

You can omit `cluster` and `vpc` to let CDK create a new VPC with two AZs and create a cluster inside this VPC.

## Network Load Balanced Services

To define an Amazon ECS service that is behind a network load balancer, instantiate one of the following: 

* `NetworkLoadBalancedEc2Service`

```ts
const loadBalancedEcsService = new ecsPatterns.NetworkLoadBalancedEc2Service(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('test'),
    environment: {
      TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
      TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value"
    },
  },
  desiredCount: 2,
});
```

* `NetworkLoadBalancedFargateService`

```ts
const loadBalancedFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
});
```

The CDK will create a new Amazon ECS cluster if you specify a VPC and omit `cluster`. If you deploy multiple services the CDK will only create one cluster per VPC.

If `cluster` and `vpc` are omitted, the CDK creates a new VPC with subnets in two Availability Zones and a cluster within this VPC.

## Queue Processing Services

To define a service that creates a queue and reads from that queue, instantiate one of the following:

* `QueueProcessingEc2Service`

```ts
const queueProcessingEc2Service = new QueueProcessingEc2Service(stack, 'Service', {
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

* `QueueProcessingFargateService`

```ts
const queueProcessingFargateService = new QueueProcessingFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 512,
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
const ecsScheduledTask = new ScheduledEc2Task(stack, 'ScheduledTask', {
  cluster,
  scheduledEc2TaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
    environment: { name: 'TRIGGER', value: 'CloudWatch Events' },
  },
  schedule: events.Schedule.expression('rate(1 minute)')
});
```
