import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';
import * as elbv2 from '../../lib';

let stack: cdk.Stack;
let group1: elbv2.NetworkTargetGroup;
let group2: elbv2.NetworkTargetGroup;
let lb: elbv2.NetworkLoadBalancer;

beforeEach(() => {
  stack = new cdk.Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  group1 = new elbv2.NetworkTargetGroup(stack, 'TargetGroup1', { vpc, port: 80 });
  group2 = new elbv2.NetworkTargetGroup(stack, 'TargetGroup2', { vpc, port: 80 });
  lb = new elbv2.NetworkLoadBalancer(stack, 'LB', { vpc });
});

describe('tests', () => {
  test('Forward to multiple targetgroups with an Action and stickiness', () => {
    // WHEN
    lb.addListener('Listener', {
      port: 80,
      defaultAction: elbv2.NetworkListenerAction.forward([group1, group2], {
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
      defaultAction: elbv2.NetworkListenerAction.weightedForward([
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
});
