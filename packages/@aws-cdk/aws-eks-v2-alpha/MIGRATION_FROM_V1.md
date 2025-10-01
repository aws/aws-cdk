# EKS V2 Migration Guide

## Introduction

This guide provides detailed instructions for migrating from AWS CDK's EKS V1 constructs to the new EKS V2 constructs. The EKS V2 construct library introduces several architectural improvements and aligns better with AWS's recommended practices for managing Kubernetes clusters.

## Background and Key Changes

The EKS V2 construct introduces several important architectural and feature changes:

### Resource Management

* **Cluster Resource Type**: V1 uses `Custom::AWSCDK-EKS-Cluster` custom resource, while V2 uses native `AWS::EKS::Cluster` CloudFormation resource
* **Fargate Profile Resource Type**: V1 uses `Custom::AWSCDK-EKS-FargateProfile` custom resource, while V2 uses native `AWS::EKS::FargateProfile` CloudFormation resource
* **Stack Architecture**: V1 uses nested stacks, while V2 uses a flattened architecture in the main stack

### Default Configuration

* **Default Capacity**: V1 defaults to `DefaultCapacityType.NODEGROUP` with 2 m5.large instances, while V2 defaults to `DefaultCapacityType.AUTOMODE` with managed node pools (system and general-purpose) automatically managed by AWS
* **KubectlProvider**: V1 creates KubectlProvider by default, while V2 only creates it when explicitly requested via `kubectlProviderOptions`

### Authentication and Access

* **Authentication Mode**: V1 supports multiple authentication modes (CONFIG_MAP, API, API_AND_CONFIG_MAP), while V2 supports only API mode using Access Entries
* **Access Management**: V1 includes the AwsAuth construct for ConfigMap-based access control, while V2 uses only Access Entry methods (`grantAccess`, `grantAdmin`) for IAM-based access control

### Improved Capabilities

* **Multiple Clusters**: V1 has a limit of 1 cluster per stack, while V2 supports multiple clusters per stack with proper resource isolation
* **VPC Support**: V1 cannot deploy in isolated VPCs due to custom resource limitations, while V2 supports isolated VPC deployments
* **Escape Hatches**: V2 enables full access to underlying CloudFormation properties for advanced customization
* **API Ergonomics**: V2 introduces more ergonomic APIs with simplified property management and consolidation of kubectl-related properties

## Prerequisites

* Familiarity with access entries and access policies. For more information, see[Grant IAM users access to Kubernetes with EKS access entries](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html) and [Associate access policies with access entries](https://docs.aws.amazon.com/eks/latest/userguide/access-policies.html).
* An existing cluster with a platform version that is at or later than the versions listed in the Prerequisites of the [Grant IAM users access to Kubernetes with EKS access entries topic.](https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html)
* Version `0.212.0` or later of the `eksctl` command line tool installed on your device or AWS CloudShell. To install or update `eksctl`, see [Installation](https://eksctl.io/installation) in the `eksctl` documentation.
* Kubernetes permissions to modify the `aws-auth` `ConfigMap` in the `kube-system` namespace.
* An AWS Identity and Access Management role or user with the following permissions: `CreateAccessEntry` and `ListAccessEntries`. For more information, see[Actions defined by Amazon Elastic Kubernetes Service](https://docs.aws.amazon.com/service-authorization/latest/reference/list_amazonelastickubernetesservice.html#amazonelastickubernetesservice-actions-as-permissions) in the Service Authorization Reference.
* `aws-cdk-lib` version 2.216 (version with the removal policy)

## Changing Authentication Mode to API

Before beginning the EKS v2 migration process, ensure that your EKS clusters are configured to use API authentication mode. If you're currently using ConfigMap or API_AND_CONFIG_MAP modes, you'll need to transition to API mode through a gradual approach.

**Note that you need a cluster with at least Kubernetes version 1.28.4 which added support for EKS access entries.**


### 1. Switch from CONFIG_MAP to API_AND_CONFIG_MAP

First change from CONFIG_MAP to API_AND_CONFIG_MAP mode. When a cluster is in `API_AND_CONFIGMAP` authentication mode and there’s a mapping for the same IAM role in both the `aws-auth` `ConfigMap` and in access entries, the role will use the access entry’s mapping for authentication. Access entries take precedence over `ConfigMap` entries for the same IAM principal. 

```
// In your EKS v1 code
const cluster = new eks.Cluster(this, 'MyCluster', {
    version: eks.KubernetesVersion.V1_33,
    kubectlLayer: new KubectlV31Layer(this, 'kubectl'),
    // Setting the intermediate mode to API_AND_CONFIG_MAP. 
    // This will not affect your cluster authentication yet.
    authenticationMode: eks.AuthenticationMode.API_AND_CONFIG_MAP,
});
```

### 2. Migrate your existing ConfigMap entries to AccessEntry

#### 2.1 View the existing entries in your `aws-auth ConfigMap`. Replace `my-cluster` with the name of your cluster.

```
eksctl get iamidentitymapping --cluster my-cluster
```

An example output is as follows.

```
ARN                                                                                             USERNAME                                GROUPS                                                  ACCOUNT
arn:aws:iam::111122223333:role/EKS-my-cluster-Admins                                            Admins                                  system:masters
arn:aws:iam::111122223333:role/EKS-my-cluster-my-namespace-Viewers                              my-namespace-Viewers                    Viewers
arn:aws:iam::111122223333:role/EKS-my-cluster-self-managed-ng-1                                 system:node:{{EC2PrivateDNSName}}       system:bootstrappers,system:nodes
arn:aws:iam::111122223333:user/my-user                                                          my-user
arn:aws:iam::111122223333:role/EKS-my-cluster-fargateprofile1                                   system:node:{{SessionName}}             system:bootstrappers,system:nodes,system:node-proxier
arn:aws:iam::111122223333:role/EKS-my-cluster-managed-ng                                        system:node:{{EC2PrivateDNSName}}       system:bootstrappers,system:nodes
```

#### **2.2 Creating equivalent access entries for the ConfigMap entries**

[Create access entries](https://docs.aws.amazon.com/eks/latest/userguide/creating-access-entries.html) for any of the `ConfigMap` entries that you saw returned in the previous output. When creating the access entries, make sure to specify the same values for `ARN`, `USERNAME`, `GROUPS`, and `ACCOUNT` returned in your output. In the example output, **you would create access entries for all entries except the last two entries**, since those entries were created by Amazon EKS for a Fargate profile and a managed node group.

Equivalent CDK code using **EKS v1** for the above ConfigMap entries:

```
cluster.grantAccess('AdminsAccess', adminsRole.roleArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
    accessScopeType: eks.AccessScopeType.CLUSTER,
  }),
]);

cluster.grantAccess('ViewersAccess', nsViewersRole.roleArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
    accessScopeType: eks.AccessScopeType.NAMESPACE,
    namespaces: ['my-namespace'], // to scope access to a namespace
  }),
]);

cluster.grantAccess('NodesAccess', selfManagedNodeRole.roleArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSWorkerNodePolicy', {
    accessScopeType: eks.AccessScopeType.CLUSTER,
  }),
]);

cluster.grantAccess('UserAccess', myUser.userArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
    accessScopeType: eks.AccessScopeType.CLUSTER,
  }),
]);
```

For more information, see:

* https://docs.aws.amazon.com/eks/latest/userguide/migrating-access-entries.html
* https://docs.aws.amazon.com/cdk/api/v2/docs/aws-eks-v2-alpha-readme.html#access-entry
* https://docs.aws.amazon.com/eks/latest/userguide/access-entries.html


**2.3 Deploy with both ConfigMap entries and API access entries**

Run `cdk diff` to verify that the changes are expected and deploy the cluster with both policies in ConfigMap entires and access entries. 

```
cdk diff
cdk deploy
```


After deploying with `API_AND_CONFIG_MAP`, your cluster should now support ConfigMap and API mode in parallel. Entries in access entries will override the conflicting ones in ConfigMap. **Verify your cluster still works as expected and the equivalent access entries are created.**

### 3. Switch to API mode only

After successful deployment and verification that the required entries CONFIG_MAP have the equivalent access entries, then change to API mode only and remove all ConfigMap entry usages (`AwsAuth` construct or` cluster.awsAuth `usages).

**Note - This is a one-way transition. Once you switch to the `API` mode, you will not be able to switch back. Therefore, it is crucial to ensure that you have defined all the necessary access entries before making the switch to the `API` mode.**

```
const cluster = new eks.Cluster(this, 'MyCluster', {
    version: eks.KubernetesVersion.V1_33,
    kubectlLayer: new KubectlV33Layer(this, 'kubectl'),
    // Setting the final mode to API
    authenticationMode: eks.AuthenticationMode.API,
});
```

## EKS V2 Migration Steps

Now that you have migrated to API authentication mode, follow these steps to migrate from EKS V1 to EKS V2 constructs:

### 1. Set Removal Policy to RETAIN

Update your V1 cluster configuration to set the removal policy to RETAIN and deploy:

```
// In the EKS v1 cluster
const cluster = new eks.Cluster(this, 'MyCluster', {
    version: eks.KubernetesVersion.V1_33,
    kubectlLayer: new KubectlV31Layer(this, 'kubectl'),
    vpc: myCustomVpc,
    authenticationMode: eks.AuthenticationMode.API,
    // Add removal policy to retain resources created by the construct
    // after CloudFormation stops managing them
    removalPolicy: RemovalPolicy.RETAIN,
});
```

When the removal policy is set to `RETAIN`, all resources created by the V1 construct will be preserved when the construct is removed from the stack. These resources may include:

* EKS Cluster
* EKS NodeGroup
* IAM Roles
* VPC (if created by the construct)
* Security Groups

### 2. Remove Cluster Code and Deploy

Remove the cluster construct and usages of EKS v1 constructs from your stack, run `cdk diff`  and verify all of the resourced being removed have the `RETAIN` removal policy and then deploy. If you have other stacks or code referencing the interfaces of the v1 resources, you will need to use the `fromXAttributes/fromXName` functions to create a temporary reference for that in your CDK code.

* `cluster.fromClusterAttributes`
* `accessEntry.fromAccessEntryAttributes`
* `addon.fromAddonAttributes`
* `nodeGroup.fromNodegroupName`



```
cdk diff
```

**Important: Verify that all the resources being removed from the stack have the RETAIN removal policy. If a resource is being deleted from the diff and has no RETAIN policy, you add the RETAIN removal policy to that resource or you risk deleting the physical resource from the AWS account.** 

```

// Comment out or remove the cluster definition
// const cluster = new eks.Cluster(this, 'MyCluster', {
//   version: eks.KubernetesVersion.V1_33,
//   kubectlLayer: new KubectlV31Layer(this, 'kubectl'),
//   vpc: myCustomVpc,
//   authenticationMode: eks.AuthenticationMode.API,
//   removalPolicy: RemovalPolicy.RETAIN,
// });

//cluster.grantAccess('AdminsAccess', adminsRole.roleArn, [
//  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
//    accessScopeType: eks.AccessScopeType.CLUSTER,
//  }),
//]);

//cluster.grantAccess('ViewersAccess', nsViewersRole.roleArn, [
//  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
//    accessScopeType: eks.AccessScopeType.NAMESPACE,
//    namespaces: ['my-namespace'], // to scope access to a namespace
//  }),
//]);

//cluster.grantAccess('NodesAccess', selfManagedNodeRole.roleArn, [
//  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSWorkerNodePolicy', {
//    accessScopeType: eks.AccessScopeType.CLUSTER,
//  }),
//]);

//cluster.grantAccess('UserAccess', myUser.userArn, [
//  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
//    accessScopeType: eks.AccessScopeType.CLUSTER,
//  }),
//]);
```

Deploy the stack without the EKS cluster in CDK. This will orphan the resources in the account and they will not be deleted when removing them from the stack. **** 

**Remember, you must have already deployed with  `removalPolicy: RemovalPolicy.RETAIN`**

### 3. Add EKS V2 Construct

Add the new EKS V2 construct to your stack:

```
import * as eks from '@aws-cdk/aws-eks-v2-alpha';

const cluster = new eks.Cluster(this, 'MyCluster', {
    version: eks.KubernetesVersion.V1_33,
    /**/ Match your V1 configuration by specifying NODEGROUP****
    // Note: V2 defaults to AUTOMODE if not specified**
    defaultCapacityType: eks.DefaultCapacityType.NODEGROUP,
    defaultCapacity: 3, // Number of instances
    defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
    vpc: myCustomVpc, // or do not provide one to use the default VPC
    
    // KubectlProvider configuration (only if needed)
    // V2 doesn't create KubectlProvider by default, unlike V1
    kubectlProviderOptions: {
        kubernetesVersion: eks.KubernetesVersion.V1_33,
    },
    
    // Add other required properties
});

// Grant access with EKS access entries (same API as the EKS V1 access entries we migrated earlier)
// Example:
cluster.grantAccess('AdminsAccess', adminsRole.roleArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSClusterAdminPolicy', {
    accessScopeType: eks.AccessScopeType.CLUSTER,
  }),
]);

cluster.grantAccess('ViewersAccess', nsViewersRole.roleArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
    accessScopeType: eks.AccessScopeType.NAMESPACE,
    namespaces: ['my-namespace'], // to scope access to a namespace
  }),
]);

cluster.grantAccess('NodesAccess', selfManagedNodeRole.roleArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSWorkerNodePolicy', {
    accessScopeType: eks.AccessScopeType.CLUSTER,
  }),
]);

cluster.grantAccess('UserAccess', myUser.userArn, [
  eks.AccessPolicy.fromAccessPolicyName('AmazonEKSViewPolicy', {
    accessScopeType: eks.AccessScopeType.CLUSTER,
  }),
]);
```

**Note on Default Capacity Type**: EKS V2 defaults to `DefaultCapacityType.AUTOMODE` (AWS-managed node pools) while V1 defaults to `DefaultCapacityType.NODEGROUP`. To maintain the same behavior during migration, explicitly set `defaultCapacityType: eks.DefaultCapacityType.NODEGROUP`.

### 4. Import Resources

Run the `cdk import` command to import the existing EKS cluster and related resources:

```
cdk import
```

You will be prompted to provide names and IDs for various resources:

```
MyStack/MyCluster/Role/Resource (AWS::IAM::Role): enter RoleName (empty to skip): MyStack-MyClusterRoleXXXXXX-YYYYYYY
MyStack/MyCluster/ControlPlaneSecurityGroup/Resource (AWS::EC2::SecurityGroup): enter Id (empty to skip): sg-xxxxxxxxxxxxxxxxx
MyStack/MyCluster/Resource (AWS::EKS::Cluster): enter Name (empty to skip): MyClusterXXXXXX-xxxxxxxxxxxxxxxxxxxxxxxxx
MyStack/MyCluster/NodegroupDefaultCapacity/NodeGroupRole/Resource (AWS::IAM::Role): enter RoleName (empty to skip): MyStack-MyClusterNodegroupDefaultCapacityNode-ZZZZZZZ
MyStack/MyCluster/NodegroupDefaultCapacity/Resource (AWS::EKS::Nodegroup): enter Id (empty to skip): MyClusterXXXXXX-xxxxxxxxxxxxxxxxxxxxxxxxx/MyClusterNodegroupDefaultCa-AAAAAAA
```

**Note**: You may need to use the `--force` flag when importing with a self-defined VPC.

For more information about `cdk import`, see: https://docs.aws.amazon.com/cdk/v2/guide/ref-cli-cmd-import.html

### 5. Verify and Deploy

### After the import is complete, run:

1. `cdk diff` to check for unexpected changes
2. `cdk deploy` to apply any required changes
3. `cdk drift` to check if any resource drifted

**Note: EKS Cluster and Node Group resources do not support CloudFormation drift detection. You'll need to verify your cluster configuration using AWS CLI or the EKS console directly:**

```
# Verify cluster configuration
aws eks describe-cluster --name <cluster-name>

# Verify node group configuration
aws eks describe-nodegroup --cluster-name <cluster-name> --nodegroup-name <nodegroup-name>
```

## Resource Mapping File

When performing the import, you may find it helpful to first record the required values and then fill them later. To do that you can run 

```
cdk import --record-resource-mapping eks_v2_mapping.json
```

**Note**: You may need to use the `--force` flag when importing with a self-defined VPC.

You can then provide a placeholder value to all prompted values, to generate a json that you can fill later:

```
{
  "TestClusterRole8CA9BAC9": {
    "RoleName": "placeholder"
  },
  "TestClusterControlPlaneSecurityGroupB52EC493": {
    "Id": "placeholder"
  },
  "TestClusterE0095054": {
    "Name": "placeholder"
  },
  "TestClusterKubectlReadyBarrier6007E30A": {
    "Name": "placeholder"
  },
  "TestClusterNodegroupDefaultCapacityNodeGroupRole27F4074E": {
    "RoleName": "placeholder"
  },
  "TestClusterNodegroupDefaultCapacity33D15659": {
    "Id": "placeholder"
  },
  "TestClusterAdminAccess5AD3206A": {
    "PrincipalArn": "placeholder",
    "ClusterName": "placeholder"
  }
}
```

and then you can edit the generated placeholder json to have the real values:


```
{
  "TestClusterRole8CA9BAC9": {
    "RoleName": "SimpleMigrationTest2-TestClusterRole8CA9BAC9-OZIs5zE22ppI"
  },
  "TestClusterControlPlaneSecurityGroupB52EC493": {
    "Id": "sg-02c528b18efe41e8b"
  },
  "TestClusterE0095054": {
    "Name": "TestCluster9D2C7838-3d64ce2a533c401fbae3e79f04696dd8"
  },
  "TestClusterKubectlReadyBarrier6007E30A": {
    "Name": "CFN-TestClusterKubectlReadyBarrier6007E30A-yQO52ywveSL7"
  },
  "TestClusterNodegroupDefaultCapacityNodeGroupRole27F4074E": {
    "RoleName": "SimpleMigrationTest2-TestClusterNodegroupDefaultCap-tZ76TaUVOaPI"
  },
  "TestClusterNodegroupDefaultCapacity33D15659": {
    "Id": "TestCluster9D2C7838-3d64ce2a533c401fbae3e79f04696dd8/TestClusterNodegroupDefault-d1Gci9rhEHyG"
  },
  "TestClusterAdminAccess5AD3206A": {
    "PrincipalArn": "arn:aws:iam::730335322200:role/SimpleMigrationTest2-AdminRole38563C57-tHg5e8HQrf6F",
    "ClusterName": "TestCluster9D2C7838-3d64ce2a533c401fbae3e79f04696dd8"
  }
}
```

then run 

```
cdk import --resource-mapping eks_v2_mapping.json
```

**Note**: You may need to use the `--force` flag when importing with a self-defined VPC.


## Future Automation Possibilities

Currently, CDK is not aware of physical IDs, which necessitates manual entry during the import process. A potential future enhancement could involve building a tool or script to:

1. Call CloudFormation APIs to fetch required physical IDs (before removing the old cluster from the stack)
2. Use these IDs to automatically answer the prompts during `cdk import`

This automation would require assuming a role with READ access to CloudFormation.
