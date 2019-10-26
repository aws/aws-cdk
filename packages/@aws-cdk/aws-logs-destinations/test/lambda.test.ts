import '@aws-cdk/assert/jest';
import lambda = require('@aws-cdk/aws-lambda');
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/core');
import dests = require('../lib');

test('lambda can be used as metric subscription destination', () => {
  // GIVEN
  const stack = new cdk.Stack();
  const fn = new lambda.Function(stack, 'MyLambda', {
    code: new lambda.InlineCode('foo'),
    handler: 'index.handler',
    runtime: lambda.Runtime.NODEJS_LATEST,
  });
  const logGroup = new logs.LogGroup(stack, 'LogGroup');

  // WHEN
  new logs.SubscriptionFilter(stack, 'Subscription', {
    logGroup,
    destination: new dests.LambdaDestination(fn),
    filterPattern: logs.FilterPattern.allEvents()
  });

  // THEN: subscription target is Lambda
  expect(stack).toHaveResource('AWS::Logs::SubscriptionFilter', {
    DestinationArn: { "Fn::GetAtt": [ "MyLambdaCCE802FB", "Arn" ] },
  });

  // THEN: Lambda has permissions to be invoked by CWL
  expect(stack).toHaveResource('AWS::Lambda::Permission', {
    Action: "lambda:InvokeFunction",
    FunctionName: {
      "Fn::GetAtt": [
        "MyLambdaCCE802FB",
        "Arn"
      ]
    },
    Principal: "logs.amazonaws.com",
  });
});
