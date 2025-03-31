import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new App();
const stack = new Stack(app, 'cdk-instance-from-cluster-snapshot');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

// For simplicity, get a public snapshot
new rds.DatabaseInstanceFromSnapshot(stack, 'FromSnapshot', {
  clusterSnapshotIdentifier: 'arn:aws:rds:us-east-1:703671916075:cluster-snapshot:test-cluster-snpa',
  allocatedStorage: 200,
  engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_40 }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
});

new IntegTest(app, 'cdk-instance-from-cluster-snapshot-test', {
  testCases: [stack],
});
