# Amazon ECS Construct Library


This package contains constructs for working with **Amazon Elastic Container
Service** (Amazon ECS).

Amazon Elastic Container Service (Amazon ECS) is a fully managed container orchestration service.

For further information on Amazon ECS,
see the [Amazon ECS documentation](https://docs.aws.amazon.com/ecs)

The following example creates an Amazon ECS cluster, adds capacity to it, and
runs a service on it:

```ts
declare const vpc: ec2.Vpc;

// Create an ECS cluster
const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

// Add capacity to it
cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  desiredCapacity: 3,
});

const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');

taskDefinition.addContainer('DefaultContainer', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 512,
});

// Instantiate an Amazon ECS Service
const ecsService = new ecs.Ec2Service(this, 'Service', {
  cluster,
  taskDefinition,
});
```

For a set of constructs defining common ECS architectural patterns, see the `@aws-cdk/aws-ecs-patterns` package.

## Launch Types: AWS Fargate vs Amazon EC2 vs AWS ECS Anywhere

There are three sets of constructs in this library:

- Use the `Ec2TaskDefinition` and `Ec2Service` constructs to run tasks on Amazon EC2 instances running in your account.
- Use the `FargateTaskDefinition` and `FargateService` constructs to run tasks on
  instances that are managed for you by AWS.
- Use the `ExternalTaskDefinition` and `ExternalService` constructs to run AWS ECS Anywhere tasks on self-managed infrastructure.

Here are the main differences:

- **Amazon EC2**: instances are under your control. Complete control of task to host
  allocation. Required to specify at least a memory reservation or limit for
  every container. Can use Host, Bridge and AwsVpc networking modes. Can attach
  Classic Load Balancer. Can share volumes between container and host.
- **AWS Fargate**: tasks run on AWS-managed instances, AWS manages task to host
  allocation for you. Requires specification of memory and cpu sizes at the
  taskdefinition level. Only supports AwsVpc networking modes and
  Application/Network Load Balancers. Only the AWS log driver is supported.
  Many host features are not supported such as adding kernel capabilities
  and mounting host devices/volumes inside the container.
- **AWS ECS Anywhere**: tasks are run and managed by AWS ECS Anywhere on infrastructure
  owned by the customer. Bridge, Host and None networking modes are supported. Does not
  support autoscaling, load balancing, cloudmap or attachment of volumes.

For more information on Amazon EC2 vs AWS Fargate, networking and ECS Anywhere see the AWS Documentation:
[AWS Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/AWS_Fargate.html),
[Task Networking](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-networking.html),
[ECS Anywhere](https://aws.amazon.com/ecs/anywhere/)

## Clusters

A `Cluster` defines the infrastructure to run your
tasks on. You can run many tasks on a single cluster.

The following code creates a cluster that can run AWS Fargate tasks:

```ts
declare const vpc: ec2.Vpc;

const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
});
```

The following code imports an existing cluster using the ARN which can be used to
import an Amazon ECS service either EC2 or Fargate.

```ts
const clusterArn = 'arn:aws:ecs:us-east-1:012345678910:cluster/clusterName';

const cluster = ecs.Cluster.fromClusterArn(this, 'Cluster', clusterArn);
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
declare const vpc: ec2.Vpc;

const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
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
  machineImage: ecs.EcsOptimizedImage.amazonLinux(),
  // Or use Amazon ECS-Optimized Amazon Linux 2 AMI
  // machineImage: EcsOptimizedImage.amazonLinux2(),
  desiredCapacity: 3,
  // ... other options here ...
});

const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
  autoScalingGroup,
});
cluster.addAsgCapacityProvider(capacityProvider);
```

If you omit the property `vpc`, the construct will create a new VPC with two AZs.

By default, all machine images will auto-update to the latest version
on each deployment, causing a replacement of the instances in your AutoScalingGroup
if the AMI has been updated since the last deployment.

If task draining is enabled, ECS will transparently reschedule tasks on to the new
instances before terminating your old instances. If you have disabled task draining,
the tasks will be terminated along with the instance. To prevent that, you
can pick a non-updating AMI by passing `cacheInContext: true`, but be sure
to periodically update to the latest AMI manually by using the [CDK CLI
context management commands](https://docs.aws.amazon.com/cdk/latest/guide/context.html):

```ts
declare const vpc: ec2.Vpc;
const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  machineImage: ecs.EcsOptimizedImage.amazonLinux({ cachedInContext: true }),
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
});
```

To use `LaunchTemplate` with `AsgCapacityProvider`, make sure to specify the `userData` in the `LaunchTemplate`:

```ts
declare const vpc: ec2.Vpc;
const launchTemplate = new ec2.LaunchTemplate(this, 'ASG-LaunchTemplate', {
  instanceType: new ec2.InstanceType('t3.medium'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  userData: ec2.UserData.forLinux(),
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  mixedInstancesPolicy: {
    instancesDistribution: {
      onDemandPercentageAboveBaseCapacity: 50,
    },
    launchTemplate: launchTemplate,
  },
});

const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
  autoScalingGroup,
  machineImageType: ecs.MachineImageType.AMAZON_LINUX_2,
});

cluster.addAsgCapacityProvider(capacityProvider);
```


### Bottlerocket

[Bottlerocket](https://aws.amazon.com/bottlerocket/) is a Linux-based open source operating system that is
purpose-built by AWS for running containers. You can launch Amazon ECS container instances with the Bottlerocket AMI.

The following example will create a capacity with self-managed Amazon EC2 capacity of 2 `c5.large` Linux instances running with `Bottlerocket` AMI.

The following example adds Bottlerocket capacity to the cluster:

```ts
declare const cluster: ecs.Cluster;

cluster.addCapacity('bottlerocket-asg', {
  minCapacity: 2,
  instanceType: new ec2.InstanceType('c5.large'),
  machineImage: new ecs.BottleRocketImage(),
});
```

### ARM64 (Graviton) Instances

To launch instances with ARM64 hardware, you can use the Amazon ECS-optimized
Amazon Linux 2 (arm64) AMI. Based on Amazon Linux 2, this AMI is recommended
for use when launching your EC2 instances that are powered by Arm-based AWS
Graviton Processors.

```ts
declare const cluster: ecs.Cluster;

cluster.addCapacity('graviton-cluster', {
  minCapacity: 2,
  instanceType: new ec2.InstanceType('c6g.large'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(ecs.AmiHardwareType.ARM),
});
```

Bottlerocket is also supported:

```ts
declare const cluster: ecs.Cluster;

cluster.addCapacity('graviton-cluster', {
  minCapacity: 2,
  instanceType: new ec2.InstanceType('c6g.large'),
  machineImageType: ecs.MachineImageType.BOTTLEROCKET,
});
```

### Spot Instances

To add spot instances into the cluster, you must specify the `spotPrice` in the `ecs.AddCapacityOptions` and optionally enable the `spotInstanceDraining` property.

```ts
declare const cluster: ecs.Cluster;

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

### SNS Topic Encryption

When the `ecs.AddCapacityOptions` that you provide has a non-zero `taskDrainTime` (the default) then an SNS topic and Lambda are created to ensure that the
cluster's instances have been properly drained of tasks before terminating. The SNS Topic is sent the instance-terminating lifecycle event from the AutoScalingGroup,
and the Lambda acts on that event. If you wish to engage [server-side encryption](https://docs.aws.amazon.com/sns/latest/dg/sns-data-encryption.html) for this SNS Topic
then you may do so by providing a KMS key for the `topicEncryptionKey` property of `ecs.AddCapacityOptions`.

```ts
// Given
declare const cluster: ecs.Cluster;
declare const key: kms.Key;
// Then, use that key to encrypt the lifecycle-event SNS Topic.
cluster.addCapacity('ASGEncryptedSNS', {
  instanceType: new ec2.InstanceType("t2.xlarge"),
  desiredCapacity: 3,
  topicEncryptionKey: key,
});
```

## Task definitions

A task definition describes what a single copy of a **task** should look like.
A task definition has one or more containers; typically, it has one
main container (the *default container* is the first one that's added
to the task definition, and it is marked *essential*) and optionally
some supporting containers which are used to support the main container,
doings things like upload logs or metrics to monitoring services.

To run a task or service with Amazon EC2 launch type, use the `Ec2TaskDefinition`. For AWS Fargate tasks/services, use the
`FargateTaskDefinition`. For AWS ECS Anywhere use the `ExternalTaskDefinition`. These classes
provide simplified APIs that only contain properties relevant for each specific launch type.

For a `FargateTaskDefinition`, specify the task size (`memoryLimitMiB` and `cpu`):

```ts
const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});
```

On Fargate Platform Version 1.4.0 or later, you may specify up to 200GiB of
[ephemeral storage](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-task-storage.html#fargate-task-storage-pv14):

```ts
const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
  ephemeralStorageGiB: 100,
});
```

To add containers to a task definition, call `addContainer()`:

```ts
const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});
const container = fargateTaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  // ... other options here ...
});
```

For an `Ec2TaskDefinition`:

```ts
const ec2TaskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef', {
  networkMode: ecs.NetworkMode.BRIDGE,
});

const container = ec2TaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  // ... other options here ...
});
```

For an `ExternalTaskDefinition`:

```ts
const externalTaskDefinition = new ecs.ExternalTaskDefinition(this, 'TaskDef');

const container = externalTaskDefinition.addContainer("WebContainer", {
  // Use an image from DockerHub
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  // ... other options here ...
});
```

You can specify container properties when you add them to the task definition, or with various methods, e.g.:

To add a port mapping when adding a container to the task definition, specify the `portMappings` option:

```ts
declare const taskDefinition: ecs.TaskDefinition;

taskDefinition.addContainer("WebContainer", {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  portMappings: [{ containerPort: 3000 }],
});
```

To add port mappings directly to a container definition, call `addPortMappings()`:

```ts
declare const container: ecs.ContainerDefinition;

container.addPortMappings({
  containerPort: 3000,
});
```

To add data volumes to a task definition, call `addVolume()`:

```ts
const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  memoryLimitMiB: 512,
  cpu: 256,
});
const volume = {
  // Use an Elastic FileSystem
  name: "mydatavolume",
  efsVolumeConfiguration: {
    fileSystemId: "EFS",
    // ... other options here ...
  },
};

const container = fargateTaskDefinition.addVolume(volume);
```

> Note: ECS Anywhere doesn't support volume attachments in the task definition.

To use a TaskDefinition that can be used with either Amazon EC2 or
AWS Fargate launch types, use the `TaskDefinition` construct.

When creating a task definition you have to specify what kind of
tasks you intend to run: Amazon EC2, AWS Fargate, or both.
The following example uses both:

```ts
const taskDefinition = new ecs.TaskDefinition(this, 'TaskDef', {
  memoryMiB: '512',
  cpu: '256',
  networkMode: ecs.NetworkMode.AWS_VPC,
  compatibility: ecs.Compatibility.EC2_AND_FARGATE,
});
```

To grant a principal permission to run your `TaskDefinition`, you can use the `TaskDefinition.grantRun()` method:

```ts
declare const role: iam.IGrantable;
const taskDef = new ecs.TaskDefinition(this, 'TaskDef', {
  cpu: '512',
  memoryMiB: '512',
  compatibility: ecs.Compatibility.EC2_AND_FARGATE,
});

// Gives role required permissions to run taskDef
taskDef.grantRun(role);
```

### Images

Images supply the software that runs inside the container. Images can be
obtained from either DockerHub or from ECR repositories, built directly from a local Dockerfile, or use an existing tarball.

- `ecs.ContainerImage.fromRegistry(imageName)`: use a public image.
- `ecs.ContainerImage.fromRegistry(imageName, { credentials: mySecret })`: use a private image that requires credentials.
- `ecs.ContainerImage.fromEcrRepository(repo, tagOrDigest)`: use the given ECR repository as the image
  to start. If no tag or digest is provided, "latest" is assumed.
- `ecs.ContainerImage.fromAsset('./image')`: build and upload an
  image directly from a `Dockerfile` in your source directory.
- `ecs.ContainerImage.fromDockerImageAsset(asset)`: uses an existing
  `@aws-cdk/aws-ecr-assets.DockerImageAsset` as a container image.
- `ecs.ContainerImage.fromTarball(file)`: use an existing tarball.
- `new ecs.TagParameterContainerImage(repository)`: use the given ECR repository as the image
  but a CloudFormation parameter as the tag.

### Environment variables

To pass environment variables to the container, you can use the `environment`, `environmentFiles`, and `secrets` props.

```ts
declare const secret: secretsmanager.Secret;
declare const dbSecret: secretsmanager.Secret;
declare const parameter: ssm.StringParameter;
declare const taskDefinition: ecs.TaskDefinition;
declare const s3Bucket: s3.Bucket;

const newContainer = taskDefinition.addContainer('container', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  environment: { // clear text, not for sensitive data
    STAGE: 'prod',
  },
  environmentFiles: [ // list of environment files hosted either on local disk or S3
    ecs.EnvironmentFile.fromAsset('./demo-env-file.env'),
    ecs.EnvironmentFile.fromBucket(s3Bucket, 'assets/demo-env-file.env'),
  ],
  secrets: { // Retrieved from AWS Secrets Manager or AWS Systems Manager Parameter Store at container start-up.
    SECRET: ecs.Secret.fromSecretsManager(secret),
    DB_PASSWORD: ecs.Secret.fromSecretsManager(dbSecret, 'password'), // Reference a specific JSON field, (requires platform version 1.4.0 or later for Fargate tasks)
    API_KEY: ecs.Secret.fromSecretsManagerVersion(secret, { versionId: '12345' }, 'apiKey'), // Reference a specific version of the secret by its version id or version stage (requires platform version 1.4.0 or later for Fargate tasks)
    PARAMETER: ecs.Secret.fromSsmParameter(parameter),
  },
});
newContainer.addEnvironment('QUEUE_NAME', 'MyQueue');
newContainer.addSecret('API_KEY', ecs.Secret.fromSecretsManager(secret));
newContainer.addSecret('DB_PASSWORD', ecs.Secret.fromSecretsManager(secret, 'password'));
```

The task execution role is automatically granted read permissions on the secrets/parameters. Support for environment
files is restricted to the EC2 launch type for files hosted on S3. Further details provided in the AWS documentation
about [specifying environment variables](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/taskdef-envfiles.html).

### Linux parameters

To apply additional linux-specific options related to init process and memory management to the container, use the `linuxParameters` property:

```ts
declare const taskDefinition: ecs.TaskDefinition;

taskDefinition.addContainer('container', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  linuxParameters: new ecs.LinuxParameters(this, 'LinuxParameters', {
    initProcessEnabled: true,
    sharedMemorySize: 1024,
    maxSwap: Size.mebibytes(5000),
    swappiness: 90,
  }),
});
```

### System controls

To set system controls (kernel parameters) on the container, use the `systemControls` prop:

```ts
declare const taskDefinition: ecs.TaskDefinition;

taskDefinition.addContainer('container', {
  image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
  memoryLimitMiB: 1024,
  systemControls: [
    {
      namespace: 'net.ipv6.conf.all.default.disable_ipv6',
      value: '1',
    },
  ],
});
```

### Using Windows containers on Fargate

AWS Fargate supports Amazon ECS Windows containers. For more details, please see this [blog post](https://aws.amazon.com/tw/blogs/containers/running-windows-containers-with-amazon-ecs-on-aws-fargate/)

```ts
// Create a Task Definition for the Windows container to start
const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.WINDOWS_SERVER_2019_CORE,
    cpuArchitecture: ecs.CpuArchitecture.X86_64,
  },
  cpu: 1024,
  memoryLimitMiB: 2048,
});

taskDefinition.addContainer('windowsservercore', {
  logging: ecs.LogDriver.awsLogs({ streamPrefix: 'win-iis-on-fargate' }),
  portMappings: [{ containerPort: 80 }],
  image: ecs.ContainerImage.fromRegistry('mcr.microsoft.com/windows/servercore/iis:windowsservercore-ltsc2019'),
});
```

### Using Graviton2 with Fargate

AWS Graviton2 supports AWS Fargate. For more details, please see this [blog post](https://aws.amazon.com/blogs/aws/announcing-aws-graviton2-support-for-aws-fargate-get-up-to-40-better-price-performance-for-your-serverless-containers/)

```ts
// Create a Task Definition for running container on Graviton Runtime.
const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
  runtimePlatform: {
    operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
    cpuArchitecture: ecs.CpuArchitecture.ARM64,
  },
  cpu: 1024,
  memoryLimitMiB: 2048,
});

taskDefinition.addContainer('webarm64', {
  logging: ecs.LogDriver.awsLogs({ streamPrefix: 'graviton2-on-fargate' }),
  portMappings: [{ containerPort: 80 }],
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/nginx/nginx:latest-arm64v8'),
});
```

## Service

A `Service` instantiates a `TaskDefinition` on a `Cluster` a given number of
times, optionally associating them with a load balancer.
If a task fails,
Amazon ECS automatically restarts the task.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 5,
});
```

ECS Anywhere service definition looks like:

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;

const service = new ecs.ExternalService(this, 'Service', {
  cluster,
  taskDefinition,
  desiredCount: 5,
});
```

`Services` by default will create a security group if not provided.
If you'd like to specify which security groups to use you can override the `securityGroups` property.

### Deployment circuit breaker and rollback

Amazon ECS [deployment circuit breaker](https://aws.amazon.com/tw/blogs/containers/announcing-amazon-ecs-deployment-circuit-breaker/)
automatically rolls back unhealthy service deployments without the need for manual intervention. Use `circuitBreaker` to enable
deployment circuit breaker and optionally enable `rollback` for automatic rollback. See [Using the deployment circuit breaker](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html)
for more details.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
  circuitBreaker: { rollback: true },
});
```

> Note: ECS Anywhere doesn't support deployment circuit breakers and rollback.

### Include an application/network load balancer

`Services` are load balancing targets and can be added to a target group, which will be attached to an application/network load balancers:

```ts
declare const vpc: ec2.Vpc;
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
const service = new ecs.FargateService(this, 'Service', { cluster, taskDefinition });

const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('Listener', { port: 80 });
const targetGroup1 = listener.addTargets('ECS1', {
  port: 80,
  targets: [service],
});
const targetGroup2 = listener.addTargets('ECS2', {
  port: 80,
  targets: [service.loadBalancerTarget({
    containerName: 'MyContainer',
    containerPort: 8080
  })],
});
```

> Note: ECS Anywhere doesn't support application/network load balancers.

Note that in the example above, the default `service` only allows you to register the first essential container or the first mapped port on the container as a target and add it to a new target group. To have more control over which container and port to register as targets, you can use `service.loadBalancerTarget()` to return a load balancing target for a specific container and port.

Alternatively, you can also create all load balancer targets to be registered in this service, add them to target groups, and attach target groups to listeners accordingly.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
declare const vpc: ec2.Vpc;
const service = new ecs.FargateService(this, 'Service', { cluster, taskDefinition });

const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', { vpc, internetFacing: true });
const listener = lb.addListener('Listener', { port: 80 });
service.registerLoadBalancerTargets(
  {
    containerName: 'web',
    containerPort: 80,
    newTargetGroupId: 'ECS',
    listener: ecs.ListenerConfig.applicationListener(listener, {
      protocol: elbv2.ApplicationProtocol.HTTPS
    }),
  },
);
```

### Using a Load Balancer from a different Stack

If you want to put your Load Balancer and the Service it is load balancing to in
different stacks, you may not be able to use the convenience methods
`loadBalancer.addListener()` and `listener.addTargets()`.

The reason is that these methods will create resources in the same Stack as the
object they're called on, which may lead to cyclic references between stacks.
Instead, you will have to create an `ApplicationListener` in the service stack,
or an empty `TargetGroup` in the load balancer stack that you attach your
service to.

See the [ecs/cross-stack-load-balancer example](https://github.com/aws-samples/aws-cdk-examples/tree/master/typescript/ecs/cross-stack-load-balancer/)
for the alternatives.

### Include a classic load balancer

`Services` can also be directly attached to a classic load balancer as targets:

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
declare const vpc: ec2.Vpc;
const service = new ecs.Ec2Service(this, 'Service', { cluster, taskDefinition });

const lb = new elb.LoadBalancer(this, 'LB', { vpc });
lb.addListener({ externalPort: 80 });
lb.addTarget(service);
```

Similarly, if you want to have more control over load balancer targeting:

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
declare const vpc: ec2.Vpc;
const service = new ecs.Ec2Service(this, 'Service', { cluster, taskDefinition });

const lb = new elb.LoadBalancer(this, 'LB', { vpc });
lb.addListener({ externalPort: 80 });
lb.addTarget(service.loadBalancerTarget({
  containerName: 'MyContainer',
  containerPort: 80,
}));
```

There are two higher-level constructs available which include a load balancer for you that can be found in the aws-ecs-patterns module:

- `LoadBalancedFargateService`
- `LoadBalancedEc2Service`

### Import existing services

`Ec2Service` and `FargateService` provide methods to import existing EC2/Fargate services.
The ARN of the existing service has to be specified to import the service.

Since AWS has changed the [ARN format for ECS](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-account-settings.html#ecs-resource-ids),
feature flag `@aws-cdk/aws-ecs:arnFormatIncludesClusterName` must be enabled to use the new ARN format.
The feature flag changes behavior for the entire CDK project. Therefore it is not possible to mix the old and the new format in one CDK project.

```tss
declare const cluster: ecs.Cluster;

// Import service from EC2 service attributes
const service = ecs.Ec2Service.fromEc2ServiceAttributes(this, 'EcsService', {
  serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
  cluster,
});

// Import service from EC2 service ARN
const service = ecs.Ec2Service.fromEc2ServiceArn(this, 'EcsService', 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service');

// Import service from Fargate service attributes
const service = ecs.FargateService.fromFargateServiceAttributes(this, 'EcsService', {
  serviceArn: 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service',
  cluster,
});

// Import service from Fargate service ARN
const service = ecs.FargateService.fromFargateServiceArn(this, 'EcsService', 'arn:aws:ecs:us-west-2:123456789012:service/my-http-service');
```

## Task Auto-Scaling

You can configure the task count of a service to match demand. Task auto-scaling is
configured by calling `autoScaleTaskCount()`:

```ts
declare const target: elbv2.ApplicationTargetGroup;
declare const service: ecs.BaseService;
const scaling = service.autoScaleTaskCount({ maxCapacity: 10 });
scaling.scaleOnCpuUtilization('CpuScaling', {
  targetUtilizationPercent: 50,
});

scaling.scaleOnRequestCount('RequestScaling', {
  requestsPerTarget: 10000,
  targetGroup: target,
});
```

Task auto-scaling is powered by *Application Auto-Scaling*.
See that section for details.

## Integration with CloudWatch Events

To start an Amazon ECS task on an Amazon EC2-backed Cluster, instantiate an
`@aws-cdk/aws-events-targets.EcsTask` instead of an `Ec2Service`:

```ts
declare const cluster: ecs.Cluster;
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, '..', 'eventhandler-image')),
  memoryLimitMiB: 256,
  logging: new ecs.AwsLogDriver({ streamPrefix: 'EventDemo', mode: ecs.AwsLogDriverMode.NON_BLOCKING }),
});

// An Rule that describes the event trigger (in this case a scheduled run)
const rule = new events.Rule(this, 'Rule', {
  schedule: events.Schedule.expression('rate(1 min)'),
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
    }],
  }],
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
- awsfirelens
- Generic

### awslogs Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.awsLogs({ streamPrefix: 'EventDemo' }),
});
```

### fluentd Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.fluentd(),
});
```

### gelf Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.gelf({ address: 'my-gelf-address' }),
});
```

### journald Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.journald(),
});
```

### json-file Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.jsonFile(),
});
```

### splunk Log Driver

```ts
declare const secret: ecs.Secret;

// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.splunk({
    secretToken: secret,
    url: 'my-splunk-url',
  }),
});
```

### syslog Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.syslog(),
});
```

### firelens Log Driver

```ts
// Create a Task Definition for the container to start
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.firelens({
    options: {
        Name: 'firehose',
        region: 'us-west-2',
        delivery_stream: 'my-stream',
    },
  }),
});
```

To pass secrets to the log configuration, use the `secretOptions` property of the log configuration. The task execution role is automatically granted read permissions on the secrets/parameters.

```ts
declare const secret: secretsmanager.Secret;
declare const parameter: ssm.StringParameter;

const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  memoryLimitMiB: 256,
  logging: ecs.LogDrivers.firelens({
    options: {
      // ... log driver options here ...
    },
    secretOptions: { // Retrieved from AWS Secrets Manager or AWS Systems Manager Parameter Store
      apikey: ecs.Secret.fromSecretsManager(secret),
      host: ecs.Secret.fromSsmParameter(parameter),
    },
  }),
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
      tag: 'example-tag',
    },
  }),
});
```

## CloudMap Service Discovery

To register your ECS service with a CloudMap Service Registry, you may add the
`cloudMapOptions` property to your service:

```ts
declare const taskDefinition: ecs.TaskDefinition;
declare const cluster: ecs.Cluster;

const service = new ecs.Ec2Service(this, 'Service', {
  cluster,
  taskDefinition,
  cloudMapOptions: {
    // Create A records - useful for AWSVPC network mode.
    dnsRecordType: cloudmap.DnsRecordType.A,
  },
});
```

With `bridge` or `host` network modes, only `SRV` DNS record types are supported.
By default, `SRV` DNS record types will target the default container and default
port. However, you may target a different container and port on the same ECS task:

```ts
declare const taskDefinition: ecs.TaskDefinition;
declare const cluster: ecs.Cluster;

// Add a container to the task definition
const specificContainer = taskDefinition.addContainer('Container', {
  image: ecs.ContainerImage.fromRegistry('/aws/aws-example-app'),
  memoryLimitMiB: 2048,
});

// Add a port mapping
specificContainer.addPortMappings({
  containerPort: 7600,
  protocol: ecs.Protocol.TCP,
});

new ecs.Ec2Service(this, 'Service', {
  cluster,
  taskDefinition,
  cloudMapOptions: {
    // Create SRV records - useful for bridge networking
    dnsRecordType: cloudmap.DnsRecordType.SRV,
    // Targets port TCP port 7600 `specificContainer`
    container: specificContainer,
    containerPort: 7600,
  },
});
```

### Associate With a Specific CloudMap Service

You may associate an ECS service with a specific CloudMap service. To do
this, use the service's `associateCloudMapService` method:

```ts
declare const cloudMapService: cloudmap.Service;
declare const ecsService: ecs.FargateService;

ecsService.associateCloudMapService({
  service: cloudMapService,
});
```

## Capacity Providers

There are two major families of Capacity Providers: [AWS
Fargate](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/fargate-capacity-providers.html)
(including Fargate Spot) and EC2 [Auto Scaling
Group](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/asg-capacity-providers.html)
Capacity Providers. Both are supported.

### Fargate Capacity Providers

To enable Fargate capacity providers, you can either set
`enableFargateCapacityProviders` to `true` when creating your cluster, or by
invoking the `enableFargateCapacityProviders()` method after creating your
cluster. This will add both `FARGATE` and `FARGATE_SPOT` as available capacity
providers on your cluster.

```ts
declare const vpc: ec2.Vpc;

const cluster = new ecs.Cluster(this, 'FargateCPCluster', {
  vpc,
  enableFargateCapacityProviders: true,
});

const taskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

new ecs.FargateService(this, 'FargateService', {
  cluster,
  taskDefinition,
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

### Auto Scaling Group Capacity Providers

To add an Auto Scaling Group Capacity Provider, first create an EC2 Auto Scaling
Group. Then, create an `AsgCapacityProvider` and pass the Auto Scaling Group to
it in the constructor. Then add the Capacity Provider to the cluster. Finally,
you can refer to the Provider by its name in your service's or task's Capacity
Provider strategy.

By default, Auto Scaling Group Capacity Providers will manage the scale-in and
scale-out behavior of the auto scaling group based on the load your tasks put on
the cluster, this is called [Managed Scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/asg-capacity-providers.html#asg-capacity-providers-managed-scaling). If you'd
rather manage scaling behavior yourself set `enableManagedScaling` to `false`.

Additionally [Managed Termination Protection](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-auto-scaling.html#managed-termination-protection) is enabled by default to
prevent scale-in behavior from terminating instances that have non-daemon tasks
running on them. This is ideal for tasks that should be ran to completion. If your
tasks are safe to interrupt then this protection can be disabled by setting
`enableManagedTerminationProtection` to `false`. Managed Scaling must be enabled for
Managed Termination Protection to work.

> Currently there is a known [CloudFormation issue](https://github.com/aws/containers-roadmap/issues/631)
> that prevents CloudFormation from automatically deleting Auto Scaling Groups that
> have Managed Termination Protection enabled. To work around this issue you could set
> `enableManagedTerminationProtection` to `false` on the Auto Scaling Group Capacity
> Provider. If you'd rather not disable Managed Termination Protection, you can [manually
> delete the Auto Scaling Group](https://docs.aws.amazon.com/autoscaling/ec2/userguide/as-process-shutdown.html).
> For other workarounds, see [this GitHub issue](https://github.com/aws/aws-cdk/issues/18179).

```ts
declare const vpc: ec2.Vpc;

const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
});

const autoScalingGroup = new autoscaling.AutoScalingGroup(this, 'ASG', {
  vpc,
  instanceType: new ec2.InstanceType('t2.micro'),
  machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
  minCapacity: 0,
  maxCapacity: 100,
});

const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
  autoScalingGroup,
});
cluster.addAsgCapacityProvider(capacityProvider);

const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryReservationMiB: 256,
});

new ecs.Ec2Service(this, 'EC2Service', {
  cluster,
  taskDefinition,
  capacityProviderStrategies: [
    {
      capacityProvider: capacityProvider.capacityProviderName,
      weight: 1,
    },
  ],
});
```

### Cluster Default Provider Strategy

A capacity provider strategy determines whether ECS tasks are launched on EC2 instances or Fargate/Fargate Spot. It can be specified at the cluster, service, or task level, and consists of one or more capacity providers. You can specify an optional base and weight value for finer control of how tasks are launched. The `base` specifies a minimum number of tasks on one capacity provider, and the `weight`s of each capacity provider determine how tasks are distributed after `base` is satisfied.

You can associate a default capacity provider strategy with an Amazon ECS cluster. After you do this, a default capacity provider strategy is used when creating a service or running a standalone task in the cluster and whenever a custom capacity provider strategy or a launch type isn't specified. We recommend that you define a default capacity provider strategy for each cluster.

For more information visit https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html

When the service does not have a capacity provider strategy, the cluster's default capacity provider strategy will be used. Default Capacity Provider Strategy can be added by using the method `addDefaultCapacityProviderStrategy`. A capacity provider strategy cannot contain a mix of EC2 Autoscaling Group capacity providers and Fargate providers.

```ts
declare const capacityProvider: ecs.AsgCapacityProvider;

const cluster = new ecs.Cluster(this, 'EcsCluster', {
  enableFargateCapacityProviders: true,
});
cluster.addAsgCapacityProvider(capacityProvider);

cluster.addDefaultCapacityProviderStrategy([
  { capacityProvider: 'FARGATE', base: 10, weight: 50 },
  { capacityProvider: 'FARGATE_SPOT', weight: 50 },
]);
```

```ts
declare const capacityProvider: ecs.AsgCapacityProvider;

const cluster = new ecs.Cluster(this, 'EcsCluster', {
  enableFargateCapacityProviders: true,
});
cluster.addAsgCapacityProvider(capacityProvider);

cluster.addDefaultCapacityProviderStrategy([
  { capacityProvider: capacityProvider.capacityProviderName },
]);
```

## Elastic Inference Accelerators

Currently, this feature is only supported for services with EC2 launch types.

To add elastic inference accelerators to your EC2 instance, first add
`inferenceAccelerators` field to the Ec2TaskDefinition and set the `deviceName`
and `deviceType` properties.

```ts
const inferenceAccelerators = [{
  deviceName: 'device1',
  deviceType: 'eia2.medium',
}];

const taskDefinition = new ecs.Ec2TaskDefinition(this, 'Ec2TaskDef', {
  inferenceAccelerators,
});
```

To enable using the inference accelerators in the containers, add `inferenceAcceleratorResources`
field and set it to a list of device names used for the inference accelerators. Each value in the
list should match a `DeviceName` for an `InferenceAccelerator` specified in the task definition.

```ts
declare const taskDefinition: ecs.TaskDefinition;
const inferenceAcceleratorResources = ['device1'];

taskDefinition.addContainer('cont', {
  image: ecs.ContainerImage.fromRegistry('test'),
  memoryLimitMiB: 1024,
  inferenceAcceleratorResources,
});
```

## ECS Exec command

Please note, ECS Exec leverages AWS Systems Manager (SSM). So as a prerequisite for the exec command
to work, you need to have the SSM plugin for the AWS CLI installed locally. For more information, see
[Install Session Manager plugin for AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html).

To enable the ECS Exec feature for your containers, set the boolean flag `enableExecuteCommand` to `true` in
your `Ec2Service` or `FargateService`.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;

const service = new ecs.Ec2Service(this, 'Service', {
  cluster,
  taskDefinition,
  enableExecuteCommand: true,
});
```

### Enabling logging

You can enable sending logs of your execute session commands to a CloudWatch log group or S3 bucket by configuring
the `executeCommandConfiguration` property for your cluster. The default configuration will send the
logs to the CloudWatch Logs using the `awslogs` log driver that is configured in your task definition. Please note,
when using your own `logConfiguration` the log group or S3 Bucket specified must already be created.

To encrypt data using your own KMS Customer Key (CMK), you must create a CMK and provide the key in the `kmsKey` field
of the `executeCommandConfiguration`. To use this key for encrypting CloudWatch log data or S3 bucket, make sure to associate the key
to these resources on creation.

```ts
declare const vpc: ec2.Vpc;
const kmsKey = new kms.Key(this, 'KmsKey');

// Pass the KMS key in the `encryptionKey` field to associate the key to the log group
const logGroup = new logs.LogGroup(this, 'LogGroup', {
  encryptionKey: kmsKey,
});

// Pass the KMS key in the `encryptionKey` field to associate the key to the S3 bucket
const execBucket = new s3.Bucket(this, 'EcsExecBucket', {
  encryptionKey: kmsKey,
});

const cluster = new ecs.Cluster(this, 'Cluster', {
  vpc,
  executeCommandConfiguration: {
    kmsKey,
    logConfiguration: {
      cloudWatchLogGroup: logGroup,
      cloudWatchEncryptionEnabled: true,
      s3Bucket: execBucket,
      s3EncryptionEnabled: true,
      s3KeyPrefix: 'exec-command-output',
    },
    logging: ecs.ExecuteCommandLogging.OVERRIDE,
  },
});
```

## Amazon ECS Service Connect

Service Connect is a managed AWS mesh network offering. It simplifies DNS queries and inter-service communication for
ECS Services by allowing customers to set up simple DNS aliases for their services, which are accessible to all
services that have enabled Service Connect.

To enable Service Connect, you must have created a CloudMap namespace. The CDK can infer your cluster's default CloudMap namespace,
or you can specify a custom namespace. You must also have created a named port mapping on at least one container in your Task Definition.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;
declare const containerOptions: ecs.ContainerDefinitionOptions;

const container = taskDefinition.addContainer('MyContainer', containerOptions);

container.addPortMappings({
  name: 'api',
  containerPort: 8080,
});

cluster.addDefaultCloudMapNamespace({
  name: 'local',
});

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
  serviceConnectConfiguration: {
    services: [
      {
        portMappingName: 'api',
        dnsName: 'http-api',
        port: 80,
      },
    ],
  },
});
```

Service Connect-enabled services may now reach this service at `http-api:80`. Traffic to this endpoint will
be routed to the container's port 8080.

To opt a service into using service connect without advertising a port, simply call the 'enableServiceConnect' method on an initialized service.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;

const service = new ecs.FargateService(this, 'Service', {
  cluster,
  taskDefinition,
});
service.enableServiceConnect();
```

Service Connect also allows custom logging, Service Discovery name, and configuration of the port where service connect traffic is received.

```ts
declare const cluster: ecs.Cluster;
declare const taskDefinition: ecs.TaskDefinition;

const customService = new ecs.FargateService(this, 'CustomizedService', {
  cluster,
  taskDefinition,
  serviceConnectConfiguration: {
    logDriver: ecs.LogDrivers.awsLogs({
      streamPrefix: 'sc-traffic',
    }),
    services: [
      {
        portMappingName: 'api',
        dnsName: 'customized-api',
        port: 80,
        ingressPortOverride: 20040,
        discoveryName: 'custom',
      },
    ],
  },
});
```

## Enable pseudo-terminal (TTY) allocation

You can allocate a pseudo-terminal (TTY) for a container passing `pseudoTerminal` option while adding the container
to the task definition.
This maps to Tty option in the ["Create a container section"](https://docs.docker.com/engine/api/v1.38/#operation/ContainerCreate)
of the [Docker Remote API](https://docs.docker.com/engine/api/v1.38/) and the --tty option to [`docker run`](https://docs.docker.com/engine/reference/commandline/run/).

```ts
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  pseudoTerminal: true
});
```

## Specify a container ulimit

You can specify a container `ulimits` by specifying them in the `ulimits` option while adding the container
to the task definition.

```ts
const taskDefinition = new ecs.Ec2TaskDefinition(this, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('example-image'),
  ulimits: [{
    hardLimit: 128,
    name: ecs.UlimitName.RSS,
    softLimit: 128,
  }],
});
```
