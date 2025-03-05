import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, RemovalPolicy, Stack } from 'aws-cdk-lib';
import { AuroraMysqlEngineVersion, ClusterInstance, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';

const app = new App();
const stack = new Stack(app, 'cluster-replication');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const primaryCluster = new DatabaseCluster(stack, 'PrimaryDatabase', {
  vpc,
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_07_1,
  }),
  writer: ClusterInstance.provisioned('WriterInstance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  parameters: {
    binlog_format: 'ROW',
  },
  removalPolicy: RemovalPolicy.DESTROY,
});

const replicaCluster = new DatabaseCluster(stack, 'ReplicaDatabase', {
  vpc,
  engine: DatabaseClusterEngine.auroraMysql({
    version: AuroraMysqlEngineVersion.VER_3_07_1,
  }),
  writer: ClusterInstance.provisioned('ReplicaInstance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  replicationSourceIdentifier: primaryCluster.clusterArn,
  removalPolicy: RemovalPolicy.DESTROY,
});

replicaCluster.node.addDependency(primaryCluster.node.findChild('WriterInstance'));

const integTest = new IntegTest(app, 'cluster-replication-integ', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('RDS', 'describeDBClusters', {
  DBClusterIdentifier: replicaCluster.clusterIdentifier,
}).assertAtPath(
  'DBClusters.0.ReplicationSourceIdentifier',
  ExpectedResult.stringLikeRegexp(primaryCluster.clusterArn),
);
