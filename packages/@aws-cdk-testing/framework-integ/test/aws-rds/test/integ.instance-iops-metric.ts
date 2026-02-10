import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-instance-iops-metric');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  vpc,
  multiAz: false,
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
});
