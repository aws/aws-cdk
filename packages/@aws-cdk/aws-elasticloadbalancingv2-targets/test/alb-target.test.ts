import { Template } from '@aws-cdk/assertions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('Can create target groups with alb target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
  const listener = nlb.addListener('Listener', { port: 80 });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.AlbTarget(alb, 80)],
    port: 80,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: 'TCP',
    Targets: [
      {
        Id: {
          Ref: 'ALBAEE750D2',
        },
        Port: 80,
      },
    ],
    TargetType: 'alb',
    VpcId: {
      Ref: 'Stack8A423254',
    },
  });
});

test('Can create target groups with alb arn target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
  const listener = nlb.addListener('Listener', { port: 80 });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.AlbArnTarget('MOCK_ARN', 80)],
    port: 80,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: 'TCP',
    Targets: [
      {
        Id: 'MOCK_ARN',
        Port: 80,
      },
    ],
    TargetType: 'alb',
    VpcId: {
      Ref: 'Stack8A423254',
    },
  });
});