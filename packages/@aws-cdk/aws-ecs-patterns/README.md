# CDK Construct library for higher-level ECS Constructs
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This library provides higher-level Amazon ECS constructs which follow common architectural patterns. It contains:

* Application Load Balanced Services
* Network Load Balanced Services
* Queue Processing Services
* Scheduled Tasks (cron jobs)
* Additional Examples

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

Additionally, if more than one application target group are needed, instantiate one of the following:

* `ApplicationMultipleTargetGroupsEc2Service`

```ts
// One application load balancer with one listener and two target groups.
const loadBalancedEc2Service = new ApplicationMultipleTargetGroupsEc2Service(stack, 'Service', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  targetGroups: [
    {
      containerPort: 80,
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10
    }
  ]
});
```

* `ApplicationMultipleTargetGroupsFargateService`

```ts
// One application load balancer with one listener and two target groups.
const loadBalancedFargateService = new ApplicationMultipleTargetGroupsFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  targetGroups: [
    {
      containerPort: 80,
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10
    }
  ]
});
```

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

Additionally, if more than one network target group is needed, instantiate one of the following:

* NetworkMultipleTargetGroupsEc2Service

```ts
// Two network load balancers, each with their own listener and target group.
const loadBalancedEc2Service = new NetworkMultipleTargetGroupsEc2Service(stack, 'Service', {
  cluster,
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  loadBalancers: [
    {
      name: 'lb1',
      listeners: [
        {
          name: 'listener1'
        }
      ]
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2'
        }
      ]
    }
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1'
    },
    {
      containerPort: 90,
      listener: 'listener2'
    }
  ]
});
```

* NetworkMultipleTargetGroupsFargateService

```ts
// Two network load balancers, each with their own listener and target group.
const loadBalancedFargateService = new NetworkMultipleTargetGroupsFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  loadBalancers: [
    {
      name: 'lb1',
      listeners: [
        {
          name: 'listener1'
        }
      ]
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2'
        }
      ]
    }
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1'
    },
    {
      containerPort: 90,
      listener: 'listener2'
    }
  ]
});
```

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

## Additional Examples

In addition to using the constructs, users can also add logic to customize these constructs:

### Add Schedule-Based Auto-Scaling to an ApplicationLoadBalancedFargateService

```ts
import { Schedule } from '@aws-cdk/aws-applicationautoscaling';
import { ApplicationLoadBalancedFargateService, ApplicationLoadBalancedFargateServiceProps } from './application-load-balanced-fargate-service';

const loadBalancedFargateService = new ApplicationLoadBalancedFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
});

const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
  minCapacity: 5,
  maxCapacity: 20,
});

scalableTarget.scaleOnSchedule('DaytimeScaleDown', {
  schedule: Schedule.cron({ hour: '8', minute: '0'}),
  minCapacity: 1,
});

scalableTarget.scaleOnSchedule('EveningRushScaleUp', {
  schedule: Schedule.cron({ hour: '20', minute: '0'}),
  minCapacity: 10,
});
```

### Add Metric-Based Auto-Scaling to an ApplicationLoadBalancedFargateService

```ts
import { ApplicationLoadBalancedFargateService } from './application-load-balanced-fargate-service';

const loadBalancedFargateService = new ApplicationLoadBalancedFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
});

const scalableTarget = loadBalancedFargateService.service.autoScaleTaskCount({
  minCapacity: 1,
  maxCapacity: 20,
});

scalableTarget.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 50,
});

scalableTarget.scaleOnMemoryUtilization('MemoryScaling', {
  targetUtilizationPercent: 50,
});
```