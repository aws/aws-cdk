import ec2 = require("@aws-cdk/aws-ec2");
import cdk = require("@aws-cdk/cdk");
import eks = require("../lib");

const ENV = "dev";
const app = new cdk.App();

const stack = new cdk.Stack(app, "Network", { env: { region: "us-east-1" } });

const vpc = new ec2.VpcNetwork(stack, "VPC", {
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

const cluster = new eks.Cluster(stack, "Cluster", {
  vpc,
  vpcPlacement: {
    subnetsToUse: ec2.SubnetType.Public
  }
});

cluster.connections.allowFromAnyIPv4(new ec2.TcpPort(443));

const grp1 = new eks.Nodes(stack, "NodeGroup1", {
  vpc,
  cluster,
  minNodes: 3,
  maxNodes: 6,
  sshKeyName: "aws-dev-key"
});
grp1.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));

const grp2 = new eks.Nodes(stack, "NodeGroup2", {
  vpc,
  cluster,
  nodeClass: ec2.InstanceClass.T2,
  nodeSize: ec2.InstanceSize.Medium,
  nodeType: eks.NodeType.Normal,
  minNodes: 2,
  maxNodes: 4,
  sshKeyName: "aws-dev-key"
});
grp2.nodeGroup.connections.allowFromAnyIPv4(new ec2.TcpPort(22));

app.run();
