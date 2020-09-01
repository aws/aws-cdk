import '@aws-cdk/assert/jest';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as elbv2 from '../../lib';

describe('tests', () => {
  test('Enable proxy protocol v2 attribute for target group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      proxyProtocolV2: true,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'proxy_protocol_v2.enabled',
          Value: 'true',
        },
      ],
    });
  });

  test('Disable proxy protocol v2 for attribute target group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      proxyProtocolV2: false,
    });

    // THEN
    expect(stack).toHaveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'proxy_protocol_v2.enabled',
          Value: 'false',
        },
      ],
    });
  });

  test('Configure protocols for target group', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      protocol: elbv2.Protocol.UDP,
    });

    expect(stack).toHaveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Protocol: 'UDP',
    });
  });

  test('Target group defaults to TCP', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
    });

    expect(stack).toHaveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Protocol: 'TCP',
    });
  });

  test('Throws error for unacceptable protocol', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    expect(() => {
      new elbv2.NetworkTargetGroup(stack, 'Group', {
        vpc,
        port: 80,
        protocol: elbv2.Protocol.HTTPS,
      });
    }).toThrow();
  });
});
