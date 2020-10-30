import '@aws-cdk/assert/jest';
import * as events from '@aws-cdk/aws-events';
import * as lambda from '@aws-cdk/aws-lambda';
import * as cdk from '@aws-cdk/core';
import * as constructs from 'constructs';
import * as targets from '../../lib';

test('use lambda as an event rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fn = newTestLambda(stack);
  const rule1 = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });
  const rule2 = new events.Rule(stack, 'Rule2', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(5)),
  });

  // WHEN
  rule1.addTarget(new targets.LambdaFunction(fn));
  rule2.addTarget(new targets.LambdaFunction(fn));

  // THEN
  const lambdaId = 'MyLambdaCCE802FB';

  expect(stack).toHaveResource('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: {
      'Fn::GetAtt': [
        lambdaId,
        'Arn',
      ],
    },
    Principal: 'events.amazonaws.com',
    SourceArn: { 'Fn::GetAtt': ['Rule4C995B7F', 'Arn'] },
  });

  expect(stack).toHaveResource('AWS::Lambda::Permission', {
    Action: 'lambda:InvokeFunction',
    FunctionName: {
      'Fn::GetAtt': [
        lambdaId,
        'Arn',
      ],
    },
    Principal: 'events.amazonaws.com',
    SourceArn: { 'Fn::GetAtt': ['Rule270732244', 'Arn'] },
  });

  expect(stack).toCountResources('AWS::Events::Rule', 2);
  expect(stack).toHaveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { 'Fn::GetAtt': [lambdaId, 'Arn'] },
        Id: 'Target0',
      },
    ],
  });
});

test('adding same lambda function as target mutiple times creates permission only once', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fn = newTestLambda(stack);
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value1' }),
  }));
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value2' }),
  }));

  // THEN
  expect(stack).toCountResources('AWS::Lambda::Permission', 1);
});

test('adding same singleton lambda function as target mutiple times creates permission only once', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fn = new lambda.SingletonFunction(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.PYTHON_2_7,
    uuid: 'uuid',
  });
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value1' }),
  }));
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value2' }),
  }));

  // THEN
  expect(stack).toCountResources('AWS::Lambda::Permission', 1);
});

test('lambda handler and cloudwatch event across stacks', () => {
  // GIVEN
  const app = new cdk.App();
  const lambdaStack = new cdk.Stack(app, 'LambdaStack');

  const fn = new lambda.Function(lambdaStack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.PYTHON_2_7,
  });

  const eventStack = new cdk.Stack(app, 'EventStack');
  new events.Rule(eventStack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
    targets: [new targets.LambdaFunction(fn)],
  });

  expect(() => app.synth()).not.toThrow();

  // the Permission resource should be in the event stack
  expect(eventStack).toCountResources('AWS::Lambda::Permission', 1);
});

function newTestLambda(scope: constructs.Construct) {
  return new lambda.Function(scope, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.PYTHON_2_7,
  });
}
