import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-ecs-integ-bottlerocket');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

cluster.addCapacity('bottlerocket-asg', {
  minCapacity: 2,
  instanceType: new ec2.InstanceType('c5.large'),
  machineImageType: ecs.MachineImageType.BOTTLEROCKET,
});

app.synth();
