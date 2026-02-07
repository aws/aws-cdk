import * as kms from 'aws-cdk-lib/aws-kms';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { DatabaseSecret, DatabaseCluster, DatabaseClusterEngine, Credentials, ClusterInstance, AuroraMysqlEngineVersion } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ-secret-rotation');

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

// @ts-ignore - cluster is used implicitly by secret rotation
const cluster = new DatabaseCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_11_1,
  }),
  credentials: Credentials.fromSecret(secret),
  storageEncryptionKey: kmsKey,
  vpc,
  serverlessV2MinCapacity: 0.5,
  serverlessV2MaxCapacity: 1,
  writer: ClusterInstance.serverlessV2('writer'),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});

secret.addRotationSchedule('test-schedule', {
  hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
});

new IntegTest(app, 'cdk-rds-integ-secret-rotation', {
  testCases: [stack],
});

app.synth();
