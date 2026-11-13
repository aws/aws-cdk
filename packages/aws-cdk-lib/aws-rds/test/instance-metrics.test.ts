import type * as cloudwatch from '../../aws-cloudwatch';
import * as ec2 from '../../aws-ec2';
import * as cdk from '../../core';
import * as rds from '../lib';
import { acknowledgeTestValidationRules } from './util';

let stack: cdk.Stack;

function createInstance(): rds.DatabaseInstance {
  return new rds.DatabaseInstance(stack, 'Instance', {
    engine: rds.DatabaseInstanceEngine.MYSQL,
    vpc: new ec2.Vpc(stack, 'VPC'),
  });
}

function importInstance(): rds.IDatabaseInstance {
  return rds.DatabaseInstance.fromDatabaseInstanceAttributes(stack, 'Imported', {
    instanceIdentifier: 'my-instance',
    instanceEndpointAddress: 'my-instance.example.com',
    port: 3306,
    securityGroups: [],
  });
}

function createCfnInstance(): rds.CfnDBInstance {
  return new rds.CfnDBInstance(stack, 'CfnInstance', {
    dbInstanceClass: 'db.t3.micro',
    engine: 'mysql',
  });
}

describe('DatabaseInstanceMetrics', () => {
  beforeEach(() => {
    stack = new cdk.Stack();
    acknowledgeTestValidationRules(stack);
  });

  test.each<[string, (metrics: rds.DatabaseInstanceMetrics) => cloudwatch.Metric]>([
    ['CPUUtilization', (metrics) => metrics.cpuUtilization()],
    ['DatabaseConnections', (metrics) => metrics.databaseConnections()],
    ['FreeStorageSpace', (metrics) => metrics.freeStorageSpace()],
    ['FreeableMemory', (metrics) => metrics.freeableMemory()],
    ['ReadIOPS', (metrics) => metrics.readIOPS()],
    ['WriteIOPS', (metrics) => metrics.writeIOPS()],
    ['NetworkReceiveThroughput', (metrics) => metrics.networkReceiveThroughput()],
    ['NetworkTransmitThroughput', (metrics) => metrics.networkTransmitThroughput()],
    ['ReadLatency', (metrics) => metrics.readLatency()],
    ['WriteLatency', (metrics) => metrics.writeLatency()],
    ['ReadThroughput', (metrics) => metrics.readThroughput()],
    ['WriteThroughput', (metrics) => metrics.writeThroughput()],
    ['SwapUsage', (metrics) => metrics.swapUsage()],
    ['DiskQueueDepth', (metrics) => metrics.diskQueueDepth()],
    ['BurstBalance', (metrics) => metrics.burstBalance()],
    ['ReplicaLag', (metrics) => metrics.replicaLag()],
  ])('%s helper defaults to the average over 5 minutes', (metricName, getMetric) => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(importInstance());

    // THEN
    expect(stack.resolve(getMetric(metrics))).toEqual({
      dimensions: { DBInstanceIdentifier: 'my-instance' },
      namespace: 'AWS/RDS',
      metricName,
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    });
  });

  test('works with a DatabaseInstance', () => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(createInstance());

    // THEN
    expect(stack.resolve(metrics.replicaLag().dimensions)).toEqual({
      DBInstanceIdentifier: { Ref: 'InstanceC1063A87' },
    });
  });

  test('works with an imported instance', () => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(importInstance());

    // THEN
    expect(stack.resolve(metrics.replicaLag().dimensions)).toEqual({
      DBInstanceIdentifier: 'my-instance',
    });
  });

  test('works with a CfnDBInstance', () => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(createCfnInstance());

    // THEN
    expect(stack.resolve(metrics.replicaLag().dimensions)).toEqual({
      DBInstanceIdentifier: { Ref: 'CfnInstance' },
    });
  });

  test('helpers honor props overrides', () => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(importInstance());

    // THEN
    expect(stack.resolve(metrics.cpuUtilization({
      statistic: 'Maximum',
      period: cdk.Duration.minutes(1),
    }))).toEqual({
      dimensions: { DBInstanceIdentifier: 'my-instance' },
      namespace: 'AWS/RDS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(1),
      statistic: 'Maximum',
    });
  });

  test('can create any other named metric', () => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(importInstance());

    // THEN
    expect(stack.resolve(metrics.metric('BinLogDiskUsage', { statistic: 'Maximum' }))).toEqual({
      dimensions: { DBInstanceIdentifier: 'my-instance' },
      namespace: 'AWS/RDS',
      metricName: 'BinLogDiskUsage',
      period: cdk.Duration.minutes(5),
      statistic: 'Maximum',
    });
  });

  test('dimensionsMap replaces the default dimension', () => {
    // WHEN
    const metrics = rds.DatabaseInstanceMetrics.fromDatabaseInstance(importInstance());

    // THEN
    expect(stack.resolve(metrics.metric('CPUUtilization', {
      dimensionsMap: { DBInstanceClass: 'db.t3.micro' },
    }))).toEqual({
      dimensions: { DBInstanceClass: 'db.t3.micro' },
      namespace: 'AWS/RDS',
      metricName: 'CPUUtilization',
      period: cdk.Duration.minutes(5),
      statistic: 'Average',
    });
  });

  test('metrics are attached to the environment of the instance', () => {
    // GIVEN
    const env = { account: '123456789012', region: 'us-east-1' };
    stack = new cdk.Stack(undefined, 'Stack', { env });

    // WHEN
    const metric = rds.DatabaseInstanceMetrics.fromDatabaseInstance(createCfnInstance()).replicaLag();

    // THEN
    expect(metric.account).toEqual(env.account);
    expect(metric.region).toEqual(env.region);
  });
});
