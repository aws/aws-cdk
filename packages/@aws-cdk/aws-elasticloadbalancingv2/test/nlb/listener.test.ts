import { Match, Template } from '@aws-cdk/assertions';
import * as acm from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import { testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

describe('tests', () => {
  test('Trivial add listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TCP',
      Port: 443,
    });
  });

  test('Can add target groups', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });
    const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Default', group);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
          Type: 'forward',
        },
      ],
    });
  });

  testDeprecated('Can implicitly create target groups', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    listener.addTargets('Targets', {
      port: 80,
      targets: [new elbv2.InstanceTarget('i-12345')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'LBListenerTargetsGroup76EF81E8' },
          Type: 'forward',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: 'Stack8A423254' },
      Port: 80,
      Protocol: 'TCP',
      Targets: [
        { Id: 'i-12345' },
      ],
    });
  });

  testDeprecated('implicitly created target group inherits protocol', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 9700, protocol: elbv2.Protocol.TCP_UDP });

    // WHEN
    listener.addTargets('Targets', {
      port: 9700,
      targets: [new elbv2.InstanceTarget('i-12345')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'LBListenerTargetsGroup76EF81E8' },
          Type: 'forward',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: 'Stack8A423254' },
      Port: 9700,
      Protocol: 'TCP_UDP',
      Targets: [
        { Id: 'i-12345' },
      ],
    });
  });

  testDeprecated('implicitly created target group but overrides inherited protocol', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const cert = new acm.Certificate(stack, 'Certificate', {
      domainName: 'example.com',
    });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TLS,
      certificates: [elbv2.ListenerCertificate.fromCertificateManager(cert)],
      sslPolicy: elbv2.SslPolicy.TLS12,
    });

    // WHEN
    listener.addTargets('Targets', {
      port: 80,
      protocol: elbv2.Protocol.TCP,
      targets: [new elbv2.InstanceTarget('i-12345')],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TLS',
      Port: 443,
      Certificates: [
        { CertificateArn: { Ref: 'Certificate4E7ABB08' } },
      ],
      SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'LBListenerTargetsGroup76EF81E8' },
          Type: 'forward',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: 'Stack8A423254' },
      Port: 80,
      Protocol: 'TCP',
      Targets: [
        { Id: 'i-12345' },
      ],
    });
  });

  test('Enable health check for targets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });
    group.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      HealthCheckIntervalSeconds: 30,
    });
  });

  test('Enable taking a dependency on an NLB target group\'s load balancer', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });

    // WHEN
    new ResourceWithLBDependency(stack, 'MyResource', group);

    // THEN
    Template.fromStack(stack).templateMatches(Match.objectLike({
      Resources: {
        MyResource: {
          Type: 'Test::Resource',
          DependsOn: [
            // 2nd dependency is there because of the structure of the construct tree.
            // It does not harm.
            'LBListenerGroupGroup79B304FF',
            'LBListener49E825B4',
          ],
        },
      },
    }));
  });

  test('Trivial add TLS listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const cert = new acm.Certificate(stack, 'Certificate', {
      domainName: 'example.com',
    });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TLS,
      certificates: [elbv2.ListenerCertificate.fromCertificateManager(cert)],
      sslPolicy: elbv2.SslPolicy.TLS12,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TLS',
      Port: 443,
      Certificates: [
        { CertificateArn: { Ref: 'Certificate4E7ABB08' } },
      ],
      SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
    });
  });

  test('Trivial add TLS listener with ALPN', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const cert = new acm.Certificate(stack, 'Certificate', {
      domainName: 'example.com',
    });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TLS,
      alpnPolicy: elbv2.AlpnPolicy.HTTP2_ONLY,
      certificates: [elbv2.ListenerCertificate.fromCertificateManager(cert)],
      sslPolicy: elbv2.SslPolicy.TLS12,
      defaultTargetGroups: [
        new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 }),
      ],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TLS',
      Port: 443,
      AlpnPolicy: ['HTTP2Only'],
      Certificates: [{ CertificateArn: { Ref: 'Certificate4E7ABB08' } }],
      SslPolicy: 'ELBSecurityPolicy-TLS-1-2-2017-01',
    });
  });

  test('Incompatible Protocol with ALPN', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    expect(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TCP,
      alpnPolicy: elbv2.AlpnPolicy.HTTP2_OPTIONAL,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    })).toThrow(/Protocol must be TLS when alpnPolicy have been specified/);
  });

  test('Invalid Protocol listener', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    expect(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.HTTP,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    })).toThrow(/The protocol must be one of TCP, TLS, UDP, TCP_UDP\. Found HTTP/);
  });

  test('Invalid Listener Target Healthcheck Interval', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(350),
      },
    });

    const validationErrors: string[] = targetGroup.node.validate();
    const intervalError = validationErrors.find((err) => /Health check interval '350' not supported. Must be between/.test(err));
    expect(intervalError).toBeDefined();
  });

  test('validation error if invalid health check protocol', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60),
      },
    });

    targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
      protocol: elbv2.Protocol.UDP,
    });

    // THEN
    const validationErrors: string[] = targetGroup.node.validate();
    expect(validationErrors).toEqual(["Health check protocol 'UDP' is not supported. Must be one of [HTTP, HTTPS, TCP]"]);
  });

  test('validation error if invalid path health check protocol', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60),
      },
    });

    targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
      protocol: elbv2.Protocol.TCP,
      path: '/',
    });

    // THEN
    const validationErrors: string[] = targetGroup.node.validate();
    expect(validationErrors).toEqual([
      "'TCP' health checks do not support the path property. Must be one of [HTTP, HTTPS]",
    ]);
  });

  test('validation error if invalid timeout health check', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('PublicListener', { port: 80 });
    const targetGroup = listener.addTargets('ECS', {
      port: 80,
      healthCheck: {
        interval: cdk.Duration.seconds(60),
      },
    });

    targetGroup.configureHealthCheck({
      interval: cdk.Duration.seconds(30),
      protocol: elbv2.Protocol.HTTP,
      timeout: cdk.Duration.seconds(10),
    });

    // THEN
    const validationErrors: string[] = targetGroup.node.validate();
    expect(validationErrors).toEqual([
      'Custom health check timeouts are not supported for Network Load Balancer health checks. Expected 6 seconds for HTTP, got 10',
    ]);
  });

  test('Protocol & certs TLS listener', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    expect(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TLS,
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    })).toThrow(/When the protocol is set to TLS, you must specify certificates/);
  });

  test('TLS and certs specified listener', () => {
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
    const cert = new acm.Certificate(stack, 'Certificate', {
      domainName: 'example.com',
    });

    expect(() => lb.addListener('Listener', {
      port: 443,
      protocol: elbv2.Protocol.TCP,
      certificates: [{ certificateArn: cert.certificateArn }],
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    })).toThrow(/Protocol must be TLS when certificates have been specified/);
  });

  test('Can pass multiple certificates to network listener constructor', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificates: [
        importedCertificate(stack, 'cert1'),
        importedCertificate(stack, 'cert2'),
      ],
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TLS',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    });
  });

  test('Can add multiple certificates to network listener after construction', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [
        importedCertificate(stack, 'cert1'),
      ],
      defaultTargetGroups: [new elbv2.NetworkTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    listener.addCertificates('extra', [
      importedCertificate(stack, 'cert2'),
    ]);


    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'TLS',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    });
  });

  test('not allowed to specify defaultTargetGroups and defaultAction together', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const group = new elbv2.NetworkTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
    const lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    expect(() => {
      lb.addListener('Listener1', {
        port: 80,
        defaultTargetGroups: [group],
        defaultAction: elbv2.NetworkListenerAction.forward([group]),
      });
    }).toThrow(/Specify at most one/);
  });

  test('Can look up an NetworkListener', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'stack', {
      env: {
        account: '123456789012',
        region: 'us-west-2',
      },
    });

    // WHEN
    const listener = elbv2.NetworkListener.fromLookup(stack, 'a', {
      loadBalancerTags: {
        some: 'tag',
      },
    });

    // THEN
    Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 0);
    expect(listener.listenerArn).toEqual('arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/network/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2');
  });
});

class ResourceWithLBDependency extends cdk.CfnResource {
  constructor(scope: constructs.Construct, id: string, targetGroup: elbv2.ITargetGroup) {
    super(scope, id, { type: 'Test::Resource' });
    this.node.addDependency(targetGroup.loadBalancerAttached);
  }
}

function importedCertificate(stack: cdk.Stack,
  certificateArn = 'arn:aws:certificatemanager:123456789012:testregion:certificate/fd0b8392-3c0e-4704-81b6-8edf8612c852') {
  return acm.Certificate.fromCertificateArn(stack, certificateArn, certificateArn);
}
