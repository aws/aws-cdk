import { Template } from '@aws-cdk/assertions';
import { Metric, Unit } from '@aws-cdk/aws-cloudwatch';
import { Stack } from '@aws-cdk/core';
import { FilterPattern, LogGroup, MetricFilter } from '../lib';

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
    })).toThrow(/MetricFilter only supports a maximum of 3 Dimensions/);
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
});
