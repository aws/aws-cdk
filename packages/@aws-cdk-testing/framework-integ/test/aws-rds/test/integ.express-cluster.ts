import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as logs from 'aws-cdk-lib/aws-logs';
import { DBClusterStorageType, ExpressCluster } from 'aws-cdk-lib/aws-rds';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new cdk.App();
const stack = new IntegTestBaseStack(app, 'aws-cdk-rds-express-cluster');

const cluster = new ExpressCluster(stack, 'Cluster', {
  masterUsername: 'appadmin',
  backup: { retention: cdk.Duration.days(7), preferredWindow: '18:00-19:00' },
  preferredMaintenanceWindow: 'Sun:20:00-Sun:21:00',
  serverlessV2MinCapacity: 0,
  serverlessV2MaxCapacity: 4,
  serverlessV2AutoPauseDuration: cdk.Duration.minutes(10),
  storageType: DBClusterStorageType.AURORA_IOPT1,
  cloudwatchLogsExports: ['postgresql'],
  cloudwatchLogsRetention: logs.RetentionDays.ONE_DAY,
  performanceInsightEncryptionKey: new kms.Key(stack, 'PerformanceInsightsKey', {
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  }),
  removalPolicy: cdk.RemovalPolicy.DESTROY,
});
// Creating a cluster with express configuration through CloudFormation currently requires at least one tag
cdk.Tags.of(cluster).add('integ-test', 'express-cluster');

const role = new iam.Role(stack, 'ConnectRole', {
  assumedBy: new iam.AccountRootPrincipal(),
});
cluster.grantConnect(role, 'appadmin');

const integ = new IntegTest(app, 'ExpressClusterInteg', {
  testCases: [stack],
});

integ.assertions.awsApiCall('RDS', 'describeDBClusters', {
  DBClusterIdentifier: cluster.clusterIdentifier,
}).expect(ExpectedResult.objectLike({
  DBClusters: [{
    Engine: 'aurora-postgresql',
    MasterUsername: 'appadmin',
    IAMDatabaseAuthenticationEnabled: true,
    BackupRetentionPeriod: 7,
    StorageType: 'aurora-iopt1',
    EnabledCloudwatchLogsExports: ['postgresql'],
    PerformanceInsightsEnabled: true,
    ServerlessV2ScalingConfiguration: {
      MinCapacity: 0,
      MaxCapacity: 4,
      SecondsUntilAutoPause: 600,
    },
  }],
}));

integ.assertions.awsApiCall('RDS', 'describeDBInstances', {
  Filters: [{ Name: 'db-cluster-id', Values: [cluster.clusterIdentifier] }],
}).expect(ExpectedResult.objectLike({
  DBInstances: [{
    DBInstanceClass: 'db.serverless',
    Engine: 'aurora-postgresql',
  }],
}));
