import { expect, haveResource, MatchStyle } from '@aws-cdk/assert';
import { Metric } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

export = {
  'Listener guesses protocol from port'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificateArns: ['bla'],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS'
    }));

    test.done();
  },

  'Listener guesses port from protocol'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80
    }));

    test.done();
  },

  'Listener default to open'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    loadBalancer.addListener('MyListener', {
      port: 80,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          Description: 'Allow from anyone on port 80',
          CidrIp: "0.0.0.0/0",
          FromPort: 80,
          IpProtocol: "tcp",
          ToPort: 80
        }
      ]
    }));

    test.done();
  },

  'HTTPS listener requires certificate'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    const errors = cdk.ConstructNode.validate(stack.node);
    test.deepEqual(errors.map(e => e.message), ['HTTPS Listener needs at least one certificate (call addCertificateArns)']);

    test.done();
  },

  'HTTPS listener can add certificate after construction'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    listener.addCertificateArns("Arns", ['cert']);

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Certificates: [
        { CertificateArn: "cert" }
      ],
    }));

    test.done();
  },

  'Can configure targetType on TargetGroups'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetType: 'ip'
    }));

    test.done();
  },

  'Can configure name on TargetGroups'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      targetGroupName: 'foo'
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Name: 'foo'
    }));

    test.done();
  },

  'Can add target groups with and without conditions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Default', {
      targetGroups: [group]
    });
    listener.addTargetGroups('WithPath', {
      priority: 10,
      pathPattern: '/hello',
      targetGroups: [group]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: "TargetGroup3D7CD9B8" },
          Type: "forward"
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [
        {
          Field: 'path-pattern',
          Values: ['/hello']
        }
      ],
      Actions: [
        {
          TargetGroupArn: { Ref: "TargetGroup3D7CD9B8" },
          Type: "forward"
        }
      ],
    }));

    test.done();
  },

  'Can implicitly create target groups with and without conditions'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addTargets('Targets', {
      port: 80,
      targets: [new elbv2.InstanceTarget('i-12345')]
    });
    listener.addTargets('WithPath', {
      priority: 10,
      pathPattern: '/hello',
      port: 80,
      targets: [new elbv2.InstanceTarget('i-5678')]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: "LBListenerTargetsGroup76EF81E8" },
          Type: "forward"
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: "Stack8A423254" },
      Port: 80,
      Protocol: "HTTP",
      Targets: [
        { Id: "i-12345" }
      ]
    }));
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          TargetGroupArn: { Ref: "LBListenerWithPathGroupE889F9E5" },
          Type: "forward"
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: "Stack8A423254" },
      Port: 80,
      Protocol: "HTTP",
      Targets: [
        { Id: "i-5678" }
      ]
    }));

    test.done();
  },

  'Add certificate to constructed listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    listener.addCertificateArns('Arns', ['cert']);
    listener.addTargets('Targets', { port: 8080, targets: [new elbv2.IpTarget('1.2.3.4')] });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Certificates: [
        { CertificateArn: "cert" }
      ],
    }));

    test.done();
  },

  'Add certificate to imported listener'(test: Test) {
    // GIVEN
    const stack2 = new cdk.Stack();
    const listener2 = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'Listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroupId: 'security-group-id'
    });

    // WHEN
    listener2.addCertificateArns('Arns', ['cert']);

    // THEN
    expect(stack2).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [
        { CertificateArn: "cert" }
      ],
    }));

    test.done();
  },

  'Enable stickiness for targets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)]
    });
    group.enableCookieStickiness(cdk.Duration.hours(1));

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: "stickiness.enabled",
          Value: "true"
        },
        {
          Key: "stickiness.type",
          Value: "lb_cookie"
        },
        {
          Key: "stickiness.lb_cookie.duration_seconds",
          Value: "3600"
        }
      ]
    }));

    test.done();
  },

  'Enable health check for targets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)]
    });
    group.configureHealthCheck({
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.hours(1),
      interval: cdk.Duration.seconds(30),
      path: '/test',
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      UnhealthyThresholdCount: 3,
      HealthCheckIntervalSeconds: 30,
      HealthCheckPath: "/test",
      HealthCheckTimeoutSeconds: 3600,
    }));

    test.done();
  },

  'validation error if invalid health check protocol'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)]
    });

    group.configureHealthCheck({
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.hours(1),
      interval: cdk.Duration.seconds(30),
      path: '/test',
      protocol: elbv2.Protocol.TCP
    });

    // THEN
    const validationErrors: string[] = (group as any).validate();
    test.deepEqual(validationErrors, ["Health check protocol 'TCP' is not supported. Must be one of [HTTP, HTTPS]"]);

    test.done();
  },

  'Can call addTargetGroups on imported listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
      listenerArn: 'ieks',
      securityGroupId: 'sg-12345'
    });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Gruuup', {
      priority: 30,
      hostHeader: 'example.com',
      targetGroups: [group]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
      ListenerArn: 'ieks',
      Priority: 30,
      Actions: [
        {
          TargetGroupArn: { Ref: "TargetGroup3D7CD9B8" },
          Type: "forward"
        }
      ],
    }));

    test.done();
  },

  'Can depend on eventual listener via TargetGroup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', { vpc });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    new ResourceWithLBDependency(stack, 'SomeResource', group);

    loadBalancer.addListener('Listener', {
      port: 80,
      defaultTargetGroups: [group]
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        SomeResource: {
          Type: "Test::Resource",
          DependsOn: ["LoadBalancerListenerE1A099B9"]
        }
      }
    }, MatchStyle.SUPERSET);

    test.done();
  },

  'Exercise metrics'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
    lb.addListener('SomeListener', {
      port: 80,
      defaultTargetGroups: [group]
    });

    // WHEN
    const metrics = new Array<Metric>();
    metrics.push(group.metricHttpCodeTarget(elbv2.HttpCodeTarget.TARGET_3XX_COUNT));
    metrics.push(group.metricIpv6RequestCount());
    metrics.push(group.metricUnhealthyHostCount());
    metrics.push(group.metricUnhealthyHostCount());
    metrics.push(group.metricRequestCount());
    metrics.push(group.metricTargetConnectionErrorCount());
    metrics.push(group.metricTargetResponseTime());
    metrics.push(group.metricTargetTLSNegotiationErrorCount());

    for (const metric of metrics) {
      test.equal('AWS/ApplicationELB', metric.namespace);
      const loadBalancerArn = { Ref: "LBSomeListenerCA01F1A0" };

      test.deepEqual(stack.resolve(metric.dimensions), {
         TargetGroup: { 'Fn::GetAtt': [ 'TargetGroup3D7CD9B8', 'TargetGroupFullName' ] },
         LoadBalancer: { 'Fn::Join':
            [ '',
              [ { 'Fn::Select': [ 1, { 'Fn::Split': [ '/', loadBalancerArn ] } ] },
                '/',
                { 'Fn::Select': [ 2, { 'Fn::Split': [ '/', loadBalancerArn ] } ] },
                '/',
                { 'Fn::Select': [ 3, { 'Fn::Split': [ '/', loadBalancerArn ] } ] }
              ]
            ]
         }
      });
    }

    test.done();
  },

  'Can add dependency on ListenerRule via TargetGroup'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', { vpc });
    const group1 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
    const group2 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
    const listener = loadBalancer.addListener('Listener', {
      port: 80,
      defaultTargetGroups: [group1]
    });

    // WHEN
    new ResourceWithLBDependency(stack, 'SomeResource', group2);

    listener.addTargetGroups('SecondGroup', {
      pathPattern: '/bla',
      priority: 10,
      targetGroups: [group2]
    });

    // THEN
    expect(stack).toMatch({
      Resources: {
        SomeResource: {
          Type: "Test::Resource",
          DependsOn: ["LoadBalancerListenerSecondGroupRuleF5FDC196"]
        }
      }
    }, MatchStyle.SUPERSET);

    test.done();
  },

  'Can add fixed responses'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc
    });
    const listener = lb.addListener('Listener', {
      port: 80
    });

    // WHEN
    listener.addFixedResponse('Default', {
      contentType: elbv2.ContentType.TEXT_PLAIN,
      messageBody: 'Not Found',
      statusCode: '404'
    });
    listener.addFixedResponse('Hello', {
      priority: 10,
      pathPattern: '/hello',
      statusCode: '503'
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          FixedResponseConfig: {
            ContentType: 'text/plain',
            MessageBody: 'Not Found',
            StatusCode: '404'
          },
          Type: 'fixed-response'
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          FixedResponseConfig: {
            StatusCode: '503'
          },
          Type: 'fixed-response'
        }
      ]
    }));

    test.done();
  },

  'Can add redirect responses'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc
    });
    const listener = lb.addListener('Listener', {
      port: 80
    });

    // WHEN
    listener.addRedirectResponse('Default', {
      statusCode: 'HTTP_301',
      port: '443',
      protocol: 'HTTPS'
    });
    listener.addRedirectResponse('Hello', {
      priority: 10,
      pathPattern: '/hello',
      path: '/new/#{path}',
      statusCode: 'HTTP_302'
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          RedirectConfig: {
            Port: '443',
            Protocol: 'HTTPS',
            StatusCode: 'HTTP_301'
          },
          Type: 'redirect'
        }
      ]
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          RedirectConfig: {
            Path: '/new/#{path}',
            StatusCode: 'HTTP_302'
          },
          Type: 'redirect'
        }
      ]
    }));

    test.done();
  },

  'Can configure deregistration_delay for targets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      deregistrationDelay: cdk.Duration.seconds(30)
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: "deregistration_delay.timeout_seconds",
          Value: "30"
        }
      ]
    }));

    test.done();
  },

  'Throws with bad fixed responses': {

    'status code'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc
      });
      const listener = lb.addListener('Listener', {
        port: 80
      });

      // THEN
      test.throws(() => listener.addFixedResponse('Default', {
        statusCode: '301'
      }), /`statusCode`/);

      test.done();
    },

    'message body'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc
      });
      const listener = lb.addListener('Listener', {
        port: 80
      });

      // THEN
      test.throws(() => listener.addFixedResponse('Default', {
        messageBody: 'a'.repeat(1025),
        statusCode: '500'
      }), /`messageBody`/);

      test.done();
    }
  },

  'Throws with bad redirect responses': {

    'status code'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc
      });
      const listener = lb.addListener('Listener', {
        port: 80
      });

      // THEN
      test.throws(() => listener.addRedirectResponse('Default', {
        statusCode: '301'
      }), /`statusCode`/);

      test.done();
    },

    'protocol'(test: Test) {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc
      });
      const listener = lb.addListener('Listener', {
        port: 80
      });

      // THEN
      test.throws(() => listener.addRedirectResponse('Default', {
        protocol: 'tcp',
        statusCode: 'HTTP_301'
      }), /`protocol`/);

      test.done();
    }
  },

  'Throws when specifying both target groups and fixed reponse'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc
    });
    const listener = lb.addListener('Listener', {
      port: 80
    });

    // THEN
    test.throws(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
      listener,
      priority: 10,
      pathPattern: '/hello',
      targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 })],
      fixedResponse: {
        statusCode: '500'
      }
    }), /'targetGroups,fixedResponse'.*/);

    test.done();
  },

  'Throws when specifying both target groups and redirect reponse'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc
    });
    const listener = lb.addListener('Listener', {
      port: 80
    });

    // THEN
    test.throws(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
      listener,
      priority: 10,
      pathPattern: '/hello',
      targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 })],
      redirectResponse: {
        statusCode: 'HTTP_301'
      }
    }), /'targetGroups,redirectResponse'.*/);

    test.throws(() => new elbv2.ApplicationListenerRule(stack, 'Rule2', {
      listener,
      priority: 10,
      pathPattern: '/hello',
      targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 })],
      fixedResponse: {
        statusCode: '500'
      },
      redirectResponse: {
        statusCode: 'HTTP_301'
      }
    }), /'targetGroups,fixedResponse,redirectResponse'.*/);

    test.done();
  },

  'Imported listener with imported security group and allowAllOutbound set to false'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id', {
        allowAllOutbound: false,
      }),
    });

    // WHEN
    listener.connections.allowToAnyIpv4(ec2.Port.tcp(443));

    // THEN
    expect(stack).to(haveResource('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'security-group-id'
    }));

    test.done();
  },

  'Can pass multiple certificate arns to application listener constructor'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificateArns: ['cert1', 'cert2'],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS'
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    }));

    test.done();
  },

  'Can use certificate wrapper class'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificates: [elbv2.ListenerCertificate.fromArn('cert1'), elbv2.ListenerCertificate.fromArn('cert2')],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS'
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    }));

    test.done();
  },

  'Can add additional certificates via addCertficateArns to application listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificateArns: ['cert1', 'cert2'],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    listener.addCertificateArns("ListenerCertificateX", ['cert3']);

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS'
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    }));

    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert3' }],
    }));

    test.done();
  },
};

class ResourceWithLBDependency extends cdk.CfnResource {
  constructor(scope: cdk.Construct, id: string, targetGroup: elbv2.ITargetGroup) {
    super(scope, id, { type: 'Test::Resource' });
    this.node.addDependency(targetGroup.loadBalancerAttached);
  }
}
