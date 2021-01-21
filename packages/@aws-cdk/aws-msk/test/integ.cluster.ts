import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as msk from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-msk-integ');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2 });

const cluster = new msk.Cluster(stack, 'Cluster', {
  clusterName: 'integ-test',
  vpc
});

cluster.connections.allowToAnyIpv4(
  ec2.Port.tcp(9094),
  'Brokers open to the world'
);

app.synth();
