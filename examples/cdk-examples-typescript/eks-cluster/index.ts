import { UpdateType } from "@aws-cdk/aws-autoscaling";
import ec2 = require("@aws-cdk/aws-ec2");
import eks = require("@aws-cdk/aws-eks");
import cdk = require("@aws-cdk/cdk");

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
    env: "${env}"
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

const grp1 = new eks.Nodes(cluster, "NodeGroup1");

grp1.addNodes({
  vpc: clusterVpc,
  instanceType: new ec2.InstanceTypePair(
    ec2.InstanceClass.M5,
    ec2.InstanceSize.Large
  ),
  machineImage: new ec2.GenericLinuxImage(eks.nodeAmi.normal),
  minSize: 3,
  desiredCapacity: 3,
  maxSize: 6,
  updateType: UpdateType.RollingUpdate,
  keyName: "aws-dev-key",
  vpcPlacement: cluster.vpcPlacement
});
grp1.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));

// const grp2 = new eks.Nodes(cluster, "NodeGroup2");
// grp2.addNodes({
//   vpc: clusterVpc,
//   instanceType: new ec2.InstanceTypePair(
//     ec2.InstanceClass.T2,
//     ec2.InstanceSize.Large
//   ),
//   machineImage: new ec2.GenericLinuxImage(eks.nodeAmi.normal),
//   minSize: 2,
//   desiredCapacity: 4,
//   maxSize: 8,
//   updateType: UpdateType.RollingUpdate,
//   keyName: "aws-dev-key",
//   vpcPlacement: cluster.vpcPlacement
// });
// grp2.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));

app.run();
