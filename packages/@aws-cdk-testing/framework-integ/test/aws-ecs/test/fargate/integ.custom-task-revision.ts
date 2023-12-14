import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as integ from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ-custom-task-revision');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'FargateCPCluster', {
  vpc,
  capacityProviders: ['FARGATE', 'FARGATE_SPOT'],
});

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef');

taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
});

new ecs.FargateService(stack, 'FargateServiceFirst', {
  cluster,
  taskDefinition,
  taskDefinitionRevision: ecs.TaskDefinitionRevision.of(1),
});

new ecs.FargateService(stack, 'FargateServiceLatest', {
  cluster,
  taskDefinition,
  taskDefinitionRevision: ecs.TaskDefinitionRevision.LATEST,
});

new integ.IntegTest(app, 'EcsCustomTaskRevision', {
  testCases: [stack],
});

app.synth();

