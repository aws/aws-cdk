import * as cdk from 'aws-cdk-lib/core';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { INTEG_TEST_LATEST_AURORA_MYSQL, INTEG_TEST_LATEST_AURORA_POSTGRES } from './db-versions';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();

const stack = new IntegTestBaseStack(app, 'EnableLocalWriteForwardingClusterStack');
const vpc = new ec2.Vpc(stack, 'VPC');

new rds.DatabaseCluster(stack, 'DatabaseCluster', {
  engine: rds.DatabaseClusterEngine.auroraMysql({ version: INTEG_TEST_LATEST_AURORA_MYSQL }),
  writer: rds.ClusterInstance.serverlessV2('writerInstance'),
  readers: [
    rds.ClusterInstance.serverlessV2('readerInstance1'),
  ],
  vpc,
  enableLocalWriteForwarding: true,
});

new rds.DatabaseCluster(stack, 'DatabaseClusterPostgresql', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: INTEG_TEST_LATEST_AURORA_POSTGRES }),
  writer: rds.ClusterInstance.serverlessV2('writerInstance'),
  readers: [
    rds.ClusterInstance.serverlessV2('readerInstance1'),
  ],
  vpc,
  enableLocalWriteForwarding: true,
});

new integ.IntegTest(app, 'EnableLocalWriteForwardingClusterStackInteg', {
  testCases: [stack],
});
