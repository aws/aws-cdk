import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as ecs from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-spot');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });

const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

cluster.addCapacity('asgSpot', {
  maxCapacity: 2,
  minCapacity: 2,
  desiredCapacity: 2,
  instanceType: new ec2.InstanceType('c5.xlarge'),
  spotPrice: '0.0735',
  spotInstanceDraining: true,
});

cluster.addCapacity('asgOd', {
  maxCapacity: 2,
  minCapacity: 1,
  desiredCapacity: 1,
  instanceType: new ec2.InstanceType('t3.large'),
});

const taskDefinition = new ecs.TaskDefinition(stack, 'Task', {
  compatibility: ecs.Compatibility.EC2,
});

taskDefinition.addContainer('PHP', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 512,
}).addPortMappings({
  containerPort: 80,
});

new ecs.Ec2Service(stack, 'Service', {
  cluster,
  taskDefinition,
});

app.synth();
