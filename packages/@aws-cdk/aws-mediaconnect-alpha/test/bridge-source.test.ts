import { App, Bitrate, Stack } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';

import { Bridge, BridgeConfiguration, BridgeFailoverConfig } from '../lib/bridge';
import { BridgeSource, BridgeSourceConfiguration } from '../lib/bridge-source';
import { Flow } from '../lib/flow';
import { Gateway } from '../lib/gateway';
import { BridgeProtocol } from '../lib/shared';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaConnect Bridge flow source', () => {
  const gateway = Gateway.fromGatewayArn(stack, 'gateway', 'mygatewayarn');

  const bridge = new Bridge(stack, 'bridge', {
    config: BridgeConfiguration.egress({
      maxBitrate: Bitrate.mbps(5),
      flowSources: [{
        flow: Flow.fromFlowAttributes(stack, 'flow1', {
          flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
          sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-CQwNVVFcCVgNBg8D-3104ecf5a408:test',
        }),
        name: 'flow1',
      }],
      networkOutputs: [],
    }),
    bridgeName: 'my-test-bridge',
    gateway,
    sourceFailoverConfig: BridgeFailoverConfig.failover(),
  });

  new BridgeSource(stack, 'bridge-out', {
    bridgeSourceName: 'bridge-source',
    bridge,
    source: BridgeSourceConfiguration.flow({
      name: 'flow2',
      flow: Flow.fromFlowAttributes(stack, 'flow2', {
        flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
        sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-CQwNVVFcCVgNBg8D-3104ecf5a408:test',
      }),
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::BridgeSource', {
    BridgeArn: {
      'Fn::GetAtt': ['bridge6E10D0E7', 'BridgeArn'],
    },
    Name: 'bridge-source',
    FlowSource: {
      FlowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
    },
  });
});

test('MediaConnect Bridge network source', () => {
  const gateway = Gateway.fromGatewayArn(stack, 'gateway', 'aaaaaa');

  const bridge = new Bridge(stack, 'bridge', {
    config: BridgeConfiguration.ingress({
      maxBitrate: Bitrate.mbps(5),
      maxOutputs: 2,
      networkSources: [],
    }),
    bridgeName: 'a',
    gateway,
    sourceFailoverConfig: BridgeFailoverConfig.failover(),
  });

  new BridgeSource(stack, 'bridge-out', {
    bridgeSourceName: 'bridge-source',
    bridge,
    source: BridgeSourceConfiguration.network({
      name: 'my-network',
      multicastIp: '239.0.0.1',
      networkName: 'my-network',
      port: 5000,
      protocol: BridgeProtocol.RTP,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::BridgeSource', {
    BridgeArn: {
      'Fn::GetAtt': ['bridge6E10D0E7', 'BridgeArn'],
    },
    Name: 'bridge-source',
    NetworkSource: {
      MulticastIp: '239.0.0.1',
      NetworkName: 'my-network',
      Port: 5000,
      Protocol: 'rtp',
    },
  });
});

test('fails - ingress bridge rejects flow sources', () => {
  expect(() => {
    const gateway = Gateway.fromGatewayArn(stack, 'gateway', 'aaaaaa');

    const bridge = new Bridge(stack, 'bridge', {
      config: BridgeConfiguration.ingress({
        maxBitrate: Bitrate.mbps(5),
        maxOutputs: 2,
        networkSources: [],
      }),
      bridgeName: 'a',
      gateway,
      sourceFailoverConfig: BridgeFailoverConfig.failover(),
    });

    new BridgeSource(stack, 'bridge-out', {
      bridgeSourceName: 'test',
      bridge,
      source: BridgeSourceConfiguration.flow({
        name: 'flow2',
        flow: Flow.fromFlowAttributes(stack, 'flow2', {
          flowArn: 'arn:aws:mediaconnect:us-east-1:123456789012:flow:1-CQwNVVFcCVgNBg8D-3104ecf5a408:my-flow',
          sourceArn: 'arn:aws:mediaconnect:us-east-1:123456789012:source:1-CQwNVVFcCVgNBg8D-3104ecf5a408:test',
        }),
      }),
    });
  }).toThrow('Ingress bridges must use network sources');
});

test('MediaConnect Bridge VPC flow network source', () => {
  const gateway = Gateway.fromGatewayArn(stack, 'gateway', 'aaaaaa');

  const bridge = new Bridge(stack, 'bridge', {
    config: BridgeConfiguration.ingress({
      maxBitrate: Bitrate.mbps(5),
      maxOutputs: 2,
      networkSources: [],
    }),
    bridgeName: 'a',
    gateway,
    sourceFailoverConfig: BridgeFailoverConfig.failover(),
  });

  new BridgeSource(stack, 'bridge-out', {
    bridgeSourceName: 'bridge-source',
    bridge,
    source: BridgeSourceConfiguration.network({
      name: 'myflowinput',
      multicastIp: '239.0.0.1',
      networkName: 'my-network',
      port: 5000,
      protocol: BridgeProtocol.RTP,
    }),
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::BridgeSource', {
    BridgeArn: {
      'Fn::GetAtt': ['bridge6E10D0E7', 'BridgeArn'],
    },
    Name: 'bridge-source',
    NetworkSource: {
      MulticastIp: '239.0.0.1',
      NetworkName: 'my-network',
      Port: 5000,
      Protocol: 'rtp',
    },
  });
});
