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

This construct library allows you to define and create [Amazon Elastic Container
Service for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters
programmatically.

### Getting Started

The following code shows how to define an EKS cluster with an initial fleet of
worker nodes:

[starting a cluster example](test/integ.eks-cluster.lit.ts)

As described under [kubectl support](#kubectl-support) below, deploy this stack
with an explicit IAM role:

```console
$ cdk deploy --role-arn arn:aws:iam::111111111111:role/aws-cdk-deployment
```

### Defining Kubernetes Resources

The `cluster.addManifest` method can be used to apply Kubernetes resource
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

// kubectl apply -f manifest.yaml
cluster.addManifest('hello-kub', service, deployment);
```

Since manifests are modeled as CloudFormation resources. This means that if the
`addManifest` statement is deleted from your code, the next `cdk deploy` will
issue a `kubectl delete` command and the Kubernetes resources will be deleted.

### IAM Users and Role Mapping

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

### SSH into your nodes

If you want to be able to SSH into your worker nodes, you must already
have an SSH key in the region you're connecting to and pass it, and you must
be able to connect to the hosts (meaning they must have a public IP and you
should be allowed to connect to them on port 22):

[ssh into nodes example](test/example.ssh-into-nodes.lit.ts)

If you want to SSH into nodes in a private subnet, you should set up a
bastion host in a public subnet. That setup is recommended, but is
unfortunately beyond the scope of this documentation.

### kubectl Support

> This section is required due to the current behavior of Amazon EKS. We are
> exploring ways to enable a more streamlined process.

#### Background

When you create an Amazon EKS cluster, the IAM entity user or role, such as a
[federated user](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers.html)
that creates the cluster, is automatically granted `system:masters` permissions
in the cluster's RBAC configuration. This means that when you use `cdk deploy`
to provision EKS clusters, the IAM role that was used to create the AWS
CloudFormation stack will be used. In order to allow the AWS CDK to assume this
role in order to execute `kubectl` against this cluster, you will need to
**explicitly** specify an IAM role when you deploy the AWS CDK stack,
and this role's trust policy of this IAM role will allow the AWS Lambda role
that executes `kubectl` to assume it.

#### Create the IAM Role

This means that in order to allow the CDK to perform `kubectl` operations
against the cluster, you will have to


#### Disabling `kubectl` Support

If you wish to disable `kubectl` support, specify `kubectlEnabled: false` when
you define your `eks.Cluster`:

```ts
new eks.Cluster(this, 'cluster', { vpc, kubectlEnabled: false })
```

This will disable automatic mapping of autoscaling group roles to RBAC and will
throw errors when trying to define Kubernetes resources in this cluster.

### Roadmap

- [ ] Add ability to start tasks on clusters using CDK (similar to ECS's "`Service`" concept).
- [ ] Describe how to set up AutoScaling (how to combine EC2 and Kubernetes scaling)