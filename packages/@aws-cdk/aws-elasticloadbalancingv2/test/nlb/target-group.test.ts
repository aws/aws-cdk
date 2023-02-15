import { Template } from '@aws-cdk/assertions';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'proxy_protocol_v2.enabled',
          Value: 'true',
        },
      ],
    });
  });

  test('Enable preserve_client_ip attribute for target group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      preserveClientIp: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'preserve_client_ip.enabled',
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
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'proxy_protocol_v2.enabled',
          Value: 'false',
        },
      ],
    });
  });

  test('Disable preserve_client_ip attribute for target group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      preserveClientIp: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'preserve_client_ip.enabled',
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

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
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

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Protocol: 'TCP',
    });
  });

  test('Throws error for invalid health check interval', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');
    const vpc = new ec2.Vpc(stack, 'Vpc');

    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(3),
      },
    });

    expect(() => {
      app.synth();
    }).toThrow(/Health check interval '3' not supported. Must be between 5 and 300./);
  });

  test('targetGroupName unallowed: more than 32 characters', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      targetGroupName: 'a'.repeat(33),
    });

    // THEN
    expect(() => {
      app.synth();
    }).toThrow('Target group name: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" can have a maximum of 32 characters.');
  });

  test('targetGroupName unallowed: starts with hyphen', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      targetGroupName: '-myTargetGroup',
    });

    // THEN
    expect(() => {
      app.synth();
    }).toThrow('Target group name: "-myTargetGroup" must not begin or end with a hyphen.');
  });

  test('targetGroupName unallowed: ends with hyphen', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      targetGroupName: 'myTargetGroup-',
    });

    // THEN
    expect(() => {
      app.synth();
    }).toThrow('Target group name: "myTargetGroup-" must not begin or end with a hyphen.');
  });

  test('targetGroupName unallowed: unallowed characters', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      targetGroupName: 'my target group',
    });

    // THEN
    expect(() => {
      app.synth();
    }).toThrow('Target group name: "my target group" must contain only alphanumeric characters or hyphens.');
  });

  test('Disable deregistration_delay.connection_termination.enabled attribute for target group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      connectionTermination: false,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'deregistration_delay.connection_termination.enabled',
          Value: 'false',
        },
      ],
    });
  });

  test('Enable deregistration_delay.connection_termination.enabled attribute for target group', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Vpc');

    // WHEN
    new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
      connectionTermination: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'deregistration_delay.connection_termination.enabled',
          Value: 'true',
        },
      ],
    });
  });

  test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])(
    'Throws validation error, when `healthCheck` has `protocol` set to %s',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});

      // WHEN
      new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
        healthCheck: {
          protocol: protocol,
        },
      });

      // THEN
      expect(() => {
        app.synth();
      }).toThrow(`Health check protocol '${protocol}' is not supported. Must be one of [HTTP, HTTPS, TCP]`);
    });

  test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])(
    'Throws validation error, when `configureHealthCheck()` has `protocol` set to %s',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});
      const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
      });

      // WHEN
      tg.configureHealthCheck({
        protocol: protocol,
      });

      // THEN
      expect(() => {
        app.synth();
      }).toThrow(`Health check protocol '${protocol}' is not supported. Must be one of [HTTP, HTTPS, TCP]`);
    });

  test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS, elbv2.Protocol.TCP])(
    'Does not throw validation error, when `healthCheck` has `protocol` set to %s',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});

      // WHEN
      new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
        healthCheck: {
          protocol: protocol,
        },
      });

      // THEN
      expect(() => {
        app.synth();
      }).not.toThrowError();
    });

  test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS, elbv2.Protocol.TCP])(
    'Does not throw validation error, when `configureHealthCheck()` has `protocol` set to %s',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});
      const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
      });

      // WHEN
      tg.configureHealthCheck({
        protocol: protocol,
      });

      // THEN
      expect(() => {
        app.synth();
      }).not.toThrowError();
    });

  test.each([elbv2.Protocol.TCP, elbv2.Protocol.HTTPS])(
    'Does not throw a validation error, when `healthCheck` has `protocol` set to %s and `interval` is equal to `timeout`',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});

      // WHEN
      new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
        healthCheck: {
          interval: cdk.Duration.seconds(10),
          timeout: cdk.Duration.seconds(10),
          protocol: protocol,
        },
      });

      // THEN
      expect(() => {
        app.synth();
      }).not.toThrowError();
    });

  test.each([elbv2.Protocol.TCP, elbv2.Protocol.HTTPS])(
    'Does not throw a validation error, when `configureHealthCheck()` has `protocol` set to %s and `interval` is equal to `timeout`',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});
      const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
      });

      // WHEN
      tg.configureHealthCheck({
        interval: cdk.Duration.seconds(10),
        timeout: cdk.Duration.seconds(10),
        protocol: protocol,
      });

      // THEN
      expect(() => {
        app.synth();
      }).not.toThrowError();
    });

  test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])(
    'Throws validation error,`healthCheck` has `protocol` set to %s and `path` is provided',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});

      // WHEN
      new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
        healthCheck: {
          path: '/my-path',
          protocol: protocol,
        },
      });

      // THEN
      expect(() => {
        app.synth();
      }).toThrow(`'${protocol}' health checks do not support the path property. Must be one of [HTTP, HTTPS]`);
    });

  test.each([elbv2.Protocol.UDP, elbv2.Protocol.TCP_UDP, elbv2.Protocol.TLS])(
    'Throws validation error, when `configureHealthCheck()` has `protocol` set to %s and  `path` is provided',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});
      const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
      });

      // WHEN
      tg.configureHealthCheck({
        path: '/my-path',
        protocol: protocol,
      });

      // THEN
      expect(() => {
        app.synth();
      }).toThrow(`'${protocol}' health checks do not support the path property. Must be one of [HTTP, HTTPS]`);
    });

  test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])(
    'Does not throw validation error, when `healthCheck` has `protocol` set to %s and `path` is provided',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});

      // WHEN
      new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
        healthCheck: {
          path: '/my-path',
          protocol: protocol,
        },
      });

      // THEN
      expect(() => {
        app.synth();
      }).not.toThrowError();
    });

  test.each([elbv2.Protocol.HTTP, elbv2.Protocol.HTTPS])(
    'Does not throw validation error, when `configureHealthCheck()` has `protocol` set to %s and `path` is provided',
    (protocol) => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'Stack');
      const vpc = new ec2.Vpc(stack, 'VPC', {});
      const tg = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', {
        vpc,
        port: 80,
      });

      // WHEN
      tg.configureHealthCheck({
        path: '/my-path',
        protocol: protocol,
      });

      // THEN
      expect(() => {
        app.synth();
      }).not.toThrowError();
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

  test('Exercise metrics', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = new elbv2.NetworkListener(stack, 'Listener', {
      loadBalancer: lb,
      port: 80,
    });
    const targetGroup = new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
    });
    listener.addTargetGroups('unused', targetGroup);

    // WHEN
    const metrics = new Array<cloudwatch.Metric>();
    metrics.push(targetGroup.metrics.healthyHostCount());
    metrics.push(targetGroup.metrics.unHealthyHostCount());

    // THEN

    // Ideally, this would just be a GetAtt of the LB name, but the target group
    // doesn't have a direct reference to the LB, and instead builds up the LB name
    // from the listener ARN.
    const splitListenerName = { 'Fn::Split': ['/', { Ref: 'Listener828B0E81' }] };
    const loadBalancerNameFromListener = {
      'Fn::Join': ['',
        [
          { 'Fn::Select': [1, splitListenerName] },
          '/',
          { 'Fn::Select': [2, splitListenerName] },
          '/',
          { 'Fn::Select': [3, splitListenerName] },
        ]],
    };

    for (const metric of metrics) {
      expect(metric.namespace).toEqual('AWS/NetworkELB');
      expect(stack.resolve(metric.dimensions)).toEqual({
        LoadBalancer: loadBalancerNameFromListener,
        TargetGroup: { 'Fn::GetAtt': ['GroupC77FDACD', 'TargetGroupFullName'] },
      });
    }
  });

  test('Metrics requires a listener to be present', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const targetGroup = new elbv2.NetworkTargetGroup(stack, 'Group', {
      vpc,
      port: 80,
    });

    // THEN
    expect(() => targetGroup.metrics.healthyHostCount()).toThrow(/The TargetGroup needs to be attached to a LoadBalancer/);
    expect(() => targetGroup.metrics.unHealthyHostCount()).toThrow(/The TargetGroup needs to be attached to a LoadBalancer/);
  });

  test('imported targetGroup has targetGroupName', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    const importedTg = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
      targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myNlbTargetGroup/73e2d6bc24d8a067',
    });

    // THEN
    expect(importedTg.targetGroupName).toEqual('myNlbTargetGroup');
  });

  test('imported targetGroup with imported ARN has targetGroupName', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    const importedTgArn = cdk.Fn.importValue('ImportTargetGroupArn');
    const importedTg = elbv2.ApplicationTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
      targetGroupArn: importedTgArn,
    });
    new cdk.CfnOutput(stack, 'TargetGroupOutput', {
      value: importedTg.targetGroupName,
    });

    // THEN
    Template.fromStack(stack).hasOutput('TargetGroupOutput', {
      Value: {
        'Fn::Select': [
          // myNlbTargetGroup
          1,
          {
            'Fn::Split': [
              // [targetgroup, myNlbTargetGroup, 73e2d6bc24d8a067]
              '/',
              {
                'Fn::Select': [
                  // targetgroup/myNlbTargetGroup/73e2d6bc24d8a067
                  5,
                  {
                    'Fn::Split': [
                      // [arn, aws, elasticloadbalancing, us-west-2, 123456789012, targetgroup/myNlbTargetGroup/73e2d6bc24d8a067]
                      ':',
                      {
                        // arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/myNlbTargetGroup/73e2d6bc24d8a067
                        'Fn::ImportValue': 'ImportTargetGroupArn',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    });
  });

  test('imported targetGroup has metrics', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    const targetGroup = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
      targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
      loadBalancerArns: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:loadbalancer/net/my-load-balancer/73e2d6bc24d8a067',
    });

    const metric = targetGroup.metrics.custom('MetricName');

    // THEN
    expect(metric.namespace).toEqual('AWS/NetworkELB');
    expect(stack.resolve(metric.dimensions)).toEqual({
      LoadBalancer: 'net/my-load-balancer/73e2d6bc24d8a067',
      TargetGroup: 'targetgroup/my-target-group/50dc6c495c0c9188',
    });
  });

  test('imported targetGroup without load balancer cannot have metrics', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'Stack');

    // WHEN
    const targetGroup = elbv2.NetworkTargetGroup.fromTargetGroupAttributes(stack, 'importedTg', {
      targetGroupArn: 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-target-group/50dc6c495c0c9188',
    });

    expect(() => targetGroup.metrics.custom('MetricName')).toThrow();
  });
});
