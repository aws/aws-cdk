## AWS Elastic Container Service for Kubernetes (EKS) Construct Library

This construct library allows you to define and create [Amazon Elastic Container Service for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters programmatically.

### Define a VPC Network Stack

The cluster must be placed inside of an `AWS VPC`.

```ts
import ec2 = require('@aws-cdk/aws-ec2');
import eks = require('@aws-cdk/aws-eks');
import cdk = require('@aws-cdk/cdk');

const app = new cdk.App();

const networkStack = new cdk.Stack(app, 'Network');

const vpc = new ec2.VpcNetwork(networkStack, 'VPC');
```

### Import the Network Stack

This can be done within a single stack and no need to import, but it's best to separate functions as much as possible.

```ts
const clusterStack = new cdk.Stack(app, 'Cluster');

const clusterVpc = ec2.VpcNetworkRef.import(clusterStack, 'ClusterVpc', vpc.export());
const cluster = new eks.Cluster(clusterStack, 'Cluster', {
  vpc: clusterVpc,
  vpcPlacement: {
    subnetsToUse: ec2.SubnetType.Public,
  },
});
```

This creates the `EKS Control Plane` but no `Worker Nodes` will be created at this step.

#### Connections

The `Cluster` class implements the `IConnectable` interface to easily manage security group rules.

Allowing access to the API server with `kubectl` one would add `cluster.connections.allowFromAnyIPv4(new ec2.TcpPort(443));`. Though for best practices it's best to use the `connections.allowFrom` and allow from a specific connectable peer. Such as a `bastion` host's security group.

### Create the Worker Nodes

Here we create a set of worker nodes to run our container workloads on.

```ts
const grp1 = new eks.Nodes(clusterStack, 'NodeGroup1', {
  vpc: clusterVpc,
  cluster,
  minNodes: 3,
  maxNodes: 6,
  sshKeyName: 'aws-dev-key',
});
```

This example creates nodes between `minNodes` value and `maxNodes` value with the default parameters for node types (`M5` and `Large`) as that serves decently for most situations in dev and sometimes prod environments.

The creation of also initializes the security groups with the [Amazon Recommended](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html) settings for `cluster:to:nodes and nodes:to:cluster` communication.

By default even if the "sshKeyName" is provided, not security groups are modified to allow access. You'll need to add the rules using the connections specifier.

- Allow SSH from any IPv4 `grp1.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));`

Recommended method (be more explicit)

Allow only from specified IPv4 (can also be another security group) see [connections documentation](https://awslabs.github.io/aws-cdk/refs/_aws-cdk_aws-ec2.html#connections) `cluster.connections.allowFrom(new ec2.CidrIPv4("X.X.X.X/32"), new ec2.TcpPort(443))`

### Add More Worker Nodes

You can also add more worker nodes to the Stack as you see fit. Maybe different sizes? or different class? Or maybe separate worker nodes from production, testing and dev?.

```ts
const grp2 = new eks.Nodes(clusterStack, 'NodeGroup2', {
  vpc: clusterVpc,
  cluster,
  nodeClass: ec2.InstanceClass.T2,
  nodeSize: ec2.InstanceSize.Medium,
  nodeType: eks.NodeType.Normal,
  minNodes: 2,
  maxNodes: 4,
  sshKeyName: 'aws-dev-key',
});
```

There's an `Array` of autoscaling groups that tracks the creation of nodes.
