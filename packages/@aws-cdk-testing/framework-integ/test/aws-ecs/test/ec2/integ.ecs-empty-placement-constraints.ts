import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-ec2');
const vpc = new ec2.Vpc(stack, 'Vpc');
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const taskDefinition = new ecs.Ec2TaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('TheContainer', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

new ecs.Ec2Service(stack, 'Ec2Service', {
  cluster,
  taskDefinition,
  placementConstraints: [],
});

new IntegTest(app, 'EmptyPlacementConstraints', {
  testCases: [stack],
});

app.synth();
