## Amazon EKS Construct Library
<!--BEGIN STABILITY BANNER-->

---

![Stability: Experimental](https://img.shields.io/badge/stability-Experimental-important.svg?style=for-the-badge)

> **This is a _developer preview_ (public beta) module. Releases might lack important features and might have
> future breaking changes.**
>
> This API is still under active development and subject to non-backward
> compatible changes or removal in any future version. Use of the API is not recommended in production
> environments. Experimental APIs are not subject to the Semantic Versioning model.

---
<!--END STABILITY BANNER-->

This construct library allows you to define [Amazon Elastic Container Service
for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters programmatically.

This library also supports programmatically defining Kubernetes resource
manifests within EKS clusters.

This example defines an Amazon EKS cluster and

```ts
const cluster = new eks.Cluster(this, 'hello-eks', { vpc });

cluster.addCapacity('default', {
  instanceType: new ec2.InstanceType('t2.medium'),
  desiredCapacity: 10,
});

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

**NOTE**: in order to determine the default AMI for for Amazon EKS instances the
`eks.Cluster` resource must be defined within a stack that is configured with an
explicit `env.region`. See [Environments](https://docs.aws.amazon.com/cdk/latest/guide/environments.html)
in the AWS CDK Developer Guide for more details.

Here is a [complete sample](./test/integ.eks-kubectl.lit.ts).

### Interacting with Your Cluster

The Amazon EKS construct library allows you to specify an IAM role that will be
granted `system:masters` privileges on your cluster.

Without specifying a `mastersRole`, you will not be able to interact manually
with the cluster.

The following example defines an IAM role that can be assumed by all users
in the account and shows how to use the `mastersRole` property to map this
role to the Kubernetes `system:masters` group:

```ts
// first define the role
const clusterAdmin = new iam.Role(this, 'AdminRole', {
  assumedBy: new iam.AccountRootPrincipal()
});

// now define the cluster and make map the role to the "masters" group
new eks.Cluster(this, 'Cluster', {
  vpc: vpc,
  mastersRole: clusterAdmin
});
```

Now, given AWS credentials for a user that is trusted by the masters role, you
should be able to interact with your cluster like this:

```console
$ aws eks update-kubeconfig --name CLUSTER-NAME
$ kubectl get all -n kube-system
...
```

**NOTE**: if the cluster is configured with `kubectlEnabled: false`, it
will be created with the role/user that created the AWS CloudFormation
stack. See [Kubectl Support](#kubectl-support) for details.

### Defining Kubernetes Resources

The `cluster.addManifest()` method can be used to apply Kubernetes resource
manifests to this cluster.

The following examples will deploy the [paulbouwer/hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes)
service on the cluster:

```ts
const appLabel = { app: "hello-kubernetes" };

const deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: { name: "hello-kubernetes" },
  spec: {
    replicas: 3,
    selector: { matchLabels: appLabel },
    template: {
      metadata: { labels: appLabel },
      spec: {
        containers: [
          {
            name: "hello-kubernetes",
            image: "paulbouwer/hello-kubernetes:1.5",
            ports: [ { containerPort: 8080 } ]
          }
        ]
      }
    }
  }
};

const service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: { name: "hello-kubernetes" },
  spec: {
    type: "LoadBalancer",
    ports: [ { port: 80, targetPort: 8080 } ],
    selector: appLabel
  }
};

cluster.addManifest('hello-kub', service, deployment);
```

Since manifests are modeled as CloudFormation resources. This means that if the
`addManifest` statement is deleted from your code, the next `cdk deploy` will
issue a `kubectl delete` command and the Kubernetes resources will be deleted.

You can also use the `KubernetesManifest` construct directly:

```ts
new KubernetesManifest(this, 'service', {
  manifest: [ {
    apiVersion: "v1",
    kind: "Service",
    metadata: { name: "hello-kubernetes" },
    spec: {
      type: "LoadBalancer",
      ports: [ { port: 80, targetPort: 8080 } ],
      selector: appLabel
    }
  } ]
});
```

### AWS IAM Mapping

As described in the [Amazon EKS User Guide](https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html),
you can map AWS IAM users and roles to Kubernetes RBAC configuration.

The Amazon EKS construct manages the **aws-auth ConfigMap** Kubernetes resource
on your behalf and includes an APIs for adding user and role mappings:

For example, let's say you want to grant an IAM user administrative
privileges on your cluster:

```ts
const adminUser = new iam.User(this, 'Admin');
cluster.addUserMapping(adminUser, { groups: [ 'system:masters' ]});
```

Furthermore, when auto-scaling capacity is added to the cluster (through
`cluster.addCapacity` or `cluster.addAutoScalingGroup`), the IAM instance role
of the auto-scaling group will be automatically mapped to RBAC so nodes can
connect to the cluster. No manual mapping is required any longer.

### Node ssh Access

If you want to be able to SSH into your worker nodes, you must already
have an SSH key in the region you're connecting to and pass it, and you must
be able to connect to the hosts (meaning they must have a public IP and you
should be allowed to connect to them on port 22):

[ssh into nodes example](test/example.ssh-into-nodes.lit.ts)

If you want to SSH into nodes in a private subnet, you should set up a
bastion host in a public subnet. That setup is recommended, but is
unfortunately beyond the scope of this documentation.

### kubectl Support

When you create an Amazon EKS cluster, the IAM entity user or role, such as a
[federated user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html)
that creates the cluster, is automatically granted `system:masters` permissions
in the cluster's RBAC configuration.

In order to allow programmatically defining **Kubernetes resources** in your AWS
CDK app and provisioning them through AWS CloudFormation, we will need to assume
this "masters" role every time we want to issue `kubectl` operations against your
cluster.

At the moment, the [AWS::EKS::Cluster](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html)
AWS CloudFormation resource does not support this behavior, so in order to
support "programmatic kubectl", such as applying manifests
and mapping IAM roles from within your CDK application, the Amazon EKS
construct library uses a custom resource for provisioning the cluster.
This custom resource is executed with an IAM role that we can then use
to issue `kubectl` commands.

The default behavior of this library is to use this custom resource in order
to retain programmatic control over the cluster. In order words: to allow
you to define Kubernetes resources in your CDK code instead of having to
manage your Kubernetes applications through a separate system.

One of the implications of this design is that, by default, the user who
provisioned the AWS CloudFormation stack (executed `cdk deploy`) will
not have administrative privileges on the EKS cluster.

1. Additional resources will be synthesized into your template (the AWS Lambda
   function, the role and policy).
2. As described in [Interacting with Your Cluster](#interacting-with-your-cluster),
   if you wish to be able to manually interact with your cluster, you will need
   to map an IAM role or user to the `system:masters` group. This can be either
   done by specifying a `mastersRole` when the cluster is defined, calling
   `cluster.addMastersRole` or explicitly mapping an IAM role or IAM user to the
   relevant Kubernetes RBAC groups using `cluster.addRoleMapping` and/or
   `cluster.addUserMapping`.

If you wish to disable the programmatic kubectl behavior and use the standard
AWS::EKS::Cluster resource, you can specify `kubectlEnabled: false` when you define
the cluster:

```ts
new eks.Cluster(this, 'cluster', {
  vpc: vpc,
  kubectlEnabled: false
});
```

**Take care**: a change in this property will cause the cluster to be destroyed
and a new cluster to be created.

When kubectl is disabled, you should be aware of the following:

1. When you log-in to your cluster, you don't need to specify `--role-arn` as long as you are using the same user that created
   the cluster.
2. As described in the Amazon EKS User Guide, you will need to manually
   edit the [aws-auth ConfigMap](https://docs.aws.amazon.com/eks/latest/userguide/add-user-role.html) when you add capacity in order to map
   the IAM instance role to RBAC to allow nodes to join the cluster.
3. Any `eks.Cluster` APIs that depend on programmatic kubectl support will fail with an error: `addManifest`, `addRoleMapping`, `addUserMapping`, `addMastersRole`, `props.mastersRole`.

### Roadmap

- [ ] Describe how to set up AutoScaling (how to combine EC2 and Kubernetes scaling)