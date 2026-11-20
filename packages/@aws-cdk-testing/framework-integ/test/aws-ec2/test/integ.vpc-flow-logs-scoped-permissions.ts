import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { FlowLogDestination, Vpc } from 'aws-cdk-lib/aws-ec2';
import { EC2_FLOW_LOGS_CLOUDWATCH_LOGS_PERMISSIONS_SCOPED } from 'aws-cdk-lib/cx-api';

const app = new App();
const stack = new Stack(app, 'VPCFlowLogsScopedPermissions');
stack.node.setContext(EC2_FLOW_LOGS_CLOUDWATCH_LOGS_PERMISSIONS_SCOPED, true);

const vpc = new Vpc(stack, 'VPC', { natGateways: 0 });
vpc.addFlowLog('CloudWatchLogs', {
  destination: FlowLogDestination.toCloudWatchLogs(),
});

new IntegTest(app, 'FlowLogsScopedPermissions', {
  testCases: [stack],
});

app.synth();
