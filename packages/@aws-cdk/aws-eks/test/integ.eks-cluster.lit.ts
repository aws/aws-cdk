import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import eks = require('../lib');

class EksClusterStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /// !show
    const vpc = new ec2.VpcNetwork(this, 'VPC');

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

new EksClusterStack(app, 'eks-integ-test');

app.run();