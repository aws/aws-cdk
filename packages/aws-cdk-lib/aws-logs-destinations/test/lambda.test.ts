import { Template } from '../../assertions';
import * as lambda from '../../aws-lambda';
import * as logs from '../../aws-logs';
import * as cdk from '../../core';
import * as dests from '../lib';

let stack: cdk.Stack;
let fn: lambda.Function;
let logGroup: logs.LogGroup;

beforeEach(() => {
  // GIVEN
  stack = new cdk.Stack();
  fn = new lambda.Function(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_LATEST,
  });
  logGroup = new logs.LogGroup(stack, 'LogGroup');
});

test('lambda can be used as metric subscription destination', () => {
  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.LambdaDestination(fn),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is Lambda
  Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
  });

  // THEN: Lambda has permissions to be invoked by CWL
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
    Principal: 'logs.amazonaws.com',
  });
});

test('can have multiple subscriptions use the same Lambda', () => {
  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.LambdaDestination(fn),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  new logs.SubscriptionFilter(stack, 'Subscription2', {
    logGroup: new logs.LogGroup(stack, 'LG2'),
    destination: new dests.LambdaDestination(fn),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: Lambda has permissions to be invoked by CWL from both Source Arns
  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
    SourceArn: { 'Fn::GetAtt': ['LogGroupF5B46931', 'Arn'] },
    Principal: 'logs.amazonaws.com',
  });

  Template.fromStack(stack).hasResourceProperties('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
    SourceArn: { 'Fn::GetAtt': ['LG224A94C8F', 'Arn'] },
    Principal: 'logs.amazonaws.com',
  });
});

test('lambda permissions are not added when addPermissions is false', () => {
  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.LambdaDestination(fn, { addPermissions: false }),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: subscription target is Lambda
  Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
  });

  // THEN: Lambda does not have permissions to be invoked by CWL
  expect(Template.fromStack(stack).findResources('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: { 'Fn::GetAtt': ['MyLambdaCCE802FB', 'Arn'] },
    Principal: 'logs.amazonaws.com',
  })).toEqual({});
});

test('subscription depends on lambda\'s permission', () => {
  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.LambdaDestination(fn),
    filterPattern: logs.FilterPattern.allEvents(),
  });

  // THEN: Subscription filter depends on Lambda's Permission
  Template.fromStack(stack).hasResource('AWS::Logs::SubscriptionFilter', {
    DependsOn: ['SubscriptionCanInvokeLambdaD31DEAD2'],
  });
});
