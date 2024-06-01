import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { Stream } from '../../aws-kinesis';
import { KinesisDestination } from '../../aws-logs-destinations';
import { Stack } from '../../core';
import { Distribution, FilterPattern, ILogGroup, ILogSubscriptionDestination, LogGroup, SubscriptionFilter } from '../lib';

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

  test('specifying custom name', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: new FakeDestination(),
      filterPattern: FilterPattern.literal('some pattern'),
      filterName: 'CustomSubscriptionFilterName',
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
      DestinationArn: 'arn:bogus',
      FilterPattern: 'some pattern',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
      FilterName: 'CustomSubscriptionFilterName',
    });
  });

  test('subscription filter with KinesisDestination can have distribution set.', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    const stream = new Stream(stack, 'Stream');

    // WHEN
    new SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: new KinesisDestination(stream),
      filterPattern: FilterPattern.literal('some pattern'),
      filterName: 'CustomSubscriptionFilterName',
      distribution: Distribution.RANDOM,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
      Distribution: 'Random',
    });
  });

  test('subscription filter with non-KinesisDestination can not have distribution set.', () => {
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    expect(() => {
      new SubscriptionFilter(stack, 'Subscription', {
        logGroup,
        destination: new FakeDestination(),
        filterPattern: FilterPattern.literal('some pattern'),
        filterName: 'CustomSubscriptionFilterName',
        distribution: Distribution.RANDOM,
      });
    }).toThrow('distribution property can only be used with KinesisDestination.');
  });
});

class FakeDestination implements ILogSubscriptionDestination {
  public bind(_scope: Construct, _sourceLogGroup: ILogGroup) {
    return {
      arn: 'arn:bogus',
    };
  }
}
