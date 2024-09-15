import { Template } from '../../../assertions';
import * as ec2 from '../../../aws-ec2';
import * as cdk from '../../../core';
import * as elbv2 from '../../lib';

let stack: cdk.Stack;
let group1: elbv2.ApplicationTargetGroup;
let group2: elbv2.ApplicationTargetGroup;
let lb: elbv2.ApplicationLoadBalancer;

beforeEach(() => {
  stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  group1 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
  group2 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
  lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
});

describe('tests', () => {
  test('Forward action legacy rendering', () => {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.forward([group1]),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
          Type: 'forward',
        },
      ],
    });
  });

  test('Forward to multiple targetgroups with an Action and stickiness', () => {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.forward([group1, group2], {
        stickinessDuration: cdk.Duration.hours(1),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroupStickinessConfig: {
              DurationSeconds: 3600,
              Enabled: true,
            },
            TargetGroups: [
              {
                TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
              },
              {
                TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
              },
            ],
          },
          Type: 'forward',
        },
      ],
    });
  });

  test('Weighted forward to multiple targetgroups with an Action', () => {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.weightedForward([
        { targetGroup: group1, weight: 10 },
        { targetGroup: group2, weight: 50 },
      ], {
        stickinessDuration: cdk.Duration.hours(1),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          ForwardConfig: {
            TargetGroupStickinessConfig: {
              DurationSeconds: 3600,
              Enabled: true,
            },
            TargetGroups: [
              {
                TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
                Weight: 10,
              },
              {
                TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
                Weight: 50,
              },
            ],
          },
          Type: 'forward',
        },
      ],
    });
  });

  test('Chaining OIDC authentication action', () => {
    // WHEN
    const listener = lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.authenticateOidc({
        authorizationEndpoint: 'A',
        clientId: 'B',
        clientSecret: cdk.SecretValue.unsafePlainText('C'),
        issuer: 'D',
        tokenEndpoint: 'E',
        userInfoEndpoint: 'F',
        sessionTimeout: cdk.Duration.days(1),
        next: elbv2.ListenerAction.forward([group1]),
      }),
    });
    listener.addAction('AdditionalOidcAuthenticationAction', {
      priority: 1,
      conditions: [elbv2.ListenerCondition.pathPatterns(['/page*'])],
      action: elbv2.ListenerAction.authenticateOidc({
        authorizationEndpoint: 'A',
        clientId: 'B',
        clientSecret: cdk.SecretValue.unsafePlainText('C'),
        issuer: 'D',
        tokenEndpoint: 'E',
        userInfoEndpoint: 'F',
        sessionTimeout: cdk.Duration.days(1),
        next: elbv2.ListenerAction.forward([group1]),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          AuthenticateOidcConfig: {
            AuthorizationEndpoint: 'A',
            ClientId: 'B',
            ClientSecret: 'C',
            Issuer: 'D',
            TokenEndpoint: 'E',
            UserInfoEndpoint: 'F',
            // SessionTimeout in DefaultActions is string
            SessionTimeout: '86400',
          },
          Order: 1,
          Type: 'authenticate-oidc',
        },
        {
          Order: 2,
          TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
          Type: 'forward',
        },
      ],
    });
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          AuthenticateOidcConfig: {
            AuthorizationEndpoint: 'A',
            ClientId: 'B',
            ClientSecret: 'C',
            Issuer: 'D',
            TokenEndpoint: 'E',
            UserInfoEndpoint: 'F',
            // SessionTimeout in Actions is number
            SessionTimeout: 86400,
          },
          Order: 1,
          Type: 'authenticate-oidc',
        },
        {
          Order: 2,
          TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
          Type: 'forward',
        },
      ],
    });
  });

  test('OIDC authentication action allows HTTPS outbound', () => {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.authenticateOidc({
        authorizationEndpoint: 'A',
        clientId: 'B',
        clientSecret: cdk.SecretValue.unsafePlainText('C'),
        issuer: 'D',
        tokenEndpoint: 'E',
        userInfoEndpoint: 'F',
        next: elbv2.ListenerAction.forward([group1]),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Automatically created Security Group for ELB LB',
      SecurityGroupEgress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow to IdP endpoint',
          FromPort: 443,
          IpProtocol: 'tcp',
          ToPort: 443,
        },
      ],
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow from anyone on port 80',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
      VpcId: { Ref: 'Stack8A423254' },
    });
  });

  test('OIDC authentication action not allows HTTPS outbound when allowHttpsOutbound is false', () => {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.authenticateOidc({
        allowHttpsOutbound: false,
        authorizationEndpoint: 'A',
        clientId: 'B',
        clientSecret: cdk.SecretValue.unsafePlainText('C'),
        issuer: 'D',
        tokenEndpoint: 'E',
        userInfoEndpoint: 'F',
        next: elbv2.ListenerAction.forward([group1]),
      }),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::EC2::SecurityGroup', {
      GroupDescription: 'Automatically created Security Group for ELB LB',
      SecurityGroupEgress: [
        {
          CidrIp: '255.255.255.255/32',
          Description: 'Disallow all traffic',
          FromPort: 252,
          IpProtocol: 'icmp',
          ToPort: 86,
        },
      ],
      SecurityGroupIngress: [
        {
          CidrIp: '0.0.0.0/0',
          Description: 'Allow from anyone on port 80',
          FromPort: 80,
          IpProtocol: 'tcp',
          ToPort: 80,
        },
      ],
      VpcId: { Ref: 'Stack8A423254' },
    });
  });

  test('Add default Action and add Action with conditions', () => {
    // GIVEN
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addAction('Action1', {
      action: elbv2.ListenerAction.forward([group1]),
    });

    listener.addAction('Action2', {
      conditions: [elbv2.ListenerCondition.hostHeaders(['example.com'])],
      priority: 10,
      action: elbv2.ListenerAction.forward([group2]),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
          Type: 'forward',
        },
      ],
    });
  });

  test('Add Action with multiple Conditions', () => {
    // GIVEN
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addAction('Action1', {
      action: elbv2.ListenerAction.forward([group1]),
    });

    listener.addAction('Action2', {
      conditions: [
        elbv2.ListenerCondition.hostHeaders(['example.com']),
        elbv2.ListenerCondition.sourceIps(['1.1.1.1/32']),
      ],
      priority: 10,
      action: elbv2.ListenerAction.forward([group2]),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
          Type: 'forward',
        },
      ],
      Conditions: [
        {
          Field: 'host-header',
          HostHeaderConfig: {
            Values: [
              'example.com',
            ],
          },
        },
        {
          Field: 'source-ip',
          SourceIpConfig: {
            Values: [
              '1.1.1.1/32',
            ],
          },
        },
      ],
    });
  });

  test('throw error for invalid path pattern for redirect action', () => {
    // GIVEN
    const listener = lb.addListener('Listener', { port: 80 });

    // THEN
    expect(() => {
      listener.addAction('RedirectAction', {
        action: elbv2.ListenerAction.redirect({
          protocol: elbv2.ApplicationProtocol.HTTPS,
          path: 'example',
        }),
      });
    }).toThrow('Redirect path must start with a \'/\', got: example');
  });
});
