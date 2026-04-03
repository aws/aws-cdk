import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as logs from 'aws-cdk-lib/aws-logs';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-instance-with-metric', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  vpc,
  multiAz: false,
  publiclyAccessible: true,
  iamAuthentication: true,
  cloudwatchLogsExports: ['postgresql'],
  cloudwatchLogsRetention: logs.RetentionDays.THREE_MONTHS,
});

new logs.MetricFilter(stack, 'MetricFilter', {
  logGroup: instance.cloudwatchLogGroups.postgresql,
  filterPattern: logs.FilterPattern.anyTerm('ERROR', 'Caused by', 'error'),
  metricName: 'integ-test-rds-instance-metric',
  metricNamespace: 'integ-test-rds',
  defaultValue: 0,
  metricValue: '1',
});

new IntegTest(app, 'rds-instance-with-metric-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
