import ec2 = require('@aws-cdk/aws-ec2');
import eks = require('@aws-cdk/aws-eks');
import cdk = require( '@aws-cdk/cdk');

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
const network = new cdk.Stack(app, 'Network');
const vpc = new ec2.VpcNetwork(network, 'VPC', {
  cidr: '10.244.0.0/16',
  maxAZs: 3,
  natGateways: 0,
  subnetConfiguration: [
    {
      name: 'pub',
      cidrMask: 24,
      subnetType: ec2.SubnetType.Public
    }
  ],
  tags: {
    env: '${env}'
  }
});

/**
 * This stack creates the EKS Cluster with the imported VPC
 * above, and puts the cluster inside the chosen placemnt
 *
 * clusterName can be set (not recommended), let cfn generate
 * version can be specified, only 1.10 supported now
 * will become useful when more versions are supported
 */
const clusterStack = new cdk.Stack(app, 'Cluster');
const importedVpc = ec2.VpcNetworkRef.import(
  clusterStack,
  'ImportedVpc',
  vpc.export()
);
new eks.Cluster(clusterStack, 'Cluster', {
  vpc: importedVpc,
  vpcPlacement: {
    subnetsToUse: ec2.SubnetType.Public
  }
});

app.run();
