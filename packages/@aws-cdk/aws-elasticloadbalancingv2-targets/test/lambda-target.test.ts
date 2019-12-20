import { expect, haveResource } from '@aws-cdk/assert';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as lambda from '@aws-cdk/aws-lambda';
import { Stack } from '@aws-cdk/core';
import * as targets from '../lib';

test('Can create target groups with lambda targets', () => {
  // GIVEN
  const stack = new Stack();
  const vpc = new ec2.Vpc(stack, 'Stack');
  const lb = new elbv2.ApplicationLoadBalancer(stack, 'LB', { vpc });
  const listener = lb.addListener('Listener', { port: 80 });

  const fn = new lambda.Function(stack, 'Fun', {
    code: lambda.Code.inline('foo'),
    runtime: lambda.Runtime.PYTHON_3_6,
    handler: 'index.handler',
  });

  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.LambdaTarget(fn)]
  });

  // THEN
  expect(stack).to(haveResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
    TargetType: "lambda",
    Targets: [
      { Id: { "Fn::GetAtt": [ "FunA2CCED21", "Arn" ] } }
    ]
  }));
});
