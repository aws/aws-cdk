import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { INTEG_TEST_LATEST_AURORA_POSTGRES } from './db-versions';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-cluster-master-user-iam-auth');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({ version: INTEG_TEST_LATEST_AURORA_POSTGRES }),
  vpc,
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  iamAuthentication: true,
  masterUserAuthenticationType: rds.MasterUserAuthenticationType.IAM,
  storageEncrypted: true,
});

new IntegTest(app, 'cluster-master-user-iam-auth-integ-test', {
  testCases: [stack],
});
