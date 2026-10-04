import * as kms from 'aws-cdk-lib/aws-kms';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DatabaseSecret, DatabaseCluster, DatabaseClusterEngine, Credentials, ClusterInstance } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-integ-secret-rotation');

// Create VPC instead of looking up default VPC
const vpc = new ec2.Vpc(stack, 'Vpc', {
  maxAzs: 2,
  restrictDefaultSecurityGroup: false,
});

const kmsKey = new kms.Key(stack, 'DbSecurity');

const secret = new DatabaseSecret(stack, 'test-secret', {
  username: 'admin',
  dbname: 'admindb',
  secretName: 'admin-secret',
});

new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  credentials: Credentials.fromSecret(secret),
  storageEncryptionKey: kmsKey,
  vpc,
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  writer: ClusterInstance.serverlessV2('writer'),
});

secret.addRotationSchedule('test-schedule', {
  hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
});

new IntegTest(app, 'cdk-rds-integ-secret-rotation', {
  testCases: [stack],
});

