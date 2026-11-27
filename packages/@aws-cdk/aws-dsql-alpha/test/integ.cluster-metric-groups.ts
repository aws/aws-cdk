import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import { Cluster, MetricGroup } from '../lib';

const app = new cdk.App();

const stack = new cdk.Stack(app, 'aws-cdk-dsql-metric-groups-stack');

new Cluster(stack, 'Database', {
  deletionProtection: false,
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  metricGroups: [MetricGroup.STATEMENT_STATISTICS],
});

new IntegTest(app, 'aws-cdk-dsql-metric-groups-integ', {
  testCases: [stack],
});
