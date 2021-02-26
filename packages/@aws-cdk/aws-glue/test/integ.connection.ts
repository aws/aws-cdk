import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as glue from '../lib';

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
