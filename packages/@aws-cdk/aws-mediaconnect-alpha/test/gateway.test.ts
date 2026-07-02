import { App, Duration, Stack } from 'aws-cdk-lib';
import { Annotations, Match, Template } from 'aws-cdk-lib/assertions';
import { Gateway } from '../lib/gateway';
import { GatewayNetwork } from '../lib/shared';

let app: App;
let stack: Stack;
beforeEach(() => {
  app = new App();
  stack = new Stack(app, undefined, {
    env: { account: '123456789012', region: 'us-east-1' },
  });
});

test('MediaConnect Gateway Creation', () => {
  new Gateway(stack, 'flow', {
    egressCidrBlocks: ['10.1.0.0/16'],
    networks: [GatewayNetwork.define({
      cidrBlock: '10.1.0.0/16',
      name: 'first',
    })],
    gatewayName: 'my-gateway',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::Gateway', {
    EgressCidrBlocks: ['10.1.0.0/16'],
    Name: 'my-gateway',
    Networks: [{
      CidrBlock: '10.1.0.0/16',
      Name: 'first',
    }],
  });
});

// Validation tests
test('Gateway name validation - too long', () => {
  expect(() => {
    new Gateway(stack, 'gateway', {
      gatewayName: 'a'.repeat(33),
      egressCidrBlocks: ['10.0.0.0/16'],
      networks: [GatewayNetwork.define({ name: 'network1', cidrBlock: '10.0.0.0/24' })],
    });
  }).toThrow('Gateway name must be between 1 and 32 characters');
});

test('Gateway name validation - invalid characters', () => {
  expect(() => {
    new Gateway(stack, 'gateway', {
      gatewayName: 'invalid@name!',
      egressCidrBlocks: ['10.0.0.0/16'],
      networks: [GatewayNetwork.define({ name: 'network1', cidrBlock: '10.0.0.0/24' })],
    });
  }).toThrow('Gateway name must contain only alphanumeric characters and hyphens');
});

test('Gateway name validation - valid name', () => {
  new Gateway(stack, 'gateway', {
    gatewayName: 'Valid-Gateway-Name',
    egressCidrBlocks: ['10.0.0.0/16'],
    networks: [GatewayNetwork.define({
      name: 'network1',
      cidrBlock: '10.0.0.0/24',
    })],
  });

  Template.fromStack(stack).hasResourceProperties('AWS::MediaConnect::Gateway', {
    Name: 'Valid-Gateway-Name',
  });
});

describe('Gateway metrics', () => {
  const makeGateway = () => new Gateway(stack, 'gw', {
    gatewayName: 'g',
    egressCidrBlocks: ['10.0.0.0/16'],
    networks: [GatewayNetwork.define({ name: 'net', cidrBlock: '10.0.0.0/24' })],
  });

  test('generic metric sets GatewayARN dimension and allows extra dimensions', () => {
    const gateway = makeGateway();

    const metric = gateway.metric('IngressBridgeSourcePacketLossPercent', {
      dimensionsMap: { BridgeSourceName: 'bridge-a' },
    });

    expect(metric.namespace).toEqual('AWS/MediaConnect');
    expect(metric.metricName).toEqual('IngressBridgeSourcePacketLossPercent');
    expect(metric.dimensions).toEqual(expect.objectContaining({
      BridgeSourceName: 'bridge-a',
    }));
    expect(metric.dimensions).toHaveProperty('GatewayARN');
  });

  test('metricEgressBridgeTotalPackets defaults to sum over 60s with Count unit', () => {
    const metric = makeGateway().metricEgressBridgeTotalPackets();
    expect(metric.metricName).toEqual('EgressBridgeTotalPackets');
    expect(metric.namespace).toEqual('AWS/MediaConnect');
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period.toSeconds()).toEqual(60);
    expect(metric.unit).toEqual('Count');
  });

  test('metricEgressBridgeDroppedPackets defaults to sum over 60s with Count unit', () => {
    const metric = makeGateway().metricEgressBridgeDroppedPackets();
    expect(metric.metricName).toEqual('EgressBridgeDroppedPackets');
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period.toSeconds()).toEqual(60);
    expect(metric.unit).toEqual('Count');
  });

  test('metricIngressBridgeTotalPackets defaults to sum over 60s with Count unit', () => {
    const metric = makeGateway().metricIngressBridgeTotalPackets();
    expect(metric.metricName).toEqual('IngressBridgeTotalPackets');
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period.toSeconds()).toEqual(60);
    expect(metric.unit).toEqual('Count');
  });

  test('metricIngressBridgeDroppedPackets defaults to sum over 60s with Count unit', () => {
    const metric = makeGateway().metricIngressBridgeDroppedPackets();
    expect(metric.metricName).toEqual('IngressBridgeDroppedPackets');
    expect(metric.statistic).toEqual('Sum');
    expect(metric.period.toSeconds()).toEqual(60);
    expect(metric.unit).toEqual('Count');
  });

  test('named helper props override defaults (period, statistic)', () => {
    const gateway = makeGateway();
    const metric = gateway.metricEgressBridgeDroppedPackets({ statistic: 'avg', period: Duration.minutes(5) });
    expect(metric.statistic).toEqual('Average');
    expect(metric.period.toSeconds()).toEqual(300);
  });
});

describe('open egress CIDR warning', () => {
  test.each(['0.0.0.0/0', '::/0'])('warns when an egress block is fully open (%s)', (openCidr) => {
    new Gateway(stack, 'gw', {
      gatewayName: 'g',
      egressCidrBlocks: [openCidr],
      networks: [GatewayNetwork.define({ name: 'net', cidrBlock: '10.0.0.0/24' })],
    });

    Annotations.fromStack(stack).hasWarning(
      '*',
      Match.stringLikeRegexp(`Gateway egress CIDR '${openCidr.replace('/', '\\/')}' allows traffic from any IP`),
    );
  });

  test('does not warn for a narrow egress block', () => {
    new Gateway(stack, 'gw', {
      gatewayName: 'g',
      egressCidrBlocks: ['10.0.0.0/16'],
      networks: [GatewayNetwork.define({ name: 'net', cidrBlock: '10.0.0.0/24' })],
    });

    Annotations.fromStack(stack).hasNoWarning('*', Match.stringLikeRegexp('allows traffic from any IP'));
  });
});
