import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { ClusterSnapshoter } from './snapshoter';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-cluster-snapshot');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const sourceCluster = new rds.DatabaseCluster(stack, 'SourceCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  vpc,
});

const snapshotIdentifier = 'aws-cdk-rds-cluster-snapshot-integ-test';
const snapshoter = new ClusterSnapshoter(stack, 'ClusterSnapshoter', {
  cluster: sourceCluster,
  snapshotIdentifier,
});

const restoredCluster = new rds.DatabaseClusterFromSnapshot(stack, 'RestoredCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: rds.ClusterInstance.provisioned('writer', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  vpc,
  snapshotIdentifier,
  snapshotCredentials: rds.SnapshotCredentials.fromGeneratedSecret('admin'),
});
restoredCluster.node.addDependency(snapshoter);

restoredCluster.addRotationSingleUser();

new IntegTest(app, 'cluster-snapshot-integ-test', {
  testCases: [stack],
});

