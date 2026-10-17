import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { INTEG_TEST_LATEST_AURORA_MYSQL } from './db-versions';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration } from 'aws-cdk-lib';
import { ClusterInstance, DatabaseCluster, DatabaseClusterEngine } from 'aws-cdk-lib/aws-rds';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as iam from 'aws-cdk-lib/aws-iam';
import { IntegTestBaseStack } from './integ-test-base-stack';

const app = new App();
const stack = new IntegTestBaseStack(app, 'cluster-replication');

const vpc = new ec2.Vpc(stack, 'VPC', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const primaryCluster = new DatabaseCluster(stack, 'PrimaryDatabase', {
  vpc,
  engine: DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: ClusterInstance.provisioned('WriterInstance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  parameters: {
    binlog_format: 'ROW',
  },
});

const replicaCluster = new DatabaseCluster(stack, 'ReplicaDatabase', {
  vpc,
  engine: DatabaseClusterEngine.auroraMysql({
    version: INTEG_TEST_LATEST_AURORA_MYSQL,
  }),
  writer: ClusterInstance.provisioned('ReplicaInstance', {
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MEDIUM),
  }),
  replicationSourceIdentifier: primaryCluster.clusterArn,
});

replicaCluster.node.addDependency(primaryCluster.node.findChild('WriterInstance'));

// Add custom resource to promote replica before deletion, otherwise deletion will fail.
const promoteReplica = new cr.AwsCustomResource(stack, 'PromoteReplica', {
  onDelete: {
    service: 'RDS',
    action: 'promoteReadReplicaDBCluster',
    parameters: {
      DBClusterIdentifier: replicaCluster.clusterIdentifier,
    },
    ignoreErrorCodesMatching: 'InvalidDBClusterStateFault',
  },
  policy: cr.AwsCustomResourcePolicy.fromStatements([
    new iam.PolicyStatement({
      actions: ['rds:PromoteReadReplicaDBCluster'],
      resources: ['*'],
    }),
  ]),
  timeout: Duration.minutes(5),
});

promoteReplica.node.addDependency(replicaCluster);

const integTest = new IntegTest(app, 'cluster-replication-integ', {
  testCases: [stack],
});

integTest.assertions.awsApiCall('RDS', 'describeDBClusters', {
  DBClusterIdentifier: replicaCluster.clusterIdentifier,
}).assertAtPath(
  'DBClusters.0.ReplicationSourceIdentifier',
  ExpectedResult.stringLikeRegexp(primaryCluster.clusterArn),
);
