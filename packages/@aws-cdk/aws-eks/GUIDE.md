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
      * [Managed Node Groups](#managed-node-groups)
      * [Fargate Profiles](#fargate-profiles)
      * [Self Managed Auto Scaling Groups](#self-managed-auto-scaling-groups)
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



## Overview

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


## Provisioning clusters

Creating a new cluster is done using the `eks.Cluster` or `eks.FargateCluster` constructs. The only required property is the kubernetes version.

```typescript
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
});
```

You can also use `eks.FargateCluster` to provision a managed cluster that uses fargate workers.

```typescript
new eks.FargateCluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
});
```

There are various ways to customize to cluster. The first important concept to understand is **capacity**.

### Capacity

Capacity is the amount and the type of worker nodes that are available to the cluster for deploying resources. Amazon EKS offers 3 ways of configuring capacity:

#### Managed Node Groups

Amazon EKS managed node groups automate the provisioning and lifecycle management of nodes (Amazon EC2 instances) for Amazon EKS Kubernetes clusters.
With Amazon EKS managed node groups, you don’t need to separately provision or register the Amazon EC2 instances that provide compute capacity to run your Kubernetes applications. You can create, update, or terminate nodes for your cluster with a single operation. Nodes run using the latest Amazon EKS optimized AMIs in your AWS account while node updates and terminations gracefully drain nodes to ensure that your applications stay available.

> For more details: [Amazon EKS Managed Node Groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html)

Managed Node Groups are the recommended way to allocate cluster capacity. By default, this library will allocate a managed node group with 2 **m5.large** instances (this instance type suits most common use-cases, and is good value for money).

At cluster instatiation time, you can customize the number of instances and their type:

```typescript
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_17,
  defaultCapacity: 5,
  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.SMALL),
});
```



#### Fargate Profiles

#### Self Managed Auto Scaling Groups



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

## Using existing clusters

## Managing Objects

### Applying

#### Kubernetes Manifests

#### Helm Charts

### Patching

### Querying

## Known Issues