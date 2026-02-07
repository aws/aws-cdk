import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import {
  AuroraMysqlEngineVersion,
  ClusterInstance,
  DatabaseCluster,
  DatabaseClusterEngine,
} from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-volume-iops-metric');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new DatabaseCluster(stack, 'Cluster', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_11_1,
  }),
  vpc,
  writer: ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

new cloudwatch.Alarm(stack, 'ReadIOPSAlarm', {
  metric: cluster.metricVolumeReadIOPs(),
  threshold: 1000,
  evaluationPeriods: 1,
});

new cloudwatch.Alarm(stack, 'WriteIOPSAlarm', {
  metric: cluster.metricVolumeWriteIOPs(),
  threshold: 1000,
  evaluationPeriods: 1,
});

new IntegTest(app, 'cluster-volume-iops-metric-integ-test', {
  testCases: [stack],
});

app.synth();
