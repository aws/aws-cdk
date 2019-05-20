import ec2 = require('@aws-cdk/aws-ec2');
import cdk = require('@aws-cdk/cdk');
import rds = require('../lib');

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-rotation');

const vpc = new ec2.Vpc(stack, 'VPC');

/// !show
const cluster = new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.Aurora,
  masterUser: {
    username: 'admin'
  },
  instanceProps: {
    instanceType: new ec2.InstanceTypePair(ec2.InstanceClass.Burstable2, ec2.InstanceSize.Small),
    vpc
  }
});

cluster.addRotationSingleUser('Rotation');
/// !hide

app.run();
