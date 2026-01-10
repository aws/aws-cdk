import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-instance-iops-metric', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_16 }),
  vpc,
  multiAz: false,
  publiclyAccessible: true,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test that metricReadIOPS can be used to create an alarm
instance.metricReadIOPS({
  period: cdk.Duration.minutes(10),
}).createAlarm(stack, 'ReadIOPSAlarm', {
  threshold: 1000,
  evaluationPeriods: 3,
});

// Test that metricWriteIOPS can be used to create an alarm
instance.metricWriteIOPS({
  period: cdk.Duration.minutes(10),
}).createAlarm(stack, 'WriteIOPSAlarm', {
  threshold: 1000,
  evaluationPeriods: 3,
});

new IntegTest(app, 'rds-instance-iops-metric-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
