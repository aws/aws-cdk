import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
import { RemovalPolicy } from '@aws-cdk/core';
import { IntegTest } from '@aws-cdk/integ-tests';
import * as rds from '../lib';
import { LicenseModel, SqlServerEngineVersion } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy-sql-server');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2 });

const dbInstance = new rds.DatabaseInstance(stack, 'SqlServerDbInstance', {
  engine: rds.DatabaseInstanceEngine.sqlServerEx({
    version: SqlServerEngineVersion.VER_15,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.SMALL),
  credentials: rds.Credentials.fromUsername('master', {
    excludeCharacters: '"@/\\',
  }),
  vpc,
  licenseModel: LicenseModel.LICENSE_INCLUDED,
  removalPolicy: RemovalPolicy.DESTROY,
});

const proxy = new rds.DatabaseProxy(stack, 'DbProxy', {
  borrowTimeout: cdk.Duration.seconds(30),
  maxConnectionsPercent: 50,
  secrets: [dbInstance.secret!],
  proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
  vpc,
  iamAuth: true,
});

const role = new iam.Role(stack, 'SqlProxyRole', {
  assumedBy: new iam.AccountPrincipal(stack.account),
});
proxy.grantConnect(role, 'master');

new IntegTest(app, 'proxy-sql-server-integ-test', {
  testCases: [stack],
});
