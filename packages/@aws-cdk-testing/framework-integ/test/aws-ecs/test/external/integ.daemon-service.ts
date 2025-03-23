import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'ecs-external-service-daemon');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'EcsCluster', { vpc });

const taskDefinition = new ecs.ExternalTaskDefinition(stack, 'TaskDef');
taskDefinition.addContainer('web', {
  image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
  memoryLimitMiB: 256,
});

const service = new ecs.ExternalService(stack, 'service', {
  cluster,
  taskDefinition,
  daemon: true,
});

const integTest = new IntegTest(stack, 'ecs-external-service-daemon-test', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('ECS', 'describeServices', {
  cluster: cluster.clusterName,
  services: [service.serviceName],
})
  .assertAtPath('services.0.schedulingStrategy', ExpectedResult.stringLikeRegexp('DAEMON'));
