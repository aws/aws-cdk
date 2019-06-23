import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/core');
import eks = require('../lib');

class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const vpc = new ec2.Vpc(this, 'VPC');

    const cluster = new eks.Cluster(this, 'EKSCluster', {
      vpc
    });

    cluster.addCapacity('Nodes', {
      instanceType: new ec2.InstanceType('t2.medium'),
      desiredCapacity: 1,  // Raise this number to add more nodes
    });
    /// !hide
  }
}

const app = new cdk.App();

// since the EKS optimized AMI is hard-coded here based on the region,
// we need to actually pass in a specific region.
new EksClusterStack(app, 'eks-integ-test', {
  env: {
    region: process.env.CDK_INTEG_REGION || process.env.CDK_DEFAULT_REGION,
    account: process.env.CDK_INTEG_ACCOUNT || process.env.CDK_DEFAULT_ACCOUNT,
  }
});

app.synth();