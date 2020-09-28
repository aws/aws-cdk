## Amazon EKS Construct Library
<!--BEGIN STABILITY BANNER-->
---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

> All classes with the `Cfn` prefix in this module ([CFN Resources](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html#constructs_lib)) are always stable and safe to use.

![cdk-constructs: Developer Preview](https://img.shields.io/badge/cdk--constructs-developer--preview-informational.svg?style=for-the-badge)

> The APIs of higher level constructs in this module are in **developer preview** before they become stable. We will only make breaking changes to address unforeseen API issues. Therefore, these APIs are not subject to [Semantic Versioning](https://semver.org/), and breaking changes will be announced in release notes. This means that while you may use them, you may need to update your source code when upgrading to a newer version of this package.

---
<!--END STABILITY BANNER-->

This construct library allows you to define [Amazon Elastic Container Service for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters.
In addition, the library also supports defining Kubernetes resource manifests within EKS clusters.

* [Quick Start](#quick-start)
* [Overview](#overview)
* [Provisioning clusters](#provisioning-clusters)
    * [Capacity](#capacity)
      * [Managed Node Groups](#1-managed-node-groups)
      * [Fargate Profiles](#2-fargate-profiles)
      * [Self Managed Auto Scaling Groups](#3-self-managed-auto-scaling-groups)
    * [VPC Support](#vpc-support)
    * [Endpoint Access](#endpoint-access)
    * [Permissions](#permissions)
* [Using existing clusters](#using-existing-clusters)
* [Managing Objects](#managing-objects)
    * [Applying](#applying)
      * [Kubernetes Manifests](#kubernetes-manifests)
      * [Helm Charts](#helm-charts)
    * [Patching](#patching)
    * [Querying](#querying)
* [Known Issues](#known-issues)

## Quick Start

This example defines an Amazon EKS cluster with the following configuration:

- Dedicated VPC with default configuration (see [ec2.Vpc](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html#vpc))
- A Kubernetes pod with a container based on the [paulbouwer/hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes) image.

```ts
// provisiong a cluster
const cluster = new eks.Cluster(this, 'hello-eks', {
  version: eks.KubernetesVersion.V1_16,
});

// apply a kubernetes manifest to the cluster
cluster.addManifest('mypod', {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: { name: 'mypod' },
  spec: {
    containers: [
      {
        name: 'hello',
        image: 'paulbouwer/hello-kubernetes:1.5',
        ports: [ { containerPort: 8080 } ]
      }
    ]
  }
});
```

In order to interact with your cluster through `kubectl`, you can use the `aws eks update-kubeconfig` [AWS CLI command](https://docs.aws.amazon.com/cli/latest/reference/eks/update-kubeconfig.html)
to configure your local kubeconfig. The EKS module will define a CloudFormation output in your stack which contains the command to run. For example:

```
Outputs:
ClusterConfigCommand43AAE40F = aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy
```

Execute the `aws eks update-kubeconfig ... ` command in your terminal to create or update a local kubeconfig context:

```console
$ aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy
Added new context arn:aws:eks:rrrrr:112233445566:cluster/cluster-xxxxx to /home/boom/.kube/config
```

And now you can simply use `kubectl`:

```console
$ kubectl get all -n kube-system
NAME                           READY   STATUS    RESTARTS   AGE
pod/aws-node-fpmwv             1/1     Running   0          21m
pod/aws-node-m9htf             1/1     Running   0          21m
pod/coredns-5cb4fb54c7-q222j   1/1     Running   0          23m
pod/coredns-5cb4fb54c7-v9nxx   1/1     Running   0          23m
...
```

## Architectural Overview

The following is a qualitative diagram of the various possible components involved in the cluster deployment.

```text
 +-----------------------------------------------+               +-----------------+
 |                 EKS Cluster                   |    kubectl    |                 |
 |-----------------------------------------------|<-------------+| Kubectl Handler |
 |                                               |               |                 |
 |                                               |               +-----------------+
 | +--------------------+    +-----------------+ |
 | |                    |    |                 | |
 | | Managed Node Group |    | Fargate Profile | |               +-----------------+
 | |                    |    |                 | |               |                 |
 | +--------------------+    +-----------------+ |               | Cluster Handler |
 |                                               |               |                 |
 +-----------------------------------------------+               +-----------------+
    ^                                   ^                          +
    |                                   |                          |
    | connect self managed capacity     |                          | aws-sdk
    |                                   | create/update/delete     |
    +                                   |                          v
 +--------------------+                 +              +-------------------+
 |                    |                 --------------+| eks.amazonaws.com |
 | Auto Scaling Group |                                +-------------------+
 |                    |
 +--------------------+
```

In a nutshell:

- `EKS Cluster` - The cluster endpoint created by EKS.
- `Managed Node Group` - EC2 worker nodes managed by EKS.
- `Fargate Profile` - Fargate worker nodes managed by EKS.
- `Auto Scaling Group` - EC2 worker nodes managed by the user.
- `KubectlHandler` - Lambda function for invoking `kubectl` commands on the cluster - created by CDK.
- `ClusterHandler` - Lambda function for interacting with EKS API to manage the cluster lifecycle - created by CDK.

A more detailed breakdown of each is provided further down this README.

## Provisioning clusters

Creating a new cluster is done using the `Cluster` or `FargateCluster` constructs. The only required property is the kubernetes `version`.

```typescript
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
});
```

You can also use `FargateCluster` to provision a cluster that uses only fargate workers.

```typescript
new eks.FargateCluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
});
```

> **NOTE: Only 1 cluster per stack is supported.** If you have a use-case for multiple clusters per stack, or would like to understand more about this limitation, see https://github.com/aws/aws-cdk/issues/10073.

Below you'll find a few important cluster configuration options.

### Capacity

Capacity is the amount and the type of worker nodes that are available to the cluster for deploying resources. Amazon EKS offers 3 ways of configuring capacity, which you can combine as you like:

#### 1) Managed Node Groups

Amazon EKS managed node groups automate the provisioning and lifecycle management of nodes (Amazon EC2 instances) for Amazon EKS Kubernetes clusters.
With Amazon EKS managed node groups, you don’t need to separately provision or register the Amazon EC2 instances that provide compute capacity to run your Kubernetes applications. You can create, update, or terminate nodes for your cluster with a single operation. Nodes run using the latest Amazon EKS optimized AMIs in your AWS account while node updates and terminations gracefully drain nodes to ensure that your applications stay available.

> For more details visit [Amazon EKS Managed Node Groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html).

**Managed Node Groups are the recommended way to allocate cluster capacity.**

By default, this library will allocate a managed node group with 2 *m5.large* instances (this instance type suits most common use-cases, and is good value for money).

At cluster instantiation time, you can customize the number of instances and their type:

```typescript
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
  defaultCapacity: 5,
  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.SMALL),
});
```

To access the node group that was created on your behalf, you can use `cluster.defaultNodegroup`.

Additional customizations are available post instantiation. To apply them, set the default capacity to 0, and use the `cluster.addNodegroupCapacity` method:

```typescript
const cluster = new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
  defaultCapacity: 0,
});

cluster.addNodegroupCapacity('custom-node-group', {
  instanceType: new ec2.InstanceType('m5.large'),
  minSize: 4,
  diskSize: 100,
  amiType: eks.NodegroupAmiType.AL2_X86_64_GPU,
  ...
});
```

> For a complete API reference visit [`NodegroupOptions`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.NodegroupOptions.html).

##### Launch Template Support

You can specify a launch template that the node group will use. Note that when using a custom AMI, Amazon EKS doesn't merge any user data.
Rather, You are responsible for supplying the required bootstrap commands for nodes to join the cluster.
In the following example, `/ect/eks/bootstrap.sh` from the AMI will be used to bootstrap the node.

```ts
const userData = ec2.UserData.forLinux();
userData.addCommands(
  'set -o xtrace',
  `/etc/eks/bootstrap.sh ${cluster.clusterName}`,
);
const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
  launchTemplateData: {
    imageId: 'some-ami-id', // custom AMI
    instanceType: new ec2.InstanceType('t3.small').toString(),
    userData: Fn.base64(userData.render()),
  },
});
cluster.addNodegroupCapacity('extra-ng', {
  launchTemplateSpec: {
    id: lt.ref,
    version: lt.attrDefaultVersionNumber,
  },
});
```

> For more details visit [Launch Template Support](https://docs.aws.amazon.com/en_ca/eks/latest/userguide/launch-templates.html).

#### 2) Fargate Profiles

AWS Fargate is a technology that provides on-demand, right-sized compute
capacity for containers. With AWS Fargate, you no longer have to provision,
configure, or scale groups of virtual machines to run containers. This removes
the need to choose server types, decide when to scale your node groups, or
optimize cluster packing.

You can control which pods start on Fargate and how they run with Fargate
Profiles, which are defined as part of your Amazon EKS cluster.

See [Fargate Considerations](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html#fargate-considerations) in the AWS EKS User Guide.

You can add Fargate Profiles to any EKS cluster defined in your CDK app
through the `addFargateProfile()` method. The following example adds a profile
that will match all pods from the "default" namespace:

```ts
cluster.addFargateProfile('MyProfile', {
  selectors: [ { namespace: 'default' } ]
});
```

> For a complete API reference visit [`FargateProfileOptions`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.FargateProfileOptions.html)

You can also directly use the `FargateProfile` construct to create profiles under different scopes:

```ts
new eks.FargateProfile(scope, 'MyProfile', {
  cluster,
  ...
});
```

> For a complete API reference visit [`FargateProfileProps`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.FargateProfileProps.html)

To create an EKS cluster that **only** uses Fargate capacity, you can use `FargateCluster`.
The following code defines an Amazon EKS cluster with a default Fargate Profile that matches all pods from the "kube-system" and "default" namespaces. It is also configured to [run CoreDNS on Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html#fargate-gs-coredns).

```ts
const cluster = new eks.FargateCluster(this, 'MyCluster', {
  version: eks.KubernetesVersion.V1_16,
});
```

**NOTE**: Classic Load Balancers and Network Load Balancers are not supported on
pods running on Fargate. For ingress, we recommend that you use the [ALB Ingress
Controller](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)
on Amazon EKS (minimum version v1.1.4).

#### 3) Self Managed Auto Scaling Groups

Another way of allocating capacity to an EKS cluster is by using self-managed Auto Scaling Groups.
EC2 instances that are part of the auto-scaling-group will serve as worker nodes for the cluster.
This type of capacity is also commonly referred to as *EC2 Capacity** or *EC2 Nodes*.

For a detailed overview please visit [Self Managed Nodes](https://docs.aws.amazon.com/eks/latest/userguide/worker.html).

These self-managed auto-scaling-groups provide some additional capabilities over the managed node group, as detailed below.
However, as they incur an extra maintenance overhead, they are usually not considered a best practice.

Creating an auto-scaling-group and connecting it to the cluster is done using the `cluster.addAutoScalingGroupCapacity` method:

```ts
cluster.addAutoScalingGroupCapacity('frontend-nodes', {
  instanceType: new ec2.InstanceType('t2.medium'),
  minCapacity: 3,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
});
```

You can customize the [/etc/eks/boostrap.sh](https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh) script, which is responsible
for bootstrapping the node to the EKS cluster. For example, you can use `kubeletExtraArgs` to add custom node labels or taints.

```ts
cluster.addAutoScalingGroupCapacity('spot', {
  instanceType: new ec2.InstanceType('t3.large'),
  minCapacity: 2,
  bootstrapOptions: {
    kubeletExtraArgs: '--node-labels foo=bar,goo=far',
    awsApiRetryAttempts: 5
  }
});
```

To disable bootstrapping altogether (i.e. to fully customize user-data), set `bootstrapEnabled` to `false`.

> For a complete API reference please visit [`AutoScalingGroupCapacityOptions`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.CapacityOptions.html)

You can also configure the cluster to use an auto-scaling-group as the default capacity:

```ts
cluster = new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
  defaultCapacityType: eks.DefaultCapacityType.EC2,
});
```

This will allocate an auto-scaling-group with 2 *m5.large* instances (this instance type suits most common use-cases, and is good value for money).
To access the `AutoScalingGroup` that was created on your behalf, you can use `cluster.defaultCapacity`.
You can also independently create an `AutoScalingGroup` and connect it to the cluster using the `cluster.connectAutoScalingGroupCapacity` method:

```ts
const asg = new ec2.AutoScalingGroup(...)
cluster.connectAutoScalingGroupCapacity(asg);
```

This will add the necessary user-data and configure all connections, roles, and tags needed for the instances in the auto-scaling-group to properly join the cluster.

##### Spot Instances

When using self-managed nodes, you can configure the capacity to use spot instances, greatly reducing capacity cost.
To enable spot capacity, use the `spotPrice` property:

```ts
cluster.addAutoScalingGroupCapacity('spot', {
  spotPrice: '0.1094',
  instanceType: new ec2.InstanceType('t3.large'),
  maxCapacity: 10
});
```

> Spot instance nodes will be labeled with `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.

The [AWS Node Termination Handler](https://github.com/aws/aws-node-termination-handler) `DaemonSet` will be
installed from [Amazon EKS Helm chart repository](https://github.com/aws/eks-charts/tree/master/stable/aws-node-termination-handler) on these nodes.
The termination handler ensures that the Kubernetes control plane responds appropriately to events that
can cause your EC2 instance to become unavailable, such as [EC2 maintenance events](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-status-check_sched.html)
and [EC2 Spot interruptions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html) and helps gracefully stop all pods running on spot nodes that are about to be
terminated.

> Handler Version: [1.7.0](https://github.com/aws/aws-node-termination-handler/releases/tag/v1.7.0)
>
> Chart Version: [0.9.5](https://github.com/aws/eks-charts/blob/v0.0.28/stable/aws-node-termination-handler/Chart.yaml)

##### Bottlerocket

[Bottlerocket](https://aws.amazon.com/bottlerocket/) is a Linux-based open-source operating system that is purpose-built by Amazon Web Services for running containers on virtual machines or bare metal hosts.
At this moment, `Bottlerocket` is only supported when using self-managed auto-scaling-groups.

> **NOTICE**: Bottlerocket is only available in [some supported AWS regions](https://github.com/bottlerocket-os/bottlerocket/blob/develop/QUICKSTART-EKS.md#finding-an-ami).

The following example will create an auto-scaling-group of 2 `t3.small` Linux instances running with the `Bottlerocket` AMI.

```ts
cluster.addAutoScalingGroupCapacity('BottlerocketNodes', {
  instanceType: new ec2.InstanceType('t3.small'),
  minCapacity:  2,
  machineImageType: eks.MachineImageType.BOTTLEROCKET
});
```

The specific Bottlerocket AMI variant will be auto selected according to the k8s version for the `x86_64` architecture.
For example, if the Amazon EKS cluster version is `1.17`, the Bottlerocket AMI variant will be auto selected as
`aws-k8s-1.17` behind the scene.

> See [Variants](https://github.com/bottlerocket-os/bottlerocket/blob/develop/README.md#variants) for more details.

Please note Bottlerocket does not allow to customize bootstrap options and `bootstrapOptions` properties is not supported when you create the `Bottlerocket` capacity.

### ARM64 Support

Instance types with `ARM64` architecture are supported in both managed nodegroup and self-managed capacity. Simply specify an ARM64 `instanceType` (such as `m6g.medium`), and the latest
Amazon Linux 2 AMI for ARM64 will be automatically selected.

```ts
// add a managed ARM64 nodegroup
cluster.addNodegroup('extra-ng-arm', {
  instanceType: new ec2.InstanceType('m6g.medium'),
  minSize: 2,
});

// add a self-managed ARM64 nodegroup
cluster.addAutoScalingGroupCapacity('self-ng-arm', {
  instanceType: new ec2.InstanceType('m6g.medium'),
  minCapacity: 2,
})
```

### VPC Support

### Endpoint Access

When you create a new cluster, Amazon EKS creates an endpoint for the managed Kubernetes API server that you use to communicate with your cluster (using Kubernetes management tools such as `kubectl`)

By default, this API server endpoint is public to the internet, and access to the API server is secured using a combination of AWS Identity and Access Management (IAM) and native Kubernetes [Role Based Access Control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC).

You can configure the [cluster endpoint access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) by using the `endpointAccess` property:

```typescript
const cluster = new eks.Cluster(this, 'hello-eks', {
  version: eks.KubernetesVersion.V1_16,
  endpointAccess: eks.EndpointAccess.PRIVATE // No access outside of your VPC.
});
```

The default value is `eks.EndpointAccess.PUBLIC_AND_PRIVATE`. Which means the cluster endpoint is accessible from outside of your VPC, but worker node traffic and `kubectl` commands issued by this library stay within your VPC.

### Permissions

> The IAM role specified in this command is called the "**masters role**". This is
> an IAM role that is associated with the `system:masters` [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/)
> group and has super-user access to the cluster.
>
> You can specify this role using the `mastersRole` option, or otherwise a role will be
> automatically created for you. This role can be assumed by anyone in the account with
> `sts:AssumeRole` permissions for this role.

## Using existing clusters

You can also directly use the `Nodegroup` construct to create node groups under different scopes:

```typescript
new eks.Nodegroup(scope, 'NodeGroup', {
  cluster: cluster,
  ...
});
```

> For a complete API reference visit [`NodegroupProps`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.NodegroupProps.html).

## Managing Objects

### Applying

#### Kubernetes Manifests

#### Helm Charts

### Patching

### Querying

## Known Issues