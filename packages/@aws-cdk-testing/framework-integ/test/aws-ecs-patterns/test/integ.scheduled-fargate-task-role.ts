import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';

const app = new App();
const stack = new Stack(app, 'ScheduledFargateTaskRoleStack');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 1 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });

const role = new iam.Role(stack, 'CustomRole', {
  assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
});

new ecsPatterns.ScheduledFargateTask(stack, 'ScheduledTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
  },
  schedule: events.Schedule.expression('rate(1 day)'),
  role,
});

new IntegTest(app, 'ScheduledFargateTaskRoleInteg', {
  testCases: [stack],
});
