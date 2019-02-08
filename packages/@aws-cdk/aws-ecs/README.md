# Amazon ECS

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
// Create an ECS cluster
const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
});

// Add capacity to it
cluster.addDefaultAutoScalingGroupCapacity('Capacity', {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  instanceCount: 3,
});

// Instantiate Amazon ECS Service with an automatic load balancer
const ecsService = new ecs.LoadBalancedEc2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
});
```

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
cluster.addDefaultAutoScalingGroupCapacity({
  instanceType: new ec2.InstanceType("t2.xlarge"),
  instanceCount: 3,
});

// Or add customized capacity. Be sure to start the Amazon ECS-optimized AMI.
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.xlarge'),
  machineImage: new EcsOptimizedAmi(),
  // Or use Amazon ECS-Optimized Amazon Linux 2 AMI
  // machineImage: new EcsOptimizedAmi({ generation: ec2.AmazonLinuxGeneration.AmazonLinux2 }),
  desiredCapacity: 3,
  // ... other options here ...
});

cluster.addAutoScalingGroupCapacity(autoScalingGroup);
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

For a `FargateTaskDefinition`, specify the task size (`memoryMiB` and `cpu`):

```ts
const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryMiB: '512',
  cpu: '256'
});
```
To add containers to a task definition, call `addContainer()`:

```ts
const container = fargateTaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
  // ... other options here ...
});
```

For a `Ec2TaskDefinition`:

```ts
const ec2TaskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
  networkMode: bridge
});

const container = ec2TaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromDockerHub("amazon/amazon-ecs-sample"),
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
  cpu: 256,
  networkMode: 'awsvpc',
  compatibility: ecs.Compatibility.Ec2AndFargate,
});
```

### Images

Images supply the software that runs inside the container. Images can be
obtained from either DockerHub or from ECR repositories, or built directly from a local Dockerfile.

* `ecs.ContainerImage.fromDockerHub(imageName)`: use a publicly available image from
  DockerHub.
* `ecs.ContainerImage.fromEcrRepository(repo, tag)`: use the given ECR repository as the image
  to start. If no tag is provided, "latest" is assumed.
* `ecs.ContainerImage.fromAsset(this, 'Image', { directory: './image' })`: build and upload an
  image directly from a `Dockerfile` in your source directory.

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

### Include a load balancer

`Services` are load balancing targets and can be directly attached to load
balancers:

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

There are two higher-level constructs available which include a load balancer for you:

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
const autoScalingGroup = cluster.addDefaultAutoScalingGroupCapacity({
  instanceType: new ec2.InstanceType("t2.xlarge"),
  minCapacity: 3,
  maxCapacity: 30
  instanceCount: 3,

  // Give instances 5 minutes to drain running tasks when an instance is
  // terminated. This is the default, turn this off by specifying 0 or
  // change the timeout up to 900 seconds.
  taskDrainTimeSec: 300,
});

autoScalingGroup.scaleOnCpuUtilization('KeepCpuHalfwayLoaded', {
  targetUtilizationPercent: 50
});
```

See the `@aws-cdk/aws-autoscaling` library for more autoscaling options
you can configure on your instances.

## Integration with CloudWatch Events

To start an Amazon ECS task on an Amazon EC2-backed Cluster, instantiate an
`Ec2TaskEventRuleTarget` instead of an `Ec2Service`:

[example of CloudWatch Events integration](test/ec2/integ.event-task.lit.ts)

> Note: it is currently not possible to start AWS Fargate tasks in this way.

## Roadmap

- [ ] Service Discovery Integration
- [ ] Private registry authentication
