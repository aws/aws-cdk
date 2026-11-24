import { ExpectedResult, IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Duration, Stack } from 'aws-cdk-lib';
import { FlowLogDestination, Vpc } from 'aws-cdk-lib/aws-ec2';
import { EC2_FLOW_LOGS_CLOUDWATCH_LOGS_PERMISSIONS_SCOPED } from 'aws-cdk-lib/cx-api';

const app = new App();
const stack = new Stack(app, 'VPCFlowLogsScopedPermissions');
stack.node.setContext(EC2_FLOW_LOGS_CLOUDWATCH_LOGS_PERMISSIONS_SCOPED, true);

const vpc = new Vpc(stack, 'VPC', { natGateways: 0 });
const flowLog = vpc.addFlowLog('CloudWatchLogs', {
  destination: FlowLogDestination.toCloudWatchLogs(),
});

const test = new IntegTest(app, 'FlowLogsScopedPermissions', {
  testCases: [stack],
});

test.assertions.awsApiCall('EC2', 'describeFlowLogs', {
  FlowLogIds: [flowLog.flowLogId],
}).assertAtPath('FlowLogs.0.DeliverLogsStatus', ExpectedResult.stringLikeRegexp('^SUCCESS$'))
  .waitForAssertions({
    interval: Duration.seconds(30),
    totalTimeout: Duration.minutes(10),
  });

app.synth();
