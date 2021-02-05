# CDK Construct library for higher-level ECS Constructs
<!--BEGIN STABILITY BANNER-->

---

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

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

loadBalancedFargateService.targetGroup.configureHealthCheck({
  path: "/custom-health-path",
});
```

Instead of providing a cluster you can specify a VPC and CDK will create a new ECS cluster.
If you deploy multiple services CDK will only create one cluster per VPC.

You can omit `cluster` and `vpc` to let CDK create a new VPC with two AZs and create a cluster inside this VPC.

You can customize the health check for your target group; otherwise it defaults to `HTTP` over port `80` hitting path `/`.

Fargate services will use the `LATEST` platform version by default, but you can override by providing a value for the `platformVersion` property in the constructor.

Fargate services use the default VPC Security Group unless one or more are provided using the `securityGroups` property in the constructor.

By setting `redirectHTTP` to true, CDK will automatically create a listener on port 80 that redirects HTTP traffic to the HTTPS port.

If you specify the option `recordType` you can decide if you want the construct to use CNAME or Route53-Aliases as record sets.

If you need to encrypt the traffic between the load balancer and the ECS tasks, you can set the `targetProtocol` to `HTTPS`.

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

If you specify the option `recordType` you can decide if you want the construct to use CNAME or Route53-Aliases as record sets.

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
  maxScalingCapacity: 5,
  containerName: 'test',
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
  maxScalingCapacity: 5,
  containerName: 'test',
});
```

when queue not provided by user, CDK will create a primary queue and a dead letter queue with default redrive policy and attach permission to the task to be able to access the primary queue.

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
  schedule: events.Schedule.expression('rate(1 minute)'),
  ruleName: 'sample-scheduled-task-rule'
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

### Change the default Deployment Controller

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
  deploymentController: {
    type: ecs.DeploymentControllerType.CODE_DEPLOY,
  },
});
```

### Set deployment configuration on QueueProcessingService

```ts
const queueProcessingFargateService = new QueueProcessingFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {},
  queue,
  maxScalingCapacity: 5,
  maxHealthyPercent: 200,
  minHealthPercent: 66,
});
```

### Select specific vpc subnets for ApplicationLoadBalancedFargateService

```ts
const loadBalancedFargateService = new ApplicationLoadBalancedFargateService(stack, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  vpcSubnets: {
    subnets: [ec2.Subnet.fromSubnetId(stack, 'subnet', 'VpcISOLATEDSubnet1Subnet80F07FA0')],
  },
});
```

### Set PlatformVersion for ScheduledFargateTask

```ts
const scheduledFargateTask = new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  },
  schedule: events.Schedule.expression('rate(1 minute)'),
  platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
});
```
