import { App, Bitrate, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { Bridge, BridgeConfiguration, BridgeOutputConfiguration } from '../lib/bridge';
import { BridgeOutput } from '../lib/bridge-output';
import { Flow } from '../lib/flow';
import { Gateway } from '../lib/gateway';
import { BridgeProtocol, GatewayNetwork } from '../lib/shared';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaConnect Bridge output', () => {
  const gateway = Gateway.fromGatewayArn(stack, 'gateway', 'aaaaaa');

  const bridge = new Bridge(stack, 'bridge', {
    config: BridgeConfiguration.egress({
      maxBitrate: Bitrate.mbps(5),
      flowSources: [{
        name: 'aaa',
        source: {
          flow: Flow.fromFlowAttributes(stack, 'flow', {
            flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
            sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-CQwNVVFcCVgNBg8D-3104ecf5a408:test',
          }),
        },
      }],
      networkOutputs: [{
        name: 'output1',
        output: BridgeOutputConfiguration.network({
          ipAddress: '192.168.1.100',
          network: GatewayNetwork.define({ name: 'network1', cidrBlock: '198.51.100.0/24' }),
          port: 5000,
          protocol: BridgeProtocol.RTP,
          ttl: 64,
        }),
      }],
    }),
    bridgeName: 'a',
    gateway,
  });

  new BridgeOutput(stack, 'bridge-out', {
    bridgeOutputName: 'bridge-output',
    bridge,
    output: BridgeOutputConfiguration.network({
      ipAddress: '192.168.1.100',
      network: GatewayNetwork.define({ name: 'test', cidrBlock: '198.51.100.0/24' }),
      port: 1234,
      protocol: BridgeProtocol.RTP,
      ttl: 15,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::BridgeOutput', {
    BridgeArn: {
      'Fn::GetAtt': ['bridge6E10D0E7', 'BridgeArn'],
    },
    Name: 'bridge-output',
    NetworkOutput: {
      IpAddress: '192.168.1.100',
      NetworkName: 'test',
      Port: 1234,
      Protocol: 'rtp',
      Ttl: 15,
    },
  });
});
