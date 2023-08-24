import * as path from 'path';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as events from 'aws-cdk-lib/aws-events';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

import { ScheduledFargateTask } from 'aws-cdk-lib/aws-ecs-patterns';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-runtime-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 1, restrictDefaultSecurityGroup: false });
const cluster = new ecs.Cluster(stack, 'FargateCluster', { vpc });

// Create the scheduled task
new ScheduledFargateTask(stack, 'ScheduledFargateTask', {
  cluster,
  scheduledFargateTaskImageOptions: {
    image: new ecs.AssetImage(path.join(__dirname, '..', 'demo-image')),
    memoryLimitMiB: 512,
    cpu: 256,
    environment: { TRIGGER: 'CloudWatch Events' },
    runtimePlatform: {
      cpuArchitecture: ecs.CpuArchitecture.X86_64,
      operatingSystemFamily: ecs.OperatingSystemFamily.LINUX,
    },
  },
  desiredTaskCount: 2,
  schedule: events.Schedule.rate(cdk.Duration.minutes(2)),
});

new IntegTest(app, 'Integ', { testCases: [stack] });

app.synth();
