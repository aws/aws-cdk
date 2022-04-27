import * as ec2 from '@aws-cdk/aws-ec2';
import * as glue from '@aws-cdk/aws-glue';
import * as cdk from '@aws-cdk/core';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-glue-connection');

const vpc = new ec2.Vpc(stack, 'Vpc');

const sg = new ec2.SecurityGroup(stack, 'SecurityGroup', {
  vpc,
});

// Network connection
new glue.Connection(stack, 'NetworkConnection', {
  type: glue.ConnectionType.NETWORK,
  subnet: vpc.privateSubnets[0],
  securityGroups: [sg],
});
