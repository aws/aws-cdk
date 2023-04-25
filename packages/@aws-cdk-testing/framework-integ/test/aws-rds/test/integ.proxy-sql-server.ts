import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib/core';
import { RemovalPolicy } from 'aws-cdk-lib/core';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';
import { LicenseModel, SqlServerEngineVersion } from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy-sql-server', {
  terminationProtection: false,
});

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

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
  cdkCommandOptions: {
    deploy: {
      args: {
        rollback: true,
      },
    },
  },
});
