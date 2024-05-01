import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as rds from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-rotation');

const vpc = new ec2.Vpc(stack, 'VPC');
const securityGroup = new ec2.SecurityGroup(stack, 'SecurityGroup', { vpc });
const endpoint = new ec2.InterfaceVpcEndpoint(stack, 'Endpoint', {
  vpc,
  service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
});

/// !show
const cluster = new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.AURORA,
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    vpc,
  },
});

cluster.addRotationSingleUser();

const clusterWithCustomRotationOptions = new rds.DatabaseCluster(stack, 'CustomRotationOptions', {
  engine: rds.DatabaseClusterEngine.AURORA,
  instanceProps: {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
    vpc,
  },
});
clusterWithCustomRotationOptions.addRotationSingleUser({
  automaticallyAfter: cdk.Duration.days(7),
  excludeCharacters: '!@#$%^&*',
  securityGroup,
  vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
  endpoint: endpoint,
});
/// !hide

app.synth();
