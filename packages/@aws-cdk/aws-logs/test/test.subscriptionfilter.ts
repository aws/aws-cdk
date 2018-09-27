import { expect, haveResource } from '@aws-cdk/assert';
import { Stack } from '@aws-cdk/cdk';
import { Test } from 'nodeunit';
import { FilterPattern, ILogSubscriptionDestination, LogGroup, LogGroupRef, SubscriptionFilter } from '../lib';

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

class FakeDestination implements ILogSubscriptionDestination {
  public logSubscriptionDestination(_sourceLogGroup: LogGroupRef) {
    return {
      arn: 'arn:bogus',
    };
  }
}
