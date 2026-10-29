import { Match, Template } from '../../assertions';
import * as ec2 from '../../aws-ec2';
import * as elbv2 from '../../aws-elasticloadbalancingv2';
import * as lambda from '../../aws-lambda';
import { Stack } from '../../core';
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
    runtime: lambda.Runtime.PYTHON_3_9,
    handler: 'index.handler',
  });
});

test('Can create target groups with lambda targets', () => {
  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.LambdaTarget(fn)],
  });

  // THEN
  Template.fromStack(stack).hasResourceProperties('AWS::ElasticLoadBalancingV2::TargetGroup', {
    TargetType: 'lambda',
    Targets: [
      { Id: { 'Fn::GetAtt': ['FunA2CCED21', 'Arn'] } },
    ],
  });
});

test('Lambda targets create dependency on Invoke permission', () => {
  // WHEN
  listener.addTargets('Targets', {
    targets: [new targets.LambdaTarget(fn)],
  });

  // THEN
  Template.fromStack(stack).hasResource('AWS::ElasticLoadBalancingV2::TargetGroup', (def: any) => {
    return (def.DependsOn ?? []).includes('FunInvokeServicePrincipalelasticloadbalancingamazonawscomD2CAC0C4');
  });
});

describe.each([
  ['application', (scope: Stack, target: targets.LambdaTarget) => new elbv2.ApplicationTargetGroup(scope, 'TargetGroup', { targets: [target] })],
  ['network', (scope: Stack, target: targets.LambdaTarget) => new elbv2.NetworkTargetGroup(scope, 'TargetGroup', { port: 80, targets: [target] })],
])('%s target group', (_kind, createTargetGroup) => {
  test('depends on the invoke permission of a function in the same stack', () => {
    // GIVEN
    const fnStack = new Stack();
    const handler = new lambda.Function(fnStack, 'Fun', {
      code: lambda.Code.fromInline('foo'),
      runtime: lambda.Runtime.PYTHON_3_9,
      handler: 'index.handler',
    });

    // WHEN
    createTargetGroup(fnStack, new targets.LambdaTarget(handler));

    // THEN
    const template = Template.fromStack(fnStack);
    const permission = Object.keys(template.findResources('AWS::Lambda::Permission'))[0];
    template.hasResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Properties: { Targets: [{ Id: { 'Fn::GetAtt': ['FunA2CCED21', 'Arn'] } }] },
      DependsOn: [permission],
    });
  });

  test('depends on the invoke permission of an imported alias in the same account', () => {
    // GIVEN
    const importStack = new Stack(undefined, 'ImportStack', { env: { account: '123456789012', region: 'us-east-1' } });
    const version = lambda.Version.fromVersionArn(importStack, 'Version', 'arn:aws:lambda:us-east-1:123456789012:function:MyFn:1');
    const alias = lambda.Alias.fromAliasAttributes(importStack, 'Alias', { aliasName: 'live', aliasVersion: version });

    // WHEN
    createTargetGroup(importStack, new targets.LambdaTarget(alias));

    // THEN
    const template = Template.fromStack(importStack);
    template.hasResourceProperties('AWS::Lambda::Permission', {
      FunctionName: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn:live',
      Principal: 'elasticloadbalancing.amazonaws.com',
    });
    const permission = Object.keys(template.findResources('AWS::Lambda::Permission'))[0];
    template.hasResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Properties: { Targets: [{ Id: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn:live' }] },
      DependsOn: [permission],
    });
  });

  test('accepts an imported function whose permissions are managed elsewhere', () => {
    // GIVEN
    const importStack = new Stack();
    const imported = lambda.Function.fromFunctionAttributes(importStack, 'Function', {
      functionArn: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn:live',
      skipPermissions: true,
    });

    // WHEN
    createTargetGroup(importStack, new targets.LambdaTarget(imported));

    // THEN
    const template = Template.fromStack(importStack);
    template.resourceCountIs('AWS::Lambda::Permission', 0);
    template.hasResource('AWS::ElasticLoadBalancingV2::TargetGroup', {
      Properties: { Targets: [{ Id: 'arn:aws:lambda:us-east-1:123456789012:function:MyFn:live' }] },
      DependsOn: Match.absent(),
    });
  });
});
