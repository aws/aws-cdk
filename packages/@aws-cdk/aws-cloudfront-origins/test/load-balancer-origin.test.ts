import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { App, Duration, Stack } from '@aws-cdk/core';
import { LoadBalancerV2Origin } from '../lib';

let app: App;
let stack: Stack;

beforeEach(() => {
  app = new App();
  stack = new Stack(app, 'Stack', {
    env: { account: '1234', region: 'testregion' },
  });
});

test('Renders minimal example with just a load balancer', () => {
  const loadBalancer = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'elbv2', {
    loadBalancerArn: 'arn:aws:elasticloadbalancing:us-west-2:111111111111:loadbalancer/net/mylb/5d1b75f4f1cee11e',
    loadBalancerDnsName: 'mylb-5d1b75f4f1cee11e.elb.us-west-2.amazonaws.com',
  });

  const origin = new LoadBalancerV2Origin(loadBalancer);
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty).toEqual({
    id: 'StackOrigin029E19582',
    domainName: loadBalancer.loadBalancerDnsName,
    customOriginConfig: {
      originProtocolPolicy: 'https-only',
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});

test('Can customize properties of the origin', () => {
  const loadBalancer = elbv2.NetworkLoadBalancer.fromNetworkLoadBalancerAttributes(stack, 'elbv2', {
    loadBalancerArn: 'arn:aws:elasticloadbalancing:us-west-2:111111111111:loadbalancer/net/mylb/5d1b75f4f1cee11e',
    loadBalancerDnsName: 'mylb-5d1b75f4f1cee11e.elb.us-west-2.amazonaws.com',
  });

  const origin = new LoadBalancerV2Origin(loadBalancer, {
    connectionAttempts: 3,
    connectionTimeout: Duration.seconds(5),
    protocolPolicy: cloudfront.OriginProtocolPolicy.MATCH_VIEWER,
  });
  const originBindConfig = origin.bind(stack, { originId: 'StackOrigin029E19582' });

  expect(originBindConfig.originProperty).toEqual({
    id: 'StackOrigin029E19582',
    domainName: loadBalancer.loadBalancerDnsName,
    connectionAttempts: 3,
    connectionTimeout: 5,
    customOriginConfig: {
      originProtocolPolicy: 'match-viewer',
      originSslProtocols: [
        'TLSv1.2',
      ],
    },
  });
});
