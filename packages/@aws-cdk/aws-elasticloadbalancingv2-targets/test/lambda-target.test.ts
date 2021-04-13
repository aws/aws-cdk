import { expect, haveResource, ResourcePart } from '@aws-cdk/assert-internal';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

let stack: Stack;
let listener: elbv2.ApplicationListener;
let fn: lambda.Function;

beforeEach(() => {
  stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
  listener = lb.addListener('Listener', { port: 80 });

  fn = new lambda.Function(stack, 'Fun', {
    code: lambda.Code.fromInline('foo'),
    runtime: lambda.Runtime.PYTHON_3_6,
    handler: 'index.handler',
  });
});

test('Can create target groups with lambda targets', () => {
  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.LambdaTarget(fn)],
  });

  // THEN
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    TargetType: 'lambda',
    Targets: [
      { Id: { 'Fn::GetAtt': ['FunA2CCED21', 'Arn'] } },
    ],
  }));
});

test('Lambda targets create dependency on Invoke permission', () => {
  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.LambdaTarget(fn)],
  });

  // THEN
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', (def: any) => {
    return (def.DependsOn ?? []).includes('FunInvokeServicePrincipalelasticloadbalancingamazonawscomD2CAC0C4');
  }, ResourcePart.CompleteDefinition));
});