import { countResources, expect, haveResource } from '@aws-cdk/assert';
import events = require('@aws-cdk/aws-events');
import lambda = require('@aws-cdk/aws-lambda');
import cdk = require('@aws-cdk/cdk');
import targets = require('../../lib');

test('use lambda as an event rule target', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fn = newTestLambda(stack);
  const rule1 = new events.EventRule(stack, 'Rule', { scheduleExpression: 'rate(1 minute)' });
  const rule2 = new events.EventRule(stack, 'Rule2', { scheduleExpression: 'rate(5 minutes)' });

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
        Id: "MyLambda"
      }
    ]
  }));
});

function newTestLambda(scope: cdk.Construct) {
  return new lambda.Function(scope, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'bar',
    runtime: lambda.Runtime.Python27
  });
}
