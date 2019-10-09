## Amazon ECS Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Stable](https://img.shields.io/badge/stability-Stable-success.svg?style=for-the-badge)


---
<!--END STABILITY BANNER-->

This package contains constructs for working with **Amazon Elastic Container
Service** (Amazon ECS).

Amazon ECS is a highly scalable, fast, container management service
that makes it easy to run, stop,
and manage Docker containers on a cluster of Amazon EC2 instances.

For further information on Amazon ECS,
see the [Amazon ECS documentation](https://docs.aws.amazon.com/ecs)

The following example creates an Amazon ECS cluster,
adds capacity to it,
and instantiates the Amazon ECS Service with an automatic load balancer.

```ts
import ecs = require('@aws-cdk/aws-ecs');

// Create an ECS cluster
const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
});

// Add capacity to it
cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  desiredCapacity: 3,
});

// Instantiate an Amazon ECS Service
const ecsService = new ecs.Ec2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
});
```

For a set of constructs defining common ECS architectural patterns, see the `@aws-cdk/aws-ecs-patterns` package.

## AWS Fargate vs Amazon ECS

There are two sets of constructs in this library; one to run tasks on Amazon ECS and
one to run tasks on AWS Fargate.

- Use the `Ec2TaskDefinition` and `Ec2Service` constructs to run tasks on Amazon EC2 instances running in your account.
- Use the `FargateTaskDefinition` and `FargateService` constructs to run tasks on
  instances that are managed for you by AWS.

Here are the main differences:

- **Amazon EC2**: instances are under your control. Complete control of task to host
  allocation. Required to specify at least a memory reseration or limit for
  every container. Can use Host, Bridge and AwsVpc networking modes. Can attach
  Classic Load Balancer. Can share volumes between container and host.
- **AWS Fargate**: tasks run on AWS-managed instances, AWS manages task to host
  allocation for you. Requires specification of memory and cpu sizes at the
  taskdefinition level. Only supports AwsVpc networking modes and
  Application/Network Load Balancers. Only the AWS log driver is supported.
  Many host features are not supported such as adding kernel capabilities
  and mounting host devices/volumes inside the container.

For more information on Amazon EC2 vs AWS Fargate and networking see the AWS Documentation:
[AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) and
[Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html).

## Clusters

A `Cluster` defines the infrastructure to run your
tasks on. You can run many tasks on a single cluster.

The following code creates a cluster that can run AWS Fargate tasks:

```ts
const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc: vpc
});
```

To use tasks with Amazon EC2 launch-type, you have to add capacity to
the cluster in order for tasks to be scheduled on your instances.  Typically,
you add an AutoScalingGroup with instances running the latest
Amazon ECS-optimized AMI to the cluster. There is a method to build and add such an
AutoScalingGroup automatically, or you can supply a customized AutoScalingGroup
that you construct yourself. It's possible to add multiple AutoScalingGroups
with various instance types.

The following example creates an Amazon ECS cluster and adds capacity to it:

```ts
const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc: vpc
});

// Either add default capacity
cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  desiredCapacity: 3,
});

// Or add customized capacity. Be sure to start the Amazon ECS-optimized AMI.
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.xlarge'),
  machineImage: EcsOptimizedImage.amazonLinux(),
  // Or use Amazon ECS-Optimized Amazon Linux 2 AMI
  // machineImage: EcsOptimizedImage.amazonLinux2(),
  desiredCapacity: 3,
  // ... other options here ...
});

cluster.addAutoScalingGroup(autoScalingGroup);
```

If you omit the property `vpc`, the construct will create a new VPC with two AZs.

### Spot Instances

To add spot instances into the cluster, you must specify the `spotPrice` in the `ecs.AddCapacityOptions` and optionally enable the `spotInstanceDraining` property.

```ts
// Add an AutoScalingGroup with spot instances to the existing cluster
cluster.addCapacity('AsgSpot', {
  maxCapacity: 2,
  minCapacity: 2,
  desiredCapacity: 2,
  instanceType: new ec2.InstanceType('c5.xlarge'),
  spotPrice: '0.0735',
  // Enable the Automated Spot Draining support for Amazon ECS
  spotInstanceDraining: true,
});
```

## Task definitions

A task Definition describes what a single copy of a **task** should look like.
A task definition has one or more containers; typically, it has one
main container (the *default container* is the first one that's added
to the task definition, and it is marked *essential*) and optionally
some supporting containers which are used to support the main container,
doings things like upload logs or metrics to monitoring services.

To run a task or service with Amazon EC2 launch type, use the `Ec2TaskDefinition`. For AWS Fargate tasks/services, use the
`FargateTaskDefinition`. These classes provide a simplified API that only contain
properties relevant for that specific launch type.

For a `FargateTaskDefinition`, specify the task size (`memoryLimitMiB` and `cpu`):

```ts
const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256
});
```
To add containers to a task definition, call `addContainer()`:

```ts
const container = fargateTaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  // ... other options here ...
});
```

For a `Ec2TaskDefinition`:

```ts
const ec2TaskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
  networkMode: NetworkMode.BRIDGE
});

const container = ec2TaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024
  // ... other options here ...
});
```

You can specify container properties when you add them to the task definition, or with various methods, e.g.:

```ts
container.addPortMappings({
  containerPort: 3000
})
```

To use a TaskDefinition that can be used with either Amazon EC2 or
AWS Fargate launch types, use the `TaskDefinition` construct.

When creating a task definition you have to specify what kind of
tasks you intend to run: Amazon EC2, AWS Fargate, or both.
The following example uses both:

```ts
const taskDefinition = new ecs.TaskDefinition(this, 'TaskDef', {
  memoryMiB: '512',
  cpu: '256',
  networkMode: NetworkMode.AWS_VPC,
  compatibility: ecs.Compatibility.EC2_AND_FARGATE,
});
```

### Images

Images supply the software that runs inside the container. Images can be
obtained from either DockerHub or from ECR repositories, or built directly from a local Dockerfile.

* `ecs.ContainerImage.fromRegistry(imageName)`: use a public image.
* `ecs.ContainerImage.fromRegistry(imageName, { credentials: mySecret })`: use a private image that requires credentials.
* `ecs.ContainerImage.fromEcrRepository(repo, tag)`: use the given ECR repository as the image
  to start. If no tag is provided, "latest" is assumed.
* `ecs.ContainerImage.fromAsset('./image')`: build and upload an
  image directly from a `Dockerfile` in your source directory.

### Environment variables

To pass environment variables to the container, use the `environment` and `secrets` props.

```ts
taskDefinition.addContainer('container', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  environment: { // clear text, not for sensitive data
    STAGE: 'prod',
  },
  secrets: { // Retrieved from AWS Secrets Manager or AWS Systems Manager Parameter Store at container start-up.
    SECRET: ecs.Secret.fromSecretsManager(secret),
    PARAMETER: ecs.Secret.fromSsmParameter(parameter),
  }
});
```

The task execution role is automatically granted read permissions on the secrets/parameters.

## Service

A `Service` instantiates a `TaskDefinition` on a `Cluster` a given number of
times, optionally associating them with a load balancer.
If a task fails,
Amazon ECS automatically restarts the task.

```ts
const taskDefinition;

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 5
});
```

### Include an application/network load balancer

`Services` are load balancing targets and can be added to a target group, which will be attached to an application/network load balancers:

```ts
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

const service = new ecs.FargateService(this, 'Service', { /* ... */ });

const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('Listener', { port: 80 });
const target = listener.addTargets('ECS', {
  port: 80,
  targets: [service]
});
```

Note that in the example above, if you have multiple containers with multiple ports, then only the first essential container along with its first added container port will be registered as target. To have more control over which container and port to register as targets:

```ts
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

const service = new ecs.FargateService(this, 'Service', { /* ... */ });

const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('Listener', { port: 80 });
const target = listener.addTargets('ECS', {
  port: 80,
  targets: [service.loadBalancerTarget({
    containerName: 'MyContainer',
    containerPort: 12345
  })]
});
```

Alternatively, you can also create all load balancer targets to be registered in this service, add them to target groups, and attach target groups to listeners accordingly.

```ts
import elbv2 = require('@aws-cdk/aws-elasticloadbalancingv2');

const service = new ecs.FargateService(this, 'Service', { /* ... */ });

const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('Listener', { port: 80 });
service.registerLoadBalancerTargets(
  {
    containerTarget: {
      containerName: 'web',
      containerPort: 80,
    },
    targetGroupId: 'ECS',
    listener: ecs.ListenerConfig.applicationListener(listener, {
      protocol: elbv2.ApplicationProtocol.HTTPS
    }),
  },
);
```

### Include a classic load balancer
`Services` can also be directly attached to a classic load balancer as targets:

```ts
import elb = require('@aws-cdk/aws-elasticloadbalancing');

const service = new ecs.Ec2Service(this, 'Service', { /* ... */ });

const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
lb.addListener({ externalPort: 80 });
lb.addTarget(service);
```

Similarly, if you want to have more control over load balancer targeting:

```ts
import elb = require('@aws-cdk/aws-elasticloadbalancing');

const service = new ecs.Ec2Service(this, 'Service', { /* ... */ });

const lb = new elb.LoadBalancer(stack, 'LB', { vpc });
lb.addListener({ externalPort: 80 });
lb.addTarget(service.loadBalancerTarget{
  containerName: 'MyContainer',
  containerPort: 80
});
```

There are two higher-level constructs available which include a load balancer for you that can be found in the aws-ecs-patterns module:

* `LoadBalancedFargateService`
* `LoadBalancedEc2Service`

## Task Auto-Scaling

You can configure the task count of a service to match demand. Task auto-scaling is
configured by calling `autoScaleTaskCount()`:

```ts
const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 50
});

scaling.scaleOnRequestCount('RequestScaling', {
  requestsPerTarget: 10000,
  targetGroup: target
})
```

Task auto-scaling is powered by *Application Auto-Scaling*.
See that section for details.

## Instance Auto-Scaling

If you're running on AWS Fargate, AWS manages the physical machines that your
containers are running on for you. If you're running an Amazon ECS cluster however,
your Amazon EC2 instances might fill up as your number of Tasks goes up.

To avoid placement errors, configure auto-scaling for your
Amazon EC2 instance group so that your instance count scales with demand. To keep
your Amazon EC2 instances halfway loaded, scaling up to a maximum of 30 instances
if required:

```ts
const autoScalingGroup = cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  minCapacity: 3,
  maxCapacity: 30,
  desiredCapacity: 3,

  // Give instances 5 minutes to drain running tasks when an instance is
  // terminated. This is the default, turn this off by specifying 0 or
  // change the timeout up to 900 seconds.
  taskDrainTime: Duration.seconds(300)
});

autoScalingGroup.scaleOnCpuUtilization('KeepCpuHalfwayLoaded', {
  targetUtilizationPercent: 50
});
```

See the `@aws-cdk/aws-autoscaling` library for more autoscaling options
you can configure on your instances.

## Integration with CloudWatch Events

To start an Amazon ECS task on an Amazon EC2-backed Cluster, instantiate an
`@aws-cdk/aws-events-targets.EcsTask` instead of an `Ec2Service`:

```ts
import targets = require('@aws-cdk/aws-events-targets');

// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, '..', 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo' })
});

// An Rule that describes the event trigger (in this case a scheduled run)
const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.expression('rate(1 min)')
});

// Pass an environment variable to the container 'TheContainer' in the task
rule.addTarget(new targets.EcsTask({
  cluster,
  taskDefinition,
  taskCount: 1,
  containerOverrides: [{
    containerName: 'TheContainer',
    environment: [{
      name: 'I_WAS_TRIGGERED',
      value: 'From CloudWatch Events'
    }]
  }]
}));
```

## Log Drivers

Currently Supported Log Drivers:

- awslogs
- fluentd
- gelf
- journald
- json-file
- splunk
- syslog  

### awslogs Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.awslogs({ streamPrefix: 'EventDemo' })
});
```

### fluentd Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.fluentd()
});
```

### gelf Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.gelf()
});
```

### journald Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.journald()
});
```

### json-file Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.jsonFile()
});
```

### splunk Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.splunk()
});
```

### syslog Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.LogDrivers.syslog()
});
```

### Generic Log Driver

A generic log driver object exists to provide a lower level abstraction of the log driver configuration.

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: new ecs.GenericLogDriver({
    logDriver: 'fluentd',
    options: {
      tag: 'example-tag'
    }
  })
});
```
