import { expect, haveResource } from '@aws-cdk/assert';
import logs = require('@aws-cdk/aws-logs');
import cdk = require('@aws-cdk/cdk');
import { Test } from 'nodeunit';
import lambda = require('../lib');

export = {
  'lambda can be used as metric subscription destination'(test: Test) {
    // GIVEN
    const stack = new cdk.Stack();
    const fn = new lambda.Function(stack, 'MyLambda', {
      code: new lambda.InlineCode('foo'),
      handler: 'index.handler',
      runtime: lambda.Runtime.NodeJS610,
    });
    const logGroup = new logs.LogGroup(stack, 'LogGroup');

    // WHEN
    new logs.SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: fn,
      filterPattern: logs.FilterPattern.allEvents()
    });

    // THEN: subscription target is Lambda
    expect(stack).to(haveResource('AWS::Logs::SubscriptionFilter', {
      DestinationArn: { "Fn::GetAtt": [ "MyLambdaCCE802FB", "Arn" ] },
    }));

    // THEN: Lambda has permissions to be invoked by CWL
    expect(stack).to(haveResource('AWS::Lambda::Permission', {
      Action: "lambda:InvokeFunction",
      FunctionName: { Ref: "MyLambdaCCE802FB" },
      Principal: { "Fn::Join": ["", ["logs.", {Ref: "AWS::Region"}, ".amazonaws.com"]] }
    }));

    test.done();
  }
};
