import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

cluster.addCapacity('graviton-cluster', {
  minCapacity: 2,
  instanceType: new ec2.InstanceType('c6g.large'),
  machineImageType: ecs.MachineImageType.BOTTLEROCKET,
});
app.synth();
