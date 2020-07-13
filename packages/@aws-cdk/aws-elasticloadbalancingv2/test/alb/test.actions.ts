import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import { Test } from 'nodeunit';
import * as elbv2 from '../../lib';

let stack: cdk.Stack;
let group1: elbv2.ApplicationTargetGroup;
let group2: elbv2.ApplicationTargetGroup;
let lb: elbv2.ApplicationLoadBalancer;

export = {
  'setUp'(cb: () => void) {
    stack = new cdk.Stack();
    const vpc = new ec2.Vpc(stack, 'Stack');
    group1 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
    group2 = new elbv2.ApplicationTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
    lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });

    cb();
  },

  'Forward action legacy rendering'(test: Test) {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.forward([group1]),
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup1E5480F51' },
          Type: 'forward',
        },
      ],
    }));

    test.done();
  },

  'Forward to multiple targetgroups with an Action and stickiness'(test: Test) {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.forward([group1, group2], {
        stickinessDuration: cdk.Duration.hours(1),
      }),
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
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
    }));

    test.done();
  },

  'Weighted forward to multiple targetgroups with an Action'(test: Test) {
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
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
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
    }));
    test.done();
  },

  'Chaining OIDC authentication action'(test: Test) {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.ListenerAction.authenticateOidc({
        authorizationEndpoint: 'A',
        clientId: 'B',
        clientSecret: cdk.SecretValue.plainText('C'),
        issuer: 'D',
        tokenEndpoint: 'E',
        userInfoEndpoint: 'F',
        next: elbv2.ListenerAction.forward([group1]),
      }),
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener', {
      DefaultActions: [
        {
          AuthenticateOidcConfig: {
            AuthorizationEndpoint: 'A',
            ClientId: 'B',
            ClientSecret: 'C',
            Issuer: 'D',
            TokenEndpoint: 'E',
            UserInfoEndpoint: 'F',
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
    }));

    test.done();
  },

  'Add default Action and add Action with conditions'(test: Test) {
    // GIVEN
    const listener = lb.addListener('Listener', { port: 80 });

    // WHEN
    listener.addAction('Action1', {
      action: elbv2.ListenerAction.forward([group1]),
    });

    listener.addAction('Action2', {
      hostHeader: 'example.com',
      priority: 10,
      action: elbv2.ListenerAction.forward([group2]),
    });

    // THEN
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
      Actions: [
        {
          TargetGroupArn: { Ref: 'TargetGroup2D571E5D7' },
          Type: 'forward',
        },
      ],
    }));

    test.done();
  },

  'Add Action with multiple Conditions'(test: Test) {
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
    expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::ListenerRule', {
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
    }));

    test.done();
  },
};