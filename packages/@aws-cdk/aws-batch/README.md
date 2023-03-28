# AWS Batch Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources]) are always stable and safe to use.
>
> [CFN Resources]: https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development.
> They are subject to non-backward compatible changes or removal in any future version. These are
> not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be
> announced in the release notes. This means that while you may use them, you may need to update
> your source code when upgrading to a newer version of this package.

---

<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Batch is a batch processing tool for efficiently running hundreds of thousands computing jobs in AWS.
Batch can dynamically provision [Amazon EC2](https://aws.amazon.com/ec2/) Instances to meet the resource requirements of submitted jobs
and simplifies the planning, scheduling, and executions of your batch workloads. Batch achieves this through four different resources:

* ComputeEnvironments: Contain the resources used to execute Jobs
* JobDefinitions: Define a type of Job that can be submitted
* JobQueues: Route waiting Jobs to ComputeEnvironments
* SchedulingPolicies: Applied to Queues to control how and when Jobs exit the JobQueue and enter the ComputeEnvironment

`ComputeEnvironment`s can be managed or unmanaged. Batch will automatically provision EC2 Instances in a managed `ComputeEnvironment` and will
not provision any Instances in an unmanaged `ComputeEnvironment`. Managed `ComputeEnvironment`s can use ECS, Fargate, or EKS resources to spin up
EC2 Instances in (ensure your EKS Cluster has [been configured](https://docs.aws.amazon.com/batch/latest/userguide/getting-started-eks.html)
to support a Batch ComputeEnvironment before linking it). You can use Launch Templates and Placement Groups to configure exactly how these resources
will be provisioned.

`JobDefinition`s can use either ECS resources or EKS resources. ECS `JobDefinition`s can use multiple containers to execute distributed workloads.
EKS `JobDefinition`s can only execute a single container. Submitted Jobs use `JobDefinition`s as templates.

`JobQueue`s must link at least one `ComputeEnvironment`. Jobs exit the Queue in FIFO order unless a `SchedulingPolicy` is specified.

`SchedulingPolicy`s tell the Scheduler how to choose which Jobs should be executed next by the ComputeEnvironment.

## Use Cases & Examples

### Cost Optimization

#### Spot Instances

Spot instances are significantly discounted EC2 instances that can be reclaimed at any time by AWS.
Workloads that are fault-tolerant or stateless can take advantage of spot pricing.
To use spot spot instances, set `spot` to `true` on a managed Ec2 or Fargate Compute Environment:

```ts
import * as batch from 'aws-cdk-lib/aws-batch';
new batch.FargateComputeEnvironment(this, 'myFargateComputeEnv', {
  spot: true,
});
```

Batch allows you to specify the percentage of the on-demand instance that the current spot price
must be to provision the instance using the `spotBidPercentage`.
This defaults to 100%, which is the recommended value.
This value cannot be specified for `FargateComputeEnvironment`s
and only applies to `ManagedEc2ComputeEnvironment`s.
The following code configures a Compute Environment to only use spot instances that
are at most 20% the price of the on-demand instance price:

```ts
import * as batch from 'aws-cdk-lib/aws-batch';
new batch.MangedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
   spot: true,
   spotBidPercentage: 20,
});
```

For stateful or otherwise non-interruption-tolerant workflows, omit `spot` or set it to `false` to only provision on-demand instances.

#### Choosing Your Instance Types

Batch allows you to choose the instance types or classes that will run your workload.
This example configures your `ComputeEnvironment` to use only the `M5AD.large` instance:

```ts
new batch.ManagedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
  instanceTypes: [ec2.InstanceType.of(ec2.InstanceClass.M5AD, ec2.InstanceSize.LARGE)],
});
```

Batch allows you to specify only the instance class and to let it choose the size, which you can do like this:

```
computeEnv.addInstanceClass(ec2.InstanceClass.M5AD);
// Or, specify it on the constructor:
new batch.ManagedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
  instanceClasses: [ec2.InstanceClass.A1],
});
```

If you specify no instance types or classes then it will default to `InstanceType.OPTIMAL`,
which tells Batch to pick an instance from the C4, M4, and R4 instance families.
*Note*: Batch does not allow specifying instance types or classes with different architectures.
For example, `InstanceClass.A1` cannot be specified alongside `InstanceClass.OPTIMAL`,
because `A1` uses ARM and `OPTIMAL` uses x86_64.
You can specify both `InstanceType.OPTIMAL` alongside several different instance types in the same compute environment:

```ts
const computeEnv = new batch.ManagedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
  instanceTypes: [batch.InstanceType.of(ec2.InstanceClass.M5AD, ec2.InstanceSize.LARGE)],
});
computeEnv.addInstanceType(batch.InstanceType.OPTIMAL);
// Note: this is equivalent to specifying
computeEnv.addInstanceClass(ec2.InstanceClass.C4);
computeEnv.addInstanceClass(ec2.InstanceClass.M4);
computeEnv.addInstanceClass(ec2.InstanceClass.R4);
```

#### Allocation Strategies

| Allocation Strategy     | Optimized for      | Downsides                     |
| ----------------------- | -------------      | ----------------------------- |
| BEST_FIT                | Cost               | May limit throughput          |
| BEST_FIT_PROGRESSIVE    | Throughput         | May increase cost             |
| SPOT_CAPACITY_OPTIMIZED | Least interruption | Only useful on Spot instances |

Batch provides different Allocation Strategies to help it choose which instances to provision.
If your workflow tolerates interruptions, you should enable `spot` on your `ComputeEnvironment`
and use `SPOT_CAPACITY_OPTIMIZED` (this is the default if `spot` is enabled).
This will tell Batch to choose the instance types from the ones you’ve specified that have
the most spot capacity available to minimize the chance of interruption.
To get the most benefit from your spot instances,
you should allow Batch to choose from as many different instance types as possible.

If your workflow does not tolerate interruptions and you want to minimize your costs,
use `AllocationStrategy.BEST_FIT`.
This will choose the lowest-cost instance type that fits all the jobs in the queue.
If instances of that type are not available,
the queue will not choose a new type; instead, it will wait for the instance to become available.
This can stall your `Queue`, with your compute environment only using part of its max capacity
(or none at all) until the `BEST_FIT` instance becomes available.

If you are running a workflow that does not tolerate interruptions and you want to maximize throughput,
you can use `AllocationStrategy.BEST_FIT_PROGRESSIVE`.
This is the default Allocation Strategy if `spot` is `false` or unspecified.
This strategy will examine the Jobs in the queue and choose whichever instance type meets the requirements
of the jobs in the queue and with the lowest cost per vCPU, just as `BEST_FIT`.
However, if not all of the capacity can be filled with this instance type,
it will choose a new next-best instance type to run any jobs that couldn’t fit into the `BEST_FIT` capacity.
To make the most use of this allocation strategy,
it is recommended to use as many instance classes as is feasible for your workload.
This example shows a `ComputeEnvironment` that uses `BEST_FIT_PROGRESSIVE`
with `InstanceType.OPTIMAL` and `InstanceClass.M5` instance types:

```ts
const computeEnv = new batch.ManagedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
  instanceTypes: [batch.InstanceType.OPTIMAL],
  instanceClasses: [ec2.InstanceClass.M5],
});
```

This example shows a `ComputeEnvironment` that uses `BEST_FIT` with `InstanceType.OPTIMAL` instances:

```ts
const computeEnv = new batch.ManagedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
  allocationStrategy: AllocationStrategy.BEST_FIT,
});
```

*Note*: `allocationStrategy` cannot be specified on Fargate Compute Environments.

### Controlling vCPU allocation

With a managed `ComputeEnvironment`, you can specify the maximum and minimum vCPUs it can have at any given time.
You cannot do this with an unmanaged `ComputeEnvironment`, because you must provision and manage the instances yourself;
that is, Batch will not scale them up and down as needed. This example shows how to configure these properties:

```ts
new batch.ManagedEC2ComputeEnvironment(this, 'myEc2ComputeEnv', {
  instanceClasses: [ec2.InstanceClass.A1],
  minvCpus: 10,
  maxvCpus: 100,
});
```

This means that the `ComputeEnvironment` will always maintain 10 vCPUs worth of instances,
even if there are no Jobs in the queues that link to this `ComputeEnvironment`.

### Sharing a ComputeEnvironment between multiple JobQueues

Multiple `JobQueue`s can share the same `ComputeEnvironment`.
If multiple Queues are attempting to submit Jobs to the same `ComputeEnvironment`,
Batch will pick the Job from the Queue with the highest priority.
This example creates two `JobQueue`s that share a `ComputeEnvironment`:

```ts
const sharedComputeEnv = new batch.FargateComputeEnvironment(this, 'spotEnv', {
  spot: true,
});
const lowPriorityQueue = new batch.JobQueue(this, 'JobQueue', {
   priority: 1,
});
const highPriorityQueue = new batch.JobQueue(this, 'JobQueue', {
   priority: 10,
});
lowPriorityQueue.addComputeEnvironment(sharedComputeEnv, 1);
highPriorityQueue.addComputeEnvironment(sharedComputeEnv, 1);
```

### Fairshare Scheduling

Batch `JobQueue`s execute Jobs submitted to them in FIFO order unless you specify a `SchedulingPolicy`.
FIFO queuing can cause short-running jobs to be starved while long-running jobs fill the compute environment.
To solve this, Jobs can be associated with a share.

Shares consist of a `shareIdentifier` and a `weightFactor`, which is inversely correlated with the vCPU allocated to that share identifier.
When submitting a Job, you can specify it's `shareIdentifier` to associate that particular job with that share.
Let's see how the scheduler uses this information to schedule jobs.

For example, if there are two shares defined as follows:

| Share Identifier | Weight Factor |
| ---------------- | ------------- |
| A                | 1             |
| B                | 1             |

The weight factors share the following relationship:

```
BvCpus / 1 = AvCpus / 1
```

where `BvCpus` is the number of vCPUs allocated to jobs with share identifier `'B'`.
We need to find `B_vCpus` and `A_vCpus`. We can multiply both sides of the above equation by `1` to get:

```
BvCpus = AvCpus
```

We don't know what `BvCpus` is, but we know that each `'B'` job needs 64 vCpus. We also know that each `'A'` job needs 32 vCpus.
So let's define a two new values, `AJobRequirement` and `BJobRequirement`, set to 32 and 64, respectively. Now we have:

```
BvCpus = BJobRequirement * numBJobs
AvCpus = AJobRequirement * numAJobs
```

where `numBJobs` is the number of jobs with share identifier `'B'` that will be scheduled and
`numAJobs` is the number of jobs with share identifier `'A'` that will be scheduled.

With these new definitions we can write our equality as:

```
BvCpus = AvCpus =>
BJobRequirement * numBJobs = AJobRequirement * numAJobs
64 * numBJobs = 32 * numAJobs =>
2 * numBJobs = numAJobs =>
numAJobs = 2 * numBJobs
```

Thus the scheduler will schedule two `'A'` jobs for each `'B'` job.

You can control the weight factors to change these ratios, but note that
weight factors are inversely correlated with the vCpus allocated to the corresponding share.
This example illustrates the impact this has on scheduling:

| Share Identifier | Weight Factor |
| ---------------- | ------------- |
| A                | 0.5           |
| B                | 1             |

The weight factors share the following relationship:

```
BvCpus / 1 = AvCpus / 0.5 =>
2 * BvCpus = AvCpus
```

Following similar algebra as above:

```
2 * BvCpus = AvCpus =>
2 * BJobRequirement * numBJobs = AJobRequirement * numAJobs =>
2 * 64 * numBJobs = 32 * numAJobs =>
128 * numBJobs = 32 * numAJobs =>
4 * numBJobs = numAJobs =>
numAJobs = 4 * numBJobs
```

Thus for each `'B'` job, the scheduler will schedule four (4) `'A'` jobs.

If the `weightFactor`s were reversed instead:

| Share Identifier | Weight Factor |
| ---------------- | ------------- |
| A                | 1             |
| B                | 0.5           |

The weight factors share the following relationship:

```
BvCpus / 0.5 = AvCpus / 1 =>
BvCpus = 2 * AvCpus
```

Following similar algebra as above:

```
BvCpus = 2 * AvCpus =>
BJobRequirement * numBJobs = 2 * AJobRequirement * numAJobs =>
64 * numBJobs = 2 * 32 * numAJobs =>
64 * numBJobs = 64 * numAJobs =>
numBJobs = numAJobs
```

Thus for each `'B'` job, the scheduler will schedule one (1) `'A'` job.

The second example would be configured like this:

```ts
const fairsharePolicy = new FairshareSchedulingPolicy(this, 'myFairsharePolicy');
fairsharePolicy.addShare({
  shareIdentifier: 'A',
  weightFactor: 1,
});
fairsharePolicy.addShare({
  shareIdentifier: 'B',
  weightFactor: 0.5,
});
new batch.JobQueue(this, 'JobQueue', {
  priority: 1,
  fairsharePolicy,
});
```

*Note*: The scheduler will only consider the current usage of the compute environment unless you specify `shareDecay`.
For example, a `shareDecay` of 5 minutes in the above example means that at any given point in time, twice as many `'A'` jobs
will be scheduled for each `'B'` job, but only for the past 5 minutes. If `'B'` jobs run longer than 5 minutes, then
the scheduler is allowed to put more than two `'A'` jobs for each `'B'` job, because the usage of those long-running
`'B'` jobs will no longer be considered after 5 minutes. `shareDecay` linearly decreases the usage of
long running jobs for calculation purposes. eg if share decay is 60 seconds,
then jobs that run for 30 seconds have their usage considered to be only 50% of what it actually is,
but after a whole minute the scheduler pretends they don't exist for fairness calculations.

The following code specifies a `shareDecay` of 5 minutes:

```ts
const fairsharePolicy = new FairshareSchedulingPolicy(this, 'myFairsharePolicy', {
   shareDecay: Duration.minutes(5),
});
```

If you have high priority jobs that should always be executed as soon as they arrive,
you can define a `computeReservation` to specify the percentage of the
maximum vCPU capacity that should be reserved for shares that are *not in the queue*.
The actual reserved percentage is defined by Batch as:

```
 (computeReservation/100)^ActiveFairShares
```

where `ActiveFairShares` is the number of shares for which there exists
at least one job in the queue with a unique share identifier.

This is best illustrated with an example.
Suppose there three shares with share identifiers `A`, `B` and `C` respectively
and we specify the `computeReservation` to be 75%. The queue is currently empty,
and no other shares exist.

There are no active fair shares, since the queue is empty.
Thus (75/100)^0 = 1 = 100% of the maximum vCpus are reserved for all shares.

A job with identifier `A` enters the queue.

The number of active fair shares is now 1, hence
(75/100)^1 = .75 = 75% of the maximum vCpus are reserved for all shares that do not have the identifier `A`;
for this example, this is `B` and `C`,
(but if jobs are submitted with a share identifier not covered by this fairshare policy, those would be considered just as `B` and `C` are).

Now a `B` job enters the queue. The number of active fair shares is now 2,
so (75/100)^2 = .5625 = 56.25% of the maximum vCpus are reserved for all shares that do not have the identifier `A` or `B`.

Now a second `A` job enters the queue. The number of active fair shares is still 2,
so the percentage reserved is still 56.25%

Now a `C` job enters the queue. The number of active fair shares is now 3,
so (75/100)^3 = .421875 = 42.1875% of the maximum vCpus are reserved for all shares that do not have the identifier `A`, `B`, or `C`.

If these are no other shares that your jobs can specify, this means that 42.1875% of your capacity will never be used!

Now, `A`, `B`, and `C` can only consume 100% - 42.1875% = 57.8125% of the maximum vCpus.
Note that the this percentage is **not** split between `A`, `B`, and `C`.
Instead, the scheduler will use their `weightFactor`s to decide which jobs to schedule;
the only difference is that instead of competing for 100% of the max capacity, jobs compete for 57.8125% of the max capacity.

This example specifies a `computeReservation` of 75% that will behave as explained in the example above:

```ts
const fairsharePolicy = new FairshareSchedulingPolicy(this, 'myFairsharePolicy', {
  computeReservation: 75,
  shares: [
    { id: 'A' },
    { id: 'B' },
    { id: 'C' },
  ],
});
```

You can specify a `priority` on your `JobDefinition`s to tell the scheduler to prioritize certain jobs that share the same share identifier.

### Configuring Job Retry Policies

Certain workflows may result in Jobs failing due to intermittent issues.
Jobs can specify retry policies to respond to different failures with different actions.
There are three different ways information about the way a Job exited can be conveyed;

* `exitCode`: the exit code returned from the process executed by the container. Will only match non-zero exit codes.
* `reason`: any middleware errors, like your Docker registry being down.
* `statusReason`: infrastructure errors, most commonly your spot instance being reclaimed.

For most use cases, only one of these will be associated with a particular action at a time.
To specify common `exitCode`s, `reason`s, or `statusReason`s, use the corresponding value from
the `Reason` class. This example shows some common failure reasons:

```ts
const jobDefn = new batch.EcsJobDefinition(this, 'JobDefn', {
   containerDefinition: new batch.EcsEc2ContainerDefinition(this, 'containerDefn', {
    image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
    memoryLimitMiB: 2048,
  }),
  attempts: 5,
  retryStrategies: [{
    action: Action.EXIT,
    reason: Reason.NON_ZERO_EXIT_CODE,
  }],
});
jobDefn.addRetryStrategy({
  action: Action.RETRY,
  reason: Reason.SPOT_INSTANCE_RECLAIMED,
});
jobDefn.addRetryStrategy({
   action: Action.EXIT,
   reason: Reason.CANNOT_PULL_CONTAINER,
});
jobDefn.addRetryStrategy({
  action: Action.RETRY,
  reason: Reason.custom({
    onExitCode: '40*',
    onReason: 'some reason',
  }),
});
```

When specifying a custom reason,
you can specify a glob string to match each of these and react to different failures accordingly.
Up to five different retry strategies can be configured for each Job,
and each strategy can match against some or all of `exitCode`, `reason`, and `statusReason`.
You can optionally configure the number of times a job will be retried,
but you cannot configure different retry counts for different strategies; they all share the same count.
If multiple conditions are specified in a given retry strategy,
they must all match for the action to be taken; the conditions are ANDed together, not ORed.

### Running single-container ECS workflows

Batch can jobs on ECS or EKS. ECS jobs can defined as single container or multinode.
This examples creates a `JobDefinition` that runs a single container with ECS:

```ts
const jobDefn = new batch.EcsJobDefinition(this, 'JobDefn', {
  containerDefinition: new batch.Ec2ContainerDefinition(this, 'containerDefn', {
    image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
    memoryLimitMiB: 2048,
    volumes: [EcsVolume.efsVolume({
      name: 'myVolume',
      efsVolumeConfiguration: {
        fileSystem: myFileSystem
      },
      containerPath: '/Volumes/myVolume',
    })],
  }),
});
```

For workflows that need persistent storage, batch supports mounting `Volume`s to the container.
You can both provision the volume and mount it to the container in a single operation:

```ts
jobDefn.containerDefinition.addVolume(EcsVolume.efs({
  name: 'myVolume',
  efsVolumeConfiguration: {
    fileSystem: myFileSystem
  },
  containerPath: '/Volumes/myVolume',
}));
```

### Running Kubernetes Workflows

Batch also supports running workflows on EKS. The following example creates a `JobDefinition` that runs on EKS:

```ts
const jobDefn = new batch.EksJobDefinition(this, 'eksf2', {
  containerDefinition: new batch.EksContainerDefinition(this, 'container', {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    volumes: [EksVolume.emptyDir({
      name: 'myEmptyDirVolume',
      mountPath: '/mount/path',
      medium: batch.EmptyDirMediumType.MEMORY,
      readonly: true,
      sizeLimit: Size.mebibytes(2048),
    })],
  }),
});
```

You can mount `Volume`s to these containers in a single operation:

```ts
jobDefn.containerDefinition.addEmptyDirVolume({
  name: 'emptyDir',
  mountPath: '/Volumes/emptyDir',
});
jobDefn.containerDefinition.addHostPathVolume({
  name: 'hostPath',
  hostPath: '/sys',
  mountPath: '/Volumes/hostPath',
});
jobDefn.containerDefinition.addSecretVolume({
  name: 'secret',
  optional: true,
  mountPath: '/Volumes/secret',
});
```

### Running Distributed Workflows

Some workflows benefit from parallellization and are most powerful when run in a distributed environment,
such as certain numerical calculations or simulations. Batch offers `MultiNodeJobDefinition`s,
which allow a single job to run on multiple instances in parallel, for this purpose.
Message Passing Interface (MPI) is often used with these workflows.
You must configure your containers to use MPI properly,
but Batch allows different nodes running different containers to communicate easily with one another.
You must configure your containers to use certain environment variables that Batch will provide them,
which lets them know which one is the main node, among other information.
For an in-depth example on using MPI to perform numerical computations on Batch,
see this [blog post](https://aws.amazon.com/blogs/compute/building-a-tightly-coupled-molecular-dynamics-workflow-with-multi-node-parallel-jobs-in-aws-batch/)
In particular, the environment variable that tells the containers which one is the main node can be configured on your `MultiNodeJobDefinition` as follows:

```ts
const multiNodeJob = new batch.MultiNodeJobDefinition(this, 'JobDefinition', {
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.A1, ec2.InstanceSize.LARGE),
  containers: [
    new MultiNodeContainer(this, 'mainMPIContainer', {
      startNode: 0,
      endNode: 5,
      image: ecs.ContainerImage.fromRegistry('yourregsitry.com/yourMPIImage:latest'),
      memoryLimitMiB: 2048,
    }),
  ],
});
// convenience method
multiNodeJob.addContainer(this, 'secondContanerType', {
  startNode: 6,
  endNode: 10,
  image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
  memoryLimitMiB: 2048,
});
```

If you need to set the control node to an index other than 0, specify it in directly:

```ts
const multiNodeJob = new batch.MultiNodeJobDefinition(this, 'JobDefinition', {
  mainNode: 5,
});
```

### Pass Parameters to a Job

Batch allows you define parameters in your `JobDefinition`, which can be referenced in the container command. For example:

```
new batch.EcsJobDefinition(this, 'JobDefn', {
  parameters: { echoParam: 'foobar' },
  containerDefinition: new batch.ContainerDefinition(this, 'containerDefn', {
    image: ecs.ContainerImage.fromRegistry('public.ecr.aws/amazonlinux/amazonlinux:latest'),
    memoryLimitMiB: 2048,
    compatibility: Compatibility.EC2,
    command: [
      'echo',
      'Ref::echoParam',
    ],
  }),
});
```

### Understanding Progressive Allocation Strategies

AWS Batch uses an [allocation strategy](https://docs.aws.amazon.com/batch/latest/userguide/allocation-strategies.html) to determine what compute resource will efficiently handle incoming job requests. By default, **BEST_FIT** will pick an available compute instance based on vCPU requirements. If none exist, the job will wait until resources become available. However, with this strategy, you may have jobs waiting in the queue unnecessarily despite having more powerful instances available. Below is an example of how that situation might look like:

```plaintext
Compute Environment:

1. m5.xlarge => 4 vCPU
2. m5.2xlarge => 8 vCPU
```

```plaintext
Job Queue:
---------
| A | B |
---------

Job Requirements:
A => 4 vCPU - ALLOCATED TO m5.xlarge
B => 2 vCPU - WAITING
```

In this situation, Batch will allocate **Job A** to compute resource #1 because it is the most cost efficient resource that matches the vCPU requirement. However, with this `BEST_FIT` strategy, **Job B** will not be allocated to our other available compute resource even though it is strong enough to handle it. Instead, it will wait until the first job is finished processing or wait a similar `m5.xlarge` resource to be provisioned.

The alternative would be to use the `BEST_FIT_PROGRESSIVE` strategy in order for the remaining job to be handled in larger containers regardless of vCPU requirement and costs.
