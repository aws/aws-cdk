import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ScheduledEc2Task } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App({
  postCliContext: {
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
    '@aws-cdk/aws-ecs:enableImdsBlockingDeprecatedFeature': false,
    '@aws-cdk/aws-ecs:disableEcsImdsBlocking': false,
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': false,
  },
});

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });

    const cluster = new ecs.Cluster(this, 'EcsCluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
    });

    /// !show
    // Create the scheduled task
    new ScheduledEc2Task(this, 'ScheduledEc2Task', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        memoryLimitMiB: 512,
        cpu: 1,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      tags: [
        {
          key: 'my-tag',
          value: 'my-tag-value',
        },
      ],
    });

    // New Scheduled Task with custom container name
    new ScheduledEc2Task(this, 'ScheduledEc2Task2', {
      cluster,
      scheduledEc2TaskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        containerName: 'differentName',
        memoryLimitMiB: 512,
        cpu: 1,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 2,
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      propagateTags: ecs.PropagatedTagSource.TASK_DEFINITION,
      tags: [
        {
          key: 'my-tag',
          value: 'my-tag-value',
        },
      ],
    });
    /// !hide
  }
}

const myStack = new EventStack(app, 'aws-ecs-integ-ecs');

new integ.IntegTest(app, 'scheduledEc2TaskTest', {
  testCases: [myStack],
});

app.synth();
