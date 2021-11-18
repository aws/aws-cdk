import { expect, haveResource } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('Can create target groups with instance id target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
  const listener = lb.addListener('Listener', { port: 80 });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.InstanceIdTarget('i-1234')],
    port: 80,
  });

  // THEN
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: 'HTTP',
    Targets: [
      { Id: 'i-1234' },
    ],
    TargetType: 'instance',
  }));
});

test('Can create target groups with instance target', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
  const listener = lb.addListener('Listener', { port: 80 });

  const instance = new ec2.Instance(stack, 'Instance', {
    vpc,
    machineImage: new ec2.AmazonLinuxImage(),
    instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
  });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.InstanceTarget(instance)],
    port: 80,
  });

  // THEN
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    Port: 80,
    Protocol: 'HTTP',
    Targets: [
      { Id: { Ref: 'InstanceC1063A87' } },
    ],
    TargetType: 'instance',
  }));
});
