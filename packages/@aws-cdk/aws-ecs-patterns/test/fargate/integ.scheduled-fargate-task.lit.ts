import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { ScheduledFargateTask } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1 });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Create the scheduled task
new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
    memoryLimitMiB: 512,
    cpu: 256,
    environment: { TRIGGER: 'CloudWatch Events' },
  },
  desiredTaskCount: 2,
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});


new integ.IntegTest(app, 'scheduledFargateTaskTest', {
  testCases: [stack],
});

app.synth();
