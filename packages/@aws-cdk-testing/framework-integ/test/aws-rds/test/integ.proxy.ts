import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import { RemovalPolicy } from 'aws-cdk-lib';
import * as integ from '@aws-cdk/integ-tests-alpha';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as rds from 'aws-cdk-lib/aws-rds';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-rds-proxy');

const vpc = new ec2.Vpc(stack, 'vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });
const kmsKey = new kms.Key(stack, 'SecretEncryptionKey');

const dbInstance = new rds.DatabaseInstance(stack, 'dbInstance', {
  engine: rds.DatabaseInstanceEngine.postgres({
    version: rds.PostgresEngineVersion.VER_16_3,
  }),
  instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  credentials: rds.Credentials.fromUsername('master', {
    encryptionKey: kmsKey,
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
  clientPasswordAuthType: rds.ClientPasswordAuthType.POSTGRES_SCRAM_SHA_256,
});

const cluster = new rds.DatabaseCluster(stack, 'dbCluster', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_5,
  }),
  instanceProps: { vpc },
});

// The `DatabaseProxy` internally adds a dependency so that the `TargetGroup` is created after the `DatabaseCluster` is created.
// In this test, we use `addProxy` to add two `DatabaseProxy` as a child of `DatabaseCluster`
// and verify that they can be deployed correctly without circular dependencies.
cluster.addProxy('Proxy', {
  secrets: [cluster.secret!],
  vpc,
});
cluster.addProxy('Proxy2', {
  secrets: [cluster.secret!],
  vpc,
});

// With `writer` and `readers` properties instead of the legacy `instanceProps`
const clusterWithWriterAndReaders = new rds.DatabaseCluster(stack, 'dbClusterWithWriterAndReaders', {
  engine: rds.DatabaseClusterEngine.auroraPostgres({
    version: rds.AuroraPostgresEngineVersion.VER_14_5,
  }),
  vpc,
  writer: rds.ClusterInstance.provisioned('writer'),
  readers: [rds.ClusterInstance.provisioned('reader')],
});

new rds.DatabaseProxy(stack, 'Proxy3', {
  proxyTarget: rds.ProxyTarget.fromCluster(clusterWithWriterAndReaders),
  secrets: [clusterWithWriterAndReaders.secret!],
  vpc,
});
clusterWithWriterAndReaders.addProxy('Proxy4', {
  secrets: [clusterWithWriterAndReaders.secret!],
  vpc,
});
clusterWithWriterAndReaders.addProxy('Proxy5', {
  secrets: [clusterWithWriterAndReaders.secret!],
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
