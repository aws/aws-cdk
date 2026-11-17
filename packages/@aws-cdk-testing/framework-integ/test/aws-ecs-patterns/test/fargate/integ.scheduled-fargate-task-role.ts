import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();

class EventStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
    const cluster = new ecs.Cluster(this, 'FargateCluster', { vpc });

    const taskRole = new iam.Role(this, 'TaskRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
    });

    // Create the scheduled task using an existing IAM role
    new ScheduledFargateTask(this, 'ScheduledFargateTask', {
      cluster,
      scheduledFargateTaskImageOptions: {
        image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
        memoryLimitMiB: 512,
        cpu: 256,
        environment: { TRIGGER: 'CloudWatch Events' },
      },
      desiredTaskCount: 1,
      schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
      role: taskRole,
    });
  }
}

const myStack = new EventStack(app, 'aws-fargate-scheduled-task-role-integ');

new integ.IntegTest(app, 'scheduledFargateTaskRoleTest', {
  testCases: [myStack],
});

app.synth();
