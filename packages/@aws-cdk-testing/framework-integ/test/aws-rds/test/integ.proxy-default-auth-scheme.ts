import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-proxy');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const dbInstance = new rds.DatabaseInstance(stack, 'dbInstance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: INTEG_TEST_LATEST_POSTGRES,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  vpc,
  iamAuthentication: true,
});

const proxy = new rds.DatabaseProxy(stack, 'dbProxy', {
  borrowTimeout: cdk.Duration.seconds(30),
  maxConnectionsPercent: 50,
  proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
  vpc,
  defaultAuthScheme: rds.DefaultAuthScheme.IAM_AUTH,
});

// Grant IAM permissions for database connection
const role = new iam.Role(stack, 'DBRole', { assumedBy: new iam.AccountPrincipal(stack.account) });
proxy.grantConnect(role, 'database-user');

new integ.IntegTest(app, 'database-proxy-default-auth-scheme-integ-test', {
  testCases: [stack],
});
