## AWS Batch Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Experimental](https://img.shields.io/badge/cdk--constructs-experimental-important.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are experimental and under active development. They are subject to non-backward compatible changes or removal in any future version. These are not subject to the [Semantic Versioning](https://semver.org/) model and breaking changes will be announced in the release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This module is part of the [AWS Cloud Development Kit](https://github.com/aws/aws-cdk) project.

AWS Batch is a batch processing tool for efficiently running hundreds of thousands computing jobs in AWS. Batch can dynamically provision different types of compute resources based on your resource requirements for batch jobs submitted. Batch simplifies the planning, scheduling, and executions of your batch workloads across a full range of compute services like [Amazon EC2](https://aws.amazon.com/ec2/) and [Spot Resources](https://aws.amazon.com/ec2/spot/).

AWS Batch simplifies the planning, scheduling, and executions of your batch workloads across a full range of compute services like [Amazon EC2](https://aws.amazon.com/ec2/) and [Spot Resources](https://aws.amazon.com/ec2/spot/).

Batch achieves this by utilizing queue processing of batch job requests. To successfully submit a job for execution, you need the following resources:

1. [Job Definition](#job-definition) - *Group various job properties (container image, resource requirements, env variables...) into a single definition. These definitions are used at job submission time.*
2. [Compute Environment](#compute-environment) - *the execution runtime of submitted jobs*
3. [Job Queue](#job-queue) - *the queue where batch jobs can be submitted to via AWS SDK/CL. Each job queue is associated with (at least) one compute environment.*

For more information on **AWS Batch** visit the [AWS Docs for Batch](https://docs.aws.amazon.com/batch/index.html).

## Compute Environment

At the core of AWS Batch is the compute environment. All batch jobs are processed within a compute environment, which uses resource like OnDemand or Spot EC2 instances.

In **MANAGED** mode, AWS will handle the provisioning of compute resources to accommodate the demand. Otherwise, in **UNMANAGED** mode, you will need to manage the provisioning of those resources.

Below is an example of each available type of compute environment:

```ts
const vpc = new ec2.Vpc(this, 'VPC');

// default is managed
const awsManagedEnvironment = new batch.ComputeEnvironment(stack, 'AWS-Managed-Compute-Env', {
  computeResources: {
    vpc
  }
});

const customerManagedEnvironment = new batch.ComputeEnvironment(stack, 'Customer-Managed-Compute-Env', {
  managed: false // unmanaged environment
});
```

### Spot-Based Compute Environment

It is possible to have AWS Batch submit spotfleet requests for obtaining compute resources. Below is an example of how this can be done:

```ts
const vpc = new ec2.Vpc(this, 'VPC');

const spotEnvironment = new batch.ComputeEnvironment(stack, 'MySpotEnvironment', {
  computeResources: {
    type: batch.ComputeResourceType.SPOT,
    bidPercentage: 75, // Bids for resources at 75% of the on-demand price
    vpc,
  },
});
```

### Understanding Progressive Allocation Strategies

AWS Batch uses an [allocation strategy](https://docs.aws.amazon.com/batch/latest/userguide/allocation-strategies.html) to determine what compute resource will efficiently handle incoming job requests. By default, **BEST_FIT** will pick an available compute instance based on vCPU requirements. If none exist, the job will wait until resources become available. However, with this strategy, you may have jobs waiting in the queue unnecessarily despite having more powerful instances available. Below is an example of how that situation might look like:

```
Compute Environment:

1. m5.xlarge => 4 vCPU
2. m5.2xlarge => 8 vCPU
```

```
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

### Advanced Compute Environment Configuration

By default, CDK will use the the `optimal` instance type family to choose compute resource types that best match your job requirements. However, you can configure what instance types to provision, and the structure of those instances when assigned to your compute environment. Specifying an advanced compute environment could look like this:

```ts
const computeEnv = new batch.ComputeEnvironment(this, 'ComputeEnv', {
  computeEnvironmentName: 'Memory-Optimized-Environment',
  // AWS Batch should manage provisioning new compute resources
  managed: false,

  // Enables the environment for accepting Batch Job assignments by AWS Batch
  enabled: true,

  // Allocate incoming jobs to any available instance regardless of best vCPU fit
  allocationStrategy: batch.AllocationStrategy.BEST_FIT_PROGRESSIVE,

  computeResources: {
    // Pay full-price for all provisioned resources
    type: batch.ComputeResourceType.ON_DEMAND,

    // Uses AWS recommended AMIs for GPU-based workloads
    image: new ecs.EcsOptimizedAmi({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      hardwareType: ecs.AmiHardwareType.GPU,
    }),

    // 'ec2KeyPair' specifies the name of the related EC2 KeyPair for SSH access
    ec2KeyPair: 'dev',

    // 'instanceRole' defines the privileges the job will have when running
    instanceRole: new iam.Role(stack, 'compute-env-instance-role', {
      assumedBy: new iam.ServicePrincipal('batch.amazonaws.com'),
    }),

    // Only pick `p3.2xlarge` or `p3.8xlarge` instances to provision
    instanceTypes: [
      ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE2),
      ec2.InstanceType.of(ec2.InstanceClass.P3, ec2.InstanceSize.XLARGE8),
    ],

    // At most, provision up to 40 vCPUs worth of instances. For example, 5x p3.8xlarge => 40 vCPU
    maxvCpus: 40,

    // 'minvCpus' specifies our required minimal vCPU availability when no jobs exists
    minvCpus: 8,

### Usage
Simply define your Launch Template:
```typescript
    const myLaunchTemplate = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
      launchTemplateName: 'extra-storage-template',
      launchTemplateData: {
        blockDeviceMappings: [
          {
            deviceName: '/dev/xvdcz',
            ebs: {
              encrypted: true,
              volumeSize: 100,
              volumeType: 'gp2'
            }
          }
        ]
      }
    });
```
and use it:

```typescript
    const myComputeEnv = new batch.ComputeEnvironment(this, 'ComputeEnv', {
      computeResources: {
        launchTemplate: {
          launchTemplateName: myLaunchTemplate.launchTemplateName as string, //or simply use an existing template name
        },
        vpc,
      },
      computeEnvironmentName: 'MyStorageCapableComputeEnvironment',
    });
```
