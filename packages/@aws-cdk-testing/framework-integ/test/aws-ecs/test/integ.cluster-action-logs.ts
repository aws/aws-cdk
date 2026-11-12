import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-ecs-cluster-action-logs-integ');

const vpc = new ec2.Vpc(stack, 'Vpc', { maxAzs: 2, restrictDefaultSecurityGroup: false });

const cluster = new ecs.Cluster(stack, 'Cluster', {
  vpc,
  actionLogs: {
    destination: ecs.ActionLogsDestination.toCloudWatchLogs(),
  },
});

const integ = new IntegTest(app, 'ClusterActionLogsInteg', {
  testCases: [stack],
});

// Assert the auto-created log group exists with the expected name
integ.assertions.awsApiCall('CloudWatchLogs', 'describeLogGroups', {
  logGroupNamePrefix: `/aws/vendedlogs/ecs/action-logs/${cluster.clusterName}`,
}).expect(ExpectedResult.objectLike({
  logGroups: [{ logGroupName: `/aws/vendedlogs/ecs/action-logs/${cluster.clusterName}` }],
}));

app.synth();
