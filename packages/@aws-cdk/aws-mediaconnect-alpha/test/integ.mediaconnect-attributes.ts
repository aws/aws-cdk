import { IntegTest } from '@aws-cdk/integ-tests-alpha';
import * as cdk from 'aws-cdk-lib';
import {
  Flow,
  SourceConfiguration,
  NetworkConfiguration,
  RouterNetworkInterface,
  RouterNetworkConfiguration,
  RouterInput,
  RouterInputConfiguration,
  RouterInputProtocol,
  RoutingScope,
  RouterOutput,
  RouterOutputConfiguration,
  RouterOutputProtocol,
} from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-cdk-mediaconnect-attributes');

// --- Flow ---
const flow = new Flow(stack, 'Flow', {
  flowName: 'integ-attributes-flow',
  source: SourceConfiguration.rtp({
    flowSourceName: 'primary',
    port: 5000,
    network: NetworkConfiguration.publicNetwork('203.0.113.0/24'),
  }),
});

new cdk.CfnOutput(stack, 'FlowArn', { value: flow.flowArn });
new cdk.CfnOutput(stack, 'FlowSourceArn', { value: flow.sourceArn });
new cdk.CfnOutput(stack, 'FlowEgressIp', { value: flow.egressIp });
new cdk.CfnOutput(stack, 'FlowSourceIngestIp', { value: flow.sourceIngestIp });
new cdk.CfnOutput(stack, 'FlowSourceIngestPort', { value: flow.sourceIngestPort });
new cdk.CfnOutput(stack, 'FlowSourceIngestUrl', { value: flow.sourceIngestUrl });
new cdk.CfnOutput(stack, 'FlowAvailabilityZone', { value: flow.flowAvailabilityZone ?? 'undefined' });

// --- Router Network Interface ---
const networkInterface = new RouterNetworkInterface(stack, 'NetworkInterface', {
  routerNetworkInterfaceName: 'integ-attributes-ni',
  configuration: RouterNetworkConfiguration.publicNetwork({
    cidr: ['203.0.113.0/24'],
  }),
});

new cdk.CfnOutput(stack, 'NetworkInterfaceArn', { value: networkInterface.routerNetworkInterfaceArn });
new cdk.CfnOutput(stack, 'NetworkInterfaceId', { value: networkInterface.routerNetworkInterfaceId });
new cdk.CfnOutput(stack, 'NetworkInterfaceCreatedAt', { value: networkInterface.createdAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'NetworkInterfaceUpdatedAt', { value: networkInterface.updatedAt ?? 'undefined' });

// --- Router Input ---
const routerInput = new RouterInput(stack, 'RouterInput', {
  routerInputName: 'integ-attributes-input',
  maximumBitrate: cdk.Bitrate.mbps(10),
  routingScope: RoutingScope.REGIONAL,
  configuration: RouterInputConfiguration.standard({
    networkInterface,
    protocol: RouterInputProtocol.rtp({ port: 5000 }),
  }),
});

new cdk.CfnOutput(stack, 'RouterInputArn', { value: routerInput.routerInputArn });
new cdk.CfnOutput(stack, 'RouterInputId', { value: routerInput.routerInputId });
new cdk.CfnOutput(stack, 'RouterInputIpAddress', { value: routerInput.ipAddress });
new cdk.CfnOutput(stack, 'RouterInputCreatedAt', { value: routerInput.createdAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'RouterInputUpdatedAt', { value: routerInput.updatedAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'RouterInputIngestUrl', { value: routerInput.endpoints[0].url });

// --- Router Output ---
const routerOutput = new RouterOutput(stack, 'RouterOutput', {
  routerOutputName: 'integ-attributes-output',
  maximumBitrate: cdk.Bitrate.mbps(10),
  routingScope: RoutingScope.REGIONAL,
  configuration: RouterOutputConfiguration.standard({
    networkInterface,
    protocol: RouterOutputProtocol.rtp({
      destinationAddress: '10.0.0.1',
      port: 5001,
    }),
  }),
});

new cdk.CfnOutput(stack, 'RouterOutputArn', { value: routerOutput.routerOutputArn });
new cdk.CfnOutput(stack, 'RouterOutputId', { value: routerOutput.routerOutputId });
new cdk.CfnOutput(stack, 'RouterOutputIpAddress', { value: routerOutput.ipAddress });
new cdk.CfnOutput(stack, 'RouterOutputCreatedAt', { value: routerOutput.createdAt ?? 'undefined' });
new cdk.CfnOutput(stack, 'RouterOutputUpdatedAt', { value: routerOutput.updatedAt ?? 'undefined' });

new IntegTest(app, 'cdk-integ-mediaconnect-attributes', {
  testCases: [stack],
});

app.synth();
