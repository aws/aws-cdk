import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-instance-metrics');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

const instance = new rds.DatabaseInstance(stack, 'Instance', {
  engine: rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES }),
  vpc,
  multiAz: false,
});

// Exercise every metric helper by creating an alarm from it. The thresholds below
// are placeholders - the goal is to verify that each helper synthesizes a valid
// metric that can be wired into a CloudWatch alarm.
const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(instance);
const period = cdk.Duration.minutes(10);

metrics.cpuUtilization({ period }).createAlarm(stack, 'CPUUtilizationAlarm', {
  threshold: 80,
  evaluationPeriods: 3,
});

metrics.databaseConnections({ period }).createAlarm(stack, 'DatabaseConnectionsAlarm', {
  threshold: 100,
  evaluationPeriods: 3,
});

metrics.freeStorageSpace({ period }).createAlarm(stack, 'FreeStorageSpaceAlarm', {
  threshold: 1_000_000_000,
  evaluationPeriods: 3,
  comparisonOperator: cdk.aws_cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

metrics.freeableMemory({ period }).createAlarm(stack, 'FreeableMemoryAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
  comparisonOperator: cdk.aws_cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

metrics.networkReceiveThroughput({ period }).createAlarm(stack, 'NetworkReceiveThroughputAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
});

metrics.networkTransmitThroughput({ period }).createAlarm(stack, 'NetworkTransmitThroughputAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
});

metrics.readLatency({ period }).createAlarm(stack, 'ReadLatencyAlarm', {
  threshold: 1,
  evaluationPeriods: 3,
});

metrics.writeLatency({ period }).createAlarm(stack, 'WriteLatencyAlarm', {
  threshold: 1,
  evaluationPeriods: 3,
});

metrics.readThroughput({ period }).createAlarm(stack, 'ReadThroughputAlarm', {
  threshold: 10_000_000,
  evaluationPeriods: 3,
});

metrics.writeThroughput({ period }).createAlarm(stack, 'WriteThroughputAlarm', {
  threshold: 10_000_000,
  evaluationPeriods: 3,
});

metrics.swapUsage({ period }).createAlarm(stack, 'SwapUsageAlarm', {
  threshold: 100_000_000,
  evaluationPeriods: 3,
});

metrics.diskQueueDepth({ period }).createAlarm(stack, 'DiskQueueDepthAlarm', {
  threshold: 10,
  evaluationPeriods: 3,
});

metrics.burstBalance({ period }).createAlarm(stack, 'BurstBalanceAlarm', {
  threshold: 10,
  evaluationPeriods: 3,
  comparisonOperator: cdk.aws_cloudwatch.ComparisonOperator.LESS_THAN_THRESHOLD,
});

metrics.replicaLag({ period }).createAlarm(stack, 'ReplicaLagAlarm', {
  threshold: 60,
  evaluationPeriods: 3,
});

metrics.readIOPS({ period }).createAlarm(stack, 'ReadIOPSAlarm', {
  threshold: 1000,
  evaluationPeriods: 3,
});

metrics.writeIOPS({ period }).createAlarm(stack, 'WriteIOPSAlarm', {
  threshold: 1000,
  evaluationPeriods: 3,
});

new IntegTest(app, 'rds-instance-metrics-integ-test', {
  testCases: [stack],
});
