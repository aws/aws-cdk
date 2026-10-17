import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_MYSQL } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new IntegTestBaseStack(app, 'cdk-rds-read-replica-with-allocated-storage');

const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const sourceInstance = new rds.DatabaseInstance(stack, 'SourceInstance', {
  engine: rds.DatabaseInstanceEngine.mysql({
    version: INTEG_TEST_LATEST_MYSQL,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  vpc,
});

new rds.DatabaseInstanceReadReplica(stack, 'ReadReplica', {
  sourceDatabaseInstance: sourceInstance,
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  vpc,
  allocatedStorage: 500,
});

new integ.IntegTest(app, 'aws-cdk-rds-read-replica-with-allocated-storage-test', {
  testCases: [stack],
});
