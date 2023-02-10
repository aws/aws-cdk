import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { RemovalPolicy } from '@aws-cdk/core';
import * as integ from '@aws-cdk/integ-tests';
import * as rds from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2 });

const dbInstance = new rds.DatabaseInstance(stack, 'dbInstance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_11_15,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  credentials: rds.Credentials.fromUsername('master', {
    excludeCharacters: '"@/\\',
  }),
  vpc,
  removalPolicy: RemovalPolicy.DESTROY,
});

new rds.DatabaseProxy(stack, 'dbProxy', {
  borrowTimeout: cdk.Duration.seconds(30),
  maxConnectionsPercent: 50,
  secrets: [dbInstance.secret!],
  proxyTarget: rds.ProxyTarget.fromInstance(dbInstance),
  vpc,
});

const cluster = new rds.DatabaseCluster(stack, 'dbCluster', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_5,
  }),
  instanceProps: { vpc },
});

new rds.DatabaseProxy(stack, 'Proxy', {
  dbProxyName: 'cluster-db-proxy',
  proxyTarget: rds.ProxyTarget.fromCluster(cluster),
  secrets: [cluster.secret!],
  vpc,
});

new integ.IntegTest(app, 'database-proxy-integ-test', {
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
