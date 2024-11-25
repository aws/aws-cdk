import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests-alpha';
import * as logs from 'aws-cdk-lib/aws-logs';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-ecs:removeDefaultDeploymentAlarm': false,
  },
});

const stack = new cdk.Stack(app, 'aws-ecs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

const taskDefinition = new ecs.FargateTaskDefinition(stack, 'TaskDef', {
  memoryLimitMiB: 1024,
  cpu: 512,
});

const logGroup = new logs.LogGroup(stack, 'LogGroup', {});

taskDefinition.addContainer('nginx', {
  image: ecs.ContainerImage.fromRegistry('nginx'),
  logging: ecs.LogDrivers.awsLogs({
    streamPrefix: 'test',
    logGroup,
  }),
});

new ecs.FargateService(stack, 'Service', {
  cluster,
  taskDefinition,
});

const test = new IntegTest(app, 'FargateWithAwsLogsDriver', {
  testCases: [stack],
});

test.assertions.awsApiCall('CloudWatchLogs', 'filterLogEvents', {
  logGroupName: logGroup.logGroupName,
  limit: 1,
}).assertAtPath(
  'events.0.message',
  ExpectedResult.stringLikeRegexp('.+'),
).waitForAssertions();

app.synth();
