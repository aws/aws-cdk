## AWS Elastic Container Service (ECS) Construct Library

This package contains constructs for working with **AWS Elastic Container
Service** (ECS). The simplest example of using this library looks like this:

```ts
// Create an ECS cluster (backed by an AutoScaling group)
const cluster = new ecs.EcsCluster(this, 'Cluster', {
  vpc,
  size: 3,
  instanceType: new InstanceType("t2.xlarge")
});

// Instantiate ECS Service with an automatic load balancer
const ecsService = new ecs.LoadBalancedEcsService(this, 'Service', {
  cluster,
  memoryLimitMiB: 512,
  image: ecs.DockerHub.image("amazon/amazon-ecs-sample"),
});
```

### Fargate vs ECS

There are two sets of constructs in this library; one to run tasks on ECS and
one to run Tasks on fargate.

- Use the `EcsCluster`, `EcsTaskDefinition` and `EcsService` constructs to
  run tasks on EC2 instances running in your account.
- Use the `FargateCluster`, `FargateTaskDefinition` and `FargateService`
  constructs to run tasks on instances that are managed for you by AWS.

## Cluster

An `EcsCluster` or `FargateCluster` defines the infrastructure to run your
tasks on. If you create an ECS cluster, an AutoScalingGroup of EC2 instances
running the latest ECS Optimized AMI will implicitly be created for you.

You can run many tasks on a single cluster.

To create a cluster, go:

```ts
const cluster = new ecs.FargateCluster(this, 'Cluster', {
  vpc: vpc
});
```

## TaskDefinition

A `TaskDefinition` describes what a single copy of a **Task** should look like.
A task definition has one or more containers; typically, it has one
main container (the *default container* is the first one that's added
to the task definition, and it will be marked *essential*) and optionally
some supporting containers which are used to support the main container,
doings things like upload logs or metrics to monitoring services.

To add containers to a `TaskDefinition`, call `addContainer()`:

```ts
const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryMiB: '512'
  cpu: 256
});

taskDefinition.addContainer('main', {
  // Use an image from DockerHub
  image: ecs.DockerHub.image('amazon/amazon-ecs-sample')
});
```

### Images

Images supply the software that runs inside the container. Images can be
obtained from either DockerHub or from ECR repositories:

* `ecs.DockerHub.image(imageName)`: use a publicly available image from
  DockerHub.
* `repository.getImage(tag)`: use the given ECR repository as the image
  to start.

## Service

A `Service` instantiates a `TaskDefinition` on a `Cluster` a given number of
times, optionally associating them with a load balancer. Tasks that fail will
automatically be restarted.

```ts
const taskDefinition;

const service = new ecs.EcsService(this, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 5
});
```

### Include a load balancer

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
* `LoadBalancedEcsService`

## Task AutoScaling

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

## Instance AutoScaling

If you're running on Fargate, AWS will manage the physical machines that your
containers are running on for you. If you're running an ECS cluster however,
your EC2 instances might fill up as your number of Tasks goes up.

To avoid placement errors, you will want to configure AutoScaling for your
EC2 instance group so that your instance count scales with demand.

TO BE IMPLEMENTED