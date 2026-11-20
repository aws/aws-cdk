import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { App, Stack } from 'aws-cdk-lib';
import { FlowLogDestination, Vpc } from 'aws-cdk-lib/aws-ec2';
import { EC2_FLOW_LOGS_CLOUDWATCH_LOGS_TRUST_SCOPED } from 'aws-cdk-lib/cx-api';

// Synthetic CloudFormation synthesis fixture. Snapshot must be produced by the
// official integration runner; this file does not claim a deployed integration PASS.
const app = new App();
const stack = new Stack(app, 'VPCFlowLogsScopedTrust');
stack.node.setContext(EC2_FLOW_LOGS_CLOUDWATCH_LOGS_TRUST_SCOPED, true);

const vpc = new Vpc(stack, 'VPC', { natGateways: 0 });
vpc.addFlowLog('CloudWatchLogs', {
  destination: FlowLogDestination.toCloudWatchLogs(),
});

new IntegTest(app, 'FlowLogsScopedTrust', {
  testCases: [stack],
});

app.synth();
