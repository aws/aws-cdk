import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy-mariadb');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const kmsKey = new kms.Key(stack, 'SecretEncryptionKey');

const mariaDBInstance = new rds.DatabaseInstance(stack, 'mariaDBInstance', {
  engine: rds.DatabaseInstanceEngine.mariaDb({
    version: rds.MariaDbEngineVersion.VER_10_6_16,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  credentials: rds.Credentials.fromUsername('master', {
    encryptionKey: kmsKey,
    excludeCharacters: '"@/\\',
  }),
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
});

new rds.DatabaseProxy(stack, 'mariaDBProxy', {
  borrowTimeout: cdk.Duration.seconds(30),
  maxConnectionsPercent: 50,
  secrets: [mariaDBInstance.secret!],
  proxyTarget: rds.ProxyTarget.fromInstance(mariaDBInstance),
  vpc,
});

new integ.IntegTest(app, 'database-proxy-mariadb-integ-test', {
  testCases: [stack],
  diffAssets: true,
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
