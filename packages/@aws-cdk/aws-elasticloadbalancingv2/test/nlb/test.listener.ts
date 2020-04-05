import { expect, haveResource, MatchStyle } from '@aws-cdk/assert';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

export = {
  'Trivial add listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TCP',
      Port: 443
    }));

    test.done();
  },

  'Can add target groups'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });
    const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Default', group);

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
          Type: 'forward'
        }
      ],
    }));

    test.done();
  },

  'Can implicitly create target groups'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    listener.addTargets('Targets', {
      port: 80,
      targets: [new elbv2.InstanceTarget('i-12345')]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'LBListenerTargetsGroup76EF81E8' },
          Type: 'forward'
        }
      ],
    }));
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: 'Stack8A423254' },
      Port: 80,
      Protocol: 'TCP',
      Targets: [
        { Id: 'i-12345' }
      ]
    }));

    test.done();
  },

  'Enable health check for targets'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)]
    });
    group.configureHealthCheck({
      interval: cdk.Duration.seconds(30)
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      HealthCheckIntervalSeconds: 30
    }));

    test.done();
  },

  'Enable taking a dependency on an NLB target group\'s load balancer'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)]
    });

    // WHEN
    new ResourceWithLBDependency(stack, 'MyResource', group);

    // THEN
    expect(stack).toMatch({
      Resources: {
        MyResource: {
          Type: 'Test::Resource',
          DependsOn: [
            // 2nd dependency is there because of the structure of the construct tree.
            // It does not harm.
            'LBListenerGroupGroup79B304FF',
            'LBListener49E825B4',
          ]
        }
      }
    }, MatchStyle.SUPERSET);

    test.done();
  },

  'Trivial add TLS listener'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const cert = new acm.Certificate(stack, 'Certificate', {
      domainName: 'example.com'
    });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TLS,
      certificates: [ elbv2.ListenerCertificate.fromCertificateManager(cert) ],
      sslPolicy: elbv2.SslPolicy.TLS12,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })]
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TLS',
      Port: 443,
      Certificates: [
        { CertificateArn: { Ref: 'Certificate4E7ABB08' } }
      ],
      SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01'
    }));

    test.done();
  },

  'Invalid Protocol listener'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    test.throws(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.HTTP,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })]
    }), /The protocol must be one of TCP, TLS, UDP, TCP_UDP\. Found HTTP/);

    test.done();
  },

  'Invalid Listener Target Healthcheck Interval'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60)
      }
    });

    const validationErrors: string[] = (targetGroup as any).validate();
    const intervalError = validationErrors.find((err) => /Health check interval '60' not supported. Must be one of the following values/.test(err));
    test.notEqual(intervalError, undefined, 'Failed to return health check interval validation error');

    test.done();
  },

  'validation error if invalid health check protocol'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60)
      }
    });

    targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
      protocol: elbv2.Protocol.UDP
    });

    // THEN
    const validationErrors: string[] = (targetGroup as any).validate();
    test.deepEqual(validationErrors, ["Health check protocol 'UDP' is not supported. Must be one of [HTTP, HTTPS, TCP]"]);

    test.done();
  },

  'validation error if invalid path health check protocol'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60)
      }
    });

    targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
      protocol: elbv2.Protocol.TCP,
      path: '/'
    });

    // THEN
    const validationErrors: string[] = (targetGroup as any).validate();
    test.deepEqual(validationErrors, [
      "'TCP' health checks do not support the path property. Must be one of [HTTP, HTTPS]"
    ]);

    test.done();
  },

  'validation error if invalid timeout health check'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60)
      }
    });

    targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
      protocol: elbv2.Protocol.HTTP,
      timeout: cdk.Duration.seconds(10),
    });

    // THEN
    const validationErrors: string[] = (targetGroup as any).validate();
    test.deepEqual(validationErrors, [
      'Custom health check timeouts are not supported for Network Load Balancer health checks. Expected 6 seconds for HTTP, got 10'
    ]);

    test.done();
  },

  'Protocol & certs TLS listener'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    test.throws(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TLS,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })]
    }), /When the protocol is set to TLS, you must specify certificates/);

    test.done();
  },

  'TLS and certs specified listener'(test: Test) {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const cert = new acm.Certificate(stack, 'Certificate', {
      domainName: 'example.com'
    });

    test.throws(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TCP,
      certificates: [ { certificateArn: cert.certificateArn } ],
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })]
    }), /Protocol must be TLS when certificates have been specified/);

    test.done();
  },
};

class ResourceWithLBDependency extends cdk.CfnResource {
  constructor(scope: cdk.Construct, id: string, targetGroup: elbv2.ITargetGroup) {
    super(scope, id, { type: 'Test::Resource' });
    this.node.addDependency(targetGroup.loadBalancerAttached);
  }
}
