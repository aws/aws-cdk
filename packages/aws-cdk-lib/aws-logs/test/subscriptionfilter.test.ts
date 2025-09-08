import { Construct } from 'constructs';
import { Template } from '../../assertions';
import { Stream } from '../../aws-kinesis';
import { KinesisDestination } from '../../aws-logs-destinations';
import { Stack } from '../../core';
import { Distribution, FilterPattern, ILogGroup, ILogSubscriptionDestination, LogGroup, ReplacementStrategy, SubscriptionFilter } from '../lib';

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

  test('subscription filter with CREATE_BEFORE_DELETE replacement strategy uses CloudFormation resource', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: new FakeDestination(),
      filterPattern: FilterPattern.literal('some pattern'),
      replacementStrategy: ReplacementStrategy.CREATE_BEFORE_DELETE,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
      DestinationArn: 'arn:bogus',
      FilterPattern: 'some pattern',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    });

    // Should not have custom resource
    Template.fromStack(stack).resourceCountIs('Custom::AWS', 0);
  });

  test('subscription filter with DELETE_BEFORE_CREATE replacement strategy sets deletion policy', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: new FakeDestination(),
      filterPattern: FilterPattern.literal('some pattern'),
      replacementStrategy: ReplacementStrategy.DELETE_BEFORE_CREATE,
    });

    // THEN
    // Should have CloudFormation resource with deletion policy set
    Template.fromStack(stack).hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: {
        DestinationArn: 'arn:bogus',
        FilterPattern: 'some pattern',
        LogGroupName: { Ref: 'LogGroupF5B46931' },
      },
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
    });
  });

  test('subscription filter defaults to CREATE_BEFORE_DELETE when no replacement strategy specified', () => {
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
    // Should use standard CloudFormation resource (default behavior)
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
      DestinationArn: 'arn:bogus',
      FilterPattern: 'some pattern',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    });

    // Should not have deletion policies set
    const template = Template.fromStack(stack);
    const resources = template.findResources('AWS::Logs::SubscriptionFilter');
    const resourceKeys = Object.keys(resources);
    expect(resourceKeys).toHaveLength(1);
    const resource = resources[resourceKeys[0]];
    expect(resource.UpdateReplacePolicy).toBeUndefined();
    expect(resource.DeletionPolicy).toBeUndefined();
  });

  test('subscription filter with DELETE_BEFORE_CREATE includes all properties with deletion policy', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');
    const stream = new Stream(stack, 'Stream');

    // WHEN
    new SubscriptionFilter(stack, 'Subscription', {
      logGroup,
      destination: new KinesisDestination(stream),
      filterPattern: FilterPattern.literal('some pattern'),
      filterName: 'CustomFilterName',
      distribution: Distribution.RANDOM,
      replacementStrategy: ReplacementStrategy.DELETE_BEFORE_CREATE,
    });

    // THEN
    Template.fromStack(stack).hasResource('AWS::Logs::SubscriptionFilter', {
      Properties: {
        FilterName: 'CustomFilterName',
        FilterPattern: 'some pattern',
        Distribution: 'Random',
        LogGroupName: { Ref: 'LogGroupF5B46931' },
      },
      UpdateReplacePolicy: 'Delete',
      DeletionPolicy: 'Delete',
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
