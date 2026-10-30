import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-instance-metrics');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  vpc,
  multiAz: false,
});

// Exercise every new instance-level metric helper by creating an alarm from it.
// The thresholds below are placeholders - the goal is to verify that each
// helper synthesizes a valid metric that can be wired into a CloudWatch alarm.
const period = cdk.Duration.minutes(10);

instance.metricCPUUtilization({ period }).createAlarm(stack, 'CPUUtilizationAlarm', {
  threshold: 80,
  evaluationPeriods: 3,
});

instance.metricDatabaseConnections({ period }).createAlarm(stack, 'DatabaseConnectionsAlarm', {
  threshold: 100,
  evaluationPeriods: 3,
});

instance.metricFreeStorageSpace({ period }).createAlarm(stack, 'FreeStorageSpaceAlarm', {
  threshold: 1_000_000_000,
  evaluationPeriods: 3,
  comparisonOperator: cdk.aws_cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

instance.metricFreeableMemory({ period }).createAlarm(stack, 'FreeableMemoryAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
  comparisonOperator: cdk.aws_cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

instance.metricNetworkReceiveThroughput({ period }).createAlarm(stack, 'NetworkReceiveThroughputAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
});

instance.metricNetworkTransmitThroughput({ period }).createAlarm(stack, 'NetworkTransmitThroughputAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
});

instance.metricReadLatency({ period }).createAlarm(stack, 'ReadLatencyAlarm', {
  threshold: 1,
  evaluationPeriods: 3,
});

instance.metricWriteLatency({ period }).createAlarm(stack, 'WriteLatencyAlarm', {
  threshold: 1,
  evaluationPeriods: 3,
});

instance.metricReadThroughput({ period }).createAlarm(stack, 'ReadThroughputAlarm', {
  threshold: 10_000_000,
  evaluationPeriods: 3,
});

instance.metricWriteThroughput({ period }).createAlarm(stack, 'WriteThroughputAlarm', {
  threshold: 10_000_000,
  evaluationPeriods: 3,
});

instance.metricSwapUsage({ period }).createAlarm(stack, 'SwapUsageAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
});

instance.metricDiskQueueDepth({ period }).createAlarm(stack, 'DiskQueueDepthAlarm', {
  threshold: 10,
  evaluationPeriods: 3,
});

instance.metricBurstBalance({ period }).createAlarm(stack, 'BurstBalanceAlarm', {
  threshold: 10,
  evaluationPeriods: 3,
  comparisonOperator: cdk.aws_cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

instance.metricReplicaLag({ period }).createAlarm(stack, 'ReplicaLagAlarm', {
  threshold: 60,
  evaluationPeriods: 3,
});

new IntegTest(app, 'rds-instance-metrics-integ-test', {
  testCases: [stack],
});
