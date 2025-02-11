import { Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import { Stack } from '../../core';
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

test('AlbListener target creates a dependency on the NLB target group and ALB listener', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const alb = new elbv2.ApplicationLoadBalancer(stack, 'ALB', { vpc });
  const albListener = alb.addListener('ALBListener', {
    port: 80,
    defaultAction: elbv2.ListenerAction.fixedResponse(200),
  });
  const nlb = new elbv2.NetworkLoadBalancer(stack, 'NLB', { vpc });
  const listener = nlb.addListener('Listener', { port: 80 });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.AlbListenerTarget(albListener)],
    port: 80,
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: 'TCP',
    Targets: [{ Id: { Ref: 'ALBAEE750D2' }, Port: 80 }],
    TargetType: 'alb',
    VpcId: { Ref: 'Stack8A423254' },
  });
  Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    DependsOn: ['ALBALBListenerDB80B4FD'],
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
