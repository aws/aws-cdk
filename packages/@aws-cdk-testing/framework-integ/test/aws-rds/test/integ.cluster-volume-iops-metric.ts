import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, Credentials, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-cluster-volume-iops-metric');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_10_0,
  }),
  credentials: Credentials.fromUsername('admin', { password: cdk.SecretValue.unsafePlainText('7959866cacc02c2d243ecfe177464fe6') }),
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
  vpc,
  writer: ClusterInstance.provisioned('Instance1', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  readers: [
    ClusterInstance.provisioned('Instance2', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
    }),
  ],
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

// Test that metricVolumeReadIOPs can be used to create an alarm
cluster.metricVolumeReadIOPs({
  period: cdk.Duration.minutes(10),
}).createAlarm(stack, 'VolumeReadIOPsAlarm', {
  threshold: 1000,
  evaluationPeriods: 3,
});

// Test that metricVolumeWriteIOPs can be used to create an alarm
cluster.metricVolumeWriteIOPs({
  period: cdk.Duration.minutes(10),
}).createAlarm(stack, 'VolumeWriteIOPsAlarm', {
  threshold: 1000,
  evaluationPeriods: 3,
});

new IntegTest(app, 'rds-cluster-volume-iops-metric-integ-test', {
  testCases: [stack],
});
