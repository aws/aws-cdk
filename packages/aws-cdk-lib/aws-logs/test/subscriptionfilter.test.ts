import type { Construct } from 'constructs';
import { Template } from '../../assertions';
import { Stream } from '../../aws-kinesis';
import { KinesisDestination } from '../../aws-logs-destinations';
import { CfnParameter, Lazy, Stack } from '../../core';
import type { ILogGroup, ILogSubscriptionDestination } from '../lib';
import { Distribution, FilterPattern, LogGroup, SubscriptionFilter, SystemField } from '../lib';

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

  describe('system fields', () => {
    function newFilter(stack: Stack, props: Partial<ConstructorParameters<typeof SubscriptionFilter>[2]> = {}) {
      const logGroup = new LogGroup(stack, 'LogGroup');
      return new SubscriptionFilter(stack, 'Subscription', {
        logGroup,
        destination: new FakeDestination(),
        filterPattern: FilterPattern.allEvents(),
        ...props,
      });
    }

    test('renders fieldSelectionCriteria and emitSystemFields', () => {
      const stack = new Stack();
      newFilter(stack, {
        fieldSelectionCriteria: '@aws.region = "us-east-1"',
        emitSystemFields: [SystemField.AWS_ACCOUNT, SystemField.AWS_REGION, SystemField.SOURCE_LOG],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
        FieldSelectionCriteria: '@aws.region = "us-east-1"',
        EmitSystemFields: ['@aws.account', '@aws.region', '@source.log'],
      });
    });

    test('omits the properties when not set', () => {
      const stack = new Stack();
      newFilter(stack);

      const filters = Template.fromStack(stack).findResources('AWS::Logs::SubscriptionFilter');
      const properties = Object.values(filters)[0].Properties;
      expect(properties).not.toHaveProperty('FieldSelectionCriteria');
      expect(properties).not.toHaveProperty('EmitSystemFields');
    });

    test('works through LogGroup.addSubscriptionFilter()', () => {
      const stack = new Stack();
      const logGroup = new LogGroup(stack, 'LogGroup');
      logGroup.addSubscriptionFilter('Subscription', {
        destination: new FakeDestination(),
        filterPattern: FilterPattern.allEvents(),
        fieldSelectionCriteria: '@aws.region = "us-east-1"',
        emitSystemFields: [SystemField.SOURCE_LOG],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
        FieldSelectionCriteria: '@aws.region = "us-east-1"',
        EmitSystemFields: ['@source.log'],
      });
    });

    test('fails for fieldSelectionCriteria longer than 2000 characters', () => {
      const stack = new Stack();
      expect(() => newFilter(stack, { fieldSelectionCriteria: 'a'.repeat(2001) }))
        .toThrow('fieldSelectionCriteria must be at most 2000 characters long, got 2001');
    });

    test('skips validation for a token fieldSelectionCriteria', () => {
      const stack = new Stack();
      const region = new CfnParameter(stack, 'Region');
      newFilter(stack, { fieldSelectionCriteria: `${' '.repeat(2001)}@aws.region = "${region.valueAsString}"` });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
        FieldSelectionCriteria: { 'Fn::Join': ['', [`${' '.repeat(2001)}@aws.region = "`, { Ref: 'Region' }, '"']] },
      });
    });

    test('skips validation for a token emitSystemFields list', () => {
      const stack = new Stack();
      const fields = new CfnParameter(stack, 'Fields', { type: 'CommaDelimitedList' });
      newFilter(stack, { emitSystemFields: fields.valueAsList as SystemField[] });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
        EmitSystemFields: { Ref: 'Fields' },
      });
    });

    test('skips validation for token elements in emitSystemFields', () => {
      const stack = new Stack();
      const field = Lazy.string({ produce: () => '@source.log' }) as SystemField;
      newFilter(stack, { emitSystemFields: [field, field] });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::SubscriptionFilter', {
        EmitSystemFields: ['@source.log', '@source.log'],
      });
    });

    test('fails for duplicate emitSystemFields', () => {
      const stack = new Stack();
      expect(() => newFilter(stack, { emitSystemFields: [SystemField.SOURCE_LOG, SystemField.SOURCE_LOG] }))
        .toThrow('emitSystemFields contains "@source.log" more than once');
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
