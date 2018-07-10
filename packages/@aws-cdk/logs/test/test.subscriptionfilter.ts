import { expect, haveResource } from '@aws-cdk/assert';
import { Arn, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { ISubscriptionDestination, LogGroup, LogPattern, SubscriptionDestinationProps, SubscriptionFilter } from '../lib';

export = {
    'trivial instantiation'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const logGroup = new LogGroup(stack, 'LogGroup');

        // WHEN
        new SubscriptionFilter(stack, 'Subscription', {
            logGroup,
            destination: new FakeDestination(),
            logPattern: LogPattern.literal("some pattern")
        });

        // THEN
        expect(stack).to(haveResource('AWS::Logs::SubscriptionFilter', {
            DestinationArn: "arn:bogus",
            FilterPattern: "some pattern",
            LogGroupName: { Ref: "LogGroupF5B46931" }
        }));

        test.done();
    },
};

class FakeDestination implements ISubscriptionDestination {
    public readonly subscriptionDestinationProps: SubscriptionDestinationProps = {
        arn: new Arn('arn:bogus'),
    };
}