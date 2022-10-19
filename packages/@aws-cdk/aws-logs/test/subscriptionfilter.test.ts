import { Template } from '@aws-cdk/assertions';
import { Stack } from '@aws-cdk/core';
import { Construct } from 'constructs';
import { FilterPattern, ILogGroup, ILogSubscriptionDestination, LogGroup, SubscriptionFilter } from '../lib';

describe('subscription filter', () => {
  test('trivial instantiation', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: new FakeDestination(),
      filterPattern: FilterPattern.literal('some pattern'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
      DestinationArn: 'arn:bogus',
      FilterPattern: 'some pattern',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    });
  });
});

class FakeDestination implements ILogSubscriptionDestination {
  public bind(_scope: Construct, _sourceLogGroup: ILogGroup) {
    return {
      arn: 'arn:bogus',
    };
  }
}
