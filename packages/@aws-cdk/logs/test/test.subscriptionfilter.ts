import { expect, haveResource } from '@aws-cdk/assert';
import { Arn, Stack } from '@aws-cdk/core';
import { Test } from 'nodeunit';
import { FilterPattern, ISubscriptionDestination, LogGroup, SubscriptionFilter } from '../lib';

export = {
    'trivial instantiation'(test: Test) {
        // GIVEN
        const stack = new Stack();
        const logGroup = new LogGroup(stack, 'LogGroup');

        // WHEN
        new SubscriptionFilter(stack, 'Subscription', {
            logGroup,
            destination: new FakeDestination(),
            filterPattern: FilterPattern.literal("some pattern")
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
    public subscriptionDestination(_sourceLogGroup: LogGroup) {
        return {
            arn: new Arn('arn:bogus'),
        };
    }
}