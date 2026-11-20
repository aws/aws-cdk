import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Cluster, MetricGroup } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-dsql-metric-groups-stack');

const cluster = new Cluster(stack, 'Database', {
  deletionProtection: false,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  metricGroups: [MetricGroup.STATEMENT_STATISTICS],
});

const integ = new IntegTest(app, 'aws-cdk-dsql-metric-groups-integ', {
  testCases: [stack],
});

integ.assertions.awsApiCall('DSQL', 'getCluster', {
  identifier: cluster.clusterIdentifier,
}).expect(ExpectedResult.objectLike({
  metricGroups: [{ metricGroup: 'STATEMENT_STATISTICS' }],
}));
