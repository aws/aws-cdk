import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { IntegTestBaseStack } from './integ-test-base-stack';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as rds from 'aws-cdk-lib/aws-rds';
import { INTEG_TEST_LATEST_POSTGRES } from './db-versions';

// Enable the feature flag so the auto-derived proxy name is lowercased to match
// what RDS actually creates. See https://github.com/aws/aws-cdk/pull/38279.
const app = new cdk.App({
  context: {
    '@aws-cdk/aws-rds:databaseProxyLowercaseDerivedName': true,
  },
});
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-proxy-lowercase-derived-name');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const dbInstance = new rds.DatabaseInstance(stack, 'dbInstance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: INTEG_TEST_LATEST_POSTGRES,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  credentials: rds.Credentials.fromUsername('master', {
    excludeCharacters: '"@/\\',
  }),
  storageEncrypted: true,
  vpc,
});

// The construct id contains uppercase characters and no explicit `dbProxyName` is
// provided, so the derived name is lowercased ('myproxy') to match the resource RDS
// deploys. Without the flag this would submit 'MyProxy' and `dbProxyName` would then
// not match the actual (lowercased) resource.
new rds.DatabaseProxy(stack, 'MyProxy', {
  secrets: [dbInstance.secret!],
  proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
  vpc,
});

new integ.IntegTest(app, 'database-proxy-lowercase-derived-name-integ-test', {
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
