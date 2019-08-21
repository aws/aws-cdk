import { countResources, expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/core');
import targets = require('../../lib');

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
  const lambdaId = "MyLambdaCCE802FB";

  expect(stack).to(haveResource('AWS::Lambda::Permission', {
    Action: "lambda:InvokeFunction",
    FunctionName: {
      "Fn::GetAtt": [
        lambdaId,
        "Arn"
      ]
    },
    Principal: "events.amazonaws.com",
    SourceArn: { "Fn::GetAtt": ["Rule4C995B7F", "Arn"] }
  }));

  expect(stack).to(haveResource('AWS::Lambda::Permission', {
    Action: "lambda:InvokeFunction",
    FunctionName: {
      "Fn::GetAtt": [
        lambdaId,
        "Arn"
      ]
    },
    Principal: "events.amazonaws.com",
    SourceArn: { "Fn::GetAtt": ["Rule270732244", "Arn"] }
  }));

  expect(stack).to(countResources('AWS::Events::Rule', 2));
  expect(stack).to(haveResource('AWS::Events::Rule', {
    Targets: [
      {
        Arn: { "Fn::GetAtt": [lambdaId, "Arn"] },
        Id: "Target0"
      }
    ]
  }));
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
    event: events.RuleTargetInput.fromObject({ key: 'value1' })
  }));
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value2' })
  }));

  // THEN
  expect(stack).to(countResources('AWS::Lambda::Permission', 1));
});

test('adding same singleton lambda function as target mutiple times creates permission only once', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fn = new lambda.SingletonFunction(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.PYTHON_2_7,
    uuid: 'uuid'
  });
  const rule = new events.Rule(stack, 'Rule', {
    schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
  });

  // WHEN
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value1' })
  }));
  rule.addTarget(new targets.LambdaFunction(fn, {
    event: events.RuleTargetInput.fromObject({ key: 'value2' })
  }));

  // THEN
  expect(stack).to(countResources('AWS::Lambda::Permission', 1));
});

function newTestLambda(scope: cdk.Construct) {
  return new lambda.Function(scope, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.PYTHON_2_7
  });
}
