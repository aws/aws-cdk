import { Template } from '../../assertions';
import { Metric, Unit } from '../../aws-cloudwatch';
import { CfnParameter, Lazy, Stack } from '../../core';
import { FilterPattern, LogGroup, MetricFilter, SystemField } from '../lib';

describe('metric filter', () => {
  test('trivial instantiation', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      filterName: 'FooBazBar',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
      FilterName: 'FooBazBar',
    });
  });

  test('with dimensions', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
      dimensions: {
        Foo: 'Bar',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
        Dimensions: [
          {
            Key: 'Foo',
            Value: 'Bar',
          },
        ],
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    });
  });

  test('should throw with more than 3 dimensions', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    expect(() => new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
      dimensions: {
        Foo: 'Bar',
        Bar: 'Baz',
        Baz: 'Qux',
        Qux: 'Quux',
      },
    })).toThrow(/MetricFilter only supports a maximum of 3 dimensions but received/);
  });

  test('metric filter exposes metric', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    const mf = new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
    });

    const metric = mf.metric();

    // THEN
    expect(metric).toEqual(new Metric({
      metricName: 'Latency',
      namespace: 'AWS/Test',
      statistic: 'avg',
    }));
  });

  test('metric filter exposes metric with custom statistic', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    const mf = new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
    });

    const metric = mf.metric({ statistic: 'maximum' });

    // THEN
    expect(metric).toEqual(new Metric({
      metricName: 'Latency',
      namespace: 'AWS/Test',
      statistic: 'maximum',
    }));
  });

  test('with unit', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
      dimensions: {
        Foo: 'Bar',
      },
      unit: Unit.MILLISECONDS,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
        Dimensions: [
          {
            Key: 'Foo',
            Value: 'Bar',
          },
        ],
        Unit: 'Milliseconds',
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    });
  });

  test('with no unit', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
      dimensions: {
        Foo: 'Bar',
      },
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
        Dimensions: [
          {
            Key: 'Foo',
            Value: 'Bar',
          },
        ],
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
    });
  });

  test('without apply to transformed logs', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      filterName: 'FooBazBar',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
      FilterName: 'FooBazBar',
    });
  });

  test('with apply to transformed logs', () => {
    // GIVEN
    const stack = new Stack();
    const logGroup = new LogGroup(stack, 'LogGroup');

    // WHEN
    new MetricFilter(stack, 'Subscription', {
      logGroup,
      metricNamespace: 'AWS/Test',
      metricName: 'Latency',
      filterName: 'FooBazBar',
      metricValue: '$.latency',
      filterPattern: FilterPattern.exists('$.latency'),
      applyOnTransformedLogs: true,
    });

    // THEN
    Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
      MetricTransformations: [{
        MetricNamespace: 'AWS/Test',
        MetricName: 'Latency',
        MetricValue: '$.latency',
      }],
      FilterPattern: '{ $.latency = "*" }',
      LogGroupName: { Ref: 'LogGroupF5B46931' },
      FilterName: 'FooBazBar',
      ApplyOnTransformedLogs: true,
    });
  });

  describe('system fields', () => {
    function newFilter(stack: Stack, props: Partial<ConstructorParameters<typeof MetricFilter>[2]> = {}) {
      const logGroup = new LogGroup(stack, 'LogGroup');
      return new MetricFilter(stack, 'Filter', {
        logGroup,
        metricNamespace: 'Central',
        metricName: 'Errors',
        filterPattern: FilterPattern.literal('ERROR'),
        ...props,
      });
    }

    test('renders fieldSelectionCriteria and emitSystemFieldDimensions', () => {
      const stack = new Stack();
      newFilter(stack, {
        fieldSelectionCriteria: '@aws.region = "us-east-1"',
        emitSystemFieldDimensions: [SystemField.AWS_ACCOUNT, SystemField.AWS_REGION],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        FieldSelectionCriteria: '@aws.region = "us-east-1"',
        EmitSystemFieldDimensions: ['@aws.account', '@aws.region'],
      });
    });

    test('omits the properties when not set', () => {
      const stack = new Stack();
      newFilter(stack);

      const filters = Template.fromStack(stack).findResources('AWS::Logs::MetricFilter');
      const properties = Object.values(filters)[0].Properties;
      expect(properties).not.toHaveProperty('FieldSelectionCriteria');
      expect(properties).not.toHaveProperty('EmitSystemFieldDimensions');
    });

    test('works through LogGroup.addMetricFilter()', () => {
      const stack = new Stack();
      const logGroup = new LogGroup(stack, 'LogGroup');
      logGroup.addMetricFilter('Filter', {
        metricNamespace: 'Central',
        metricName: 'Errors',
        filterPattern: FilterPattern.literal('ERROR'),
        fieldSelectionCriteria: '@aws.region = "us-east-1"',
        emitSystemFieldDimensions: [SystemField.AWS_ACCOUNT],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        FieldSelectionCriteria: '@aws.region = "us-east-1"',
        EmitSystemFieldDimensions: ['@aws.account'],
      });
    });

    test.each([0, 2000])('accepts fieldSelectionCriteria of %d characters', (length) => {
      const stack = new Stack();
      newFilter(stack, { fieldSelectionCriteria: 'a'.repeat(length) });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        FieldSelectionCriteria: 'a'.repeat(length),
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

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        FieldSelectionCriteria: { 'Fn::Join': ['', [`${' '.repeat(2001)}@aws.region = "`, { Ref: 'Region' }, '"']] },
      });
    });

    test('skips validation for a token emitSystemFieldDimensions list', () => {
      const stack = new Stack();
      const fields = new CfnParameter(stack, 'Fields', { type: 'CommaDelimitedList' });
      newFilter(stack, {
        dimensions: { Foo: '$.foo', Bar: '$.bar', Baz: '$.baz' },
        emitSystemFieldDimensions: fields.valueAsList as SystemField[],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        EmitSystemFieldDimensions: { Ref: 'Fields' },
      });
    });

    test('skips validation for token elements in emitSystemFieldDimensions', () => {
      const stack = new Stack();
      const field = Lazy.string({ produce: () => '@aws.region' }) as SystemField;
      newFilter(stack, { emitSystemFieldDimensions: [SystemField.AWS_ACCOUNT, field, field] });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        EmitSystemFieldDimensions: ['@aws.account', '@aws.region', '@aws.region'],
      });
    });

    test('fails for SOURCE_LOG in emitSystemFieldDimensions', () => {
      const stack = new Stack();
      expect(() => newFilter(stack, { emitSystemFieldDimensions: [SystemField.SOURCE_LOG] }))
        .toThrow('emitSystemFieldDimensions does not support "@source.log", use one of: @aws.account, @aws.region');
    });

    test('fails for duplicate emitSystemFieldDimensions', () => {
      const stack = new Stack();
      expect(() => newFilter(stack, { emitSystemFieldDimensions: [SystemField.AWS_REGION, SystemField.AWS_REGION] }))
        .toThrow('emitSystemFieldDimensions contains "@aws.region" more than once');
    });

    test('counts system field dimensions toward the dimension limit', () => {
      const stack = new Stack();
      expect(() => newFilter(stack, {
        dimensions: { Foo: '$.foo', Bar: '$.bar' },
        emitSystemFieldDimensions: [SystemField.AWS_ACCOUNT, SystemField.AWS_REGION],
      })).toThrow('MetricFilter only supports a maximum of 3 dimensions but received 4 (2 dimensions and 2 system field dimensions).');
    });

    test('allows 3 dimensions in total', () => {
      const stack = new Stack();
      newFilter(stack, {
        dimensions: { Foo: '$.foo', Bar: '$.bar' },
        emitSystemFieldDimensions: [SystemField.AWS_ACCOUNT],
      });

      Template.fromStack(stack).hasResourceProperties('AWS::Logs::MetricFilter', {
        MetricTransformations: [{
          Dimensions: [{ Key: 'Foo', Value: '$.foo' }, { Key: 'Bar', Value: '$.bar' }],
        }],
        EmitSystemFieldDimensions: ['@aws.account'],
      });
    });
  });
});
