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

  test('Throws error for invalid health check interval', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(5),
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/Health check interval '5' not supported. Must be one of the following values '10,30'./);
  });

  test('Throws error for invalid health check protocol', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        protocol: elbv2.Protocol.UDP,
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/Health check protocol 'UDP' is not supported. Must be one of \[HTTP, HTTPS, TCP\]/);
  });

  test('Throws error for health check path property when protocol does not support it', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        path: '/my-path',
        protocol: elbv2.Protocol.TCP,
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/'TCP' health checks do not support the path property. Must be one of \[HTTP, HTTPS\]/);
  });

  test('Throws error for invalid health check healthy threshold', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        protocol: elbv2.Protocol.TCP,
        healthyThresholdCount: 11,
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/Healthy Threshold Count '11' not supported. Must be a number between 2 and 10./);
  });

  test('Throws error for invalid health check unhealthy threshold', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        protocol: elbv2.Protocol.TCP,
        unhealthyThresholdCount: 1,
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/Unhealthy Threshold Count '1' not supported. Must be a number between 2 and 10./);
  });

  test('Throws error for unequal healthy and unhealthy threshold counts', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        protocol: elbv2.Protocol.TCP,
        healthyThresholdCount: 5,
        unhealthyThresholdCount: 3,
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/Healthy and Unhealthy Threshold Counts must be the same: 5 is not equal to 3./);
  });
});
