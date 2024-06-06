import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
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
      propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      tags: [
        {
          key: 'my-tag',
          value: 'my-tag-value',
        },
      ],
    });

    // Create the scheduled task with container name
    new ScheduledFargateTask(this, 'ScheduledFargateTask2', {
      cluster,
      scheduledFargateTaskImageOptions: {
        image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
        containerName: 'differentName',
        memoryLimitMiB: 512,
        cpu: 256,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
      propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      tags: [
        {
          key: 'my-tag',
          value: 'my-tag-value',
        },
      ],
    });
  }
}

const myStack = new EventStack(app, 'aws-fargate-integ');

new integ.IntegTest(app, 'publicQueueProcessingFargateServiceTest', {
  testCases: [myStack],
});

app.synth();
