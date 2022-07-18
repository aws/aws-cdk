import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';

import { ScheduledEc2Task } from '../../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-integ');
const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2 });
const cluster = new ecs.Cluster(stack, 'Cluster', { vpc });


cluster.addCapacity('DefaultAutoScalingGroup', {
  instanceType: new ec2.InstanceType('t2.micro'),
});

/// !show
// Create the scheduled task
new ScheduledEc2Task(stack, 'ScheduledEc2Task', {
  cluster,
  scheduledEc2TaskImageOptions: {
    image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
    memoryLimitMiB: 512,
    cpu: 1,
    environment: { TRIGGER: 'CloudWatch Events' },
  },
  desiredTaskCount: 2,
  schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
});
/// !hide


new integ.IntegTest(app, 'specialListenerEc2Test', {
  testCases: [stack],
});

app.synth();
