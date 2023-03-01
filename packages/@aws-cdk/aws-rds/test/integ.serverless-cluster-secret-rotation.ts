import * as iam from '@aws-cdk/aws-iam';
import * as kms from '@aws-cdk/aws-kms';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import { Credentials, ServerlessCluster, DatabaseClusterEngine, DatabaseSecret } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-integ-secret-rotation');

const kmsKey = new kms.Key(stack, 'DbSecurity');
const secret = new DatabaseSecret(stack, 'test-secret', {
  username: 'admin',
});

const cluster = new ServerlessCluster(stack, 'Database', {
  engine: DatabaseClusterEngine.AURORA_MYSQL,
  credentials: Credentials.fromSecret(secret),
  storageEncryptionKey: kmsKey,
});

secret.addRotationSchedule('test-schedule', {
  hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
});

cluster.grantDataApiAccess(new iam.AccountRootPrincipal());
cluster.grantDataApiAccess(new iam.ServicePrincipal('ecs-tasks.amazonaws.com'));

new IntegTest(app, 'cdk-rds-integ-secret-rotation', {
  testCases: [stack],
});

app.synth();
