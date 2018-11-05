## AWS Elastic Container Service (ECS) Construct Library

This package contains constructs for working with **AWS Elastic Container
Service** (ECS). The simplest example of using this library looks like this:

```ts
// Create an ECS cluster
const cluster = new ecs.Ec2Cluster(this, 'Cluster', {
  vpc,
});

// Add capacity to it
cluster.addDefaultAutoScalingGroupCapacity({
  instanceType: new InstanceType("t2.xlarge"),
  instanceCount: 3,
});

// Instantiate ECS Service with an automatic load balancer
const ecsService = new ecs.LoadBalancedEc2Service(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
});
```

### Fargate vs ECS

There are two sets of constructs in this library; one to run tasks on ECS and
one to run Tasks on Fargate.

- Use the `Ec2Cluster` and `Ec2Service` constructs to run tasks on EC2
  instances running in your account.
- Use the `FargateCluster` and `FargateService` constructs to run tasks on
  instances that are managed for you by AWS.

Here are the main differences:

- **EC2**: instances are under your control. Complete control of task to host
  allocation. Required to specify at least a memory reseration or limit for
  every container. Can use Host, Bridge and AwsVpc networking modes. Can attach
  Classic Load Balancer. Can share volumes between container and host.
- **Fargate**: tasks run on AWS-managed instances, AWS manages task to host
  allocation for you. Requires specification of memory and cpu sizes at the
  taskdefinition level. Only supports AwsVpc networking modes and
  Application/Network Load Balancers. Only the AWS log driver is supported.
  Many host features are not supported such as adding kernel capabilities
  and mounting host devices/volumes inside the container.

For more information on EC2 vs Fargate and networking see the AWS Documentation:
[AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html) and
[Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html).

### Clusters

An `Ec2Cluster` or `FargateCluster` defines the infrastructure to run your
tasks on. You can run many tasks on a single cluster.

To create a Fargate cluster, backed by machines managed by AWS, go:

```ts
const cluster = new ecs.FargateCluster(this, 'Cluster', {
  vpc: vpc
});
```

If you create an ECS cluster you also have to create and add machines to it
to run the tasks scheduled on the cluster. Typically, you will add an
AutoScalingGroup with instances running the latest ECS-optimized AMI to
the cluster. There is a method to build and add such an AutoScalingGroup
automatically, or you can supply a customized AutoScalingGroup that
you construct yourself. It's possible to add multiple AutoScalingGroups
with various instance types if you want to.

Creating an EC2 cluster and adding capacity to it looks like this:

```ts
const cluster = new ecs.Ec2Cluster(this, 'Cluster', {
  vpc: vpc
});

// Either add default capacity
cluster.addDefaultAutoScalingGroupCapacity({
  instanceType: new ec2.InstanceType("t2.xlarge"),
  instanceCount: 3,
});

// Or add customized capacity. Be sure to start the ECS-optimized AMI.
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.xlarge'),
  machineImage: new EcsOptimizedAmi(),
  desiredCapacity: 3,
  // ... other options here ...
});

cluster.addAutoScalingGroupCapacity(autoScalingGroup);
```

### Task definitions

A `TaskDefinition` describes what a single copy of a **Task** should look like.
A task definition has one or more containers; typically, it has one
main container (the *default container* is the first one that's added
to the task definition, and it will be marked *essential*) and optionally
some supporting containers which are used to support the main container,
doings things like upload logs or metrics to monitoring services.

When creating a Task Definition you have to specify what kind of
clusters you intend to run it on: EC2 clusters, Fargate clusters, or
both:

```ts
const taskDefinition = new ecs.TaskDefinition(this, 'TaskDef', {
  memoryMiB: '512'
  cpu: 256,
  compatibility: ecs.Compatibility.Ec2AndFargate,
});
```

To add containers to a `TaskDefinition`, call `addContainer()`:

```ts
taskDefinition.addContainer('main', {
  // Use an image from DockerHub
  image: ecs.DockerHub.image('amazon/amazon-ecs-sample')
});
```
If you're not trying to construct task definitions that can run on multiple
cluster types, you can directly instantiate `Ec2TaskDefinition` or
`FargateTaskDefinition`, classes with a simplified API that only contain
properties relevant for that specific launch type.

#### Images

Images supply the software that runs inside the container. Images can be
obtained from either DockerHub or from ECR repositories:

* `ecs.DockerHub.image(imageName)`: use a publicly available image from
  DockerHub.
* `repository.getImage(tag)`: use the given ECR repository as the image
  to start.

### Service

A `Service` instantiates a `TaskDefinition` on a `Cluster` a given number of
times, optionally associating them with a load balancer. Tasks that fail will
automatically be restarted.

```ts
const taskDefinition;

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 5
});
```

#### Include a load balancer

`Services` are load balancing targets and can be directly attached to load
balancers:

```ts
const service = new ecs.FargateService(this, 'Service', { /* ... */ });

const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('Listener', { port: 80 });
listener.addTargets('ECS', {
  port: 80,
  targets: [service]
});
```

There are two higher-level constructs available which include a load balancer for you:

* `LoadBalancedFargateService`
* `LoadBalancedEc2Service`

### Task AutoScaling

You can configure the task count of a service to match demand. Task AutoScaling is
configured by calling `autoScaleTaskCount()`:

```ts
const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 50
});
```

Task AutoScaling is powered by *Application AutoScaling*. Refer to that for
more information.

### Instance AutoScaling

If you're running on Fargate, AWS will manage the physical machines that your
containers are running on for you. If you're running an ECS cluster however,
your EC2 instances might fill up as your number of Tasks goes up.

To avoid placement errors, you will want to configure AutoScaling for your
EC2 instance group so that your instance count scales with demand.

### Roadmap

- [ ] Instance AutoScaling
- [ ] Service Discovery Integration
- [ ] Private registry authentication

