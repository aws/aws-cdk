import { App } from 'aws-cdk-lib';
import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import { FlowLog, FlowLogResourceType, Vpc } from 'aws-cdk-lib/aws-ec2';
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

const app = new App();
const stack = new cdk.Stack(app, 'aws-cdk-ec2-flow-logs');

const vpc = new Vpc(stack, 'VPC');
const transitGateway = new ec2.CfnTransitGateway(stack, 'TransitGateway');
const transitGatewayAttachment = new ec2.CfnTransitGatewayAttachment(
  stack,
  'TransitGatewayAttachment',
  {
    subnetIds: vpc.privateSubnets.map(subnet => subnet.subnetId),
    transitGatewayId: transitGateway.ref,
    vpcId: vpc.vpcId,
  },
);

new FlowLog(stack, 'TransitGatewayFlowLogs', {
  resourceType: FlowLogResourceType.fromTransitGatewayId(transitGateway.ref),
});
new FlowLog(stack, 'TransitGatewayAttachmentFlowLogs', {
  resourceType: FlowLogResourceType.fromTransitGatewayAttachmentId(transitGatewayAttachment.ref),
});

new IntegTest(app, 'FlowLogs', {
  testCases: [stack],
});

app.synth();
