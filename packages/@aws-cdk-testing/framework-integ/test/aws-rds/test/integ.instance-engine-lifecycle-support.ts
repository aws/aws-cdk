import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { InstanceSnapshoter } from './snapshoter';

const app = new App({
  postCliContext: {
    '@aws-cdk/aws-lambda:createNewPoliciesWithAddToRolePolicy': true,
    '@aws-cdk/aws-lambda:useCdkManagedLogGroup': false,
  },
});

const stack = new Stack(app, 'cdk-instance-engine-lifecycle-support');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, natGateways: 1, restrictDefaultSecurityGroup: false });

const engine = rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_4_5 });
const instanceType = ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL);

const sourceInstance = new rds.DatabaseInstance(stack, 'Instance', {
  engine,
  instanceType,
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
  engineLifecycleSupport: rds.EngineLifecycleSupport.OPEN_SOURCE_RDS_EXTENDED_SUPPORT,
});

const snapshoter = new InstanceSnapshoter(stack, 'Snapshoter', {
  instance: sourceInstance,
  snapshotIdentifier: 'cdk-instance-engine-lifecycle-support-snapshot',
});

const restoredInstance = new rds.DatabaseInstanceFromSnapshot(stack, 'FromSnapshot', {
  snapshotIdentifier: snapshoter.snapshotArn,
  engine,
  instanceType,
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
  engineLifecycleSupport: rds.EngineLifecycleSupport.OPEN_SOURCE_RDS_EXTENDED_SUPPORT_DISABLED,
});

new rds.DatabaseInstanceReadReplica(stack, 'ReadReplica', {
  sourceDatabaseInstance: restoredInstance,
  instanceType,
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
  engineLifecycleSupport: rds.EngineLifecycleSupport.OPEN_SOURCE_RDS_EXTENDED_SUPPORT_DISABLED,
});

new IntegTest(app, 'cdk-instance-engine-lifecycle-support-test', {
  testCases: [stack],
});
