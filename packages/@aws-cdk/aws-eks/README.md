## AWS Elastic Container Service for Kubernetes (EKS) Construct Library

This construct library allows you to define and create [Amazon Elastic Container Service for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters programmatically.

### Example

The following example shows how to start an EKS cluster and how to
add worker nodes to it:

[starting a cluster example](test/integ.eks-cluster.lit.ts)

After deploying the previous CDK app you still need to configure `kubectl`
and manually add the nodes to your cluster, as described [in the EKS user
guide](https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html).

### SSH into your nodes

If you want to be able to SSH into your worker nodes, you must already
have an SSH key in the region you're connecting to and pass it, and you must
be able to connect to the hosts (meaning they must have a public IP and you
should be allowed to connect to them on port 22):

[ssh into nodes example](test/example.ssh-into-nodes.lit.ts)

If you want to SSH into nodes in a private subnet, you should set up a
bastion host in a public subnet. That setup is recommended, but is
unfortunately beyond the scope of this documentation.

### Roadmap

- [ ] Add ability to start tasks on clusters using CDK (similar to ECS's "`Service`" concept).
- [ ] Describe how to set up AutoScaling (how to combine EC2 and Kubernetes scaling)