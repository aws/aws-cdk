import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as cdk from 'aws-cdk-lib';
import * as rds from 'aws-cdk-lib/aws-rds';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-rds-integ-secret-rotation');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false, natGateways: 1 });

const kmsKey = new kms.Key(stack, 'DbSecurity', {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

const secret = new secretsmanager.Secret(stack, 'Secret', {
  generateSecretString: {
    secretStringTemplate: JSON.stringify({ username: 'admin' }),
    generateStringKey: 'password',
    excludeCharacters: '"@/\\',
  },
  encryptionKey: kmsKey,
});

// Migrate from ServerlessCluster to DatabaseCluster with serverlessV2
const cluster = new rds.DatabaseCluster(stack, 'Database', {
  engine: rds.DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: rds.ClusterInstance.serverlessV2('writer'),
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  credentials: rds.Credentials.fromSecret(secret),
  storageEncryptionKey: kmsKey,
  vpc,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

cluster.addRotationSingleUser();

new IntegTest(app, 'integ-test', {
  testCases: [stack],
});
