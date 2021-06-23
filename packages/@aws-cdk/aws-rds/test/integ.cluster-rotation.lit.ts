import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as rds from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-rotation');

const vpc = new ec2.Vpc(stack, 'VPC');

/// !show
const cluster = new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.AURORA,
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    vpc,
  },
});

cluster.addRotationSingleUser();
/// !hide

app.synth();
