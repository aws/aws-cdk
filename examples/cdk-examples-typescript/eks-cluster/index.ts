import ec2 = require("@aws-cdk/aws-ec2");
import eks = require("@aws-cdk/aws-eks");
import cdk = require("@aws-cdk/cdk");

const ENV = "dev";
const app = new cdk.App();

/**
 * Ths stack creates the VPC and network for the cluster
 *
 * @default single public subnet per availability zone (3)
 * This creates three (3) total subnets with an Internet Gateway
 * The subnets could be private with a Nat Gateway
 * they must not be isolated, as instances later need to
 * have outbound internet access to contact the API Server
 */
const networkStack = new cdk.Stack(app, "Network");

const vpc = new ec2.VpcNetwork(networkStack, "VPC", {
  cidr: "10.244.0.0/16",
  maxAZs: 3,
  natGateways: 0,
  subnetConfiguration: [
    {
      name: "pub",
      cidrMask: 24,
      subnetType: ec2.SubnetType.Public
    }
  ],
  tags: {
    env: `${ENV}`
  }
});
const vpcExport = vpc.export();

/**
 * This stack creates the EKS Cluster with the imported VPC
 * above, and puts the cluster inside the chosen placemnt
 *
 * clusterName can be set (not recommended), let cfn generate
 * version can be specified, only 1.10 supported now
 * will become useful when more versions are supported
 */
const clusterStack = new cdk.Stack(app, "Cluster");

const clusterVpc = ec2.VpcNetworkRef.import(
  clusterStack,
  "ClusterVpc",
  vpcExport
);
const cluster = new eks.Cluster(clusterStack, "Cluster", {
  vpc: clusterVpc,
  vpcPlacement: {
    subnetsToUse: ec2.SubnetType.Public
  }
});
cluster.connections.allowFromAnyIPv4(new ec2.TcpPort(443));

/**
 * This section creates worker node clusters
 * Two are shown just to illustrate that different
 * ones can be spun up or down
 */
const grp1 = new eks.Nodes(cluster, "NodeGroup1", {
  nodeClass: ec2.InstanceClass.M5,
  nodeSize: ec2.InstanceSize.Large,
  nodeType: eks.NodeType.Normal,
  minNodes: 3,
  maxNodes: 6,
  sshKeyName: "aws-dev-key"
});
grp1.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));

const grp2 = new eks.Nodes(cluster, "NodeGroup2", {
  nodeClass: ec2.InstanceClass.T2,
  nodeSize: ec2.InstanceSize.Medium,
  nodeType: eks.NodeType.Normal,
  minNodes: 2,
  maxNodes: 4,
  sshKeyName: "aws-dev-key"
});
grp2.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));

app.run();
