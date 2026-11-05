import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { getNthLatestVersion, INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-instance-with-rds-custom-version-replica', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const pastPgEngine = rds.DatabaseInstanceEngine.postgres({ version: getNthLatestVersion(2, rds.PostgresEngineVersion) });
const instanceType = ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL);

const sourceInstance = new rds.DatabaseInstance(stack, 'Instance', {
  instanceType: instanceType,
  engine: pastPgEngine,
  vpc,
});

const latestPgEngine = rds.DatabaseInstanceEngine.postgres({ version: INTEG_TEST_LATEST_POSTGRES });

new rds.DatabaseInstanceReadReplica(stack, 'InstanceReplica', {
  instanceType: instanceType,
  vpc: vpc,
  sourceDatabaseInstance: sourceInstance,
  engineVersion: latestPgEngine.engineVersion,
});

new IntegTest(app, 'rds-instance-with-custom-version-replica-integ-test', {
  testCases: [stack],
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
