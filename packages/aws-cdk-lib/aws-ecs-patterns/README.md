# CDK Construct library for higher-level ECS Constructs


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
declare const cluster: ecs.Cluster;
const loadBalancedEcsService = new ecsPatterns.ApplicationLoadBalancedEc2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('test'),
    environment: {
      TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
      TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value",
    },
    command: ['command'],
    entryPoint: ['entry', 'point'],
  },
  desiredCount: 2,
});
```

* `ApplicationLoadBalancedFargateService`

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    command: ['command'],
    entryPoint: ['entry', 'point'],
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

You can customize the health check configuration of the container via the [`healthCheck`](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ecs.HealthCheck.html) property; otherwise it defaults to the health check configuration from the container.

Fargate services will use the `LATEST` platform version by default, but you can override by providing a value for the `platformVersion` property in the constructor.

Fargate services use the default VPC Security Group unless one or more are provided using the `securityGroups` property in the constructor.

By setting `redirectHTTP` to true, CDK will automatically create a listener on port 80 that redirects HTTP traffic to the HTTPS port.

If you specify the option `recordType` you can decide if you want the construct to use CNAME or Route53-Aliases as record sets.

If you need to encrypt the traffic between the load balancer and the ECS tasks, you can set the `targetProtocol` to `HTTPS`.

Additionally, if more than one application target group are needed, instantiate one of the following:

* `ApplicationMultipleTargetGroupsEc2Service`

```ts
// One application load balancer with one listener and two target groups.
declare const cluster: ecs.Cluster;
const loadBalancedEc2Service = new ecsPatterns.ApplicationMultipleTargetGroupsEc2Service(this, 'Service', {
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
      priority: 10,
    },
  ],
});
```

* `ApplicationMultipleTargetGroupsFargateService`

```ts
// One application load balancer with one listener and two target groups.
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationMultipleTargetGroupsFargateService(this, 'Service', {
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
      priority: 10,
    },
  ],
});
```

## Network Load Balanced Services

To define an Amazon ECS service that is behind a network load balancer, instantiate one of the following:

* `NetworkLoadBalancedEc2Service`

```ts
declare const cluster: ecs.Cluster;
const loadBalancedEcsService = new ecsPatterns.NetworkLoadBalancedEc2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('test'),
    environment: {
      TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
      TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value",
    },
  },
  desiredCount: 2,
});
```

* `NetworkLoadBalancedFargateService`

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'Service', {
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
declare const cluster: ecs.Cluster;
const loadBalancedEc2Service = new ecsPatterns.NetworkMultipleTargetGroupsEc2Service(this, 'Service', {
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
          name: 'listener1',
        },
      ],
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2',
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1',
    },
    {
      containerPort: 90,
      listener: 'listener2',
    },
  ],
});
```

* NetworkMultipleTargetGroupsFargateService

```ts
// Two network load balancers, each with their own listener and target group.
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.NetworkMultipleTargetGroupsFargateService(this, 'Service', {
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
          name: 'listener1',
        },
      ],
    },
    {
      name: 'lb2',
      listeners: [
        {
          name: 'listener2',
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener1',
    },
    {
      containerPort: 90,
      listener: 'listener2',
    },
  ],
});
```

## Queue Processing Services

To define a service that creates a queue and reads from that queue, instantiate one of the following:

* `QueueProcessingEc2Service`

```ts
declare const cluster: ecs.Cluster;
const queueProcessingEc2Service = new ecsPatterns.QueueProcessingEc2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {
    TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
    TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value",
  },
  maxScalingCapacity: 5,
  containerName: 'test',
});
```

* `QueueProcessingFargateService`

```ts
declare const cluster: ecs.Cluster;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {
    TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
    TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value",
  },
  maxScalingCapacity: 5,
  containerName: 'test',
});
```

when queue not provided by user, CDK will create a primary queue and a dead letter queue with default redrive policy and attach permission to the task to be able to access the primary queue.

NOTE: `QueueProcessingFargateService` adds a CPU Based scaling strategy by default. You can turn this off by setting `disableCpuBasedScaling: true`.

```ts
declare const cluster: ecs.Cluster;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {
    TEST_ENVIRONMENT_VARIABLE1: "test environment variable 1 value",
    TEST_ENVIRONMENT_VARIABLE2: "test environment variable 2 value",
  },
  maxScalingCapacity: 5,
  containerName: 'test',
  disableCpuBasedScaling: true,
});
```

To specify a custom target CPU utilization percentage for the scaling strategy use the  `cpuTargetUtilizationPercent` property:

```ts
declare const cluster: ecs.Cluster;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {},
  maxScalingCapacity: 5,
  containerName: 'test',
  cpuTargetUtilizationPercent: 90,
});
```

## Scheduled Tasks

To define a task that runs periodically, there are 2 options:

* `ScheduledEc2Task`

```ts
// Instantiate an Amazon EC2 Task to run at a scheduled interval
declare const cluster: ecs.Cluster;
const ecsScheduledTask = new ecsPatterns.ScheduledEc2Task(this, 'ScheduledTask', {
  cluster,
  scheduledEc2TaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 256,
    environment: { name: 'TRIGGER', value: 'CloudWatch Events' },
  },
  schedule: appscaling.Schedule.expression('rate(1 minute)'),
  enabled: true,
  ruleName: 'sample-scheduled-task-rule',
});
```

* `ScheduledFargateTask`

```ts
declare const cluster: ecs.Cluster;
const scheduledFargateTask = new ecsPatterns.ScheduledFargateTask(this, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  },
  schedule: appscaling.Schedule.expression('rate(1 minute)'),
  platformVersion: ecs.FargatePlatformVersion.LATEST,
});
```

## Additional Examples

In addition to using the constructs, users can also add logic to customize these constructs:

### Configure HTTPS on an ApplicationLoadBalancedFargateService

```ts
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { SslPolicy } from 'aws-cdk-lib/aws-elasticloadbalancingv2';

const domainZone = HostedZone.fromLookup(this, 'Zone', { domainName: 'example.com' });
const certificate = Certificate.fromCertificateArn(this, 'Cert', 'arn:aws:acm:us-east-1:123456:certificate/abcdefg');

declare const vpc: ec2.Vpc;
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  vpc,
  cluster,
  certificate,
  sslPolicy: SslPolicy.RECOMMENDED,
  domainName: 'api.example.com',
  domainZone,
  redirectHTTP: true,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
});
```

### Set capacityProviderStrategies for ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
cluster.enableFargateCapacityProviders();

const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  capacityProviderStrategies: [
    {
      capacityProvider: 'FARGATE_SPOT',
      weight: 2,
      base: 0,
    },
    {
      capacityProvider: 'FARGATE',
      weight: 1,
      base: 1,
    },
  ],
});
```

### Add Schedule-Based Auto-Scaling to an ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
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
  schedule: appscaling.Schedule.cron({ hour: '8', minute: '0'}),
  minCapacity: 1,
});

scalableTarget.scaleOnSchedule('EveningRushScaleUp', {
  schedule: appscaling.Schedule.cron({ hour: '20', minute: '0'}),
  minCapacity: 10,
});
```

### Add Metric-Based Auto-Scaling to an ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
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
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
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

### Deployment circuit breaker and rollback

Amazon ECS [deployment circuit breaker](https://aws.amazon.com/tw/blogs/containers/announcing-amazon-ecs-deployment-circuit-breaker/)
automatically rolls back unhealthy service deployments without the need for manual intervention. Use `circuitBreaker` to enable
deployment circuit breaker and optionally enable `rollback` for automatic rollback. See [Using the deployment circuit breaker](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html)
for more details.

```ts
declare const cluster: ecs.Cluster;
const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  circuitBreaker: { rollback: true },
});
```

### Set deployment configuration on QueueProcessingService

```ts
declare const cluster: ecs.Cluster;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  command: ["-c", "4", "amazon.com"],
  enableLogging: false,
  desiredTaskCount: 2,
  environment: {},
  maxScalingCapacity: 5,
  maxHealthyPercent: 200,
  minHealthyPercent: 66,
});
```

### Set taskSubnets and securityGroups for QueueProcessingFargateService

```ts
declare const vpc: ec2.Vpc;
declare const securityGroup: ec2.SecurityGroup;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  vpc,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  securityGroups: [securityGroup],
  taskSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
});
```

### Define tasks with public IPs for QueueProcessingFargateService

```ts
declare const vpc: ec2.Vpc;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  vpc,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  assignPublicIp: true,
});
```

### Define tasks with custom queue parameters for QueueProcessingFargateService

```ts
declare const vpc: ec2.Vpc;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  vpc,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  maxReceiveCount: 42,
  retentionPeriod: Duration.days(7),
  visibilityTimeout: Duration.minutes(5),
});
```

### Set cooldown for QueueProcessingFargateService

The cooldown period is the amount of time to wait for a previous scaling activity to take effect.
To specify something other than the default cooldown period of 300 seconds, use the `cooldown` parameter: 

```ts
declare const vpc: ec2.Vpc;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  vpc,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  assignPublicIp: true,
  cooldown: Duration.seconds(500),
});
```

### Set capacityProviderStrategies for QueueProcessingFargateService

```ts
declare const cluster: ecs.Cluster;
cluster.enableFargateCapacityProviders();

const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  capacityProviderStrategies: [
    {
      capacityProvider: 'FARGATE_SPOT',
      weight: 2,
    },
    {
      capacityProvider: 'FARGATE',
      weight: 1,
    },
  ],
});
```

### Set a custom container-level Healthcheck for QueueProcessingFargateService

```ts
declare const vpc: ec2.Vpc;
declare const securityGroup: ec2.SecurityGroup;
const queueProcessingFargateService = new ecsPatterns.QueueProcessingFargateService(this, 'Service', {
  vpc,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  healthCheck: {
    command: [ "CMD-SHELL", "curl -f http://localhost/ || exit 1" ],
    // the properties below are optional
    interval: Duration.minutes(30),
    retries: 123,
    startPeriod: Duration.minutes(30),
    timeout: Duration.minutes(30),
  },
});
```

### Set capacityProviderStrategies for QueueProcessingEc2Service

```ts
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';

const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'asg', {
  vpc,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE2, ec2.InstanceSize.MICRO),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
});
const capacityProvider = new ecs.AsgCapacityProvider(this, 'provider', {
  autoScalingGroup,
});
cluster.addAsgCapacityProvider(capacityProvider);

const queueProcessingEc2Service = new ecsPatterns.QueueProcessingEc2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry('test'),
  capacityProviderStrategies: [
    {
      capacityProvider: capacityProvider.capacityProviderName,
    },
  ],
});
```

### Select specific vpc subnets for ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  taskSubnets: {
    subnets: [ec2.Subnet.fromSubnetId(this, 'subnet', 'VpcISOLATEDSubnet1Subnet80F07FA0')],
  },
});
```

### Select idleTimeout for ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  idleTimeout: Duration.seconds(120),
});
```

### Select idleTimeout for ApplicationMultipleTargetGroupsFargateService

```ts
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { InstanceType } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationProtocol, SslPolicy } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
const loadBalancedFargateService = new ecsPatterns.ApplicationMultipleTargetGroupsFargateService(this, 'myService', {
  cluster: new ecs.Cluster(this, 'EcsCluster', { vpc }),
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  enableExecuteCommand: true,
  loadBalancers: [
    {
      name: 'lb',
      idleTimeout: Duration.seconds(400),
      domainName: 'api.example.com',
      domainZone: new PublicHostedZone(this, 'HostedZone', { zoneName: 'example.com' }),
      listeners: [
        {
          name: 'listener',
          protocol: ApplicationProtocol.HTTPS,
          certificate: Certificate.fromCertificateArn(this, 'Cert', 'helloworld'),
          sslPolicy: SslPolicy.TLS12_EXT,
        },
      ],
    },
    {
      name: 'lb2',
      idleTimeout: Duration.seconds(120),
      domainName: 'frontend.com',
      domainZone: new PublicHostedZone(this, 'HostedZone', { zoneName: 'frontend.com' }),
      listeners: [
        {
          name: 'listener2',
          protocol: ApplicationProtocol.HTTPS,
          certificate: Certificate.fromCertificateArn(this, 'Cert2', 'helloworld'),
          sslPolicy: SslPolicy.TLS12_EXT,
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener',
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10,
      listener: 'listener',
    },
    {
      containerPort: 443,
      listener: 'listener2',
    },
    {
      containerPort: 80,
      pathPattern: 'a/b/c',
      priority: 10,
      listener: 'listener2',
    },
  ],
});
```

### Set health checks for ApplicationMultipleTargetGroupsFargateService

```ts
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { InstanceType } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationProtocol,Protocol, SslPolicy } from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });

const loadBalancedFargateService = new ecsPatterns.ApplicationMultipleTargetGroupsFargateService(this, 'myService', {
  cluster: new ecs.Cluster(this, 'EcsCluster', { vpc }),
  memoryLimitMiB: 256,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  enableExecuteCommand: true,
  loadBalancers: [
    {
      name: 'lb',
      idleTimeout: Duration.seconds(400),
      domainName: 'api.example.com',
      domainZone: new PublicHostedZone(this, 'HostedZone', { zoneName: 'example.com' }),
      listeners: [
        {
          name: 'listener',
          protocol: ApplicationProtocol.HTTPS,
          certificate: Certificate.fromCertificateArn(this, 'Cert', 'helloworld'),
          sslPolicy: SslPolicy.TLS12_EXT,
        },
      ],
    },
    {
      name: 'lb2',
      idleTimeout: Duration.seconds(120),
      domainName: 'frontend.com',
      domainZone: new PublicHostedZone(this, 'HostedZone', { zoneName: 'frontend.com' }),
      listeners: [
        {
          name: 'listener2',
          protocol: ApplicationProtocol.HTTPS,
          certificate: Certificate.fromCertificateArn(this, 'Cert2', 'helloworld'),
          sslPolicy: SslPolicy.TLS12_EXT,
        },
      ],
    },
  ],
  targetGroups: [
    {
      containerPort: 80,
      listener: 'listener',
    },
    {
      containerPort: 90,
      pathPattern: 'a/b/c',
      priority: 10,
      listener: 'listener',
    },
    {
      containerPort: 443,
      listener: 'listener2',
    },
    {
      containerPort: 80,
      pathPattern: 'a/b/c',
      priority: 10,
      listener: 'listener2',
    },
  ],
});

loadBalancedFargateService.targetGroups[0].configureHealthCheck({
  port: '8050',
  protocol: Protocol.HTTP,
  healthyThresholdCount: 2,
  unhealthyThresholdCount: 2,
  timeout: Duration.seconds(10),
  interval: Duration.seconds(30),
  healthyHttpCodes: '200',
});


loadBalancedFargateService.targetGroups[1].configureHealthCheck({
  port: '8050',
  protocol: Protocol.HTTP,
  healthyThresholdCount: 2,
  unhealthyThresholdCount: 2,
  timeout: Duration.seconds(10),
  interval: Duration.seconds(30),
  healthyHttpCodes: '200',
});

```

### Set runtimePlatform for ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
const applicationLoadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
  runtimePlatform: {
    cpuArchitecture: ecs.CpuArchitecture.ARM64,
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
  },
});
```

### Set PlatformVersion for ScheduledFargateTask

```ts
declare const cluster: ecs.Cluster;
const scheduledFargateTask = new ecsPatterns.ScheduledFargateTask(this, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  },
  schedule: appscaling.Schedule.expression('rate(1 minute)'),
  platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
});
```

### Set SecurityGroups for ScheduledFargateTask

```ts
const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
const securityGroup = new ec2.SecurityGroup(this, 'SG', { vpc });

const scheduledFargateTask = new ecsPatterns.ScheduledFargateTask(this, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  },
  schedule: appscaling.Schedule.expression('rate(1 minute)'),
  securityGroups: [securityGroup],
});
```

### Deploy application and metrics sidecar

The following is an example of deploying an application along with a metrics sidecar container that utilizes `dockerLabels` for discovery:

```ts
declare const cluster: ecs.Cluster;
declare const vpc: ec2.Vpc;
const service = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  vpc,
  desiredCount: 1,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
    dockerLabels: {
      'application.label.one': 'first_label',
      'application.label.two': 'second_label',
    },
  },
});

service.taskDefinition.addContainer('Sidecar', {
  image: ecs.ContainerImage.fromRegistry('example/metrics-sidecar'),
});
```

### Select specific load balancer name ApplicationLoadBalancedFargateService

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  taskSubnets: {
    subnets: [ec2.Subnet.fromSubnetId(this, 'subnet', 'VpcISOLATEDSubnet1Subnet80F07FA0')],
  },
  loadBalancerName: 'application-lb-name',
});
```

### ECS Exec

You can use ECS Exec to run commands in or get a shell to a container running on an Amazon EC2 instance or on
AWS Fargate. Enable ECS Exec, by setting `enableExecuteCommand` to `true`.

ECS Exec is supported by all Services i.e. `ApplicationLoadBalanced(Fargate|Ec2)Service`, `ApplicationMultipleTargetGroups(Fargate|Ec2)Service`, `NetworkLoadBalanced(Fargate|Ec2)Service`, `NetworkMultipleTargetGroups(Fargate|Ec2)Service`, `QueueProcessing(Fargate|Ec2)Service`. It is not supported for `ScheduledTask`s.

Read more about ECS Exec in the [ECS Developer Guide](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html).

Example:

```ts
declare const cluster: ecs.Cluster;
const loadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
  cluster,
  memoryLimitMiB: 1024,
  desiredCount: 1,
  cpu: 512,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  },
  enableExecuteCommand: true
});
```

Please note, ECS Exec leverages AWS Systems Manager (SSM). So as a prerequisite for the exec command
to work, you need to have the SSM plugin for the AWS CLI installed locally. For more information, see
[Install Session Manager plugin for AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

### Propagate Tags from task definition for ScheduledFargateTask

For tasks that are defined by a Task Definition, tags applied to the definition will not be applied
to the running task by default. To get this behavior, set `propagateTags` to `ecs.PropagatedTagSource.TASK_DEFINITION` as
shown below:

```ts
import { Tags } from 'aws-cdk-lib';

const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});
taskDefinition.addContainer("WebContainer", {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});
Tags.of(taskDefinition).add('my-tag', 'my-tag-value')
const scheduledFargateTask = new ecsPatterns.ScheduledFargateTask(this, 'ScheduledFargateTask', {
  cluster,
  taskDefinition: taskDefinition,
  schedule: appscaling.Schedule.expression('rate(1 minute)'),
  propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
});
```

### Pass a list of tags for ScheduledFargateTask

You can pass a list of tags to be applied to a Fargate task directly. These tags are in addition to any tags
that could be applied to the task definition and propagated using the `propagateTags` attribute.

```ts
const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
const scheduledFargateTask = new ecsPatterns.ScheduledFargateTask(this, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  },
  schedule: appscaling.Schedule.expression('rate(1 minute)'),
  tags: [
    {
      key: 'my-tag',
      value: 'my-tag-value',
    },
  ],
});
```

### Use custom ephemeral storage for ECS Fargate tasks

You can pass a custom ephemeral storage (21GiB - 200GiB) to ECS Fargate tasks on Fargate Platform Version 1.4.0 or later. 

```ts
const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

const applicationLoadBalancedFargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'ALBFargateServiceWithCustomEphemeralStorage', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  ephemeralStorageGiB: 21,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});

const networkLoadBalancedFargateService = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'NLBFargateServiceWithCustomEphemeralStorage', {
  cluster,
  memoryLimitMiB: 1024,
  cpu: 512,
  ephemeralStorageGiB: 200,
  taskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  },
});
```