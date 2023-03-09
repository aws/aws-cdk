import { Match, Template } from '@aws-cdk/assertions';
import * as acm from '@aws-cdk/aws-certificatemanager';
import { Metric } from '@aws-cdk/aws-cloudwatch';
import * as ec2 from '@aws-cdk/aws-ec2';
import { describeDeprecated, testDeprecated } from '@aws-cdk/cdk-build-tools';
import * as cdk from '@aws-cdk/core';
import { SecretValue } from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as elbv2 from '../../lib';
import { FakeSelfRegisteringTarget } from '../helpers';

describe('tests', () => {
  test('Listener guesses protocol from port', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificates: [importedCertificate(stack)],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS',
    });
  });

  test('Listener guesses port from protocol', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80,
    });
  });

  test('Listener default to open - IPv4', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    loadBalancer.addListener('MyListener', {
      port: 80,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          Description: 'Allow from anyone on port 80',
          CidrIp: '0.0.0.0/0',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
    });
  });

  test('Listener default to open - IPv4 and IPv6 (dual stack)', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc, ipAddressType: elbv2.IpAddressType.DUAL_STACK });

    // WHEN
    loadBalancer.addListener('MyListener', {
      port: 80,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          Description: 'Allow from anyone on port 80',
          CidrIp: '0.0.0.0/0',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
        {
          Description: 'Allow from anyone on port 80',
          CidrIpv6: '::/0',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
    });
  });

  test('HTTPS listener requires certificate', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    const errors = listener.node.validate();
    expect(errors).toEqual(['HTTPS Listener needs at least one certificate (call addCertificates)']);
  });

  test('HTTPS listener can add certificate after construction', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    listener.addCertificates('Certs', [importedCertificate(stack, 'cert')]);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Certificates: [
        { CertificateArn: 'cert' },
      ],
    });
  });

  test('HTTPS listener can add more than two certificates', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      defaultTargetGroups: [
        new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 }),
      ],
      certificates: [
        elbv2.ListenerCertificate.fromArn('cert1'),
        elbv2.ListenerCertificate.fromArn('cert2'),
        elbv2.ListenerCertificate.fromArn('cert3'),
      ],
    });

    expect(listener.node.tryFindChild('DefaultCertificates1')).toBeDefined();
    expect(listener.node.tryFindChild('DefaultCertificates2')).toBeDefined();
    expect(listener.node.tryFindChild('DefaultCertificates3')).not.toBeDefined();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Certificates: [{ CertificateArn: 'cert1' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert3' }],
    });
  });

  test('Can configure targetType on TargetGroups', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      targetType: elbv2.TargetType.IP,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetType: 'ip',
    });
  });

  test('Can configure name on TargetGroups', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      targetGroupName: 'foo',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Name: 'foo',
    });
  });

  test('Can add target groups with and without conditions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Default', {
      targetGroups: [group],
    });
    listener.addTargetGroups('WithPath', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      targetGroups: [group],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
          Type: 'forward',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [
        {
          Field: 'path-pattern',
          PathPatternConfig: { Values: ['/hello'] },
        },
      ],
      Actions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
          Type: 'forward',
        },
      ],
    });
  });

  test('bind is called for all next targets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });
    const fake = new FakeSelfRegisteringTarget(stack, 'FakeTG', vpc);
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      targets: [fake],
    });

    // WHEN
    listener.addAction('first-action', {
      action: elbv2.ListenerAction.authenticateOidc({
        next: elbv2.ListenerAction.forward([group]),
        issuer: 'dummy',
        clientId: 'dummy',
        clientSecret: SecretValue.unsafePlainText('dummy'),
        tokenEndpoint: 'dummy',
        userInfoEndpoint: 'dummy',
        authorizationEndpoint: 'dummy',
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupIngress', {
      IpProtocol: 'tcp',
      Description: 'Load balancer to target',
      FromPort: 80,
      ToPort: 80,
      GroupId: {
        'Fn::GetAtt': [
          'FakeTGSG50E257DF',
          'GroupId',
        ],
      },
      SourceSecurityGroupId: {
        'Fn::GetAtt': [
          'LBSecurityGroup8A41EA2B',
          'GroupId',
        ],
      },
    });
  });

  testDeprecated('Can implicitly create target groups with and without conditions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addTargets('Targets', {
      port: 80,
      targets: [new elbv2.InstanceTarget('i-12345')],
    });
    listener.addTargets('WithPath', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      port: 80,
      targets: [new elbv2.InstanceTarget('i-5678')],
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
      Protocol: 'HTTP',
      Targets: [
        { Id: 'i-12345' },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          TargetGroupArn: { Ref: 'LBListenerWithPathGroupE889F9E5' },
          Type: 'forward',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      VpcId: { Ref: 'Stack8A423254' },
      Port: 80,
      Protocol: 'HTTP',
      Targets: [
        { Id: 'i-5678' },
      ],
    });
  });

  testDeprecated('Add certificate to constructed listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443 });

    // WHEN
    listener.addCertificates('Certs', [importedCertificate(stack, 'cert')]);
    listener.addTargets('Targets', { port: 8080, targets: [new elbv2.IpTarget('1.2.3.4')] });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Certificates: [
        { CertificateArn: 'cert' },
      ],
    });
  });

  test('Add certificate to imported listener', () => {
    // GIVEN
    const stack2 = new cdk.Stack();
    const listener2 = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'Listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack2, 'SG', 'security-group-id'),
    });

    // WHEN
    listener2.addCertificates('Certs', [importedCertificate(stack2, 'cert')]);

    // THEN
    Template.fromStack(stack2).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [
        { CertificateArn: 'cert' },
      ],
    });
  });

  test('Enable alb stickiness for targets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });
    group.enableCookieStickiness(cdk.Duration.hours(1));

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'stickiness.enabled',
          Value: 'true',
        },
        {
          Key: 'stickiness.type',
          Value: 'lb_cookie',
        },
        {
          Key: 'stickiness.lb_cookie.duration_seconds',
          Value: '3600',
        },
      ],
    });
  });

  test('Enable app stickiness for targets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });
    group.enableCookieStickiness(cdk.Duration.hours(1), 'MyDeliciousCookie');

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'stickiness.enabled',
          Value: 'true',
        },
        {
          Key: 'stickiness.type',
          Value: 'app_cookie',
        },
        {
          Key: 'stickiness.app_cookie.cookie_name',
          Value: 'MyDeliciousCookie',
        },
        {
          Key: 'stickiness.app_cookie.duration_seconds',
          Value: '3600',
        },
      ],
    });
  });

  test('Enable health check for targets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });
    group.configureHealthCheck({
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.seconds(30),
      interval: cdk.Duration.seconds(60),
      path: '/test',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      UnhealthyThresholdCount: 3,
      HealthCheckIntervalSeconds: 60,
      HealthCheckPath: '/test',
      HealthCheckTimeoutSeconds: 30,
    });
  });

  test('validation error if invalid health check protocol', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    const group = listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });

    group.configureHealthCheck({
      unhealthyThresholdCount: 3,
      timeout: cdk.Duration.seconds(30),
      interval: cdk.Duration.seconds(60),
      path: '/test',
      protocol: elbv2.Protocol.TCP,
    });

    // THEN
    const validationErrors: string[] = group.node.validate();
    expect(validationErrors).toEqual(["Health check protocol 'TCP' is not supported. Must be one of [HTTP, HTTPS]"]);
  });

  test('adding targets passes in provided protocol version', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 443, certificates: [importedCertificate(stack, 'arn:someCert')] });

    // WHEN
    listener.addTargets('Group', {
      port: 443,
      protocolVersion: elbv2.ApplicationProtocolVersion.GRPC,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      ProtocolVersion: 'GRPC',
    });
  });

  test('Can call addTargetGroups on imported listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
      listenerArn: 'ieks',
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-12345'),
    });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Gruuup', {
      priority: 30,
      conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
      targetGroups: [group],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      ListenerArn: 'ieks',
      Priority: 30,
      Actions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
          Type: 'forward',
        },
      ],
    });
  });

  test('Can call addTargetGroups on imported listener with conditions prop', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
      listenerArn: 'ieks',
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'sg-12345'),
    });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    listener.addTargetGroups('Gruuup', {
      priority: 30,
      conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
      targetGroups: [group],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      ListenerArn: 'ieks',
      Priority: 30,
      Actions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup3D7CD9B8' },
          Type: 'forward',
        },
      ],
    });
  });

  test('Can depend on eventual listener via TargetGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', { vpc });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });

    // WHEN
    new ResourceWithLBDependency(stack, 'SomeResource', group);

    loadBalancer.addListener('Listener', {
      port: 80,
      defaultTargetGroups: [group],
    });

    // THEN
    Template.fromStack(stack).templateMatches(Match.objectLike({
      Resources: {
        SomeResource: {
          Type: 'Test::Resource',
          DependsOn: ['LoadBalancerListenerE1A099B9'],
        },
      },
    }));
  });

  test('Exercise metrics', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
    lb.addListener('SomeListener', {
      port: 80,
      defaultTargetGroups: [group],
    });

    // WHEN
    const metrics = new Array<Metric>();
    metrics.push(group.metrics.httpCodeTarget(elbv2.HttpCodeTarget.TARGET_3XX_COUNT));
    metrics.push(group.metrics.ipv6RequestCount());
    metrics.push(group.metrics.unhealthyHostCount());
    metrics.push(group.metrics.unhealthyHostCount());
    metrics.push(group.metrics.requestCount());
    metrics.push(group.metrics.targetConnectionErrorCount());
    metrics.push(group.metrics.targetResponseTime());
    metrics.push(group.metrics.targetTLSNegotiationErrorCount());

    for (const metric of metrics) {
      expect(metric.namespace).toEqual('AWS/ApplicationELB');
      const loadBalancerArn = { Ref: 'LBSomeListenerCA01F1A0' };

      expect(stack.resolve(metric.dimensions)).toEqual({
        TargetGroup: { 'Fn::GetAtt': ['TargetGroup3D7CD9B8', 'TargetGroupFullName'] },
        LoadBalancer: {
          'Fn::Join':
            ['',
              [{ 'Fn::Select': [1, { 'Fn::Split': ['/', loadBalancerArn] }] },
                '/',
                { 'Fn::Select': [2, { 'Fn::Split': ['/', loadBalancerArn] }] },
                '/',
                { 'Fn::Select': [3, { 'Fn::Split': ['/', loadBalancerArn] }] }]],
        },
      });
    }
  });

  test('Can add dependency on ListenerRule via TargetGroup', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', { vpc });
    const group1 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
    const group2 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
    const listener = loadBalancer.addListener('Listener', {
      port: 80,
      defaultTargetGroups: [group1],
    });

    // WHEN
    new ResourceWithLBDependency(stack, 'SomeResource', group2);

    listener.addTargetGroups('SecondGroup', {
      conditions: [elbv2.ListenerCondition.pathPatterns(['/bla'])],
      priority: 10,
      targetGroups: [group2],
    });

    // THEN
    Template.fromStack(stack).templateMatches(Match.objectLike({
      Resources: {
        SomeResource: {
          Type: 'Test::Resource',
          DependsOn: ['LoadBalancerListenerSecondGroupRuleF5FDC196'],
        },
      },
    }));
  });

  test('Can add fixed responses', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // WHEN
    listener.addAction('Default', {
      action: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'Not Found',
      }),
    });
    listener.addAction('Hello', {
      action: elbv2.ListenerAction.fixedResponse(503),
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      priority: 10,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          FixedResponseConfig: {
            ContentType: 'text/plain',
            MessageBody: 'Not Found',
            StatusCode: '404',
          },
          Type: 'fixed-response',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          FixedResponseConfig: {
            StatusCode: '503',
          },
          Type: 'fixed-response',
        },
      ],
    });
  });

  test('imported listener only need securityGroup and listenerArn as attributes', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id', {
        allowAllOutbound: false,
      }),
    });
    importedListener.addAction('Hello', {
      action: elbv2.ListenerAction.fixedResponse(503),
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      priority: 10,
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      ListenerArn: 'listener-arn',
      Priority: 10,
      Actions: [
        {
          FixedResponseConfig: {
            StatusCode: '503',
          },
          Type: 'fixed-response',
        },
      ],
    });
  });

  test('Can add actions to an imported listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const stack2 = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // WHEN
    listener.addAction('Default', {
      action: elbv2.ListenerAction.fixedResponse(404, {
        contentType: 'text/plain',
        messageBody: 'Not Found',
      }),
    });

    const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack2, 'listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack2, 'SG', 'security-group-id', {
        allowAllOutbound: false,
      }),
    });
    importedListener.addAction('Hello', {
      action: elbv2.ListenerAction.fixedResponse(503),
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      priority: 10,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          FixedResponseConfig: {
            ContentType: 'text/plain',
            MessageBody: 'Not Found',
            StatusCode: '404',
          },
          Type: 'fixed-response',
        },
      ],
    });

    Template.fromStack(stack2).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      ListenerArn: 'listener-arn',
      Priority: 10,
      Actions: [
        {
          FixedResponseConfig: {
            StatusCode: '503',
          },
          Type: 'fixed-response',
        },
      ],
    });
  });

  test('actions added to an imported listener must have a priority', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const importedListener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id', {
        allowAllOutbound: false,
      }),
    });
    expect(() => {
      importedListener.addAction('Hello', {
        action: elbv2.ListenerAction.fixedResponse(503),
      });
    }).toThrow(/priority must be set for actions added to an imported listener/);
  });

  testDeprecated('Can add redirect responses', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // WHEN
    listener.addRedirectResponse('Default', {
      statusCode: 'HTTP_301',
      port: '443',
      protocol: 'HTTPS',
    });
    listener.addRedirectResponse('Hello', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      path: '/new/#{path}',
      statusCode: 'HTTP_302',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          RedirectConfig: {
            Port: '443',
            Protocol: 'HTTPS',
            StatusCode: 'HTTP_301',
          },
          Type: 'redirect',
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          RedirectConfig: {
            Path: '/new/#{path}',
            StatusCode: 'HTTP_302',
          },
          Type: 'redirect',
        },
      ],
    });
  });

  test('Can add simple redirect responses', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });

    // WHEN
    lb.addRedirect();

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 80,
      Protocol: 'HTTP',
      DefaultActions: [
        {
          RedirectConfig: {
            Port: '443',
            Protocol: 'HTTPS',
            StatusCode: 'HTTP_301',
          },
          Type: 'redirect',
        },
      ],
    });
  });

  test('Can supress default ingress rules on a simple redirect response', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    const loadBalancer = new elbv2.ApplicationLoadBalancer(stack, 'LB', {
      vpc,
    });

    // WHEN
    loadBalancer.addRedirect({ open: false });

    // THEN
    const matchingGroups = Template.fromStack(stack).findResources('AWS::EC2::SecurityGroup', {
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow from anyone on port 80',
          IpProtocol: 'tcp',
        },
      ],
    });
    expect(Object.keys(matchingGroups).length).toBe(0);
  });

  test('Can add simple redirect responses with custom values', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });

    // WHEN
    const listener = lb.addRedirect({
      sourceProtocol: elbv2.ApplicationProtocol.HTTPS,
      sourcePort: 8443,
      targetProtocol: elbv2.ApplicationProtocol.HTTP,
      targetPort: 8080,
    });
    listener.addCertificates('ListenerCertificateX', [importedCertificate(stack, 'cert3')]);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Port: 8443,
      Protocol: 'HTTPS',
      DefaultActions: [
        {
          RedirectConfig: {
            Port: '8080',
            Protocol: 'HTTP',
            StatusCode: 'HTTP_301',
          },
          Type: 'redirect',
        },
      ],
    });
  });

  test('Can configure deregistration_delay for targets', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');

    // WHEN
    new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', {
      vpc,
      port: 80,
      deregistrationDelay: cdk.Duration.seconds(30),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'deregistration_delay.timeout_seconds',
          Value: '30',
        },
        {
          Key: 'stickiness.enabled',
          Value: 'false',
        },
      ],
    });
  });

  test('Custom Load balancer algorithm type', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addTargets('Group', {
      port: 80,
      targets: [new FakeSelfRegisteringTarget(stack, 'Target', vpc)],
      loadBalancingAlgorithmType: elbv2.TargetGroupLoadBalancingAlgorithmType.LEAST_OUTSTANDING_REQUESTS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
      TargetGroupAttributes: [
        {
          Key: 'stickiness.enabled',
          Value: 'false',
        },
        {
          Key: 'load_balancing.algorithm.type',
          Value: 'least_outstanding_requests',
        },
      ],
    });
  });

  describeDeprecated('Throws with bad fixed responses', () => {

    test('status code', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc,
      });
      const listener = lb.addListener('Listener', {
        port: 80,
      });

      // THEN
      expect(() => listener.addFixedResponse('Default', {
        statusCode: '301',
      })).toThrow(/`statusCode`/);
    });

    test('message body', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc,
      });
      const listener = lb.addListener('Listener', {
        port: 80,
      });

      // THEN
      expect(() => listener.addFixedResponse('Default', {
        messageBody: 'a'.repeat(1025),
        statusCode: '500',
      })).toThrow(/`messageBody`/);
    });
  });

  describeDeprecated('Throws with bad redirect responses', () => {

    test('status code', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc,
      });
      const listener = lb.addListener('Listener', {
        port: 80,
      });

      // THEN
      expect(() => listener.addRedirectResponse('Default', {
        statusCode: '301',
      })).toThrow(/`statusCode`/);
    });

    test('protocol', () => {
      // GIVEN
      const stack = new cdk.Stack();
      const vpc = new ec2.Vpc(stack, 'VPC');
      const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
        vpc,
      });
      const listener = lb.addListener('Listener', {
        port: 80,
      });

      // THEN
      expect(() => listener.addRedirectResponse('Default', {
        protocol: 'tcp',
        statusCode: 'HTTP_301',
      })).toThrow(/`protocol`/);
    });
  });

  test('Throws when specifying both target groups and an action', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // THEN
    expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
      action: elbv2.ListenerAction.fixedResponse(500),
      listener,
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 })],
    })).toThrow(/'action,targetGroups'.*/);
  });

  test('Throws when specifying priority 0', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // THEN
    expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
      action: elbv2.ListenerAction.fixedResponse(500),
      listener,
      priority: 0,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
    })).toThrowError('Priority must have value greater than or equal to 1');
  });

  test('Accepts unresolved priority', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // THEN
    expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
      listener,
      priority: new cdk.CfnParameter(stack, 'PriorityParam', { type: 'Number' }).valueAsNumber,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      fixedResponse: {
        statusCode: '500',
      },
    })).not.toThrowError('Priority must have value greater than or equal to 1');
  });

  testDeprecated('Throws when specifying both target groups and redirect response', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'VPC');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LoadBalancer', {
      vpc,
    });
    const listener = lb.addListener('Listener', {
      port: 80,
    });

    // THEN
    expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule', {
      listener,
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 })],
      redirectResponse: {
        statusCode: 'HTTP_301',
      },
    })).toThrow(/'targetGroups,redirectResponse'.*/);

    expect(() => new elbv2.ApplicationListenerRule(stack, 'Rule2', {
      listener,
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/hello'])],
      targetGroups: [new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 })],
      fixedResponse: {
        statusCode: '500',
      },
      redirectResponse: {
        statusCode: 'HTTP_301',
      },
    })).toThrow(/'targetGroups,fixedResponse,redirectResponse'.*/);
  });

  test('Imported listener with imported security group and allowAllOutbound set to false', () => {
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
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroupEgress', {
      GroupId: 'security-group-id',
    });
  });

  test('Can pass multiple certificate arns to application listener constructor', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificates: [
        importedCertificate(stack, 'cert1'),
        importedCertificate(stack, 'cert2'),
      ],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    });
  });

  test('Can use certificate wrapper class', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    lb.addListener('Listener', {
      port: 443,
      certificates: [elbv2.ListenerCertificate.fromArn('cert1'), elbv2.ListenerCertificate.fromArn('cert2')],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    });
  });

  testDeprecated('Can add additional certificates via addCertificateArns to application listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificateArns: ['cert1', 'cert2'],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    listener.addCertificateArns('ListenerCertificateX', ['cert3']);

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      Protocol: 'HTTPS',
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert2' }],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
      Certificates: [{ CertificateArn: 'cert3' }],
    });
  });

  test('Can add multiple path patterns to listener rule', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [importedCertificate(stack, 'cert1'), importedCertificate(stack, 'cert2')],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    listener.addTargets('Target1', {
      priority: 10,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/test/path/1', '/test/path/2'])],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [
        {
          Field: 'path-pattern',
          PathPatternConfig: { Values: ['/test/path/1', '/test/path/2'] },
        },
      ],
    });
  });

  testDeprecated('Cannot add pathPattern and pathPatterns to listener rule', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [importedCertificate(stack, 'cert1'), importedCertificate(stack, 'cert2')],
      defaultTargetGroups: [new elbv2.ApplicationTargetGroup(stack, 'Group', { vpc, port: 80 })],
    });

    // THEN
    expect(() => listener.addTargets('Target1', {
      priority: 10,
      pathPatterns: ['/test/path/1', '/test/path/2'],
      pathPattern: '/test/path/3',
    })).toThrowError('Both `pathPatterns` and `pathPattern` are specified, specify only one');
  });

  test('Add additional condition to listener rule', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const group1 = new elbv2.ApplicationTargetGroup(stack, 'Group1', { vpc, port: 80 });
    const group2 = new elbv2.ApplicationTargetGroup(stack, 'Group2', { vpc, port: 81, protocol: elbv2.ApplicationProtocol.HTTP });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [importedCertificate(stack, 'cert1')],
      defaultTargetGroups: [group2],
    });
    listener.addTargetGroups('TargetGroup1', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['app.test']),
        elbv2.ListenerCondition.httpHeader('Accept', ['application/vnd.myapp.v2+json']),
      ],
      targetGroups: [group1],
    });
    listener.addTargetGroups('TargetGroup2', {
      priority: 20,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['app.test']),
      ],
      targetGroups: [group2],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['app.test'],
          },
        },
        {
          Field: 'http-header',
          HttpHeaderConfig: {
            HttpHeaderName: 'Accept',
            Values: ['application/vnd.myapp.v2+json'],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 20,
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['app.test'],
          },
        },
      ],
    });
  });

  test('Add multiple additonal condition to listener rule', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const group1 = new elbv2.ApplicationTargetGroup(stack, 'Group1', { vpc, port: 80 });
    const group2 = new elbv2.ApplicationTargetGroup(stack, 'Group2', { vpc, port: 81, protocol: elbv2.ApplicationProtocol.HTTP });
    const group3 = new elbv2.ApplicationTargetGroup(stack, 'Group3', { vpc, port: 82, protocol: elbv2.ApplicationProtocol.HTTP });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [importedCertificate(stack, 'cert1')],
      defaultTargetGroups: [group3],
    });
    listener.addTargetGroups('TargetGroup1', {
      priority: 10,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['app.test']),
        elbv2.ListenerCondition.sourceIps(['192.0.2.0/24']),
        elbv2.ListenerCondition.queryStrings([{ key: 'version', value: '2' }, { value: 'foo*' }]),
      ],
      targetGroups: [group1],
    });
    listener.addTargetGroups('TargetGroup2', {
      priority: 20,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['app.test']),
        elbv2.ListenerCondition.httpHeader('Accept', ['application/vnd.myapp.v2+json']),
      ],
      targetGroups: [group1],
    });
    listener.addTargetGroups('TargetGroup3', {
      priority: 30,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['app.test']),
        elbv2.ListenerCondition.httpRequestMethods(['PUT', 'COPY', 'LOCK', 'MKCOL', 'MOVE', 'PROPFIND', 'PROPPATCH', 'UNLOCK']),
      ],
      targetGroups: [group2],
    });
    listener.addTargetGroups('TargetGroup4', {
      priority: 40,
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['app.test']),
      ],
      targetGroups: [group3],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['app.test'],
          },
        },
        {
          Field: 'source-ip',
          SourceIpConfig: {
            Values: ['192.0.2.0/24'],
          },
        },
        {
          Field: 'query-string',
          QueryStringConfig: {
            Values: [
              {
                Key: 'version',
                Value: '2',
              },
              {
                Value: 'foo*',
              },
            ],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 20,
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['app.test'],
          },
        },
        {
          Field: 'http-header',
          HttpHeaderConfig: {
            HttpHeaderName: 'Accept',
            Values: ['application/vnd.myapp.v2+json'],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 30,
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['app.test'],
          },
        },
        {
          Field: 'http-request-method',
          HttpRequestMethodConfig: {
            Values: ['PUT', 'COPY', 'LOCK', 'MKCOL', 'MOVE', 'PROPFIND', 'PROPPATCH', 'UNLOCK'],
          },
        },
      ],
    });

    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 40,
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: ['app.test'],
          },
        },
      ],
    });
  });

  testDeprecated('Can exist together legacy style conditions and modern style conditions', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const group1 = new elbv2.ApplicationTargetGroup(stack, 'Group1', { vpc, port: 80 });
    const group2 = new elbv2.ApplicationTargetGroup(stack, 'Group2', { vpc, port: 81, protocol: elbv2.ApplicationProtocol.HTTP });

    // WHEN
    const listener = lb.addListener('Listener', {
      port: 443,
      certificates: [importedCertificate(stack, 'cert1')],
      defaultTargetGroups: [group2],
    });
    listener.addTargetGroups('TargetGroup1', {
      hostHeader: 'app.test',
      pathPattern: '/test',
      conditions: [
        elbv2.ListenerCondition.sourceIps(['192.0.2.0/24']),
      ],
      priority: 10,
      targetGroups: [group1],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 10,
      Conditions: [
        {
          Field: 'host-header',
          Values: ['app.test'],
        },
        {
          Field: 'path-pattern',
          Values: ['/test'],
        },
        {
          Field: 'source-ip',
          SourceIpConfig: {
            Values: ['192.0.2.0/24'],
          },
        },
      ],
    });
  });

  test('Add condition to imported application listener', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
    const listener = elbv2.ApplicationListener.fromApplicationListenerAttributes(stack, 'Listener', {
      listenerArn: 'listener-arn',
      defaultPort: 443,
      securityGroup: ec2.SecurityGroup.fromSecurityGroupId(stack, 'SG', 'security-group-id'),
    });

    // WHEN
    listener.addTargetGroups('OtherTG', {
      targetGroups: [group],
      priority: 1,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/path1', '/path2'])],
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Priority: 1,
      Conditions: [
        {
          Field: 'path-pattern',
          PathPatternConfig: { Values: ['/path1', '/path2'] },
        },
      ],
    });
  });

  testDeprecated('not allowed to combine action specifiers when instantiating a Rule directly', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
    const listener = lb.addListener('Listener', { port: 80 });

    const baseProps = { listener, priority: 1, pathPatterns: ['/path1', '/path2'] };

    // WHEN
    expect(() => {
      new elbv2.ApplicationListenerRule(stack, 'Rule1', {
        ...baseProps,
        fixedResponse: { statusCode: '200' },
        action: elbv2.ListenerAction.fixedResponse(200),
      });
    }).toThrow(/specify only one/);

    expect(() => {
      new elbv2.ApplicationListenerRule(stack, 'Rule2', {
        ...baseProps,
        targetGroups: [group],
        action: elbv2.ListenerAction.fixedResponse(200),
      });
    }).toThrow(/specify only one/);
  });

  test('not allowed to specify defaultTargetGroups and defaultAction together', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    const group = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup', { vpc, port: 80 });
    const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    // WHEN
    expect(() => {
      lb.addListener('Listener1', {
        port: 80,
        defaultTargetGroups: [group],
        defaultAction: elbv2.ListenerAction.fixedResponse(200),
      });
    }).toThrow(/Specify at most one/);
  });

  describe('lookup', () => {
    test('Can look up an ApplicationListener', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', {
        env: {
          account: '123456789012',
          region: 'us-west-2',
        },
      });

      // WHEN
      const listener = elbv2.ApplicationListener.fromLookup(stack, 'a', {
        loadBalancerTags: {
          some: 'tag',
        },
      });

      // THEN
      Template.fromStack(stack).resourceCountIs('AWS::ElasticLoadBalancingV2::Listener', 0);
      expect(listener.listenerArn).toEqual('arn:aws:elasticloadbalancing:us-west-2:123456789012:listener/application/my-load-balancer/50dc6c495c0c9188/f2f7dc8efc522ab2');
      expect(listener.connections.securityGroups[0].securityGroupId).toEqual('sg-12345678');
    });

    test('Can add rules to a looked-up ApplicationListener', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', {
        env: {
          account: '123456789012',
          region: 'us-west-2',
        },
      });

      const listener = elbv2.ApplicationListener.fromLookup(stack, 'a', {
        loadBalancerTags: {
          some: 'tag',
        },
      });

      // WHEN
      new elbv2.ApplicationListenerRule(stack, 'rule', {
        listener,
        conditions: [
          elbv2.ListenerCondition.hostHeaders(['example.com']),
        ],
        action: elbv2.ListenerAction.fixedResponse(200),
        priority: 5,
      });

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
        Priority: 5,
      });
    });

    test('Can add certificates to a looked-up ApplicationListener', () => {
      // GIVEN
      const app = new cdk.App();
      const stack = new cdk.Stack(app, 'stack', {
        env: {
          account: '123456789012',
          region: 'us-west-2',
        },
      });

      const listener = elbv2.ApplicationListener.fromLookup(stack, 'a', {
        loadBalancerTags: {
          some: 'tag',
        },
      });

      // WHEN
      listener.addCertificates('certs', [
        importedCertificate(stack, 'arn:something'),
      ]);

      // THEN
      Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerCertificate', {
        Certificates: [
          { CertificateArn: 'arn:something' },
        ],
      });
    });
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
