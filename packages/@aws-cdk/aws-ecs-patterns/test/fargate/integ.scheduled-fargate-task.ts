import * as path from 'path';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as events from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import { ScheduledFargateTask } from '../../lib';

const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1 });
    const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

    // Create the scheduled task
    new ScheduledFargateTask(this, 'ScheduledFargateTask', {
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
  }
}

const myStack = new EventStack(app, 'aws-fargate-integ');

new integ.IntegTest(app, 'publicQueueProcessingFargateServiceTest', {
  testCases: [myStack],
});

app.synth();
