import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/core';
import { LogGroup, LogPattern, SubscriptionFilter } from '@aws-cdk/logs';
import { Test } from 'nodeunit';
import { Lambda, LambdaInlineCode, LambdaRuntime } from '../lib';

export = {
    'lambda can be used as metric subscription destination'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const lambda = new Lambda(stack, 'MyLambda', {
            code: new LambdaInlineCode('foo'),
            handler: 'index.handler',
            runtime: LambdaRuntime.NodeJS610,
        });
        const logGroup = new LogGroup(stack, 'LogGroup');

        // WHEN
        new SubscriptionFilter(stack, 'Subscription', {
            logGroup,
            destination: lambda,
            logPattern: LogPattern.allEvents()
        });

        // THEN: subscription target is Lambda
        expect(stack).to(haveResource('AWS::Logs::SubscriptionFilter', {
            DestinationArn: { "Fn::GetAtt": [ "MyLambdaCCE802FB", "Arn" ] },
        }));

        // THEN: Lambda has permissions to be invoked by CWL
        expect(stack).to(haveResource('AWS::Lambda::Permission', {
            Action: "lambda:InvokeFunction",
            FunctionName: { Ref: "MyLambdaCCE802FB" },
            Principal: { "Fn::Sub": "logs.${AWS::Region}.amazonaws.com" }
        }));

        test.done();
    }
};